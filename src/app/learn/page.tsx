"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import {
  Check,
  Star,
  Lock,
  BookOpen,
  ChevronRight,
  Flame,
  Zap,
  ArrowUp,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired, ErrorBoundary } from "@/components/states/ScreenState";
import { RightSidebar } from "@/components/learn/RightSidebar";
import { LessonPopover } from "@/components/learn/LessonPopover";
import { UnitGuidebookModal } from "@/components/learn/UnitGuidebookModal";
import { TreasureChestNode } from "@/components/learn/TreasureChestNode";
import { useActiveCourse } from "@/hooks/useActiveCourse";

interface LessonView {
  _id: string;
  title: string;
  order: number;
  xpReward: number;
  isCompleted: boolean;
  bestScore: number | null;
}
interface UnitView {
  _id: string;
  title: string;
  order: number;
  lessons: LessonView[];
}
interface Curriculum {
  course: { _id: string; title: string; slug: string };
  units: UnitView[];
}
interface Stats {
  currentStreak: number;
  hearts: number;
  gems?: number;
  totalXp: number;
  activeStatus?: string | null;
  signedIn: boolean;
}

const ZIGZAG = [0, 48, 80, 48, 0, -48, -80, -48];

function PathPage() {
  const { activeCourseSlug, currentCourse } = useActiveCourse();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [guidebookUnit, setGuidebookUnit] = useState<{
    title: string;
    order: number;
  } | null>(null);
  const [showScrollToCurrent, setShowScrollToCurrent] = useState(false);
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  const setUserStatus = useMutation(api.curriculum.setUserStatus);

  useEffect(() => {
    function handleScroll() {
      setShowScrollToCurrent(window.scrollY > 350);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const curriculum = useQuery(api.curriculum.getCourseCurriculum, {
    courseSlug: activeCourseSlug,
  }) as Curriculum | null | undefined;
  const stats = useQuery(api.curriculum.getMyStats, {}) as Stats | undefined;

  if (curriculum === undefined || stats === undefined) {
    return (
      <div className="py-24 text-center font-extrabold text-[#AFAFAF]">
        Loading your path...
      </div>
    );
  }

  if (curriculum === null) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-24 text-center">
        <h1 className="text-xl font-extrabold text-[#4B4B4B]">
          No curriculum yet
        </h1>
        <p className="mt-2 text-sm text-[#777777]">
          The course content for &quot;{currentCourse.title}&quot; has not been seeded. Run{" "}
          <code className="rounded bg-[#F7F7F7] px-1.5 py-0.5 font-mono text-xs">
            npm run seed
          </code>{" "}
          with the Convex deployment configured.
        </p>
      </div>
    );
  }

  const completedLessonsCount = curriculum.units.reduce(
    (acc, u) => acc + u.lessons.filter((l) => l.isCompleted).length,
    0
  );

  return (
    <div className="mx-auto flex max-w-5xl justify-center gap-10 px-4 py-8">
      {/* Main Path Column */}
      <main className="w-full max-w-xl">
        {curriculum.units.map((unit) => {
          const isUnitCompleted = unit.lessons.every((l) => l.isCompleted);

          return (
            <section key={unit._id} className="mb-16">
              {/* Unit Header Banner with Guidebook Button */}
              <div className="flex items-center justify-between rounded-3xl bg-[#58CC02] px-6 py-5 text-white shadow-[0_4px_0_#46A302]">
                <div>
                  <Link
                    href="/sections"
                    className="group inline-flex items-center gap-1 transition-opacity hover:opacity-90 cursor-pointer"
                  >
                    <span className="text-xs font-extrabold uppercase tracking-wider text-white/80 group-hover:text-white">
                      Section 1, Unit {unit.order}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                  </Link>
                  <h2 className="text-xl font-extrabold">{unit.title}</h2>
                  <p className="mt-0.5 text-xs text-white/90">
                    {currentCourse.slug === "english-from-kurdish"
                      ? "فێربوونی وشە و ڕێزمانی سەرەکی زمانی ئینگلیزی"
                      : "Master essential Kurdish Sorani vocabulary & greetings"}
                  </p>
                </div>
                <Link
                  href={`/guidebook/${unit.order}`}
                  className="flex items-center gap-2 rounded-2xl border-b-4 border-[#3D8F02] bg-[#46A302] px-3.5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:bg-[#4FB703] active:translate-y-[2px] active:border-b-2 shadow-sm cursor-pointer"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Guidebook</span>
                </Link>
              </div>

              {/* Zigzag Learning Path Nodes */}
              <ol className="mt-12 flex flex-col items-center gap-6">
                {unit.lessons.map((lesson, i) => {
                  const previous = i > 0 ? unit.lessons[i - 1] : null;
                  const unlocked = i === 0 || (previous?.isCompleted ?? false);
                  const offset = ZIGZAG[i % ZIGZAG.length];
                  const isDone = lesson.isCompleted;
                  const isPopoverOpen = activeLessonId === lesson._id;

                  return (
                    <li
                      key={lesson._id}
                      style={{ marginLeft: offset }}
                      className="relative flex flex-col items-center"
                    >
                      {/* Animated 'START' badge on current uncompleted active lesson */}
                      {unlocked && !isDone && !isPopoverOpen ? (
                        <button
                          type="button"
                          onClick={() => setActiveLessonId(lesson._id)}
                          className="absolute -top-9 z-10 whitespace-nowrap rounded-xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#58CC02] shadow-sm animate-bounce"
                        >
                          Start
                          <span className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-white dark:border-t-[#131F24]" />
                        </button>
                      ) : null}

                      {/* Mascot Character on Path Side (Duolingo Path Character) */}
                      {i === 1 && (
                        <div className="absolute -right-28 -top-2 hidden sm:flex flex-col items-center select-none animate-in fade-in duration-300">
                          <div className="relative mb-1 rounded-2xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] px-2.5 py-1 text-[11px] font-extrabold text-[#4B4B4B] dark:text-white shadow-xs">
                            <span className="font-kurdish text-xs font-bold text-[#58CC02] kurdish-word">
                              هەر بژی!
                            </span>
                            <span className="ml-1 text-[10px] text-[#AFAFAF] dark:text-[#8495A0]">
                              (Keep going!)
                            </span>
                            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-[#131F24]" />
                          </div>
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#58CC02]/30 bg-gradient-to-br from-[#E8FAD4] to-[#BFF582] dark:from-[#1E3B20] dark:to-[#2A522C] text-3xl shadow-sm transform hover:scale-105 transition-transform cursor-pointer">
                            🦉
                          </div>
                        </div>
                      )}

                      {/* 3D Round Node Button */}
                      {unlocked ? (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveLessonId(
                              isPopoverOpen ? null : lesson._id
                            )
                          }
                          aria-label={lesson.title}
                          className={`flex h-[72px] w-[72px] items-center justify-center rounded-full border-b-[6px] transition-all active:translate-y-[2px] active:border-b-2 ${
                            isDone
                              ? "border-[#46A302] bg-[#58CC02] text-white hover:bg-[#61E002]"
                              : "border-[#46A302] bg-[#58CC02] text-white shadow-lg shadow-[#58CC02]/30 hover:bg-[#61E002]"
                          }`}
                        >
                          {isDone ? (
                            <Check className="h-9 w-9 stroke-[3]" />
                          ) : (
                            <span className="text-xl font-extrabold">
                              {lesson.order}
                            </span>
                          )}
                        </button>
                      ) : (
                        <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-b-[6px] border-[#C7C7C7] dark:border-[#2B383F] bg-[#E5E5E5] dark:bg-[#37464F] text-[#AFAFAF] dark:text-[#52656D]">
                          <Lock className="h-7 w-7" />
                        </span>
                      )}

                      {/* Interactive Lesson Speech-Bubble Popover */}
                      {isPopoverOpen && unlocked && (
                        <LessonPopover
                          lessonId={lesson._id}
                          title={lesson.title}
                          order={lesson.order}
                          xpReward={lesson.xpReward}
                          isCompleted={isDone}
                          onClose={() => setActiveLessonId(null)}
                        />
                      )}

                      <p className="mt-2 text-center text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                        {lesson.title}
                      </p>
                    </li>
                  );
                })}
              </ol>

              {/* End of Unit Milestone Treasure Chest */}
              <TreasureChestNode
                unitOrder={unit.order}
                isUnlocked={isUnitCompleted}
              />
            </section>
          );
        })}
      </main>

      {/* Right Column: Leaderboards, Quests & Profile Sync (Desktop Sticky) */}
      <RightSidebar
        currentStreak={stats.currentStreak}
        totalXp={stats.totalXp}
        completedLessonsCount={completedLessonsCount}
        signedIn={stats.signedIn}
        hearts={stats.hearts}
        gems={stats.gems}
        showSetStatus={true}
        activeStatus={localStatus ?? stats.activeStatus ?? null}
        onSetStatus={async (newStatus) => {
          setLocalStatus(newStatus);
          try {
            await setUserStatus({ status: newStatus });
          } catch {
            // fallback
          }
        }}
      />

      {/* Unit Guidebook Modal */}
      {guidebookUnit && (
        <UnitGuidebookModal
          isOpen={true}
          onClose={() => setGuidebookUnit(null)}
          unitTitle={guidebookUnit.title}
          unitOrder={guidebookUnit.order}
        />
      )}

      {/* Floating Go To Current Unit Button (Duolingo floating scroll action) */}
      {showScrollToCurrent && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Go to current unit"
          title="Go to current unit"
          className="fixed bottom-20 right-6 z-40 flex h-13 w-13 items-center justify-center rounded-full border-b-4 border-[#1899D6] bg-[#1CB0F6] text-white shadow-xl transition-all hover:bg-[#4FC3F9] active:translate-y-[2px] active:border-b-2 sm:bottom-8 sm:right-8 animate-in fade-in zoom-in-90"
        >
          <ArrowUp className="h-6 w-6 stroke-[3]" />
        </button>
      )}
    </div>
  );
}

export default function LearnPage() {
  const { hasConvex } = useAppConfig();
  if (!hasConvex) {
    return <ConfigRequired missing="NEXT_PUBLIC_CONVEX_URL" />;
  }
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="py-24 text-center font-extrabold text-[#AFAFAF]">
            Loading your path...
          </div>
        }
      >
        <PathPage />
      </Suspense>
    </ErrorBoundary>
  );
}
