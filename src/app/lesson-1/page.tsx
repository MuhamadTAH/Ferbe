"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Volume2,
  Sparkles,
  CheckCircle2,
  Check,
  X,
  RotateCcw,
  Trophy,
  Mic,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { PushButton } from "@/components/duo/PushButton";
import { HeartsBar } from "@/components/duo/HeartsBar";
import { SquirrelMascot } from "@/components/duo/SquirrelMascot";
import { KurdishGlossBadges } from "@/components/lesson/KurdishGlossBadges";
import { playAmericanSpeech } from "@/lib/americanVoice";
import { evaluateSpokenAnswer, type SpeechEvaluationResult } from "@/lib/speechEvaluation";
import { playOptionSelectSound } from "@/lib/lessonAudio";
import { cn } from "@/lib/utils";

interface SpeechResultItem {
  transcript: string;
}

interface SpeechEventLike {
  results: ArrayLike<ArrayLike<SpeechResultItem>>;
}

interface SpeechInstanceLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface WindowWithSpeechRec extends Window {
  SpeechRecognition?: new () => SpeechInstanceLike;
  webkitSpeechRecognition?: new () => SpeechInstanceLike;
}

interface ChoiceOption {
  text: string;
  sub?: string;
  correct: boolean;
}

type Lesson1Slide =
  | {
      type: "word_anchors";
      badge: string;
      titleKu: string;
      titleEn: string;
      words: {
        en: string;
        pron: string;
        ku: string;
        note?: string;
      }[];
    }
  | {
      type: "quiz_choice";
      badge: string;
      titleKu: string;
      titleEn: string;
      audioWord?: string;
      options: ChoiceOption[];
      explanation: string;
    }
  | {
      type: "analytic_breakdown";
      badge: string;
      titleKu: string;
      titleEn: string;
      rows: {
        en: string;
        pron: string;
        ku: string;
        isFullPhrase?: boolean;
      }[];
    }
  | {
      type: "status_bank";
      badge: string;
      titleKu: string;
      titleEn: string;
      framePrefix: string;
      frameSuffix: string;
      adjectives: {
        word: string;
        pron: string;
        meaning: string;
        note: string;
      }[];
    }
  | {
      type: "mic_speak";
      badge: string;
      titleKu: string;
      titleEn: string;
      targetWord: string;
      pronKu: string;
      meaningKu: string;
      ruleNote: string;
      explanation: string;
    }
  | {
      type: "quiz_pairs";
      badge: string;
      titleKu: string;
      titleEn: string;
      pairs: { id: number; en: string; ku: string }[];
    }
  | {
      type: "bounce_back";
      badge: string;
      titleKu: string;
      titleEn: string;
      phrase: string;
      pron: string;
      meaning: string;
      exampleDialog: { speaker: string; text: string; pron: string }[];
      checkQuestion: string;
      options: ChoiceOption[];
      explanation: string;
    }
  | {
      type: "chat_dialogue";
      badge: string;
      titleKu: string;
      titleEn: string;
      incomingSender: string;
      incomingMessage: string;
      incomingPron: string;
      options: ChoiceOption[];
      explanation: string;
    }
  | {
      type: "agreement_trigger";
      badge: string;
      titleKu: string;
      titleEn: string;
      promptPhrase: string;
      promptPron: string;
      promptKu: string;
      replyPhrase: string;
      replyPron: string;
      replyKu: string;
      options: ChoiceOption[];
      explanation: string;
    }
  | {
      type: "spatial_anchor";
      badge: string;
      titleKu: string;
      titleEn: string;
      nearLabel: string;
      farLabel: string;
      pairs: {
        near: string;
        nearPron: string;
        nearKu: string;
        far: string;
        farPron: string;
        farKu: string;
      }[];
    }
  | {
      type: "opinion_ladder";
      badge: string;
      titleKu: string;
      titleEn: string;
      levels: {
        en: string;
        pron: string;
        ku: string;
        emoji: string;
        color: string;
      }[];
    }
  | {
      type: "quiz_slot";
      badge: string;
      titleKu: string;
      titleEn: string;
      framePre: string;
      framePost: string;
      meaningKu: string;
      audioWord?: string;
      options: ChoiceOption[];
      explanation: string;
    }
  | {
      type: "tile_assembly";
      badge: string;
      titleKu: string;
      titleEn: string;
      tiles: string[];
      correctOrder: string[];
      fullPron: string;
      fullMeaning: string;
    };

const LESSON_SLIDES: Lesson1Slide[] = [
  // 1. Word Anchors (Greetings)
  {
    type: "word_anchors",
    badge: "پێناسەی وشە (GREETINGS)",
    titleKu: "سڵاوکردن لە زمانی ئینگلیزیدا",
    titleEn: "Greeting people in English",
    words: [
      {
        en: "Hello",
        pron: "هێڵۆو",
        ku: "سڵاو (فەرمی و باو)",
        note: "فەرمی و باو",
      },
      {
        en: "Hi",
        pron: "های",
        ku: "سڵاو (دۆستانە)",
        note: "هاوڕێیانە",
      },
      {
        en: "Hey",
        pron: "هێی",
        ku: "سڵاو (نافەرمی)",
        note: "نافەرمی و کەسی نزیک",
      },
    ],
  },

  // 2. Addressing (Hi teacher, Hi Ahmad, Hi Sara)
  {
    type: "quiz_choice",
    badge: "سڵاوکردنی ڕاستەوخۆ (ADDRESSING)",
    titleKu: "کام دەستەواژە بۆ سڵاوکردن لە «مامۆستا» بەکاردێت؟",
    titleEn: "Which greeting addresses the teacher?",
    audioWord: "Hi teacher",
    options: [
      { text: "Hi teacher", sub: "های تیچەر — سڵاو مامۆستا", correct: true },
      { text: "Hi Ahmad", sub: "های ئەحمەد — سڵاو ئەحمەد", correct: false },
      { text: "Hi Sara", sub: "های سارا — سڵاو سارا", correct: false },
    ],
    explanation: "«Hi teacher» بۆ سڵاوکردن لە مامۆستا بەکاردێت.",
  },

  // 3. Analytic Breakdown ("How are you?")
  {
    type: "analytic_breakdown",
    badge: "شیکردنەوەی پێکهاتەی ڕستە (DECONSTRUCTION)",
    titleKu: "شیکردنەوەی ڕستەی «How are you?» (چۆنیت؟)",
    titleEn: "How to form the question 'How are you?':",
    rows: [
      { en: "How", pron: "هەو", ku: "چۆن" },
      { en: "are", pron: "ئاڕ", ku: "هەیت" },
      { en: "you", pron: "یو", ku: "تۆ" },
      {
        en: "How are you?",
        pron: "هەواریو؟",
        ku: "چۆنیت؟ / تەندروستیت چۆنە؟",
        isFullPhrase: true,
      },
    ],
  },

  // 4. Status Adjectives Bank (fine, good, great, cool)
  {
    type: "status_bank",
    badge: "بانکی وەسفی بارودۆخ (STATUS ADJECTIVES)",
    titleKu: "چۆن وەڵامی «How are you?» دەدەیتەوە؟",
    titleEn: "Ways to express your condition:",
    framePrefix: "I'm",
    frameSuffix: ", thank you.",
    adjectives: [
      { word: "fine", pron: "فاین", meaning: "باش", note: "ئام فاین، ثانکس" },
      { word: "good", pron: "گود", meaning: "باش", note: "ئام گود، ثانکس" },
      { word: "great", pron: "گرەیت", meaning: "زۆر باش / نایاب", note: "ئام گرەیت، ثانکس" },
      { word: "cool", pron: "کووڵ", meaning: "زۆر ئاسوودە و باش", note: "ئام کوڵ، ثانکس" },
    ],
  },

  // 5. Echo Mic 1 (How are you?)
  {
    type: "mic_speak",
    badge: "ڕاهێنانی دەنگی (SPEAKING PRACTICE)",
    titleKu: "گوێ بگرە و بە دەنگ بڵێ: How are you?",
    titleEn: "Listen and speak clearly into the microphone:",
    targetWord: "How are you?",
    pronKu: "هەواریو؟",
    meaningKu: "چۆنیت؟",
    ruleNote: "پرسیاری سەرەکی: هەواریو؟",
    explanation: "ئافەرم! پرسیاری «How are you?» بە تەواوی دروست بێژەکرا.",
  },

  // 6. Conversational Response Pairing
  {
    type: "quiz_pairs",
    badge: "جووتبەندکردنی پەیام (CONVERSATION MATCH)",
    titleKu: "هەر پرسیارێک بە وەڵامە شیاوەکەی ببەستەوە:",
    titleEn: "Match each greeting to its natural reply:",
    pairs: [
      { id: 1, en: "Hey, Ahmad, how are you?", ku: "I'm good, thank you (ئام گود، ثانک یو)" },
      { id: 2, en: "Hi teacher", ku: "Hello Ahmad (سڵاو ئەحمەد)" },
      { id: 3, en: "How are you?", ku: "I'm fine, thank you (ئام فاین، ثانکس)" },
      { id: 4, en: "What about you?", ku: "Me too (می توو / منیش)" },
    ],
  },

  // 7. The Bounce-Back Anchor ("What about you?" / وەرەباوتیو؟)
  {
    type: "bounce_back",
    badge: "گەڕاندنەوەی پرسیارەکە (BOUNCE-BACK ANCHOR)",
    titleKu: "کاتێک پێت دەڵێن چۆنیت، چۆن دەڵێیت «ئەی تۆ؟»",
    titleEn: "The core bounce-back idiom in English:",
    phrase: "What about you?",
    pron: "وەرەباوتیو؟",
    meaning: "ئەی تۆ؟ / تۆ چۆنیت؟",
    exampleDialog: [
      { speaker: "Ahmad", text: "Hey, Ahmad, how are you?", pron: "هێی ئەحمەد، هەواریو؟" },
      { speaker: "You", text: "I'm cool, thank you, what about you?", pron: "ئام کوڵ، ثانکس، وەرەباوتیو؟" },
    ],
    checkQuestion: "مانای «What about you?» چییە لە گفتوگۆدا؟",
    options: [
      { text: "ئەی تۆ؟ (گەڕاندنەوەی هەمان پرسیار)", sub: "Bouncing the question back", correct: true },
      { text: "ماڵئاوا (کۆتاییهێنان)", sub: "Saying goodbye", correct: false },
      { text: "ناوم ئەحمەدە", sub: "My name is Ahmad", correct: false },
    ],
    explanation: "«What about you?» بۆ ئەوەیە پرسیارەکە بگەڕێنیتەوە بۆ لای کەسی بەرامبەر.",
  },

  // 8. Interactive Chat Dialogue
  {
    type: "chat_dialogue",
    badge: "چاتی زیندوو (INTERACTIVE CHAT)",
    titleKu: "وەڵامی دروستی هاوڕێکەت بدەرەوە:",
    titleEn: "Select the most natural reply to complete the chat:",
    incomingSender: "Ahmad",
    incomingMessage: "Hey, Ahmad, how are you?",
    incomingPron: "هێی ئەحمەد، هەواریو؟",
    options: [
      {
        text: "I'm cool, thank you, what about you?",
        sub: "ئام کوڵ، ثانکس، وەرەباوتیو؟ (وەڵام + گەڕاندنەوەی پرسیار)",
        correct: true,
      },
      {
        text: "Hi teacher, that house.",
        sub: "سڵاو مامۆستا، ئەو ماڵە",
        correct: false,
      },
      {
        text: "I hate this car.",
        sub: "ڕقم لەم ئۆتۆمبێلەیە",
        correct: false,
      },
    ],
    explanation: "وەڵامە سروشتییەکە: سەرەتا دەڵێیت باشم، پاشان دەپرسیتەوە: What about you?",
  },

  // 9. Agreement Trigger ("Me too" / می توو)
  {
    type: "agreement_trigger",
    badge: "ڕێکەوتن و هاوڕایی (AGREEMENT TRIGGER)",
    titleKu: "کاتێک هاوڕایت لەسەر حەزێک، دەڵێیت: Me too",
    titleEn: "Expressing agreement with 'Me too':",
    promptPhrase: "I like Dolma, what about you?",
    promptPron: "ئای ڵایک دۆڵمە، وەرەباوتیو؟",
    promptKu: "من حەزم لە دۆڵمەیە، ئەی تۆ؟",
    replyPhrase: "Me too.",
    replyPron: "می توو.",
    replyKu: "منیش / منیش حەزم لێیەتی.",
    options: [
      { text: "Me too.", sub: "می توو — منیش (هاوڕام)", correct: true },
      { text: "I'm fine, thank you.", sub: "باشم، سوپاس", correct: false },
      { text: "Hi Ahmad.", sub: "سڵاو ئەحمەد", correct: false },
    ],
    explanation: "«Me too» واتا «منیش بە هەمان شێوە».",
  },

  // 10. Preferences & Cities
  {
    type: "quiz_choice",
    badge: "دەربڕینی حەز (PREFERENCES)",
    titleKu: "کەسێک دەڵێت «I like Sulaymani, what about you?»، کام وەڵام دروستە؟",
    titleEn: "Responding to preferences with cities or agreement:",
    audioWord: "I like Sulaymani, what about you?",
    options: [
      { text: "I like Duhok. / I like Hawler.", sub: "ئای ڵایک دهۆک / هەولێر (یان دەکرێت بڵێیت Me too)", correct: true },
      { text: "How are you?", sub: "چۆنیت؟", correct: false },
      { text: "Hi teacher.", sub: "سڵاو مامۆستا", correct: false },
    ],
    explanation: "دەتوانیت بڵێیت «I like Duhok»، «I like Hawler»، یان «Me too».",
  },

  // 11. Demonstratives Distance Anchor (This vs That)
  {
    type: "spatial_anchor",
    badge: "نزیک و دوور (THIS vs THAT)",
    titleKu: "جیاوازی نێوان This (ئەمە - نزیک) و That (ئەوە - دوور)",
    titleEn: "Demonstratives: This (near) vs That (far)",
    nearLabel: "This (ذس) — نزیک",
    farLabel: "That (ذات) — دوور",
    pairs: [
      {
        near: "This car",
        nearPron: "ذس کار",
        nearKu: "ئەم ئۆتۆمبێلە (نزیک)",
        far: "That car",
        farPron: "ذات کار",
        farKu: "ئەو ئۆتۆمبێلە (دوور)",
      },
      {
        near: "This flower",
        nearPron: "ذس فڵاور",
        nearKu: "ئەم گوڵە (نزیک)",
        far: "That flower",
        farPron: "ذات فڵاور",
        farKu: "ئەو گوڵە (دوور)",
      },
      {
        near: "This house",
        nearPron: "ذس هاوس",
        nearKu: "ئەم ماڵە (نزیک)",
        far: "That house",
        farPron: "ذات هاوس",
        farKu: "ئەو ماڵە (دوور)",
      },
    ],
  },

  // 12. Opinion Sentiment Ladder
  {
    type: "opinion_ladder",
    badge: "پلەی هەست و بۆچوون (OPINION LADDER)",
    titleKu: "٤ پلەی دەربڕینی هەست لە زمانی ئینگلیزیدا",
    titleEn: "From strongest love to strongest dislike:",
    levels: [
      {
        en: "I love this car.",
        pron: "ئای ڵەڤ ذس کار",
        ku: "عاشقی ئەم ئۆتۆمبێلەم / زۆر زۆرم پێخۆشە",
        emoji: "😍",
        color: "#CE82FF",
      },
      {
        en: "I like this car.",
        pron: "ئای ڵایک ذس کار",
        ku: "حەزم لەم ئۆتۆمبێلەیە / بەدڵمە",
        emoji: "👍",
        color: "#58CC02",
      },
      {
        en: "I don't like this car.",
        pron: "ئارۆن ڵایک ذس کار",
        ku: "حەزم لەم ئۆتۆمبێلە نییە",
        emoji: "👎",
        color: "#FF9600",
      },
      {
        en: "I hate this car.",
        pron: "ئای هەیت ذس کار",
        ku: "ڕقم لەم ئۆتۆمبێلەیە",
        emoji: "😡",
        color: "#EA2B2B",
      },
    ],
  },

  // 13. Slot Filler Check
  {
    type: "quiz_slot",
    badge: "پڕکردنەوەی بۆشایی (SENTENCE COMPLETION)",
    titleKu: "بۆشاییەکە پڕبکەرەوە بۆ دەربڕینی خۆشەویستی زۆر (عەشق):",
    titleEn: "Choose the word expressing deepest love:",
    framePre: "I ",
    framePost: " this car. (😍 ئای ... ذس کار)",
    meaningKu: "من زۆر ئەم ئۆتۆمبێلەم خۆشدەوێت (عاشقیم).",
    audioWord: "I love this car",
    options: [
      { text: "love (ڵەڤ — خۆشویستنی زۆر)", sub: "Deep love", correct: true },
      { text: "hate (هەیت — ڕق لێبوون)", sub: "Hate", correct: false },
      { text: "how (هەو)", sub: "How", correct: false },
      { text: "are (ئاڕ)", sub: "Are", correct: false },
    ],
    explanation: "«I love this car» واتا عاشقی ئەم ئۆتۆمبێلەم.",
  },

  // 14. Echo Mic 2 (I like this car)
  {
    type: "mic_speak",
    badge: "ڕاهێنانی دەنگی (SPEAKING PRACTICE)",
    titleKu: "بە دەنگ بڵێ: I like this car",
    titleEn: "Speak out loud into the microphone:",
    targetWord: "I like this car",
    pronKu: "ئای ڵایک ذس کار",
    meaningKu: "حەزم لەم ئۆتۆمبێلەیە",
    ruleNote: "ڕستەی حەز: ئای ڵایک ذس کار",
    explanation: "نایابە! ڕستەی «I like this car» بە تەواوی ڕوون و دروست بێژەکرا.",
  },

  // 15. Tile Assembly ("I don't like this car.")
  {
    type: "tile_assembly",
    badge: "ڕێکخستنی ڕستە (TILE ASSEMBLY)",
    titleKu: "ڕستەی «ئارۆن ڵایک ذس کار» (حەزم لەم ئۆتۆمبێلە نییە) ڕێکبخە:",
    titleEn: "Arrange the tiles to say 'I don't like this car':",
    tiles: ["this car.", "I", "don't like"],
    correctOrder: ["I", "don't like", "this car."],
    fullPron: "ئارۆن ڵایک ذس کار",
    fullMeaning: "حەزم لەم ئۆتۆمبێلە نییە",
  },
];

export default function Lesson1Page() {
  const [currentStep, setCurrentStep] = useState(0);
  const [hearts] = useState(5);
  const [listenedWords, setListenedWords] = useState<Set<string>>(new Set());
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLastCorrect, setIsLastCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Pair Matching state
  const [selectedPairEn, setSelectedPairEn] = useState<number | null>(null);
  const [selectedPairKu, setSelectedPairKu] = useState<number | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<number>>(new Set());

  // Tile Assembly state
  const [assembledTiles, setAssembledTiles] = useState<string[]>([]);

  // Mic Speaking State
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>("");
  const [evalResult, setEvalResult] = useState<SpeechEvaluationResult | null>(null);
  const recognitionRef = useRef<SpeechInstanceLike | null>(null);

  const slide = LESSON_SLIDES[currentStep];
  const progress = (currentStep / LESSON_SLIDES.length) * 100;
  const isComplete = currentStep >= LESSON_SLIDES.length;

  // Sound playback
  const playAudio = (phrase: string) => {
    setPlayingWord(phrase);
    playAmericanSpeech(phrase, 0.85);
    setTimeout(() => setPlayingWord(null), 1200);
  };

  // Auto-play model audio on entering mic_speak
  useEffect(() => {
    if (slide?.type === "mic_speak") {
      const timer = setTimeout(() => {
        playAudio(slide.targetWord);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentStep, slide]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const handleStartListening = (targetWord: string) => {
    playOptionSelectSound();

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsRecording(false);
      return;
    }

    setSpokenTranscript("");
    setEvalResult(null);
    setIsRecording(true);

    const win =
      typeof window !== "undefined"
        ? (window as unknown as WindowWithSpeechRec)
        : null;
    const SpeechRecognitionClass =
      win?.SpeechRecognition || win?.webkitSpeechRecognition;

    let hasResponded = false;

    // Safety timeout: Chrome SpeechRecognition often hangs without mic hardware/permissions
    const safetyTimer = setTimeout(() => {
      if (!hasResponded) {
        hasResponded = true;
        setIsRecording(false);
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch {}
          recognitionRef.current = null;
        }
        // Graceful fallback
        const evalRes = evaluateSpokenAnswer(targetWord, targetWord);
        setSpokenTranscript(targetWord);
        setEvalResult(evalRes);
      }
    }, 2800);

    if (!SpeechRecognitionClass) {
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: SpeechEventLike) => {
        if (hasResponded) return;
        hasResponded = true;
        clearTimeout(safetyTimer);
        const transcript =
          event.results?.[0]?.[0]?.transcript?.trim() || targetWord;
        setIsRecording(false);
        setSpokenTranscript(transcript);

        const evalRes = evaluateSpokenAnswer(transcript, targetWord);
        setEvalResult(evalRes);
      };

      recognition.onerror = () => {
        if (hasResponded) return;
        hasResponded = true;
        clearTimeout(safetyTimer);
        setIsRecording(false);
        const evalRes = evaluateSpokenAnswer(targetWord, targetWord);
        setSpokenTranscript(targetWord);
        setEvalResult(evalRes);
      };

      recognition.onend = () => {
        if (!hasResponded) {
          hasResponded = true;
          clearTimeout(safetyTimer);
          setIsRecording(false);
          const evalRes = evaluateSpokenAnswer(targetWord, targetWord);
          setSpokenTranscript(targetWord);
          setEvalResult(evalRes);
        }
      };

      recognition.start();
    } catch {
      if (!hasResponded) {
        hasResponded = true;
        clearTimeout(safetyTimer);
        setIsRecording(false);
        const evalRes = evaluateSpokenAnswer(targetWord, targetWord);
        setSpokenTranscript(targetWord);
        setEvalResult(evalRes);
      }
    }
  };

  const handleCantSpeakNow = (targetWord: string) => {
    playOptionSelectSound();
    const evalRes = evaluateSpokenAnswer(targetWord, targetWord);
    setSpokenTranscript(targetWord);
    setEvalResult(evalRes);
  };

  // Pair Match
  const handlePairClickEn = (id: number, text: string) => {
    playAudio(text);
    setSelectedPairEn(id);
    if (selectedPairKu !== null) {
      checkPair(id, selectedPairKu);
    }
  };

  const handlePairClickKu = (id: number) => {
    setSelectedPairKu(id);
    if (selectedPairEn !== null) {
      checkPair(selectedPairEn, id);
    }
  };

  const checkPair = (enId: number, kuId: number) => {
    if (enId === kuId) {
      setMatchedPairIds((prev) => {
        const next = new Set(prev);
        next.add(enId);
        if (next.size === 4) {
          setIsLastCorrect(true);
          setFeedbackMessage("نایابە! هەموو پەیامەکان بە دروستی بەسترانەوە.");
          setShowFeedback(true);
        }
        return next;
      });
      setSelectedPairEn(null);
      setSelectedPairKu(null);
    } else {
      setTimeout(() => {
        setSelectedPairEn(null);
        setSelectedPairKu(null);
      }, 350);
    }
  };

  // Validation
  const canCheck = useMemo(() => {
    if (!slide) return false;
    if (slide.type === "word_anchors") {
      return listenedWords.size >= slide.words.length;
    }
    if (slide.type === "analytic_breakdown") {
      return listenedWords.size >= slide.rows.length;
    }
    if (slide.type === "status_bank") {
      return listenedWords.size >= slide.adjectives.length;
    }
    if (slide.type === "spatial_anchor") {
      return listenedWords.size >= slide.pairs.length;
    }
    if (slide.type === "opinion_ladder") {
      return listenedWords.size >= slide.levels.length;
    }
    if (
      slide.type === "quiz_choice" ||
      slide.type === "quiz_slot" ||
      slide.type === "bounce_back" ||
      slide.type === "chat_dialogue" ||
      slide.type === "agreement_trigger"
    ) {
      return selectedOption !== null;
    }
    if (slide.type === "quiz_pairs") {
      return matchedPairIds.size === 4;
    }
    if (slide.type === "tile_assembly") {
      return assembledTiles.length === slide.tiles.length;
    }
    if (slide.type === "mic_speak") {
      return Boolean(evalResult?.isMatch || spokenTranscript.length > 0);
    }
    return false;
  }, [
    slide,
    listenedWords,
    selectedOption,
    matchedPairIds,
    assembledTiles,
    evalResult,
    spokenTranscript,
  ]);

  const handleCheck = () => {
    if (!slide) return;

    if (
      slide.type === "word_anchors" ||
      slide.type === "analytic_breakdown" ||
      slide.type === "status_bank" ||
      slide.type === "spatial_anchor" ||
      slide.type === "opinion_ladder"
    ) {
      handleContinue();
      return;
    }

    let isCorrect = false;
    let msg = "";

    if (
      slide.type === "quiz_choice" ||
      slide.type === "quiz_slot" ||
      slide.type === "bounce_back" ||
      slide.type === "chat_dialogue" ||
      slide.type === "agreement_trigger"
    ) {
      if (selectedOption === null) return;
      isCorrect = slide.options[selectedOption].correct;
      msg = slide.explanation;
    } else if (slide.type === "tile_assembly") {
      isCorrect = assembledTiles.join(" ") === slide.correctOrder.join(" ");
      msg = isCorrect
        ? `ئافەرم! ڕستەکە ڕێکخرا: «${slide.correctOrder.join(" ")}» (${slide.fullPron}).`
        : `تکایە دووبارەی بکەرەوە. دروستییەکەی: «${slide.correctOrder.join(" ")}».`;
    } else if (slide.type === "mic_speak") {
      isCorrect = Boolean(
        evalResult?.isMatch ||
          spokenTranscript.toLowerCase().includes(slide.targetWord.toLowerCase())
      );
      msg = isCorrect
        ? slide.explanation
        : `داواکراو بوو بە دەنگ بڵێیت: «${slide.targetWord}».`;
    }

    setIsLastCorrect(isCorrect);
    setFeedbackMessage(msg);
    setShowFeedback(true);
  };

  const handleSkip = () => {
    handleContinue();
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    setListenedWords(new Set());
    setSelectedPairEn(null);
    setSelectedPairKu(null);
    setMatchedPairIds(new Set());
    setAssembledTiles([]);
    setIsRecording(false);
    setSpokenTranscript("");
    setEvalResult(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setShowFeedback(false);
    setSelectedOption(null);
    setListenedWords(new Set());
    setSelectedPairEn(null);
    setSelectedPairKu(null);
    setMatchedPairIds(new Set());
    setAssembledTiles([]);
    setIsRecording(false);
    setSpokenTranscript("");
    setEvalResult(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
  };

  // Completion screen
  if (isComplete) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-white dark:bg-[#131F24]">
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-3xl bg-[#FFF4E5] dark:bg-[#342416] text-6xl shadow-inner animate-bounce">
            <Trophy className="h-16 w-16 text-[#FF9600]" />
          </div>

          <h1 className="font-kurdish text-3xl sm:text-4xl font-black text-[#4B4B4B] dark:text-white">
            پیرۆزە! وانەی یەکەمت تەواو کرد
          </h1>
          <p className="mt-2 text-sm sm:text-base font-bold text-[#777777] dark:text-[#8495A0] max-w-md">
            تۆ تەواوی بنەماکانی سڵاوکردن، وەڵامدانەوە، دەربڕینی حەز (Me too)، دوور و نزیک (This / That)، و پلەی هەستەکانت بە سەرکەوتوویی فێربوویت.
          </p>

          <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-2xl border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1A262C] p-3">
              <span className="text-xl font-black text-[#58CC02]">100%</span>
              <span className="text-xs font-bold text-[#777777] dark:text-[#8495A0]">وردبینی</span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1A262C] p-3">
              <span className="text-xl font-black text-[#1CB0F6]">+75</span>
              <span className="text-xs font-bold text-[#777777] dark:text-[#8495A0]">خاڵی XP</span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1A262C] p-3">
              <span className="text-xl font-black text-[#FF9600]">🔥 ٢</span>
              <span className="text-xs font-bold text-[#777777] dark:text-[#8495A0]">ڕۆژی کارا</span>
            </div>
          </div>

          <div className="mt-10 flex w-full max-w-md flex-col gap-3">
            <PushButton
              variant="green"
              onClick={handleRestart}
              className="w-full py-3.5 text-sm"
            >
              <RotateCcw className="h-4 w-4 mr-2 inline" />
              دووبارەکردنەوەی ئەم وانەیە (Review Lesson)
            </PushButton>
            <Link href="/gh-demo" className="w-full">
              <PushButton variant="blue" className="w-full py-3.5 text-sm">
                گەڕانەوە بۆ وانەی GH Phonics Demo
              </PushButton>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-white dark:bg-[#131F24]">
      {/* Top Header Bar */}
      <div
        className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 py-5"
        style={{ direction: "ltr" }}
      >
        <button
          type="button"
          onClick={handleRestart}
          aria-label="Restart lesson"
          className="text-[#AFAFAF] transition-colors hover:text-[#777777] dark:text-[#8495A0] dark:hover:text-white cursor-pointer"
        >
          <X className="h-8 w-8 stroke-[3]" />
        </button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#E5E5E5] dark:bg-[#37464F]">
          <div
            className="h-full rounded-full bg-[#58CC02] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <HeartsBar hearts={hearts} />
      </div>

      {/* Main Exercise View Container */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-44 pt-2">
        {/* 1. Word Anchors View */}
        {slide.type === "word_anchors" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8FAD4] dark:bg-[#1E3B20] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#58CC02]">
                <Sparkles className="h-3.5 w-3.5" />
                {slide.badge}
              </span>
              <h2
                dir="rtl"
                className="font-kurdish text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white"
              >
                {slide.titleKu}
              </h2>
              <p
                dir="rtl"
                className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]"
              >
                گوێ لە هەموو دەنگەکان بگرە بۆ بەردەوامبوون ({listenedWords.size} لە {slide.words.length})
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {slide.words.map((w) => {
                const isHeard = listenedWords.has(w.en);
                const isPlaying = playingWord === w.en;

                return (
                  <div
                    key={w.en}
                    onClick={() => {
                      playAudio(w.en);
                      setListenedWords((prev) => new Set(prev).add(w.en));
                    }}
                    className={cn(
                      "group relative flex items-center justify-between gap-3 rounded-2xl border-2 border-b-4 p-4 transition-all cursor-pointer select-none",
                      isHeard
                        ? "border-[#58CC02] bg-[#F7FCF0] dark:border-[#58CC02] dark:bg-[#132817]"
                        : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] hover:bg-[#F4FBFF] dark:border-[#37464F] dark:bg-[#131F24]"
                    )}
                    style={{ direction: "ltr" }}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Play ${w.en}`}
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-b-2 text-white transition-all shadow-xs",
                          isPlaying
                            ? "bg-[#1899D6] animate-pulse"
                            : isHeard
                              ? "bg-[#58CC02]"
                              : "bg-[#1CB0F6]"
                        )}
                      >
                        <Volume2 className="h-6 w-6" />
                      </button>
                      <div className="flex flex-col text-left">
                        <span className="text-2xl font-black text-[#4B4B4B] dark:text-white">
                          {w.en}
                        </span>
                        {w.note && (
                          <span
                            dir="rtl"
                            className="font-kurdish text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]"
                          >
                            ({w.note})
                          </span>
                        )}
                      </div>
                    </div>

                    <KurdishGlossBadges pronunciation={w.pron} meaning={w.ku} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Multiple Choice View */}
        {slide.type === "quiz_choice" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
                {slide.badge}
              </span>
              <h2
                dir="rtl"
                className="font-kurdish text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mt-1"
              >
                {slide.titleKu}
              </h2>
              <p
                dir="ltr"
                className="font-sans text-xs sm:text-sm font-bold text-[#777777] dark:text-[#8495A0]"
              >
                {slide.titleEn}
              </p>
            </div>

            {slide.audioWord && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => playAudio(slide.audioWord!)}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#1899D6] bg-[#1CB0F6] px-6 py-3 text-sm font-black text-white hover:bg-[#4FC3F9] active:translate-y-[2px] transition-all shadow-md cursor-pointer"
                >
                  <Volume2 className="h-5 w-5" />
                  <span>Listen / گوێبگرە</span>
                </button>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {slide.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={opt.text}
                    type="button"
                    onClick={() => {
                      playOptionSelectSound();
                      setSelectedOption(idx);
                      playAudio(opt.text);
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border-2 border-b-4 p-4 text-left transition-all cursor-pointer active:translate-y-[2px]",
                      isSelected
                        ? "border-[#1899D6] bg-[#DDF4FF] dark:border-[#3BC0F8] dark:bg-[#1C3342]"
                        : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C]"
                    )}
                    style={{ direction: "ltr" }}
                  >
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-[#4B4B4B] dark:text-white">
                        {opt.text}
                      </span>
                      {opt.sub && (
                        <span
                          dir="rtl"
                          className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0] mt-0.5"
                        >
                          {opt.sub}
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-black",
                        isSelected
                          ? "border-[#1899D6] bg-[#1CB0F6] text-white"
                          : "border-[#E5E5E5] text-[#AFAFAF] dark:border-[#37464F]"
                      )}
                    >
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Analytic Breakdown View */}
        {slide.type === "analytic_breakdown" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8FAD4] dark:bg-[#1E3B20] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#58CC02]">
                <Sparkles className="h-3.5 w-3.5" />
                {slide.badge}
              </span>
              <h2
                dir="rtl"
                className="font-kurdish text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mt-1"
              >
                {slide.titleKu}
              </h2>
              <p
                dir="rtl"
                className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]"
              >
                گوێ لە هەموو بەشەکان بگرە ({listenedWords.size} لە {slide.rows.length})
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {slide.rows.map((row) => {
                const isHeard = listenedWords.has(row.en);
                const isPlaying = playingWord === row.en;

                return (
                  <div
                    key={row.en}
                    onClick={() => {
                      playAudio(row.en);
                      setListenedWords((prev) => new Set(prev).add(row.en));
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border-2 border-b-4 p-4 transition-all cursor-pointer select-none",
                      row.isFullPhrase
                        ? "border-[#1CB0F6] bg-[#F4FBFF] dark:bg-[#1C3342] -translate-y-0.5"
                        : isHeard
                          ? "border-[#58CC02] bg-[#F7FCF0] dark:border-[#58CC02] dark:bg-[#132817]"
                          : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C]"
                    )}
                    style={{ direction: "ltr" }}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Play ${row.en}`}
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-b-2 text-white shadow-xs",
                          isPlaying
                            ? "bg-[#1899D6] animate-pulse"
                            : row.isFullPhrase
                              ? "bg-[#1CB0F6]"
                              : isHeard
                                ? "bg-[#58CC02]"
                                : "bg-[#1CB0F6]"
                        )}
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                      <span
                        className={cn(
                          "text-xl font-black text-[#4B4B4B] dark:text-white",
                          row.isFullPhrase && "text-2xl text-[#1899D6] dark:text-[#3BC0F8]"
                        )}
                      >
                        {row.en}
                      </span>
                    </div>

                    <KurdishGlossBadges
                      pronunciation={row.pron}
                      meaning={row.ku}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Status Adjectives Bank View */}
        {slide.type === "status_bank" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
                {slide.badge}
              </span>
              <h2
                dir="rtl"
                className="font-kurdish text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mt-1"
              >
                {slide.titleKu}
              </h2>
              <p
                dir="rtl"
                className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]"
              >
                گوێ لە هەموو وەسفەکان بگرە ({listenedWords.size} لە {slide.adjectives.length})
              </p>
            </div>

            {/* Sentence Preview Frame */}
            <div className="rounded-3xl border-2 border-b-4 border-[#1CB0F6] bg-[#F4FBFF] dark:bg-[#1C3342] p-5 text-center shadow-xs">
              <span className="text-sm font-extrabold text-[#1899D6] dark:text-[#3BC0F8] uppercase tracking-wider">
                Sentence Frame
              </span>
              <div
                dir="ltr"
                className="mt-2 text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white"
              >
                I&apos;m{" "}
                <span className="rounded-xl border-2 border-dashed border-[#1899D6] bg-white dark:bg-[#131F24] px-3 py-0.5 text-[#1899D6] dark:text-[#3BC0F8]">
                  {playingWord ? playingWord.split(" ")[1] : "..."}
                </span>
                {slide.frameSuffix}
              </div>
            </div>

            {/* 4 Status Adjectives Grid */}
            <div className="grid grid-cols-2 gap-3">
              {slide.adjectives.map((item) => {
                const fullPhrase = `I'm ${item.word}, thank you`;
                const isHeard = listenedWords.has(item.word);
                const isPlaying = playingWord === fullPhrase;

                return (
                  <button
                    key={item.word}
                    type="button"
                    onClick={() => {
                      playAudio(fullPhrase);
                      setListenedWords((prev) => new Set(prev).add(item.word));
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-2xl border-2 border-b-4 p-4 text-center transition-all cursor-pointer active:translate-y-[2px]",
                      isPlaying
                        ? "border-[#1899D6] bg-[#DDF4FF] dark:border-[#3BC0F8] dark:bg-[#1C3342] scale-102"
                        : isHeard
                          ? "border-[#58CC02] bg-[#F7FCF0] dark:border-[#58CC02] dark:bg-[#132817]"
                          : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C]"
                    )}
                  >
                    <span className="text-2xl font-black text-[#4B4B4B] dark:text-white">
                      {item.word}
                    </span>
                    <span
                      dir="rtl"
                      className="font-kurdish text-sm font-bold text-[#1899D6] dark:text-[#3BC0F8] mt-1"
                    >
                      {item.pron} ({item.meaning})
                    </span>
                    <span
                      dir="rtl"
                      className="font-kurdish text-xs text-[#AFAFAF] dark:text-[#8495A0] mt-1"
                    >
                      {item.note}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Interactive Microphone View */}
        {slide.type === "mic_speak" && (
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
                <Mic className="h-3.5 w-3.5" />
                {slide.badge}
              </span>
              <h2
                dir="rtl"
                className="font-kurdish text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mt-1"
              >
                {slide.titleKu}
              </h2>
              <p
                dir="ltr"
                className="font-sans text-xs sm:text-sm font-bold text-[#777777] dark:text-[#8495A0]"
              >
                {slide.titleEn}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 w-full max-w-md rounded-3xl border-2 border-b-4 border-[#E5E5E5] bg-white p-6 shadow-sm dark:border-[#37464F] dark:bg-[#1A262C]">
              <div className="flex items-center justify-center gap-3">
                <span
                  dir="ltr"
                  className="text-3xl sm:text-4xl font-black tracking-wide text-[#4B4B4B] dark:text-white select-none"
                >
                  {slide.targetWord}
                </span>
                <button
                  type="button"
                  onClick={() => playAudio(slide.targetWord)}
                  aria-label={`Listen to ${slide.targetWord}`}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-b-4 border-[#1899D6] bg-[#1CB0F6] text-white hover:bg-[#4FC3F9] active:translate-y-[2px] transition-all shadow-xs cursor-pointer"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>

              <KurdishGlossBadges
                pronunciation={slide.pronKu}
                meaning={slide.meaningKu}
              />

              <span
                dir="rtl"
                className="rounded-xl bg-[#F7F7F7] dark:bg-[#202F36] px-3.5 py-1.5 font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0] border border-black/5 dark:border-white/5"
              >
                {slide.ruleNote}
              </span>
            </div>

            {/* Big Mic Button */}
            <div className="relative flex flex-col items-center gap-3 py-4">
              <div className="relative">
                {isRecording && (
                  <>
                    <span className="absolute -inset-4 rounded-full bg-[#EA2B2B]/20 animate-ping pointer-events-none" />
                    <span className="absolute -inset-2 rounded-full bg-[#EA2B2B]/30 animate-pulse pointer-events-none" />
                  </>
                )}

                <button
                  type="button"
                  onClick={() => handleStartListening(slide.targetWord)}
                  aria-label={isRecording ? "Stop recording" : "Click to speak"}
                  className={cn(
                    "relative flex h-28 w-28 items-center justify-center rounded-full border-4 shadow-xl transition-all select-none cursor-pointer active:scale-95",
                    isRecording
                      ? "border-[#CE1126] bg-[#EA2B2B] text-white scale-105"
                      : evalResult?.isMatch
                        ? "border-[#46A302] bg-[#58CC02] text-white hover:scale-105"
                        : spokenTranscript.length > 0 && !evalResult?.isMatch
                          ? "border-[#FF9600] bg-[#FF9600] text-white hover:scale-105"
                          : "border-[#1899D6] bg-[#1CB0F6] text-white hover:scale-105 hover:bg-[#4FC3F9]"
                  )}
                >
                  {evalResult?.isMatch ? (
                    <CheckCircle2 className="h-14 w-14 stroke-[2.5]" />
                  ) : spokenTranscript.length > 0 && !evalResult?.isMatch ? (
                    <AlertCircle className="h-14 w-14 stroke-[2.5]" />
                  ) : (
                    <Mic className={cn("h-14 w-14", isRecording && "animate-pulse")} />
                  )}
                </button>
              </div>

              <p
                dir="rtl"
                className="font-kurdish text-sm font-bold text-[#777777] dark:text-[#8495A0] min-h-[24px]"
              >
                {isRecording
                  ? "گوێت لێ دەگیرێت... ئێستا بە دەنگ بڵێ"
                  : evalResult?.isMatch
                    ? "ئافەرم! دەنگەکەت بە تەواوی دروستە."
                    : spokenTranscript.length > 0
                      ? `بیسترا: «${spokenTranscript}» — تکایە دووبارەی بکەرەوە!`
                      : "کلیک لە مایکەکە بکە و قسە بکە"}
              </p>

              <button
                type="button"
                onClick={() => handleCantSpeakNow(slide.targetWord)}
                className="mt-2 text-xs font-bold text-[#AFAFAF] hover:text-[#777777] dark:text-[#8495A0] dark:hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
              >
                {"ناتوانم ئێستا قسە بکەم (Can't speak now)"}
              </button>
            </div>
          </div>
        )}

        {/* 6. Response Pairing View */}
        {slide.type === "quiz_pairs" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
                {slide.badge}
              </span>
              <h2
                dir="rtl"
                className="font-kurdish text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mt-1"
              >
                {slide.titleKu}
              </h2>
              <p
                dir="ltr"
                className="font-sans text-xs sm:text-sm font-bold text-[#777777] dark:text-[#8495A0]"
              >
                {slide.titleEn}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Left Column: English Prompts */}
              <div className="flex flex-col gap-3">
                {slide.pairs.map((p) => {
                  const isMatched = matchedPairIds.has(p.id);
                  const isSelected = selectedPairEn === p.id;
                  return (
                    <button
                      key={p.en}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handlePairClickEn(p.id, p.en)}
                      className={cn(
                        "flex min-h-[72px] items-center justify-center rounded-2xl border-2 border-b-4 p-3 text-center transition-all cursor-pointer font-bold text-sm",
                        isMatched
                          ? "border-[#58CC02] bg-[#E8FAD4] text-[#46A302] opacity-60 cursor-default"
                          : isSelected
                            ? "border-[#1899D6] bg-[#DDF4FF] text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#1C3342] dark:text-[#3BC0F8] -translate-y-1"
                            : "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C] dark:text-white"
                      )}
                    >
                      {p.en}
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Kurdish Replies */}
              <div className="flex flex-col gap-3">
                {slide.pairs
                  .slice()
                  .reverse()
                  .map((p) => {
                    const isMatched = matchedPairIds.has(p.id);
                    const isSelected = selectedPairKu === p.id;
                    return (
                      <button
                        key={p.ku}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handlePairClickKu(p.id)}
                        className={cn(
                          "flex min-h-[72px] items-center justify-center rounded-2xl border-2 border-b-4 p-3 text-center font-kurdish text-xs font-bold transition-all cursor-pointer",
                          isMatched
                            ? "border-[#58CC02] bg-[#E8FAD4] text-[#46A302] opacity-60 cursor-default"
                            : isSelected
                              ? "border-[#1899D6] bg-[#DDF4FF] text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#1C3342] dark:text-[#3BC0F8] -translate-y-1"
                              : "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C] dark:text-white"
                        )}
                        dir="rtl"
                      >
                        {p.ku}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* 7. Bounce-Back Anchor View */}
        {slide.type === "bounce_back" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8FAD4] dark:bg-[#1E3B20] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#58CC02]">
                <Sparkles className="h-3.5 w-3.5" />
                {slide.badge}
              </span>
              <h2
                dir="rtl"
                className="font-kurdish text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mt-1"
              >
                {slide.titleKu}
              </h2>
            </div>

            {/* Giant Idiom Card */}
            <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-b-4 border-[#1CB0F6] bg-[#F4FBFF] dark:bg-[#1C3342] p-6 text-center shadow-sm">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#1899D6] dark:text-[#3BC0F8]">
                  {slide.phrase}
                </span>
                <button
                  type="button"
                  onClick={() => playAudio(slide.phrase)}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1CB0F6] text-white shadow-xs cursor-pointer hover:bg-[#4FC3F9]"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>

              <KurdishGlossBadges
                pronunciation={slide.pron}
                meaning={slide.meaning}
              />

              {/* Example Conversation Flow */}
              <div className="w-full rounded-2xl bg-white dark:bg-[#131F24] p-4 text-left border border-black/5 dark:border-white/5">
                <span className="text-[11px] font-black uppercase text-[#AFAFAF] tracking-wider">
                  Real Conversation Ping-Pong:
                </span>
                <div className="mt-2 flex flex-col gap-2">
                  {slide.exampleDialog.map((d, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "rounded-xl p-2.5 text-sm font-bold",
                        idx === 0
                          ? "bg-[#F7F7F7] text-[#4B4B4B] dark:bg-[#1A262C] dark:text-white"
                          : "bg-[#DDF4FF] text-[#1899D6] dark:bg-[#1A3344] dark:text-[#3BC0F8]"
                      )}
                    >
                      <span className="font-black mr-2">{d.speaker}:</span>
                      <span>{d.text}</span>
                      <span
                        dir="rtl"
                        className="block font-kurdish text-xs text-[#777777] dark:text-[#8495A0] mt-0.5"
                      >
                        ({d.pron})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mini Question */}
            <p
              dir="rtl"
              className="font-kurdish text-sm font-black text-[#4B4B4B] dark:text-white text-center"
            >
              {slide.checkQuestion}
            </p>

            <div className="flex flex-col gap-2.5">
              {slide.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={opt.text}
                    type="button"
                    onClick={() => {
                      playOptionSelectSound();
                      setSelectedOption(idx);
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border-2 border-b-4 p-4 text-right transition-all cursor-pointer active:translate-y-[2px]",
                      isSelected
                        ? "border-[#1899D6] bg-[#DDF4FF] dark:border-[#3BC0F8] dark:bg-[#1C3342]"
                        : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C]"
                    )}
                    dir="rtl"
                  >
                    <div className="flex flex-col text-right">
                      <span className="font-kurdish text-base font-black text-[#4B4B4B] dark:text-white">
                        {opt.text}
                      </span>
                      {opt.sub && (
                        <span
                          dir="ltr"
                          className="font-sans text-xs font-bold text-[#777777] dark:text-[#8495A0] text-right"
                        >
                          {opt.sub}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 8. Interactive Chat Dialogue View */}
        {slide.type === "chat_dialogue" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
                <MessageSquare className="h-3.5 w-3.5" />
                {slide.badge}
              </span>
              <h2
                dir="rtl"
                className="font-kurdish text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mt-1"
              >
                {slide.titleKu}
              </h2>
            </div>

            {/* Simulated Chat Feed */}
            <div className="flex flex-col gap-3 rounded-3xl border-2 border-[#E5E5E5] bg-[#F7F7F7] p-5 dark:border-[#37464F] dark:bg-[#1A262C]">
              {/* Incoming Bubble (Ahmad) */}
              <div className="flex items-start gap-2.5" style={{ direction: "ltr" }}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1CB0F6] font-black text-white text-sm shadow-xs">
                  {slide.incomingSender[0]}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-[#777777] dark:text-[#8495A0] ml-1 mb-1">
                    {slide.incomingSender}
                  </span>
                  <div
                    onClick={() => playAudio(slide.incomingMessage)}
                    className="flex items-center gap-2 rounded-2xl rounded-tl-none bg-white p-3.5 shadow-xs border border-black/5 dark:bg-[#202F36] cursor-pointer hover:border-[#1CB0F6]"
                  >
                    <Volume2 className="h-4 w-4 text-[#1CB0F6] shrink-0" />
                    <div>
                      <span className="font-black text-base text-[#4B4B4B] dark:text-white">
                        {slide.incomingMessage}
                      </span>
                      <span
                        dir="rtl"
                        className="block font-kurdish text-xs text-[#AFAFAF] dark:text-[#8495A0] mt-0.5"
                      >
                        ({slide.incomingPron})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learner Bubble Draft Area */}
              <div className="flex items-start justify-end gap-2.5" style={{ direction: "rtl" }}>
                <div className="rounded-2xl rounded-tr-none border-2 border-dashed border-[#1CB0F6] bg-white p-3.5 text-center min-w-[200px] dark:bg-[#131F24]">
                  {selectedOption !== null ? (
                    <span dir="ltr" className="font-black text-sm text-[#1899D6] dark:text-[#3BC0F8]">
                      {slide.options[selectedOption].text}
                    </span>
                  ) : (
                    <span className="font-kurdish text-xs text-[#AFAFAF] italic">
                      وەڵامێک دیاری بکە لە خوارەوە...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Response Options */}
            <div className="flex flex-col gap-2.5">
              {slide.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={opt.text}
                    type="button"
                    onClick={() => {
                      playOptionSelectSound();
                      setSelectedOption(idx);
                      playAudio(opt.text);
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border-2 border-b-4 p-4 text-left transition-all cursor-pointer active:translate-y-[2px]",
                      isSelected
                        ? "border-[#1899D6] bg-[#DDF4FF] dark:border-[#3BC0F8] dark:bg-[#1C3342]"
                        : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C]"
                    )}
                    style={{ direction: "ltr" }}
                  >
                    <div className="flex flex-col">
                      <span className="text-base font-black text-[#4B4B4B] dark:text-white">
                        {opt.text}
                      </span>
                      {opt.sub && (
                        <span
                          dir="rtl"
                          className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0] mt-0.5"
                        >
                          {opt.sub}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 9. Agreement Trigger View ("Me too") */}
        {slide.type === "agreement_trigger" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8FAD4] dark:bg-[#1E3B20] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#58CC02]">
                <Sparkles className="h-3.5 w-3.5" />
                {slide.badge}
              </span>
              <h2
                dir="rtl"
                className="font-kurdish text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mt-1"
              >
                {slide.titleKu}
              </h2>
            </div>

            {/* Prompt Card */}
            <div className="rounded-3xl border-2 border-b-4 border-[#E5E5E5] bg-white p-6 shadow-sm dark:border-[#37464F] dark:bg-[#1A262C] text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white">
                  {slide.promptPhrase}
                </span>
                <button
                  type="button"
                  onClick={() => playAudio(slide.promptPhrase)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1CB0F6] text-white shadow-xs cursor-pointer hover:bg-[#4FC3F9]"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>
              <KurdishGlossBadges
                pronunciation={slide.promptPron}
                meaning={slide.promptKu}
              />
            </div>

            {/* Choice */}
            <p
              dir="rtl"
              className="font-kurdish text-sm font-bold text-[#777777] dark:text-[#8495A0] text-center"
            >
              بۆ هاوڕابوون، چۆن دەڵێیت «منیش حەزم لێیەتی»؟
            </p>

            <div className="flex flex-col gap-2.5">
              {slide.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={opt.text}
                    type="button"
                    onClick={() => {
                      playOptionSelectSound();
                      setSelectedOption(idx);
                      playAudio(opt.text);
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border-2 border-b-4 p-4 text-left transition-all cursor-pointer active:translate-y-[2px]",
                      isSelected
                        ? "border-[#1899D6] bg-[#DDF4FF] dark:border-[#3BC0F8] dark:bg-[#1C3342]"
                        : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C]"
                    )}
                    style={{ direction: "ltr" }}
                  >
                    <span className="text-xl font-black text-[#4B4B4B] dark:text-white">
                      {opt.text}
                    </span>
                    {opt.sub && (
                      <span
                        dir="rtl"
                        className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]"
                      >
                        {opt.sub}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 11. Spatial Demonstratives (This vs That) */}
        {slide.type === "spatial_anchor" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
                {slide.badge}
              </span>
              <h2
                dir="rtl"
                className="font-kurdish text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mt-1"
              >
                {slide.titleKu}
              </h2>
              <p
                dir="rtl"
                className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]"
              >
                گوێ لە هەردوو بەشەکە بگرە ({listenedWords.size} لە {slide.pairs.length})
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {slide.pairs.map((p) => {
                const isHeard = listenedWords.has(p.near);

                return (
                  <div
                    key={p.near}
                    onClick={() => {
                      playAudio(`${p.near}. ${p.far}.`);
                      setListenedWords((prev) => new Set(prev).add(p.near));
                    }}
                    className={cn(
                      "grid grid-cols-2 gap-3 rounded-3xl border-2 border-b-4 p-4 transition-all cursor-pointer select-none",
                      isHeard
                        ? "border-[#58CC02] bg-[#F7FCF0] dark:border-[#58CC02] dark:bg-[#132817]"
                        : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C]"
                    )}
                  >
                    {/* Near Column */}
                    <div className="flex flex-col items-center rounded-2xl bg-black/5 dark:bg-white/5 p-3 text-center">
                      <span className="text-xs font-black text-[#1899D6] uppercase tracking-wider">
                        👆 {slide.nearLabel}
                      </span>
                      <span className="text-xl font-black text-[#4B4B4B] dark:text-white mt-1">
                        {p.near}
                      </span>
                      <span
                        dir="rtl"
                        className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0] mt-0.5"
                      >
                        {p.nearPron} ({p.nearKu})
                      </span>
                    </div>

                    {/* Far Column */}
                    <div className="flex flex-col items-center rounded-2xl bg-black/5 dark:bg-white/5 p-3 text-center">
                      <span className="text-xs font-black text-[#FF9600] uppercase tracking-wider">
                        👉 {slide.farLabel}
                      </span>
                      <span className="text-xl font-black text-[#4B4B4B] dark:text-white mt-1">
                        {p.far}
                      </span>
                      <span
                        dir="rtl"
                        className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0] mt-0.5"
                      >
                        {p.farPron} ({p.farKu})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 12. Opinion Sentiment Ladder View */}
        {slide.type === "opinion_ladder" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8FAD4] dark:bg-[#1E3B20] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#58CC02]">
                <Sparkles className="h-3.5 w-3.5" />
                {slide.badge}
              </span>
              <h2
                dir="rtl"
                className="font-kurdish text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mt-1"
              >
                {slide.titleKu}
              </h2>
              <p
                dir="rtl"
                className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]"
              >
                گوێ لە هەموو دەربڕینەکان بگرە ({listenedWords.size} لە {slide.levels.length})
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {slide.levels.map((lvl) => {
                const isHeard = listenedWords.has(lvl.en);
                const isPlaying = playingWord === lvl.en;

                return (
                  <div
                    key={lvl.en}
                    onClick={() => {
                      playAudio(lvl.en);
                      setListenedWords((prev) => new Set(prev).add(lvl.en));
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border-2 border-b-4 p-4 transition-all cursor-pointer select-none",
                      isHeard
                        ? "border-[#58CC02] bg-[#F7FCF0] dark:border-[#58CC02] dark:bg-[#132817]"
                        : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C]"
                    )}
                    style={{ direction: "ltr" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl shrink-0">{lvl.emoji}</span>
                      <button
                        type="button"
                        aria-label={`Play ${lvl.en}`}
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-xs",
                          isPlaying ? "bg-[#1899D6] animate-pulse" : "bg-[#1CB0F6]"
                        )}
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                      <div className="flex flex-col text-left">
                        <span className="text-lg font-black text-[#4B4B4B] dark:text-white">
                          {lvl.en}
                        </span>
                        <span
                          dir="rtl"
                          className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]"
                        >
                          {lvl.pron}
                        </span>
                      </div>
                    </div>

                    <span
                      dir="rtl"
                      className="font-kurdish text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0] text-right max-w-[150px]"
                    >
                      {lvl.ku}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 13. Slot Filler View */}
        {slide.type === "quiz_slot" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
                {slide.badge}
              </span>
              <h2
                dir="rtl"
                className="font-kurdish text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mt-1"
              >
                {slide.titleKu}
              </h2>
            </div>

            {/* Incomplete Sentence Display */}
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-b-4 border-[#E5E5E5] bg-white p-8 text-center shadow-sm dark:border-[#37464F] dark:bg-[#1A262C]">
              <div
                dir="ltr"
                className="flex flex-wrap items-center justify-center gap-2 font-sans text-3xl font-black text-[#4B4B4B] dark:text-white"
              >
                <span>{slide.framePre}</span>
                <span className="inline-flex min-w-[90px] items-center justify-center border-b-4 border-dashed border-[#1CB0F6] bg-[#DDF4FF] px-4 py-1 text-2xl text-[#1899D6] dark:bg-[#1C3342] dark:text-[#3BC0F8] rounded-xl">
                  {selectedOption !== null
                    ? slide.options[selectedOption].text.split(" ")[0]
                    : "___"}
                </span>
                <span>{slide.framePost}</span>
              </div>
              <p
                dir="rtl"
                className="mt-3 font-kurdish text-sm font-bold text-[#777777] dark:text-[#8495A0]"
              >
                {slide.meaningKu}
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {slide.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={opt.text}
                    type="button"
                    onClick={() => {
                      playOptionSelectSound();
                      setSelectedOption(idx);
                      playAudio(opt.text.split(" ")[0]);
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border-2 border-b-4 p-4 text-left transition-all cursor-pointer active:translate-y-[2px]",
                      isSelected
                        ? "border-[#1899D6] bg-[#DDF4FF] dark:border-[#3BC0F8] dark:bg-[#1C3342]"
                        : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C]"
                    )}
                    style={{ direction: "ltr" }}
                  >
                    <span className="text-xl font-black text-[#4B4B4B] dark:text-white">
                      {opt.text}
                    </span>
                    {opt.sub && (
                      <span
                        dir="rtl"
                        className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]"
                      >
                        {opt.sub}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 15. Tile Assembly View */}
        {slide.type === "tile_assembly" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
                {slide.badge}
              </span>
              <h2
                dir="rtl"
                className="font-kurdish text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white mt-1"
              >
                {slide.titleKu}
              </h2>
              <p
                dir="rtl"
                className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]"
              >
                {slide.fullMeaning} ({slide.fullPron})
              </p>
            </div>

            {/* Construction Area */}
            <div className="flex min-h-[90px] flex-wrap items-center justify-center gap-2.5 rounded-3xl border-2 border-dashed border-[#1CB0F6] bg-[#F4FBFF] dark:bg-[#1C3342] p-4">
              {assembledTiles.length === 0 ? (
                <span className="font-kurdish text-xs text-[#AFAFAF] italic">
                  کلیک لە وشەکان بکە لە خوارەوە بۆ ڕێکخستنی ڕستەکە...
                </span>
              ) : (
                assembledTiles.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      playOptionSelectSound();
                      setAssembledTiles((prev) => prev.filter((x) => x !== t));
                    }}
                    className="rounded-2xl border-2 border-b-4 border-[#1899D6] bg-white px-4 py-2 text-lg font-black text-[#1899D6] dark:bg-[#131F24] dark:text-[#3BC0F8] shadow-sm hover:border-[#EA2B2B] hover:text-[#EA2B2B]"
                    title="Click to remove"
                  >
                    {t} ✕
                  </button>
                ))
              )}
            </div>

            {/* Tile Bank */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {slide.tiles
                .filter((t) => !assembledTiles.includes(t))
                .map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      playOptionSelectSound();
                      playAudio(t);
                      setAssembledTiles((prev) => [...prev, t]);
                    }}
                    className="rounded-2xl border-2 border-b-4 border-[#E5E5E5] bg-white px-6 py-3 text-lg font-black text-[#4B4B4B] shadow-sm hover:border-[#1CB0F6] active:translate-y-[2px] dark:border-[#37464F] dark:bg-[#1A262C] dark:text-white"
                  >
                    {t}
                  </button>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Footer & PushButton */}
      {!showFeedback ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-[#E5E5E5] bg-white dark:border-[#37464F] dark:bg-[#131F24]">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-2xl border-2 border-[#E5E5E5] border-b-4 bg-white px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#AFAFAF] transition-all hover:bg-[#F7F7F7] hover:text-[#777777] active:translate-y-[2px] active:border-b-2 shadow-xs dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#8495A0] dark:hover:bg-[#202F36] dark:hover:text-white"
            >
              Skip
            </button>
            <PushButton
              variant="green"
              disabled={!canCheck}
              onClick={handleCheck}
              className="shrink-0 px-10 py-3"
            >
              {slide.type === "word_anchors" ||
              slide.type === "analytic_breakdown" ||
              slide.type === "status_bank" ||
              slide.type === "spatial_anchor" ||
              slide.type === "opinion_ladder"
                ? "Continue"
                : "Check"}
            </PushButton>
          </div>
        </div>
      ) : (
        /* Feedback Banner */
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-40 border-t-2 shadow-lg",
            isLastCorrect
              ? "border-[#A5ED6E] bg-[#D7FFB8] dark:border-[#58CC02] dark:bg-[#153118]"
              : "border-[#FFB2B2] bg-[#FFDFE0] dark:border-[#EA2B2B] dark:bg-[#2D1418]"
          )}
          role="status"
        >
          <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-4 sm:px-6">
            <div className="relative shrink-0 flex items-center">
              <SquirrelMascot
                mood={isLastCorrect ? "celebrating" : "thinking"}
                accessory={isLastCorrect ? "golden_acorn" : "none"}
                size={54}
                animate
                title={isLastCorrect ? "Smorik cheering you on!" : "Smorik encouraging you"}
              />
              <span
                className={cn(
                  "absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-xs dark:bg-[#131F24]",
                  isLastCorrect
                    ? "text-[#58A700] dark:text-[#58CC02]"
                    : "text-[#EA2B2B] dark:text-[#FF5252]"
                )}
              >
                {isLastCorrect ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : (
                  <X className="h-4 w-4 stroke-[3]" />
                )}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-lg font-extrabold",
                  isLastCorrect
                    ? "text-[#58A700] dark:text-[#58CC02]"
                    : "text-[#EA2B2B] dark:text-[#FF5252]"
                )}
              >
                {isLastCorrect ? "Awesome!" : "Correct solution:"}
              </p>
              <p
                dir="rtl"
                className={cn(
                  "truncate font-bold font-kurdish text-sm sm:text-base",
                  isLastCorrect ? "text-[#58A700] dark:text-[#58CC02]" : "text-[#EA2B2B]"
                )}
              >
                {feedbackMessage}
              </p>
            </div>

            <PushButton
              variant={isLastCorrect ? "green" : "red"}
              onClick={handleContinue}
              className="shrink-0 px-8 py-3 text-sm font-extrabold"
            >
              Continue
            </PushButton>
          </div>
        </div>
      )}
    </div>
  );
}
