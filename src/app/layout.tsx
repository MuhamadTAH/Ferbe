import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fêrbe - Kurdish Language Learning",
  description: "Learn Kurdish Sorani with interactive flashcards and audio pronunciation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSansArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-900/50">
        <ConvexClientProvider>
          <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
              <Link
                href="/"
                className="flex items-center gap-2.5 font-bold text-xl text-foreground transition-opacity hover:opacity-90"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-500/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-extrabold tracking-tight">Fêrbe</span>
                  <span
                    dir="rtl"
                    className="font-kurdish text-emerald-600 dark:text-emerald-400 font-semibold text-base"
                  >
                    فێربە
                  </span>
                </div>
              </Link>

              <nav className="flex items-center gap-3 sm:gap-4">
                <Link
                  href="/learn"
                  className="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Learn</span>
                </Link>
                <div className="h-4 w-px bg-border" />
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border/40">
                  Sorani Kurdish
                </span>
              </nav>
            </div>
          </header>

          <main className="flex-1 flex flex-col">{children}</main>

          <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
            <p>Fêrbe • Interactive Kurdish Sorani Language Learning</p>
          </footer>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
