"use client";

import { useEffect } from "react";

export default function RevealObserver() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0 },
    );

    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

    // Failsafe: nach 1.5s alle noch unsichtbaren Reveals einblenden
    const failsafe = window.setTimeout(() => {
      document
        .querySelectorAll(".reveal:not(.is-visible)")
        .forEach((el) => el.classList.add("is-visible"));
    }, 1500);

    return () => {
      obs.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
