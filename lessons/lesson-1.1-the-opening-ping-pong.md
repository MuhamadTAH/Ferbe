# Lesson 1.1: The Opening Ping-Pong

**Course:** Mohammed Mahdi English Course (`mohammed-mahdi-english`)  
**Level:** Level 1 — Conversational Fundamentals (ئاستی ١: بنەماکانی گفتوگۆ)  
**Lesson:** 1.1 The Opening Ping-Pong (سڵاوکردن و هەواڵپرسین)  
**Target:** `Hello` / `Hi` / `Hey`, `How are you?`, `I'm fine / good / great / cool, thank you`, `What about you?`  
**Duration:** ~3 minutes (10 screens)  
**Frontend Component Mapping:** `src/app/learn/[lessonId]/page.tsx`  

---

## Screen 1: Word Anchors (Greetings)
- **Type:** Input / Lexicon Intro (`subtype: "word_anchors"`)
- **Component:** `WordAnchorsView.tsx`
- **UI Elements:**
  - 3 stacked word cards: `Hello`, `Hi`, `Hey`
  - Transliteration & Meaning badges (aligned vertically via `KurdishGlossBadges`):
    - `Hello` → `هێڵۆو` / (`سڵاو`) — فەرمی و باو
    - `Hi` → `های` / (`سڵاو`) — دۆستانە
    - `Hey` → `هێی` / (`سڵاو - نافەرمی`) — نافەرمی
- **Audio & Logic:**
  - Tapping any card plays clear native pronunciation (`playAmericanSpeech`).
  - User must tap all 3 cards to enable the Continue button.

---

## Screen 2: Acoustic Match (Sound to Spelling)
- **Type:** Ear Verification / Matching (`subtype: "acoustic_match"`)
- **Component:** `AcousticMatchView.tsx`
- **UI Elements:**
  - **Left Column:** 3 playable audio buttons labeled `[ ▶ Sound 1 ]`, `[ ▶ Sound 2 ]`, `[ ▶ Sound 3 ]` (randomized order: `Hi`, `Hey`, `Hello`).
  - **Right Column:** 3 English text tiles: `[ Hey ]`, `[ Hello ]`, `[ Hi ]`. Zero Kurdish text.
- **Audio & Logic:**
  - User plays an audio clip, then taps the matching English word tile.
  - Correct pair highlights green and locks; mismatch triggers a vibration and resets the selection.

---

## Screen 3: The "How are you?" Deconstruction
- **Type:** Analytic Breakdown / Multi-Row List (`subtype: "analytic_breakdown"`)
- **Component:** `AnalyticBreakdownView.tsx`
- **UI Elements:**
  - 4 interactive horizontal rows:
    - **Row 1:** `How` | `[ ▶ ]` | `هەو` | (`چۆن`)
    - **Row 2:** `are` | `[ ▶ ]` | `ئاڕ` | (`هەیت`)
    - **Row 3:** `you` | `[ ▶ ]` | `یو` | (`تۆ`)
    - **Row 4 (Accent Border):** `How are you?` | `[ ▶ ]` | `هەواریو؟` | (`چۆنیت؟`)
- **Audio & Logic:**
  - Tapping rows 1–3 plays individual word audio.
  - Tapping Row 4 plays connected native speech (`"How are you?"`).
  - User must play Row 4 to unlock the next screen.

---

## Screen 4: The Echo Mic (Spoken Practice)
- **Type:** Oral Production / Rehearsal (`subtype: "echo_mic"`)
- **Component:** `EchoMicView.tsx`
- **UI Elements:**
  - Large prompt: `How are you?`
  - Sub-text guide: `هەواریو؟`
  - Center: Large pulsating microphone button.
  - Record Again button (`RotateCcw`) allowing re-recording before submitting.
- **Audio & Logic:**
  - Screen auto-plays native audio model once (`en-US` American voice).
  - User taps the mic and speaks `"How are you?"`.
  - System performs acoustic validation (untimed, 2 retry attempts allowed on fail).

---

## Screen 5: Status Adjectives Bank
- **Type:** Input / Lexicon Expansion (`subtype: "status_bank"`)
- **Component:** `StatusBankView.tsx`
- **UI Elements:**
  - Header frame: `I'm [ ___ ], thank you.`
  - 4 selectable status cards below:
    - `fine` (`فاین` / `باش`)
    - `good` (`گود` / `باش`)
    - `great` (`گرەیت` / `زۆر باش`)
    - `cool` (`کووڵ` / `نایاب`)
- **Audio & Logic:**
  - Tapping a card inserts the word into the frame and plays the full sentence audio (e.g., `"I'm cool, thank you."`).
  - Learner must tap all 4 cards to enable Continue.

---

## Screen 6: Slot-and-Filler Check
- **Type:** Syntax & Role Discrimination (`subtype: "slot_filler"`)
- **Component:** `SlotFillerView.tsx`
- **UI Elements:**
  - Target sentence frame: `I'm [  ?  ], thank you.`
  - 4 multiple-choice options: `[ great ]`, `[ hello ]`, `[ how ]`, `[ are ]`
- **Audio & Logic:**
  - User taps `great` to complete the sentence.
  - Incorrect tiles shake red; correct tile snaps into place and auto-plays full audio: `"I'm great, thank you."`.

---

## Screen 7: Conversational Response Pairing
- **Type:** Social Logic Match (`subtype: "response_pairing"`)
- **Component:** `ResponsePairingView.tsx`
- **UI Elements:**
  - 2 prompt cards on the left, 2 response cards on the right:
    - **Left:** `[ Hi Sara ]`, `[ How are you? ]`
    - **Right:** `[ I'm good, thank you ]`, `[ Hello Ahmad ]`
- **Audio & Logic:**
  - User connects each prompt to its natural response.
  - Connecting `Hi Sara` to `I'm good, thank you` fails.
  - Forces distinction between greeting someone and reporting condition.

---

## Screen 8: The Bounce-Back Anchor ("What about you?")
- **Type:** Core Idiom / Pragmatic Isolation (`subtype: "bounce_back_anchor"`)
- **Component:** `BounceBackAnchorView.tsx`
- **UI Elements:**
  - Large card: `What about you?`
  - Pronunciation helper: `وەرەباوتیو؟`
  - Meaning: (`ئەی تۆ؟ / تۆ چۆنیت؟`)
  - Functional role choice:
    - `[ Ask the question back (پرسیارەکە بە هەمان شێوە بپرسەوە) ]` *(Correct)*
    - `[ Say goodbye (ماڵئاوایی کردن) ]` *(Distractor)*
- **Audio & Logic:**
  - Audio plays native reduction (`/wʌt əbaʊt juː/`).
  - User taps the correct communicative function to advance.

---

## Screen 9: Interactive Chat Dialogue
- **Type:** Simulation / Contextual Assembly (`subtype: "chat_dialogue"`)
- **Component:** `ChatDialogueView.tsx`
- **UI Elements:**
  - Chat messenger UI:
    - **Bubble 1 (Incoming):** `"Hey Ahmad, how are you?"` (Audio auto-plays).
    - **Bubble 2 (Draft area):** Blank with 3 response choices below:
      - **A:** `I'm cool, thank you. What about you?` *(Correct)*
      - **B:** `I'm fine, thank you. Hi Sara.`
      - **C:** `Hello, me too.`
- **Audio & Logic:**
  - User selects Option A.
  - Bubble 2 populates and full audio plays smoothly with highlighted text.

---

## Screen 10: Capstone Spoken Handshake
- **Type:** Timed Forced Production / Lesson Gate (`subtype: "capstone_spoken"`)
- **Component:** `EchoMicView.tsx`
- **UI Elements:**
  - Avatar waves; speech bubble plays: `"Hey, how are you?"`
  - Prompt banner: *Respond and ask them back!*
  - Visual scaffold: `I'm [good / cool], thank you. What about you?`
  - Active mic button with a 4-second circular countdown timer.
- **Audio & Logic:**
  - Cold mic. User must speak the full response (`"I'm good/cool, thank you, what about you?"`) before the timer expires.
  - Passes $\ge 75\%$ acoustic match to complete Lesson 1.1, unlock Lesson 1.2, and award XP.
