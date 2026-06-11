import SectionEyebrow from "./section-eyebrow";

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
          <SectionEyebrow tone="steel" dot>
            Vergleich
          </SectionEyebrow>
          <h2 className="mt-4 text-fs-6 font-semibold leading-tight tracking-[-0.01em] text-[var(--ink)] sm:text-fs-7">
            Was Sie woanders{" "}
            <span className="solar-underline">nicht zugesichert</span> bekommen.
          </h2>
        </div>

        {/* Desktop: echte Tabelle, USP-Spalte highlighted (UX-007) */}
        <div className="reveal mt-12 hidden overflow-hidden rounded-lg border border-[var(--line)] lg:block">
          <table className="w-full border-collapse text-fs-3">
            <thead>
              <tr className="border-b border-[var(--line)]">
                <th
                  scope="col"
                  className="w-[36%] bg-[var(--paper)] px-6 py-5 text-left font-mono-data text-fs-1 font-medium uppercase tracking-wider text-[var(--muted)]"
                >
                  Kriterium
                </th>
                <th
                  scope="col"
                  className="relative rounded-t-lg px-6 py-5 text-left text-fs-2 font-semibold text-[var(--ink)]"
                  style={{
                    backgroundColor: "rgba(232,163,61,0.06)",
                    borderLeft: "2px solid var(--solar)",
                    borderRight: "2px solid var(--solar)",
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden
                      className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--solar)]"
                    />
                    Solarwerk-Süd
                  </span>
                </th>
                <th
                  scope="col"
                  className="bg-[var(--paper)] px-6 py-5 text-left font-mono-data text-fs-1 font-medium uppercase tracking-wider text-[var(--muted)]"
                >
                  Plattform-Anbieter
                </th>
                <th
                  scope="col"
                  className="bg-[var(--paper)] px-6 py-5 text-left font-mono-data text-fs-1 font-medium uppercase tracking-wider text-[var(--muted)]"
                >
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
                  <th
                    scope="row"
                    className="px-6 py-5 text-left font-medium text-[var(--ink)]"
                  >
                    {row.kriterium}
                  </th>
                  <td
                    className="px-6 py-5 font-medium text-[var(--ink)]"
                    style={{
                      backgroundColor: "rgba(232,163,61,0.06)",
                      borderLeft: "2px solid var(--solar)",
                      borderRight: "2px solid var(--solar)",
                    }}
                  >
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
              <p className="text-fs-2 font-semibold text-[var(--ink)]">
                {row.kriterium}
              </p>
              <dl className="mt-3 space-y-2 text-fs-2">
                <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-2">
                  <dt className="font-mono-data text-fs-1 uppercase tracking-wider text-[var(--muted)]">
                    Solarwerk-Süd
                  </dt>
                  <dd className="text-right font-semibold text-[var(--leaf)]">
                    {row.uns === true ? "Inklusive" : row.uns}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-mono-data text-fs-1 uppercase tracking-wider text-[var(--muted)]">
                    Plattform
                  </dt>
                  <dd className="text-right text-[var(--ink)]/65">
                    {row.plattform}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="font-mono-data text-fs-1 uppercase tracking-wider text-[var(--muted)]">
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
