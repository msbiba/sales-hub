import { Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import CookieBanner from "./cookie-banner-client";
import StickyCta from "./sticky-cta-client";
import RevealObserver from "./reveal-observer-client";
import Logo from "./logo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${inter.variable} ${jetbrains.variable} min-h-screen bg-[var(--paper)] font-[family-name:var(--font-inter)] text-[var(--ink)]`}
    >
      <header className="border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo />
          <a
            href="#termin"
            className="hidden rounded-md bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white hover:bg-black sm:inline-flex"
          >
            Termin buchen
          </a>
        </div>
      </header>
      {children}
      <StickyCta />
      <CookieBanner />
      <RevealObserver />
    </div>
  );
}
