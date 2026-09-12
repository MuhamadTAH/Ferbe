"use client";

import React, { useEffect, useState, useId } from "react";
import { Zap, Trophy, Sparkles, X } from "lucide-react";
import { QuestChest } from "./QuestChest";
import { PushButton } from "./PushButton";
import {
  playChestRattleSound,
  playChestOpenSound,
  playGemSparkleSound,
  playCollectRewardSound,
} from "@/lib/chestAudio";

export interface RewardItem {
  type: "xp" | "gems" | "badge" | "custom";
  amount?: number;
  label?: string;
  icon?: React.ReactNode;
}

export interface TreasureOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  questTitle?: string;
  xpReward?: number;
  gemReward?: number;
  badgeName?: string;
  badgeIcon?: React.ReactNode;
  rewards?: RewardItem[];
  onCollect?: () => void;
  autoPlayAudio?: boolean;
}

interface Particle {
  id: number;
  type: "coin" | "ruby" | "sapphire" | "emerald" | "star";
  x: number; // Target X offset (px)
  y: number; // Target Y offset (px)
  rotation: number; // Deg
  scale: number;
  delayMs: number;
}

// Deterministic particles array for opening burst
const PARTICLES_CONFIG: Particle[] = [
  // Coins
  { id: 1, type: "coin", x: -85, y: -65, rotation: -28, scale: 1.1, delayMs: 20 },
  { id: 2, type: "coin", x: 80, y: -70, rotation: 35, scale: 1.1, delayMs: 40 },
  { id: 3, type: "coin", x: -45, y: -110, rotation: -15, scale: 1.0, delayMs: 60 },
  { id: 4, type: "coin", x: 50, y: -105, rotation: 20, scale: 1.0, delayMs: 50 },
  { id: 5, type: "coin", x: 0, y: -125, rotation: 10, scale: 1.15, delayMs: 80 },

  // Rubies
  { id: 6, type: "ruby", x: -110, y: -30, rotation: -40, scale: 1.0, delayMs: 30 },
  { id: 7, type: "ruby", x: 65, y: -50, rotation: 25, scale: 0.95, delayMs: 70 },

  // Sapphires
  { id: 8, type: "sapphire", x: 105, y: -35, rotation: 35, scale: 1.0, delayMs: 30 },
  { id: 9, type: "sapphire", x: -70, y: -45, rotation: -20, scale: 0.95, delayMs: 75 },

  // Emeralds
  { id: 10, type: "emerald", x: -28, y: -90, rotation: -12, scale: 0.9, delayMs: 65 },
  { id: 11, type: "emerald", x: 30, y: -92, rotation: 18, scale: 0.9, delayMs: 85 },

  // Sparkle Stars
  { id: 12, type: "star", x: -120, y: -75, rotation: 45, scale: 1.1, delayMs: 100 },
  { id: 13, type: "star", x: 115, y: -80, rotation: -30, scale: 1.1, delayMs: 110 },
  { id: 14, type: "star", x: -55, y: -135, rotation: 15, scale: 0.85, delayMs: 120 },
  { id: 15, type: "star", x: 55, y: -135, rotation: -15, scale: 0.85, delayMs: 130 },
];

export function TreasureOpeningModal({
  isOpen,
  onClose,
  title = "Treasure Unlocked!",
  subtitle,
  questTitle,
  xpReward,
  gemReward,
  badgeName,
  badgeIcon,
  rewards,
  onCollect,
  autoPlayAudio = true,
}: TreasureOpeningModalProps) {
  // Opening sequence phases:
  // 1. "anticipate" (0ms - 650ms): closed chest shakes rapidly, keyhole pulses, rattle click audio.
  // 2. "burst" (650ms - 1350ms): chest bursts open, chime chord plays, sunburst appears, coins & gems erupt outward.
  // 3. "reveal" (1350ms+): chest stays open with gems hovering, reward payload cards slide up, collect button ready.
  const [phase, setPhase] = useState<"anticipate" | "burst" | "reveal">("anticipate");
  const sunburstGradientId = useId();

  useEffect(() => {
    if (!isOpen) {
      setPhase("anticipate");
      return;
    }

    setPhase("anticipate");
    if (autoPlayAudio) {
      playChestRattleSound();
    }

    // Phase 1 -> Phase 2 (Burst)
    const burstTimer = setTimeout(() => {
      setPhase("burst");
      if (autoPlayAudio) {
        playChestOpenSound();
      }
    }, 650);

    // Gem sparkle sound shortly after chest pops open
    const sparkleTimer = setTimeout(() => {
      if (autoPlayAudio) {
        playGemSparkleSound();
      }
    }, 850);

    // Phase 2 -> Phase 3 (Reveal rewards)
    const revealTimer = setTimeout(() => {
      setPhase("reveal");
    }, 1300);

    return () => {
      clearTimeout(burstTimer);
      clearTimeout(sparkleTimer);
      clearTimeout(revealTimer);
    };
  }, [isOpen, autoPlayAudio]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleCollect();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCollect = () => {
    if (autoPlayAudio) {
      playCollectRewardSound();
    }
    if (onCollect) {
      onCollect();
    }
    onClose();
  };

  const hasRewardsList = rewards && rewards.length > 0;
  const showXp = xpReward !== undefined && xpReward > 0;
  const showGems = gemReward !== undefined && gemReward > 0;
  const showBadge = Boolean(badgeName);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="treasure-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleCollect}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border-2 border-[#E5E5E5] bg-white p-6 text-center shadow-2xl transition-all duration-300 dark:border-[#37464F] dark:bg-[#131F24] sm:p-8 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleCollect}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-[#AFAFAF] hover:bg-[#F7F7F7] hover:text-[#4B4B4B] dark:text-[#52656D] dark:hover:bg-[#202F36] dark:hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* ========================================================================= */}
        {/* CHEST ANIMATION STAGE (Centerpiece with rotating sunburst & erupting gems)*/}
        {/* ========================================================================= */}
        <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
          {/* Rotating Sunburst Rays (visible during burst and reveal) */}
          <div
            className={`pointer-events-none absolute inset-0 -m-16 flex items-center justify-center transition-all duration-700 ${
              phase !== "anticipate"
                ? "opacity-100 scale-100 animate-[spin_20s_linear_infinite]"
                : "opacity-0 scale-75"
            }`}
          >
            <svg
              viewBox="0 0 200 200"
              className="h-full w-full drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id={sunburstGradientId} cx="100" cy="100" r="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFD700" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#FFC800" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#FF9600" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* 16 radiating sunburst triangular rays */}
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = i * 22.5;
                return (
                  <path
                    key={i}
                    d="M100 100 L90 0 L110 0 Z"
                    fill={`url(#${sunburstGradientId})`}
                    transform={`rotate(${angle} 100 100)`}
                  />
                );
              })}
            </svg>
          </div>

          {/* Explosive Flying Particles (Coins, Rubies, Sapphires, Emeralds, Stars) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {PARTICLES_CONFIG.map((p) => {
              const isErupted = phase !== "anticipate";
              return (
                <div
                  key={p.id}
                  style={{
                    transform: isErupted
                      ? `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg) scale(${p.scale})`
                      : `translate(0px, 0px) rotate(0deg) scale(0.2)`,
                    opacity: isErupted ? 1 : 0,
                    transition: `transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${p.delayMs}ms, opacity 0.35s ease ${p.delayMs}ms`,
                  }}
                  className={`absolute z-20 ${
                    phase === "reveal" ? "animate-[bounce_3s_ease-in-out_infinite]" : ""
                  }`}
                >
                  {p.type === "coin" && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#FFD900" stroke="#E5A500" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="7" stroke="#FFE55C" strokeWidth="1" fill="#FFC800" />
                      <polygon points="12,8 13.2,10.8 16,11.2 13.8,13 14.5,16 12,14.5 9.5,16 10.2,13 8,11.2 10.8,10.8" fill="#FFF280" />
                    </svg>
                  )}
                  {p.type === "ruby" && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <polygon points="6,3 18,3 23,9 12,22 1,9" fill="#FF4B4B" stroke="#B81414" strokeWidth="1" />
                      <polygon points="6,3 18,3 15,9 9,9" fill="#FF8585" />
                      <polygon points="9,9 15,9 12,22" fill="#E01E1E" />
                    </svg>
                  )}
                  {p.type === "sapphire" && (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <polygon points="12,2 22,12 12,22 2,12" fill="#1CB0F6" stroke="#0B79B3" strokeWidth="1" />
                      <polygon points="12,4 18,12 12,20 6,12" fill="#70D6FF" opacity="0.8" />
                    </svg>
                  )}
                  {p.type === "emerald" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7" fill="#58CC02" stroke="#388501" strokeWidth="1" />
                      <polygon points="8,4 16,4 20,8 20,16 16,20 8,20 4,16 4,8" fill="#85E838" opacity="0.75" />
                    </svg>
                  )}
                  {p.type === "star" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L13.8 8.8L20 12L13.8 15.2L12 22L10.2 15.2L4 12L10.2 8.8L12 2Z"
                        fill="#FFF280"
                        stroke="#FFC800"
                        strokeWidth="1"
                      />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>

          {/* Central 2D Vector Chest */}
          <div className="relative z-10">
            <QuestChest
              size={116}
              state={phase === "anticipate" ? "shaking" : "open"}
              glow
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* REWARD HEADINGS & DETAILS                                                 */}
        {/* ========================================================================= */}
        <div
          className={`transition-all duration-500 ${
            phase === "reveal"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
        >
          <h2
            id="treasure-modal-title"
            className="text-2xl sm:text-3xl font-extrabold text-[#4B4B4B] dark:text-white"
          >
            {title}
          </h2>

          {questTitle ? (
            <p className="mt-1 text-sm font-bold text-[#FF9600] dark:text-[#FFC800]">
              {questTitle}
            </p>
          ) : null}

          <p className="mt-1 text-xs sm:text-sm font-bold text-[#777777] dark:text-[#8495A0]">
            {subtitle || "You crushed your goal! Here is your reward:"}
          </p>

          {/* REWARD CARDS BADGES */}
          <div className="my-5 flex flex-wrap items-center justify-center gap-3">
            {/* XP Reward Card */}
            {showXp && (
              <div className="flex items-center gap-2.5 rounded-2xl border-2 border-[#FFC800] bg-[#FFF9E6] px-4 py-2.5 shadow-sm dark:border-[#FFC800]/50 dark:bg-[#2A2415]">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFC800] text-white shadow-xs">
                  <Zap className="h-5 w-5 fill-white stroke-white" />
                </div>
                <div className="text-left">
                  <span className="block text-lg font-extrabold text-[#D99B00] dark:text-[#FFD900] leading-none">
                    +{xpReward} XP
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#AFAFAF] dark:text-[#8495A0]">
                    Experience
                  </span>
                </div>
              </div>
            )}

            {/* Gems Reward Card */}
            {showGems && (
              <div className="flex items-center gap-2.5 rounded-2xl border-2 border-[#1CB0F6] bg-[#DDF4FF] px-4 py-2.5 shadow-sm dark:border-[#1CB0F6]/50 dark:bg-[#1C3B4E]">
                <span className="text-2xl leading-none select-none">💎</span>
                <div className="text-left">
                  <span className="block text-lg font-extrabold text-[#1CB0F6] dark:text-[#3BC0F8] leading-none">
                    +{gemReward} GEMS
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#AFAFAF] dark:text-[#8495A0]">
                    Treasure
                  </span>
                </div>
              </div>
            )}

            {/* Milestone Badge Card */}
            {showBadge && (
              <div className="flex items-center gap-2.5 rounded-2xl border-2 border-[#CE82FF] bg-[#F5EAFF] px-4 py-2.5 shadow-sm dark:border-[#CE82FF]/50 dark:bg-[#2B1B3D]">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#CE82FF] text-white shadow-xs">
                  {badgeIcon || <Trophy className="h-5 w-5 fill-white stroke-white" />}
                </div>
                <div className="text-left">
                  <span className="block text-sm font-extrabold text-[#9A46DE] dark:text-[#CE82FF] leading-none">
                    {badgeName}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#AFAFAF] dark:text-[#8495A0]">
                    Milestone Badge
                  </span>
                </div>
              </div>
            )}

            {/* Custom Rewards List */}
            {hasRewardsList &&
              rewards.map((r, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 rounded-2xl border-2 border-[#58CC02] bg-[#E8FAD4] px-4 py-2.5 shadow-sm dark:border-[#58CC02]/50 dark:bg-[#1A3308]"
                >
                  {r.icon || <Sparkles className="h-5 w-5 text-[#58CC02]" />}
                  <span className="text-sm font-extrabold text-[#46A302] dark:text-[#58CC02]">
                    {r.amount ? `+${r.amount} ` : ""}
                    {r.label}
                  </span>
                </div>
              ))}
          </div>

          {/* DUOLINGO TACTILE CLAIM BUTTON */}
          <PushButton
            variant="green"
            onClick={handleCollect}
            className="w-full py-3.5 text-sm font-extrabold uppercase tracking-wider shadow-md"
          >
            Claim Reward
          </PushButton>
        </div>
      </div>
    </div>
  );
}
