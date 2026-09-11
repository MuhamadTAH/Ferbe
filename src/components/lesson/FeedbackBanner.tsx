"use client";

import { Check, X } from "lucide-react";
import { PushButton } from "@/components/duo/PushButton";
import { cn } from "@/lib/utils";

interface FeedbackBannerProps {
  visible: boolean;
  correct: boolean | null;
  correctSolution: string | null;
  solutionIsKurdish: boolean;
  onContinue: () => void;
}

/** Bottom feedback banner (Duolingo-style) that doubles as the footer. */
export function FeedbackBanner({
  visible,
  correct,
  correctSolution,
  solutionIsKurdish,
  onContinue,
}: FeedbackBannerProps) {
  if (!visible || correct === null) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t-2",
        correct ? "border-[#A5ED6E] bg-[#D7FFB8]" : "border-[#FFB2B2] bg-[#FFDFE0]"
      )}
      role="status"
    >
      <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-4 sm:px-6">
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white",
            correct ? "text-[#58A700]" : "text-[#EA2B2B]"
          )}
        >
          {correct ? (
            <Check className="h-7 w-7 stroke-[3]" />
          ) : (
            <X className="h-7 w-7 stroke-[3]" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-lg font-extrabold",
              correct ? "text-[#58A700]" : "text-[#EA2B2B]"
            )}
          >
            {correct ? "Excellent!" : "Correct solution:"}
          </p>
          {!correct && correctSolution ? (
            <p
              dir={solutionIsKurdish ? "rtl" : "ltr"}
              lang={solutionIsKurdish ? "ku" : "en"}
              className={cn(
                "truncate font-bold text-[#EA2B2B]",
                solutionIsKurdish && "font-kurdish text-xl kurdish-word"
              )}
            >
              {correctSolution}
            </p>
          ) : null}
        </div>

        <PushButton
          variant={correct ? "green" : "red"}
          onClick={onContinue}
          className="shrink-0 px-8 py-3"
        >
          Continue
        </PushButton>
      </div>
    </div>
  );
}
