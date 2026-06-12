import Image from "next/image";
import SatellitePreview from "./satellite-preview-client";
import PrimaryCTA from "./primary-cta";
import BentoMetric, { BentoGrid } from "./bento-metric";

const HEADLINES: Record<string, { h1: React.ReactNode; sub: string }> = {
  default: {
    h1: (
      <>
        Photovoltaik fürs Hallendach.{" "}
        <span className="solar-underline-light">Festpreis.</span> Eigene
        Monteure. 20 Jahre Garantie.
      </>
    ),
    sub: "Geplant von Ingenieuren in Stadtbergen. In 8 Wochen am Netz — oder Sie zahlen nicht.",
  },
  stakes: {
    h1: (
      <>
        Ihr Hallendach produziert ab 2026 Strom — oder Sie zahlen weiter{" "}
        <span className="solar-underline-light">27 Cent</span>.
      </>
    ),
    sub: "Festpreis-Photovoltaik für Gewerbe in Süddeutschland. 20 Jahre Garantie inklusive.",
  },
  proof: {
    h1: (
      <>
        <span className="solar-underline-light">480 Gewerbedächer</span> in
        Süddeutschland. Festpreis gehalten. Termin gehalten.
      </>
    ),
    sub: "Eigene Monteure, ein Ansprechpartner, 20 Jahre Garantie. Auch für Ihr Dach.",
  },
};

const HERO_METRICS = [
  { value: "480+", label: "Gewerbeanlagen" },
  { value: "142 MWp", label: "installiert" },
  { value: "8 Wo.", label: "bis Netzanschluss" },
];

export default function Hero({ variant }: { variant?: string }) {
  const v = variant && HEADLINES[variant] ? variant : "default";
  const { h1, sub } = HEADLINES[v];

  return (
    <section className="relative isolate overflow-hidden bg-[var(--ink)] text-white">
      {/* Full-bleed Background-Image */}
      <Image
        src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2400&q=85"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover [filter:saturate(0.7)_brightness(0.85)]"
      />
      {/* Dunkler Verlauf für Lesbarkeit */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[var(--ink)]/95 via-[var(--ink)]/80 to-[var(--ink)]/55"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/90 via-transparent to-[var(--ink)]/30"
      />
      {/* Ingenieur-Grid darüber */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:48px_48px]"
      />
      {/* Solar-Glow rechts */}
      <div
        aria-hidden
        className="absolute -right-32 top-1/3 h-[480px] w-[480px] rounded-full bg-[var(--solar)] opacity-[0.18] blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-24 lg:pb-32 lg:pt-32">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-3 py-1 font-mono-data text-fs-1 uppercase tracking-[0.18em] text-white/90 backdrop-blur">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--solar)]"
            />
            Photovoltaik · Gewerbe · Süddeutschland
          </p>
          <h1 className="mt-6 text-fs-7 font-semibold leading-[1.04] tracking-[-0.02em] text-white sm:text-fs-9 lg:text-fs-9">
            {h1}
          </h1>
          <p className="mt-7 max-w-2xl text-fs-4 leading-relaxed text-white/85">
            {sub}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <PrimaryCTA href="#termin">
              Kostenlose Dach-Analyse buchen
            </PrimaryCTA>
            <a
              href="#rechner"
              className="focus-ring inline-flex min-h-[44px] items-center px-2 py-2 text-fs-3 font-medium text-white underline-offset-4 hover:underline"
            >
              Erst rechnen lassen →
            </a>
          </div>

          {/* UX-005: bento metric grid */}
          <BentoGrid cols={3} className="mt-12 max-w-2xl">
            {HERO_METRICS.map((m) => (
              <BentoMetric
                key={m.label}
                theme="dark"
                eyebrow={m.label}
                value={m.value}
              />
            ))}
          </BentoGrid>

          <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-fs-2 text-white/75">
            <li className="flex items-center gap-2">
              <Tick />
              TÜV-zertifizierte Montage
            </li>
            <li className="flex items-center gap-2">
              <Tick />
              Eigene Monteure
            </li>
            <li className="flex items-center gap-2">
              <Tick />
              Förderantrag inklusive
            </li>
          </ul>
        </div>
      </div>

      {/* Satelliten-Preview als Card im Hero — linksbündig unter dem Text */}
      <div className="relative mx-auto max-w-6xl px-6 pb-20">
        <div className="max-w-lg">
          <SatellitePreview />
        </div>
      </div>
    </section>
  );
}

function Tick() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6.2L5 8.5L9.5 3.5"
        stroke="var(--solar)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
