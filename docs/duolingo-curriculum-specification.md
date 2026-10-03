# Duolingo Curriculum & Pedagogical Specification
*Reverse-Engineered Reference Architecture for Fêrbe Language Platform*

---

## 1. High-Level Course Architecture

Duolingo structures language learning across a standardized hierarchical taxonomy rooted in the Common European Framework of Reference for Languages (CEFR):

$$\text{Course} \longrightarrow \text{Sections} \longrightarrow \text{Units} \longrightarrow \text{Levels (Nodes)} \longrightarrow \text{Lessons (Sessions)} \longrightarrow \text{Challenges (Screens)}$$

### 1.1 Course Hierarchy & Progression
* **Sections**: Broad CEFR-aligned learning stages:
  * **Section 1 (Rookie / A1.0 - A1.1)**: 10 Units. Focuses on foundational vocabulary, basic SVO sentences, gender agreement, and essential everyday interactions (order at a café, greet people, family, shopping).
  * **Section 2 (Explorer / A1.2 - A2.0)**: 30 Units. Expands vocabulary, irregular verbs, daily routines, social interactions, past tense, and spatial directions.
  * **Sections 3–5 (Intermediate / A2 - B1)**: Complex narrative structures, subjunctive, conditional, opinion framing.
  * **Sections 6–8 (Advanced / B1 - B2)**: High-register idioms, professional/academic debates, abstract concepts.

### 1.2 Unit Node Sequence
Each Unit contains 6 to 12 sequential path nodes with distinct pedagogical functions:
1. **Skill Node 1 (Level 0)**: 4 to 6 sessions. Introduces core lexical anchors and grammar pattern.
2. **Skill Node 2 (Level 1)**: 4 to 6 sessions. Drills deeper sentence combinations and variations.
3. **Treasure Chest (`chest`)**: 1 session milestone reward offering gems / streak items.
4. **Comprehension Story or Radio (`story` / `duo_radio`)**: 1 session. Authentic conversational listening dialogue where learner identifies contextual nuances.
5. **Unit Practice (`practice`)**: 2 sessions. Mixed review of all previous unit concepts to reinforce spaced repetition.
6. **Unit Review / Trophy (`unit_review`)**: 1 session. Comprehensive gatekeeper checkpoint testing all unit skills without hints.

---

## 2. Anatomy of a Duolingo Lesson (Session)

A standard lesson consists of **15 to 18 screens** designed with a progressive difficulty ramp:

$$\text{Visual Anchor (Select)} \longrightarrow \text{Target} \to \text{Base (Translate)} \longrightarrow \text{Semantic Meaning (Assist)} \longrightarrow \text{Cloze (Tap Complete)} \longrightarrow \text{Aural (Listen Tap)} \longrightarrow \text{Hard Reverse Translation}$$

### 2.1 The Standard 15-Screen Exercise Progression

| Step | Challenge Type | UI & Prompt Format | Pedagogical Objective | Distractor Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `challenge-select` | *"Which one of these is ‘[word]’?"*<br>3 large picture cards with audio, word label, and hotkeys (`1`, `2`, `3`). | **Visual Anchor**: Direct zero-translation association between image, sound, and symbol. | 2 previously learned or contextually related items. |
| **02** | `challenge-translate` | *"Write this in English"*<br>Full sentence prompt with clickable word tokens (audio + hint table tooltip). | **Comprehension via Scaffolding**: Target $\rightarrow$ Base language decoding. | 2 distractor tokens in the bottom bank (e.g., 9 tokens total for 7-token answer). |
| **03** | `challenge-translate` | *"Write this in English"*<br>Short phrase or exclamation (e.g. *Parfait.* $\rightarrow$ *Perfect.*). | **Confidence Reinforcement**: High-frequency pragmatic particle. | 2 distractor tokens. |
| **04** | `challenge-translate` | *"Write this in English"*<br>High-frequency greeting or parting phrase (e.g. *Au revoir.* $\rightarrow$ *Goodbye.*). | **Formulaic Expression Acquisition**. | 2 distractor tokens. |
| **05** | `challenge-assist` | *"Select the correct meaning"*<br>Prompt word in English $\rightarrow$ 3 vertical target language choice buttons. | **Active Semantic Mapping**: Verifies learner knows the target word without spelling aids. | 2 plausible alternate vocabulary items from the same unit. |
| **06** | `challenge-translate` | *"Write this in English"*<br>Affirmation + noun (e.g. *Oui, un sandwich.* $\rightarrow$ *Yes, a sandwich.*). | **Syntactic Chunking**: Connecting particle to noun phrase. | 2 distractor tokens. |
| **07** | `challenge-translate` | *"Write this in English"*<br>Negation + noun (e.g. *Non, un thé.* $\rightarrow$ *No, a tea.*). | **Syntactic Contrast**: Contrasting affirmation vs negation. | 2 distractor tokens. |
| **08** | `challenge-assist` | *"Select the correct meaning"*<br>Target concept check with 3 options. | **Retrieval Checkpoint**: Rapid mid-lesson verification. | 2 related distractors. |
| **09** | `challenge-translate` | *"Write this in English"*<br>Disjunction question (e.g. *Un thé ou un café ?* $\rightarrow$ *A tea or a coffee?*). | **Binary Option Formulation**: Drilling conjunctions (`and`, `or`). | 2 distractor tokens. |
| **10** | `challenge-translate` | *"Write this in English"*<br>Noun + indefinite article (e.g. *Non, un éclair.* $\rightarrow$ *No, an eclair.*). | **Phonological Elision / Article Rules** (*a* vs *an*). | 2 distractor tokens. |
| **11** | `challenge-translate` | *"Write this in English"*<br>Formal address (e.g. *Au revoir, Monsieur.* $\rightarrow$ *Goodbye, sir.*). | **Social Register & Honorifics**. | 2 distractor tokens. |
| **12** | `challenge-tapComplete`| *"Fill in the blank"*<br>Sentence with slot `[ ___ ]` and 4 single-token choice bubbles. | **Cloze Synthesis**: Contextual grammatical completion. | 3 grammatically or semantically invalid options. |
| **13** | `challenge-translate` | *"Write this in English"*<br>Complex compound sentence combining all introduced items. | **Consolidation**: Long-form sentence reading. | 2 distractor tokens. |
| **14** | `challenge-assist` | *"Select the correct meaning"*<br>Social term check (e.g. *sir* $\rightarrow$ *monsieur*). | **Lexical Accuracy Gate**. | 2 distractors. |
| **15** | `challenge-listenTap` | *"Tap what you hear"*<br>Audio wave button (slow + normal speed) + word token bank + `CAN'T LISTEN NOW` toggle. | **Pure Acoustic Decoding**: Ear-to-token parsing without visual text stimulus. | 2 distractor acoustic foils. |
| **+** | `HARD EXERCISE` | *"Write this in [Target Language]"*<br>Reverse translation from base language into target script. | **Active Production**: Highest cognitive load; forces syntax creation. | 3–4 grammatical and lexical distractors. |

---

## 3. Core Engine Mechanics & State Management

### 3.1 Finite State Automaton / DAG Grader
Duolingo evaluates learner submissions against a Directed Acyclic Graph (`c.grader.vertices`):
* **Typo Tolerance**: Words with a Levenshtein distance of 1 are accepted with a non-blocking alert: *"You have a typo, but your answer is correct!"*
* **Lenient Punctuation**: Punctuation marks (`?`, `!`, `,`, `.`) and casing differences are ignored during token validation.
* **Contraction Normalization**: Equivalent forms (e.g., `I'd` $\iff$ `I would`, `I'm` $\iff$ `I am`, `can't` $\iff$ `cannot`) are both encoded as valid paths in the grading DAG.

### 3.2 Error Recycling Queue (`mistakesReplacementChallenges`)
* When a learner answers incorrectly:
  1. Hearts counter decrements by 1 ($5 \to 4$).
  2. Bottom ribbon slides up in red:
     * Header: `Correct solution:`
     * Subtext: Correct target sentence with correct punctuation.
     * Actions: `REPORT`, feedback flags (`Too easy`, `Too difficult`), and `CONTINUE`.
  3. The challenge is appended to `recycledMistakeIndexToOriginalMistakeIndex`.
  4. **Pedagogical rule**: The lesson *cannot* complete until every failed question is answered correctly in the end-of-lesson remediation loop.

### 3.3 Hearts & Motivation Loop
* Standard accounts have a 5-heart pool (`maxHearts: 5`).
* Erring reduces hearts. Reaching 0 locks new lessons until hearts regenerate (1 heart per 5 hours) or are refilled via Practice Mode.
* Interstitial encouragement slides appear after streaks of 5 or 10 correct answers (*"5 in a row! You're on fire!"*).

### 3.4 Lesson Completion & Reflection
1. **XP Awarding**: `+10 XP` base + `+5 XP` combo bonus.
2. **Accuracy Metric**: Circular progress ring showing exact accuracy (e.g., $93\%$).
3. **Session Time**: Elapsed time display (e.g., `1:24 min`).
4. **Lesson Review Drawer (`REVIEW LESSON`)**: Expandable accordion allowing the learner to review all questions, see their inputs, and inspect explanations.

---

## 4. Guidebook Architecture & Format

Every Unit has a dedicated Guidebook (`/guidebook/{lang}/{unit}`) containing two distinct sections:

### 4.1 Key Phrases Section
* Clean table/cards of essential conversational sentences.
* Every phrase includes:
  * Native audio playback button (`ttsURL`).
  * Target script text with bold emphasis on key vocabulary.
  * Direct natural translation in the learner's base language.
  * Contextual tooltips explaining cultural or usage nuances.

### 4.2 Grammar Tips Section
* **Grammar Concepts** formatted as clean visual tables:
  * **Gender Agreement**: Masculine (`un`/`le`) vs Feminine (`une`/`la`) with paired examples and audio.
  * **Verb Paradigms**: Infinitive base form with a tabular breakdown across all grammatical persons (`I`, `you`, `he/she`, `we`, `they`).
  * **Sociolinguistic Register**: Explicit breakdown of formal vs informal pronouns (e.g., `Tu` vs `Vous`) with situational guidelines.
  * **Phonological Changes**: Rules governing elision, contraction, and vowel-clash avoidance.

---

## 5. Direct Mapping: Duolingo Blueprint $\longrightarrow$ Fêrbe Kurdish English Course

| Duolingo Element | French $\to$ English | English for Kurdish Speakers (Fêrbe) |
| :--- | :--- | :--- |
| **Unit 1 Theme** | Order at a café (*Un café, s'il vous plaît*) | Greetings & Lexical Anchors (*A pan and a cup, please*) |
| **New Word Intro** | `challenge-select` (3 picture cards) | 3 picture cards for concrete decodable nouns: Pan 🍳, Cup ☕, Tap 🚰 |
| **Scaffolding Translate** | `Un café et un thé` $\to$ `A coffee and a tea` | `A pan and a cup` $\to$ `تاوەیەک و کوپێک` (Word bank) |
| **Frame Deconstruction** | `Je voudrais...` | `I see a...` / `I want a...` (*Subject-Verb-Object*) |
| **Grammar Contrast** | `Tu` (informal) vs `Vous` (formal) | `I see` vs `He sees` (3rd-person singular marker) |
| **Acoustic Discrimination**| Oral/Nasal vowel minimal pairs | Short vowel minimal pairs: `/æ/` (pan) vs `/ɪ/` (pin) |
| **Error Queue** | End-of-session mistake repeat | Unfinished questions re-queued to guarantee 100% mastery |
| **Guidebook** | Café ordering + Gender table | Pronunciation guide (`p` vs `b`, short `a` vs `i`) + SVO vs SOV table |
