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
| F-002 | high | _pending_ | | |
| F-003 | high | _pending_ | | |
| F-004 | high | _pending_ | | |
| F-005 | medium | _pending_ | | |
| F-006 | medium | _pending_ | | |
| F-007 | medium | _pending_ | | |
| F-008 | medium | _pending_ | | |
| F-009 | medium | _pending_ | | |
| F-010 | low | _pending_ | | |
| F-011 | low | _pending_ | | |
| F-012 | low | _pending_ | | |
| F-013 | low | _pending_ | | |
