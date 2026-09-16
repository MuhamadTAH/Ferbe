"use client";

import { useEffect } from "react";
import { Puzzle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface SlotFillerViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
  lastCorrect: boolean | null;
}

export function SlotFillerView({
  exercise,
  onSelect,
  selected,
  lastCorrect,
}: SlotFillerViewProps) {

  const solution = exercise.solutionData ?? {};
  const correctAnswer = ((solution.correct as string) || "great").trim();
  const options = (solution.options as string[] | undefined) ?? (exercise.distractors
    ? [correctAnswer, ...exercise.distractors]
    : ["great", "hello", "how", "are"]);

  const instruction = (solution.instruction as string) || "بۆشاییەکە پڕبکەرەوە (Slot-and-Filler)";

  const answered = lastCorrect !== null;

  const handleChoose = (opt: string) => {
    if (answered) return;
    onSelect(opt);
  };

  useEffect(() => {
    if (answered && lastCorrect) {
      playAmericanSpeech("I'm great, thank you.", 0.88);
    }
  }, [answered, lastCorrect]);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
          <Puzzle className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          بۆشاییەکە بە وشەی دروست پڕبکەرەوە
        </h2>
      </div>

      {/* Target sentence frame */}
      <div className="mx-auto flex w-full max-w-md items-center justify-center rounded-3xl border-2 border-[#1CB0F6]/40 bg-[#DDF4FF] dark:bg-[#1C3B4E] px-6 py-6 shadow-sm">
        <div dir="ltr" className="flex items-center gap-2 text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white">
          <span>I&apos;m</span>
          <span
            className={cn(
              "inline-flex min-w-24 items-center justify-center rounded-2xl border-2 border-b-4 px-3 py-1.5 text-xl font-black transition-all",
              answered
                ? lastCorrect
                  ? "border-[#58CC02] bg-[#58CC02] text-white shadow-md animate-in zoom-in-95"
                  : "border-[#EA2B2B] bg-[#FFDFE0] text-[#EA2B2B] dark:border-[#EA2B2B] dark:bg-[#3A181D]"
                : selected
                  ? "border-[#1CB0F6] bg-white text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#131F24] dark:text-[#3BC0F8]"
                  : "border-dashed border-[#1899D6] bg-white text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#131F24]"
            )}
          >
            {selected ? selected : "?"}
          </span>
          <span>, thank you.</span>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-2">
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
              onClick={() => handleChoose(opt)}
              className={cn(
                "flex items-center justify-center rounded-2xl border-2 border-b-4 p-4 font-black text-xl transition-all select-none cursor-pointer",
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
              <span dir="ltr">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
