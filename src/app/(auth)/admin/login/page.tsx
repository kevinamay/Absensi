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

// Three variants of the supervisor login background, switchable via ?variant=, on the existing /admin/login route.
import { useSearchParams } from "next/navigation";
import {
  PrototypeSwitcher,
  PrototypeVariantInfo,
} from "@/components/shared/PrototypeSwitcher";

const PROTOTYPE_VARIANTS: PrototypeVariantInfo[] = [
  {
    key: "A",
    name: "Soft Ambient Aura",
    description: "Putih bersih dengan pendaran cahaya radial biru muda halus & ambient studio modern",
  },
  {
    key: "B",
    name: "Precision Grid & Horizon",
    description: "Gradasi diagonal biru muda dengan tekstur mikro-grid presisi industrial & accent bar",
  },
  {
    key: "C",
    name: "Floating Fluid Aurora",
    description: "Kanvas putih dengan blob gradasi biru muda organik bernyawa & neo-glassmorphism",
  },
  {
    key: "original",
    name: "Foto Gedung (Lama)",
    description: "Tampilan awal dengan foto gedung pabrik CV. Asia Plastik",
  },
];

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAdmin, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasCleanedUpRef = React.useRef(false);

  // Read current prototype variant from URL query param (?variant=A|B|C|original)
  const rawVariant = searchParams.get("variant")?.toLowerCase();
  const currentVariant =
    rawVariant === "b"
      ? "B"
      : rawVariant === "c"
      ? "C"
      : rawVariant === "original"
      ? "original"
      : "A";
  const isOriginal = currentVariant === "original";

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
      {/* ========================================================= */}
      {/* BACKGROUND LAYER SELECTION ACCORDING TO PROTOTYPE VARIANT */}
      {/* ========================================================= */}
      {isOriginal && (
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
          <div className="absolute inset-0 bg-slate-950/30 dark:bg-slate-950/70 transition-colors duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-950/40" />
        </div>
      )}

      {currentVariant === "A" && (
        /* Variant A: Soft Ambient Aura (Pure White with Diffused Radial Sky Blue Orbs) */
        <div className="absolute inset-0 z-0 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500">
          {/* Top-Left Ambient Azure Glow */}
          <div className="absolute -top-32 -left-32 w-[42rem] h-[42rem] rounded-full bg-gradient-to-br from-sky-200/70 via-blue-100/40 to-transparent blur-3xl pointer-events-none dark:from-sky-900/30 dark:via-blue-950/20" />
          {/* Bottom-Right Soft Cyan/Sky Radial Glow */}
          <div className="absolute -bottom-36 -right-36 w-[45rem] h-[45rem] rounded-full bg-gradient-to-tl from-sky-200/80 via-cyan-100/50 to-transparent blur-3xl pointer-events-none dark:from-blue-900/30 dark:via-cyan-950/20" />
          {/* Centered Soft Halo behind card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full bg-sky-100/50 blur-3xl pointer-events-none dark:bg-sky-950/40" />
          {/* Subtle Aesthetic Vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-sky-100/25 dark:to-slate-950/60 pointer-events-none" />
        </div>
      )}

      {currentVariant === "B" && (
        /* Variant B: Precision Grid & Horizon (Diagonal Blue-White Wash + Micro Dot Matrix) */
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-white via-sky-50/80 to-blue-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/40 overflow-hidden transition-colors duration-500">
          {/* Precision Micro-dot matrix pattern */}
          <div
            className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#0284c7 0.9px, transparent 0.9px)",
              backgroundSize: "24px 24px",
              maskImage: "radial-gradient(ellipse at 50% 50%, black 50%, transparent 85%)",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 50%, transparent 85%)",
            }}
          />
          {/* Crisp Geometric Diagonal Accents */}
          <div className="absolute -top-40 right-0 w-[50rem] h-48 bg-gradient-to-r from-transparent via-sky-300/20 to-transparent -rotate-12 pointer-events-none" />
          <div className="absolute bottom-10 -left-20 w-[45rem] h-36 bg-gradient-to-r from-transparent via-blue-300/15 to-transparent -rotate-12 pointer-events-none" />
        </div>
      )}

      {currentVariant === "C" && (
        /* Variant C: Floating Fluid Aurora (Organically Animated Light Blue Blobs) */
        <div className="absolute inset-0 z-0 bg-[#f8fbff] dark:bg-slate-950 overflow-hidden transition-colors duration-500">
          {/* Floating Aurora Blob 1 (Top-Right) */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-sky-300/50 to-cyan-200/40 blur-3xl animate-pulse pointer-events-none dark:from-sky-900/30 dark:to-cyan-950/20" />
          {/* Floating Aurora Blob 2 (Bottom-Left) */}
          <div className="absolute -bottom-28 -left-28 w-[34rem] h-[34rem] rounded-full bg-gradient-to-tr from-blue-300/40 via-sky-200/50 to-indigo-200/30 blur-3xl pointer-events-none dark:from-blue-950/40 dark:via-sky-950/30" />
          {/* Floating Aurora Blob 3 (Top-Center) */}
          <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-gradient-to-b from-cyan-200/30 to-sky-100/50 blur-2xl pointer-events-none dark:from-cyan-950/20" />
        </div>
      )}

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
            className={`h-10 sm:h-12 w-auto object-contain transition-all group-hover:opacity-90 ${
              isOriginal
                ? "filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
                : "filter brightness-0 dark:brightness-100 drop-shadow-sm opacity-90 dark:opacity-100"
            }`}
          />
          <div
            className={`hidden sm:block border-l pl-3 py-0.5 transition-colors ${
              isOriginal
                ? "border-white/25"
                : "border-slate-300 dark:border-white/20"
            }`}
          >
            <span
              className={`text-sm font-black tracking-tight block transition-colors ${
                isOriginal
                  ? "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              CV. ASIA PLASTIK
            </span>
          </div>
        </Link>
      </div>

      {/* Centered Card Container */}
      <div className="relative z-20 w-full max-w-lg my-auto pt-16 sm:pt-0">
        <div
          className={`p-6 sm:p-9 transition-all duration-300 ${
            isOriginal
              ? "rounded-3xl border border-white/40 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 shadow-2xl backdrop-blur-3xl ring-1 ring-black/10 dark:ring-white/10"
              : currentVariant === "A"
              ? "rounded-3xl border border-sky-100/90 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 shadow-[0_25px_60px_-15px_rgba(14,165,233,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl ring-1 ring-sky-300/30 dark:ring-sky-500/10"
              : currentVariant === "B"
              ? "rounded-3xl border border-sky-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(2,132,199,0.12)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] ring-1 ring-sky-400/20 dark:ring-sky-500/10 relative overflow-hidden"
              : /* Variant C */
                "rounded-[2.25rem] border border-white/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/75 shadow-[0_30px_70px_rgba(56,189,248,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-3xl ring-1 ring-sky-300/30 dark:ring-white/10"
          }`}
        >
          {/* Variant B: Top Industrial Accent Bar */}
          {currentVariant === "B" && !isOriginal && (
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-600" />
          )}

          {/* Variant C: Top Floating Capsule Highlight */}
          {currentVariant === "C" && !isOriginal && (
            <div className="h-1.5 w-20 mx-auto rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 mb-6 shadow-sm shadow-sky-400/40" />
          )}

          {/* Card Header */}
          <div className="text-center mb-6">
            <div
              className={`w-16 h-16 mx-auto flex items-center justify-center mb-3.5 transition-all ${
                isOriginal
                  ? "rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 text-white shadow-xl shadow-indigo-600/30 border border-white/20"
                  : currentVariant === "A"
                  ? "rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-xl shadow-sky-500/25 border border-white/40"
                  : currentVariant === "B"
                  ? "rounded-2xl bg-gradient-to-b from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-600/30 border border-sky-300/40"
                  : /* Variant C */
                    "rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-600 to-indigo-600 text-white shadow-xl shadow-cyan-500/30 border border-white/30"
              }`}
            >
              <Shield className="w-8 h-8 text-white drop-shadow" />
            </div>

            <Badge
              variant="warning"
              className={`gap-1.5 mb-2.5 py-1 px-3 text-xs font-bold transition-all ${
                isOriginal
                  ? "bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/80 text-amber-800 dark:text-amber-300"
                  : currentVariant === "A"
                  ? "bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300"
                  : currentVariant === "B"
                  ? "bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/80 text-amber-800 dark:text-amber-300"
                  : /* Variant C */
                    "bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300"
              }`}
            >
              <KeyRound
                className={`w-3.5 h-3.5 ${
                  currentVariant === "A"
                    ? "text-sky-600 dark:text-sky-400"
                    : currentVariant === "C"
                    ? "text-indigo-500 dark:text-indigo-400"
                    : "text-amber-500"
                }`}
              />
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
                  <Mail
                    className={`w-4 h-4 ${
                      currentVariant === "C"
                        ? "text-cyan-600 dark:text-cyan-400"
                        : "text-blue-600 dark:text-cyan-400"
                    }`}
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staf.hrd@asiaplastik.com"
                  required
                  className={`w-full pl-10 pr-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none transition-all placeholder:text-slate-400 ${
                    currentVariant === "C"
                      ? "rounded-2xl bg-white/80 dark:bg-slate-950/80 border border-sky-100 dark:border-white/10 focus:ring-2 focus:ring-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : currentVariant === "A"
                      ? "rounded-xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      : "rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  }`}
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
                  <Lock
                    className={`w-4 h-4 ${
                      currentVariant === "C"
                        ? "text-cyan-600 dark:text-cyan-400"
                        : "text-blue-600 dark:text-cyan-400"
                    }`}
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className={`w-full pl-10 pr-11 py-3 text-slate-900 dark:text-white text-sm focus:outline-none transition-all placeholder:text-slate-400 ${
                    currentVariant === "C"
                      ? "rounded-2xl bg-white/80 dark:bg-slate-950/80 border border-sky-100 dark:border-white/10 focus:ring-2 focus:ring-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : currentVariant === "A"
                      ? "rounded-xl bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      : "rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-white/10 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  }`}
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
              className={`w-full py-3.5 text-white font-black cursor-pointer transition-all ${
                isOriginal
                  ? "rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:from-blue-600 hover:to-indigo-500 shadow-xl shadow-blue-700/25 border border-blue-400/20"
                  : currentVariant === "A"
                  ? "rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/25 border border-sky-300/30"
                  : currentVariant === "B"
                  ? "rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-600/25 border border-blue-500"
                  : /* Variant C */
                    "rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-xl shadow-cyan-600/25 border border-cyan-400/30"
              }`}
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
          <p
            className={`text-[11px] transition-colors ${
              isOriginal
                ? "text-white/80 drop-shadow"
                : "text-slate-500 dark:text-slate-400 font-medium"
            }`}
          >
            CV. Asia Plastik • Gedung & Pabrik Injection Moulding Sidoarjo
          </p>
        </div>
      </div>

      {/* Floating Interactive Prototype Switcher Bar at Bottom */}
      <PrototypeSwitcher
        variants={PROTOTYPE_VARIANTS}
        currentVariant={currentVariant}
      />
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
