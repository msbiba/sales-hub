// UX-001 — BrandedCheckbox
// Spec source: reports/audit-ux-2026-06-11-0824-slscrm.vercel.app.md UX-001.magic_prompt (item 3)
// Native input[type=checkbox] visually hidden, visual box driven by `checked` prop.
// Focus ring follows the input via peer-focus-visible on visual span.

"use client";

import * as React from "react";

export default function BrandedCheckbox({
  label,
  checked,
  onChange,
  id,
  disabled = false,
  className = "",
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange: (b: boolean) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
}) {
  const generatedId = React.useId();
  const cbId = id ?? generatedId;
  const boxStyle: React.CSSProperties = {
    borderColor: checked ? "var(--solar)" : "var(--line)",
    borderWidth: "0.8px",
    backgroundColor: checked ? "var(--solar)" : "var(--paper)",
    transition:
      "background-color 100ms cubic-bezier(0.4,0,0.2,1), border-color 100ms cubic-bezier(0.4,0,0.2,1)",
  };
  return (
    <label
      htmlFor={cbId}
      className={`inline-flex cursor-pointer items-start gap-3 ${disabled ? "opacity-40" : ""} ${className}`}
    >
      <span className="relative mt-0.5 inline-flex h-[18px] w-[18px] shrink-0">
        <input
          id={cbId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <span
          aria-hidden
          className="pointer-events-none inline-flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--solar)] peer-hover:border-[#b5b09c]"
          style={boxStyle}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{
              color: "var(--ink)",
              transform: checked ? "scale(1)" : "scale(0)",
              opacity: checked ? 1 : 0,
              transition:
                "transform 100ms cubic-bezier(0.4,0,0.2,1), opacity 100ms cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <path
              d="M2.5 6.2L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>
      <span className="text-fs-3 text-[var(--ink)]">{label}</span>
    </label>
  );
}
