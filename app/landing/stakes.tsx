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
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
        <div className="reveal">
          <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--solar)]">
            Warum jetzt
          </p>
          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.01em] text-white sm:text-[40px]">
            Industriestrom 2026 zwischen{" "}
            <span className="font-mono-data text-[var(--solar)]">25</span> und{" "}
            <span className="font-mono-data text-[var(--solar)]">30 ct/kWh</span>.
            Tendenz: nicht fallend.
          </h2>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/75">
            Drei Bewegungen treffen Gewerbe-Bilanzen gleichzeitig: steigende
            Industriestrompreise, auslaufende Förderfenster und ein
            wachsender ESG-Druck von Banken, Kunden und Geschäftsführung.
            Wer jetzt plant, sichert sich Festpreise, bestehende
            Förderprogramme und Lieferzeiten.
          </p>
          <p className="mt-4 font-mono-data text-[11px] uppercase tracking-wider text-white/40">
            BDEW-Strompreisanalyse · Stand 2026 · Gewerbe &gt; 100 MWh/a
          </p>
        </div>

        <div className="reveal relative lg:pl-10">
          <span
            aria-hidden
            className="absolute left-0 top-0 hidden h-full w-px bg-white/15 lg:block"
          />
          <p className="font-mono-data text-[11px] uppercase tracking-wider text-white/60">
            Strompreis-Anstieg
          </p>
          <p className="mt-3 font-mono-data text-[56px] font-semibold leading-none tracking-tight text-[var(--solar)] sm:text-[64px]">
            +38<span className="text-white/40">%</span>
          </p>
          <p className="mt-3 text-sm text-white/70">
            Gewerbestrom seit 2021. Mittlere Spannungsebene.
          </p>
        </div>

        <div className="reveal relative lg:pl-10">
          <span
            aria-hidden
            className="absolute left-0 top-0 hidden h-full w-px bg-white/15 lg:block"
          />
          <p className="font-mono-data text-[11px] uppercase tracking-wider text-white/60">
            Förderfenster
          </p>
          <p className="mt-3 font-mono-data text-[44px] font-semibold leading-none tracking-tight text-[var(--solar)] sm:text-[52px]">
            31.12.26
          </p>
          <p className="mt-3 text-sm text-white/70">
            Auslauf §6 EEG-Direktvermarktungs-Bonus.
          </p>
        </div>
      </div>
    </section>
  );
}
