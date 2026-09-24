"use client";

import { useState } from "react";
import { ArrowLeftRight, Check, X, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";

interface PairItem {
  prompt: string;
  response: string;
}

interface ResponsePairingViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

export function ResponsePairingView({ exercise, onSelect, selected }: ResponsePairingViewProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Map<string, string>>(new Map());
  const [shakeError, setShakeError] = useState(false);

  const solution = exercise.solutionData ?? {};
  const pairs: PairItem[] = (solution.pairs as PairItem[] | undefined) ?? [
    { prompt: "Hi Sara", response: "Hello Ahmad" },
    { prompt: "How are you?", response: "I'm good, thank you" },
  ];

  // Fixed left order, right order can be displayed directly
  const leftItems = pairs.map((p) => p.prompt);
  const rightItems = ["I'm good, thank you", "Hello Ahmad"]; // deliberate alternate order to require matching

  const instruction = (solution.instruction as string) || "جووتبەندکردنی گفتوگۆ (Social Logic Match)";

  const handleLeftClick = (item: string) => {
    if (matchedPairs.has(item)) return;
    setSelectedLeft(item);
    playAmericanSpeech(item, 0.9);

    if (selectedRight) {
      checkMatch(item, selectedRight);
    }
  };

  const handleRightClick = (item: string) => {
    // Check if right item is already matched
    const isAlreadyMatched = Array.from(matchedPairs.values()).includes(item);
    if (isAlreadyMatched) return;

    setSelectedRight(item);
    playAmericanSpeech(item, 0.9);

    if (selectedLeft) {
      checkMatch(selectedLeft, item);
    }
  };

  const checkMatch = (left: string, right: string) => {
    const validPair = pairs.find((p) => p.prompt === left && p.response === right);

    if (validPair) {
      const next = new Map(matchedPairs);
      next.set(left, right);
      setMatchedPairs(next);
      setSelectedLeft(null);
      setSelectedRight(null);

      // If all pairs matched
      if (next.size >= pairs.length) {
        onSelect((solution.correct as string) || "paired");
      }
    } else {
      // Mismatch
      setShakeError(true);
      setTimeout(() => {
        setShakeError(false);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
  };

  const allMatched = matchedPairs.size >= pairs.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Instructions: Kurdish on its own line, English on its own separate line */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8FAD4] dark:bg-[#1E3B20] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#58CC02]">
          <ArrowLeftRight className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>

        {/* Kurdish Title on its own line */}
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          پەیامەکە بە وەڵامە سروشتییەکەی ببەستەوە
        </h2>

        {/* Sub-instruction in Kurdish on its own line */}
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          سەرەتا دەست لەسەر لای چەپ بدە، پاشان وەڵامە گونجاوەکەی لە لای ڕاست هەڵبژێرە
        </p>
      </div>

      {/* 2 Columns: Left Prompts & Right Responses */}
      <div className={cn("grid grid-cols-2 gap-4", shakeError && "animate-shake")}>
        {/* Left Column (Prompts) */}
        <div className="flex flex-col gap-3">
          <span className="text-center text-xs font-black uppercase text-[#AFAFAF] dark:text-[#8495A0]">
            پەیام (Prompt)
          </span>
          {leftItems.map((item) => {
            const isMatched = matchedPairs.has(item);
            const isSelected = selectedLeft === item;

            return (
              <button
                key={item}
                type="button"
                disabled={isMatched}
                onClick={() => handleLeftClick(item)}
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
                  {item}
                </span>
                {isMatched && <Check className="h-5 w-5 stroke-[3] text-[#58CC02]" />}
              </button>
            );
          })}
        </div>

        {/* Right Column (Responses) */}
        <div className="flex flex-col gap-3">
          <span className="text-center text-xs font-black uppercase text-[#AFAFAF] dark:text-[#8495A0]">
            وەڵام (Response)
          </span>
          {rightItems.map((item) => {
            const isMatched = Array.from(matchedPairs.values()).includes(item);
            const isSelected = selectedRight === item;

            return (
              <button
                key={item}
                type="button"
                disabled={isMatched}
                onClick={() => handleRightClick(item)}
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
                  {item}
                </span>
                {isMatched && <Check className="h-5 w-5 stroke-[3] text-[#58CC02]" />}
              </button>
            );
          })}
        </div>
      </div>

      {shakeError && (
        <div className="rounded-xl bg-[#FFDFE0] dark:bg-[#3A181D] p-2.5 text-center">
          <p dir="rtl" className="font-kurdish text-xs font-bold text-[#EA2B2B]">
            ئەم جووتە لەگەڵ یەکتر ناگونجێن! وەڵامی هەواڵپرسین لەگەڵ سڵاوکردن تێکەڵ مەکە.
          </p>
        </div>
      )}

      {allMatched && (
        <div className="rounded-2xl border border-[#58CC02]/40 bg-[#E8FAD4] dark:bg-[#1E3B20] p-3 text-center animate-in fade-in">
          <p dir="rtl" className="font-kurdish text-xs font-extrabold text-[#58CC02]">
            هەردوو جووتەکە بە دروستی بەسترانەوە! کلیک لەسەر بەردەوامبوون بکە.
          </p>
        </div>
      )}
    </div>
  );
}
