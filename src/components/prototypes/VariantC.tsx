"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Terminal,
  Activity,
  Cpu,
  GraduationCap,
  Sparkles,
  Lock,
  AlertCircle,
  Satellite,
  Compass,
  CheckCircle2,
} from "lucide-react";

interface VariantProps {
  onLogin: (identifier: string, pass: string) => Promise<void>;
  onQuickDemo: () => void;
  submitting: boolean;
  errorMessage: string | null;
}

export function VariantC({
  onLogin,
  onQuickDemo,
  submitting,
  errorMessage,
}: VariantProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [time, setTime] = useState("");
  const [division, setDivision] = useState<string>("PRODUKSI");

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
    onLogin(identifier, password);
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-[#050811] text-slate-900 dark:text-slate-200 flex flex-col justify-between p-4 sm:p-8 font-sans relative overflow-hidden transition-colors duration-200">
      {/* Floating Theme Toggle */}
      <ThemeToggle />

      {/* Cybernetic Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP HUD TELEMETRY BAR */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm backdrop-blur-md transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-black tracking-widest uppercase block font-mono">
              CV. ASIA PLASTIK // CORE
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
              TERMINAL PRESENSI MAGANGHUB
            </span>
          </div>
        </div>

        {/* Telemetry chips */}
        <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            <Satellite className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[11px]">GPS: LOCK (-7.424, 112.721)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">{time || "08:00:00 WIB"}</span>
          </div>
        </div>
      </header>

      {/* CENTER STAGE: COMMAND CONSOLE */}
      <main className="relative z-10 w-full max-w-3xl mx-auto my-8">
        <div className="text-center mb-8">
          <Badge variant="info" className="gap-1.5 px-3 py-1 text-[11px] font-mono mb-3">
            <Terminal className="w-3.5 h-3.5" />
            STATION ID: SIDOARJO-INTERN-01
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Autentikasi Presensi Peserta
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
            Khusus mahasiswa & siswa magang aktif di area pabrik CV. Asia Plastik.
          </p>
        </div>

        {/* Division fast selection pill bar */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          <span className="text-xs font-mono text-slate-500 mr-1">DIVISI MAGANG:</span>
          {["PRODUKSI", "QUALITY CONTROL", "MAINTENANCE", "LOGISTIK"].map((div) => (
            <button
              key={div}
              type="button"
              onClick={() => setDivision(div)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                division === div
                  ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
                  : "bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {div}
            </button>
          ))}
        </div>

        {/* Input Console Form Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl transition-colors duration-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="ID MagangHub / NIM Mahasiswa"
                placeholder="MH-2026 atau nim@univ.ac.id"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />

              <Input
                label="PIN Akses / Sandi Akun"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto flex-1 py-3 font-bold"
                isLoading={submitting}
              >
                <Lock className="w-4 h-4" />
                Buka Terminal Presensi (Divisi {division})
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onQuickDemo}
                className="w-full sm:w-auto text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" />
                Simulasi Masuk Magang
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* BOTTOM TICKER HUD STATUS */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 p-3 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 backdrop-blur-sm transition-colors duration-200">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="truncate">
            SYS_OK // RADIUS_LIMIT: 150.0m // LAT: -7.424312 // LNG: 112.721415
          </span>
        </div>
        <div className="hidden sm:block shrink-0">
          SECURE PROTOCOL V2.2 • CV. ASIA PLASTIK
        </div>
      </footer>
    </div>
  );
}
