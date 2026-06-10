---
source_report: reports/audit-2026-06-10-1515-slscrm.vercel.app.md
applied_at: 2026-06-10
branch: audit-fixes-1515
scope: all (critical + high + medium + low)
---

# Fixes Applied — slscrm.vercel.app `/landing`

## Per-finding log

| Finding | Severity | Status | File(s) changed | What changed |
|---|---|---|---|---|
| F-001 | high | fixed | `app/landing/layout.tsx` | Wrap `{children}` in `<main id="main">` to introduce the missing landmark. |
| F-002 | high | fixed | `app/landing/cal-embed-client.tsx`, `app/layout.tsx` | Cal.com embed rewritten as facade: mounts only on click ("Termin wählen") or when its section enters viewport (IntersectionObserver, 200 px rootMargin). Added `<link rel="preconnect"/dns-prefetch" href="https://app.cal.com">` in root layout marketing head branch so the eventual handshake is faster. |
| F-003 | high | fixed | `app/landing/rechner-client.tsx` | Calculator email input now has `id="rechner-email"` + `<label htmlFor="rechner-email">`. Also added `autoComplete="email"` while editing the same input. |
| F-004 | high | partial / fixed (GA) | `app/landing/layout.tsx`, `app/landing/analytics-client.tsx` (new), `app/landing/cookie-banner-client.tsx` | GA scripts moved out of unconditional layout into new `Analytics` client component that only renders the `<Script>` tags when `localStorage["sw-cookie-consent-v2"] === "all"`. Cookie banner now dispatches a `sw-cookie-consent-change` event so analytics can enable without reload, and the banner copy + primary button label were corrected ("Analytics zustimmen") so the consent flow is no longer misleading. **Sentry portion deferred** — Sentry envelope POSTs originate from Vercel platform auto-instrumentation, not from any source file or dependency in this app (`grep -r sentry` matches only the audit artefacts). Cannot be gated from app code. |
| F-005 | medium | fixed | `app/landing/layout.tsx` | Added skip-link `<a href="#main">Zum Inhalt springen</a>` as first child of the landing wrapper with Tailwind `sr-only focus:not-sr-only` (visible on keyboard focus). Target id matches `<main id="main">` from F-001. |
| F-006 | medium | fixed | `app/landing/satellite-preview-client.tsx` | Hero form inputs got `autoComplete="postal-code"` (PLZ), `autoComplete="address-line2"` (Hausnummer), `autoComplete="email"` (E-Mail). |
| F-007 | medium | fixed | `app/landing/faq-client.tsx` | Each FAQ button now has `aria-controls={panelId}`; matching panel `<div id={panelId} role="region">`. `panelId = "faq-panel-${i}"`. |
| F-008 | medium | fixed | `app/landing/comparison.tsx` | All `<thead><th>` got `scope="col"`. First cell of each body row converted to `<th scope="row">` (was `<td>`). |
| F-009 | medium | fixed | `app/landing/page.tsx` | Metadata extended with `alternates.canonical`, `openGraph.url`, `openGraph.images` (1200×630 absolute URL) and `twitter.card="summary_large_image"` + `twitter.images`. |
| F-010 | medium | fixed | `app/landing/hero.tsx` | Secondary CTA "Erst rechnen lassen →" given `inline-flex min-h-[44px] items-center px-2 py-2` so tap target ≥ WCAG 2.5.5 24×24 (we exceed and hit the AAA 44 px target). |
| F-011 | medium | fixed | `app/landing/cal-embed-client.tsx` | Resolved together with F-002 — same facade defers all 57 Cal.com chunks + 3 fonts until user gesture or in-viewport entry. |
| F-012 | low | fixed | `app/landing/landing-footer.tsx` | Footer link `<a>` / `<Link>` elements get `inline-block py-1.5 leading-6` → computed height ≥ 24 px. Static address `<li>` also padded for consistent rhythm. |
| F-013 | low | deferred (needs manual review) | — | Cal.com font preload warning originates inside the `app.cal.com` iframe — third-party. No code change possible from this app. Track upstream with Cal.com or accept the warning. |
| F-014 | low | fixed | `app/landing/counter-client.tsx` | `useState(value)` initialises with the final number so SSR HTML renders e.g. `480+` / `142 MWp` / `Ø 7,4 J.` directly (no-JS users + crawlers see the real values). Animation only kicks in on first IntersectionObserver entry by snapping to 0 and easing back up, still gated by `prefers-reduced-motion: reduce`. |

## Summary

- **Fixed:** 13 — F-001, F-002, F-003, F-004 (GA only), F-005, F-006, F-007, F-008, F-009, F-010, F-011, F-012, F-014
- **Partially fixed:** F-004 — GA gated, Sentry deferred (Vercel-platform-injected, not in source)
- **Deferred (third-party / out of reach):** F-013 — Cal.com iframe font preload warning
- **Skipped (out of scope):** 0

## Verification per tier

After each tier the following ran clean (no new errors):

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build` (21 static pages, all routes generated)

## Commits on branch `audit-fixes-1515`

```
18f91cf fix(audit): resolve low findings (F-012, F-014)
171e5bf fix(audit): resolve medium findings (F-005..F-010)
1d630b0 fix(audit): resolve high findings (F-001, F-002, F-003, F-004)
```

## Next step

Review the diff (`git diff main..audit-fixes-1515`), then merge `audit-fixes-1515` into `main`. Optionally re-run `/website-audit https://slscrm.vercel.app/landing` post-deploy to confirm the 13 fixed findings disappear from the next report.

## Notes on judgement calls

- **F-004 banner copy:** the original "Wir verwenden nur essenzielle Cookies" was contradicted by the actual GA load. Rather than just gate GA silently, the banner text was rewritten to mention Analytics explicitly and the primary button relabelled "Analytics zustimmen". This changes visible copy — a product/legal review is recommended before merging.
- **F-002 / F-011 facade:** the IntersectionObserver mounts the embed when its section approaches the viewport (`rootMargin: 200px`). The audit also accepted an explicit click-to-load flow; both are supported here (the click button is shown until either trigger fires). Users who scroll fast will still get the embed slightly before they click — if a stricter consent-style flow is required, drop the IO and keep only the button.
- **F-014 hydration:** `useState(value)` matches between SSR and first client render, so no hydration warning. The 0→value animation is triggered inside the IO callback, not during mount.
