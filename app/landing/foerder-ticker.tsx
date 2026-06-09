export default function FoerderTicker() {
  // Statische Zahlen, manuell gepflegt. Stand-Datum sichtbar.
  return (
    <section className="bg-[var(--ink)] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono-data">
          <span>
            <span className="text-[var(--solar)]">KfW 270</span> · Budget 2026
            ≈ 12,3 Mio € verbleibend
          </span>
          <span className="hidden sm:inline" aria-hidden>
            ·
          </span>
          <span>
            <span className="text-[var(--solar)]">§6 EEG</span> ·
            Direktvermarktungs-Bonus endet 31.12.2026
          </span>
        </div>
        <span className="font-mono-data text-[11px] uppercase tracking-wider text-white/60">
          Stand: 01.06.2026
        </span>
      </div>
    </section>
  );
}
