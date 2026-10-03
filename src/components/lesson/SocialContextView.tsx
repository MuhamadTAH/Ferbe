"use client";

import { useState, useEffect } from "react";
import { Volume2, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface ScenarioRound {
  audio: string;       // what plays
  correct: "1" | "2"; // which scenario card is correct
}

interface SocialContextViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

export function SocialContextView({ exercise, onSelect, selected }: SocialContextViewProps) {
  const solution = exercise.solutionData ?? {};
  const rounds: ScenarioRound[] = (solution.rounds as ScenarioRound[] | undefined) ?? [
    { audio: "Hey! How are you?", correct: "2" },
    { audio: "Hello, teacher.", correct: "1" },
  ];
  const scenario1Label = (solution.scenario1 as string) || "Student & Teacher";
  const scenario1Emoji = (solution.scenario1Emoji as string) || "👨‍🏫";
  const scenario2Label = (solution.scenario2 as string) || "Friends on the street";
  const scenario2Emoji = (solution.scenario2Emoji as string) || "👫";
  const instruction = (solution.instruction as string) || "ڕاهێنانی بیستن (Social Context)";

  const [currentRound, setCurrentRound] = useState(0);
  const [roundResult, setRoundResult] = useState<"correct" | "wrong" | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [done, setDone] = useState(false);

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
    setTimeout(() => setIsPlaying(false), 1400);
  };

  const handleTap = (choice: "1" | "2") => {
    if (roundResult !== null || isPlaying) return;
    const correct = choice === rounds[currentRound]?.correct;
    setRoundResult(correct ? "correct" : "wrong");

    setTimeout(() => {
      const nextIndex = currentRound + 1;
      if (nextIndex >= rounds.length) {
        setDone(true);
        onSelect("completed");
      } else {
        setCurrentRound(nextIndex);
        playRound(nextIndex);
      }
    }, 900);
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
          گوێ بگرە — ئایا ئەم دەنگە لەکوێدایە؟
        </h2>
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          {currentRound + 1} لە {rounds.length}
        </p>
      </div>

      {/* Replay button */}
      <button
        type="button"
        onClick={() => playRound(currentRound)}
        className={cn(
          "mx-auto flex w-full max-w-sm items-center justify-center gap-3 rounded-3xl border-2 border-b-4 py-6 transition-all",
          isPlaying
            ? "border-[#1CB0F6] bg-[#DDF4FF] dark:bg-[#1C3B4E]"
            : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#131F24]"
        )}
      >
        <Volume2 className={cn("h-7 w-7", isPlaying ? "text-[#1CB0F6] animate-pulse" : "text-[#AFAFAF]")} />
        <span className={cn("font-black text-base", isPlaying ? "text-[#1CB0F6]" : "text-[#AFAFAF] dark:text-[#8495A0]")}>
          {isPlaying ? "گوێ بگرە..." : "▶ دووبارە گوێ بگرەوە"}
        </span>
      </button>

      {/* Two scenario cards */}
      <div className="grid grid-cols-2 gap-4">
        {(["1", "2"] as const).map((id) => {
          const isCorrect = rounds[currentRound]?.correct === id;
          const label = id === "1" ? scenario1Label : scenario2Label;
          const emoji = id === "1" ? scenario1Emoji : scenario2Emoji;

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleTap(id)}
              disabled={roundResult !== null || isPlaying}
              className={cn(
                "flex flex-col items-center gap-3 rounded-3xl border-2 border-b-4 py-8 px-4 transition-all select-none cursor-pointer",
                roundResult !== null && isCorrect
                  ? "border-[#58CC02] bg-[#E8FAD4] dark:border-[#58CC02] dark:bg-[#132817]"
                  : roundResult !== null && !isCorrect
                    ? "border-[#E5E5E5] bg-white opacity-50 dark:border-[#37464F] dark:bg-[#131F24]"
                    : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] hover:bg-[#F4FBFF] dark:border-[#37464F] dark:bg-[#131F24]",
                (roundResult !== null || isPlaying) && "cursor-not-allowed"
              )}
            >
              <span className="text-5xl">{emoji}</span>
              <span className="text-center text-sm font-black text-[#4B4B4B] dark:text-white leading-snug">
                {label}
              </span>
              {roundResult !== null && isCorrect && (
                <CheckCircle2 className="h-6 w-6 text-[#58CC02]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Progress */}
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
