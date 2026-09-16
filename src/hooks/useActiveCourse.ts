"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface CourseMeta {
  slug: string;
  title: string;
  nativeTitle: string;
  shortLabel: string;
  flagType: "kurdish" | "uk";
  sourceLanguage: string;
  targetLanguage: string;
  description: string;
}

export const AVAILABLE_COURSES: CourseMeta[] = [
  {
    slug: "english-from-kurdish",
    title: "English for Kurdish Speakers",
    nativeTitle: "ئینگلیزی بۆ کورد",
    shortLabel: "English",
    flagType: "uk",
    sourceLanguage: "ckb",
    targetLanguage: "en",
    description: "Learn English vocabulary, grammar, and sentences with Kurdish instructions.",
  },
  {
    slug: "mohammed-mahdi-english",
    title: "Mohammed Mahdi English Course",
    nativeTitle: "ئینگلیزی لەگەڵ محەمەد مەهدی",
    shortLabel: "MM English",
    flagType: "uk",
    sourceLanguage: "ckb",
    targetLanguage: "en",
    description: "Master conversational English from Kurdish with Mohammed Mahdi. 5 levels of interactive dialogues, acoustic matching, and speech production.",
  },
];

const STORAGE_KEY = "ferbe_active_course";
const EVENT_NAME = "ferbe_course_change";

export function useActiveCourse() {
  const router = useRouter();
  const [activeCourseSlug, setActiveCourseSlug] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlParam = params.get("course");
        if (urlParam && AVAILABLE_COURSES.some((c) => c.slug === urlParam)) {
          return urlParam;
        }
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && AVAILABLE_COURSES.some((c) => c.slug === stored)) {
          return stored;
        }
      } catch {
        // ignore storage errors
      }
    }
    return "english-from-kurdish";
  });

  const syncCourse = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get("course");
      if (urlParam && AVAILABLE_COURSES.some((c) => c.slug === urlParam)) {
        setActiveCourseSlug(urlParam);
        localStorage.setItem(STORAGE_KEY, urlParam);
        return;
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && AVAILABLE_COURSES.some((c) => c.slug === stored)) {
        setActiveCourseSlug(stored);
      }
    } catch {
      // ignore storage access errors
    }
  }, []);

  useEffect(() => {
    syncCourse();

    const handleCourseChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail && AVAILABLE_COURSES.some((c) => c.slug === customEvent.detail)) {
        setActiveCourseSlug(customEvent.detail);
      }
    };

    window.addEventListener(EVENT_NAME, handleCourseChange);
    window.addEventListener("popstate", syncCourse);
    return () => {
      window.removeEventListener(EVENT_NAME, handleCourseChange);
      window.removeEventListener("popstate", syncCourse);
    };
  }, [syncCourse]);

  const selectCourse = useCallback(
    (slug: string, navigateToLearn = true) => {
      if (!AVAILABLE_COURSES.some((c) => c.slug === slug)) return;
      setActiveCourseSlug(slug);
      try {
        localStorage.setItem(STORAGE_KEY, slug);
      } catch {}
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: slug }));
      if (navigateToLearn) {
        router.push(`/learn?course=${slug}`);
      }
    },
    [router]
  );

  const currentCourse =
    AVAILABLE_COURSES.find((c) => c.slug === activeCourseSlug) ?? AVAILABLE_COURSES[0];

  return {
    activeCourseSlug,
    currentCourse,
    courses: AVAILABLE_COURSES,
    selectCourse,
  };
}
