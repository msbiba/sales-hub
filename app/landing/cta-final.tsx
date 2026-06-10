import CalEmbed from "./cal-embed-client";

export default function CtaFinal() {
  return (
    <section
      id="termin"
      className="relative overflow-hidden bg-[var(--paper)] scroll-mt-16"
    >
      <div
        aria-hidden
        className="absolute inset-0 grid-pattern opacity-60"
      />
      <div
        aria-hidden
        className="absolute -right-32 top-20 h-[420px] w-[420px] rounded-full bg-[var(--solar)] opacity-[0.08] blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-6 py-24">
        <div className="reveal is-visible text-center">
          <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--steel)]">
            30 Minuten. Ihr Dach. Ein ehrlicher Wert.
          </p>
          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.01em] text-[var(--ink)] sm:text-[40px]">
            Wir prüfen Ihr Dach per Drohne — und sagen Ihnen{" "}
            <span className="solar-underline">schriftlich</span>, was geht.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-[var(--ink)]/75">
            Kostenlos, unverbindlich, ohne Verkaufs-Theater. Wenn sich PV bei
            Ihnen nicht rechnet, sagen wir es Ihnen — auch das schriftlich.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--leaf)]/30 bg-white px-4 py-2 font-mono-data text-[11px] uppercase tracking-wider text-[var(--leaf)]">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--leaf)]"
            />
            Geld-zurück-Versprechen bei Falschberatung
          </div>
        </div>

        <div className="reveal is-visible mt-14">
          <h3 className="mb-5 text-center text-[20px] font-semibold tracking-[-0.01em] text-[var(--ink)] sm:text-[24px]">
            Jetzt unverbindlich und persönlich beraten lassen
          </h3>
          <CalEmbed />
        </div>

        <p className="reveal is-visible mt-6 text-center text-xs text-[var(--muted)]">
          Buchung über Cal.com — als funktional notwendig für unseren
          Buchungsprozess eingestuft. DSGVO-konform; Details:{" "}
          <a
            href="/datenschutz"
            className="underline underline-offset-2 hover:text-[var(--ink)]"
          >
            Datenschutzerklärung
          </a>
          .
        </p>
      </div>
    </section>
  );
}
