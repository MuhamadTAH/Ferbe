"use client";

import { Check, X, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";

const LABELS = ["1", "2", "3", "4", "5", "6"];

interface MultipleChoiceViewProps {
  exercise: Exercise;
  options: string[];
  selected: string | null;
  /** null = not yet answered; otherwise shows correct/wrong row states */
  lastCorrect: boolean | null;
  onSelect: (value: string) => void;
  /** Prompt text is Kurdish and should render RTL */
  kurdishPrompt?: boolean;
}

export function MultipleChoiceView({
  exercise,
  options,
  selected,
  lastCorrect,
  onSelect,
  kurdishPrompt,
}: MultipleChoiceViewProps) {
  const answered = lastCorrect !== null;
  const correctAnswer = (exercise.solutionData.correct ?? "").trim();
  const icon = exercise.solutionData?.icon as string | undefined;
  const instruction = exercise.solutionData?.instruction as string | undefined;
  const isSpeaking = Boolean(exercise.solutionData?.isSpeaking || exercise.solutionData?.type === "speak");
  const spokenText = ((exercise.solutionData?.spokenText as string | undefined) ?? correctAnswer).trim();

  const handlePlayModel = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col gap-4">
      {instruction && (
        <div className="px-1 text-center">
          <p className="text-xs font-black uppercase tracking-wider text-[#AFAFAF] dark:text-[#8495A0]">
            {instruction}
          </p>
        </div>
      )}

      <div className="flex flex-col items-center justify-center py-4 text-center">
        {icon && (
          <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-black/10 bg-[#F7F7F7] text-5xl shadow-sm dark:border-white/10 dark:bg-[#202F36]">
            {icon}
          </div>
        )}

        {(() => {
          const text = exercise.promptText.trim();
          const match = text.match(/^(.*?)\s*\((.*?)\)$/);
          if (match) {
            const part1 = match[1].trim();
            const part2 = match[2].trim();
            const part1IsKurdish = /[\u0600-\u06FF]/.test(part1);
            return (
              <div className="flex flex-col items-center gap-2 select-none">
                <div
                  dir={part1IsKurdish ? "rtl" : "ltr"}
                  className={
                    part1IsKurdish
                      ? "font-kurdish text-3xl sm:text-4xl font-bold leading-normal text-[#4B4B4B] dark:text-white"
                      : "text-3xl sm:text-4xl font-black text-[#4B4B4B] dark:text-white"
                  }
                >
                  {part1}
                </div>
                <div
                  dir={part1IsKurdish ? "ltr" : "rtl"}
                  className={
                    part1IsKurdish
                      ? "text-xl font-bold text-[#777777] dark:text-[#8495A0]"
                      : "font-kurdish text-2xl font-bold text-[#777777] dark:text-[#8495A0]"
                  }
                >
                  ({part2})
                </div>
              </div>
            );
          }
          return (
            <div
              dir={kurdishPrompt ? "rtl" : "ltr"}
              lang={kurdishPrompt ? "ku" : "en"}
              className={
                kurdishPrompt
                  ? "font-kurdish text-4xl sm:text-5xl font-bold leading-normal text-[#4B4B4B] dark:text-white kurdish-word select-none"
                  : "text-3xl sm:text-4xl font-extrabold text-[#4B4B4B] dark:text-white select-none"
              }
            >
              {exercise.promptText}
            </div>
          );
        })()}

        {isSpeaking && (
          <div className="mt-4 flex items-center justify-center">
            <button
              type="button"
              onClick={handlePlayModel}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#1899D6] bg-[#1CB0F6] px-4 py-2 font-extrabold text-white transition-transform hover:bg-[#4FC3F9] active:translate-y-[2px]"
            >
              <Volume2 className="h-4 w-4" />
              <span>Listen / دووبارەکردنەوە</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {options.map((option, index) => {
          const isSelected = selected === option;
          const isCorrectRow =
            answered && option.trim().toLowerCase() === correctAnswer.toLowerCase();
          const isWrongPick = answered && isSelected && !isCorrectRow;
          const isKurdishOption = /[\u0600-\u06FF]/.test(option);

          return (
            <button
              key={`${exercise._id}:${option}`}
              type="button"
              disabled={answered}
              onClick={() => onSelect(option)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 border-b-4 px-4 py-3 font-bold transition-colors",
                !answered && isSelected
                  ? "border-[#84D8FF] bg-[#DDF4FF] text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#202F36] dark:text-[#3BC0F8]"
                  : !answered
                    ? "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#DCE6EC] dark:hover:bg-[#202F36]"
                    : isCorrectRow
                      ? "border-[#A5ED6E] bg-[#D7FFB8] text-[#58A700] dark:border-[#58CC02] dark:bg-[#1B351B] dark:text-[#58CC02]"
                      : isWrongPick
                        ? "border-[#FFB2B2] bg-[#FFDFE0] text-[#EA2B2B] dark:border-[#EA2B2B] dark:bg-[#3A181D] dark:text-[#FF6666]"
                        : "border-[#E5E5E5] bg-white text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#52656D]"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-b-4 text-xs font-extrabold",
                  !answered && isSelected
                    ? "border-[#84D8FF] bg-white text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#131F24] dark:text-[#3BC0F8]"
                    : !answered
                      ? "border-[#E5E5E5] bg-white text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#202F36] dark:text-[#8495A0]"
                      : isCorrectRow
                        ? "border-[#A5ED6E] bg-white text-[#58A700] dark:border-[#58CC02] dark:bg-[#131F24] dark:text-[#58CC02]"
                        : isWrongPick
                          ? "border-[#FFB2B2] bg-white text-[#EA2B2B] dark:border-[#EA2B2B] dark:bg-[#131F24] dark:text-[#FF6666]"
                          : "border-[#E5E5E5] bg-white text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#52656D]"
                )}
              >
                {LABELS[index] ?? index + 1}
              </span>
              <span
                dir={isKurdishOption ? "rtl" : "ltr"}
                lang={isKurdishOption ? "ku" : "en"}
                className={cn(
                  "flex-1",
                  isKurdishOption
                    ? "font-kurdish text-2xl font-bold kurdish-word text-right"
                    : "font-sans text-lg font-bold text-left"
                )}
              >
                {option}
              </span>
              {isCorrectRow && <Check className="h-5 w-5 stroke-[3]" />}
              {isWrongPick && <X className="h-5 w-5 stroke-[3]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
