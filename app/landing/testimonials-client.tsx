"use client";

import { useEffect, useRef, useState } from "react";

const CASES = [
  {
    badge: "[DEMO]",
    firma: "Maier Logistik GmbH",
    standort: "Heilbronn",
    kwp: 480,
    amortisation: 7.2,
    zitat:
      "Festpreis hat gehalten. Termin auch. Wir hatten mit beidem nicht gerechnet.",
    person: "Klaus Maier, Geschäftsführer",
  },
  {
    badge: "[DEMO]",
    firma: "Schwarzwald Kunststoff KG",
    standort: "Villingen-Schwenningen",
    kwp: 612,
    amortisation: 6.8,
    zitat:
      "Wir kennen unseren Vorarbeiter beim Namen. Bei drei früheren Anbietern wussten wir nicht, wer überhaupt auf dem Dach steht.",
    person: "Sabine Brenner, kfm. Leitung",
  },
  {
    badge: "[DEMO]",
    firma: "Allgäu Verpackung GmbH",
    standort: "Kempten",
    kwp: 340,
    amortisation: 7.9,
    zitat:
      "Drei Angebote eingeholt, eins gewählt. Sechs Monate später: keine Nachforderung. Das war's an Kommentar.",
    person: "Dr. Andrea Lehner, CFO",
  },
  {
    badge: "[DEMO]",
    firma: "Brauerei Hirsch",
    standort: "Wurmlingen",
    kwp: 215,
    amortisation: 8.1,
    zitat:
      "Unser Strom kommt jetzt vom eigenen Dach. Die Kaltlagerung läuft auf eigener Erzeugung. Bilanz: deutlich entspannter.",
    person: "Thomas Hirsch, Brauer & GF",
  },
];

export default function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!node) return;
        const cardW = node.firstElementChild?.clientWidth ?? 0;
        const gap = 24;
        const idx = Math.round(node.scrollLeft / (cardW + gap));
        setActive(Math.max(0, Math.min(CASES.length - 1, idx)));
      });
    }
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      node.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  function go(direction: 1 | -1) {
    const node = scrollerRef.current;
    if (!node) return;
    const cardW = node.firstElementChild?.clientWidth ?? 0;
    const gap = 24;
    node.scrollBy({ left: (cardW + gap) * direction, behavior: "smooth" });
  }

  function goTo(i: number) {
    const node = scrollerRef.current;
    if (!node) return;
    const cardW = node.firstElementChild?.clientWidth ?? 0;
    const gap = 24;
    node.scrollTo({ left: (cardW + gap) * i, behavior: "smooth" });
  }

  return (
    <section className="relative overflow-hidden bg-[var(--steel)] text-white">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div
        aria-hidden
        className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[var(--solar)] opacity-[0.10] blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="reveal max-w-2xl">
            <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--solar)]">
              Stimmen aus der Praxis
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.01em] text-white sm:text-[40px]">
              Was Geschäftsführer sagen — sechs Monate nach Inbetriebnahme.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Voriger Kunde"
              onClick={() => go(-1)}
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white transition-colors hover:border-[var(--solar)] hover:text-[var(--solar)]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M9 1L3 7l6 6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Nächster Kunde"
              onClick={() => go(1)}
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white transition-colors hover:border-[var(--solar)] hover:text-[var(--solar)]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M5 1l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="reveal mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CASES.map((c) => (
            <article
              key={c.firma}
              className="flex w-[88%] shrink-0 snap-start flex-col gap-5 rounded-lg bg-[var(--paper)] p-7 text-[var(--ink)] sm:w-[60%] sm:p-9 lg:w-[48%]"
            >
              <header className="flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-[16px] font-semibold text-[var(--ink)]">
                    {c.firma}
                  </p>
                  <p className="font-mono-data text-[11px] uppercase tracking-wider text-[var(--steel)]">
                    {c.standort}
                  </p>
                </div>
                <span className="font-mono-data text-[10px] uppercase tracking-wider text-[var(--muted)]">
                  {c.badge}
                </span>
              </header>
              <div className="flex gap-10 border-y border-[var(--line)] py-5">
                <div>
                  <p className="font-mono-data text-3xl font-semibold tracking-tight text-[var(--ink)]">
                    {c.kwp}
                    <span className="text-[var(--muted)]"> kWp</span>
                  </p>
                  <p className="mt-1 font-mono-data text-[10px] uppercase tracking-wider text-[var(--muted)]">
                    Anlagengröße
                  </p>
                </div>
                <div>
                  <p className="font-mono-data text-3xl font-semibold tracking-tight text-[var(--ink)]">
                    {c.amortisation.toLocaleString("de-DE")}
                    <span className="text-[var(--muted)]"> J.</span>
                  </p>
                  <p className="mt-1 font-mono-data text-[10px] uppercase tracking-wider text-[var(--muted)]">
                    Amortisation
                  </p>
                </div>
              </div>
              <blockquote className="text-[17px] leading-relaxed text-[var(--ink)]/90">
                &bdquo;{c.zitat}&ldquo;
              </blockquote>
              <p className="font-mono-data text-[11px] uppercase tracking-wider text-[var(--steel)]">
                — {c.person}
              </p>
            </article>
          ))}
        </div>

        {/* Dots */}
        <div className="reveal mt-2 flex justify-center gap-2">
          {CASES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Zu Kunde ${i + 1}`}
              onClick={() => goTo(i)}
              className={`focus-ring h-1.5 rounded-full transition-all ${
                i === active
                  ? "w-6 bg-[var(--solar)]"
                  : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
