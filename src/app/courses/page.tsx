"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import {
  Globe,
  ArrowRight,
  Users,
  Compass,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired, ErrorBoundary } from "@/components/states/ScreenState";
import { RightSidebar } from "@/components/learn/RightSidebar";

interface Stats {
  currentStreak: number;
  hearts: number;
  gems?: number;
  totalXp: number;
  signedIn: boolean;
}

interface CourseItem {
  id: string;
  name: string;
  nativeName: string;
  category: "kurdish" | "regional";
  learners: string;
  badge: string;
  badgeColor: string;
  description: string;
  script: string;
  status: "active" | "beta" | "coming_soon";
  href: string;
  flag: "kurdish" | "iraq" | "mountain" | "uk";
}

const COURSES: CourseItem[] = [
  {
    id: "english-from-kurdish",
    name: "English for Kurdish Speakers",
    nativeName: "ئینگلیزی بۆ کورد",
    category: "kurdish",
    learners: "54.2K learners",
    badge: "Current Course",
    badgeColor: "bg-[#E8FAD4] dark:bg-[#1E3B20] text-[#58CC02] border-[#58CC02]/40",
    description:
      "Learn English from Kurdish Sorani! Level 0 foundational curriculum with 10 units and 58 lessons covering phonics, letter blending, sound traps, and speech frames.",
    script: "English Latin script · Kurdish Sorani instructions",
    status: "active",
    href: "/learn?course=english-from-kurdish",
    flag: "uk",
  },
];

function FlagIcon({ flag }: { flag: CourseItem["flag"] }) {
  if (flag === "uk") {
    return (
      <svg
        className="h-7 w-10 shrink-0 overflow-hidden rounded-md border border-black/15 shadow-sm"
        viewBox="0 0 60 36"
      >
        <path d="M0,0 v36 h60 v-36 z" fill="#012169" />
        <path d="M0,0 L60,36 M60,0 L0,36" stroke="#ffffff" strokeWidth="7" />
        <path d="M0,0 L60,36 M60,0 L0,36" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v36 M0,18 h60" stroke="#ffffff" strokeWidth="11" />
        <path d="M30,0 v36 M0,18 h60" stroke="#C8102E" strokeWidth="7" />
      </svg>
    );
  }

  if (flag === "kurdish") {
    return (
      <span className="flex h-7 w-10 flex-col overflow-hidden rounded-md border border-black/15 shadow-sm">
        <span className="h-1/3 w-full bg-[#ED1C24]" />
        <span className="flex h-1/3 w-full items-center justify-center bg-white">
          <span className="h-2 w-2 rounded-full bg-[#FFD700]" />
        </span>
        <span className="h-1/3 w-full bg-[#278E43]" />
      </span>
    );
  }

  if (flag === "iraq") {
    return (
      <span className="flex h-7 w-10 flex-col overflow-hidden rounded-md border border-black/15 shadow-sm">
        <span className="h-1/3 w-full bg-[#CE1126]" />
        <span className="flex h-1/3 w-full items-center justify-center bg-white text-[7px] font-extrabold text-[#007A3D]">
          ★ ★ ★
        </span>
        <span className="h-1/3 w-full bg-black" />
      </span>
    );
  }

  return (
    <span className="flex h-7 w-10 items-center justify-center rounded-md bg-[#FAF5FF] border border-[#CE82FF]/30 text-base shadow-sm">
      ⛰️
    </span>
  );
}

import { useActiveCourse } from "@/hooks/useActiveCourse";

function CoursesInner() {
  const stats = useQuery(api.curriculum.getMyStats, {}) as Stats | undefined;
  const { selectCourse } = useActiveCourse();

  if (stats === undefined) {
    return (
      <div className="py-24 text-center font-extrabold text-[#AFAFAF]">
        Loading courses...
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl justify-center gap-10 px-4 py-8">
      {/* Main Column */}
      <main className="w-full max-w-xl">
        {/* Header Banner */}
        <div className="rounded-3xl border-2 border-[#1CB0F6]/30 bg-gradient-to-r from-[#DDF4FF] to-white dark:from-[#1C3B4E] dark:to-[#131F24] p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1CB0F6] text-white shadow-md shadow-[#1CB0F6]/30">
              <Globe className="h-7 w-7" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1899D6] dark:text-[#3BC0F8]">
                Curriculum Explorer
              </span>
              <h1 className="text-2xl font-extrabold text-[#4B4B4B] dark:text-white">
                Available Courses
              </h1>
              <p className="text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                Learn English from Kurdish with bite-sized lessons, phonics, and vocal practice
              </p>
            </div>
          </div>

          {/* Active Status Badge */}
          <div className="mt-5 flex items-center gap-2">
            <span className="rounded-xl border-2 border-[#58CC02] bg-[#E8FAD4] dark:bg-[#1E3B20] px-3.5 py-1.5 text-xs font-extrabold text-[#58CC02]">
              Active Course (1)
            </span>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="mt-6 flex flex-col gap-4">
          {COURSES.map((course) => {
            return (
              <div
                key={course.id}
                className="flex flex-col gap-4 rounded-3xl border-2 border-[#58CC02] ring-2 ring-[#58CC02]/20 bg-white dark:bg-[#131F24] p-5 shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <FlagIcon flag={course.flag} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-[#4B4B4B] dark:text-white">
                          {course.name}
                        </h3>
                        <span
                          dir="rtl"
                          className="font-kurdish text-sm font-bold text-[#777777] dark:text-[#8495A0]"
                        >
                          {course.nativeName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                        <Users className="h-3.5 w-3.5" />
                        <span>{course.learners}</span>
                        <span>·</span>
                        <span>{course.script}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded-xl border px-2.5 py-1 text-[11px] font-extrabold ${course.badgeColor}`}
                  >
                    {course.badge}
                  </span>
                </div>

                <p className="text-xs font-bold leading-relaxed text-[#777777] dark:text-[#8495A0]">
                  {course.description}
                </p>

                <div className="flex items-center justify-between border-t border-[#F0F0F0] dark:border-[#37464F] pt-3.5">
                  <Link
                    href="/sections"
                    className="flex items-center gap-1.5 text-xs font-extrabold text-[#1CB0F6] hover:underline"
                  >
                    <Compass className="h-4 w-4" />
                    <span>View Curriculum Sections</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => selectCourse(course.id)}
                    className="flex items-center gap-1.5 rounded-2xl border-b-4 border-[#46A302] bg-[#58CC02] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-[#61E002] active:translate-y-[2px] active:border-b-2 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
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
    </div>
  );
}

export default function CoursesPage() {
  const { hasConvex } = useAppConfig();

  if (!hasConvex) {
    return <ConfigRequired missing="NEXT_PUBLIC_CONVEX_URL" />;
  }

  return (
    <ErrorBoundary>
      <CoursesInner />
    </ErrorBoundary>
  );
}
