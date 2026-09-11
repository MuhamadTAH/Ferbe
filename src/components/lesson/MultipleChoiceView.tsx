"use client";

import { Check, X } from "lucide-react";
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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div
          dir={kurdishPrompt ? "rtl" : "ltr"}
          lang={kurdishPrompt ? "ku" : "en"}
          className={
            kurdishPrompt
              ? "font-kurdish text-5xl sm:text-6xl font-bold leading-normal text-[#4B4B4B] kurdish-word select-none"
              : "text-3xl sm:text-4xl font-extrabold text-[#4B4B4B] select-none"
          }
        >
          {exercise.promptText}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {options.map((option, index) => {
          const isSelected = selected === option;
          const isCorrectRow =
            answered && option.trim().toLowerCase() === correctAnswer.toLowerCase();
          const isWrongPick = answered && isSelected && !isCorrectRow;

          return (
            <button
              key={`${exercise._id}:${option}`}
              type="button"
              disabled={answered}
              onClick={() => onSelect(option)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 border-b-4 px-4 py-3 text-left font-bold transition-colors",
                !answered && isSelected
                  ? "border-[#84D8FF] bg-[#DDF4FF] text-[#1899D6]"
                  : !answered
                    ? "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:bg-[#F7F7F7]"
                    : isCorrectRow
                      ? "border-[#A5ED6E] bg-[#D7FFB8] text-[#58A700]"
                      : isWrongPick
                        ? "border-[#FFB2B2] bg-[#FFDFE0] text-[#EA2B2B]"
                        : "border-[#E5E5E5] bg-white text-[#AFAFAF]"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-b-4 text-xs font-extrabold",
                  !answered && isSelected
                    ? "border-[#84D8FF] bg-white text-[#1899D6]"
                    : !answered
                      ? "border-[#E5E5E5] bg-white text-[#AFAFAF]"
                      : isCorrectRow
                        ? "border-[#A5ED6E] bg-white text-[#58A700]"
                        : isWrongPick
                          ? "border-[#FFB2B2] bg-white text-[#EA2B2B]"
                          : "border-[#E5E5E5] bg-white text-[#AFAFAF]"
                )}
              >
                {LABELS[index] ?? index + 1}
              </span>
              <span className="flex-1">{option}</span>
              {isCorrectRow && <Check className="h-5 w-5 stroke-[3]" />}
              {isWrongPick && <X className="h-5 w-5 stroke-[3]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
