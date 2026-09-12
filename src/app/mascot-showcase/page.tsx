"use client";

import React, { useState, useEffect } from "react";
import { SquirrelMascot, MascotMood, MascotAccessory } from "@/components/duo/SquirrelMascot";
import { SquirrelAvatar } from "@/components/duo/SquirrelAvatar";
import { SquirrelMotivationCard } from "@/components/duo/SquirrelMotivationCard";
import { FeedbackBanner } from "@/components/lesson/FeedbackBanner";
import { LessonComplete } from "@/components/lesson/LessonComplete";
import { Sun, Moon, Award, Sparkles, MessageSquare } from "lucide-react";

export default function MascotShowcasePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "lesson-complete" | "banners">("overview");
  const [isDark, setIsDark] = useState(true);
  const [bannerState, setBannerState] = useState<"correct" | "incorrect">("correct");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as any;
      if (tabParam === "lesson-complete" || tabParam === "banners" || tabParam === "overview") {
        setActiveTab(tabParam);
      }
      const themeParam = params.get("theme");
      if (themeParam === "light") {
        setIsDark(false);
      }
      const bannerParam = params.get("banner");
      if (bannerParam === "incorrect") {
        setBannerState("incorrect");
      }
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const moods: { mood: MascotMood; label: string; ku: string; accessory?: MascotAccessory }[] = [
    { mood: "idle", label: "Idle / Friendly", ku: "ئارام", accessory: "none" },
    { mood: "happy", label: "Happy / Beaming", ku: "دڵخۆش", accessory: "none" },
    { mood: "celebrating", label: "Celebrating / Golden Acorn", ku: "ئاهەنگگێڕان", accessory: "golden_acorn" },
    { mood: "cheering", label: "Cheering / High-Five", ku: "هاندان", accessory: "none" },
    { mood: "thinking", label: "Thinking / Curious", ku: "بیرکردنەوە", accessory: "none" },
    { mood: "sad", label: "Comforting / Sad", ku: "دڵنەوایی", accessory: "none" },
    { mood: "fire", label: "Streak Fire / Sunglasses", ku: "ئاگرین", accessory: "sunglasses" },
    { mood: "sleeping", label: "Sleeping / Snoozing", ku: "نووستوو", accessory: "none" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#131F24] text-[#4B4B4B] dark:text-white p-6 sm:p-10 font-sans transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header with Navigation Pills and Light/Dark Switch */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#E5E5E5] dark:border-[#37464F] pb-6">
          <div className="flex items-center gap-3.5">
            <SquirrelAvatar size={48} mood="happy" variant="green" shape="rounded" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[#58CC02]">
                  Smorik (سمۆڕە)
                </h1>
                <span className="rounded-md bg-[#FFF4E5] dark:bg-[#341F05] px-2 py-0.5 text-[10px] font-extrabold text-[#FF9600]">
                  Duolingo Mascot DNA
                </span>
              </div>
              <p className="text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                Interactive Kurdish-English Language Mascot for Fêrbe
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Tabs */}
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#58CC02] text-white shadow-sm"
                  : "bg-[#F7F7F7] dark:bg-[#202F36] text-[#777777] dark:text-[#8495A0]"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("lesson-complete")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "lesson-complete"
                  ? "bg-[#FFC800] text-[#3E1F08] shadow-sm"
                  : "bg-[#F7F7F7] dark:bg-[#202F36] text-[#777777] dark:text-[#8495A0]"
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Lesson Complete</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("banners")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === "banners"
                  ? "bg-[#1CB0F6] text-white shadow-sm"
                  : "bg-[#F7F7F7] dark:bg-[#202F36] text-[#777777] dark:text-[#8495A0]"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Feedback Banners</span>
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-2 rounded-2xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-[#F7F7F7] dark:bg-[#202F36] px-3.5 py-2 text-xs font-extrabold uppercase tracking-wide cursor-pointer"
            >
              {isDark ? (
                <>
                  <Sun className="h-4 w-4 text-[#FFC800]" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-[#3BC0F8]" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* 8 Dynamic Mascot Moods */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold uppercase tracking-wider text-[#777777] dark:text-[#8495A0]">
                  1. All 8 Mascot Mood States
                </h2>
                <span className="text-xs font-bold text-[#58CC02]">Pure 100% SVG Vectors</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {moods.map(({ mood, label, ku, accessory }) => (
                  <div
                    key={mood}
                    className="flex flex-col items-center justify-between rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1B272D] p-5 text-center shadow-xs transition-transform hover:scale-[1.02]"
                  >
                    <div className="h-28 flex items-center justify-center">
                      <SquirrelMascot
                        mood={mood}
                        accessory={accessory}
                        size={92}
                        animate
                        interactive
                        title={`Smorik ${label}`}
                      />
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-extrabold uppercase tracking-wide text-[#4B4B4B] dark:text-white">
                        {mood}
                      </div>
                      <div className="font-kurdish text-xs font-bold text-[#58CC02] kurdish-word">
                        {ku}
                      </div>
                      <div className="text-[10px] text-[#AFAFAF] dark:text-[#8495A0] mt-0.5">
                        {label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Accessories & Sizing */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Accessories */}
              <div className="rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1B272D] p-5 space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF] dark:text-[#8495A0]">
                  Accessories
                </h3>
                <div className="flex flex-wrap items-center justify-around gap-2 pt-1">
                  <div className="flex flex-col items-center">
                    <SquirrelMascot mood="idle" accessory="acorn" size={64} animate interactive />
                    <span className="text-[11px] font-extrabold mt-1">Oak Acorn (بەڕوو)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <SquirrelMascot mood="idle" accessory="golden_acorn" size={64} animate interactive />
                    <span className="text-[11px] font-extrabold mt-1">Golden Acorn</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <SquirrelMascot mood="idle" accessory="sunglasses" size={64} animate interactive />
                    <span className="text-[11px] font-extrabold mt-1">Sunglasses</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <SquirrelMascot mood="idle" accessory="party_hat" size={64} animate interactive />
                    <span className="text-[11px] font-extrabold mt-1">Party Hat</span>
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1B272D] p-5 space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF] dark:text-[#8495A0]">
                  Size Presets
                </h3>
                <div className="flex items-end justify-around gap-2 pt-1">
                  <div className="flex flex-col items-center">
                    <SquirrelMascot mood="happy" size="xs" />
                    <span className="text-[10px] font-bold mt-1 text-[#AFAFAF]">28px (xs)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <SquirrelMascot mood="happy" size="sm" />
                    <span className="text-[10px] font-bold mt-1 text-[#AFAFAF]">40px (sm)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <SquirrelMascot mood="happy" size="md" />
                    <span className="text-[10px] font-bold mt-1 text-[#AFAFAF]">72px (md)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <SquirrelMascot mood="happy" size="lg" />
                    <span className="text-[10px] font-bold mt-1 text-[#AFAFAF]">128px (lg)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Motivation Card & Speech Bubbles */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF] dark:text-[#8495A0] mb-2">
                  Motivation Widget (Sidebar Integration)
                </h3>
                <SquirrelMotivationCard />
              </div>

              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF] dark:text-[#8495A0] mb-2">
                  Bilingual Speech Bubble
                </h3>
                <div className="rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1B272D] p-6 flex flex-col items-center justify-center">
                  <SquirrelMascot
                    mood="cheering"
                    size={84}
                    animate
                    interactive
                    speechBubble={{
                      text: "Kurdish pronunciation is easy with repetition!",
                      textKu: "بێژەکردنی کوردی بە دووبارەکردنەوە ئاسان دەبێت!",
                      position: "top",
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: LESSON COMPLETE CELEBRATION */}
        {activeTab === "lesson-complete" && (
          <div className="rounded-3xl border-2 border-[#58CC02]/40 bg-white dark:bg-[#131F24] p-4 sm:p-8 shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <LessonComplete
              lessonTitle="Basics · Lesson 1: Slaw (سڵاو)"
              xpEarned={15}
              accuracyPct={100}
              currentStreak={5}
              totalXp={245}
            />
          </div>
        )}

        {/* TAB 3: FEEDBACK BANNERS */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold uppercase tracking-wider text-[#777777] dark:text-[#8495A0]">
                Interactive Feedback Banners
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBannerState("correct")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                    bannerState === "correct"
                      ? "bg-[#58CC02] text-white"
                      : "bg-[#F7F7F7] dark:bg-[#202F36] text-[#777777] dark:text-[#8495A0]"
                  }`}
                >
                  Correct (Awesome!)
                </button>
                <button
                  type="button"
                  onClick={() => setBannerState("incorrect")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                    bannerState === "incorrect"
                      ? "bg-[#FF4B4B] text-white"
                      : "bg-[#F7F7F7] dark:bg-[#202F36] text-[#777777] dark:text-[#8495A0]"
                  }`}
                >
                  Incorrect (Encouraging)
                </button>
              </div>
            </div>

            <div className="rounded-3xl border-2 border-dashed border-[#E5E5E5] dark:border-[#37464F] p-8 text-center text-sm font-bold text-[#777777] dark:text-[#8495A0]">
              The feedback banner is anchored at the bottom of the screen with Smorik mascot reaction icon!
            </div>
          </div>
        )}
      </div>

      {/* Persistent Bottom Feedback Banner (Only visible on banners tab) */}
      {activeTab === "banners" && (
        <FeedbackBanner
          visible={true}
          correct={bannerState === "correct"}
          correctSolution="سڵاو، چۆنی؟ باشم سوپاس"
          solutionIsKurdish={true}
          onContinue={() => {}}
        />
      )}
    </div>
  );
}
