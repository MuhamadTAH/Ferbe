"use client";

import { useState } from "react";
import { Volume2, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";
import { KurdishGlossBadges } from "@/components/lesson/KurdishGlossBadges";

interface WordItem {
  english: string;
  pronunciationKurdish?: string;
  meaningKurdish?: string;
  kurdish?: string;
  meaning?: string;
  note?: string;
  audio?: string;
  emoji?: string;
  imageUrl?: string;
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

  const handlePlayWord = (w: WordItem) => {
    setPlayingWord(w.english);
    playAmericanSpeech(w.audio || w.english, 0.85);

    const next = new Set(listened);
    next.add(w.english);
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
  const title = (solution.title as string | undefined) || (exercise.promptText ? exercise.promptText : "ناساندنی دەنگ و وشەکان");
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
          {title}
        </h2>
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          گوێ لە هەموو دەنگەکان بگرە بۆ بەردەوامبوون ({listened.size} لە {words.length})
        </p>
      </div>

      {/* Vertical word cards — image on top, explanation below (2 per screen) */}
      <div className="grid grid-cols-1 gap-4">
        {words.map((w) => {
          const isHeard = listened.has(w.english);
          const isPlaying = playingWord === w.english;

          return (
            <div
              key={w.english}
              onClick={() => handlePlayWord(w)}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-3xl border-2 border-b-4 transition-all cursor-pointer select-none",
                isHeard
                  ? "border-[#58CC02] bg-[#F7FCF0] dark:border-[#58CC02] dark:bg-[#132817]"
                  : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] hover:bg-[#F4FBFF] dark:border-[#37464F] dark:bg-[#131F24] dark:hover:border-[#1CB0F6]"
              )}
            >
              {/* Image on top — big and centered */}
              <div className="flex h-44 w-full items-center justify-center border-b border-black/5 bg-gradient-to-b from-[#EAF4FF] to-white p-3 sm:h-52 dark:border-white/10 dark:from-[#1B262C] dark:to-[#131F24]">
                {w.imageUrl ? (
                  <img
                    src={w.imageUrl}
                    alt={w.english}
                    className="h-full w-auto max-w-full object-contain"
                    loading="eager"
                  />
                ) : (
                  <span className="text-7xl leading-none">{w.emoji}</span>
                )}
              </div>

              {/* Explanation below — word, article and Kurdish gloss */}
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    aria-label={`Play ${w.english}`}
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-b-2 transition-all",
                      isPlaying
                        ? "border-[#1899D6] bg-[#1CB0F6] text-white animate-pulse"
                        : isHeard
                          ? "border-[#46A302] bg-[#58CC02] text-white"
                          : "border-[#1899D6] bg-[#1CB0F6] text-white group-hover:scale-105"
                    )}
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>

                  <div className="flex min-w-0 flex-col text-left">
                    <span dir="ltr" className="truncate text-2xl font-black tracking-tight text-[#4B4B4B] dark:text-white">
                      {w.english}
                    </span>
                    {w.note && (
                      <span dir="rtl" className="truncate font-kurdish text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                        ({w.note})
                      </span>
                    )}
                  </div>
                </div>

                <KurdishGlossBadges
                  pronunciation={w.pronunciationKurdish}
                  meaning={w.meaningKurdish || w.kurdish || w.meaning}
                />
              </div>

              {/* Heard Checkmark Badge */}
              {isHeard && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#58CC02] text-white shadow-sm">
                  <CheckCircle2 className="h-4 w-4 stroke-[3]" />
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
