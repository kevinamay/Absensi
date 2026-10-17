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
  logout: () => Promise<void>;
  setDemoUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  setDemoUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore stored session or listen to Firebase Auth
  useEffect(() => {
    // Check localStorage for saved demo session first (useful for rapid UI testing)
    const savedDemo = localStorage.getItem("cv_asia_demo_user");
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setUser(parsed);
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
            } else {
              // Construct a default profile if not in Firestore yet
              const defaultProfile: UserProfile = {
                uid: fbUser.uid,
                email: fbUser.email || "",
                displayName: fbUser.displayName || "Peserta Magang",
                role: "intern",
                division: "Produksi",
                institution: "Politeknik Negeri",
                studentId: "2141720000",
                createdAt: new Date().toISOString(),
              };
              setUser(defaultProfile);
            }
          } catch (err) {
            console.error("Failed to load user profile:", err);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn("Firebase Auth listener initialized in fallback mode:", err);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const fbUser = await authService.loginWithEmail(email, pass);
      const profile = await userService.getUserProfile(fbUser.uid);
      if (profile) {
        setUser(profile);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem("cv_asia_demo_user");
    try {
      await authService.logout();
    } catch (e) {
      // Ignore if in demo mode
    }
    setUser(null);
    setFirebaseUser(null);
  };

  /**
   * Helper to switch roles instantly for development & QA testing
   */
  const setDemoUser = (role: UserRole) => {
    const demoProfile: UserProfile = {
      uid: role === "admin" ? "admin-123" : "intern-456",
      email: role === "admin" ? "hrd@asiaplastik.com" : "magang@mahasiswa.ac.id",
      displayName: role === "admin" ? "Budi Santoso (HR Supervisor)" : "Ahmad Fauzi (Intern Mahasiswa)",
      role: role,
      studentId: role === "intern" ? "2141720189" : undefined,
      identityNumber: "3515082103020001",
      institution: role === "intern" ? "Institut Teknologi Sepuluh Nopember (ITS)" : undefined,
      magangHubId: role === "intern" ? "MH-SIAP-2026-0891" : undefined,
      division: role === "intern" ? "Quality Control (QC)" : "Human Resources",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("cv_asia_demo_user", JSON.stringify(demoProfile));
    setUser(demoProfile);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        login,
        logout,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
