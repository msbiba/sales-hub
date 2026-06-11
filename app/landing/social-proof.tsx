import Counter from "./counter-client";
import SectionEyebrow from "./section-eyebrow";
import DemoTag from "./demo-tag";
import BentoMetric, { BentoGrid } from "./bento-metric";

const CASES = [
  {
firma: "Maier Logistik GmbH",
    standort: "Heilbronn",
    kwp: 480,
    amortisation: 7.2,
    zitat:
      "„Festpreis hat gehalten. Termin auch. Wir hatten mit beidem nicht gerechnet.",
    person: "Klaus Maier, Geschäftsführer",
  },
  {
firma: "Schwarzwald Kunststoff KG",
    standort: "Villingen-Schwenningen",
    kwp: 612,
    amortisation: 6.8,
    zitat:
      "„Wir kennen unseren Vorarbeiter beim Namen. Bei drei früheren Anbietern wussten wir nicht, wer überhaupt auf dem Dach steht.",
    person: "Sabine Brenner, kfm. Leitung",
  },
];

const LOGOS = [
  "Maier Logistik",
  "Schwarzwald KS",
  "Hofbauer Halle",
  "Reichert AG",
  "Allgäu Verpackung",
  "Donau Stahl",
  "Wagner Metall",
  "Brauerei Hirsch",
];

export default function SocialProof() {
  return (
    <section className="border-b border-[var(--line)] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="reveal max-w-3xl">
          <SectionEyebrow tone="steel" dot>
            Was zählt: belegbare Zahlen
          </SectionEyebrow>
          <h2 className="mt-4 text-fs-6 font-semibold leading-tight tracking-[-0.01em] text-[var(--ink)] sm:text-fs-7">
            480 Anlagen. 142 MWp installiert.{" "}
            <span className="solar-underline">Ø 7,4 Jahre</span> Amortisation.
          </h2>
        </div>

        {/* UX-005: bento metric grid */}
        <div className="reveal mt-14">
          <BentoGrid cols={3}>
            <BentoMetric
              eyebrow="Gewerbe-Anlagen seit 2009"
              value={<Counter value={480} suffix="+" />}
            />
            <BentoMetric
              eyebrow="Gesamt installiert"
              value={<Counter value={142} suffix=" MWp" />}
            />
            <BentoMetric
              eyebrow="Ø Amortisation Gewerbe"
              value={<Counter value={7.4} decimals={1} suffix=" J." prefix="Ø " />}
            />
          </BentoGrid>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {CASES.map((c) => (
            <article
              key={c.firma}
              className="reveal card-lift flex flex-col gap-5 rounded-lg border border-[var(--line)] bg-white p-7 sm:p-8"
            >
              <header className="flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-fs-3 font-semibold text-[var(--ink)]">
                    {c.firma}
                  </p>
                  <p className="font-mono-data text-fs-1 uppercase tracking-wider text-[var(--steel)]">
                    {c.standort}
                  </p>
                </div>
                <DemoTag tone="muted" dot>
                  Demo
                </DemoTag>
              </header>
              <div className="flex gap-10 border-y border-[var(--line)] py-5">
                <div>
                  <p className="font-mono-data text-fs-6 font-semibold tracking-tight text-[var(--ink)]">
                    {c.kwp}
                    <span className="text-[var(--muted)]"> kWp</span>
                  </p>
                  <p className="mt-1 font-mono-data text-fs-1 uppercase tracking-wider text-[var(--muted)]">
                    Anlagengröße
                  </p>
                </div>
                <div>
                  <p className="font-mono-data text-fs-6 font-semibold tracking-tight text-[var(--ink)]">
                    {c.amortisation.toLocaleString("de-DE")}
                    <span className="text-[var(--muted)]"> J.</span>
                  </p>
                  <p className="mt-1 font-mono-data text-fs-1 uppercase tracking-wider text-[var(--muted)]">
                    Amortisation
                  </p>
                </div>
              </div>
              <blockquote className="text-fs-3 leading-relaxed text-[var(--ink)]/85">
                {c.zitat}&ldquo;
              </blockquote>
              <p className="font-mono-data text-fs-1 uppercase tracking-wider text-[var(--steel)]">
                — {c.person}
              </p>
            </article>
          ))}
        </div>

        <div className="reveal mt-16 border-t border-[var(--line)] pt-10">
          <p className="font-mono-data text-fs-1 uppercase tracking-wider text-[var(--muted)]">
            Auswahl bestehender Kunden
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-8">
            {LOGOS.map((l) => (
              <li
                key={l}
                className="font-mono-data text-fs-1 uppercase tracking-wider text-[var(--steel)]/70 transition-colors hover:text-[var(--ink)]"
              >
                {l}
              </li>
            ))}
          </ul>
          <p className="mt-4 inline-flex items-center gap-2 text-fs-1 text-[var(--muted)]">
            <DemoTag tone="muted" dot>
              Demo
            </DemoTag>
            Daten zur Illustration des Lehr-Repos.
          </p>
        </div>
      </div>
    </section>
  );
}

