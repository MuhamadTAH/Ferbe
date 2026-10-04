"use client";

import { useState } from "react";
import { Flag, Mic, CheckCircle2, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";

interface BossScoreCardViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

/**
 * Lesson 1.7 Screen 1: Scenario briefing — the user starts the roleplay.
 * Lesson 1.7 Screen 8: Mastery Scorecard — shows radar chart, PASS/FAIL badge.
 */
export function BossScoreCardView({ exercise, onSelect, selected }: BossScoreCardViewProps) {
  const solution = exercise.solutionData ?? {};
  const isBriefing = (solution.subtype as string) === "boss_briefing";
  const instruction = (solution.instruction as string) || "تاقیکردنەوەی کۆتایی (Boss Checkpoint)";

  const [started, setStarted] = useState(false);

  if (isBriefing) {
    // Screen 1: Scenario briefing
    return (
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
            <Flag className="h-3.5 w-3.5" />
            <span>{instruction}</span>
          </span>
        </div>

        {/* Avatar */}
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#FF9600] to-[#FF5C00] text-6xl shadow-lg">
          🧑‍🏫
        </div>

        {/* Mission banner */}
        <div className="w-full max-w-sm rounded-3xl border-2 border-[#FF9600]/40 bg-[#FFF4E5] dark:bg-[#342416] p-6">
          <p dir="rtl" className="font-kurdish text-lg font-extrabold text-[#FF9600] leading-relaxed">
            🎯 گفتوگۆی ڕاستەقینە هەبە. بێ ئامرازەوە. بێ ژێرنووسەوە.
          </p>
          <p dir="ltr" className="mt-2 text-sm font-bold text-[#777777]">
            Respond naturally into the mic.
          </p>
        </div>

        {/* Mic status */}
        <div className="flex items-center gap-2 rounded-xl border border-[#58CC02]/40 bg-[#E8FAD4] px-4 py-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[#58CC02] animate-pulse" />
          <span className="text-sm font-black text-[#58CC02]">Microphone Ready</span>
        </div>

        {/* Start button */}
        <button
          type="button"
          onClick={() => {
            setStarted(true);
            onSelect("started");
          }}
          disabled={started}
          className={cn(
            "w-full max-w-sm rounded-3xl border-2 border-b-4 py-5 text-xl font-black transition-all",
            started
              ? "border-[#E5E5E5] bg-[#F7F7F7] text-[#AFAFAF] cursor-not-allowed"
              : "border-[#FF9600] bg-[#FF9600] text-white hover:bg-[#FF7A00] hover:border-[#CC6200] shadow-lg"
          )}
        >
          🎤 Start Conversation
        </button>
      </div>
    );
  }

  // Screen 8: Mastery Scorecard
  const statsList = solution.stats as Array<{ label: string; value: string }> | undefined;
  const grade = (solution.grade as string | undefined) || "A+";
  const title = (solution.title as string | undefined) || "پۆلی کۆتایی";

  const speedScore = Number(solution.speedScore || 85);
  const accuracyScore = Number(solution.accuracyScore || 78);
  const flowScore = Number(solution.flowScore || 82);
  const totalScore = statsList ? 100 : Math.round((speedScore + accuracyScore + flowScore) / 3);
  const passed = statsList ? true : totalScore >= 80;

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex flex-col items-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
          <BarChart2 className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          {title}
        </h2>
      </div>

      {/* Score badge */}
      <div className={cn(
        "flex h-36 w-36 flex-col items-center justify-center rounded-full border-4 shadow-lg",
        passed ? "border-[#58CC02] bg-[#E8FAD4]" : "border-[#EA2B2B] bg-[#FFDFE0]"
      )}>
        <span className={cn("text-4xl font-black", passed ? "text-[#58CC02]" : "text-[#EA2B2B]")}>
          {statsList ? grade : `${totalScore}%`}
        </span>
        <span className={cn("text-xs font-black uppercase", passed ? "text-[#58A700]" : "text-[#EA2B2B]")}>
          {passed ? "PASSED" : "RETRY"}
        </span>
      </div>

      {/* Score breakdown bars / stats list */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        {statsList
          ? statsList.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-white dark:border-[#37464F] dark:bg-[#131F24] p-3 shadow-xs">
                <span dir="rtl" className="font-kurdish text-xs font-black text-[#4B4B4B] dark:text-white">{label}</span>
                <span className="text-sm font-black text-[#58CC02]">{value}</span>
              </div>
            ))
          : [
              { label: "Response Speed", score: speedScore, icon: "⚡" },
              { label: "Pronunciation Accuracy", score: accuracyScore, icon: "🎯" },
              { label: "Conversational Flow", score: flowScore, icon: "🌊" },
            ].map(({ label, score, icon }) => (
              <div key={label} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#4B4B4B] dark:text-white">{icon} {label}</span>
                  <span className={cn(
                    "text-xs font-black",
                    score >= 80 ? "text-[#58CC02]" : "text-[#FF9600]"
                  )}>{score}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#E5E5E5] dark:bg-[#37464F] overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", score >= 80 ? "bg-[#58CC02]" : "bg-[#FF9600]")}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
      </div>

      {/* Result message */}
      <div className={cn(
        "w-full max-w-sm rounded-3xl border-2 p-5",
        passed ? "border-[#58CC02]/40 bg-[#E8FAD4]" : "border-[#EA2B2B]/40 bg-[#FFDFE0]"
      )}>
        <p dir="rtl" className={cn(
          "font-kurdish text-base font-extrabold leading-relaxed",
          passed ? "text-[#58CC02]" : "text-[#EA2B2B]"
        )}>
          {passed
            ? "🏆 یەکەمی دەرچوو! ئاستی ١ تەواو کردت. ئاستی ٢ ئێستا کراوەیە!"
            : "دووبارە هەوڵبدەرەوە! بارودۆخی خراپ بیناسەرەوە و چارەسەری بکە."}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onSelect((solution.correct as string) || (passed ? "completed" : "needs_remediation"))}
        className={cn(
          "w-full max-w-sm rounded-3xl border-2 border-b-4 py-5 text-lg font-black transition-all cursor-pointer",
          passed
            ? "border-[#46A302] bg-[#58CC02] text-white hover:bg-[#46A302]"
            : "border-[#1899D6] bg-[#1CB0F6] text-white hover:bg-[#1899D6]"
        )}
      >
        {passed ? "🚀 تەواوکردنی قۆناغەکە" : "🔄 Try Again"}
      </button>
    </div>
  );
}
