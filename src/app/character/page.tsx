"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  SquirrelMascot,
  MascotMood,
  MascotAccessory,
} from "@/components/duo/SquirrelMascot";
import {
  Sun,
  Moon,
  Grid,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Palette,
  Eye,
  MessageCircle,
  HelpCircle,
  RotateCcw,
  Layers,
  ArrowLeft,
} from "lucide-react";

interface ColorToken {
  name: string;
  hex: string;
  role: string;
  component: string;
}

const COLOR_SPECS: ColorToken[] = [
  { name: "Pumpkin Auburn", hex: "#F27A1A", role: "Main Body & Tail Coat", component: "Coat / Body" },
  { name: "Golden Amber", hex: "#FF9B42", role: "Warm Light Highlights & Tuft Edges", component: "Highlight" },
  { name: "Deep Chestnut", hex: "#C4590A", role: "3D Bottom Shading & Depth", component: "3D Shadow" },
  { name: "Warm Vanilla Cream", hex: "#FFF2DC", role: "Chest Bib, Cheeks & Ear Tufts", component: "Belly / Face" },
  { name: "Cream Shadow", hex: "#EED8B5", role: "Under-belly & Chin Crease Shade", component: "Shadow" },
  { name: "Dark Cocoa", hex: "#3E1F08", role: "Large Expressive Eyes & Eyelids", component: "Eyes" },
  { name: "Duolingo Pure White", hex: "#FFFFFF", role: "Specular Eye Catchlights & Reflections", component: "Catchlight" },
  { name: "Dark Chocolate", hex: "#4A2600", role: "Button Nose & Snout Contour", component: "Nose" },
  { name: "Rosy Peach", hex: "#FF8A8A", role: "Blushing Cheeks & Tongue", component: "Blush" },
  { name: "Zagros Oak Cap", hex: "#6B3E11", role: "Acorn Hat / Woodsy Cupule", component: "Acorn Cap" },
  { name: "Zagros Oak Nut", hex: "#A0652C", role: "Natural Kurdish Oak Nut (بەڕوو)", component: "Acorn Nut" },
  { name: "Duolingo Trophy Gold", hex: "#FFC800", role: "Golden Acorn & Star Bursts", component: "Prestige" },
  { name: "Jet Shade Black", hex: "#1A1A1A", role: "Cool Sunglasses Frame", component: "Accessory" },
  { name: "Streak Flame Orange", hex: "#FF9600", role: "Streak Fire Aura & Flame Particles", component: "Streak" },
];

const ANATOMY_SPECS = [
  {
    part: "Head & Silhouette",
    spec: "Bulbous, friendly pear-shaped head with 16-24px organic curve radius. Head tilts dynamically (+6° in thinking, -4° in celebration).",
  },
  {
    part: "Eyes & Catchlights",
    spec: "Oversized round eyes (#3E1F08) with authentic Duolingo dual white catchlights (large upper highlight + subtle secondary lower specular). Transforms into happy crescents (⌒ ⌒), inquisitive tilts, sleepy curves (◡ ◡), or tearful drooping eyes.",
  },
  {
    part: "Ears & Inner Tufts",
    spec: "Tall rounded woodland ears with inner vanilla cream tufts (#FFF2DC). Droop down dynamically in 'sad' mood, perk up in 'cheering' and 'happy'.",
  },
  {
    part: "Muzzle & Nose",
    spec: "Soft rounded chocolate nose (#4A2600) sitting atop a curved friendly mouth line with an open smiling pink tongue option in energetic states.",
  },
  {
    part: "Fluffy S-Curved Tail",
    spec: "Voluminous, sweeping S-curve tail wrapping up past head level with layered woodland feather tufts, 3D bottom shading (#C4590A), and optional animated flame streak aura.",
  },
  {
    part: "Hands & Paws",
    spec: "Soft curved rounded paws. Can clasp Kurdish acorns (بەڕوو), raise both hands in victory, pump high in a fist pump, or touch chin quizzically.",
  },
];

export default function CharacterStudioPage() {
  const [mood, setMood] = useState<MascotMood>("idle");
  const [accessory, setAccessory] = useState<MascotAccessory>("none");
  const [size, setSize] = useState<number>(260);
  const [animate, setAnimate] = useState<boolean>(true);
  const [interactive, setInteractive] = useState<boolean>(true);
  const [stageBg, setStageBg] = useState<"dark" | "elevated" | "light" | "cream" | "grid">("dark");
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showBubble, setShowBubble] = useState<boolean>(false);
  const [bubbleTextEn, setBubbleTextEn] = useState<string>("Great job! Keep practicing!");
  const [bubbleTextKu, setBubbleTextKu] = useState<string>("دەستخۆش! بەردەوام بە لە فێربوون");
  const [bubblePos, setBubblePos] = useState<"top" | "left" | "right">("top");
  const [isDark, setIsDark] = useState<boolean>(true);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [changeNotes, setChangeNotes] = useState<string>("");
  const [copiedNotes, setCopiedNotes] = useState<boolean>(false);

  // Active theme sync
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const copyChangeSummary = () => {
    const summary = `=== FÊRBE SQUIRREL MASCOT (SMORIK) CHANGE REQUEST ===
Current Mood Inspected: ${mood}
Current Accessory: ${accessory}
Character Size Tested: ${size}px
Animation Active: ${animate}

Requested Changes:
${changeNotes.trim() || "(No specific notes typed yet - please specify what to tweak in the chat!)"}
=====================================================`;
    navigator.clipboard.writeText(summary);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  };

  // Background style helper
  const getStageBgClass = () => {
    switch (stageBg) {
      case "dark":
        return "bg-[#131F24] border-[#37464F]";
      case "elevated":
        return "bg-[#202F36] border-[#37464F]";
      case "light":
        return "bg-white border-[#E5E5E5]";
      case "cream":
        return "bg-[#FAF6EE] border-[#EADFC7]";
      case "grid":
        return "bg-[#131F24] border-[#37464F] [background-image:radial-gradient(#37464F_1px,transparent_1px)] [background-size:16px_16px]";
      default:
        return "bg-[#131F24] border-[#37464F]";
    }
  };

  const moodsList: { id: MascotMood; label: string; ku: string; icon: string }[] = [
    { id: "idle", label: "Idle / Neutral", ku: "ئارام", icon: "🌱" },
    { id: "happy", label: "Happy / Beaming", ku: "دڵخۆش", icon: "😄" },
    { id: "celebrating", label: "Celebrating", ku: "ئاهەنگگێڕان", icon: "🎉" },
    { id: "cheering", label: "Cheering / High-Five", ku: "هاندان", icon: "🙌" },
    { id: "thinking", label: "Thinking / Curious", ku: "بیرکردنەوە", icon: "🤔" },
    { id: "sad", label: "Comforting / Sad", ku: "دڵنەوایی", icon: "🥺" },
    { id: "fire", label: "Streak Fire", ku: "ئاگرین", icon: "🔥" },
    { id: "sleeping", label: "Sleeping / Cozy", ku: "نووستوو", icon: "💤" },
  ];

  const accessoriesList: { id: MascotAccessory; label: string; icon: string }[] = [
    { id: "none", label: "None", icon: "🚫" },
    { id: "acorn", label: "Oak Acorn (بەڕوو)", icon: "🌰" },
    { id: "golden_acorn", label: "Golden Acorn", icon: "✨" },
    { id: "sunglasses", label: "Sunglasses", icon: "🕶️" },
    { id: "party_hat", label: "Party Hat", icon: "🥳" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0E161A] text-white flex flex-col font-sans overflow-hidden">
      {/* Top Studio Bar */}
      <header className="h-16 border-b border-[#37464F] bg-[#131F24] px-4 sm:px-8 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/learn"
            className="flex items-center gap-2 rounded-xl border border-[#37464F] bg-[#202F36] px-3 py-1.5 text-xs font-extrabold text-[#8495A0] hover:text-white hover:border-[#58CC02] transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-[#58CC02]" />
            <span>Back to App</span>
          </Link>
          <div className="h-5 w-[1px] bg-[#37464F]" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-[#58CC02]">
                Smorik Studio · پێشانگای سمۆڕە
              </h1>
              <span className="rounded-md bg-[#202F36] border border-[#3BC0F8]/40 px-2 py-0.5 text-[10px] font-black text-[#3BC0F8]">
                2D Character Inspector
              </span>
            </div>
            <p className="text-[11px] font-bold text-[#8495A0]">
              Isolated character stage & full technical specifications
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {/* Light/Dark Toggle */}
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-1.5 rounded-xl border border-[#37464F] bg-[#202F36] px-3 py-1.5 text-xs font-extrabold text-[#8495A0] hover:text-white transition-colors cursor-pointer"
            title="Toggle theme preview"
          >
            {isDark ? <Sun className="h-4 w-4 text-[#FFC800]" /> : <Moon className="h-4 w-4 text-[#3BC0F8]" />}
            <span className="hidden sm:inline">{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>

          {/* Reset View */}
          <button
            type="button"
            onClick={() => {
              setMood("idle");
              setAccessory("none");
              setSize(260);
              setAnimate(true);
              setShowGrid(false);
              setShowBubble(false);
              setStageBg("dark");
            }}
            className="flex items-center gap-1.5 rounded-xl border border-[#37464F] bg-[#202F36] px-3 py-1.5 text-xs font-extrabold text-[#8495A0] hover:text-white transition-colors cursor-pointer"
            title="Reset to default pose"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* Main Studio Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ================= LEFT: ISOLATED CHARACTER STAGE ================= */}
        <section className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto items-center justify-center relative bg-[#0E161A]">
          {/* Floating Stage Controls */}
          <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-3 mb-4 z-20">
            {/* Stage Background Presets */}
            <div className="flex items-center gap-1.5 rounded-2xl border border-[#37464F] bg-[#131F24] p-1 shadow-sm">
              <span className="text-[10px] font-black uppercase text-[#8495A0] px-2">Stage:</span>
              <button
                type="button"
                onClick={() => setStageBg("dark")}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  stageBg === "dark" ? "bg-[#58CC02] text-white" : "text-[#8495A0] hover:text-white"
                }`}
              >
                Duolingo Dark
              </button>
              <button
                type="button"
                onClick={() => setStageBg("elevated")}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  stageBg === "elevated" ? "bg-[#58CC02] text-white" : "text-[#8495A0] hover:text-white"
                }`}
              >
                Elevated (#202F36)
              </button>
              <button
                type="button"
                onClick={() => setStageBg("light")}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  stageBg === "light" ? "bg-[#58CC02] text-white" : "text-[#8495A0] hover:text-white"
                }`}
              >
                Pure White
              </button>
              <button
                type="button"
                onClick={() => setStageBg("grid")}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  stageBg === "grid" ? "bg-[#58CC02] text-white" : "text-[#8495A0] hover:text-white"
                }`}
              >
                Blueprint Grid
              </button>
            </div>

            {/* Quick Inspection Toggles */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                  showGrid
                    ? "border-[#3BC0F8] bg-[#3BC0F8]/20 text-[#3BC0F8]"
                    : "border-[#37464F] bg-[#131F24] text-[#8495A0] hover:text-white"
                }`}
              >
                <Grid className="h-3.5 w-3.5" />
                <span>Alignment Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setAnimate(!animate)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                  animate
                    ? "border-[#58CC02] bg-[#58CC02]/20 text-[#58CC02]"
                    : "border-[#37464F] bg-[#131F24] text-[#8495A0] hover:text-white"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{animate ? "Animated" : "Static Pose"}</span>
              </button>
            </div>
          </div>

          {/* THE CHARACTER DISPLAY CANVAS */}
          <div
            className={`w-full max-w-2xl min-h-[460px] sm:min-h-[520px] rounded-3xl border-2 transition-all duration-200 flex flex-col items-center justify-center p-8 relative shadow-2xl overflow-hidden ${getStageBgClass()}`}
          >
            {/* Optional Alignment Crosshair Overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none z-10">
                {/* Horizontal Centerline */}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#3BC0F8]/40 border-t border-dashed border-[#3BC0F8]/70" />
                {/* Vertical Centerline */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#3BC0F8]/40 border-l border-dashed border-[#3BC0F8]/70" />
                {/* Rule of Thirds Guide */}
                <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-[#3BC0F8]/20" />
                <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-[#3BC0F8]/20" />
                <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-[#3BC0F8]/20" />
                <div className="absolute top-0 bottom-0 left-2/3 w-[1px] bg-[#3BC0F8]/20" />
                <span className="absolute top-3 left-3 text-[10px] font-mono text-[#3BC0F8] bg-[#131F24]/80 px-2 py-0.5 rounded border border-[#3BC0F8]/30">
                  Grid Active: Center & Proportions
                </span>
              </div>
            )}

            {/* Character Render Container */}
            <div className="relative z-20 flex flex-col items-center justify-center my-auto transition-transform duration-150">
              <SquirrelMascot
                mood={mood}
                accessory={accessory}
                size={size}
                animate={animate}
                interactive={interactive}
                speechBubble={
                  showBubble
                    ? {
                        text: bubbleTextEn,
                        textKu: bubbleTextKu,
                        position: bubblePos,
                      }
                    : undefined
                }
              />
            </div>

            {/* Stage Bottom Pedestal / Shadow Ground */}
            <div className="w-48 sm:w-64 h-6 rounded-[100%] bg-black/25 dark:bg-black/40 blur-sm mt-4 pointer-events-none" />

            {/* Current State Pill on Stage */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-bold text-[#8495A0] z-20">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#58CC02] animate-pulse" />
                <span>
                  Mood: <strong className="text-white capitalize">{mood}</strong>
                </span>
                <span>·</span>
                <span>
                  Accessory: <strong className="text-white capitalize">{accessory.replace("_", " ")}</strong>
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#8495A0]">
                Scale: {size}px
              </div>
            </div>
          </div>

          {/* Size Slider Under Canvas */}
          <div className="w-full max-w-2xl mt-4 flex items-center justify-between gap-4 bg-[#131F24] border border-[#37464F] rounded-2xl p-3 px-5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#8495A0]">
              <Sliders className="h-4 w-4 text-[#58CC02]" />
              <span>Scale:</span>
            </div>
            <div className="flex-1 max-w-xs flex items-center gap-3">
              <input
                type="range"
                min="100"
                max="420"
                step="10"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-2 bg-[#202F36] rounded-lg appearance-none cursor-pointer accent-[#58CC02]"
              />
              <span className="text-xs font-mono font-bold text-white w-12 text-right">{size}px</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[120, 200, 260, 360].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    size === s
                      ? "border-[#58CC02] bg-[#58CC02] text-white"
                      : "border-[#37464F] text-[#8495A0] hover:text-white"
                  }`}
                >
                  {s}px
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ================= RIGHT: SPECIFICATIONS & CHANGE REQUEST ================= */}
        <aside className="w-full lg:w-[460px] xl:w-[500px] border-t lg:border-t-0 lg:border-l border-[#37464F] bg-[#131F24] flex flex-col shrink-0 h-auto lg:h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Panel Header */}
          <div className="p-6 border-b border-[#37464F] sticky top-0 bg-[#131F24] z-20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Palette className="h-5 w-5 text-[#FF9600]" />
                  <span>Character Specifications</span>
                </h2>
                <p className="text-xs font-bold text-[#8495A0]">
                  Anatomy, palette tokens, and design tweak helper
                </p>
              </div>
              <span className="text-xs font-black text-[#58CC02] bg-[#58CC02]/10 border border-[#58CC02]/30 px-2.5 py-1 rounded-xl">
                v1.0 Ready
              </span>
            </div>
          </div>

          {/* Panel Sections */}
          <div className="p-6 space-y-8 flex-1">
            {/* 1. MOOD SELECTOR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-[#8495A0] flex items-center gap-2">
                  <Eye className="h-4 w-4 text-[#3BC0F8]" />
                  <span>Test Expressions & Moods (8 states)</span>
                </label>
                <span className="text-[11px] font-bold text-[#58CC02] capitalize">{mood}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {moodsList.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      mood === m.id
                        ? "border-[#58CC02] bg-[#58CC02]/15 text-white font-extrabold shadow-sm"
                        : "border-[#37464F] bg-[#202F36] text-[#8495A0] hover:text-white hover:bg-[#283842]"
                    }`}
                  >
                    <span className="text-lg">{m.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{m.label}</div>
                      <div className="text-[10px] font-kurdish opacity-75">{m.ku}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. ACCESSORIES SELECTOR */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-[#8495A0] flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#FFC800]" />
                <span>Test Accessories & Props</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {accessoriesList.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAccessory(a.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      accessory === a.id
                        ? "border-[#FFC800] bg-[#FFC800]/15 text-white font-extrabold"
                        : "border-[#37464F] bg-[#202F36] text-[#8495A0] hover:text-white"
                    }`}
                  >
                    <span>{a.icon}</span>
                    <span className="text-xs font-bold truncate">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. SPEECH BUBBLE TESTER */}
            <div className="space-y-3 rounded-2xl border border-[#37464F] bg-[#202F36] p-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-[#3BC0F8]" />
                  <span>Speech Bubble Simulator</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowBubble(!showBubble)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black border transition-colors cursor-pointer ${
                    showBubble
                      ? "border-[#3BC0F8] bg-[#3BC0F8] text-[#131F24]"
                      : "border-[#37464F] bg-[#131F24] text-[#8495A0]"
                  }`}
                >
                  {showBubble ? "Bubble ON" : "Bubble OFF"}
                </button>
              </div>

              {showBubble && (
                <div className="space-y-2.5 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#8495A0]">Kurdish Speech (Sorani)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={bubbleTextKu}
                      onChange={(e) => setBubbleTextKu(e.target.value)}
                      className="w-full mt-1 bg-[#131F24] border border-[#37464F] rounded-xl px-3 py-1.5 text-xs text-white font-kurdish focus:border-[#3BC0F8] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#8495A0]">English Translation</label>
                    <input
                      type="text"
                      value={bubbleTextEn}
                      onChange={(e) => setBubbleTextEn(e.target.value)}
                      className="w-full mt-1 bg-[#131F24] border border-[#37464F] rounded-xl px-3 py-1.5 text-xs text-white focus:border-[#3BC0F8] outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-bold text-[#8495A0]">Position:</span>
                    {(["top", "left", "right"] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setBubblePos(pos)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize border transition-colors cursor-pointer ${
                          bubblePos === pos
                            ? "border-[#3BC0F8] bg-[#3BC0F8]/20 text-[#3BC0F8]"
                            : "border-[#37464F] text-[#8495A0]"
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. EXACT COLOR TOKENS & SWATCHES */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-[#8495A0] flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-[#58CC02]" />
                  Exact Palette Hex Codes (Click to Copy)
                </span>
                <span className="text-[10px] lowercase text-[#8495A0]">14 tokens</span>
              </label>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {COLOR_SPECS.map((c) => (
                  <div
                    key={c.hex + c.name}
                    onClick={() => copyHex(c.hex)}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#202F36] hover:bg-[#283842] border border-[#37464F] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-6 w-6 rounded-lg border border-white/20 shadow-xs shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#58CC02] transition-colors">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-[#8495A0]">{c.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono font-bold text-[#3BC0F8]">{c.hex}</code>
                      {copiedHex === c.hex ? (
                        <Check className="h-3.5 w-3.5 text-[#58CC02]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-[#8495A0] group-hover:text-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. ANATOMY & PROPORTION BREAKDOWN */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-[#8495A0] flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#CE82FF]" />
                <span>Anatomical Vector Proportions</span>
              </label>
              <div className="space-y-2">
                {ANATOMY_SPECS.map((a) => (
                  <div key={a.part} className="rounded-xl border border-[#37464F] bg-[#202F36] p-3 text-xs">
                    <div className="font-extrabold text-[#CE82FF] mb-1">{a.part}</div>
                    <p className="text-[11px] leading-relaxed text-[#8495A0]">{a.spec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. "TELL ME WHAT TO CHANGE" FEEDBACK HELPER */}
            <div className="space-y-3 rounded-2xl border-2 border-[#58CC02] bg-[#58CC02]/10 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#58CC02] flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>What would you like to change?</span>
                </h3>
              </div>
              <p className="text-xs text-[#8495A0]">
                Inspect the character on the stage. Type your desired changes or adjustments below (e.g. eye shape, ear size, tail fluffiness, colors, accessories), and click copy to send them to me!
              </p>

              <textarea
                rows={3}
                value={changeNotes}
                onChange={(e) => setChangeNotes(e.target.value)}
                placeholder="Example: Can we make the eyes 10% bigger, add a small Kurdish scarf around his neck, and make the tail curve a bit wider?"
                className="w-full bg-[#131F24] border border-[#37464F] rounded-xl p-3 text-xs text-white placeholder:text-[#8495A0]/60 focus:border-[#58CC02] outline-none resize-none font-sans"
              />

              <button
                type="button"
                onClick={copyChangeSummary}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#58CC02] hover:bg-[#46A302] active:translate-y-[1px] text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-[#58CC02]/20"
              >
                {copiedNotes ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Change Request Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Change Request Summary</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
