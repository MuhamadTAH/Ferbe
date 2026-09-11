"use client";

import { useState } from "react";
import { Check, X, Flag, CheckCircle2 } from "lucide-react";
import { PushButton } from "@/components/duo/PushButton";
import { cn } from "@/lib/utils";

interface FeedbackBannerProps {
  visible: boolean;
  correct: boolean | null;
  correctSolution: string | null;
  solutionIsKurdish: boolean;
  onContinue: () => void;
}

const REPORT_REASONS = [
  "The Kurdish audio does not sound correct.",
  "The Kurdish Sorani transliteration is inaccurate.",
  "The audio pronunciation is missing.",
  "The dictionary hints on hover are missing.",
  "My answer should have been accepted.",
  "Something else went wrong.",
];

/** Bottom feedback banner (Duolingo-style) that doubles as the footer. */
export function FeedbackBanner({
  visible,
  correct,
  correctSolution,
  solutionIsKurdish,
  onContinue,
}: FeedbackBannerProps) {
  const [feedbackState, setFeedbackState] = useState<"none" | "easy" | "difficult">("none");
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!visible || correct === null) return null;

  function handleReportSubmit() {
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReportOpen(false);
      setReportSubmitted(false);
      setSelectedReason(null);
    }, 1000);
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t-2 shadow-lg",
          correct ? "border-[#A5ED6E] bg-[#D7FFB8]" : "border-[#FFB2B2] bg-[#FFDFE0]"
        )}
        role="status"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-4 sm:px-6">
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-xs",
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
              {correct ? "Awesome!" : "Correct solution:"}
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

            {/* Duolingo Feedback Pill Toggles */}
            {correct && (
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFeedbackState(feedbackState === "easy" ? "none" : "easy")
                  }
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide transition-all",
                    feedbackState === "easy"
                      ? "border-[#58A700] bg-[#58A700] text-white"
                      : "border-[#58A700]/30 text-[#58A700] hover:bg-[#58A700]/10"
                  )}
                >
                  Too Easy
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFeedbackState(feedbackState === "difficult" ? "none" : "difficult")
                  }
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide transition-all",
                    feedbackState === "difficult"
                      ? "border-[#58A700] bg-[#58A700] text-white"
                      : "border-[#58A700]/30 text-[#58A700] hover:bg-[#58A700]/10"
                  )}
                >
                  Too Difficult
                </button>
                <button
                  type="button"
                  onClick={() => setIsReportOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#777777] hover:text-[#4B4B4B] transition-colors ml-1"
                  title="Report question"
                >
                  <Flag className="h-3 w-3" />
                  <span>Report</span>
                </button>
              </div>
            )}

            {!correct && (
              <div className="mt-1 flex items-center">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(true)}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#EA2B2B] hover:underline"
                >
                  <Flag className="h-3 w-3" />
                  <span>Report issue</span>
                </button>
              </div>
            )}
          </div>

          <PushButton
            variant={correct ? "green" : "red"}
            onClick={onContinue}
            className="shrink-0 px-8 py-3 text-sm font-extrabold"
          >
            Continue
          </PushButton>
        </div>
      </div>

      {/* Duolingo Report Issue Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border-2 border-[#E5E5E5] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#4B4B4B]">Report an issue</h3>
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="rounded-xl p-1 text-[#AFAFAF] hover:bg-[#F7F7F7] hover:text-[#4B4B4B]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-8 text-center text-[#58CC02]">
                <CheckCircle2 className="mx-auto h-12 w-12" />
                <p className="mt-3 text-sm font-extrabold">Thank you for reporting!</p>
                <p className="mt-1 text-xs text-[#777777]">
                  Our Kurdish linguists will review this question.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-4 flex flex-col gap-2.5">
                  {REPORT_REASONS.map((reason) => (
                    <label
                      key={reason}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border-2 p-3 text-xs font-bold transition-all cursor-pointer",
                        selectedReason === reason
                          ? "border-[#1CB0F6] bg-[#DDF4FF] text-[#1899D6]"
                          : "border-[#E5E5E5] hover:bg-[#F7F7F7] text-[#4B4B4B]"
                      )}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="accent-[#1CB0F6]"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsReportOpen(false)}
                    className="flex-1 rounded-2xl border-2 border-[#E5E5E5] py-2.5 text-xs font-extrabold uppercase text-[#777777] hover:bg-[#F7F7F7]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!selectedReason}
                    onClick={handleReportSubmit}
                    className="flex-1 rounded-2xl border-b-4 border-[#1899D6] bg-[#1CB0F6] py-2.5 text-xs font-extrabold uppercase text-white hover:bg-[#4FC3F9] active:translate-y-[2px] active:border-b-2 disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

