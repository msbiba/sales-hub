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
| F-010 | low | _pending_ | | |
| F-011 | low | _pending_ | | |
| F-012 | low | _pending_ | | |
| F-013 | low | _pending_ | | |
