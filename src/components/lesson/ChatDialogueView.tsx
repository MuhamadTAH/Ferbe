"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen, Volume2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface ChatDialogueViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
  lastCorrect: boolean | null;
}

export function ChatDialogueView({
  exercise,
  onSelect,
  selected,
  lastCorrect,
}: ChatDialogueViewProps) {
  const [isPlayingIncoming, setIsPlayingIncoming] = useState(false);

  const solution = exercise.solutionData ?? {};
  const incomingMessage = (solution.incomingMessage as string) || "Hello! My name's Sirwa.";
  const correctAnswer = ((solution.correct as string) || "He's Nabaz.").trim();
  const imageUrl = (solution.imageUrl as string) || "";
  const speakerName = (solution.speakerName as string) || "Sirwa (سیروە)";

  const options: string[] = (solution.options as string[] | undefined) ?? [
    "He's Nabaz.",
    "She's Nabaz.",
    "I'm Nabaz.",
  ];

  const instruction = (solution.instruction as string) || "چیرۆکی کتێبەکە (Book Story Dialogue)";
  const answered = lastCorrect !== null;
  const chosenAnswer = selected;

  const handlePlayIncoming = useCallback(() => {
    setIsPlayingIncoming(true);
    playAmericanSpeech(incomingMessage, 0.88);
    setTimeout(() => setIsPlayingIncoming(false), 1500);
  }, [incomingMessage]);

  // Auto-play ONLY the incoming question on mount!
  useEffect(() => {
    const timer = setTimeout(() => {
      handlePlayIncoming();
    }, 400);
    return () => clearTimeout(timer);
  }, [handlePlayIncoming]);

  const handlePickOption = (option: string) => {
    if (answered) return;
    onSelect(option);

    // Play pronunciation of selected response so learner hears it in dialogue
    setTimeout(() => {
      playAmericanSpeech(option, 0.88);
    }, 150);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#DDF4FF] dark:bg-[#1C3B4E] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1CB0F6]">
          <BookOpen className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          چیرۆکەکە تەواو بکە — دێڕی دواتر هەڵبژێرە
        </h2>
      </div>

      {/* Story panel illustration from the book */}
      {imageUrl && (
        <div className="mx-auto flex w-full max-w-md items-center justify-center overflow-hidden rounded-3xl border-2 border-[#E5E5E5] bg-white p-2 shadow-sm dark:border-[#37464F] dark:bg-[#131F24]">
          <img
            src={imageUrl}
            alt="Story panel illustration"
            className="h-48 w-full object-contain rounded-2xl"
          />
        </div>
      )}

      {/* Story Dialogue Strip */}
      <div className="mx-auto flex w-full max-w-md flex-col gap-3 rounded-3xl border-2 border-[#E5E5E5] bg-[#F7F9FA] p-5 shadow-xs dark:border-[#37464F] dark:bg-[#0E161A]">
        {/* Character Line (Top) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#1CB0F6]">
              {speakerName}
            </span>
            <button
              type="button"
              onClick={handlePlayIncoming}
              aria-label="Replay incoming audio"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-extrabold transition-all cursor-pointer",
                isPlayingIncoming
                  ? "bg-[#1CB0F6] text-white animate-pulse"
                  : "bg-white text-[#1899D6] border border-[#E5E5E5] hover:bg-[#DDF4FF] dark:bg-[#1A262C] dark:text-[#3BC0F8] dark:border-[#37464F]"
              )}
            >
              <Volume2 className="h-3.5 w-3.5" />
              <span>گوێگرتن</span>
            </button>
          </div>
          <div className="rounded-2xl border-2 border-[#1CB0F6]/30 bg-white p-4 shadow-xs dark:border-[#1C3B4E] dark:bg-[#1A262C]">
            <p dir="ltr" className="text-xl font-black text-[#4B4B4B] dark:text-white">
              &ldquo;{incomingMessage}&rdquo;
            </p>
          </div>
        </div>

        {/* Continuation Prompt (Bottom) */}
        <div className="flex flex-col gap-1.5 mt-1">
          <span className="text-xs font-black uppercase tracking-wider text-[#58CC02]">
            دێڕی دواتری چیرۆکەکە (Next line):
          </span>
          <div
            className={cn(
              "rounded-2xl border-2 p-3.5 transition-all text-center",
              !answered && chosenAnswer
                ? "border-[#58CC02] bg-[#E8FAD4] dark:border-[#58CC02] dark:bg-[#1E3B20]"
                : answered
                  ? lastCorrect
                    ? "border-[#58CC02] bg-[#E8FAD4] dark:border-[#58CC02] dark:bg-[#1E3B20]"
                    : "border-[#EA2B2B] bg-[#FFDFE0] dark:border-[#EA2B2B] dark:bg-[#3A181D]"
                  : "border-dashed border-[#AFAFAF] bg-white/70 dark:border-[#37464F] dark:bg-[#131F24]"
            )}
          >
            <p
              dir="ltr"
              className={cn(
                "text-lg font-black",
                chosenAnswer
                  ? answered
                    ? lastCorrect
                      ? "text-[#58A700] dark:text-[#58CC02]"
                      : "text-[#EA2B2B]"
                    : "text-[#58A700] dark:text-[#58CC02]"
                  : "text-[#AFAFAF] italic"
              )}
            >
              {chosenAnswer ? `“${chosenAnswer}”` : "دێڕی دروست لە خوارەوە هەڵبژێرە..."}
            </p>
          </div>
        </div>
      </div>

      {/* 3 Response Choices */}
      <div className="flex flex-col gap-2.5 mt-1">
        <span className="text-center text-xs font-black uppercase text-[#AFAFAF] dark:text-[#8495A0]">
          وەڵامی گونجاو هەڵبژێرە (Select the correct line):
        </span>

        {options.map((option, idx) => {
          const isSelected = chosenAnswer === option;
          const isCorrect = option.trim().toLowerCase() === correctAnswer.toLowerCase();
          const isCorrectRow = answered && isCorrect;
          const isWrongPick = answered && isSelected && !isCorrect;
          const letter = ["A", "B", "C"][idx] || `${idx + 1}`;

          return (
            <button
              key={option}
              type="button"
              disabled={answered}
              onClick={() => handlePickOption(option)}
              className={cn(
                "flex items-center gap-3.5 rounded-2xl border-2 border-b-4 p-4 font-black transition-all text-left select-none cursor-pointer",
                !answered && isSelected
                  ? "border-[#84D8FF] bg-[#DDF4FF] text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#202F36] dark:text-[#3BC0F8]"
                  : !answered
                    ? "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#1CB0F6] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:text-white"
                    : isCorrectRow
                      ? "border-[#58CC02] bg-[#E8FAD4] text-[#58A700] dark:border-[#58CC02] dark:bg-[#1E3B20] dark:text-[#58CC02]"
                      : isWrongPick
                        ? "border-[#EA2B2B] bg-[#FFDFE0] text-[#EA2B2B] dark:border-[#EA2B2B] dark:bg-[#3A181D]"
                        : "border-[#E5E5E5] bg-white text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#52656D]"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 border-b-2 text-xs font-black",
                  !answered && isSelected
                    ? "border-[#1CB0F6] bg-white text-[#1CB0F6] dark:bg-[#131F24] dark:text-[#3BC0F8]"
                    : !answered
                      ? "border-[#E5E5E5] bg-[#F7F7F7] text-[#777777] dark:border-[#37464F] dark:bg-[#202F36] dark:text-white"
                      : isCorrectRow
                        ? "border-[#58CC02] bg-white text-[#58CC02] dark:bg-[#131F24] dark:text-[#58CC02]"
                        : isWrongPick
                          ? "border-[#EA2B2B] bg-white text-[#EA2B2B] dark:bg-[#131F24] dark:text-[#EA2B2B]"
                          : "border-[#E5E5E5] bg-[#F7F7F7] text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#202F36] dark:text-[#52656D]"
                )}
              >
                {letter}
              </span>

              <span dir="ltr" className="text-base flex-1">
                {option}
              </span>

              {isCorrectRow && <CheckCircle2 className="h-5 w-5 stroke-[2.5] text-[#58CC02]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
