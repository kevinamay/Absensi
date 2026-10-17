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
        className={`w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 animate-pulse ${className}`}
      />
    );
  }

  const isDark = theme === "dark";

  const baseStyles =
    variant === "floating"
      ? "fixed top-5 right-5 z-50 p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-all duration-200"
      : "p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
      title={isDark ? "Beralih ke Mode Terang (Light)" : "Beralih ke Mode Gelap (Dark)"}
      className={`${baseStyles} ${className} flex items-center justify-center cursor-pointer`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-180 duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 animate-in spin-in-180 duration-300" />
      )}
    </button>
  );
}
