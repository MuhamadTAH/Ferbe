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
  Compass,
  X,
} from "lucide-react";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { PushButton } from "@/components/duo/PushButton";
import { QuestChest } from "@/components/duo/QuestChest";

export const STATUS_OPTIONS = [
  { emoji: "⚡", label: "Charged" },
  { emoji: "🔥", label: "On fire" },
  { emoji: "☕", label: "Caffeinated" },
  { emoji: "🧠", label: "Big brain" },
  { emoji: "👑", label: "Champion" },
  { emoji: "💎", label: "Flawless" },
  { emoji: "🚀", label: "Unstoppable" },
  { emoji: "🎯", label: "Laser focused" },
  { emoji: "📖", label: "Scholar" },
  { emoji: "🦁", label: "Lionhearted" },
  { emoji: "🌟", label: "Superstar" },
  { emoji: "🕶️", label: "Cool" },
];

interface RightSidebarProps {
  currentStreak: number;
  totalXp: number;
  completedLessonsCount: number;
  signedIn: boolean;
  hearts?: number;
  gems?: number;
  showSetStatus?: boolean;
  activeStatus?: string | null;
  onSetStatus?: (status: string | null) => void;
  userName?: string;
  customCard?: React.ReactNode;
}

export function RightSidebar({
  currentStreak,
  totalXp,
  completedLessonsCount,
  signedIn,
  hearts = 5,
  gems,
  showSetStatus = false,
  activeStatus = null,
  onSetStatus,
  userName = "Gemini",
  customCard,
}: RightSidebarProps) {
  const { currentCourse, activeCourseSlug, courses, selectCourse } = useActiveCourse();
  const [activePopover, setActivePopover] = useState<
    "flag" | "streak" | "hearts" | null
  >(null);
  const [showFriendStreaksModal, setShowFriendStreaksModal] = useState(false);
  const [showStreakSocietyModal, setShowStreakSocietyModal] = useState(false);
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
          {/* Active Course Flag Pill */}
          <button
            type="button"
            onClick={() =>
              setActivePopover(activePopover === "flag" ? null : "flag")
            }
            className={`flex items-center gap-2 rounded-xl border-2 px-2.5 py-1 text-xs font-extrabold transition-all cursor-pointer ${
              activePopover === "flag"
                ? "border-[#1CB0F6] bg-[#DDF4FF] dark:bg-[#1C3B4E] text-[#1899D6] dark:text-[#3BC0F8]"
                : "border-[#E5E5E5] dark:border-[#37464F] text-[#4B4B4B] dark:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#202F36]"
            }`}
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
          </button>

          {/* Streak Pill */}
          <button
            type="button"
            onClick={() =>
              setActivePopover(activePopover === "streak" ? null : "streak")
            }
            className={`flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-extrabold transition-all cursor-pointer ${
              activePopover === "streak"
                ? "bg-[#FFF4E5] dark:bg-[#341F05] text-[#FF9600] ring-2 ring-[#FF9600]/30"
                : "text-[#FF9600] hover:bg-[#FFF4E5] dark:hover:bg-[#341F05]"
            }`}
            title="Day Streak"
          >
            <Flame className="h-5 w-5 fill-[#FF9600] text-[#FF9600]" />
            <span>{currentStreak}</span>
          </button>

          {/* Gems Pill (Direct Link to Shop) */}
          <Link
            href="/shop"
            className="flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-extrabold text-[#1CB0F6] transition-colors hover:bg-[#DDF4FF] dark:hover:bg-[#1C3B4E]"
            title="💎 Gems · Visit Shop"
          >
            <span className="text-sm">💎</span>
            <span>{gems ?? (500 + totalXp)}</span>
          </Link>

          {/* Hearts Pill */}
          <button
            type="button"
            onClick={() =>
              setActivePopover(activePopover === "hearts" ? null : "hearts")
            }
            className={`flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-extrabold transition-all cursor-pointer ${
              activePopover === "hearts"
                ? "bg-[#FFDFDF] dark:bg-[#3E1C1C] text-[#FF4B4B] ring-2 ring-[#FF4B4B]/30"
                : "text-[#FF4B4B] hover:bg-[#FFDFDF] dark:hover:bg-[#3E1C1C]"
            }`}
            title="Hearts remaining"
          >
            <Heart className="h-5 w-5 fill-[#FF4B4B] text-[#FF4B4B]" />
            <span>{hearts}</span>
          </button>
        </div>

        {/* 1. Course Flag Popover */}
        {activePopover === "flag" && (
          <div className="absolute left-0 top-full mt-2 w-72 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-4 shadow-xl animate-in zoom-in-95 duration-150">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#AFAFAF] dark:text-[#8495A0]">
              My Courses
            </p>
            <div className="mt-2.5 flex flex-col gap-2">
              {courses.map((course) => {
                const isSelected = course.slug === activeCourseSlug;
                return (
                  <button
                    key={course.slug}
                    type="button"
                    onClick={() => {
                      selectCourse(course.slug);
                      setActivePopover(null);
                    }}
                    className={`flex items-center justify-between rounded-2xl border-2 p-2.5 transition-all text-left cursor-pointer ${
                      isSelected
                        ? "border-[#58CC02] bg-[#E8FAD4]/40 dark:bg-[#1E3B20]"
                        : "border-[#E5E5E5] dark:border-[#37464F] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {course.flagType === "uk" ? (
                        <svg
                          className="h-5 w-7 shrink-0 overflow-hidden rounded-[3px] border border-black/10 shadow-xs"
                          viewBox="0 0 60 36"
                        >
                          <path d="M0,0 v36 h60 v-36 z" fill="#012169" />
                          <path d="M0,0 L60,36 M60,0 L0,36" stroke="#ffffff" strokeWidth="7" />
                          <path d="M0,0 L60,36 M60,0 L0,36" stroke="#C8102E" strokeWidth="4" />
                          <path d="M30,0 v36 M0,18 h60" stroke="#ffffff" strokeWidth="11" />
                          <path d="M30,0 v36 M0,18 h60" stroke="#C8102E" strokeWidth="7" />
                        </svg>
                      ) : (
                        <span className="flex h-5 w-7 flex-col overflow-hidden rounded-[3px] border border-black/10">
                          <span className="h-1/3 w-full bg-[#ED1C24]" />
                          <span className="flex h-1/3 w-full items-center justify-center bg-white">
                            <span className="h-1 w-1 rounded-full bg-[#FFD700]" />
                          </span>
                          <span className="h-1/3 w-full bg-[#278E43]" />
                        </span>
                      )}
                      <div>
                        <span className="block text-xs font-extrabold text-[#4B4B4B] dark:text-white">
                          {course.title}
                        </span>
                        <span className="block text-[10px] font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                          {course.nativeTitle}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#58CC02] text-white">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <Link href="/courses" className="block mt-2">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-2xl p-2.5 text-xs font-extrabold text-[#1CB0F6] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add a new course</span>
              </button>
            </Link>

            <Link href="/sections" className="block mt-1">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-2xl p-2.5 text-xs font-extrabold text-[#777777] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
              >
                <Compass className="h-4 w-4" />
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
              <button
                type="button"
                onClick={() => {
                  setActivePopover(null);
                  setShowFriendStreaksModal(true);
                }}
                className="mt-2 w-full rounded-xl border border-[#E5E5E5] py-1.5 text-[11px] font-extrabold uppercase text-[#1CB0F6] hover:bg-[#F7F7F7] transition-colors cursor-pointer"
              >
                View List
              </button>
            </div>

            {/* Streak Society Teaser */}
            <button
              type="button"
              onClick={() => {
                setActivePopover(null);
                setShowStreakSocietyModal(true);
              }}
              className="mt-3 w-full rounded-2xl bg-gradient-to-br from-[#FFF4E5] to-[#FFE2BF] p-3 text-left text-[#B35300] hover:opacity-95 transition-opacity cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold">Streak Society</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#B35300]">
                  View More →
                </span>
              </div>
              <p className="mt-0.5 text-[11px] font-medium leading-relaxed">
                Reach a 7 day streak to join the Streak Society and unlock exclusive Kurdish avatars!
              </p>
            </button>
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

      {/* 1. Set Your Status Card (Duolingo authentic on Leaderboard / Profile) OR Unlock Leaderboards Card */}
      {showSetStatus ? (
        <div className="rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#4B4B4B] dark:text-white">
              Set your status
            </h3>
            {activeStatus && (
              <button
                type="button"
                onClick={() => onSetStatus?.(null)}
                className="text-xs font-extrabold uppercase tracking-wide text-[#AFAFAF] hover:text-[#EA2B2B] transition-colors cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Current Avatar with Status Badge */}
          <div className="flex items-center gap-3.5 mb-4 p-2.5 rounded-2xl bg-[#F7F7F7] dark:bg-[#202F36]">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1CB0F6] text-lg font-extrabold text-white shadow-xs">
              <span>{userName.charAt(0).toUpperCase()}</span>
              {activeStatus && (
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-[#131F24] text-xs shadow-md border border-[#E5E5E5] dark:border-[#37464F]">
                  {activeStatus}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#4B4B4B] dark:text-white">
                {activeStatus ? "Current Status" : "No status set"}
              </p>
              <p className="text-[11px] font-bold text-[#777777] dark:text-[#8495A0]">
                {activeStatus
                  ? STATUS_OPTIONS.find((s) => s.emoji === activeStatus)?.label
                  : "Pick an emoji below to show how you feel!"}
              </p>
            </div>
          </div>

          {/* Grid of 12 Status Emoji Badges */}
          <div className="grid grid-cols-6 gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.emoji}
                type="button"
                onClick={() => onSetStatus?.(opt.emoji)}
                title={opt.label}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 text-lg transition-transform cursor-pointer hover:scale-110 active:scale-95 ${
                  activeStatus === opt.emoji
                    ? "border-[#1CB0F6] bg-[#DDF4FF] dark:bg-[#1C3B4E] shadow-xs ring-2 ring-[#1CB0F6]/30"
                    : "border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36]"
                }`}
              >
                {opt.emoji}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#4B4B4B] dark:text-white">
              Unlock Leaderboards!
            </h3>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFDFE0]/40 dark:bg-[#3E1C1C] text-[#FF4B4B]">
              <Trophy className="h-5 w-5 text-[#FFC800]" />
            </div>
          </div>
          <p className="text-xs font-bold leading-relaxed text-[#777777] dark:text-[#8495A0]">
            {lessonsToUnlockLeaderboard > 0
              ? `Complete ${lessonsToUnlockLeaderboard} more lesson${
                  lessonsToUnlockLeaderboard === 1 ? "" : "s"
                } to start competing in the Bronze League!`
              : "Leaderboards Unlocked! You are now competing in the Bronze League."}
          </p>

          <div className="mt-3.5">
            <div className="flex justify-between text-[11px] font-extrabold text-[#AFAFAF] dark:text-[#8495A0]">
              <span>Bronze League Progress</span>
              <span>{Math.min(3, completedLessonsCount)} / 3</span>
            </div>
            <div className="mt-1.5 h-3.5 w-full overflow-hidden rounded-full bg-[#E5E5E5] dark:bg-[#37464F]">
              <div
                className="h-full rounded-full bg-[#FFC800] transition-all duration-300"
                style={{
                  width: `${Math.min(100, (completedLessonsCount / 3) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Optional Custom Card (e.g. Friends Card on Profile) */}
      {customCard}

      {/* 2. Daily Quests Card */}
      <div className="rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#4B4B4B] dark:text-white">
            Daily Quests
          </h3>
          <Link
            href="/quests"
            className="text-xs font-extrabold uppercase tracking-wide text-[#1CB0F6] dark:text-[#3BC0F8] hover:underline cursor-pointer"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="flex flex-col gap-3.5">
          {/* Quest 1: Earn 10 XP */}
          <Link href="/quests" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF9E6] dark:bg-[#342805] text-[#FFC800]">
              <Zap className="h-5 w-5 fill-[#FFC800]" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-extrabold text-[#4B4B4B] dark:text-white">
                <span>Earn 10 XP</span>
                <span className={xpQuestDone ? "text-[#58CC02]" : "text-[#777777] dark:text-[#8495A0]"}>
                  {currentXpProgress} / {xpQuestTarget}
                </span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-[#E5E5E5] dark:bg-[#37464F]">
                <div
                  className="h-full rounded-full bg-[#FFC800] transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (currentXpProgress / xpQuestTarget) * 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="shrink-0 transition-transform group-hover:scale-105">
              <QuestChest isOpen={xpQuestDone} size={30} />
            </div>
          </Link>

          {/* Quest 2: Spend 5 minutes learning */}
          <Link href="/quests" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DDF4FF] dark:bg-[#1C3B4E] text-[#1CB0F6]">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-extrabold text-[#4B4B4B] dark:text-white">
                <span>Spend 5 mins</span>
                <span className="text-[#58CC02]">5 / 5</span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-[#E5E5E5] dark:bg-[#37464F]">
                <div className="h-full w-full rounded-full bg-[#1CB0F6]" />
              </div>
            </div>
            <div className="shrink-0 transition-transform group-hover:scale-105">
              <QuestChest isOpen size={30} />
            </div>
          </Link>

          {/* Quest 3: 80% accuracy */}
          <Link href="/quests" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8FAD4] dark:bg-[#1E3B20] text-[#58CC02]">
              <Target className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-extrabold text-[#4B4B4B] dark:text-white">
                <span>Score 80%+</span>
                <span className={completedLessonsCount > 0 ? "text-[#58CC02]" : "text-[#777777] dark:text-[#8495A0]"}>
                  {completedLessonsCount > 0 ? "1 / 1" : "0 / 1"}
                </span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-[#E5E5E5] dark:bg-[#37464F]">
                <div
                  className="h-full rounded-full bg-[#58CC02] transition-all"
                  style={{
                    width: completedLessonsCount > 0 ? "100%" : "0%",
                  }}
                />
              </div>
            </div>
            <div className="shrink-0 transition-transform group-hover:scale-105">
              <QuestChest isOpen={completedLessonsCount > 0} size={30} />
            </div>
          </Link>

          {/* Quest 4: Daily streak */}
          <Link href="/quests" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF4E5] dark:bg-[#341F05] text-[#FF9600]">
              <Flame className="h-5 w-5 fill-[#FF9600]" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-extrabold text-[#4B4B4B] dark:text-white">
                <span>Keep streak</span>
                <span className={currentStreak > 0 ? "text-[#58CC02]" : "text-[#FF9600]"}>
                  {currentStreak > 0 ? `${currentStreak} day` : "0 / 1"}
                </span>
              </div>
              <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-[#E5E5E5] dark:bg-[#37464F]">
                <div
                  className="h-full rounded-full bg-[#FF9600] transition-all"
                  style={{
                    width: currentStreak > 0 ? "100%" : "0%",
                  }}
                />
              </div>
            </div>
            <div className="shrink-0 transition-transform group-hover:scale-105">
              <QuestChest isOpen={currentStreak > 0} size={30} />
            </div>
          </Link>
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
        <div className="rounded-3xl border-2 border-[#1CB0F6] dark:border-[#37464F] bg-[#DDF4FF]/60 dark:bg-[#132A36] p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#1CB0F6] dark:text-[#3BC0F8]" />
            <h4 className="text-sm font-extrabold text-[#1899D6] dark:text-[#3BC0F8]">
              Create a profile to save progress
            </h4>
          </div>
          <p className="text-xs leading-relaxed text-[#4B4B4B] dark:text-[#E2E8F0]">
            Sync your day streak, XP and unlocked Kurdish units across all devices for free.
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            <Link href="/sign-up">
              <PushButton variant="blue" className="w-full py-2.5 text-xs">
                Create a Profile
              </PushButton>
            </Link>
            <Link href="/sign-in">
              <PushButton variant="white" className="w-full py-2 text-xs text-[#777777] dark:text-[#8495A0]">
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
        <span className="text-[#58CC02]">{currentCourse.title}</span>
      </div>

      {/* Friend Streaks Modal */}
      {showFriendStreaksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DDF4FF] dark:bg-[#1C3B4E] text-[#1CB0F6]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#4B4B4B] dark:text-white">
                    Friend Streaks
                  </h3>
                  <p className="text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                    Learn together every day
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFriendStreaksModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-[#AFAFAF] dark:text-[#8495A0] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] hover:text-[#4B4B4B] dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-[#F7F7F7] dark:bg-[#202F36] p-5 text-center">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDF4FF] dark:bg-[#1C3B4E] text-3xl">
                🔥👥
              </div>
              <h4 className="text-sm font-extrabold text-[#4B4B4B] dark:text-white">
                0 Active Friend Streaks
              </h4>
              <p className="mt-1 text-xs font-bold leading-relaxed text-[#777777] dark:text-[#8495A0]">
                Start a shared streak by inviting friends to learn Kurdish! Each person completes a lesson daily to keep the flame alive.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              <Link href="/profile" onClick={() => setShowFriendStreaksModal(false)}>
                <button
                  type="button"
                  className="w-full rounded-2xl border-b-4 border-[#1899D6] bg-[#1CB0F6] py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-[#4FC3F9] active:translate-y-[2px] active:border-b-2 cursor-pointer shadow-sm"
                >
                  Find Friends on Fêrbe
                </button>
              </Link>
              <button
                type="button"
                onClick={() => setShowFriendStreaksModal(false)}
                className="w-full rounded-2xl border-2 border-[#E5E5E5] dark:border-[#37464F] py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#777777] dark:text-[#8495A0] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Streak Society Modal */}
      {showStreakSocietyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-[#FF9600]/40 dark:border-[#37464F] bg-white dark:bg-[#131F24] p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFF4E5] dark:bg-[#341F05] text-[#FF9600]">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#4B4B4B] dark:text-white">
                    Streak Society
                  </h3>
                  <p className="text-xs font-bold text-[#FF9600]">
                    Exclusive VIP Milestone
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStreakSocietyModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-[#AFAFAF] dark:text-[#8495A0] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] hover:text-[#4B4B4B] dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#FFF4E5] to-[#FFE2BF] dark:from-[#341F05] dark:to-[#4A2D07] p-5 text-center text-[#B35300] dark:text-[#FFB35A]">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-3xl bg-white dark:bg-[#202F36] shadow-md text-3xl">
                🔥
              </div>
              <h4 className="text-lg font-extrabold text-[#B35300] dark:text-[#FFB35A]">
                Reach a 7-Day Streak
              </h4>
              <p className="mt-1 text-xs font-medium leading-relaxed">
                Join the dedicated Kurdish learners who have built an unbreakable habit.
              </p>

              {/* Progress to 7 days */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-extrabold text-[#B35300] dark:text-[#FFB35A]">
                  <span>Progress to Society</span>
                  <span>{currentStreak} / 7 Days</span>
                </div>
                <div className="mt-1.5 h-3.5 w-full overflow-hidden rounded-full bg-white/60 dark:bg-black/40 p-0.5">
                  <div
                    className="h-full rounded-full bg-[#FF9600] transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (currentStreak / 7) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Perks list */}
            <div className="mt-5 space-y-2.5 text-xs font-bold text-[#4B4B4B] dark:text-white">
              <div className="flex items-center gap-3 rounded-xl border border-[#E5E5E5] dark:border-[#37464F] p-2.5 bg-white dark:bg-[#202F36]">
                <span className="text-lg">💎</span>
                <div>
                  <div>100 Bonus Gems</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[#E5E5E5] p-2.5">
                <span className="text-lg">🦚</span>
                <div>
                  <div>Exclusive Kurdish Avatar Flair</div>
                  <div className="text-[10px] text-[#AFAFAF]">Golden peacock frame for your profile</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[#E5E5E5] p-2.5">
                <span className="text-lg">🛡️</span>
                <div>
                  <div>Free Emergency Streak Freeze</div>
                  <div className="text-[10px] text-[#AFAFAF]">Automatically protect your streak for 1 day</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Link href="/learn" onClick={() => setShowStreakSocietyModal(false)}>
                <button
                  type="button"
                  className="w-full rounded-2xl border-b-4 border-[#FF7800] bg-[#FF9600] py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-[#FFA526] active:translate-y-[2px] active:border-b-2 cursor-pointer shadow-sm"
                >
                  Keep Learning
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
