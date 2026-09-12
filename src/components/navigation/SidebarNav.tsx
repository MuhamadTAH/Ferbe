"use client";

import { useState, useRef, useEffect } from "react";
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
  MoreHorizontal,
  Globe,
  Compass,
  Headphones,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/nextjs";
import { useAppConfig } from "@/providers/ConvexClientProvider";

const NAV_ITEMS = [
  {
    href: "/learn",
    label: "Learn",
    icon: BookOpen,
    activeColor: "text-[#58CC02] dark:text-[#3BC0F8]",
    activeBg: "bg-[#E8FAD4] border-[#58CC02]/40 dark:bg-[#202F36] dark:border-[#3BC0F8]",
  },
  {
    href: "/practice",
    label: "Practice",
    icon: Dumbbell,
    activeColor: "text-[#1CB0F6] dark:text-[#1CB0F6]",
    activeBg: "bg-[#DDF4FF] border-[#1CB0F6]/40 dark:bg-[#202F36] dark:border-[#1CB0F6]",
  },
  {
    href: "/leaderboard",
    label: "Leaderboards",
    icon: Trophy,
    activeColor: "text-[#FFC800] dark:text-[#FFC800]",
    activeBg: "bg-[#FFF9E6] border-[#FFC800]/40 dark:bg-[#202F36] dark:border-[#FFC800]",
  },
  {
    href: "/quests",
    label: "Quests",
    icon: Target,
    activeColor: "text-[#FF9600] dark:text-[#FF9600]",
    activeBg: "bg-[#FFF4E5] border-[#FF9600]/40 dark:bg-[#202F36] dark:border-[#FF9600]",
  },
  {
    href: "/shop",
    label: "Shop",
    icon: Store,
    activeColor: "text-[#CE82FF] dark:text-[#CE82FF]",
    activeBg: "bg-[#F8EDFF] border-[#CE82FF]/40 dark:bg-[#202F36] dark:border-[#CE82FF]",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
    activeColor: "text-[#FF4B4B] dark:text-[#FF4B4B]",
    activeBg: "bg-[#FFDFDF] border-[#FF4B4B]/40 dark:bg-[#202F36] dark:border-[#FF4B4B]",
  },
];

interface MoreSubActionsProps {
  onClose: () => void;
  onOpenHelp: () => void;
}

function ClerkMoreActions({ onClose, onOpenHelp }: MoreSubActionsProps) {
  const clerk = useClerk();

  return (
    <>
      <SignedIn>
        <button
          type="button"
          onClick={() => {
            onClose();
            clerk.openUserProfile();
          }}
          className="flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-extrabold text-[#4B4B4B] hover:bg-[#F7F7F7] transition-colors cursor-pointer text-left"
        >
          <Settings className="h-5 w-5 text-[#AFAFAF]" />
          <span>Settings</span>
        </button>
      </SignedIn>

      <button
        type="button"
        onClick={() => {
          onClose();
          onOpenHelp();
        }}
        className="flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-extrabold text-[#4B4B4B] hover:bg-[#F7F7F7] transition-colors cursor-pointer text-left"
      >
        <HelpCircle className="h-5 w-5 text-[#AFAFAF]" />
        <span>Help & FAQ</span>
      </button>

      <SignedIn>
        <button
          type="button"
          onClick={() => {
            onClose();
            clerk.signOut();
          }}
          className="flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-extrabold text-[#FF4B4B] hover:bg-[#FFDFDF]/50 transition-colors cursor-pointer text-left"
        >
          <LogOut className="h-5 w-5 text-[#FF4B4B]" />
          <span>Log Out</span>
        </button>
      </SignedIn>
    </>
  );
}

function DefaultMoreActions({ onClose, onOpenHelp }: MoreSubActionsProps) {
  return (
    <>
      <Link
        href="/profile"
        onClick={onClose}
        className="flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-extrabold text-[#4B4B4B] hover:bg-[#F7F7F7] transition-colors text-left"
      >
        <Settings className="h-5 w-5 text-[#AFAFAF]" />
        <span>Settings</span>
      </Link>

      <button
        type="button"
        onClick={() => {
          onClose();
          onOpenHelp();
        }}
        className="flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-extrabold text-[#4B4B4B] hover:bg-[#F7F7F7] transition-colors cursor-pointer text-left"
      >
        <HelpCircle className="h-5 w-5 text-[#AFAFAF]" />
        <span>Help & FAQ</span>
      </button>
    </>
  );
}

export function SidebarNav() {
  const pathname = usePathname();
  const { hasClerk } = useAppConfig();
  const [moreOpen, setMoreOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    if (isCurrentlyDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ferbe_theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ferbe_theme", "dark");
      setIsDark(true);
    }
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-4 lg:flex">
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

          {/* 6 Tabs Navigation + 7th MORE Tab */}
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
                      : "border-transparent text-[#777777] dark:text-[#8495A0] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] hover:text-[#4B4B4B] dark:hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      isActive ? item.activeColor : "text-[#AFAFAF] dark:text-[#52656D]"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* 7th Item: MORE with Flyout Popover */}
            <div ref={moreRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 px-4 py-3 text-sm font-extrabold uppercase tracking-wider transition-all active:translate-y-[1px] cursor-pointer ${
                  moreOpen
                    ? "border-current bg-[#F0F0F0] dark:bg-[#202F36] text-[#4B4B4B] dark:text-white shadow-sm"
                    : "border-transparent text-[#777777] dark:text-[#8495A0] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] hover:text-[#4B4B4B] dark:hover:text-white"
                }`}
              >
                <MoreHorizontal className="h-6 w-6 text-[#AFAFAF] dark:text-[#52656D]" />
                <span>More</span>
              </button>

              {/* Duolingo-style Flyout Menu */}
              {moreOpen && (
                <div className="absolute left-full bottom-0 ml-3 w-64 rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/courses"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-3 rounded-2xl p-2.5 text-xs font-extrabold text-[#4B4B4B] dark:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] transition-colors"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#DDF4FF] dark:bg-[#1C3B4E] text-[#1CB0F6]">
                        <Globe className="h-4 w-4" />
                      </div>
                      <div>
                        <div>Courses & Dialects</div>
                        <div className="text-[10px] font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                          Sorani, Kurmanji, Hawrami
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/sections"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-3 rounded-2xl p-2.5 text-xs font-extrabold text-[#4B4B4B] dark:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] transition-colors"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#E8FAD4] dark:bg-[#1E3B20] text-[#58CC02]">
                        <Compass className="h-4 w-4" />
                      </div>
                      <div>
                        <div>Curriculum Sections</div>
                        <div className="text-[10px] font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                          All 5 CEFR Stages
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/practice"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-3 rounded-2xl p-2.5 text-xs font-extrabold text-[#4B4B4B] dark:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] transition-colors"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FAF5FF] dark:bg-[#341F48] text-[#CE82FF]">
                        <Headphones className="h-4 w-4" />
                      </div>
                      <div>
                        <div>Alphabet & Sounds</div>
                        <div className="text-[10px] font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                          Letters & Audio Pronunciation
                        </div>
                      </div>
                    </Link>

                    <hr className="my-1.5 border-[#E5E5E5] dark:border-[#37464F]" />

                    {hasClerk ? (
                      <ClerkMoreActions
                        onClose={() => setMoreOpen(false)}
                        onOpenHelp={() => setHelpOpen(true)}
                      />
                    ) : (
                      <DefaultMoreActions
                        onClose={() => setMoreOpen(false)}
                        onOpenHelp={() => setHelpOpen(true)}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Footer: Theme Toggle & Profile / Auth */}
        <div className="border-t-2 border-[#E5E5E5] dark:border-[#37464F] pt-4 px-2 flex flex-col gap-2">
          {/* Authentic 1-Click Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex w-full items-center justify-between rounded-2xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-[#F7F7F7] dark:bg-[#202F36] px-3.5 py-2.5 text-xs font-extrabold uppercase tracking-wide text-[#777777] dark:text-[#8495A0] hover:bg-[#EBEBEB] dark:hover:bg-[#2B3E48] hover:text-[#4B4B4B] dark:hover:text-white transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              {isDark ? (
                <Moon className="h-4 w-4 text-[#3BC0F8]" />
              ) : (
                <Sun className="h-4 w-4 text-[#FFC800]" />
              )}
              <span>{isDark ? "Dark Theme" : "Light Theme"}</span>
            </div>
            <span className="text-[10px] rounded-lg bg-white dark:bg-[#131F24] border border-[#E5E5E5] dark:border-[#37464F] px-2 py-0.5 text-[#4B4B4B] dark:text-[#3BC0F8] font-bold">
              {isDark ? "ON" : "OFF"}
            </span>
          </button>

          {hasClerk && (
            <div>
              <SignedIn>
                <div className="flex items-center gap-3">
                  <UserButton />
                  <span className="text-xs font-bold text-[#777777] dark:text-[#8495A0]">Account</span>
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
        </div>
      </aside>

      {/* Help & FAQ Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DDF4FF] dark:bg-[#1C3B4E] text-[#1CB0F6]">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#4B4B4B] dark:text-white">
                    Fêrbe Help Center
                  </h3>
                  <p className="text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                    Frequently Asked Questions
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-[#AFAFAF] dark:text-[#8495A0] hover:bg-[#F7F7F7] dark:hover:bg-[#202F36] hover:text-[#4B4B4B] dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3.5 text-xs font-bold text-[#777777] dark:text-[#8495A0]">
              <div className="rounded-2xl bg-[#F7F7F7] dark:bg-[#202F36] p-3.5 border border-transparent dark:border-[#37464F]">
                <h4 className="font-extrabold text-[#4B4B4B] dark:text-white">
                  What dialect is taught?
                </h4>
                <p className="mt-1">
                  Fêrbe teaches Central Kurdish (Sorani / سۆرانی) using standard Kurdish Arabic script, spoken primarily in Sulaymaniyah, Erbil, and surrounding regions.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7F7F7] dark:bg-[#202F36] p-3.5 border border-transparent dark:border-[#37464F]">
                <h4 className="font-extrabold text-[#4B4B4B] dark:text-white">
                  How do Hearts and Gems work?
                </h4>
                <p className="mt-1">
                  You have 5 hearts for lessons. When you run out, you can restore them for free via Practice mode or refill them instantly with 350 gems in the Shop.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7F7F7] dark:bg-[#202F36] p-3.5 border border-transparent dark:border-[#37464F]">
                <h4 className="font-extrabold text-[#4B4B4B] dark:text-white">
                  How do I unlock Leaderboards?
                </h4>
                <p className="mt-1">
                  Complete your first 3 lessons on Fêrbe to enter the Bronze League and compete with other learners.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHelpOpen(false)}
              className="mt-6 w-full rounded-2xl border-b-4 border-[#1899D6] bg-[#1CB0F6] py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-[#4FC3F9] active:translate-y-[2px] active:border-b-2 cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
