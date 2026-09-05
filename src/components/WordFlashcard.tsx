"use client";

import {
  Volume2,
  VolumeX,
  Check,
  X,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface WordItem {
  _id: string;
  kurdishText: string;
  englishText: string;
  transliteration: string;
  imageUrl: string;
  kurdishAudioUrl?: string | null;
  englishAudioUrl?: string | null;
  isMastered: boolean;
  order?: number;
}

interface WordFlashcardProps {
  word: WordItem;
  mode?: "browse" | "quiz";
  quizOptions?: string[];
  selectedOption?: string | null;
  isAnswered?: boolean;
  isCorrect?: boolean | null;
  onSelectOption?: (option: string) => void;
  isPlayingKurdish: boolean;
  isPlayingEnglish: boolean;
  isKurdishUnavailable?: boolean;
  isEnglishUnavailable?: boolean;
  onPlayKurdish: () => void;
  onPlayEnglish: () => void;
  onToggleMastered: () => void;
  isTogglingMastered?: boolean;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export function WordFlashcard({
  word,
  mode = "browse",
  quizOptions = [],
  selectedOption = null,
  isAnswered = false,
  isCorrect = null,
  onSelectOption,
  isPlayingKurdish,
  isPlayingEnglish,
  isKurdishUnavailable = false,
  isEnglishUnavailable = false,
  onPlayKurdish,
  onPlayEnglish,
  onToggleMastered,
  isTogglingMastered,
}: WordFlashcardProps) {
  const isKurdishDisabled = !word.kurdishAudioUrl || isKurdishUnavailable;
  const isEnglishDisabled = !word.englishAudioUrl || isEnglishUnavailable;
  const isQuizMode = mode === "quiz";

  // In Quiz Mode, strictly unmount translation from DOM until answered
  const showTranslation = !isQuizMode || isAnswered;

  return (
    <Card className="overflow-hidden border-border/80 bg-card shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* Visual Image Header */}
      <div className="relative h-52 sm:h-60 md:h-64 w-full overflow-hidden bg-muted">
        <img
          src={word.imageUrl}
          alt={showTranslation ? word.englishText : "Kurdish word illustration"}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Badge
            variant="outline"
            className="bg-background/90 backdrop-blur-md border-border/60 text-xs font-semibold py-1 px-3 shadow-xs"
          >
            {isQuizMode ? "Active Recall Quiz" : "Basics Category"}
          </Badge>

          {word.isMastered && (
            <Badge
              variant="success"
              className="flex items-center gap-1.5 shadow-sm backdrop-blur-md bg-emerald-500/90 text-white border-0 px-3 py-1 text-xs font-medium"
            >
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              Mastered
            </Badge>
          )}
        </div>

        {/* Card Header Subtle Indicator */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/90 text-xs font-medium drop-shadow-sm">
          <span>{isQuizMode ? "Choose the matching translation" : "Tap audio to listen"}</span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Kurdish Sorani
          </span>
        </div>
      </div>

      <CardContent className="p-6 sm:p-8 flex flex-col gap-5">
        {/* Kurdish Text Container */}
        {/* MANDATORY: Noto Sans Arabic with dir="rtl" ONLY on this container. NO tracking-* classes! */}
        <div className="flex flex-col items-center justify-center text-center pt-1 min-h-[90px]">
          <div
            dir="rtl"
            lang="ku"
            className="font-kurdish text-5xl sm:text-6xl md:text-7xl font-bold leading-normal text-foreground select-none kurdish-word transition-transform duration-200"
          >
            {word.kurdishText}
          </div>

          {/* MANDATORY: No CSS blur cheating. In Quiz Mode, conditionally unmount from DOM completely */}
          {showTranslation ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
              {/* Phonetic Transliteration */}
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1 text-sm sm:text-base font-mono font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                <span className="opacity-60">/</span>
                <span>{word.transliteration}</span>
                <span className="opacity-60">/</span>
              </div>

              {/* English Translation */}
              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground/90">
                {word.englishText}
              </h2>

              {isQuizMode && isAnswered && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold">
                  {isCorrect ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Correct! Marked as Mastered
                    </span>
                  ) : (
                    <span className="text-red-500 dark:text-red-400 flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" />
                      Incorrect. Correct translation revealed
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Static placeholder replacing DOM elements in Quiz mode */
            <div className="mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-muted/70 text-xs text-muted-foreground border border-border/50">
              <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
              <span>Translation hidden • Select from options below</span>
            </div>
          )}
        </div>

        {/* Multiple-Choice Answer Grid (Quiz Mode) */}
        {/* MANDATORY: Explicitly enforce dir="ltr" to isolate English typography from RTL inversion */}
        {isQuizMode && quizOptions.length > 0 && (
          <div dir="ltr" className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {quizOptions.map((option, index) => {
              const isSelected = selectedOption === option;
              const isOptionCorrect = option.toLowerCase() === word.englishText.toLowerCase();

              let variantClasses =
                "border border-border/80 bg-background text-foreground hover:bg-accent hover:border-emerald-500/60";

              if (isAnswered) {
                if (isOptionCorrect) {
                  // Correct answer highlights green
                  variantClasses =
                    "bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/40 font-semibold";
                } else if (isSelected && !isOptionCorrect) {
                  // User's wrong pick highlights red
                  variantClasses =
                    "bg-red-500 text-white border-red-600 shadow-md ring-2 ring-red-500/40 font-semibold animate-shake";
                } else {
                  // Neutral other options
                  variantClasses = "opacity-40 border-border/40 bg-muted/30 text-muted-foreground";
                }
              }

              return (
                <button
                  key={option}
                  type="button"
                  dir="ltr"
                  disabled={isAnswered}
                  onClick={() => onSelectOption?.(option)}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-xl text-sm font-medium transition-all duration-200 text-left active:scale-[0.98] disabled:cursor-default",
                    variantClasses
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold font-mono",
                        isAnswered && isOptionCorrect
                          ? "bg-white/20 text-white"
                          : isAnswered && isSelected
                            ? "bg-white/20 text-white"
                            : "bg-muted text-muted-foreground border border-border/60"
                      )}
                    >
                      {OPTION_LABELS[index] || index + 1}
                    </span>
                    <span className="font-semibold">{option}</span>
                  </div>

                  {isAnswered && isOptionCorrect && (
                    <Check className="h-4 w-4 text-white stroke-[3]" />
                  )}
                  {isAnswered && isSelected && !isOptionCorrect && (
                    <X className="h-4 w-4 text-white stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Audio Triggers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Kurdish Audio Button */}
          <Button
            type="button"
            variant={
              isKurdishDisabled
                ? "secondary"
                : isPlayingKurdish
                  ? "default"
                  : "subtle"
            }
            size="lg"
            onClick={onPlayKurdish}
            disabled={isKurdishDisabled}
            className={cn(
              "relative flex items-center justify-center gap-2.5 h-12 rounded-xl transition-all duration-200",
              isKurdishDisabled &&
                "opacity-60 cursor-not-allowed bg-muted/60 text-muted-foreground border border-border/40",
              !isKurdishDisabled &&
                isPlayingKurdish &&
                "bg-emerald-600 text-white ring-2 ring-emerald-500/50 shadow-md scale-[1.01]",
              !isKurdishDisabled &&
                !isPlayingKurdish &&
                "hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
            )}
          >
            {isKurdishDisabled ? (
              <VolumeX className="h-4 w-4 text-muted-foreground/70" />
            ) : (
              <Volume2
                className={cn(
                  "h-5 w-5 transition-transform",
                  isPlayingKurdish && "animate-pulse text-white"
                )}
              />
            )}
            <div className="flex flex-col items-center sm:items-start text-left leading-tight">
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <span>Kurdish Audio</span>
                <span
                  dir="rtl"
                  className="font-kurdish font-normal text-xs opacity-80"
                >
                  (کوردی)
                </span>
              </div>
              {isKurdishDisabled && (
                <span className="text-[11px] text-muted-foreground/70 font-normal">
                  Audio unavailable
                </span>
              )}
            </div>
            {!isKurdishDisabled && isPlayingKurdish && (
              <span className="flex h-2 w-2 relative ml-auto">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            )}
          </Button>

          {/* English Audio Button (only enabled if allowed in browse mode or after answer revealed) */}
          <Button
            type="button"
            variant={
              isEnglishDisabled || (!showTranslation && isQuizMode)
                ? "secondary"
                : isPlayingEnglish
                  ? "default"
                  : "outline"
            }
            size="lg"
            onClick={onPlayEnglish}
            disabled={isEnglishDisabled || (!showTranslation && isQuizMode)}
            className={cn(
              "relative flex items-center justify-center gap-2.5 h-12 rounded-xl transition-all duration-200",
              (isEnglishDisabled || (!showTranslation && isQuizMode)) &&
                "opacity-60 cursor-not-allowed bg-muted/60 text-muted-foreground border border-border/40",
              !isEnglishDisabled &&
                isPlayingEnglish &&
                "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 ring-2 ring-slate-400/40 shadow-md scale-[1.01]",
              !isEnglishDisabled &&
                !isPlayingEnglish &&
                "border-border/80 hover:bg-muted"
            )}
          >
            {isEnglishDisabled || (!showTranslation && isQuizMode) ? (
              <VolumeX className="h-4 w-4 text-muted-foreground/70" />
            ) : (
              <Volume2
                className={cn(
                  "h-5 w-5 transition-transform",
                  isPlayingEnglish && "animate-pulse"
                )}
              />
            )}
            <div className="flex flex-col items-center sm:items-start text-left leading-tight">
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <span>English Audio</span>
                <span className="text-xs opacity-70">(Pronounce)</span>
              </div>
              {isEnglishDisabled ? (
                <span className="text-[11px] text-muted-foreground/70 font-normal">
                  Audio unavailable
                </span>
              ) : !showTranslation && isQuizMode ? (
                <span className="text-[11px] text-muted-foreground/70 font-normal">
                  Hidden in quiz
                </span>
              ) : null}
            </div>
            {!isEnglishDisabled && isPlayingEnglish && (
              <span className="flex h-2 w-2 relative ml-auto">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-200"></span>
              </span>
            )}
          </Button>
        </div>

        {/* Mastered Toggle Control */}
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 p-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground">
              Mark as Mastered
            </span>
            <span className="text-xs text-muted-foreground">
              {word.isMastered
                ? "You have marked this word as mastered"
                : "Mark when you can recognize and pronounce it"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="mark-mastered-toggle"
              checked={word.isMastered}
              onCheckedChange={onToggleMastered}
              disabled={isTogglingMastered}
              aria-label="Mark word as mastered"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
