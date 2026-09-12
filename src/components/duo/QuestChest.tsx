"use client";

import React from "react";

export interface QuestChestProps {
  isOpen?: boolean;
  className?: string;
  size?: number;
  animated?: boolean;
  state?: "idle" | "shaking" | "opening" | "open" | "closed";
  glow?: boolean;
  variant?: "wood" | "slate";
  locked?: boolean;
}

export function QuestChest({
  isOpen = false,
  className = "",
  size = 40,
  animated = false,
  state,
  glow = false,
  variant = "wood",
  locked = false,
}: QuestChestProps) {
  // Determine effective visual state
  const effectiveState =
    state ?? (isOpen ? "open" : animated ? "idle" : "closed");

  const isChestOpen = effectiveState === "open" || effectiveState === "opening";
  const isShaking = effectiveState === "shaking";
  const isIdle = effectiveState === "idle";
  const isSlate = variant === "slate" || locked;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        isIdle && animated ? "animate-[chest-float_3s_ease-in-out_infinite]" : ""
      } ${isShaking ? "animate-[chest-shake_0.4s_ease-in-out_infinite]" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Outer Glow */}
      {(glow || isChestOpen || isShaking) && !isSlate && (
        <div
          className={`absolute inset-0 -m-1.5 rounded-full blur-md pointer-events-none transition-opacity duration-300 ${
            isChestOpen
              ? "bg-[#FFC800]/40 dark:bg-[#FFC800]/30 animate-pulse"
              : isShaking
              ? "bg-[#FF9600]/50 animate-ping"
              : "bg-[#FFD900]/25"
          }`}
        />
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible transition-transform duration-300"
      >
        <defs>
          {/* Wood / Slate Textures */}
          <linearGradient id="chestWoodLid" x1="50" y1="18" x2="50" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isSlate ? "#4B5E68" : "#C86D3B"} />
            <stop offset="35%" stopColor={isSlate ? "#37464F" : "#A65B2E"} />
            <stop offset="100%" stopColor={isSlate ? "#2B383F" : "#7A3B18"} />
          </linearGradient>

          <linearGradient id="chestWoodBase" x1="50" y1="46" x2="50" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isSlate ? "#37464F" : "#964C23"} />
            <stop offset="60%" stopColor={isSlate ? "#2B383F" : "#7E3D19"} />
            <stop offset="100%" stopColor={isSlate ? "#202F36" : "#5E2A0E"} />
          </linearGradient>

          <linearGradient id="chestWoodInterior" x1="50" y1="20" x2="50" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4A1E07" />
            <stop offset="100%" stopColor="#2D1103" />
          </linearGradient>

          {/* Gold / Steel Metallic Gradients */}
          <linearGradient id="chestGoldLight" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isSlate ? "#677B86" : "#FFF280"} />
            <stop offset="25%" stopColor={isSlate ? "#52656D" : "#FFD900"} />
            <stop offset="70%" stopColor={isSlate ? "#43535B" : "#FFC800"} />
            <stop offset="100%" stopColor={isSlate ? "#37464F" : "#D99B00"} />
          </linearGradient>

          <linearGradient id="chestGoldDark" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isSlate ? "#52656D" : "#FFD900"} />
            <stop offset="50%" stopColor={isSlate ? "#43535B" : "#E5A500"} />
            <stop offset="100%" stopColor={isSlate ? "#2B383F" : "#B37D00"} />
          </linearGradient>

          {/* Treasure Interior Glow */}
          <radialGradient id="chestInteriorGlow" cx="50" cy="50" r="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFBE6" />
            <stop offset="30%" stopColor="#FFE066" />
            <stop offset="70%" stopColor="#FFC800" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF9600" stopOpacity="0" />
          </radialGradient>

          {/* Gemstone Gradients */}
          <linearGradient id="rubyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF8585" />
            <stop offset="40%" stopColor="#FF4B4B" />
            <stop offset="100%" stopColor="#C41515" />
          </linearGradient>

          <linearGradient id="sapphireGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8BE3FF" />
            <stop offset="45%" stopColor="#1CB0F6" />
            <stop offset="100%" stopColor="#0B79B3" />
          </linearGradient>

          <linearGradient id="emeraldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A8F560" />
            <stop offset="45%" stopColor="#58CC02" />
            <stop offset="100%" stopColor="#3E9101" />
          </linearGradient>

          <linearGradient id="amethystGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E599FF" />
            <stop offset="45%" stopColor="#B539F7" />
            <stop offset="100%" stopColor="#7E15B8" />
          </linearGradient>

          {/* Custom keyframe styles */}
          <style>{`
            @keyframes chest-float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-4px) rotate(-1deg); }
            }
            @keyframes chest-shake {
              0%, 100% { transform: translateX(0) rotate(0deg); }
              20% { transform: translateX(-3px) rotate(-3deg) scale(1.02); }
              40% { transform: translateX(3px) rotate(3deg) scale(1.03); }
              60% { transform: translateX(-3px) rotate(-2deg); }
              80% { transform: translateX(2px) rotate(2deg); }
            }
            @keyframes lid-open {
              0% { transform: translateY(0) scaleY(1); }
              100% { transform: translateY(-12px) scaleY(0.75); }
            }
          `}</style>
        </defs>

        {isChestOpen ? (
          /* ========================================================================= */
          /* OPEN CHEST (Tilted lid back, glowing hoard, gold coins, gems & sparkles)  */
          /* ========================================================================= */
          <g id="open-chest-group">
            {/* Sparkle bursts above chest */}
            <g id="sparkles">
              {/* Center Top Big Star */}
              <path
                d="M50 4L52.5 12.5L61 15L52.5 17.5L50 26L47.5 17.5L39 15L47.5 12.5L50 4Z"
                fill="#FFF280"
                stroke="#FFC800"
                strokeWidth="0.75"
              />
              {/* Right Sparkle */}
              <path
                d="M77 16L78.5 21L83.5 22.5L78.5 24L77 29L75.5 24L70.5 22.5L75.5 21L77 16Z"
                fill="#FFD900"
              />
              {/* Left Sparkle */}
              <path
                d="M23 18L24.5 23L29.5 24.5L24.5 26L23 31L21.5 26L16.5 24.5L21.5 23L23 18Z"
                fill="#FFD900"
              />
            </g>

            {/* Open Lid swung backward in perspective */}
            <g id="open-lid">
              {/* Outer lid rim tilted back */}
              <path
                d="M14 36C14 26 28 20 50 20C72 20 86 26 86 36L82 41C68 33 32 33 18 41L14 36Z"
                fill="#7A3B18"
              />
              {/* Interior curved underside of lid */}
              <path
                d="M18 41C32 33 68 33 82 41L84 45C68 38 32 38 16 45L18 41Z"
                fill="url(#chestWoodInterior)"
              />
              {/* Gold bands on opened lid (hinges) */}
              <path
                d="M27 25C31 24.5 35 24 35 34L31 36C31 28 29 26 27 25Z"
                fill="url(#chestGoldLight)"
              />
              <path
                d="M73 25C69 24.5 65 24 65 34L69 36C69 28 71 26 73 25Z"
                fill="url(#chestGoldLight)"
              />
            </g>

            {/* Interior Chest Cavity */}
            <path
              d="M16 45H84V56C84 56 81 60 50 60C19 60 16 56 16 56V45Z"
              fill="#3A1705"
            />

            {/* Glowing treasure radiant center */}
            <ellipse cx="50" cy="50" rx="34" ry="14" fill="url(#chestInteriorGlow)" />

            {/* Overbrimming Hoard: Gemstones & Gold Coins */}
            <g id="treasure-hoard">
              {/* Back Gold Coins */}
              <ellipse cx="32" cy="46" rx="7" ry="4" fill="#FFC800" stroke="#E5A500" strokeWidth="1" />
              <ellipse cx="68" cy="46" rx="7" ry="4" fill="#FFD900" stroke="#E5A500" strokeWidth="1" />
              <ellipse cx="50" cy="45" rx="8" ry="4.5" fill="#FFE55C" stroke="#E5A500" strokeWidth="1" />

              {/* Purple Amethyst (Left) */}
              <polygon
                points="22,43 27,39 31,43 28,49 24,49"
                fill="url(#amethystGrad)"
                stroke="#640A99"
                strokeWidth="0.8"
              />
              <polygon points="25,41 27,39 29,42 27,45" fill="#F4B8FF" opacity="0.6" />

              {/* Emerald Green Gem (Right) */}
              <polygon
                points="72,42 77,38 81,42 79,48 74,48"
                fill="url(#emeraldGrad)"
                stroke="#2C6901"
                strokeWidth="0.8"
              />
              <polygon points="75,40 77,38 79,41 76,44" fill="#C5FCA4" opacity="0.7" />

              {/* Central Cut Ruby */}
              <polygon
                points="36,46 43,40 50,45 47,54 39,54"
                fill="url(#rubyGrad)"
                stroke="#8A0B0B"
                strokeWidth="1"
              />
              {/* Ruby Highlight Facet */}
              <polygon points="40,42 43,40 46,43 43,48" fill="#FFA3A3" opacity="0.75" />

              {/* Radiant Blue Sapphire */}
              <polygon
                points="52,44 60,39 67,44 64,52 56,52"
                fill="url(#sapphireGrad)"
                stroke="#065682"
                strokeWidth="1"
              />
              {/* Sapphire Highlight Facet */}
              <polygon points="56,41 60,39 63,42 60,47" fill="#BDEEFF" opacity="0.8" />

              {/* Front Mountain of Gold Coins */}
              {/* Coin 1 */}
              <circle cx="27" cy="52" r="6" fill="url(#chestGoldLight)" stroke="#D99B00" strokeWidth="1.2" />
              <circle cx="27" cy="52" r="4" fill="#FFE55C" opacity="0.5" />

              {/* Coin 2 */}
              <circle cx="41" cy="53" r="6.5" fill="url(#chestGoldLight)" stroke="#D99B00" strokeWidth="1.2" />
              <circle cx="41" cy="53" r="4.2" fill="#FFE55C" opacity="0.5" />

              {/* Coin 3 */}
              <circle cx="59" cy="53" r="6.5" fill="url(#chestGoldLight)" stroke="#D99B00" strokeWidth="1.2" />
              <circle cx="59" cy="53" r="4.2" fill="#FFE55C" opacity="0.5" />

              {/* Coin 4 */}
              <circle cx="73" cy="52" r="6" fill="url(#chestGoldLight)" stroke="#D99B00" strokeWidth="1.2" />
              <circle cx="73" cy="52" r="4" fill="#FFE55C" opacity="0.5" />

              {/* Front Center Overflow Coin */}
              <circle cx="50" cy="54" r="7" fill="url(#chestGoldLight)" stroke="#B37D00" strokeWidth="1.3" />
              <circle cx="50" cy="54" r="4.8" stroke="#FFE55C" strokeWidth="1" fill="none" />
              {/* Star on center coin */}
              <path
                d="M50 51.5L51 53.5L53 54L51 54.5L50 56.5L49 54.5L47 54L49 53.5L50 51.5Z"
                fill="#FF9600"
              />
            </g>

            {/* Chest Base / Box */}
            <g id="chest-base">
              {/* Outer Wooden Hull */}
              <path
                d="M14 52H86V76C86 82 81 86 74 86H26C19 86 14 82 14 76V52Z"
                fill="url(#chestWoodBase)"
              />

              {/* Wood Grain Planks (horizontal accent lines) */}
              <path d="M15 63H85" stroke="#5E2A0E" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M15 74H85" stroke="#5E2A0E" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 64H84" stroke="#B86937" strokeWidth="0.8" opacity="0.7" />
              <path d="M16 75H84" stroke="#B86937" strokeWidth="0.8" opacity="0.7" />

              {/* Left Gold Vertical Band */}
              <rect x="25" y="52" width="8" height="34" rx="1.5" fill="url(#chestGoldLight)" />
              <rect x="25" y="52" width="1.5" height="34" fill="#FFF280" opacity="0.7" />
              <rect x="31.5" y="52" width="1.5" height="34" fill="#B37D00" opacity="0.8" />

              {/* Left Band Rivets */}
              <circle cx="29" cy="57" r="1.8" fill="#FFF280" />
              <circle cx="29" cy="57" r="1.4" fill="#D99B00" />
              <circle cx="29" cy="68" r="1.8" fill="#FFF280" />
              <circle cx="29" cy="68" r="1.4" fill="#D99B00" />
              <circle cx="29" cy="79" r="1.8" fill="#FFF280" />
              <circle cx="29" cy="79" r="1.4" fill="#D99B00" />

              {/* Right Gold Vertical Band */}
              <rect x="67" y="52" width="8" height="34" rx="1.5" fill="url(#chestGoldLight)" />
              <rect x="67" y="52" width="1.5" height="34" fill="#FFF280" opacity="0.7" />
              <rect x="73.5" y="52" width="1.5" height="34" fill="#B37D00" opacity="0.8" />

              {/* Right Band Rivets */}
              <circle cx="71" cy="57" r="1.8" fill="#FFF280" />
              <circle cx="71" cy="57" r="1.4" fill="#D99B00" />
              <circle cx="71" cy="68" r="1.8" fill="#FFF280" />
              <circle cx="71" cy="68" r="1.4" fill="#D99B00" />
              <circle cx="71" cy="79" r="1.8" fill="#FFF280" />
              <circle cx="71" cy="79" r="1.4" fill="#D99B00" />

              {/* Base Bottom Gold Trim */}
              <path
                d="M17 83C25 85 40 86 50 86C60 86 75 85 83 83V84C83 87 78 88 74 88H26C22 88 17 87 17 84V83Z"
                fill="url(#chestGoldDark)"
              />

              {/* Bottom Edge Rim */}
              <rect x="13" y="50" width="74" height="4" rx="2" fill="#5E2A0E" />
              <rect x="13" y="49" width="74" height="3" rx="1.5" fill="url(#chestGoldLight)" />

              {/* Open Lock / Clasp hanging open */}
              <g id="open-lock-clasp">
                <rect x="45" y="53" width="10" height="12" rx="2.5" fill="url(#chestGoldLight)" stroke="#B37D00" strokeWidth="1" />
                <rect x="46" y="54" width="8" height="1.5" fill="#FFF280" />
                {/* Keyhole */}
                <circle cx="50" cy="58" r="1.8" fill="#3A1705" />
                <polygon points="49.2,58 50.8,58 51.3,62 48.7,62" fill="#3A1705" />
              </g>
            </g>
          </g>
        ) : (
          /* ========================================================================= */
          /* CLOSED CHEST (Rich wood grain, gold bands, 3D rivets, glowing keyhole)    */
          /* ========================================================================= */
          <g id="closed-chest-group">
            {/* Top Arched Dome Lid */}
            <g id="closed-lid">
              {/* Lid Wood Background */}
              <path
                d="M14 43C14 26 27 21 50 21C73 21 86 26 86 43V47H14V43Z"
                fill="url(#chestWoodLid)"
              />

              {/* Lid Wood Planks Curvature / Grain */}
              <path
                d="M15 36C22 28 35 24 50 24C65 24 78 28 85 36"
                stroke="#D87D43"
                strokeWidth="1.2"
                opacity="0.8"
                fill="none"
              />
              <path
                d="M14 42C23 35 36 32 50 32C64 32 77 35 86 42"
                stroke="#5E2A0E"
                strokeWidth="1.2"
                fill="none"
              />

              {/* Lid Horizontal Bottom Rim / Gasket */}
              <rect x="12" y="44" width="76" height="6" rx="2.5" fill="#5E2A0E" />
              <rect x="12" y="43" width="76" height="4.5" rx="2" fill="url(#chestGoldLight)" />
              <rect x="13" y="43.5" width="74" height="1.2" fill="#FFF280" opacity="0.75" />

              {/* Left Gold Band on Lid */}
              <path
                d="M25 24C27 28 27 36 27 44H33C33 36 33 28 31 24H25Z"
                fill="url(#chestGoldLight)"
              />
              <path d="M25 24V44" stroke="#FFF280" strokeWidth="1" opacity="0.7" />
              <path d="M33 24V44" stroke="#B37D00" strokeWidth="1" opacity="0.8" />
              {/* Lid Left Band Rivets */}
              <circle cx="29" cy="28" r="1.7" fill="#FFF280" />
              <circle cx="29" cy="28" r="1.3" fill="#D99B00" />
              <circle cx="30" cy="37" r="1.7" fill="#FFF280" />
              <circle cx="30" cy="37" r="1.3" fill="#D99B00" />

              {/* Right Gold Band on Lid */}
              <path
                d="M75 24C73 28 73 36 73 44H67C67 36 67 28 69 24H75Z"
                fill="url(#chestGoldLight)"
              />
              <path d="M67 24V44" stroke="#FFF280" strokeWidth="1" opacity="0.7" />
              <path d="M75 24V44" stroke="#B37D00" strokeWidth="1" opacity="0.8" />
              {/* Lid Right Band Rivets */}
              <circle cx="71" cy="28" r="1.7" fill="#FFF280" />
              <circle cx="71" cy="28" r="1.3" fill="#D99B00" />
              <circle cx="70" cy="37" r="1.7" fill="#FFF280" />
              <circle cx="70" cy="37" r="1.3" fill="#D99B00" />
            </g>

            {/* Chest Lower Box Hull */}
            <g id="closed-base">
              <path
                d="M14 48H86V76C86 82 81 86 74 86H26C19 86 14 82 14 76V48Z"
                fill="url(#chestWoodBase)"
              />

              {/* Horizontal Plank Seams */}
              <path d="M15 60H85" stroke="#5E2A0E" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M15 72H85" stroke="#5E2A0E" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 61H84" stroke="#B86937" strokeWidth="0.8" opacity="0.7" />
              <path d="M16 73H84" stroke="#B86937" strokeWidth="0.8" opacity="0.7" />

              {/* Left Gold Vertical Band */}
              <rect x="25" y="48" width="8" height="38" rx="1" fill="url(#chestGoldLight)" />
              <rect x="25" y="48" width="1.5" height="38" fill="#FFF280" opacity="0.7" />
              <rect x="31.5" y="48" width="1.5" height="38" fill="#B37D00" opacity="0.8" />

              {/* Left Base Rivets */}
              <circle cx="29" cy="54" r="1.8" fill="#FFF280" />
              <circle cx="29" cy="54" r="1.4" fill="#D99B00" />
              <circle cx="29" cy="66" r="1.8" fill="#FFF280" />
              <circle cx="29" cy="66" r="1.4" fill="#D99B00" />
              <circle cx="29" cy="78" r="1.8" fill="#FFF280" />
              <circle cx="29" cy="78" r="1.4" fill="#D99B00" />

              {/* Right Gold Vertical Band */}
              <rect x="67" y="48" width="8" height="38" rx="1" fill="url(#chestGoldLight)" />
              <rect x="67" y="48" width="1.5" height="38" fill="#FFF280" opacity="0.7" />
              <rect x="73.5" y="48" width="1.5" height="38" fill="#B37D00" opacity="0.8" />

              {/* Right Base Rivets */}
              <circle cx="71" cy="54" r="1.8" fill="#FFF280" />
              <circle cx="71" cy="54" r="1.4" fill="#D99B00" />
              <circle cx="71" cy="66" r="1.8" fill="#FFF280" />
              <circle cx="71" cy="66" r="1.4" fill="#D99B00" />
              <circle cx="71" cy="78" r="1.8" fill="#FFF280" />
              <circle cx="71" cy="78" r="1.4" fill="#D99B00" />

              {/* Bottom Gold Reinforcement Strip */}
              <path
                d="M17 83C25 85 40 86 50 86C60 86 75 85 83 83V84C83 87 78 88 74 88H26C22 88 17 87 17 84V83Z"
                fill="url(#chestGoldDark)"
              />
            </g>

            {/* Front Lock Clasp Plate & Keyhole */}
            <g id="closed-clasp">
              {/* Clasp Shadow */}
              <rect x="43" y="42" width="14" height="20" rx="3.5" fill="#421C07" opacity="0.6" />

              {/* Brass Lock Plate */}
              <rect
                x="44"
                y="41"
                width="12"
                height="19"
                rx="3"
                fill="url(#chestGoldLight)"
                stroke="#B37D00"
                strokeWidth="1.2"
              />
              <rect x="45" y="42" width="10" height="1.8" fill="#FFF280" />

              {/* Rivet on top clasp */}
              <circle cx="50" cy="45" r="1.4" fill="#FFE55C" />
              <circle cx="50" cy="45" r="1" fill="#D99B00" />

              {/* Keyhole Glow when shaking or active */}
              {(isShaking || glow) && (
                <circle cx="50" cy="51" r="5" fill="#FFC800" opacity="0.6" className="animate-pulse" />
              )}

              {/* Dark Keyhole Cutout */}
              <circle cx="50" cy="51" r="2.2" fill={isShaking ? "#FFE55C" : "#381705"} />
              <polygon
                points="48.9,51 51.1,51 51.8,56 48.2,56"
                fill={isShaking ? "#FFE55C" : "#381705"}
              />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
