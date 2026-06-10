"use client";

import { useState } from "react";

const FAQ = [
  {
    q: "Was, wenn der Strompreis wieder fällt?",
    a: "Selbst beim Industriestrom-Tief 2020 lagen Gewerbepreise > 15 ct/kWh. Unsere Rechnung amortisiert sich auch bei dauerhaft 18 ct/kWh in unter 11 Jahren — getragen wird die Anlage zusätzlich durch die Einspeisevergütung, die gesetzlich für 20 Jahre fixiert ist.",
  },
  {
    q: "Wer haftet bei Schäden am Dach während Montage?",
    a: "Wir. Vollumfänglich. Solarwerk-Süd hat eine erweiterte Bauleistungs- und Montage-Versicherung mit 5 Mio. € Deckung pro Schadenfall. Subunternehmer-Haftungslücken gibt es bei uns nicht — wir arbeiten ausschließlich mit eigenen Monteuren.",
  },
  {
    q: "Was passiert nach 20 Jahren mit den Modulen?",
    a: "Module verlieren typischerweise 0,5 % Leistung pro Jahr und arbeiten nach 25 Jahren noch mit ~87 % Nennleistung. Sie können weiter betrieben werden (kein Förder-Anspruch mehr, aber Eigenverbrauch lohnt sich weiterhin) oder gegen neue Module getauscht werden — Rück- und Recyclingsystem ist herstellerseitig vorgesehen.",
  },
  {
    q: "Wir sind Mieter / Erbbaurecht — geht das auch?",
    a: "Ja, mit Zustimmung des Eigentümers. Wir liefern auf Wunsch einen Mustervertrag für die PV-Nutzungs-Vereinbarung. Bei Erbbau ist die Restlaufzeit relevant — wir prüfen das im Erstgespräch.",
  },
  {
    q: "Wie lange dauert Förderantrag und wer macht das?",
    a: "Wir machen das. KfW 270 ist innerhalb von 2-3 Wochen entschieden, Landesförderprogramme (Bayern, BW) variieren. Sie unterschreiben einmal, wir kümmern uns um Anträge, Nachreichungen und Auszahlung.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[var(--paper)]">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <div className="reveal">
          <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--steel)]">
            Was Kunden vor dem Termin fragen
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
            Fragen, die zuerst auf den Tisch kommen.
          </h2>
        </div>

        <ul className="reveal mt-12 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="focus-ring group flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono-data text-[11px] text-[var(--muted)] transition-colors group-hover:text-[var(--solar)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[17px] font-semibold text-[var(--ink)]">
                      {item.q}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`shrink-0 rounded-full border border-[var(--line)] p-1.5 transition-all ${
                      isOpen
                        ? "rotate-45 border-[var(--solar)] bg-[var(--solar)] text-[var(--ink)]"
                        : "text-[var(--steel)] group-hover:border-[var(--steel)]"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M9 3v12M3 9h12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    className="pb-7 pl-10 pr-10 text-[15px] leading-relaxed text-[var(--ink)]/80"
                  >
                    {item.a}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
