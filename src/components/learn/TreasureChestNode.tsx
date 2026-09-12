"use client";

import { useState } from "react";
import { Sparkles, Trophy, Gift, Check } from "lucide-react";

interface TreasureChestNodeProps {
  unitOrder: number;
  isUnlocked: boolean;
}

export function TreasureChestNode({
  unitOrder,
  isUnlocked,
}: TreasureChestNodeProps) {
  const [claimed, setClaimed] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const handleClick = () => {
    if (!isUnlocked) return;
    if (!claimed) {
      setClaimed(true);
      setShowRewardModal(true);
    } else {
      setShowRewardModal(true);
    }
  };

  return (
    <div className="relative flex flex-col items-center py-6">
      {/* Glow pulse when unlocked and unclaimed */}
      {isUnlocked && !claimed && (
        <div className="absolute h-20 w-20 rounded-full bg-[#FFC800]/30 animate-ping" />
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={!isUnlocked}
        aria-label={`Unit ${unitOrder} Milestone Chest`}
        className={`relative flex h-[76px] w-[76px] items-center justify-center rounded-3xl border-b-[6px] transition-all ${
          isUnlocked
            ? claimed
              ? "border-[#46A302] bg-[#58CC02] text-white hover:bg-[#61E002] active:translate-y-[2px] active:border-b-2"
              : "border-[#D9A500] bg-[#FFC800] text-white shadow-lg shadow-[#FFC800]/30 hover:bg-[#FFD12E] active:translate-y-[2px] active:border-b-2"
            : "cursor-not-allowed border-[#C7C7C7] dark:border-[#2B383F] bg-[#E5E5E5] dark:bg-[#37464F] text-[#AFAFAF] dark:text-[#52656D]"
        }`}
      >
        {claimed ? (
          <Check className="h-9 w-9 stroke-[3]" />
        ) : (
          <Gift className={`h-9 w-9 ${isUnlocked ? "animate-bounce" : ""}`} />
        )}
      </button>

      <span className="mt-2 text-xs font-extrabold uppercase tracking-wide text-[#777777] dark:text-[#8495A0]">
        {claimed ? `Unit ${unitOrder} Trophy` : isUnlocked ? "Claim Reward!" : "Unit Chest"}
      </span>

      {/* Reward Modal */}
      {showRewardModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowRewardModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFDFE0]/30 dark:bg-[#FFDFE0]/10">
              <Trophy className="h-10 w-10 text-[#FFC800]" />
              <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-[#FFC800] animate-pulse" />
            </div>
            <h3 className="mt-4 text-2xl font-extrabold text-[#4B4B4B] dark:text-white">
              Unit {unitOrder} Completed!
            </h3>
            <p className="mt-2 text-sm text-[#777777] dark:text-[#8495A0]">
              Congratulations! You mastered all the foundational exercises in this unit.
            </p>
            <div className="my-5 flex justify-center gap-4">
              <div className="rounded-2xl border-2 border-[#FFC800] bg-[#FFF9E6] dark:bg-[#342805] px-4 py-2 text-center">
                <span className="text-xl font-extrabold text-[#FFC800]">+25</span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#AFAFAF] dark:text-[#8495A0]">
                  Bonus XP
                </p>
              </div>
              <div className="rounded-2xl border-2 border-[#1CB0F6] bg-[#DDF4FF] dark:bg-[#1C3B4E] px-4 py-2 text-center">
                <span className="text-xl font-extrabold text-[#1CB0F6]">+15</span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#AFAFAF] dark:text-[#8495A0]">
                  Gems
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowRewardModal(false)}
              className="w-full rounded-2xl border-b-4 border-[#46A302] bg-[#58CC02] py-3 text-sm font-extrabold uppercase tracking-wide text-white hover:bg-[#61E002] active:translate-y-[2px] active:border-b-2"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
