"use client";

import { useEffect, useState } from "react";

export default function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 800);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="reveal is-visible fixed inset-x-0 top-0 z-40 border-b border-[var(--line)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <span className="hidden text-sm text-[var(--ink)] sm:inline">
          Dach prüfen lassen — kostenlos, unverbindlich.
        </span>
        <span className="text-sm text-[var(--ink)] sm:hidden">
          Dach kostenlos prüfen lassen.
        </span>
        <div className="flex items-center gap-2">
          <a
            href="#termin"
            className="rounded-md bg-[var(--solar)] px-3.5 py-1.5 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--solar-hover)]"
          >
            Termin wählen →
          </a>
          <button
            type="button"
            aria-label="Hinweis schließen"
            onClick={() => setDismissed(true)}
            className="rounded-md p-1.5 text-[var(--muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 3L13 13M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
