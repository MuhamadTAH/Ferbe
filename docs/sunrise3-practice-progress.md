# Sunrise 3 — Practice Progress

The third of the three files to read **before building any practice** (the others are
the book itself and `sunrise3-practice-1-rules.md`). It defines what "progress" means
for a practice and which existing app mechanisms every practice must reuse.

---

## Rule 0 — reuse and don't ask

Any progress mechanism that already exists for another lesson or practice is applied to
this practice **automatically, without going back to the author**. Do not invent a new
progress store and do not ask whether to add one.

## Existing progress surfaces (reuse as-is)

| Surface | Where it lives |
| --- | --- |
| In-lesson progress bar | `progressPercent()` in `src/lib/sessionMachine.ts`; rendered in the top bar of `src/app/learn/[lessonId]/page.tsx` |
| Hearts | `HeartsBar` + `STARTING_HEARTS` in `src/lib/sessionMachine.ts` |
| XP, streak, first-try accuracy | accumulated in `src/hooks/useLessonSession.ts`; shown in `LessonComplete` |
| Lesson completion + best score | `userProgress` in `convex/schema.ts`, written by `completeLesson` in `convex/curriculum.ts` |
| Sequential path unlock (unit / chest / lesson) | `src/app/learn/page.tsx`, `src/components/learn/PathLessonNode.tsx`, `JumpLessonNode.tsx`, `TreasureChestNode.tsx` |
| Guest progress + sign-in sync | `src/lib/guestProgress.ts`, `src/providers/ConvexClientProvider.tsx` (`syncGuestProgress`) |

## Per-practice progress

- A practice = **trainings → screens**. Within a practice, progress is simply the
  screens/trainings completed, which already map onto the in-lesson bar (each exercise
  is one card in the session queue). **Drive the existing bar; add no new store.**
- A practice may span more than one lesson; completion is recorded per lesson by the
  existing `userProgress` mechanism.

## Where to look before building a practice

1. **Progress** — this file (and the code files in the table above).
2. **The practice in the book** — the relevant PDF page(s) of `Sunrise- 3 SB.pdf`.
3. **The rules** — `sunrise3-practice-1-rules.md` (chunking, image sourcing, reuse).

Only after reading all three, build the practice.
