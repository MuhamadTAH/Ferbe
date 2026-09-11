import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Zap,
  Sparkles,
  Check,
  Clock,
  Target,
  Flame,
  Heart,
  Crown,
  Plus,
  Users,
  Infinity as InfinityIcon,
} from "lucide-react";
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
  const [activePopover, setActivePopover] = useState<
    "flag" | "streak" | "hearts" | null
  >(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (hudRef.current && !hudRef.current.contains(event.target as Node)) {
        setActivePopover(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const lessonsToUnlockLeaderboard = Math.max(0, 3 - completedLessonsCount);
  const xpQuestTarget = 10;
  const currentXpProgress = Math.min(xpQuestTarget, totalXp);
  const xpQuestDone = totalXp >= xpQuestTarget;

  return (
    <aside className="sticky top-6 hidden w-84 shrink-0 flex-col gap-5 lg:flex">
      {/* 0. Top HUD Status Pills on Desktop (Duolingo layout with interactive Popovers) */}
      <div ref={hudRef} className="relative z-30 px-1 py-1">
        <div className="flex items-center justify-between">
          {/* Kurdish Flag Pill */}
          <button
            type="button"
            onClick={() =>
              setActivePopover(activePopover === "flag" ? null : "flag")
            }
            className={`flex items-center gap-2 rounded-xl border-2 px-2.5 py-1 text-xs font-extrabold transition-all cursor-pointer ${
              activePopover === "flag"
                ? "border-[#1CB0F6] bg-[#DDF4FF] text-[#1899D6]"
                : "border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7]"
            }`}
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
          </button>

          {/* Streak Pill */}
          <button
            type="button"
            onClick={() =>
              setActivePopover(activePopover === "streak" ? null : "streak")
            }
            className={`flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-extrabold transition-all cursor-pointer ${
              activePopover === "streak"
                ? "bg-[#FFF4E5] text-[#FF9600] ring-2 ring-[#FF9600]/30"
                : "text-[#FF9600] hover:bg-[#FFF4E5]"
            }`}
            title="Day Streak"
          >
            <Flame className="h-5 w-5 fill-[#FF9600] text-[#FF9600]" />
            <span>{currentStreak}</span>
          </button>

          {/* Gems Pill (Direct Link to Shop) */}
          <Link
            href="/shop"
            className="flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-extrabold text-[#1CB0F6] transition-colors hover:bg-[#DDF4FF]"
            title="💎 Gems · Visit Shop"
          >
            <span className="text-sm">💎</span>
            <span>{500 + totalXp}</span>
          </Link>

          {/* Hearts Pill */}
          <button
            type="button"
            onClick={() =>
              setActivePopover(activePopover === "hearts" ? null : "hearts")
            }
            className={`flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-extrabold transition-all cursor-pointer ${
              activePopover === "hearts"
                ? "bg-[#FFDFDF] text-[#FF4B4B] ring-2 ring-[#FF4B4B]/30"
                : "text-[#FF4B4B] hover:bg-[#FFDFDF]"
            }`}
            title="Hearts remaining"
          >
            <Heart className="h-5 w-5 fill-[#FF4B4B] text-[#FF4B4B]" />
            <span>{hearts}</span>
          </button>
        </div>

        {/* 1. Course Flag Popover */}
        {activePopover === "flag" && (
          <div className="absolute left-0 top-full mt-2 w-64 rounded-3xl border-2 border-[#E5E5E5] bg-white p-4 shadow-xl animate-in zoom-in-95 duration-150">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#AFAFAF]">
              My Courses
            </p>
            <div className="mt-3 flex items-center justify-between rounded-2xl border-2 border-[#58CC02] bg-[#E8FAD4]/40 p-2.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-7 flex-col overflow-hidden rounded-[3px] border border-black/10">
                  <span className="h-1/3 w-full bg-[#ED1C24]" />
                  <span className="flex h-1/3 w-full items-center justify-center bg-white">
                    <span className="h-1 w-1 rounded-full bg-[#FFD700]" />
                  </span>
                  <span className="h-1/3 w-full bg-[#278E43]" />
                </span>
                <span className="text-xs font-extrabold text-[#4B4B4B]">
                  Kurdish (Sorani)
                </span>
              </div>
              <Check className="h-4 w-4 text-[#58CC02] stroke-[3]" />
            </div>

            <Link href="/sections" className="block mt-2">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-2xl p-2.5 text-xs font-extrabold text-[#1CB0F6] hover:bg-[#F7F7F7] transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Explore all sections</span>
              </button>
            </Link>
          </div>
        )}

        {/* 2. Streak Panel Popover */}
        {activePopover === "streak" && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 rounded-3xl border-2 border-[#E5E5E5] bg-white p-5 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-extrabold text-[#4B4B4B]">
                  {currentStreak} day streak
                </h4>
                <p className="text-xs font-bold text-[#AFAFAF]">
                  You&apos;ve earned your longest streak ever!
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFF4E5] text-2xl">
                🔥
              </div>
            </div>

            {/* 7-Day Calendar Mini Tracker */}
            <div className="mt-4 flex items-center justify-between gap-1 rounded-2xl bg-[#F7F7F7] p-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-extrabold text-[#AFAFAF]">
                    {d}
                  </span>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-extrabold ${
                      i <= currentStreak
                        ? "bg-[#FF9600] text-white shadow-xs"
                        : "bg-[#E5E5E5] text-[#AFAFAF]"
                    }`}
                  >
                    {i <= currentStreak ? (
                      <Flame className="h-3.5 w-3.5 fill-white" />
                    ) : (
                      "·"
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Friend Streaks Card */}
            <div className="mt-4 rounded-2xl border border-[#E5E5E5] p-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#1CB0F6]" />
                <span className="text-xs font-extrabold text-[#4B4B4B]">
                  Friend Streaks
                </span>
              </div>
              <p className="mt-1 text-[11px] font-bold text-[#AFAFAF]">
                0 active Friend Streaks
              </p>
              <Link href="/profile" className="block mt-2">
                <button
                  type="button"
                  className="w-full rounded-xl border border-[#E5E5E5] py-1.5 text-[11px] font-extrabold uppercase text-[#1CB0F6] hover:bg-[#F7F7F7]"
                >
                  View List
                </button>
              </Link>
            </div>

            {/* Streak Society Teaser */}
            <div className="mt-3 rounded-2xl bg-gradient-to-br from-[#FFF4E5] to-[#FFE2BF] p-3 text-[#B35300]">
              <span className="text-xs font-extrabold">Streak Society</span>
              <p className="mt-0.5 text-[11px] font-medium leading-relaxed">
                Reach a 7 day streak to join the Streak Society and unlock exclusive Kurdish avatars!
              </p>
            </div>
          </div>
        )}

        {/* 3. Hearts Menu Popover */}
        {activePopover === "hearts" && (
          <div className="absolute right-0 top-full mt-2 w-80 rounded-3xl border-2 border-[#E5E5E5] bg-white p-5 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-extrabold text-[#4B4B4B]">Hearts</h4>
                <p className="text-xs font-bold text-[#AFAFAF]">
                  Next heart in 25 minutes
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFDFDF] text-xl">
                ❤️
              </div>
            </div>

            <p className="mt-3 text-xs font-bold text-[#777777]">
              {hearts >= 5
                ? "Full hearts! Keep on learning without worry."
                : `You have ${hearts} heart${hearts === 1 ? "" : "s"} left. Keep going!`}
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              {/* Unlimited Hearts Super Promo */}
              <div className="rounded-2xl border-2 border-[#CE82FF] bg-[#FAF5FF] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#CE82FF]">
                    <InfinityIcon className="h-4 w-4" />
                    <span>Unlimited Hearts</span>
                  </div>
                  <span className="rounded-md bg-[#CE82FF] px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
                    Free Trial
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-bold text-[#777777]">
                  Never run out of hearts with Super Fêrbe.
                </p>
                <Link href="/shop" className="block mt-2">
                  <button
                    type="button"
                    className="w-full rounded-xl border-b-2 border-[#9A46DE] bg-[#CE82FF] py-2 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-[#D996FF]"
                  >
                    Try Super Free
                  </button>
                </Link>
              </div>

              {/* Refill Hearts */}
              <Link href="/shop" className="block">
                <button
                  type="button"
                  className="w-full rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#FF4B4B] hover:bg-[#F7F7F7] active:translate-y-[2px]"
                >
                  Refill Hearts · 💎 350
                </button>
              </Link>

              {/* Free Practice */}
              <Link href="/practice" className="block">
                <button
                  type="button"
                  className="w-full rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6] hover:bg-[#F7F7F7] active:translate-y-[2px]"
                >
                  Practice to Earn Hearts
                </button>
              </Link>
            </div>
          </div>
        )}
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

      {/* 3. Try Super for free (when signed in) OR Guest Profile CTA (when guest) */}
      {signedIn ? (
        <div className="rounded-3xl border-2 border-[#CE82FF] bg-gradient-to-br from-[#1B1B2F] to-[#2E0249] p-5 text-white shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <Crown className="h-5 w-5 text-[#CE82FF]" />
            <h4 className="text-sm font-extrabold text-[#CE82FF]">
              Try Super Fêrbe for free
            </h4>
          </div>
          <p className="text-xs leading-relaxed text-white/80">
            No ads, personalized practice, and unlimited Hearts!
          </p>
          <Link href="/shop" className="block mt-4">
            <button
              type="button"
              className="w-full rounded-2xl border-b-4 border-[#9A46DE] bg-[#CE82FF] py-2.5 text-xs font-extrabold uppercase tracking-wide text-white transition-all hover:bg-[#D996FF] active:translate-y-[2px] active:border-b-2 shadow-sm"
            >
              Try 1 Week Free
            </button>
          </Link>
        </div>
      ) : (
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
