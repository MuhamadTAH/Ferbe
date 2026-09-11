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

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <p className="text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF]">
          Translate this sentence
        </p>
        <p className="mt-2 text-2xl font-extrabold text-[#4B4B4B]">
          {exercise.promptText}
        </p>
      </div>

      {/* Answer row: dashed slots + built tiles */}
      <div
        dir="rtl"
        lang="ku"
        className="flex min-h-24 flex-wrap items-start gap-2 border-y-2 border-[#E5E5E5] py-3"
      >
        {builtTiles.map((tile) => (
          <button
            key={tile.id}
            type="button"
            disabled={answered}
            onClick={() => onUnbuild(tile.id)}
            className={cn(
              "rounded-xl border-2 border-b-4 border-[#E5E5E5] bg-white px-3 py-2 font-kurdish text-2xl font-bold text-[#4B4B4B] kurdish-word transition-colors",
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
              className="h-11 w-16 rounded-xl border-2 border-dashed border-[#E5E5E5]"
              aria-hidden
            />
          ))}
      </div>

      {/* Bank */}
      <div dir="rtl" lang="ku" className="flex flex-wrap justify-center gap-2">
        {bank.map((tile) => (
          <button
            key={tile.id}
            type="button"
            disabled={answered}
            onClick={() => onBuild(tile.id)}
            className="rounded-xl border-2 border-b-4 border-[#E5E5E5] bg-white px-3 py-2 font-kurdish text-2xl font-bold text-[#4B4B4B] kurdish-word transition-colors hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 disabled:opacity-70"
          >
            {tile.token}
          </button>
        ))}
      </div>
    </div>
  );
}
