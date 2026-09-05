import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Volume2, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center gap-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Learn Kurdish Sorani with Audio & Flashcards</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Master Kurdish with{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Fêrbe
          </span>
          <span
            dir="rtl"
            className="block mt-2 font-kurdish font-bold text-3xl sm:text-5xl text-emerald-600 dark:text-emerald-400"
          >
            فێربوونی زمانی کوردی
          </span>
        </h1>

        <p className="max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed">
          Interactive Kurdish flashcards with accurate Sorani calligraphy,
          phonetic pronunciation, native audio triggers, and personal progress tracking.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
          <Button asChild size="lg" className="w-full sm:w-auto gap-2 text-base h-13 px-8 shadow-md">
            <Link href="/learn">
              <BookOpen className="h-5 w-5" />
              <span>Start Learning Now</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 w-full text-left">
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-xs">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2.5">
              <span dir="rtl" className="font-kurdish font-bold text-base">ک</span>
            </div>
            <h2 className="font-semibold text-sm mb-1">RTL Kurdish Typography</h2>
            <p className="text-xs text-muted-foreground">Authentic Kurdish Sorani script with unbroken cursive ligatures.</p>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-xs">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2.5">
              <Volume2 className="h-4 w-4" />
            </div>
            <h2 className="font-semibold text-sm mb-1">Dual Audio Pronunciation</h2>
            <p className="text-xs text-muted-foreground">Hear Kurdish and English audio pronunciations independently.</p>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-xs">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-2.5">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h2 className="font-semibold text-sm mb-1">Convex Progress Tracking</h2>
            <p className="text-xs text-muted-foreground">Securely save mastered words in your Convex database.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
