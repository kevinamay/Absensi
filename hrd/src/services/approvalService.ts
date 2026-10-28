import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { PendingRegistration } from "@/types/approval";
import { AllowedIntern } from "./whitelistService";
import { registrationsStore, StoredRegistration } from "@/lib/registrationsStore";

const REGISTRATIONS_COLLECTION = "pending_registrations";
const WHITELIST_COLLECTION = "allowed_interns";

export const approvalService = {
  /**
   * Save or update an applicant's registration status to PENDING_APPROVAL after registration
   */
  async registerPending(data: {
    email: string;
    fullName: string;
    institution: string;
    password?: string;
  }): Promise<PendingRegistration> {
    const key = data.email.toLowerCase().trim();
    const newRecord: StoredRegistration = {
      id: key,
      email: key,
      fullName: data.fullName.trim(),
      institution: data.institution.trim(),
      status: "PENDING_APPROVAL",
      password: data.password || "",
      createdAt: new Date().toISOString(),
    };

    // Save to persistent file store
    registrationsStore.set(key, newRecord);

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

    // 1. Check persistent registrations store
    const stored = registrationsStore.get(key);
    if (stored) {
      return stored;
    }

    // 2. Fallback to Firestore
    try {
      const docRef = doc(db, REGISTRATIONS_COLLECTION, key);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as PendingRegistration;
        registrationsStore.set(key, data);
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

    // 1. Load from persistent disk store first
    const storedList = registrationsStore.getAll();
    storedList.forEach((item) => {
      results.push(item);
      seen.add(item.id.toLowerCase());
    });

    // 2. Fetch from Firestore if accessible
    try {
      const colRef = collection(db, REGISTRATIONS_COLLECTION);
      const q = query(colRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      snapshot.forEach((d) => {
        const item = d.data() as PendingRegistration;
        const normId = item.id.toLowerCase();
        if (!seen.has(normId)) {
          results.push(item);
          seen.add(normId);
          registrationsStore.set(normId, item);
        }
      });
    } catch (err) {
      console.warn("Could not fetch registrations from Firestore:", err);
    }

    // Sort descending by date
    return results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * ACC (Approve) an applicant
   * 1. Updates registration status to APPROVED in persistent store
   * 2. Automatically syncs user to allowed_interns collection
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

    // Update in persistent file store
    registrationsStore.approve(key, approvedBy);

    // 1. Update pending_registrations in Firestore
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

    // Update in persistent file store
    registrationsStore.reject(key, reason);

    try {
      const docRef = doc(db, REGISTRATIONS_COLLECTION, key);
      await setDoc(docRef, record, { merge: true });
    } catch (err) {
      console.warn("Error updating rejection in Firestore:", err);
    }

    return record;
  },
};
