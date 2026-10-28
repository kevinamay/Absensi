"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  variant?: "floating" | "inline";
}

export function ThemeToggle({
  className = "",
  variant = "floating",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse ${
          variant === "floating" ? "fixed top-5 right-5 z-50" : ""
        } ${className}`}
      />
    );
  }

  const isDark = theme === "dark";

  const baseStyles =
    variant === "floating"
      ? "fixed top-5 right-5 z-50 p-2.5 px-3.5 rounded-2xl border shadow-xl backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      : "p-2 px-3 rounded-xl border transition-all flex items-center gap-1.5";

  const themeSpecificStyles = isDark
    ? "bg-slate-900/90 border-slate-700 text-amber-300 shadow-slate-950/60 hover:bg-slate-800"
    : "bg-white/95 border-slate-300 text-slate-800 shadow-slate-200/80 hover:bg-slate-50";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      suppressHydrationWarning
      aria-label={isDark ? "Ubah ke Mode Terang" : "Ubah ke Mode Gelap"}
      title={isDark ? "Klik untuk Mode Terang (Light)" : "Klik untuk Mode Gelap (Dark)"}
      className={`${baseStyles} ${themeSpecificStyles} ${className} cursor-pointer`}
    >
      {isDark ? (
        <>
          <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-180 duration-300" />
          <span className="text-xs font-bold text-slate-200 hidden sm:inline">
            Mode Gelap
          </span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 text-indigo-600 animate-in spin-in-180 duration-300" />
          <span className="text-xs font-bold text-slate-700 hidden sm:inline">
            Mode Terang
          </span>
        </>
      )}
    </button>
  );
}
