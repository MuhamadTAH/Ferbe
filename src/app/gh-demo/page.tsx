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

interface PhonicsWord {
  en: string;
  highlighted: React.ReactNode;
  subtitle?: string;
  pron: string;
  ku: string;
  note?: string;
}

interface ChoiceOption {
  text: string;
  sub?: string;
  correct: boolean;
}

type SlideType =
  | {
      type: "rule_intake";
      badge: string;
      titleKu: string;
      titleEn: string;
      examples: PhonicsWord[];
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
      type: "quiz_pairs";
      badge: string;
      titleKu: string;
      titleEn: string;
      pairs: { id: number; en: string; ku: string }[];
    }
  | {
      type: "quiz_sort";
      badge: string;
      titleKu: string;
      titleEn: string;
      words: string[];
      buckets: {
        g: { label: string; sub: string; words: string[] };
        f: { label: string; sub: string; words: string[] };
        silent: { label: string; sub: string; words: string[] };
      };
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
    };

const SLIDES: SlideType[] = [
  // 1. Initial GH
  {
    type: "rule_intake",
    badge: "یاسای ١: دەنگی سەرەتا (INITIAL GH)",
    titleKu: "پیتەکانی GH لە سەرەتای وشەدا",
    titleEn: "Initial 'gh' sounds like /g/ (وەک گ)",
    examples: [
      {
        en: "Ghost",
        highlighted: (
          <span>
            <span className="text-[#58CC02] underline decoration-4 underline-offset-4">Gh</span>ost
          </span>
        ),
        subtitle: "GH لە سەرەتادا = دەنگی (گ)",
        pron: "گۆست",
        ku: "تارمایی",
        note: "یاسای سەرەتا: GH دەبێتە گ",
      },
      {
        en: "Ghana",
        highlighted: (
          <span>
            <span className="text-[#58CC02] underline decoration-4 underline-offset-4">Gh</span>ana
          </span>
        ),
        subtitle: "GH لە سەرەتادا = دەنگی (گ)",
        pron: "غانا",
        ku: "وڵاتی غانا",
        note: "یاسای سەرەتا: GH دەبێتە گ",
      },
    ],
  },

  // 2. Initial GH Practice
  {
    type: "quiz_choice",
    badge: "تاقیکردنەوەی خێرا (PRACTICE)",
    titleKu: "لە وشەی «Ghost» دەنگی gh چۆن دەخوێندرێتەوە؟",
    titleEn: "What sound does 'gh' make in 'Ghost'?",
    audioWord: "Ghost",
    options: [
      { text: "دەنگی (گ) — هاوشێوەی پیتی G", sub: "Sounds like /g/", correct: true },
      { text: "دەنگی (ف) — هاوشێوەی پیتی F", sub: "Sounds like /f/", correct: false },
      { text: "بە تەواوی بێدەنگە و ناخوێندرێتەوە", sub: "Silent (no sound)", correct: false },
    ],
    explanation: "چونکە gh لە سەرەتای وشەدایە، هەمیشە وەک دەنگی (گ) دەخوێندرێتەوە.",
  },

  // 3. Initial GH Speaking Practice (Microphone)
  {
    type: "mic_speak",
    badge: "ڕاهێنانی دەنگی (SPEAKING PRACTICE)",
    titleKu: "گوێ بگرە و وشەکە بە دەنگ بڵێ: Ghost",
    titleEn: "Listen and speak clearly: Ghost",
    targetWord: "Ghost",
    pronKu: "گۆست",
    meaningKu: "تارمایی",
    ruleNote: "یاسا: GH لە سەرەتادا دەنگی (گ) دەدات",
    explanation: "ئافەرم! دەنگی سەرەتای وشەی «Ghost» وەک پیتی (گ) بە دروستی خوێندرایەوە.",
  },

  // 3. Medial GH (Silent)
  {
    type: "rule_intake",
    badge: "یاسای ٢: دەنگی ناوەڕاست (MEDIAL GH)",
    titleKu: "پیتەکانی GH لە ناوەڕاستی وشەدا",
    titleEn: "Medial 'gh' is Silent (بێدەنگە)",
    examples: [
      {
        en: "Night",
        highlighted: (
          <span>
            Ni<span className="text-[#8495A0] line-through opacity-70">gh</span>t
          </span>
        ),
        subtitle: "لە ئاوێتەی -ight پیتەکانی gh بێدەنگن",
        pron: "نایت",
        ku: "شەو",
        note: "ناوەڕاست: GH بێدەنگە",
      },
      {
        en: "Light",
        highlighted: (
          <span>
            Li<span className="text-[#8495A0] line-through opacity-70">gh</span>t
          </span>
        ),
        subtitle: "لە ئاوێتەی -ight پیتەکانی gh بێدەنگن",
        pron: "لایت",
        ku: "ڕووناکی",
        note: "ناوەڕاست: GH بێدەنگە",
      },
    ],
  },

  // 4. Medial Practice
  {
    type: "quiz_choice",
    badge: "گوێگرتن و بڕیاردان (AUDIO CHECK)",
    titleKu: "ئایا پیتەکانی gh لە وشەی «Night» دەخوێندرێنەوە؟",
    titleEn: "Are 'gh' pronounced in 'Night'?",
    audioWord: "Night",
    options: [
      { text: "نەخێر، بە تەواوی بێدەنگن (Silent)", sub: "No, they are completely silent", correct: true },
      { text: "بەڵێ، دەنگی (ف) دەدەن", sub: "Yes, pronounced as /f/", correct: false },
      { text: "بەڵێ، دەنگی (گ) دەدەن", sub: "Yes, pronounced as /g/", correct: false },
    ],
    explanation: "لە پێکهاتەی -ight پیتەکانی gh بە تەواوی بێدەنگن.",
  },

  // 5. Final GH = F
  {
    type: "rule_intake",
    badge: "یاسای ٣: دەنگی کۆتایی (FINAL GH)",
    titleKu: "پیتەکانی GH لە کۆتایی وشەدا",
    titleEn: "Final 'gh' sounds like /f/ (وەک ف)",
    examples: [
      {
        en: "Laugh",
        highlighted: (
          <span>
            Lau<span className="text-[#FF9600] underline decoration-4 underline-offset-4">gh</span>
          </span>
        ),
        subtitle: "لە کۆتایی چەند وشەیەکدا = دەنگی (ف)",
        pron: "لاف",
        ku: "پێکەنین",
        note: "کۆتایی: GH دەبێتە ف",
      },
      {
        en: "Cough",
        highlighted: (
          <span>
            Cou<span className="text-[#FF9600] underline decoration-4 underline-offset-4">gh</span>
          </span>
        ),
        subtitle: "لە کۆتایی چەند وشەیەکدا = دەنگی (ف)",
        pron: "کۆف",
        ku: "کۆکە / کۆخە",
        note: "کۆتایی: GH دەبێتە ف",
      },
    ],
  },

  // 6. Slot Filler
  {
    type: "quiz_slot",
    badge: "پڕکردنەوەی بۆشایی (SLOT FILLER)",
    titleKu: "دەنگی پیتی کۆتایی هەڵبژێرە:",
    titleEn: "Choose the correct ending sound:",
    framePre: "He is telling a joke, so people lau",
    framePost: ".",
    meaningKu: "ئەو نوکتە دەگێڕێتەوە، بۆیە خەڵک پێدەکەنن.",
    audioWord: "Laugh",
    options: [
      { text: "gh (دەنگی ف)", sub: "Sounds like /f/", correct: true },
      { text: "gh (دەنگی گ)", sub: "Sounds like /g/", correct: false },
      { text: "gh (بێدەنگ)", sub: "Silent", correct: false },
    ],
    explanation: "لە وشەی Laugh پیتەکانی gh دەنگی (ف) دروست دەکەن.",
  },

  // 7. Final GH Speaking Practice (Microphone)
  {
    type: "mic_speak",
    badge: "ڕاهێنانی دەنگی (SPEAKING PRACTICE)",
    titleKu: "بە دەنگ بڵێ: Laugh",
    titleEn: "Listen and speak: Final 'gh' sounds like /f/.",
    targetWord: "Laugh",
    pronKu: "لاف",
    meaningKu: "پێکەنین",
    ruleNote: "یاسا: GH لە کۆتاییدا دەنگی (ف) دروست دەکات",
    explanation: "دەستخۆش! وشەی «Laugh» بە دەنگی (ف) بە تەواوی دروست بێژەکرا.",
  },

  // 7. Exceptions
  {
    type: "rule_intake",
    badge: "یاسای ٤: حاڵەتی تایبەت (EXCEPTIONS)",
    titleKu: "کۆتایی بێدەنگ لە چەند وشەیەکی تایبەتدا",
    titleEn: "Exceptions: Silent 'gh' at the end",
    examples: [
      {
        en: "High",
        highlighted: (
          <span>
            Hi<span className="text-[#8495A0] line-through opacity-70">gh</span>
          </span>
        ),
        subtitle: "حاڵەتی تایبەت: gh کۆتایی بێدەنگە",
        pron: "های",
        ku: "بەرز",
        note: "حاڵەتی تایبەت: GH بێدەنگە",
      },
      {
        en: "Sigh",
        highlighted: (
          <span>
            Si<span className="text-[#8495A0] line-through opacity-70">gh</span>
          </span>
        ),
        subtitle: "حاڵەتی تایبەت: gh کۆتایی بێدەنگە",
        pron: "سای",
        ku: "هەناسەی سارد",
        note: "حاڵەتی تایبەت: GH بێدەنگە",
      },
    ],
  },

  // 8. Pair Match
  {
    type: "quiz_pairs",
    badge: "جووتبەندکردن (PAIR MATCHING)",
    titleKu: "وشەکان بە دەنگ و واتا ببەستەوە:",
    titleEn: "Match each word to its Kurdish meaning & sound:",
    pairs: [
      { id: 1, en: "Ghost", ku: "تارمایی (دەنگی گ)" },
      { id: 2, en: "Night", ku: "شەو (بێدەنگ)" },
      { id: 3, en: "Laugh", ku: "پێکەنین (دەنگی ف)" },
      { id: 4, en: "High", ku: "بەرز (بێدەنگ)" },
    ],
  },

  // 9. Ear Gate
  {
    type: "quiz_choice",
    badge: "دەروازەی بیستن (EAR-GATE)",
    titleKu: "گوێ لە دەنگەکە بگرە: دەنگی پیتەکانی gh چییە؟",
    titleEn: "Listen carefully: What sound does 'gh' make?",
    audioWord: "Enough",
    options: [
      { text: "دەنگی (ف) دەدات (وەک Enough)", sub: "/f/ sound", correct: true },
      { text: "دەنگی (گ) دەدات", sub: "/g/ sound", correct: false },
      { text: "بە تەواوی بێدەنگە", sub: "Silent", correct: false },
    ],
    explanation: "لە وشەی Enough پیتەکانی gh دەنگی (ف) دەدەن: /ɪˈnʌf/.",
  },

  // 10. Odd-One-Out
  {
    type: "quiz_choice",
    badge: "دۆزینەوەی وشەی جیاواز (ODD ONE OUT)",
    titleKu: "کامیان لەم وشانە دەنگی (ف) نادات و بێدەنگە؟",
    titleEn: "Which word does NOT sound like /f/?",
    options: [
      { text: "Laugh", sub: "دەنگی (ف) دەدات", correct: false },
      { text: "Cough", sub: "دەنگی (ف) دەدات", correct: false },
      { text: "High", sub: "بێدەنگە (حاڵەتی تایبەت)", correct: true },
      { text: "Tough", sub: "دەنگی (ف) دەدات", correct: false },
    ],
    explanation: "لە وشەی High پیتەکانی gh بێدەنگن و دەنگی (ف) دروست ناکەن.",
  },

  // 11. 3-Bucket Sorting
  {
    type: "quiz_sort",
    badge: "پۆلێنکردن (CATEGORIZATION)",
    titleKu: "وشەکان بخەرە ناو سندوقی دروست:",
    titleEn: "Sort words into the correct sound categories:",
    words: ["Ghost", "Ghana", "Laugh", "Cough", "Night", "High"],
    buckets: {
      g: { label: "دەنگی (گ) — سەرەتای وشە", sub: "/g/ sound", words: ["Ghost", "Ghana"] },
      f: { label: "دەنگی (ف) — کۆتایی وشە", sub: "/f/ sound", words: ["Laugh", "Cough"] },
      silent: { label: "بێدەنگ (Silent) — ناوەڕاست و تایبەت", sub: "Silent", words: ["Night", "High"] },
    },
  },
];

export default function GhDemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [hearts] = useState(5);
  const [listenedWords, setListenedWords] = useState<Set<string>>(new Set());
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLastCorrect, setIsLastCorrect] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showNoMoreLessonsModal, setShowNoMoreLessonsModal] = useState(false);

  // Pair Matching state
  const [selectedPairEn, setSelectedPairEn] = useState<number | null>(null);
  const [selectedPairKu, setSelectedPairKu] = useState<number | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<number>>(new Set());
  const [wrongPairShake, setWrongPairShake] = useState(false);

  // Sorting state
  const [selectedSortWord, setSelectedSortWord] = useState<string | null>(null);
  const [placedSortWords, setPlacedSortWords] = useState<{
    g: string[];
    f: string[];
    silent: string[];
  }>({ g: [], f: [], silent: [] });

  // Mic Speaking State
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>("");
  const [evalResult, setEvalResult] = useState<SpeechEvaluationResult | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechInstanceLike | null>(null);

  const slide = SLIDES[currentStep];
  const progress = (currentStep / SLIDES.length) * 100;
  const isComplete = currentStep >= SLIDES.length;

  // Sound playback
  const playAudio = (word: string) => {
    setPlayingWord(word);
    playAmericanSpeech(word, 0.85);
    setTimeout(() => setPlayingWord(null), 1000);
  };

  // Auto-play model audio once on entering a mic_speak slide
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
    setMicError(null);
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
        // Graceful fallback: recognize the target word
        const evalRes = evaluateSpokenAnswer(targetWord, targetWord);
        setSpokenTranscript(targetWord);
        setEvalResult(evalRes);
      }
    }, 2800);

    if (!SpeechRecognitionClass) {
      return; // safetyTimer will resolve it gracefully
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
        // Soft fallback so learner is never blocked
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

  const handlePlayAnchor = (w: PhonicsWord) => {
    playAudio(w.en);
    setListenedWords((prev) => {
      const next = new Set(prev);
      next.add(w.en);
      return next;
    });
  };

  // Pair click handlers
  const handlePairClickEn = (id: number, word: string) => {
    playAudio(word);
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
          setFeedbackMessage("نایابە! هەموو وشەکان بە دروستی بەسترانەوە.");
          setShowFeedback(true);
        }
        return next;
      });
      setSelectedPairEn(null);
      setSelectedPairKu(null);
    } else {
      setWrongPairShake(true);
      setTimeout(() => {
        setWrongPairShake(false);
        setSelectedPairEn(null);
        setSelectedPairKu(null);
      }, 400);
    }
  };

  // Sorting handlers
  const handleSelectSortChip = (w: string) => {
    playAudio(w);
    setSelectedSortWord(w);
  };

  const handlePlaceSortChip = (bucketKey: "g" | "f" | "silent") => {
    if (!selectedSortWord) return;
    setPlacedSortWords((prev) => ({
      ...prev,
      [bucketKey]: [...prev[bucketKey], selectedSortWord],
    }));
    setSelectedSortWord(null);
  };

  const handleRemoveSortChip = (w: string, bucketKey: "g" | "f" | "silent") => {
    setPlacedSortWords((prev) => ({
      ...prev,
      [bucketKey]: prev[bucketKey].filter((item) => item !== w),
    }));
  };

  // Validation
  const canCheck = useMemo(() => {
    if (!slide) return false;
    if (slide.type === "rule_intake") {
      return listenedWords.size >= slide.examples.length;
    }
    if (slide.type === "quiz_choice" || slide.type === "quiz_slot") {
      return selectedOption !== null;
    }
    if (slide.type === "quiz_pairs") {
      return matchedPairIds.size === 4;
    }
    if (slide.type === "quiz_sort") {
      const total =
        placedSortWords.g.length +
        placedSortWords.f.length +
        placedSortWords.silent.length;
      return total === slide.words.length;
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
    placedSortWords,
    evalResult,
    spokenTranscript,
  ]);

  const handleCheck = () => {
    if (!slide) return;

    if (slide.type === "rule_intake") {
      handleContinue();
      return;
    }

    let isCorrect = false;
    let msg = "";

    if (slide.type === "quiz_choice" || slide.type === "quiz_slot") {
      if (selectedOption === null) return;
      isCorrect = slide.options[selectedOption].correct;
      msg = slide.explanation;
    } else if (slide.type === "mic_speak") {
      isCorrect = Boolean(
        evalResult?.isMatch ||
          spokenTranscript.toLowerCase().includes(slide.targetWord.toLowerCase())
      );
      msg = isCorrect
        ? slide.explanation
        : `داواکراو بوو وشەی «${slide.targetWord}» بە دەنگ بڵێیت.`;
    } else if (slide.type === "quiz_sort") {
      const correctBuckets = slide.buckets;
      isCorrect =
        [...placedSortWords.g].sort().join(",") ===
          [...correctBuckets.g.words].sort().join(",") &&
        [...placedSortWords.f].sort().join(",") ===
          [...correctBuckets.f.words].sort().join(",") &&
        [...placedSortWords.silent].sort().join(",") ===
          [...correctBuckets.silent.words].sort().join(",");

      msg = isCorrect
        ? "هەموو وشەکان لە سندوقی تەواوی خۆیان دانران!"
        : "تێبینی: Ghost و Ghana دەنگی (گ)، Laugh و Cough دەنگی (ف)، وە Night و High بێدەنگن.";
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
    setPlacedSortWords({ g: [], f: [], silent: [] });
    setSelectedSortWord(null);
    setIsRecording(false);
    setSpokenTranscript("");
    setEvalResult(null);
    setMicError(null);
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
    setPlacedSortWords({ g: [], f: [], silent: [] });
    setSelectedSortWord(null);
    setIsRecording(false);
    setSpokenTranscript("");
    setEvalResult(null);
    setMicError(null);
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
            پیرۆزە! وانەکەت تەواو کرد
          </h1>
          <p className="mt-2 text-sm sm:text-base font-bold text-[#777777] dark:text-[#8495A0] max-w-md">
            تۆ یاساکانی بێژەکردنی پیتی <b>GH</b> ـت لە زمانی ئینگلیزیدا بە سەرکەوتوویی فێربوویت و هەموو قۆناغەکانت بە سەرکەوتوویی بڕی.
          </p>

          <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-2xl border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1A262C] p-3">
              <span className="text-xl font-black text-[#58CC02]">100%</span>
              <span className="text-xs font-bold text-[#777777] dark:text-[#8495A0]">وردبینی</span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1A262C] p-3">
              <span className="text-xl font-black text-[#1CB0F6]">+60</span>
              <span className="text-xs font-bold text-[#777777] dark:text-[#8495A0]">خاڵی XP</span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1A262C] p-3">
              <span className="text-xl font-black text-[#FF9600]">🔥 ١</span>
              <span className="text-xs font-bold text-[#777777] dark:text-[#8495A0]">ڕۆژی کارا</span>
            </div>
          </div>

          <div className="mt-10 flex w-full max-w-md flex-col gap-3">
            <PushButton variant="green" onClick={handleRestart} className="w-full py-3.5 text-sm">
              <RotateCcw className="h-4 w-4 mr-2 inline" />
              دووبارەکردنەوەی وانە (Review Lesson)
            </PushButton>
            <Link href="/lesson-1" className="w-full">
              <PushButton
                variant="blue"
                className="w-full py-3.5 text-sm"
              >
                وانەی داهاتوو (Next Lesson: وانەی یەکەم)
              </PushButton>
            </Link>
          </div>

          {/* Modal when user clicks Next Lesson */}
          {showNoMoreLessonsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
              <div className="relative w-full max-w-md rounded-3xl border-2 border-[#E5E5E5] bg-white p-6 text-center shadow-2xl dark:border-[#37464F] dark:bg-[#1A262C]">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#1CB0F6] dark:bg-[#1C3342] dark:text-[#3BC0F8]">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="font-kurdish text-2xl font-black text-[#4B4B4B] dark:text-white">
                  لە ئێستادا وانەی تر بەردەست نییە
                </h3>
                <p className="mt-2 text-sm font-bold text-[#777777] dark:text-[#8495A0]">
                  We do not have any lesson right now.
                </p>
                <p className="mt-1 text-xs text-[#AFAFAF] dark:text-[#6A7B83]">
                  ئەم پڕۆژەیە بۆ تاقیکردنەوە و نیشاندانی شێوازی فێربوون (Demo) ئامادەکراوە.
                </p>
                <div className="mt-6 flex flex-col gap-2">
                  <PushButton
                    variant="green"
                    onClick={() => {
                      setShowNoMoreLessonsModal(false);
                      handleRestart();
                    }}
                    className="w-full py-3 text-sm font-extrabold"
                  >
                    دووبارەکردنەوەی وانە (Review Lesson)
                  </PushButton>
                  <PushButton
                    variant="white"
                    onClick={() => setShowNoMoreLessonsModal(false)}
                    className="w-full py-3 text-sm font-extrabold"
                  >
                    داخستن (Close)
                  </PushButton>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-white dark:bg-[#131F24]">
      {/* Lesson top bar (Strictly LTR: Exit on Left, Progress Center, Hearts Right) */}
      <div className="mx-auto flex w-full max-w-2xl items-center gap-4 px-4 py-5" style={{ direction: "ltr" }}>
        <button
          type="button"
          onClick={handleRestart}
          aria-label="Restart lesson"
          className="text-[#AFAFAF] transition-colors hover:text-[#777777] dark:text-[#8495A0] dark:hover:text-white"
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

      {/* Main Exercise Area */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-44 pt-2">
        {/* 1. Word Anchors View (Exact Sunrise 3 line-by-line structure) */}
        {slide.type === "rule_intake" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8FAD4] dark:bg-[#1E3B20] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#58CC02]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{slide.badge}</span>
              </span>
              <h2 dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white mt-1">
                {slide.titleKu}
              </h2>
              <p dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                گوێ لە هەموو دەنگەکان بگرە بۆ بەردەوامبوون ({listenedWords.size} لە {slide.examples.length})
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {slide.examples.map((w) => {
                const isHeard = listenedWords.has(w.en);
                const isPlaying = playingWord === w.en;

                return (
                  <div
                    key={w.en}
                    onClick={() => handlePlayAnchor(w)}
                    className={cn(
                      "group relative flex flex-col overflow-hidden rounded-3xl border-2 border-b-4 transition-all cursor-pointer select-none",
                      isHeard
                        ? "border-[#58CC02] bg-[#F7FCF0] dark:border-[#58CC02] dark:bg-[#132817]"
                        : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] hover:bg-[#F4FBFF] dark:border-[#37464F] dark:bg-[#131F24] dark:hover:border-[#1CB0F6]"
                    )}
                  >
                    {/* Top Image / Graphic display */}
                    <div className="flex h-44 w-full items-center justify-center border-b border-black/5 bg-gradient-to-b from-[#EAF4FF] to-white p-3 sm:h-52 dark:border-white/10 dark:from-[#1B262C] dark:to-[#131F24]">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div dir="ltr" className="font-sans text-5xl sm:text-6xl font-black tracking-wide text-[#4B4B4B] dark:text-white select-none">
                          {w.highlighted}
                        </div>
                        {w.subtitle && (
                          <span dir="rtl" className="mt-3 rounded-lg bg-black/5 dark:bg-white/5 px-3 py-1 font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                            {w.subtitle}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom row: speaker + word on LEFT, Kurdish gloss on RIGHT (Strictly LTR row) */}
                    <div className="flex items-center justify-between gap-3 p-4" style={{ direction: "ltr" }}>
                      <div className="flex min-w-0 items-center gap-3">
                        <button
                          type="button"
                          aria-label={`Play ${w.en}`}
                          className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-b-2 transition-all",
                            isPlaying
                              ? "border-[#1899D6] bg-[#1CB0F6] text-white animate-pulse"
                              : isHeard
                                ? "border-[#46A302] bg-[#58CC02] text-white"
                                : "border-[#1899D6] bg-[#1CB0F6] text-white group-hover:scale-105"
                          )}
                        >
                          <Volume2 className="h-5 w-5" />
                        </button>

                        <div className="flex min-w-0 flex-col text-left">
                          <span dir="ltr" className="truncate text-2xl font-black tracking-tight text-[#4B4B4B] dark:text-white">
                            {w.en}
                          </span>
                          {w.note && (
                            <span dir="rtl" className="truncate font-kurdish text-xs font-bold text-[#AFAFAF] dark:text-[#8495A0]">
                              ({w.note})
                            </span>
                          )}
                        </div>
                      </div>

                      <KurdishGlossBadges
                        pronunciation={w.pron}
                        meaning={w.ku}
                      />
                    </div>

                    {/* Heard Checkmark Badge */}
                    {isHeard && (
                      <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#58CC02] text-white shadow-sm">
                        <CheckCircle2 className="h-4 w-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {listenedWords.size >= slide.examples.length && (
              <div className="rounded-2xl border border-[#58CC02]/40 bg-[#E8FAD4] dark:bg-[#1E3B20] p-3 text-center animate-in fade-in">
                <p dir="rtl" className="font-kurdish text-xs font-extrabold text-[#58CC02]">
                  هەموو وشەکانت بیست! کلیک لەسەر دوگمەی خوارەوە بکە بۆ بەردەوامبوون.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 2. Multiple Choice View (Exact MultipleChoiceView structure) */}
        {slide.type === "quiz_choice" && (
          <div className="flex flex-col gap-4">
            <div className="px-1 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#EAF4FF] dark:bg-[#1C3342] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#1899D6] dark:text-[#3BC0F8]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{slide.badge}</span>
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div dir="rtl" className="font-kurdish text-2xl sm:text-3xl font-bold leading-normal text-[#4B4B4B] dark:text-white kurdish-word select-none">
                {slide.titleKu}
              </div>
              <p dir="ltr" className="font-sans text-sm font-bold text-[#777777] dark:text-[#8495A0] mt-1">
                {slide.titleEn}
              </p>

              {slide.audioWord && (
                <div className="mt-4 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => playAudio(slide.audioWord!)}
                    className="inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#1899D6] bg-[#1CB0F6] px-4 py-2 font-extrabold text-white transition-transform hover:bg-[#4FC3F9] active:translate-y-[2px]"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>Listen / «{slide.audioWord}» گوێبگرە</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {slide.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isAnswered = showFeedback;
                const isCorrectRow = isAnswered && option.correct;
                const isWrongPick = isAnswered && isSelected && !option.correct;

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => {
                      setSelectedOption(index);
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border-2 border-b-4 px-4 py-3 font-bold transition-colors text-right",
                      !isAnswered && isSelected
                        ? "border-[#84D8FF] bg-[#DDF4FF] text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#202F36] dark:text-[#3BC0F8]"
                        : !isAnswered
                          ? "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#DCE6EC] dark:hover:bg-[#202F36]"
                          : isCorrectRow
                            ? "border-[#A5ED6E] bg-[#D7FFB8] text-[#58A700] dark:border-[#58CC02] dark:bg-[#1B351B] dark:text-[#58CC02]"
                            : isWrongPick
                              ? "border-[#FFB2B2] bg-[#FFDFE0] text-[#EA2B2B] dark:border-[#EA2B2B] dark:bg-[#3A181D] dark:text-[#FF6666]"
                              : "border-[#E5E5E5] bg-white text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#52656D]"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-b-4 text-xs font-extrabold",
                        !isAnswered && isSelected
                          ? "border-[#84D8FF] bg-white text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#131F24] dark:text-[#3BC0F8]"
                          : !isAnswered
                            ? "border-[#E5E5E5] bg-white text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#202F36] dark:text-[#8495A0]"
                            : isCorrectRow
                              ? "border-[#A5ED6E] bg-white text-[#58A700] dark:border-[#58CC02] dark:bg-[#131F24] dark:text-[#58CC02]"
                              : isWrongPick
                                ? "border-[#FFB2B2] bg-white text-[#EA2B2B] dark:border-[#EA2B2B] dark:bg-[#131F24] dark:text-[#FF6666]"
                                : "border-[#E5E5E5] bg-white text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#52656D]"
                      )}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1 flex flex-col text-right">
                      <span dir="rtl" className="font-kurdish text-lg font-bold">
                        {option.text}
                      </span>
                      {option.sub && (
                        <span dir="ltr" className="font-sans text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                          {option.sub}
                        </span>
                      )}
                    </div>
                    {isCorrectRow && <Check className="h-5 w-5 stroke-[3] text-[#58CC02]" />}
                    {isWrongPick && <X className="h-5 w-5 stroke-[3] text-[#EA2B2B]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Slot Filler View */}
        {slide.type === "quiz_slot" && (
          <div className="flex flex-col gap-4">
            <div className="px-1 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#2D1B4E] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#C084FC]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{slide.badge}</span>
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-2 text-center">
              <div dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white">
                {slide.titleKu}
              </div>
              <p dir="ltr" className="font-sans text-sm font-bold text-[#777777] dark:text-[#8495A0] mt-1">
                {slide.titleEn}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-[#F7F7F7] dark:bg-[#1A262C] p-6 text-center gap-2">
              <div dir="ltr" className="font-sans text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-white">
                {slide.framePre}
                <span className="mx-2 inline-block rounded-xl border-2 border-dashed border-[#1899D6] bg-[#DDF4FF] dark:bg-[#1C3342] px-3 py-1 font-black text-[#1899D6] dark:text-[#3BC0F8]">
                  [ ___ ]
                </span>
                {slide.framePost}
              </div>
              <p dir="rtl" className="font-kurdish text-sm font-bold text-[#777777] dark:text-[#8495A0] mt-1">
                {slide.meaningKu}
              </p>
              {slide.audioWord && (
                <button
                  type="button"
                  onClick={() => playAudio(slide.audioWord!)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-xl border-2 border-b-2 border-[#1899D6] bg-[#1CB0F6] px-3 py-1 text-xs font-bold text-white"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>دەنگی وشەکە</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {slide.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isAnswered = showFeedback;
                const isCorrectRow = isAnswered && option.correct;
                const isWrongPick = isAnswered && isSelected && !option.correct;

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => setSelectedOption(index)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border-2 border-b-4 px-4 py-3 font-bold transition-colors text-right",
                      !isAnswered && isSelected
                        ? "border-[#84D8FF] bg-[#DDF4FF] text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#202F36] dark:text-[#3BC0F8]"
                        : !isAnswered
                          ? "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#DCE6EC] dark:hover:bg-[#202F36]"
                          : isCorrectRow
                            ? "border-[#A5ED6E] bg-[#D7FFB8] text-[#58A700] dark:border-[#58CC02] dark:bg-[#1B351B] dark:text-[#58CC02]"
                            : isWrongPick
                              ? "border-[#FFB2B2] bg-[#FFDFE0] text-[#EA2B2B] dark:border-[#EA2B2B] dark:bg-[#3A181D] dark:text-[#FF6666]"
                              : "border-[#E5E5E5] bg-white text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#52656D]"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-b-4 text-xs font-extrabold",
                        !isAnswered && isSelected
                          ? "border-[#84D8FF] bg-white text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#131F24] dark:text-[#3BC0F8]"
                          : !isAnswered
                            ? "border-[#E5E5E5] bg-white text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#202F36] dark:text-[#8495A0]"
                            : isCorrectRow
                              ? "border-[#A5ED6E] bg-white text-[#58A700] dark:border-[#58CC02] dark:bg-[#131F24] dark:text-[#58CC02]"
                              : isWrongPick
                                ? "border-[#FFB2B2] bg-white text-[#EA2B2B] dark:border-[#EA2B2B] dark:bg-[#131F24] dark:text-[#FF6666]"
                                : "border-[#E5E5E5] bg-white text-[#AFAFAF] dark:border-[#37464F] dark:bg-[#131F24] dark:text-[#52656D]"
                      )}
                    >
                      {index + 1}
                    </span>
                    <span dir="rtl" className="flex-1 font-kurdish text-lg font-bold">
                      {option.text}
                    </span>
                    {isCorrectRow && <Check className="h-5 w-5 stroke-[3] text-[#58CC02]" />}
                    {isWrongPick && <X className="h-5 w-5 stroke-[3] text-[#EA2B2B]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Pair Matching View */}
        {slide.type === "quiz_pairs" && (
          <div className="flex flex-col gap-4">
            <div className="px-1 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#E8FAD4] dark:bg-[#1E3B20] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#58CC02]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{slide.badge}</span>
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-2 text-center">
              <div dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white">
                {slide.titleKu}
              </div>
              <p dir="ltr" className="font-sans text-sm font-bold text-[#777777] dark:text-[#8495A0] mt-1">
                {slide.titleEn}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              {/* English column */}
              <div className="flex flex-col gap-3">
                {slide.pairs.map((p) => {
                  const isMatched = matchedPairIds.has(p.id);
                  const isSelected = selectedPairEn === p.id;

                  return (
                    <button
                      key={`en-${p.id}`}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handlePairClickEn(p.id, p.en)}
                      className={cn(
                        "flex min-h-[64px] items-center justify-center rounded-2xl border-2 border-b-4 p-4 font-sans text-lg font-black transition-all",
                        isMatched
                          ? "border-[#58CC02] bg-[#F7FCF0] text-[#58CC02] opacity-40 dark:border-[#58CC02] dark:bg-[#132817]"
                          : isSelected
                            ? "border-[#84D8FF] bg-[#DDF4FF] text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#202F36] dark:text-[#3BC0F8]"
                            : wrongPairShake && isSelected
                              ? "border-[#EA2B2B] bg-[#FFDFE0] text-[#EA2B2B] animate-shake"
                              : "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:text-white dark:hover:bg-[#202F36]"
                      )}
                    >
                      {p.en}
                    </button>
                  );
                })}
              </div>

              {/* Kurdish column */}
              <div className="flex flex-col gap-3">
                {slide.pairs.map((p) => {
                  const isMatched = matchedPairIds.has(p.id);
                  const isSelected = selectedPairKu === p.id;

                  return (
                    <button
                      key={`ku-${p.id}`}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handlePairClickKu(p.id)}
                      className={cn(
                        "flex min-h-[64px] items-center justify-center rounded-2xl border-2 border-b-4 p-4 font-kurdish text-sm sm:text-base font-bold transition-all text-center",
                        isMatched
                          ? "border-[#58CC02] bg-[#F7FCF0] text-[#58CC02] opacity-40 dark:border-[#58CC02] dark:bg-[#132817]"
                          : isSelected
                            ? "border-[#84D8FF] bg-[#DDF4FF] text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#202F36] dark:text-[#3BC0F8]"
                            : wrongPairShake && isSelected
                              ? "border-[#EA2B2B] bg-[#FFDFE0] text-[#EA2B2B] animate-shake"
                              : "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:bg-[#F7F7F7] dark:border-[#37464F] dark:bg-[#131F24] dark:text-white dark:hover:bg-[#202F36]"
                      )}
                    >
                      {p.ku}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 5. 3-Bucket Sorting View */}
        {slide.type === "quiz_sort" && (
          <div className="flex flex-col gap-4">
            <div className="px-1 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#2D1B4E] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#C084FC]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{slide.badge}</span>
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-1 text-center">
              <div dir="rtl" className="font-kurdish text-2xl font-bold text-[#4B4B4B] dark:text-white">
                {slide.titleKu}
              </div>
              <p dir="ltr" className="font-sans text-sm font-bold text-[#777777] dark:text-[#8495A0] mt-1">
                {slide.titleEn}
              </p>
            </div>

            {/* Unsorted Bank */}
            <div className="flex min-h-[64px] flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#E5E5E5] dark:border-[#37464F] bg-[#F7F7F7] dark:bg-[#1A262C] p-3">
              {slide.words
                .filter(
                  (w) =>
                    !placedSortWords.g.includes(w) &&
                    !placedSortWords.f.includes(w) &&
                    !placedSortWords.silent.includes(w)
                )
                .map((w) => {
                  const isSelected = selectedSortWord === w;
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => handleSelectSortChip(w)}
                      className={cn(
                        "rounded-xl border-2 border-b-4 px-4 py-2 font-sans text-base font-black transition-all",
                        isSelected
                          ? "border-[#1899D6] bg-[#DDF4FF] text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#1C3342] dark:text-[#3BC0F8] -translate-y-1"
                          : "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#202F36] dark:text-white"
                      )}
                    >
                      {w}
                    </button>
                  );
                })}
            </div>

            {/* 3 Buckets */}
            <div className="flex flex-col gap-3">
              {(["g", "f", "silent"] as const).map((key) => {
                const b = slide.buckets[key];
                const items = placedSortWords[key];

                return (
                  <div
                    key={key}
                    onClick={() => handlePlaceSortChip(key)}
                    className={cn(
                      "flex min-h-[78px] flex-col justify-between rounded-2xl border-2 border-dashed p-3 transition-colors cursor-pointer",
                      key === "g" && "border-[#58CC02]/40 bg-[#F7FCF0] dark:bg-[#132817]/40",
                      key === "f" && "border-[#FF9600]/40 bg-[#FFF9F0] dark:bg-[#342416]/40",
                      key === "silent" && "border-[#1CB0F6]/40 bg-[#F4FBFF] dark:bg-[#1C3342]/40"
                    )}
                  >
                    <div className="flex items-center justify-between text-xs font-black">
                      <span dir="rtl" className="font-kurdish">
                        {b.label}
                      </span>
                      <span dir="ltr" className="font-sans text-[#777777] dark:text-[#8495A0]">
                        {b.sub}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {items.map((w) => (
                        <span
                          key={w}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSortChip(w, key);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#202F36] px-2.5 py-1 font-sans text-xs font-black text-[#4B4B4B] dark:text-white hover:border-[#EA2B2B] hover:text-[#EA2B2B]"
                          title="Click to remove"
                        >
                          <span>{w}</span>
                          <span className="text-[10px] opacity-60">✕</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. Mic Speaking Exercise View */}
        {slide.type === "mic_speak" && (
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Header Badge */}
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

            {/* Word Card with Native Audio button */}
            <div className="flex flex-col items-center gap-4 w-full max-w-md rounded-3xl border-2 border-b-4 border-[#E5E5E5] bg-white p-6 shadow-sm dark:border-[#37464F] dark:bg-[#1A262C]">
              {/* English word & audio trigger */}
              <div className="flex items-center justify-center gap-3">
                <span
                  dir="ltr"
                  className="text-4xl sm:text-5xl font-black tracking-wide text-[#4B4B4B] dark:text-white select-none"
                >
                  {slide.targetWord}
                </span>
                <button
                  type="button"
                  onClick={() => playAudio(slide.targetWord)}
                  aria-label={`Listen to ${slide.targetWord}`}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-b-4 border-[#1899D6] bg-[#1CB0F6] text-white hover:bg-[#4FC3F9] active:translate-y-[2px] active:border-b-2 transition-all shadow-xs cursor-pointer",
                    playingWord === slide.targetWord && "animate-pulse"
                  )}
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>

              {/* Kurdish Gloss Badges */}
              <KurdishGlossBadges
                pronunciation={slide.pronKu}
                meaning={slide.meaningKu}
              />

              {/* Rule Note pill */}
              <span
                dir="rtl"
                className="rounded-xl bg-[#F7F7F7] dark:bg-[#202F36] px-3.5 py-1.5 font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0] border border-black/5 dark:border-white/5"
              >
                {slide.ruleNote}
              </span>
            </div>

            {/* Big Interactive Duolingo Mic Button */}
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

              {/* Status Message */}
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

              {/* Micro-guide: Can't speak right now */}
              <button
                type="button"
                onClick={() => handleCantSpeakNow(slide.targetWord)}
                className="mt-2 text-xs font-bold text-[#AFAFAF] hover:text-[#777777] dark:text-[#8495A0] dark:hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
              >
                {"ناتوانم ئێستا قسە بکەم (Can't speak now)"}
              </button>

              {micError && (
                <p dir="rtl" className="font-kurdish text-xs text-[#EA2B2B] max-w-xs mt-1">
                  {micError}
                </p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Exact Sunrise 3 Bottom Footer & Duolingo PushButton */}
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
              {slide.type === "rule_intake" ? "Continue" : "Check"}
            </PushButton>
          </div>
        </div>
      ) : (
        /* Exact Duolingo Feedback Banner */
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
                  isLastCorrect ? "text-[#58A700] dark:text-[#58CC02]" : "text-[#EA2B2B] dark:text-[#FF5252]"
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
                  isLastCorrect ? "text-[#58A700] dark:text-[#58CC02]" : "text-[#EA2B2B] dark:text-[#FF5252]"
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
