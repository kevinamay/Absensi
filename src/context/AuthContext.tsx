"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { UserProfile, UserRole } from "@/types/auth";

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (
    email: string,
    pass: string,
    fullName?: string,
    institution?: string
  ) => Promise<{ success: boolean; email?: string }>;
  loginWithSiapkerja: (overrideEmail?: string) => Promise<void>;
  logout: () => Promise<void>;
  setDemoUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  login: async () => {},
  register: async () => ({ success: false, email: "" }),
  loginWithSiapkerja: async () => {},
  logout: async () => {},
  setDemoUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore stored session or listen to Firebase Auth
  useEffect(() => {
    // 1. Check localStorage for saved session first (useful for rapid UI testing & state hydration)
    const savedSession = localStorage.getItem("cv_asia_demo_user");
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setUser(parsed);
        // Ensure middleware cookie is synchronized
        document.cookie = `cv_asia_session=${encodeURIComponent(
          JSON.stringify(parsed)
        )}; path=/; max-age=86400; SameSite=Lax`;
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem("cv_asia_demo_user");
      }
    }

    try {
      const unsubscribe = authService.onAuthStateChange(async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          try {
            const profile = await userService.getUserProfile(fbUser.uid);
            if (profile) {
              setUser(profile);
              document.cookie = `cv_asia_session=${encodeURIComponent(
                JSON.stringify(profile)
              )}; path=/; max-age=86400; SameSite=Lax`;
            } else {
              // Construct a default profile if not in Firestore yet
              const defaultProfile: UserProfile = {
                uid: fbUser.uid,
                email: fbUser.email || "",
                displayName: fbUser.displayName || "Peserta Magang",
                role: "intern",
                division: "Quality Control (QC)",
                institution: "Institut Teknologi Sepuluh Nopember",
                studentId: "2141720189",
                createdAt: new Date().toISOString(),
              };
              setUser(defaultProfile);
              document.cookie = `cv_asia_session=${encodeURIComponent(
                JSON.stringify(defaultProfile)
              )}; path=/; max-age=86400; SameSite=Lax`;
            }
          } catch (err) {
            console.error("Failed to load user profile:", err);
          }
        } else {
          // If no Firebase user and no saved local session, clear user
          if (!localStorage.getItem("cv_asia_demo_user")) {
            setUser(null);
            document.cookie = "cv_asia_session=; path=/; max-age=0; SameSite=Lax";
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn("Firebase Auth listener initialized in fallback mode:", err);
      setLoading(false);
    }
  }, []);

  /**
   * Primary: Login via Kemnaker SIAPkerja / MagangHub SSO
   */
  const loginWithSiapkerja = async (overrideEmail?: string) => {
    setLoading(true);
    try {
      const { user: fbUser, internData } = await authService.loginWithSiapkerja(overrideEmail);
      
      const profile: UserProfile = {
        uid: fbUser?.uid || internData.id,
        email: internData.email,
        displayName: internData.fullName,
        role: "intern",
        studentId: internData.studentId,
        identityNumber: internData.identityNumber,
        institution: internData.institution,
        magangHubId: internData.magangHubId,
        division: internData.division,
        createdAt: new Date().toISOString(),
      };

      // Set cookie for Next.js Middleware route protection
      document.cookie = `cv_asia_session=${encodeURIComponent(
        JSON.stringify({ ...profile, whitelisted: true })
      )}; path=/; max-age=86400; SameSite=Lax`;
      
      localStorage.setItem("cv_asia_demo_user", JSON.stringify({ ...profile, whitelisted: true }));
      setUser(profile);
      if (fbUser) setFirebaseUser(fbUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fallback: Login with Email & Password
   */
  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { user: fbUser, internData } = await authService.loginWithEmail(email, pass);
      
      const profile: UserProfile = {
        uid: fbUser?.uid || internData.id,
        email: internData.email,
        displayName: internData.fullName,
        role: "intern",
        studentId: internData.studentId,
        identityNumber: internData.identityNumber,
        institution: internData.institution,
        magangHubId: internData.magangHubId,
        division: internData.division,
        createdAt: new Date().toISOString(),
      };

      // Set cookie for Next.js Middleware route protection
      document.cookie = `cv_asia_session=${encodeURIComponent(
        JSON.stringify({ ...profile, whitelisted: true })
      )}; path=/; max-age=86400; SameSite=Lax`;

      localStorage.setItem("cv_asia_demo_user", JSON.stringify({ ...profile, whitelisted: true }));
      setUser(profile);
      if (fbUser) setFirebaseUser(fbUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Complete logout & token cleanup
   */
  const logout = async () => {
    localStorage.removeItem("cv_asia_demo_user");
    document.cookie = "cv_asia_session=; path=/; max-age=0; SameSite=Lax";
    try {
      await authService.logout();
    } catch (e) {
      // Ignore if in local mode
    }
    setUser(null);
    setFirebaseUser(null);
  };

  /**
   * Helper to switch roles instantly for evaluation & QA
   */
  const setDemoUser = (role: UserRole) => {
    const demoProfile: UserProfile = {
      uid: role === "admin" ? "admin-123" : "intern-456",
      email: role === "admin" ? "hrd@asiaplastik.com" : "ahmad.fauzi@kemnaker.maganghub.id",
      displayName: role === "admin" ? "Budi Santoso (HR Supervisor)" : "Ahmad Fauzi (QC MagangHub)",
      role: role,
      studentId: role === "intern" ? "2141720189" : undefined,
      identityNumber: "3515082103020001",
      institution: role === "intern" ? "Institut Teknologi Sepuluh Nopember (ITS)" : undefined,
      magangHubId: role === "intern" ? "MH-2026-APL-001" : undefined,
      division: role === "intern" ? "Quality Control (QC)" : "Human Resources",
      createdAt: new Date().toISOString(),
    };

    document.cookie = `cv_asia_session=${encodeURIComponent(
      JSON.stringify({ ...demoProfile, whitelisted: true })
    )}; path=/; max-age=86400; SameSite=Lax`;
    localStorage.setItem("cv_asia_demo_user", JSON.stringify({ ...demoProfile, whitelisted: true }));
    setUser(demoProfile);
    setLoading(false);
  };

  /**
   * Register intern: Open registration + Firebase Auth user creation + dispatch 6-digit OTP
   */
  const register = async (
    email: string,
    pass: string,
    fullName?: string,
    institution?: string
  ) => {
    setLoading(true);
    try {
      return await authService.registerInternOpen({
        email,
        pass,
        fullName: fullName || "",
        institution: institution || "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        login,
        register,
        loginWithSiapkerja,
        logout,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
