"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  QrCode,
  Radio,
  Fingerprint,
  Building2,
  Lock,
  GraduationCap,
  Sparkles,
  MapPin,
  AlertCircle,
} from "lucide-react";

interface VariantProps {
  onLogin: (identifier: string, pass: string) => Promise<void>;
  onQuickDemo: () => void;
  submitting: boolean;
  errorMessage: string | null;
}

export function VariantB({
  onLogin,
  onQuickDemo,
  submitting,
  errorMessage,
}: VariantProps) {
  const [entryMethod, setEntryMethod] = useState<"nim" | "qr" | "creds">("nim");
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(identifier, pin || "123456");
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-200">
      {/* Floating Theme Toggle */}
      <ThemeToggle />

      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0,transparent_70%)] pointer-events-none" />

      {/* Lanyard String effect at top */}
      <div className="w-16 h-8 border-x-4 border-t-4 border-slate-300 dark:border-slate-700 rounded-t-xl mb-1 opacity-70" />

      {/* Main Digital ID Card Frame */}
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(8,112,184,0.15)] relative overflow-hidden transition-colors duration-200">
        {/* Lanyard punch hole slot */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-14 h-2.5 rounded-full bg-slate-200 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80" />
        </div>

        {/* Card Header with holographic strip */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-100" />
              <div>
                <span className="text-xs font-black tracking-wider uppercase block">
                  CV. Asia Plastik
                </span>
                <span className="text-[10px] text-blue-100">Intern Field Pass</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
              <Radio className="w-3 h-3 text-emerald-300 animate-pulse" />
              GPS Active
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Geolocation Status Badge */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 mb-5">
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <div>
                <div className="font-bold text-xs">Gerbang Pabrik Sidoarjo</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  ● Geofence 150m Aktif
                </div>
              </div>
            </div>
            <Badge variant="success" className="text-[10px] px-2 py-0.5">
              Siap Presensi
            </Badge>
          </div>

          {/* Quick Entry Selector */}
          <div className="flex items-center justify-around border-b border-slate-200 dark:border-slate-800 pb-3 mb-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={() => setEntryMethod("nim")}
              className={`pb-1 transition-colors ${
                entryMethod === "nim"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500 font-bold"
                  : "hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              ID Magang / NIM
            </button>
            <button
              type="button"
              onClick={() => setEntryMethod("qr")}
              className={`pb-1 transition-colors flex items-center gap-1 ${
                entryMethod === "qr"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500 font-bold"
                  : "hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <QrCode className="w-3 h-3" />
              Scan QR
            </button>
            <button
              type="button"
              onClick={() => setEntryMethod("creds")}
              className={`pb-1 transition-colors ${
                entryMethod === "creds"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-500 font-bold"
                  : "hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Email & Sandi
            </button>
          </div>

          {/* Form Area */}
          {entryMethod === "qr" ? (
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <div className="w-36 h-36 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-blue-500/40 flex flex-col items-center justify-center p-4 relative group cursor-pointer hover:border-blue-500 transition-colors">
                <QrCode className="w-16 h-16 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Scan Barcode / QR ID</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">
                Arahkan kartu peserta MagangHub Anda untuk tap instan.
              </p>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="mt-4 w-full"
                onClick={onQuickDemo}
              >
                Simulasikan Tap Sukses
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Input
                label={
                  entryMethod === "nim"
                    ? "NIM / ID MagangHub"
                    : "Email Terdaftar"
                }
                placeholder={
                  entryMethod === "nim"
                    ? "contoh: 2141720189 atau MH-2026"
                    : "nama@magang.ac.id"
                }
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />

              <Input
                label={entryMethod === "nim" ? "PIN Kehadiran (6 Digit)" : "Kata Sandi"}
                type="password"
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />

              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 font-bold"
                isLoading={submitting}
              >
                <Fingerprint className="w-4 h-4" />
                Tap Kartu & Masuk Presensi
              </Button>
            </form>
          )}

          {/* Quick Demo Simulator */}
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Satu-Klik Akses Evaluasi:
            </div>
            <button
              type="button"
              onClick={onQuickDemo}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Masuk sbg Mahasiswa Magang (Demo)
            </button>
          </div>
        </div>

        {/* Card Footer Barcode simulation */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          <span>SEC-ID: 7729-APL-2026</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">STATUS: ON-SITE</span>
        </div>
      </div>
    </div>
  );
}
