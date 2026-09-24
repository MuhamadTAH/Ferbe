"use client";

import { useState } from "react";
import { RotateCcw, Volume2, CheckCircle2, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";
import { KurdishGlossBadges } from "@/components/lesson/KurdishGlossBadges";

interface BounceBackAnchorViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
  lastCorrect: boolean | null;
}

export function BounceBackAnchorView({
  exercise,
  onSelect,
  selected,
  lastCorrect,
}: BounceBackAnchorViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const solution = exercise.solutionData ?? {};
  const englishPhrase = (solution.phrase as string) || "What about you?";
  const pronunciationHelper = (solution.pronunciation as string) || "وەرەباوتیو؟";
  const meaningKurdish = (solution.meaning as string) || "ئەی تۆ؟ / تۆ چۆنیت؟";
  const correctAnswer = ((solution.correct as string) || "Ask the question back").trim();

  const options: string[] = (solution.options as string[] | undefined) ?? [
    "Ask the question back (پرسیارەکە بە هەمان شێوە بپرسەوە)",
    "Say goodbye (ماڵئاوایی کردن)",
  ];

  const instruction = (solution.instruction as string) || "گەڕاندنەوەی پرسیارەکە (The Bounce-Back Anchor)";

  const handlePlayAudio = () => {
    setIsPlaying(true);
    playAmericanSpeech("What about you?", 0.88);
    setTimeout(() => setIsPlaying(false), 1200);
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF5FF] dark:bg-[#2D1B4E] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#9333EA] dark:text-[#C084FC]">
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          ئەرکی ئەم دەستەواژەیە چییە؟
        </h2>
      </div>

      {/* Large Featured Card: What about you? with clean BiDi separation */}
      <div className="flex flex-col items-center gap-3 w-full max-w-md rounded-3xl border-2 border-[#E5E5E5] bg-white p-6 shadow-sm dark:border-[#37464F] dark:bg-[#131F24]">
        {/* English phrase on strict LTR row */}
        <div dir="ltr" className="flex items-center justify-center gap-3">
          <span className="text-3xl sm:text-4xl font-black text-[#4B4B4B] dark:text-white tracking-tight">
            {englishPhrase}
          </span>
          <button
            type="button"
            onClick={handlePlayAudio}
            aria-label="Play What about you?"
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-b-2 transition-all cursor-pointer",
              isPlaying
                ? "border-[#7E22CE] bg-[#9333EA] text-white animate-pulse"
                : "border-[#1899D6] bg-[#1CB0F6] text-white hover:bg-[#4FC3F9]"
            )}
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>

        {/* Aligned Kurdish Pronunciation & Meaning Badges */}
        <KurdishGlossBadges
          pronunciation={pronunciationHelper}
          meaning={meaningKurdish}
          className="mt-2"
        />
      </div>

      {/* Functional Role Options */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        <span className="text-xs font-black uppercase text-[#AFAFAF] dark:text-[#8495A0]">
          ئەم دەستەواژەیە بۆ چ مەبەستێک بەکاردێت؟
        </span>

        {(() => {
          const answered = lastCorrect !== null;
          return options.map((opt) => {
            const isSelected = selected === opt;
            const isCorrect = opt.includes("Ask the question back") || opt === correctAnswer;
            const isCorrectRow = answered && isCorrect;
            const isWrongPick = answered && isSelected && !isCorrect;

            return (
              <button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => onSelect(opt)}
                className={cn(
                  "flex items-center justify-between rounded-2xl border-2 border-b-4 p-4 font-black transition-all select-none cursor-pointer text-left",
                  !answered && isSelected
                    ? "border-[#84D8FF] bg-[#DDF4FF] text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#202F36] dark:text-[#3BC0F8]"
                    : !answered
                      ? "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#1CB0F6] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:text-white"
                      : isCorrectRow
                        ? "border-[#A5ED6E] bg-[#D7FFB8] text-[#58A700] dark:border-[#58CC02] dark:bg-[#1E3B20] dark:text-[#58CC02]"
                        : isWrongPick
                          ? "border-[#FFB2B2] bg-[#FFDFE0] text-[#EA2B2B] dark:border-[#EA2B2B] dark:bg-[#3A181D] dark:text-[#FF6666]"
                          : "border-[#E5E5E5] bg-white text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#52656D]"
                )}
              >
                <span dir="rtl" className="font-kurdish text-sm sm:text-base font-bold text-right flex-1">
                  {opt}
                </span>
                {isCorrectRow && <CheckCircle2 className="h-5 w-5 stroke-[2.5] text-[#58CC02] ml-2" />}
              </button>
            );
          });
        })()}
      </div>
    </div>
  );
}
