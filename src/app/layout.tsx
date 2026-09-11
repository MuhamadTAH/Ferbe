import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic, Nunito } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { AppHeader } from "@/components/AppHeader";
import { SidebarNav } from "@/components/navigation/SidebarNav";
import { MobileNav } from "@/components/navigation/MobileNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fêrbe — Learn Kurdish Sorani",
  description:
    "Learn Kurdish Sorani with Duolingo-style lessons: multiple choice, word bank and audio exercises, hearts, streaks and XP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${nunito.variable} ${notoSansArabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#F7F7F7] text-[#4B4B4B] antialiased">
        <ConvexClientProvider>
          <div className="flex min-h-screen">
            <SidebarNav />
            <div className="flex flex-1 flex-col pb-16 lg:pb-0">
              <AppHeader />
              <main className="flex flex-1 flex-col">{children}</main>
            </div>
          </div>
          <MobileNav />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
