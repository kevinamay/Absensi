"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Building2,
  MailCheck,
  ArrowLeft,
  CheckCircle2,
  Info,
  ExternalLink,
} from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const registeredEmail = searchParams.get("email") || "email Anda";

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-8 relative transition-colors duration-200">
      <ThemeToggle />

      {/* Atmospheric lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Brand header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight block text-slate-900 dark:text-white">
              CV. ASIA PLASTIK
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase">
              Sistem Presensi MagangHub Kemnaker RI
            </span>
          </div>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-2xl backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 sm:p-10 text-center space-y-6">
            {/* Visual Icon */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
              <MailCheck className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <Badge variant="success" className="gap-1 px-3 py-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Registrasi Akun Berhasil
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Verifikasi Email Anda
              </h1>
            </div>

            {/* EXACT REQUIRED NOTIFICATION TEXT */}
            <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
              <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1.5">
                Registration successful! We have sent a verification link to your email.
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You must verify your email address before you can log in.
              </p>
              {registeredEmail && (
                <div className="mt-3 py-1.5 px-3 rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 break-all inline-block">
                  {registeredEmail}
                </div>
              )}
            </div>

            {/* Helpful instructions */}
            <div className="text-left p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Info className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Petunjuk Langkah Selanjutnya:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-500 dark:text-slate-400 pl-1">
                <li>Buka aplikasi email Anda (Gmail, Outlook, atau Webmail Kampus).</li>
                <li>Cari email dari <strong>CV. Asia Plastik / Firebase Authentication</strong>.</li>
                <li>Klik tautan <strong>"Verify Email"</strong> pada isi pesan tersebut.</li>
                <li>Jika belum masuk, periksa juga folder <em>Spam</em> atau <em>Promotions</em>.</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-3">
              <Link href="/login" className="w-full">
                <Button variant="primary" size="lg" className="w-full font-bold py-3.5 gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Return to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-6">
          CV. Asia Plastik • Magang Bersertifikat Kementerian Ketenagakerjaan RI
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold">Memuat Notifikasi Verifikasi...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
