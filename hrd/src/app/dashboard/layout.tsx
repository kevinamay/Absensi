"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LogOut, Shield } from "lucide-react";

export default function HrdDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-200">
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
        ) : (
          children
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white/50 dark:bg-slate-950/90 py-4 text-center text-xs text-slate-500 dark:text-slate-600">
        CV. Asia Plastik HR Management Console • Dedicated Portal
      </footer>
    </div>
  );
}
