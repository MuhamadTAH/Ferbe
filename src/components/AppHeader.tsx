"use client";

import Link from "next/link";
import { BookOpen, Dumbbell, Sparkles, User, Flame, Heart } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAppConfig } from "@/providers/ConvexClientProvider";

function HeaderStatsPills() {
  const stats = useQuery(api.curriculum.getMyStats, {});
  if (!stats) return null;

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Kurdish Language Flag Pill */}
      <div
        className="hidden items-center gap-2 rounded-xl border-2 border-[#E5E5E5] px-2.5 py-1 text-xs font-extrabold text-[#4B4B4B] hover:bg-[#F7F7F7] sm:flex"
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
        <span>{stats.currentStreak}</span>
      </div>

      {/* Gems Pill */}
      <div
        className="flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-extrabold text-[#1CB0F6] transition-colors hover:bg-[#DDF4FF]"
        title="Gems"
      >
        <span className="text-sm">💎</span>
        <span>{500 + stats.totalXp}</span>
      </div>

      {/* Hearts Pill */}
      <div
        className="flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-extrabold text-[#FF4B4B] transition-colors hover:bg-[#FFDFDF]"
        title="Hearts remaining"
      >
        <Heart className="h-5 w-5 fill-[#FF4B4B] text-[#FF4B4B]" />
        <span>{stats.hearts}</span>
      </div>
    </div>
  );
}

/** App header with auth-aware actions and Duolingo HUD status pills. */
export function AppHeader() {
  const { hasConvex, hasClerk } = useAppConfig();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#E5E5E5] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/learn"
          className="flex items-center gap-2.5 text-xl font-extrabold text-[#58CC02] transition-opacity hover:opacity-90"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#58CC02] text-white shadow-sm shadow-[#58CC02]/30">
            <Sparkles className="h-5 w-5" />
          </span>
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
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#777777] hover:bg-[#F7F7F7] hover:text-[#58CC02] sm:px-3 sm:text-sm"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Learn</span>
          </Link>
          <Link
            href="/practice"
            className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#777777] hover:bg-[#F7F7F7] hover:text-[#1CB0F6] sm:px-3 sm:text-sm"
          >
            <Dumbbell className="h-4 w-4" />
            <span className="hidden sm:inline">Practice</span>
          </Link>

          {hasClerk ? (
            <>
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="flex items-center gap-1.5 rounded-2xl border-b-4 border-[#1899D6] bg-[#1CB0F6] px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-[#4FC3F9] sm:px-4 sm:py-2 sm:text-sm"
                >
                  <User className="h-4 w-4" />
                  <span>Sign in</span>
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
