"use client";

import { cn } from "@/lib/utils";

interface KurdishGlossBadgesProps {
  pronunciation?: string;
  meaning?: string;
  className?: string;
}

/**
 * Standardized 2-row gloss badge displaying Kurdish pronunciation and meaning
 * with strict vertical column alignment.
 */
export function KurdishGlossBadges({
  pronunciation,
  meaning,
  className,
}: KurdishGlossBadgesProps) {
  const safePronunciation = (pronunciation ?? "").trim();
  const safeMeaning = (meaning ?? "").trim();
  const cleanMeaning = safeMeaning.replace(/^\((.*)\)$/, "$1").trim();

  // If neither pronunciation nor meaning exists, don't render empty container
  if (!safePronunciation && !cleanMeaning) {
    return null;
  }

  return (
    <div
      dir="rtl"
      className={cn(
        "grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1.5 text-right shrink-0",
        className
      )}
    >
      {/* Row 1: Reading */}
      {safePronunciation ? (
        <>
          <span className="text-[11px] font-bold text-[#AFAFAF] dark:text-[#8495A0] whitespace-nowrap">
            خوێندنەوە:
          </span>
          <span className="rounded-lg bg-[#EBF6FF] dark:bg-[#1C3342] px-2.5 py-0.5 font-kurdish text-xs sm:text-sm font-extrabold text-[#1899D6] dark:text-[#3BC0F8] text-center max-w-[140px] sm:max-w-[180px] truncate">
            {safePronunciation}
          </span>
        </>
      ) : null}

      {/* Row 2: Meaning */}
      {cleanMeaning ? (
        <>
          <span className="text-[11px] font-bold text-[#AFAFAF] dark:text-[#8495A0] whitespace-nowrap">
            مانا:
          </span>
          <span className="rounded-lg bg-[#F5F5F5] dark:bg-[#202F36] px-2.5 py-0.5 font-kurdish text-xs sm:text-sm font-bold text-[#4B4B4B] dark:text-[#DCE6EC] text-center max-w-[140px] sm:max-w-[180px] truncate">
            {cleanMeaning}
          </span>
        </>
      ) : null}
    </div>
  );
}
