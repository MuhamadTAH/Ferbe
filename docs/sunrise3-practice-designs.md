# Sunrise 3 → Duolingo-Style Course: Finalized Practice Designs

Source: Gemini conversation `https://share.gemini.google/phGY3wslFklC`
(canonical: `https://gemini.google.com/share/fa5782fc86ea`)
Full transcript: `../gemini-v3.txt`

This is the **final agreed design** for each of the 12 practice types in the
*Sunrise 3 Student's Book* (Macmillan, British English, Grade 3). Each practice
was iterated with the author until a final set of interactive "trainings" was
locked in. Songs (Practice 11) were intentionally dropped.

- **Temp meanings:** `word_anchors`, `echo_mic`, etc. are the existing template
  codes from the author's earlier English course that each training reuses/adapts.
- **Counts:** this document follows the detailed per-practice sections (and the
  author's explicit confirmations), which are more complete than Gemini's final
  one-line summary.

---

## Practice 1 — Vocabulary Audio-Visual Drill
*"Listen and say / Point and say" — start of Lesson 1 in every unit.*

1. **Visual Word Anchors** *(word_anchors)* — 6-card tappable image grid; tap a
   card to hear the word + see image/gloss; must hear all cards to unlock.
2. **Isolated Echo Screen** *(echo_mic)* — one screen per word; hear model audio,
   tap mic, live waveform + match feedback.

**Final: 2 trainings**

---

## Practice 2 — Multi-Panel Story Dialogue
*"Listen and read. Say." — Lesson 2 in every unit (Sirwa, Nabaz, Jack, Emma).*

- **Base format:** `chat_dialogue` upgraded to a **progressive 4-panel story feed**
  with a mid-story comprehension check.
1. **Visual Slot-Filler** *(slot_filler)* — "He's a [ ___ ]." tap the role from
   visual options.
2. **Scaffolded Mic Response** *(timed_mic)* — "Who is she?" with a visual frame
   (`She's a [ 🩺 ] .`) so the child speaks the full sentence.
3. **"Who Said It?" Ear-to-Image Match** — audio line → tap the correct character.
4. **Prop Binding (Item-to-Job Match)** — tap the tool (stethoscope/pan/hose) that
   completes the job.

**Final: 4 trainings (+4-panel story feed)**

---

## Practice 3 — Visual Prompt Q&A & Inspection Deduction
*"Point, ask and say" + "Play a game" — Unit 1 Lesson 1, recurring.*

Built as the **4-Stage Architecture**:
1. **Visual Grid Intake** *(word_anchors)* — discover the 8 items; each image shows
   its correct indefinite article (a / an).
2. **Target Q&A Comprehension** — "What is it? It's a duck." choose the matching image.
3. **Mystery Deduction Game** — "What colour is it? / Is it a cap? No, it isn't."
   combine colour + yes/no clues to reveal the object.
4. **Roleplay Production** *(timed_mic)* — answer aloud with visual scaffolding.

**Final: 4 trainings**

---

## Practice 4 — Alphabet & Spelling Drills
*"Listen, point and sing / Spell A-N-T" — Lesson 3 (p. 6, p. 9).*

Mic spelling was **dropped** (STT unreliable with young RTL learners); replaced by
tap-based drills.
1. **Initial Sound Match** — big letter + audio, tap the image that starts with it
   (zero text under options).
2. **Letter Box Builder** *(Letter Box)* — tap-to-spell tray; assemble the word
   letter by letter, tap a slot to send a tile back.
3. **Guided LTR Word-Wheel** *(finger_slide)* — finger-slide to spell, but strictly
   Left→Right from the first letter (fixes RTL/BiDi interference).
4. **Split-Column Alphabet Matching** *(Pair Match)* — left letters ↔ right images.
5. **Missing Letter Hunter** *(letter_cloze)* — one-letter gap in the word; pick the
   missing letter.

**Final: 5 trainings**

---

## Practice 5 — Phonics & Sound Discrimination
*"Listen and repeat. Then circle and say." — Lesson 3 (/ɒ/, /ʌ/, /eɪ/, /tʃ/ vs /ʃ/, /θ/ vs /ð/, doubles).*

1. **Blind Sound Catcher (Audio Odd-One-Out)** — 3 audio cards, tap the intruder;
   no text so the child can't cheat by reading letters.
2. **The Letter Hunter** — tap the exact letter(s) making the target sound in a word
   (digraphs highlight together).
3. **Sound Sorting Bins (Phoneme Buckets)** — drop word chips into the matching
   sound bucket.

**Final: 3 trainings**

---

## Practice 6 — Punctuation & Mechanics
*"Add punctuation."*

1. **Sentence Doctor** — tray insertion for periods, apostrophes, capitals.
2. **Contraction Magnet** — build is not → isn't.
3. **Punctuation Trap** *(sentence_choice)* — pick the correctly punctuated sentence
   among traps (missing apostrophe / capital / agreement).
4. **Dialogue Q&A Match** *(qa_punctuation_match)* — link `?` questions to `,`/`.`
   short answers.
5. **One-Tap Error Hunter** *(tap_the_mistake)* — tap the single broken word to fix it.

**Final: 5 trainings**

---

## Practice 7 — Tangled-Line Syntax Builders
*"Follow the lines. Say." — Unit 4 p. 15, Unit 6 p. 22, Unit 8 p. 28.*

1. **Illuminated Wire Tracer** *(wire_tracer)* — tap a pronoun; the cord lights up to
   reveal its partner; sentence outputs with audio.
2. **Syntax Train / Rail Connector** *(rail_assembler)* — connect Subject → Verb →
   Object (have vs has).
3. **Tangled Riddle / What's in the Bag?** — match visual quantity to the correct
   copula (There is / There are).

**Final: 3 trainings**

---

## Practice 8 — Grammatical Cloze & Pronoun Selection
*"Choose. / Write my, your, our" — Unit 6/11/13/15/16.*

1. **Inline Capsule Snap** *(capsule_cloze)* — tap the option that snaps into the
   hollow capsule (is / are, They're / They aren't).
2. **Possessive Avatar Match** *(possessive_picker)* — boy → His, girl → Her,
   group → Their (with Kurdish helper badges).
3. **Visual Action Binary Toggle** *(action_toggle)* — observe the scene, toggle
   between affirmative and negative continuous.

**Final: 3 trainings**

---

## Practice 9 — Split-Column Conversational Matching
*"Read and match. / Match." — Unit 12 p. 42, Unit 14 p. 48.*

Original blind text-matching was rejected; replaced with image-grounded evidence.
1. **The Visual Action Inspector** — see the action image, answer the yes/no
   question ("Is he playing the guitar?" → Yes, he is. / No, he isn't.).
2. **The Wardrobe Detective** — "What are they wearing?" choose the exact visual match
   (trainers = sneakers).
3. **The Question Matcher (Role Reversal)** — given the answer, pick the question
   that caused it.

**Final: 3 trainings**

---

## Practice 10 — Visual Counting & Quantity Matching
*"Count and say. / Count and write." — Unit 2 p. 7, Unit 6 p. 20.*

1. **Interactive Tap-to-Tally Scene** — tap each object; a number badge stamps on it
   as it tallies up to 10; then pick the correct sentence.
2. **Tens-and-Units Bundler** — pre-bundled packs + loose units; add and choose the
   numeral + hyphenated word (twenty-two), for 20–30.
3. **Singular vs Plural Scale** — sort an item into "There is" (1) or "There are" (2+).

**Final: 3 trainings**

---

## Practice 11 — Chants, Song Cloze & Rhythmics
*"Listen and sing." — skipped by author decision.*

Teachers only play a song once and don't train on it, so building a karaoke/lyric
engine was cut. Gemini had proposed 3 (Karaoke Lyric Scroller, Cloze Song Gap, Chant
Metronome), but **none were kept**.

**Final: 0 (omitted)**

---

## Practice 12 — Milestone Boss Battles & Secret Ciphers
*Revision 1–5 (p. 19, 29, 39, 49, 59).*

1. **Secret Message Cipher** *(cipher_decoder)* — unscramble question/answer pairs;
   each correct pair unlocks a letter (H-E-L-L-O).
2. **3-Clue Suspect Lineup** *(detective_lineup)* — 3 sequential clues grey out
   non-matching suspects until one remains.
3. **Syntax Slot Machine** *(syntax_matrix)* — spin 3 reels (Subject / Negation /
   Predicate) and fix the broken reel (He aren't → He isn't).

**Final: 3 trainings**

---

## Summary

| # | Practice | Trainings |
|---|---|---|
| 1 | Vocabulary Audio-Visual Drill | 2 |
| 2 | Multi-Panel Story Dialogue | 4 |
| 3 | Visual Prompt Q&A & Inspection | 4 |
| 4 | Alphabet & Spelling Drills | 5 |
| 5 | Phonics & Sound Discrimination | 3 |
| 6 | Punctuation & Mechanics | 5 |
| 7 | Tangled-Line Syntax Builders | 3 |
| 8 | Grammatical Cloze & Pronouns | 3 |
| 9 | Split-Column Conversational Matching | 3 |
| 10 | Visual Counting & Quantity | 3 |
| 11 | Chants & Songs | 0 (skipped) |
| 12 | Milestone Boss Battles | 3 |
| | **Total** | **38** |

- 12 practice types identified, **11 designed** (songs dropped).
- **38 finalized trainings** total (roughly 2–5 per practice).
- Not counted here: the intermediate proposals that were revised or rejected
  during the session (e.g. both drafts of Practice 3, Practice 6's growth from 4→5,
  Practice 9's whole first attempt, and the 3 dropped song trainings).
