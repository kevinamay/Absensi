"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Mail,
  KeyRound,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [isApprovedPending, setIsApprovedPending] = useState(false);

  // Initial countdown 0 so user can immediately click resend if code not received yet
  const [timeLeft, setTimeLeft] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const qEmail = searchParams.get("email");
    const qName = searchParams.get("name");
    const qInst = searchParams.get("inst");

    if (qEmail) setEmail(qEmail);
    if (qName) setFullName(qName);
    if (qInst) setInstitution(qInst);

    // Also attempt to restore staged data from sessionStorage
    if (typeof window !== "undefined") {
      const staged = sessionStorage.getItem("cv_asia_registration_staged");
      if (staged) {
        try {
          const parsed = JSON.parse(staged);
          if (!qEmail && parsed.email) setEmail(parsed.email);
          if (!qName && parsed.fullName) setFullName(parsed.fullName);
          if (!qInst && parsed.institution) setInstitution(parsed.institution);
        } catch (e) {}
      }
    }
  }, [searchParams]);

  // Focus first OTP input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const copy = [...otpDigits];
      copy[index] = "";
      setOtpDigits(copy);
      return;
    }

    // Handle paste of whole 6-digit string
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split("");
      const copy = [...otpDigits];
      chars.forEach((c, i) => {
        if (index + i < 6) copy[index + i] = c;
      });
      setOtpDigits(copy);
      const nextIndex = Math.min(index + chars.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const copy = [...otpDigits];
    copy[index] = cleaned[0];
    setOtpDigits(copy);

    // Auto-advance to next input
    if (index < 5 && cleaned[0]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const fullOtp = otpDigits.join("");

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (fullOtp.length !== 6) {
      setErrorMessage("Silakan masukkan 6 digit kode OTP secara lengkap.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: fullOtp,
          fullName,
          institution,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal memverifikasi kode OTP.");
      }

      // Success! Move to pending approval screen
      setIsApprovedPending(true);
      setSuccessInfo(json.message);
    } catch (err: any) {
      setErrorMessage(err.message || "Kode OTP tidak valid atau kadaluarsa.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resending || timeLeft > 0) return;

    let targetEmail = (email || searchParams.get("email") || "").trim().toLowerCase();
    let targetName = fullName || searchParams.get("name") || "";
    let targetInst = institution || searchParams.get("inst") || "";

    if (!targetEmail && typeof window !== "undefined") {
      const staged = sessionStorage.getItem("cv_asia_registration_staged");
      if (staged) {
        try {
          const parsed = JSON.parse(staged);
          if (parsed.email) targetEmail = parsed.email.trim().toLowerCase();
          if (parsed.fullName) targetName = parsed.fullName.trim();
          if (parsed.institution) targetInst = parsed.institution.trim();
        } catch (e) {}
      }
    }

    if (!targetEmail) {
      setErrorMessage("Alamat email tidak ditemukan. Silakan kembali ke formulir pendaftaran.");
      return;
    }

    setResending(true);
    setErrorMessage(null);
    setSuccessInfo(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          fullName: targetName,
          institution: targetInst,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengirimkan ulang kode OTP.");
      }

      setOtpDigits(["", "", "", "", "", ""]);
      setTimeLeft(15); // 15 seconds quick debounce
      setSuccessInfo(`Kode OTP baru telah berhasil dikirim ke ${targetEmail}. Silakan cek kotak masuk Gmail Anda.`);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mengirim ulang OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 sm:p-8 lg:p-12 transition-colors duration-300">
      {/* ============================================================== */}
      {/* FULL-SCREEN REAL BUILDING BACKGROUND: BG_CV ASIA.webp (4K HD)  */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/BG_CV ASIA.webp"
          alt="Gedung CV. Asia Plastik Sidoarjo"
          fill
          priority
          unoptimized
          quality={100}
          className="object-cover object-center filter contrast-[1.03] brightness-100 dark:brightness-85 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-slate-950/25 dark:bg-slate-950/70 transition-colors duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-slate-950/30" />
      </div>

      {/* Floating Theme Toggle at Top Right */}
      <ThemeToggle />

      {/* Floating Corporate Identity Header on Top Left */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-blue-600/90 border border-white/30 text-white flex items-center justify-center shadow-lg shadow-blue-900/40 backdrop-blur-md">
          <span className="font-black text-lg tracking-tighter">ap</span>
        </div>
        <div className="hidden sm:block">
          <span className="text-sm font-black tracking-tight block text-white drop-shadow">
            CV. ASIA PLASTIK
          </span>
          <span className="text-[11px] text-blue-300 font-semibold tracking-wider uppercase drop-shadow flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Sidoarjo Plant & Headquarter
          </span>
        </div>
      </div>

      {/* Centered Glass Card */}
      <div className="relative z-10 w-full max-w-lg my-auto pt-16 sm:pt-0">
        <div className="rounded-3xl border border-white/30 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-3xl ring-1 ring-black/10 dark:ring-white/10 transition-all duration-300">
          
          {!isApprovedPending ? (
            /* STEP 2: ENTER OTP */
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3.5">
                  <KeyRound className="w-7 h-7" />
                </div>
                <Badge variant="info" className="gap-1.5 mb-2 py-1 px-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-cyan-300 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verifikasi Keamanan Akun
                </Badge>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  Masukkan Kode OTP
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                  Kode 6-digit telah dikirimkan secara langsung ke email:
                </p>
                <p className="text-xs font-bold text-blue-600 dark:text-cyan-300 mt-0.5 font-mono">
                  {email || "email.anda@domain.com"}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">
                  (Cek kotak masuk utama atau folder Spam jika belum muncul)
                </p>
              </div>

              {/* Success Info Banner */}
              {successInfo && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-2.5 backdrop-blur-md animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                  <p className="font-semibold leading-relaxed">{successInfo}</p>
                </div>
              )}

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs flex items-start gap-2.5 backdrop-blur-md">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <p className="font-semibold leading-relaxed">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-6" suppressHydrationWarning>
                {/* 6 Digit Input Boxes */}
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      suppressHydrationWarning
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black font-mono rounded-2xl border-2 border-slate-300 dark:border-white/15 bg-white/90 dark:bg-slate-950/70 text-slate-900 dark:text-white focus:border-blue-600 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm"
                    />
                  ))}
                </div>

                {/* Resend OTP Timer & Button */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    {timeLeft > 0 ? (
                      <span>
                        Kirim ulang dalam{" "}
                        <strong className="font-mono text-slate-800 dark:text-slate-200">
                          {timeLeft}s
                        </strong>
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        Siap kirim kode
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={timeLeft > 0 || resending}
                    className={`font-bold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                      timeLeft > 0 || resending
                        ? "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-600/30 cursor-pointer"
                    }`}
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                    {resending ? "Mengirim ke Email..." : "Kirim Ulang Kode Sekarang"}
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3.5 font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white shadow-xl shadow-blue-900/30 border border-blue-400/30 rounded-xl"
                  isLoading={loading}
                  disabled={fullOtp.length !== 6}
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Verifikasi & Daftarkan Akun
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Salah mengisi email?{" "}
                  <Link
                    href="/register"
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Kembali ke Formulir Pendaftaran
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            /* STEP 3: SUCCESS STATE - PENDING APPROVAL HRD */
            <div className="text-center py-2 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                <ShieldCheck className="w-9 h-9" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold mb-3">
                <Clock className="w-3.5 h-3.5" />
                Status: Menunggu Persetujuan (ACC) HRD
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Kode OTP Terverifikasi!
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                Pendaftaran akun untuk <strong className="text-slate-900 dark:text-white">{fullName || email}</strong> telah berhasil diverifikasi.
              </p>

              {/* Informative Guidance Card */}
              <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-left space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    i
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white block font-semibold">
                      Tahap Selanjutnya:
                    </strong>
                    Permohonan akun Anda saat ini telah diteruskan ke dasbor <strong>HRD CV. Asia Plastik</strong>. Tim HRD akan memverifikasi dan menyetujui (ACC) akun Anda sebelum dapat melakukan presensi.
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-white/5">
                  Notifikasi konfirmasi akan dikirimkan ke email <strong>{email}</strong> setelah disetujui.
                </div>
              </div>

              <div className="space-y-2.5">
                <Button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="w-full py-3.5 font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white shadow-xl shadow-blue-900/30 rounded-xl"
                >
                  Ke Halaman Masuk (Login) <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  Harap menunggu proses persetujuan oleh tim HRD.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-white/80 drop-shadow">
            CV. Asia Plastik • Gedung & Pabrik Injection Moulding Sidoarjo
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Memuat Verifikasi OTP...</span>
          </div>
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
