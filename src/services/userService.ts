import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { UserProfile, UserRole } from "@/types/auth";

const USERS_COLLECTION = "users";

export const userService = {
  /**
   * Retrieves a user profile by UID
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
      if (!userDoc.exists()) {
        return null;
      }
      return userDoc.data() as UserProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  /**
   * Upsert an intern profile mapped from MagangHub / SIAPkerja data
   */
  async createOrUpdateInternProfile(
    uid: string,
    data: {
      email: string;
      displayName: string;
      role?: UserRole;
      studentId?: string; // NIM
      identityNumber?: string; // NIK
      institution?: string; // Campus / Vocational School
      magangHubId?: string;
      division?: string;
    }
  ): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const existing = await getDoc(userRef);

    if (!existing.exists()) {
      const newProfile: UserProfile = {
        uid,
        email: data.email,
        displayName: data.displayName,
        role: data.role || "intern",
        studentId: data.studentId || "",
        identityNumber: data.identityNumber || "",
        institution: data.institution || "",
        magangHubId: data.magangHubId || "",
        division: data.division || "Umum",
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, newProfile);
    } else {
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    }
  },
};
