"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Volume2, CheckCircle2, RotateCcw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";
import { evaluateSpokenAnswer, type SpeechEvaluationResult } from "@/lib/speechEvaluation";
import { playOptionSelectSound } from "@/lib/lessonAudio";

// SpeechRecognition type declarations
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

interface EchoMicViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
  lastCorrect?: boolean | null;
}

export function EchoMicView({
  exercise,
  onSelect,
  selected,
  lastCorrect,
}: EchoMicViewProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>("");
  const [evalResult, setEvalResult] = useState<SpeechEvaluationResult | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  const solution = exercise.solutionData ?? {};
  const targetText = ((solution.spokenText as string) || (solution.correct as string) || "").trim();
  const subTextGuide = (solution.subTextGuide as string) || (solution.transliteration as string) || "هەواریو؟";
  const instruction = (solution.instruction as string) || "ڕاهێنانی وتار و دەنگدانەوە (The Echo Mic)";
  const visualScaffold = solution.visualScaffold as string | undefined;
  const isTimed = Boolean(solution.timerSeconds);
  const timerDuration = Number(solution.timerSeconds || 4);
  const answered = lastCorrect !== null && lastCorrect !== undefined;

  // Auto-play model audio once on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (targetText) {
        playAmericanSpeech(targetText, 0.85);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [targetText]);

  // Clean up timers and speech recognition
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
    if (targetText) {
      playAmericanSpeech(targetText, 0.85);
    }
  };

  // Restart / Reset recording so learner can record a new attempt before checking
  const handleRestart = () => {
    if (answered) return;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setCountdown(null);
    setSpokenTranscript("");
    setEvalResult(null);
    onSelect(""); // Clears selected answer so Check button disables until next recording
    playOptionSelectSound();
  };

  const handleStartListening = () => {
    if (answered) return;

    // If currently recording, tap to stop
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);
      setCountdown(null);
      return;
    }

    // Reset previous attempt and start fresh
    setSpokenTranscript("");
    setEvalResult(null);
    onSelect("");

    const win = typeof window !== "undefined" ? (window as unknown as IWindow) : null;
    const SpeechRecognition = win?.SpeechRecognition || win?.webkitSpeechRecognition;

    setIsRecording(true);

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
        const evalRes = evaluateSpokenAnswer(targetText, targetText, visualScaffold);
        setSpokenTranscript(targetText);
        setEvalResult(evalRes);
        onSelect(targetText);
      }, 1500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = (event.results[0]?.[0]?.transcript ?? "").trim();
        setSpokenTranscript(transcript);
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setCountdown(null);

        // Strict evaluation of what was actually said vs target sentence
        const evalRes = evaluateSpokenAnswer(transcript, targetText, visualScaffold);
        setEvalResult(evalRes);

        if (evalRes.isMatch) {
          // Correct speech: select targetText so Check evaluates as correct
          onSelect(targetText);
        } else {
          // Wrong speech: select transcript so Check evaluates as incorrect
          onSelect(transcript.length > 0 ? transcript : "unrecognized");
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setCountdown(null);
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setCountdown(null);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setCountdown(null);
    }
  };

  // Direct confirmation button for learners who cannot speak aloud or have mic issues
  const handleManualPass = () => {
    if (answered) return;
    setSpokenTranscript(targetText);
    setEvalResult({
      isMatch: true,
      score: 1.0,
      matchedWords: targetText.split(" "),
      missingWords: [],
      spokenNormalized: targetText,
      targetNormalized: targetText,
    });
    onSelect(targetText);
  };

  const isMatch = evalResult?.isMatch ?? false;
  const hasSpoken = spokenTranscript.length > 0;

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

      {/* Target Phrase Guide & Audio Replay Card */}
      <div className="flex flex-col items-center gap-3 w-full max-w-md rounded-3xl border-2 border-[#E5E5E5] bg-white p-6 shadow-sm dark:border-[#37464F] dark:bg-[#131F24]">
        {/* Target text in English */}
        <p dir="ltr" className="text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white select-none">
          {targetText}
        </p>

        {/* Pronunciation sub-text in Kurdish */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[11px] font-extrabold uppercase text-[#AFAFAF] dark:text-[#8495A0]">
            دەنگی وتار (Pronunciation Guide)
          </span>
          <span dir="rtl" className="font-kurdish text-2xl font-extrabold text-[#1899D6] dark:text-[#3BC0F8]">
            {subTextGuide}
          </span>
        </div>

        {/* Visual scaffold if provided (Screen 10) */}
        {visualScaffold && (
          <div className="rounded-xl bg-[#F7F7F7] dark:bg-[#202F36] px-3.5 py-1.5 text-xs font-bold text-[#777777] dark:text-[#DCE6EC]">
            {visualScaffold}
          </div>
        )}

        {/* Listen Model Button */}
        <button
          type="button"
          onClick={handlePlayModel}
          className="mt-1 inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#1899D6] bg-[#1CB0F6] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:bg-[#4FC3F9] active:translate-y-[2px]"
        >
          <Volume2 className="h-4 w-4" />
          <span>گوێگرتن لە دەنگ (Listen)</span>
        </button>
      </div>

      {/* Main Microphone Button */}
      <div className="relative flex flex-col items-center gap-3 py-2">
        {/* Pulsating Ring */}
        <div className="relative">
          {isRecording && (
            <span className="absolute -inset-3 rounded-full bg-[#EA2B2B]/20 animate-ping" />
          )}

          <button
            type="button"
            disabled={answered}
            onClick={handleStartListening}
            aria-label={isRecording ? "Stop recording" : "Start speaking"}
            className={cn(
              "relative flex h-28 w-28 items-center justify-center rounded-full border-4 shadow-xl transition-all select-none cursor-pointer",
              answered && lastCorrect
                ? "border-[#46A302] bg-[#58CC02] text-white cursor-default"
                : answered && !lastCorrect
                  ? "border-[#CE1126] bg-[#EA2B2B] text-white cursor-default"
                  : isRecording
                    ? "border-[#CE1126] bg-[#EA2B2B] text-white scale-105"
                    : hasSpoken && isMatch
                      ? "border-[#46A302] bg-[#58CC02] text-white hover:scale-105 active:scale-95"
                      : hasSpoken && !isMatch
                        ? "border-[#FF9600] bg-[#FF9600] text-white hover:scale-105 active:scale-95"
                        : "border-[#1899D6] bg-[#1CB0F6] text-white hover:scale-105 active:scale-95"
            )}
          >
            {hasSpoken && isMatch ? (
              <CheckCircle2 className="h-14 w-14 stroke-[2.5]" />
            ) : hasSpoken && !isMatch ? (
              <AlertCircle className="h-14 w-14 stroke-[2.5]" />
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
          {isRecording
            ? "گوێت لێ دەگیرێت... ئێستا بە دەنگ بڵێ"
            : hasSpoken
              ? isMatch
                ? "ئافەرم! وتارەکەت هاوتای ڕستەکەیە."
                : "ڕستەکە هاوتا نەبوو لەگەڵ داواکراو. تکایە دووبارەی بکەرەوە!"
              : "کلیک لە مایکەکە بکە و قسە بکە"}
        </p>

        {/* Spoken Feedback Banner */}
        {hasSpoken && (
          <div
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3.5 max-w-sm w-full transition-all",
              isMatch
                ? "border-[#A5ED6E] bg-[#D7FFB8] text-[#58A700] dark:border-[#58CC02] dark:bg-[#1E3B20] dark:text-[#58CC02]"
                : "border-[#FFB2B2] bg-[#FFDFE0] text-[#EA2B2B] dark:border-[#EA2B2B] dark:bg-[#3A181D] dark:text-[#FF6666]"
            )}
          >
            <div className="flex items-center gap-2">
              {isMatch ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span dir="ltr" className="text-sm font-black">
                &quot;{spokenTranscript}&quot;
              </span>
            </div>

            <p dir="rtl" className="font-kurdish text-xs font-bold text-center">
              {isMatch
                ? "وتارەکەت بە سەرکەوتوویی ناسرایەوە."
                : "ئەم دەستەواژەیە هاوتا نییە. دووبارە تۆماری بکەرەوە پێش پشکنین."}
            </p>
          </div>
        )}

        {/* Restart / Record Again Button */}
        {hasSpoken && !answered && (
          <button
            type="button"
            onClick={handleRestart}
            className="mt-1 inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#1899D6] bg-[#1CB0F6] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:bg-[#4FC3F9] active:translate-y-[2px] active:border-b-2 shadow-sm cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>دووبارە تۆمارکردنەوە (Record Again)</span>
          </button>
        )}
      </div>

      {/* Fallback button if mic not available */}
      {!hasSpoken && !answered && (
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
