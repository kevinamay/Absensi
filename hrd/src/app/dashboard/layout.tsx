"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LogOut, Shield } from "lucide-react";

function HrdDashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen relative overflow-x-hidden text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Permanent Soft Azure Horizon Gradient Background (Varian A - Soft Sky Pastel) */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-sky-100/75 via-blue-50/50 to-[#f6faff] dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30 pointer-events-none overflow-hidden transition-colors duration-500">
        {/* Soft Upper Sky Glow */}
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[65rem] h-[32rem] rounded-full bg-gradient-to-b from-sky-300/25 via-cyan-200/20 to-transparent blur-3xl pointer-events-none dark:from-sky-900/20 dark:via-cyan-950/15" />
        {/* Gentle Azure Bloom on Right */}
        <div className="absolute top-1/4 -right-16 w-[36rem] h-[36rem] rounded-full bg-gradient-to-bl from-sky-200/30 via-blue-100/25 to-transparent blur-3xl pointer-events-none dark:from-blue-950/25" />
        {/* Soft Ambient Horizon at Bottom-Left */}
        <div className="absolute -bottom-20 left-1/4 w-[45rem] h-[26rem] rounded-full bg-gradient-to-t from-sky-200/20 via-blue-50/15 to-transparent blur-3xl pointer-events-none dark:from-sky-950/20" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/60 dark:border-slate-800 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.webp"
              alt="CV. Asia Plastik"
              width={271}
              height={92}
              priority
              className="h-8 w-auto object-contain dark:invert-0 invert drop-shadow-sm"
            />
            <div className="border-l border-slate-300 dark:border-slate-700 pl-3 py-0.5">
              <span className="font-black text-sm tracking-tight block text-slate-900 dark:text-white">
                CV. ASIA PLASTIK
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block uppercase tracking-wide">
                Portal HRD & Supervisor
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* User identity chip */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Shield className="w-4 h-4 text-amber-500" />
                <div className="text-left text-xs">
                  <span className="font-bold block truncate max-w-[140px]">{user.displayName || "Staf HRD"}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[140px]">
                    {user.division || "Human Resources"}
                  </span>
                </div>
                <Badge variant="warning" className="text-[10px] ml-1 uppercase font-bold">
                  HR / Supervisor
                </Badge>
              </div>
            )}

            {/* Dark / Light Mode Switcher */}
            <ThemeToggle variant="inline" />

            {/* Logout Button */}
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="text-xs gap-1.5 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-950 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center text-slate-500 dark:text-slate-400">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold">Memuat Dasbor HRD...</p>
            </div>
          </div>
        ) : null}
        <div className={loading ? "hidden" : "contents"}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-sky-100/80 dark:border-slate-900 bg-white/40 dark:bg-slate-950/80 backdrop-blur-md py-4 text-center text-xs text-slate-500 dark:text-slate-500">
        CV. Asia Plastik HR Management Console • Dedicated Portal
      </footer>
    </div>
  );
}

export default function HrdDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <HrdDashboardContent>{children}</HrdDashboardContent>
    </Suspense>
  );
}
