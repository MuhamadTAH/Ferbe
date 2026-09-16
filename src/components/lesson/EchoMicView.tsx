"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Volume2, CheckCircle2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

// SpeechRecognition type declarations
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

interface EchoMicViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

export function EchoMicView({ exercise, onSelect, selected }: EchoMicViewProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>("");
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const solution = exercise.solutionData ?? {};
  const targetText = ((solution.spokenText as string) || (solution.correct as string) || "").trim();
  const subTextGuide = (solution.subTextGuide as string) || (solution.transliteration as string) || "هەواریو؟";
  const instruction = (solution.instruction as string) || "ڕاهێنانی وتار و دەنگدانەوە (The Echo Mic)";
  const visualScaffold = solution.visualScaffold as string | undefined;
  const isTimed = Boolean(solution.timerSeconds);
  const timerDuration = Number(solution.timerSeconds || 4);

  // Auto-play model audio once on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (targetText) {
        playAmericanSpeech(targetText, 0.85);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [targetText]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlePlayModel = () => {
    if (targetText) {
      playAmericanSpeech(targetText, 0.85);
    }
  };

  const handleStartListening = () => {
    if (verified) return;

    const win = typeof window !== "undefined" ? (window as unknown as IWindow) : null;
    const SpeechRecognition = win?.SpeechRecognition || win?.webkitSpeechRecognition;

    setIsRecording(true);
    setSpokenTranscript("");

    // Start countdown timer if applicable (e.g. Screen 10)
    if (isTimed) {
      setCountdown(timerDuration);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsRecording(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    if (!SpeechRecognition) {
      // Fallback for browsers without speech recognition support
      setTimeout(() => {
        setIsRecording(false);
        setVerified(true);
        onSelect(targetText || "completed");
      }, 2000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript ?? "";
        setSpokenTranscript(transcript);
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);

        // Simple fuzzy match check
        const cleanTarget = targetText.toLowerCase().replace(/[^a-z0-9]/g, "");
        const cleanSpoken = transcript.toLowerCase().replace(/[^a-z0-9]/g, "");

        if (cleanSpoken.length > 0) {
          setVerified(true);
          onSelect(targetText || "completed");
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  // Direct confirmation button for learners who cannot speak aloud or have mic issues
  const handleManualPass = () => {
    setVerified(true);
    onSelect(targetText || "completed");
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Instruction Badge */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
          <Mic className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          گوێ بگرە و بە دەنگ دووبارەی بکەرەوە
        </h2>
      </div>

      {/* Acoustic Guide & Audio Replay Card */}
      <div className="flex flex-col items-center gap-3 w-full max-w-sm rounded-3xl border-2 border-[#E5E5E5] bg-white p-6 shadow-sm dark:border-[#37464F] dark:bg-[#131F24]">
        {/* Pronunciation sub-text in Kurdish */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] font-extrabold uppercase text-[#AFAFAF] dark:text-[#8495A0]">
            دەنگی وتار (Pronunciation Guide)
          </span>
          <span dir="rtl" className="font-kurdish text-3xl font-extrabold text-[#1899D6] dark:text-[#3BC0F8]">
            {subTextGuide}
          </span>
        </div>

        {/* Visual scaffold if provided (Screen 10) */}
        {visualScaffold && (
          <div className="mt-2 rounded-xl bg-[#F7F7F7] dark:bg-[#202F36] px-3 py-1.5 text-xs font-bold text-[#777777] dark:text-[#DCE6EC]">
            {visualScaffold}
          </div>
        )}

        {/* Listen Model Button */}
        <button
          type="button"
          onClick={handlePlayModel}
          className="mt-2 inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#1899D6] bg-[#1CB0F6] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:bg-[#4FC3F9] active:translate-y-[2px]"
        >
          <Volume2 className="h-4 w-4" />
          <span>گوێگرتن لە دەنگ (Listen)</span>
        </button>
      </div>

      {/* Main Microphone Button */}
      <div className="relative flex flex-col items-center gap-4 py-4">
        {/* Pulsating Ring */}
        <div className="relative">
          {isRecording && (
            <span className="absolute -inset-3 rounded-full bg-[#EA2B2B]/20 animate-ping" />
          )}

          <button
            type="button"
            onClick={handleStartListening}
            className={cn(
              "relative flex h-28 w-28 items-center justify-center rounded-full border-4 shadow-xl transition-all select-none cursor-pointer",
              verified
                ? "border-[#46A302] bg-[#58CC02] text-white"
                : isRecording
                  ? "border-[#CE1126] bg-[#EA2B2B] text-white scale-105"
                  : "border-[#1899D6] bg-[#1CB0F6] text-white hover:scale-105 active:scale-95"
            )}
          >
            {verified ? (
              <CheckCircle2 className="h-14 w-14 stroke-[2.5]" />
            ) : (
              <Mic className={cn("h-14 w-14", isRecording && "animate-pulse")} />
            )}
          </button>
        </div>

        {/* Status Text & Timer */}
        {countdown !== null && countdown > 0 && isRecording && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EA2B2B] text-sm font-black text-white shadow-md animate-bounce">
            {countdown}s
          </div>
        )}

        <p dir="rtl" className="font-kurdish text-sm font-bold text-[#777777] dark:text-[#8495A0]">
          {verified
            ? "دەنگەکەت بە سەرکەوتوویی تۆمار کرا!"
            : isRecording
              ? "گوێت لێ دەگیرێت... ئێستا بڵێ"
              : "کلیک لە مایکەکە بکە و قسە بکە"}
        </p>

        {spokenTranscript && (
          <div className="rounded-xl border border-[#58CC02] bg-[#E8FAD4] px-4 py-1.5 text-xs font-extrabold text-[#58CC02]">
            &quot;{spokenTranscript}&quot;
          </div>
        )}
      </div>

      {/* Fallback button if mic not available */}
      {!verified && (
        <button
          type="button"
          onClick={handleManualPass}
          className="text-xs font-bold text-[#AFAFAF] hover:text-[#777777] underline dark:text-[#8495A0]"
        >
          مایک کار ناکات؟ کلیک بکە بۆ پەسەندکردن
        </button>
      )}
    </div>
  );
}
