# Spec: Mock-Up States

## Zweck

Ein State-Mock-System, mit dem verschiedene UI-Zustaende (normal, loading, error, empty) auf der Website live getestet werden koennen. Per Dev-UI-Toggle oder URL-Parameter laesst sich der aktive Mock-State wechseln — ohne Code-Aenderung, ohne Server-Restart.

---

## Inputs

### Code-Snippet (Basis)

```ts
let mockMode = 'normal'
// 'normal'|'loading'|'error'|'empty'

export async function getKunden() {
  await new Promise(r => setTimeout(r, 1500))
  if (mockMode === 'error')
    throw new Error('Mock-Fehler')
  if (mockMode === 'empty') return []
  return ladeKundenAusCsv()
}
```

### Betroffene Daten-Funktionen

- `getKunden()` — Kundenliste (Dashboard, Kundenliste)
- `getKunde(id)` — Einzelner Kunde (Detail-Seite)
- `getPipeline()` — Pipeline-Eintraege
- `getPipelineEintrag(id)` — Einzelner Pipeline-Eintrag

---

## Architektur

### Mock-Mode Steuerung

**Primaer: URL-Parameter** `?mock=error|loading|empty|normal`

- Server Components lesen `searchParams.mock` aus
- Wert wird an Daten-Funktionen durchgereicht
- Default: `'normal'` (kein Parameter = normales Verhalten)

**Sekundaer: Dev-UI-Toggle** (optional, nice-to-have)

- Floating Widget unten rechts (nur in `NODE_ENV === 'development'`)
- Client Component, setzt URL-Parameter via `router.push`
- Zeigt aktuellen State an

### Daten-Layer Aenderungen (`lib/data.ts`)

1. Bestehende `getKunden()` umbenennen zu `ladeKundenAusCsv()` (private Helper)
2. Bestehende `getPipeline()` umbenennen zu `ladePipelineAusCsv()` (private Helper)
3. Neue exportierte Funktionen mit Mock-Logik:

```ts
// mockMode wird von aufrufender Page via Parameter uebergeben
export async function getKunden(mockMode: string = 'normal'): Promise<Kunde[]> {
  await new Promise(r => setTimeout(r, 1500))
  if (mockMode === 'loading') await new Promise(() => {}) // never resolves
  if (mockMode === 'error') throw new Error('Mock-Fehler')
  if (mockMode === 'empty') return []
  return ladeKundenAusCsv()
}

export async function getKunde(id: number, mockMode: string = 'normal'): Promise<Kunde | null> {
  const kunden = await getKunden(mockMode)
  return kunden.find(k => k.id === id) ?? null
}

export async function getPipeline(mockMode: string = 'normal'): Promise<PipelineEintrag[]> {
  await new Promise(r => setTimeout(r, 1500))
  if (mockMode === 'loading') await new Promise(() => {})
  if (mockMode === 'error') throw new Error('Mock-Fehler: Pipeline')
  if (mockMode === 'empty') return []
  return ladePipelineAusCsv()
}

export async function getPipelineEintrag(id: number, mockMode: string = 'normal'): Promise<PipelineEintrag | null> {
  const pipeline = await getPipeline(mockMode)
  return pipeline.find(e => e.id === id) ?? null
}
```

### Page-Layer Aenderungen

Jede Page die Daten-Funktionen aufruft, liest `searchParams.mock` und reicht Wert durch:

```ts
// Beispiel: app/page.tsx oder app/dashboard/page.tsx
// Next.js 16: searchParams ist ein Promise
export default async function Page({ searchParams }: { searchParams: Promise<{ mock?: string }> }) {
  const params = await searchParams
  const mockMode = params.mock ?? 'normal'
  const kunden = await getKunden(mockMode)
  // ...
}
```

**Hinweis**: `getPipeline()` und `getPipelineEintrag()` sind im Original synchron.
Mock-Wrapper macht sie async → alle Aufrufer (6 Pages) brauchen `await`.

### Neue UI-Komponenten

#### `app/error.tsx` — Error Boundary

- Faengt `throw new Error('Mock-Fehler')` ab
- Zeigt benutzerfreundliche Fehlermeldung
- "Erneut versuchen"-Button (ruft `reset()`)

#### Empty-State in Dashboard/Kundenliste

- Wenn `kunden.length === 0`: Hinweis-Box "Keine Kunden vorhanden"
- Statt leerer Tabelle

#### `app/loading.tsx` — Loading State

- Next.js Suspense-basiert
- Skeleton-UI oder Spinner
- Wird automatisch angezeigt waehrend Server Component pending ist
- `mockMode === 'loading'` haelt Promise offen → Loading-State bleibt dauerhaft sichtbar zum Testen

---

## Verhalten (Schritt fuer Schritt)

1. User oeffnet Seite normal → `mockMode = 'normal'` → Daten laden nach 1.5s Delay
2. User haengt `?mock=error` an URL → `getKunden` wirft Error → `error.tsx` faengt ab → Fehler-UI sichtbar
3. User haengt `?mock=empty` an URL → `getKunden` gibt `[]` zurueck → Empty-State-UI sichtbar
4. User haengt `?mock=loading` an URL → Promise resolvet nie → `loading.tsx` bleibt dauerhaft sichtbar
5. User entfernt Parameter → normales Verhalten

---

## Akzeptanzkriterien

- [ ] Original Code-Snippet wurde als Basis verwendet
- [ ] `lib/data.ts` enthaelt Mock-Logik fuer alle 4 Daten-Funktionen (`getKunden`, `getKunde`, `getPipeline`, `getPipelineEintrag`)
- [ ] `?mock=normal` — Daten laden korrekt (mit 1.5s Delay)
- [ ] `?mock=error` — Error-UI wird angezeigt (nicht Next.js Default-Overlay)
- [ ] `?mock=empty` — Empty-State-UI wird angezeigt (nicht leere Tabelle)
- [ ] `?mock=loading` — Loading-UI bleibt dauerhaft sichtbar
- [ ] Ohne `?mock`-Parameter verhaelt sich App exakt wie vorher
- [ ] Alle Aenderungen auf Branch `mock_up_states`

---

## Betroffene Dateien

| Datei | Aenderung |
|---|---|
| `lib/data.ts` | Mock-Logik, Funktionen umbenennen + wrappen |
| `app/page.tsx` oder Dashboard-Page | `searchParams.mock` lesen, durchreichen |
| `app/error.tsx` | Neu: Error Boundary UI |
| `app/loading.tsx` | Neu: Loading/Skeleton UI |
| Dashboard Client Component | Empty-State Handling |
| `app/kunden/page.tsx` | `searchParams.mock` lesen, durchreichen |
| `app/kunden/[id]/page.tsx` | `searchParams.mock` lesen, durchreichen |
| `app/pipeline/page.tsx` | `searchParams.mock` lesen, sync→async (`await`) |
| `app/pipeline/[id]/page.tsx` | `searchParams.mock` lesen, sync→async (`await`) |
| `app/berichte/page.tsx` | `searchParams.mock` lesen, durchreichen |

---

## Abgrenzung (Out of Scope)

- Kein persistenter Mock-State (kein localStorage/Cookie)
- Kein Mock fuer Auth/Login
- Kein automatisiertes Testing (nur manuelles Browser-Testing)
- Dev-UI-Toggle ist nice-to-have, nicht Pflicht fuer v1
