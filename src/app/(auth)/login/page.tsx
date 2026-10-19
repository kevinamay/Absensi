"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { WhitelistAccessDeniedError } from "@/services/whitelistService";
import { EmailNotVerifiedError } from "@/services/authService";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Mail,
  GraduationCap,
  Clock,
  AlertOctagon,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [accessDeniedError, setAccessDeniedError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [timeStr, setTimeStr] = useState("");

  // Live WIB Clock
  useEffect(() => {
    const updateTime = () => {
      setTimeStr(
        new Intl.DateTimeFormat("id-ID", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date()) + " WIB"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if redirected with error from middleware
  useEffect(() => {
    if (searchParams.get("error") === "session_required") {
      setGeneralError("Sesi Anda telah berakhir atau belum terautentikasi. Silakan masuk terlebih dahulu.");
    }
  }, [searchParams]);

  /**
   * LOGIN METHOD: Email & Password
   * Strictly validates against Firestore whitelist BEFORE finalizing the session.
   */
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccessDeniedError(null);
    setGeneralError(null);

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password.trim()) {
      setGeneralError("Mohon masukkan email dan kata sandi Anda.");
      return;
    }

    setSubmitting(true);
    try {
      await login(normalizedEmail, password);
      router.push("/intern");
    } catch (err: any) {
      console.warn("Login verification result:", err);
      if (
        err instanceof EmailNotVerifiedError ||
        err?.message?.includes("verify your email address first")
      ) {
        setGeneralError("Access Denied: Please verify your email address first.");
      } else if (
        err instanceof WhitelistAccessDeniedError ||
        err?.name === "WhitelistAccessDeniedError" ||
        err?.message?.includes("Access Denied")
      ) {
        setAccessDeniedError(
          "Access Denied: Your email is not registered with the MagangHub/SIAPkerja system for CV. Asia Plastik."
        );
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
        setGeneralError("Kredensial tidak valid. Pastikan email dan kata sandi sudah benar.");
      } else if (
        err.code === "auth/api-key-not-valid" ||
        err.code === "auth/invalid-api-key" ||
        err.message?.includes("API key not valid")
      ) {
        setGeneralError(
          "Firebase API Key belum aktif pada environment lokal. Gunakan akun demonstrasi terdaftar di bawah."
        );
      } else {
        setGeneralError(err.message || "Gagal masuk. Periksa kembali akun Anda.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 sm:p-8 lg:p-12 transition-colors duration-300">
      {/* ============================================================== */}
      {/* FULL-SCREEN REAL BUILDING BACKGROUND: BG_CV ASIA.webp          */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/BG_CV ASIA.webp"
          alt="Gedung CV. Asia Plastik Sidoarjo"
          fill
          priority
          className="object-cover object-center scale-105 filter contrast-[1.08] brightness-95 dark:brightness-75 transition-all duration-300"
        />
        {/* Adaptive Optical Scrim Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/75 backdrop-blur-[2px] transition-colors duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent opacity-90" />
      </div>

      {/* Floating Theme Toggle at Top Right */}
      <ThemeToggle />

      {/* Floating Corporate Identity Header on Top Left */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-blue-600/90 border border-white/30 text-white flex items-center justify-center shadow-lg shadow-blue-900/40 backdrop-blur-md">
          <span className="font-black text-lg tracking-tighter">ap</span>
        </div>
        <div className="hidden sm:block">
          <span className="text-sm font-black tracking-tight block text-white drop-shadow">
            CV. ASIA PLASTIK
          </span>
          <span className="text-[11px] text-blue-300 font-semibold tracking-wider uppercase drop-shadow flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Sidoarjo Plant & Headquarter
          </span>
        </div>
      </div>

      {/* Centered Floating Frosted Card Container (Permanent Design B) */}
      <div className="relative z-10 w-full max-w-md my-auto">
        {/* Access denied error */}
        {accessDeniedError && (
          <div
            role="alert"
            className="mb-4 p-4 rounded-2xl bg-rose-950/90 border-2 border-rose-500 text-rose-100 shadow-2xl backdrop-blur-xl animate-in fade-in"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 shadow-md">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-rose-300">Akses Ditolak / Unauthorized</h4>
                <p className="text-xs font-semibold leading-relaxed text-rose-200">{accessDeniedError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Standard error banner */}
        {generalError && !accessDeniedError && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 backdrop-blur-md">
            <span className="font-bold mt-0.5">⚠️</span>
            <p className="leading-relaxed">{generalError}</p>
          </div>
        )}

        {/* Floating Glassmorphic Authentication Card */}
        <div className="rounded-3xl border border-white/30 dark:border-white/15 bg-white/85 dark:bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-3xl ring-1 ring-black/10 dark:ring-white/10 relative overflow-hidden transition-all duration-300">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-cyan-300 text-[11px] font-bold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              Portal Magang Kemnaker RI
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Masuk ke Presensi
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Gedung CV. Asia Plastik • Presensi Mandiri
            </p>
          </div>

          {/* Real-time stats bar */}
          <div className="grid grid-cols-2 gap-2 p-2 rounded-2xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 mb-5 text-center">
            <div className="p-2">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Waktu Operasional</span>
              <span className="text-sm font-black text-slate-900 dark:text-white font-mono">{timeStr || "08:15 WIB"}</span>
            </div>
            <div className="p-2 border-l border-slate-900/10 dark:border-white/10">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Radius Lokasi</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                150m OK
              </span>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4" suppressHydrationWarning>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Email SIAPkerja / MagangHub
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: ahmad.fauzi@kemnaker.maganghub.id"
                  required
                  suppressHydrationWarning
                  className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white/90 dark:bg-slate-950/70 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Kata Sandi
                </label>
                <a
                  href="https://siapkerja.kemnaker.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-600 dark:text-cyan-400 hover:underline"
                >
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  suppressHydrationWarning
                  className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white/90 dark:bg-slate-950/70 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  suppressHydrationWarning
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3.5 font-bold mt-2 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white shadow-xl shadow-blue-900/30 border border-blue-400/30 rounded-xl"
              isLoading={submitting}
              disabled={submitting}
            >
              <Lock className="w-4 h-4 mr-2" />
              Masuk ke Portal Presensi
            </Button>

            {/* Registration activation button */}
            <div className="pt-2 text-center">
              <Link
                href="/register"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1.5"
              >
                <span>Peserta Baru? Buat & Aktivasi Sandi Akun Magang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </form>
        </div>

        {/* Subtitle / Footer info */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-white/80 drop-shadow">
            CV. Asia Plastik • Gedung & Pabrik Injection Moulding Sidoarjo
          </p>
          <div className="mt-1">
            <Link
              href="/admin/login"
              className="text-[11px] text-white/60 hover:text-white underline transition-colors"
            >
              Akses Khusus Supervisor / HR CV. Asia Plastik →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold">Memuat Portal CV. Asia Plastik...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
