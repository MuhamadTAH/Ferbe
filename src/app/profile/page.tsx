"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import {
  Flame,
  Zap,
  Trophy,
  Calendar,
  Users,
  GraduationCap,
  Shield,
  Settings,
  Sparkles,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired, ErrorBoundary } from "@/components/states/ScreenState";
import { RightSidebar } from "@/components/learn/RightSidebar";
import { FriendsSidebarCard } from "@/components/profile/FriendsSidebarCard";
import {
  StatusFlair,
  resolveFlair,
  readStoredUserStatus,
  writeStoredUserStatus,
  STATUS_CHANGE_EVENT,
  TIER_CONFIG,
  UserStatusState,
} from "@/components/profile/statusFlairs";
import { AvatarWithFlair } from "@/components/profile/AvatarWithFlair";
import { ProfileStatusModal } from "@/components/profile/ProfileStatusModal";

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
  stats: Stats;
  onOpenSettings?: () => void;
}

function ProfileHeaderDisplay({
  displayName,
  username,
  avatarUrl,
  stats,
  onOpenSettings,
}: HeaderDisplayProps) {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [storedStatus, setStoredStatus] = useState<UserStatusState>(() =>
    readStoredUserStatus()
  );
  const setUserStatusMutation = useMutation(api.curriculum.setUserStatus);

  useEffect(() => {
    function handleSync() {
      setStoredStatus(readStoredUserStatus());
    }
    window.addEventListener(STATUS_CHANGE_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(STATUS_CHANGE_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const effectiveFlair =
    storedStatus.flair || resolveFlair(stats.activeStatus, false);
  const effectiveStatusText = storedStatus.statusText;
  const tierConfig = effectiveFlair ? TIER_CONFIG[effectiveFlair.tier] : null;

  const handleSaveStatus = async (
    flair: StatusFlair | null,
    text: string | null
  ) => {
    try {
      await setUserStatusMutation({
        status: text || flair?.emoji || null,
      });
    } catch {}
  };

  return (
    <div className="rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-6 shadow-sm">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        {/* Avatar with active flair ring */}
        <AvatarWithFlair
          displayName={displayName}
          avatarUrl={avatarUrl}
          flair={effectiveFlair}
          size="xl"
          interactive
          onClick={() => setIsStatusModalOpen(true)}
        />

        {/* Profile Info */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-extrabold text-[#4B4B4B] dark:text-white">
              {displayName}
            </h1>
          </div>
          <p className="text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]">
            @{username}
          </p>

          {/* Active Status Flair Pill & Edit Status Button */}
          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {effectiveFlair && (
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(true)}
                title="Click to edit your Kurdish flair"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F7F7] px-3 py-1.5 transition-all hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#202F36] dark:hover:border-[#3BC0F8] cursor-pointer"
              >
                <span className="text-base select-none">{effectiveFlair.emoji}</span>
                <span className="text-xs font-extrabold text-[#4B4B4B] dark:text-white">
                  {effectiveFlair.labelEn}
                </span>
                <span className="text-xs font-bold text-[#1899D6] dark:text-[#3BC0F8]">
                  ({effectiveFlair.labelKu})
                </span>
                {tierConfig && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${tierConfig.badgeBg} ${tierConfig.badgeText}`}
                  >
                    {tierConfig.nameEn} · {tierConfig.nameKu}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsStatusModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#777777] shadow-2xs transition-all hover:border-[#1CB0F6] hover:bg-[#F7F7F7] hover:text-[#1CB0F6] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#8495A0] dark:hover:border-[#3BC0F8] dark:hover:bg-[#202F36] dark:hover:text-white cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FF9600]" />
              <span>{effectiveFlair ? "Edit Status" : "Set Status & Flair"}</span>
            </button>
          </div>

          {/* Custom Status Quote */}
          {effectiveStatusText && (
            <div className="mt-2.5 flex items-center justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E5E5] bg-[#F7F7F7] px-3 py-1 text-xs font-bold italic text-[#555555] dark:border-[#37464F] dark:bg-[#202F36] dark:text-[#D1D5DB]">
                &ldquo;{effectiveStatusText}&rdquo;
              </span>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#777777] dark:text-[#8495A0] sm:justify-start">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-[#AFAFAF] dark:text-[#52656D]" />
              <span>Joined September 2026</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-[#AFAFAF] dark:text-[#52656D]" />
              <span>0 Following · 0 Followers</span>
            </span>
          </div>

          {/* Language Tag */}
          <div className="mt-3 flex items-center justify-center gap-2 sm:justify-start">
            <span className="flex h-3.5 w-5 flex-col overflow-hidden rounded-[2px] border border-black/10">
              <span className="h-1/3 w-full bg-[#ED1C24]" />
              <span className="flex h-1/3 w-full bg-white flex items-center justify-center">
                <span className="h-1 w-1 rounded-full bg-[#FFD700]" />
              </span>
              <span className="h-1/3 w-full bg-[#278E43]" />
            </span>
            <span className="text-xs font-extrabold text-[#4B4B4B] dark:text-white">
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
              className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#E5E5E5] dark:border-[#37464F] text-[#777777] dark:text-[#8495A0] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] hover:text-[#4B4B4B] dark:hover:text-white transition-colors cursor-pointer"
              title="Account Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Status & Flair Modal */}
      <ProfileStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentFlairId={effectiveFlair?.id ?? null}
        currentStatusText={effectiveStatusText}
        userName={displayName}
        avatarUrl={avatarUrl}
        onSave={handleSaveStatus}
      />
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
      stats={stats}
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
      stats={stats}
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
          <h2 className="text-xl font-extrabold text-[#4B4B4B] dark:text-white">Statistics</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {/* Day Streak */}
            <div className="flex items-center gap-3.5 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4E5] dark:bg-[#341F05] text-[#FF9600]">
                <Flame className="h-6 w-6 fill-[#FF9600]" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#4B4B4B] dark:text-white">
                  {stats.currentStreak}
                </span>
                <p className="text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]">Day streak</p>
              </div>
            </div>

            {/* Total XP */}
            <div className="flex items-center gap-3.5 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF9E6] dark:bg-[#342805] text-[#FFC800]">
                <Zap className="h-6 w-6 fill-[#FFC800]" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#4B4B4B] dark:text-white">
                  {stats.totalXp}
                </span>
                <p className="text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]">Total XP</p>
              </div>
            </div>

            {/* Current League */}
            <div className="flex items-center gap-3.5 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4E5] dark:bg-[#341F05] text-[#CD7F32]">
                <Shield className="h-6 w-6 fill-[#CD7F32]" />
              </div>
              <div>
                <span className="text-base font-extrabold text-[#4B4B4B] dark:text-white">
                  Bronze
                </span>
                <p className="text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]">Current league</p>
              </div>
            </div>

            {/* Top 3 Finishes */}
            <div className="flex items-center gap-3.5 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF9E6] dark:bg-[#342805] text-[#FFC800]">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-[#4B4B4B] dark:text-white">0</span>
                <p className="text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]">Top 3 finishes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="mt-8 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#4B4B4B] dark:text-white">
              Achievements
            </h2>
            <span className="text-xs font-extrabold text-[#1CB0F6] dark:text-[#3BC0F8]">
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
                  className="flex items-center gap-4 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-5 shadow-sm"
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.bg} ${item.color}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-[#4B4B4B] dark:text-white">
                        {item.title}
                      </h3>
                      <span className="text-[11px] font-extrabold uppercase text-[#AFAFAF] dark:text-[#8495A0]">
                        Level {item.level}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-[#777777] dark:text-[#8495A0]">
                      {item.description}
                    </p>

                    {/* Progress */}
                    <div className="mt-2.5">
                      <div className="flex justify-between text-[11px] font-extrabold text-[#AFAFAF] dark:text-[#8495A0]">
                        <span>
                          {Math.min(item.current, item.target)} / {item.target}
                        </span>
                        <span>{isUnlocked ? "COMPLETED" : `${Math.floor((Math.min(item.current, item.target) / item.target) * 100)}%`}</span>
                      </div>
                      <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-[#E5E5E5] dark:bg-[#37464F]">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${item.barColor}`}
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
        showSetStatus={true}
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
