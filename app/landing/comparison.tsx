type Row = {
  kriterium: string;
  uns: string | true;
  plattform: string;
  general: string;
};

const ROWS: Row[] = [
  {
    kriterium: "Festpreis-Garantie, schriftlich",
    uns: true,
    plattform: "Variable Modelle",
    general: "Üblich, oft teurer",
  },
  {
    kriterium: "Eigene Monteure (kein Sub)",
    uns: true,
    plattform: "Sub-Unternehmer",
    general: "Gemischt",
  },
  {
    kriterium: "Service vor Ort ≤ 90 Min",
    uns: true,
    plattform: "Bundesweit zentral",
    general: "Regional",
  },
  {
    kriterium: "Fokus Gewerbe > 100 kWp",
    uns: true,
    plattform: "B2C-Schwerpunkt",
    general: "Allbau",
  },
  {
    kriterium: "Förderantrag inklusive",
    uns: true,
    plattform: "Teils gegen Aufpreis",
    general: "Selten",
  },
];

export default function Comparison() {
  return (
    <section className="border-y border-[var(--line)] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="reveal max-w-3xl">
          <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--steel)]">
            Vergleich
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.01em] text-[var(--ink)] sm:text-[40px]">
            Was Sie woanders{" "}
            <span className="solar-underline">nicht zugesichert</span> bekommen.
          </h2>
        </div>

        {/* Desktop: echte Tabelle, USP-Spalte highlighted */}
        <div className="reveal mt-12 hidden overflow-hidden rounded-lg border border-[var(--line)] lg:block">
          <table className="w-full border-collapse text-[15px]">
            <thead>
              <tr className="border-b border-[var(--line)]">
                <th className="w-[36%] bg-[var(--paper)] px-6 py-5 text-left font-mono-data text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
                  Kriterium
                </th>
                <th className="relative bg-[var(--ink)] px-6 py-5 text-left text-sm font-semibold text-white">
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-1 w-full bg-[var(--solar)]"
                  />
                  Solarwerk-Süd
                </th>
                <th className="bg-[var(--paper)] px-6 py-5 text-left text-sm font-medium text-[var(--muted)]">
                  Plattform-Anbieter
                </th>
                <th className="bg-[var(--paper)] px-6 py-5 text-left text-sm font-medium text-[var(--muted)]">
                  Generalunternehmer
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.kriterium}
                  className={`border-b border-[var(--line)] last:border-b-0 ${
                    i % 2 === 1 ? "bg-[var(--paper)]/40" : ""
                  }`}
                >
                  <td className="px-6 py-5 font-medium text-[var(--ink)]">
                    {row.kriterium}
                  </td>
                  <td className="bg-[var(--ink)]/[0.03] px-6 py-5 font-medium text-[var(--ink)]">
                    {row.uns === true ? (
                      <span className="inline-flex items-center gap-2 text-[var(--leaf)]">
                        <Check />
                        Inklusive
                      </span>
                    ) : (
                      row.uns
                    )}
                  </td>
                  <td className="px-6 py-5 text-[var(--ink)]/65">
                    {row.plattform}
                  </td>
                  <td className="px-6 py-5 text-[var(--ink)]/65">
                    {row.general}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card-Stack */}
        <div className="reveal mt-10 grid gap-4 lg:hidden">
          {ROWS.map((row) => (
            <div
              key={row.kriterium}
              className="card-lift rounded-lg border border-[var(--line)] bg-white p-5"
            >
              <p className="text-sm font-semibold text-[var(--ink)]">
                {row.kriterium}
              </p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-2">
                  <dt className="font-mono-data text-[11px] uppercase tracking-wider text-[var(--muted)]">
                    Solarwerk-Süd
                  </dt>
                  <dd className="text-right font-semibold text-[var(--leaf)]">
                    {row.uns === true ? "Inklusive" : row.uns}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-mono-data text-[11px] uppercase tracking-wider text-[var(--muted)]">
                    Plattform
                  </dt>
                  <dd className="text-right text-[var(--ink)]/65">
                    {row.plattform}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-mono-data text-[11px] uppercase tracking-wider text-[var(--muted)]">
                    Generalunternehmer
                  </dt>
                  <dd className="text-right text-[var(--ink)]/65">
                    {row.general}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8.5L6.5 12L13 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
