import SectionEyebrow from "./section-eyebrow";

const STEPS = [
  {
    when: "Tag 1–3",
    title: "Dach-Analyse vor Ort",
    detail:
      "Drohnen-Befliegung, Statik-Check, Verschattungs-Simulation. Ein Ingenieur, kein Vertriebler.",
  },
  {
    when: "Tag 4–14",
    title: "Festpreis-Angebot + Förderantrag",
    detail:
      "Schriftlicher Festpreis ohne Nachforderungs-Klauseln. KfW-, EEG- und Landesförderung beantragen wir.",
  },
  {
    when: "Woche 4–8",
    title: "Montage durch eigene Monteure",
    detail:
      "Keine Subunternehmer. Vorarbeiter mit Klarnamen und Direktnummer. Inkl. Brandschutz-Abnahme.",
  },
  {
    when: "Ab Woche 8",
    title: "Netzanschluss + 20 Jahre Wartung",
    detail:
      "Inbetriebnahme inkl. Monitoring-Setup. Wartung, Reinigung und Garantie-Service inklusive.",
  },
];

export default function Mechanism() {
  return (
    <section className="relative bg-[var(--paper)]">
      <div
        aria-hidden
        className="absolute inset-0 grid-pattern opacity-50"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <SectionEyebrow tone="steel" dot>
              So läuft Ihr Projekt
            </SectionEyebrow>
            <h2 className="mt-4 text-fs-6 font-semibold leading-tight tracking-[-0.01em] text-[var(--ink)] sm:text-fs-7">
              Vier Schritte, ein Ansprechpartner,{" "}
              <span className="solar-underline">ein Termin</span> am Ende.
            </h2>
          </div>
          <p className="font-mono-data text-fs-1 uppercase tracking-wider text-[var(--muted)]">
            Ø 8 Wochen bis Netzanschluss
          </p>
        </div>

        <ol className="reveal mt-14 grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="card-lift group flex flex-col gap-4 border border-transparent bg-white p-7 sm:p-8"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono-data text-fs-5 font-semibold leading-none text-[var(--ink)]/15 transition-colors group-hover:text-[var(--solar)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono-data text-fs-1 uppercase tracking-wider text-[var(--solar)]">
                  {step.when}
                </span>
              </div>
              <h3 className="text-fs-4 font-semibold leading-snug text-[var(--ink)]">
                {step.title}
              </h3>
              <p className="text-fs-2 leading-relaxed text-[var(--ink)]/70">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
