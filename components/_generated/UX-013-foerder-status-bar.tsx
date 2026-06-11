// UX-013 — Live Förder-status mini-bento
// Spec source: reports/audit-ux-2026-06-11-0824-slscrm.vercel.app.md UX-013.magic_prompt
// Reuses BentoMetric (UX-005). Production copy at app/landing/foerder-ticker.tsx.

import BentoMetric, { BentoGrid } from "./UX-005-bento-metric";

export default function FoerderStatusBar() {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto max-w-6xl px-6 py-3">
        <BentoGrid cols={3}>
          <BentoMetric
            tone="leaf"
            live
            eyebrow="Status"
            value="Live"
            caption="Stand 01.06.2026"
          />
          <BentoMetric
            tone="neutral"
            eyebrow="KfW 270"
            value="12,3 Mio €"
            caption="Restbudget verfügbar"
          />
          <BentoMetric
            tone="solar"
            eyebrow="§6 EEG"
            value="31.12.2026"
            caption="Förderfenster endet"
          />
        </BentoGrid>
      </div>
    </section>
  );
}
