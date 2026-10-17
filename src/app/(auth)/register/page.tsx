"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  RegistrationWhitelistError,
  mapFirebaseAuthError,
} from "@/services/authService";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Factory,
} from "lucide-react";

function RegisterContent() {
  const router = useRouter();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [whitelistError, setWhitelistError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Client-side validations
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
      /**
       * Executes strict registration sequence:
       * 1. Query Firestore 'allowed_interns'
       * 2. If rejected -> throws RegistrationWhitelistError ('Registration Failed: Your email is not registered in the HRD whitelist.')
       * 3. If accepted -> createUserWithEmailAndPassword in Firebase Auth
       * 4. sendEmailVerification
       * 5. signOut(auth) immediately and redirect
       */
      await register(email.trim().toLowerCase(), password);

      // Redirect to verification notification page with email param
      router.push(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err: any) {
      console.warn("Registration attempt failed:", err);

      if (
        err instanceof RegistrationWhitelistError ||
        err?.name === "RegistrationWhitelistError" ||
        err?.message?.includes("Registration Failed")
      ) {
        // EXACT REQUIRED ERROR TEXT: Step B
        setWhitelistError("Registration Failed: Your email is not registered in the HRD whitelist.");
      } else {
        setValidationError(mapFirebaseAuthError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row relative transition-colors duration-200">
      {/* Floating Theme Toggle at top right */}
      <ThemeToggle />

      {/* LEFT COLUMN: Corporate Branding & Security Standard */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-blue-50/80 via-slate-100 to-indigo-50/60 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors duration-200">
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

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6">
            <Factory className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Pendaftaran Akun Presensi Mahasiswa & Siswa Magang
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 text-slate-900 dark:text-white">
            Aktivasi Akun Presensi Magang
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed mb-8">
            Hanya peserta yang telah lolos seleksi dan terdaftar dalam basis data resmi HRD CV. Asia Plastik 
            serta program Kementerian Ketenagakerjaan RI yang dapat mengaktifkan akun.
          </p>

          {/* Security Features Info Box */}
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm max-w-lg space-y-3.5 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Validasi Whitelist HRD Otomatis
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Email Anda akan langsung dicocokkan dengan data penetapan divisi pada koleksi <code className="text-blue-600 dark:text-blue-400 font-mono">allowed_interns</code>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Verifikasi Email Wajib (Email Verification)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Tautan konfirmasi aktivasi akan dikirimkan ke kotak masuk email Anda sebelum Anda dapat masuk ke aplikasi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Firebase Authentication Security Enforced</span>
          </div>
          <span>v2.4 Registrasi</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Registration Form */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Badge variant="info" className="gap-1.5 mb-2 py-1 px-3">
              <GraduationCap className="w-3.5 h-3.5" />
              Formulir Pendaftaran
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Buat Kata Sandi Akun
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gunakan email yang Anda daftarkan pada program MagangHub CV. Asia Plastik.
            </p>
          </div>

          {/* CRITICAL WHITELIST REJECTION ALERT (Step B) */}
          {whitelistError && (
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
                    Pendaftaran Ditolak
                  </h4>
                  <p className="text-xs font-semibold leading-relaxed text-rose-800 dark:text-rose-200">
                    {whitelistError}
                  </p>
                  <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 pt-1 leading-normal">
                    Email ini tidak terdaftar dalam daftar peserta magang yang disetujui HRD CV. Asia Plastik.
                    Hubungi bagian HRD atau periksa status penerimaan Anda pada portal MagangHub.
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://maganghub.kemnaker.go.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 underline underline-offset-2 hover:opacity-80"
                    >
                      Buka Portal MagangHub Kemnaker
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Standard Form / Firebase Error Banner */}
          {validationError && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <p className="leading-relaxed">{validationError}</p>
            </div>
          )}

          <Card className="border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-2xl backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Data Kredensial Baru</CardTitle>
              <CardDescription className="text-xs">
                Kredensial disimpan dengan enkripsi aman di Firebase Authentication.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Field 1: Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Alamat Email Terdaftar di MagangHub / SIAPkerja
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
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Field 2: New Password */}
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
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Field 3: Confirm Password */}
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
                      placeholder="Ulangi kata sandi di atas"
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
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

                {/* CRUCIAL UI TEXT: Security Warning Requirement */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="font-semibold leading-relaxed">
                    For your security, please create a new password for this application. DO NOT use your MagangHub/SIAPkerja password.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3.5 font-bold mt-2"
                  isLoading={loading}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Daftarkan Akun & Kirim Verifikasi
                </Button>
              </form>

              {/* Back to Login link */}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold">Memuat Pendaftaran CV. Asia Plastik...</p>
          </div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
