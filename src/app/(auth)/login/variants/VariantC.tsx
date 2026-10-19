"use client";

import React from "react";
import Link from "next/link";
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
  Compass,
  Radio,
  Cpu,
} from "lucide-react";
import { LoginVariantProps } from "./types";

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
    <div className="min-h-screen w-full relative overflow-hidden bg-sky-50/40 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors duration-300">
      {/* ============================================================== */}
      {/* BACKGROUND C: BLUEPRINT ISOMETRIC GRID & PRECISION MATRIX      */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Deep Slate / Sky Blueprint Base */}
        <div className="absolute inset-0 bg-slate-50/80 dark:bg-[#080d1a] transition-colors duration-300" />

        {/* Blueprint Major & Minor Coordinate Grids */}
        <div
          className="absolute inset-0 opacity-25 dark:opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(14, 165, 233, 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(14, 165, 233, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute inset-0 opacity-15 dark:opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(14, 165, 233, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(14, 165, 233, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "12px 12px",
          }}
        />

        {/* Ambient Radial Spotlight Centered */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-400/10 dark:bg-sky-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-indigo-600/15 rounded-full blur-[150px]" />

        {/* Precision Crosshair Corner Accents */}
        <div className="absolute top-8 left-8 text-sky-700/50 dark:text-sky-500/30 font-mono text-[10px] select-none hidden sm:block">
          + LAT: -7.4529° S | LON: 112.7214° E [GEOFENCE ACTIVE]
        </div>
        <div className="absolute bottom-8 right-8 text-sky-700/50 dark:text-sky-500/30 font-mono text-[10px] select-none hidden sm:block">
          SYS_ID: AP-SDA-2026 // SECURE WHITELIST PROTOCOL
        </div>
      </div>

      {/* ============================================================== */}
      {/* LEFT COLUMN: Technical Precision Spec & Geofence Architecture  */}
      {/* ============================================================== */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-sky-300/60 dark:border-sky-500/20 backdrop-blur-[2px] transition-colors duration-300">
        <div>
          {/* Header branding */}
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 border border-sky-300/40">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block text-slate-900 dark:text-white font-mono">
                CV. ASIA PLASTIK
              </span>
              <span className="text-[11px] text-sky-700 dark:text-sky-400 font-mono tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400 animate-ping" />
                INDUSTRIAL INJECTION MOULDING • SIDOARJO
              </span>
            </div>
          </div>

          {/* Kemnaker Blueprint Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-500/40 text-sky-800 dark:text-sky-300 text-xs font-mono mb-6">
            <Radio className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-pulse" />
            <span>KEMNAKER RI CERTIFIED INTERNSHIP PROTOCOL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 text-slate-900 dark:text-white">
            Portal Presensi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 dark:from-sky-300 dark:via-blue-400 dark:to-indigo-300">
              Presisi Digital Magang
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-lg leading-relaxed mb-8">
            Infrastruktur kehadiran mandiri berbasis validasi GPS Haversine real-time dan otentikasi whitelist akun SIAPkerja Kemnaker RI.
          </p>

          {/* Telemetry and Geofence status tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg mb-8">
            <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-sky-500/30 shadow-sm dark:shadow-md">
              <div className="flex items-center justify-between text-xs font-mono text-sky-700 dark:text-sky-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  WAKTU PRESISI
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">LIVE</span>
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                {timeStr || "08:15:30 WIB"}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                Shift 08:00 WIB (Toleransi 15m)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-sky-200 dark:border-sky-500/30 shadow-sm dark:shadow-md">
              <div className="flex items-center justify-between text-xs font-mono text-sky-700 dark:text-sky-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                  GEOFENCE 150M
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">LOCKED</span>
              </div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Radius Sesuai
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                Pabrik Sidoarjo (Haversine OK)
              </p>
            </div>
          </div>

          {/* Security Architecture list */}
          <div className="space-y-2 max-w-lg font-mono text-xs">
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-sky-200 dark:border-sky-500/20">
              <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>Query Whitelist: <code className="text-sky-700 dark:text-sky-300">allowed_interns</code> (Firestore)</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-sky-200 dark:border-sky-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Autentikasi: Firebase Auth + Email Verification</span>
            </div>
          </div>
        </div>

        {/* Bottom trust footer */}
        <div className="pt-6 mt-8 border-t border-sky-200 dark:border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ENCRYPTED PROTOCOL • PLANT OPERATIONAL</span>
          </div>
          <span>VARIANT C • BLUEPRINT</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: Sharp High-Tech Auth Terminal                   */}
      {/* ============================================================== */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Badge variant="info" className="gap-1.5 mb-2 py-1 px-3 bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-500/50 text-sky-800 dark:text-sky-300 font-mono text-xs">
              <GraduationCap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              OTENTIKASI MAGANG KEMNAKER
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
              Terminal Masuk
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Masukkan kredensial email & kata sandi akun magang Anda.
            </p>
          </div>

          {/* Access denied error */}
          {accessDeniedError && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/90 border-2 border-rose-500 text-rose-900 dark:text-rose-100 shadow-xl backdrop-blur-xl animate-in fade-in"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0 shadow-md">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-rose-700 dark:text-rose-300 font-mono">AKSES DITOLAK (UNAUTHORIZED)</h4>
                  <p className="text-xs font-semibold leading-relaxed text-rose-800 dark:text-rose-200">{accessDeniedError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Standard error banner */}
          {generalError && !accessDeniedError && (
            <div className="mb-6 p-3 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 dark:border-amber-500/40 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5 backdrop-blur-sm">
              <span className="font-bold mt-0.5">⚠️</span>
              <p className="leading-relaxed">{generalError}</p>
            </div>
          )}

          {/* Login Card */}
          <div className="rounded-2xl border border-sky-300 dark:border-sky-500/30 bg-white/95 dark:bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-colors duration-300">
            {/* Blue edge accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-sky-500/20 mb-5">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono">
                <Lock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                OTENTIKASI AKUN
              </span>
              <span className="text-[10px] font-mono text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded border border-sky-300 dark:border-sky-600/60">
                WHITELIST ONLY
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5 font-mono">
                  EMAIL SIAPKERJA / MAGANGHUB
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600 dark:text-sky-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh: ahmad.fauzi@kemnaker.maganghub.id"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-slate-300 dark:border-sky-500/30 bg-white dark:bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-600 dark:focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 font-mono">
                    KATA SANDI / PIN
                  </label>
                  <a
                    href="https://siapkerja.kemnaker.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline font-mono"
                  >
                    Lupa sandi?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-600 dark:text-sky-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-slate-300 dark:border-sky-500/30 bg-white dark:bg-slate-950/80 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-600 dark:focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
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
                className="w-full py-3.5 font-bold mt-2 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-600/30 border border-sky-400/30 rounded-xl font-mono text-sm"
                isLoading={submitting}
                disabled={submitting}
              >
                <Lock className="w-4 h-4 mr-2" />
                MASUK KE PORTAL PRESENSI
              </Button>

              {/* Activation callout */}
              <div className="mt-4 p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-500/30 flex items-center justify-between gap-3 shadow-sm group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-mono">
                      Peserta Magang Baru?
                      <span className="text-[10px] bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold px-1.5 py-0.5 rounded border border-sky-300 dark:border-sky-400/30">
                        AKTIVASI
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-300 leading-tight">
                      Daftarkan kata sandi akun magang Anda
                    </div>
                  </div>
                </div>
                <Link
                  href="/register"
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1 font-mono"
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
              className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              Akses Khusus Supervisor / HR CV. Asia Plastik →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
