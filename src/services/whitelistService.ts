import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export interface AllowedIntern {
  id: string;
  email: string;
  fullName: string;
  studentId: string; // NIM
  identityNumber: string; // NIK
  institution: string; // Kampus / Politeknik / SMK
  division: string;
  magangHubId: string;
  status: "ACTIVE" | "PENDING" | "COMPLETED";
  companyName: string;
}

// Built-in verified Kemnaker / MagangHub whitelist fallback for local evaluation & testing
export const MOCK_WHITELIST_INTERNS: AllowedIntern[] = [
  {
    id: "intern-1",
    email: "ahmad.fauzi@kemnaker.maganghub.id",
    fullName: "Ahmad Fauzi",
    studentId: "2141720189",
    identityNumber: "3515082109010001",
    institution: "Institut Teknologi Sepuluh Nopember (ITS)",
    division: "Quality Control (QC)",
    magangHubId: "MH-2026-APL-001",
    status: "ACTIVE",
    companyName: "CV. Asia Plastik",
  },
  {
    id: "intern-2",
    email: "siti.rahmawati@kemnaker.maganghub.id",
    fullName: "Siti Rahmawati",
    studentId: "2021081023",
    identityNumber: "3515082109020002",
    institution: "Politeknik Elektronika Negeri Surabaya (PENS)",
    division: "Maintenance & Otomasi",
    magangHubId: "MH-2026-APL-002",
    status: "ACTIVE",
    companyName: "CV. Asia Plastik",
  },
  {
    id: "intern-3",
    email: "dimas.wicaksono@kemnaker.maganghub.id",
    fullName: "Dimas Wicaksono",
    studentId: "1951502011",
    identityNumber: "3515082109030003",
    institution: "Universitas Brawijaya",
    division: "Produksi Blow Molding",
    magangHubId: "MH-2026-APL-003",
    status: "ACTIVE",
    companyName: "CV. Asia Plastik",
  },
];

const WHITELIST_COLLECTION = "allowed_interns";

export class WhitelistAccessDeniedError extends Error {
  constructor(message: string = "Access Denied: Your email is not registered with the MagangHub/SIAPkerja system for CV. Asia Plastik.") {
    super(message);
    this.name = "WhitelistAccessDeniedError";
  }
}

export const whitelistService = {
  /**
   * Strictly verify if the provided email exists in CV. Asia Plastik's MagangHub/SIAPkerja whitelist
   * @param email The intern's email address
   * @returns AllowedIntern details if whitelisted, otherwise throws WhitelistAccessDeniedError
   */
  async verifyInternEmail(email: string): Promise<AllowedIntern> {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // 1. Check Firestore 'allowed_interns' collection
      const q = query(
        collection(db, WHITELIST_COLLECTION),
        where("email", "==", normalizedEmail)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data() as AllowedIntern;
        if (docData.status === "ACTIVE") {
          return {
            ...docData,
            id: querySnapshot.docs[0].id,
          };
        }
      }

      // Also check direct document ID lookup (if doc ID is normalized email)
      const directDoc = await getDoc(doc(db, WHITELIST_COLLECTION, normalizedEmail));
      if (directDoc.exists()) {
        const docData = directDoc.data() as AllowedIntern;
        if (docData.status === "ACTIVE") {
          return {
            ...docData,
            id: directDoc.id,
          };
        }
      }
    } catch (firestoreError) {
      console.warn("Firestore whitelist check encountered connection limitation, falling back to local verification:", firestoreError);
    }

    // 2. Check local fallback list for seamless dev evaluation
    const matchedMock = MOCK_WHITELIST_INTERNS.find(
      (intern) => intern.email.toLowerCase() === normalizedEmail
    );

    if (matchedMock && matchedMock.status === "ACTIVE") {
      return matchedMock;
    }

    // STRICT REJECTION: Email is not authorized
    throw new WhitelistAccessDeniedError(
      "Access Denied: Your email is not registered with the MagangHub/SIAPkerja system for CV. Asia Plastik."
    );
  },

  /**
   * Check without throwing (returns boolean)
   */
  async isEmailWhitelisted(email: string): Promise<boolean> {
    try {
      await this.verifyInternEmail(email);
      return true;
    } catch (err) {
      return false;
    }
  },
};
