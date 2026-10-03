"use client";

import { useState, useEffect } from "react";
import { Volume2, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface GreetingRound {
  audio: string; // e.g. "Hey Ahmad!"
  correct: string; // e.g. "Hey"
}

interface GreetingCatcherViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

export function GreetingCatcherView({ exercise, onSelect, selected }: GreetingCatcherViewProps) {
  const solution = exercise.solutionData ?? {};
  const rounds: GreetingRound[] = (solution.rounds as GreetingRound[] | undefined) ?? [
    { audio: "Hey Ahmad!", correct: "Hey" },
    { audio: "Hi Sara!", correct: "Hi" },
  ];
  const buttons: string[] = (solution.buttons as string[] | undefined) ?? ["Hey", "Hi", "Hello"];

  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [roundResult, setRoundResult] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [done, setDone] = useState(false);

  const instruction = (solution.instruction as string) || "ڕاهێنانی بیستن (Greeting Catcher)";

  useEffect(() => {
    const t = setTimeout(() => playRound(0), 500);
    return () => clearTimeout(t);
  }, []);

  const playRound = (index: number) => {
    const round = rounds[index];
    if (!round) return;
    setRoundResult(null);
    setIsPlaying(true);
    playAmericanSpeech(round.audio, 0.9);
    setTimeout(() => {
      setIsPlaying(false);
      setTimeLeft(3);
    }, 1000);
  };

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      setTimeLeft(null);
      handleTimeout();
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => (v !== null ? v - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const handleTimeout = () => {
    setRoundResult("timeout");
    advance();
  };

  const handleTap = (word: string) => {
    if (roundResult !== null || timeLeft === null) return;
    setTimeLeft(null);
    const correct = word === rounds[currentRound]?.correct;
    setRoundResult(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
    advance();
  };

  const advance = () => {
    const nextIndex = currentRound + 1;
    if (nextIndex >= rounds.length) {
      setTimeout(() => {
        setDone(true);
        onSelect("completed");
      }, 900);
    } else {
      setTimeout(() => {
        setCurrentRound(nextIndex);
        playRound(nextIndex);
      }, 900);
    }
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
          گوێ بگرە — کام سڵاوکردنت بیست؟
        </h2>
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          خێرا کلیک بکە پێش کۆتایی کاتەکە
        </p>
      </div>

      {/* Audio indicator + timer */}
      <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-3xl border-2 border-[#1CB0F6]/40 bg-[#DDF4FF] dark:bg-[#1C3B4E] py-8">
        {isPlaying ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1 items-end h-10">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-2.5 bg-[#1CB0F6] rounded-sm animate-pulse"
                  style={{ height: `${12 + i * 5}px`, animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
            <span className="text-sm font-black text-[#1CB0F6]">گوێ بگرە...</span>
          </div>
        ) : timeLeft !== null ? (
          <div className="flex flex-col items-center gap-1">
            <div className={cn(
              "text-5xl font-black",
              timeLeft <= 1 ? "text-[#EA2B2B]" : "text-[#FF9600]"
            )}>
              {timeLeft}
            </div>
            <span dir="rtl" className="font-kurdish text-sm font-bold text-[#AFAFAF]">
              چنتایی تۆ؟
            </span>
          </div>
        ) : roundResult ? (
          <div className="flex flex-col items-center gap-1">
            {roundResult === "correct" ? (
              <CheckCircle2 className="h-10 w-10 text-[#58CC02]" />
            ) : (
              <X className="h-10 w-10 text-[#EA2B2B]" />
            )}
            <span className={cn(
              "text-sm font-black",
              roundResult === "correct" ? "text-[#58CC02]" : "text-[#EA2B2B]"
            )}>
              {roundResult === "correct" ? "دروست!" : roundResult === "timeout" ? "کات تەواو بوو!" : "هەڵە!"}
            </span>
          </div>
        ) : done ? (
          <div className="flex flex-col items-center gap-1">
            <CheckCircle2 className="h-10 w-10 text-[#58CC02]" />
            <span className="text-sm font-black text-[#58CC02]">تەواو بوو!</span>
          </div>
        ) : null}
      </div>

      {/* 3 Greeting Buttons — no translations */}
      <div className="flex gap-3">
        {buttons.map((word) => (
          <button
            key={word}
            type="button"
            onClick={() => handleTap(word)}
            disabled={roundResult !== null || timeLeft === null}
            className={cn(
              "flex-1 rounded-2xl border-2 border-b-4 py-5 text-xl font-black transition-all select-none cursor-pointer",
              "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#1CB0F6] hover:bg-[#DDF4FF] dark:border-[#37464F] dark:bg-[#131F24] dark:text-white",
              (roundResult !== null || timeLeft === null) && "opacity-50 cursor-not-allowed"
            )}
          >
            <span dir="ltr">{word}</span>
          </button>
        ))}
      </div>

      {/* Score */}
      <div className="flex justify-center gap-2">
        {rounds.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2.5 rounded-full transition-all",
              i < currentRound
                ? "w-2.5 bg-[#58CC02]"
                : i === currentRound
                  ? "w-6 bg-[#1CB0F6]"
                  : "w-2.5 bg-[#E5E5E5] dark:bg-[#37464F]"
            )}
          />
        ))}
      </div>
    </div>
  );
}
