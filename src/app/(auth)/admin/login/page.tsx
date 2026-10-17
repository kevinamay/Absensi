"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  ShieldCheck,
  Building2,
  Lock,
  UserCheck,
  AlertCircle,
  KeyRound,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, setDemoUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Mohon lengkapi email dan kata sandi staf HR.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch (err: any) {
      console.warn("Direct Firebase Admin login error:", err);
      setErrorMessage(
        "Gagal masuk. Pastikan akun email Anda sudah didaftarkan oleh IT di Firebase Console."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    setDemoUser("admin");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-200">
      {/* Floating Theme Toggle at top right */}
      <ThemeToggle />

      {/* Decorative ambient background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back to intern login link */}
        <div className="mb-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Portal Presensi Magang
          </Link>
        </div>

        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-700 to-blue-600 shadow-xl shadow-indigo-500/20 mb-3 border border-white/10 text-white">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            CV. ASIA PLASTIK
          </h1>
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wider">
            Internal Staff & Supervisor Gateway
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-2">
              <Badge variant="warning" className="gap-1.5 py-1 px-3">
                <KeyRound className="w-3.5 h-3.5" />
                Akses Terproteksi HR / Pengawas
              </Badge>
            </div>
            <CardTitle className="text-xl">Portal Otentikasi Supervisor</CardTitle>
            <CardDescription className="text-xs">
              Hanya untuk staf resmi HRD & pembimbing magang. Akun dikelola dan didaftarkan langsung oleh tim IT via Firebase Console.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Resmi HR / Perusahaan"
                type="email"
                placeholder="staf.hrd@asiaplastik.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Kata Sandi Administrator"
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
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                isLoading={submitting}
              >
                <Lock className="w-4 h-4" />
                Buka Konsol Monitoring HR
              </Button>
            </form>

            {/* Quick Demo Simulator for supervisor testing */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Mode Uji Coba Cepat (Evaluasi Lokal):
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleQuickDemo}
                className="w-full text-xs font-semibold"
              >
                Masuk Langsung sbg Supervisor HR
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security watermark footer */}
        <p className="text-center text-[11px] text-slate-400 dark:text-slate-600 mt-6 font-mono">
          ENDPOINT: /admin/login • RESTRICTED ACCESS
        </p>
      </div>
    </div>
  );
}
