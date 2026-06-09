const BENEFITS = [
  {
    headline: "Festpreis-Garantie.",
    body: "Was im Angebot steht, steht in der Rechnung. Keine Nachforderung, schriftlich.",
  },
  {
    headline: "Eigene Monteure, keine Sub-Unternehmer.",
    body: "Sie kennen den Vorarbeiter beim Namen. Wir auch.",
  },
  {
    headline: "20 Jahre Garantie inkl. Wartung.",
    body: "Module, Wechselrichter, Montage — eine Garantie, ein Ansprechpartner.",
  },
  {
    headline: "Nur Gewerbe.",
    body: "Kein B2C-Nebengeschäft. Wir kennen Statik, Brandschutz und Netzanschluss > 100 kWp.",
  },
  {
    headline: "Regional Süddeutschland.",
    body: "Sitz Stadtbergen bei Augsburg. Servicewagen in 90 Min in Bayrisch-Schwaben, Allgäu, Ulm und östliches BW.",
  },
];

export default function Benefits() {
  return (
    <section className="bg-[var(--paper)]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="reveal max-w-3xl">
          <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--steel)]">
            Was uns unterscheidet
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
            Fünf Dinge, die im Vertrag stehen — nicht nur im Pitch.
          </h2>
        </div>

        <ul className="reveal mt-12 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {BENEFITS.map((b, i) => (
            <li
              key={b.headline}
              className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 py-6 sm:grid-cols-[60px_1fr_2fr] sm:gap-x-10"
            >
              <span className="font-mono-data text-xs text-[var(--muted)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[18px] font-semibold leading-snug text-[var(--ink)] sm:text-[20px]">
                {b.headline}
              </h3>
              <p className="col-start-2 max-w-2xl text-[15px] leading-relaxed text-[var(--ink)]/80 sm:col-start-3 sm:row-start-1">
                {b.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
