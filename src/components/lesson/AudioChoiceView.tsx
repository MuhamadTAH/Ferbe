"use client";

import { useState, useEffect } from "react";
import { Volume2, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface AudioChoiceViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
  lastCorrect: boolean | null;
}

/**
 * Generic "hear a reduction, pick the right text option" screen.
 * Used for: 1.2/S5 (Reduction Decoder), 1.5/S4 (Blind Lexical Identification).
 */
export function AudioChoiceView({ exercise, onSelect, selected, lastCorrect }: AudioChoiceViewProps) {
  const solution = exercise.solutionData ?? {};
  const audioText = (solution.audioText as string) || "What about you?";
  const question = (solution.question as string) || "What did you hear?";
  const correctAnswer = ((solution.correct as string) || "").trim();
  const options: string[] = (solution.options as string[] | undefined) ?? [];
  const instruction = (solution.instruction as string) || "ڕاهێنانی بیستن (Audio Choice)";

  const [isPlaying, setIsPlaying] = useState(false);
  const answered = lastCorrect !== null;

  useEffect(() => {
    const t = setTimeout(() => {
      playAudio();
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const playAudio = () => {
    setIsPlaying(true);
    playAmericanSpeech(audioText, 1.0);
    setTimeout(() => setIsPlaying(false), 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#DDF4FF] dark:bg-[#1C3B4E] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1CB0F6]">
          <Volume2 className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          {question}
        </h2>
      </div>

      {/* Audio player button */}
      <button
        type="button"
        onClick={playAudio}
        className={cn(
          "mx-auto flex w-full max-w-sm items-center justify-center gap-3 rounded-3xl border-2 border-b-4 py-8 transition-all",
          isPlaying
            ? "border-[#1CB0F6] bg-[#DDF4FF] dark:border-[#1CB0F6] dark:bg-[#1C3B4E]"
            : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#131F24]"
        )}
      >
        <Volume2 className={cn("h-8 w-8", isPlaying ? "text-[#1CB0F6] animate-pulse" : "text-[#AFAFAF]")} />
        <span className={cn("text-base font-black", isPlaying ? "text-[#1CB0F6]" : "text-[#AFAFAF] dark:text-[#8495A0]")}>
          {isPlaying ? "گوێ بگرە..." : "▶ کلیک بکە بۆ گوێگرتن"}
        </span>
      </button>

      {/* Text choices */}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrect = opt.trim().toLowerCase() === correctAnswer.toLowerCase();
          const isCorrectRow = answered && isCorrect;
          const isWrongPick = answered && isSelected && !isCorrect;

          return (
            <button
              key={opt}
              type="button"
              disabled={answered}
              onClick={() => onSelect(opt)}
              className={cn(
                "flex items-center justify-between rounded-2xl border-2 border-b-4 p-4 font-black transition-all text-left select-none cursor-pointer",
                !answered && isSelected
                  ? "border-[#84D8FF] bg-[#DDF4FF] text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#202F36]"
                  : !answered
                    ? "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#1CB0F6] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:text-white"
                    : isCorrectRow
                      ? "border-[#A5ED6E] bg-[#D7FFB8] text-[#58A700] dark:border-[#58CC02] dark:bg-[#1E3B20] dark:text-[#58CC02]"
                      : isWrongPick
                        ? "border-[#FFB2B2] bg-[#FFDFE0] text-[#EA2B2B] dark:border-[#EA2B2B] dark:bg-[#3A181D] dark:text-[#FF6666]"
                        : "border-[#E5E5E5] bg-white text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#52656D]"
              )}
            >
              <span dir="ltr" className="text-base sm:text-lg">{opt}</span>
              {isCorrectRow && <CheckCircle2 className="h-5 w-5 stroke-[2.5] text-[#58CC02]" />}
              {isWrongPick && <X className="h-5 w-5 stroke-[2.5] text-[#EA2B2B]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
