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
      suppressHydrationWarning
      className={`${inter.variable} ${nunito.variable} ${notoSansArabic.variable} h-full antialiased dark`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var urlParams = new URLSearchParams(window.location.search);
                var themeParam = urlParams.get('theme');
                if (themeParam === 'light') {
                  document.documentElement.classList.remove('dark');
                } else if (themeParam === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  var theme = localStorage.getItem('ferbe_theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                }
              } catch (e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-white dark:bg-[#131F24] text-[#4B4B4B] dark:text-white antialiased transition-colors">
        <ConvexClientProvider>
          <div className="flex min-h-screen bg-white dark:bg-[#131F24]">
            <SidebarNav />
            <div className="flex flex-1 flex-col pb-16 lg:pb-0 bg-white dark:bg-[#131F24]">
              <AppHeader />
              <main className="flex flex-1 flex-col bg-white dark:bg-[#131F24]">{children}</main>
            </div>
          </div>
          <MobileNav />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
