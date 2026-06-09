export default function Stakes() {
  return (
    <section className="border-y border-[var(--line)] bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[2fr_1fr_1fr] lg:gap-16">
        <div className="reveal">
          <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--steel)]">
            Warum jetzt
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
            Industriestrom 2026 zwischen 25 und 30 ct/kWh. Tendenz: nicht
            fallend.
          </h2>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--ink)]/80">
            Drei Bewegungen treffen Gewerbe-Bilanzen gleichzeitig: steigende
            Industriestrompreise, auslaufende Förderfenster und ein
            wachsender ESG-Druck von Banken, Kunden und Geschäftsführung. Wer
            jetzt plant, sichert sich Festpreise, bestehende Förderprogramme
            und Lieferzeiten.
          </p>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Quelle: BDEW-Strompreisanalyse, Stand 2026. Range Industriestrom
            mittlere Spannungsebene, Gewerbekunden &gt; 100 MWh/a.
          </p>
        </div>

        <div className="reveal border-l border-[var(--line)] pl-8 lg:pl-10">
          <p className="font-mono-data text-[40px] font-semibold text-[var(--ink)] sm:text-[52px]">
            +38 %
          </p>
          <p className="mt-2 text-sm text-[var(--steel)]">
            Strompreis-Anstieg Gewerbe seit 2021
          </p>
        </div>

        <div className="reveal border-l border-[var(--line)] pl-8 lg:pl-10">
          <p className="font-mono-data text-[40px] font-semibold text-[var(--ink)] sm:text-[52px]">
            31.12.26
          </p>
          <p className="mt-2 text-sm text-[var(--steel)]">
            Auslauf §6 EEG-Direktvermarktungs-Bonus
          </p>
        </div>
      </div>
    </section>
  );
}
