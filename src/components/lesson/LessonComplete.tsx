"use client";

import Link from "next/link";
import { Star, Zap, Target, Flame } from "lucide-react";
import { PushButton } from "@/components/duo/PushButton";

interface LessonCompleteProps {
  lessonTitle: string;
  xpEarned: number;
  accuracyPct: number;
  currentStreak: number;
  totalXp: number;
}

/** Session-complete screen with XP / accuracy / streak stats. */
export function LessonComplete({
  lessonTitle,
  xpEarned,
  accuracyPct,
  currentStreak,
  totalXp,
}: LessonCompleteProps) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 px-4 py-16 text-center">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[#FFC800]/20 animate-ping" />
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#FFC800]">
          <Star className="h-14 w-14 fill-white text-white" />
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-[#58CC02]">Lesson complete!</h1>
        <p className="mt-1 text-sm font-bold text-[#777777]">{lessonTitle}</p>
      </div>

      <div className="grid w-full grid-cols-3 gap-3">
        <div className="rounded-2xl border-2 border-b-4 border-[#FFC800] p-4">
          <Zap className="mx-auto h-6 w-6 text-[#FFC800]" />
          <p className="mt-1 text-2xl font-extrabold text-[#4B4B4B]">{xpEarned}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-[#AFAFAF]">
            XP earned
          </p>
        </div>
        <div className="rounded-2xl border-2 border-b-4 border-[#58CC02] p-4">
          <Target className="mx-auto h-6 w-6 text-[#58CC02]" />
          <p className="mt-1 text-2xl font-extrabold text-[#4B4B4B]">{accuracyPct}%</p>
          <p className="text-xs font-bold uppercase tracking-wide text-[#AFAFAF]">
            Accuracy
          </p>
        </div>
        <div className="rounded-2xl border-2 border-b-4 border-[#FF4B4B] p-4">
          <Flame className="mx-auto h-6 w-6 text-[#FF4B4B]" />
          <p className="mt-1 text-2xl font-extrabold text-[#4B4B4B]">{currentStreak}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-[#AFAFAF]">
            Day streak
          </p>
        </div>
      </div>

      {/* 7-Day Streak Calendar Progression */}
      <div className="w-full rounded-3xl border-2 border-[#E5E5E5] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 fill-[#FF9600] text-[#FF9600]" />
            <span className="text-sm font-extrabold text-[#4B4B4B]">
              Day {currentStreak} of your Kurdish streak!
            </span>
          </div>
          <span className="text-xs font-extrabold text-[#58CC02]">Active</span>
        </div>

        {/* Days Circles */}
        <div className="mt-4 flex items-center justify-between gap-1">
          {[
            { label: "M", done: true },
            { label: "Tu", done: true },
            { label: "W", done: true },
            { label: "Th", done: true },
            { label: "F", done: true, today: true },
            { label: "Sa", done: false },
            { label: "Su", done: false },
          ].map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-extrabold text-[#AFAFAF]">
                {day.label}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-extrabold transition-transform ${
                  day.done
                    ? "border-[#FF9600] bg-[#FF9600] text-white shadow-xs"
                    : "border-[#E5E5E5] bg-[#F7F7F7] text-[#AFAFAF]"
                } ${day.today ? "scale-110 ring-2 ring-[#FF9600]/30" : ""}`}
              >
                {day.done ? <Flame className="h-4 w-4 fill-white" /> : "·"}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs font-bold text-[#777777]">
          💡 Tip: Practice tomorrow to prevent your streak from resetting!
        </p>
      </div>

      <p className="text-sm font-bold text-[#777777]">
        Total XP: <span className="font-extrabold text-[#4B4B4B]">{totalXp}</span>
      </p>

      <div className="flex w-full max-w-sm flex-col gap-2.5">
        <Link href="/learn" className="w-full">
          <PushButton variant="green" className="w-full py-3.5 text-base">
            Continue
          </PushButton>
        </Link>
        <Link href="/practice" className="w-full">
          <button
            type="button"
            className="w-full rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white py-3 text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6] transition-all hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 shadow-xs"
          >
            Review Kurdish Alphabet
          </button>
        </Link>
      </div>
    </div>
  );
}
