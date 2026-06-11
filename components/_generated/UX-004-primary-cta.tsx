// UX-004 — PrimaryCTA with lift + arrow-shift hover
// Spec source: reports/audit-ux-2026-06-11-0824-slscrm.vercel.app.md UX-004.magic_prompt
// Production copy at app/landing/primary-cta.tsx.

import * as React from "react";

const BASE =
  "focus-ring group inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 " +
  "text-fs-3 font-semibold transition-[transform,box-shadow,background-color,color] " +
  "duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] " +
  "hover:-translate-y-px hover:bg-[var(--solar-hover)] " +
  "hover:shadow-[0_10px_30px_-10px_rgba(232,163,61,0.75)] " +
  "active:translate-y-0 active:shadow-[0_10px_30px_-10px_rgba(232,163,61,0.6)] " +
  "disabled:opacity-40 disabled:shadow-none disabled:translate-y-0 " +
  "bg-[var(--solar)] text-[var(--ink)] " +
  "shadow-[0_10px_30px_-10px_rgba(232,163,61,0.6)]";

const ARROW =
  "transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] " +
  "group-hover:translate-x-1 group-active:translate-x-0.5";

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  as?: "a";
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as: "button";
  className?: string;
  children: React.ReactNode;
};

export default function PrimaryCTA(props: AnchorProps | ButtonProps) {
  if (props.as === "button") {
    const { as: _as, className = "", children, ...rest } = props;
    return (
      <button type="button" className={`${BASE} ${className}`.trim()} {...rest}>
        {children}
        <span aria-hidden className={ARROW}>
          →
        </span>
      </button>
    );
  }
  const { as: _as, className = "", children, ...rest } = props;
  return (
    <a className={`${BASE} ${className}`.trim()} {...rest}>
      {children}
      <span aria-hidden className={ARROW}>
        →
      </span>
    </a>
  );
}
