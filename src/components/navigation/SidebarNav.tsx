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
} from "lucide-react";
import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/nextjs";
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
  const moreRef = useRef<HTMLDivElement>(null);

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

            {/* 7th Item: MORE with Flyout Popover */}
            <div ref={moreRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 px-4 py-3 text-sm font-extrabold uppercase tracking-wider transition-all active:translate-y-[1px] cursor-pointer ${
                  moreOpen
                    ? "border-current bg-[#F0F0F0] text-[#4B4B4B] shadow-sm"
                    : "border-transparent text-[#777777] hover:bg-[#F7F7F7] hover:text-[#4B4B4B]"
                }`}
              >
                <MoreHorizontal className="h-6 w-6 text-[#AFAFAF]" />
                <span>More</span>
              </button>

              {/* Duolingo-style Flyout Menu */}
              {moreOpen && (
                <div className="absolute left-full bottom-0 ml-3 w-64 rounded-3xl border-2 border-[#E5E5E5] bg-white p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/courses"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-3 rounded-2xl p-2.5 text-xs font-extrabold text-[#4B4B4B] hover:bg-[#F7F7F7] transition-colors"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#DDF4FF] text-[#1CB0F6]">
                        <Globe className="h-4 w-4" />
                      </div>
                      <div>
                        <div>Courses & Dialects</div>
                        <div className="text-[10px] font-bold text-[#AFAFAF]">
                          Sorani, Kurmanji, Hawrami
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/sections"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-3 rounded-2xl p-2.5 text-xs font-extrabold text-[#4B4B4B] hover:bg-[#F7F7F7] transition-colors"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#E8FAD4] text-[#58CC02]">
                        <Compass className="h-4 w-4" />
                      </div>
                      <div>
                        <div>Curriculum Sections</div>
                        <div className="text-[10px] font-bold text-[#AFAFAF]">
                          All 5 CEFR Stages
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/practice"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-3 rounded-2xl p-2.5 text-xs font-extrabold text-[#4B4B4B] hover:bg-[#F7F7F7] transition-colors"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FAF5FF] text-[#CE82FF]">
                        <Headphones className="h-4 w-4" />
                      </div>
                      <div>
                        <div>Alphabet & Sounds</div>
                        <div className="text-[10px] font-bold text-[#AFAFAF]">
                          Letters & Audio Pronunciation
                        </div>
                      </div>
                    </Link>

                    <hr className="my-1.5 border-[#E5E5E5]" />

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

      {/* Help & FAQ Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-[#E5E5E5] bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DDF4FF] text-[#1CB0F6]">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#4B4B4B]">
                    Fêrbe Help Center
                  </h3>
                  <p className="text-xs font-bold text-[#AFAFAF]">
                    Frequently Asked Questions
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-[#AFAFAF] hover:bg-[#F7F7F7] hover:text-[#4B4B4B] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3.5 text-xs font-bold text-[#777777]">
              <div className="rounded-2xl bg-[#F7F7F7] p-3.5">
                <h4 className="font-extrabold text-[#4B4B4B]">
                  What dialect is taught?
                </h4>
                <p className="mt-1">
                  Fêrbe teaches Central Kurdish (Sorani / سۆرانی) using standard Kurdish Arabic script, spoken primarily in Sulaymaniyah, Erbil, and surrounding regions.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7F7F7] p-3.5">
                <h4 className="font-extrabold text-[#4B4B4B]">
                  How do Hearts and Gems work?
                </h4>
                <p className="mt-1">
                  You have 5 hearts for lessons. When you run out, you can restore them for free via Practice mode or refill them instantly with 350 gems in the Shop.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7F7F7] p-3.5">
                <h4 className="font-extrabold text-[#4B4B4B]">
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
