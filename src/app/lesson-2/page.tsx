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

type Lesson2Slide =
  | {
      type: "word_anchors";
      badge: string;
      titleKu: string;
      titleEn: string;
      words: {
        en: string;
        pron: string;
        ku: string;
        icon?: string;
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
      items: {
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

const LESSON_SLIDES: Lesson2Slide[] = [
  // 1. Drinks Anchors
  {
    type: "word_anchors",
    badge: "خواردنەوە سەرەکییەکان (ESSENTIAL DRINKS)",
    titleKu: "خواردنەوە باوەکان و بێژەکردنیان",
    titleEn: "Essential drinks: listen and pronounce",
    words: [
      {
        en: "Water",
        pron: "واتەر / واڕەر",
        ku: "ئاو",
        icon: "💧",
        note: "پێویستی سەرەکی ڕۆژانە",
      },
      {
        en: "Tea",
        pron: "تی",
        ku: "چای",
        icon: "🍵",
        note: "خواردنەوەی گەرمی دڵخواز",
      },
      {
        en: "Coffee",
        pron: "کۆفی",
        ku: "قاوە",
        icon: "☕",
        note: "بۆ کاتی کار و بەئاگاهاتن",
      },
      {
        en: "Milk",
        pron: "میڵک",
        ku: "شیر",
        icon: "🥛",
        note: "بەیانیان و تەندروستی",
      },
    ],
  },

  // 2. Food Staples Anchors
  {
    type: "word_anchors",
    badge: "خواردنە سەرەکییەکان (FOOD ESSENTIALS)",
    titleKu: "ناوی چەند خواردنێکی سەرەکی بە ئینگلیزی",
    titleEn: "Food vocabulary with phonetic guide",
    words: [
      {
        en: "Bread",
        pron: "برێد",
        ku: "نان",
        icon: "🍞",
        note: "بنەمای هەموو ژەمێک",
      },
      {
        en: "Apple",
        pron: "ئەپڵ",
        ku: "سێو",
        icon: "🍎",
        note: "میوەیەکی بەتام و بەسوود",
      },
      {
        en: "Rice",
        pron: "ڕایس",
        ku: "برنج / پڵاو",
        icon: "🍚",
        note: "ژەمی سەرەکی کوردی",
      },
      {
        en: "Pizza",
        pron: "پیتزا",
        ku: "پیتزا",
        icon: "🍕",
        note: "خواردنێکی خێرای دڵخواز",
      },
    ],
  },

  // 3. Politeness Magic Words
  {
    type: "word_anchors",
    badge: "وشە سیحراوییەکان (POLITENESS MAGIC WORDS)",
    titleKu: "٤ دەستەواژەی گرنگ بۆ ڕێزگرتن و قسەکردنی بەڕێزانە",
    titleEn: "Essential polite expressions in English",
    words: [
      {
        en: "Please",
        pron: "پڵیز",
        ku: "تکایە",
        icon: "✨",
        note: "کلیلی هەموو داواکارییەک",
      },
      {
        en: "Thank you",
        pron: "ثانک یو",
        ku: "سوپاس",
        icon: "🙏",
        note: "سوپاسگوزاری و پێزانین",
      },
      {
        en: "You're welcome",
        pron: "یۆر وێڵکەم",
        ku: "شایەنی نییە / سەرچاو",
        icon: "🤝",
        note: "وەڵامی سروشتی بۆ سوپاس",
      },
      {
        en: "Excuse me",
        pron: "ئێکسکیوز می",
        ku: "ببورە / لێم ببورە",
        icon: "🙋‍♂️",
        note: "بۆ داوای لێبوردن یان سەرنج",
      },
    ],
  },

  // 4. Quick Polite Order Quiz
  {
    type: "quiz_choice",
    badge: "داواکاری خێرا (QUICK POLITE ORDER)",
    titleKu: "لە کافێیەکت، چۆن بە کورتی و بەڕێزانە داوای «چای» دەکەیت؟",
    titleEn: "How to make a quick polite order for tea?",
    audioWord: "Tea, please.",
    options: [
      {
        text: "Tea, please.",
        sub: "تی، پڵیز — چای، تکایە (کورتبڕ و بەڕێز)",
        correct: true,
      },
      {
        text: "I hate tea.",
        sub: "ئای هەیت تی — ڕقم لە چایە",
        correct: false,
      },
      {
        text: "Hello teacher.",
        sub: "های تیچر — سڵاو مامۆستا",
        correct: false,
      },
    ],
    explanation: "یاسای داواکاری خێرا: ناوی خواردنەکە یان خواردنەوەکە + Please (تکایە).",
  },

  // 5. Echo Mic Challenge 1
  {
    type: "mic_speak",
    badge: "ڕاهێنانی دەنگی (SPEAKING PRACTICE)",
    titleKu: "بە دەنگ بڵێ: Water, please.",
    titleEn: "Speak clearly into the microphone:",
    targetWord: "Water, please.",
    pronKu: "واتەر، پڵیز.",
    meaningKu: "ئاو، تکایە.",
    ruleNote: "داواکردنی ئاو بەڕێزانە: واتەر پڵیز",
    explanation: "نایابە! بێژەکردنی «Water, please» زۆر ڕوون و دروست بوو.",
  },

  // 6. Analytic Breakdown: Can I have...?
  {
    type: "analytic_breakdown",
    badge: "داواکاری فەرمی (CAN I HAVE...?)",
    titleKu: "چۆنیەتی داواکردنی فەرمی و دەوڵەمەند لە چێشتخانە و فڕۆکەخانە",
    titleEn: "Forming polite requests with 'Can I have...?'",
    rows: [
      {
        en: "Can I have",
        pron: "کەن ئای هاڤ",
        ku: "دەتوانم ...م دەستکەوێت؟ / دەتوانم هەبێت؟",
      },
      {
        en: "water",
        pron: "واتەر",
        ku: "ئاو",
      },
      {
        en: "please?",
        pron: "پڵیز؟",
        ku: "تکایە؟",
      },
      {
        en: "Can I have water, please?",
        pron: "کەن ئای هاڤ واتەر، پڵیز؟",
        ku: "دەتوانم کەمێک ئاوم دەستکەوێت، تکایە؟",
        isFullPhrase: true,
      },
      {
        en: "Can I have coffee, please?",
        pron: "کەن ئای هاڤ کۆفی، پڵیز؟",
        ku: "دەتوانم قاوەیەکم دەستکەوێت، تکایە؟",
        isFullPhrase: true,
      },
    ],
  },

  // 7. Handing Over: Here you are
  {
    type: "quiz_choice",
    badge: "فەرمووکردن (HERE YOU ARE)",
    titleKu: "کاتێک شتێکت پێدەدەن و دەڵێن «Here you are» (فەرموو)، چۆن وەڵام دەدەیتەوە؟",
    titleEn: "When someone hands you an item saying 'Here you are', how do you reply?",
    audioWord: "Here you are.",
    options: [
      {
        text: "Thank you!",
        sub: "ثانک یو! — سوپاس!",
        correct: true,
      },
      {
        text: "No, I hate it.",
        sub: "نەخێر، ڕقم لێیەتی",
        correct: false,
      },
      {
        text: "Excuse me.",
        sub: "ببورە",
        correct: false,
      },
    ],
    explanation: "کاتێک کەسێک شتێکت پێدەدات و دەڵێت «Here you are» (فەرموو)، دەستبەجێ دەڵێیت «Thank you!» (سوپاس!).",
  },

  // 8. Politeness Reply: You're welcome
  {
    type: "agreement_trigger",
    badge: "وەڵامدانەوەی سوپاس (YOU'RE WELCOME)",
    titleKu: "وەڵامی سروشتی کاتێک کەسێک پێت دەڵێت «Thank you»:",
    titleEn: "How to politely reply to 'Thank you':",
    promptPhrase: "Thank you!",
    promptPron: "ثانک یو!",
    promptKu: "سوپاس!",
    replyPhrase: "You're welcome.",
    replyPron: "یۆر وێڵکەم.",
    replyKu: "شایەنی نییە / سەرچاو.",
    options: [
      {
        text: "You're welcome.",
        sub: "یۆر وێڵکەم — شایەنی نییە (سەرچاو)",
        correct: true,
      },
      {
        text: "I like bread.",
        sub: "حەزم لە نانە",
        correct: false,
      },
      {
        text: "That flower.",
        sub: "ئەو گوڵە",
        correct: false,
      },
    ],
    explanation: "«You're welcome» دەستەواژەی ستانداردە بۆ شایەنی نییە و سەرچاو لە بەرامبەر Thank you.",
  },

  // 9. Status Bank: Want vs Don't want
  {
    type: "status_bank",
    badge: "ویستن و نەویستن (WANT vs DON'T WANT)",
    titleKu: "دەربڕینی ئەوەی چیت دەوێت یان چیت ناوێت",
    titleEn: "Expressing what you want or don't want:",
    framePrefix: "I ",
    frameSuffix: " ...",
    items: [
      {
        word: "want water",
        pron: "وۆنت واتەر",
        meaning: "ئاوم دەوێت",
        note: "I want water",
      },
      {
        word: "want bread",
        pron: "وۆنت برێد",
        meaning: "نانم دەوێت",
        note: "I want bread",
      },
      {
        word: "don't want coffee",
        pron: "دۆنت وۆنت کۆفی",
        meaning: "قاوەم ناوێت",
        note: "I don't want coffee",
      },
      {
        word: "don't want tea",
        pron: "دۆنت وۆنت تی",
        meaning: "چایم ناوێت",
        note: "I don't want tea",
      },
    ],
  },

  // 10. Cafe Chat Dialogue
  {
    type: "chat_dialogue",
    badge: "دیالۆگی کافێ (CAFE DIALOGUE)",
    titleKu: "گارسۆنەکە لێت دەپرسێت: Hello! What do you want? (سڵاو! چیت دەوێت؟)",
    titleEn: "Choose the best polite response at the cafe:",
    incomingSender: "گارسۆن (Waiter)",
    incomingMessage: "Hello! What do you want?",
    incomingPron: "هێڵۆو! وەت دوو یو وۆنت؟",
    options: [
      {
        text: "Can I have tea, please?",
        sub: "کەن ئای هاڤ تی، پڵیز؟ (دەتوانم چایەکم دەستکەوێت، تکایە؟)",
        correct: true,
      },
      {
        text: "This is that car.",
        sub: "ئەمە ئەو ئۆتۆمبێلەیە",
        correct: false,
      },
      {
        text: "I am fine, thank you.",
        sub: "من باشم، سوپاس",
        correct: false,
      },
    ],
    explanation: "لە کاتی داواکردن، بەڕێزترین دەربڕین بەکارهێنانی «Can I have ..., please?» یان «Tea, please»یە.",
  },

  // 11. Offering & Answering: Do you want...?
  {
    type: "quiz_choice",
    badge: "پێشنیار و وەڵامدانەوە (OFFERING & RESPONDING)",
    titleKu: "کەسێک پێشنیارت بۆ دەکات: «Do you want coffee?» (قاوەت دەوێت؟)، چۆن بە بەڵێ و ڕێزەوە دەڵێیتەوە؟",
    titleEn: "How to politely accept an offer:",
    audioWord: "Do you want coffee?",
    options: [
      {
        text: "Yes, please.",
        sub: "یەس، پڵیز — بەڵێ، تکایە (قبوڵکردنی بەڕێزانە)",
        correct: true,
      },
      {
        text: "No, thank you.",
        sub: "نۆو، ثانک یو — نەخێر، سوپاس (ڕەتکردنەوەی بەڕێزانە)",
        correct: false,
      },
      {
        text: "Me too.",
        sub: "می توو — منیش",
        correct: false,
      },
    ],
    explanation: "بۆ قبوڵکردنی ڕێزدارانە دەڵێیت «Yes, please». ئەگەر نەشتەوێت بە ڕێزەوە دەڵێیت «No, thank you».",
  },

  // 12. Tile Assembly: Can I have coffee please
  {
    type: "tile_assembly",
    badge: "ڕێکخستنی دەستەواژە (TILE ASSEMBLY)",
    titleKu: "ڕستەی داواکردنی قاوە بەڕێزانە ڕێکبخە:",
    titleEn: "Arrange the words to say 'Can I have coffee please':",
    tiles: ["please", "Can", "have", "I", "coffee"],
    correctOrder: ["Can", "I", "have", "coffee", "please"],
    fullPron: "کەن ئای هاڤ کۆفی پڵیز",
    fullMeaning: "دەتوانم قاوەیەکم دەستکەوێت، تکایە؟",
  },

  // 13. Matching Pairs
  {
    type: "quiz_pairs",
    badge: "جوتکردنی وشەکان (VOCABULARY MATCHING)",
    titleKu: "وشە ئینگلیزییەکان لەگەڵ مانا کوردییەکەیان جوت بکە:",
    titleEn: "Match each English word with its Kurdish meaning:",
    pairs: [
      { id: 1, en: "Water", ku: "ئاو" },
      { id: 2, en: "Tea", ku: "چای" },
      { id: 3, en: "Coffee", ku: "قاوە" },
      { id: 4, en: "Bread", ku: "نان" },
      { id: 5, en: "Please", ku: "تکایە" },
    ],
  },

  // 14. Slot Filler Check
  {
    type: "quiz_slot",
    badge: "پڕکردنەوەی بۆشایی (SLOT FILLER)",
    titleKu: "بۆشاییەکە پڕبکەرەوە بۆ داواکردنی قاوە (☕):",
    titleEn: "Complete the sentence to order coffee:",
    framePre: "Can I have ",
    framePost: " please? (☕ کەن ئای هاڤ ... پڵیز؟)",
    meaningKu: "دەتوانم قاوەیەکم دەستکەوێت، تکایە؟",
    audioWord: "Can I have coffee please",
    options: [
      { text: "coffee (کۆفی — قاوە)", sub: "Coffee", correct: true },
      { text: "car (کار — ئۆتۆمبێل)", sub: "Car", correct: false },
      { text: "house (هاوس — ماڵ)", sub: "House", correct: false },
      { text: "teacher (تیچر — مامۆستا)", sub: "Teacher", correct: false },
    ],
    explanation: "«Can I have coffee please?» واتا دەتوانم قاوەیەکم دەستکەوێت، تکایە؟",
  },

  // 15. Echo Mic Challenge 2
  {
    type: "mic_speak",
    badge: "ڕاهێنانی دەنگی (SPEAKING PRACTICE)",
    titleKu: "بە دەنگ بڵێ: Can I have water please?",
    titleEn: "Speak out loud into the microphone:",
    targetWord: "Can I have water please?",
    pronKu: "کەن ئای هاڤ واتەر پڵیز؟",
    meaningKu: "دەتوانم ئاوم دەستکەوێت، تکایە؟",
    ruleNote: "ڕستەی داواکاری فەرمی: کەن ئای هاڤ واتەر پڵیز",
    explanation: "ئافەرم! داواکارییەکی فەرمی و ڕێزدارت بە شێوەیەکی ناوازە وت.",
  },
];

export default function Lesson2Page() {
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
        setIsRecording(false);
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
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    const evalRes = evaluateSpokenAnswer(targetWord, targetWord);
    setSpokenTranscript(targetWord);
    setEvalResult(evalRes);
  };

  // Pair Matching clicks
  const handlePairClickEn = (id: number, enText: string) => {
    playOptionSelectSound();
    playAudio(enText);
    if (matchedPairIds.has(id)) return;
    setSelectedPairEn(id);

    if (selectedPairKu !== null) {
      if (selectedPairKu === id) {
        setMatchedPairIds((prev) => new Set(prev).add(id));
        setSelectedPairEn(null);
        setSelectedPairKu(null);
      } else {
        setTimeout(() => {
          setSelectedPairEn(null);
          setSelectedPairKu(null);
        }, 500);
      }
    }
  };

  const handlePairClickKu = (id: number) => {
    playOptionSelectSound();
    if (matchedPairIds.has(id)) return;
    setSelectedPairKu(id);

    if (selectedPairEn !== null) {
      if (selectedPairEn === id) {
        setMatchedPairIds((prev) => new Set(prev).add(id));
        setSelectedPairEn(null);
        setSelectedPairKu(null);
      } else {
        setTimeout(() => {
          setSelectedPairEn(null);
          setSelectedPairKu(null);
        }, 500);
      }
    }
  };

  // Check if current exercise is ready to check/continue
  const canCheck = useMemo(() => {
    if (!slide) return false;
    switch (slide.type) {
      case "word_anchors":
        return listenedWords.size >= Math.min(2, slide.words.length);
      case "quiz_choice":
      case "chat_dialogue":
      case "agreement_trigger":
      case "quiz_slot":
        return selectedOption !== null;
      case "analytic_breakdown":
        return listenedWords.size >= 1;
      case "status_bank":
        return listenedWords.size >= 1;
      case "mic_speak":
        return evalResult !== null;
      case "quiz_pairs":
        return matchedPairIds.size === slide.pairs.length;
      case "tile_assembly":
        return assembledTiles.length === slide.tiles.length;
      default:
        return true;
    }
  }, [slide, listenedWords, selectedOption, evalResult, matchedPairIds, assembledTiles]);

  const handleCheck = () => {
    if (!slide) return;

    if (
      slide.type === "word_anchors" ||
      slide.type === "analytic_breakdown" ||
      slide.type === "status_bank"
    ) {
      setIsLastCorrect(true);
      setFeedbackMessage("نایابە! گوێت لە دەنگەکان گرت.");
      setShowFeedback(true);
      return;
    }

    if (slide.type === "mic_speak") {
      const isPassed = evalResult?.isMatch ?? true;
      setIsLastCorrect(isPassed);
      setFeedbackMessage(slide.explanation);
      setShowFeedback(true);
      return;
    }

    if (slide.type === "quiz_pairs") {
      setIsLastCorrect(true);
      setFeedbackMessage("هەموو وشەکان بە تەواوی جووت کران!");
      setShowFeedback(true);
      return;
    }

    if (slide.type === "tile_assembly") {
      const isCorrect =
        assembledTiles.join(" ") === slide.correctOrder.join(" ");
      setIsLastCorrect(isCorrect);
      setFeedbackMessage(
        isCorrect
          ? `نایابە! «${slide.correctOrder.join(" ")}» (${slide.fullMeaning})`
          : `ڕیزبەندی دروست: ${slide.correctOrder.join(" ")}`
      );
      setShowFeedback(true);
      return;
    }

    // Option-based types
    if (selectedOption !== null && "options" in slide) {
      const opt = slide.options[selectedOption];
      const isCorrect = opt?.correct ?? false;
      setIsLastCorrect(isCorrect);
      setFeedbackMessage(
        isCorrect
          ? "ئافەرم! وەڵامەکەت تەواو و دروستە."
          : `وەڵامی دروست: ${slide.options.find((o) => o.correct)?.text} — ${slide.explanation}`
      );
      setShowFeedback(true);
    }
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    setListenedWords(new Set());
    setSelectedPairEn(null);
    setSelectedPairKu(null);
    setMatchedPairIds(new Set());
    setAssembledTiles([]);
    setSpokenTranscript("");
    setEvalResult(null);

    setCurrentStep((prev) => prev + 1);
  };

  const handleSkip = () => {
    setIsLastCorrect(true);
    setFeedbackMessage("پەڕینەوە بۆ بەشی داهاتوو.");
    setShowFeedback(true);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setListenedWords(new Set());
    setSelectedPairEn(null);
    setSelectedPairKu(null);
    setMatchedPairIds(new Set());
    setAssembledTiles([]);
    setSpokenTranscript("");
    setEvalResult(null);
    setShowFeedback(false);
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
            پیرۆزە! وانەی دووەمت تەواو کرد
          </h1>
          <p className="mt-2 text-sm sm:text-base font-bold text-[#777777] dark:text-[#8495A0] max-w-md">
            تۆ بە سەرکەوتوویی فێربوویت چۆن داوای خواردن و خواردنەوە بکەیت بە شێوازێکی بەڕێزانە (Please / Can I have...?) و وەڵامی فەرمووکردن بدەیتەوە (Thank you / You&apos;re welcome).
          </p>

          <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-2xl border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1A262C] p-3">
              <span className="text-xl font-black text-[#58CC02]">100%</span>
              <span className="text-xs font-bold text-[#777777] dark:text-[#8495A0]">وردبینی</span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1A262C] p-3">
              <span className="text-xl font-black text-[#1CB0F6]">+85</span>
              <span className="text-xs font-bold text-[#777777] dark:text-[#8495A0]">خاڵی XP</span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1A262C] p-3">
              <span className="text-xl font-black text-[#FF9600]">🔥 ٣</span>
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
                گەڕانەوە بۆ پەڕەی پێشانگا (Return to Demo)
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
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-b-2 text-white transition-all shadow-xs text-xl",
                          isPlaying
                            ? "bg-[#1899D6] animate-pulse"
                            : isHeard
                              ? "bg-[#58CC02]"
                              : "bg-[#1CB0F6]"
                        )}
                      >
                        {w.icon ? <span>{w.icon}</span> : <Volume2 className="h-6 w-6" />}
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

        {/* 4. Status Bank: Want vs Don't Want */}
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
                گوێ لە هەموو دەستەواژەکان بگرە ({listenedWords.size} لە {slide.items.length})
              </p>
            </div>

            {/* Sentence Preview Frame */}
            <div className="rounded-3xl border-2 border-b-4 border-[#1CB0F6] bg-[#F4FBFF] dark:bg-[#1C3342] p-5 text-center shadow-xs">
              <span className="text-sm font-extrabold text-[#1899D6] dark:text-[#3BC0F8] uppercase tracking-wider">
                Sentence Pattern
              </span>
              <div
                dir="ltr"
                className="mt-2 text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white"
              >
                I{" "}
                <span className="rounded-xl border-2 border-dashed border-[#1899D6] bg-white dark:bg-[#131F24] px-3 py-0.5 text-[#1899D6] dark:text-[#3BC0F8]">
                  {playingWord ? playingWord.replace(/^I\s+/, "") : "..."}
                </span>
                {slide.frameSuffix}
              </div>
            </div>

            {/* Status Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slide.items.map((item) => {
                const fullPhrase = `I ${item.word}`;
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
                    <span className="text-xl font-black text-[#4B4B4B] dark:text-white">
                      {item.word}
                    </span>
                    <span
                      dir="rtl"
                      className="font-kurdish text-sm font-bold text-[#1899D6] dark:text-[#3BC0F8] mt-1"
                    >
                      {item.pron} ({item.meaning})
                    </span>
                    <span
                      dir="ltr"
                      className="font-sans text-xs text-[#AFAFAF] dark:text-[#8495A0] mt-1"
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
                          "flex min-h-[72px] items-center justify-center rounded-2xl border-2 border-b-4 p-3 text-center font-kurdish transition-all cursor-pointer font-black text-sm",
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

        {/* 7. Chat Dialogue View */}
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
              <p
                dir="ltr"
                className="font-sans text-xs sm:text-sm font-bold text-[#777777] dark:text-[#8495A0]"
              >
                {slide.titleEn}
              </p>
            </div>

            {/* Chat Bubble Simulation */}
            <div className="flex items-start gap-3 rounded-3xl border-2 border-b-4 border-[#E5E5E5] bg-white p-5 dark:border-[#37464F] dark:bg-[#1A262C] shadow-sm">
              <div className="shrink-0 flex items-center">
                <SquirrelMascot
                  mood="happy"
                  size={48}
                  title="Waiter Smorik"
                />
              </div>

              <div className="flex flex-col items-start gap-1">
                <span className="text-xs font-extrabold text-[#777777] dark:text-[#8495A0]">
                  {slide.incomingSender}
                </span>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-none bg-[#F4FBFF] dark:bg-[#1C3342] border border-[#1CB0F6]/30 px-4 py-2.5">
                  <span
                    dir="ltr"
                    className="text-lg font-black text-[#4B4B4B] dark:text-white"
                  >
                    {slide.incomingMessage}
                  </span>
                  <button
                    type="button"
                    onClick={() => playAudio(slide.incomingMessage)}
                    aria-label="Listen to message"
                    className="text-[#1899D6] hover:text-[#1CB0F6]"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
                <span
                  dir="rtl"
                  className="font-kurdish text-xs font-bold text-[#1899D6] dark:text-[#3BC0F8] pl-1"
                >
                  {slide.incomingPron}
                </span>
              </div>
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
                          className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]"
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

        {/* 8. Agreement / Trigger View */}
        {slide.type === "agreement_trigger" && (
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

            {/* Prompt Card */}
            <div className="rounded-3xl border-2 border-b-4 border-[#1CB0F6] bg-[#F4FBFF] dark:bg-[#1C3342] p-6 text-center shadow-xs">
              <div className="flex items-center justify-center gap-3">
                <span
                  dir="ltr"
                  className="text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white"
                >
                  {slide.promptPhrase}
                </span>
                <button
                  type="button"
                  onClick={() => playAudio(slide.promptPhrase)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1CB0F6] text-white shadow-xs"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
              <p
                dir="rtl"
                className="mt-2 font-kurdish text-sm font-bold text-[#1899D6] dark:text-[#3BC0F8]"
              >
                {slide.promptPron} ({slide.promptKu})
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
                          className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]"
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

        {/* 9. Slot Filler View */}
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
                className="flex flex-wrap items-center justify-center gap-2 font-sans text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white"
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

        {/* 10. Tile Assembly View */}
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
              slide.type === "status_bank"
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
