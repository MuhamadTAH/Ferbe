"use client";

import { useState } from "react";
import { UserPlus, Search, Share2, Users } from "lucide-react";

export function FriendsSidebarCard() {
  const [activeTab, setActiveTab] = useState<"following" | "followers">(
    "following"
  );
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Fêrbe!",
          text: "I'm learning Kurdish Sorani on Fêrbe. Join me and learn together!",
          url: window.location.origin,
        });
      } catch {
        // user cancelled or fallback
      }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-3xl border-2 border-[#E5E5E5] bg-white p-5 shadow-xs dark:border-[#37464F] dark:bg-[#131F24]">
      {/* Tabs */}
      <div className="flex border-b-2 border-[#E5E5E5] dark:border-[#37464F]">
        <button
          type="button"
          onClick={() => setActiveTab("following")}
          className={`flex-1 pb-3 text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === "following"
              ? "border-b-2 border-[#1CB0F6] -mb-[2px] text-[#1CB0F6]"
              : "text-[#AFAFAF] hover:text-[#4B4B4B] dark:text-[#8495A0] dark:hover:text-white"
          }`}
        >
          Following
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("followers")}
          className={`flex-1 pb-3 text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
            activeTab === "followers"
              ? "border-b-2 border-[#1CB0F6] -mb-[2px] text-[#1CB0F6]"
              : "text-[#AFAFAF] hover:text-[#4B4B4B] dark:text-[#8495A0] dark:hover:text-white"
          }`}
        >
          Followers
        </button>
      </div>

      {/* Content */}
      <div className="pt-5 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDF4FF] text-[#1CB0F6] mb-3 dark:bg-[#202F36] dark:text-[#3BC0F8]">
          <Users className="h-7 w-7" />
        </div>
        <p className="text-xs font-bold leading-relaxed text-[#777777] dark:text-[#8495A0]">
          Learning is more fun and effective when you connect with others.
        </p>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#1CB0F6] transition-all hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 shadow-xs cursor-pointer dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#3BC0F8] dark:hover:bg-[#202F36]"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add friends</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const input = window.prompt("Search friends by username or email:");
              if (input) alert(`Found 0 results for "${input}".`);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#777777] transition-all hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 shadow-xs cursor-pointer dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#8495A0] dark:hover:bg-[#202F36]"
          >
            <Search className="h-4 w-4" />
            <span>Find friends</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#777777] transition-all hover:bg-[#F7F7F7] active:translate-y-[2px] active:border-b-2 shadow-xs cursor-pointer dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#8495A0] dark:hover:bg-[#202F36]"
          >
            <Share2 className="h-4 w-4" />
            <span>{copied ? "Link Copied!" : "Invite friends"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
