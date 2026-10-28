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
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden font-sans select-none">
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

      {/* Centered Neo-Glassmorphism Card Container (Variant C, clean without capsule bar) */}
      <div className="relative z-20 w-full max-w-lg my-auto pt-16 sm:pt-0">
        <div className="rounded-[2.25rem] border border-white/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/75 p-7 sm:p-10 shadow-[0_30px_70px_rgba(56,189,248,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-3xl ring-1 ring-sky-300/30 dark:ring-white/10 transition-all duration-300">
          
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto flex items-center justify-center mb-3.5 rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-600 to-indigo-600 text-white shadow-xl shadow-cyan-500/30 border border-white/30 transition-all">
              <Shield className="w-8 h-8 text-white drop-shadow" />
            </div>

            <Badge
              variant="warning"
              className="gap-1.5 mb-2.5 py-1 px-3 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 transition-all"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
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
                  <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staf.hrd@asiaplastik.com"
                  required
                  className="w-full pl-10 pr-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none transition-all placeholder:text-slate-400 rounded-2xl bg-white/80 dark:bg-slate-950/80 border border-sky-100 dark:border-white/10 focus:ring-2 focus:ring-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
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
                  <Lock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 text-slate-900 dark:text-white text-sm focus:outline-none transition-all placeholder:text-slate-400 rounded-2xl bg-white/80 dark:bg-slate-950/80 border border-sky-100 dark:border-white/10 focus:ring-2 focus:ring-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
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
              className="w-full py-3.5 text-white font-black cursor-pointer transition-all rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-xl shadow-cyan-600/25 border border-cyan-400/30"
              isLoading={submitting}
              disabled={submitting}
            >
              {!submitting && <Lock className="w-4 h-4 mr-2" />}
              {submitting ? "Memverifikasi Supervisor..." : "Buka Konsol Monitoring HR"}
            </Button>
          </form>
        </div>

        {/* Subtitle Footer info */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium transition-colors">
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
