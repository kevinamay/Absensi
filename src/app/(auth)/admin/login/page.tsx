"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Shield,
  KeyRound,
} from "lucide-react";

function AdminLoginContent() {
  const router = useRouter();
  const { loginAdmin, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasCleanedUpRef = React.useRef(false);

  // Automatically clear intern session once when accessing supervisor login page
  useEffect(() => {
    if (!hasCleanedUpRef.current) {
      hasCleanedUpRef.current = true;
      try {
        const savedSession = localStorage.getItem("cv_asia_demo_user");
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed.role !== "admin" && parsed.role !== "supervisor") {
            localStorage.removeItem("cv_asia_demo_user");
            document.cookie = "cv_asia_session=; path=/; max-age=0; SameSite=Lax";
          }
        }
      } catch {
        localStorage.removeItem("cv_asia_demo_user");
        document.cookie = "cv_asia_session=; path=/; max-age=0; SameSite=Lax";
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Mohon lengkapi email dan kata sandi staf HR.");
      return;
    }

    setSubmitting(true);
    try {
      await loginAdmin(email, password);
      // Hard navigation to /admin ensures clean synchronization of admin session
      window.location.href = "/admin";
    } catch (err: any) {
      setSubmitting(false);
      console.warn("Direct HRD Admin login error:", err);
      setErrorMessage(
        err.message || "Email atau kata sandi administrator salah. Pastikan kredensial benar."
      );
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden font-sans">
      {/* 4K Industrial Factory Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/BG_CV ASIA.webp"
          alt="Gedung Pabrik CV. Asia Plastik Sidoarjo"
          fill
          priority
          unoptimized
          quality={100}
          className="object-cover object-center filter contrast-[1.05] brightness-90 dark:brightness-75 transition-all duration-300"
        />
        {/* Contrast Overlays */}
        <div className="absolute inset-0 bg-slate-950/30 dark:bg-slate-950/70 transition-colors duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-950/40" />
      </div>

      {/* Floating Theme Toggle at Top Right */}
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle />
      </div>

      {/* Floating Corporate Identity Header on Top Left (Clean Transparent Logo) */}
      <div className="absolute top-6 left-6 z-30">
        <Link href="/" className="flex items-center gap-3.5 group">
          <Image
            src="/images/logo.webp"
            alt="CV. Asia Plastik Logo"
            width={271}
            height={92}
            priority
            className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] group-hover:opacity-90 transition-opacity"
          />
          <div className="hidden sm:block border-l border-white/25 pl-3 py-0.5">
            <span className="text-sm font-black tracking-tight block text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
              CV. ASIA PLASTIK
            </span>
          </div>
        </Link>
      </div>

      {/* Centered Ultra-Frosted Luxury Card */}
      <div className="relative z-20 w-full max-w-lg my-auto pt-16 sm:pt-0">
        <div className="rounded-3xl border border-white/40 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-9 shadow-2xl backdrop-blur-3xl ring-1 ring-black/10 dark:ring-white/10 transition-all duration-300">
          
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/30 mb-3.5 border border-white/20">
              <Shield className="w-8 h-8 text-white drop-shadow" />
            </div>

            <Badge
              variant="warning"
              className="gap-1.5 mb-2.5 py-1 px-3 bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/80 text-amber-800 dark:text-amber-300 text-xs font-bold"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-500" />
              Akses Khusus Pembimbing & HRD
            </Badge>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Portal Supervisor Magang
            </h1>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 max-w-sm mx-auto leading-relaxed">
              Masuk untuk memantau kehadiran siswa/mahasiswa magang, memverifikasi izin, dan melakukan ACC akun baru.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Email Resmi Supervisor / HRD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staf.hrd@asiaplastik.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Kata Sandi Administrator
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:from-blue-600 hover:to-indigo-500 text-white font-black rounded-xl shadow-xl shadow-blue-700/25 border border-blue-400/20 cursor-pointer"
              isLoading={submitting}
              disabled={submitting}
            >
              {!submitting && <Lock className="w-4 h-4 mr-2" />}
              {submitting ? "Memverifikasi Supervisor..." : "Buka Konsol Monitoring HR"}
            </Button>
          </form>

          {/* Back to Intern Login Link */}
          <div className="mt-5 pt-4 text-center border-t border-slate-200 dark:border-white/10">
            <Link
              href="/login"
              className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Portal Siswa Magang
            </Link>
          </div>
        </div>

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

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold">Memuat Portal Supervisor CV. Asia Plastik...</p>
          </div>
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
