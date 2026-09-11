"use client";

import { Check, Volume2, VolumeX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

const LABELS = ["A", "B", "C", "D", "E", "F"];

interface AudioMatchViewProps {
  exercise: Exercise;
  options: string[];
  selected: string | null;
  lastCorrect: boolean | null;
  onSelect: (value: string) => void;
}

/** "Tap what you hear": big speaker button + matching option rows. */
export function AudioMatchView({
  exercise,
  options,
  selected,
  lastCorrect,
  onSelect,
}: AudioMatchViewProps) {
  const { play, isPlayingUrl, isAudioUnavailable } = useAudioPlayer();
  const audioUrl = exercise.solutionData.audioUrl ?? null;
  const unavailable = isAudioUnavailable(audioUrl);
  const answered = lastCorrect !== null;
  const correctAnswer = (exercise.solutionData.correct ?? "").trim();
  const isKurdishAudio = exercise.solutionData.audioLang === "kurdish";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 py-2">
        <button
          type="button"
          disabled={unavailable}
          onClick={() => play(audioUrl)}
          aria-label="Play audio"
          className={cn(
            "flex h-24 w-24 items-center justify-center rounded-3xl border-b-4 text-white transition-all",
            unavailable
              ? "cursor-not-allowed border-[#E5E5E5] bg-[#E5E5E5] text-[#AFAFAF]"
              : isPlayingUrl(audioUrl)
                ? "translate-y-[2px] border-b-2 border-[#1899D6] bg-[#1CB0F6]"
                : "border-[#1899D6] bg-[#1CB0F6] hover:bg-[#4FC3F9] active:translate-y-[2px] active:border-b-2"
          )}
        >
          {unavailable ? (
            <VolumeX className="h-10 w-10" />
          ) : (
            <Volume2
              className={cn("h-10 w-10", isPlayingUrl(audioUrl) && "animate-pulse")}
            />
          )}
        </button>
        {unavailable ? (
          <span className="text-sm font-bold text-[#AFAFAF]">Audio unavailable</span>
        ) : (
          <span className="text-sm font-bold text-[#777777]">
            Tap the speaker, then choose {isKurdishAudio ? "the Kurdish text" : "what you hear"}
          </span>
        )}
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
              <span
                dir={isKurdishAudio ? "rtl" : "ltr"}
                lang={isKurdishAudio ? "ku" : "en"}
                className={cn(
                  "flex-1",
                  isKurdishAudio && "font-kurdish text-2xl kurdish-word"
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
