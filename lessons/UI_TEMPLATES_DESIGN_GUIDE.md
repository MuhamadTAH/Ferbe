# Mohammed Mahdi English Course — Master UI Templates, Design & Code Manual

> **Self-Contained Implementation Guide:** Any developer, designer, or AI can build any new lesson (Levels 1–5) by simply picking a template below and copy-pasting the **Database Seed Payload (`solutionData`)** into `scripts/seed-mohammed-mahdi-course.ts`. No additional coding or explanation needed.

---

## 📐 Universal Design & Architecture Standards

### 1. Consistent Kurdish BiDi Design (`KurdishGlossBadges`)
- **Reading & Meaning Alignment:** Pronunciation (خوێندنەوە) and Meaning (مانا) are rendered together in an identical badge stack with vertical alignment lines:
  - English word on left (LTR).
  - Kurdish pronunciation badge and meaning badge vertically aligned on the right (RTL).
  - Never shift or change styles between screens.
- **Font Stack:** Kurdish text uses `font-kurdish` (Vazirmatn / Noto Sans Kurdish) with `dir="rtl"`. English uses sans-serif `dir="ltr"`.

### 2. Standard Palette Tokens
| Role | Color Name | Hex Code | Border Hex | Soft Background |
| :--- | :--- | :--- | :--- | :--- |
| **Success / Primary Action** | Duolingo Green | `#58CC02` | `#46A302` | `#E8FAD4` / `#D7FFB8` |
| **Interactive / Audio Focus** | Sky Blue | `#1CB0F6` | `#1899D6` | `#DDF4FF` |
| **Timer / Warning / Accent** | Amber Orange | `#FF9600` | `#CC7A00` | `#FFF4E5` |
| **Speech / Oral Practice** | Royal Purple | `#9333EA` | `#7E22CE` | `#FAF5FF` |
| **Error / Mismatch** | Coral Red | `#EA2B2B` | `#CC2323` | `#FFDFE0` |
| **Card Borders** | Neutral Gray | `#E5E5E5` | `#CECECE` | Dark: `#37464F` |

### 3. Speech Audio Standard
Always uses `playAmericanSpeech(text, rate)` from `src/lib/americanVoice.ts` (Natural American English neural TTS). Never call browser `window.speechSynthesis` directly.

### 4. Spoken Assessment Standard
Speech recognition answers are validated using `evaluateSpokenAnswer(spoken, target)` from `src/lib/speechEvaluation.ts`. It normalizes contractions (`I'm` ↔ `I am`, `don't` ↔ `do not`) and matches using combined LCS (Longest Common Subsequence) and Levenshtein token scoring.

---

## 🚀 Quick Recipe: How to Add Any Screen in 30 Seconds

1. Open `scripts/seed-mohammed-mahdi-course.ts`.
2. Locate the lesson under `MOHAMMED_MAHDI_UNITS`.
3. Add an exercise object with the template's `subtype` and payload:
```typescript
{
  type: "multiple_choice", // or "audio_match"
  promptText: "کوردستان یان تایتڵی پرسیار",
  distractors: [],
  solutionData: {
    subtype: "<SUBTYPE_NAME>",
    instruction: "ناوی تەکنیکی ڕاهێنانەکە",
    // ... copy the payload from the template below ...
  },
  order: screenIndex,
}
```
4. Run the seed command:
```bash
npm run seed:mahdi
```
5. Done! The router in `src/app/learn/[lessonId]/page.tsx` automatically renders the correct component with all interactive logic, animations, and voice synthesis.

---

# 📚 The 23 Production Templates (Wireframe + Code + Props)

---

### Template 01: Word Anchors (Lexicon Intro)
- **Subtype:** `word_anchors`
- **Component File:** `src/components/lesson/WordAnchorsView.tsx`
- **Purpose:** Introduce 2–4 new words/phrases with clear pronunciation, Kurdish transliteration, and meaning.
- **Rule:** User must tap and listen to all cards before the "Continue" button unlocks.

#### Wireframe Sketch:
```
------------------------------------------------------------
                       [ 🏷️ Word Anchors ]
                    سڵاوکردن لە زمانی ئینگلیزیدا
------------------------------------------------------------
  +------------------------------------------------------+
  |  Hello  [🔊]     |  خوێندنەوە: هێڵۆو  |  مانا: سڵاو  | [✓]
  +------------------------------------------------------+
  |  Hi     [🔊]     |  خوێندنەوە: های    |  مانا: سڵاو  | [✓]
  +------------------------------------------------------+
  |  Hey    [🔊]     |  خوێندنەوە: هێی    |  مانا: سڵاو  | [✓]
  +------------------------------------------------------+
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "word_anchors",
  instruction: "پێناسەی وشە (Word Anchors)",
  correct: "completed",
  words: [
    {
      english: "Hello",
      pronunciationKurdish: "هێڵۆو",
      meaningKurdish: "سڵاو",
      note: "فەرمی و باو"
    },
    {
      english: "Hi",
      pronunciationKurdish: "های",
      meaningKurdish: "سڵاو",
      note: "دۆستانە"
    },
    {
      english: "Hey",
      pronunciationKurdish: "هێی",
      meaningKurdish: "سڵاو",
      note: "نافەرمی"
    }
  ]
}
```

#### Component Interface (`props`):
```typescript
interface WordAnchorsViewProps {
  exercise: Exercise;
  onSelect: (value: string) => void;
  selected: string | null;
}
```

---

### Template 02: Acoustic Match (Sound to Spelling)
- **Subtype:** `acoustic_match`
- **Component File:** `src/components/lesson/AcousticMatchView.tsx`
- **Purpose:** Ear verification matching audio sounds to English spelling with zero Kurdish text crutches.
- **Rule:** Tap an audio button on the left, then tap matching English word tile on the right. Correct pair highlights green and locks; mismatch triggers red shake and resets selection.

#### Wireframe Sketch:
```
------------------------------------------------------------
                      [ 👂 Acoustic Match ]
          گوێ لە دەنگەکان بگرە و وشە هاوتاکەیان دیاری بکە
------------------------------------------------------------
   [ Left: Audio ]                   [ Right: Text ]
   +---------------------+          +---------------------+
   |  ▶  Sound 1         |          |  Hey                |
   +---------------------+          +---------------------+
   |  ▶  Sound 2         |          |  Hello              |
   +---------------------+          +---------------------+
   |  ▶  Sound 3         |          |  Hi                 |
   +---------------------+          +---------------------+
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "acoustic_match",
  instruction: "ڕاهێنانی بیستن (Acoustic Match)",
  correct: "matched",
  sounds: [
    { id: "s1", label: "Sound 1", word: "Hi" },
    { id: "s2", label: "Sound 2", word: "Hey" },
    { id: "s3", label: "Sound 3", word: "Hello" }
  ],
  words: ["Hey", "Hello", "Hi"]
}
```

---

### Template 03: Analytic Breakdown (Deconstruction)
- **Subtype:** `analytic_breakdown`
- **Component File:** `src/components/lesson/AnalyticBreakdownView.tsx`
- **Purpose:** Deconstruct sentences word-by-word into constituent elements, ending with the full connected phrase.
- **Rule:** Rows 1–3 play individual word audio. Row 4 (accented border) plays connected native speech. User must play Row 4 to unlock the screen.

#### Wireframe Sketch:
```
------------------------------------------------------------
                  [ 🧩 Analytic Breakdown ]
                  شیکردنەوەی پێکهاتەی ڕستە
------------------------------------------------------------
  +------------------------------------------------------+
  | Row 1:  How          | [▶] | هەو     | (چۆن)         |
  +------------------------------------------------------+
  | Row 2:  are          | [▶] | ئاڕ     | (هەیت)        |
  +------------------------------------------------------+
  | Row 3:  you          | [▶] | یو      | (تۆ)          |
  +======================================================+
  | Row 4:  How are you? | [▶] | هەواریو؟ | (چۆنیت؟)      | [⚡ Full]
  +======================================================+
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "analytic_breakdown",
  instruction: "شیکردنەوەی پێکهاتەی ڕستە (Analytic Breakdown)",
  correct: "How are you?",
  rows: [
    { english: "How", pronunciationKurdish: "هەو", meaningKurdish: "چۆن" },
    { english: "are", pronunciationKurdish: "ئاڕ", meaningKurdish: "هەیت" },
    { english: "you", pronunciationKurdish: "یو", meaningKurdish: "تۆ" },
    {
      english: "How are you?",
      pronunciationKurdish: "هەواریو؟",
      meaningKurdish: "چۆنیت؟",
      isFullPhrase: true
    }
  ]
}
```

---

### Template 04: The Echo Mic (Spoken Practice)
- **Subtype:** `echo_mic` / `capstone_spoken`
- **Component File:** `src/components/lesson/EchoMicView.tsx`
- **Purpose:** Spoken pronunciation practice with acoustic validation and live waveform feedback.
- **Rule:** Auto-plays model pronunciation once on mount. User taps pulsating mic and speaks. Speech evaluation performs fuzzy matching (score ≥ 70% to pass).

#### Wireframe Sketch:
```
------------------------------------------------------------
                     [ 🎙️ The Echo Mic ]
                     ڕاهێنانی دەنگ و وتار
------------------------------------------------------------
                      How are you?   [🔊]
                       (هەواریو؟)

                         ( ( 🎤 ) )
                      [ Tap to Speak ]

                  Transcript: "How are you"
                  Status: ✅ 100% Match
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "echo_mic", // or "capstone_spoken"
  instruction: "ڕاهێنانی وتار و دەنگدانەوە (The Echo Mic)",
  correct: "How are you?",
  spokenText: "How are you?",
  subTextGuide: "هەواریو؟",
  visualScaffold: "I'm [good / cool], thank you. What about you?", // optional
  timerSeconds: 4 // optional for timed capstone
}
```

---

### Template 05: Status Bank (Lexicon Expansion)
- **Subtype:** `status_bank`
- **Component File:** `src/components/lesson/StatusBankView.tsx`
- **Purpose:** Sentence frame slot insertion with interchangeable adjectives.
- **Rule:** Tapping a card inserts the word into `I'm [ ___ ], thank you.` and auto-plays full audio. Learner must tap all 4 cards to advance.

#### Wireframe Sketch:
```
------------------------------------------------------------
                   [ 📚 Status Adjectives ]
                    بانکی وەسفی بارودۆخ
------------------------------------------------------------
         +-----------------------------------------+
         |      I'm [  cool  ], thank you.  [🔊]   |
         +-----------------------------------------+

           +-------------------+   +-------------------+
           | fine  (باش)       |   | good  (باش)       |
           +-------------------+   +-------------------+
           | great (زۆر باش)   |   | cool  (نایاب)     |
           +-------------------+   +-------------------+
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "status_bank",
  instruction: "بانکی وەسفی بارودۆخ (Status Adjectives Bank)",
  correct: "completed",
  cards: [
    { word: "fine", sound: "فاین", meaning: "باش" },
    { word: "good", sound: "گود", meaning: "باش" },
    { word: "great", sound: "گرەیت", meaning: "زۆر باش" },
    { word: "cool", sound: "کووڵ", meaning: "نایاب" }
  ]
}
```

---

### Template 06: Slot-and-Filler Check
- **Subtype:** `slot_filler`
- **Component File:** `src/components/lesson/SlotFillerView.tsx`
- **Purpose:** Fast syntax discrimination and vocabulary role checking.
- **Rule:** Sentence frame contains an empty slot `[ ? ]`. Tapping option snaps it into place; correct option auto-plays full audio, incorrect shakes red.

#### Wireframe Sketch:
```
------------------------------------------------------------
                    [ 🧩 Slot-and-Filler ]
              بۆشاییەکە بە وشەی دروست پڕبکەرەوە
------------------------------------------------------------
         +-----------------------------------------+
         |        I'm [  ?  ], thank you.          |
         +-----------------------------------------+

           +-------------------+   +-------------------+
           |      great        |   |      hello        |
           +-------------------+   +-------------------+
           |      how          |   |      are          |
           +-------------------+   +-------------------+
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "slot_filler",
  instruction: "بۆشاییەکە بە وشەی گونجاو پڕبکەرەوە (Slot-and-Filler)",
  correct: "great",
  options: ["great", "hello", "how", "are"],
  slotPrefix: "I'm",   // optional
  slotSuffix: ", thank you." // optional
}
```

---

### Template 07: Social Logic Match (Response Pairing)
- **Subtype:** `response_pairing`
- **Component File:** `src/components/lesson/ResponsePairingView.tsx`
- **Purpose:** Connect conversation prompts to their natural communicative responses.
- **Rule:** Learner connects left prompt to right response. Forces distinction between greeting someone and reporting condition.

#### Wireframe Sketch:
```
------------------------------------------------------------
                  [ ↔️ Social Logic Match ]
            پەیامەکە بە وەڵامە سروشتییەکەی ببەستەوە
------------------------------------------------------------
   [ Prompts ]                        [ Responses ]
   +-------------------------+        +-------------------------+
   |  Hi Sara            [✓] | <----> |  Hello Ahmad        [✓] |
   +-------------------------+        +-------------------------+
   |  How are you?       [✓] | <----> |  I'm good, thank you[✓] |
   +-------------------------+        +-------------------------+
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "response_pairing",
  instruction: "جووتبەندکردنی گفتوگۆ (Social Logic Match)",
  correct: "paired",
  pairs: [
    { prompt: "Hi Sara", response: "Hello Ahmad" },
    { prompt: "How are you?", response: "I'm good, thank you" }
  ]
}
```

---

### Template 08: Bounce-Back Anchor (Pragmatic Isolation)
- **Subtype:** `bounce_back_anchor`
- **Component File:** `src/components/lesson/BounceBackAnchorView.tsx`
- **Purpose:** Teaches core conversational turn phrases like "What about you?" and "Me too!".
- **Rule:** Large card with pronunciation helper + Kurdish meaning. Learner selects the communicative purpose of the phrase.

#### Wireframe Sketch:
```
------------------------------------------------------------
               [ ↩️ The Bounce-Back Anchor ]
                 ئەرکی ئەم دەستەواژەیە چییە؟
------------------------------------------------------------
  +------------------------------------------------------+
  |                  What about you?  [🔊]               |
  |             خوێندنەوە: وەرەباوتیو؟                   |
  |             مانا: ئەی تۆ؟ / تۆ چۆنیت؟               |
  +------------------------------------------------------+

  +------------------------------------------------------+
  | (✓) Ask the question back (پرسیارەکە بگەڕێنەوە)      |
  +------------------------------------------------------+
  | ( ) Say goodbye (ماڵئاوایی کردن)                     |
  +------------------------------------------------------+
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "bounce_back_anchor",
  instruction: "گەڕاندنەوەی پرسیارەکە (The Bounce-Back Anchor)",
  phrase: "What about you?",
  pronunciation: "وەرەباوتیو؟",
  meaning: "ئەی تۆ؟ / تۆ چۆنیت؟",
  correct: "Ask the question back (پرسیارەکە بە هەمان شێوە بپرسەوە)",
  options: [
    "Ask the question back (پرسیارەکە بە هەمان شێوە بپرسەوە)",
    "Say goodbye (ماڵئاوایی کردن)"
  ]
}
```

---

### Template 09: Interactive Chat Dialogue (Live Messenger)
- **Subtype:** `chat_dialogue`
- **Component File:** `src/components/lesson/ChatDialogueView.tsx`
- **Purpose:** Simulate live messaging interface with incoming and outgoing speech bubbles.
- **Rule:** Auto-plays incoming question audio on load. User selects A, B, or C. Chosen message populates outgoing bubble and speaks audio.

#### Wireframe Sketch:
```
------------------------------------------------------------
               [ 💬 Interactive Chat Dialogue ]
          وەڵامی گونجاو هەڵبژێرە بۆ بەردەوامیدان بە چاتەکە
------------------------------------------------------------
  +--------------------------------------------------------+
  | [🤖 Partner]                                           |
  | "Hey Ahmad, how are you?"                         [🔊] |
  |                                                        |
  |                                        [🧑 You]        |
  |                  "I'm cool, thank you. What about you?"|
  +--------------------------------------------------------+

  +--------------------------------------------------------+
  | [A] I'm cool, thank you. What about you?           (✓) |
  +--------------------------------------------------------+
  | [B] I'm fine, thank you. Hi Sara.                      |
  +--------------------------------------------------------+
  | [C] Hello, me too.                                     |
  +--------------------------------------------------------+
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "chat_dialogue",
  instruction: "دیالۆگ و چاتی زیندوو (Interactive Chat Dialogue)",
  incomingMessage: "Hey Ahmad, how are you?",
  correct: "I'm cool, thank you. What about you?",
  options: [
    "I'm cool, thank you. What about you?",
    "I'm fine, thank you. Hi Sara.",
    "Hello, me too."
  ]
}
```

---

### Template 10: Intonation Radar (Pitch Discrimination)
- **Subtype:** `intonation_radar`
- **Component File:** `src/components/lesson/IntonationRadarView.tsx`
- **Purpose:** Train ears to track vocal pitch contours (rising question ↗ vs falling statement ↘) without reading punctuation.
- **Rule:** Audio plays native cadence. Learner has 4 seconds to classify pitch. Progress dots track multiple rounds.

#### Wireframe Sketch:
```
------------------------------------------------------------
                  [ 📡 Intonation Radar ]
               گوێ بگرە — پرسیاره یان داخوێندراوه؟
------------------------------------------------------------
                     [ 🔊 Playing Audio... ]
                           ⏱️ 4s Timer

  +---------------------------+   +---------------------------+
  |            ❓             |   |            💬             |
  |         Question          |   |         Statement         |
  |      (Rising Pitch ↗)     |   |      (Falling Pitch ↘)    |
  +---------------------------+   +---------------------------+
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "intonation_radar",
  instruction: "ڕاهێنانی گوێ (Intonation Radar)",
  correct: "completed",
  prompts: [
    { text: "How are you?", type: "question" },
    { text: "I'm good, thank you", type: "statement" }
  ]
}
```

---

### Template 11: Greeting Catcher (Fast Acoustic Contrast)
- **Subtype:** `greeting_catcher`
- **Component File:** `src/components/lesson/GreetingCatcherView.tsx`
- **Purpose:** Fast greeting recognition at native speed with zero written Kurdish translations.
- **Rule:** High-speed audio plays greeting. Learner has 3-second countdown ring to tap matching word button.

#### Wireframe Sketch:
```
------------------------------------------------------------
                 [ ⚡ Greeting Catcher ]
                کام سڵاوکردنت بە خێرایی بیست؟
------------------------------------------------------------
                         ⏱️ 3s Timer
    +---------------+   +---------------+   +---------------+
    |      Hey      |   |      Hi       |   |     Hello     |
    +---------------+   +---------------+   +---------------+
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "greeting_catcher",
  instruction: "ڕاهێنانی بیستن (Greeting Catcher)",
  correct: "completed",
  buttons: ["Hey", "Hi", "Hello"],
  rounds: [
    { audio: "Hey Ahmad!", correct: "Hey" },
    { audio: "Hi Sara!", correct: "Hi" }
  ]
}
```

---

### Template 12: Mood & Sentiment Decoder
- **Subtype:** `mood_decoder`
- **Component File:** `src/components/lesson/MoodDecoderView.tsx`
- **Purpose:** Auditory adjective identification through tone, emotional affect, and vocal stress.
- **Rule:** Audio plays full sentence with emotion. Learner taps matching mood card (emoji + English word).

#### Wireframe Sketch:
```
------------------------------------------------------------
                   [ 😊 Mood Decoder ]
                گوێ بگرە — چۆن هەستی دەربڕی؟
------------------------------------------------------------
     +-----------------------+     +-----------------------+
     |   🙂   fine           |     |   👍   good           |
     +-----------------------+     +-----------------------+
     |   😁   great          |     |   😎   cool           |
     +-----------------------+     +-----------------------+
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "mood_decoder",
  instruction: "ڕاهێنانی بیستن (Mood Decoder)",
  correct: "completed",
  cards: [
    { word: "fine", emoji: "🙂" },
    { word: "good", emoji: "👍" },
    { word: "great", emoji: "😁" },
    { word: "cool", emoji: "😎" }
  ],
  rounds: [
    { audio: "I'm great, thank you!", correct: "great" },
    { audio: "I'm cool, thank you.", correct: "cool" }
  ]
}
```

---

### Template 13: Connected Speed Trap
- **Subtype:** `speed_trap`
- **Component File:** `src/components/lesson/SpeedTrapView.tsx`
- **Purpose:** Contrast artificial textbook speech against real American reductions and connected speech.
- **Rule:** Learner plays both Slow Robotic 🐢 audio and Fast Street ⚡ audio, then taps which one represents authentic conversational English.

#### Wireframe Sketch:
```
------------------------------------------------------------
               [ 🐢 vs ⚡ Connected Speed Trap ]
                    هەردوو دەنگ گوێ بگرەوە
------------------------------------------------------------
  +--------------------------------------------------------+
  | [🐢] Slow / Articulated: "How — are — you?"        [▶] |
  +--------------------------------------------------------+
  | [⚡] Natural Native Speed: "How are you?"           [▶] |
  +--------------------------------------------------------+

  Which one is used in real daily conversation?
  +----------------------------+  +----------------------------+
  |   🐢 Slow / Articulated    |  |   ⚡ Natural Native Speed  |
  +----------------------------+  +----------------------------+
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "speed_trap",
  instruction: "ڕاهێنانی بیستن (Connected Speech)",
  slowText: "How — are — you?",
  fastText: "How are you?",
  slowLabel: "Slow / Articulated",
  fastLabel: "Natural Native Speed",
  promptKurdish: "کامیان دەچێتە گفتوگۆی ڕاستەقینە؟",
  correct: "fast"
}
```

---

### Template 14: Audio Choice / Reduction Decoder
- **Subtype:** `audio_choice`
- **Component File:** `src/components/lesson/AudioChoiceView.tsx`
- **Purpose:** Identify full phrases heard in fast reduced speech.
- **Rule:** Tapping audio button plays reduction (e.g. /wʌt əbaʊt juː/). Learner taps matching text option.

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "audio_choice",
  instruction: "ڕاهێنانی بیستن (Reduction Decoder)",
  audioText: "What about you?",
  question: "چیت بیست؟",
  correct: "What about you?",
  options: [
    "What about you?",
    "How are you?",
    "Thank you"
  ]
}
```

---

### Template 15: Blind Audio Scramble (Dialogue Sequencing)
- **Subtype:** `blind_audio_scramble`
- **Component File:** `src/components/lesson/BlindAudioScrambleView.tsx`
- **Purpose:** Chronological conversation assembly without written transcripts.
- **Rule:** 3 pure sound clips (A, B, C). User listens and taps slots [1], [2], [3] to arrange correct order.

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "blind_audio_scramble",
  instruction: "ڕاهێنانی بیستن (Blind Audio Scramble)",
  correct: "completed",
  clips: [
    { id: "A", label: "Audio A", text: "I'm good, thank you. What about you?" },
    { id: "B", label: "Audio B", text: "Hey Ahmad, how are you?" },
    { id: "C", label: "Audio C", text: "I'm cool, thank you." }
  ],
  correctOrder: ["B", "A", "C"]
}
```

---

### Template 16: Social Context Detection
- **Subtype:** `social_context`
- **Component File:** `src/components/lesson/SocialContextView.tsx`
- **Purpose:** Register discrimination (formal vs casual settings).
- **Rule:** Audio plays dialogue snippet; user taps illustrated setting card (e.g. Formal 👨‍🏫 vs Casual 👫).

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "social_context",
  instruction: "ڕاهێنانی بیستن (Social Context)",
  correct: "completed",
  scenario1: "Student & Teacher",
  scenario1Emoji: "👨‍🏫",
  scenario2: "Friends on the street",
  scenario2Emoji: "👫",
  rounds: [
    { audio: "Hey! How are you?", correct: "2" },
    { audio: "Hello, teacher.", correct: "1" }
  ]
}
```

---

### Template 17: Speed Ear Gate (Rapid Checkpoint)
- **Subtype:** `speed_ear_gate`
- **Component File:** `src/components/lesson/SpeedEarGateView.tsx`
- **Purpose:** Rapid-fire True/False auditory comprehension checkpoint.
- **Rule:** 3 reps. Each has a 3-second countdown ring. User taps [ ✅ True ] or [ ❌ False ]. Must score ≥ 2/3 to pass.

#### Wireframe Sketch:
```
------------------------------------------------------------
                 [ ⏱️ Speed Ear Gate ]
            دەنگ لەگەڵ ئەنجامەکە دەگونجێت؟
------------------------------------------------------------
                        ⏱️ 3s Ring
                     [  Display Card  ]

     +-----------------------+     +-----------------------+
     |       ✅ True         |     |       ❌ False        |
     +-----------------------+     +-----------------------+
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "speed_ear_gate",
  instruction: "تاقیکردنەوەی گوێ (Speed Ear Gate)",
  correct: "completed",
  timerSeconds: 3,
  passMark: 2,
  rounds: [
    { audio: "I'm cool, thank you.", display: "😎", correct: true },
    { audio: "Hi Ahmad.", display: "👧 Sara", correct: false },
    { audio: "What about you?", display: "How are you?", correct: false }
  ]
}
```

---

### Template 18: Timed Speaking (Rapid Production)
- **Subtype:** `timed_mic`
- **Component File:** `src/components/lesson/TimedMicView.tsx`
- **Purpose:** High-pressure oral response training without hesitation.
- **Rule:** Visual prompt (emoji/icon) + prompt audio + circular countdown ring (3s–5s) around the mic button. Speech recognition evaluates response.

#### Wireframe Sketch:
```
------------------------------------------------------------
                  [ 🎙️ Timed Speaking ]
                   وەڵام بدە پێش تەواوبوونی کات
------------------------------------------------------------
                           👍
                I'm [ ? ], thank you.
                       ( ⏱️ 4s )
                        ( 🎤 )
------------------------------------------------------------
```

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "timed_mic",
  instruction: "قسەکردنی خێرا (Timed Speaking)",
  correct: "I'm good, thank you",
  spokenText: "I'm good, thank you",
  promptAudio: "How are you?",
  promptLabel: "هاواری سەرووەکە گوێ بگرە",
  visualCue: "👍",
  scaffoldText: "I'm [ ? ], thank you.",
  timerSeconds: 5
}
```

---

### Template 19: Spatial Anchor (This vs That)
- **Subtype:** `spatial_anchor`
- **Component File:** `src/components/lesson/SpatialAnchorView.tsx`
- **Purpose:** Physical spatial contrast between demonstratives (Near / This vs Far / That).
- **Rule:** Side-by-side cards with distance indicators. Learner must tap both cards to hear pronunciation and unlock Continue.

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "spatial_anchor",
  instruction: "پێناسەی شوێن (Spatial Anchor)",
  correct: "completed",
  cards: [
    { label: "Near", word: "This", emoji: "👆🚗", description: "ذس / ئەمە - نزیک", distance: "near" },
    { label: "Far", word: "That", emoji: "👉🚗💨", description: "ذات / ئەوە - دوور", distance: "far" }
  ]
}
```

---

### Template 20: Opinion Ladder (Intensity Ordering)
- **Subtype:** `opinion_ladder`
- **Component File:** `src/components/lesson/OpinionLadderView.tsx`
- **Purpose:** Understand emotional gradation from strongest positive to strongest negative.
- **Rule:** Learner taps cards in order: love 😍 → like 👍 → don't like 👎 → hate 😡. Audio plays on each tap.

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "opinion_ladder",
  instruction: "پلەی بۆچوون (Opinion Ladder)",
  correct: "completed",
  headerKurdish: "لە باشترین بۆ خراپترین ڕیزبندی بکە",
  correctOrder: ["love", "like", "don't like", "hate"],
  cards: [
    { word: "love", emoji: "😍", kurdish: "ئای ڵەڤ" },
    { word: "like", emoji: "👍", kurdish: "ئای ڵایک" },
    { word: "don't like", emoji: "👎", kurdish: "ئارۆن ڵایک" },
    { word: "hate", emoji: "😡", kurdish: "ئای هەیت" }
  ]
}
```

---

### Template 21: Timed Tile Assembly (Syntax Sprint)
- **Subtype:** `tile_assembly`
- **Component File:** `src/components/lesson/TileAssemblyView.tsx`
- **Purpose:** Assemble sentence tiles under a ticking 5-second countdown bar.
- **Rule:** Visual cue + timer bar + sentence assembly zone. Jumbled tiles are tapped in sequence.

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "tile_assembly",
  instruction: "دەروازەی دروستکردن (Assembly Gate — 5s)",
  correct: "completed",
  visualCue: "🚗❌",
  tiles: ["that car.", "I", "don't like", "this"],
  correctOrder: ["I", "don't like", "that car."],
  timerSeconds: 5
}
```

---

### Template 22: Agreement Ear Trap
- **Subtype:** `agreement_ear_trap`
- **Component File:** `src/components/lesson/AgreementEarTrapView.tsx`
- **Purpose:** Prevent false-friend agreement errors by ear ("Me too" vs "You too" / "Thank you").
- **Rule:** Prompt audio plays ("I like Dolma, what about you?"). Learner listens to 3 audio bubbles and selects the correct one.

#### Database Payload (`solutionData`):
```typescript
solutionData: {
  subtype: "agreement_ear_trap",
  instruction: "ڕاهێنانی بیستن (Agreement Ear Trap)",
  correct: "A",
  promptText: "I like Dolma, what about you?",
  responses: [
    { id: "A", label: "Response A", text: "Me too." },
    { id: "B", label: "Response B", text: "You too." },
    { id: "C", label: "Response C", text: "Thank you." }
  ],
  correctId: "A"
}
```

---

### Template 23: Boss Checkpoint & Mastery Scorecard
- **Subtype:** `boss_score_card`
- **Component File:** `src/components/lesson/BossScoreCardView.tsx`
- **Purpose:** Scenario briefing before boss conversation, and final multi-dimensional scorecard after completion.
- **Rule:** 
  - **Screen 1 (Briefing):** Avatar, mission description, microphone status indicator, "Start Conversation" button.
  - **Screen 8 (Scorecard):** Radar circular badge with score (PASSED / RETRY), 3 metric progress bars (Response Speed, Pronunciation Accuracy, Conversational Flow), and Unit 2 Unlock button.

#### Database Payload (Screen 1 — Briefing):
```typescript
solutionData: {
  subtype: "boss_score_card",
  subtype2: "boss_briefing",
  instruction: "داوای باس (Boss Checkpoint)"
}
```

#### Database Payload (Screen 8 — Scorecard):
```typescript
solutionData: {
  subtype: "boss_score_card",
  instruction: "پۆلی کۆتایی (Mastery Scorecard)",
  correct: "unit_mastered",
  speedScore: 85,
  accuracyScore: 78,
  flowScore: 82
}
```
