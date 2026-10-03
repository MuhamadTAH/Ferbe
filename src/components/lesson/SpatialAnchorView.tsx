"use client";

import { useState, useEffect } from "react";
import { Volume2, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface SpatialCard {
  label: string;
  word: string; // "This" or "That"
  emoji: string;
  description: string; // Kurdish description
  distance: "near" | "far";
}

interface SpatialAnchorViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

/**
 * Lesson 1.4 Screen 1: This vs That spatial anchor.
 * Two side-by-side cards. User must tap both to enable Continue.
 */
export function SpatialAnchorView({ exercise, onSelect, selected }: SpatialAnchorViewProps) {
  const solution = exercise.solutionData ?? {};
  const cards: SpatialCard[] = (solution.cards as SpatialCard[] | undefined) ?? [
    { label: "Near", word: "This", emoji: "👆🚗", description: "ذس / ئەمە - نزیک", distance: "near" },
    { label: "Far", word: "That", emoji: "👉🚗💨", description: "ذات / ئەوە - دوور", distance: "far" },
  ];
  const instruction = (solution.instruction as string) || "ڕاهێنانی واتا (Spatial Anchor)";

  const [tapped, setTapped] = useState<Set<string>>(new Set());
  const [playing, setPlaying] = useState<string | null>(null);

  const handleTap = (word: string) => {
    setPlaying(word);
    playAmericanSpeech(word, 0.9);
    setTimeout(() => setPlaying(null), 800);

    const next = new Set(tapped);
    next.add(word);
    setTapped(next);

    if (next.size >= cards.length) {
      onSelect("completed");
    }
  };

  const allTapped = tapped.size >= cards.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#DDF4FF] dark:bg-[#1C3B4E] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1CB0F6]">
          <Volume2 className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          نزیک یان دوور — جیاوازیەکە یاد بگرە
        </h2>
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          دەست لە هەردوو کارتەکە بدە تاوەکو بەردەوامبوون ({tapped.size}/{cards.length})
        </p>
      </div>

      {/* Two cards side by side */}
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => {
          const isTapped = tapped.has(card.word);
          const isPlaying = playing === card.word;

          return (
            <button
              key={card.word}
              type="button"
              onClick={() => handleTap(card.word)}
              className={cn(
                "flex flex-col items-center gap-3 rounded-3xl border-2 border-b-4 py-8 px-4 transition-all select-none cursor-pointer",
                isTapped
                  ? "border-[#58CC02] bg-[#E8FAD4] dark:border-[#58CC02] dark:bg-[#132817]"
                  : isPlaying
                    ? "border-[#1CB0F6] bg-[#DDF4FF] animate-pulse"
                    : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] hover:bg-[#F4FBFF] dark:border-[#37464F] dark:bg-[#131F24]"
              )}
            >
              <span className="text-5xl leading-none">{card.emoji}</span>
              <div className="flex flex-col items-center gap-0.5">
                <span className={cn(
                  "text-3xl font-black",
                  card.distance === "near" ? "text-[#1CB0F6]" : "text-[#9333EA]"
                )}>
                  {card.word}
                </span>
                <span className="text-xs font-bold text-[#AFAFAF] uppercase">{card.label}</span>
              </div>
              <span dir="rtl" className="font-kurdish text-center text-xs font-bold text-[#777777] dark:text-[#8495A0] leading-snug">
                {card.description}
              </span>
              {isTapped && <CheckCircle2 className="h-5 w-5 text-[#58CC02]" />}
            </button>
          );
        })}
      </div>

      {allTapped && (
        <div className="rounded-2xl border border-[#58CC02]/40 bg-[#E8FAD4] dark:bg-[#1E3B20] p-3 text-center animate-in fade-in">
          <p dir="rtl" className="font-kurdish text-xs font-extrabold text-[#58CC02]">
            باشە! THIS = نزیک، THAT = دوور. بەردەوامبوون!
          </p>
        </div>
      )}
    </div>
  );
}
