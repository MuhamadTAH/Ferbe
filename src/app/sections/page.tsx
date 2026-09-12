"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { ChevronLeft, Lock, Sparkles, X, Info } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired, ErrorBoundary } from "@/components/states/ScreenState";
import { RightSidebar } from "@/components/learn/RightSidebar";

interface SectionDetails {
  number: number;
  englishTitle: string;
  kurdishTitle: string;
  cefr: string;
  unitsCount: number;
  description: string;
  samplePhrase: string;
  status: "current" | "unlocked" | "locked";
}

const SECTIONS: SectionDetails[] = [
  {
    number: 1,
    englishTitle: "Rookie",
    kurdishTitle: "دەستپێک",
    cefr: "A1",
    unitsCount: 3,
    description:
      "Learn basic greetings, essential vocabulary, and Kurdish alphabet sounds to kick off your Kurdish journey.",
    samplePhrase: "سڵاو! چۆنیت؟ (Hello! How are you?)",
    status: "current",
  },
  {
    number: 2,
    englishTitle: "Explorer",
    kurdishTitle: "گەڕیدە",
    cefr: "A1",
    unitsCount: 12,
    description:
      "Form simple sentences, order food at a bazaar or café, and ask for directions around Erbil and Sulaymaniyah.",
    samplePhrase: "دەتوانیت یارمەتیم بدەیت؟ (Can you help me?)",
    status: "unlocked",
  },
  {
    number: 3,
    englishTitle: "Traveler",
    kurdishTitle: "گەشتیار",
    cefr: "A2",
    unitsCount: 16,
    description:
      "Navigate public transit, describe your daily routine, and talk about family, work, and Kurdish cultural traditions.",
    samplePhrase: "ئەمڕۆ سەردانی بازاڕی قەیسەری دەکەم. (Today I will visit the Qaysari Bazaar.)",
    status: "unlocked",
  },
  {
    number: 4,
    englishTitle: "Storyteller",
    kurdishTitle: "چیرۆکبێژ",
    cefr: "B1",
    unitsCount: 24,
    description:
      "Share memories, understand Kurdish folktales, and discuss hobbies, feelings, news, and future plans.",
    samplePhrase: "کاتێک مناڵ بووم، لە گوند دەژیاین. (When I was a child, we lived in the village.)",
    status: "unlocked",
  },
  {
    number: 5,
    englishTitle: "Fluent Sorani",
    kurdishTitle: "زمانزان",
    cefr: "B2",
    unitsCount: 30,
    description:
      "Discuss abstract ideas, poetry, modern media, and express nuanced opinions with authentic native idioms.",
    samplePhrase: "هەموو ڕۆژێک لە فێربوونی شتی نوێ دەست پێ دەکات. (Every day begins with learning something new.)",
    status: "unlocked",
  },
];

const CEFR_INFO: Record<string, { title: string; desc: string }> = {
  A1: {
    title: "A1 • Breakthrough / Beginner",
    desc: "Can understand and use familiar everyday Kurdish expressions and very basic phrases aimed at the satisfaction of concrete needs. Can introduce yourself and answer basic questions about personal details.",
  },
  A2: {
    title: "A2 • Waystage / Elementary",
    desc: "Can understand sentences and frequently used expressions related to areas of most immediate relevance (e.g. basic personal and family information, shopping, local geography, employment).",
  },
  B1: {
    title: "B1 • Threshold / Intermediate",
    desc: "Can understand the main points of clear standard input on familiar matters regularly encountered in work, school, leisure, etc. Can deal with most situations likely to arise whilst travelling in the Kurdistan Region.",
  },
  B2: {
    title: "B2 • Vantage / Upper Intermediate",
    desc: "Can understand the main ideas of complex text on both concrete and abstract topics, including technical discussions in their field of specialization. Can interact with a degree of fluency with native speakers.",
  },
};

interface Stats {
  currentStreak: number;
  hearts: number;
  gems?: number;
  totalXp: number;
  signedIn: boolean;
}

interface Curriculum {
  course: { _id: string; title: string; slug: string };
  units: Array<{
    _id: string;
    title: string;
    order: number;
    lessons: Array<{
      _id: string;
      title: string;
      order: number;
      isCompleted: boolean;
    }>;
  }>;
}

function SectionsInner() {
  const [selectedCefr, setSelectedCefr] = useState<string | null>(null);

  const curriculum = useQuery(api.curriculum.getCourseCurriculum, {}) as
    | Curriculum
    | null
    | undefined;
  const stats = useQuery(api.curriculum.getMyStats, {}) as Stats | undefined;

  if (curriculum === undefined || stats === undefined) {
    return (
      <div className="py-24 text-center font-extrabold text-[#AFAFAF]">
        Loading course sections...
      </div>
    );
  }

  const completedLessonsCount =
    curriculum?.units?.reduce(
      (acc, u) => acc + u.lessons.filter((l) => l.isCompleted).length,
      0
    ) ?? 0;
  const totalSection1Lessons =
    curriculum?.units?.reduce((acc, u) => acc + u.lessons.length, 0) ?? 6;
  const section1Percent =
    totalSection1Lessons > 0
      ? Math.min(100, Math.round((completedLessonsCount / totalSection1Lessons) * 100))
      : 0;

  return (
    <div className="mx-auto flex max-w-5xl justify-center gap-10 px-4 py-8">
      {/* Main Column */}
      <main className="w-full max-w-xl">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[#AFAFAF] transition-colors hover:text-[#4B4B4B]"
          >
            <ChevronLeft className="h-5 w-5 stroke-[3]" />
            <span>Back to Path</span>
          </Link>
        </div>

        {/* Section Cards List */}
        <div className="flex flex-col gap-6">
          {SECTIONS.map((sec) => {
            const isCurrent = sec.number === 1;

            return (
              <div
                key={sec.number}
                className={`rounded-3xl border-2 p-6 transition-all shadow-sm ${
                  isCurrent
                    ? "border-[#58CC02] bg-white ring-2 ring-[#58CC02]/20"
                    : "border-[#E5E5E5] bg-white"
                }`}
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedCefr(sec.cefr)}
                    className="flex items-center gap-1.5 rounded-full border-2 border-[#E5E5E5] bg-[#F7F7F7] px-3 py-1 text-[11px] font-extrabold uppercase text-[#777777] transition-colors hover:border-[#AFAFAF] hover:text-[#4B4B4B]"
                  >
                    <span>{sec.cefr} • SEE DETAILS</span>
                    <Info className="h-3 w-3 text-[#AFAFAF]" />
                  </button>

                  {isCurrent ? (
                    <span className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-wide text-[#58CC02]">
                      <Sparkles className="h-4 w-4 fill-[#58CC02]" />
                      Current Section
                    </span>
                  ) : (
                    <span className="text-xs font-extrabold uppercase text-[#AFAFAF]">
                      {sec.unitsCount} Units
                    </span>
                  )}
                </div>

                {/* Section Titles */}
                <div className="mt-3">
                  <h2 className="text-2xl font-extrabold text-[#4B4B4B]">
                    Section {sec.number}: {sec.englishTitle}
                  </h2>
                  <p className="mt-0.5 font-kurdish text-base font-bold text-[#777777] kurdish-word">
                    {sec.kurdishTitle}
                  </p>
                </div>

                {/* Description */}
                <p className="mt-2.5 text-xs font-bold leading-relaxed text-[#777777]">
                  {sec.description}
                </p>

                {/* Kurdish Sample Phrase */}
                <div className="mt-3 rounded-2xl bg-[#F7F7F7] px-3.5 py-2">
                  <span className="text-[11px] font-bold text-[#AFAFAF]">
                    Example:
                  </span>
                  <p className="font-kurdish text-sm font-bold text-[#4B4B4B] kurdish-word">
                    {sec.samplePhrase}
                  </p>
                </div>

                {/* Progress bar for current section */}
                {isCurrent && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-extrabold text-[#777777]">
                      <span>Section Progress</span>
                      <span className="text-[#58CC02]">{section1Percent}%</span>
                    </div>
                    <div className="mt-1.5 h-3.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
                      <div
                        className="h-full rounded-full bg-[#58CC02] transition-all duration-500"
                        style={{ width: `${section1Percent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action CTA */}
                <div className="mt-5">
                  {isCurrent ? (
                    <Link href="/learn" className="block">
                      <button
                        type="button"
                        className="w-full rounded-2xl border-b-4 border-[#46A302] bg-[#58CC02] py-3 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:bg-[#61E002] active:translate-y-[2px] active:border-b-2 shadow-sm"
                      >
                        Continue Section 1
                      </button>
                    </Link>
                  ) : (
                    <Link href="/learn" className="block">
                      <button
                        type="button"
                        className="w-full rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white py-3 text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6] transition-all hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 shadow-xs"
                      >
                        Jump to Section {sec.number}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {/* Daily Refresh Card */}
          <div className="rounded-3xl border-2 border-[#E5E5E5] bg-[#F7F7F7]/60 p-6 opacity-75">
            <div className="flex items-center justify-between">
              <span className="rounded-full border-2 border-[#E5E5E5] bg-white px-3 py-1 text-[11px] font-extrabold uppercase text-[#AFAFAF]">
                6 Levels
              </span>
              <Lock className="h-4 w-4 text-[#AFAFAF]" />
            </div>
            <h2 className="mt-3 text-xl font-extrabold text-[#777777]">
              Daily Refresh (نوێکردنەوەی ڕۆژانە)
            </h2>
            <p className="mt-1 text-xs font-bold text-[#AFAFAF]">
              Complete all course sections to unlock daily personalized reviews
              and maintain your Kurdish fluency indefinitely!
            </p>
          </div>
        </div>
      </main>

      {/* Right Column (Desktop Sticky HUD & Quests) */}
      <RightSidebar
        currentStreak={stats.currentStreak}
        totalXp={stats.totalXp}
        completedLessonsCount={completedLessonsCount}
        signedIn={stats.signedIn}
        hearts={stats.hearts}
        gems={stats.gems}
      />

      {/* CEFR Level Info Modal */}
      {selectedCefr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border-2 border-[#E5E5E5] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#4B4B4B]">
                {CEFR_INFO[selectedCefr]?.title}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedCefr(null)}
                className="rounded-xl p-1 text-[#AFAFAF] hover:bg-[#F7F7F7] hover:text-[#4B4B4B]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-4 text-xs font-bold leading-relaxed text-[#777777]">
              {CEFR_INFO[selectedCefr]?.desc}
            </p>
            <button
              type="button"
              onClick={() => setSelectedCefr(null)}
              className="mt-6 w-full rounded-2xl border-b-4 border-[#1899D6] bg-[#1CB0F6] py-3 text-xs font-extrabold uppercase tracking-wide text-white transition-all hover:bg-[#4FC3F9] active:translate-y-[2px] active:border-b-2"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SectionsPage() {
  const { hasConvex } = useAppConfig();

  if (!hasConvex) {
    return <ConfigRequired missing="NEXT_PUBLIC_CONVEX_URL" />;
  }

  return (
    <ErrorBoundary>
      <SectionsInner />
    </ErrorBoundary>
  );
}
