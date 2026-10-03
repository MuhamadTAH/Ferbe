"use client";

import { useState, useEffect } from "react";
import { Volume2, CheckCircle2, X, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface TileAssemblyViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

/**
 * Timed tile tapping assembly. User taps tiles in correct sentence order before timer expires.
 * Lesson 1.4/S8: "I → don't like → that car."
 */
export function TileAssemblyView({ exercise, onSelect, selected }: TileAssemblyViewProps) {
  const solution = exercise.solutionData ?? {};
  const tiles: string[] = (solution.tiles as string[] | undefined) ?? ["that car.", "I", "don't like", "this"];
  const correctOrder: string[] = (solution.correctOrder as string[] | undefined) ?? ["I", "don't like", "that car."];
  const timerSeconds = Number(solution.timerSeconds || 5);
  const visualCue = (solution.visualCue as string) || "🚗❌";
  const instruction = (solution.instruction as string) || "ڕستەکە ڕێکبخە (Tile Assembly)";

  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [built, setBuilt] = useState<string[]>([]);
  const [usedTiles, setUsedTiles] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<"correct" | "wrong" | "timeout" | null>(null);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (!timerActive || result !== null) return;
    if (timeLeft <= 0) {
      setResult("timeout");
      onSelect("timeout");
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerActive, result]);

  const handleTileTap = (tile: string) => {
    if (result !== null || usedTiles.has(tile)) return;

    const next = [...built, tile];
    const nextUsed = new Set(usedTiles);
    nextUsed.add(tile);
    setBuilt(next);
    setUsedTiles(nextUsed);

    if (next.length >= correctOrder.length) {
      setTimerActive(false);
      const correct = next.every((t, i) => t === correctOrder[i]);
      setResult(correct ? "correct" : "wrong");
      onSelect(correct ? "completed" : "wrong");
    }
  };

  const handleReset = () => {
    setBuilt([]);
    setUsedTiles(new Set());
    setResult(null);
    setTimeLeft(timerSeconds);
    setTimerActive(true);
    onSelect("");
  };

  const timerPercent = timeLeft / timerSeconds;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
          <Timer className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          ڕستەکە ڕێکبخە پێش کۆتایی کاتەکە
        </h2>
      </div>

      {/* Visual cue + timer */}
      <div className="flex items-center justify-between rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 dark:border-[#37464F] dark:bg-[#131F24]">
        <span className="text-4xl">{visualCue}</span>
        <div className="flex flex-col items-center gap-1">
          <div className={cn(
            "text-3xl font-black",
            timeLeft <= 2 ? "text-[#EA2B2B] animate-pulse" : "text-[#FF9600]"
          )}>
            {timeLeft}s
          </div>
          <div className="h-1.5 w-24 rounded-full bg-[#E5E5E5] overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                timeLeft <= 2 ? "bg-[#EA2B2B]" : "bg-[#FF9600]"
              )}
              style={{ width: `${timerPercent * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Built sentence display */}
      <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-[#1CB0F6]/50 bg-[#DDF4FF] p-4 dark:border-[#3BC0F8]/50 dark:bg-[#1C3B4E]">
        {built.length === 0 ? (
          <span dir="rtl" className="font-kurdish text-sm font-bold text-[#AFAFAF]">ڕستەکە لێرە دروست بکەرەوە...</span>
        ) : (
          built.map((tile, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border-2 px-3 py-1.5 text-base font-black",
                result === "correct"
                  ? "border-[#58CC02] bg-[#E8FAD4] text-[#58A700]"
                  : result === "wrong"
                    ? tile !== correctOrder[i]
                      ? "border-[#EA2B2B] bg-[#FFDFE0] text-[#EA2B2B]"
                      : "border-[#58CC02] bg-[#E8FAD4] text-[#58A700]"
                    : "border-[#1CB0F6] bg-white text-[#1CB0F6]"
              )}
            >
              <span dir="ltr">{tile}</span>
            </div>
          ))
        )}
      </div>

      {/* Tile options */}
      <div className="flex flex-wrap gap-3">
        {tiles.map((tile) => {
          const isUsed = usedTiles.has(tile);
          return (
            <button
              key={tile}
              type="button"
              onClick={() => handleTileTap(tile)}
              disabled={isUsed || result !== null}
              className={cn(
                "rounded-2xl border-2 border-b-4 px-4 py-3 text-base font-black transition-all select-none",
                isUsed
                  ? "border-[#E5E5E5] bg-[#F7F7F7] text-[#E5E5E5] cursor-not-allowed dark:border-[#37464F] dark:bg-[#1A1F24] dark:text-[#37464F]"
                  : result !== null
                    ? "border-[#E5E5E5] bg-[#F7F7F7] text-[#AFAFAF] cursor-not-allowed"
                    : "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#FF9600] hover:bg-[#FFF4E5] cursor-pointer dark:border-[#37464F] dark:bg-[#131F24] dark:text-white"
              )}
            >
              <span dir="ltr">{tile}</span>
            </button>
          );
        })}
      </div>

      {result && result !== "correct" && (
        <button
          type="button"
          onClick={handleReset}
          className="mx-auto flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#1CB0F6] bg-[#DDF4FF] px-5 py-3 text-sm font-black text-[#1CB0F6] hover:bg-[#B8E8FF]"
        >
          دووبارە هەوڵبدەرەوە
        </button>
      )}

      {result === "correct" && (
        <div className="rounded-2xl border border-[#58CC02]/40 bg-[#E8FAD4] dark:bg-[#1E3B20] p-3 text-center animate-in fade-in">
          <p dir="rtl" className="font-kurdish text-xs font-extrabold text-[#58CC02]">
            زۆر باشە! ڕستەکەت بەدروستی دروست کرا.
          </p>
        </div>
      )}
    </div>
  );
}
