import Link from "next/link";

export const metadata = {
  title: "Datenschutz · Solarwerk-Süd",
};

export default function Datenschutz() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <Link
        href="/landing"
        className="text-sm text-[var(--steel)] underline-offset-4 hover:underline"
      >
        ← Zurück
      </Link>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">
        Datenschutzerklärung
      </h1>

      <section className="mt-8 space-y-6 text-[15px] leading-relaxed text-[var(--ink)]">
        <div>
          <h2 className="text-lg font-semibold">1. Verantwortlicher</h2>
          <p className="mt-2">
            Solarwerk-Süd GmbH, Musterstraße 1, 86391 Stadtbergen.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">2. Erhobene Daten</h2>
          <p className="mt-2">
            Wir erheben die von Ihnen freiwillig im Wirtschaftlichkeits-Rechner
            und im Satellitenbild-Formular eingegebenen Daten (E-Mail, PLZ,
            Hausnummer, Dachfläche, Stromverbrauch) zum Zweck der
            Angebotserstellung. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO
            (vorvertragliche Maßnahmen).
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">3. Cookies</h2>
          <p className="mt-2">
            Essenzielle Cookies werden ohne Einwilligung gesetzt
            (Funktionalität). Für die Buchungsfunktion (Cal.com)
            verarbeiten wir technisch notwendige Daten zur Terminbuchung —
            dies erfolgt erst nach aktivem Klick auf den Buchungs-CTA.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">4. Speicherdauer</h2>
          <p className="mt-2">
            Anfragen werden nach Abschluss der Geschäftsbeziehung oder nach 6
            Monaten ohne Reaktion gelöscht — soweit keine gesetzliche
            Aufbewahrungspflicht besteht.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">5. Ihre Rechte</h2>
          <p className="mt-2">
            Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch,
            Datenübertragbarkeit, Beschwerde bei der Aufsichtsbehörde.
            Kontakt: datenschutz@solarwerk-sued.de.
          </p>
        </div>
      </section>

      <p className="mt-12 text-xs text-[var(--muted)]">
        Hinweis: Generischer Platzhalter-Text. Vor Veröffentlichung durch eine
        rechtsgeprüfte Datenschutzerklärung ersetzen.
      </p>
    </div>
  );
}
