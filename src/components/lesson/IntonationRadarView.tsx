"use client";

import { useState, useEffect } from "react";
import { HelpCircle, MessageSquare, Volume2, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface Prompt {
  text: string;
  type: "question" | "statement";
}

interface IntonationRadarViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

export function IntonationRadarView({ exercise, onSelect, selected }: IntonationRadarViewProps) {
  const solution = exercise.solutionData ?? {};
  const prompts: Prompt[] = (solution.prompts as Prompt[] | undefined) ?? [
    { text: "How are you?", type: "question" },
    { text: "I'm good, thank you", type: "statement" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState<("correct" | "wrong" | null)[]>(
    prompts.map(() => null)
  );
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const instruction = (solution.instruction as string) || "ڕاهێنانی بیستن (Intonation Radar)";
  const allDone = answered.every((a) => a !== null);

  useEffect(() => {
    // Auto-play first clip on mount
    const t = setTimeout(() => playClip(0), 500);
    return () => clearTimeout(t);
  }, []);

  const playClip = (index: number) => {
    const clip = prompts[index];
    if (!clip) return;
    setIsPlaying(true);
    playAmericanSpeech(clip.text, 0.88);
    setTimeout(() => {
      setIsPlaying(false);
      setTimeLeft(4);
    }, 1200);
  };

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      setTimeLeft(null);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => (v !== null ? v - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const handleTap = (tappedType: "question" | "statement") => {
    if (answered[currentIndex] !== null) return;

    const correct = tappedType === prompts[currentIndex].type;
    const next = [...answered];
    next[currentIndex] = correct ? "correct" : "wrong";
    setAnswered(next);
    setTimeLeft(null);

    if (next.every((a) => a !== null)) {
      onSelect("completed");
    } else {
      // Move to next prompt after short delay
      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        playClip(nextIndex);
      }, 800);
    }
  };

  const currentCorrect = answered[currentIndex];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#DDF4FF] dark:bg-[#1C3B4E] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1CB0F6]">
          <Volume2 className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          گوێ بگرە — پرسیاره یان داخوێندراوه؟
        </h2>
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          {currentIndex + 1} لە {prompts.length} — کلیک لەسەر ئایکۆنی گونجاو بکە
        </p>
      </div>

      {/* Audio playing indicator */}
      <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-3xl border-2 border-[#1CB0F6]/40 bg-[#DDF4FF] dark:bg-[#1C3B4E] p-6">
        {isPlaying ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1 items-end h-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-2 bg-[#1CB0F6] rounded-sm animate-pulse"
                  style={{
                    height: `${16 + i * 4}px`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
            <span className="text-sm font-black text-[#1CB0F6]">گوێ بگرە...</span>
          </div>
        ) : timeLeft !== null ? (
          <div className="flex flex-col items-center gap-1">
            <Clock className="h-6 w-6 text-[#FF9600]" />
            <span className="text-3xl font-black text-[#FF9600]">{timeLeft}</span>
            <span dir="rtl" className="font-kurdish text-xs font-bold text-[#AFAFAF]">
              چنتایی تۆ؟
            </span>
          </div>
        ) : currentCorrect ? (
          <div className="flex flex-col items-center gap-1">
            <CheckCircle2 className="h-8 w-8 text-[#58CC02]" />
            <span className="text-sm font-black text-[#58CC02]">
              {currentCorrect === "correct" ? "دروست!" : "هەڵە!"}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Volume2 className="h-8 w-8 text-[#1CB0F6]" />
            <span dir="rtl" className="font-kurdish text-sm font-bold text-[#1CB0F6]">
              دەنگ دەخوێنرێتەوە...
            </span>
          </div>
        )}
      </div>

      {/* Two tap targets */}
      <div className="grid grid-cols-2 gap-4">
        {/* Question */}
        <button
          type="button"
          onClick={() => handleTap("question")}
          disabled={answered[currentIndex] !== null || timeLeft === null}
          className={cn(
            "flex flex-col items-center gap-3 rounded-3xl border-2 border-b-4 p-6 transition-all select-none cursor-pointer",
            answered[currentIndex] !== null
              ? prompts[currentIndex]?.type === "question"
                ? "border-[#58CC02] bg-[#E8FAD4] dark:border-[#58CC02] dark:bg-[#132817]"
                : "border-[#E5E5E5] bg-white dark:border-[#37464F] dark:bg-[#131F24]"
              : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] hover:bg-[#DDF4FF] dark:border-[#37464F] dark:bg-[#131F24]"
          )}
        >
          <HelpCircle className="h-12 w-12 text-[#FF9600]" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-base font-black text-[#4B4B4B] dark:text-white">Question</span>
            <span className="text-xs font-bold text-[#1CB0F6]">Rising Pitch ↗</span>
          </div>
        </button>

        {/* Statement */}
        <button
          type="button"
          onClick={() => handleTap("statement")}
          disabled={answered[currentIndex] !== null || timeLeft === null}
          className={cn(
            "flex flex-col items-center gap-3 rounded-3xl border-2 border-b-4 p-6 transition-all select-none cursor-pointer",
            answered[currentIndex] !== null
              ? prompts[currentIndex]?.type === "statement"
                ? "border-[#58CC02] bg-[#E8FAD4] dark:border-[#58CC02] dark:bg-[#132817]"
                : "border-[#E5E5E5] bg-white dark:border-[#37464F] dark:bg-[#131F24]"
              : "border-[#E5E5E5] bg-white hover:border-[#9333EA] hover:bg-[#FAF5FF] dark:border-[#37464F] dark:bg-[#131F24]"
          )}
        >
          <MessageSquare className="h-12 w-12 text-[#9333EA]" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-base font-black text-[#4B4B4B] dark:text-white">Statement</span>
            <span className="text-xs font-bold text-[#9333EA]">Falling Pitch ↘</span>
          </div>
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2">
        {prompts.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-all",
              answered[i] === "correct"
                ? "bg-[#58CC02]"
                : answered[i] === "wrong"
                  ? "bg-[#EA2B2B]"
                  : i === currentIndex
                    ? "bg-[#1CB0F6] w-6"
                    : "bg-[#E5E5E5] dark:bg-[#37464F]"
            )}
          />
        ))}
      </div>
    </div>
  );
}
