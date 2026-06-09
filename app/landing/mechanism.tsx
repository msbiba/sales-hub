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
    <section className="bg-[var(--paper)]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="reveal max-w-3xl">
          <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--steel)]">
            So läuft Ihr Projekt
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
            Vier Schritte, ein Ansprechpartner, ein Termin am Ende.
          </h2>
        </div>

        <ol className="reveal mt-14 grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-3 bg-white p-6 sm:p-7"
            >
              <span className="font-mono-data text-xs uppercase tracking-wider text-[var(--solar)]">
                {String(i + 1).padStart(2, "0")} · {step.when}
              </span>
              <h3 className="text-[17px] font-semibold leading-snug text-[var(--ink)]">
                {step.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-[var(--ink)]/75">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
