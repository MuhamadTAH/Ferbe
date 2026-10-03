"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Volume2, CheckCircle2, RotateCcw, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";
import { evaluateSpokenAnswer } from "@/lib/speechEvaluation";

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

interface TimedMicViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
  lastCorrect?: boolean | null;
}

/**
 * Timed mic screen with descending countdown timer.
 * Used for Lesson 1.3 (Rapid Speaking) screens 3–8 and Lesson 1.6.
 * Shows: visual cue (emoji/icon), optional scaffold text, countdown ring mic button.
 */
export function TimedMicView({ exercise, onSelect, selected, lastCorrect }: TimedMicViewProps) {
  const solution = exercise.solutionData ?? {};
  const targetText = ((solution.spokenText as string) || (solution.correct as string) || "").trim();
  const promptAudio = (solution.promptAudio as string) || "";
  const visualCue = (solution.visualCue as string) || "🎤";
  const scaffoldText = (solution.scaffoldText as string) || "";
  const timerSeconds = Number(solution.timerSeconds || 4);
  const instruction = (solution.instruction as string) || "ڕاهێنانی وتار (Timed Speaking)";
  const promptLabel = (solution.promptLabel as string) || "هاواری سەرووەکە گوێ بگرە";

  const [phase, setPhase] = useState<"prompt" | "ready" | "recording" | "done">("prompt");
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [transcript, setTranscript] = useState("");
  const [passed, setPassed] = useState<boolean | null>(null);
  const [isPlayingPrompt, setIsPlayingPrompt] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const answered = lastCorrect !== null && lastCorrect !== undefined;

  useEffect(() => {
    // Auto-play the avatar prompt audio on mount
    if (promptAudio) {
      setTimeout(() => {
        setIsPlayingPrompt(true);
        playAmericanSpeech(promptAudio, 0.9);
        setTimeout(() => {
          setIsPlayingPrompt(false);
          setPhase("ready");
        }, 1500);
      }, 400);
    } else {
      setPhase("ready");
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch {} }
    };
  }, []);

  const startRecording = () => {
    if (phase !== "ready" || answered) return;
    setPhase("recording");
    setTimeLeft(timerSeconds);
    setTranscript("");

    const W = window as IWindow;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) {
      // Fallback: just pass after timer
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            finishWithTranscript("");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return;
    }

    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const spoken = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join(" ")
        .trim();
      setTranscript(spoken);
    };

    recognition.onend = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("done");
      finishWithTranscript(transcript);
    };

    recognition.start();

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          try { recognition.stop(); } catch {}
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const finishWithTranscript = (spoken: string) => {
    const result = evaluateSpokenAnswer(spoken, targetText);
    const pass = result.isMatch;
    setPassed(pass);
    setPhase("done");
    onSelect(pass ? targetText : spoken || "no_speech");
  };

  const handleReset = () => {
    if (answered) return;
    setPhase("ready");
    setTimeLeft(timerSeconds);
    setTranscript("");
    setPassed(null);
    onSelect("");
  };

  const timerProgress = (timerSeconds - timeLeft) / timerSeconds;
  const circumference = 2 * Math.PI * 44;

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FAF5FF] dark:bg-[#2D1B4E] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#9333EA]">
          <Mic className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
      </div>

      {/* Visual Cue */}
      <div className="flex flex-col items-center gap-2">
        {phase === "prompt" && isPlayingPrompt ? (
          <div className="flex flex-col items-center gap-2">
            <Volume2 className="h-16 w-16 text-[#1CB0F6] animate-pulse" />
            <span dir="rtl" className="font-kurdish text-sm font-bold text-[#1CB0F6]">{promptLabel}</span>
          </div>
        ) : (
          <>
            <span className="text-7xl leading-none">{visualCue}</span>
            {scaffoldText && (
              <div className="rounded-2xl border-2 border-[#9333EA]/30 bg-[#FAF5FF] dark:bg-[#2D1B4E] px-6 py-3 mt-2">
                <span dir="ltr" className="text-lg font-black text-[#9333EA]">{scaffoldText}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mic button with circular timer */}
      {phase !== "prompt" && (
        <div className="relative flex items-center justify-center">
          <svg className="absolute h-28 w-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#E5E5E5" strokeWidth="6" />
            {phase === "recording" && (
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke={timeLeft <= 1 ? "#EA2B2B" : "#9333EA"}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (timeLeft / timerSeconds)}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            )}
            {phase === "done" && (
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke={passed ? "#58CC02" : "#EA2B2B"}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={0}
              />
            )}
          </svg>

          <button
            type="button"
            onClick={startRecording}
            disabled={phase !== "ready" || answered}
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full border-4 transition-all",
              phase === "recording"
                ? "border-[#9333EA] bg-[#9333EA] text-white animate-pulse"
                : phase === "done"
                  ? passed
                    ? "border-[#58CC02] bg-[#58CC02] text-white"
                    : "border-[#EA2B2B] bg-[#FFDFE0] text-[#EA2B2B]"
                  : "border-[#9333EA] bg-white text-[#9333EA] hover:bg-[#FAF5FF] dark:bg-[#131F24]"
            )}
          >
            {phase === "recording" ? (
              <Mic className="h-9 w-9 stroke-[2.5]" />
            ) : phase === "done" ? (
              passed
                ? <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
                : <Mic className="h-9 w-9" />
            ) : (
              <Mic className="h-9 w-9 stroke-[2.5]" />
            )}
          </button>

          {phase === "recording" && (
            <div className="absolute -bottom-8">
              <span className={cn(
                "text-2xl font-black",
                timeLeft <= 1 ? "text-[#EA2B2B]" : "text-[#9333EA]"
              )}>{timeLeft}s</span>
            </div>
          )}
        </div>
      )}

      {/* Transcript */}
      {transcript && (
        <div className="w-full max-w-sm rounded-2xl border-2 border-[#E5E5E5] bg-white p-3 dark:border-[#37464F] dark:bg-[#131F24]">
          <span dir="ltr" className="text-sm font-bold text-[#4B4B4B] dark:text-white">"{transcript}"</span>
        </div>
      )}

      {/* Result */}
      {phase === "done" && passed !== null && (
        <div className={cn(
          "w-full max-w-sm rounded-2xl border p-3 animate-in fade-in",
          passed
            ? "border-[#58CC02]/40 bg-[#E8FAD4] dark:bg-[#1E3B20]"
            : "border-[#EA2B2B]/40 bg-[#FFDFE0] dark:bg-[#3A181D]"
        )}>
          <p dir="rtl" className={cn(
            "font-kurdish text-xs font-extrabold",
            passed ? "text-[#58CC02]" : "text-[#EA2B2B]"
          )}>
            {passed ? "باشە! دەنگت گوێ درا." : "هەوڵبدەرەوە — ئایا دەتوانیت بیتر بکەیتەوە؟"}
          </p>
        </div>
      )}

      {/* Reset */}
      {phase === "done" && !passed && !answered && (
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#1CB0F6] bg-[#DDF4FF] px-5 py-3 text-sm font-black text-[#1CB0F6] hover:bg-[#B8E8FF]"
        >
          <RotateCcw className="h-4 w-4" />
          دووبارە هەوڵبدەرەوە
        </button>
      )}
    </div>
  );
}
