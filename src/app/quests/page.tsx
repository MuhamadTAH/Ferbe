"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import {
  Target,
  Clock,
  Zap,
  Check,
  Trophy,
  Flame,
  Sparkles,
  Lock,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired, ErrorBoundary } from "@/components/states/ScreenState";
import { RightSidebar } from "@/components/learn/RightSidebar";
import { QuestChest } from "@/components/duo/QuestChest";
import { PushButton } from "@/components/duo/PushButton";
import { TreasureOpeningModal } from "@/components/duo/TreasureOpeningModal";

interface Stats {
  currentStreak: number;
  hearts: number;
  gems?: number;
  totalXp: number;
  signedIn: boolean;
}

function QuestsInner() {
  const stats = useQuery(api.curriculum.getMyStats, {}) as Stats | undefined;
  const dbClaimedQuests = useQuery(api.curriculum.getMyQuests, {}) as string[] | undefined;
  const claimReward = useMutation(api.curriculum.claimQuestReward);
  const [localClaimed, setLocalClaimed] = useState<Set<string>>(new Set());
  const [openingQuest, setOpeningQuest] = useState<{
    id: string;
    title: string;
    xpReward: number;
    gemReward: number;
  } | null>(null);

  const claimedQuests = useMemo(() => {
    const combined = new Set(localClaimed);
    if (dbClaimedQuests) {
      dbClaimedQuests.forEach((q) => combined.add(q));
    }
    return combined;
  }, [localClaimed, dbClaimedQuests]);

  if (stats === undefined) {
    return (
      <div className="py-24 text-center font-extrabold text-[#AFAFAF]">
        Loading quests...
      </div>
    );
  }

  const handleOpenChest = (quest: {
    id: string;
    title: string;
    xpReward: number;
    gemReward: number;
  }) => {
    setOpeningQuest(quest);
  };

  const handleCollectReward = async () => {
    if (!openingQuest) return;
    const { id, xpReward, gemReward } = openingQuest;
    if (!claimedQuests.has(id)) {
      try {
        await claimReward({ questId: id, xpReward, gemReward });
        setLocalClaimed((prev) => new Set(prev).add(id));
      } catch {
        // safe fallback
        setLocalClaimed((prev) => new Set(prev).add(id));
      }
    }
    setOpeningQuest(null);
  };

  const quests = [
    {
      id: "quest-xp",
      title: "Earn 10 XP",
      current: Math.min(10, stats.totalXp),
      target: 10,
      xpReward: 10,
      gemReward: 5,
      icon: Zap,
      iconBg: "bg-[#FFF9E6] text-[#FFC800]",
      barColor: "bg-[#FFC800]",
    },
    {
      id: "quest-time",
      title: "Spend 5 minutes learning",
      current: 5,
      target: 5,
      xpReward: 10,
      gemReward: 5,
      icon: Clock,
      iconBg: "bg-[#DDF4FF] text-[#1CB0F6]",
      barColor: "bg-[#1CB0F6]",
    },
    {
      id: "quest-accuracy",
      title: "Score 80%+ in a lesson",
      current: stats.totalXp > 0 ? 1 : 0,
      target: 1,
      xpReward: 15,
      gemReward: 10,
      icon: Target,
      iconBg: "bg-[#E8FAD4] text-[#58CC02]",
      barColor: "bg-[#58CC02]",
    },
    {
      id: "quest-streak",
      title: "Keep your daily streak alive",
      current: Math.min(1, stats.currentStreak),
      target: 1,
      xpReward: 10,
      gemReward: 5,
      icon: Flame,
      iconBg: "bg-[#FFF4E5] text-[#FF9600]",
      barColor: "bg-[#FF9600]",
    },
  ];

  const totalQuestsCompleted = quests.filter((q) => q.current >= q.target).length;

  return (
    <div className="mx-auto flex max-w-5xl justify-center gap-10 px-4 py-8">
      {/* Main Column */}
      <main className="w-full max-w-xl">
        {/* Monthly Challenge Banner ("Purple Top" authentic to Duolingo) */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#CE82FF] bg-gradient-to-br from-[#7928CA] via-[#8B35D9] to-[#9A46DE] p-6 text-white shadow-xl">
          {/* Decorative background glow circles */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-[#CE82FF]/20 blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs">
                September Challenge
              </span>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-white/90">
                <Clock className="h-4 w-4 text-[#FFD700]" />
                <span>19 days left</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/15 text-white shadow-inner backdrop-blur-sm border border-white/20">
                <Trophy className="h-10 w-10 text-[#FFC800] drop-shadow-md" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">
                  Kurdish Pioneer Badge
                </h2>
                <p className="mt-0.5 text-xs font-bold text-white/80">
                  Complete 30 daily quests this month to earn this exclusive badge
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-5">
              <div className="flex justify-between text-xs font-extrabold">
                <span>Monthly Quest Progress</span>
                <span>{12 + totalQuestsCompleted} / 30</span>
              </div>
              <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-black/25 p-0.5">
                <div
                  className="h-full rounded-full bg-[#58CC02] transition-all duration-300 shadow-sm"
                  style={{
                    width: `${Math.min(100, ((12 + totalQuestsCompleted) / 30) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Quests Header */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#4B4B4B] dark:text-white">
              Daily Quests
            </h2>
            <p className="text-xs font-bold text-[#777777] dark:text-[#8495A0]">
              Quests refresh every day at midnight
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-xl bg-[#F7F7F7] dark:bg-[#202F36] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#777777] dark:text-[#8495A0]">
            <Clock className="h-4 w-4 text-[#AFAFAF] dark:text-[#52656D]" />
            21 hours
          </span>
        </div>

        {/* Quests List */}
        <div className="mt-4 flex flex-col gap-3.5">
          {quests.map((quest) => {
            const Icon = quest.icon;
            const isCompleted = quest.current >= quest.target;
            const isClaimed = claimedQuests.has(quest.id);

            return (
              <div
                key={quest.id}
                className="flex items-center gap-4 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-5 shadow-xs transition-all hover:border-[#CCCCCC] dark:hover:border-[#52656D]"
              >
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${quest.iconBg}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-[#4B4B4B] dark:text-white">
                      {quest.title}
                    </h3>
                  </div>

                  {/* Duolingo Progress Bar + Integrated Chest */}
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-[#E5E5E5] dark:bg-[#37464F]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${quest.barColor}`}
                        style={{
                          width: `${Math.min(
                            100,
                            (quest.current / quest.target) * 100
                          )}%`,
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-[#4B4B4B]">
                        {quest.current} / {quest.target}
                      </span>
                    </div>

                    {/* Chest (Closed when in progress, Animated & glowing when completed, Open when claimed) */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isCompleted) {
                          handleOpenChest(quest);
                        }
                      }}
                      className={`shrink-0 transition-transform ${
                        isCompleted
                          ? "cursor-pointer hover:scale-110 active:scale-95"
                          : "cursor-default opacity-85"
                      }`}
                      title={
                        isCompleted
                          ? isClaimed
                            ? "Quest reward claimed!"
                            : "Quest complete! Click to open chest"
                          : `In progress: ${quest.current} / ${quest.target}`
                      }
                      aria-label={`${quest.title} chest`}
                    >
                      <QuestChest
                        isOpen={isClaimed}
                        animated={isCompleted && !isClaimed}
                        glow={isCompleted && !isClaimed}
                        size={38}
                      />
                    </button>
                  </div>
                </div>

                {/* Claim / Checkmark status indicator */}
                {isClaimed ? (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#58CC02] text-white shadow-xs">
                    <Check className="h-5 w-5 stroke-[3]" />
                  </div>
                ) : isCompleted ? (
                  <button
                    type="button"
                    onClick={() => handleOpenChest(quest)}
                    className="shrink-0 rounded-2xl border-b-4 border-[#46A302] bg-[#58CC02] px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white transition-all hover:bg-[#61E002] active:translate-y-[2px] active:border-b-2 shadow-xs cursor-pointer"
                  >
                    Claim
                  </button>
                ) : null}
              </div>
            );
          })}

          {/* Duolingo "More quests unlock soon" Card */}
          <div className="flex items-center gap-4 rounded-3xl border-2 border-dashed border-[#E5E5E5] bg-[#F7F7F7]/60 p-5 text-[#AFAFAF]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5E5E5]/60 text-[#AFAFAF]">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#777777]">
                More quests unlock soon
              </p>
              <p className="text-xs font-bold text-[#AFAFAF]">
                Keep completing lessons to unlock friends quests and monthly tiers
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Right Column (Desktop Sticky with HUD pills) */}
      <RightSidebar
        currentStreak={stats.currentStreak}
        totalXp={stats.totalXp}
        completedLessonsCount={Math.floor(stats.totalXp / 10)}
        signedIn={stats.signedIn}
        hearts={stats.hearts}
        gems={stats.gems}
      />

      {/* Duolingo 2D Vector Animated Treasure Chest Opening Celebration Modal */}
      {openingQuest && (
        <TreasureOpeningModal
          isOpen={Boolean(openingQuest)}
          onClose={() => setOpeningQuest(null)}
          onCollect={handleCollectReward}
          title="Daily Quest Complete!"
          questTitle={openingQuest.title}
          subtitle="Awesome job reaching your daily goal!"
          xpReward={openingQuest.xpReward}
          gemReward={openingQuest.gemReward}
        />
      )}
    </div>
  );
}

export default function QuestsPage() {
  const { hasConvex } = useAppConfig();

  if (!hasConvex) {
    return <ConfigRequired missing="NEXT_PUBLIC_CONVEX_URL" />;
  }

  return (
    <ErrorBoundary>
      <QuestsInner />
    </ErrorBoundary>
  );
}
