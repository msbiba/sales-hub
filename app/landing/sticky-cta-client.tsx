"use client";

import { useEffect, useState } from "react";

export default function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <>
      {/* Desktop: schmaler Bar am oberen Rand, unter dem sticky Header */}
      <div className="reveal is-visible fixed inset-x-0 top-[65px] z-30 hidden border-b border-[var(--line)] bg-white/95 shadow-[0_4px_20px_-12px_rgba(14,17,22,0.2)] backdrop-blur sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-2.5">
          <span className="flex items-center gap-2 text-fs-2 text-[var(--ink)]">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--solar)]"
            />
            Dach prüfen lassen — kostenlos, unverbindlich.
          </span>
          <div className="flex items-center gap-2">
            <a
              href="#termin"
              className="btn-primary focus-ring text-fs-2"
              style={{ padding: "0.375rem 0.875rem" }}
            >
              Termin wählen
              <span aria-hidden>→</span>
            </a>
            <button
              type="button"
              aria-label="Hinweis schließen"
              onClick={() => setDismissed(true)}
              className="focus-ring rounded-md p-1.5 text-[var(--muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)]"
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

      {/* Mobile: full-width CTA am Bildschirmboden (Daumen-Reach) */}
      <div className="reveal is-visible fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="flex items-center gap-2">
          <a
            href="#termin"
            className="btn-primary focus-ring flex-1 text-fs-3"
            style={{ padding: "0.75rem 1rem" }}
          >
            Termin wählen
            <span aria-hidden>→</span>
          </a>
          <button
            type="button"
            aria-label="Hinweis schließen"
            onClick={() => setDismissed(true)}
            className="focus-ring rounded-md border border-[var(--line)] p-3 text-[var(--muted)]"
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
    </>
  );
}
