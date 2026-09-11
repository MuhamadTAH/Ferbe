"use client";

import Link from "next/link";
import { BookOpen, Dumbbell, Sparkles, User } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useAppConfig } from "@/providers/ConvexClientProvider";

/** App header with auth-aware actions (only when Clerk is configured). */
export function AppHeader() {
  const { hasClerk } = useAppConfig();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#E5E5E5] bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-extrabold text-[#58CC02] transition-opacity hover:opacity-90"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#58CC02] text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="tracking-tight">Fêrbe</span>
          <span
            dir="rtl"
            className="font-kurdish text-base font-bold text-[#58CC02]"
          >
            فێربە
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/learn"
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-extrabold uppercase tracking-wide text-[#777777] hover:bg-[#F7F7F7] hover:text-[#58CC02]"
          >
            <BookOpen className="h-4 w-4" />
            <span>Learn</span>
          </Link>
          <Link
            href="/practice"
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-extrabold uppercase tracking-wide text-[#777777] hover:bg-[#F7F7F7] hover:text-[#1CB0F6]"
          >
            <Dumbbell className="h-4 w-4" />
            <span>Practice</span>
          </Link>

          {hasClerk ? (
            <>
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="flex items-center gap-1.5 rounded-2xl border-b-4 border-[#1899D6] bg-[#1CB0F6] px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-white hover:bg-[#4FC3F9]"
                >
                  <User className="h-4 w-4" />
                  <span>Sign in</span>
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
