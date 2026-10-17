"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Building2,
  Lock,
  GraduationCap,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Factory,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, setDemoUser } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage("Mohon masukkan ID / NIM dan Kata Sandi Anda.");
      return;
    }

    setSubmitting(true);
    try {
      await login(identifier, password);
      router.push("/intern");
    } catch (err: any) {
      console.warn("Direct Firebase login:", err);
      setErrorMessage(
        "Autentikasi gagal atau Firebase API key belum terisi. Silakan gunakan tombol demo instan untuk melihat dashboard."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    setDemoUser("intern");
    router.push("/intern");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row relative transition-colors duration-200">
      {/* Floating Theme Toggle at top right */}
      <ThemeToggle />

      {/* LEFT COLUMN: Corporate Showcase & Operational Telemetry */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-blue-50/70 via-slate-100 to-indigo-50/50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-950 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors duration-200">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header branding */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-white/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block text-slate-900 dark:text-white">
                CV. ASIA PLASTIK
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase">
                Industry & Injection Moulding
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6">
            <Factory className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Portal Presensi Resmi MagangHub & SIAPkerja
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 text-slate-900 dark:text-white">
            Presensi Mandiri Siswa & Mahasiswa Magang.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed mb-8">
            Catat kehadiran harian Anda saat berada di area pabrik CV. Asia Plastik
            Sidoarjo dengan validasi lokasi radius GPS 150 meter.
          </p>

          {/* Operational highlight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mb-8">
            <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                <Clock className="w-4 h-4 text-emerald-500" />
                Waktu Shift Operasional
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {timeStr || "08:00 WIB"}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Batas toleransi hadir: 08:15 WIB
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                <MapPin className="w-4 h-4 text-rose-500" />
                Area Geofence Pabrik
              </div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Radius 150m Aktif
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Sidoarjo, Jawa Timur
              </p>
            </div>
          </div>
        </div>

        {/* Bottom trust footer */}
        <div className="relative z-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Terhubung Firebase Auth & Cloud Firestore</span>
          </div>
          <span>Presensi v2.2</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Pure Intern Login Form */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Badge variant="info" className="gap-1.5 mb-2 py-1 px-3">
              <GraduationCap className="w-3.5 h-3.5" />
              Khusus Peserta Magang
            </Badge>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Masuk ke Portal Peserta
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Gunakan ID MagangHub resmi, NIM Kampus, atau email Anda.
            </p>
          </div>


          <Card className="border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 shadow-2xl backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Formulir Presensi</CardTitle>
              <CardDescription className="text-xs">
                Pastikan izin akses lokasi (GPS) pada perangkat Anda telah diaktifkan.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="ID MagangHub / NIM / Email"
                  placeholder="contoh: MH-2026 atau 2141720189"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />

                <Input
                  label="Kata Sandi / PIN Akun"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 font-bold"
                  isLoading={submitting}
                >
                  <Lock className="w-4 h-4" />
                  Masuk & Buka Presensi
                </Button>
              </form>

              {/* Instant Demo Simulator */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Simulasi Akses Langsung:
                  </span>
                  <span className="text-[10px] text-slate-400">Mode Evaluasi</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleQuickDemo}
                  className="w-full text-xs font-semibold hover:border-blue-500/50"
                >
                  Masuk sbg Mahasiswa Magang (Demo)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
