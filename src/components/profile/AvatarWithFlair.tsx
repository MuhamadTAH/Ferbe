"use client";

import React from "react";
import { StatusFlair, TIER_CONFIG } from "./statusFlairs";

interface AvatarWithFlairProps {
  displayName?: string;
  avatarUrl?: string;
  flair?: StatusFlair | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

const SIZE_MAP = {
  sm: {
    container: "h-9 w-9 text-sm",
    badge: "h-5 w-5 -bottom-1 -right-1 text-[11px] border-2",
    ring: "ring-2 ring-offset-1",
  },
  md: {
    container: "h-12 w-12 text-lg",
    badge: "h-6 w-6 -bottom-1 -right-1 text-xs border-2",
    ring: "ring-3 ring-offset-2",
  },
  lg: {
    container: "h-16 w-16 text-2xl",
    badge: "h-7 w-7 -bottom-1 -right-1 text-sm border-2",
    ring: "ring-4 ring-offset-2",
  },
  xl: {
    container: "h-24 w-24 text-3xl",
    badge: "h-9 w-9 -bottom-1 -right-1 text-lg border-2",
    ring: "ring-4 ring-offset-3",
  },
};

export function AvatarWithFlair({
  displayName = "Learner",
  avatarUrl,
  flair,
  size = "md",
  className = "",
  onClick,
  interactive = false,
}: AvatarWithFlairProps) {
  const currentSize = SIZE_MAP[size];
  const initial = displayName.trim().charAt(0).toUpperCase() || "F";
  const tierInfo = flair ? TIER_CONFIG[flair.tier] : null;

  const ringStyle = tierInfo
    ? `${currentSize.ring} ${tierInfo.ring} ring-offset-white dark:ring-offset-[#131F24] ${tierInfo.glow}`
    : "border-4 border-[#58CC02]";

  return (
    <div
      onClick={interactive ? onClick : undefined}
      className={`relative inline-flex shrink-0 ${interactive ? "cursor-pointer group" : ""} ${className}`}
    >
      {/* Avatar Body */}
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={displayName}
          className={`${currentSize.container} rounded-full object-cover shadow-sm transition-transform ${
            interactive ? "group-hover:scale-105" : ""
          } ${ringStyle}`}
        />
      ) : (
        <div
          className={`${currentSize.container} flex items-center justify-center rounded-full bg-[#E8FAD4] dark:bg-[#1E3B20] font-extrabold text-[#58CC02] shadow-sm transition-transform ${
            interactive ? "group-hover:scale-105" : ""
          } ${ringStyle}`}
        >
          <span>{initial}</span>
        </div>
      )}

      {/* Attached Flair Badge Ring */}
      {flair && (
        <div
          title={`${flair.labelEn} (${flair.labelKu}) - ${tierInfo?.nameEn}`}
          className={`absolute ${currentSize.badge} flex items-center justify-center rounded-full bg-white dark:bg-[#131F24] shadow-md transition-transform ${
            tierInfo?.border || "border-[#58CC02]"
          } ${tierInfo?.glow || ""} ${
            interactive ? "group-hover:scale-110" : ""
          }`}
        >
          <span className="leading-none select-none">{flair.emoji}</span>
        </div>
      )}
    </div>
  );
}
