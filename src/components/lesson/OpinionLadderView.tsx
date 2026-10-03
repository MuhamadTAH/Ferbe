"use client";

import { useState } from "react";
import { Volume2, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface SentimentCard {
  word: string;
  emoji: string;
  kurdish: string; // pronunciation
}

interface OpinionLadderViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

/**
 * Lesson 1.4 Screen 4: Opinion Ladder — arrange sentiment cards from strongest positive to strongest negative.
 * Also used for Screen 1: Spatial Anchor (This vs That).
 */
export function OpinionLadderView({ exercise, onSelect, selected }: OpinionLadderViewProps) {
  const solution = exercise.solutionData ?? {};
  const cards: SentimentCard[] = (solution.cards as SentimentCard[] | undefined) ?? [
    { word: "love", emoji: "😍", kurdish: "ئای ڵەڤ" },
    { word: "like", emoji: "👍", kurdish: "ئای ڵایک" },
    { word: "don't like", emoji: "👎", kurdish: "ئارۆن ڵایک" },
    { word: "hate", emoji: "😡", kurdish: "ئای هەیت" },
  ];
  const correctOrder: string[] = (solution.correctOrder as string[] | undefined) ?? ["love", "like", "don't like", "hate"];
  const instruction = (solution.instruction as string) || "ڕاهێنانی بیستن (Opinion Ladder)";
  const headerKurdish = (solution.headerKurdish as string) || "لە باشترین بۆ خراپترین ڕیزبندی بکە";

  const [tappedAll, setTappedAll] = useState<Set<string>>(new Set());
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const handleCardTap = (card: SentimentCard) => {
    if (submitted) return;

    // Play audio on tap
    setPlayingWord(card.word);
    playAmericanSpeech(card.word, 0.9);
    setTimeout(() => setPlayingWord(null), 800);

    const next = new Set(tappedAll);
    next.add(card.word);
    setTappedAll(next);

    // Add to ordered list if not already there
    if (!orderedWords.includes(card.word)) {
      const nextOrdered = [...orderedWords, card.word];
      setOrderedWords(nextOrdered);

      if (nextOrdered.length >= cards.length) {
        // Auto-submit when all cards tapped in some order
        const correct = nextOrdered.every((w, i) => w === correctOrder[i]);
        setResult(correct ? "correct" : "wrong");
        setSubmitted(true);
        onSelect(correct ? "completed" : "wrong_order");
      }
    }
  };

  const handleReset = () => {
    setTappedAll(new Set());
    setOrderedWords([]);
    setSubmitted(false);
    setResult(null);
    onSelect("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          {headerKurdish}
        </h2>
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          کلیک لەسەر هەریەکە بکە — گوێ بگرەوە — ڕیزبندیان بکە
        </p>
      </div>

      {/* Ordered slots */}
      {orderedWords.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase text-[#AFAFAF]">ڕیزبندیەکەت:</span>
          <div className="flex flex-wrap gap-2">
            {orderedWords.map((w, i) => {
              const isCorrect = submitted && w === correctOrder[i];
              const isWrong = submitted && w !== correctOrder[i];
              return (
                <div
                  key={w}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-sm font-black",
                    isCorrect ? "border-[#58CC02] bg-[#E8FAD4] text-[#58A700]"
                      : isWrong ? "border-[#EA2B2B] bg-[#FFDFE0] text-[#EA2B2B]"
                        : "border-[#1CB0F6] bg-[#DDF4FF] text-[#1CB0F6]"
                  )}
                >
                  <span>{i + 1}.</span>
                  <span dir="ltr">{w}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sentiment cards */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => {
          const isTapped = tappedAll.has(card.word);
          const isPlaying = playingWord === card.word;

          return (
            <button
              key={card.word}
              type="button"
              onClick={() => handleCardTap(card)}
              disabled={isTapped || submitted}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border-2 border-b-4 py-5 px-4 transition-all select-none cursor-pointer",
                isTapped
                  ? "border-[#58CC02] bg-[#E8FAD4] dark:border-[#58CC02] dark:bg-[#132817]"
                  : isPlaying
                    ? "border-[#FF9600] bg-[#FFF4E5] animate-pulse"
                    : "border-[#E5E5E5] bg-white hover:border-[#FF9600] hover:bg-[#FFF4E5] dark:border-[#37464F] dark:bg-[#131F24]",
                (isTapped || submitted) && "cursor-not-allowed"
              )}
            >
              <span className="text-4xl">{card.emoji}</span>
              <span dir="ltr" className="text-base font-black text-[#4B4B4B] dark:text-white">{card.word}</span>
              <span dir="rtl" className="font-kurdish text-[11px] font-bold text-[#AFAFAF]">({card.kurdish})</span>
              {isTapped && <CheckCircle2 className="h-4 w-4 text-[#58CC02]" />}
            </button>
          );
        })}
      </div>

      {submitted && result === "wrong" && (
        <button
          type="button"
          onClick={handleReset}
          className="mx-auto flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#1CB0F6] bg-[#DDF4FF] px-5 py-3 text-sm font-black text-[#1CB0F6] hover:bg-[#B8E8FF]"
        >
          <X className="h-4 w-4" />
          دووبارە هەوڵبدەرەوە
        </button>
      )}

      {submitted && result === "correct" && (
        <div className="rounded-2xl border border-[#58CC02]/40 bg-[#E8FAD4] dark:bg-[#1E3B20] p-3 text-center animate-in fade-in">
          <p dir="rtl" className="font-kurdish text-xs font-extrabold text-[#58CC02]">
            ڕاستە! بیستراوەکانی دەمارگیر پتر قووڵترن لە باشەکان.
          </p>
        </div>
      )}
    </div>
  );
}
