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

/**
 * VARIAN A: Split-View Corporate Showcase
 * Foto gedung CV. Asia Plastik tampil megah di sisi kiri dengan overlay gradien tipis,
 * sedangkan form login di sisi kanan sangat bersih, mudah dibaca, dan elegan.
 */
export function VariantA({
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
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors duration-300">
      {/* ============================================================== */}
      {/* LEFT COLUMN: Real CV. Asia Plastik Building Showcase           */}
      {/* ============================================================== */}
      <div className="lg:w-1/2 min-h-[420px] lg:min-h-screen relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        {/* Background Building Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/asia-plastik-building.png"
            alt="Gedung Utama CV. Asia Plastik Sidoarjo"
            fill
            priority
            className="object-cover object-center filter contrast-[1.05]"
          />
          {/* Subtle gradient overlay to keep text legible while preserving the building photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/30" />
        </div>

        {/* Top Header Branding over Building */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-900/50 border border-white/40 backdrop-blur-md">
              <span className="font-black text-xl tracking-tighter">ap</span>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block text-white drop-shadow-md">
                CV. ASIA PLASTIK
              </span>
              <span className="text-xs text-blue-300 font-semibold tracking-wider uppercase flex items-center gap-1.5 drop-shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                Industry & Injection Moulding • Sidoarjo
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/80 border border-blue-400/40 text-blue-100 text-xs font-semibold mb-4 shadow-md backdrop-blur-md">
            <Factory className="w-4 h-4 text-cyan-300" />
            Kantor & Pabrik Utama Sidoarjo, Jawa Timur
          </div>
        </div>

        {/* Bottom Hero Text & Telemetry over Building */}
        <div className="relative z-10 pt-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 text-white drop-shadow-lg">
            Portal Presensi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-white">
              Peserta Magang Resmi
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-lg leading-relaxed mb-6 drop-shadow">
            Sistem pencatatan kehadiran mandiri terintegrasi SIAPkerja & MagangHub Kemnaker RI dengan validasi lokasi pabrik CV. Asia Plastik.
          </p>

          {/* Quick HUD chips */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/85 border border-white/20 text-white text-xs font-mono shadow-md backdrop-blur-md">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{timeStr || "08:00:00 WIB"}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/85 border border-white/20 text-white text-xs font-mono shadow-md backdrop-blur-md">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Geofence 150m Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: Clean, Focused Authentication Canvas            */}
      {/* ============================================================== */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative z-10 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-300">
        <div className="w-full max-w-md">
          {/* Header titles */}
          <div className="mb-6">
            <Badge variant="info" className="gap-1.5 mb-2 py-1 px-3 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-400/30">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-300" />
              Khusus Peserta Magang Resmi
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Masuk ke Portal Peserta
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Gunakan email SIAPkerja / MagangHub yang telah disetujui untuk CV. Asia Plastik.
            </p>
          </div>

          {/* Access denied error */}
          {accessDeniedError && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-500 text-rose-900 dark:text-rose-100 shadow-xl backdrop-blur-xl animate-in fade-in"
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
            <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 dark:border-amber-500/40 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5 backdrop-blur-sm">
              <span className="font-bold mt-0.5">⚠️</span>
              <p className="leading-relaxed">{generalError}</p>
            </div>
          )}

          {/* Login Card */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-slate-900/5 dark:ring-white/10 relative overflow-hidden transition-colors duration-300">
            <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-white/10 mb-5">
              <span className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Otentikasi Akun
              </span>
              <span className="text-[10px] font-semibold text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-cyan-700/50">
                Kemnaker Whitelist
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
                    className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/60 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                    className="text-[11px] text-blue-600 dark:text-cyan-400 hover:underline"
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
                    className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-950/60 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                className="w-full py-3.5 font-bold mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30 rounded-xl"
                isLoading={submitting}
                disabled={submitting}
              >
                <Lock className="w-4 h-4 mr-2" />
                Masuk ke Portal Presensi
              </Button>

              {/* Activation callout */}
              <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/5 dark:from-blue-600/20 dark:via-indigo-600/20 dark:to-cyan-600/10 border border-blue-500/20 dark:border-blue-400/30 flex items-center justify-between gap-3 shadow-sm group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      Peserta Magang Baru?
                      <span className="text-[10px] bg-blue-500/20 dark:bg-cyan-500/30 text-blue-700 dark:text-cyan-200 font-bold px-1.5 py-0.5 rounded-full border border-blue-500/30 dark:border-cyan-400/30">
                        Aktivasi
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-300 leading-tight">
                      Daftarkan kata sandi akun magang Anda
                    </div>
                  </div>
                </div>
                <Link
                  href="/register"
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1"
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
              className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors"
            >
              Akses Khusus Supervisor / HR CV. Asia Plastik →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
