"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Building2,
  Lock,
  UserCheck,
  AlertCircle,
  GraduationCap,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Factory,
} from "lucide-react";

interface VariantProps {
  onLogin: (identifier: string, pass: string, role: "intern" | "admin") => Promise<void>;
  onQuickDemo: (role: "intern" | "admin") => void;
  submitting: boolean;
  errorMessage: string | null;
}

export function VariantA({
  onLogin,
  onQuickDemo,
  submitting,
  errorMessage,
}: VariantProps) {
  const [authMode, setAuthMode] = useState<"intern" | "admin">("intern");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTimeStr(
        new Intl.DateTimeFormat("id-ID", {
          timeZone: "Asia/Jakarta",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(identifier, password, authMode);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* LEFT COLUMN: Corporate Showcase & Operational Telemetry */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header branding */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-white/10">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block">
                CV. ASIA PLASTIK
              </span>
              <span className="text-xs text-blue-400 font-semibold tracking-wider uppercase">
                Industry & Injection Moulding
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-6">
            <Factory className="w-3.5 h-3.5 text-blue-400" />
            Terintegrasi MagangHub & SIAPkerja Kemnaker RI
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-4">
            Presensi Digital Berbasis Geofence Presisi.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed mb-8">
            Sistem absensi mandiri khusus mahasiswa & siswa magang di area pabrik
            CV. Asia Plastik Sidoarjo dengan validasi radius GPS 150 meter.
          </p>

          {/* Operational highlight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mb-8">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
                <Clock className="w-4 h-4 text-emerald-400" />
                Waktu Operasional Shift
              </div>
              <div className="text-lg font-black text-white">{timeStr || "08:00 WIB"}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Batas toleransi hadir: 08:15 WIB</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
                <MapPin className="w-4 h-4 text-rose-400" />
                Zona Geofence Pabrik
              </div>
              <div className="text-lg font-black text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                150 Meter Radius
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Koordinat pabrik aktif terkunci</p>
            </div>
          </div>
        </div>

        {/* Bottom trust footer */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>Terhubung Firebase Auth & Cloud Firestore</span>
          </div>
          <span>v2.1 Enterprise</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Dedicated Login Form */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Masuk ke Akun Anda
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Gunakan ID MagangHub resmi atau email kredensial perusahaan.
            </p>
          </div>

          <Card className="border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center mb-1">
                <Badge variant="info" className="gap-1.5">
                  <ShieldCheck className="w-3 h-3" />
                  Koneksi Terenkripsi
                </Badge>
                <span className="text-[11px] text-slate-400 font-medium">
                  {authMode === "intern" ? "Siswa / Mahasiswa" : "HR & Supervisor"}
                </span>
              </div>

              {/* Segmented Mode Control */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl mt-3 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setAuthMode("intern")}
                  className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    authMode === "intern"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Peserta Magang
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("admin")}
                  className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    authMode === "admin"
                      ? "bg-slate-800 text-white shadow-md border border-slate-700"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Supervisor / HR
                </button>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label={
                    authMode === "intern"
                      ? "ID MagangHub / Email / NIM"
                      : "Email Supervisor HR"
                  }
                  placeholder={
                    authMode === "intern"
                      ? "contoh: MH-SIAP-2026 / magang@univ.ac.id"
                      : "hrd@asiaplastik.com"
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />

                <Input
                  label="Kata Sandi Akun"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant={authMode === "intern" ? "primary" : "secondary"}
                  className="w-full py-3"
                  isLoading={submitting}
                >
                  <Lock className="w-4 h-4" />
                  Otorisasi Presensi Sekarang
                </Button>
              </form>

              {/* Instant Demo Simulator */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2.5">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Simulasi Akses Langsung:
                  </span>
                  <span className="text-[10px] text-slate-500">Bypass Kredensial</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickDemo("intern")}
                    className="text-xs hover:border-blue-500/50"
                  >
                    Masuk sbg Mahasiswa
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickDemo("admin")}
                    className="text-xs hover:border-indigo-500/50"
                  >
                    Masuk sbg HR Admin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
