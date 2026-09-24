"use client";

import { cn } from "@/lib/utils";
import type { BankTile, Exercise } from "@/lib/sessionMachine";

interface WordBankViewProps {
  exercise: Exercise;
  bankTiles: BankTile[];
  built: string[];
  onBuild: (id: string) => void;
  onUnbuild: (id: string) => void;
  lastCorrect: boolean | null;
}

const SLOT_COUNT = 8;

/** Sentence-building exercise: tap tiles to assemble the Kurdish sentence. */
export function WordBankView({
  exercise,
  bankTiles,
  built,
  onBuild,
  onUnbuild,
  lastCorrect,
}: WordBankViewProps) {
  const answered = lastCorrect !== null;
  const builtSet = new Set(built);
  const bank = bankTiles.filter((tile) => !builtSet.has(tile.id));
  const builtTiles = built
    .map((id) => bankTiles.find((tile) => tile.id === id))
    .filter((tile): tile is BankTile => Boolean(tile));

  const isKurdishPrompt = /[\u0600-\u06FF]/.test(exercise.promptText);
  const isKurdishTokens = bankTiles.some((tile) =>
    /[\u0600-\u06FF]/.test(tile.token)
  );

  const instruction = (exercise.solutionData?.instruction as string | undefined) ?? (
    isKurdishPrompt ? "ڕستەکە وەربگێڕە (Translate this sentence)" : "Translate this sentence"
  );
  const icon = exercise.solutionData?.icon as string | undefined;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center text-center">
        {icon && (
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-black/10 bg-[#F7F7F7] text-4xl shadow-sm dark:border-white/10 dark:bg-[#202F36]">
            {icon}
          </div>
        )}
        <p className="text-xs font-black uppercase tracking-wider text-[#AFAFAF] dark:text-[#8495A0]">
          {instruction}
        </p>
        {(() => {
          const text = exercise.promptText.trim();
          const match = text.match(/^(.*?)\s*\((.*?)\)$/);
          if (match) {
            const part1 = match[1].trim();
            const part2 = match[2].trim();
            const part1IsKurdish = /[\u0600-\u06FF]/.test(part1);
            return (
              <div className="mt-2 flex flex-col items-center gap-1.5">
                <p
                  dir={part1IsKurdish ? "rtl" : "ltr"}
                  className={
                    part1IsKurdish
                      ? "font-kurdish text-3xl font-bold kurdish-word text-[#4B4B4B] dark:text-white"
                      : "text-2xl font-black text-[#4B4B4B] dark:text-white"
                  }
                >
                  {part1}
                </p>
                <p
                  dir={part1IsKurdish ? "ltr" : "rtl"}
                  className={
                    part1IsKurdish
                      ? "text-lg font-bold text-[#777777] dark:text-[#8495A0]"
                      : "font-kurdish text-xl font-bold text-[#777777] dark:text-[#8495A0]"
                  }
                >
                  ({part2})
                </p>
              </div>
            );
          }
          return (
            <p
              dir={isKurdishPrompt ? "rtl" : "ltr"}
              lang={isKurdishPrompt ? "ku" : "en"}
              className={cn(
                "mt-2 font-extrabold text-[#4B4B4B] dark:text-white",
                isKurdishPrompt
                  ? "font-kurdish text-3xl font-bold kurdish-word"
                  : "text-2xl"
              )}
            >
              {exercise.promptText}
            </p>
          );
        })()}
      </div>

      {/* Answer row: dashed slots + built tiles */}
      <div
        dir={isKurdishTokens ? "rtl" : "ltr"}
        lang={isKurdishTokens ? "ku" : "en"}
        className="flex min-h-24 flex-wrap items-start gap-2 border-y-2 border-[#E5E5E5] dark:border-[#37464F] py-3"
      >
        {builtTiles.map((tile) => (
          <button
            key={tile.id}
            type="button"
            disabled={answered}
            onClick={() => onUnbuild(tile.id)}
            className={cn(
              "rounded-xl border-2 border-b-4 border-[#E5E5E5] bg-white px-3 py-2 font-bold text-[#4B4B4B] transition-colors dark:border-[#37464F] dark:bg-[#202F36] dark:text-[#DCE6EC] dark:hover:bg-[#2A3F49]",
              isKurdishTokens
                ? "font-kurdish text-2xl kurdish-word"
                : "font-sans text-lg font-extrabold",
              answered ? "opacity-70" : "hover:bg-[#F7F7F7]"
            )}
          >
            {tile.token}
          </button>
        ))}
        {builtTiles.length === 0 &&
          Array.from({ length: SLOT_COUNT }).map((_, i) => (
            <span
              key={i}
              className="h-11 w-16 rounded-xl border-2 border-dashed border-[#E5E5E5] dark:border-[#37464F]/60"
              aria-hidden
            />
          ))}
      </div>

      {/* Bank */}
      <div
        dir={isKurdishTokens ? "rtl" : "ltr"}
        lang={isKurdishTokens ? "ku" : "en"}
        className="flex flex-wrap justify-center gap-2"
      >
        {bank.map((tile) => (
          <button
            key={tile.id}
            type="button"
            disabled={answered}
            onClick={() => onBuild(tile.id)}
            className={cn(
              "rounded-xl border-2 border-b-4 border-[#E5E5E5] bg-white px-3 py-2 font-bold text-[#4B4B4B] transition-colors hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 disabled:opacity-70 dark:border-[#37464F] dark:bg-[#202F36] dark:text-[#DCE6EC] dark:hover:bg-[#2A3F49]",
              isKurdishTokens
                ? "font-kurdish text-2xl kurdish-word"
                : "font-sans text-lg font-extrabold"
            )}
          >
            {tile.token}
          </button>
        ))}
      </div>
    </div>
  );
}
