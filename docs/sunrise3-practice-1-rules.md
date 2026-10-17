# Sunrise 3 — Practice 1 Build Rules (revised)

Companion to `sunrise3-practice-designs.md`. These are the **authoring rules** the
author gave for **Practice 1 — Vocabulary Audio-Visual Drill**, after seeing the
first build. They override the earlier "2 trainings / 6-card grid" version.

## Before building any practice — read three files

1. **Progress** — `docs/sunrise3-practice-progress.md`.
2. **The rules** — this file (`sunrise3-practice-1-rules.md`).
3. **The book** — `Sunrise- 3 SB.pdf` (extracted text `data/sunrise3_raw.txt`).

Read all three, then build.

---

## Global chunking rules (apply to every practice)

- **Never show 6 cards at once.** Max **3 items per screen**; **image-card trainings use
  2 per screen** so the picture stays large.
- A set of 6 is split accordingly (2 screens of 3, or 3 screens of 2); a **Continue**
  button advances to the next screen.
- **Matching:** exactly **3 left cards + 3 right cards** per screen.
- **Any card/tile training:** **3 per screen**; the remaining items go on a
  **following screen**.
- One screen must **never** be a whole lesson/exercise. Each training is made of
  **multiple screens**, repeated **until the child actually knows each item**.

## Image sourcing (apply to every practice)

- If a training needs an image, **get the real picture from the book** (the PDF) — crop
  the character/tile, strip the printed item number and the cell border.
- If it is **not possible** to extract the picture from the book, **put an emoji
  placeholder in its place**. Never leave an image slot empty and never block the build
  waiting for a picture.

## Reuse progress from other practices (apply to every practice)

- If a practice already has a **progress** treatment that also fits this practice, **adopt
  it in the lesson without going back to the author** to ask.
- See `sunrise3-practice-progress.md` for the progress surfaces that already exist and
  must be reused.

## Lessons are not one-per-practice

- A practice is **not** required to finish in a single lesson. If it is long it may
  **span more than one lesson** (e.g. the echo-mic part can be its own lesson or the
  final screens).

---

## Practice 1 — Vocabulary Audio-Visual Drill (revised: 4 trainings)

Goal: introduce a unit's new words (image + audio + Kurdish gloss) and get the child
to recognise and say each one. Set = the unit's ~6 words.

### Training 1 — Visual Word Anchors (`word_anchors`), chunked
- Split the ~6 words into **3 screens × 2 cards** (2 per screen keeps the picture big).
- Each card is **vertical**: image on top, then the word + Kurdish gloss underneath.
- Tap each card to hear the word. Must hear both → **Continue** → next screen.
- Must hear both on every screen → training complete.

### Training 2 — Matching (NEW): word ↔ image
- Two columns: **left = 3 word labels** (e.g. *doctor*), **right = 3 images** (shuffled).
- Child taps a word, then its matching image to pair them.
- **3 pairs per screen.** Tapping the image is silent (no spoiler); a **correct match
  announces the word aloud**.

### Training 3 — Multiple-Choice with image (NEW)
- Show an **image** + **multiple-choice options** (*doctor / teacher / …*).
- **More than one question per practice** — repeat across the word set until every
  item is recognised. Do **not** ask a single question and move on.

### Training 4 — Isolated Echo Screen (`echo_mic`)
- Placed at the **end** of the practice, **or in its own separate lesson**.
- One screen per word: hear the model, tap the mic, live waveform + match feedback.

**Revised total: 4 trainings** (was 2).

---

## Resolved decisions

- Matching uses the **new subtype `pair_match`**; the image multiple-choice uses
  `image_mcq` (rendered by `MultipleChoiceView`). Both dispatch from
  `src/app/learn/[lessonId]/page.tsx`.
- Echo-mic stays the **last screens of the same lesson** (a separate lesson would sit
  behind the empty placeholder lessons, since the path unlocks sequentially).
