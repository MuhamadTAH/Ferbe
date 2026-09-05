"use client";

import Image from "next/image";
import { Volume2, VolumeX, Check, Sparkles } from "lucide-react";
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
  kurdishAudioUrl: string;
  englishAudioUrl: string;
  isMastered: boolean;
  order?: number;
}

interface WordFlashcardProps {
  word: WordItem;
  isPlayingKurdish: boolean;
  isPlayingEnglish: boolean;
  onPlayKurdish: () => void;
  onPlayEnglish: () => void;
  onToggleMastered: () => void;
  isTogglingMastered?: boolean;
}

export function WordFlashcard({
  word,
  isPlayingKurdish,
  isPlayingEnglish,
  onPlayKurdish,
  onPlayEnglish,
  onToggleMastered,
  isTogglingMastered,
}: WordFlashcardProps) {
  return (
    <Card className="overflow-hidden border-border/80 bg-card shadow-lg transition-all duration-300 hover:shadow-xl">
      {/* Visual Image Header */}
      <div className="relative h-56 sm:h-64 md:h-72 w-full overflow-hidden bg-muted">
        <img
          src={word.imageUrl}
          alt={word.englishText}
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
            Basics Category
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
          <span>Tap audio to listen</span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Kurdish Sorani
          </span>
        </div>
      </div>

      <CardContent className="p-6 sm:p-8 flex flex-col gap-6">
        {/* Kurdish Text Container */}
        {/* MANDATORY: Noto Sans Arabic with dir="rtl" ONLY on this container. NO tracking-* classes! */}
        <div className="flex flex-col items-center justify-center text-center pt-2">
          <div
            dir="rtl"
            lang="ku"
            className="font-kurdish text-5xl sm:text-6xl md:text-7xl font-bold leading-normal text-foreground select-none kurdish-word transition-transform duration-200"
          >
            {word.kurdishText}
          </div>

          {/* Phonetic Transliteration */}
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1 text-sm sm:text-base font-mono font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
            <span className="opacity-60">/</span>
            <span>{word.transliteration}</span>
            <span className="opacity-60">/</span>
          </div>

          {/* English Translation */}
          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground/90">
            {word.englishText}
          </h2>
        </div>

        {/* Audio Triggers (Constraint 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Kurdish Audio Button */}
          <Button
            type="button"
            variant={isPlayingKurdish ? "default" : "subtle"}
            size="lg"
            onClick={onPlayKurdish}
            className={cn(
              "relative flex items-center justify-center gap-2.5 h-13 rounded-xl transition-all duration-200",
              isPlayingKurdish
                ? "bg-emerald-600 text-white ring-2 ring-emerald-500/50 shadow-md scale-[1.01]"
                : "hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
            )}
          >
            <Volume2
              className={cn(
                "h-5 w-5 transition-transform",
                isPlayingKurdish && "animate-pulse text-white"
              )}
            />
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <span>Kurdish Audio</span>
              <span
                dir="rtl"
                className="font-kurdish font-normal text-xs opacity-80"
              >
                (کوردی)
              </span>
            </div>
            {isPlayingKurdish && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            )}
          </Button>

          {/* English Audio Button */}
          <Button
            type="button"
            variant={isPlayingEnglish ? "default" : "outline"}
            size="lg"
            onClick={onPlayEnglish}
            className={cn(
              "relative flex items-center justify-center gap-2.5 h-13 rounded-xl transition-all duration-200",
              isPlayingEnglish
                ? "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 ring-2 ring-slate-400/40 shadow-md scale-[1.01]"
                : "border-border/80 hover:bg-muted"
            )}
          >
            <Volume2
              className={cn(
                "h-5 w-5 transition-transform",
                isPlayingEnglish && "animate-pulse"
              )}
            />
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <span>English Audio</span>
              <span className="text-xs opacity-70">(Pronounce)</span>
            </div>
            {isPlayingEnglish && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-200"></span>
              </span>
            )}
          </Button>
        </div>

        {/* Mastered Toggle Control (Constraint 5) */}
        <div className="mt-2 flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 p-4">
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
