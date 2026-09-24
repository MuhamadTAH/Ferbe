"use client";

import { useState } from "react";
import { Sparkles, Volume2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/sessionMachine";
import { playAmericanSpeech } from "@/lib/americanVoice";
import { KurdishGlossBadges } from "@/components/lesson/KurdishGlossBadges";

interface StatusCard {
  word: string;
  sound: string;
  meaning: string;
}

interface StatusBankViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}

export function StatusBankView({ exercise, onSelect, selected }: StatusBankViewProps) {
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [tappedWords, setTappedWords] = useState<Set<string>>(new Set());

  const solution = exercise.solutionData ?? {};
  const cards: StatusCard[] = (solution.cards as StatusCard[] | undefined) ?? [
    { word: "fine", sound: "فاین", meaning: "باش" },
    { word: "good", sound: "گود", meaning: "باش" },
    { word: "great", sound: "گرەیت", meaning: "زۆر باش" },
    { word: "cool", sound: "کووڵ", meaning: "نایاب" },
  ];

  const framePrefix = (solution.framePrefix as string | undefined) ?? "I'm";
  const frameSuffix = (solution.frameSuffix as string | undefined) ?? ", thank you.";
  const title = (solution.title as string | undefined) ?? "وشەی گونجاو دابنێ لەناو ڕستەکە";
  const instruction = (solution.instruction as string) || "بانکی وەسفی بارودۆخ (Status Adjectives Bank)";

  const handleSelectWord = (card: StatusCard) => {
    setActiveWord(card.word);
    const fullSentence = solution.speechTemplate
      ? (solution.speechTemplate as string).replace("{word}", card.word)
      : `${framePrefix ? framePrefix + " " : ""}${card.word}${frameSuffix ? (frameSuffix.startsWith(",") || frameSuffix.startsWith(".") ? frameSuffix : " " + frameSuffix) : ""}`;
    playAmericanSpeech(fullSentence, 0.88);

    const next = new Set(tappedWords);
    next.add(card.word);
    setTappedWords(next);

    // If all cards have been tapped, enable Continue
    if (next.size >= cards.length) {
      onSelect((solution.correct as string) || "completed");
    }
  };

  const allTapped = tappedWords.size >= cards.length;
  const subtitle =
    (solution.subtitle as string | undefined) ??
    `کلیک لە وشەکان بکە تاوەکو ڕستەکە پێکبهێنیت و گوێت لە دەنگەکەی بێت (${tappedWords.size} لە ${cards.length})`;

  return (
    <div className="flex flex-col gap-6">
      {/* Instruction Header */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8FAD4] dark:bg-[#1E3B20] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#58CC02]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{instruction}</span>
        </span>
        <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
          {title}
        </h2>
        <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
          {subtitle}
        </p>
      </div>

      {/* Header Frame */}
      <div className="mx-auto flex w-full max-w-md items-center justify-center rounded-3xl border-2 border-[#1CB0F6]/40 bg-[#DDF4FF] dark:bg-[#1C3B4E] px-6 py-5 shadow-sm">
        <div dir="ltr" className="flex items-center gap-2 text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white">
          {framePrefix ? <span>{framePrefix}</span> : null}
          <span
            className={cn(
              "inline-flex min-w-24 items-center justify-center rounded-2xl border-2 border-b-4 px-3 py-1 text-xl font-black transition-all",
              activeWord
                ? "border-[#58CC02] bg-[#58CC02] text-white shadow-md animate-in zoom-in-90"
                : "border-dashed border-[#1899D6] bg-white text-[#AFAFAF] dark:border-[#3BC0F8] dark:bg-[#131F24]"
            )}
          >
            {activeWord ? activeWord : "___"}
          </span>
          {frameSuffix ? <span>{frameSuffix}</span> : null}
        </div>
      </div>

      {/* 4 Selectable Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
        {cards.map((card) => {
          const isTapped = tappedWords.has(card.word);
          const isCurrentActive = activeWord === card.word;

          return (
            <button
              key={card.word}
              type="button"
              onClick={() => handleSelectWord(card)}
              className={cn(
                "group relative flex items-center justify-between rounded-2xl border-2 border-b-4 p-4 transition-all text-left select-none cursor-pointer",
                isCurrentActive
                  ? "border-[#1CB0F6] bg-[#DDF4FF] ring-2 ring-[#1CB0F6]/40 dark:border-[#3BC0F8] dark:bg-[#202F36]"
                  : isTapped
                    ? "border-[#58CC02] bg-[#F7FCF0] dark:border-[#58CC02] dark:bg-[#132817]"
                    : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] hover:bg-[#F4FBFF] dark:border-[#37464F] dark:bg-[#131F24]"
              )}
            >
              {/* English word + Sound Icon */}
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    isCurrentActive
                      ? "bg-[#1CB0F6] text-white"
                      : "bg-[#F0F0F0] text-[#777777] dark:bg-[#2A3B43] dark:text-white"
                  )}
                >
                  <Volume2 className="h-4 w-4" />
                </div>
                <span dir="ltr" className="text-xl font-black text-[#4B4B4B] dark:text-white">
                  {card.word}
                </span>
              </div>

              {/* Aligned Kurdish Pronunciation & Meaning Badges */}
              <KurdishGlossBadges
                pronunciation={card.sound}
                meaning={card.meaning}
              />

              {isTapped && (
                <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#58CC02] text-white shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {allTapped ? (
        <div className="rounded-2xl border border-[#58CC02]/40 bg-[#E8FAD4] dark:bg-[#1E3B20] p-3 text-center animate-in fade-in">
          <p dir="rtl" className="font-kurdish text-xs font-extrabold text-[#58CC02]">
            تەواوە! هەموو دەستەواژەکانت تاقیکردەوە. کلیک لە دوگمەی بەردەوامبوون بکە.
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p dir="rtl" className="font-kurdish text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]">
            بۆ بەردەوامبوون پێویستە دەست لەسەر هەموو وشەکان بدەیت
          </p>
        </div>
      )}
    </div>
  );
}
