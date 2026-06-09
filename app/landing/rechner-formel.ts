/**
 * Wirtschaftlichkeits-Rechner — konservative Formel mit Disclaimern.
 *
 * Annahmen (bewusst konservativ):
 * - kWp-Schätzung: 0,17 kWp pro m² (statt 0,18-0,20).
 * - Spezifischer Jahresertrag: 950 kWh/kWp für Süddeutschland.
 * - Eigenverbrauchsquote Gewerbe: 60 % (konservativ; Realwerte 55–75 %).
 * - Einspeisevergütung: 7,9 ct/kWh (EEG-Mittel > 100 kWp).
 * - Investitionskosten: 1.000 € pro kWp netto (inkl. Planung, Reserve).
 * - Jährliche Betriebskosten: 1,5 % der Investition (Wartung, Versicherung,
 *   Monitoring) — als Abzug vom Brutto-Ertrag.
 * - CO₂-Faktor deutscher Strommix: 0,38 kg/kWh.
 *
 * Alle Werte sind Richtwerte und ersetzen keine Detailplanung.
 */

export type RechnerInput = {
  dachflaecheM2: number;
  verbrauchKwh: number;
  strompreisCt: number;
};

export type RechnerOutput = {
  kWp: number;
  jahresertragKwh: number;
  eigenverbrauchKwh: number;
  einspeisungKwh: number;
  einsparungProJahrEur: number;
  einspeiseverguetungProJahrEur: number;
  ertragGesamtProJahrEur: number;
  investitionEur: number;
  amortisationJahre: number;
  co2EinsparungProJahrT: number;
};

const KWP_PRO_M2 = 0.17;
const SPEZ_ERTRAG_KWH_PRO_KWP = 950;
const EIGENVERBRAUCHSQUOTE = 0.6;
const EINSPEISE_CT = 7.9;
const KOSTEN_PRO_KWP_EUR = 1000;
const BETRIEBSKOSTEN_PROZENT = 0.015;
const CO2_KG_PRO_KWH = 0.38;

export function berechne(input: RechnerInput): RechnerOutput {
  const dach = Math.max(0, input.dachflaecheM2);
  const verbrauch = Math.max(0, input.verbrauchKwh);
  const strompreis = Math.max(0, input.strompreisCt);

  const kWp = dach * KWP_PRO_M2;
  const jahresertragKwh = kWp * SPEZ_ERTRAG_KWH_PRO_KWP;

  const eigenverbrauchKwhTheoretisch = jahresertragKwh * EIGENVERBRAUCHSQUOTE;
  const eigenverbrauchKwh = Math.min(eigenverbrauchKwhTheoretisch, verbrauch);
  const einspeisungKwh = Math.max(0, jahresertragKwh - eigenverbrauchKwh);

  const einsparungProJahrEur = (eigenverbrauchKwh * strompreis) / 100;
  const einspeiseverguetungProJahrEur = (einspeisungKwh * EINSPEISE_CT) / 100;
  const investitionEur = kWp * KOSTEN_PRO_KWP_EUR;
  const betriebskostenProJahrEur = investitionEur * BETRIEBSKOSTEN_PROZENT;
  const ertragGesamtProJahrEur =
    einsparungProJahrEur +
    einspeiseverguetungProJahrEur -
    betriebskostenProJahrEur;

  const amortisationJahre =
    ertragGesamtProJahrEur > 0
      ? investitionEur / ertragGesamtProJahrEur
      : Infinity;

  const co2EinsparungProJahrT = (jahresertragKwh * CO2_KG_PRO_KWH) / 1000;

  return {
    kWp: round(kWp, 1),
    jahresertragKwh: round(jahresertragKwh, 0),
    eigenverbrauchKwh: round(eigenverbrauchKwh, 0),
    einspeisungKwh: round(einspeisungKwh, 0),
    einsparungProJahrEur: round(einsparungProJahrEur, 0),
    einspeiseverguetungProJahrEur: round(einspeiseverguetungProJahrEur, 0),
    ertragGesamtProJahrEur: round(ertragGesamtProJahrEur, 0),
    investitionEur: round(investitionEur, 0),
    amortisationJahre: round(amortisationJahre, 1),
    co2EinsparungProJahrT: round(co2EinsparungProJahrT, 1),
  };
}

function round(value: number, digits: number): number {
  if (!isFinite(value)) return value;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function formatEuro(value: number): string {
  if (!isFinite(value)) return "—";
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatZahl(value: number, digits = 0): string {
  if (!isFinite(value)) return "—";
  return new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}
