"use client";

import { useEffect } from "next";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function HrdHomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && user.role === "admin") {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold">Mengarahkan ke Portal HRD CV. Asia Plastik...</p>
      </div>
    </div>
  );
}
