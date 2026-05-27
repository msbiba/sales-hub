# Spec: Supabase Integration — CSV ersetzen

## Zweck

Die statische Datei `solarwerk_kunden.csv` wird durch Supabase als Single-Source-of-Truth ersetzt. Alle Daten-Funktionen in `lib/data.ts` lesen kuenftig aus der Postgres-Tabelle `public.kunden` statt aus dem Dateisystem.

---

## Architektur

### Verbindung

- **Supabase JS Client** (`@supabase/supabase-js`)
- **Anon Key** (public, kein Service Role Key)
- **RLS deaktiviert** — oeffentlicher Lesezugriff
- Env-Variablen in `.env.local` (gitignored)

### Daten-Layer (`lib/data.ts`)

- `fs`, `path`, `papaparse` Imports entfernen
- Supabase Client importieren
- Alle Funktionen querien `public.kunden` via Supabase Client
- Return-Typen bleiben identisch (`Kunde[]`, `Kunde | null`, etc.)
- Mock-Mode Logik bleibt erhalten (URL-Parameter `?mock=`)

### Dateien

| Datei | Aenderung |
|---|---|
| `.env.local` | Neu: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `lib/supabase.ts` | Neu: Supabase Client Singleton |
| `lib/data.ts` | Umschreiben: CSV → Supabase Queries |
| `package.json` | `@supabase/supabase-js` hinzufuegen |

### Was NICHT geaendert wird

- Pages (bereits `searchParams.mock` integriert)
- TypeScript-Typen (`types/index.ts`)
- UI-Komponenten
- `data/solarwerk_pipeline.csv` (bleibt CSV, separate Spec)

---

## Akzeptanzkriterien

- [ ] `npm run build` erfolgreich
- [ ] Dashboard zeigt Kunden aus Supabase (nicht CSV)
- [ ] `/kunden`, `/kunden/[id]`, `/berichte` funktionieren
- [ ] Mock-States (`?mock=error|empty|loading`) funktionieren weiterhin
- [ ] Pipeline-Funktionen bleiben unveraendert (CSV)
- [ ] Keine Supabase-Credentials im Git
