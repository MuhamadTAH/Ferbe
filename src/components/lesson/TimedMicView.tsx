"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Volume2, CheckCircle2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";
import { evaluateSpokenAnswer } from "@/lib/speechEvaluation";

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface IWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
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
export function TimedMicView({ exercise, onSelect, lastCorrect }: TimedMicViewProps) {
  const solution = exercise.solutionData ?? {};
  const targetText = ((solution.spokenText as string) || (solution.correct as string) || "").trim();
  const promptAudio = (solution.promptAudio as string) || "";
  const imageUrl = (solution.imageUrl as string) || "";
  const visualCue = (solution.visualCue as string) || "🎤";
  const scaffoldText = (solution.scaffoldText as string) || "";
  const timerSeconds = Number(solution.timerSeconds || 5);
  const instruction = (solution.instruction as string) || "ڕاهێنانی وتار (Timed Speaking)";

  const [phase, setPhase] = useState<"ready" | "recording" | "done">("ready");
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [transcript, setTranscript] = useState("");
  const [passed, setPassed] = useState<boolean | null>(null);
  const transcriptRef = useRef<string>("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const answered = lastCorrect !== null && lastCorrect !== undefined;

  // Auto-play model voice once on mount
  useEffect(() => {
    const audioToPlay = promptAudio || targetText;
    if (audioToPlay) {
      const t = setTimeout(() => {
        playAmericanSpeech(audioToPlay, 0.9);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [promptAudio, targetText]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const handlePlayModel = () => {
    const audioToPlay = promptAudio || targetText;
    if (audioToPlay) {
      playAmericanSpeech(audioToPlay, 0.9);
    }
  };

  const finishWithTranscript = (spoken: string) => {
    const speech = spoken.trim();
    const result = evaluateSpokenAnswer(speech, targetText);
    const pass = result.isMatch;
    setPassed(pass);
    setPhase("done");
    onSelect(pass ? targetText : speech || targetText);
  };

  const startRecording = () => {
    if (answered) return;

    // Toggle stop if already recording
    if (phase === "recording") {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("done");
      finishWithTranscript(transcriptRef.current || targetText);
      return;
    }

    setPhase("recording");
    setTimeLeft(timerSeconds);
    setTranscript("");
    transcriptRef.current = "";
    setPassed(null);

    const W = typeof window !== "undefined" ? (window as unknown as IWindow) : null;
    const SR = W?.SpeechRecognition || W?.webkitSpeechRecognition;

    if (!SR) {
      // Browser fallback (simulate recording and pass)
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            transcriptRef.current = targetText;
            setTranscript(targetText);
            finishWithTranscript(targetText);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return;
    }

    try {
      const recognition = new SR();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognitionRef.current = recognition;

      recognition.onresult = (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
        const spoken = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join(" ")
          .trim();
        transcriptRef.current = spoken;
        setTranscript(spoken);
      };

      recognition.onerror = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        // Fallback gracefully so learner is never stuck on mic failure
        finishWithTranscript(transcriptRef.current || targetText);
      };

      recognition.onend = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase("done");
        finishWithTranscript(transcriptRef.current || targetText);
      };

      recognition.start();

      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            try {
              recognition.stop();
            } catch {}
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } catch {
      // Immediate fallback if mic cannot open
      if (timerRef.current) clearInterval(timerRef.current);
      finishWithTranscript(targetText);
    }
  };

  const handleManualPass = () => {
    if (answered) return;
    transcriptRef.current = targetText;
    setTranscript(targetText);
    setPassed(true);
    setPhase("done");
    onSelect(targetText);
  };

  const handleReset = () => {
    if (answered) return;
    setPhase("ready");
    setTimeLeft(timerSeconds);
    setTranscript("");
    transcriptRef.current = "";
    setPassed(null);
    onSelect("");
  };

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

      {/* Visual Cue & Audio Guide */}
      <div className="flex flex-col items-center gap-2">
        {imageUrl ? (
          <div className="mb-2 flex items-center justify-center">
            <img
              src={imageUrl}
              alt=""
              className="h-36 w-auto max-w-[280px] object-contain rounded-2xl bg-white p-2 shadow-sm border border-black/5 dark:bg-[#1A262C]"
            />
          </div>
        ) : (
          <span className="text-7xl leading-none">{visualCue}</span>
        )}
        {scaffoldText && (
          <div className="rounded-2xl border-2 border-[#9333EA]/30 bg-[#FAF5FF] dark:bg-[#2D1B4E] px-6 py-3 mt-1">
            <span dir="ltr" className="text-lg font-black text-[#9333EA]">{scaffoldText}</span>
          </div>
        )}
        <button
          type="button"
          onClick={handlePlayModel}
          className="mt-1 inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#1899D6] bg-[#1CB0F6] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:bg-[#4FC3F9] active:translate-y-[2px]"
        >
          <Volume2 className="h-4 w-4" />
          <span>گوێگرتن لە دەنگ (Listen)</span>
        </button>
      </div>

      {/* Mic button with circular timer */}
      <div className="relative flex items-center justify-center mt-2">
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
          disabled={answered}
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full border-4 transition-all cursor-pointer shadow-md",
            phase === "recording"
              ? "border-[#9333EA] bg-[#9333EA] text-white animate-pulse scale-105"
              : phase === "done"
                ? passed
                  ? "border-[#58CC02] bg-[#58CC02] text-white"
                  : "border-[#EA2B2B] bg-[#FFDFE0] text-[#EA2B2B]"
                : "border-[#9333EA] bg-white text-[#9333EA] hover:bg-[#FAF5FF] hover:scale-105 active:scale-95 dark:bg-[#131F24]"
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

      <p dir="rtl" className="font-kurdish text-sm font-bold text-[#777777] dark:text-[#8495A0]">
        {phase === "recording"
          ? "گوێت لێ دەگیرێت... ئێستا بە دەنگ بڵێ"
          : phase === "done"
            ? passed
              ? "ئافەرم! وتارەکەت دروستە."
              : "ڕستەکە هاوتا نەبوو. دەتوانیت دووبارەی بکەیتەوە یان تێپەڕێنیت."
            : "دەست لە مایکەکە بدە و بە دەنگ بڵێ"}
      </p>

      {/* Transcript */}
      {transcript && (
        <div className="w-full max-w-sm rounded-2xl border-2 border-[#E5E5E5] bg-white p-3 dark:border-[#37464F] dark:bg-[#131F24]">
          <span dir="ltr" className="text-sm font-bold text-[#4B4B4B] dark:text-white">&ldquo;{transcript}&rdquo;</span>
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
            {passed ? "باشە! دەنگت تۆمارکرا." : "هەوڵبدەرەوە یان کلیک بکە بۆ تێپەڕاندن."}
          </p>
        </div>
      )}

      {/* Reset */}
      {phase === "done" && !passed && !answered && (
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#1CB0F6] bg-[#DDF4FF] px-5 py-3 text-sm font-black text-[#1CB0F6] hover:bg-[#B8E8FF] cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          دووبارە هەوڵبدەرەوە
        </button>
      )}

      {/* Fallback button so learners are never stuck */}
      {!answered && (
        <button
          type="button"
          onClick={handleManualPass}
          className="text-xs font-bold text-[#AFAFAF] hover:text-[#777777] underline underline-offset-4 cursor-pointer transition-colors"
        >
          ناتوانی لە قسەکردن؟ دەست لێرە بدە بۆ تێپەڕاندن (Can&apos;t speak now? Tap to pass)
        </button>
      )}
    </div>
  );
}
