"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { VariantA } from "@/components/prototypes/VariantA";
import { VariantB } from "@/components/prototypes/VariantB";
import { VariantC } from "@/components/prototypes/VariantC";
import {
  PrototypeSwitcher,
  VariantOption,
} from "@/components/prototypes/PrototypeSwitcher";

const PROTOTYPE_VARIANTS: VariantOption[] = [
  {
    key: "A",
    name: "Corporate Split-Screen",
    description: "Showcase industri & form terpisah (Modern Enterprise)",
  },
  {
    key: "B",
    name: "Digital ID Card / Field Pass",
    description: "Desain kartu fisik karyawan & QR/NFC mobile-first",
  },
  {
    key: "C",
    name: "Cyber Command Console",
    description: "HUD industrial dark glassmorphism & dual-bay console",
  },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, setDemoUser } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Read active variant from URL (?variant=A|B|C), default to A
  const variantParam = searchParams.get("variant")?.toUpperCase() ?? "A";
  const activeVariantKey = ["A", "B", "C"].includes(variantParam)
    ? variantParam
    : "A";

  const handleLogin = async (
    identifier: string,
    pass: string,
    role: "intern" | "admin"
  ) => {
    setErrorMessage(null);

    if (!identifier.trim() || !pass.trim()) {
      setErrorMessage("Mohon masukkan ID / Email dan Kata Sandi Anda.");
      return;
    }

    setSubmitting(true);
    try {
      await login(identifier, pass);
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/intern");
      }
    } catch (err: any) {
      console.warn("Direct Firebase login:", err);
      setErrorMessage(
        "Autentikasi gagal atau Firebase API key belum terisi. Silakan gunakan tombol demo instan untuk melihat dashboard."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (role: "intern" | "admin") => {
    setDemoUser(role);
    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/intern");
    }
  };

  return (
    <>
      {activeVariantKey === "A" && (
        <VariantA
          onLogin={handleLogin}
          onQuickDemo={handleQuickDemo}
          submitting={submitting}
          errorMessage={errorMessage}
        />
      )}
      {activeVariantKey === "B" && (
        <VariantB
          onLogin={handleLogin}
          onQuickDemo={handleQuickDemo}
          submitting={submitting}
          errorMessage={errorMessage}
        />
      )}
      {activeVariantKey === "C" && (
        <VariantC
          onLogin={handleLogin}
          onQuickDemo={handleQuickDemo}
          submitting={submitting}
          errorMessage={errorMessage}
        />
      )}

      {/* Floating switcher to flip between variants seamlessly */}
      <PrototypeSwitcher
        variants={PROTOTYPE_VARIANTS}
        currentVariantKey={activeVariantKey}
      />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
