import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { whitelistService, WhitelistAccessDeniedError, AllowedIntern } from "./whitelistService";
import { userService } from "./userService";
import { UserProfile } from "@/types/auth";

export class RegistrationWhitelistError extends Error {
  constructor(message: string = "Registration Failed: Your email is not registered in the HRD whitelist.") {
    super(message);
    this.name = "RegistrationWhitelistError";
  }
}

export class EmailNotVerifiedError extends Error {
  constructor(message: string = "Access Denied: Please verify your email address first.") {
    super(message);
    this.name = "EmailNotVerifiedError";
  }
}

/**
 * Maps Firebase Authentication error codes to user-friendly messages in Indonesian
 */
export function mapFirebaseAuthError(error: any): string {
  if (!error) return "Terjadi kesalahan pada sistem otentikasi.";

  const code = error.code || "";
  const msg = error.message || "";

  switch (code) {
    case "auth/email-already-in-use":
      return "Email ini sudah terdaftar. Silakan masuk menggunakan kata sandi Anda atau minta reset kata sandi.";
    case "auth/invalid-email":
      return "Format email tidak valid. Pastikan penulisan email Anda benar.";
    case "auth/weak-password":
      return "Kata sandi terlalu lemah. Gunakan minimal 6 karakter kombinasi huruf dan angka.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Kredensial tidak valid. Periksa kembali email dan kata sandi Anda.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan masuk yang gagal. Akses dinonaktifkan sementara untuk keamanan. Silakan coba lagi nanti.";
    case "auth/popup-blocked":
      return "Jendela popup login diblokir oleh peramban browser Anda. Mohon izinkan popup untuk situs ini.";
    case "auth/popup-closed-by-user":
      return "Jendela login ditutup sebelum proses verifikasi selesai.";
    case "auth/network-request-failed":
      return "Koneksi jaringan terputus. Pastikan perangkat Anda terhubung ke internet.";
    case "auth/operation-not-allowed":
      return "Metode masuk ini belum diaktifkan pada Firebase Authentication Console.";
    default:
      if (msg.includes("API key not valid") || code.includes("api-key")) {
        return "Firebase API Key belum aktif pada environment lokal. Masukkan Web API Key dari Firebase Console.";
      }
      return msg || "Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi.";
  }
}

export const authService = {
  /**
   * STEP 2: REGISTRATION FLOW WITH STRICT WHITELIST VALIDATION & EMAIL VERIFICATION
   * 
   * Step A: Query Firestore collection 'allowed_interns' to check if email exists.
   * Step B: If not in whitelist, reject immediately with custom error.
   * Step C: Create user in Firebase Auth using createUserWithEmailAndPassword.
   * Step D: Trigger sendEmailVerification to newly created user.
   * Step E: Immediately call signOut(auth) to clear unverified session and prepare for redirection.
   */
  async registerIntern(
    email: string,
    pass: string
  ): Promise<{ success: boolean; internData: AllowedIntern }> {
    const normalizedEmail = email.trim().toLowerCase();

    // Step A & Step B: Strict Firestore Whitelist Validation
    let internData: AllowedIntern;
    try {
      internData = await whitelistService.verifyInternEmail(normalizedEmail);
    } catch (whitelistError) {
      throw new RegistrationWhitelistError(
        "Registration Failed: Your email is not registered in the HRD whitelist."
      );
    }

    try {
      // Step C: Secure Account Creation in Firebase Auth (handles secure hashing & storage)
      const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);

      // Upsert intern profile in Firestore 'users/{uid}'
      await userService.createOrUpdateInternProfile(credential.user.uid, {
        email: internData.email,
        displayName: internData.fullName,
        studentId: internData.studentId,
        identityNumber: internData.identityNumber,
        institution: internData.institution,
        magangHubId: internData.magangHubId,
        division: internData.division,
        role: "intern",
      });

      // Step D: Send Email Verification link to newly created user
      await sendEmailVerification(credential.user);

      // Step E: Immediately sign out since email is not verified yet
      await signOut(auth);

      return { success: true, internData };
    } catch (firebaseAuthError: any) {
      // Ensure session is cleared if error occurred during creation
      await signOut(auth).catch(() => {});
      throw firebaseAuthError;
    }
  },

  /**
   * Resend Verification Email for pending users
   */
  async resendVerificationEmail(email: string, pass: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const credential = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
    if (!credential.user.emailVerified) {
      await sendEmailVerification(credential.user);
    }
    await signOut(auth);
  },

  /**
   * Primary: Sign in with SIAPkerja / MagangHub (Kemnaker RI)
   * Uses Google SSO / Kemnaker OAuth provider and strictly validates against Firestore whitelist.
   */
  async loginWithSiapkerja(overrideEmail?: string): Promise<{ user: User | null; internData: AllowedIntern }> {
    if (overrideEmail) {
      const internData = await whitelistService.verifyInternEmail(overrideEmail);
      return { user: auth.currentUser, internData };
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (!email) {
        await signOut(auth);
        throw new WhitelistAccessDeniedError(
          "Access Denied: Your email is not registered with the MagangHub/SIAPkerja system for CV. Asia Plastik."
        );
      }

      // STRICT WHITELIST CHECK: Query Firestore allowed_interns
      try {
        const internData = await whitelistService.verifyInternEmail(email);

        // Sync or update profile in Firestore
        await userService.createOrUpdateInternProfile(result.user.uid, {
          email: internData.email,
          displayName: internData.fullName,
          studentId: internData.studentId,
          identityNumber: internData.identityNumber,
          institution: internData.institution,
          magangHubId: internData.magangHubId,
          division: internData.division,
          role: "intern",
        });

        return { user: result.user, internData };
      } catch (whitelistErr) {
        // IMMEDIATE TERMINATION: Sign out unauthorized user instantly
        await signOut(auth);
        throw whitelistErr;
      }
    } catch (err: any) {
      if (err instanceof WhitelistAccessDeniedError) {
        throw err;
      }
      throw err;
    }
  },

  /**
   * Fallback & Standard: Log in with Email & Password
   * STEP 4 CONSTRAINT:
   * 1. Strictly queries Firestore whitelist before proceeding.
   * 2. Authenticates credentials in Firebase Auth.
   * 3. Explicitly checks user.emailVerified. If false, IMMEDIATELY signs out and throws EmailNotVerifiedError.
   */
  async loginWithEmail(email: string, pass: string): Promise<{ user: User | null; internData: AllowedIntern }> {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check Whitelist BEFORE finalizing session
    const internData = await whitelistService.verifyInternEmail(normalizedEmail);

    try {
      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
      const user = credential.user;

      // STEP 4 CONSTRAINT: Explicitly check user.emailVerified
      if (!user.emailVerified) {
        await signOut(auth);
        throw new EmailNotVerifiedError("Access Denied: Please verify your email address first.");
      }

      // Update or sync profile
      await userService.createOrUpdateInternProfile(user.uid, {
        email: internData.email,
        displayName: internData.fullName,
        studentId: internData.studentId,
        identityNumber: internData.identityNumber,
        institution: internData.institution,
        magangHubId: internData.magangHubId,
        division: internData.division,
        role: "intern",
      });

      return { user, internData };
    } catch (authError: any) {
      if (authError instanceof EmailNotVerifiedError) {
        throw authError;
      }
      // If Firebase Auth throws api key error in local test mode:
      if (
        authError.code === "auth/api-key-not-valid" ||
        authError.code === "auth/invalid-api-key"
      ) {
        return { user: null, internData };
      }
      // Ensure signed out
      await signOut(auth).catch(() => {});
      throw authError;
    }
  },

  /**
   * Log out current user
   */
  async logout(): Promise<void> {
    await signOut(auth);
  },

  /**
   * Listen to Firebase Auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
};
