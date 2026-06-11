"use client";

import { useMemo, useState } from "react";
import {
  berechne,
  formatEuro,
  formatZahl,
  type RechnerOutput,
} from "./rechner-formel";
import SectionEyebrow from "./section-eyebrow";
import BrandedSlider from "./branded-slider";
import BrandedSelect from "./branded-select";
import BrandedCheckbox from "./branded-checkbox";

type SubmitStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const DACHTYP_OPTIONS = [
  { value: "trapezblech", label: "Trapezblech" },
  { value: "bitumen", label: "Bitumen" },
  { value: "ziegel", label: "Ziegel" },
  { value: "andere", label: "Andere" },
];

export default function Rechner() {
  const [dach, setDach] = useState(1000);
  const [verbrauch, setVerbrauch] = useState(200_000);
  const [strompreis, setStrompreis] = useState(27);
  const [dachtyp, setDachtyp] = useState("trapezblech");
  const [bestehendePv, setBestehendePv] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>({ kind: "idle" });

  const result: RechnerOutput = useMemo(
    () =>
      berechne({
        dachflaecheM2: dach,
        verbrauchKwh: verbrauch,
        strompreisCt: strompreis,
      }),
    [dach, verbrauch, strompreis],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "rechner",
          email,
          dachflaecheM2: dach,
          verbrauchKwh: verbrauch,
          strompreisCt: strompreis,
          dachtyp,
          bestehendePv,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Fehler beim Senden");
      }
      setStatus({ kind: "success" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler";
      setStatus({ kind: "error", message });
    }
  }

  const amortisationLabel = isFinite(result.amortisationJahre)
    ? `${formatZahl(result.amortisationJahre, 1)} Jahre`
    : "—";
  const ertragLabel = `${formatEuro(result.ertragGesamtProJahrEur)} / Jahr`;

  const secondary: { label: string; value: string }[] = [
    { label: "Anlagengröße", value: `${formatZahl(result.kWp, 1)} kWp` },
    { label: "Jahresertrag", value: `${formatZahl(result.jahresertragKwh)} kWh` },
    {
      label: "Einsparung Strom",
      value: `${formatEuro(result.einsparungProJahrEur)} / Jahr`,
    },
    {
      label: "Einspeise-Vergütung",
      value: `${formatEuro(result.einspeiseverguetungProJahrEur)} / Jahr`,
    },
    { label: "Investition (netto)", value: `${formatEuro(result.investitionEur)}` },
    {
      label: "CO₂ vermieden",
      value: `${formatZahl(result.co2EinsparungProJahrT, 1)} t / Jahr`,
    },
  ];

  return (
    <section
      id="rechner"
      className="border-y border-[var(--line)] bg-white scroll-mt-16"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="reveal max-w-3xl">
          <SectionEyebrow tone="steel" dot>
            Selbst nachrechnen
          </SectionEyebrow>
          <h2 className="mt-4 text-fs-6 font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-fs-7">
            Was kann Ihr Hallendach? In 30 Sekunden.
          </h2>
          <p className="mt-4 text-fs-3 leading-relaxed text-[var(--ink)]/75">
            Konservative Schätzwerte für Süddeutschland. Keine Verkaufs-Magie,
            keine Optimismus-Filter. Eine Detail-Berechnung folgt nach
            Drohnen-Befliegung.
          </p>
        </div>

        <div className="reveal mt-12 grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div className="space-y-8">
            <BrandedSlider
              label="Dachfläche"
              value={dach}
              min={200}
              max={10000}
              step={50}
              unit=" m²"
              onChange={setDach}
            />
            <BrandedSlider
              label="Jahres-Stromverbrauch"
              value={verbrauch}
              min={20_000}
              max={2_000_000}
              step={5000}
              unit=" kWh"
              onChange={setVerbrauch}
            />
            <BrandedSlider
              label="Aktueller Strompreis"
              value={strompreis}
              min={15}
              max={45}
              step={0.5}
              decimals={1}
              unit=" ct/kWh"
              onChange={setStrompreis}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <BrandedSelect
                label="Dach-Typ"
                value={dachtyp}
                options={DACHTYP_OPTIONS}
                onChange={setDachtyp}
              />
              <div className="flex items-center self-end rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5">
                <BrandedCheckbox
                  checked={bestehendePv}
                  onChange={setBestehendePv}
                  label="Es ist bereits PV auf dem Dach installiert."
                />
              </div>
            </div>
          </div>

          <aside className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-6 sm:p-8">
            <SectionEyebrow tone="muted">Richtwerte Ihre Anlage</SectionEyebrow>

            {/* UX-006: promoted hero metrics */}
            <div className="mt-5 space-y-4">
              <PrimaryMetric label="Amortisation" value={amortisationLabel} />
              <PrimaryMetric label="Ertrag gesamt" value={ertragLabel} />
            </div>

            {/* UX-006: secondary metrics — muted 2-col grid */}
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[var(--line)] pt-5">
              {secondary.map((m) => (
                <div key={m.label}>
                  <dt className="text-fs-1 text-[var(--muted)]">{m.label}</dt>
                  <dd className="font-mono-data mt-0.5 text-fs-3 text-[var(--ink)]">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>

            <form
              onSubmit={onSubmit}
              className="mt-7 border-t border-[var(--line)] pt-5"
            >
              {status.kind === "success" ? (
                <p className="text-fs-2 font-semibold text-[var(--leaf)]">
                  ✓ Danke. Detail-Berechnung folgt innerhalb 24 h per Mail.
                </p>
              ) : (
                <>
                  <label
                    htmlFor="rechner-email"
                    className="block text-fs-2 font-medium text-[var(--ink)]"
                  >
                    Detail-Berechnung per E-Mail erhalten
                  </label>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <input
                      id="rechner-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@firma.de"
                      autoComplete="email"
                      className="focus-ring flex-1 rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-fs-2 text-[var(--ink)] outline-none focus:border-[var(--solar)]"
                      style={{ boxShadow: "inset 0 1px 0 rgba(14,17,22,0.04)" }}
                    />
                    <button
                      type="submit"
                      disabled={status.kind === "submitting"}
                      className="btn-secondary focus-ring text-fs-2"
                    >
                      {status.kind === "submitting" ? "Sende …" : "Anfordern"}
                    </button>
                  </div>
                  {status.kind === "error" && (
                    <p className="mt-2 text-fs-2 text-red-600">
                      {status.message}
                    </p>
                  )}
                </>
              )}
            </form>

            <p className="mt-5 text-fs-1 leading-relaxed text-[var(--muted)]">
              Annahmen: 0,17 kWp/m²; 950 kWh/kWp/a Süddeutschland; 60 %
              Eigenverbrauch; 7,9 ct/kWh Einspeisung; 1.000 €/kWp netto;
              1,5 % Betriebskosten pro Jahr; 0,38 kg CO₂/kWh Strommix.
              Ertrag &bdquo;gesamt&ldquo; abzüglich Betriebskosten. Wartung, Reinigung
              und Monitoring sind in unserem Angebot enthalten. Werte
              ersetzen keine Detailplanung — die liefern wir kostenlos vor Ort.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function PrimaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-fs-1 text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-fs-6 font-semibold leading-none tracking-tight text-[var(--ink)]">
        <span className="solar-underline">{value}</span>
      </p>
    </div>
  );
}
