import * as React from "react";

type Tone = "neutral" | "solar" | "leaf";
type Theme = "light" | "dark";

export function BentoGrid({
  cols = 3,
  className = "",
  children,
}: {
  cols?: 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
}) {
  const colsClass =
    cols === 2
      ? "md:grid-cols-2"
      : cols === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-4";
  return (
    <div className={`grid grid-cols-1 gap-4 ${colsClass} ${className}`}>
      {children}
    </div>
  );
}

export default function BentoMetric({
  eyebrow,
  value,
  caption,
  footnote,
  tone = "neutral",
  live = false,
  theme = "light",
}: {
  eyebrow?: string;
  value: React.ReactNode;
  caption?: string;
  footnote?: React.ReactNode;
  tone?: Tone;
  live?: boolean;
  theme?: Theme;
}) {
  const isDark = theme === "dark";
  const valueColor =
    tone === "solar"
      ? "text-[var(--solar)]"
      : isDark
        ? "text-white"
        : "text-[var(--ink)]";
  const eyebrowColor =
    tone === "leaf"
      ? "text-[var(--leaf)]"
      : isDark
        ? "text-white/60"
        : "text-[var(--muted)]";
  const captionColor = isDark ? "text-white/70" : "text-[var(--muted)]";
  const footnoteColor = isDark ? "text-white/40" : "text-[var(--muted)]";
  const cardBg = isDark
    ? "bg-[var(--ink)]/60 backdrop-blur"
    : "bg-[var(--paper)]";
  const cardBorder = isDark ? "border-white/15" : "border-[var(--line)]";

  return (
    <div
      className={`rounded-lg border p-6 transition-colors ${cardBg} ${cardBorder} hover:border-[color-mix(in_srgb,var(--ink)_15%,transparent)]`}
    >
      {eyebrow && (
        <p
          className={`font-mono-data inline-flex items-center gap-2 text-fs-1 font-medium uppercase ${eyebrowColor}`}
          style={{ letterSpacing: "0.08em" }}
        >
          {live && (
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ backgroundColor: "var(--leaf)" }}
            />
          )}
          {eyebrow}
        </p>
      )}
      <p
        className={`font-mono-data ${eyebrow ? "mt-2" : ""} text-fs-7 font-medium leading-none tracking-tight ${valueColor}`}
      >
        {value}
      </p>
      {caption && (
        <p className={`mt-2 text-fs-2 ${captionColor}`}>{caption}</p>
      )}
      {footnote && (
        <p className={`mt-3 text-fs-1 ${footnoteColor}`}>{footnote}</p>
      )}
    </div>
  );
}
