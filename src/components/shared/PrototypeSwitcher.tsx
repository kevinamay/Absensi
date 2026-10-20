"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Sparkles, Layers } from "lucide-react";

export interface PrototypeVariantInfo {
  key: string;
  name: string;
  description: string;
}

interface PrototypeSwitcherProps {
  variants: PrototypeVariantInfo[];
  currentVariant: string;
}

export function PrototypeSwitcher({
  variants,
  currentVariant,
}: PrototypeSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentIndex = variants.findIndex((v) => v.key === currentVariant);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;
  const activeVariant = variants[activeIndex];

  const setVariant = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("variant", key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handlePrev = () => {
    const nextIndex = (activeIndex - 1 + variants.length) % variants.length;
    setVariant(variants[nextIndex].key);
  };

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % variants.length;
    setVariant(variants[nextIndex].key);
  };

  // Keyboard navigation: Left/Right arrows (ignored when input/textarea is focused)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (
        activeTag === "input" ||
        activeTag === "textarea" ||
        activeTag === "select" ||
        document.activeElement?.getAttribute("contenteditable") === "true"
      ) {
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

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, variants]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 border border-white/20 text-white shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
        <div className="flex items-center gap-1.5 pl-1.5 pr-2 border-r border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
            Prototype
          </span>
        </div>

        <button
          type="button"
          onClick={handlePrev}
          title="Varian Sebelumnya (←)"
          className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-slate-300 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 px-2">
          {variants.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => setVariant(v.key)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                v.key === activeVariant.key
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              Varian {v.key}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          title="Varian Berikutnya (→)"
          className="p-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-slate-300 hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-white/15 text-[11px] text-slate-300 max-w-[200px] truncate">
          <Layers className="w-3 h-3 text-cyan-400 shrink-0" />
          <span className="truncate">{activeVariant.name}</span>
        </div>
      </div>
    </div>
  );
}
