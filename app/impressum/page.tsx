import Link from "next/link";

export const metadata = {
  title: "Impressum · Solarwerk-Süd",
};

export default function Impressum() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <Link
        href="/landing"
        className="text-sm text-[var(--steel)] underline-offset-4 hover:underline"
      >
        ← Zurück
      </Link>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">Impressum</h1>

      {/* TODO: Vor Go-Live durch echte Stammdaten ersetzen */}
      <section className="mt-8 space-y-4 text-[15px] leading-relaxed text-[var(--ink)]">
        <p>
          <strong>Solarwerk-Süd GmbH</strong>
          <br />
          Musterstraße 1<br />
          86391 Stadtbergen
        </p>
        <p>
          Telefon: 0821 XXX XXX
          <br />
          E-Mail: kontakt@solarwerk-sued.de
        </p>
        <p>
          Geschäftsführer: [Platzhalter Name]
          <br />
          Handelsregister: HRB [Nummer], Amtsgericht Augsburg
          <br />
          USt-IdNr.: DE[Nummer]
        </p>
        <p>
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:
          <br />
          [Platzhalter Name], Anschrift wie oben
        </p>
      </section>

      <p className="mt-12 text-xs text-[var(--muted)]">
        Hinweis: Dies ist ein generischer Platzhalter. Vor Veröffentlichung
        durch reale Daten ersetzen.
      </p>
    </div>
  );
}
