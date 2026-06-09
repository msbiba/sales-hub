import Link from "next/link";
import Logo from "./logo";

export default function LandingFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--ink)]/75">
            Festpreis-Photovoltaik für Gewerbe in Süddeutschland.
            Sitz in Stadtbergen bei Augsburg.
          </p>
        </div>
        <div>
          <p className="font-mono-data text-xs uppercase tracking-wider text-[var(--muted)]">
            Kontakt
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--ink)]">
            <li>
              <a href="tel:+49821000000" className="hover:underline">
                0821 XXX XXX
              </a>
            </li>
            <li>
              <a
                href="mailto:kontakt@solarwerk-sued.de"
                className="hover:underline"
              >
                kontakt@solarwerk-sued.de
              </a>
            </li>
            <li>Musterstraße 1, 86391 Stadtbergen</li>
          </ul>
        </div>
        <div>
          <p className="font-mono-data text-xs uppercase tracking-wider text-[var(--muted)]">
            Rechtliches
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/impressum"
                className="text-[var(--ink)] hover:underline"
              >
                Impressum
              </Link>
            </li>
            <li>
              <Link
                href="/datenschutz"
                className="text-[var(--ink)] hover:underline"
              >
                Datenschutz
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--line)]">
        <div className="mx-auto max-w-6xl px-6 py-5 text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} Solarwerk-Süd GmbH · Demo-Landing-Page
          des Sales-Hub-Lehr-Repos
        </div>
      </div>
    </footer>
  );
}
