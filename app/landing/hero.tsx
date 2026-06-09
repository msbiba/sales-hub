import Image from "next/image";
import SatellitePreview from "./satellite-preview-client";

const HEADLINES: Record<string, { h1: string; sub: string }> = {
  default: {
    h1: "Photovoltaik fürs Hallendach. Festpreis. Eigene Monteure. 20 Jahre Garantie.",
    sub: "Geplant von Ingenieuren in Stadtbergen. In 8 Wochen am Netz — oder Sie zahlen nicht.",
  },
  stakes: {
    h1: "Ihr Hallendach produziert ab 2026 Strom — oder Sie zahlen weiter 27 Cent.",
    sub: "Festpreis-Photovoltaik für Gewerbe in Süddeutschland. 20 Jahre Garantie inklusive.",
  },
  proof: {
    h1: "480 Gewerbedächer in Süddeutschland. Festpreis gehalten. Termin gehalten.",
    sub: "Eigene Monteure, ein Ansprechpartner, 20 Jahre Garantie. Auch für Ihr Dach.",
  },
};

export default function Hero({ variant }: { variant?: string }) {
  const v = variant && HEADLINES[variant] ? variant : "default";
  const { h1, sub } = HEADLINES[v];

  return (
    <section className="relative overflow-hidden bg-[var(--paper)]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-24">
        <div>
          <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--steel)]">
            Photovoltaik · Gewerbe · Süddeutschland
          </p>
          <h1 className="mt-5 text-[40px] font-semibold leading-[1.08] tracking-tight text-[var(--ink)] sm:text-[52px] lg:text-[56px]">
            {h1}
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--ink)]/80">
            {sub}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="#termin"
              className="inline-flex items-center justify-center rounded-md bg-[var(--solar)] px-6 py-3.5 text-[15px] font-semibold text-[var(--ink)] hover:bg-[var(--solar-hover)]"
            >
              Kostenlose Dach-Analyse buchen
            </a>
            <a
              href="#rechner"
              className="text-[15px] font-medium text-[var(--ink)] underline-offset-4 hover:underline"
            >
              Erst rechnen lassen →
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[var(--steel)]">
            <li className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--solar)]"
              />
              480+ Gewerbeanlagen
            </li>
            <li className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--solar)]"
              />
              TÜV-zertifizierte Montage
            </li>
            <li className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--solar)]"
              />
              Eigene Monteure, keine Sub-Unternehmer
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--steel)]">
            <Image
              src="https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80"
              alt="Industriedach mit Photovoltaik-Modulen aus der Luft"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--ink)]/40 to-transparent"
            />
            <div className="absolute bottom-3 left-3 rounded bg-[var(--ink)]/80 px-2 py-1 font-mono-data text-[11px] uppercase tracking-wider text-white">
              Referenzdach · Bayrisch-Schwaben · 612 kWp
            </div>
          </div>
          <SatellitePreview />
        </div>
      </div>
    </section>
  );
}
