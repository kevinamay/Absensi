"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  ExternalLink,
  ArrowRight,
  Eye,
  EyeOff,
  Radio,
} from "lucide-react";
import { LoginVariantProps } from "./types";

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
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-950 text-slate-100 flex flex-col lg:flex-row transition-colors duration-300">
      {/* ============================================================== */}
      {/* BACKGROUND A: DYNAMIC AURORA MESH & GLOWING AMBIENT ORBS       */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Deep ambient multi-color gradients */}
        <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-transparent blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute top-[40%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-purple-600/15 blur-[140px]" />
        <div className="absolute -bottom-[15%] left-[25%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-t from-indigo-700/25 via-blue-800/15 to-transparent blur-[130px]" />

        {/* Micro Dot Grid Overlay */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.25) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Subtle Diagonal Scanlines for Tech Texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0, rgba(255, 255, 255, 0.05) 1px, transparent 0, transparent 50%)`,
            backgroundSize: "12px 12px",
          }}
        />
      </div>

      {/* Floating Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* ============================================================== */}
      {/* LEFT COLUMN: Corporate Identity & Telemetry Widgets            */}
      {/* ============================================================== */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-white/10 backdrop-blur-md bg-slate-950/40">
        <div>
          {/* Header branding */}
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border border-white/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block text-white drop-shadow-sm">
                CV. ASIA PLASTIK
              </span>
              <span className="text-xs text-cyan-400 font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Industry & Injection Moulding • Sidoarjo
              </span>
            </div>
          </div>

          {/* Kemnaker partnership badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-6 shadow-sm backdrop-blur-sm">
            <Factory className="w-4 h-4 text-cyan-400" />
            Program Magang Bersertifikat Kementerian Ketenagakerjaan RI
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 text-white">
            Portal Presensi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
              Peserta Magang Resmi
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed mb-8">
            Sistem pencatatan kehadiran presisi berbasis geolokasi dan verifikasi akun terdaftar bagi siswa & mahasiswa magang di pabrik CV. Asia Plastik Sidoarjo.
          </p>

          {/* Telemetry and Geofence status tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg mb-8">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 shadow-lg backdrop-blur-xl hover:border-white/20 transition-all">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
                <Clock className="w-4 h-4 text-emerald-400" />
                Waktu Operasional Pabrik
              </div>
              <div className="text-xl font-black text-white font-mono tracking-tight">
                {timeStr || "08:00:00 WIB"}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Jam Masuk: 08:00 WIB (Toleransi 15 mnt)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 shadow-lg backdrop-blur-xl hover:border-white/20 transition-all">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
                <MapPin className="w-4 h-4 text-rose-400" />
                Geofence Radius Presensi
              </div>
              <div className="text-xl font-black text-emerald-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
                Radius 150m Aktif
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Pabrik Sidoarjo, Jawa Timur
              </p>
            </div>
          </div>

          {/* Security Architecture list */}
          <div className="space-y-2.5 max-w-lg">
            <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Strict Whitelist Query via Cloud Firestore (<code className="text-cyan-300 font-mono text-[11px]">allowed_interns</code>)</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Autentikasi Terenkripsi Firebase Auth & Email Verification</span>
            </div>
          </div>
        </div>

        {/* Bottom trust footer */}
        <div className="pt-6 mt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            <span>Sistem Keamanan Whitelist Terverifikasi</span>
          </div>
          <span className="font-mono text-[11px]">Presensi Intern v2.4 • Aurora</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: Elevated Glassmorphic Card                       */}
      {/* ============================================================== */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          {/* Header titles */}
          <div className="mb-6">
            <Badge variant="info" className="gap-1.5 mb-2 py-1 px-3 bg-blue-500/20 text-blue-200 border border-blue-400/30">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-300" />
              Khusus Peserta Magang Resmi
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Masuk ke Portal Peserta
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Gunakan email SIAPkerja / MagangHub yang telah disetujui untuk CV. Asia Plastik.
            </p>
          </div>

          {/* Access denied error */}
          {accessDeniedError && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-500 text-rose-100 shadow-xl backdrop-blur-xl animate-in fade-in"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 shadow-md">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-rose-300">Akses Ditolak / Unauthorized</h4>
                  <p className="text-xs font-semibold leading-relaxed text-rose-200">{accessDeniedError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Standard error banner */}
          {generalError && !accessDeniedError && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 backdrop-blur-sm">
              <span className="font-bold mt-0.5">⚠️</span>
              <p className="leading-relaxed">{generalError}</p>
            </div>
          )}

          {/* Glassmorphic Login Card */}
          <div className="rounded-3xl border border-white/20 bg-slate-900/70 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-5">
              <span className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                Otentikasi Akun
              </span>
              <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-700/50">
                Kemnaker Whitelist
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Email Terdaftar di SIAPkerja / MagangHub
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh: ahmad.fauzi@kemnaker.maganghub.id"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-white/15 bg-slate-950/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-200">
                    Kata Sandi / PIN Magang
                  </label>
                  <a
                    href="https://siapkerja.kemnaker.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Lupa kata sandi?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-blue-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-xl border border-white/15 bg-slate-950/60 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
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
                className="w-full py-3.5 font-bold mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-600/30 border border-white/20 rounded-xl"
                isLoading={submitting}
                disabled={submitting}
              >
                <Lock className="w-4 h-4 mr-2" />
                Masuk ke Portal Presensi
              </Button>

              {/* Activation callout */}
              <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-cyan-600/10 border border-blue-400/30 flex items-center justify-between gap-3 shadow-md group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      Peserta Magang Baru?
                      <span className="text-[10px] bg-cyan-500/30 text-cyan-200 font-bold px-1.5 py-0.5 rounded-full border border-cyan-400/30">
                        Aktivasi
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 leading-tight">
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
              className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
            >
              Akses Khusus Supervisor / HR CV. Asia Plastik →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
