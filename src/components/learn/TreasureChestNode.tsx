"use client";

import { useState } from "react";
import { Check, Trophy, Sparkles } from "lucide-react";
import { QuestChest } from "@/components/duo/QuestChest";
import { TreasureOpeningModal } from "@/components/duo/TreasureOpeningModal";
import { SquirrelMascot } from "@/components/duo/SquirrelMascot";

interface TreasureChestNodeProps {
  unitOrder: number;
  isUnlocked: boolean;
  showMascot?: boolean;
}

export function TreasureChestNode({
  unitOrder,
  isUnlocked,
  showMascot = true,
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
    <div className="relative flex flex-col items-center py-5 select-none">
      {/* Mascot Cheerleader on Path Right Side (Duolingo Style) */}
      {showMascot && (
        <div className="absolute -right-28 -top-3 hidden sm:flex flex-col items-center select-none animate-in fade-in duration-300 z-10">
          <div className="relative mb-1 rounded-2xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] px-2.5 py-1 text-[11px] font-extrabold text-[#4B4B4B] dark:text-white shadow-xs">
            <span className="font-kurdish text-xs font-bold text-[#58CC02] kurdish-word">
              هەر بژی!
            </span>
            <span className="ml-1 text-[10px] text-[#AFAFAF] dark:text-[#8495A0]">
              (Keep going!)
            </span>
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-[#131F24]" />
          </div>
          <div className="flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
            <SquirrelMascot
              mood="happy"
              size={68}
              animate
              interactive
              title="Smorik cheering you on the path!"
            />
          </div>
        </div>
      )}

      {/* Speech Pill above Unlocked Chest */}
      {isUnlocked && !claimed && (
        <div className="relative mb-2 animate-bounce">
          <button
            type="button"
            onClick={handleClick}
            className="whitespace-nowrap rounded-xl border-2 border-[#FFC800] bg-[#FFF4E5] dark:bg-[#341F05] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#D48B00] dark:text-[#FFC800] shadow-sm hover:scale-105 transition-transform cursor-pointer"
          >
            <span>Open Chest!</span>
            <span className="ml-1 font-kurdish text-[11px] font-bold text-[#FF9600]">
              (سندوق بکەرەوە)
            </span>
            <span className="absolute left-1/2 top-full -translate-x-1/2 border-[6px] border-transparent border-t-[#FFC800]" />
          </button>
        </div>
      )}

      {/* Free-Standing 2D Treasure Chest Graphic directly on the Path */}
      <div
        onClick={handleClick}
        role={isUnlocked ? "button" : "img"}
        aria-label={`Unit ${unitOrder} Milestone Chest`}
        className={`relative flex flex-col items-center justify-center transition-transform duration-200 ${
          isUnlocked
            ? "cursor-pointer hover:scale-110 active:scale-95"
            : "cursor-default"
        }`}
      >
        {/* Ambient Glow Aura when Unlocked */}
        {isUnlocked && !claimed && (
          <div className="absolute -inset-2 rounded-full bg-[#FFC800]/25 blur-lg animate-pulse pointer-events-none" />
        )}

        <QuestChest
          isOpen={claimed}
          variant={isUnlocked ? "wood" : "slate"}
          locked={!isUnlocked}
          animated={isUnlocked && !claimed}
          glow={isUnlocked && !claimed}
          size={74}
        />

        {/* Claimed Checkmark Badge */}
        {claimed && (
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#58CC02] border-2 border-white dark:border-[#131F24] text-white shadow-sm">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </div>
        )}
      </div>

      <span className="mt-2 text-center text-xs font-extrabold uppercase tracking-wide text-[#777777] dark:text-[#8495A0]">
        {claimed
          ? `Unit ${unitOrder} Rewards Claimed`
          : isUnlocked
          ? "Milestone Chest · خەڵات"
          : "Milestone Chest"}
      </span>

      {/* 2D Vector Animated Treasure Opening Modal */}
      <TreasureOpeningModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        onCollect={handleCollect}
        title={`Unit ${unitOrder} Milestone!`}
        subtitle="Congratulations! You completed the foundational lessons. Here are your bonus rewards!"
        xpReward={25}
        gemReward={15}
        badgeName={`Unit ${unitOrder} Chest`}
        badgeIcon={<Trophy className="h-5 w-5 fill-white stroke-white" />}
      />
    </div>
  );
}
