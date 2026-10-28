"use client";

import React, { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  RegistrationWhitelistError,
  mapFirebaseAuthError,
  authService,
} from "@/services/authService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Lock,
  Mail,
  GraduationCap,
  AlertTriangle,
  AlertOctagon,
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  User,
  Building2,
  Clock,
} from "lucide-react";

function RegisterContent() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [whitelistError, setWhitelistError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState(false);
  const [registeredData, setRegisteredData] = useState<{
    fullName: string;
    email: string;
    institution: string;
  } | null>(null);

  // Dynamic password strength meter calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 33;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score += 34;
    if (/[^A-Za-z0-9]/.test(password) && password.length >= 8) score += 33;
    return score;
  };

  const strength = getPasswordStrength();

  // Client-side form validations
  const validateForm = (): boolean => {
    setWhitelistError(null);
    setValidationError(null);

    if (!fullName.trim() || fullName.trim().length < 3) {
      setValidationError("Silakan masukkan nama lengkap Anda (minimal 3 karakter).");
      return false;
    }

    if (!institution.trim() || institution.trim().length < 3) {
      setValidationError("Silakan masukkan asal sekolah / universitas Anda.");
      return false;
    }

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
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = fullName.trim();
      const cleanInst = institution.trim();

      /**
       * Direct Registration (Tanpa OTP):
       * Mendaftarkan akun langsung ke antrean persetujuan (ACC) HRD CV. Asia Plastik
       */
      await authService.registerInternOpen({
        email: cleanEmail,
        pass: password,
        fullName: cleanName,
        institution: cleanInst,
      });

      setRegisteredData({
        fullName: cleanName,
        email: cleanEmail,
        institution: cleanInst,
      });
      setIsRegisteredSuccess(true);
    } catch (err: any) {
      console.warn("Registration attempt failed:", err);
      setValidationError(err.message || mapFirebaseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-300 font-sans select-none">
      {/* Modern Aesthetic White Background with Organic Floating Light Blue Aurora Blobs */}
      <div className="absolute inset-0 z-0 bg-[#f8fbff] dark:bg-slate-950 overflow-hidden transition-colors duration-500">
        {/* Floating Aurora Blob 1 (Top-Right) */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/50 to-cyan-200/40 blur-3xl animate-pulse pointer-events-none dark:from-sky-900/30 dark:to-cyan-950/20" />
        {/* Floating Aurora Blob 2 (Bottom-Left) */}
        <div className="absolute -bottom-28 -left-28 w-[34rem] h-[34rem] rounded-full bg-gradient-to-tr from-blue-300/40 via-sky-200/50 to-indigo-200/30 blur-3xl pointer-events-none dark:from-blue-950/40 dark:via-sky-950/30" />
        {/* Floating Aurora Blob 3 (Top-Center) */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-gradient-to-b from-cyan-200/30 to-sky-100/50 blur-2xl pointer-events-none dark:from-cyan-950/20" />
      </div>

      {/* Floating Theme Toggle at Top Right */}
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle />
      </div>

      {/* Floating Corporate Identity Header on Top Left */}
      <div className="absolute top-6 left-6 z-30">
        <Link href="/" className="flex items-center gap-3.5 group">
          <Image
            src="/images/logo.webp"
            alt="CV. Asia Plastik Logo"
            width={271}
            height={92}
            priority
            className="h-10 sm:h-12 w-auto object-contain transition-all group-hover:opacity-90 filter brightness-0 dark:brightness-100 drop-shadow-sm opacity-90 dark:opacity-100"
          />
          <div className="hidden sm:block border-l border-slate-300 dark:border-white/20 pl-3 py-0.5 transition-colors">
            <span className="text-sm font-black tracking-tight block text-slate-900 dark:text-white transition-colors">
              CV. ASIA PLASTIK
            </span>
          </div>
        </Link>
      </div>

      {/* Main Glassmorphic Container (Responsive Dual Pane on Desktop) */}
      <div className="relative z-20 w-full max-w-4xl my-auto pt-16 sm:pt-0">
        {/* Critical Whitelist Rejection Error Banner */}
        {whitelistError && (
          <div
            role="alert"
            className="mb-4 p-4 rounded-2xl bg-rose-950/90 border-2 border-rose-500 text-rose-100 shadow-2xl backdrop-blur-xl animate-in fade-in"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 shadow-md">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-rose-300">Pendaftaran Ditolak / Unauthorized</h4>
                <p className="text-xs font-semibold leading-relaxed text-rose-200">{whitelistError}</p>
                <p className="text-[11px] text-rose-300/80 pt-0.5">
                  Email ini tidak terdaftar dalam basis data peserta magang yang disetujui HRD CV. Asia Plastik.
                </p>
                <div className="pt-2">
                  <a
                    href="https://maganghub.kemnaker.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-300 underline hover:text-white"
                  >
                    Buka Portal MagangHub Kemnaker <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 backdrop-blur-md">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <p className="leading-relaxed font-medium">{validationError}</p>
          </div>
        )}

        {!isRegisteredSuccess ? (
          /* Dual Pane Glass Card */
          <div className="rounded-[2.25rem] border border-white/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/85 p-6 sm:p-8 lg:p-10 shadow-[0_30px_70px_rgba(56,189,248,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-3xl ring-1 ring-sky-300/30 dark:ring-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-300">
            
            {/* LEFT PANE: Information & Stepper Guide */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 lg:border-r border-slate-300/60 dark:border-white/10 lg:pr-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-cyan-300 text-[11px] font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Sistem Pendaftaran Terbuka & Onboarding
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  Pendaftaran Akun Presensi
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Daftarkan data diri Anda untuk memulai magang industri. Akun Anda akan ditinjau dan disetujui (ACC) secara langsung oleh HRD CV. Asia Plastik.
                </p>
              </div>

              {/* Stepper Card */}
              <div className="p-4 rounded-2xl bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 space-y-3.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Tahapan Pendaftaran & Aktivasi:
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 animate-pulse">
                      1
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-blue-600 dark:text-cyan-300 block">1. Isi Data Diri & Akun (Saat ini)</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">Nama lengkap, asal sekolah/kampus, email & sandi</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">2. Persetujuan (ACC) oleh HRD</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">HRD meninjau permohonan di dashboard sebelum dapat login</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Pendaftaran Langsung & Persetujuan HRD Terpadu</span>
              </div>
            </div>

          {/* RIGHT PANE: Registration Form */}
          <div className="lg:col-span-7">
            <div className="mb-5">
              <Badge variant="info" className="gap-1.5 mb-1.5 py-1 px-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-cyan-300 text-xs">
                <GraduationCap className="w-3.5 h-3.5" />
                Formulir Pendaftaran Magang
              </Badge>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Daftar Akun Baru
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Lengkapi informasi pendaftaran Anda secara tepat untuk diproses oleh HRD.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5" suppressHydrationWarning>
              {/* Full Name Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Nama Lengkap Sesuai KTP / KTM
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="contoh: Kevin Christian Amay"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white/90 dark:bg-slate-950/70 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Institution Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Asal Sekolah / Universitas
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="contoh: Universitas Negeri Surabaya / SMKN 1 Sidoarjo"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white/90 dark:bg-slate-950/70 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Alamat Email Magang (Untuk Menerima OTP)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh: kevin.magang@gmail.com"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white/90 dark:bg-slate-950/70 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Kata Sandi Baru (New Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    required
                    minLength={6}
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white/90 dark:bg-slate-950/70 pl-10 pr-10 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                {/* Strength Meter Bar */}
                {password && (
                  <div className="mt-1.5">
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
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

              {/* Confirm Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  Konfirmasi Kata Sandi (Confirm Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    required
                    minLength={6}
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white/90 dark:bg-slate-950/70 pl-10 pr-10 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    suppressHydrationWarning
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* CRUCIAL UI SECURITY WARNING REQUIREMENT */}
              <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="font-semibold leading-relaxed">
                  For your security, please create a new password for this application. DO NOT use your MagangHub/SIAPkerja password.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 font-bold mt-2 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white shadow-xl shadow-blue-900/30 border border-blue-400/30 rounded-xl"
                isLoading={loading}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Daftar & Terima Kode OTP
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 text-center">
              <p className="text-xs text-slate-600 dark:text-slate-400">
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
        ) : (
          /* SUCCESS STATE: PENDING APPROVAL HRD */
          <div className="rounded-3xl border border-white/30 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 p-8 sm:p-12 shadow-2xl backdrop-blur-3xl ring-1 ring-black/10 dark:ring-white/10 text-center max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-5">
              <ShieldCheck className="w-11 h-11" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold mb-4">
              <Clock className="w-4 h-4 text-amber-500" />
              Status: Menunggu Persetujuan (ACC) HRD
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Pendaftaran Berhasil!
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed max-w-md mx-auto">
              Permohonan akun magang untuk <strong className="text-slate-900 dark:text-white">{registeredData?.fullName || email}</strong> telah berhasil didaftarkan ke sistem CV. Asia Plastik.
            </p>

            {/* Informative Guidance Box */}
            <div className="my-6 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-left space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  i
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white block font-semibold mb-1">
                    Tahap Selanjutnya:
                  </strong>
                  Data pendaftaran Anda saat ini sudah masuk ke antrean dasbor <strong>HRD CV. Asia Plastik</strong>. Tim HRD akan memverifikasi dan menyetujui (ACC) akun Anda sebelum Anda dapat melakukan presensi.
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-200 dark:border-white/10 flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Email Akun:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{registeredData?.email}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Asal Kampus / Sekolah:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{registeredData?.institution}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Status Akun:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">Menunggu ACC HRD</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full py-3.5 font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white shadow-xl shadow-blue-900/30 rounded-xl"
              >
                Ke Halaman Masuk (Login) <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <button
                type="button"
                onClick={() => {
                  setIsRegisteredSuccess(false);
                  setEmail("");
                  setFullName("");
                  setInstitution("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 underline pt-1 cursor-pointer block mx-auto"
              >
                Daftarkan akun magang lainnya
              </button>
            </div>
          </div>
        )}

        {/* Subtitle Footer info */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-white/80 drop-shadow">
            CV. Asia Plastik • Gedung & Pabrik Injection Moulding Sidoarjo
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold">Memuat Pendaftaran CV. Asia Plastik...</p>
          </div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
