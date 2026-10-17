"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Radio,
  Fingerprint,
  Building2,
  ShieldCheck,
  Lock,
  ArrowRight,
  GraduationCap,
  Sparkles,
  MapPin,
  AlertCircle,
  KeyRound,
} from "lucide-react";

interface VariantProps {
  onLogin: (identifier: string, pass: string, role: "intern" | "admin") => Promise<void>;
  onQuickDemo: (role: "intern" | "admin") => void;
  submitting: boolean;
  errorMessage: string | null;
}

export function VariantB({
  onLogin,
  onQuickDemo,
  submitting,
  errorMessage,
}: VariantProps) {
  const [authMode, setAuthMode] = useState<"intern" | "admin">("intern");
  const [entryMethod, setEntryMethod] = useState<"nim" | "qr" | "creds">("nim");
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(identifier, pin || "123456", authMode);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient circular grids */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0,transparent_70%)] pointer-events-none" />

      {/* Lanyard String effect at top */}
      <div className="w-16 h-8 border-x-4 border-t-4 border-slate-700 rounded-t-xl mb-1 opacity-70" />

      {/* Main Digital ID Card Frame */}
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-800 shadow-[0_20px_50px_rgba(8,112,184,0.15)] relative overflow-hidden">
        {/* Lanyard punch hole slot */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-14 h-2.5 rounded-full bg-slate-950 border border-slate-700/80" />
        </div>

        {/* Card Header with holographic strip */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-200" />
              <div>
                <span className="text-xs font-black tracking-wider uppercase block">
                  CV. Asia Plastik
                </span>
                <span className="text-[10px] text-blue-200">Factory Field Pass</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
              <Radio className="w-3 h-3 text-emerald-300 animate-pulse" />
              NFC / GPS
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Geolocation Status Badge */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 mb-5">
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold text-white text-xs">Gerbang Pabrik Sidoarjo</div>
                <div className="text-[10px] text-emerald-400 font-semibold">
                  ● Geofence 150m Terdeteksi
                </div>
              </div>
            </div>
            <Badge variant="success" className="text-[10px] px-2 py-0.5">
              Siap Presensi
            </Badge>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl mb-5 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setAuthMode("intern")}
              className={`py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMode === "intern"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Pass Peserta
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("admin")}
              className={`py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMode === "admin"
                  ? "bg-slate-800 text-white shadow border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Pass Supervisor
            </button>
          </div>

          {/* Quick Entry Selector */}
          <div className="flex items-center justify-around border-b border-slate-800 pb-3 mb-4 text-[11px] font-semibold text-slate-400">
            <button
              type="button"
              onClick={() => setEntryMethod("nim")}
              className={`pb-1 transition-colors ${
                entryMethod === "nim"
                  ? "text-blue-400 border-b-2 border-blue-500 font-bold"
                  : "hover:text-slate-300"
              }`}
            >
              ID Magang / NIM
            </button>
            <button
              type="button"
              onClick={() => setEntryMethod("qr")}
              className={`pb-1 transition-colors flex items-center gap-1 ${
                entryMethod === "qr"
                  ? "text-blue-400 border-b-2 border-blue-500 font-bold"
                  : "hover:text-slate-300"
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
                  ? "text-blue-400 border-b-2 border-blue-500 font-bold"
                  : "hover:text-slate-300"
              }`}
            >
              Email & Sandi
            </button>
          </div>

          {/* Form Area */}
          {entryMethod === "qr" ? (
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <div className="w-36 h-36 rounded-2xl bg-slate-950 border-2 border-dashed border-blue-500/40 flex flex-col items-center justify-center p-4 relative group cursor-pointer hover:border-blue-500 transition-colors">
                <QrCode className="w-16 h-16 text-blue-400 mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-[10px] text-slate-400">Arahkan QR ID Magang</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                Gunakan barcode dari kartu peserta MagangHub Anda untuk tap instan.
              </p>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="mt-4 w-full"
                onClick={() => onQuickDemo(authMode)}
              >
                Simulasikan Scan Berhasil
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Input
                label={
                  entryMethod === "nim"
                    ? "NIM / ID MagangHub"
                    : "Email Kredensial"
                }
                placeholder={
                  entryMethod === "nim"
                    ? "contoh: 2141720189 atau MH-2026"
                    : "nama@asiaplastik.com"
                }
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />

              <Input
                label={entryMethod === "nim" ? "PIN Akses (6 Digit)" : "Kata Sandi"}
                type="password"
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />

              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-1.5">
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
                Tap Kartu & Masuk
              </Button>
            </form>
          )}

          {/* Quick Demo Simulator */}
          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <div className="text-[10px] font-semibold text-slate-400 mb-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Satu-Klik Akses Evaluasi:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onQuickDemo("intern")}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-[11px] font-semibold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1"
              >
                Test Mahasiswa
              </button>
              <button
                type="button"
                onClick={() => onQuickDemo("admin")}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-[11px] font-semibold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1"
              >
                Test Supervisor
              </button>
            </div>
          </div>
        </div>

        {/* Card Footer Barcode simulation */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>SEC-ID: 7729-APL-2026</span>
          <span className="text-emerald-400 font-bold">STATUS: ON-SITE</span>
        </div>
      </div>
    </div>
  );
}
