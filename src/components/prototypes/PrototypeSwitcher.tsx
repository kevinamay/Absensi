"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Layers, Sparkles } from "lucide-react";

export interface VariantOption {
  key: string;
  name: string;
  description: string;
}

interface PrototypeSwitcherProps {
  variants: VariantOption[];
  currentVariantKey: string;
}

export function PrototypeSwitcher({
  variants,
  currentVariantKey,
}: PrototypeSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentIndex = variants.findIndex((v) => v.key === currentVariantKey);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentVariant = variants[safeIndex];

  const setVariant = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("variant", key);
    router.replace(`?${params.toString()}`);
  };

  const handlePrev = () => {
    const prevIndex = (safeIndex - 1 + variants.length) % variants.length;
    setVariant(variants[prevIndex].key);
  };

  const handleNext = () => {
    const nextIndex = (safeIndex + 1) % variants.length;
    setVariant(variants[nextIndex].key);
  };

  // Keyboard arrow listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute("contenteditable") === "true";

      if (isInput) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [safeIndex, variants]);

  return (
    <aside aria-label="Prototype Variant Switcher" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div className="flex items-center gap-2 p-1.5 px-3 bg-slate-900/95 border border-amber-500/40 rounded-full shadow-2xl backdrop-blur-xl text-slate-200">
        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Layers className="w-3 h-3 text-amber-400" />
          Prototype
        </span>

        <button
          type="button"
          onClick={handlePrev}
          title="Varian Sebelumnya (Panah Kiri ←)"
          className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center px-2 min-w-[200px] text-center">
          <span className="text-xs font-bold text-white tracking-tight">
            Varian {currentVariant.key}: {currentVariant.name}
          </span>
          <span className="text-[10px] text-slate-400 font-normal">
            {currentVariant.description}
          </span>
        </div>

        <button
          type="button"
          onClick={handleNext}
          title="Varian Berikutnya (Panah Kanan →)"
          className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
