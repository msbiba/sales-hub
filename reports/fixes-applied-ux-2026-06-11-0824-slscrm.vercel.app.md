# UX Audit — Fixes Applied

- **Source audit:** `reports/audit-ux-2026-06-11-0824-slscrm.vercel.app.md`
- **Target:** https://slscrm.vercel.app/landing
- **Applied at:** 2026-06-11
- **Branch:** `apply_ux_fixes`
- **Scope confirmed:** all (quick_win + strategic_bet + incremental) — 13 recommendations
- **Stack:** Next.js 16 + React 19 + Tailwind v4 (CSS-var tokens, no `tailwind.config`). No Radix dep — branded Select/Accordion built native.
- **Convention note:** generated raw Magic output kept under `components/_generated/` for review; production components co-located under `app/landing/` per CLAUDE.md ("Kein `components/`-Ordner").

## Changelog

| ID | Quadrant | Track | Value/Cx | Status | File(s) changed | Generated | What changed |
|---|---|---|---|---|---|---|---|
| UX-002 | quick_win | agent | 5/2 | done | `app/globals.css`, 17 files under `app/landing/` | — | 9-step type scale tokens `--text-fs-1..9` added; 131 font-size utility classes remapped to nearest step |
| UX-003 | quick_win | magic | 4/1 | done | `app/landing/section-eyebrow.tsx` (+8 partials) | `components/_generated/UX-003-section-eyebrow.tsx` | `<SectionEyebrow tone dot>` chip; applied to rechner / faq / comparison / social-proof / stakes / benefits / mechanism / cta-final |
| UX-004 | quick_win | magic | 4/1 | done | `app/landing/primary-cta.tsx`, `app/landing/hero.tsx` | `components/_generated/UX-004-primary-cta.tsx` | `PrimaryCTA` w/ lift + arrow-shift + shadow intensify on hover; hero CTA swapped |
| UX-010 | quick_win | magic | 3/1 | done | `app/landing/demo-tag.tsx`, `app/landing/social-proof.tsx` | `components/_generated/UX-010-demo-tag.tsx` | `<DemoTag>` pill replaces `[DEMO]` inline text on testimonial cards + footer caption |
| UX-001 | quick_win | magic | 5/3 | done | `app/landing/branded-{slider,select,checkbox}.tsx`, `app/landing/rechner-client.tsx`, `app/globals.css` | `components/_generated/UX-001-branded-{slider,select,checkbox}.tsx` | Calculator native range/select/checkbox replaced w/ branded primitives (no Radix dep) |
| UX-005 | quick_win | magic | 5/2 | done | `app/landing/bento-metric.tsx`, `app/landing/hero.tsx`, `app/landing/stakes.tsx`, `app/landing/social-proof.tsx` | `components/_generated/UX-005-bento-metric.tsx` | `BentoMetric` + `BentoGrid` card grid; hero stats / Warum-jetzt / proof block all swapped |
| UX-006 | quick_win | magic | 4/2 | done | `app/landing/rechner-client.tsx` | (inline in rechner-client) | Amortisation + Ertrag gesamt promoted to fs-6 with solar-underline; 6 secondary metrics in 2-col muted grid |
| UX-007 | quick_win | magic | 4/2 | done | `app/landing/comparison.tsx` | (inline in comparison) | "Us" column gets 6% solar wash + 2px solar L/R borders; competitor headers harmonized to mono-data eyebrow style |
| UX-008 | quick_win | magic | 4/2 | done | `app/landing/faq-client.tsx` | (inline in faq-client) | Card-framed accordion items, hover lift + neutral shadow, chevron rotation 180° on expand |
| UX-009 | strategic_bet | agent | 4/2 | done | `app/globals.css`, `app/landing/layout.tsx`, `app/landing/cookie-banner-client.tsx`, `app/landing/sticky-cta-client.tsx`, `app/landing/satellite-preview-client.tsx`, `app/landing/rechner-client.tsx` | — | 3-tier button utilities `.btn-primary` / `.btn-secondary` / `.btn-ghost` added; cookie banner, sticky CTA, header CTAs, form submits all swept to correct tier |
| UX-011 | strategic_bet | magic | 4/3 | done | `app/landing/consent-gate-card.tsx`, `app/landing/cal-embed-client.tsx` | `components/_generated/UX-011-consent-gate-card.tsx` | Ink-bg consent-gate w/ amber CalendarDays icon, white heading + body, PrimaryCTA inside, lazy-load preserved (IntersectionObserver) |

## Summary

<!-- filled at end -->
