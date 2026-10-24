"use client";

import { useState, useMemo, useRef, useEffect } from "react";
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
  Turtle,
  Lightbulb,
} from "lucide-react";
import { PushButton } from "@/components/duo/PushButton";
import { HeartsBar } from "@/components/duo/HeartsBar";
import { SquirrelMascot } from "@/components/duo/SquirrelMascot";
import { KurdishGlossBadges } from "@/components/lesson/KurdishGlossBadges";
import { playAmericanSpeech } from "@/lib/americanVoice";
import { evaluateSpokenAnswer, type SpeechEvaluationResult } from "@/lib/speechEvaluation";
import {
  playOptionSelectSound,
  playCorrectSound,
  playIncorrectSound,
  playLessonCompleteSound,
} from "@/lib/lessonAudio";
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
  textEn: string;
  pronKu: string;
  meaningKu: string;
  correct: boolean;
}

type Lesson2Slide =
  | {
      type: "word_anchors";
      badge: string;
      titleKu: string;
      titleEn: string;
      subtitleKu: string;
      words: {
        en: string;
        pron: string;
        ku: string;
        icon?: string;
        contextKu: string;
      }[];
    }
  | {
      type: "tip_card";
      badge: string;
      titleKu: string;
      titleEn: string;
      ruleEn: string;
      rulePron: string;
      ruleKu: string;
      tipExplanationKu: string;
      contrastPairs: {
        badEn: string;
        badKu: string;
        goodEn: string;
        goodKu: string;
      }[];
    }
  | {
      type: "listen_pick";
      badge: string;
      titleKu: string;
      titleEn: string;
      audioTarget: string;
      promptHintKu: string;
      options: ChoiceOption[];
      explanationKu: string;
    }
  | {
      type: "quiz_choice";
      badge: string;
      titleKu: string;
      titleEn: string;
      audioWord?: string;
      options: ChoiceOption[];
      explanationKu: string;
    }
  | {
      type: "analytic_breakdown";
      badge: string;
      titleKu: string;
      titleEn: string;
      subtitleKu: string;
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
      subtitleKu: string;
      framePrefix: string;
      frameSuffix: string;
      items: {
        enWord: string;
        fullSentenceEn: string;
        pron: string;
        meaning: string;
        noteKu: string;
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
      ruleNoteKu: string;
      explanationKu: string;
    }
  | {
      type: "quiz_pairs";
      badge: string;
      titleKu: string;
      titleEn: string;
      subtitleKu: string;
      pairs: { id: number; en: string; pron: string; ku: string }[];
    }
  | {
      type: "chat_dialogue";
      badge: string;
      titleKu: string;
      titleEn: string;
      speakerNameKu: string;
      speakerRoleEn: string;
      incomingMessageEn: string;
      incomingPronKu: string;
      incomingMeaningKu: string;
      options: ChoiceOption[];
      explanationKu: string;
    }
  | {
      type: "agreement_trigger";
      badge: string;
      titleKu: string;
      titleEn: string;
      promptEn: string;
      promptPronKu: string;
      promptMeaningKu: string;
      replyEn: string;
      replyPronKu: string;
      replyMeaningKu: string;
      options: ChoiceOption[];
      explanationKu: string;
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
      explanationKu: string;
    }
  | {
      type: "tile_assembly";
      badge: string;
      titleKu: string;
      titleEn: string;
      subtitleKu: string;
      tiles: string[];
      correctOrder: string[];
      fullPronKu: string;
      fullMeaningKu: string;
    };

const LESSON_SLIDES: Lesson2Slide[] = [
  // 1. Essential Drinks Anchors
  {
    type: "word_anchors",
    badge: "خواردنەوە سەرەکییەکان (ESSENTIAL DRINKS)",
    titleKu: "خواردنەوە باوەکان و بێژەکردنیان بە ئینگلیزی",
    titleEn: "Essential drinks: accurate American pronunciation & Kurdish gloss",
    subtitleKu: "گوێ لە هەردوو خێرایی ئاسایی و لەسەرخۆ (🐢) بگرە:",
    words: [
      {
        en: "Water",
        pron: "واتەر / واڕەر",
        ku: "ئاو",
        icon: "💧",
        contextKu: "پێویستی و خواردنەوەی سەرەکی ژیان",
      },
      {
        en: "Tea",
        pron: "تی",
        ku: "چای",
        icon: "🍵",
        contextKu: "خواردنەوەی گەرمی دڵخوازی ڕۆژانە",
      },
      {
        en: "Coffee",
        pron: "کۆفی",
        ku: "قاوە",
        icon: "☕",
        contextKu: "بۆ کاتی کارکردن و بەئاگاهاتنەوە",
      },
      {
        en: "Milk",
        pron: "میڵک",
        ku: "شیر",
        icon: "🥛",
        contextKu: "بۆ نانی بەیانی و تەندروستی",
      },
    ],
  },

  // 2. Food Staples Anchors
  {
    type: "word_anchors",
    badge: "خواردنە سەرەکییەکان (FOOD ESSENTIALS)",
    titleKu: "ناوی خواردنە بنەڕەتییەکان بە ئینگلیزی",
    titleEn: "Food staples with Kurdish phonetic and meaning badges",
    subtitleKu: "گوێ لە وشەکان بگرە و بێژەکردنیان دووبارە بکەرەوە:",
    words: [
      {
        en: "Bread",
        pron: "برێد",
        ku: "نان",
        icon: "🍞",
        contextKu: "بنەمای سەرەکی هەموو ژەمێکی خواردن",
      },
      {
        en: "Apple",
        pron: "ئەپڵ",
        ku: "سێو",
        icon: "🍎",
        contextKu: "میوەیەکی تەندروست و بەتام",
      },
      {
        en: "Rice",
        pron: "ڕایس",
        ku: "برنج / پڵاو",
        icon: "🍚",
        contextKu: "ژەمی سەرەکی و دڵخوازی ڕۆژهەڵاتی",
      },
      {
        en: "Pizza",
        pron: "پیتزا",
        ku: "پیتزا",
        icon: "🍕",
        contextKu: "خواردنێکی خێرای بەناوبانگ و جیهانی",
      },
    ],
  },

  // 3. Politeness Magic Words
  {
    type: "word_anchors",
    badge: "وشە سیحراوییەکان (POLITENESS MAGIC WORDS)",
    titleKu: "٤ کلیلە وشەی گرنگ بۆ ڕێزگرتن و بەڕێزانە قسەکردن",
    titleEn: "The 4 core polite expressions in everyday English",
    subtitleKu: "ئەم دەستەواژانە بەکاربهێنە بۆ ئەوەی قسەکردنت هەمیشە شیرین و ڕێزدار بێت:",
    words: [
      {
        en: "Please",
        pron: "پڵیز",
        ku: "تکایە",
        icon: "✨",
        contextKu: "کلیلی زێڕین بۆ هەموو داواکارییەک",
      },
      {
        en: "Thank you",
        pron: "ثانک یو",
        ku: "سوپاس",
        icon: "🙏",
        contextKu: "بۆ کاتی وەرگرتنی هاوکاری یان شتومەک",
      },
      {
        en: "You're welcome",
        pron: "یۆر وێڵکەم",
        ku: "شایەنی نییە / سەرچاو",
        icon: "🤝",
        contextKu: "وەڵامی دروست و ڕێزدار بۆ سوپاس",
      },
      {
        en: "Excuse me",
        pron: "ئێکسکیوز می",
        ku: "ببورە / لێم ببورە",
        icon: "🙋‍♂️",
        contextKu: "بۆ سەرنجڕاکێشان یان داوای لێبوردن",
      },
    ],
  },

  // 4. Cultural / Pedagogical Golden Rule Card
  {
    type: "tip_card",
    badge: "تێبینی زێڕینی کولتووری (CULTURE & POLITENESS TIP)",
    titleKu: "یاسای زێڕین: لە ئینگلیزیدا چۆن داواکاری ڕێزدار دەکرێت؟",
    titleEn: "Why you should never say just 'I want' to a waiter or host",
    ruleEn: "Always use 'Can I have...' or add 'Please'",
    rulePron: "کەن ئای هاڤ ... / پڵیز",
    ruleKu: "هەمیشە دەستەواژەی «دەتوانم ...م دەستکەوێت» یان «تکایە» بەکاربهێنە",
    tipExplanationKu:
      "لە کولتووری ئینگلیزیدا، وتنی ڕاستەوخۆی «I want...» (ئەوەم دەوێت) بە تەنیا لە ڕێستۆرانت یان میوانداریدا، لەوانەیە کەمێک توند یان ناڕێز دەربکەوێت. هەمیشە داواکارییەکەت نەرم بکەرەوە بە وتنی «Can I have... please?» یان بە کورتی ناوی شتەکە + «please».",
    contrastPairs: [
      {
        badEn: "Give me tea! / I want tea!",
        badKu: "توند و ناڕێز (فەرمانپێکردن)",
        goodEn: "Can I have tea, please?",
        goodKu: "بەڕێز و تەواو سروشتی (دەتوانم چایەکم دەستکەوێت، تکایە؟)",
      },
      {
        badEn: "Water!",
        badKu: "وشک و کتوپڕ",
        goodEn: "Water, please.",
        goodKu: "شیرین و پوخت (ئاو، تکایە)",
      },
    ],
  },

  // 5. Ear Training / Listen & Pick
  {
    type: "listen_pick",
    badge: "ڕاهێنانی گوێگرتن (LISTENING CHALLENGE)",
    titleKu: "گوێ لە دەنگەکە بگرە و دەستنیشانی بکە چ خواردنەوەیەک داوا کرا:",
    titleEn: "Listen carefully to the audio and select what was ordered:",
    audioTarget: "Coffee, please.",
    promptHintKu: "کلیک لە دوگمەی دەنگ بکە بۆ گوێگرتن",
    options: [
      {
        textEn: "Coffee, please.",
        pronKu: "کۆفی، پڵیز",
        meaningKu: "قاوە، تکایە (داواکراوەکە)",
        correct: true,
      },
      {
        textEn: "Water, please.",
        pronKu: "واتەر، پڵیز",
        meaningKu: "ئاو، تکایە",
        correct: false,
      },
      {
        textEn: "Milk, please.",
        pronKu: "میڵک، پڵیز",
        meaningKu: "شیر، تکایە",
        correct: false,
      },
    ],
    explanationKu: "لە دەنگەکەدا بە ڕوونی وترا «Coffee, please» واتە «قاوە، تکایە».",
  },

  // 6. Quick Polite Order Quiz
  {
    type: "quiz_choice",
    badge: "داواکاری خێرا (QUICK POLITE ORDER)",
    titleKu: "لە کافێیەکت، چۆن بە شێوازێکی کورت و بەڕێزانە داوای «چای» دەکەیت؟",
    titleEn: "How to make a polite, concise order for tea?",
    audioWord: "Tea, please.",
    options: [
      {
        textEn: "Tea, please.",
        pronKu: "تی، پڵیز",
        meaningKu: "چای، تکایە (وەڵامی کورت، دروست و بەڕێز)",
        correct: true,
      },
      {
        textEn: "Give me tea now!",
        pronKu: "گیڤ می تی ناو",
        meaningKu: "ئێستا چایم پێبدە! (توند و نادروست)",
        correct: false,
      },
      {
        textEn: "Hello teacher.",
        pronKu: "های تیچر",
        meaningKu: "سڵاو مامۆستا (پەیوەندی بە داواکردنەوە نییە)",
        correct: false,
      },
    ],
    explanationKu: "یاسای داواکاری خێرا لە زمانی ئینگلیزیدا بریتییە لە: ناوی خواردنەوەکە + Please.",
  },

  // 7. Echo Mic Speaking Studio 1
  {
    type: "mic_speak",
    badge: "ڕاهێنانی دەنگی (SPEAKING STUDIO)",
    titleKu: "بە دەنگ لە مایکەکە بڵێ: Water, please.",
    titleEn: "Speak clearly into your microphone:",
    targetWord: "Water, please.",
    pronKu: "واتەر، پڵیز.",
    meaningKu: "ئاو، تکایە.",
    ruleNoteKu: "بێژەکردنی خێرا: واتەر پڵیز (یاخود بە ئەمریکی: واڕەر پڵیز)",
    explanationKu: "ئافەرم! دەستەواژەی «Water, please» بە تەواوی و بە ڕوونی بێژەکرا.",
  },

  // 8. Analytic Breakdown: Can I have...?
  {
    type: "analytic_breakdown",
    badge: "شیکردنەوەی داواکاری فەرمی (CAN I HAVE...?)",
    titleKu: "چۆنیەتی پێکهێنانی داواکاری فەرمی و دەوڵەمەند لە چێشتخانە و هۆتێل",
    titleEn: "Modular sentence breakdown for 'Can I have... please?'",
    subtitleKu: "کلیک لە هەر بەشێک بکە بۆ تێگەیشتن لە پێکهاتەی ڕستەکە:",
    rows: [
      {
        en: "Can I have",
        pron: "کەن ئای هاڤ",
        ku: "دەتوانم ...م دەستکەوێت؟ / دەکرێت هەبێت؟",
      },
      {
        en: "water",
        pron: "واتەر",
        ku: "ئاو",
      },
      {
        en: "please?",
        pron: "پڵیز؟",
        ku: "تکایە؟ (وشەی کلیل بۆ ڕێز)",
      },
      {
        en: "Can I have water, please?",
        pron: "کەن ئای هاڤ واتەر، پڵیز؟",
        ku: "دەتوانم ئاوم دەستکەوێت، تکایە؟",
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

  // 9. Spot the Mistake / Select Most Polite
  {
    type: "quiz_choice",
    badge: "دەستنیشانکردنی ڕستەی دروست (GRAMMAR & ETIQUETTE)",
    titleKu: "کام لەم ٣ ڕستەیە ڕێزدارترین و دروستترین داواکارییە لە ڕێستۆرانت؟",
    titleEn: "Which of the following is the most natural and polite request?",
    audioWord: "Can I have coffee, please?",
    options: [
      {
        textEn: "Can I have coffee, please?",
        pronKu: "کەن ئای هاڤ کۆفی، پڵیز؟",
        meaningKu: "دەتوانم قاوەیەکم دەستکەوێت، تکایە؟ (ڕێزدارترین و دروست)",
        correct: true,
      },
      {
        textEn: "I coffee want.",
        pronKu: "ئای کۆفی وۆنت",
        meaningKu: "ڕیزبەندی هەڵە و سەقەت",
        correct: false,
      },
      {
        textEn: "Bring me that car.",
        pronKu: "برینگ می ذات کار",
        meaningKu: "ئەو ئۆتۆمبێلە بۆ من بێنە",
        correct: false,
      },
    ],
    explanationKu: "ڕستەی «Can I have coffee, please?» شێوازی فەرمی و زێڕینە لە هەموو کافێ و چێشتخانەیەکدا.",
  },

  // 10. Handing Over: Here you are
  {
    type: "quiz_choice",
    badge: "فەرمووکردن و سوپاس (HERE YOU ARE)",
    titleKu: "کاتێک گارسۆن شتەکەت پێدەدات و دەڵێت «Here you are» (فەرموو)، چی دەڵێیتەوە؟",
    titleEn: "When the server hands you the item saying 'Here you are', how do you respond?",
    audioWord: "Here you are.",
    options: [
      {
        textEn: "Thank you!",
        pronKu: "ثانک یو!",
        meaningKu: "سوپاس! (وەڵامی ستاندارد و خێرا)",
        correct: true,
      },
      {
        textEn: "I hate this food.",
        pronKu: "ئای هەیت ذس فوود",
        meaningKu: "ڕقم لەم خواردنەیە (ناڕێز)",
        correct: false,
      },
      {
        textEn: "Excuse me.",
        pronKu: "ئێکسکیوز می",
        meaningKu: "ببورە (بۆ کاتی ترە)",
        correct: false,
      },
    ],
    explanationKu: "کاتێک پێت دەڵێن «Here you are» (فەرموو)، ڕاستەوخۆ دەڵێیت «Thank you!» (سوپاس!).",
  },

  // 11. Politeness Response: You're welcome
  {
    type: "agreement_trigger",
    badge: "وەڵامدانەوەی سوپاس (YOU'RE WELCOME)",
    titleKu: "وەڵامی سروشتی بەڕێزانە کاتێک کەسێک پێت دەڵێت «Thank you»:",
    titleEn: "Natural polite response to 'Thank you':",
    promptEn: "Thank you!",
    promptPronKu: "ثانک یو!",
    promptMeaningKu: "سوپاس!",
    replyEn: "You're welcome.",
    replyPronKu: "یۆر وێڵکەم.",
    replyMeaningKu: "شایەنی نییە / سەرچاو.",
    options: [
      {
        textEn: "You're welcome.",
        pronKu: "یۆر وێڵکەم",
        meaningKu: "شایەنی نییە / سەرچاو (وەڵامی دروست)",
        correct: true,
      },
      {
        textEn: "I like bread.",
        pronKu: "ئای ڵایک برێد",
        meaningKu: "حەزم لە نانە",
        correct: false,
      },
      {
        textEn: "That flower.",
        pronKu: "ذات فڵاور",
        meaningKu: "ئەو گوڵە",
        correct: false,
      },
    ],
    explanationKu: "«You're welcome» دەستەواژەی فەرمی و باوە بۆ وەڵامی «Thank you» واتە «شایەنی نییە / سەرچاو».",
  },

  // 12. Status Bank: Want vs Don't want
  {
    type: "status_bank",
    badge: "دەربڕینی ویستن و نەویستن (WANT vs DON'T WANT)",
    titleKu: "دەربڕینی ئەوەی چیت دەوێت یان ناوت بە ئینگلیزی",
    titleEn: "Sentence pattern: Expressing what you want or don't want",
    subtitleKu: "گوێ لە هەر دەستەواژەیەک بگرە بە خێرایی جیاواز:",
    framePrefix: "I ",
    frameSuffix: " ...",
    items: [
      {
        enWord: "want water",
        fullSentenceEn: "I want water",
        pron: "وۆنت واتەر",
        meaning: "ئاوم دەوێت",
        noteKu: "I want water — ئاوم دەوێت",
      },
      {
        enWord: "want bread",
        fullSentenceEn: "I want bread",
        pron: "وۆنت برێد",
        meaning: "نانم دەوێت",
        noteKu: "I want bread — نانم دەوێت",
      },
      {
        enWord: "don't want coffee",
        fullSentenceEn: "I don't want coffee",
        pron: "دۆنت وۆنت کۆفی",
        meaning: "قاوەم ناوێت",
        noteKu: "I don't want coffee — قاوەم ناوێت",
      },
      {
        enWord: "don't want tea",
        fullSentenceEn: "I don't want tea",
        pron: "دۆنت وۆنت تی",
        meaning: "چایم ناوێت",
        noteKu: "I don't want tea — چایم ناوێت",
      },
    ],
  },

  // 13. Cafe Barista Chat Simulation
  {
    type: "chat_dialogue",
    badge: "دیالۆگی چێشتخانە و کافێ (CAFE DIALOGUE)",
    titleKu: "گارسۆنەکە لە کافێ لێت دەپرسێت: Hello! What can I get for you?",
    titleEn: "Choose the most polite and natural response at the cafe:",
    speakerNameKu: "سمۆرەی گارسۆن (Smorik)",
    speakerRoleEn: "Cafe Barista",
    incomingMessageEn: "Hello! What can I get for you?",
    incomingPronKu: "هێڵۆو! وەت کەن ئای گێت فۆر یو؟",
    incomingMeaningKu: "سڵاو! چیت بۆ ئامادە بکەم / چیت دەوێت؟",
    options: [
      {
        textEn: "Can I have tea, please?",
        pronKu: "کەن ئای هاڤ تی، پڵیز؟",
        meaningKu: "دەتوانم چایەکم هەبێت، تکایە؟ (داواکاری نموونەیی)",
        correct: true,
      },
      {
        textEn: "I don't know who you are.",
        pronKu: "ئای دۆنت نۆو هوو یو ئار",
        meaningKu: "نازانم تۆ کێیت",
        correct: false,
      },
      {
        textEn: "This is a big house.",
        pronKu: "ذس ئیز ئە بیگ هاوس",
        meaningKu: "ئەمە ماڵێکی گەورەیە",
        correct: false,
      },
    ],
    explanationKu: "لە کاتی وەڵامدانەوەی گارسۆن، جوانترین و ڕێزدارترین شێواز: «Can I have tea, please?».",
  },

  // 14. Offering & Responding: Yes please vs No thank you
  {
    type: "quiz_choice",
    badge: "پێشنیار و وەڵامدانەوە (OFFERING & RESPONDING)",
    titleKu: "کەسێک لێت دەپرسێت: «Do you want coffee?» (قاوەت دەوێت؟)، چۆن بە ڕێزەوە دەڵێیت بەڵێ؟",
    titleEn: "How to politely accept an offer in social situations:",
    audioWord: "Do you want coffee?",
    options: [
      {
        textEn: "Yes, please.",
        pronKu: "یەس، پڵیز",
        meaningKu: "بەڵێ، تکایە (قبوڵکردنی بەڕێزانە)",
        correct: true,
      },
      {
        textEn: "No, thank you.",
        pronKu: "نۆو، ثانک یو",
        meaningKu: "نەخێر، سوپاس (ڕەتکردنەوەی بەڕێزانە)",
        correct: false,
      },
      {
        textEn: "Me too.",
        pronKu: "می توو",
        meaningKu: "منیش بە هەمان شێوە",
        correct: false,
      },
    ],
    explanationKu: "بۆ قبوڵکردنی بەڕێزانە دەڵێین «Yes, please»؛ ئەگەر پێویستیشمان نەبێت بە ڕێزەوە دەڵێین «No, thank you».",
  },

  // 15. Tile Assembly Builder
  {
    type: "tile_assembly",
    badge: "ڕێکخستنی دەستەواژە (TILE BUILDER)",
    titleKu: "ڕستەی داواکاری قاوە بەڕێزانە بە وشەکان دروست بکە:",
    titleEn: "Assemble the tiles to say 'Can I have coffee please':",
    subtitleKu: "دەتوانم قاوەیەکم دەستکەوێت، تکایە؟",
    tiles: ["please", "Can", "have", "I", "coffee"],
    correctOrder: ["Can", "I", "have", "coffee", "please"],
    fullPronKu: "کەن ئای هاڤ کۆفی پڵیز",
    fullMeaningKu: "دەتوانم قاوەیەکم دەستکەوێت، تکایە؟",
  },

  // 16. Matching Pairs
  {
    type: "quiz_pairs",
    badge: "جوتکردنی وشەکان (VOCABULARY MATCHING)",
    titleKu: "وشە ئینگلیزییەکان لەگەڵ مانا کوردییەکەیان جوت بکە:",
    titleEn: "Match each English word with its Kurdish meaning:",
    subtitleKu: "کلیک لەسەر وشەی چەپ بکە پاشان مانا کوردییەکەی لە لای ڕاست بدۆزەرەوە:",
    pairs: [
      { id: 1, en: "Water", pron: "واتەر", ku: "ئاو" },
      { id: 2, en: "Tea", pron: "تی", ku: "چای" },
      { id: 3, en: "Coffee", pron: "کۆفی", ku: "قاوە" },
      { id: 4, en: "Bread", pron: "برێد", ku: "نان" },
      { id: 5, en: "Please", pron: "پڵیز", ku: "تکایە" },
    ],
  },

  // 17. Echo Mic Speaking Studio 2
  {
    type: "mic_speak",
    badge: "ڕاهێنانی دەنگی کۆتایی (SPEAKING MASTERY)",
    titleKu: "بە دەنگ لە مایکەکە بڵێ: Can I have water please?",
    titleEn: "Speak the full polite request out loud into the microphone:",
    targetWord: "Can I have water please?",
    pronKu: "کەن ئای هاڤ واتەر پڵیز؟",
    meaningKu: "دەتوانم کەمێک ئاوم دەستکەوێت، تکایە؟",
    ruleNoteKu: "ڕستەی فەرمی داواکاری: کەن ئای هاڤ واتەر پڵیز",
    explanationKu: "سەرکەوتوو بوویت! داواکارییەکی فەرمی تەواو و پاراوت بە ئینگلیزی بێژەکرد.",
  },
];

export default function Lesson2Page() {
  const [currentStep, setCurrentStep] = useState(0);
  const [hearts, setHearts] = useState(5);
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

  // Sound playback (with speed rate support)
  const playAudio = (phrase: string, rate: number = 0.88) => {
    setPlayingWord(phrase);
    playAmericanSpeech(phrase, rate);
    const timeoutDuration = rate < 0.8 ? 1600 : 1200;
    setTimeout(() => setPlayingWord(null), timeoutDuration);
  };

  // Play fanfare when reaching completion screen
  useEffect(() => {
    if (isComplete) {
      playLessonCompleteSound();
    }
  }, [isComplete]);

  // Clean up speech recognition on unmount
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
      case "tip_card":
        return true;
      case "listen_pick":
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

    if (slide.type === "tip_card") {
      playCorrectSound();
      setIsLastCorrect(true);
      setFeedbackMessage("یاساکەت بە سەرکەوتوویی خوێندەوە!");
      setShowFeedback(true);
      return;
    }

    if (
      slide.type === "word_anchors" ||
      slide.type === "analytic_breakdown" ||
      slide.type === "status_bank"
    ) {
      playCorrectSound();
      setIsLastCorrect(true);
      setFeedbackMessage("نایابە! گوێت لە دەنگەکان گرت و فێربوویت.");
      setShowFeedback(true);
      return;
    }

    if (slide.type === "mic_speak") {
      const isPassed = evalResult?.isMatch ?? true;
      if (isPassed) {
        playCorrectSound();
      } else {
        playIncorrectSound();
        setHearts((h) => Math.max(1, h - 1));
      }
      setIsLastCorrect(isPassed);
      setFeedbackMessage(slide.explanationKu);
      setShowFeedback(true);
      return;
    }

    if (slide.type === "quiz_pairs") {
      playCorrectSound();
      setIsLastCorrect(true);
      setFeedbackMessage("هەموو وشەکان بە تەواوی و دروستی جووت کران!");
      setShowFeedback(true);
      return;
    }

    if (slide.type === "tile_assembly") {
      const isCorrect =
        assembledTiles.join(" ") === slide.correctOrder.join(" ");
      if (isCorrect) {
        playCorrectSound();
      } else {
        playIncorrectSound();
        setHearts((h) => Math.max(1, h - 1));
      }
      setIsLastCorrect(isCorrect);
      setFeedbackMessage(
        isCorrect
          ? `نایابە! «${slide.correctOrder.join(" ")}» (${slide.fullMeaningKu})`
          : `ڕیزبەندی دروست: ${slide.correctOrder.join(" ")}`
      );
      setShowFeedback(true);
      return;
    }

    // Option-based types (quiz_choice, listen_pick, chat_dialogue, agreement_trigger, quiz_slot)
    if (selectedOption !== null && "options" in slide) {
      const opt = slide.options[selectedOption];
      const isCorrect = opt?.correct ?? false;
      if (isCorrect) {
        playCorrectSound();
      } else {
        playIncorrectSound();
        setHearts((h) => Math.max(1, h - 1));
      }
      setIsLastCorrect(isCorrect);
      const correctOpt = slide.options.find((o) => o.correct);
      setFeedbackMessage(
        isCorrect
          ? "ئافەرم! وەڵامەکەت تەواو و دروستە."
          : `وەڵامی دروست: ${correctOpt?.textEn ?? ""} — ${slide.explanationKu}`
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
    playOptionSelectSound();
    setIsLastCorrect(true);
    setFeedbackMessage("پەڕینەوە بۆ بەشی داهاتوو.");
    setShowFeedback(true);
  };

  const handleRestart = () => {
    playOptionSelectSound();
    setCurrentStep(0);
    setHearts(5);
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

  // Completion screen (Strictly isolated, never links to other lessons)
  if (isComplete) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-white dark:bg-[#131F24]">
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-3xl bg-[#FFF4E5] dark:bg-[#342416] text-6xl shadow-inner animate-bounce">
            <Trophy className="h-16 w-16 text-[#FF9600]" />
          </div>

          <h1 className="font-kurdish text-3xl sm:text-4xl font-black text-[#4B4B4B] dark:text-white">
            پیرۆزە! وانەی دووەمت بە سەرکەوتوویی تەواو کرد
          </h1>
          <p className="mt-3 text-sm sm:text-base font-bold text-[#777777] dark:text-[#8495A0] max-w-md font-kurdish" dir="rtl">
            تۆ فێربوویت چۆن داوای خواردن و خواردنەوە بکەیت بە شێوازێکی تەواو بەڕێزانە (Can I have... please?) و بە ڕێزەوە وەڵامی فەرمووکردن و پێشکەشکردن بدەیتەوە.
          </p>

          <div className="mt-8 grid w-full max-w-md grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-2xl border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1A262C] p-3 shadow-xs">
              <span className="text-xl font-black text-[#58CC02]">100%</span>
              <span className="text-xs font-bold text-[#777777] dark:text-[#8495A0] font-kurdish">وردبینی</span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1A262C] p-3 shadow-xs">
              <span className="text-xl font-black text-[#1CB0F6]">+85</span>
              <span className="text-xs font-bold text-[#777777] dark:text-[#8495A0] font-kurdish">خاڵی XP</span>
            </div>
            <div className="flex flex-col items-center rounded-2xl border-2 border-b-4 border-[#E5E5E5] dark:border-[#37464F] bg-white dark:bg-[#1A262C] p-3 shadow-xs">
              <span className="text-xl font-black text-[#FF9600]">🔥 ٣</span>
              <span className="text-xs font-bold text-[#777777] dark:text-[#8495A0] font-kurdish">ڕۆژی بەردەوام</span>
            </div>
          </div>

          {/* Buttons: Strictly self-contained, no external links to other lessons */}
          <div className="mt-10 flex w-full max-w-md flex-col gap-3">
            <PushButton
              variant="green"
              onClick={handleRestart}
              className="w-full py-4 text-sm font-extrabold"
            >
              <RotateCcw className="h-4 w-4 mr-2 inline" />
              دووبارەکردنەوەی ئەم وانەیە (Review Lesson)
            </PushButton>
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
        {/* 1. Word Anchors View (Drinks / Food / Magic Words) */}
        {slide.type === "word_anchors" && (
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
                dir="ltr"
                className="font-sans text-xs sm:text-sm font-bold text-[#777777] dark:text-[#8495A0]"
              >
                {slide.titleEn}
              </p>
              <p
                dir="rtl"
                className="font-kurdish text-xs font-bold text-[#1CB0F6] dark:text-[#3BC0F8] mt-0.5"
              >
                {slide.subtitleKu}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {slide.words.map((w) => {
                const isHeard = listenedWords.has(w.en);
                const isPlaying = playingWord === w.en;

                return (
                  <div
                    key={w.en}
                    className={cn(
                      "group relative flex flex-col rounded-2xl border-2 border-b-4 p-4 transition-all select-none shadow-xs",
                      isHeard
                        ? "border-[#58CC02] bg-[#F7FCF0] dark:border-[#58CC02] dark:bg-[#132817]"
                        : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] hover:bg-[#F4FBFF] dark:border-[#37464F] dark:bg-[#131F24]"
                    )}
                  >
                    {/* Top Row: Word & Dual Audio Controls (Normal + Slow Turtle) */}
                    <div className="flex items-center justify-between gap-3" style={{ direction: "ltr" }}>
                      <div className="flex items-center gap-3">
                        {/* Normal Audio Button (1.0x) */}
                        <button
                          type="button"
                          onClick={() => {
                            playAudio(w.en, 0.88);
                            setListenedWords((prev) => new Set(prev).add(w.en));
                          }}
                          aria-label={`Play normal speed ${w.en}`}
                          className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-b-2 text-white transition-all shadow-xs text-xl cursor-pointer active:translate-y-[2px]",
                            isPlaying
                              ? "bg-[#1899D6] animate-pulse"
                              : isHeard
                                ? "bg-[#58CC02]"
                                : "bg-[#1CB0F6]"
                          )}
                          title="Normal Speed (1.0x)"
                        >
                          {w.icon ? <span>{w.icon}</span> : <Volume2 className="h-6 w-6" />}
                        </button>

                        {/* Slow Turtle Audio Button (0.65x) */}
                        <button
                          type="button"
                          onClick={() => {
                            playAudio(w.en, 0.65);
                            setListenedWords((prev) => new Set(prev).add(w.en));
                          }}
                          aria-label={`Play slow speed ${w.en}`}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-b-3 border-[#E5E5E5] bg-white hover:border-[#1CB0F6] hover:bg-[#F4FBFF] dark:border-[#37464F] dark:bg-[#1A262C] text-[#777777] dark:text-[#8495A0] transition-all shadow-xs cursor-pointer active:translate-y-[2px]"
                          title="Slow Speed (0.65x) / گوێگرتنی لەسەرخۆ"
                        >
                          <Turtle className="h-5 w-5 text-[#FF9600]" />
                        </button>

                        {/* Strict English Line */}
                        <div className="flex flex-col text-left">
                          <span className="text-2xl font-black text-[#4B4B4B] dark:text-white">
                            {w.en}
                          </span>
                        </div>
                      </div>

                      {/* Kurdish Badges: Strict Kurdish RTL */}
                      <KurdishGlossBadges pronunciation={w.pron} meaning={w.ku} />
                    </div>

                    {/* Dedicated Context Note Line */}
                    <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between" dir="rtl">
                      <span className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                        {w.contextKu}
                      </span>
                      <span className="font-kurdish text-[11px] text-[#AFAFAF] dark:text-[#8495A0]">
                        {isHeard ? "✓ بیستراوە" : "کلیک لە دەنگ بکە"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Professional Cultural Tip Card */}
        {slide.type === "tip_card" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFF4E5] dark:bg-[#342416] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF9600]">
                <Lightbulb className="h-4 w-4 text-[#FF9600]" />
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

            {/* Core Rule Card */}
            <div className="rounded-3xl border-2 border-b-4 border-[#FF9600] bg-[#FFFBF5] dark:bg-[#251F19] p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF9600] text-white shadow-xs">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="flex flex-col text-left" style={{ direction: "ltr" }}>
                  <span className="text-xl font-black text-[#4B4B4B] dark:text-white">
                    {slide.ruleEn}
                  </span>
                  <span className="font-kurdish text-xs font-bold text-[#FF9600]">
                    وتنی: {slide.rulePron}
                  </span>
                </div>
              </div>

              <p
                dir="rtl"
                className="mt-4 font-kurdish text-sm leading-relaxed text-[#4B4B4B] dark:text-[#D5D5D5] bg-white dark:bg-[#1A262C] p-4 rounded-2xl border border-black/5 dark:border-white/5"
              >
                {slide.tipExplanationKu}
              </p>
            </div>

            {/* Contrast Table (Bad vs Good) */}
            <div className="flex flex-col gap-3">
              <span dir="rtl" className="font-kurdish text-xs font-extrabold text-[#777777] dark:text-[#8495A0] px-1">
                نموونەی بەراورد لە پەیوەندی ڕۆژانەدا:
              </span>
              {slide.contrastPairs.map((cp, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {/* Bad / Rude approach */}
                  <div className="rounded-2xl border-2 border-b-4 border-[#FFDFE0] bg-[#FFF5F5] dark:border-[#421A1D] dark:bg-[#261517] p-3.5 flex flex-col justify-between">
                    <div className="flex items-center gap-2" style={{ direction: "ltr" }}>
                      <span className="text-xs font-black text-[#EA2B2B] bg-white dark:bg-[#131F24] px-2 py-0.5 rounded-md border border-[#EA2B2B]/20">
                        ✕ ناڕێز
                      </span>
                      <span className="text-sm font-black text-[#EA2B2B]">
                        {cp.badEn}
                      </span>
                    </div>
                    <span dir="rtl" className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0] mt-2">
                      {cp.badKu}
                    </span>
                  </div>

                  {/* Good / Polite approach */}
                  <div className="rounded-2xl border-2 border-b-4 border-[#58CC02] bg-[#F7FCF0] dark:border-[#2D451C] dark:bg-[#152817] p-3.5 flex flex-col justify-between">
                    <div className="flex items-center gap-2" style={{ direction: "ltr" }}>
                      <span className="text-xs font-black text-[#58CC02] bg-white dark:bg-[#131F24] px-2 py-0.5 rounded-md border border-[#58CC02]/20">
                        ✓ بەڕێز
                      </span>
                      <span className="text-sm font-black text-[#4B4B4B] dark:text-white">
                        {cp.goodEn}
                      </span>
                    </div>
                    <span dir="rtl" className="font-kurdish text-xs font-bold text-[#58CC02] mt-2">
                      {cp.goodKu}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Ear Training / Listen & Pick View */}
        {slide.type === "listen_pick" && (
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

            {/* Listening Station */}
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-b-4 border-[#1CB0F6] bg-[#F4FBFF] dark:bg-[#1C3342] p-8 text-center shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => playAudio(slide.audioTarget, 0.88)}
                  aria-label="Listen normal speed"
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-b-4 border-[#1899D6] bg-[#1CB0F6] text-white hover:bg-[#4FC3F9] active:translate-y-[2px] transition-all shadow-md cursor-pointer"
                  title="Normal Speed (1.0x)"
                >
                  <Volume2 className="h-8 w-8" />
                </button>
                <button
                  type="button"
                  onClick={() => playAudio(slide.audioTarget, 0.65)}
                  aria-label="Listen slow speed"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-b-4 border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C] text-[#FF9600] active:translate-y-[2px] transition-all shadow-xs cursor-pointer"
                  title="Slow Speed (0.65x)"
                >
                  <Turtle className="h-6 w-6" />
                </button>
              </div>
              <span dir="rtl" className="font-kurdish text-xs font-bold text-[#1899D6] dark:text-[#3BC0F8] mt-3">
                {slide.promptHintKu}
              </span>
            </div>

            {/* Option Cards */}
            <div className="flex flex-col gap-3">
              {slide.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={opt.textEn}
                    type="button"
                    onClick={() => {
                      playOptionSelectSound();
                      setSelectedOption(idx);
                      playAudio(opt.textEn, 0.88);
                    }}
                    className={cn(
                      "flex flex-col rounded-2xl border-2 border-b-4 p-4 text-left transition-all cursor-pointer active:translate-y-[2px]",
                      isSelected
                        ? "border-[#1899D6] bg-[#DDF4FF] dark:border-[#3BC0F8] dark:bg-[#1C3342]"
                        : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C]"
                    )}
                  >
                    {/* Dedicated English Line */}
                    <div className="flex items-center justify-between" style={{ direction: "ltr" }}>
                      <span className="text-xl font-black text-[#4B4B4B] dark:text-white">
                        {opt.textEn}
                      </span>
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
                    </div>

                    {/* Dedicated Kurdish Line with Gloss Badges */}
                    <div className="mt-2 pt-1.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between" dir="rtl">
                      <span className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                        {opt.meaningKu}
                      </span>
                      <span className="font-kurdish text-xs font-bold text-[#1899D6] dark:text-[#3BC0F8]">
                        وتنی: {opt.pronKu}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Multiple Choice View */}
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
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => playAudio(slide.audioWord!, 0.88)}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#1899D6] bg-[#1CB0F6] px-6 py-3 text-sm font-black text-white hover:bg-[#4FC3F9] active:translate-y-[2px] transition-all shadow-md cursor-pointer"
                >
                  <Volume2 className="h-5 w-5" />
                  <span>Listen (1.0x) / گوێبگرە</span>
                </button>
                <button
                  type="button"
                  onClick={() => playAudio(slide.audioWord!, 0.65)}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-b-4 border-[#E5E5E5] bg-white px-4 py-3 text-sm font-black text-[#FF9600] hover:border-[#1CB0F6] active:translate-y-[2px] transition-all shadow-xs cursor-pointer dark:border-[#37464F] dark:bg-[#1A262C]"
                  title="Slow Speed (0.65x)"
                >
                  <Turtle className="h-5 w-5" />
                </button>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {slide.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={opt.textEn}
                    type="button"
                    onClick={() => {
                      playOptionSelectSound();
                      setSelectedOption(idx);
                      playAudio(opt.textEn, 0.88);
                    }}
                    className={cn(
                      "flex flex-col rounded-2xl border-2 border-b-4 p-4 text-left transition-all cursor-pointer active:translate-y-[2px]",
                      isSelected
                        ? "border-[#1899D6] bg-[#DDF4FF] dark:border-[#3BC0F8] dark:bg-[#1C3342]"
                        : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C]"
                    )}
                  >
                    {/* Dedicated English Line */}
                    <div className="flex items-center justify-between" style={{ direction: "ltr" }}>
                      <span className="text-xl font-black text-[#4B4B4B] dark:text-white">
                        {opt.textEn}
                      </span>
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
                    </div>

                    {/* Dedicated Kurdish Line with Gloss Badges */}
                    <div className="mt-2 pt-1.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between" dir="rtl">
                      <span className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                        {opt.meaningKu}
                      </span>
                      <span className="font-kurdish text-xs font-bold text-[#1899D6] dark:text-[#3BC0F8]">
                        وتنی: {opt.pronKu}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Analytic Breakdown View */}
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
                {slide.subtitleKu} ({listenedWords.size} لە {slide.rows.length})
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
                      playAudio(row.en, 0.88);
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

        {/* 6. Status Bank: Want vs Don't Want */}
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
                {slide.subtitleKu} ({listenedWords.size} لە {slide.items.length})
              </p>
            </div>

            {/* Sentence Preview Frame */}
            <div className="rounded-3xl border-2 border-b-4 border-[#1CB0F6] bg-[#F4FBFF] dark:bg-[#1C3342] p-5 text-center shadow-xs">
              <span className="text-xs font-extrabold text-[#1899D6] dark:text-[#3BC0F8] uppercase tracking-wider">
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
                const fullPhrase = item.fullSentenceEn;
                const isHeard = listenedWords.has(item.enWord);
                const isPlaying = playingWord === fullPhrase;

                return (
                  <button
                    key={item.enWord}
                    type="button"
                    onClick={() => {
                      playAudio(fullPhrase, 0.88);
                      setListenedWords((prev) => new Set(prev).add(item.enWord));
                    }}
                    className={cn(
                      "flex flex-col rounded-2xl border-2 border-b-4 p-4 text-left transition-all cursor-pointer active:translate-y-[2px]",
                      isPlaying
                        ? "border-[#1899D6] bg-[#DDF4FF] dark:border-[#3BC0F8] dark:bg-[#1C3342] scale-102"
                        : isHeard
                          ? "border-[#58CC02] bg-[#F7FCF0] dark:border-[#58CC02] dark:bg-[#132817]"
                          : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C]"
                    )}
                  >
                    <div className="flex items-center justify-between" style={{ direction: "ltr" }}>
                      <span className="text-xl font-black text-[#4B4B4B] dark:text-white">
                        {item.enWord}
                      </span>
                      <Volume2 className="h-5 w-5 text-[#1CB0F6]" />
                    </div>
                    <div className="mt-2 pt-1 border-t border-black/5 dark:border-white/5 flex flex-col" dir="rtl">
                      <span className="font-kurdish text-sm font-bold text-[#1899D6] dark:text-[#3BC0F8]">
                        وتنی: {item.pron}
                      </span>
                      <span className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                        {item.meaning}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. Interactive Microphone View */}
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
              {/* Target phrase & dual audio */}
              <div className="flex items-center justify-center gap-3">
                <span
                  dir="ltr"
                  className="text-2xl sm:text-3xl font-black tracking-wide text-[#4B4B4B] dark:text-white select-none"
                >
                  {slide.targetWord}
                </span>
                <button
                  type="button"
                  onClick={() => playAudio(slide.targetWord, 0.88)}
                  aria-label={`Listen to ${slide.targetWord}`}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-b-4 border-[#1899D6] bg-[#1CB0F6] text-white hover:bg-[#4FC3F9] active:translate-y-[2px] transition-all shadow-xs cursor-pointer"
                  title="Normal Speed"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => playAudio(slide.targetWord, 0.65)}
                  aria-label={`Listen slow to ${slide.targetWord}`}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-b-4 border-[#E5E5E5] bg-white hover:border-[#1CB0F6] text-[#FF9600] active:translate-y-[2px] transition-all shadow-xs cursor-pointer dark:border-[#37464F] dark:bg-[#131F24]"
                  title="Slow Speed (0.65x)"
                >
                  <Turtle className="h-5 w-5" />
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
                {slide.ruleNoteKu}
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

        {/* 8. Response Pairing View */}
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
              <p
                dir="rtl"
                className="font-kurdish text-xs font-bold text-[#1CB0F6] dark:text-[#3BC0F8]"
              >
                {slide.subtitleKu}
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
                        "flex flex-col min-h-[76px] items-center justify-center rounded-2xl border-2 border-b-4 p-3 text-center transition-all cursor-pointer",
                        isMatched
                          ? "border-[#58CC02] bg-[#E8FAD4] text-[#46A302] opacity-60 cursor-default"
                          : isSelected
                            ? "border-[#1899D6] bg-[#DDF4FF] text-[#1899D6] dark:border-[#3BC0F8] dark:bg-[#1C3342] dark:text-[#3BC0F8] -translate-y-1"
                            : "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C] dark:text-white"
                      )}
                    >
                      <span className="font-sans font-black text-base">{p.en}</span>
                      <span className="font-kurdish text-[11px] text-[#AFAFAF] mt-0.5">({p.pron})</span>
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
                          "flex min-h-[76px] items-center justify-center rounded-2xl border-2 border-b-4 p-3 text-center font-kurdish transition-all cursor-pointer font-black text-base",
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

        {/* 9. Chat Dialogue View */}
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

            {/* Simulated Chat Bubble */}
            <div className="flex items-start gap-3 rounded-3xl border-2 border-b-4 border-[#E5E5E5] bg-white p-5 dark:border-[#37464F] dark:bg-[#1A262C] shadow-sm">
              <div className="shrink-0 flex items-center">
                <SquirrelMascot
                  mood="happy"
                  size={50}
                  title={slide.speakerNameKu}
                />
              </div>

              <div className="flex flex-col items-start gap-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-kurdish text-xs font-black text-[#4B4B4B] dark:text-white">
                    {slide.speakerNameKu}
                  </span>
                  <span className="text-[11px] font-bold text-[#AFAFAF]">
                    ({slide.speakerRoleEn})
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-none bg-[#F4FBFF] dark:bg-[#1C3342] border border-[#1CB0F6]/30 px-4 py-2.5">
                  <span
                    dir="ltr"
                    className="text-lg font-black text-[#4B4B4B] dark:text-white"
                  >
                    {slide.incomingMessageEn}
                  </span>
                  <button
                    type="button"
                    onClick={() => playAudio(slide.incomingMessageEn, 0.88)}
                    aria-label="Listen to message"
                    className="text-[#1899D6] hover:text-[#1CB0F6]"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-0.5" dir="rtl">
                  <span className="font-kurdish text-xs font-bold text-[#1899D6] dark:text-[#3BC0F8]">
                    وتنی: {slide.incomingPronKu}
                  </span>
                  <span className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                    ({slide.incomingMeaningKu})
                  </span>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {slide.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={opt.textEn}
                    type="button"
                    onClick={() => {
                      playOptionSelectSound();
                      setSelectedOption(idx);
                      playAudio(opt.textEn, 0.88);
                    }}
                    className={cn(
                      "flex flex-col rounded-2xl border-2 border-b-4 p-4 text-left transition-all cursor-pointer active:translate-y-[2px]",
                      isSelected
                        ? "border-[#1899D6] bg-[#DDF4FF] dark:border-[#3BC0F8] dark:bg-[#1C3342]"
                        : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C]"
                    )}
                  >
                    <div className="flex items-center justify-between" style={{ direction: "ltr" }}>
                      <span className="text-xl font-black text-[#4B4B4B] dark:text-white">
                        {opt.textEn}
                      </span>
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
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between" dir="rtl">
                      <span className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                        {opt.meaningKu}
                      </span>
                      <span className="font-kurdish text-xs font-bold text-[#1899D6] dark:text-[#3BC0F8]">
                        وتنی: {opt.pronKu}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 10. Agreement Trigger View */}
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
                  {slide.promptEn}
                </span>
                <button
                  type="button"
                  onClick={() => playAudio(slide.promptEn, 0.88)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1CB0F6] text-white shadow-xs"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
              <p
                dir="rtl"
                className="mt-2 font-kurdish text-sm font-bold text-[#1899D6] dark:text-[#3BC0F8]"
              >
                وتنی: {slide.promptPronKu} ({slide.promptMeaningKu})
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {slide.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={opt.textEn}
                    type="button"
                    onClick={() => {
                      playOptionSelectSound();
                      setSelectedOption(idx);
                      playAudio(opt.textEn, 0.88);
                    }}
                    className={cn(
                      "flex flex-col rounded-2xl border-2 border-b-4 p-4 text-left transition-all cursor-pointer active:translate-y-[2px]",
                      isSelected
                        ? "border-[#1899D6] bg-[#DDF4FF] dark:border-[#3BC0F8] dark:bg-[#1C3342]"
                        : "border-[#E5E5E5] bg-white hover:border-[#1CB0F6] dark:border-[#37464F] dark:bg-[#1A262C]"
                    )}
                  >
                    <div className="flex items-center justify-between" style={{ direction: "ltr" }}>
                      <span className="text-xl font-black text-[#4B4B4B] dark:text-white">
                        {opt.textEn}
                      </span>
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
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between" dir="rtl">
                      <span className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]">
                        {opt.meaningKu}
                      </span>
                      <span className="font-kurdish text-xs font-bold text-[#1899D6] dark:text-[#3BC0F8]">
                        وتنی: {opt.pronKu}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 11. Slot Filler View */}
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
                    ? slide.options[selectedOption].textEn.split(" ")[0]
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
                    key={opt.textEn}
                    type="button"
                    onClick={() => {
                      playOptionSelectSound();
                      setSelectedOption(idx);
                      playAudio(opt.textEn.split(" ")[0], 0.88);
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
                      {opt.textEn}
                    </span>
                    <span
                      dir="rtl"
                      className="font-kurdish text-xs font-bold text-[#777777] dark:text-[#8495A0]"
                    >
                      {opt.meaningKu}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 12. Tile Assembly View */}
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
                {slide.subtitleKu} ({slide.fullPronKu})
              </p>
            </div>

            {/* Construction Drop Zone */}
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
                      playAudio(t, 0.88);
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
              slide.type === "tip_card" ||
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
