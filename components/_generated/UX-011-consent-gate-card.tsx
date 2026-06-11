// UX-011 — Cal.com consent-gate card
// Spec source: reports/audit-ux-2026-06-11-0824-slscrm.vercel.app.md UX-011.magic_prompt
// Production copy at app/landing/consent-gate-card.tsx.

"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import PrimaryCTA from "./UX-004-primary-cta";

export default function ConsentGateCard({
  heading,
  body,
  ctaLabel,
  onConsent,
  footnote,
}: {
  heading: string;
  body: string;
  ctaLabel: string;
  onConsent: () => Promise<void> | void;
  footnote?: React.ReactNode;
}) {
  const [loading, setLoading] = React.useState(false);

  async function handle() {
    if (loading) return;
    setLoading(true);
    try {
      await onConsent();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-lg bg-[var(--ink)] text-white shadow-[0_10px_40px_-15px_rgba(14,17,22,0.25)] md:aspect-[16/9]"
        style={{ isolation: "isolate" }}
      >
        {/* subtle noise overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:3px_3px]"
        />
        <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6 py-12 text-center">
          <CalendarDays size={28} className="text-[var(--solar)]" />
          <h3 className="text-fs-5 font-semibold tracking-[-0.01em] text-white">
            {heading}
          </h3>
          <p className="max-w-[56ch] text-fs-2 leading-relaxed text-white/70">
            {body}
          </p>
          <PrimaryCTA as="button" onClick={handle} disabled={loading}>
            {loading ? "Lädt …" : ctaLabel}
          </PrimaryCTA>
        </div>
      </div>
      {footnote && (
        <p className="mt-3 font-mono-data text-fs-1 text-[var(--muted)]">
          {footnote}
        </p>
      )}
    </div>
  );
}
