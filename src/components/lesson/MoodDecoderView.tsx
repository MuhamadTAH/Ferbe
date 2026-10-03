"use client";

import { useState, useEffect } from "react";
import { Volume2, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface MoodRound {
  audio: string;   // full sentence e.g. "I'm great, thank you!"
  correct: string; // e.g. "great"
}

interface MoodCard {
  word: string;
  emoji: string;
}

interface MoodDecoderViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

export function MoodDecoderView({ exercise, onSelect, selected }: MoodDecoderViewProps) {
  const solution = exercise.solutionData ?? {};
  const rounds: MoodRound[] = (solution.rounds as MoodRound[] | undefined) ?? [
    { audio: "I'm great, thank you!", correct: "great" },
    { audio: "I'm cool, thank you.", correct: "cool" },
  ];
  const cards: MoodCard[] = (solution.cards as MoodCard[] | undefined) ?? [
    { word: "fine", emoji: "🙂" },
    { word: "good", emoji: "👍" },
    { word: "great", emoji: "😁" },
    { word: "cool", emoji: "😎" },
  ];

  const [currentRound, setCurrentRound] = useState(0);
  const [roundResult, setRoundResult] = useState<"correct" | "wrong" | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const instruction = (solution.instruction as string) || "ڕاهێنانی بیستن (Mood Decoder)";

  useEffect(() => {
    const t = setTimeout(() => playRound(0), 500);
    return () => clearTimeout(t);
  }, []);

  const playRound = (index: number) => {
    const round = rounds[index];
    if (!round) return;
    setRoundResult(null);
    setIsPlaying(true);
    playAmericanSpeech(round.audio, 0.88);
    setTimeout(() => setIsPlaying(false), 1400);
  };

  const handleTap = (word: string) => {
    if (roundResult !== null || isPlaying) return;
    const correct = word === rounds[currentRound]?.correct;
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
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8FAD4] dark:bg-[#1E3B20] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#58CC02]">
          <Volume2 className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          گوێ بگرە — چۆن هەستی ئەوە دەربڕی؟
        </h2>
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          {currentRound + 1} لە {rounds.length} — وشەی بیستراو هەڵبژێرە
        </p>
      </div>

      {/* Audio playback indicator */}
      <button
        type="button"
        onClick={() => playRound(currentRound)}
        className={cn(
          "mx-auto flex w-full max-w-sm items-center justify-center gap-3 rounded-3xl border-2 border-b-4 py-6 transition-all",
          isPlaying
            ? "border-[#1CB0F6] bg-[#DDF4FF] dark:border-[#1CB0F6] dark:bg-[#1C3B4E]"
            : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#131F24]"
        )}
      >
        <Volume2 className={cn("h-7 w-7", isPlaying ? "text-[#1CB0F6] animate-pulse" : "text-[#AFAFAF]")} />
        <span className={cn("text-base font-black", isPlaying ? "text-[#1CB0F6]" : "text-[#AFAFAF] dark:text-[#8495A0]")}>
          {isPlaying ? "گوێ بگرە..." : "دووبارە گوێ بگرەوە"}
        </span>
      </button>

      {/* Mood cards (2x2 grid) */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => {
          const isCorrectAnswer = rounds[currentRound]?.correct === card.word;
          return (
            <button
              key={card.word}
              type="button"
              onClick={() => handleTap(card.word)}
              disabled={roundResult !== null || isPlaying}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border-2 border-b-4 py-5 px-4 transition-all select-none cursor-pointer",
                roundResult !== null && isCorrectAnswer
                  ? "border-[#58CC02] bg-[#E8FAD4] dark:border-[#58CC02] dark:bg-[#132817]"
                  : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] hover:bg-[#F4FBFF] dark:border-[#37464F] dark:bg-[#131F24]",
                (roundResult !== null || isPlaying) && !isCorrectAnswer && "opacity-60"
              )}
            >
              <span className="text-4xl">{card.emoji}</span>
              <span dir="ltr" className="text-base font-black text-[#4B4B4B] dark:text-white">
                {card.word}
              </span>
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
