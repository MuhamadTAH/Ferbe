"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { Check, Lock, BookOpen, ChevronRight } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired, ErrorBoundary } from "@/components/states/ScreenState";
import { LessonPopover } from "@/components/learn/LessonPopover";
import { UnitGuidebookModal } from "@/components/learn/UnitGuidebookModal";
import { TreasureChestNode } from "@/components/learn/TreasureChestNode";
import { RightSidebar } from "@/components/learn/RightSidebar";

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
  totalXp: number;
  signedIn: boolean;
}

const ZIGZAG = [0, 48, 80, 48, 0, -48, -80, -48];

function PathPage() {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [guidebookUnit, setGuidebookUnit] = useState<{
    title: string;
    order: number;
  } | null>(null);

  const curriculum = useQuery(api.curriculum.getCourseCurriculum, {}) as
    | Curriculum
    | null
    | undefined;
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
          The course content has not been seeded. From the repo root run{" "}
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
                    Master essential Kurdish Sorani vocabulary & greetings
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setGuidebookUnit({ title: unit.title, order: unit.order })
                  }
                  className="flex items-center gap-2 rounded-2xl border-b-4 border-[#3D8F02] bg-[#46A302] px-3.5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:bg-[#4FB703] active:translate-y-[2px] active:border-b-2 shadow-sm"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Guidebook</span>
                </button>
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
                          className="absolute -top-9 z-10 whitespace-nowrap rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#58CC02] shadow-sm animate-bounce"
                        >
                          Start
                          <span className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-white" />
                        </button>
                      ) : null}

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
                        <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-b-[6px] border-[#C7C7C7] bg-[#E5E5E5] text-[#AFAFAF]">
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

                      <p className="mt-2 text-center text-xs font-bold text-[#777777]">
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
      <PathPage />
    </ErrorBoundary>
  );
}
