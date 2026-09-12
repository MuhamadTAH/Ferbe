"use client";

import React, { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { SquirrelMascot, MascotMood } from "./SquirrelMascot";

export interface MascotTip {
  id: string;
  ku: string;
  en: string;
  tagKu: string;
  tagEn: string;
  mood: MascotMood;
}

export const SMORIK_TIPS: MascotTip[] = [
  {
    id: "tip-1",
    ku: "دەستخۆش! ڕۆژانە ١٥ خولەک فێربوون مەعجیزە دەکات!",
    en: "Well done! 15 minutes a day makes miracles!",
    tagKu: "بەردەوامی",
    tagEn: "Consistency",
    mood: "cheering",
  },
  {
    id: "tip-2",
    ku: "هەر بەڕوویەکی ئەمڕۆ، دەبێتە داربەڕوویەکی مەزن بۆ بەیانی!",
    en: "Every acorn of today becomes a mighty oak tomorrow!",
    tagKu: "دانایی بەڕوو",
    tagEn: "Oak Wisdom",
    mood: "celebrating",
  },
  {
    id: "tip-3",
    ku: "کە هەڵە دەکەیت، مێشکت گەشە دەکات! بەردەوام بە لە هەوڵدان.",
    en: "Mistakes help your brain grow! Keep on trying.",
    tagKu: "گەشەکردن",
    tagEn: "Growth",
    mood: "happy",
  },
  {
    id: "tip-4",
    ku: "سمۆڕە ئامۆژگاریت دەکات: وشە کوردییەکان بە دەنگی بەرز دووبارە بکەرەوە!",
    en: "Smorik tips: Repeat Kurdish words aloud for muscle memory!",
    tagKu: "بێژەکردن",
    tagEn: "Pronunciation",
    mood: "thinking",
  },
  {
    id: "tip-5",
    ku: "ئاگرین بە! زنجیرەی ڕۆژانەکەت بپارێزە و گەوهەر کۆبکەرەوە.",
    en: "Stay on fire! Protect your streak and collect gems.",
    tagKu: "زنجیرەی ئاگر",
    tagEn: "Streak Fire",
    mood: "fire",
  },
  {
    id: "tip-6",
    ku: "پشوودان بەشێکە لە فێربوون! هەر کاتێک ماندوو بوویت، کەمێک بحەسێوە.",
    en: "Rest is part of learning! Take a cozy break when you need.",
    tagKu: "پشوودان",
    tagEn: "Rest & Focus",
    mood: "sleeping",
  },
];

export interface SquirrelMotivationCardProps {
  initialTipIndex?: number;
  className?: string;
  showRefresh?: boolean;
  compact?: boolean;
  onTipChange?: (tip: MascotTip) => void;
}

/**
 * Duolingo-style motivational widget featuring Smorik (سمۆڕە) offering
 * daily tips and cheer in Kurdish Sorani and English.
 */
export function SquirrelMotivationCard({
  initialTipIndex = 0,
  className = "",
  showRefresh = true,
  compact = false,
  onTipChange,
}: SquirrelMotivationCardProps) {
  const [tipIndex, setTipIndex] = useState(
    Math.abs(initialTipIndex) % SMORIK_TIPS.length
  );
  const [isRotating, setIsRotating] = useState(false);

  const currentTip = SMORIK_TIPS[tipIndex];

  const handleNextTip = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 300);
    const nextIndex = (tipIndex + 1) % SMORIK_TIPS.length;
    setTipIndex(nextIndex);
    onTipChange?.(SMORIK_TIPS[nextIndex]);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-5 shadow-sm transition-all ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#F0F0F0] dark:border-[#202F36] pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#FFF4E5] dark:bg-[#341F05] text-[#FF9600]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#FF9600]">
              Smorik&apos;s Daily Tip
            </h3>
            <span
              dir="rtl"
              className="font-kurdish text-[11px] font-bold text-[#AFAFAF] dark:text-[#8495A0]"
            >
              ئامۆژگاری سمۆڕە
            </span>
          </div>
        </div>

        {/* Tag & Refresh Button */}
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-[#E8FAD4] dark:bg-[#1E3B20] px-2 py-0.5 text-[10px] font-extrabold text-[#58CC02] uppercase tracking-wide">
            {currentTip.tagEn}
          </span>
          {showRefresh && (
            <button
              type="button"
              onClick={handleNextTip}
              title="Next motivation tip"
              aria-label="Next tip"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#AFAFAF] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] hover:text-[#4B4B4B] dark:hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 transition-transform duration-300 ${
                  isRotating ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex ${
          compact ? "items-center gap-3" : "flex-col sm:flex-row items-center gap-4"
        }`}
      >
        {/* Smorik Mascot Avatar / Illustration */}
        <div className="shrink-0 flex items-center justify-center">
          <SquirrelMascot
            mood={currentTip.mood}
            accessory={
              currentTip.mood === "celebrating"
                ? "golden_acorn"
                : currentTip.mood === "fire"
                ? "sunglasses"
                : "none"
            }
            size={compact ? 56 : 76}
            animate
            interactive
            title={`Smorik saying: ${currentTip.en}`}
          />
        </div>

        {/* Bilingual Speech Bubble / Message */}
        <div className="flex-1 min-w-0 text-left">
          {/* Kurdish Sorani text */}
          <p
            dir="rtl"
            lang="ku"
            className="font-kurdish text-sm font-extrabold text-[#4B4B4B] dark:text-white kurdish-word leading-relaxed text-right"
          >
            {currentTip.ku}
          </p>

          {/* English translation */}
          <p className="mt-1 text-xs font-bold text-[#777777] dark:text-[#8495A0] leading-snug">
            {currentTip.en}
          </p>
        </div>
      </div>
    </div>
  );
}
