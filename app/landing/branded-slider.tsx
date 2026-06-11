"use client";

import * as React from "react";

export default function BrandedSlider({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  decimals = 0,
  formatValue,
  onChange,
  id,
  disabled = false,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  decimals?: number;
  formatValue?: (v: number) => string;
  onChange: (n: number) => void;
  id?: string;
  disabled?: boolean;
}) {
  const generatedId = React.useId();
  const sliderId = id ?? generatedId;
  const fmt =
    formatValue ??
    ((v: number) =>
      `${v.toLocaleString("de-DE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${unit}`);
  const pct = ((value - min) / (max - min)) * 100;
  const trackStyle: React.CSSProperties = {
    background: `linear-gradient(to right, var(--solar) 0%, var(--solar) ${pct}%, var(--line) ${pct}%, var(--line) 100%)`,
  };

  return (
    <div className={disabled ? "opacity-40" : ""}>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={sliderId}
          className="text-fs-2 font-medium text-[var(--ink)]"
        >
          {label}
        </label>
        <span
          aria-hidden
          className="font-mono-data rounded-md border border-[var(--line)] bg-[var(--paper)] px-2 py-0.5 text-fs-2 text-[var(--ink)]"
        >
          {fmt(value)}
        </span>
      </div>
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="branded-slider focus-ring mt-3 w-full"
        style={trackStyle}
        aria-label={label}
      />
      <div className="mt-1 flex justify-between font-mono-data text-fs-1 text-[var(--muted)]">
        <span>{fmt(min)}</span>
        <span>{fmt(max)}</span>
      </div>
    </div>
  );
}
