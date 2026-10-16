# Sunrise 3 — Practice 1 Build Rules (revised)

Companion to `sunrise3-practice-designs.md`. These are the **authoring rules** the
author gave for **Practice 1 — Vocabulary Audio-Visual Drill**, after seeing the
first build. They override the earlier "2 trainings / 6-card grid" version.

---

## Global chunking rules (apply to every practice)

- **Never show 6 cards at once.** Max **3 items per screen**.
- A set of 6 is split into **2 screens of 3**; a **Continue** button advances to the
  next screen.
- **Matching:** exactly **3 left cards + 3 right cards** per screen.
- **Any card/tile training:** **3 per screen**; the remaining items go on a
  **following screen**.
- One screen must **never** be a whole lesson/exercise. Each training is made of
  **multiple screens**, repeated **until the child actually knows each item**.

## Lessons are not one-per-practice

- A practice is **not** required to finish in a single lesson. If it is long it may
  **span more than one lesson** (e.g. the echo-mic part can be its own lesson or the
  final screens).

---

## Practice 1 — Vocabulary Audio-Visual Drill (revised: 4 trainings)

Goal: introduce a unit's new words (image + audio + Kurdish gloss) and get the child
to recognise and say each one. Set = the unit's ~6 words.

### Training 1 — Visual Word Anchors (`word_anchors`), chunked
- Split the ~6 words into **2 screens × 3 cards**.
- Screen 1: 3 tappable cards; tap each to hear the word + see image/gloss.
- Must hear all 3 → **Continue** → Screen 2 with the other 3 cards.
- Must hear all 3 → training complete.

### Training 2 — Matching (NEW): word ↔ image
- Two columns: **left = 3 word labels** (e.g. *doctor*), **right = 3 images** (shuffled).
- Child taps a word, then its matching image to pair them.
- **3 pairs per screen.**

### Training 3 — Multiple-Choice with image (NEW)
- Show an **image** + **multiple-choice options** (*doctor / teacher / …*).
- **More than one question per practice** — repeat across the word set until every
  item is recognised. Do **not** ask a single question and move on.

### Training 4 — Isolated Echo Screen (`echo_mic`)
- Placed at the **end** of the practice, **or in its own separate lesson**.
- One screen per word: hear the model, tap the mic, live waveform + match feedback.

**Revised total: 4 trainings** (was 2).

---

## Open points to confirm

- Whether the new **Matching** and **Multiple-Choice** trainings need new subtype
  codes (e.g. `pair_match`, `image_mcq`) or reuse existing views
  (`response_pairing` / `multiple_choice`).
- Whether echo-mic becomes its **own lesson** by default or stays the last screens of
  the same lesson.
