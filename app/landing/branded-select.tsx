"use client";

import * as React from "react";

const CHEVRON =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'><path d='M3 4.5L6 7.5L9 4.5' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>";

export default function BrandedSelect({
  label,
  value,
  options,
  onChange,
  id,
  disabled = false,
}: {
  label?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  id?: string;
  disabled?: boolean;
}) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;
  return (
    <div>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-fs-2 font-medium text-[var(--ink)]"
        >
          {label}
        </label>
      )}
      <div className={`relative ${label ? "mt-2" : ""}`}>
        <select
          id={selectId}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="focus-ring branded-select w-full appearance-none rounded-md border border-[var(--line)] bg-[var(--paper)] px-3 py-2.5 pr-9 text-fs-3 text-[var(--ink)] outline-none transition-colors hover:border-[#b5b09c] focus:border-[var(--solar)] disabled:opacity-40"
          style={{
            backgroundImage: `url("${CHEVRON}")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            backgroundSize: "12px 12px",
            boxShadow: "inset 0 1px 0 rgba(14,17,22,0.04)",
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
