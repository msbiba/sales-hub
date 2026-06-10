import Counter from "./counter-client";

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
          <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--steel)]">
            Was zählt: belegbare Zahlen
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.01em] text-[var(--ink)] sm:text-[40px]">
            480 Anlagen. 142 MWp installiert.{" "}
            <span className="solar-underline">Ø 7,4 Jahre</span> Amortisation.
          </h2>
        </div>

        <div className="reveal mt-14 grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3">
          <MetricBlock value={480} suffix="+" label="Gewerbe-Anlagen seit 2009" />
          <MetricBlock value={142} suffix=" MWp" label="Gesamt installiert" />
          <MetricBlock
            value={7.4}
            decimals={1}
            suffix=" J."
            label="Ø Amortisation Gewerbe"
            prefix="Ø "
          />
        </div>

        <div className="reveal mt-16 border-t border-[var(--line)] pt-10">
          <p className="font-mono-data text-[11px] uppercase tracking-wider text-[var(--muted)]">
            Auswahl bestehender Kunden
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-8">
            {LOGOS.map((l) => (
              <li
                key={l}
                className="font-mono-data text-[12px] uppercase tracking-wider text-[var(--steel)]/70 transition-colors hover:text-[var(--ink)]"
              >
                {l}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] text-[var(--muted)]">
            Demo-Daten zur Illustration des Lehr-Repos.
          </p>
        </div>
      </div>
    </section>
  );
}

function MetricBlock({
  value,
  label,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  return (
    <div className="bg-[var(--paper)] px-6 py-8 sm:px-8 sm:py-10">
      <p className="text-[44px] font-semibold leading-none tracking-tight text-[var(--ink)] sm:text-[56px]">
        <Counter
          value={value}
          decimals={decimals}
          suffix={suffix}
          prefix={prefix}
        />
      </p>
      <p className="mt-4 font-mono-data text-[11px] uppercase tracking-wider text-[var(--steel)]">
        {label}
      </p>
    </div>
  );
}
