"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  RegistrationWhitelistError,
  mapFirebaseAuthError,
} from "@/services/authService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Building2,
  Lock,
  Mail,
  GraduationCap,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Factory,
  Sparkles,
  Check,
  ChevronRight,
  Fingerprint,
  Cpu,
  Layers,
  Compass,
} from "lucide-react";

type PrototypeVariant = "A" | "B" | "C";

interface RegisterFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (val: boolean) => void;
  loading: boolean;
  whitelistError: string | null;
  validationError: string | null;
  handleSubmit: (e: React.FormEvent) => void;
}

// ==============================================================================
// VARIAN A: Glassmorphic Stepper (Corporate Glassmorphism + 3-Step Visual Progress)
// ==============================================================================
function VariantA({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  loading,
  whitelistError,
  validationError,
  handleSubmit,
}: RegisterFormProps) {
  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 33;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score += 34;
    if (/[^A-Za-z0-9]/.test(password) && password.length >= 8) score += 33;
    return score;
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row relative transition-colors duration-200">
      <ThemeToggle />

      {/* Left Column: Glassmorphic Showcase */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-blue-50/80 via-slate-100 to-indigo-50/60 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
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

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Varian A: Corporate Glassmorphic Stepper
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 text-slate-900 dark:text-white">
            Aktivasi Akun Presensi Magang
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed mb-8">
            Sistem otomatis memverifikasi kecocokan email Anda dengan data MagangHub/SIAPkerja yang telah disetujui HRD CV. Asia Plastik.
          </p>

          {/* Stepper Trail */}
          <div className="max-w-md p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md space-y-4 mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Tahapan Aktivasi Akun:
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">1. Lolos Seleksi Magang</span>
                  <span className="text-slate-500 dark:text-slate-400">Terdaftar pada whitelist HRD CV. Asia Plastik</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                  2
                </div>
                <div className="text-xs">
                  <span className="font-bold text-blue-600 dark:text-blue-400 block">2. Buat Kata Sandi Akun (Saat ini)</span>
                  <span className="text-slate-500 dark:text-slate-400">Kredensial khusus aplikasi presensi lokal</span>
                </div>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div className="text-xs">
                  <span className="font-bold block">3. Verifikasi Link Email</span>
                  <span className="text-slate-500 dark:text-slate-400">Aktivasi melalui tautan di kotak masuk</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Kredensial Terenkripsi Firebase Auth</span>
          </div>
          <span>Presensi v2.4</span>
        </div>
      </div>

      {/* Right Column: Glassmorphic Form */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Badge variant="info" className="gap-1.5 mb-2 py-1 px-3">
              <GraduationCap className="w-3.5 h-3.5" />
              Portal Registrasi
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Buat Kata Sandi Akun
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gunakan email yang Anda daftarkan pada program MagangHub CV. Asia Plastik.
            </p>
          </div>

          {/* CRITICAL WHITELIST REJECTION ALERT */}
          {whitelistError && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-500/80 text-rose-900 dark:text-rose-100 shadow-lg shadow-rose-500/10 animate-in fade-in slide-in-from-top-2"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0 shadow-md">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-rose-700 dark:text-rose-300">
                    Pendaftaran Ditolak
                  </h4>
                  <p className="text-xs font-semibold leading-relaxed text-rose-800 dark:text-rose-200">
                    {whitelistError}
                  </p>
                  <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 pt-1">
                    Email ini tidak terdaftar dalam daftar peserta magang yang disetujui HRD CV. Asia Plastik.
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://maganghub.kemnaker.go.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 underline"
                    >
                      Buka Portal MagangHub Kemnaker <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {validationError && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <p className="leading-relaxed">{validationError}</p>
            </div>
          )}

          <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Alamat Email Terdaftar
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
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kata Sandi Baru (New Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Strength Meter Bar */}
                {password && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength <= 33
                            ? "w-1/3 bg-rose-500"
                            : strength <= 67
                            ? "w-2/3 bg-amber-500"
                            : "w-full bg-emerald-500"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Konfirmasi Kata Sandi (Confirm Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* CRUCIAL UI WARNING REQUIREMENT */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="font-semibold leading-relaxed">
                  For your security, please create a new password for this application. DO NOT use your MagangHub/SIAPkerja password.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5 font-bold mt-2 shadow-lg shadow-blue-500/20"
                isLoading={loading}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Daftarkan Akun & Kirim Verifikasi
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sudah pernah mengaktifkan akun?{" "}
                <Link
                  href="/login"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 ml-1"
                >
                  Masuk di sini <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// VARIAN B: Minimalist Industrial Linear (High-Density Tech Luxury)
// ==============================================================================
function VariantB({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  loading,
  whitelistError,
  validationError,
  handleSubmit,
}: RegisterFormProps) {
  const isMatch = password && confirmPassword && password === confirmPassword;
  const isLongEnough = password.length >= 6;
  const hasEmail = email.includes("@") && email.includes(".");

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-8 relative transition-colors duration-200">
      <ThemeToggle />

      <div className="w-full max-w-xl relative z-10">
        {/* Top Minimalist Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-sm">
              AP
            </div>
            <div>
              <span className="font-mono text-xs font-bold tracking-wider uppercase block text-slate-900 dark:text-white">
                CV. ASIA PLASTIK // SIDOARJO
              </span>
              <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 block">
                SYSTEM: MAGANGHUB_AUTH_SERVICE
              </span>
            </div>
          </div>
          <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md">
            VARIAN B: LINEAR TECH
          </span>
        </div>

        {whitelistError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold uppercase tracking-wider">SEC_ERR // WHITELIST_REJECTED</div>
              <div>{whitelistError}</div>
            </div>
          </div>
        )}

        {validationError && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Aktivasi Akun Peserta Magang
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              [INPUT CREDENTIALS FOR INDUSTRIAL ATTENDANCE SYSTEM]
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                <span>01 // EMAIL TERDAFTAR</span>
                {hasEmail && <span className="text-emerald-500 text-[11px]">FORMAT_OK</span>}
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama.peserta@kemnaker.maganghub.id"
                required
                className="w-full font-mono text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  02 // KATA SANDI BARU
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 char"
                    required
                    minLength={6}
                    className="w-full font-mono text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white transition-all pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <div className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  03 // KONFIRMASI SANDI
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi sandi"
                    required
                    minLength={6}
                    className="w-full font-mono text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-white transition-all pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Security Checklist Pills */}
            <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
              <span className={`px-2 py-1 rounded border flex items-center gap-1 ${
                hasEmail ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400"
              }`}>
                {hasEmail ? "✓" : "○"} Valid Email
              </span>
              <span className={`px-2 py-1 rounded border flex items-center gap-1 ${
                isLongEnough ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400"
              }`}>
                {isLongEnough ? "✓" : "○"} Min 6 Karakter
              </span>
              <span className={`px-2 py-1 rounded border flex items-center gap-1 ${
                isMatch ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400"
              }`}>
                {isMatch ? "✓" : "○"} Password Cocok
              </span>
            </div>

            {/* CRUCIAL UI WARNING REQUIREMENT */}
            <div className="p-3.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs font-mono leading-relaxed">
              <strong>[SECURITY ADVISORY]:</strong> For your security, please create a new password for this application. DO NOT use your MagangHub/SIAPkerja password.
            </div>

            <Button
              type="submit"
              className="w-full py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-mono font-bold text-xs"
              isLoading={loading}
            >
              DAFTARKAN_AKUN() →
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center font-mono text-xs text-slate-500">
            Sudah terdaftar?{" "}
            <Link href="/login" className="text-slate-900 dark:text-white font-bold hover:underline">
              [MASUK_KE_PORTAL]
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// VARIAN C: Interactive Split Bento (Live Department & Whitelist Preview)
// ==============================================================================
function VariantC({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  loading,
  whitelistError,
  validationError,
  handleSubmit,
}: RegisterFormProps) {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative transition-colors duration-200">
      <ThemeToggle />

      <div className="w-full max-w-4xl relative z-10 space-y-6">
        {/* Header Bento Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white">
                CV. Asia Plastik • Portal Aktivasi Peserta Magang
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Integrasi Database Whitelist Kemnaker RI & Geofencing GPS 150m Sidoarjo
              </p>
            </div>
          </div>
          <Badge variant="neutral" className="self-start sm:self-auto py-1 px-3 text-xs bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30">
            Varian C: Split Bento Card
          </Badge>
        </div>

        {whitelistError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-500 shrink-0" />
            <div>{whitelistError}</div>
          </div>
        )}

        {validationError && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>{validationError}</span>
          </div>
        )}

        {/* 2-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bento Left: Registration Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Buat Kredensial Akun Baru
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Lengkapi formulir berikut dengan email MagangHub terdaftar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email MagangHub / SIAPkerja
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmad.fauzi@kemnaker.maganghub.id"
                  required
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 karakter"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Konfirmasi Sandi
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi sandi"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* CRUCIAL UI WARNING REQUIREMENT */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs leading-relaxed font-semibold">
                ⚠️ For your security, please create a new password for this application. DO NOT use your MagangHub/SIAPkerja password.
              </div>

              <Button
                type="submit"
                className="w-full py-3.5 font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25"
                isLoading={loading}
              >
                Aktivasi Akun & Lanjut ke Verifikasi →
              </Button>
            </form>
          </div>

          {/* Bento Right: Live Whitelist Inspection & Factory Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white border border-indigo-800/50 shadow-xl relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold border border-white/20">
                <Compass className="w-3.5 h-3.5" />
                Live Whitelist Guard
              </div>

              <h3 className="text-xl font-black">
                Validasi Otomatis Koleksi Firestore
              </h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Setelah Anda mendaftar, akun akan otomatis disinkronkan dengan data penempatan divisi di pabrik CV. Asia Plastik.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between text-xs">
                  <span>Radius Pabrik Sidoarjo</span>
                  <span className="font-bold text-emerald-400">150 Meter GPS</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between text-xs">
                  <span>Koleksi Whitelist</span>
                  <span className="font-mono text-indigo-300">allowed_interns</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between text-xs">
                  <span>Enkripsi Kredensial</span>
                  <span className="font-bold text-blue-300">Firebase Auth</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-indigo-300 relative z-10">
              <span>Sudah aktif?</span>
              <Link href="/login" className="font-bold text-white hover:underline flex items-center gap-1">
                Masuk Portal <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================================================================
// PROTOTYPE SWITCHER (Floating Bottom Pill per prototype skill)
// ==============================================================================
function PrototypeSwitcher({
  current,
  onChange,
}: {
  current: PrototypeVariant;
  onChange: (v: PrototypeVariant) => void;
}) {
  const variants: { key: PrototypeVariant; label: string }[] = [
    { key: "A", label: "A: Glassmorphic Stepper" },
    { key: "B", label: "B: Minimalist Linear" },
    { key: "C", label: "C: Split Bento Card" },
  ];

  const currentIndex = variants.findIndex((v) => v.key === current);

  const prev = () => {
    const nextIdx = (currentIndex - 1 + variants.length) % variants.length;
    onChange(variants[nextIdx].key);
  };

  const next = () => {
    const nextIdx = (currentIndex + 1) % variants.length;
    onChange(variants[nextIdx].key);
  };

  // Keyboard navigation (← and →) when not inside an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <div className="px-4 py-2.5 rounded-full bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 shadow-2xl border border-white/20 dark:border-slate-800 backdrop-blur-lg flex items-center gap-3 text-xs font-semibold">
        <button
          onClick={prev}
          aria-label="Previous Variant"
          className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>

        <span className="font-mono text-[11px] tracking-wide px-1">
          {variants[currentIndex].label}
        </span>

        <button
          onClick={next}
          aria-label="Next Variant"
          className="p-1 rounded-full hover:bg-white/20 dark:hover:bg-slate-200 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ==============================================================================
// MAIN WRAPPER COMPONENT
// ==============================================================================
function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();

  const variantParam = (searchParams.get("variant")?.toUpperCase() as PrototypeVariant) || "A";
  const [variant, setVariant] = useState<PrototypeVariant>(
    ["A", "B", "C"].includes(variantParam) ? variantParam : "A"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [whitelistError, setWhitelistError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleVariantChange = (newV: PrototypeVariant) => {
    setVariant(newV);
    const params = new URLSearchParams(window.location.search);
    params.set("variant", newV);
    router.replace(`/register?${params.toString()}`);
  };

  const validateForm = (): boolean => {
    setWhitelistError(null);
    setValidationError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setValidationError("Silakan masukkan alamat email Anda.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setValidationError("Format email tidak valid. Pastikan penulisan email Anda benar.");
      return false;
    }

    if (!password) {
      setValidationError("Silakan masukkan kata sandi baru.");
      return false;
    }

    if (password.length < 6) {
      setValidationError("Kata sandi harus terdiri dari minimal 6 karakter.");
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError("Konfirmasi kata sandi tidak cocok. Pastikan kedua kolom kata sandi sama.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setWhitelistError(null);
    setValidationError(null);

    try {
      await register(email.trim().toLowerCase(), password);
      router.push(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err: any) {
      console.warn("Registration attempt failed:", err);

      if (
        err instanceof RegistrationWhitelistError ||
        err?.name === "RegistrationWhitelistError" ||
        err?.message?.includes("Registration Failed")
      ) {
        setWhitelistError("Registration Failed: Your email is not registered in the HRD whitelist.");
      } else {
        setValidationError(mapFirebaseAuthError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const formProps: RegisterFormProps = {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    whitelistError,
    validationError,
    handleSubmit,
  };

  return (
    <>
      {variant === "A" && <VariantA {...formProps} />}
      {variant === "B" && <VariantB {...formProps} />}
      {variant === "C" && <VariantC {...formProps} />}

      {/* Floating Switcher for Prototype Evaluation */}
      <PrototypeSwitcher current={variant} onChange={handleVariantChange} />
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold">Memuat Prototype Pendaftaran...</p>
          </div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
