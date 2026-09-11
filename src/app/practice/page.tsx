"use client";

import { useState, useEffect, useCallback, useMemo, useTransition } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { WordFlashcard, WordItem } from "@/components/WordFlashcard";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { generateQuizOptions } from "@/lib/quiz";
import { hashString } from "@/lib/seededShuffle";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired, ErrorBoundary } from "@/components/states/ScreenState";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
  CheckCircle2,
  RefreshCw,
  BookOpen,
  BrainCircuit,
} from "lucide-react";

function PracticeInner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [studyMode, setStudyMode] = useState<"browse" | "quiz">("browse");
  const [, startTransition] = useTransition();

  // Convex query: in-memory joined words with the signed-in user's mastery.
  // When the backend is unreachable or the user is signed out, this query
  // errors and the surrounding ErrorBoundary renders an honest state —
  // there is deliberately no mock fallback data.
  const convexWords = useQuery(api.words.getWordsWithProgress, {
    categorySlug: "basics",
  }) as WordItem[] | undefined;

  const toggleMasteredMutation = useMutation(api.words.toggleMastered);
  const setWordMasteryMutation = useMutation(api.words.setWordMastery);
  const resetCategoryProgressMutation = useMutation(
    api.words.resetCategoryProgress
  );

  const words: WordItem[] = useMemo(() => convexWords ?? [], [convexWords]);
  const currentWord = words[currentIndex] ?? words[0];
  const masteredCount = words.filter((w) => w.isMastered).length;
  const progressPercent =
    words.length > 0 ? Math.round((masteredCount / words.length) * 100) : 0;

  const { play, isPlayingUrl, isAudioUnavailable } = useAudioPlayer(currentIndex);

  // Options are derived deterministically per word (seeded shuffle) so they
  // stay stable across re-renders without state-in-effect patterns.
  const quizOptions = useMemo(() => {
    if (!currentWord) return [] as string[];
    return generateQuizOptions(
      currentWord.englishText,
      words,
      hashString(currentWord._id)
    );
  }, [currentWord, words]);

  // Per-card answer state, keyed by word id: navigation implicitly resets it
  // (derived per card below) - no state-reset effects needed.
  const [answer, setAnswer] = useState<{
    wordId: string;
    selected: string | null;
    isAnswered: boolean;
    isCorrect: boolean | null;
  } | null>(null);
  const cardAnswer =
    answer && currentWord && answer.wordId === currentWord._id ? answer : null;
  const selectedOption = cardAnswer?.selected ?? null;
  const isAnswered = cardAnswer?.isAnswered ?? false;
  const isCorrect = cardAnswer?.isCorrect ?? null;


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

  const handleReviewAgain = useCallback(() => {
    setCurrentIndex(0);
    setIsSessionFinished(false);
  }, []);

  const handleResetProgress = useCallback(() => {
    startTransition(async () => {
      await resetCategoryProgressMutation({ categorySlug: "basics" });
    });
    setCurrentIndex(0);
    setIsSessionFinished(false);
  }, [resetCategoryProgressMutation]);

  const handleToggleMastered = useCallback(() => {
    if (!currentWord) return;
    startTransition(async () => {
      await toggleMasteredMutation({ wordId: currentWord._id as Id<"words"> });
    });
  }, [currentWord, toggleMasteredMutation]);

  const handleSelectOption = useCallback(
    (option: string) => {
      if (isAnswered || !currentWord) return;

      const isAnswerCorrect =
        option.toLowerCase().trim() ===
        currentWord.englishText.toLowerCase().trim();

      setAnswer({
        wordId: currentWord._id,
        selected: option,
        isAnswered: true,
        isCorrect: isAnswerCorrect,
      });

      startTransition(async () => {
        await setWordMasteryMutation({
          wordId: currentWord._id as Id<"words">,
          isMastered: isAnswerCorrect,
        });
      });
    },
    [isAnswered, currentWord, setWordMasteryMutation]
  );

  // Keyboard shortcuts
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

      if (studyMode === "quiz" && !isAnswered && quizOptions.length > 0) {
        const numeric: Record<string, number> = {
          "1": 0,
          "2": 1,
          "3": 2,
          "4": 3,
        };
        if (e.key in numeric && quizOptions[numeric[e.key]]) {
          e.preventDefault();
          handleSelectOption(quizOptions[numeric[e.key]]);
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

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 py-6 sm:py-10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Basics · Practice
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {isSessionFinished
                ? "Session Completed"
                : `Word ${currentIndex + 1} of ${words.length}`}
            </span>
          </div>

          <div className="flex items-center rounded-xl border border-border/60 bg-muted p-1">
            <button
              type="button"
              onClick={() => setStudyMode("browse")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
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
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                studyMode === "quiz"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BrainCircuit className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Quiz</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Mastery</span>
            <div className="flex items-center gap-1">
              <Trophy className="h-3 w-3 text-amber-500" />
              <span>
                {masteredCount} of {words.length} ({progressPercent}%)
              </span>
            </div>
          </div>
          <Progress
            value={isSessionFinished ? 100 : progressPercent}
            className="h-2"
          />
        </div>
      </div>

      {isSessionFinished ? (
        <Card className="overflow-hidden border-border/80 bg-card">
          <CardContent className="flex flex-col items-center gap-6 p-8 text-center sm:p-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Trophy className="h-10 w-10" />
            </div>
            <div>
              <Badge variant="success" className="px-3 py-1 text-xs">
                Deck Completed
              </Badge>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                Fantastic Work!
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You reviewed all {words.length} words. Continue with a lesson to
                earn XP.
              </p>
            </div>
            <div className="flex w-full max-w-md flex-col items-center gap-3 pt-2 sm:flex-row">
              <Button
                type="button"
                size="lg"
                onClick={handleReviewAgain}
                className="h-12 w-full gap-2 rounded-xl font-semibold sm:flex-1"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Review Again</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleResetProgress}
                className="h-12 w-full gap-2 rounded-xl text-muted-foreground hover:text-destructive hover:border-destructive/40 sm:flex-1"
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
        />
      ) : (
        <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground">
          No words available — seed the database with{" "}
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            npm run seed
          </code>
        </div>
      )}

      {!isSessionFinished ? (
        <div className="flex items-center justify-between gap-4 pt-1">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="h-12 flex-1 gap-2 rounded-xl"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center gap-1.5 rounded-xl bg-muted/60 px-3 py-1 font-mono text-xs font-medium text-muted-foreground">
            <span>{currentIndex + 1}</span>
            <span>/</span>
            <span>{words.length}</span>
          </div>

          <Button
            type="button"
            variant={currentIndex === words.length - 1 ? "subtle" : "default"}
            size="lg"
            onClick={handleNext}
            className="h-12 flex-1 gap-2 rounded-xl font-semibold"
          >
            <span>{currentIndex === words.length - 1 ? "Finish" : "Next"}</span>
            {currentIndex === words.length - 1 ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center gap-2 px-1 text-xs text-muted-foreground">
        <span>Shortcuts:</span>
        {studyMode === "quiz" ? (
          <span className="rounded border border-border/50 bg-muted px-1.5 py-0.5 text-[11px]">
            1-4: Options
          </span>
        ) : null}
        <span className="rounded border border-border/50 bg-muted px-1.5 py-0.5 text-[11px]">
          ←/→: Nav
        </span>
        <span className="rounded border border-border/50 bg-muted px-1.5 py-0.5 text-[11px]">
          Space: Audio
        </span>
        <span className="rounded border border-border/50 bg-muted px-1.5 py-0.5 text-[11px]">
          M: Master
        </span>
      </div>
    </div>
  );
}

import { KurdishAlphabetView } from "@/components/practice/KurdishAlphabetView";
import { Sparkles } from "lucide-react";

export default function PracticePage() {
  const { hasConvex } = useAppConfig();
  const [activeTab, setActiveTab] = useState<"letters" | "vocabulary">("letters");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      {/* Top Segmented Practice Switcher */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("letters")}
          className={`flex items-center gap-2 rounded-2xl border-b-4 px-5 py-3 text-sm font-extrabold uppercase tracking-wide transition-all active:translate-y-[2px] active:border-b-2 ${
            activeTab === "letters"
              ? "border-[#1899D6] bg-[#1CB0F6] text-white shadow-sm"
              : "border-[#E5E5E5] bg-white text-[#777777] hover:bg-[#F7F7F7]"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Kurdish Alphabet & Sounds</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("vocabulary")}
          className={`flex items-center gap-2 rounded-2xl border-b-4 px-5 py-3 text-sm font-extrabold uppercase tracking-wide transition-all active:translate-y-[2px] active:border-b-2 ${
            activeTab === "vocabulary"
              ? "border-[#58A700] bg-[#58CC02] text-white shadow-sm"
              : "border-[#E5E5E5] bg-white text-[#777777] hover:bg-[#F7F7F7]"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Vocabulary Flashcards</span>
        </button>
      </div>

      {activeTab === "letters" ? (
        <KurdishAlphabetView />
      ) : !hasConvex ? (
        <ConfigRequired missing="NEXT_PUBLIC_CONVEX_URL" />
      ) : (
        <ErrorBoundary>
          <PracticeInner />
        </ErrorBoundary>
      )}
    </div>
  );
}
