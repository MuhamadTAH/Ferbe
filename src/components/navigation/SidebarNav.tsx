"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  BookOpen,
  Dumbbell,
  Trophy,
  Target,
  Store,
  User,
} from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useAppConfig } from "@/providers/ConvexClientProvider";

const NAV_ITEMS = [
  {
    href: "/learn",
    label: "Learn",
    icon: BookOpen,
    activeColor: "text-[#58CC02]",
    activeBg: "bg-[#E8FAD4] border-[#58CC02]/40",
  },
  {
    href: "/practice",
    label: "Practice",
    icon: Dumbbell,
    activeColor: "text-[#1CB0F6]",
    activeBg: "bg-[#DDF4FF] border-[#1CB0F6]/40",
  },
  {
    href: "/leaderboard",
    label: "Leaderboards",
    icon: Trophy,
    activeColor: "text-[#FFC800]",
    activeBg: "bg-[#FFF9E6] border-[#FFC800]/40",
  },
  {
    href: "/quests",
    label: "Quests",
    icon: Target,
    activeColor: "text-[#FF9600]",
    activeBg: "bg-[#FFF4E5] border-[#FF9600]/40",
  },
  {
    href: "/shop",
    label: "Shop",
    icon: Store,
    activeColor: "text-[#CE82FF]",
    activeBg: "bg-[#F8EDFF] border-[#CE82FF]/40",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
    activeColor: "text-[#FF4B4B]",
    activeBg: "bg-[#FFDFDF] border-[#FF4B4B]/40",
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { hasClerk } = useAppConfig();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r-2 border-[#E5E5E5] bg-white p-4 lg:flex">
      <div>
        {/* Brand Header */}
        <Link
          href="/learn"
          className="mb-8 flex items-center gap-3 px-3 py-2 text-2xl font-extrabold text-[#58CC02] transition-opacity hover:opacity-90"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#58CC02] text-white shadow-sm shadow-[#58CC02]/30">
            <Sparkles className="h-6 w-6" />
          </span>
          <span className="tracking-tight">Fêrbe</span>
          <span
            dir="rtl"
            className="font-kurdish text-lg font-bold text-[#58CC02]"
          >
            فێربە
          </span>
        </Link>

        {/* 6 Tabs Navigation */}
        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/learn" && pathname.startsWith(item.href)) ||
              (item.href === "/learn" &&
                (pathname === "/" || pathname.startsWith("/lesson/")));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-2xl border-2 px-4 py-3 text-sm font-extrabold uppercase tracking-wider transition-all active:translate-y-[1px] ${
                  isActive
                    ? `${item.activeBg} ${item.activeColor} border-current shadow-sm`
                    : "border-transparent text-[#777777] hover:bg-[#F7F7F7] hover:text-[#4B4B4B]"
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${
                    isActive ? item.activeColor : "text-[#AFAFAF]"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile / Auth */}
      {hasClerk && (
        <div className="border-t-2 border-[#E5E5E5] pt-4 px-2">
          <SignedIn>
            <div className="flex items-center gap-3">
              <UserButton />
              <span className="text-xs font-bold text-[#777777]">Account</span>
            </div>
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-[#1899D6] bg-[#1CB0F6] py-2.5 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-[#4FC3F9] active:translate-y-[2px] active:border-b-2"
            >
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          </SignedOut>
        </div>
      )}
    </aside>
  );
}
