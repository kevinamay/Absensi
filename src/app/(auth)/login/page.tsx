"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { WhitelistAccessDeniedError, MOCK_WHITELIST_INTERNS } from "@/services/whitelistService";
import { EmailNotVerifiedError } from "@/services/authService";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Building2,
  Lock,
  GraduationCap,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Factory,
  AlertOctagon,
  Mail,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  UserPlus,
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
  const handleFallbackSubmit = async (e: React.FormEvent) => {
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
      console.warn("Fallback login verification result:", err);
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row relative transition-colors duration-200">
      {/* Floating Theme Toggle at top right */}
      <ThemeToggle />

      {/* ============================================================== */}
      {/* LEFT COLUMN: Corporate Identity, Kemnaker Partnership & Geofence */}
      {/* ============================================================== */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-blue-50/80 via-slate-100 to-indigo-50/60 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors duration-200">
        {/* Soft atmospheric background lights */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header branding */}
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-white/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block text-slate-900 dark:text-white">
                CV. ASIA PLASTIK
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase">
                Industry & Injection Moulding • Sidoarjo
              </span>
            </div>
          </div>

          {/* Kemnaker RI partnership badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6">
            <Factory className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Program Magang Bersertifikat Kementerian Ketenagakerjaan RI
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 text-slate-900 dark:text-white">
            Portal Presensi Peserta Magang
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed mb-8">
            Sistem pencatatan kehadiran terpadu bagi siswa dan mahasiswa magang di CV. Asia Plastik.
            Akses dibatasi secara ketat hanya bagi email yang terdaftar pada sistem 
            <strong className="text-blue-600 dark:text-blue-400 font-semibold"> SIAPkerja</strong> dan 
            <strong className="text-blue-600 dark:text-blue-400 font-semibold"> MagangHub</strong> Kemnaker.
          </p>

          {/* Telemetry and Geofence status tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg mb-8">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                <Clock className="w-4 h-4 text-emerald-500" />
                Waktu Operasional Pabrik
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {timeStr || "08:00 WIB"}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Jam Masuk: 08:00 WIB (Toleransi 15 mnt)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                <MapPin className="w-4 h-4 text-rose-500" />
                Geofence Radius Presensi
              </div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Radius 150m Aktif
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Lokasi Pabrik: Sidoarjo, Jawa Timur
              </p>
            </div>
          </div>

          {/* Security Architecture list */}
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Strict Whitelist Query via Cloud Firestore (<code className="text-blue-600 dark:text-blue-400 font-mono text-[11px]">allowed_interns</code>)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Sinkronisasi Otomatis SSO Akun SIAPkerja Kemnaker RI</span>
            </div>
          </div>
        </div>

        {/* Bottom trust footer */}
        <div className="relative z-10 pt-6 mt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Sistem Keamanan Whitelist Kemnaker Terverifikasi</span>
          </div>
          <span>Presensi Intern v2.4</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: Modern Responsive Whitelisted Login Form */}
      {/* ============================================================== */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative">
        <div className="w-full max-w-md">
          {/* Header titles */}
          <div className="mb-6">
            <Badge variant="info" className="gap-1.5 mb-2 py-1 px-3">
              <GraduationCap className="w-3.5 h-3.5" />
              Khusus Peserta Magang Resmi
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Masuk ke Portal Peserta
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gunakan akun SIAPkerja / MagangHub yang telah disetujui untuk CV. Asia Plastik.
            </p>
          </div>

          {/* ============================================================== */}
          {/* CRITICAL ERROR ALERT: Strict Access Denied (Red Highlight)     */}
          {/* ============================================================== */}
          {accessDeniedError && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-500/80 text-rose-900 dark:text-rose-100 shadow-lg shadow-rose-500/10 animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0 shadow-md">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-rose-700 dark:text-rose-300">
                    Akses Ditolak / Unauthorized
                  </h4>
                  <p className="text-xs font-semibold leading-relaxed text-rose-800 dark:text-rose-200">
                    {accessDeniedError}
                  </p>
                  <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 pt-1 leading-normal">
                    Email Anda tidak terdaftar dalam basis data peserta magang resmi CV. Asia Plastik.
                    Sesi telah diputus secara otomatis demi keamanan.
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href="https://maganghub.kemnaker.go.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 underline underline-offset-2 hover:opacity-80"
                    >
                      Cek Status di MagangHub Kemnaker
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Standard error banner */}
          {generalError && !accessDeniedError && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2.5">
              <span className="font-bold mt-0.5">⚠️</span>
              <p className="leading-relaxed">{generalError}</p>
            </div>
          )}

          {/* Login Card */}
          <Card className="border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-2xl backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center justify-between">
                <span>Otentikasi Akun</span>
                <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                  Kemnaker Whitelist
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                Masukkan email magang dan kata sandi Anda. Sistem akan memverifikasi status whitelist pada koleksi <code className="text-slate-800 dark:text-slate-200 font-mono">allowed_interns</code>.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 pt-2">
              {/* Email & Password Authentication Form */}
              <form onSubmit={handleFallbackSubmit} className="space-y-4" suppressHydrationWarning>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Terdaftar di SIAPkerja / MagangHub
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contoh: ahmad.fauzi@kemnaker.maganghub.id"
                      required
                      suppressHydrationWarning
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Kata Sandi / PIN Magang
                    </label>
                    <a
                      href="https://siapkerja.kemnaker.go.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Lupa kata sandi?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      suppressHydrationWarning
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      suppressHydrationWarning
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 font-bold mt-2"
                  isLoading={submitting}
                  disabled={submitting}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Masuk ke Portal Presensi
                </Button>

                {/* AESTHETIC CALLOUT: Activation / Registration for New Interns */}
                <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/5 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900 border border-blue-500/20 dark:border-blue-400/20 flex items-center justify-between gap-3 shadow-sm hover:border-blue-500/40 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        Peserta Magang Baru?
                        <span className="text-[10px] bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.5 rounded-full">
                          Aktivasi
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        Daftarkan kata sandi akun magang Anda
                      </div>
                    </div>
                  </div>
                  <a
                    href="/register"
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center gap-1"
                  >
                    <span>Mulai</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Supervisor / Admin discreet link */}
          <div className="mt-6 text-center">
            <a
              href="/admin/login"
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Akses Khusus Supervisor / HR CV. Asia Plastik →
            </a>
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
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold">Memuat Portal CV. Asia Plastik...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
