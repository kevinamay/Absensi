import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { userService } from "./userService";
import { UserProfile } from "@/types/auth";

export const authService = {
  /**
   * Log in with Email & Password (e.g. registered MagangHub / SIAPkerja email)
   */
  async loginWithEmail(email: string, pass: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(auth, email, pass);
    return credential.user;
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
