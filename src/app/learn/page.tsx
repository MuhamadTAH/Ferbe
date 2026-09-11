"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Check, Flame, Lock, Star, Zap } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired, ErrorBoundary } from "@/components/states/ScreenState";

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

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-10 flex items-center justify-center gap-8 text-sm font-extrabold">
        <span className="flex items-center gap-1.5 text-[#FFC800]">
          <Zap className="h-5 w-5 fill-[#FFC800]" />
          {stats.totalXp} XP
        </span>
        <span className="flex items-center gap-1.5 text-[#FF4B4B]">
          <Flame className="h-5 w-5 fill-[#FF4B4B]" />
          {stats.currentStreak} day streak
        </span>
      </div>

      {curriculum.units.map((unit) => (
        <section key={unit._id} className="mb-14">
          <div className="flex items-center justify-between rounded-3xl bg-[#58CC02] px-6 py-4 text-white shadow-[0_4px_0_#46A302]">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-white/80">
                Unit {unit.order}
              </p>
              <h2 className="text-lg font-extrabold">{unit.title}</h2>
            </div>
            <Star className="h-6 w-6 fill-white/30 text-white" />
          </div>

          <ol className="mt-12 flex flex-col items-center gap-5">
            {unit.lessons.map((lesson, i) => {
              const previous = i > 0 ? unit.lessons[i - 1] : null;
              const unlocked = i === 0 || (previous?.isCompleted ?? false);
              const offset = ZIGZAG[i % ZIGZAG.length];
              const isDone = lesson.isCompleted;

              return (
                <li
                  key={lesson._id}
                  style={{ marginLeft: offset }}
                  className="relative flex flex-col items-center"
                >
                  {unlocked && !isDone ? (
                    <span className="absolute -top-9 whitespace-nowrap rounded-xl border-2 border-[#E5E5E5] bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#58CC02]">
                      Start
                      <span className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-white" />
                    </span>
                  ) : null}

                  {unlocked ? (
                    <Link
                      href={`/learn/${lesson._id}`}
                      aria-label={lesson.title}
                      className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-b-[6px] border-[#46A302] bg-[#58CC02] font-extrabold text-white transition-all hover:bg-[#61E002] active:translate-y-[2px] active:border-b-2"
                    >
                      {isDone ? (
                        <Check className="h-9 w-9 stroke-[3]" />
                      ) : (
                        <span className="text-xl">{lesson.order}</span>
                      )}
                    </Link>
                  ) : (
                    <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-b-[6px] border-[#C7C7C7] bg-[#E5E5E5] text-[#AFAFAF]">
                      <Lock className="h-7 w-7" />
                    </span>
                  )}

                  <p className="mt-2 text-center text-xs font-bold text-[#777777]">
                    {lesson.title}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
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
