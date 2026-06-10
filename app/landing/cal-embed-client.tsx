"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useRef, useState } from "react";

export default function CalEmbed() {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mounted) return;
    (async () => {
      const cal = await getCalApi({ namespace: "solarwerk" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
        cssVarsPerTheme: {
          light: { "cal-brand": "#e8a33d" },
          dark: { "cal-brand": "#e8a33d" },
        },
      });
    })();
  }, [mounted]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || mounted) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  if (mounted) {
    return (
      <div className="overflow-hidden rounded-lg border border-[var(--line)] bg-white">
        <Cal
          namespace="solarwerk"
          calLink="pickaslot"
          style={{ width: "100%", height: "700px", overflow: "scroll" }}
          config={{ layout: "month_view", theme: "light" }}
        />
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-lg border border-[var(--line)] bg-white p-10 text-center"
    >
      <p className="text-[15px] leading-relaxed text-[var(--ink)]/75">
        Terminbuchung wird beim Laden von einem externen Dienst (Cal.com)
        bereitgestellt. Aus Datenschutz- und Performance-Gründen laden wir
        den Buchungskalender erst auf Ihren Wunsch.
      </p>
      <button
        type="button"
        onClick={() => setMounted(true)}
        className="rounded-md bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-black"
      >
        Termin wählen
      </button>
    </div>
  );
}
