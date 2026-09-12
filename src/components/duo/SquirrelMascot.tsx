"use client";

import React, { useId } from "react";

export type MascotMood =
  | "idle"
  | "happy"
  | "celebrating"
  | "cheering"
  | "thinking"
  | "sad"
  | "fire"
  | "sleeping";

export type MascotAccessory =
  | "none"
  | "acorn"
  | "golden_acorn"
  | "sunglasses"
  | "party_hat";

export type MascotSize = "xs" | "sm" | "md" | "lg" | "xl" | number;

export interface SpeechBubbleProps {
  text: string;
  textKu?: string;
  position?: "top" | "right" | "left";
  className?: string;
}

export interface SquirrelMascotProps extends React.HTMLAttributes<HTMLDivElement> {
  mood?: MascotMood;
  accessory?: MascotAccessory;
  size?: MascotSize;
  animate?: boolean;
  interactive?: boolean;
  speechBubble?: SpeechBubbleProps;
  className?: string;
  title?: string;
  onClick?: () => void;
}

const SIZE_MAP: Record<"xs" | "sm" | "md" | "lg" | "xl", number> = {
  xs: 28,
  sm: 40,
  md: 72,
  lg: 128,
  xl: 192,
};

/**
 * Smorik (سمۆڕە) - Fêrbe's 2D vector squirrel mascot inspired by the Persian/Caucasian squirrel
 * native to the oak forests of Kurdistan, crafted in authentic Duolingo character art style.
 */
export function SquirrelMascot({
  mood = "idle",
  accessory = "none",
  size = "md",
  animate = false,
  interactive = false,
  speechBubble,
  className = "",
  title = "Smorik the Kurdish Squirrel",
  onClick,
  ...rest
}: SquirrelMascotProps) {
  const uniqueId = useId().replace(/:/g, "");
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size] || 72;

  // Resolve sunglasses: explicit accessory or the signature 'fire' streak mood
  const hasSunglasses = accessory === "sunglasses" || mood === "fire";

  // Resolve acorn: explicit accessory or holding golden acorn on celebrate
  const showAcorn =
    accessory === "acorn" ||
    accessory === "golden_acorn" ||
    mood === "celebrating";
  const isGoldenAcorn =
    accessory === "golden_acorn" || mood === "celebrating";

  const showPartyHat = accessory === "party_hat";

  const bubblePosition = speechBubble?.position || "top";

  return (
    <div
      className={`inline-flex items-center justify-center relative select-none ${
        bubblePosition === "top"
          ? "flex-col"
          : bubblePosition === "left"
          ? "flex-row-reverse"
          : "flex-row"
      } ${interactive ? "cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95" : ""} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {/* Speech Bubble */}
      {speechBubble && (
        <div
          className={`relative z-10 rounded-2xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#202F36] p-3 shadow-lg ${
            bubblePosition === "top"
              ? "mb-2 text-center"
              : bubblePosition === "left"
              ? "mr-3 text-right"
              : "ml-3 text-left"
          } ${speechBubble.className || ""}`}
          role="tooltip"
        >
          {speechBubble.textKu && (
            <p
              dir="rtl"
              lang="ku"
              className="font-kurdish text-sm font-extrabold text-[#4B4B4B] dark:text-white kurdish-word leading-snug"
            >
              {speechBubble.textKu}
            </p>
          )}
          <p className="text-xs font-bold text-[#777777] dark:text-[#8495A0] leading-snug">
            {speechBubble.text}
          </p>

          {/* Speech Bubble Arrow Indicator */}
          {bubblePosition === "top" && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-[#E5E5E5] dark:border-t-[#37464F]" />
          )}
          {bubblePosition === "left" && (
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[8px] border-l-[#E5E5E5] dark:border-l-[#37464F]" />
          )}
          {bubblePosition === "right" && (
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-r-[8px] border-r-[#E5E5E5] dark:border-r-[#37464F]" />
          )}
        </div>
      )}

      {/* SVG Vector Mascot */}
      <svg
        viewBox="0 0 200 200"
        width={pixelSize}
        height={pixelSize}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`${title} (${mood})`}
        className="overflow-visible"
      >
        <title>{title}</title>

        {/* Global Gradients and Filters */}
        <defs>
          {/* Flame Gradient */}
          <linearGradient id={`flameGrad-${uniqueId}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FF4B4B" />
            <stop offset="50%" stopColor="#FF9600" />
            <stop offset="100%" stopColor="#FFD900" />
          </linearGradient>

          {/* Golden Acorn Glow */}
          <linearGradient id={`goldGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="60%" stopColor="#FFC800" />
            <stop offset="100%" stopColor="#D48B00" />
          </linearGradient>

          {/* Acorn Nut Gradient */}
          <linearGradient id={`acornNutGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C48346" />
            <stop offset="70%" stopColor="#A0652C" />
            <stop offset="100%" stopColor="#7E4717" />
          </linearGradient>

          {/* Body Shading Linear Gradient */}
          <linearGradient id={`bodyShade-${uniqueId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF9B42" />
            <stop offset="60%" stopColor="#F27A1A" />
            <stop offset="100%" stopColor="#C4590A" />
          </linearGradient>

          {/* Tail Shading */}
          <linearGradient id={`tailGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9B42" />
            <stop offset="50%" stopColor="#F27A1A" />
            <stop offset="100%" stopColor="#B34C02" />
          </linearGradient>

          {/* Soft Shadow Under Character */}
          <radialGradient id={`groundShadow-${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Keyframe Animations */}
          <style>
            {`
              @keyframes tailSway_${uniqueId} {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(6deg); }
              }
              @keyframes headBob_${uniqueId} {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-2px); }
              }
              @keyframes blink_${uniqueId} {
                0%, 94%, 98%, 100% { transform: scaleY(1); }
                96% { transform: scaleY(0.1); }
              }
              @keyframes bounceCelebration_${uniqueId} {
                0%, 100% { transform: translateY(0px) scale(1); }
                50% { transform: translateY(-7px) scale(1.02); }
              }
              @keyframes flameFlicker_${uniqueId} {
                0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.95; }
                50% { transform: scale(1.08) rotate(-3deg); opacity: 1; }
              }
              @keyframes sleepFloat_${uniqueId} {
                0% { transform: translate(0, 0) scale(0.8); opacity: 0; }
                40% { opacity: 1; }
                80% { opacity: 0.8; }
                100% { transform: translate(14px, -24px) scale(1.2); opacity: 0; }
              }
              @keyframes starPulse_${uniqueId} {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.25) rotate(15deg); }
              }

              .smorik-tail-${uniqueId} {
                transform-origin: 80px 145px;
                ${animate ? `animation: tailSway_${uniqueId} 3.2s ease-in-out infinite;` : ""}
              }
              .smorik-bounce-${uniqueId} {
                ${animate && (mood === "celebrating" || mood === "cheering") ? `animation: bounceCelebration_${uniqueId} 1.2s ease-in-out infinite;` : ""}
              }
              .smorik-eyes-${uniqueId} {
                transform-origin: 102px 72px;
                ${animate && mood !== "sleeping" && mood !== "happy" ? `animation: blink_${uniqueId} 4.2s ease-in-out infinite;` : ""}
              }
              .smorik-flame-${uniqueId} {
                transform-origin: 55px 75px;
                ${animate ? `animation: flameFlicker_${uniqueId} 1s ease-in-out infinite;` : ""}
              }
              .smorik-star-${uniqueId} {
                transform-origin: center;
                ${animate ? `animation: starPulse_${uniqueId} 1.8s ease-in-out infinite;` : ""}
              }
            `}
          </style>
        </defs>

        {/* Root Animated Wrapper */}
        <g className={`smorik-bounce-${uniqueId}`}>
          {/* Ground Contact Shadow */}
          {mood !== "sleeping" && (
            <ellipse cx="104" cy="186" rx="46" ry="8" fill={`url(#groundShadow-${uniqueId})`} />
          )}

          {/* ========================================================================= */}
          {/* SLEEPING MOOD RENDERING */}
          {/* ========================================================================= */}
          {mood === "sleeping" ? (
            <g>
              {/* Sleeping Ground Shadow */}
              <ellipse cx="102" cy="180" rx="52" ry="9" fill={`url(#groundShadow-${uniqueId})`} />

              {/* Curled Body Base */}
              <ellipse cx="102" cy="138" rx="46" ry="38" fill={`url(#bodyShade-${uniqueId})`} />
              {/* 3D Under-shading */}
              <path
                d="M 60 148 C 65 174, 138 174, 144 148 C 136 170, 70 170, 60 148 Z"
                fill="#C4590A"
              />

              {/* Curled Head */}
              <circle cx="82" cy="120" r="28" fill="#F27A1A" />
              {/* Head Highlight */}
              <path
                d="M 64 104 C 74 95, 96 98, 102 108 C 94 100, 72 98, 64 104 Z"
                fill="#FF9B42"
              />

              {/* Ears Tucked */}
              <path
                d="M 65 98 C 58 88, 62 76, 70 78 C 76 80, 76 90, 75 100 Z"
                fill="#F27A1A"
              />
              <path
                d="M 66 94 C 62 86, 65 80, 70 82 C 73 84, 73 90, 71 96 Z"
                fill="#FFF2DC"
              />

              {/* Cheek & Blush */}
              <circle cx="72" cy="126" r="10" fill="#FFF2DC" />
              <ellipse cx="70" cy="129" rx="6" ry="3.5" fill="#FF8A8A" opacity="0.75" />

              {/* Nose */}
              <ellipse cx="60" cy="124" rx="4.5" ry="3.5" fill="#4A2600" />
              <ellipse cx="59" cy="123" rx="1.5" ry="1" fill="#FFFFFF" opacity="0.8" />

              {/* Closed Sleeping Eye ◡ */}
              <path
                d="M 76 117 Q 82 123 88 117"
                stroke="#3E1F08"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />

              {/* Tail Wrapped Like a Warm Duvet / Blanket */}
              <path
                d="M 52 144 C 44 115, 62 90, 95 86 C 138 82, 162 105, 156 138 C 150 170, 108 174, 76 166 C 96 168, 142 165, 144 136 C 146 112, 126 96, 96 98 C 72 100, 56 120, 60 144 Z"
                fill={`url(#tailGrad-${uniqueId})`}
              />
              {/* Tail Fur Fluff Rim */}
              <path
                d="M 85 87 C 98 84, 120 86, 134 94 C 118 88, 98 87, 85 87 Z"
                fill="#FF9B42"
              />
              <path
                d="M 76 166 C 105 174, 145 166, 154 138 C 145 160, 105 166, 76 166 Z"
                fill="#B34C02"
              />

              {/* Floating 'Z z z' Animation */}
              <g style={{ transformOrigin: "140px 80px" }}>
                <text
                  x="125"
                  y="78"
                  fontFamily="sans-serif"
                  fontWeight="900"
                  fontSize="16"
                  fill="#CE82FF"
                  style={animate ? { animation: `sleepFloat_${uniqueId} 3s ease-in-out infinite` } : {}}
                >
                  Z
                </text>
                <text
                  x="142"
                  y="62"
                  fontFamily="sans-serif"
                  fontWeight="900"
                  fontSize="13"
                  fill="#CE82FF"
                  opacity="0.85"
                  style={
                    animate
                      ? { animation: `sleepFloat_${uniqueId} 3s ease-in-out infinite 0.7s` }
                      : {}
                  }
                >
                  z
                </text>
                <text
                  x="154"
                  y="48"
                  fontFamily="sans-serif"
                  fontWeight="900"
                  fontSize="10"
                  fill="#CE82FF"
                  opacity="0.7"
                  style={
                    animate
                      ? { animation: `sleepFloat_${uniqueId} 3s ease-in-out infinite 1.4s` }
                      : {}
                  }
                >
                  z
                </text>
              </g>
            </g>
          ) : (
            /* ========================================================================= */
            /* UPRIGHT ACTIVE MOODS (idle, happy, celebrating, cheering, thinking, sad, fire) */
            /* ========================================================================= */
            <g>
              {/* 1. Fluffy Curved S-Tail (Behind Body) */}
              <g className={`smorik-tail-${uniqueId}`}>
                {/* Fire Aura Effect on Tail */}
                {mood === "fire" && (
                  <g className={`smorik-flame-${uniqueId}`}>
                    <path
                      d="M 85 140 C 45 140, 10 115, 12 70 C 14 25, 48 -2, 85 0 C 98 1, 106 12, 100 24 C 94 36, 80 36, 68 45 C 50 56, 44 86, 56 112 C 64 128, 78 138, 88 142 Z"
                      fill={`url(#flameGrad-${uniqueId})`}
                      opacity="0.75"
                    />
                    {/* Secondary Flame Lick */}
                    <path
                      d="M 55 18 C 65 6, 80 8, 86 16 C 78 18, 68 20, 60 28 C 50 38, 48 54, 52 70 C 42 55, 46 32, 55 18 Z"
                      fill="#FFF176"
                    />
                  </g>
                )}

                {/* Main Tail Body */}
                <path
                  d="M 82 144 C 54 144, 22 120, 24 82 C 26 42, 54 16, 84 18 C 98 19, 102 30, 96 38 C 90 46, 76 46, 65 54 C 48 64, 44 92, 56 114 C 64 128, 76 138, 86 142 Z"
                  fill={`url(#tailGrad-${uniqueId})`}
                />

                {/* 3D Bottom Tail Shading */}
                <path
                  d="M 82 144 C 64 144, 45 132, 40 118 C 45 128, 62 138, 86 142 Z"
                  fill="#8F3900"
                />

                {/* Top Highlight on Tail Arch */}
                <path
                  d="M 44 60 C 40 38, 60 22, 84 22 C 70 24, 48 38, 48 60 Z"
                  fill="#FF9B42"
                />

                {/* Decorative Fur Tufts on Tail Tip */}
                <path
                  d="M 84 18 C 88 12, 95 12, 98 16 C 94 18, 88 20, 84 18 Z"
                  fill="#FFB673"
                />
              </g>

              {/* 2. Feet (Chunky Duolingo Oval Feet) */}
              <g id="feet">
                {/* Left Foot */}
                <ellipse cx="80" cy="178" rx="15" ry="8" fill="#C4590A" />
                <ellipse cx="80" cy="176" rx="14" ry="7" fill="#F27A1A" />
                {/* Toes Accent */}
                <circle cx="73" cy="178" r="2.2" fill="#C4590A" />
                <circle cx="80" cy="179" r="2.2" fill="#C4590A" />
                <circle cx="87" cy="178" r="2.2" fill="#C4590A" />

                {/* Right Foot */}
                <ellipse cx="128" cy="178" rx="15" ry="8" fill="#C4590A" />
                <ellipse cx="128" cy="176" rx="14" ry="7" fill="#F27A1A" />
                {/* Toes Accent */}
                <circle cx="121" cy="178" r="2.2" fill="#C4590A" />
                <circle cx="128" cy="179" r="2.2" fill="#C4590A" />
                <circle cx="135" cy="178" r="2.2" fill="#C4590A" />
              </g>

              {/* 3. Plump Body & Cream Belly */}
              <g id="body">
                {/* Pear-shaped Body Base */}
                <path
                  d="M 66 122 C 58 150, 62 176, 104 176 C 146 176, 150 150, 142 122 C 136 102, 126 94, 104 94 C 82 94, 72 102, 66 122 Z"
                  fill={`url(#bodyShade-${uniqueId})`}
                />

                {/* 3D Bottom Body Shading */}
                <path
                  d="M 68 152 C 75 174, 133 174, 140 152 C 132 170, 76 170, 68 152 Z"
                  fill="#C4590A"
                />

                {/* Warm Soft Cream Belly Patch */}
                <path
                  d="M 82 134 C 80 156, 86 172, 104 172 C 122 172, 128 156, 126 134 C 124 118, 118 110, 104 110 C 90 110, 84 118, 82 134 Z"
                  fill="#FFF2DC"
                />
                {/* Belly Bottom Shadow */}
                <path
                  d="M 88 162 C 94 170, 114 170, 120 162 C 114 168, 94 168, 88 162 Z"
                  fill="#EED8B5"
                />
              </g>

              {/* 4. Head & Ears */}
              <g
                id="head"
                style={
                  mood === "thinking"
                    ? { transform: "rotate(6deg)", transformOrigin: "104px 90px" }
                    : {}
                }
              >
                {/* Left Ear */}
                <g
                  style={
                    mood === "sad"
                      ? { transform: "rotate(-18deg)", transformOrigin: "72px 46px" }
                      : {}
                  }
                >
                  <path
                    d="M 64 48 C 56 32, 60 14, 74 16 C 84 18, 86 32, 82 46 Z"
                    fill="#F27A1A"
                  />
                  {/* Ear 3D Backing */}
                  <path
                    d="M 64 48 C 60 38, 62 26, 68 20 C 62 26, 60 38, 64 48 Z"
                    fill="#C4590A"
                  />
                  {/* Inner Soft Cream Fur Tuft */}
                  <path
                    d="M 68 44 C 64 34, 66 22, 74 24 C 78 26, 80 34, 78 44 Z"
                    fill="#FFF2DC"
                  />
                </g>

                {/* Right Ear */}
                <g
                  style={
                    mood === "sad"
                      ? { transform: "rotate(18deg)", transformOrigin: "136px 46px" }
                      : {}
                  }
                >
                  <path
                    d="M 126 46 C 122 32, 124 18, 134 16 C 148 14, 152 32, 144 48 Z"
                    fill="#F27A1A"
                  />
                  {/* Ear 3D Backing */}
                  <path
                    d="M 144 48 C 148 38, 146 26, 140 20 C 146 26, 148 38, 144 48 Z"
                    fill="#C4590A"
                  />
                  {/* Inner Soft Cream Fur Tuft */}
                  <path
                    d="M 130 44 C 128 34, 130 26, 134 24 C 142 22, 144 34, 140 44 Z"
                    fill="#FFF2DC"
                  />
                </g>

                {/* Main Bulbous Head */}
                <path
                  d="M 58 76 C 56 50, 76 38, 104 38 C 132 38, 152 50, 150 76 C 150 102, 132 114, 104 114 C 76 114, 58 102, 58 76 Z"
                  fill="#F27A1A"
                />

                {/* Top Forehead Highlight */}
                <path
                  d="M 80 44 C 92 40, 116 40, 128 44 C 118 42, 90 42, 80 44 Z"
                  fill="#FF9B42"
                />

                {/* Bottom Head / Chin 3D Shading */}
                <path
                  d="M 72 104 C 84 112, 124 112, 136 104 C 126 112, 82 112, 72 104 Z"
                  fill="#C4590A"
                />

                {/* Fluffy Cream Cheek Patches */}
                <ellipse cx="76" cy="84" rx="15" ry="12" fill="#FFF2DC" />
                <ellipse cx="132" cy="84" rx="15" ry="12" fill="#FFF2DC" />

                {/* Rosy Cheeks Blush */}
                <ellipse cx="72" cy="87" rx="8" ry="5.5" fill="#FF8A8A" opacity="0.65" />
                <ellipse cx="136" cy="87" rx="8" ry="5.5" fill="#FF8A8A" opacity="0.65" />

                {/* Snout Cream Center Under Nose */}
                <ellipse cx="104" cy="88" rx="14" ry="10" fill="#FFF2DC" />

                {/* Chocolate Button Nose */}
                <ellipse cx="104" cy="82" rx="5.5" ry="4" fill="#4A2600" />
                {/* Nose Specular Catchlight */}
                <ellipse cx="103" cy="81" rx="1.8" ry="1" fill="#FFFFFF" opacity="0.8" />

                {/* 5. Mouth Variants */}
                {mood === "happy" || mood === "celebrating" || mood === "cheering" ? (
                  /* Wide Beaming Duolingo Open Smile */
                  <g id="open-mouth">
                    <path
                      d="M 94 87 Q 104 86 114 87 C 114 100, 94 100, 94 87 Z"
                      fill="#3E1F08"
                    />
                    {/* Pink Tongue */}
                    <path
                      d="M 98 94 Q 104 90 110 94 C 108 98, 100 98, 98 94 Z"
                      fill="#FF6B81"
                    />
                  </g>
                ) : mood === "thinking" ? (
                  /* Curious Asymmetric Smirk/Mouth */
                  <path
                    d="M 98 89 Q 104 93 111 88"
                    stroke="#4A2600"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                ) : mood === "sad" ? (
                  /* Downturned Soft Empathetic Mouth */
                  <path
                    d="M 97 92 Q 104 86 111 92"
                    stroke="#4A2600"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                ) : mood === "fire" ? (
                  /* Smug Cool Streak Smirk */
                  <path
                    d="M 97 89 Q 104 92 113 86"
                    stroke="#4A2600"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                ) : (
                  /* Idle: Gentle Cute W-shaped Cat Smile */
                  <path
                    d="M 96 88 Q 100 91 104 87 Q 108 91 112 88"
                    stroke="#4A2600"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}

                {/* 6. Eyes Variants & Duolingo Speculars */}
                {hasSunglasses ? (
                  /* Sleek Black Duolingo Sunglasses */
                  <g id="sunglasses">
                    {/* Left Frame */}
                    <rect
                      x="70"
                      y="62"
                      width="30"
                      height="20"
                      rx="7"
                      fill="#182126"
                      stroke="#0F1519"
                      strokeWidth="2"
                    />
                    {/* Right Frame */}
                    <rect
                      x="108"
                      y="62"
                      width="30"
                      height="20"
                      rx="7"
                      fill="#182126"
                      stroke="#0F1519"
                      strokeWidth="2"
                    />
                    {/* Bridge */}
                    <path
                      d="M 99 68 Q 104 66 109 68"
                      stroke="#0F1519"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* White Reflection Glares */}
                    <path
                      d="M 74 66 L 84 78"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                    <path
                      d="M 87 66 L 93 74"
                      stroke="#FFFFFF"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      opacity="0.65"
                    />
                    <path
                      d="M 112 66 L 122 78"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                    <path
                      d="M 125 66 L 131 74"
                      stroke="#FFFFFF"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      opacity="0.65"
                    />
                  </g>
                ) : mood === "happy" ? (
                  /* Joyful Laughing Curved Eyes ⌒ ⌒ */
                  <g id="happy-eyes">
                    <path
                      d="M 78 72 Q 88 62 98 72"
                      stroke="#3E1F08"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M 110 72 Q 120 62 130 72"
                      stroke="#3E1F08"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </g>
                ) : (
                  /* Expressive Open Round Eyes */
                  <g className={`smorik-eyes-${uniqueId}`}>
                    {/* Left Eye */}
                    <g>
                      <ellipse cx="88" cy="71" rx="9" ry="11" fill="#3E1F08" />
                      {/* Big Glossy Duolingo Specular Highlight */}
                      <circle
                        cx={mood === "thinking" ? 90 : 90.5}
                        cy={mood === "thinking" ? 67 : 68}
                        r="3.8"
                        fill="#FFFFFF"
                      />
                      {/* Secondary Catchlight */}
                      <circle
                        cx={mood === "thinking" ? 85 : 85}
                        cy={mood === "thinking" ? 74 : 74.5}
                        r="1.6"
                        fill="#FFFFFF"
                        opacity="0.85"
                      />
                    </g>

                    {/* Right Eye */}
                    <g>
                      <ellipse cx="120" cy="71" rx="9" ry="11" fill="#3E1F08" />
                      {/* Big Glossy Duolingo Specular Highlight */}
                      <circle
                        cx={mood === "thinking" ? 122 : 122.5}
                        cy={mood === "thinking" ? 67 : 68}
                        r="3.8"
                        fill="#FFFFFF"
                      />
                      {/* Secondary Catchlight */}
                      <circle
                        cx={mood === "thinking" ? 117 : 117}
                        cy={mood === "thinking" ? 74 : 74.5}
                        r="1.6"
                        fill="#FFFFFF"
                        opacity="0.85"
                      />
                    </g>

                    {/* Sad Eyebrows & Tear Drop */}
                    {mood === "sad" && (
                      <g>
                        {/* Empathetic Slanted Brows */}
                        <path
                          d="M 80 58 Q 88 62 96 61"
                          stroke="#3E1F08"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <path
                          d="M 128 58 Q 120 62 112 61"
                          stroke="#3E1F08"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Glistening Tear Drop on Left Cheek */}
                        <path
                          d="M 78 78 C 76 83, 73 87, 76 89 C 79 91, 82 87, 80 82 Z"
                          fill="#3BC0F8"
                        />
                        <circle cx="76.5" cy="87.5" r="1" fill="#FFFFFF" />
                      </g>
                    )}

                    {/* Thinking Raised Eyebrow */}
                    {mood === "thinking" && (
                      <g>
                        <path
                          d="M 80 56 Q 88 53 95 57"
                          stroke="#3E1F08"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <path
                          d="M 112 59 Q 120 59 127 61"
                          stroke="#3E1F08"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </g>
                    )}
                  </g>
                )}

                {/* Party Hat Accessory */}
                {showPartyHat && (
                  <g id="party-hat" transform="translate(94, 10) rotate(8)">
                    {/* Cone Body */}
                    <path d="M 10 0 L 22 34 L -2 34 Z" fill="#58CC02" />
                    {/* Stripes */}
                    <path d="M 6 12 L 18 12 L 20 20 L 2 20 Z" fill="#FFC800" />
                    <path d="M 0 26 L 21 26 L 22 34 L -2 34 Z" fill="#1CB0F6" />
                    {/* Fluffy White Pom-Pom */}
                    <circle cx="10" cy="0" r="4.5" fill="#FFFFFF" />
                  </g>
                )}
              </g>

              {/* 7. Front Paws & Dynamic Arm Poses */}
              <g id="arms">
                {mood === "celebrating" ? (
                  /* Both Arms Held Victoriously in the Air! */
                  <g id="celebrating-arms">
                    {/* Left Raised Arm */}
                    <path
                      d="M 72 124 C 60 110, 56 86, 68 76 C 76 68, 86 84, 80 102 Z"
                      fill="#F27A1A"
                    />
                    {/* Left Paw Fist/Claws */}
                    <circle cx="67" cy="74" r="6.5" fill="#F27A1A" />
                    <circle cx="63" cy="73" r="2.2" fill="#C4590A" />
                    <circle cx="68" cy="70" r="2.2" fill="#C4590A" />

                    {/* Right Raised Arm */}
                    <path
                      d="M 136 124 C 148 110, 152 86, 140 76 C 132 68, 122 84, 128 102 Z"
                      fill="#F27A1A"
                    />
                    {/* Right Paw */}
                    <circle cx="141" cy="74" r="6.5" fill="#F27A1A" />
                    <circle cx="145" cy="73" r="2.2" fill="#C4590A" />
                    <circle cx="140" cy="70" r="2.2" fill="#C4590A" />
                  </g>
                ) : mood === "cheering" ? (
                  /* One Fist Pumped High in Triumph! */
                  <g id="cheering-arms">
                    {/* Right Fist Raised High */}
                    <path
                      d="M 134 126 C 146 112, 154 80, 142 66 C 134 56, 122 74, 126 100 Z"
                      fill="#F27A1A"
                    />
                    <circle cx="144" cy="62" r="7.5" fill="#F27A1A" />
                    {/* Clenched Fist Knuckles */}
                    <circle cx="141" cy="58" r="2.5" fill="#C4590A" />
                    <circle cx="146" cy="59" r="2.5" fill="#C4590A" />
                    <circle cx="149" cy="63" r="2.5" fill="#C4590A" />

                    {/* Left Arm on Hip */}
                    <path
                      d="M 72 125 C 64 128, 62 142, 70 146 C 78 150, 84 138, 80 128 Z"
                      fill="#F27A1A"
                    />
                    <circle cx="70" cy="144" r="5.5" fill="#F27A1A" />
                  </g>
                ) : mood === "thinking" ? (
                  /* Right Paw on Chin Thoughtfully */
                  <g id="thinking-arms">
                    {/* Right Arm Reaching to Chin */}
                    <path
                      d="M 132 130 C 138 116, 134 98, 118 94 C 112 92, 114 104, 122 114 Z"
                      fill="#F27A1A"
                    />
                    <circle cx="116" cy="94" r="6" fill="#F27A1A" />
                    <circle cx="114" cy="91" r="2" fill="#C4590A" />
                    <circle cx="118" cy="91" r="2" fill="#C4590A" />

                    {/* Left Paw on Belly */}
                    <path
                      d="M 72 128 C 76 134, 86 136, 92 132 C 96 128, 92 122, 84 122 Z"
                      fill="#F27A1A"
                    />
                    <circle cx="92" cy="130" r="5.5" fill="#F27A1A" />
                  </g>
                ) : mood === "sad" ? (
                  /* Paws Clutched Together Sympathetically */
                  <g id="sad-arms">
                    <path
                      d="M 76 126 C 84 134, 98 136, 102 132 C 104 128, 96 122, 86 122 Z"
                      fill="#F27A1A"
                    />
                    <path
                      d="M 132 126 C 124 134, 110 136, 106 132 C 104 128, 112 122, 122 122 Z"
                      fill="#F27A1A"
                    />
                    <circle cx="104" cy="132" r="6" fill="#F27A1A" />
                  </g>
                ) : (
                  /* Idle / Default Friendly Standing Arms */
                  <g id="idle-arms">
                    {/* Left Paw Resting on Chest */}
                    <path
                      d="M 74 126 C 78 134, 88 138, 94 133 C 98 128, 94 121, 84 122 Z"
                      fill="#F27A1A"
                    />
                    <circle cx="93" cy="132" r="5" fill="#F27A1A" />
                    <circle cx="95" cy="130" r="1.8" fill="#C4590A" />
                    <circle cx="96" cy="133" r="1.8" fill="#C4590A" />

                    {/* Right Paw Resting on Chest */}
                    <path
                      d="M 134 126 C 130 134, 120 138, 114 133 C 110 128, 114 121, 124 122 Z"
                      fill="#F27A1A"
                    />
                    <circle cx="115" cy="132" r="5" fill="#F27A1A" />
                    <circle cx="113" cy="130" r="1.8" fill="#C4590A" />
                    <circle cx="112" cy="133" r="1.8" fill="#C4590A" />
                  </g>
                )}
              </g>

              {/* 8. Kurdish Oak Acorn (بەڕوو) Accessory */}
              {showAcorn && (
                <g
                  id="acorn"
                  transform={
                    mood === "celebrating"
                      ? "translate(104, 52) scale(1.15)"
                      : "translate(104, 138)"
                  }
                  className={isGoldenAcorn ? `smorik-star-${uniqueId}` : ""}
                  style={{ transformOrigin: "0px 0px" }}
                >
                  {/* Golden Aura / Starburst */}
                  {isGoldenAcorn && (
                    <circle cx="0" cy="0" r="18" fill="#FFC800" opacity="0.25" />
                  )}

                  {/* Acorn Nut Body */}
                  <path
                    d="M -9 2 C -10 12, 0 20, 0 22 C 0 20, 10 12, 9 2 Z"
                    fill={
                      isGoldenAcorn
                        ? `url(#goldGrad-${uniqueId})`
                        : `url(#acornNutGrad-${uniqueId})`
                    }
                  />

                  {/* Acorn Textured Cap */}
                  <path
                    d="M -11 2 C -11 -6, 11 -6, 11 2 Z"
                    fill={isGoldenAcorn ? "#D48B00" : "#6B3E11"}
                  />
                  {/* Cap Texture Beads */}
                  <circle
                    cx="-6"
                    cy="-1"
                    r="1.2"
                    fill={isGoldenAcorn ? "#FFF176" : "#4A2600"}
                  />
                  <circle
                    cx="0"
                    cy="-2"
                    r="1.2"
                    fill={isGoldenAcorn ? "#FFF176" : "#4A2600"}
                  />
                  <circle
                    cx="6"
                    cy="-1"
                    r="1.2"
                    fill={isGoldenAcorn ? "#FFF176" : "#4A2600"}
                  />

                  {/* Little Stem */}
                  <path
                    d="M 0 -5 C 1 -9, 4 -9, 3 -11"
                    stroke={isGoldenAcorn ? "#B37400" : "#4A2600"}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  {/* Golden Sparkles on Acorn */}
                  {isGoldenAcorn && (
                    <g>
                      <path
                        d="M -14 -6 L -11 -6 L -14 -9 L -14 -6 Z"
                        fill="#FFFFFF"
                      />
                      <circle cx="4" cy="8" r="1.5" fill="#FFFFFF" />
                    </g>
                  )}
                </g>
              )}

              {/* 9. Celebration Confetti & Sparkles */}
              {mood === "celebrating" && (
                <g id="celebration-sparkles">
                  {/* 4-pointed Star Sparkles */}
                  <path
                    d="M 42 42 Q 46 46 50 46 Q 46 46 42 50 Q 42 46 38 46 Q 42 46 42 42 Z"
                    fill="#FFC800"
                    className={`smorik-star-${uniqueId}`}
                  />
                  <path
                    d="M 162 44 Q 166 48 170 48 Q 166 48 162 52 Q 162 48 158 48 Q 162 48 162 44 Z"
                    fill="#58CC02"
                    className={`smorik-star-${uniqueId}`}
                  />
                  <path
                    d="M 36 94 Q 39 97 42 97 Q 39 97 36 100 Q 36 97 33 97 Q 36 97 36 94 Z"
                    fill="#1CB0F6"
                  />
                  <path
                    d="M 166 98 Q 169 101 172 101 Q 169 101 166 104 Q 166 101 163 101 Q 166 101 166 98 Z"
                    fill="#CE82FF"
                  />
                  <path
                    d="M 104 18 Q 106 21 108 21 Q 106 21 104 24 Q 104 21 102 21 Q 104 21 104 18 Z"
                    fill="#FF4B4B"
                  />

                  {/* Confetti Dots / Ribbons */}
                  <circle cx="28" cy="65" r="3" fill="#CE82FF" />
                  <circle cx="174" cy="72" r="3" fill="#FFC800" />
                  <rect
                    x="152"
                    y="24"
                    width="4"
                    height="7"
                    rx="1.5"
                    fill="#FF9600"
                    transform="rotate(25 154 27)"
                  />
                  <rect
                    x="48"
                    y="22"
                    width="4"
                    height="7"
                    rx="1.5"
                    fill="#1CB0F6"
                    transform="rotate(-20 50 25)"
                  />
                </g>
              )}
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
