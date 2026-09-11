"use client";

import { useState } from "react";
import { Volume2, Sparkles, CheckCircle2 } from "lucide-react";

interface KurdishLetter {
  char: string;
  name: string;
  latin: string;
  ipa: string;
  isDistinctKurdish?: boolean;
  isVowel?: boolean;
  exampleKurdish: string;
  exampleTranslit: string;
  exampleEnglish: string;
}

const KURDISH_ALPHABET: KurdishLetter[] = [
  { char: "ئ", name: "Hemze", latin: "’", ipa: "/ʔ/", exampleKurdish: "ئاو", exampleTranslit: "Aw", exampleEnglish: "Water" },
  { char: "ا", name: "Alif", latin: "A / Â", ipa: "/aː/", isVowel: true, exampleKurdish: "ئاسمان", exampleTranslit: "Asman", exampleEnglish: "Sky" },
  { char: "ب", name: "Bê", latin: "B", ipa: "/b/", exampleKurdish: "باوک", exampleTranslit: "Bawk", exampleEnglish: "Father" },
  { char: "پ", name: "Pê", latin: "P", ipa: "/p/", isDistinctKurdish: true, exampleKurdish: "پشیلە", exampleTranslit: "Pshîla", exampleEnglish: "Cat" },
  { char: "ت", name: "Tê", latin: "T", ipa: "/t/", exampleKurdish: "تۆ", exampleTranslit: "To", exampleEnglish: "You" },
  { char: "ج", name: "Cîm", latin: "J / C", ipa: "/d͡ʒ/", exampleKurdish: "جوان", exampleTranslit: "Jwan", exampleEnglish: "Beautiful" },
  { char: "چ", name: "Çîm", latin: "Ch / Ç", ipa: "/t͡ʃ/", isDistinctKurdish: true, exampleKurdish: "چاو", exampleTranslit: "Chaw", exampleEnglish: "Eye" },
  { char: "ح", name: "Hâyî hettî", latin: "H", ipa: "/ħ/", exampleKurdish: "حەز", exampleTranslit: "Haz", exampleEnglish: "Desire" },
  { char: "خ", name: "Xê", latin: "Kh / X", ipa: "/x/", exampleKurdish: "خۆش", exampleTranslit: "Xosh", exampleEnglish: "Pleasant / Good" },
  { char: "د", name: "Dal", latin: "D", ipa: "/d/", exampleKurdish: "دەرگا", exampleTranslit: "Darga", exampleEnglish: "Door" },
  { char: "ر", name: "Rê (Tap)", latin: "R", ipa: "/ɾ/", exampleKurdish: "برا", exampleTranslit: "Bra", exampleEnglish: "Brother" },
  { char: "ڕ", name: "Rêyî qelew (Trill)", latin: "Rr / Ř", ipa: "/r/", isDistinctKurdish: true, exampleKurdish: "ڕێگا", exampleTranslit: "Rêga", exampleEnglish: "Road / Way" },
  { char: "ز", name: "Zê", latin: "Z", ipa: "/z/", exampleKurdish: "زستان", exampleTranslit: "Zstan", exampleEnglish: "Winter" },
  { char: "ژ", name: "Jê", latin: "Zh / Ž", ipa: "/ʒ/", isDistinctKurdish: true, exampleKurdish: "ژین", exampleTranslit: "Zhîn", exampleEnglish: "Life" },
  { char: "س", name: "Sîn", latin: "S", ipa: "/s/", exampleKurdish: "سێو", exampleTranslit: "Sêw", exampleEnglish: "Apple" },
  { char: "ش", name: "Şîn", latin: "Sh / Ş", ipa: "/ʃ/", exampleKurdish: "شەو", exampleTranslit: "Shaw", exampleEnglish: "Night" },
  { char: "ع", name: "Eyn", latin: "‘E", ipa: "/ʕ/", exampleKurdish: "عەسر", exampleTranslit: "‘Asr", exampleEnglish: "Afternoon" },
  { char: "غ", name: "Xeyn", latin: "Gh / G̈", ipa: "/ɣ/", exampleKurdish: "غەم", exampleTranslit: "Gham", exampleEnglish: "Sorrow" },
  { char: "ف", name: "Fê", latin: "F", ipa: "/f/", exampleKurdish: "فڕۆکە", exampleTranslit: "Froka", exampleEnglish: "Airplane" },
  { char: "ڤ", name: "Vê", latin: "V", ipa: "/v/", isDistinctKurdish: true, exampleKurdish: "ڤیان", exampleTranslit: "Vyan", exampleEnglish: "Love / Harmony" },
  { char: "ق", name: "Qaf", latin: "Q", ipa: "/q/", exampleKurdish: "قەڵەم", exampleTranslit: "Qalam", exampleEnglish: "Pen" },
  { char: "ک", name: "Kaf", latin: "K", ipa: "/k/", exampleKurdish: "کتێب", exampleTranslit: "Ktêb", exampleEnglish: "Book" },
  { char: "گ", name: "Gaf", latin: "G", ipa: "/ɡ/", isDistinctKurdish: true, exampleKurdish: "گوڵ", exampleTranslit: "Gul", exampleEnglish: "Flower / Rose" },
  { char: "ل", name: "Lam (Light)", latin: "L", ipa: "/l/", exampleKurdish: "لاو", exampleTranslit: "Law", exampleEnglish: "Youth" },
  { char: "ڵ", name: "Lamî qelew (Dark)", latin: "Ll / Ł", ipa: "/ɫ/", isDistinctKurdish: true, exampleKurdish: "ماڵ", exampleTranslit: "Mal", exampleEnglish: "Home" },
  { char: "م", name: "Mîm", latin: "M", ipa: "/m/", exampleKurdish: "مانگ", exampleTranslit: "Mang", exampleEnglish: "Moon / Month" },
  { char: "ن", name: "Nûn", latin: "N", ipa: "/n/", exampleKurdish: "نان", exampleTranslit: "Nan", exampleEnglish: "Bread" },
  { char: "و", name: "Waw", latin: "W / U", ipa: "/w, ʊ/", isVowel: true, exampleKurdish: "وەرز", exampleTranslit: "Warz", exampleEnglish: "Season" },
  { char: "ۆ", name: "Ô (Long O)", latin: "O / Ô", ipa: "/oː/", isDistinctKurdish: true, isVowel: true, exampleKurdish: "کۆڵان", exampleTranslit: "Kolan", exampleEnglish: "Alley" },
  { char: "وو", name: "Û (Long U)", latin: "Û / Ww", ipa: "/uː/", isVowel: true, exampleKurdish: "روو", exampleTranslit: "Rû", exampleEnglish: "Face" },
  { char: "هـ", name: "Hê", latin: "H", ipa: "/h/", exampleKurdish: "هەتاو", exampleTranslit: "Hataw", exampleEnglish: "Sunshine" },
  { char: "ە", name: "E (Short Vowel)", latin: "E", ipa: "/æ, ɛ/", isVowel: true, exampleKurdish: "بەفر", exampleTranslit: "Bafr", exampleEnglish: "Snow" },
  { char: "ی", name: "Yê / Î", latin: "Y / Î", ipa: "/j, iː/", isVowel: true, exampleKurdish: "یار", exampleTranslit: "Yar", exampleEnglish: "Friend / Companion" },
  { char: "ێ", name: "Ê (Long E)", latin: "Ê", ipa: "/eː/", isDistinctKurdish: true, isVowel: true, exampleKurdish: "ئێوارە", exampleTranslit: "Êwara", exampleEnglish: "Evening" },
];

export function KurdishAlphabetView() {
  const [selectedLetter, setSelectedLetter] = useState<KurdishLetter | null>(
    KURDISH_ALPHABET[3] // Pê selected by default to highlight unique Kurdish letter
  );
  const [filterMode, setFilterMode] = useState<"all" | "distinct" | "vowels">("all");
  const [practicedChars, setPracticedChars] = useState<Set<string>>(new Set());

  const filtered = KURDISH_ALPHABET.filter((l) => {
    if (filterMode === "distinct") return l.isDistinctKurdish;
    if (filterMode === "vowels") return l.isVowel;
    return true;
  });

  const playPronunciation = (char: string) => {
    setPracticedChars((prev) => new Set(prev).add(char));
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(char);
      utterance.lang = "ku";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="rounded-3xl border-2 border-[#84D8FF] bg-[#DDF4FF] p-6 text-[#1899D6] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1CB0F6] text-white shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#1899D6]">
              Kurdish Sorani Alphabet (ئەلفوبێی کوردی)
            </h2>
            <p className="text-xs font-medium text-[#4B4B4B] sm:text-sm">
              Sorani Kurdish uses 34 letters in the Perso-Arabic script, written from right to left.
              Letters with special diacritics (پ, چ, ژ, ڤ, گ, ڵ, ڕ, ۆ, ێ) are uniquely Kurdish.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all ${
              filterMode === "all"
                ? "bg-[#1CB0F6] text-white shadow-sm"
                : "bg-white text-[#777777] hover:bg-[#F7F7F7]"
            }`}
          >
            All Letters ({KURDISH_ALPHABET.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("distinct")}
            className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all ${
              filterMode === "distinct"
                ? "bg-[#58CC02] text-white shadow-sm"
                : "bg-white text-[#777777] hover:bg-[#F7F7F7]"
            }`}
          >
            Distinct Kurdish Letters (9)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("vowels")}
            className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all ${
              filterMode === "vowels"
                ? "bg-[#FF9600] text-white shadow-sm"
                : "bg-white text-[#777777] hover:bg-[#F7F7F7]"
            }`}
          >
            Vowels (7)
          </button>
        </div>
      </div>

      {/* Main Grid & Detail Inspector */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Letters Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-7">
            {filtered.map((item) => {
              const isSelected = selectedLetter?.char === item.char;
              const hasPracticed = practicedChars.has(item.char);

              return (
                <button
                  key={item.char}
                  type="button"
                  onClick={() => {
                    setSelectedLetter(item);
                    playPronunciation(item.char);
                  }}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border-b-4 p-3 transition-all active:translate-y-[2px] active:border-b-2 ${
                    isSelected
                      ? "border-[#1899D6] bg-[#1CB0F6] text-white shadow-md shadow-[#1CB0F6]/30"
                      : item.isDistinctKurdish
                      ? "border-[#46A302] bg-[#E8FAD4] text-[#46A302] hover:bg-[#D3F5B2]"
                      : "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:border-[#CCCCCC] hover:bg-[#FAFAFA]"
                  }`}
                >
                  {hasPracticed && (
                    <CheckCircle2
                      className={`absolute right-1 top-1 h-3.5 w-3.5 ${
                        isSelected ? "text-white" : "text-[#58CC02]"
                      }`}
                    />
                  )}
                  <span
                    dir="rtl"
                    className="font-kurdish text-2xl font-bold leading-tight"
                  >
                    {item.char}
                  </span>
                  <span
                    className={`mt-1 text-[11px] font-extrabold uppercase tracking-wide ${
                      isSelected ? "text-white/90" : "text-[#777777]"
                    }`}
                  >
                    {item.latin}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Letter Detail Card */}
        {selectedLetter && (
          <div className="rounded-3xl border-2 border-[#E5E5E5] bg-white p-6 shadow-sm">
            <div className="text-center">
              <span
                dir="rtl"
                className="inline-block font-kurdish text-6xl font-bold text-[#58CC02]"
              >
                {selectedLetter.char}
              </span>
              <h3 className="mt-2 text-xl font-extrabold text-[#4B4B4B]">
                {selectedLetter.name}
              </h3>
              <p className="text-sm font-bold text-[#777777]">
                Latin: <span className="text-[#1CB0F6]">{selectedLetter.latin}</span> · IPA:{" "}
                <span className="font-mono text-xs">{selectedLetter.ipa}</span>
              </p>

              {selectedLetter.isDistinctKurdish && (
                <span className="mt-3 inline-block rounded-full bg-[#E8FAD4] px-3 py-1 text-[11px] font-extrabold text-[#58CC02]">
                  Distinct Kurdish Letter
                </span>
              )}

              {/* Audio Playback Button */}
              <button
                type="button"
                onClick={() => playPronunciation(selectedLetter.char)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-[#1899D6] bg-[#1CB0F6] py-3 text-sm font-extrabold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#4FC3F9] active:translate-y-[2px] active:border-b-2"
              >
                <Volume2 className="h-5 w-5" />
                <span>Hear Sound</span>
              </button>
            </div>

            {/* Example Vocabulary Phrase */}
            <div className="mt-6 border-t-2 border-[#E5E5E5] pt-5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#AFAFAF]">
                Example Word
              </span>
              <div className="mt-2 rounded-2xl bg-[#F7F7F7] p-4 text-center">
                <span
                  dir="rtl"
                  className="font-kurdish text-2xl font-bold text-[#4B4B4B]"
                >
                  {selectedLetter.exampleKurdish}
                </span>
                <p className="mt-1 text-sm font-extrabold text-[#1CB0F6]">
                  {selectedLetter.exampleTranslit}
                </p>
                <p className="text-xs font-bold text-[#777777]">
                  &ldquo;{selectedLetter.exampleEnglish}&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
