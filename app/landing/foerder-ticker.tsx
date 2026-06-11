export default function FoerderTicker() {
  // Statische Zahlen, manuell gepflegt. Stand-Datum sichtbar.
  return (
    <section className="border-y border-[var(--line)] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 text-fs-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="relative flex h-2 w-2"
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--solar)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--solar)]" />
          </span>
          <span className="font-mono-data text-fs-1 uppercase tracking-wider text-[var(--muted)]">
            Förder-Status live
          </span>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 font-mono-data text-fs-2 text-[var(--ink)]">
          <span>
            <span className="text-[var(--steel)]">KfW 270</span> ·{" "}
            <span className="font-semibold">12,3 Mio €</span> verbleibend
          </span>
          <span>
            <span className="text-[var(--steel)]">§6 EEG</span> · endet{" "}
            <span className="font-semibold">31.12.2026</span>
          </span>
        </div>
        <span className="font-mono-data text-fs-1 uppercase tracking-wider text-[var(--muted)]">
          Stand: 01.06.2026
        </span>
      </div>
    </section>
  );
}
