"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sw-cookie-consent-v2";
const CONSENT_EVENT = "sw-cookie-consent-change";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let initial = true;
    try {
      initial = !localStorage.getItem(STORAGE_KEY);
    } catch {
      initial = true;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(initial);
  }, []);

  function persist(choice: "essential" | "all") {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie- und Datenschutz-Hinweis"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-lg border border-[var(--line)] bg-white p-5 shadow-[0_10px_40px_-15px_rgba(14,17,22,0.25)] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
    >
      <p className="font-mono-data text-[11px] uppercase tracking-[0.18em] text-[var(--solar)]">
        DSGVO-Hinweis
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink)]">
        Diese Seite verwendet essenzielle Cookies für die Funktion. Mit Ihrer
        Einwilligung setzen wir zusätzlich Google Analytics ein, um die Seite
        zu verbessern. Für die Terminbuchung über Cal.com wird beim Aufruf
        ein externer Dienst geladen. Details in der{" "}
        <a
          href="/datenschutz"
          className="underline underline-offset-2 hover:text-[var(--solar)]"
        >
          Datenschutzerklärung
        </a>
        .
      </p>
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => persist("essential")}
          className="rounded-md border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--ink)] hover:bg-[var(--paper)]"
        >
          Nur essenziell
        </button>
        <button
          type="button"
          onClick={() => persist("all")}
          className="rounded-md bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white hover:bg-black"
        >
          Analytics zustimmen
        </button>
      </div>
    </div>
  );
}
