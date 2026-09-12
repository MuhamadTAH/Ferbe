"use client";

import { useState } from "react";
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
    id: "sorani",
    name: "Kurdish (Sorani)",
    nativeName: "کوردیی ناوەندی (سۆرانی)",
    category: "kurdish",
    learners: "42.8K learners",
    badge: "Core Course",
    badgeColor: "bg-[#E8FAD4] text-[#58CC02] border-[#58CC02]/40",
    description:
      "Central Kurdish using Kurdish-Arabic script. Spoken across Sulaymaniyah, Erbil, Kirkuk, and Sanandaj.",
    script: "Kurdish-Arabic alphabet (34 letters)",
    status: "active",
    href: "/learn?course=sorani-basics",
    flag: "kurdish",
  },
  {
    id: "english-from-kurdish",
    name: "English for Kurdish Speakers",
    nativeName: "ئینگلیزی بۆ کورد",
    category: "kurdish",
    learners: "54.2K learners",
    badge: "New Course",
    badgeColor: "bg-[#DDF4FF] text-[#1CB0F6] border-[#1CB0F6]/40",
    description:
      "Learn English from Kurdish Sorani! 3 comprehensive units, 12 lessons, 96 interactive exercises with Kurdish translations, audio matching, and grammar foundations.",
    script: "English Latin script · Kurdish Sorani instructions",
    status: "active",
    href: "/learn?course=english-from-kurdish",
    flag: "uk",
  },
  {
    id: "kurmanji",
    name: "Kurdish (Kurmanji)",
    nativeName: "Kurdîya Bakur (Kurmancî)",
    category: "kurdish",
    learners: "28.5K learners",
    badge: "Beta Coming Soon",
    badgeColor: "bg-[#DDF4FF] text-[#1CB0F6] border-[#1CB0F6]/40",
    description:
      "Northern Kurdish with standard Hawar Latin orthography. Spoken across Dohuk, Diyarbakir, and Rojava.",
    script: "Hawar Latin alphabet (31 letters)",
    status: "beta",
    href: "/practice",
    flag: "kurdish",
  },
  {
    id: "hawrami",
    name: "Kurdish (Hawrami / Gorani)",
    nativeName: "هۆرامی (گۆرانی)",
    category: "kurdish",
    learners: "6.2K learners",
    badge: "Heritage Dialect",
    badgeColor: "bg-[#FAF5FF] text-[#CE82FF] border-[#CE82FF]/40",
    description:
      "Ancient mountain dialect celebrated for classical Kurdish poetry and literature in the Hawraman mountains.",
    script: "Traditional script & phonetics",
    status: "coming_soon",
    href: "/practice",
    flag: "mountain",
  },
  {
    id: "iraqi-arabic",
    name: "Iraqi Arabic",
    nativeName: "العامية العراقية",
    category: "regional",
    learners: "65.4K learners",
    badge: "Regional Companion",
    badgeColor: "bg-[#FFF4E5] text-[#FF9600] border-[#FF9600]/40",
    description:
      "Mesopotamian Arabic dialect used throughout Baghdad, Basra, and cross-community trade across Iraq.",
    script: "Modern Standard Arabic script",
    status: "beta",
    href: "/practice",
    flag: "iraq",
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
  const { activeCourseSlug, selectCourse } = useActiveCourse();
  const [filter, setFilter] = useState<"all" | "kurdish" | "regional">("all");

  if (stats === undefined) {
    return (
      <div className="py-24 text-center font-extrabold text-[#AFAFAF]">
        Loading courses...
      </div>
    );
  }

  const kurdishCount = COURSES.filter((c) => c.category === "kurdish").length;
  const regionalCount = COURSES.filter((c) => c.category === "regional").length;

  const filteredCourses = COURSES.filter((c) => {
    if (filter === "all") return true;
    return c.category === filter;
  });

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
                Language & Dialect Courses
              </h1>
              <p className="text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                Learn Kurdish dialects and regional languages with bite-sized lessons
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-xl border-2 px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer ${
                filter === "all"
                  ? "border-[#1CB0F6] bg-[#DDF4FF] dark:bg-[#1C3B4E] text-[#1899D6] dark:text-[#3BC0F8]"
                  : "border-[#E5E5E5] dark:border-[#37464F] text-[#777777] dark:text-[#8495A0] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36]"
              }`}
            >
              All Courses ({COURSES.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("kurdish")}
              className={`rounded-xl border-2 px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer ${
                filter === "kurdish"
                  ? "border-[#58CC02] bg-[#E8FAD4] dark:bg-[#1E3B20] text-[#58CC02]"
                  : "border-[#E5E5E5] dark:border-[#37464F] text-[#777777] dark:text-[#8495A0] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36]"
              }`}
            >
              Kurdish & English ({kurdishCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("regional")}
              className={`rounded-xl border-2 px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer ${
                filter === "regional"
                  ? "border-[#FF9600] bg-[#FFF4E5] dark:bg-[#341F05] text-[#FF9600]"
                  : "border-[#E5E5E5] dark:border-[#37464F] text-[#777777] dark:text-[#8495A0] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36]"
              }`}
            >
              Regional ({regionalCount})
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="mt-6 flex flex-col gap-4">
          {filteredCourses.map((course) => {
            const isCurrentlySelected =
              (course.id === "sorani" && activeCourseSlug === "sorani-basics") ||
              course.id === activeCourseSlug;
            const isPlayable = course.status === "active";

            return (
              <div
                key={course.id}
                className={`flex flex-col gap-4 rounded-3xl border-2 bg-white dark:bg-[#131F24] p-5 shadow-sm transition-all ${
                  isCurrentlySelected
                    ? "border-[#58CC02] ring-2 ring-[#58CC02]/20"
                    : "border-[#E5E5E5] dark:border-[#37464F] hover:border-[#CCCCCC] dark:hover:border-[#52656D]"
                }`}
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
                    className={`rounded-xl border px-2.5 py-1 text-[11px] font-extrabold ${
                      isCurrentlySelected
                        ? "bg-[#E8FAD4] dark:bg-[#1E3B20] text-[#58CC02] border-[#58CC02]/40"
                        : course.badgeColor
                    }`}
                  >
                    {isCurrentlySelected ? "Current Course" : course.badge}
                  </span>
                </div>

                <p className="text-xs font-bold leading-relaxed text-[#777777] dark:text-[#8495A0]">
                  {course.description}
                </p>

                <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-3.5">
                  <Link
                    href="/sections"
                    className="flex items-center gap-1.5 text-xs font-extrabold text-[#1CB0F6] hover:underline"
                  >
                    <Compass className="h-4 w-4" />
                    <span>View Curriculum Sections</span>
                  </Link>

                  {isPlayable ? (
                    <button
                      type="button"
                      onClick={() =>
                        selectCourse(
                          course.id === "sorani"
                            ? "sorani-basics"
                            : course.id
                        )
                      }
                      className={`flex items-center gap-1.5 rounded-2xl border-b-4 px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                        isCurrentlySelected
                          ? "border-[#46A302] bg-[#58CC02] text-white hover:bg-[#61E002] active:translate-y-[2px] active:border-b-2 shadow-sm"
                          : "border-[#1899D6] bg-[#1CB0F6] text-white hover:bg-[#4FC3F9] active:translate-y-[2px] active:border-b-2 shadow-sm"
                      }`}
                    >
                      <span>
                        {isCurrentlySelected
                          ? "Continue Learning"
                          : "Start Course"}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <Link href={course.href}>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-2xl border-2 border-[#E5E5E5] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF] hover:bg-[#F7F7F7] cursor-pointer"
                      >
                        <span>Explore</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  )}
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
