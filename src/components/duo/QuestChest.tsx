interface QuestChestProps {
  isOpen?: boolean;
  className?: string;
  size?: number;
}

export function QuestChest({
  isOpen = false,
  className = "",
  size = 40,
}: QuestChestProps) {
  if (isOpen) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-md transition-transform duration-300 ${className}`}
      >
        {/* Sparkle bursts */}
        <path
          d="M32 4L34 11L41 13L34 15L32 22L30 15L23 13L30 11L32 4Z"
          fill="#FFD900"
        />
        <path
          d="M50 18L51.5 22.5L56 24L51.5 25.5L50 30L48.5 25.5L44 24L48.5 22.5L50 18Z"
          fill="#FFD900"
        />
        <path
          d="M14 20L15.5 24.5L20 26L15.5 27.5L14 32L12.5 27.5L8 26L12.5 24.5L14 20Z"
          fill="#FFD900"
        />

        {/* Chest Open Lid (tilted back) */}
        <path
          d="M8 26C8 20 18 16 32 16C46 16 56 20 56 26L52 29C48 24 38 21 32 21C26 21 16 24 12 29L8 26Z"
          fill="#854623"
        />
        <path
          d="M12 29C16 24 26 21 32 21C38 21 48 24 52 29H12Z"
          fill="#5C2D13"
        />
        {/* Gold trim on open lid */}
        <path
          d="M30 16.5C30 16.5 31 16 32 16C33 16 34 16.5 34 16.5V21.5C33 21.2 32 21 31 21C30.5 21 30 21.2 30 21.5V16.5Z"
          fill="#FFC800"
        />

        {/* Chest Interior Glow & Gold Pile */}
        <ellipse cx="32" cy="33" rx="22" ry="11" fill="#FFC800" />
        <ellipse cx="32" cy="32" rx="19" ry="8" fill="#FFE55C" />

        {/* Overbrimming Gold Coins & Gemstones */}
        {/* Red Ruby */}
        <polygon points="24,28 29,26 33,29 31,35 26,35" fill="#FF4B4B" />
        <polygon points="27,27 29,26 31,28 29,32" fill="#FF8585" />
        {/* Blue Sapphire */}
        <polygon points="34,27 39,25 43,28 41,33 36,33" fill="#1CB0F6" />
        <polygon points="37,26 39,25 41,27 39,30" fill="#70D6FF" />
        {/* Front Gold Coins */}
        <circle cx="21" cy="33" r="4.5" fill="#FFC800" stroke="#E5A500" strokeWidth="1" />
        <circle cx="28" cy="34" r="5" fill="#FFD900" stroke="#E5A500" strokeWidth="1" />
        <circle cx="36" cy="34" r="5" fill="#FFC800" stroke="#E5A500" strokeWidth="1" />
        <circle cx="43" cy="33" r="4.5" fill="#FFD900" stroke="#E5A500" strokeWidth="1" />
        <circle cx="32" cy="31" r="4" fill="#FFF066" />

        {/* Chest Lower Body (Wood Front) */}
        <path
          d="M10 32C10 32 9 52 11 54C12 55.5 15 56 32 56C49 56 52 55.5 53 54C55 52 54 32 54 32L51 34C51 49 48 52 32 52C16 52 13 49 13 34L10 32Z"
          fill="#6B371B"
        />
        <path
          d="M13 34C13 49 16 52 32 52C48 52 51 49 51 34H13Z"
          fill="#8B4513"
        />

        {/* Gold Bands on Base */}
        <path
          d="M18 34C18 48 19 51.5 21 52H24C22 51.5 21 48 21 34H18Z"
          fill="#FFC800"
        />
        <path
          d="M43 34C43 48 42 51.5 40 52H43C45 51.5 46 48 46 34H43Z"
          fill="#FFC800"
        />

        {/* Keyhole / Clasp Base */}
        <rect x="29" y="36" width="6" height="8" rx="2" fill="#FFC800" />
        <circle cx="32" cy="39" r="1.5" fill="#5C2D13" />
        <polygon points="31.5,39 32.5,39 33,42 31,42" fill="#5C2D13" />
      </svg>
    );
  }

  // Closed Bronze/Wood Chest (Duolingo style)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-sm transition-transform duration-200 ${className}`}
    >
      {/* Top Rounded Dome Lid */}
      <path
        d="M10 28C10 19 18 16 32 16C46 16 54 19 54 28V32H10V28Z"
        fill="#A65B2E"
      />
      <path
        d="M11 28C11 20 18.5 17.5 32 17.5C45.5 17.5 53 20 53 28V30H11V28Z"
        fill="#B86937"
      />
      {/* Lid Rim / Shadow */}
      <rect x="8" y="30" width="48" height="5" rx="2" fill="#8A441D" />

      {/* Gold Bands across Lid */}
      <path
        d="M19 18C20 23 20 27 20 30H24C24 27 24 23 23 18H19Z"
        fill="#FFC800"
      />
      <path
        d="M41 18C40 23 40 27 40 30H44C44 27 44 23 45 18H41Z"
        fill="#FFC800"
      />

      {/* Chest Base */}
      <path
        d="M10 33H54V50C54 53 50 55 32 55C14 55 10 53 10 50V33Z"
        fill="#8A441D"
      />
      <path
        d="M12 35H52V49C52 51.5 48 53.5 32 53.5C16 53.5 12 51.5 12 49V35Z"
        fill="#9C4E22"
      />

      {/* Gold Vertical Bands on Base */}
      <rect x="20" y="34" width="4" height="19" rx="1" fill="#FFC800" />
      <rect x="40" y="34" width="4" height="19" rx="1" fill="#FFC800" />

      {/* Bottom Trim */}
      <path
        d="M12 51C17 53 24 54 32 54C40 54 47 53 52 51V52C52 53 48 55 32 55C16 55 12 53 12 52V51Z"
        fill="#FFC800"
      />

      {/* Clasp & Lock Plate */}
      <rect x="28" y="29" width="8" height="11" rx="2.5" fill="#FFC800" />
      <circle cx="32" cy="33" r="1.5" fill="#5C2D13" />
      <polygon points="31.2,33 32.8,33 33.3,37 30.7,37" fill="#5C2D13" />
    </svg>
  );
}
