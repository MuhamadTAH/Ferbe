"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  AVAILABLE_COURSES,
  useActiveCourse,
} from "@/hooks/useActiveCourse";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired } from "@/components/states/ScreenState";

interface LessonView {
  _id: string;
  title: string;
  order: number;
  xpReward: number;
  isCompleted: boolean;
}
interface UnitView {
  _id: string;
  title: string;
  order: number;
  lessons: LessonView[];
}

function LessonsList({ courseSlug }: { courseSlug: string }) {
  const curriculum = useQuery(api.curriculum.getCourseCurriculum, { courseSlug });

  if (curriculum === undefined) {
    return <p className="py-8 text-center font-bold text-[#AFAFAF]">Loading…</p>;
  }
  if (curriculum === null) {
    return (
      <p className="py-8 text-center font-bold text-[#AFAFAF]">
        This course has not been seeded yet.
      </p>
    );
  }

  const units = curriculum.units as UnitView[];
  const lessonCount = units.reduce((n, u) => n + u.lessons.length, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Demo banner */}
      <div className="rounded-2xl border-2 border-b-4 border-[#1899D6] bg-[#DDF4FF] p-4 text-sm font-bold text-[#1899D6]">
        Demo mode: every lesson link has{" "}
        <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-xs">
          ?win=1
        </code>{" "}
        — the lesson plays itself and always wins, so you can watch any lesson
        end to end. Remove{" "}
        <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-xs">
          ?win=1
        </code>{" "}
        to play normally.
      </div>

      <p className="text-xs font-black uppercase tracking-wider text-[#AFAFAF]">
        {units.length} units · {lessonCount} lessons
      </p>

      {units.map((unit) => (
        <section key={unit._id}>
          <h2 className="mb-2 font-black text-[#4B4B4B] dark:text-white">
            {unit.order}. {unit.title}
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {unit.lessons.map((lesson) => (
              <Link
                key={lesson._id}
                href={`/learn/${lesson._id}?win=1`}
                className="flex items-center justify-between rounded-2xl border-2 border-b-4 border-[#E5E5E5] bg-white px-4 py-3 font-bold text-[#4B4B4B] transition-colors hover:border-[#58CC02] hover:bg-[#F7FFEF] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#DCE6EC]"
              >
                <span className="pr-2 text-sm">{lesson.title}</span>
                <span className="flex shrink-0 items-center gap-2 text-[10px] font-black uppercase tracking-wider text-[#58CC02]">
                  {lesson.isCompleted ? "✓ done" : `${lesson.xpReward} xp`}
                  <span aria-hidden>▶</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function LessonsInner() {
  const { activeCourseSlug } = useActiveCourse();
  const [courseSlug, setCourseSlug] = useState(activeCourseSlug || "");

  const selected = courseSlug || activeCourseSlug || AVAILABLE_COURSES[0].slug;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-black text-[#4B4B4B] dark:text-white">
        All lessons / هەموو وانەکان
      </h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {AVAILABLE_COURSES.map((course) => (
          <button
            key={course.slug}
            type="button"
            onClick={() => setCourseSlug(course.slug)}
            className={
              "rounded-2xl border-2 border-b-4 px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors " +
              (course.slug === selected
                ? "border-[#46A302] bg-[#58CC02] text-white"
                : "border-[#E5E5E5] bg-white text-[#777777] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#8495A0]")
            }
          >
            {course.shortLabel}
          </button>
        ))}
      </div>

      <LessonsList key={selected} courseSlug={selected} />
    </div>
  );
}

export default function LessonsPage() {
  const { hasConvex } = useAppConfig();
  if (!hasConvex) {
    return <ConfigRequired missing="NEXT_PUBLIC_CONVEX_URL" />;
  }
  return <LessonsInner />;
}
