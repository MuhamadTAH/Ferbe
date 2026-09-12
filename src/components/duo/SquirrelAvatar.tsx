"use client";

import React from "react";
import { SquirrelMascot, MascotMood, MascotAccessory } from "./SquirrelMascot";

export type AvatarSize = 28 | 32 | 36 | 40 | 48 | 64 | "xs" | "sm" | "md" | "lg" | number;

export type AvatarVariant =
  | "green"
  | "orange"
  | "cream"
  | "subtle"
  | "dark"
  | "transparent";

export interface SquirrelAvatarProps {
  size?: AvatarSize;
  mood?: MascotMood;
  accessory?: MascotAccessory;
  variant?: AvatarVariant;
  shape?: "circle" | "rounded" | "square";
  animate?: boolean;
  border?: boolean;
  badge?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  alt?: string;
}

const SIZE_MAP: Record<string, number> = {
  xs: 28,
  sm: 36,
  md: 48,
  lg: 64,
};

const VARIANT_CLASSES: Record<AvatarVariant, string> = {
  green: "bg-[#58CC02] text-white shadow-sm shadow-[#58CC02]/30",
  orange: "bg-[#FF9600] text-white shadow-sm shadow-[#FF9600]/30",
  cream: "bg-[#FFF2DC] dark:bg-[#202F36] text-[#4B4B4B] dark:text-white border-[#EED8B5] dark:border-[#37464F]",
  subtle: "bg-[#F7F7F7] dark:bg-[#202F36] text-[#4B4B4B] dark:text-white border-[#E5E5E5] dark:border-[#37464F]",
  dark: "bg-[#131F24] border-[#37464F] text-white",
  transparent: "bg-transparent",
};

/**
 * SquirrelAvatar - A compact circular or rounded pill avatar featuring Smorik (سمۆڕە),
 * designed for navigation bars, user profile flairs, and leaderboards.
 */
export function SquirrelAvatar({
  size = 40,
  mood = "happy",
  accessory = "none",
  variant = "green",
  shape = "rounded",
  animate = false,
  border = false,
  badge,
  className = "",
  onClick,
  alt = "Smorik Mascot Avatar",
}: SquirrelAvatarProps) {
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size] || 40;

  const shapeClass =
    shape === "circle"
      ? "rounded-full"
      : shape === "square"
      ? "rounded-lg"
      : pixelSize <= 32
      ? "rounded-xl"
      : "rounded-2xl";

  const borderClass = border
    ? "border-2 border-[#E5E5E5] dark:border-[#37464F]"
    : "";

  // Smorik mascot scales proportionally to fit within avatar
  const mascotRenderSize = Math.round(pixelSize * 0.88);

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center overflow-visible select-none ${
        onClick ? "cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95" : ""
      } ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      onClick={onClick}
      role={onClick ? "button" : "img"}
      aria-label={alt}
    >
      {/* Background Container */}
      <div
        className={`flex h-full w-full items-center justify-center overflow-hidden transition-colors ${shapeClass} ${VARIANT_CLASSES[variant]} ${borderClass}`}
      >
        <SquirrelMascot
          mood={mood}
          accessory={accessory}
          size={mascotRenderSize}
          animate={animate}
          title={alt}
        />
      </div>

      {/* Optional Top/Bottom Badge Over Avatar */}
      {badge && (
        <div className="absolute -bottom-1 -right-1 z-10 flex items-center justify-center">
          {badge}
        </div>
      )}
    </div>
  );
}
