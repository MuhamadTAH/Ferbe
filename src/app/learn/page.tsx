"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { WordFlashcard, WordItem } from "@/components/WordFlashcard";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { generateQuizOptions } from "@/lib/quiz";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  Database,
  RefreshCw,
  BookOpen,
  BrainCircuit,
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
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [studyMode, setStudyMode] = useState<"browse" | "quiz">("browse");
  const [isPending, startTransition] = useTransition();
  const [localFallbackWords, setLocalFallbackWords] =
    useState<WordItem[]>(FALLBACK_WORDS);

  // Stable Quiz State strictly keyed to card transition
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Centralized audio engine: pass currentIndex so card navigation immediately cancels playback
  const { play, isPlayingUrl, isAudioUnavailable } =
    useAudioPlayer(currentIndex);

  // Convex Query: in-memory joined words with isMastered
  const convexWords = useQuery(api.words.getWordsWithProgress, {
    categorySlug: "basics",
  });

  // Convex Mutations
  const toggleMasteredMutation = useMutation(api.words.toggleMastered);
  const setWordMasteryMutation = useMutation(api.words.setWordMastery);
  const resetCategoryProgressMutation = useMutation(
    api.words.resetCategoryProgress
  );
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

  // MANDATORY: Stable Options
  // Options for Quiz Mode must be set in state strictly on card transition keyed to currentWord._id.
  // Never re-shuffle during ordinary component re-renders!
  useEffect(() => {
    if (!currentWord) return;
    const options = generateQuizOptions(currentWord.englishText, words);
    setQuizOptions(options);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
  }, [currentWord?._id, words]);

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
    if (currentIndex >= words.length - 1) {
      setIsSessionFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, words.length]);

  // Review Again: restarts from word 1 while preserving current progress
  const handleReviewAgain = useCallback(() => {
    setCurrentIndex(0);
    setIsSessionFinished(false);
  }, []);

  // Reset Progress: unmasters all words in the category
  const handleResetProgress = useCallback(async () => {
    if (isConvexLive) {
      try {
        startTransition(async () => {
          await resetCategoryProgressMutation({ categorySlug: "basics" });
        });
      } catch (err) {
        console.error("Failed to reset category progress in Convex:", err);
      }
    } else {
      setLocalFallbackWords((prev) =>
        prev.map((w) => ({ ...w, isMastered: false }))
      );
    }
    setCurrentIndex(0);
    setIsSessionFinished(false);
  }, [isConvexLive, resetCategoryProgressMutation]);

  // Toggle Mastered Mutation (Browse Mode switch)
  const handleToggleMastered = useCallback(async () => {
    if (!currentWord) return;

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
      setLocalFallbackWords((prev) =>
        prev.map((w, idx) =>
          idx === currentIndex ? { ...w, isMastered: !w.isMastered } : w
        )
      );
    }
  }, [currentWord, isConvexLive, toggleMasteredMutation, currentIndex]);

  // MANDATORY: Quiz Answer Selection & Mastery Demotion Logic
  // If user selects correct answer: mark mastered.
  // If user selects wrong answer for a word previously marked mastered: demote to false!
  const handleSelectOption = useCallback(
    async (option: string) => {
      if (isAnswered || !currentWord) return;

      const isAnswerCorrect =
        option.toLowerCase().trim() === currentWord.englishText.toLowerCase().trim();

      setSelectedOption(option);
      setIsAnswered(true);
      setIsCorrect(isAnswerCorrect);

      if (isAnswerCorrect) {
        // Promote to mastered if not already mastered
        if (!currentWord.isMastered) {
          if (isConvexLive) {
            try {
              startTransition(async () => {
                await setWordMasteryMutation({
                  wordId: currentWord._id as any,
                  isMastered: true,
                });
              });
            } catch (err) {
              console.error("Failed to promote mastery in Convex:", err);
            }
          } else {
            setLocalFallbackWords((prev) =>
              prev.map((w) =>
                w._id === currentWord._id ? { ...w, isMastered: true } : w
              )
            );
          }
        }
      } else {
        // MANDATORY: Demote mastery if user fails a previously mastered word
        if (currentWord.isMastered) {
          if (isConvexLive) {
            try {
              startTransition(async () => {
                await setWordMasteryMutation({
                  wordId: currentWord._id as any,
                  isMastered: false,
                });
              });
            } catch (err) {
              console.error("Failed to demote mastery in Convex:", err);
            }
          } else {
            setLocalFallbackWords((prev) =>
              prev.map((w) =>
                w._id === currentWord._id ? { ...w, isMastered: false } : w
              )
            );
          }
        }
      }
    },
    [isAnswered, currentWord, isConvexLive, setWordMasteryMutation]
  );

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (isSessionFinished) {
        if (e.key === "Enter" || e.key === "r" || e.key === "R") {
          e.preventDefault();
          handleReviewAgain();
        }
        return;
      }

      // Quiz mode number shortcuts: 1, 2, 3, 4
      if (studyMode === "quiz" && !isAnswered && quizOptions.length > 0) {
        if (e.key === "1" && quizOptions[0]) {
          e.preventDefault();
          handleSelectOption(quizOptions[0]);
          return;
        }
        if (e.key === "2" && quizOptions[1]) {
          e.preventDefault();
          handleSelectOption(quizOptions[1]);
          return;
        }
        if (e.key === "3" && quizOptions[2]) {
          e.preventDefault();
          handleSelectOption(quizOptions[2]);
          return;
        }
        if (e.key === "4" && quizOptions[3]) {
          e.preventDefault();
          handleSelectOption(quizOptions[3]);
          return;
        }
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === " " && currentWord) {
        e.preventDefault();
        if (currentWord.kurdishAudioUrl) {
          play(currentWord.kurdishAudioUrl);
        }
      } else if ((e.key === "m" || e.key === "M") && currentWord) {
        e.preventDefault();
        handleToggleMastered();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handlePrevious,
    handleNext,
    currentWord,
    play,
    handleToggleMastered,
    isSessionFinished,
    handleReviewAgain,
    studyMode,
    isAnswered,
    quizOptions,
    handleSelectOption,
  ]);

  const handleSeedDatabase = async () => {
    try {
      await seedMutation();
    } catch (err) {
      console.error("Failed to seed database:", err);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-6 sm:py-10 flex flex-col gap-5">
      {/* Top Header Controls: Mode Selector & Category Progress */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Basics
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {isSessionFinished
                ? "Session Completed"
                : `Word ${currentIndex + 1} of ${words.length}`}
            </span>
          </div>

          {/* Flashcard / Quiz Mode Segmented Toggle Switch */}
          <div className="flex items-center rounded-xl bg-muted p-1 border border-border/60">
            <button
              type="button"
              onClick={() => setStudyMode("browse")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                studyMode === "browse"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Browse</span>
            </button>

            <button
              type="button"
              onClick={() => setStudyMode("quiz")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                studyMode === "quiz"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BrainCircuit className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Quiz Mode</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar & Score Counter */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Progress</span>
            <div className="flex items-center gap-1">
              <Trophy className="h-3 w-3 text-amber-500" />
              <span>
                {masteredCount} of {words.length} Mastered ({progressPercent}%)
              </span>
            </div>
          </div>
          <Progress
            value={isSessionFinished ? 100 : progressPercent}
            className="h-2"
          />
        </div>
      </div>

      {/* Completion Card or Active Flashcard */}
      {isSessionFinished ? (
        <Card className="overflow-hidden border-border/80 bg-card shadow-xl animate-in fade-in zoom-in-95 duration-300">
          <CardContent className="p-8 sm:p-10 flex flex-col items-center text-center gap-6">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-inner">
              <Trophy className="h-10 w-10 animate-bounce" />
              <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-white shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center justify-center gap-2">
                <Badge variant="success" className="px-3 py-1 text-xs">
                  Deck Completed
                </Badge>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Fantastic Work!
              </h2>
              <p
                dir="rtl"
                className="font-kurdish text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1"
              >
                دەستت خۆش بێت!
              </p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                You reviewed all words in the Basics category. Here is your session summary:
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50 border border-border/60">
                <span className="text-xs text-muted-foreground">Reviewed</span>
                <span className="text-2xl font-bold text-foreground">
                  {words.length}
                </span>
                <span className="text-[11px] text-muted-foreground">words</span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40">
                <span className="text-xs text-emerald-700 dark:text-emerald-300">Mastered</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {masteredCount}
                </span>
                <span className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">words</span>
              </div>

              <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50 border border-border/60">
                <span className="text-xs text-muted-foreground">Score</span>
                <span className="text-2xl font-bold text-foreground">
                  {progressPercent}%
                </span>
                <span className="text-[11px] text-muted-foreground">mastery</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
              <Button
                type="button"
                variant="default"
                size="lg"
                onClick={handleReviewAgain}
                className="w-full sm:flex-1 h-12 rounded-xl gap-2 font-semibold shadow-md"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Review Again</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleResetProgress}
                className="w-full sm:flex-1 h-12 rounded-xl gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/40"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset Progress</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : currentWord ? (
        <WordFlashcard
          word={currentWord}
          mode={studyMode}
          quizOptions={quizOptions}
          selectedOption={selectedOption}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
          onSelectOption={handleSelectOption}
          isPlayingKurdish={isPlayingUrl(currentWord.kurdishAudioUrl)}
          isPlayingEnglish={isPlayingUrl(currentWord.englishAudioUrl)}
          isKurdishUnavailable={isAudioUnavailable(currentWord.kurdishAudioUrl)}
          isEnglishUnavailable={isAudioUnavailable(currentWord.englishAudioUrl)}
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

      {/* Navigation Controls (when session is active) */}
      {!isSessionFinished && (
        <div className="flex items-center justify-between gap-4 pt-1">
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
            variant={currentIndex === words.length - 1 ? "subtle" : "default"}
            size="lg"
            onClick={handleNext}
            className="flex-1 rounded-xl h-12 gap-2 font-semibold"
          >
            <span>{currentIndex === words.length - 1 ? "Finish" : "Next"}</span>
            {currentIndex === words.length - 1 ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Controls helper & Seeder */}
      <div className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="hidden sm:inline">Shortcuts:</span>
          {studyMode === "quiz" && (
            <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50 text-[11px]">
              1-4: Options
            </span>
          )}
          <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50 text-[11px]">
            ← / →: Nav
          </span>
          <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50 text-[11px]">
            Space: Audio
          </span>
          <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50 text-[11px]">
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
