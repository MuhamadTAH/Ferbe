"use client";

import { useQuery } from "convex/react";
import {
  Trophy,
  Clock,
  ArrowUp,
  Zap,
  Flame,
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

  if (data === undefined) {
    return (
      <div className="py-24 text-center font-extrabold text-[#AFAFAF]">
        Loading standings...
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl justify-center gap-10 px-4 py-8">
      {/* Main Column */}
      <main className="w-full max-w-xl">
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
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F0F0F0] font-extrabold text-[#777777]">
                        {player.name.charAt(0).toUpperCase()}
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
      </main>

      {/* Right Column (Desktop Sticky with HUD pills) */}
      <RightSidebar
        currentStreak={stats?.currentStreak ?? 0}
        totalXp={stats?.totalXp ?? 0}
        completedLessonsCount={Math.floor((stats?.totalXp ?? 0) / 10)}
        signedIn={stats?.signedIn ?? false}
        hearts={stats?.hearts ?? 5}
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
