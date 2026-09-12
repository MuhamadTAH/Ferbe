"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  Flame,
  Zap,
  Trophy,
  Calendar,
  Users,
  GraduationCap,
  Shield,
  Settings,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired, ErrorBoundary } from "@/components/states/ScreenState";
import { RightSidebar } from "@/components/learn/RightSidebar";
import { FriendsSidebarCard } from "@/components/profile/FriendsSidebarCard";

interface Stats {
  currentStreak: number;
  hearts: number;
  gems?: number;
  totalXp: number;
  activeStatus?: string | null;
  signedIn: boolean;
}

interface HeaderDisplayProps {
  displayName: string;
  username: string;
  avatarUrl?: string;
  onOpenSettings?: () => void;
}

function ProfileHeaderDisplay({ displayName, username, avatarUrl, onOpenSettings }: HeaderDisplayProps) {
  return (
    <div className="rounded-3xl border-2 border-[#E5E5E5] bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div className="relative">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-24 w-24 rounded-full border-4 border-[#58CC02] object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#58CC02] bg-[#E8FAD4] text-3xl font-extrabold text-[#58CC02] shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#58CC02] text-xs text-white">
            ☀️
          </span>
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-extrabold text-[#4B4B4B]">
            {displayName}
          </h1>
          <p className="text-xs font-bold text-[#AFAFAF]">@{username}</p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#777777] sm:justify-start">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#AFAFAF]" />
              <span>Joined September 2026</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-[#AFAFAF]" />
              <span>0 Following · 0 Followers</span>
            </span>
          </div>

          {/* Language Tag */}
          <div className="mt-3 flex items-center justify-center gap-2 sm:justify-start">
            <span className="flex h-3.5 w-5 flex-col overflow-hidden rounded-[2px] border border-black/10">
              <span className="h-1/3 w-full bg-[#ED1C24]" />
              <span className="h-1/3 w-full bg-white flex items-center justify-center">
                <span className="h-1 w-1 rounded-full bg-[#FFD700]" />
              </span>
              <span className="h-1/3 w-full bg-[#278E43]" />
            </span>
            <span className="text-xs font-extrabold text-[#4B4B4B]">
              Kurdish (Sorani) Course
            </span>
          </div>
        </div>

        {/* Settings button */}
        {onOpenSettings && (
          <div className="sm:ml-auto">
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#E5E5E5] text-[#777777] hover:bg-[#F7F7F7] hover:text-[#4B4B4B] transition-colors cursor-pointer"
              title="Account Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ClerkUserProfileHeader({ stats }: { stats: Stats }) {
  const { user } = useUser();
  const clerk = useClerk();
  const displayName =
    user?.fullName || user?.firstName || (stats.signedIn ? "Learner" : "Guest Learner");
  const username =
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "guest_learner";
  const avatarUrl = user?.imageUrl;

  return (
    <ProfileHeaderDisplay
      displayName={displayName}
      username={username}
      avatarUrl={avatarUrl}
      onOpenSettings={() => clerk.openUserProfile()}
    />
  );
}

function DefaultUserProfileHeader({ stats }: { stats: Stats }) {
  const displayName = stats.signedIn ? "Learner" : "Guest Learner";
  const username = stats.signedIn ? "learner" : "guest_learner";

  return (
    <ProfileHeaderDisplay
      displayName={displayName}
      username={username}
      avatarUrl={undefined}
    />
  );
}

function ProfileInner() {
  const { hasClerk } = useAppConfig();
  const stats = useQuery(api.curriculum.getMyStats, {}) as Stats | undefined;

  if (stats === undefined) {
    return (
      <div className="py-24 text-center font-extrabold text-[#AFAFAF]">
        Loading profile...
      </div>
    );
  }

  const achievements = [
    {
      id: "wildfire",
      title: "Wildfire",
      description: "Reach a 3-day streak",
      current: stats.currentStreak,
      target: 3,
      level: 1,
      icon: Flame,
      color: "text-[#FF9600]",
      bg: "bg-[#FFF4E5]",
      barColor: "bg-[#FF9600]",
    },
    {
      id: "sage",
      title: "Sage",
      description: "Earn 100 XP in Kurdish lessons",
      current: stats.totalXp,
      target: 100,
      level: 1,
      icon: Zap,
      color: "text-[#FFC800]",
      bg: "bg-[#FFF9E6]",
      barColor: "bg-[#FFC800]",
    },
    {
      id: "scholar",
      title: "Scholar",
      description: "Learn 20 Kurdish Sorani vocabulary words",
      current: Math.min(20, Math.floor(stats.totalXp / 10)),
      target: 20,
      level: 1,
      icon: GraduationCap,
      color: "text-[#58CC02]",
      bg: "bg-[#E8FAD4]",
      barColor: "bg-[#58CC02]",
    },
    {
      id: "champion",
      title: "Champion",
      description: "Finish in the top 3 of a leaderboard",
      current: stats.totalXp >= 200 ? 1 : 0,
      target: 1,
      level: 1,
      icon: Trophy,
      color: "text-[#1CB0F6]",
      bg: "bg-[#DDF4FF]",
      barColor: "bg-[#1CB0F6]",
    },
  ];

  return (
    <div className="mx-auto flex max-w-5xl justify-center gap-10 px-4 py-8">
      {/* Main Column */}
      <main className="w-full max-w-xl">
        {/* User Hero Header Card */}
        {hasClerk ? (
          <ClerkUserProfileHeader stats={stats} />
        ) : (
          <DefaultUserProfileHeader stats={stats} />
        )}

        {/* Statistics Section */}
        <section className="mt-8">
          <h2 className="text-xl font-extrabold text-[#4B4B4B]">Statistics</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Day Streak */}
            <div className="flex items-center gap-3.5 rounded-3xl border-2 border-[#E5E5E5] bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4E5] text-[#FF9600]">
                <Flame className="h-6 w-6 fill-[#FF9600]" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#4B4B4B]">
                  {stats.currentStreak}
                </span>
                <p className="text-xs font-bold text-[#AFAFAF]">Day streak</p>
              </div>
            </div>

            {/* Total XP */}
            <div className="flex items-center gap-3.5 rounded-3xl border-2 border-[#E5E5E5] bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF9E6] text-[#FFC800]">
                <Zap className="h-6 w-6 fill-[#FFC800]" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#4B4B4B]">
                  {stats.totalXp}
                </span>
                <p className="text-xs font-bold text-[#AFAFAF]">Total XP</p>
              </div>
            </div>

            {/* Current League */}
            <div className="flex items-center gap-3.5 rounded-3xl border-2 border-[#E5E5E5] bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4E5] text-[#CD7F32]">
                <Shield className="h-6 w-6 fill-[#CD7F32]" />
              </div>
              <div>
                <span className="text-base font-extrabold text-[#4B4B4B]">
                  Bronze
                </span>
                <p className="text-xs font-bold text-[#AFAFAF]">Current league</p>
              </div>
            </div>

            {/* Top 3 Finishes */}
            <div className="flex items-center gap-3.5 rounded-3xl border-2 border-[#E5E5E5] bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF9E6] text-[#FFC800]">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#4B4B4B]">0</span>
                <p className="text-xs font-bold text-[#AFAFAF]">Top 3 finishes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="mt-8 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#4B4B4B]">
              Achievements
            </h2>
            <span className="text-xs font-extrabold text-[#1CB0F6]">
              View All
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3.5">
            {achievements.map((item) => {
              const Icon = item.icon;
              const isUnlocked = item.current >= item.target;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-3xl border-2 border-[#E5E5E5] bg-white p-5 shadow-sm"
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.bg} ${item.color}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-[#4B4B4B]">
                        {item.title}
                      </h3>
                      <span className="text-[11px] font-extrabold uppercase text-[#AFAFAF]">
                        Level {item.level}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#777777]">
                      {item.description}
                    </p>

                    {/* Progress */}
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[11px] font-extrabold text-[#AFAFAF]">
                        <span>
                          {Math.min(item.current, item.target)} / {item.target}
                        </span>
                        {isUnlocked && (
                          <span className="text-[#58CC02]">Completed</span>
                        )}
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                        <div
                          className={`h-full rounded-full transition-all ${item.barColor}`}
                          style={{
                            width: `${Math.min(
                              100,
                              (item.current / item.target) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Right Column (Desktop Sticky with interactive HUD pills + Duolingo Friends Card) */}
      <RightSidebar
        currentStreak={stats.currentStreak}
        totalXp={stats.totalXp}
        completedLessonsCount={Math.floor(stats.totalXp / 10)}
        signedIn={stats.signedIn}
        hearts={stats.hearts}
        gems={stats.gems}
        activeStatus={stats.activeStatus}
        customCard={<FriendsSidebarCard />}
      />
    </div>
  );
}

export default function ProfilePage() {
  const { hasConvex } = useAppConfig();

  if (!hasConvex) {
    return <ConfigRequired missing="NEXT_PUBLIC_CONVEX_URL" />;
  }

  return (
    <ErrorBoundary>
      <ProfileInner />
    </ErrorBoundary>
  );
}
