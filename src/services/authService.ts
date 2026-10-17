import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { whitelistService, WhitelistAccessDeniedError, AllowedIntern } from "./whitelistService";
import { userService } from "./userService";
import { UserProfile } from "@/types/auth";

export const authService = {
  /**
   * Primary: Sign in with SIAPkerja / MagangHub (Kemnaker RI)
   * Uses Google SSO / Kemnaker OAuth provider and strictly validates against Firestore whitelist.
   */
  async loginWithSiapkerja(overrideEmail?: string): Promise<{ user: User | null; internData: AllowedIntern }> {
    // 1. If override email passed (or for quick integration simulation):
    if (overrideEmail) {
      const internData = await whitelistService.verifyInternEmail(overrideEmail);
      return { user: auth.currentUser, internData };
    }

    // 2. Standard Google/OAuth SSO Popup
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
      // If popup fails or API key is dummy, throw friendly error or propagate
      throw err;
    }
  },

  /**
   * Fallback: Log in with standard Email & Password
   * Strictly verifies against Firestore whitelist BEFORE finalizing the session.
   */
  async loginWithEmail(email: string, pass: string): Promise<{ user: User | null; internData: AllowedIntern }> {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check Whitelist BEFORE finalizing session
    const internData = await whitelistService.verifyInternEmail(normalizedEmail);

    try {
      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
      
      // Update or sync profile
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

      return { user: credential.user, internData };
    } catch (authError: any) {
      // If Firebase Auth throws user-not-found or invalid-credential, rethrow
      // But if user was signed in and somehow failed, ensure signed out
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
