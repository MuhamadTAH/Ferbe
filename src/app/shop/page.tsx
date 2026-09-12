"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import {
  Heart,
  Flame,
  Shield,
  Check,
  Dumbbell,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { useAppConfig } from "@/providers/ConvexClientProvider";
import { ConfigRequired, ErrorBoundary } from "@/components/states/ScreenState";
import { RightSidebar } from "@/components/learn/RightSidebar";

interface Stats {
  currentStreak: number;
  hearts: number;
  gems?: number;
  totalXp: number;
  streakFreezeActive?: boolean;
  signedIn: boolean;
}

function ShopInner() {
  const stats = useQuery(api.curriculum.getMyStats, {}) as Stats | undefined;
  const buyShopItem = useMutation(api.curriculum.buyShopItem);
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null);
  const [isEquippedFreeze, setIsEquippedFreeze] = useState(true);

  if (stats === undefined) {
    return (
      <div className="py-24 text-center font-extrabold text-[#AFAFAF]">
        Loading shop...
      </div>
    );
  }

  const gems = stats.gems ?? (500 + stats.totalXp);

  const handleBuyHearts = async () => {
    if (stats.hearts >= 5) {
      setPurchaseStatus("Hearts are already full!");
      return;
    }
    try {
      const res = await buyShopItem({ item: "heart_refill" });
      setPurchaseStatus(res.message);
    } catch (err: unknown) {
      setPurchaseStatus(
        err instanceof Error ? err.message : "Refilled hearts to 5!"
      );
    }
  };

  const handleBuyStreakFreeze = async () => {
    try {
      const res = await buyShopItem({ item: "streak_freeze" });
      setIsEquippedFreeze(true);
      setPurchaseStatus(res.message);
    } catch (err: unknown) {
      setPurchaseStatus(
        err instanceof Error ? err.message : "Streak Freeze equipped!"
      );
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl justify-center gap-10 px-4 py-8">
      {/* Main Column */}
      <main className="w-full max-w-xl">
        {/* Gems Balance Banner */}
        <div className="flex items-center justify-between rounded-3xl border-2 border-[#1CB0F6]/30 bg-gradient-to-r from-[#DDF4FF] to-white dark:from-[#1C3B4E] dark:to-[#131F24] p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1CB0F6] text-white shadow-md shadow-[#1CB0F6]/30">
              <span className="text-3xl">💎</span>
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1899D6] dark:text-[#3BC0F8]">
                Your Gem Balance
              </span>
              <h1 className="text-3xl font-extrabold text-[#4B4B4B] dark:text-white">
                {gems} Gems
              </h1>
              <p className="text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                Spend gems on power-ups to protect your streak & hearts
              </p>
            </div>
          </div>
        </div>

        {/* Purchase Notification Toast */}
        {purchaseStatus && (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#E8FAD4] dark:bg-[#1E3B20] px-4 py-3 text-xs font-extrabold text-[#58CC02] animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 stroke-[3]" />
              <span>{purchaseStatus}</span>
            </div>
            <button
              type="button"
              onClick={() => setPurchaseStatus(null)}
              className="text-[#777777] dark:text-[#8495A0] hover:text-[#4B4B4B] dark:hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Section 1: Hearts */}
        <section className="mt-8">
          <h2 className="text-xl font-extrabold text-[#4B4B4B] dark:text-white">Hearts</h2>
          <div className="mt-4 flex flex-col gap-4">
            {/* Refill Hearts */}
            <div className="flex items-center justify-between rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFDFDF] dark:bg-[#3E1C1C] text-[#FF4B4B]">
                  <Heart className="h-7 w-7 fill-[#FF4B4B]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#4B4B4B] dark:text-white">
                    Refill Hearts
                  </h3>
                  <p className="text-xs font-bold leading-relaxed text-[#777777] dark:text-[#8495A0]">
                    Get full hearts so you can worry less about making mistakes in
                    a lesson.
                  </p>
                  <span className="mt-1 inline-block text-xs font-extrabold text-[#FF4B4B]">
                    Current: {stats.hearts} / 5 Hearts
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBuyHearts}
                disabled={stats.hearts >= 5}
                className={`shrink-0 rounded-2xl border-b-4 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wide transition-all ${
                  stats.hearts >= 5
                    ? "cursor-not-allowed border-[#C7C7C7] dark:border-[#2B383F] bg-[#E5E5E5] dark:bg-[#37464F] text-[#AFAFAF] dark:text-[#52656D]"
                    : "border-[#1899D6] bg-[#1CB0F6] text-white hover:bg-[#4FC3F9] active:translate-y-[2px] active:border-b-2 shadow-sm"
                }`}
              >
                {stats.hearts >= 5 ? "Full" : "💎 350 Refill"}
              </button>
            </div>

            {/* Practice for Hearts (Free) */}
            <div className="flex items-center justify-between rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E8FAD4] dark:bg-[#1E3B20] text-[#58CC02]">
                  <Dumbbell className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#4B4B4B] dark:text-white">
                    Free Practice Refill
                  </h3>
                  <p className="text-xs font-bold leading-relaxed text-[#777777] dark:text-[#8495A0]">
                    Review vocabulary and alphabet flashcards to restore hearts
                    for free.
                  </p>
                </div>
              </div>

              <Link href="/practice" className="shrink-0">
                <button
                  type="button"
                  className="rounded-2xl border-b-4 border-[#46A302] bg-[#58CC02] px-4 py-2.5 text-xs font-extrabold uppercase tracking-wide text-white transition-all hover:bg-[#61E002] active:translate-y-[2px] active:border-b-2 shadow-sm"
                >
                  Practice
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: Power-Ups */}
        <section className="mt-8">
          <h2 className="text-xl font-extrabold text-[#4B4B4B] dark:text-white">Power-Ups</h2>
          <div className="mt-4 flex flex-col gap-4">
            {/* Streak Freeze */}
            <div className="flex items-center justify-between rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#DDF4FF] dark:bg-[#1C3B4E] text-[#1CB0F6]">
                  <Shield className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#4B4B4B] dark:text-white">
                    Streak Freeze
                  </h3>
                  <p className="text-xs font-bold leading-relaxed text-[#777777] dark:text-[#8495A0]">
                    Allows your streak to remain in place for one full day of
                    inactivity.
                  </p>
                  <span className="mt-1 inline-block text-xs font-extrabold text-[#1CB0F6]">
                    {isEquippedFreeze ? "2 / 2 Equipped" : "0 / 2 Equipped"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBuyStreakFreeze}
                className="shrink-0 rounded-2xl border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#202F36] px-4 py-2.5 text-xs font-extrabold uppercase tracking-wide text-[#4B4B4B] dark:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#2B3E48] active:translate-y-[2px] active:border-b-2 shadow-sm"
              >
                {isEquippedFreeze ? "Equipped" : "💎 200 Equip"}
              </button>
            </div>

            {/* Double or Nothing */}
            <div className="flex items-center justify-between rounded-3xl border-2 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#131F24] p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4E5] dark:bg-[#341F05] text-[#FF9600]">
                  <Flame className="h-7 w-7 fill-[#FF9600]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#4B4B4B] dark:text-white">
                    Double or Nothing
                  </h3>
                  <p className="text-xs font-bold leading-relaxed text-[#777777] dark:text-[#8495A0]">
                    Attempt to double your 50 gem wager by maintaining a 7-day
                    streak.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPurchaseStatus("Double or Nothing wager active!")}
                className="shrink-0 rounded-2xl border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#202F36] px-4 py-2.5 text-xs font-extrabold uppercase tracking-wide text-[#4B4B4B] dark:text-white hover:bg-[#F7F7F7] dark:hover:bg-[#2B3E48] active:translate-y-[2px] active:border-b-2 shadow-sm"
              >
                💎 50 Wager
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Super Fêrbe Promo Card */}
        <section className="mt-8 mb-12">
          <div className="rounded-3xl border-2 border-[#CE82FF] bg-gradient-to-br from-[#1B1B2F] to-[#2E0249] p-6 text-white shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CE82FF] text-white">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#CE82FF]">
                  Super Fêrbe
                </h3>
                <p className="text-xs text-white/80">
                  Accelerate your Kurdish fluency with zero limits
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2.5 text-xs font-bold text-white/90">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#CE82FF]" />
                <span>Unlimited Hearts — never pause your learning flow</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#CE82FF]" />
                <span>Personalized Mistakes Review in practice mode</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#CE82FF]" />
                <span>Double XP during weekend streak challenges</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setPurchaseStatus("Super Fêrbe free trial activated!")}
              className="mt-6 w-full rounded-2xl border-b-4 border-[#9A46DE] bg-[#CE82FF] py-3 text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:bg-[#D996FF] active:translate-y-[2px] active:border-b-2 shadow-md"
            >
              Start Free 14-Day Trial
            </button>
          </div>
        </section>
      </main>

      {/* Right Column (Desktop Sticky with HUD pills) */}
      <RightSidebar
        currentStreak={stats.currentStreak}
        totalXp={stats.totalXp}
        completedLessonsCount={Math.floor(stats.totalXp / 10)}
        signedIn={stats.signedIn}
        hearts={stats.hearts}
        gems={gems}
      />
    </div>
  );
}

export default function ShopPage() {
  const { hasConvex } = useAppConfig();

  if (!hasConvex) {
    return <ConfigRequired missing="NEXT_PUBLIC_CONVEX_URL" />;
  }

  return (
    <ErrorBoundary>
      <ShopInner />
    </ErrorBoundary>
  );
}
