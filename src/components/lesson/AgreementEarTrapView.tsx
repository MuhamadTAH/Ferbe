"use client";

import { useState } from "react";
import { Volume2, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface AudioResponseBubble {
  id: string;    // "A", "B", "C"
  label: string; // "Response A"
  text: string;  // what plays
}

interface AgreementEarTrapViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
  lastCorrect: boolean | null;
}

/**
 * Lesson 1.5 Screen 5: Three playable audio response bubbles. Prompt plays, learner must pick correct response by ear.
 */
export function AgreementEarTrapView({ exercise, onSelect, selected, lastCorrect }: AgreementEarTrapViewProps) {
  const solution = exercise.solutionData ?? {};
  const promptText = (solution.promptText as string) || "I like Dolma, what about you?";
  const responses: AudioResponseBubble[] = (solution.responses as AudioResponseBubble[] | undefined) ?? [
    { id: "A", label: "Response A", text: "Me too." },
    { id: "B", label: "Response B", text: "You too." },
    { id: "C", label: "Response C", text: "Thank you." },
  ];
  const correctId = (solution.correctId as string) || "A";
  const instruction = (solution.instruction as string) || "ڕاهێنانی بیستن (Agreement Ear Trap)";

  const [promptPlaying, setPromptPlaying] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const answered = lastCorrect !== null;

  const playPrompt = () => {
    setPromptPlaying(true);
    playAmericanSpeech(promptText, 0.9);
    setTimeout(() => setPromptPlaying(false), 1600);
  };

  const playResponse = (r: AudioResponseBubble) => {
    setPlayingId(r.id);
    playAmericanSpeech(r.text, 0.9);
    setTimeout(() => setPlayingId(null), 800);
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
          کام وەڵامی دروستە؟
        </h2>
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          پەیامەکە گوێ بگرە پاشان وەڵامی گونجاو هەڵبژێرە
        </p>
      </div>

      {/* Prompt */}
      <button
        type="button"
        onClick={playPrompt}
        className={cn(
          "flex items-center gap-3 rounded-2xl border-2 border-b-4 p-5 text-left transition-all",
          promptPlaying
            ? "border-[#1CB0F6] bg-[#DDF4FF] dark:bg-[#1C3B4E]"
            : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#131F24]"
        )}
      >
        <div className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-b-2",
          promptPlaying ? "border-[#1899D6] bg-[#1CB0F6] text-white animate-pulse" : "border-[#1899D6] bg-[#1CB0F6] text-white"
        )}>
          <Volume2 className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black uppercase text-[#AFAFAF]">پرسیار (Prompt)</span>
          <span dir="ltr" className="text-base font-black text-[#4B4B4B] dark:text-white">{promptText}</span>
        </div>
      </button>

      {/* Response bubbles */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-black uppercase text-[#AFAFAF] dark:text-[#8495A0]">
          وەڵامەکان (Responses)
        </span>
        {responses.map((r) => {
          const isCorrect = r.id === correctId;
          const isSelected = selected === r.id;
          const isCorrectRow = answered && isCorrect;
          const isWrongPick = answered && isSelected && !isCorrect;

          return (
            <div key={r.id} className="flex gap-2.5">
              {/* Play this response */}
              <button
                type="button"
                onClick={() => playResponse(r)}
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-b-2 transition-all",
                  playingId === r.id
                    ? "border-[#1899D6] bg-[#1CB0F6] text-white animate-pulse"
                    : "border-[#1899D6] bg-[#1CB0F6] text-white hover:bg-[#4FC3F9]"
                )}
              >
                <Volume2 className="h-4 w-4" />
              </button>

              {/* Select this response */}
              <button
                type="button"
                onClick={() => !answered && onSelect(r.id)}
                disabled={answered}
                className={cn(
                  "flex flex-1 items-center justify-between rounded-2xl border-2 border-b-4 px-4 py-3 font-black transition-all text-left",
                  !answered && isSelected
                    ? "border-[#84D8FF] bg-[#DDF4FF] text-[#1899D6]"
                    : !answered
                      ? "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#1CB0F6] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:text-white"
                      : isCorrectRow
                        ? "border-[#A5ED6E] bg-[#D7FFB8] text-[#58A700] dark:border-[#58CC02] dark:bg-[#1E3B20] dark:text-[#58CC02]"
                        : isWrongPick
                          ? "border-[#FFB2B2] bg-[#FFDFE0] text-[#EA2B2B]"
                          : "border-[#E5E5E5] bg-white text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#52656D]"
                )}
              >
                <span className="text-base">🔈 {r.label}</span>
                {isCorrectRow && <CheckCircle2 className="h-5 w-5 text-[#58CC02]" />}
                {isWrongPick && <X className="h-5 w-5 text-[#EA2B2B]" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
