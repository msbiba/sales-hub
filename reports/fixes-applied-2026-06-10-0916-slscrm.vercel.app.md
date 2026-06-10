# Fixes Applied — slscrm.vercel.app

- **Source audit:** `reports/audit-2026-06-10-0916-slscrm.vercel.app.md`
- **Branch:** `website-apply-audit-fixes_20260610`
- **Scope chosen:** all (critical 1 + high 3 + medium 5 + low 4 = 13)
- **Started:** 2026-06-10

Findings processed in severity order. Build verified after each tier.

## Changelog

| Finding | Severity | Status | File(s) changed | What changed |
|---|---|---|---|---|
| F-001 | critical | fixed | `app/dashboard-client.tsx` | Dashboard rows now keyboard-reachable: added `role="link"`, `tabIndex={0}`, `aria-label`, `onKeyDown` (Enter/Space) handler + visible focus ring. Mouse `onClick` preserved. |
| F-002 | high | fixed | `app/kunden/neu/neuer-kunde-client.tsx`, `app/login/login-form.tsx`, `app/profil/profil-client.tsx`, `app/passwort-reset/page.tsx`, `app/dashboard-client.tsx`, `app/pipeline/pipeline-client.tsx`, `app/nutzer/nutzer-client.tsx`, `app/kunden/[id]/kunde-detail-client.tsx` | Programmatic labels added site-wide: `id`+`htmlFor` on every visible-label input/select/textarea; `aria-label` on the unlabelled filter/search controls (dashboard, pipeline, nutzer) and invite-modal fields. |
| F-003 | high | fixed | `app/kunden/neu/neuer-kunde-client.tsx` | Each field error `<p>` now has `id` + `role="alert"`; inputs set `aria-invalid` and `aria-describedby` pointing at the error id. Top-level error banner also got `role="alert"`. |
| F-004 | high | fixed | `app/nav.tsx` | Header is now responsive: nav links + email/logout hidden below `md`, replaced by an accessible hamburger toggle (`aria-expanded`/`aria-controls`) opening a vertical drawer. Logo no longer wraps (`whitespace-nowrap`). Removes horizontal overflow at 375/768 px. |
| F-005 | medium | fixed | `app/kunden/neu/neuer-kunde-client.tsx`, `app/kunden/[id]/kunde-detail-client.tsx` | `/kunden/neu`: telefon→`type="tel"`+`autocomplete="tel"`, email→`type="email"`+`autocomplete="email"`, anlagengroesse→`type="number" inputMode="numeric"`. Detail-edit form got matching `tel`/`number` types. Form uses `noValidate` so native validation won't block; behaviour preserved. |
| F-006 | medium | fixed | `app/login/login-form.tsx`, `app/profil/profil-client.tsx` | Login password `autocomplete` toggles `current-password`/`new-password` by mode; login email `username`. Profil password fields `new-password`; name field `name`. (Landed with F-002 since same lines.) |
| F-007 | medium | deferred (needs manual review) | — | **Located** at `lib/berichte-aggregate.ts:105` (`berechneBearbeiterVolumen`) + source data in the Supabase `pipeline` table. Double-counting is dirty DB data: legacy freetext `bearbeiter` values (short "Anna/Ben/Clara") coexist with full names ("Anna Mueller", "Ben Schmidt", "Bibi Hartmann"), and the helper additionally seeds a hardcoded `["Anna","Ben","Clara"]`. The CSV has no `bearbeiter` column, so the values are in the DB only. **Correct fix = data backfill**: populate `pipeline.bearbeiter_id` from `profiles` and aggregate/group by `bearbeiter_id` (join `profiles.full_name` for labels). Requires DB write/migration access not available in this repo task; a frontend-only name-normalisation map would guess and risk misattributing volume. |
| F-008 | medium | fixed | `app/not-found.tsx` (new) | Added a German `not-found` page ("404 / Seite nicht gefunden") with a "Zurück zum Dashboard" link and a German `<title>` metadata, replacing the default English Next.js fallback. Renders inside the existing app shell (nav + footer). |
| F-009 | medium | fixed | `app/kunden/neu/neuer-kunde-client.tsx`, `app/dashboard-client.tsx` | Added `Interessent` option to the kunde-anlegen status `<select>` (matches `KundenStatus` enum); also added it to the dashboard status filter so those customers are reachable. (Detail-edit form already had it.) Landed with F-002 form rewrite. |
| F-010 | low | fixed | `app/dashboard-client.tsx` | KPI tiles now cover every status: added `Interessenten` and `In Wartung` counts and rendered 5 tiles (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`). aktiv + interessent + in_wartung + beschwerde now sums to gesamt. |
| F-011 | low | fixed | `app/pipeline/pipeline-client.tsx` | Renamed first KPI label from "Offene Angebote" to "Angebote draußen". Metric (`angebot_raus` count) unchanged — only the label matches the metric definition. |
| F-012 | low | fixed (with one carve-out) | `app/page.tsx`, `app/pipeline/page.tsx`, `app/berichte/page.tsx`, `app/kunden/page.tsx`, `app/kunden/neu/page.tsx`, `app/kunden/[id]/page.tsx`, `app/pipeline/[id]/page.tsx`, `app/pipeline/neu/page.tsx`, `app/nutzer/page.tsx`, `app/profil/page.tsx`, `app/login/page.tsx`, `app/not-found.tsx` | Per-route `metadata.title` exports on every server `page.tsx` ("Dashboard · Solarwerk Sued", "Pipeline · …", "Berichte · …", "Kunden · …", "Neuer Kunde · …", "Kunde · …", "Pipeline-Eintrag · …", "Neuer Pipeline-Eintrag · …", "Nutzer · …", "Mein Profil · …", "Anmelden · …", "Seite nicht gefunden · …"). Generic `metadata` in `app/layout.tsx` remains as fallback. **Carve-out:** `app/passwort-reset/page.tsx` is itself a client component (`"use client"` at top), so it cannot export `metadata` without splitting into server-wrapper + client-form. Out of scope of a surgical fix — title falls back to root metadata until that small refactor is done. **Note:** dropped `generateMetadata` on `/kunden/[id]` because it would double-fetch `getKunde` (Supabase, not deduped, with a deliberate 1.5 s artificial delay) — used a static title instead. |
| F-013 | low | deferred (needs manual review) | — | **Located** at `lib/data.ts:19` (`getKunden`): every call awaits `new Promise(r => setTimeout(r, 1500))` before hitting Supabase, unconditional on mode. This alone explains the observed DCL 2566 ms / load 2956 ms (TTFB 15 ms). Same artificial 1.5 s sleep exists on `getKunde`, `getPipeline`, `getPipelineEintrag`. Per `CLAUDE.md` the codebase is a teaching repo with "bewusst unfertige Stellen" / loading-state demos, so the sleep looks **intentional** as a mock-latency device. Removing it would fix F-013 but change demo behaviour the curriculum may rely on. Recommended manual action: either (a) gate the sleep behind `mockMode === "loading"` only, or (b) keep it for the course but acknowledge the perf finding is a known artefact. No frontend bundle/code-split work was attempted because the delay, not the bundle, is the dominant cost. |

## Summary

- **Fixed:** 11 — F-001, F-002, F-003, F-004, F-005, F-006, F-008, F-009, F-010, F-011, F-012 (with one client-page carve-out)
- **Deferred (needs manual review):** 2 — F-007 (DB backfill needed), F-013 (intentional teaching mock-latency)
- **Skipped (out of scope):** 0
- **Verification:** `npx tsc --noEmit`, `npm run lint`, `npm run build` all green after every tier.
- **Branch:** `website-apply-audit-fixes_20260610`
- **Commits:**
  - `d032e36` — fix(audit): resolve critical finding (F-001)
  - `9f5c18c` — fix(audit): resolve high findings (F-002, F-003, F-004)
  - `031e7c5` — fix(audit): resolve medium findings (F-005, F-008)
  - _(pending)_ — fix(audit): resolve low findings (F-010, F-011, F-012)

### Other notes
- `git add -A` in the Tier-1 commit also swept in the audit artefacts under `.playwright-mcp/` (untracked at session start). Harmless — they are the audit evidence — but consider adding `.playwright-mcp/` to `.gitignore` so future commits stay clean.
- Several findings were _co-located_ on lines that the high-tier (F-002) edit had to touch anyway: F-005 (partial), F-006, F-009. They landed alongside the high-tier rewrite to avoid editing the same input lines twice; commit messages call this out. Rollback by tier still works for F-002/F-003/F-004 but those co-located attrs would revert with them.

