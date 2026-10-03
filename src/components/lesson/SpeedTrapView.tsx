"use client";

import { useState } from "react";
import { Volume2, Turtle, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface SpeedTrapViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

export function SpeedTrapView({ exercise, onSelect, selected }: SpeedTrapViewProps) {
  const solution = exercise.solutionData ?? {};
  const slowText = (solution.slowText as string) || "How — are — you?";
  const fastText = (solution.fastText as string) || "How are you?";
  const promptKurdish = (solution.promptKurdish as string) || "کامیان دەچێتە گفتوگۆی ڕاستەقینە؟";
  const instruction = (solution.instruction as string) || "ڕاهێنانی بیستن (Connected Speech)";
  const slowLabel = (solution.slowLabel as string) || "Slow / Articulated";
  const fastLabel = (solution.fastLabel as string) || "Natural Native Speed";
  const correctButton = (solution.correct as string) || "fast"; // "slow" | "fast"

  const [slowPlayed, setSlowPlayed] = useState(false);
  const [fastPlayed, setFastPlayed] = useState(false);
  const [answered, setAnswered] = useState<"correct" | "wrong" | null>(null);
  const [playingId, setPlayingId] = useState<"slow" | "fast" | null>(null);

  const playSlow = () => {
    setSlowPlayed(true);
    setPlayingId("slow");
    playAmericanSpeech(slowText, 0.6); // slower rate
    setTimeout(() => setPlayingId(null), 1800);
  };

  const playFast = () => {
    setFastPlayed(true);
    setPlayingId("fast");
    playAmericanSpeech(fastText, 1.0); // natural rate
    setTimeout(() => setPlayingId(null), 1200);
  };

  const handleChoose = (choice: "slow" | "fast") => {
    if (answered !== null) return;
    const correct = choice === correctButton;
    setAnswered(correct ? "correct" : "wrong");
    onSelect(correct ? "completed" : choice);
  };

  const bothPlayed = slowPlayed && fastPlayed;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#DDF4FF] dark:bg-[#1C3B4E] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1CB0F6]">
          <Volume2 className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          هەردوو دەنگی گوێ بگرەوە
        </h2>
      </div>

      {/* Two playable audio buttons */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={playSlow}
          className={cn(
            "flex items-center gap-4 rounded-2xl border-2 border-b-4 p-5 transition-all text-left",
            playingId === "slow"
              ? "border-[#FF9600] bg-[#FFF4E5] dark:border-[#FF9600] dark:bg-[#342416]"
              : slowPlayed
                ? "border-[#E5E5E5] bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#1A1F24]"
                : "border-[#E5E5E5] bg-white hover:border-[#FF9600] dark:border-[#37464F] dark:bg-[#131F24]"
          )}
        >
          <div className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-b-2",
            playingId === "slow" ? "border-[#CC7A00] bg-[#FF9600] text-white animate-pulse" : "border-[#CC7A00] bg-[#FF9600] text-white"
          )}>
            <Turtle className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-black text-[#4B4B4B] dark:text-white">🐢 {slowLabel}</span>
            <span dir="ltr" className="text-sm font-bold text-[#AFAFAF]">"{slowText}"</span>
          </div>
        </button>

        <button
          type="button"
          onClick={playFast}
          className={cn(
            "flex items-center gap-4 rounded-2xl border-2 border-b-4 p-5 transition-all text-left",
            playingId === "fast"
              ? "border-[#1CB0F6] bg-[#DDF4FF] dark:border-[#1CB0F6] dark:bg-[#1C3B4E]"
              : fastPlayed
                ? "border-[#E5E5E5] bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#1A1F24]"
                : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#131F24]"
          )}
        >
          <div className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-b-2",
            playingId === "fast" ? "border-[#1899D6] bg-[#1CB0F6] text-white animate-pulse" : "border-[#1899D6] bg-[#1CB0F6] text-white"
          )}>
            <Zap className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-black text-[#4B4B4B] dark:text-white">⚡ {fastLabel}</span>
            <span dir="ltr" className="text-sm font-bold text-[#AFAFAF]">"{fastText}"</span>
          </div>
        </button>
      </div>

      {/* Prompt question */}
      {bothPlayed && !answered && (
        <div className="flex flex-col gap-3 animate-in fade-in">
          <p dir="rtl" className="font-kurdish text-center text-base font-bold text-[#4B4B4B] dark:text-white">
            {promptKurdish}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleChoose("slow")}
              className="flex-1 rounded-2xl border-2 border-b-4 border-[#FF9600] bg-[#FFF4E5] py-4 text-sm font-black text-[#FF9600] transition-all hover:bg-[#FFE8C0]"
            >
              🐢 {slowLabel}
            </button>
            <button
              type="button"
              onClick={() => handleChoose("fast")}
              className="flex-1 rounded-2xl border-2 border-b-4 border-[#1CB0F6] bg-[#DDF4FF] py-4 text-sm font-black text-[#1CB0F6] transition-all hover:bg-[#B8E8FF]"
            >
              ⚡ {fastLabel}
            </button>
          </div>
        </div>
      )}

      {answered && (
        <div className={cn(
          "rounded-2xl border p-3 text-center animate-in fade-in",
          answered === "correct"
            ? "border-[#58CC02]/40 bg-[#E8FAD4] dark:bg-[#1E3B20]"
            : "border-[#EA2B2B]/40 bg-[#FFDFE0] dark:bg-[#3A181D]"
        )}>
          <p dir="rtl" className={cn(
            "font-kurdish text-xs font-extrabold",
            answered === "correct" ? "text-[#58CC02]" : "text-[#EA2B2B]"
          )}>
            {answered === "correct"
              ? "بەراستی! گفتوگۆی ڕاستەقینە کورتر و بەسترێنرێتر دەبێت."
              : "دووبارە هەر دووکیان گوێ بگرەوە و جیاوازیەکان بدۆزەرەوە."}
          </p>
        </div>
      )}

      {!bothPlayed && (
        <p dir="rtl" className="font-kurdish text-center text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]">
          هەردوو دەنگی گوێ بگرەوە پێش هەڵبژاردن
        </p>
      )}
    </div>
  );
}
