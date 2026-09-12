import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PathLessonNode } from "./PathLessonNode";
import { JumpLessonNode } from "./JumpLessonNode";
import { TreasureChestNode } from "./TreasureChestNode";

describe("Duolingo Path Nodes & Checkpoints", () => {
  const dummyLesson = {
    _id: "test-lesson-1",
    title: "سڵاو و دەستپێک (Hellos)",
    order: 1,
    xpReward: 10,
    isCompleted: false,
  };

  it("renders active Star lesson node with Start badge", () => {
    const html = renderToStaticMarkup(
      <PathLessonNode
        lesson={dummyLesson}
        nodeType="star"
        unlocked={true}
        isDone={false}
        isCurrent={true}
        isPopoverOpen={false}
        offset={0}
        onNodeClick={() => {}}
        onClosePopover={() => {}}
      />
    );

    expect(html).toContain("Start");
    expect(html).toContain("سڵاو و دەستپێک (Hellos)");
    expect(html).toContain('aria-label="سڵاو و دەستپێک (Hellos) (star)"');
  });

  it("renders locked Headphones lesson node without lock padlock", () => {
    const html = renderToStaticMarkup(
      <PathLessonNode
        lesson={{ ...dummyLesson, order: 3, title: "Listening Practice" }}
        nodeType="audio"
        unlocked={false}
        isDone={false}
        isCurrent={false}
        isPopoverOpen={false}
        offset={-30}
        onNodeClick={() => {}}
        onClosePopover={() => {}}
      />
    );

    expect(html).toContain("Listening Practice");
    expect(html).toContain("<svg");
  });

  it("renders locked Trophy node for final unit challenge", () => {
    const html = renderToStaticMarkup(
      <PathLessonNode
        lesson={{ ...dummyLesson, order: 4, title: "Unit Review" }}
        nodeType="trophy"
        unlocked={false}
        isDone={false}
        isCurrent={false}
        isPopoverOpen={false}
        offset={0}
        onNodeClick={() => {}}
        onClosePopover={() => {}}
      />
    );

    expect(html).toContain("Unit Review");
    expect(html).toContain("<svg");
  });

  it("renders JumpLessonNode with JUMP HERE badge and button", () => {
    const html = renderToStaticMarkup(
      <JumpLessonNode
        currentUnitOrder={1}
        nextUnitOrder={2}
        nextUnitTitle="Daily Life & Family"
      />
    );

    expect(html).toContain("Jump here?");
    expect(html).toContain("بازبدە ئێرە؟");
    expect(html).toContain("Jump to Unit 2");
    expect(html).toContain("<svg");
  });

  it("renders TreasureChestNode in slate locked state or wood claimable state", () => {
    const htmlLocked = renderToStaticMarkup(
      <TreasureChestNode unitOrder={1} isUnlocked={false} showMascot={false} />
    );
    expect(htmlLocked).toContain("Milestone Chest");
    expect(htmlLocked).toContain('aria-label="Unit 1 Milestone Chest"');

    const htmlClaimable = renderToStaticMarkup(
      <TreasureChestNode unitOrder={1} isUnlocked={true} showMascot={true} />
    );
    expect(htmlClaimable).toContain("Open Chest!");
    expect(htmlClaimable).toContain("سندوق بکەرەوە");
  });
});


