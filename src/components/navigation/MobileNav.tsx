"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Dumbbell,
  Trophy,
  Target,
  Store,
  User,
} from "lucide-react";

const MOBILE_NAV_ITEMS = [
  { href: "/learn", label: "Learn", icon: BookOpen, activeColor: "text-[#58CC02]" },
  { href: "/practice", label: "Practice", icon: Dumbbell, activeColor: "text-[#1CB0F6]" },
  { href: "/leaderboard", label: "Ranks", icon: Trophy, activeColor: "text-[#FFC800]" },
  { href: "/quests", label: "Quests", icon: Target, activeColor: "text-[#FF9600]" },
  { href: "/shop", label: "Shop", icon: Store, activeColor: "text-[#CE82FF]" },
  { href: "/profile", label: "Profile", icon: User, activeColor: "text-[#FF4B4B]" },
];

export function MobileNav() {
  const pathname = usePathname();

  // Hide mobile bottom nav during full-screen lesson sessions
  if (pathname.startsWith("/lesson/")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t-2 border-[#E5E5E5] bg-white px-2 py-2.5 backdrop-blur-lg lg:hidden">
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/learn" && pathname.startsWith(item.href)) ||
          (item.href === "/learn" && pathname === "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-1 transition-all ${
              isActive ? item.activeColor : "text-[#AFAFAF] hover:text-[#4B4B4B]"
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`} />
            <span className="text-[10px] font-extrabold uppercase tracking-tight">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
