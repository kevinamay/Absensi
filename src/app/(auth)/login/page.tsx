"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { WhitelistAccessDeniedError } from "@/services/whitelistService";
import { EmailNotVerifiedError } from "@/services/authService";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { PrototypeSwitcher, PrototypeVariantInfo } from "@/components/prototype/PrototypeSwitcher";
import { VariantA } from "./variants/VariantA";
import { VariantB } from "./variants/VariantB";
import { VariantC } from "./variants/VariantC";
import { LoginVariantProps } from "./variants/types";

const PROTOTYPE_BACKGROUND_VARIANTS: PrototypeVariantInfo[] = [
  {
    id: "A",
    name: "A (Split Showcase Gedung)",
    description: "Showcase megah foto gedung CV. Asia Plastik di sisi kiri & form login bersih di sisi kanan.",
  },
  {
    id: "B",
    name: "B (Full-Bleed Immersive Glass)",
    description: "Foto gedung layar penuh imersif dengan kartu frosted glass melayang di tengah.",
  },
  {
    id: "C",
    name: "C (Angled Fasad Geometry)",
    description: "Desain dinamis terinspirasi dari sudut panel trapesium biru & silver fasad gedung.",
  },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [accessDeniedError, setAccessDeniedError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [timeStr, setTimeStr] = useState("");

  // Live WIB Clock
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

  // Check if redirected with error from middleware
  useEffect(() => {
    if (searchParams.get("error") === "session_required") {
      setGeneralError("Sesi Anda telah berakhir atau belum terautentikasi. Silakan masuk terlebih dahulu.");
    }
  }, [searchParams]);

  /**
   * LOGIN METHOD: Email & Password
   * Strictly validates against Firestore whitelist BEFORE finalizing the session.
   */
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccessDeniedError(null);
    setGeneralError(null);

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password.trim()) {
      setGeneralError("Mohon masukkan email dan kata sandi Anda.");
      return;
    }

    setSubmitting(true);
    try {
      await login(normalizedEmail, password);
      router.push("/intern");
    } catch (err: any) {
      console.warn("Login verification result:", err);
      if (
        err instanceof EmailNotVerifiedError ||
        err?.message?.includes("verify your email address first")
      ) {
        setGeneralError("Access Denied: Please verify your email address first.");
      } else if (
        err instanceof WhitelistAccessDeniedError ||
        err?.name === "WhitelistAccessDeniedError" ||
        err?.message?.includes("Access Denied")
      ) {
        setAccessDeniedError(
          "Access Denied: Your email is not registered with the MagangHub/SIAPkerja system for CV. Asia Plastik."
        );
      } else if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
        setGeneralError("Kredensial tidak valid. Pastikan email dan kata sandi sudah benar.");
      } else if (
        err.code === "auth/api-key-not-valid" ||
        err.code === "auth/invalid-api-key" ||
        err.message?.includes("API key not valid")
      ) {
        setGeneralError(
          "Firebase API Key belum aktif pada environment lokal. Gunakan akun demonstrasi terdaftar di bawah."
        );
      } else {
        setGeneralError(err.message || "Gagal masuk. Periksa kembali akun Anda.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const currentVariant = (searchParams.get("variant") || "A").toUpperCase();

  const variantProps: LoginVariantProps = {
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
    handleSubmit: handleLoginSubmit,
  };

  return (
    <>
      {/* Floating Theme Toggle (Light / Dark Mode) */}
      <ThemeToggle />

      {currentVariant === "B" && <VariantB {...variantProps} />}
      {currentVariant === "C" && <VariantC {...variantProps} />}
      {currentVariant !== "B" && currentVariant !== "C" && <VariantA {...variantProps} />}

      {/* Floating switcher to flip between background variations */}
      <PrototypeSwitcher
        variants={PROTOTYPE_BACKGROUND_VARIANTS}
        currentVariant={currentVariant}
      />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold">Memuat Portal CV. Asia Plastik...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
