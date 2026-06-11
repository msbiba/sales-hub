import SectionEyebrow from "./section-eyebrow";
import BentoMetric, { BentoGrid } from "./bento-metric";

export default function Stakes() {
  return (
    <section className="relative overflow-hidden bg-[var(--ink)] text-white">
      <div
        aria-hidden
        className="absolute inset-0 grid-pattern-strong opacity-[0.18]"
      />
      <div
        aria-hidden
        className="absolute -left-32 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-[var(--solar)] opacity-[0.10] blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="reveal">
          <SectionEyebrow tone="solar" dot>
            Warum jetzt
          </SectionEyebrow>
          <h2 className="mt-5 text-fs-6 font-semibold leading-tight tracking-[-0.01em] text-white sm:text-fs-7">
            Industriestrom 2026 zwischen{" "}
            <span className="font-mono-data text-[var(--solar)]">25</span> und{" "}
            <span className="font-mono-data text-[var(--solar)]">30 ct/kWh</span>.
            Tendenz: nicht fallend.
          </h2>
          <p className="mt-6 max-w-xl text-fs-3 leading-relaxed text-white/75">
            Drei Bewegungen treffen Gewerbe-Bilanzen gleichzeitig: steigende
            Industriestrompreise, auslaufende Förderfenster und ein
            wachsender ESG-Druck von Banken, Kunden und Geschäftsführung.
            Wer jetzt plant, sichert sich Festpreise, bestehende
            Förderprogramme und Lieferzeiten.
          </p>
          <p className="mt-4 font-mono-data text-fs-1 uppercase tracking-wider text-white/40">
            BDEW-Strompreisanalyse · Stand 2026 · Gewerbe &gt; 100 MWh/a
          </p>
        </div>

        {/* UX-005: bento metric grid (dark theme, solar tone) */}
        <div className="reveal">
          <BentoGrid cols={2}>
            <BentoMetric
              theme="dark"
              tone="solar"
              eyebrow="Strompreis-Anstieg"
              value="+38%"
              caption="Gewerbestrom seit 2021. Mittlere Spannungsebene."
            />
            <BentoMetric
              theme="dark"
              tone="solar"
              eyebrow="Förderfenster"
              value="31.12.26"
              caption="Auslauf §6 EEG-Direktvermarktungs-Bonus."
            />
          </BentoGrid>
        </div>
      </div>
    </section>
  );
}
