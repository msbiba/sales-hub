import * as React from "react";

type Tone = "muted" | "leaf" | "solar";

const TONE_COLOR: Record<Tone, string> = {
  muted: "var(--muted)",
  leaf: "var(--leaf)",
  solar: "var(--solar)",
};

export default function DemoTag({
  tone = "muted",
  dot = false,
  className = "",
  children = "Demo",
}: {
  tone?: Tone;
  dot?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const color = TONE_COLOR[tone];
  return (
    <span
      className={`font-mono-data inline-flex items-center gap-1.5 rounded-full border bg-[var(--paper)] px-2 py-0.5 font-medium uppercase ${className}`}
      style={{
        color,
        borderColor: "var(--line)",
        borderWidth: "0.8px",
        fontSize: "10px",
        letterSpacing: "0.1em",
      }}
    >
      {dot && (
        <span
          aria-hidden
          className="inline-block h-1 w-1 rounded-full"
          style={{ backgroundColor: "currentColor" }}
        />
      )}
      {children}
    </span>
  );
}
