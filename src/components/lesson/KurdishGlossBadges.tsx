"use client";

import { cn } from "@/lib/utils";

interface KurdishGlossBadgesProps {
  pronunciation: string;
  meaning: string;
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
  // Strip redundant surrounding parentheses if passed in meaning
  const cleanMeaning = meaning.replace(/^\((.*)\)$/, "$1").trim();

  return (
    <div
      dir="rtl"
      className={cn(
        "grid grid-cols-[auto_1fr] items-center gap-x-2.5 gap-y-1.5 text-right min-w-[135px]",
        className
      )}
    >
      {/* Row 1: Reading */}
      <span className="text-[11px] font-bold text-[#AFAFAF] dark:text-[#8495A0] whitespace-nowrap">
        خوێندنەوە:
      </span>
      <span className="rounded-lg bg-[#EBF6FF] dark:bg-[#1C3342] px-2.5 py-0.5 font-kurdish text-sm font-extrabold text-[#1899D6] dark:text-[#3BC0F8] text-center whitespace-nowrap">
        {pronunciation}
      </span>

      {/* Row 2: Meaning */}
      <span className="text-[11px] font-bold text-[#AFAFAF] dark:text-[#8495A0] whitespace-nowrap">
        واتا:
      </span>
      <span className="rounded-lg bg-[#F5F5F5] dark:bg-[#202F36] px-2.5 py-0.5 font-kurdish text-sm font-bold text-[#4B4B4B] dark:text-[#DCE6EC] text-center whitespace-nowrap">
        ({cleanMeaning})
      </span>
    </div>
  );
}
