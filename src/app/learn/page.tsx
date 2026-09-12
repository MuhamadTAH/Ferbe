"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import {
  BookOpen,
  ChevronRight,
  ArrowUp,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired, ErrorBoundary } from "@/components/states/ScreenState";
import { RightSidebar } from "@/components/learn/RightSidebar";
import { TreasureChestNode } from "@/components/learn/TreasureChestNode";
import { UnitGuidebookModal } from "@/components/learn/UnitGuidebookModal";
import { PathLessonNode, LessonNodeType } from "@/components/learn/PathLessonNode";
import { JumpLessonNode } from "@/components/learn/JumpLessonNode";
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

    // Identify the current active lesson across the whole curriculum
    const currentActiveLessonId =
      curriculum.units
        .flatMap((u) => u.lessons)
        .find((l) => !l.isCompleted)?._id ?? null;

    return (
    <div className="mx-auto flex max-w-5xl justify-center gap-10 px-4 py-8">
      {/* Main Path Column */}
      <main className="w-full max-w-xl">
        {curriculum.units.map((unit, unitIdx) => {
          const lessons = unit.lessons;
          // Split lessons into early lessons, mid-unit chest, and later lessons
          const midIndex = Math.min(2, Math.max(1, Math.floor(lessons.length / 2)));
          const lessonsPart1 = lessons.slice(0, midIndex);
          const lessonsPart2 = lessons.slice(midIndex);

          // Chest is unlocked when all lessons preceding it are completed
          const isChestUnlocked =
            lessonsPart1.length > 0 && lessonsPart1.every((l) => l.isCompleted);

          return (
            <section
              key={unit._id}
              id={`unit-section-${unit.order}`}
              className="mb-14"
            >
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

              {/* Serpentine Learning Path Nodes */}
              <ol className="mt-12 flex flex-col items-center gap-6">
                {/* 1. Lessons Before Chest (Star Nodes) */}
                {lessonsPart1.map((lesson, i) => {
                  const previous = i > 0 ? lessonsPart1[i - 1] : null;
                  const unlocked =
                    unitIdx === 0 && i === 0
                      ? true
                      : unitIdx > 0 && i === 0
                      ? curriculum.units[unitIdx - 1].lessons.every(
                          (l) => l.isCompleted
                        )
                      : (previous?.isCompleted ?? false);
                  const isDone = lesson.isCompleted;
                  const isCurrent = lesson._id === currentActiveLessonId;
                  const isPopoverOpen = activeLessonId === lesson._id;
                  const offset = i === 0 ? 0 : -45;

                  return (
                    <PathLessonNode
                      key={lesson._id}
                      lesson={lesson}
                      nodeType="star"
                      unlocked={unlocked}
                      isDone={isDone}
                      isCurrent={isCurrent}
                      isPopoverOpen={isPopoverOpen}
                      offset={offset}
                      onNodeClick={() =>
                        setActiveLessonId(isPopoverOpen ? null : lesson._id)
                      }
                      onClosePopover={() => setActiveLessonId(null)}
                    />
                  );
                })}

                {/* 2. Mid-Unit Milestone Treasure Chest (Free-standing 2D Chest on Path) */}
                <li
                  style={{ marginLeft: -55 }}
                  className="relative flex flex-col items-center"
                >
                  <TreasureChestNode
                    unitOrder={unit.order}
                    isUnlocked={isChestUnlocked}
                    showMascot={true}
                  />
                </li>

                {/* 3. Lessons After Chest (Audio Practice, Star, and Final Trophy Challenge) */}
                {lessonsPart2.map((lesson, j) => {
                  const isFirstAfterChest = j === 0;
                  const isLastInUnit = j === lessonsPart2.length - 1;
                  const nodeType: LessonNodeType = isLastInUnit
                    ? "trophy"
                    : isFirstAfterChest
                    ? "audio"
                    : "star";

                  const previous = isFirstAfterChest
                    ? lessonsPart1[lessonsPart1.length - 1]
                    : lessonsPart2[j - 1];
                  const unlocked =
                    isChestUnlocked && (previous?.isCompleted ?? false);
                  const isDone = lesson.isCompleted;
                  const isCurrent = lesson._id === currentActiveLessonId;
                  const isPopoverOpen = activeLessonId === lesson._id;

                  // Serpentine Offsets: audio (-30), intermediate star (+25), final trophy (0)
                  const offset = isLastInUnit
                    ? 0
                    : isFirstAfterChest
                    ? -30
                    : 25;

                  return (
                    <PathLessonNode
                      key={lesson._id}
                      lesson={lesson}
                      nodeType={nodeType}
                      unlocked={unlocked}
                      isDone={isDone}
                      isCurrent={isCurrent}
                      isPopoverOpen={isPopoverOpen}
                      offset={offset}
                      onNodeClick={() =>
                        setActiveLessonId(isPopoverOpen ? null : lesson._id)
                      }
                      onClosePopover={() => setActiveLessonId(null)}
                    />
                  );
                })}
              </ol>

              {/* 4. Unit Divider & Jump Lesson (Between Units) */}
              {unitIdx < curriculum.units.length - 1 && (
                <div className="w-full my-8">
                  {/* Clean Duolingo Unit Divider */}
                  <div className="my-10 flex items-center justify-center gap-4 w-full select-none">
                    <div className="h-[2px] flex-1 bg-[#E5E5E5] dark:bg-[#37464F]" />
                    <span className="text-xs font-black uppercase tracking-wider text-[#777777] dark:text-[#8495A0]">
                      {curriculum.units[unitIdx + 1].title}
                    </span>
                    <div className="h-[2px] flex-1 bg-[#E5E5E5] dark:bg-[#37464F]" />
                  </div>

                  {/* JUMP HERE? Fast-Forward Node */}
                  <JumpLessonNode
                    currentUnitOrder={unit.order}
                    nextUnitOrder={curriculum.units[unitIdx + 1].order}
                    nextUnitTitle={curriculum.units[unitIdx + 1].title}
                  />
                </div>
              )}
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
