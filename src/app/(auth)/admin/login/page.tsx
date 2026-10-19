"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  AlertCircle,
  KeyRound,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Clock,
  Activity,
  CheckCircle2,
  Cpu,
  Layers,
  Terminal,
  Shield,
  Zap,
} from "lucide-react";

// ============================================================================
// PROTOTYPE METADATA & SWITCHER BAR
// ============================================================================
const VARIANTS = [
  { id: "A", name: "Variant A: Executive Dual-Pane Command" },
  { id: "B", name: "Variant B: Frosted Industrial Glass" },
  { id: "C", name: "Variant C: High-Tech Operations Console" },
];

function PrototypeSwitcher({ current, onSelect }: { current: string; onSelect: (id: string) => void }) {
  const currentIndex = VARIANTS.findIndex((v) => v.id === current);

  const prev = () => {
    const nextIdx = (currentIndex - 1 + VARIANTS.length) % VARIANTS.length;
    onSelect(VARIANTS[nextIdx].id);
  };

  const next = () => {
    const nextIdx = (currentIndex + 1) % VARIANTS.length;
    onSelect(VARIANTS[nextIdx].id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <aside
      aria-label="Prototipe Desain Login HRD"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-slate-900/90 dark:bg-black/90 text-white shadow-2xl border border-white/20 backdrop-blur-xl ring-1 ring-black/40 text-xs select-none animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-center gap-1.5 pr-2 border-r border-white/15 text-[11px] font-bold text-amber-400">
        <Sparkles className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">PILIH PROTOTIPE:</span>
      </div>

      <button
        onClick={prev}
        className="p-1 rounded-full hover:bg-white/15 transition-colors cursor-pointer text-slate-300 hover:text-white"
        title="Desain Sebelumnya (←)"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1 font-semibold px-2 py-0.5 rounded-lg bg-white/10 text-[11px] sm:text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{VARIANTS[currentIndex]?.name || VARIANTS[0].name}</span>
      </div>

      <button
        onClick={next}
        className="p-1 rounded-full hover:bg-white/15 transition-colors cursor-pointer text-slate-300 hover:text-white"
        title="Desain Berikutnya (→)"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </aside>
  );
}

// ============================================================================
// MAIN PAGE WRAPPER WITH SEARCH PARAM STATE
// ============================================================================
function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, setDemoUser } = useAuth();

  const variantParam = (searchParams.get("variant") || "A").toUpperCase();
  const currentVariant = VARIANTS.some((v) => v.id === variantParam) ? variantParam : "A";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectVariant = (id: string) => {
    router.replace(`/admin/login?variant=${id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Mohon lengkapi email dan kata sandi staf HR.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch (err: any) {
      console.warn("Direct Firebase Admin login error:", err);
      setErrorMessage(
        "Gagal masuk. Pastikan akun email Anda sudah didaftarkan oleh IT di Firebase Console."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    setDemoUser("admin");
    router.push("/admin");
  };

  const sharedProps = {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    submitting,
    errorMessage,
    handleSubmit,
    handleQuickDemo,
  };

  return (
    <>
      {currentVariant === "A" && <VariantA_DualPane {...sharedProps} />}
      {currentVariant === "B" && <VariantB_FrostedGlass {...sharedProps} />}
      {currentVariant === "C" && <VariantC_OperationsConsole {...sharedProps} />}

      <PrototypeSwitcher current={currentVariant} onSelect={handleSelectVariant} />
    </>
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
      <AdminLoginInner />
    </Suspense>
  );
}

// ============================================================================
// VARIANT A: EXECUTIVE DUAL-PANE SPLIT COMMAND
// Focus: Split-screen architecture, executive industrial brand, plant live telemetry
// ============================================================================
function VariantA_DualPane({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  submitting,
  errorMessage,
  handleSubmit,
  handleQuickDemo,
}: any) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTimeStr(
        new Intl.DateTimeFormat("id-ID", {
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

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-white relative overflow-hidden font-sans">
      {/* Top Floating Controls */}
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle />
      </div>

      {/* LEFT STAGE: Industrial Command & Factory Identity Showcase (55% on Desktop) */}
      <div className="lg:w-7/12 relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-[420px] lg:min-h-screen overflow-hidden">
        {/* Full 4K Factory Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/BG_CV ASIA.webp"
            alt="Gedung CV. Asia Plastik Sidoarjo"
            fill
            priority
            unoptimized
            quality={100}
            className="object-cover object-center filter contrast-[1.05] brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
        </div>

        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/login" className="flex items-center gap-3 group">
            <Image
              src="/images/logo.webp"
              alt="CV. Asia Plastik"
              width={271}
              height={92}
              priority
              className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:opacity-90 transition-opacity"
            />
            <div className="border-l border-white/25 pl-3 py-0.5">
              <span className="text-sm font-black tracking-tight block text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                CV. ASIA PLASTIK
              </span>
            </div>
          </Link>
        </div>

        {/* Center Hero Information */}
        <div className="relative z-10 my-auto py-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold mb-4 backdrop-blur-md shadow-lg shadow-indigo-950/50">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>PORTAL KHUSUS SUPERVISOR & HRD RESMI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Pusat Kendali <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
              Presensi & Magang
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-lg font-normal">
            Akses otentikasi aman untuk pemantauan presensi GPS geofencing, persetujuan (ACC) akun peserta, dan rekap evaluasi magang industri pabrik Sidoarjo.
          </p>

          {/* Plant Telemetry Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Lokasi Fasilitas</span>
              <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5 block">Sidoarjo Plant</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Security Level</span>
              <span className="text-xs sm:text-sm font-extrabold text-cyan-400 mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Tier-1 Encrypted
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Waktu Sistem</span>
              <span className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5 block font-mono">
                {timeStr || "WIB"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Back Link */}
        <div className="relative z-10 pt-4 flex items-center justify-between border-t border-white/10 text-xs text-slate-400">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 hover:text-cyan-300 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Portal Presensi Siswa/Mahasiswa
          </Link>
          <span className="hidden sm:inline font-mono text-[11px] text-slate-500">v2.4-PRODUCTION</span>
        </div>
      </div>

      {/* RIGHT STAGE: Executive Login Card Container (45% on Desktop) */}
      <div className="lg:w-5/12 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-slate-900/90 dark:bg-slate-950/95 border-t lg:border-t-0 lg:border-l border-white/10 backdrop-blur-2xl relative z-20">
        <div className="w-full max-w-md">
          {/* Form Header */}
          <div className="mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Otentikasi Staf HR
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Masukkan kredensial resmi supervisor Anda untuk membuka konsol monitoring presensi.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Resmi HR / Perusahaan
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staf.hrd@asiaplastik.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Kata Sandi Administrator
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-blue-700/30 border border-blue-400/20"
              isLoading={submitting}
            >
              <Lock className="w-4 h-4 mr-2" />
              Buka Konsol Monitoring HR
            </Button>
          </form>

          {/* Quick Demo Evaluation Box */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
              <div className="flex items-center gap-1.5 text-xs font-bold mb-2 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                Evaluasi Cepat (Supervisor Demo):
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleQuickDemo}
                className="w-full text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30 rounded-xl py-2.5 cursor-pointer"
              >
                Masuk Langsung sbg Supervisor HR
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[11px] font-mono text-slate-500">
              RESTRICTED TO AUTHORIZED HR PERSONNEL ONLY
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VARIANT B: FROSTED INDUSTRIAL GLASS
// Focus: Full-screen 4K building view, luxury frosted glass, floating badge
// ============================================================================
function VariantB_FrostedGlass({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  submitting,
  errorMessage,
  handleSubmit,
  handleQuickDemo,
}: any) {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden font-sans">
      {/* 4K Industrial Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/BG_CV ASIA.webp"
          alt="Gedung Pabrik CV. Asia Plastik"
          fill
          priority
          unoptimized
          quality={100}
          className="object-cover object-center filter contrast-[1.05] brightness-90 dark:brightness-75"
        />
        <div className="absolute inset-0 bg-slate-950/30 dark:bg-slate-950/70 transition-colors" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-950/40" />
      </div>

      {/* Top Floating Controls */}
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle />
      </div>

      {/* Top Left Branding */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 hover:from-blue-600 hover:to-indigo-500 text-white font-black rounded-xl shadow-xl shadow-blue-700/25 border border-blue-400/20"
              isLoading={submitting}
            >
              <Lock className="w-4 h-4 mr-2" />
              Buka Konsol Monitoring HR
            </Button>
          </form>

          {/* Quick Demo Simulator */}
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Mode Cepat untuk Pengujian (Evaluasi):
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleQuickDemo}
              className="w-full text-xs font-bold py-2.5 rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Masuk Langsung sbg Supervisor HR
            </Button>
          </div>

          <div className="mt-4 pt-3 text-center border-t border-slate-100 dark:border-white/5">
            <Link
              href="/login"
              className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Portal Siswa Magang
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-white/80 drop-shadow">
            CV. Asia Plastik • Gedung & Pabrik Injection Moulding Sidoarjo
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VARIANT C: HIGH-TECH OPERATIONS CONSOLE
// Focus: Industrial ERP / SCADA dark control room, security audit badges, live telemetry
// ============================================================================
function VariantC_OperationsConsole({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  submitting,
  errorMessage,
  handleSubmit,
  handleQuickDemo,
}: any) {
  return (
    <div className="min-h-screen w-full bg-[#0a0f1d] text-slate-200 relative flex items-center justify-center p-4 sm:p-6 overflow-hidden font-sans">
      {/* High-Tech Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Floating Controls */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          SYS-NODE: ONLINE
        </div>
        <ThemeToggle />
      </div>

      {/* Main Console Box */}
      <div className="relative z-10 w-full max-w-xl my-auto">
        {/* Terminal Header Bar */}
        <div className="rounded-t-2xl bg-slate-900 border border-slate-800 border-b-0 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-mono font-bold text-slate-400 ml-2">
              HR-GATEWAY-AUTH // ASIA_PLASTIK_SDA
            </span>
          </div>

          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            PORT: 3000-SSL
          </span>
        </div>

        {/* Console Body */}
        <div className="rounded-b-2xl bg-slate-950/95 border border-slate-800 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl">
          {/* Logo & Headline */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  INTERNAL ACCESS
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: SEC-OPS-01</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Konsol Supervisor Presensi
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Otentikasi mandatori untuk pengawas & HRD CV. Asia Plastik.
              </p>
            </div>

            <Image
              src="/images/logo.webp"
              alt="CV. Asia Plastik Logo"
              width={271}
              height={92}
              priority
              className="h-10 w-auto object-contain filter drop-shadow hidden sm:block"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Operator Identity (Email HR)
                </label>
                <span className="text-[10px] font-mono text-cyan-400">@asiaplastik.com</span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staf.hrd@asiaplastik.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Master Key (Password)
                </label>
                <span className="text-[10px] font-mono text-slate-500">AES-256</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-4 pr-11 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-600/25 border border-cyan-400 tracking-wide font-mono"
              isLoading={submitting}
            >
              <Terminal className="w-4 h-4 mr-2" />
              INITIATE SUPERVISOR SESSION
            </Button>
          </form>

          {/* Quick Demo Simulator */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>BYPASS AUTH: INSTANT SUPERVISOR ACCESS</span>
            </button>
          </div>

          {/* Footer Warning & Back Link */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <Link
              href="/login"
              className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1 font-mono text-[11px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Portal Siswa
            </Link>
            <span className="font-mono text-[10px] text-slate-600">
              AUDIT LOG: ALL IP ATTEMPTS RECORDED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
