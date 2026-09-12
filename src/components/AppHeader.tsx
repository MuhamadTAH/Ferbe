"use client";

import Link from "next/link";
import { BookOpen, Dumbbell, User, Flame, Heart } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { SquirrelAvatar } from "@/components/duo/SquirrelAvatar";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { useActiveCourse } from "@/hooks/useActiveCourse";

function HeaderStatsPills() {
  const stats = useQuery(api.curriculum.getMyStats, {});
  const { currentCourse } = useActiveCourse();
  if (!stats) return null;

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Active Language Flag Pill */}
      <Link
        href="/courses"
        className="hidden items-center gap-2 rounded-xl border-2 border-[#E5E5E5] dark:border-[#37464F] px-2.5 py-1 text-xs font-extrabold text-[#4B4B4B] dark:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] sm:flex cursor-pointer"
        title={`${currentCourse.title} (${currentCourse.nativeTitle})`}
      >
        {currentCourse.flagType === "uk" ? (
          <svg
            className="h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] border border-black/10 shadow-xs"
            viewBox="0 0 60 36"
          >
            <path d="M0,0 v36 h60 v-36 z" fill="#012169" />
            <path d="M0,0 L60,36 M60,0 L0,36" stroke="#ffffff" strokeWidth="7" />
            <path d="M0,0 L60,36 M60,0 L0,36" stroke="#C8102E" strokeWidth="4" />
            <path d="M30,0 v36 M0,18 h60" stroke="#ffffff" strokeWidth="11" />
            <path d="M30,0 v36 M0,18 h60" stroke="#C8102E" strokeWidth="7" />
          </svg>
        ) : (
          <span className="flex h-3.5 w-5 flex-col overflow-hidden rounded-[2px] border border-black/10 shadow-xs">
            <span className="h-1/3 w-full bg-[#ED1C24]" />
            <span className="flex h-1/3 w-full items-center justify-center bg-white">
              <span className="h-1 w-1 rounded-full bg-[#FFD700]" />
            </span>
            <span className="h-1/3 w-full bg-[#278E43]" />
          </span>
        )}
        <span>{currentCourse.shortLabel}</span>
      </Link>

      {/* Streak Pill */}
      <div
        className="flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-extrabold text-[#FF9600] transition-colors hover:bg-[#FFF4E5] dark:hover:bg-[#341F05]"
        title="Day Streak"
      >
        <Flame className="h-5 w-5 fill-[#FF9600] text-[#FF9600]" />
        <span>{stats.currentStreak}</span>
      </div>

      {/* Gems Pill */}
      <div
        className="flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-extrabold text-[#1CB0F6] transition-colors hover:bg-[#DDF4FF] dark:hover:bg-[#1C3B4E]"
        title="Gems"
      >
        <span className="text-sm">💎</span>
        <span>{stats.gems ?? (500 + stats.totalXp)}</span>
      </div>

      {/* Hearts Pill */}
      <div
        className="flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-extrabold text-[#FF4B4B] transition-colors hover:bg-[#FFDFDF] dark:hover:bg-[#3E1C1C]"
        title="Hearts remaining"
      >
        <Heart className="h-5 w-5 fill-[#FF4B4B] text-[#FF4B4B]" />
        <span>{stats.hearts}</span>
      </div>
    </div>
  );
}

function HeaderAuthSection() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <UserButton />;
  }

  return (
    <Link
      href="/sign-in"
      className="flex items-center gap-1.5 rounded-2xl border-b-4 border-[#1899D6] bg-[#1CB0F6] px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-[#4FC3F9] sm:px-4 sm:py-2 sm:text-sm"
    >
      <User className="h-4 w-4" />
      <span>Sign in</span>
    </Link>
  );
}

/** App header with auth-aware actions and Duolingo HUD status pills. */
export function AppHeader() {
  const { hasConvex, hasClerk } = useAppConfig();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#E5E5E5] dark:border-[#37464F] bg-white/95 dark:bg-[#131F24]/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/learn"
          className="flex items-center gap-2.5 text-xl font-extrabold text-[#58CC02] transition-opacity hover:opacity-90"
        >
          <SquirrelAvatar
            size={36}
            mood="happy"
            variant="green"
            shape="rounded"
            alt="Smorik mascot"
          />
          <span className="tracking-tight">Fêrbe</span>
          <span
            dir="rtl"
            className="hidden font-kurdish text-base font-bold text-[#58CC02] sm:inline"
          >
            فێربە
          </span>
        </Link>

        {/* Center HUD Stats */}
        {hasConvex ? <HeaderStatsPills /> : null}

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/learn"
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#777777] dark:text-[#8495A0] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] hover:text-[#58CC02] dark:hover:text-[#58CC02] sm:px-3 sm:text-sm"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Learn</span>
          </Link>
          <Link
            href="/practice"
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#777777] dark:text-[#8495A0] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] hover:text-[#1CB0F6] dark:hover:text-[#1CB0F6] sm:px-3 sm:text-sm"
          >
            <Dumbbell className="h-4 w-4" />
            <span className="hidden sm:inline">Practice</span>
          </Link>

          {hasClerk ? <HeaderAuthSection /> : null}
        </nav>
      </div>
    </header>
  );
}
