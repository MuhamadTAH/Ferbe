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

      <p className="text-sm font-bold text-[#777777]">
        Total XP: <span className="text-[#4B4B4B]">{totalXp}</span>
      </p>

      <Link href="/learn" className="w-full max-w-xs">
        <PushButton variant="green" className="w-full py-3.5 text-base">
          Continue
        </PushButton>
      </Link>
    </div>
  );
}
