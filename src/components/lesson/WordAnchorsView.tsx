"use client";

import { useState } from "react";
import { Volume2, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface WordItem {
  english: string;
  pronunciationKurdish: string;
  meaningKurdish: string;
  note?: string;
}

interface WordAnchorsViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

export function WordAnchorsView({ exercise, onSelect, selected }: WordAnchorsViewProps) {
  const [listened, setListened] = useState<Set<string>>(new Set());
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const solution = exercise.solutionData ?? {};
  const words: WordItem[] = (solution.words as WordItem[] | undefined) ?? [
    {
      english: "Hello",
      pronunciationKurdish: "هێڵۆو",
      meaningKurdish: "سڵاو",
      note: "فەرمی و باو",
    },
    {
      english: "Hi",
      pronunciationKurdish: "های",
      meaningKurdish: "سڵاو",
      note: "دۆستانە",
    },
    {
      english: "Hey",
      pronunciationKurdish: "هێی",
      meaningKurdish: "سڵاو",
      note: "نافەرمی",
    },
  ];

  const handlePlayWord = (english: string) => {
    setPlayingWord(english);
    playAmericanSpeech(english, 0.85);

    const next = new Set(listened);
    next.add(english);
    setListened(next);

    // If all words listened to, enable continue
    if (next.size >= words.length) {
      onSelect((solution.correct as string) || "completed");
    }

    setTimeout(() => {
      setPlayingWord(null);
    }, 1000);
  };

  const instruction = (solution.instruction as string | undefined) ?? "پێناسەی وشە (Word Anchors)";
  const allListened = listened.size >= words.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header instructions with clear Kurdish direction */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8FAD4] dark:bg-[#1E3B20] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#58CC02]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          سڵاوکردن لە زمانی ئینگلیزیدا
        </h2>
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          گوێ لە هەر سێ شێوازەکە بگرە بۆ بەردەوامبوون ({listened.size} لە {words.length})
        </p>
      </div>

      {/* 3 Stacked Word Cards */}
      <div className="flex flex-col gap-3.5">
        {words.map((w) => {
          const isHeard = listened.has(w.english);
          const isPlaying = playingWord === w.english;

          return (
            <div
              key={w.english}
              onClick={() => handlePlayWord(w.english)}
              className={cn(
                "group relative flex items-center justify-between rounded-2xl border-2 border-b-4 p-4.5 transition-all cursor-pointer select-none",
                isHeard
                  ? "border-[#58CC02] bg-[#F7FCF0] dark:border-[#58CC02] dark:bg-[#132817]"
                  : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] hover:bg-[#F4FBFF] dark:border-[#37464F] dark:bg-[#131F24] dark:hover:border-[#1CB0F6]"
              )}
            >
              {/* Left Column: English Word + Audio Button */}
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  aria-label={`Play ${w.english}`}
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-b-2 transition-all",
                    isPlaying
                      ? "border-[#1899D6] bg-[#1CB0F6] text-white animate-pulse"
                      : isHeard
                        ? "border-[#46A302] bg-[#58CC02] text-white"
                        : "border-[#1899D6] bg-[#1CB0F6] text-white group-hover:scale-105"
                  )}
                >
                  <Volume2 className="h-5 w-5" />
                </button>

                <div className="flex flex-col text-left">
                  <span dir="ltr" className="text-2xl font-black tracking-tight text-[#4B4B4B] dark:text-white">
                    {w.english}
                  </span>
                  {w.note && (
                    <span dir="rtl" className="font-kurdish text-[11px] font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                      ({w.note})
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Kurdish Transliteration & Meaning Badges on Separate Lines */}
              <div className="flex flex-col items-end gap-1 text-right">
                {/* How to read in Kurdish */}
                <div className="flex items-center gap-1.5">
                  <span className="rounded-lg bg-[#EBF6FF] dark:bg-[#1C3342] px-2.5 py-0.5 font-kurdish text-sm font-extrabold text-[#1899D6] dark:text-[#3BC0F8]">
                    {w.pronunciationKurdish}
                  </span>
                  <span className="text-[10px] font-bold text-[#AFAFAF] dark:text-[#8495A0]">خوێندنەوە:</span>
                </div>

                {/* Kurdish Meaning */}
                <div className="flex items-center gap-1.5">
                  <span className="rounded-lg bg-[#F5F5F5] dark:bg-[#202F36] px-2.5 py-0.5 font-kurdish text-sm font-bold text-[#4B4B4B] dark:text-[#DCE6EC]">
                    ({w.meaningKurdish})
                  </span>
                  <span className="text-[10px] font-bold text-[#AFAFAF] dark:text-[#8495A0]">واتا:</span>
                </div>
              </div>

              {/* Heard Checkmark Badge */}
              {isHeard && (
                <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#58CC02] text-white shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allListened && (
        <div className="rounded-2xl border border-[#58CC02]/40 bg-[#E8FAD4] dark:bg-[#1E3B20] p-3 text-center animate-in fade-in">
          <p dir="rtl" className="font-kurdish text-xs font-extrabold text-[#58CC02]">
            هەموو وشەکانت بیست! کلیک لەسەر دوگمەی خوارەوە بکە بۆ بەردەوامبوون.
          </p>
        </div>
      )}
    </div>
  );
}
