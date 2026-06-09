"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalEmbed() {
  useEffect(() => {
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
  }, []);

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
