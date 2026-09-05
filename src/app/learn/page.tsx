"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { WordFlashcard, WordItem } from "@/components/WordFlashcard";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Trophy,
  Volume2,
  Database,
} from "lucide-react";

// Mock words fallback to ensure immediate rendering in any environment
const FALLBACK_WORDS: WordItem[] = [
  {
    _id: "mock_1",
    kurdishText: "سڵاو",
    englishText: "Hello",
    transliteration: "Slaw",
    imageUrl:
      "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&auto=format&fit=crop&q=80",
    kurdishAudioUrl: "/audio/slaw.mp3",
    englishAudioUrl: "/audio/hello.mp3",
    isMastered: false,
    order: 1,
  },
  {
    _id: "mock_2",
    kurdishText: "سوپاس",
    englishText: "Thank you",
    transliteration: "Supas",
    imageUrl:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    kurdishAudioUrl: "/audio/supas.mp3",
    englishAudioUrl: "/audio/thank_you.mp3",
    isMastered: false,
    order: 2,
  },
  {
    _id: "mock_3",
    kurdishText: "بەیانی باش",
    englishText: "Good morning",
    transliteration: "Beyanî bash",
    imageUrl:
      "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600&auto=format&fit=crop&q=80",
    kurdishAudioUrl: "/audio/beyani_bash.mp3",
    englishAudioUrl: "/audio/good_morning.mp3",
    isMastered: false,
    order: 3,
  },
  {
    _id: "mock_4",
    kurdishText: "ئاو",
    englishText: "Water",
    transliteration: "Aw",
    imageUrl:
      "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80",
    kurdishAudioUrl: "/audio/aw.mp3",
    englishAudioUrl: "/audio/water.mp3",
    isMastered: false,
    order: 4,
  },
  {
    _id: "mock_5",
    kurdishText: "نان",
    englishText: "Bread",
    transliteration: "Nan",
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    kurdishAudioUrl: "/audio/nan.mp3",
    englishAudioUrl: "/audio/bread.mp3",
    isMastered: false,
    order: 5,
  },
];

export default function LearnPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [localFallbackWords, setLocalFallbackWords] =
    useState<WordItem[]>(FALLBACK_WORDS);

  // Centralized audio engine: pass currentIndex so card navigation immediately cancels playback
  const { play, isPlayingUrl } = useAudioPlayer(currentIndex);

  // Convex Query: in-memory joined words with isMastered
  const convexWords = useQuery(api.words.getWordsWithProgress, {
    categorySlug: "basics",
  });

  // Convex Mutations
  const toggleMasteredMutation = useMutation(api.words.toggleMastered);
  const seedMutation = useMutation(api.words.seed);

  // Active dataset: Convex live data if loaded and non-empty, otherwise fallback
  const isConvexLive = Boolean(convexWords && convexWords.length > 0);
  const words: WordItem[] = isConvexLive
    ? (convexWords as unknown as WordItem[])
    : localFallbackWords;

  const currentWord = words[currentIndex] || words[0];
  const masteredCount = words.filter((w) => w.isMastered).length;
  const progressPercent =
    words.length > 0 ? Math.round((masteredCount / words.length) * 100) : 0;

  // Auto-seed if Convex is connected but has 0 words
  useEffect(() => {
    if (convexWords !== undefined && convexWords.length === 0) {
      seedMutation().catch((err) => {
        console.warn("Auto seed notice:", err);
      });
    }
  }, [convexWords, seedMutation]);

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(words.length - 1, prev + 1));
  }, [words.length]);

  // Toggle Mastered Mutation
  // MANDATORY: Do NOT pass userId as a client argument!
  const handleToggleMastered = useCallback(async () => {
    if (!currentWord) return;

    // If Convex is live, invoke mutation with ONLY wordId
    if (isConvexLive) {
      try {
        startTransition(async () => {
          await toggleMasteredMutation({
            wordId: currentWord._id as any,
          });
        });
      } catch (err) {
        console.error("Failed to mutate userProgress in Convex:", err);
      }
    } else {
      // Local optimistic state for preview mode
      setLocalFallbackWords((prev) =>
        prev.map((w, idx) =>
          idx === currentIndex ? { ...w, isMastered: !w.isMastered } : w
        )
      );
    }
  }, [currentWord, isConvexLive, toggleMasteredMutation, currentIndex]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === " " && currentWord) {
        e.preventDefault();
        play(currentWord.kurdishAudioUrl);
      } else if ((e.key === "m" || e.key === "M") && currentWord) {
        e.preventDefault();
        handleToggleMastered();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext, currentWord, play, handleToggleMastered]);

  const handleSeedDatabase = async () => {
    try {
      await seedMutation();
    } catch (err) {
      console.error("Failed to seed database:", err);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12 flex flex-col gap-6">
      {/* Top Header & Mastery Progress */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Basics
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Word {currentIndex + 1} of {words.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span>
              {masteredCount}/{words.length} Mastered
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Active Word Flashcard */}
      {currentWord ? (
        <WordFlashcard
          word={currentWord}
          isPlayingKurdish={isPlayingUrl(currentWord.kurdishAudioUrl)}
          isPlayingEnglish={isPlayingUrl(currentWord.englishAudioUrl)}
          onPlayKurdish={() => play(currentWord.kurdishAudioUrl)}
          onPlayEnglish={() => play(currentWord.englishAudioUrl)}
          onToggleMastered={handleToggleMastered}
          isTogglingMastered={isPending}
        />
      ) : (
        <div className="h-72 rounded-2xl border border-dashed border-border flex items-center justify-center text-muted-foreground">
          Loading word...
        </div>
      )}

      {/* Navigation Controls (Constraint 5) */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1 rounded-xl h-12 gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-muted/60 rounded-xl text-xs font-mono font-medium text-muted-foreground">
          <span>{currentIndex + 1}</span>
          <span>/</span>
          <span>{words.length}</span>
        </div>

        <Button
          type="button"
          variant="default"
          size="lg"
          onClick={handleNext}
          disabled={currentIndex === words.length - 1}
          className="flex-1 rounded-xl h-12 gap-2"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Controls helper & Seeder */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Shortcuts:</span>
          <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50">
            ← Prev
          </span>
          <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50">
            → Next
          </span>
          <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50">
            Space: Listen
          </span>
          <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50">
            M: Master
          </span>
        </div>

        <button
          type="button"
          onClick={handleSeedDatabase}
          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline opacity-80 hover:opacity-100"
        >
          <Database className="h-3 w-3" />
          <span>Seed Convex Basics</span>
        </button>
      </div>
    </div>
  );
}
