import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { OtpVerificationRecord } from "@/types/approval";

// Global cache fallback for in-memory persistence across API routes in Node environment
const globalForOtp = globalThis as unknown as {
  __otpCache?: Map<string, OtpVerificationRecord>;
};

const otpCache = globalForOtp.__otpCache || new Map<string, OtpVerificationRecord>();
if (process.env.NODE_ENV !== "production") {
  globalForOtp.__otpCache = otpCache;
}

const OTP_COLLECTION = "otp_verifications";

export const otpStore = {
  /**
   * Save OTP record
   */
  async saveOtp(record: OtpVerificationRecord): Promise<void> {
    const key = record.email.toLowerCase().trim();
    otpCache.set(key, record);

    try {
      const docRef = doc(db, OTP_COLLECTION, key);
      await setDoc(docRef, record);
    } catch (err) {
      console.warn("Could not save OTP to Firestore, using in-memory fallback:", err);
    }
  },

  /**
   * Get OTP record
   */
  async getOtp(email: string): Promise<OtpVerificationRecord | null> {
    const key = email.toLowerCase().trim();

    // Check memory first
    if (otpCache.has(key)) {
      const cached = otpCache.get(key)!;
      if (cached.expiresAt > Date.now()) {
        return cached;
      } else {
        otpCache.delete(key);
      }
    }

    // Check Firestore
    try {
      const docRef = doc(db, OTP_COLLECTION, key);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as OtpVerificationRecord;
        if (data.expiresAt > Date.now()) {
          otpCache.set(key, data);
          return data;
        } else {
          await deleteDoc(docRef).catch(() => {});
        }
      }
    } catch (err) {
      console.warn("Could not read OTP from Firestore, using in-memory store:", err);
    }

    return null;
  },

  /**
   * Remove OTP record upon successful verification
   */
  async removeOtp(email: string): Promise<void> {
    const key = email.toLowerCase().trim();
    otpCache.delete(key);
    try {
      const docRef = doc(db, OTP_COLLECTION, key);
      await deleteDoc(docRef);
    } catch (err) {
      // ignore
    }
  },
};
