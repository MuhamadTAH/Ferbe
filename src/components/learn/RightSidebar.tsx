"use client";

import Link from "next/link";
import { Trophy, Zap, Sparkles, Check, Clock, Target, Flame, Heart } from "lucide-react";
import { PushButton } from "@/components/duo/PushButton";

interface RightSidebarProps {
  currentStreak: number;
  totalXp: number;
  completedLessonsCount: number;
  signedIn: boolean;
  hearts?: number;
}

export function RightSidebar({
  currentStreak,
  totalXp,
  completedLessonsCount,
  signedIn,
  hearts = 5,
}: RightSidebarProps) {
  const lessonsToUnlockLeaderboard = Math.max(0, 3 - completedLessonsCount);
  const xpQuestTarget = 10;
  const currentXpProgress = Math.min(xpQuestTarget, totalXp);
  const xpQuestDone = totalXp >= xpQuestTarget;

  return (
    <aside className="sticky top-6 hidden w-84 shrink-0 flex-col gap-5 lg:flex">
      {/* 0. Top HUD Status Pills on Desktop (Duolingo layout) */}
      <div className="flex items-center justify-between px-1 py-1">
        {/* Kurdish Flag Pill */}
        <div
          className="flex items-center gap-2 rounded-xl border-2 border-[#E5E5E5] px-2.5 py-1 text-xs font-extrabold text-[#4B4B4B] hover:bg-[#F7F7F7] cursor-pointer"
          title="Kurdish Sorani (کوردی)"
        >
          <span className="flex h-3.5 w-5 flex-col overflow-hidden rounded-[2px] border border-black/10 shadow-xs">
            <span className="h-1/3 w-full bg-[#ED1C24]" />
            <span className="flex h-1/3 w-full items-center justify-center bg-white">
              <span className="h-1 w-1 rounded-full bg-[#FFD700]" />
            </span>
            <span className="h-1/3 w-full bg-[#278E43]" />
          </span>
          <span>Sorani</span>
        </div>

        {/* Streak Pill */}
        <div
          className="flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-extrabold text-[#FF9600] transition-colors hover:bg-[#FFF4E5]"
          title="Day Streak"
        >
          <Flame className="h-5 w-5 fill-[#FF9600] text-[#FF9600]" />
          <span>{currentStreak}</span>
        </div>

        {/* Gems Pill */}
        <div
          className="flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-extrabold text-[#1CB0F6] transition-colors hover:bg-[#DDF4FF]"
          title="Gems"
        >
          <span className="text-sm">💎</span>
          <span>{500 + totalXp}</span>
        </div>

        {/* Hearts Pill */}
        <div
          className="flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-extrabold text-[#FF4B4B] transition-colors hover:bg-[#FFDFDF]"
          title="Hearts remaining"
        >
          <Heart className="h-5 w-5 fill-[#FF4B4B] text-[#FF4B4B]" />
          <span>{hearts}</span>
        </div>
      </div>

      {/* 1. Unlock Leaderboards Card */}
      <div className="rounded-3xl border-2 border-[#E5E5E5] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#4B4B4B]">
            Unlock Leaderboards!
          </h3>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFDFE0]/40 text-[#FF4B4B]">
            <Trophy className="h-5 w-5 text-[#FFC800]" />
          </div>
        </div>
        <p className="text-xs font-bold leading-relaxed text-[#777777]">
          {lessonsToUnlockLeaderboard > 0
            ? `Complete ${lessonsToUnlockLeaderboard} more lesson${
                lessonsToUnlockLeaderboard === 1 ? "" : "s"
              } to start competing in the Bronze League!`
            : "Leaderboards Unlocked! You are now competing in the Bronze League."}
        </p>

        <div className="mt-3.5">
          <div className="flex justify-between text-[11px] font-extrabold text-[#AFAFAF]">
            <span>Bronze League Progress</span>
            <span>{Math.min(3, completedLessonsCount)} / 3</span>
          </div>
          <div className="mt-1.5 h-3.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
            <div
              className="h-full rounded-full bg-[#FFC800] transition-all duration-300"
              style={{
                width: `${Math.min(100, (completedLessonsCount / 3) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Daily Quests Card */}
      <div className="rounded-3xl border-2 border-[#E5E5E5] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#4B4B4B]">
            Daily Quests
          </h3>
          <span className="text-xs font-extrabold uppercase tracking-wide text-[#1CB0F6] hover:underline cursor-pointer">
            View All
          </span>
        </div>

        <div className="flex flex-col gap-3.5">
          {/* Quest 1: Earn 10 XP */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF9E6] text-[#FFC800]">
              <Zap className="h-5 w-5 fill-[#FFC800]" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-extrabold text-[#4B4B4B]">
                <span>Earn 10 XP</span>
                <span className={xpQuestDone ? "text-[#58CC02]" : "text-[#777777]"}>
                  {currentXpProgress} / {xpQuestTarget}
                </span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                <div
                  className="h-full rounded-full bg-[#FFC800] transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (currentXpProgress / xpQuestTarget) * 100)}%`,
                  }}
                />
              </div>
            </div>
            {xpQuestDone && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#58CC02] text-white">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>
            )}
          </div>

          {/* Quest 2: Spend 5 minutes learning */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DDF4FF] text-[#1CB0F6]">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-extrabold text-[#4B4B4B]">
                <span>Spend 5 mins</span>
                <span className="text-[#777777]">5 / 5</span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                <div className="h-full w-full rounded-full bg-[#1CB0F6]" />
              </div>
            </div>
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#58CC02] text-white">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </div>
          </div>

          {/* Quest 3: 80% accuracy */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8FAD4] text-[#58CC02]">
              <Target className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-extrabold text-[#4B4B4B]">
                <span>Score 80%+</span>
                <span className="text-[#777777]">
                  {completedLessonsCount > 0 ? "1 / 1" : "0 / 1"}
                </span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                <div
                  className="h-full rounded-full bg-[#58CC02] transition-all"
                  style={{
                    width: completedLessonsCount > 0 ? "100%" : "0%",
                  }}
                />
              </div>
            </div>
            {completedLessonsCount > 0 && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#58CC02] text-white">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>
            )}
          </div>

          {/* Quest 4: Daily streak */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF4E5] text-[#FF9600]">
              <Flame className="h-5 w-5 fill-[#FF9600]" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-extrabold text-[#4B4B4B]">
                <span>Keep streak</span>
                <span className="text-[#FF9600]">
                  {currentStreak > 0 ? `${currentStreak} day` : "0 / 1"}
                </span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                <div
                  className="h-full rounded-full bg-[#FF9600] transition-all"
                  style={{
                    width: currentStreak > 0 ? "100%" : "0%",
                  }}
                />
              </div>
            </div>
            {currentStreak > 0 && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#58CC02] text-white">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Guest Profile Conversion Card (Soft-Wall CTA) */}
      {!signedIn && (
        <div className="rounded-3xl border-2 border-[#1CB0F6] bg-[#DDF4FF]/60 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#1CB0F6]" />
            <h4 className="text-sm font-extrabold text-[#1899D6]">
              Create a profile to save progress
            </h4>
          </div>
          <p className="text-xs leading-relaxed text-[#4B4B4B]">
            Sync your day streak, XP and unlocked Kurdish units across all devices for free.
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            <Link href="/sign-up">
              <PushButton variant="blue" className="w-full py-2.5 text-xs">
                Create a Profile
              </PushButton>
            </Link>
            <Link href="/sign-in">
              <PushButton variant="white" className="w-full py-2 text-xs text-[#777777]">
                Sign In
              </PushButton>
            </Link>
          </div>
        </div>
      )}

      {/* 4. Footer Links */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 px-2 text-[11px] font-bold text-[#AFAFAF]">
        <Link href="/" className="hover:underline">About</Link>
        <span>·</span>
        <Link href="/practice" className="hover:underline">Practice</Link>
        <span>·</span>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline">
          GitHub
        </a>
        <span>·</span>
        <span className="text-[#58CC02]">Kurdish Sorani (کوردی)</span>
      </div>
    </aside>
  );
}
