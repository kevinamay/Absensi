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
} from "lucide-react";
import { LoginVariantProps } from "./types";

export function VariantB({
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
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors duration-300">
      {/* ============================================================== */}
      {/* BACKGROUND B: CINEMATIC MANUFACTURING PLANT BACKGROUND IMAGE   */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/factory-bg.jpg"
          alt="CV. Asia Plastik Injection Moulding Plant"
          fill
          priority
          className="object-cover object-center brightness-90 dark:brightness-75 scale-105 filter contrast-105 transition-all duration-300"
        />
        {/* Adaptive Scrim: Crisp white-tinted for Light mode, Deep Sapphire for Dark mode */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100/95 via-white/90 to-blue-50/85 dark:from-slate-950 dark:via-slate-950/92 dark:to-slate-950/82 transition-colors duration-300" />
        <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-950/30 mix-blend-multiply" />
        <div
          className="absolute inset-0 opacity-15 dark:opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ============================================================== */}
      {/* LEFT COLUMN: Industrial Credentials & Real-Time Production HUD */}
      {/* ============================================================== */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-slate-300/80 dark:border-slate-800/80 backdrop-blur-sm transition-colors duration-300">
        <div>
          {/* Header branding */}
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-blue-900/30 border border-blue-400/40">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block text-slate-900 dark:text-white drop-shadow-sm">
                CV. ASIA PLASTIK
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Industry & Injection Moulding • Sidoarjo
              </span>
            </div>
          </div>

          {/* Plant Operational HUD Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 dark:bg-blue-900/60 border border-blue-300/80 dark:border-blue-500/40 text-blue-800 dark:text-blue-200 text-xs font-semibold mb-6 shadow-sm backdrop-blur-md">
            <Factory className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Sidoarjo Injection Moulding Plant • Line Otomatisasi
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 text-slate-900 dark:text-white drop-shadow-sm">
            Sistem Presensi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-900 dark:from-blue-400 dark:via-indigo-300 dark:to-white">
              Pabrik CV. Asia Plastik
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-lg leading-relaxed mb-8">
            Portal otentikasi mandiri khusus siswa dan mahasiswa program magang bersertifikat Kementerian Ketenagakerjaan RI (SIAPkerja & MagangHub).
          </p>

          {/* Live Industrial Metrics / Telemetry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg mb-8">
            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-700/80 shadow-md dark:shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Waktu Sistem Pabrik
                </span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-mono px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800/60">
                  WIB
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {timeStr || "08:15:00 WIB"}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Jadwal Shift: Pagi (08:00 - 16:00)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-700/80 shadow-md dark:shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                  Geofence Validation
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-mono px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                  Haversine
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                150 Meter
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Koordinat Pabrik Terkunci
              </p>
            </div>
          </div>

          {/* Verification credentials */}
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Verifikasi Whitelist Kemnaker: <code className="text-blue-700 dark:text-blue-300 font-mono text-[11px]">allowed_interns</code> Aktif</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Standar Keamanan Industri Manufaktur Terintegrasi</span>
            </div>
          </div>
        </div>

        {/* Bottom trust footer */}
        <div className="pt-6 mt-8 border-t border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Plant Production Operational • Sidoarjo</span>
          </div>
          <span className="font-mono text-[11px]">Industrial Presensi v2.4 • Variant B</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: Elevated Industrial Dark Frosted Panel          */}
      {/* ============================================================== */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative z-10 backdrop-blur-[2px]">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Badge variant="info" className="gap-1.5 mb-2 py-1 px-3 bg-blue-50 dark:bg-blue-900/70 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-500/40">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-300" />
              Peserta Magang Terdaftar
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
              Otentikasi Akun Magang
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Masukkan email terverifikasi untuk mengakses portal presensi harian.
            </p>
          </div>

          {/* Access denied error */}
          {accessDeniedError && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/90 border-2 border-rose-500 text-rose-900 dark:text-rose-100 shadow-2xl backdrop-blur-xl animate-in fade-in"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 shadow-md">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-rose-700 dark:text-rose-300">Akses Ditolak / Unauthorized</h4>
                  <p className="text-xs font-semibold leading-relaxed text-rose-800 dark:text-rose-200">{accessDeniedError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Standard error banner */}
          {generalError && !accessDeniedError && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5 backdrop-blur-sm">
              <span className="font-bold mt-0.5">⚠️</span>
              <p className="leading-relaxed">{generalError}</p>
            </div>
          )}

          {/* Login Card */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-slate-900/5 dark:ring-white/10 relative overflow-hidden transition-colors duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Masuk ke Portal Presensi
              </span>
              <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800/80 font-mono">
                SIAPkerja Hub
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Email Terdaftar di SIAPkerja / MagangHub
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh: ahmad.fauzi@kemnaker.maganghub.id"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
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
                    <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/80 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                className="w-full py-3.5 font-bold mt-2 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white shadow-xl shadow-blue-900/30 border border-blue-400/30 rounded-xl"
                isLoading={submitting}
                disabled={submitting}
              >
                <Lock className="w-4 h-4 mr-2" />
                Masuk ke Portal Presensi
              </Button>

              {/* Activation callout */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 shadow-sm group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      Peserta Magang Baru?
                      <span className="text-[10px] bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.5 rounded-full border border-blue-400/30">
                        Aktivasi
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      Daftarkan kata sandi akun magang Anda
                    </div>
                  </div>
                </div>
                <Link
                  href="/register"
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1"
                >
                  <span>Mulai</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/admin/login"
              className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Akses Khusus Supervisor / HR CV. Asia Plastik →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
