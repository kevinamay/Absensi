"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Lock,
  Mail,
  GraduationCap,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Factory,
  AlertOctagon,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Cpu,
  Compass,
} from "lucide-react";
import { LoginVariantProps } from "./types";

/**
 * VARIAN C: Angled Architectural Geometry
 * Terinspirasi langsung dari garis arsitektur fasad panel biru & silver gedung CV. Asia Plastik.
 * Menggunakan diagonal cut modern yang dinamis dan berenergi tinggi.
 */
export function VariantC({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  submitting,
  accessDeniedError,
  generalError,
  timeStr,
  handleSubmit,
}: LoginVariantProps) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-900 text-slate-100 flex flex-col lg:flex-row transition-colors duration-300">
      {/* ============================================================== */}
      {/* LEFT SECTION: ANGLED ARCHITECTURAL PHOTO CUT                   */}
      {/* ============================================================== */}
      <div className="lg:w-[55%] relative min-h-[420px] lg:min-h-screen overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-16">
        {/* Full Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/asia-plastik-building.png"
            alt="Fasad Arsitektur CV. Asia Plastik"
            fill
            priority
            className="object-cover object-top filter contrast-[1.1] brightness-90"
          />
          {/* Subtle blue gradient overlay matching the building's royal blue panels */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/90 via-slate-950/60 to-transparent" />
        </div>

        {/* Diagonal Geometric Accent Divider on Large Screens */}
        <div
          className="hidden lg:block absolute -right-16 top-0 bottom-0 w-32 bg-slate-900 z-10 transform skew-x-[-6deg] origin-top border-l-4 border-blue-500 shadow-2xl"
        />

        {/* Top Branding with real 'ap' logo style */}
        <div className="relative z-20">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#0057b7] border-2 border-white/50 text-white flex items-center justify-center shadow-2xl">
              <span className="font-black text-2xl tracking-tighter">ap</span>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block text-white font-mono drop-shadow">
                CV. ASIA PLASTIK
              </span>
              <span className="text-xs text-sky-300 font-mono tracking-wider uppercase drop-shadow flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                INDUSTRIAL INJECTION MOULDING • SIDOARJO
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-900/80 border border-blue-400/40 text-sky-200 text-xs font-mono mb-4 shadow-lg backdrop-blur-md">
            <Factory className="w-3.5 h-3.5 text-sky-400" />
            <span>HQ & PRODUCTION FACILITY • JAWA TIMUR</span>
          </div>
        </div>

        {/* Bottom Hero Context */}
        <div className="relative z-20 pt-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 text-white drop-shadow-md">
            Portal Presensi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-white">
              Siswa & Mahasiswa Magang
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-lg leading-relaxed mb-6 drop-shadow">
            Sistem presensi resmi bagi peserta magang bersertifikat Kementerian Ketenagakerjaan RI di gedung CV. Asia Plastik.
          </p>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-sky-400/30 text-sky-300 backdrop-blur-md">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{timeStr || "08:15:30 WIB"}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-sky-400/30 text-sky-300 backdrop-blur-md">
              <Compass className="w-4 h-4 text-rose-400" />
              <span>Radius 150m Haversine</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT SECTION: MODERN HIGH-CONTRAST AUTH TERMINAL             */}
      {/* ============================================================== */}
      <div className="lg:w-[45%] p-6 sm:p-12 lg:p-16 flex items-center justify-center relative z-20 bg-slate-900 dark:bg-slate-950 transition-colors duration-300">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Badge variant="info" className="gap-1.5 mb-2 py-1 px-3 bg-blue-950 border border-blue-500/50 text-blue-300 font-mono text-xs">
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              OTENTIKASI MAGANG KEMNAKER
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
              Terminal Presensi
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Gunakan email SIAPkerja / MagangHub yang telah terdaftar.
            </p>
          </div>

          {/* Access denied error */}
          {accessDeniedError && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-rose-950/90 border-2 border-rose-500 text-rose-100 shadow-xl backdrop-blur-xl animate-in fade-in"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0 shadow-md">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-rose-300 font-mono">AKSES DITOLAK (UNAUTHORIZED)</h4>
                  <p className="text-xs font-semibold leading-relaxed text-rose-200">{accessDeniedError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Standard error banner */}
          {generalError && !accessDeniedError && (
            <div className="mb-6 p-3 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 backdrop-blur-sm">
              <span className="font-bold mt-0.5">⚠️</span>
              <p className="leading-relaxed">{generalError}</p>
            </div>
          )}

          {/* Authentication Card */}
          <div className="rounded-2xl border border-blue-500/30 bg-slate-800/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-600" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-5">
              <span className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <Lock className="w-4 h-4 text-blue-400" />
                KREDENSIAL AKUN
              </span>
              <span className="text-[10px] font-mono text-sky-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-700/60">
                WHITELIST CHECK
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  EMAIL SIAPKERJA / MAGANGHUB
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh: ahmad.fauzi@kemnaker.maganghub.id"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 font-mono">
                    KATA SANDI / PIN
                  </label>
                  <a
                    href="https://siapkerja.kemnaker.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-sky-400 hover:underline font-mono"
                  >
                    Lupa sandi?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    suppressHydrationWarning
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3.5 font-bold mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30 rounded-xl font-mono text-sm"
                isLoading={submitting}
                disabled={submitting}
              >
                <Lock className="w-4 h-4 mr-2" />
                MASUK KE PORTAL PRESENSI
              </Button>

              {/* Activation callout */}
              <div className="mt-4 p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between gap-3 shadow-md group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                      Peserta Magang Baru?
                      <span className="text-[10px] bg-blue-500/30 text-sky-200 font-bold px-1.5 py-0.5 rounded border border-blue-400/30">
                        AKTIVASI
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 leading-tight">
                      Daftarkan kata sandi akun magang Anda
                    </div>
                  </div>
                </div>
                <Link
                  href="/register"
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1 font-mono"
                >
                  <span>Mulai</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center font-mono">
            <Link
              href="/admin/login"
              className="text-[11px] text-slate-400 hover:text-sky-400 transition-colors"
            >
              Akses Khusus Supervisor / HR CV. Asia Plastik →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
