"use client";

import { useState } from "react";
import { Check, Trophy } from "lucide-react";
import { QuestChest } from "@/components/duo/QuestChest";
import { TreasureOpeningModal } from "@/components/duo/TreasureOpeningModal";

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
    setShowRewardModal(true);
  };

  const handleCollect = () => {
    setClaimed(true);
    setShowRewardModal(false);
  };

  return (
    <div className="relative flex flex-col items-center py-6">
      {/* Glow pulse when unlocked and unclaimed */}
      {isUnlocked && !claimed && (
        <div className="absolute h-20 w-20 rounded-full bg-[#FFC800]/30 animate-ping pointer-events-none" />
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={!isUnlocked}
        aria-label={`Unit ${unitOrder} Milestone Chest`}
        className={`relative flex h-[76px] w-[76px] items-center justify-center rounded-3xl border-b-[6px] transition-all duration-200 ${
          isUnlocked
            ? claimed
              ? "border-[#46A302] bg-[#58CC02] text-white hover:bg-[#61E002] active:translate-y-[2px] active:border-b-2"
              : "border-[#D9A500] bg-[#FFC800] text-white shadow-lg shadow-[#FFC800]/30 hover:bg-[#FFD12E] active:translate-y-[2px] active:border-b-2"
            : "cursor-not-allowed border-[#C7C7C7] dark:border-[#2B383F] bg-[#E5E5E5] dark:bg-[#37464F] text-[#AFAFAF] dark:text-[#52656D]"
        }`}
      >
        {claimed ? (
          <Check className="h-9 w-9 stroke-[3]" />
        ) : isUnlocked ? (
          <div className="transition-transform hover:scale-110 active:scale-95">
            <QuestChest
              isOpen={false}
              animated
              glow
              size={54}
            />
          </div>
        ) : (
          <div className="opacity-50 grayscale">
            <QuestChest
              isOpen={false}
              size={48}
            />
          </div>
        )}
      </button>

      <span className="mt-2 text-xs font-extrabold uppercase tracking-wide text-[#777777] dark:text-[#8495A0]">
        {claimed ? `Unit ${unitOrder} Trophy` : isUnlocked ? "Claim Reward!" : "Unit Chest"}
      </span>

      {/* 2D Vector Animated Treasure Opening Modal */}
      <TreasureOpeningModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        onCollect={handleCollect}
        title={`Unit ${unitOrder} Completed!`}
        subtitle="Congratulations! You mastered all the foundational exercises in this unit."
        xpReward={25}
        gemReward={15}
        badgeName={`Unit ${unitOrder} Master`}
        badgeIcon={<Trophy className="h-5 w-5 fill-white stroke-white" />}
      />
    </div>
  );
}
