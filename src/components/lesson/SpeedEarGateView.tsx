"use client";

import { useState, useEffect } from "react";
import { Volume2, CheckCircle2, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface GateRound {
  audio: string;      // what plays
  display: string;    // what shows on screen (text or emoji description)
  correct: boolean;   // is it a match?
}

interface SpeedEarGateViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

/**
 * Rapid-fire True/False evaluation. 3 reps, 3 seconds each.
 * Score ≥2/3 to pass. Used for 1.2/S8 and 1.5/S8.
 */
export function SpeedEarGateView({ exercise, onSelect, selected }: SpeedEarGateViewProps) {
  const solution = exercise.solutionData ?? {};
  const rounds: GateRound[] = (solution.rounds as GateRound[] | undefined) ?? [
    { audio: "I'm cool, thank you.", display: "😎", correct: true },
    { audio: "Hi Ahmad.", display: "👧 Sara", correct: false },
    { audio: "What about you?", display: "How are you?", correct: false },
  ];
  const timerSeconds = (solution.timerSeconds as number) || 3;
  const passMark = (solution.passMark as number) || 2;
  const instruction = (solution.instruction as string) || "تاقیکردنەوەی گوێ (Speed Ear Gate)";

  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [roundResults, setRoundResults] = useState<("correct" | "wrong" | "timeout")[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [finalResult, setFinalResult] = useState<"pass" | "fail" | null>(null);

  useEffect(() => {
    const t = setTimeout(() => playRound(0), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      setTimeLeft(null);
      handleAnswer(null); // timeout
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => (v !== null ? v - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const playRound = (index: number) => {
    const round = rounds[index];
    if (!round) return;
    setIsPlaying(true);
    playAmericanSpeech(round.audio, 0.9);
    setTimeout(() => {
      setIsPlaying(false);
      setTimeLeft(timerSeconds);
    }, 1200);
  };

  const handleAnswer = (answer: boolean | null) => {
    setTimeLeft(null);
    const round = rounds[currentRound];
    const correct = answer !== null && answer === round?.correct;
    const result = answer === null ? "timeout" : correct ? "correct" : "wrong";

    const next = [...roundResults, result as "correct" | "wrong" | "timeout"];
    setRoundResults(next);

    if (next.length >= rounds.length) {
      const score = next.filter((r) => r === "correct").length;
      const pass = score >= passMark;
      setFinalResult(pass ? "pass" : "fail");
      setDone(true);
      onSelect(pass ? "completed" : "failed");
    } else {
      setTimeout(() => {
        setCurrentRound((c) => {
          const ni = c + 1;
          playRound(ni);
          return ni;
        });
      }, 800);
    }
  };

  const progress = (timerSeconds - (timeLeft ?? 0)) / timerSeconds;
  const circumference = 2 * Math.PI * 40;

  if (done) {
    const score = roundResults.filter((r) => r === "correct").length;
    return (
      <div className="flex flex-col items-center gap-6">
        <div className={cn(
          "flex h-32 w-32 items-center justify-center rounded-full border-4",
          finalResult === "pass" ? "border-[#58CC02] bg-[#E8FAD4]" : "border-[#EA2B2B] bg-[#FFDFE0]"
        )}>
          {finalResult === "pass"
            ? <CheckCircle2 className="h-14 w-14 text-[#58CC02]" />
            : <X className="h-14 w-14 text-[#EA2B2B]" />
          }
        </div>
        <div className="text-center">
          <p className="text-3xl font-black text-[#4B4B4B] dark:text-white">{score}/{rounds.length}</p>
          <p dir="rtl" className={cn(
            "font-kurdish text-base font-bold mt-1",
            finalResult === "pass" ? "text-[#58CC02]" : "text-[#EA2B2B]"
          )}>
            {finalResult === "pass" ? "دەرچوون! بەردەوامبوونی درووستە." : "هەوڵبدەرەوە! کەمتر لە ٢ لە ٣ بوو."}
          </p>
        </div>
      </div>
    );
  }

  const currentRoundData = rounds[currentRound];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#DDF4FF] dark:bg-[#1C3B4E] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1CB0F6]">
          <Volume2 className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          دەنگ لەگەڵ ئەنجامەکە دەگونجێت؟
        </h2>
      </div>

      {/* Display + Timer */}
      <div className="flex flex-col items-center gap-4">
        {/* Circular countdown ring */}
        <div className="relative flex items-center justify-center">
          <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E5E5" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke={timeLeft !== null && timeLeft <= 1 ? "#EA2B2B" : "#1CB0F6"}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (timeLeft !== null ? timeLeft / timerSeconds : 1)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            {timeLeft !== null ? (
              <span className={cn(
                "text-2xl font-black",
                timeLeft <= 1 ? "text-[#EA2B2B]" : "text-[#1CB0F6]"
              )}>{timeLeft}</span>
            ) : (
              <Clock className="h-8 w-8 text-[#AFAFAF]" />
            )}
          </div>
        </div>

        {/* Screen display card */}
        <div className="w-full max-w-sm rounded-3xl border-2 border-[#E5E5E5] bg-white dark:border-[#37464F] dark:bg-[#131F24] p-8 flex items-center justify-center min-h-32">
          <span className={cn(
            "text-center font-black",
            currentRoundData?.display?.length > 5 ? "text-xl" : "text-5xl"
          )}>
            {isPlaying ? (
              <span className="text-sm text-[#AFAFAF]">گوێ بگرە...</span>
            ) : (
              currentRoundData?.display
            )}
          </span>
        </div>
      </div>

      {/* True / False buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleAnswer(true)}
          disabled={timeLeft === null || isPlaying}
          className={cn(
            "rounded-2xl border-2 border-b-4 py-5 text-xl font-black transition-all select-none",
            "border-[#58CC02] bg-[#E8FAD4] text-[#58A700] hover:bg-[#D7FFB8] dark:border-[#58CC02] dark:bg-[#132817] dark:text-[#58CC02]",
            (timeLeft === null || isPlaying) && "opacity-40 cursor-not-allowed"
          )}
        >
          ✅ True
        </button>
        <button
          type="button"
          onClick={() => handleAnswer(false)}
          disabled={timeLeft === null || isPlaying}
          className={cn(
            "rounded-2xl border-2 border-b-4 py-5 text-xl font-black transition-all select-none",
            "border-[#EA2B2B] bg-[#FFDFE0] text-[#EA2B2B] hover:bg-[#FFBBBB] dark:border-[#EA2B2B] dark:bg-[#3A181D] dark:text-[#FF6666]",
            (timeLeft === null || isPlaying) && "opacity-40 cursor-not-allowed"
          )}
        >
          ❌ False
        </button>
      </div>

      {/* Rep progress */}
      <div className="flex justify-center gap-2">
        {rounds.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2.5 rounded-full transition-all",
              roundResults[i] === "correct"
                ? "w-2.5 bg-[#58CC02]"
                : roundResults[i] === "wrong" || roundResults[i] === "timeout"
                  ? "w-2.5 bg-[#EA2B2B]"
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
