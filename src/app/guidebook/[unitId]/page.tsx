"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired, ErrorBoundary } from "@/components/states/ScreenState";
import { RightSidebar } from "@/components/learn/RightSidebar";

interface Stats {
  currentStreak: number;
  hearts: number;
  totalXp: number;
  signedIn: boolean;
}

const UNIT_KEY_PHRASES: Record<
  number,
  Array<{
    kurdish: string;
    transliteration: string;
    english: string;
    note: string;
  }>
> = {
  1: [
    {
      kurdish: "سڵاو، چۆنی؟",
      transliteration: "Slaw, çonî?",
      english: "Hello, how are you?",
      note: "Universal friendly greeting used at any time of day.",
    },
    {
      kurdish: "من باشم، سوپاس.",
      transliteration: "Min bashim, supas.",
      english: "I am good, thank you.",
      note: "Standard polite response to a greeting.",
    },
    {
      kurdish: "بەیانیت باش!",
      transliteration: "Bayanît bash!",
      english: "Good morning!",
      note: "Used until midday.",
    },
    {
      kurdish: "من ناوم ئازادە.",
      transliteration: "Min nawim Azade.",
      english: "My name is Azad.",
      note: "Basic self-introduction format: Min nawim [Name] e.",
    },
    {
      kurdish: "تۆ ناوت چییە؟",
      transliteration: "To nawit çîye?",
      english: "What is your name?",
      note: "Asking someone their name informally.",
    },
    {
      kurdish: "خوات لەگەڵ!",
      transliteration: "Xwat legell!",
      english: "Goodbye!",
      note: "Literally 'May God be with you' — universal farewell.",
    },
  ],
};

function GuidebookInner() {
  const params = useParams();
  const router = useRouter();
  const unitOrder = Number(params?.unitId) || 1;
  const stats = useQuery(api.curriculum.getMyStats, {}) as Stats | undefined;

  const playPronunciation = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ku";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const phrases = UNIT_KEY_PHRASES[unitOrder] || UNIT_KEY_PHRASES[1];

  if (stats === undefined) {
    return (
      <div className="py-24 text-center font-extrabold text-[#AFAFAF]">
        Loading guidebook...
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl justify-center gap-10 px-4 py-8">
      {/* Main Column */}
      <main className="w-full max-w-xl">
        {/* Top Back Navigation Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6] hover:text-[#0C9BD6] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
            <span>Back</span>
          </button>
          <Link
            href="/learn"
            className="text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF] hover:text-[#4B4B4B] transition-colors"
          >
            Learning Path
          </Link>
        </div>

        {/* Hero Header */}
        <div className="rounded-3xl border-2 border-[#58CC02] bg-[#58CC02] p-6 text-white shadow-[0_4px_0_#46A302]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-white/80">
                Unit {unitOrder} Guidebook
              </span>
              <h1 className="text-2xl font-extrabold text-white">
                Order at a café & Basic Greetings
              </h1>
            </div>
          </div>
          <p className="mt-3 text-xs font-bold text-white/90">
            Explore grammar tips and key phrases for this unit
          </p>
        </div>

        {/* Section 1: Key Phrases */}
        <section className="mt-8">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#AFAFAF]">
            KEY PHRASES
          </h2>

          <div className="mt-4 flex flex-col gap-3">
            {phrases.map((phrase, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl border-2 border-[#E5E5E5] bg-white p-4 shadow-xs transition-all hover:border-[#CCCCCC]"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-kurdish text-lg font-bold text-[#4B4B4B]">
                      {phrase.kurdish}
                    </span>
                    <span className="text-xs font-bold text-[#AFAFAF]">
                      ({phrase.transliteration})
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-[#777777]">
                    {phrase.english}
                  </p>
                  <p className="text-[11px] font-medium text-[#AFAFAF]">
                    {phrase.note}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => playPronunciation(phrase.kurdish)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#1CB0F6] bg-[#DDF4FF] text-[#1CB0F6] hover:bg-[#BAE9FF] transition-colors cursor-pointer"
                  title="Listen to pronunciation"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Grammar Tips */}
        <section className="mt-8 mb-12">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#AFAFAF]">
            GRAMMAR TIPS
          </h2>

          <div className="mt-4 rounded-3xl border-2 border-[#84D8FF] bg-[#DDF4FF]/40 p-6 text-[#1899D6]">
            <div className="flex items-center gap-2 text-base font-extrabold">
              <Lightbulb className="h-5 w-5 fill-[#1CB0F6] text-[#1CB0F6]" />
              <span>Word Order in Kurdish Sorani (SOV)</span>
            </div>
            <p className="mt-2 text-xs font-bold leading-relaxed text-[#4B4B4B]">
              In Kurdish Sorani, sentences generally follow the <strong>Subject - Object - Verb (SOV)</strong> order. The verb typically appears at the end of the sentence:
            </p>

            <div className="mt-4 rounded-2xl bg-white p-4 border border-[#1CB0F6]/20 shadow-xs">
              <p className="font-kurdish text-base font-bold text-[#4B4B4B]">
                من (Subject) + قاوە (Object) + دەخۆمەوە (Verb).
              </p>
              <p className="text-xs font-bold text-[#777777] mt-1">
                Min qawe dexomewe. (I drink coffee.)
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-extrabold text-[#1899D6]">
              <Sparkles className="h-4 w-4" />
              <span>Tip: Suffix pronouns (-m, -t, -y) attach to the ends of words!</span>
            </div>
          </div>
        </section>
      </main>

      {/* Right Column (Desktop Sticky with HUD pills) */}
      <RightSidebar
        currentStreak={stats.currentStreak}
        totalXp={stats.totalXp}
        completedLessonsCount={Math.floor(stats.totalXp / 10)}
        signedIn={stats.signedIn}
        hearts={stats.hearts}
      />
    </div>
  );
}

export default function GuidebookPage() {
  const { hasConvex } = useAppConfig();

  if (!hasConvex) {
    return <ConfigRequired missing="NEXT_PUBLIC_CONVEX_URL" />;
  }

  return (
    <ErrorBoundary>
      <GuidebookInner />
    </ErrorBoundary>
  );
}
