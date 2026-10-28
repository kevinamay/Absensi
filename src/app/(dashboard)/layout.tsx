"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { PrototypeSwitcher, PrototypeVariantInfo } from "@/components/shared/PrototypeSwitcher";
import {
  Building2,
  LogOut,
  Shield,
  GraduationCap,
} from "lucide-react";

export const PROTOTYPE_VARIANTS: PrototypeVariantInfo[] = [
  {
    key: "A",
    name: "Varian A: Vivid Azure Horizon",
    description: "Gradasi biru langit tebal & kaskade atmosferik dari atas ke bawah",
  },
  {
    key: "B",
    name: "Varian B: Radiant Cyber Mesh",
    description: "Sinar diagonal biru elektrik dengan matriks pola titik presisi",
  },
  {
    key: "C",
    name: "Varian C: Intense Dual Aurora",
    description: "Dua bola aurora cair cyan & sapphire yang tebal dan menyala jelas",
  },
];

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, loading } = useAuth();
  const currentVariant = searchParams.get("variant") || "A";

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen relative overflow-x-hidden text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* ============================================================== */}
      {/* PROTOTYPE VARIANT A: Vivid Azure Horizon                       */}
      {/* Gradasi biru langit yang tebal dan kaskade dari atas ke bawah  */}
      {/* ============================================================== */}
      {currentVariant === "A" && (
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-sky-200/95 via-blue-100/75 to-[#f0f7ff] dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/40 pointer-events-none overflow-hidden transition-colors duration-500">
          {/* Top Sunburst Sky Wash */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[70rem] h-[35rem] rounded-full bg-gradient-to-b from-sky-400/45 via-cyan-300/35 to-transparent blur-3xl pointer-events-none dark:from-sky-800/30 dark:via-cyan-900/20" />
          {/* Right Azure Bloom */}
          <div className="absolute top-1/4 -right-20 w-[40rem] h-[40rem] rounded-full bg-gradient-to-bl from-blue-400/40 via-sky-200/40 to-transparent blur-3xl pointer-events-none dark:from-blue-900/30" />
          {/* Bottom Ambient Glow */}
          <div className="absolute -bottom-24 left-1/4 w-[50rem] h-[30rem] rounded-full bg-gradient-to-t from-sky-300/35 via-indigo-200/25 to-transparent blur-3xl pointer-events-none dark:from-sky-950/30" />
        </div>
      )}

      {/* ============================================================== */}
      {/* PROTOTYPE VARIANT B: Radiant Cyber Mesh                        */}
      {/* Sinar diagonal biru elektrik dengan matriks titik presisi      */}
      {/* ============================================================== */}
      {currentVariant === "B" && (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#dbeafe] via-[#e0f2fe] to-[#f0f9ff] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pointer-events-none overflow-hidden transition-colors duration-500">
          {/* Angled Light Beam Streaks */}
          <div className="absolute -top-32 right-[-10%] w-[60rem] h-64 bg-gradient-to-r from-transparent via-sky-400/35 to-transparent -rotate-12 blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 -left-20 w-[55rem] h-52 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent -rotate-12 blur-2xl pointer-events-none" />
          {/* Intense Left Cobalt Sphere */}
          <div className="absolute bottom-10 -left-20 w-[45rem] h-[45rem] rounded-full bg-gradient-to-tr from-blue-400/45 via-sky-300/50 to-transparent blur-3xl pointer-events-none dark:from-blue-950/40" />
          {/* High Definition Grid Pattern */}
          <div
            className="absolute inset-0 opacity-50 dark:opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#0284c7 1.2px, transparent 1.2px)",
              backgroundSize: "24px 24px",
              maskImage: "radial-gradient(ellipse at 50% 50%, black 70%, transparent 95%)",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 70%, transparent 95%)",
            }}
          />
        </div>
      )}

      {/* ============================================================== */}
      {/* PROTOTYPE VARIANT C: Intense Dual Aurora                       */}
      {/* Dua bola aurora cair cyan & sapphire yang tebal dan menyala    */}
      {/* ============================================================== */}
      {currentVariant === "C" && (
        <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-[#e0f2fe] via-[#e6f4ff] to-[#bae6fd]/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pointer-events-none overflow-hidden transition-colors duration-500">
          {/* Giant Saturated Cyan/Sky Aurora Top-Right */}
          <div className="absolute -top-28 -right-28 w-[45rem] h-[45rem] rounded-full bg-gradient-to-br from-sky-400/60 via-cyan-300/50 to-blue-200/30 blur-3xl pointer-events-none animate-pulse dark:from-sky-700/40 dark:via-cyan-800/30" />
          {/* Giant Saturated Sapphire/Cobalt Aurora Bottom-Left */}
          <div className="absolute -bottom-36 -left-36 w-[50rem] h-[50rem] rounded-full bg-gradient-to-tr from-blue-500/50 via-sky-400/60 to-indigo-300/40 blur-3xl pointer-events-none dark:from-blue-900/45 dark:via-sky-950/40" />
          {/* Mid-screen glowing azure halo */}
          <div className="absolute top-1/3 left-1/4 w-[36rem] h-[36rem] rounded-full bg-gradient-to-b from-cyan-300/40 to-sky-200/50 blur-2xl pointer-events-none dark:from-cyan-900/25" />
        </div>
      )}

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
              <span className="font-black text-sm tracking-tight block">
                CV. ASIA PLASTIK
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                Sistem Presensi & MagangHub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* User identity chip */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-white/80 dark:border-slate-700/60 shadow-xs">
                {user.role === "admin" ? (
                  <Shield className="w-4 h-4 text-amber-500" />
                ) : (
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                )}
                <div className="text-left text-xs">
                  <span className="font-bold block truncate max-w-[120px]">{user.displayName}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate max-w-[120px]">
                    {user.institution || user.division || "Divisi Operasional"}
                  </span>
                </div>
                <Badge
                  variant={user.role === "admin" ? "warning" : "info"}
                  className="text-[10px] ml-1 uppercase"
                >
                  {user.role}
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
                className="text-xs gap-1.5 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-950 hover:bg-rose-50 dark:hover:bg-rose-950/40"
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
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold">Memuat Sistem CV. Asia Plastik...</p>
            </div>
          </div>
        ) : null}
        <div className={loading ? "hidden" : "contents"}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-sky-100/80 dark:border-slate-900 bg-white/40 dark:bg-slate-950/80 backdrop-blur-md py-4 text-center text-xs text-slate-500 dark:text-slate-500">
        CV. Asia Plastik Internship System • Powered by Next.js & Firebase
      </footer>

      {/* Floating Interactive Prototype Switcher Bar */}
      <PrototypeSwitcher
        variants={PROTOTYPE_VARIANTS}
        currentVariant={currentVariant}
      />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}
