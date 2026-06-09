import Counter from "./counter-client";

const CASES = [
  {
    badge: "[DEMO]",
    firma: "Maier Logistik GmbH",
    standort: "Heilbronn",
    kwp: 480,
    amortisation: 7.2,
    zitat: "„Festpreis hat gehalten. Termin auch. Wir hatten mit beidem nicht gerechnet.",
    person: "Klaus Maier, Geschäftsführer",
  },
  {
    badge: "[DEMO]",
    firma: "Schwarzwald Kunststoff KG",
    standort: "Villingen-Schwenningen",
    kwp: 612,
    amortisation: 6.8,
    zitat: "„Wir kennen unseren Vorarbeiter beim Namen. Bei drei früheren Anbietern wussten wir nicht, wer überhaupt auf dem Dach steht.",
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
    <section className="border-y border-[var(--line)] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="reveal max-w-3xl">
          <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--steel)]">
            Was zählt: belegbare Zahlen
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
            480 Anlagen. 142 MWp installiert. Ø 7,4 Jahre Amortisation.
          </h2>
        </div>

        <div className="reveal mt-12 grid gap-6 rounded-lg border border-[var(--line)] bg-[var(--paper)] p-6 sm:grid-cols-3 sm:p-8">
          <div>
            <p className="text-[36px] font-semibold leading-none text-[var(--ink)] sm:text-[44px]">
              <Counter value={480} suffix="+" />
            </p>
            <p className="mt-2 text-sm text-[var(--steel)]">
              Gewerbe-Anlagen seit 2009
            </p>
          </div>
          <div className="sm:border-l sm:border-[var(--line)] sm:pl-8">
            <p className="text-[36px] font-semibold leading-none text-[var(--ink)] sm:text-[44px]">
              <Counter value={142} suffix=" MWp" />
            </p>
            <p className="mt-2 text-sm text-[var(--steel)]">
              Gesamt installiert
            </p>
          </div>
          <div className="sm:border-l sm:border-[var(--line)] sm:pl-8">
            <p className="text-[36px] font-semibold leading-none text-[var(--ink)] sm:text-[44px]">
              Ø <Counter value={7.4} decimals={1} suffix=" J." />
            </p>
            <p className="mt-2 text-sm text-[var(--steel)]">
              Amortisation Gewerbe
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {CASES.map((c) => (
            <article
              key={c.firma}
              className="reveal flex flex-col gap-4 rounded-lg border border-[var(--line)] bg-white p-6 sm:p-7"
            >
              <header className="flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-[15px] font-semibold text-[var(--ink)]">
                    {c.firma}
                  </p>
                  <p className="text-sm text-[var(--steel)]">{c.standort}</p>
                </div>
                <span className="font-mono-data text-[10px] uppercase tracking-wider text-[var(--muted)]">
                  {c.badge}
                </span>
              </header>
              <div className="flex gap-8 border-y border-[var(--line)] py-4">
                <div>
                  <p className="font-mono-data text-2xl font-semibold text-[var(--ink)]">
                    {c.kwp} kWp
                  </p>
                  <p className="text-xs text-[var(--muted)]">Anlagengröße</p>
                </div>
                <div>
                  <p className="font-mono-data text-2xl font-semibold text-[var(--ink)]">
                    {c.amortisation.toLocaleString("de-DE")} J.
                  </p>
                  <p className="text-xs text-[var(--muted)]">Amortisation</p>
                </div>
              </div>
              <blockquote className="text-[15px] leading-relaxed text-[var(--ink)]/85">
                {c.zitat}&ldquo;
              </blockquote>
              <p className="text-sm text-[var(--steel)]">— {c.person}</p>
            </article>
          ))}
        </div>

        <div className="reveal mt-12 border-t border-[var(--line)] pt-8">
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
            Auswahl bestehender Kunden
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 lg:grid-cols-8">
            {LOGOS.map((l) => (
              <li
                key={l}
                className="font-mono-data text-[12px] uppercase tracking-wider text-[var(--steel)]/70"
              >
                {l}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-[var(--muted)]">
            Demo-Daten zur Illustration des Lehr-Repos.
          </p>
        </div>
      </div>
    </section>
  );
}
