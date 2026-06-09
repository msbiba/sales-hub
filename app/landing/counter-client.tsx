"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  suffix?: string;
  prefix?: string;
  durationMs?: number;
  decimals?: number;
};

export default function Counter({
  value,
  suffix = "",
  prefix = "",
  durationMs = 1200,
  decimals = 0,
}: Props) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrent(value);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const elapsed = now - start;
              const t = Math.min(1, elapsed / durationMs);
              const eased = 1 - Math.pow(1 - t, 3);
              setCurrent(value * eased);
              if (t < 1) requestAnimationFrame(tick);
              else setCurrent(value);
            };
            requestAnimationFrame(tick);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [value, durationMs]);

  const formatted = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(current);

  return (
    <span ref={ref} className="font-mono-data tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
