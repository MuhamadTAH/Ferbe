"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import {
  Trophy,
  Clock,
  ArrowUp,
  Zap,
  Flame,
  Lock,
  Sparkles,
  Shield,
  Medal,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired, ErrorBoundary } from "@/components/states/ScreenState";
import { RightSidebar } from "@/components/learn/RightSidebar";

interface LeaderboardPlayer {
  id: string;
  rank: number;
  name: string;
  totalXp: number;
  currentStreak: number;
  isCurrentUser: boolean;
}

interface Stats {
  currentStreak: number;
  hearts: number;
  totalXp: number;
  signedIn: boolean;
}

interface LeaderboardData {
  league: string;
  leagueOrder: number;
  daysRemaining: number;
  promotionZoneCutoff: number;
  leaderboard: LeaderboardPlayer[];
  currentUserRank: number | null;
}

function LeaderboardInner() {
  const data = useQuery(api.curriculum.getLeaderboard, {}) as
    | LeaderboardData
    | undefined;
  const stats = useQuery(api.curriculum.getMyStats, {}) as Stats | undefined;

  const [userStatus, setUserStatus] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("ferbe_user_status");
      } catch {}
    }
    return null;
  });

  const handleSetStatus = (status: string | null) => {
    setUserStatus(status);
    try {
      if (status) {
        localStorage.setItem("ferbe_user_status", status);
      } else {
        localStorage.removeItem("ferbe_user_status");
      }
    } catch {}
  };

  if (data === undefined) {
    return (
      <div className="py-24 text-center font-extrabold text-[#AFAFAF]">
        Loading standings...
      </div>
    );
  }

  const completedLessonsCount = Math.floor((stats?.totalXp ?? 0) / 10);
  const isLocked = completedLessonsCount < 3;
  const lessonsRemaining = Math.max(1, 3 - completedLessonsCount);

  return (
    <div className="mx-auto flex max-w-5xl justify-center gap-10 px-4 py-8">
      {/* Main Column */}
      <main className="w-full max-w-xl">
        {isLocked ? (
          <div className="flex flex-col gap-6">
            {/* 1. Educational Header Card (Duolingo: "WHAT ARE LEADERBOARDS?") */}
            <div className="rounded-3xl border-2 border-[#E5E5E5] bg-white p-6 shadow-sm">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#AFAFAF]">
                WHAT ARE LEADERBOARDS?
              </div>
              <div className="mt-2 flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-extrabold text-[#4B4B4B]">
                    Do lessons. Earn XP. Compete.
                  </h1>
                  <p className="mt-1 text-xs font-bold leading-relaxed text-[#777777]">
                    Earn XP through Kurdish lessons, then compete with fellow learners across Kurdistan and the diaspora in weekly leaderboards!
                  </p>
                </div>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FFF9E6] text-3xl shadow-sm">
                  🏆
                </div>
              </div>
            </div>

            {/* 2. Unlocking Action Card with green "START A LESSON" CTA */}
            <div className="rounded-3xl border-2 border-[#E5E5E5] bg-white p-8 text-center shadow-sm">
              {/* Lock & Trophies Icon preview */}
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#FFF4E5] text-[#FF9600] shadow-inner">
                <Lock className="h-12 w-12 stroke-[2.5]" />
              </div>

              <h2
                data-test="leaderboards-locked"
                className="text-2xl font-extrabold text-[#4B4B4B]"
              >
                Unlock Leaderboards!
              </h2>
              <p className="mt-1.5 text-sm font-bold text-[#777777]">
                Complete {lessonsRemaining} more lesson{lessonsRemaining === 1 ? "" : "s"} to start competing in the Bronze League.
              </p>

              {/* Progress Bar */}
              <div className="mx-auto mt-5 max-w-xs">
                <div className="flex justify-between text-xs font-extrabold text-[#AFAFAF]">
                  <span>Bronze League Unlock</span>
                  <span>{completedLessonsCount} / 3 Lessons</span>
                </div>
                <div className="mt-2 h-4 w-full overflow-hidden rounded-full bg-[#E5E5E5] p-0.5">
                  <div
                    className="h-full rounded-full bg-[#FFC800] transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (completedLessonsCount / 3) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* START A LESSON CTA Button */}
              <div className="mt-6 flex justify-center">
                <Link
                  href="/practice"
                  className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl border-b-4 border-[#46A302] bg-[#58CC02] py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#61E002] active:translate-y-[2px] active:border-b-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>START A LESSON</span>
                </Link>
              </div>

              {/* Preview of Top Leagues */}
              <div className="mt-8 border-t-2 border-[#F0F0F0] pt-6">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#AFAFAF]">
                  Fêrbe League Tiers
                </p>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4E5] text-[#CD7F32] shadow-xs">
                      <Shield className="h-6 w-6 fill-[#CD7F32]" />
                    </div>
                    <span className="text-[11px] font-extrabold text-[#4B4B4B]">Bronze</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-60">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0F0F0] text-[#AFAFAF]">
                      <Shield className="h-6 w-6 fill-[#C0C0C0] text-[#C0C0C0]" />
                    </div>
                    <span className="text-[11px] font-extrabold text-[#AFAFAF]">Silver</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-40">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0F0F0] text-[#AFAFAF]">
                      <Medal className="h-6 w-6 text-[#FFC800]" />
                    </div>
                    <span className="text-[11px] font-extrabold text-[#AFAFAF]">Gold</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-25">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0F0F0] text-[#AFAFAF]">
                      <Trophy className="h-6 w-6 text-[#1CB0F6]" />
                    </div>
                    <span className="text-[11px] font-extrabold text-[#AFAFAF]">Diamond</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* League Banner Header */}
            <div className="rounded-3xl border-2 border-[#FFC800]/40 bg-gradient-to-b from-[#FFF9E6] to-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFC800] text-white shadow-md shadow-[#FFC800]/30">
                    <Trophy className="h-9 w-9" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#FFC800]">
                      Current League
                    </span>
                    <h1 className="text-2xl font-extrabold text-[#4B4B4B]">
                      {data.league}
                    </h1>
                    <p className="text-xs font-bold text-[#777777]">
                      Top {data.promotionZoneCutoff} advance to the Silver League
                    </p>
                  </div>
                </div>

                {/* Countdown Badge */}
                <div className="flex items-center gap-1.5 rounded-2xl border-2 border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-extrabold text-[#777777]">
                  <Clock className="h-4 w-4 text-[#FF9600]" />
                  <span>{data.daysRemaining}d left</span>
                </div>
              </div>
            </div>

            {/* Standings List */}
            <div className="mt-6 rounded-3xl border-2 border-[#E5E5E5] bg-white shadow-sm overflow-hidden">
          <div className="divide-y-2 divide-[#E5E5E5]">
            {data.leaderboard.map((player) => {
              const isFirst = player.rank === 1;
              const isSecond = player.rank === 2;
              const isThird = player.rank === 3;
              const isPromotionBoundary =
                player.rank === data.promotionZoneCutoff;

              return (
                <div key={player.id}>
                  <div
                    className={`flex items-center justify-between px-5 py-3.5 transition-colors ${
                      player.isCurrentUser
                        ? "bg-[#DDF4FF]/80 font-bold border-l-4 border-l-[#1CB0F6]"
                        : "hover:bg-[#FAFAFA]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Number Badge */}
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                          isFirst
                            ? "bg-[#FFC800] text-white shadow-sm"
                            : isSecond
                            ? "bg-[#C0C0C0] text-white"
                            : isThird
                            ? "bg-[#CD7F32] text-white"
                            : "text-[#AFAFAF]"
                        }`}
                      >
                        {player.rank}
                      </span>

                      {/* Avatar Circle */}
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F0F0F0] font-extrabold text-[#777777]">
                        <span>{player.name.charAt(0).toUpperCase()}</span>
                        {player.isCurrentUser && userStatus && (
                          <span
                            className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] shadow-xs border border-[#E5E5E5]"
                            title="Your current status"
                          >
                            {userStatus}
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-extrabold ${
                              player.isCurrentUser
                                ? "text-[#1899D6]"
                                : "text-[#4B4B4B]"
                            }`}
                          >
                            {player.name}
                          </span>
                          {player.isCurrentUser && userStatus && (
                            <span className="text-sm" title="Status">
                              {userStatus}
                            </span>
                          )}
                          {player.isCurrentUser && (
                            <span className="rounded-md bg-[#1CB0F6] px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-white">
                              You
                            </span>
                          )}
                        </div>
                        {player.currentStreak > 0 && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-[#FF9600]">
                            <Flame className="h-3 w-3 fill-[#FF9600]" />
                            <span>{player.currentStreak} day streak</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* XP Score */}
                    <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#777777]">
                      <Zap className="h-4 w-4 fill-[#FFC800] text-[#FFC800]" />
                      <span>{player.totalXp} XP</span>
                    </div>
                  </div>

                  {/* Promotion Zone Divider Line */}
                  {isPromotionBoundary && (
                    <div className="flex items-center justify-center gap-2 bg-[#E8FAD4] py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#58CC02]">
                      <ArrowUp className="h-4 w-4 stroke-[3]" />
                      <span>Promotion Zone</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    )}
  </main>

      {/* Right Column (Desktop Sticky with HUD pills and Set your status) */}
      <RightSidebar
        currentStreak={stats?.currentStreak ?? 0}
        totalXp={stats?.totalXp ?? 0}
        completedLessonsCount={completedLessonsCount}
        signedIn={stats?.signedIn ?? false}
        hearts={stats?.hearts ?? 5}
        showSetStatus={!isLocked}
        activeStatus={userStatus}
        onSetStatus={handleSetStatus}
        userName={stats?.signedIn ? "You" : "Gemini"}
      />
    </div>
  );
}

export default function LeaderboardPage() {
  const { hasConvex } = useAppConfig();

  if (!hasConvex) {
    return <ConfigRequired missing="NEXT_PUBLIC_CONVEX_URL" />;
  }

  return (
    <ErrorBoundary>
      <LeaderboardInner />
    </ErrorBoundary>
  );
}
