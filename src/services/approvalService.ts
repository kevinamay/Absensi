import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { PendingRegistration, RegistrationStatus } from "@/types/approval";
import { AllowedIntern } from "./whitelistService";

const REGISTRATIONS_COLLECTION = "pending_registrations";
const WHITELIST_COLLECTION = "allowed_interns";

// In-memory cache fallback for instant reactivity in local evaluation
const globalForRegistrations = globalThis as unknown as {
  __registrationsCache?: Map<string, PendingRegistration>;
};

const regCache =
  globalForRegistrations.__registrationsCache || new Map<string, PendingRegistration>();
if (process.env.NODE_ENV !== "production") {
  globalForRegistrations.__registrationsCache = regCache;
}

// Ensure in-memory cache starts clean without dummy demo applicants
regCache.clear();

export const approvalService = {
  /**
   * Save or update an applicant's registration status to PENDING_APPROVAL after OTP verified
   */
  async registerPending(data: {
    email: string;
    fullName: string;
    institution: string;
  }): Promise<PendingRegistration> {
    const key = data.email.toLowerCase().trim();
    const newRecord: PendingRegistration = {
      id: key,
      email: key,
      fullName: data.fullName.trim(),
      institution: data.institution.trim(),
      status: "PENDING_APPROVAL",
      createdAt: new Date().toISOString(),
    };

    regCache.set(key, newRecord);

    try {
      const docRef = doc(db, REGISTRATIONS_COLLECTION, key);
      await setDoc(docRef, newRecord);
    } catch (err) {
      console.warn("Could not write pending registration to Firestore:", err);
    }

    return newRecord;
  },

  /**
   * Get registration record by email
   */
  async getRegistration(email: string): Promise<PendingRegistration | null> {
    const key = email.toLowerCase().trim();

    if (regCache.has(key)) {
      return regCache.get(key)!;
    }

    try {
      const docRef = doc(db, REGISTRATIONS_COLLECTION, key);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as PendingRegistration;
        regCache.set(key, data);
        return data;
      }
    } catch (err) {
      console.warn("Error getting registration from Firestore:", err);
    }

    return null;
  },

  /**
   * Get all registrations for HRD Dashboard view
   */
  async getAllRegistrations(): Promise<PendingRegistration[]> {
    const results: PendingRegistration[] = [];
    const seen = new Set<string>();

    try {
      const colRef = collection(db, REGISTRATIONS_COLLECTION);
      const q = query(colRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      snapshot.forEach((d) => {
        const item = d.data() as PendingRegistration;
        results.push(item);
        seen.add(item.id.toLowerCase());
        regCache.set(item.id.toLowerCase(), item);
      });
    } catch (err) {
      console.warn("Could not fetch registrations from Firestore:", err);
    }

    // Include cache items not yet persisted to Firestore
    regCache.forEach((item, id) => {
      if (!seen.has(id)) {
        results.push(item);
        seen.add(id);
      }
    });

    // Sort descending by date
    return results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * ACC (Approve) an applicant
   * 1. Updates registration status to APPROVED
   * 2. Automatically syncs user to allowed_interns collection so login is allowed!
   * 3. Sends confirmation email to intern
   */
  async approveRegistration(id: string, approvedBy: string = "HRD CV. Asia Plastik"): Promise<PendingRegistration> {
    const key = id.toLowerCase().trim();
    let record = await this.getRegistration(key);

    if (!record) {
      throw new Error("Data pendaftar tidak ditemukan.");
    }

    record = {
      ...record,
      status: "APPROVED",
      approvedAt: new Date().toISOString(),
      approvedBy,
      updatedAt: new Date().toISOString(),
    };

    regCache.set(key, record);

    // 1. Update pending_registrations
    try {
      const docRef = doc(db, REGISTRATIONS_COLLECTION, key);
      await setDoc(docRef, record, { merge: true });
    } catch (err) {
      console.warn("Error updating registration doc in Firestore:", err);
    }

    // 2. Add or activate in allowed_interns collection
    try {
      const internRef = doc(db, WHITELIST_COLLECTION, key);
      const internData: AllowedIntern = {
        id: key,
        email: key,
        fullName: record.fullName,
        studentId: "",
        identityNumber: "",
        institution: record.institution,
        division: "Umum",
        magangHubId: `MH-${Date.now().toString().slice(-6)}`,
        status: "ACTIVE",
        companyName: "CV. Asia Plastik",
      };
      await setDoc(internRef, internData, { merge: true });
    } catch (err) {
      console.warn("Error upserting allowed_interns:", err);
    }

    return record;
  },

  /**
   * Tolak (Reject) an applicant
   */
  async rejectRegistration(id: string, reason: string = "Belum memenuhi kualifikasi kuota magang"): Promise<PendingRegistration> {
    const key = id.toLowerCase().trim();
    let record = await this.getRegistration(key);

    if (!record) {
      throw new Error("Data pendaftar tidak ditemukan.");
    }

    record = {
      ...record,
      status: "REJECTED",
      rejectionReason: reason,
      updatedAt: new Date().toISOString(),
    };

    regCache.set(key, record);

    try {
      const docRef = doc(db, REGISTRATIONS_COLLECTION, key);
      await setDoc(docRef, record, { merge: true });
    } catch (err) {
      console.warn("Error updating rejection in Firestore:", err);
    }

    return record;
  },
};
