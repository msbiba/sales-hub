import { Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import CookieBanner from "./cookie-banner-client";
import StickyCta from "./sticky-cta-client";
import RevealObserver from "./reveal-observer-client";
import Analytics from "./analytics-client";
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
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-fs-2 focus:font-semibold focus:text-white"
      >
        Zum Inhalt springen
      </a>
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--paper)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-2 sm:flex">
            <a href="/login" className="btn-ghost focus-ring text-fs-2">
              Kundenlogin
            </a>
            <a href="#termin" className="btn-secondary focus-ring text-fs-2">
              Termin buchen
              <span aria-hidden>→</span>
            </a>
          </nav>
          <a
            href="#termin"
            className="btn-secondary focus-ring text-fs-2 sm:hidden"
            style={{ padding: "0.5rem 0.75rem" }}
          >
            Termin
          </a>
        </div>
      </header>
      <main id="main">{children}</main>
      <StickyCta />
      <CookieBanner />
      <RevealObserver />
      <Analytics />
    </div>
  );
}
