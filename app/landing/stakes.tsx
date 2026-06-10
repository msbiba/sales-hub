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
      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="reveal grid items-start gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <div>
            <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--solar)]">
              Warum jetzt
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.01em] text-white sm:text-[42px]">
              Industriestrom 2026 zwischen{" "}
              <span className="font-mono-data text-[var(--solar)]">25</span>{" "}
              und{" "}
              <span className="font-mono-data text-[var(--solar)]">
                30 ct/kWh
              </span>
              . Tendenz: nicht fallend.
            </h2>
          </div>
          <div className="space-y-4">
            <p className="text-[16px] leading-relaxed text-white/80">
              Drei Bewegungen treffen Gewerbe-Bilanzen gleichzeitig: steigende
              Industriestrompreise, auslaufende Förderfenster und ein
              wachsender ESG-Druck von Banken, Kunden und Geschäftsführung.
              Wer jetzt plant, sichert sich Festpreise, bestehende
              Förderprogramme und Lieferzeiten.
            </p>
            <p className="font-mono-data text-[11px] uppercase tracking-wider text-white/40">
              BDEW-Strompreisanalyse · Stand 2026 · Gewerbe &gt; 100 MWh/a
            </p>
          </div>
        </div>

        {/* Metriken volle Breite, horizontal */}
        <div className="reveal mt-14 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] sm:grid-cols-2">
          <div className="bg-[var(--ink)]/40 p-7 backdrop-blur sm:p-8">
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
          <div className="bg-[var(--ink)]/40 p-7 backdrop-blur sm:p-8">
            <p className="font-mono-data text-[11px] uppercase tracking-wider text-white/60">
              Förderfenster
            </p>
            <p className="mt-3 font-mono-data text-[44px] font-semibold leading-none tracking-tight text-[var(--solar)] sm:text-[56px]">
              31.12.26
            </p>
            <p className="mt-3 text-sm text-white/70">
              Auslauf §6 EEG-Direktvermarktungs-Bonus.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
