import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  SquirrelMascot,
  MascotMood,
  MascotAccessory,
  MascotSize,
} from "./SquirrelMascot";
import { SquirrelAvatar } from "./SquirrelAvatar";
import {
  SquirrelMotivationCard,
  SMORIK_TIPS,
} from "./SquirrelMotivationCard";

describe("SquirrelMascot (Smorik)", () => {
  it("renders default idle mascot with valid SVG elements and title", () => {
    const html = renderToStaticMarkup(<SquirrelMascot />);
    expect(html).toContain("<svg");
    expect(html).toContain('viewBox="0 0 200 200"');
    expect(html).toContain("Smorik the Kurdish Squirrel");
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Smorik the Kurdish Squirrel (idle)"');
  });

  const allMoods: MascotMood[] = [
    "idle",
    "happy",
    "celebrating",
    "cheering",
    "thinking",
    "sad",
    "fire",
    "sleeping",
  ];

  allMoods.forEach((mood) => {
    it(`renders correctly for mood: "${mood}"`, () => {
      const html = renderToStaticMarkup(<SquirrelMascot mood={mood} />);
      expect(html).toContain("<svg");
      expect(html).toContain(`aria-label="Smorik the Kurdish Squirrel (${mood})"`);

      if (mood === "sleeping") {
        // Should contain sleeping 'Z' letters
        expect(html).toContain(">Z<");
        expect(html).toContain(">z<");
      } else if (mood === "celebrating") {
        // Should contain celebratory stars and acorn
        expect(html).toContain('id="celebration-sparkles"');
        expect(html).toContain('id="acorn"');
      } else if (mood === "fire") {
        // Should contain flame gradient and sunglasses
        expect(html).toContain("flameGrad");
        expect(html).toContain('id="sunglasses"');
      } else if (mood === "happy") {
        // Should contain open mouth and happy eyes
        expect(html).toContain('id="happy-eyes"');
        expect(html).toContain('id="open-mouth"');
      } else if (mood === "sad") {
        // Should contain empathetic brows / tear drop
        expect(html).toContain('id="sad-arms"');
      } else if (mood === "cheering") {
        expect(html).toContain('id="cheering-arms"');
      } else if (mood === "thinking") {
        expect(html).toContain('id="thinking-arms"');
      }
    });
  });

  const allAccessories: MascotAccessory[] = [
    "none",
    "acorn",
    "golden_acorn",
    "sunglasses",
    "party_hat",
  ];

  allAccessories.forEach((acc) => {
    it(`renders accessory: "${acc}"`, () => {
      const html = renderToStaticMarkup(<SquirrelMascot accessory={acc} />);
      if (acc === "acorn") {
        expect(html).toContain('id="acorn"');
      } else if (acc === "golden_acorn") {
        expect(html).toContain('id="acorn"');
        expect(html).toContain("goldGrad");
      } else if (acc === "sunglasses") {
        expect(html).toContain('id="sunglasses"');
      } else if (acc === "party_hat") {
        expect(html).toContain('id="party-hat"');
      }
    });
  });

  const sizeTests: { size: MascotSize; expectedPx: number }[] = [
    { size: "xs", expectedPx: 28 },
    { size: "sm", expectedPx: 40 },
    { size: "md", expectedPx: 72 },
    { size: "lg", expectedPx: 128 },
    { size: "xl", expectedPx: 192 },
    { size: 160, expectedPx: 160 },
  ];

  sizeTests.forEach(({ size, expectedPx }) => {
    it(`renders correct dimensions for size: ${size}`, () => {
      const html = renderToStaticMarkup(<SquirrelMascot size={size} />);
      expect(html).toContain(`width="${expectedPx}"`);
      expect(html).toContain(`height="${expectedPx}"`);
    });
  });

  it("handles animated state with CSS keyframe styles", () => {
    const animatedHtml = renderToStaticMarkup(<SquirrelMascot animate />);
    expect(animatedHtml).toContain("@keyframes tailSway");
    expect(animatedHtml).toContain("@keyframes blink");
  });

  it("renders interactive styles when interactive is true", () => {
    const interactiveHtml = renderToStaticMarkup(
      <SquirrelMascot interactive />
    );
    expect(interactiveHtml).toContain("cursor-pointer");
    expect(interactiveHtml).toContain("hover:scale-105");
  });

  it("renders speech bubble with Kurdish Sorani and English text", () => {
    const bubbleTextKu = "سڵاو! من سمۆڕەم";
    const bubbleTextEn = "Hello! I am Smorik";
    const html = renderToStaticMarkup(
      <SquirrelMascot
        speechBubble={{
          text: bubbleTextEn,
          textKu: bubbleTextKu,
          position: "top",
        }}
      />
    );

    expect(html).toContain(bubbleTextKu);
    expect(html).toContain(bubbleTextEn);
    expect(html).toContain('role="tooltip"');
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('lang="ku"');
  });

  it("renders speech bubble in right and left positions", () => {
    const rightHtml = renderToStaticMarkup(
      <SquirrelMascot
        speechBubble={{
          text: "Right bubble",
          position: "right",
        }}
      />
    );
    expect(rightHtml).toContain("Right bubble");
    expect(rightHtml).toContain("flex-row");

    const leftHtml = renderToStaticMarkup(
      <SquirrelMascot
        speechBubble={{
          text: "Left bubble",
          position: "left",
        }}
      />
    );
    expect(leftHtml).toContain("Left bubble");
    expect(leftHtml).toContain("flex-row-reverse");
  });
});

describe("SquirrelAvatar", () => {
  it("renders compact mascot avatar with default green rounded pill", () => {
    const html = renderToStaticMarkup(<SquirrelAvatar size={40} />);
    expect(html).toContain('style="width:40px;height:40px"');
    expect(html).toContain("bg-[#58CC02]");
    expect(html).toContain("<svg");
  });

  it("renders with circle shape and border", () => {
    const html = renderToStaticMarkup(
      <SquirrelAvatar size="lg" shape="circle" border />
    );
    expect(html).toContain("rounded-full");
    expect(html).toContain("border-2");
  });

  it("supports badge overlays", () => {
    const html = renderToStaticMarkup(
      <SquirrelAvatar
        size={48}
        badge={<span className="test-badge">🌰</span>}
      />
    );
    expect(html).toContain("test-badge");
    expect(html).toContain("🌰");
  });
});

describe("SquirrelMotivationCard", () => {
  it("renders initial Kurdish Sorani tip and English translation", () => {
    const html = renderToStaticMarkup(
      <SquirrelMotivationCard initialTipIndex={0} />
    );
    expect(html).toContain(SMORIK_TIPS[0].ku);
    expect(html).toContain(SMORIK_TIPS[0].en);
    expect(html).toContain("Smorik&#x27;s Daily Tip");
    expect(html).toContain("ئامۆژگاری سمۆڕە");
  });

  it("renders second tip when initialTipIndex is 1", () => {
    const html = renderToStaticMarkup(
      <SquirrelMotivationCard initialTipIndex={1} />
    );
    expect(html).toContain(SMORIK_TIPS[1].ku);
    expect(html).toContain(SMORIK_TIPS[1].en);
    expect(html).toContain(SMORIK_TIPS[1].tagEn);
  });

  it("renders compact mode properly", () => {
    const html = renderToStaticMarkup(<SquirrelMotivationCard compact />);
    expect(html).toContain("<svg");
  });
});
