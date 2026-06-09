"use client";

import { useMemo, useState } from "react";
import {
  berechne,
  formatEuro,
  formatZahl,
  type RechnerOutput,
} from "./rechner-formel";

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

  return (
    <section
      id="rechner"
      className="border-y border-[var(--line)] bg-white scroll-mt-16"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="reveal max-w-3xl">
          <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--steel)]">
            Selbst nachrechnen
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
            Was kann Ihr Hallendach? In 30 Sekunden.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink)]/75">
            Konservative Schätzwerte für Süddeutschland. Keine Verkaufs-Magie,
            keine Optimismus-Filter. Eine Detail-Berechnung folgt nach
            Drohnen-Befliegung.
          </p>
        </div>

        <div className="reveal mt-12 grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div className="space-y-8">
            <Slider
              label="Dachfläche"
              value={dach}
              min={200}
              max={10000}
              step={50}
              unit=" m²"
              onChange={setDach}
            />
            <Slider
              label="Jahres-Stromverbrauch"
              value={verbrauch}
              min={20_000}
              max={2_000_000}
              step={5000}
              unit=" kWh"
              onChange={setVerbrauch}
            />
            <Slider
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
              <label className="block">
                <span className="block text-sm font-medium text-[var(--ink)]">
                  Dach-Typ
                </span>
                <select
                  value={dachtyp}
                  onChange={(e) => setDachtyp(e.target.value)}
                  className="mt-2 w-full rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--steel)]"
                >
                  {DACHTYP_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex cursor-pointer items-start gap-3 self-end rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={bestehendePv}
                  onChange={(e) => setBestehendePv(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[var(--solar)]"
                />
                <span className="text-sm text-[var(--ink)]">
                  Es ist bereits PV auf dem Dach installiert.
                </span>
              </label>
            </div>
          </div>

          <aside className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-6 sm:p-8">
            <p className="font-mono-data text-xs uppercase tracking-wider text-[var(--steel)]">
              Richtwerte Ihre Anlage
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
              <Metric
                label="Anlagengröße"
                value={`${formatZahl(result.kWp, 1)} kWp`}
              />
              <Metric
                label="Jahresertrag"
                value={`${formatZahl(result.jahresertragKwh)} kWh`}
              />
              <Metric
                label="Einsparung Strom"
                value={`${formatEuro(result.einsparungProJahrEur)} / Jahr`}
              />
              <Metric
                label="Einspeise-Vergütung"
                value={`${formatEuro(result.einspeiseverguetungProJahrEur)} / Jahr`}
              />
              <Metric
                label="Ertrag gesamt"
                value={`${formatEuro(result.ertragGesamtProJahrEur)} / Jahr`}
                highlight
              />
              <Metric
                label="Investition (netto)"
                value={`${formatEuro(result.investitionEur)}`}
              />
              <Metric
                label="Amortisation"
                value={
                  isFinite(result.amortisationJahre)
                    ? `${formatZahl(result.amortisationJahre, 1)} Jahre`
                    : "—"
                }
                highlight
              />
              <Metric
                label="CO₂ vermieden"
                value={`${formatZahl(result.co2EinsparungProJahrT, 1)} t / Jahr`}
              />
            </dl>

            <form
              onSubmit={onSubmit}
              className="mt-7 border-t border-[var(--line)] pt-5"
            >
              {status.kind === "success" ? (
                <p className="text-sm font-semibold text-[var(--leaf)]">
                  ✓ Danke. Detail-Berechnung folgt innerhalb 24 h per Mail.
                </p>
              ) : (
                <>
                  <label className="block text-sm font-medium text-[var(--ink)]">
                    Detail-Berechnung per E-Mail erhalten
                  </label>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@firma.de"
                      className="flex-1 rounded-md border border-[var(--line)] bg-white px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--steel)]"
                    />
                    <button
                      type="submit"
                      disabled={status.kind === "submitting"}
                      className="rounded-md bg-[var(--ink)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                    >
                      {status.kind === "submitting" ? "Sende …" : "Anfordern"}
                    </button>
                  </div>
                  {status.kind === "error" && (
                    <p className="mt-2 text-sm text-red-600">
                      {status.message}
                    </p>
                  )}
                </>
              )}
            </form>

            <p className="mt-5 text-[11px] leading-relaxed text-[var(--muted)]">
              Annahmen: 0,17 kWp/m²; 950 kWh/kWp/a Süddeutschland; 60 %
              Eigenverbrauch; 7,9 ct/kWh Einspeisung; 1.000 €/kWp netto;
              1,5 % Betriebskosten pro Jahr; 0,38 kg CO₂/kWh Strommix.
              Ertrag „gesamt" abzüglich Betriebskosten. Wartung, Reinigung
              und Monitoring sind in unserem Angebot enthalten. Werte
              ersetzen keine Detailplanung — die liefern wir kostenlos vor Ort.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  decimals = 0,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  decimals?: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-[var(--ink)]">
          {label}
        </label>
        <span className="font-mono-data text-[15px] font-semibold text-[var(--ink)]">
          {formatZahl(value, decimals)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--solar)]"
        aria-label={label}
      />
      <div className="mt-1 flex justify-between font-mono-data text-[11px] text-[var(--muted)]">
        <span>
          {formatZahl(min, decimals)}
          {unit}
        </span>
        <span>
          {formatZahl(max, decimals)}
          {unit}
        </span>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-[var(--muted)]">
        {label}
      </dt>
      <dd
        className={`mt-1 font-mono-data text-[18px] font-semibold ${
          highlight ? "text-[var(--ink)]" : "text-[var(--ink)]/80"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
