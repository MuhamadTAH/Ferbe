"use client";

import { useState, useEffect } from "react";
import { Check, X, Volume2, Mic, Timer } from "lucide-react";
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
  const icon = exercise.solutionData.icon as string | undefined;
  const instruction = exercise.solutionData.instruction as string | undefined;
  const isSpeaking = Boolean(exercise.solutionData.isSpeaking || exercise.solutionData.type === "speak");
  const timerSeconds = exercise.solutionData.timerSeconds as number | undefined;

  const [prevExerciseId, setPrevExerciseId] = useState(exercise._id);
  const [timeLeft, setTimeLeft] = useState<number | null>(timerSeconds ?? null);
  const [isListening, setIsListening] = useState(false);
  const [speakingModel, setSpeakingModel] = useState(false);

  if (prevExerciseId !== exercise._id) {
    setPrevExerciseId(exercise._id);
    setTimeLeft(timerSeconds ?? null);
  }

  useEffect(() => {
    if (!timerSeconds || answered) return;
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [exercise._id, timerSeconds, answered]);

  const handlePlayModel = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const text = (exercise.solutionData.spokenText as string | undefined) ?? correctAnswer;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    utterance.onstart = () => setSpeakingModel(true);
    utterance.onend = () => setSpeakingModel(false);
    utterance.onerror = () => setSpeakingModel(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleMicClick = () => {
    if (answered) return;
    setIsListening(true);

    // Browser Speech Recognition if supported
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          setIsListening(false);
          const transcript = event.results[0]?.[0]?.transcript?.trim().toLowerCase() ?? "";
          if (transcript.includes(correctAnswer.toLowerCase()) || options.some(o => transcript.includes(o.toLowerCase()))) {
            onSelect(correctAnswer);
          } else {
            onSelect(options[0] ?? correctAnswer);
          }
        };
        recognition.onerror = () => {
          setIsListening(false);
          onSelect(correctAnswer);
        };
        recognition.start();
        return;
      } catch {
        // fallback below
      }
    }

    // Fallback simulation: slight delay then auto-select
    window.setTimeout(() => {
      setIsListening(false);
      onSelect(correctAnswer);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header banner: Instruction and Timer */}
      <div className="flex items-center justify-between gap-2 px-1">
        {instruction ? (
          <p className="text-xs font-black uppercase tracking-wider text-[#AFAFAF] dark:text-[#8495A0]">
            {instruction}
          </p>
        ) : <div />}
        {timeLeft !== null && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF9600]/30 bg-[#FFF4E5] px-3 py-1 text-xs font-black text-[#FF9600]">
            <Timer className="h-3.5 w-3.5 animate-pulse" />
            <span>{timeLeft}s</span>
          </div>
        )}
      </div>

      {/* Visual Anchor / Prompt Area */}
      <div className="flex flex-col items-center justify-center py-4 text-center">
        {icon && (
          <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-black/10 bg-[#F7F7F7] text-5xl shadow-sm dark:border-white/10 dark:bg-[#202F36]">
            {icon}
          </div>
        )}

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

        {/* Vocal rehearsal controls when enabled */}
        {isSpeaking && (
          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePlayModel}
              className={cn(
                "flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#1899D6] bg-[#1CB0F6] px-4 py-2.5 font-extrabold text-white transition-transform active:translate-y-[2px]",
                speakingModel && "animate-pulse"
              )}
            >
              <Volume2 className="h-5 w-5" />
              <span>Hear Model</span>
            </button>
            <button
              type="button"
              disabled={answered}
              onClick={handleMicClick}
              className={cn(
                "flex items-center gap-2 rounded-2xl border-2 border-b-4 px-5 py-2.5 font-extrabold text-white transition-all active:translate-y-[2px]",
                isListening
                  ? "animate-pulse border-[#EA2B2B] bg-[#FF4B4B]"
                  : "border-[#58A700] bg-[#58CC02] hover:bg-[#61E002]"
              )}
            >
              <Mic className="h-5 w-5" />
              <span>{isListening ? "Listening..." : "Tap to Speak"}</span>
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
