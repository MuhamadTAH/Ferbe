"use client";

import { useState, useEffect } from "react";
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
  const [speaking, setSpeaking] = useState(false);
  const audioUrl = (exercise.solutionData.audioUrl as string | undefined) ?? null;
  const answered = lastCorrect !== null;
  const correctAnswer = ((exercise.solutionData.correct as string) ?? "").trim();
  const spokenText = ((exercise.solutionData?.spokenText as string | undefined) ?? correctAnswer).trim();
  const instruction = exercise.solutionData?.instruction as string | undefined;
  const icon = exercise.solutionData?.icon as string | undefined;
  const isKurdishAudio = exercise.solutionData.audioLang === "kurdish";
  const isEnglishAudio =
    exercise.solutionData.audioLang === "english" ||
    (!isKurdishAudio && /^[a-zA-Z\s,.'!?-]+$/.test(correctAnswer));

  // If we have HTML5 audio URL, check its availability. If not, check speech synthesis capability.
  const hasSpeechSynth = typeof window !== "undefined" && "speechSynthesis" in window;
  const unavailable = audioUrl
    ? isAudioUnavailable(audioUrl)
    : !hasSpeechSynth || !spokenText;

  const isPlaying = isPlayingUrl(audioUrl) || speaking;

  // Cleanup speech on unmount or exercise switch
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [exercise._id]);

  const handlePlay = () => {
    if (audioUrl && !isAudioUnavailable(audioUrl)) {
      play(audioUrl);
    } else if (hasSpeechSynth && spokenText) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {instruction && (
        <div className="px-1 text-center">
          <p className="text-xs font-black uppercase tracking-wider text-[#AFAFAF] dark:text-[#8495A0]">
            {instruction}
          </p>
        </div>
      )}

      <div className="flex flex-col items-center gap-3 py-2">
        {icon && (
          <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-black/10 bg-[#F7F7F7] text-4xl shadow-sm dark:border-white/10 dark:bg-[#202F36]">
            {icon}
          </div>
        )}
        <button
          type="button"
          disabled={unavailable}
          onClick={handlePlay}
          aria-label="Play audio"
          className={cn(
            "flex h-24 w-24 items-center justify-center rounded-3xl border-b-4 text-white transition-all",
            unavailable
              ? "cursor-not-allowed border-[#E5E5E5] bg-[#E5E5E5] text-[#AFAFAF]"
              : isPlaying
                ? "translate-y-[2px] border-b-2 border-[#1899D6] bg-[#1CB0F6]"
                : "border-[#1899D6] bg-[#1CB0F6] hover:bg-[#4FC3F9] active:translate-y-[2px] active:border-b-2 shadow-sm cursor-pointer"
          )}
        >
          {unavailable ? (
            <VolumeX className="h-10 w-10" />
          ) : (
            <Volume2
              className={cn("h-10 w-10", isPlaying && "animate-pulse")}
            />
          )}
        </button>
        {unavailable ? (
          <span className="text-sm font-bold text-[#AFAFAF] dark:text-[#8495A0]">Audio unavailable</span>
        ) : (
          <span className="text-sm font-bold text-[#777777] dark:text-[#8495A0] text-center">
            {isEnglishAudio ? (
              <>
                <span dir="rtl" className="font-kurdish font-bold kurdish-word text-[#4B4B4B] dark:text-white">
                  گوێ بگرە، پاشان ئەوەی دەیبیستیت هەڵبژێرە
                </span>
                <span className="block text-xs text-[#AFAFAF] dark:text-[#8495A0]">
                  (Listen and tap what you hear)
                </span>
              </>
            ) : isKurdishAudio ? (
              "Tap the speaker, then choose the Kurdish text"
            ) : (
              "Tap the speaker, then choose what you hear"
            )}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {options.map((option, index) => {
          const isSelected = selected === option;
          const isCorrectRow =
            answered && option.trim().toLowerCase() === correctAnswer.toLowerCase();
          const isWrongPick = answered && isSelected && !isCorrectRow;
          const isOptionKurdish = /[\u0600-\u06FF]/.test(option);

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
                dir={isOptionKurdish ? "rtl" : "ltr"}
                lang={isOptionKurdish ? "ku" : "en"}
                className={cn(
                  "flex-1",
                  isOptionKurdish
                    ? "font-kurdish text-2xl kurdish-word text-right"
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
