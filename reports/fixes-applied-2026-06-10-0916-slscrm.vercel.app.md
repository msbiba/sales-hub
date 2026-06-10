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
| F-005 | medium | partial | `app/kunden/[id]/kunde-detail-client.tsx` | Detail-edit form: telefon→`type="tel"`, anlagengroesse→`type="number" inputMode="numeric"`. Remaining `/kunden/neu` type changes done in medium tier. |
| F-006 | medium | fixed | `app/login/login-form.tsx`, `app/profil/profil-client.tsx` | Login password `autocomplete` toggles `current-password`/`new-password` by mode; login email `username`. Profil password fields `new-password`; name field `name`. (Landed with F-002 since same lines.) |
| F-007 | medium | _pending_ | | |
| F-008 | medium | _pending_ | | |
| F-009 | medium | fixed | `app/kunden/neu/neuer-kunde-client.tsx`, `app/dashboard-client.tsx` | Added `Interessent` option to the kunde-anlegen status `<select>` (matches `KundenStatus` enum); also added it to the dashboard status filter so those customers are reachable. (Detail-edit form already had it.) Landed with F-002 form rewrite. |
| F-010 | low | _pending_ | | |
| F-011 | low | _pending_ | | |
| F-012 | low | _pending_ | | |
| F-013 | low | _pending_ | | |
