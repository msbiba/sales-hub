"use client";

import { useState } from "react";
import SectionEyebrow from "./section-eyebrow";

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
          <SectionEyebrow tone="steel" dot>
            Was Kunden vor dem Termin fragen
          </SectionEyebrow>
          <h2 className="mt-4 text-fs-6 font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-fs-7">
            Fragen, die zuerst auf den Tisch kommen.
          </h2>
        </div>

        {/* UX-008: card-framed accordion */}
        <ul className="reveal mt-12 space-y-3">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            return (
              <li
                key={item.q}
                className={`rounded-lg border bg-[var(--paper)] transition-[background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpen
                    ? "border-[var(--line)] bg-[color-mix(in_srgb,var(--paper)_60%,white)]"
                    : "border-[var(--line)] hover:border-[color-mix(in_srgb,var(--ink)_15%,transparent)] hover:shadow-[0_10px_40px_-15px_rgba(14,17,22,0.25)]"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="focus-ring group flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono-data text-fs-2 text-[var(--muted)] transition-colors group-hover:text-[var(--solar)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-fs-3 font-medium text-[var(--ink)]">
                      {item.q}
                    </span>
                  </span>
                  <svg
                    aria-hidden
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? "rotate-180 text-[var(--ink)]" : "text-[var(--muted)] group-hover:text-[var(--ink)]"
                    }`}
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    className="px-6 pb-5 pl-[3.75rem] text-fs-3 leading-relaxed text-[var(--ink)]/80"
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
