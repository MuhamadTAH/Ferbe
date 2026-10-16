"use client";

import { useState } from "react";
import { ArrowLeftRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";
import { hashString, seededShuffle } from "@/lib/seededShuffle";

/**
 * Matching training (Practice 1, training 2).
 * Left column = word labels, right column = the matching image (emoji tile).
 * Exactly 3 pairs per screen; the seeed splits larger word sets into screens.
 */
interface MatchPairInput {
  id?: string;
  word?: string;
  emoji?: string;
  left?: string;
  right?: string;
}

interface ResolvedPair {
  id: string;
  word: string;
  emoji: string;
}

interface PairMatchViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
  lastCorrect?: boolean | null;
}

export function PairMatchView({
  exercise,
  onSelect,
  selected,
  lastCorrect,
}: PairMatchViewProps) {
  const solution = exercise.solutionData ?? {};
  const rawPairs = (solution.pairs as MatchPairInput[] | undefined) ?? [
    { word: "doctor", emoji: "👨‍⚕️" },
    { word: "teacher", emoji: "👩‍🏫" },
    { word: "chef", emoji: "👨‍🍳" },
  ];

  const pairs: ResolvedPair[] = rawPairs.map((p, i) => {
    const word = p.word ?? p.left ?? p.id ?? `pair-${i}`;
    return {
      id: p.id ?? word,
      word,
      emoji: p.emoji ?? p.right ?? "❓",
    };
  });

  const seed = hashString(exercise._id);
  const rightOrder = seededShuffle(pairs, seed);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [shakeError, setShakeError] = useState(false);

  const instruction =
    (solution.instruction as string) || "جووتبەندکردن (Matching)";
  const correctToken = (solution.correct as string) || "matched";
  const answered =
    (lastCorrect !== null && lastCorrect !== undefined) ||
    (selected !== null && selected === correctToken);

  const tryMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      const next = new Set(matched);
      next.add(leftId);
      setMatched(next);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (next.size >= pairs.length) {
        onSelect(correctToken);
      }
    } else {
      setShakeError(true);
      setTimeout(() => {
        setShakeError(false);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
  };

  const handleLeftClick = (id: string) => {
    if (answered || matched.has(id)) return;
    setSelectedLeft(id);
    playAmericanSpeech(id, 0.9);
    if (selectedRight) tryMatch(id, selectedRight);
  };

  const handleRightClick = (id: string) => {
    if (answered || matched.has(id)) return;
    setSelectedRight(id);
    playAmericanSpeech(id, 0.9);
    if (selectedLeft) tryMatch(selectedLeft, id);
  };

  const allMatched = matched.size >= pairs.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8FAD4] dark:bg-[#1E3B20] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#58CC02]">
          <ArrowLeftRight className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          وشەکە بە وێنەکەی ببەستەوە
        </h2>
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          دەست لە وشەیەک بدە لە لای چەپ، پاشان وێنە گونجاوەکەی لە لای ڕاست هەڵبژێرە
        </p>
      </div>

      <div className={cn("grid grid-cols-2 gap-4", shakeError && "animate-shake")}>
        <div className="flex flex-col gap-3">
          <span className="text-center text-xs font-black uppercase text-[#AFAFAF] dark:text-[#8495A0]">
            وشە (Word)
          </span>
          {pairs.map((pair) => {
            const isMatched = matched.has(pair.id);
            const isSelected = selectedLeft === pair.id;
            return (
              <button
                key={`left-${pair.id}`}
                type="button"
                disabled={answered || isMatched}
                onClick={() => handleLeftClick(pair.id)}
                className={cn(
                  "flex items-center justify-between rounded-2xl border-2 border-b-4 p-4 font-black transition-all select-none cursor-pointer min-h-20 text-left",
                  isMatched
                    ? "border-[#58CC02] bg-[#E8FAD4] text-[#58A700] dark:border-[#58CC02] dark:bg-[#132817] dark:text-[#58CC02]"
                    : isSelected
                      ? "border-[#1CB0F6] bg-[#DDF4FF] text-[#1899D6] ring-2 ring-[#1CB0F6]/40 dark:border-[#3BC0F8] dark:bg-[#202F36] dark:text-[#3BC0F8]"
                      : "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#1CB0F6] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:text-white"
                )}
              >
                <span dir="ltr" className="text-base sm:text-lg">
                  {pair.word}
                </span>
                {isMatched && <Check className="h-5 w-5 stroke-[3] text-[#58CC02]" />}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-center text-xs font-black uppercase text-[#AFAFAF] dark:text-[#8495A0]">
            وێنە (Image)
          </span>
          {rightOrder.map((pair) => {
            const isMatched = matched.has(pair.id);
            const isSelected = selectedRight === pair.id;
            return (
              <button
                key={`right-${pair.id}`}
                type="button"
                disabled={answered || isMatched}
                onClick={() => handleRightClick(pair.id)}
                className={cn(
                  "flex items-center justify-center rounded-2xl border-2 border-b-4 p-3 transition-all select-none cursor-pointer min-h-20",
                  isMatched
                    ? "border-[#58CC02] bg-[#E8FAD4] dark:border-[#58CC02] dark:bg-[#132817]"
                    : isSelected
                      ? "border-[#1CB0F6] bg-[#DDF4FF] ring-2 ring-[#1CB0F6]/40 dark:border-[#3BC0F8] dark:bg-[#202F36]"
                      : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24]"
                )}
              >
                <span className="text-4xl leading-none">{pair.emoji}</span>
              </button>
            );
          })}
        </div>
      </div>

      {shakeError && (
        <div className="rounded-xl bg-[#FFDFE0] dark:bg-[#3A181D] p-2.5 text-center">
          <p dir="rtl" className="font-kurdish text-xs font-bold text-[#EA2B2B]">
            ئەم جووتە لەگەڵ یەکتر ناگونجێن! دووبارە هەوڵ بدە.
          </p>
        </div>
      )}

      {allMatched && (
        <div className="rounded-2xl border border-[#58CC02]/40 bg-[#E8FAD4] dark:bg-[#1E3B20] p-3 text-center animate-in fade-in">
          <p dir="rtl" className="font-kurdish text-xs font-extrabold text-[#58CC02]">
            هەموو جووتەکان بە دروستی بەسترانەوە! کلیک لەسەر بەردەوامبوون بکە.
          </p>
        </div>
      )}
    </div>
  );
}
