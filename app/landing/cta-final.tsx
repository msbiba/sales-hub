import CalEmbed from "./cal-embed-client";

export default function CtaFinal() {
  return (
    <section id="termin" className="bg-[var(--paper)] scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="font-mono-data text-xs uppercase tracking-[0.18em] text-[var(--steel)]">
            30 Minuten. Ihr Dach. Ein ehrlicher Wert.
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
            Wir prüfen Ihr Dach per Drohne — und sagen Ihnen schriftlich, was geht.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-[var(--ink)]/80">
            Kostenlos, unverbindlich, ohne Verkaufs-Theater. Wenn sich PV bei
            Ihnen nicht rechnet, sagen wir es Ihnen — auch das schriftlich.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 font-mono-data text-xs uppercase tracking-wider text-[var(--steel)]">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--leaf)]"
            />
            Geld-zurück-Versprechen bei Falschberatung
          </div>
        </div>

        <div className="reveal mt-12">
          <CalEmbed />
        </div>

        <p className="reveal mt-6 text-center text-xs text-[var(--muted)]">
          Buchung über Cal.com — als funktional notwendig für unseren
          Buchungsprozess eingestuft. Details:{" "}
          <a
            href="/datenschutz"
            className="underline underline-offset-2 hover:text-[var(--ink)]"
          >
            Datenschutz
          </a>
          .
        </p>
      </div>
    </section>
  );
}
