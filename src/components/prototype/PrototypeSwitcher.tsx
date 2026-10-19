"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Layers, Sparkles } from "lucide-react";

export interface PrototypeVariantInfo {
  id: string;
  name: string;
  description: string;
  badge?: string;
}

interface PrototypeSwitcherProps {
  variants: PrototypeVariantInfo[];
  currentVariant: string;
}

export function PrototypeSwitcher({ variants, currentVariant }: PrototypeSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentIndex = variants.findIndex((v) => v.id.toLowerCase() === currentVariant.toLowerCase());
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const activeVariant = variants[safeIndex];

  const navigateTo = (newVariantId: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("variant", newVariantId);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handlePrev = () => {
    const nextIdx = (safeIndex - 1 + variants.length) % variants.length;
    navigateTo(variants[nextIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (safeIndex + 1) % variants.length;
    navigateTo(variants[nextIdx].id);
  };

  // Keyboard navigation: left/right arrows when not typing in an input
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [safeIndex, variants]);

  return (
    <aside
      aria-label="Prototype Background Switcher"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <div className="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-full bg-slate-900/95 dark:bg-slate-950/95 text-white border border-slate-700/80 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
        <div className="flex items-center gap-2 mr-2">
          <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-400">
                Prototype / Background
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                {safeIndex + 1}/{variants.length}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-100 flex items-center gap-1">
              {activeVariant.name}
            </span>
          </div>
        </div>

        {/* Quick selector buttons */}
        <div className="flex items-center bg-slate-800/80 rounded-full p-0.5 border border-slate-700/60">
          {variants.map((v) => {
            const isSelected = v.id.toLowerCase() === currentVariant.toLowerCase();
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => navigateTo(v.id)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
                title={v.description}
              >
                {v.id}
              </button>
            );
          })}
        </div>

        {/* Arrow controllers */}
        <div className="flex items-center gap-1 ml-1">
          <button
            type="button"
            onClick={handlePrev}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center text-slate-300 hover:text-white transition-all"
            title="Varian Sebelumnya (Panah Kiri ←)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 flex items-center justify-center text-slate-300 hover:text-white transition-all"
            title="Varian Berikutnya (Panah Kanan →)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
