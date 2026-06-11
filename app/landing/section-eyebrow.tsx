import * as React from "react";

type Tone = "leaf" | "steel" | "muted" | "solar" | "white";

const TONE_COLOR: Record<Tone, string> = {
  leaf: "var(--leaf)",
  steel: "var(--steel)",
  muted: "var(--muted)",
  solar: "var(--solar)",
  white: "rgba(255,255,255,0.6)",
};

export default function SectionEyebrow({
  tone = "steel",
  dot = false,
  className = "",
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const color = TONE_COLOR[tone];
  return (
    <p
      className={`font-mono-data inline-flex items-center gap-2 text-fs-1 font-medium uppercase ${className}`}
      style={{ color, letterSpacing: "0.08em" }}
    >
      {dot && (
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: "currentColor",
            boxShadow:
              "0 0 0 3px color-mix(in srgb, currentColor 15%, transparent)",
          }}
        />
      )}
      {children}
    </p>
  );
}
