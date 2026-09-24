"use client";

import { useState } from "react";
import { Volume2, CheckCircle2, SplitSquareVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";
import { KurdishGlossBadges } from "@/components/lesson/KurdishGlossBadges";

interface BreakdownRow {
  english: string;
  pronunciationKurdish: string;
  meaningKurdish: string;
  isFullPhrase?: boolean;
}

interface AnalyticBreakdownViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

export function AnalyticBreakdownView({ exercise, onSelect, selected }: AnalyticBreakdownViewProps) {
  const [playedRow4, setPlayedRow4] = useState(false);
  const [activePlayingIndex, setActivePlayingIndex] = useState<number | null>(null);

  const solution = exercise.solutionData ?? {};
  const rows: BreakdownRow[] = (solution.rows as BreakdownRow[] | undefined) ?? [
    {
      english: "How",
      pronunciationKurdish: "هەو",
      meaningKurdish: "چۆن",
    },
    {
      english: "are",
      pronunciationKurdish: "ئاڕ",
      meaningKurdish: "هەیت",
    },
    {
      english: "you",
      pronunciationKurdish: "یو",
      meaningKurdish: "تۆ",
    },
    {
      english: "How are you?",
      pronunciationKurdish: "هەواریو؟",
      meaningKurdish: "چۆنیت؟",
      isFullPhrase: true,
    },
  ];

  const handlePlayRow = (row: BreakdownRow, index: number) => {
    setActivePlayingIndex(index);
    // Row 4 plays connected fluent speech; rows 1-3 play single words
    playAmericanSpeech(row.english, row.isFullPhrase ? 0.9 : 0.8);

    if (row.isFullPhrase) {
      setPlayedRow4(true);
      onSelect((solution.correct as string) || "How are you?");
    }

    setTimeout(() => {
      setActivePlayingIndex(null);
    }, 1200);
  };

  const instruction = (solution.instruction as string | undefined) ?? "شیکردنەوەی پێکهاتەی ڕستە (Analytic Breakdown)";

  return (
    <div className="flex flex-col gap-6">
      {/* Header instructions */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#DDF4FF] dark:bg-[#1C3B4E] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1CB0F6]">
          <SplitSquareVertical className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          شیکردنەوەی ڕستەی &quot;How are you?&quot;
        </h2>
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          سەرنج بدە چۆن وشەکان بە جیا دەخوێندرێنەوە، و لە کۆتاییدا پێکەوە دەبەسترێن
        </p>
      </div>

      {/* 4 Interactive Rows */}
      <div className="flex flex-col gap-3">
        {rows.map((row, index) => {
          const isPlaying = activePlayingIndex === index;
          const isRow4 = Boolean(row.isFullPhrase);

          return (
            <div
              key={row.english}
              onClick={() => handlePlayRow(row, index)}
              className={cn(
                "group relative flex items-center justify-between rounded-2xl border-2 border-b-4 p-4 transition-all cursor-pointer select-none",
                isRow4
                  ? playedRow4
                    ? "border-[#58CC02] bg-[#F7FCF0] shadow-md dark:border-[#58CC02] dark:bg-[#132817]"
                    : "border-[#1CB0F6] bg-[#F0F9FF] ring-2 ring-[#1CB0F6]/30 dark:border-[#1CB0F6] dark:bg-[#172D3A]"
                  : "border-[#E5E5E5] bg-white hover:border-[#AFAFAF] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:hover:border-[#52656D]"
              )}
            >
              {/* Left Column: English text + Play button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={`Play ${row.english}`}
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-b-2 transition-all",
                    isPlaying
                      ? "border-[#1899D6] bg-[#1CB0F6] text-white animate-pulse"
                      : isRow4
                        ? "border-[#1899D6] bg-[#1CB0F6] text-white group-hover:scale-105"
                        : "border-[#AFAFAF] bg-[#E5E5E5] text-[#4B4B4B] group-hover:bg-[#1CB0F6] group-hover:text-white dark:bg-[#2A3B43] dark:text-white"
                  )}
                >
                  <Volume2 className="h-5 w-5" />
                </button>

                <div className="flex flex-col">
                  <span
                    dir="ltr"
                    className={cn(
                      "font-black tracking-tight",
                      isRow4 ? "text-xl text-[#1899D6] dark:text-[#3BC0F8]" : "text-lg text-[#4B4B4B] dark:text-white"
                    )}
                  >
                    {row.english}
                  </span>
                  {isRow4 && (
                    <span className="text-[10px] font-extrabold uppercase text-[#1CB0F6] dark:text-[#3BC0F8]">
                      Connected Native Speech
                    </span>
                  )}
                </div>
              </div>

              {/* Middle & Right: Aligned Kurdish Transliteration & Meaning Badges */}
              <KurdishGlossBadges
                pronunciation={row.pronunciationKurdish}
                meaning={row.meaningKurdish}
              />

              {isRow4 && playedRow4 && (
                <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#58CC02] text-white shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {playedRow4 ? (
        <div className="rounded-2xl border border-[#58CC02]/40 bg-[#E8FAD4] dark:bg-[#1E3B20] p-3 text-center animate-in fade-in">
          <p dir="rtl" className="font-kurdish text-xs font-extrabold text-[#58CC02]">
            زۆر باشە! دەستت لەسەر ڕستە تەواوەکە دا. بۆ هەنگاوی داهاتوو کلیک لەسەر دوگمەی خوارەوە بکە.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#1CB0F6]/40 bg-[#DDF4FF] dark:bg-[#1C3B4E] p-3 text-center">
          <p dir="rtl" className="font-kurdish text-xs font-extrabold text-[#1899D6] dark:text-[#3BC0F8]">
            دەست لەسەر دێڕی چوارەم بدە (How are you?) تاوەکو دەنگە پێکەوەبەستراوەکە ببیستیت.
          </p>
        </div>
      )}
    </div>
  );
}
