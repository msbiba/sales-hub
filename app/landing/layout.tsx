import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--paper)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-2 sm:flex">
            <a
              href="/login"
              className="focus-ring rounded-md border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--steel)] hover:bg-[var(--paper)]"
            >
              Kundenlogin
            </a>
            <a
              href="#termin"
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              Termin buchen
              <span aria-hidden>→</span>
            </a>
          </nav>
          <a
            href="#termin"
            className="focus-ring rounded-md bg-[var(--ink)] px-3 py-2 text-sm font-semibold text-white sm:hidden"
          >
            Termin
          </a>
        </div>
      </header>
      {children}
      <StickyCta />
      <CookieBanner />
      <RevealObserver />
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-4NVZYT5KCY"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4NVZYT5KCY');
        `}
      </Script>
    </div>
  );
}
