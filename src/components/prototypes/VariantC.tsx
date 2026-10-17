"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  Activity,
  ShieldAlert,
  Cpu,
  Key,
  Building,
  UserCheck,
  GraduationCap,
  Sparkles,
  Lock,
  Compass,
  AlertCircle,
  Satellite,
} from "lucide-react";

interface VariantProps {
  onLogin: (identifier: string, pass: string, role: "intern" | "admin") => Promise<void>;
  onQuickDemo: (role: "intern" | "admin") => void;
  submitting: boolean;
  errorMessage: string | null;
}

export function VariantC({
  onLogin,
  onQuickDemo,
  submitting,
  errorMessage,
}: VariantProps) {
  const [selectedBay, setSelectedBay] = useState<"intern" | "admin">("intern");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("id-ID", {
          hour12: false,
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(identifier, password, selectedBay);
  };

  return (
    <div className="min-h-screen w-full bg-[#050811] text-slate-200 flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Background Cybernetic Industrial Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP HUD TELEMETRY BAR */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-black tracking-widest uppercase text-white font-mono">
              CV. ASIA PLASTIK // CORE
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              GATEWAY PRESENSI TERINTEGRASI KEMNAKER
            </span>
          </div>
        </div>

        {/* Telemetry chips */}
        <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <Satellite className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px]">GPS: LOCK (-7.424, 112.721)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">{time || "08:00:00 WIB"}</span>
          </div>
        </div>
      </header>

      {/* CENTER STAGE: COMMAND CONSOLE */}
      <main className="relative z-10 w-full max-w-4xl mx-auto my-8">
        <div className="text-center mb-8">
          <Badge variant="info" className="gap-1.5 px-3 py-1 text-[11px] font-mono mb-3">
            <Terminal className="w-3.5 h-3.5" />
            STATION ID: SIDOARJO-PLANT-01
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Autentikasi Presensi Mandiri
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Silakan pilih terminal akses Anda di bawah untuk memulai sesi presensi harian.
          </p>
        </div>

        {/* Dual Portal Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Bay 1: Intern Portal */}
          <div
            onClick={() => setSelectedBay("intern")}
            className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden backdrop-blur-xl ${
              selectedBay === "intern"
                ? "bg-slate-900/90 border-blue-500 shadow-xl shadow-blue-500/15"
                : "bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                selectedBay === "intern"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold"
                  : "text-slate-500"
              }`}>
                BAY-01 ACTIVE
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Peserta Magang</h2>
            <p className="text-xs text-slate-400 mb-4">
              Mahasiswa & Siswa MagangHub / SIAPkerja Kemnaker RI. Validasi radius otomatis 150m.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-blue-400">
              <span>Buka Terminal Presensi &rarr;</span>
            </div>
          </div>

          {/* Bay 2: Supervisor / Admin Portal */}
          <div
            onClick={() => setSelectedBay("admin")}
            className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden backdrop-blur-xl ${
              selectedBay === "admin"
                ? "bg-slate-900/90 border-indigo-500 shadow-xl shadow-indigo-500/15"
                : "bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-75 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                selectedBay === "admin"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold"
                  : "text-slate-500"
              }`}>
                BAY-02 ADMIN
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Supervisor & HRD</h2>
            <p className="text-xs text-slate-400 mb-4">
              Monitoring langsung kehadiran real-time, laporan ekspor, dan manajemen izin pabrik.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-indigo-400">
              <span>Buka Terminal HR &rarr;</span>
            </div>
          </div>
        </div>

        {/* Input Console Form Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={
                  selectedBay === "intern"
                    ? "ID MagangHub / Email Peserta"
                    : "Email Kredensial HRD"
                }
                placeholder={
                  selectedBay === "intern"
                    ? "MH-2026 atau nim@univ.ac.id"
                    : "supervisor@asiaplastik.com"
                }
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />

              <Input
                label="Kunci Keamanan / Sandi"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                type="submit"
                variant={selectedBay === "intern" ? "primary" : "secondary"}
                className="w-full sm:w-auto flex-1 py-3 font-bold"
                isLoading={submitting}
              >
                <Lock className="w-4 h-4" />
                Mulai Sesi ({selectedBay === "intern" ? "Peserta Magang" : "Supervisor"})
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onQuickDemo("intern")}
                  className="flex-1 sm:flex-initial text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1" />
                  Demo Magang
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onQuickDemo("admin")}
                  className="flex-1 sm:flex-initial text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 mr-1" />
                  Demo HR
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* BOTTOM TICKER HUD STATUS */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between text-[11px] font-mono text-slate-400 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-400 truncate">
            SYS_OK // RADIUS_LIMIT: 150.0m // LAT: -7.424312 // LNG: 112.721415
          </span>
        </div>
        <div className="hidden sm:block text-slate-400 shrink-0">
          SECURE PROTOCOL V2.6 • CV. ASIA PLASTIK
        </div>
      </footer>
    </div>
  );
}
