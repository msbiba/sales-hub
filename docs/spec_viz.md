# Spec: Berichte-Visualisierung mit Cross-Filtering

## Zweck

Die Berichte-Seite wird um zwei KPI-Big-Numbers (Anzahl Kunden, Auftragsvolumen TTM) und ein horizontales Bearbeiter-Balkendiagramm erweitert, mit Cross-Filtering zwischen allen drei Charts. Klick auf eine Auspraegung in einem Chart filtert die jeweils anderen Charts und beide Big Numbers konsistent.

---

## Inputs

- `public.kunden` (Supabase) — 36 Eintraege, Felder: `id`, `firma`, `status`, etc.
- `public.pipeline` (Supabase) — 12 Eintraege, Felder: `id`, `customer_id`, `firma`, `volumen_eur`, `angebotsdatum`, `status`, `notiz`
- **Neue Spalte**: `pipeline.bearbeiter text not null` (Werte: `Anna`, `Ben`, `Clara`, random verteilt auf bestehende 12 Eintraege)
- URL-Search-Params: `?ks=<KundenStatus>&ps=<PipelineStatus>&bs=<Bearbeiter>`
- Heutiges Datum (fuer TTM-Berechnung): JavaScript `new Date()` / SQL `current_date`

---

## Verhalten

1. User oeffnet `/berichte` ohne URL-Parameter → alle Filter leer
2. Server-Component liest `searchParams.ks`, `searchParams.ps`, `searchParams.bs`
3. Server fetcht kunden + pipeline aus Supabase
4. Server berechnet alle abgeleiteten Werte (KPIs, Chart-Daten) basierend auf Filtern
5. Client-Component rendert Layout: 2 Big-Number-Karten oben + 2 Charts mittig (Kunden-Status PieChart, Pipeline-Status BarChart) + 1 horizontaler BarChart unten (Bearbeiter)
6. Klick auf Auspraegung im Chart triggert `router.push` mit aktualisiertem Param
7. Erneuter Klick auf bereits aktive Auspraegung entfernt den Param (Toggle off)
8. Button "Filterauswahl loeschen" entfernt alle 3 Params
9. Reload mit URL-Params zeigt gefilterten Zustand persistent

---

## Architektur-Entscheidungen

### Entscheidung 1: Single-Select pro Chart, AND zwischen Charts

- **Gewaehlt:** Pro Chart maximal eine Auspraegung aktiv. Cross-Chart-Filter werden mit AND verknuepft.
- **Alternative waere:** Multi-Select innerhalb eines Charts mit OR-Logik
- **Warum diese:** Klarere User-Mental-Model, einfachere URL-Param-Struktur (Skalar statt CSV), eindeutige Big-Number-Status-Anzeige ohne "+"-Verkettung.

### Entscheidung 2: URL-Params als Single-Source-of-Truth

- **Gewaehlt:** Filter-State ausschliesslich in URL-Search-Params, Server-Component liest und rendert
- **Alternative waere:** Client-State mit `useState`, optional URL-Sync
- **Warum diese:** Bookmarkable, Server-Component nutzt vorhandenes Supabase-Setup direkt, kein Client-Refetch-Boilerplate. Reload und Sharing funktionieren ohne Zusatzcode.

### Entscheidung 3: TTM nur auf Big-Number Auftragsvolumen

- **Gewaehlt:** `angebotsdatum >= current_date - interval '12 months'` wirkt nur auf Big-Number Auftragsvolumen
- **Alternative waere:** TTM auf alle Pipeline-Auswertungen anwenden
- **Warum diese:** Charts zeigen vollstaendige historische Verteilung (sinnvoll fuer Status-Analyse). TTM ist primaer KPI-Konzept fuer Volumen-Snapshots.

### Entscheidung 4: Recharts beibehalten

- **Gewaehlt:** Vorhandene Lib `recharts` fuer neue Charts erweitern (PieChart, BarChart mit `layout="vertical"` fuer horizontal)
- **Alternative waere:** Andere Lib (Chart.js, Tremor, Visx)
- **Warum diese:** Bereits installiert, bestehende Charts funktionieren, native `onClick`-Handler auf Bars/Cells fuer Cross-Filter.

### Entscheidung 5: Server-Component-First Architektur

- **Gewaehlt:** `app/berichte/page.tsx` (Server) liest searchParams, fetcht Daten, berechnet Aggregate, uebergibt fertige Datenstrukturen an `berichte-client.tsx`
- **Alternative waere:** Client fetcht selber und filtert
- **Warum diese:** Konsistent mit existierenden Pages, Supabase-Client kein Browser-Bundle-Overhead, Filter-Logik in einer Funktion auf Server gebuendelt.

---

## Datenbank-Migration

### SQL fuer Supabase (in dieser Reihenfolge)

```sql
-- 1. Spalte nullable hinzufuegen
alter table public.pipeline add column bearbeiter text;

-- 2. Bestehende Eintraege random seeden (Anna/Ben/Clara)
update public.pipeline
set bearbeiter = (array['Anna','Ben','Clara'])[floor(random()*3)::int + 1];

-- 3. NOT NULL Constraint
alter table public.pipeline alter column bearbeiter set not null;

-- 4. Optional: CHECK-Constraint fuer fixe Liste (erweiterbar, daher optional)
-- alter table public.pipeline add constraint pipeline_bearbeiter_check
--   check (bearbeiter in ('Anna', 'Ben', 'Clara'));

-- 5. Index fuer Filter-Performance
create index idx_pipeline_bearbeiter on public.pipeline(bearbeiter);
```

---

## Daten-Layer

### Filter-Typ

```ts
// lib/berichte-filter.ts
export type BerichteFilter = {
  ks: string | null; // Kunden-Status: 'aktiv' | 'in_wartung' | 'beschwerde' | null
  ps: string | null; // Pipeline-Status: 'erstkontakt'...'loeschbar' | null
  bs: string | null; // Bearbeiter: 'Anna' | 'Ben' | 'Clara' | null
};

export function parseFilter(params: { ks?: string; ps?: string; bs?: string }): BerichteFilter {
  return {
    ks: params.ks ?? null,
    ps: params.ps ?? null,
    bs: params.bs ?? null,
  };
}
```

### Fetch-Funktionen in `lib/data.ts`

```ts
// Kunden mit Filter
export async function getKundenGefiltert(filter: BerichteFilter): Promise<Kunde[]>

// Pipeline mit Filter (JOIN auf kunden fuer ks/Kunden-Status-Filter)
export async function getPipelineGefiltert(filter: BerichteFilter): Promise<PipelineEintragMitBearbeiter[]>
```

**Filter-Logik (Pseudocode):**

```
kunden = SELECT * FROM kunden
IF ks: kunden WHERE status = ks
IF ps OR bs: kunden WHERE id IN (
  SELECT customer_id FROM pipeline
  WHERE (ps IS NULL OR status = ps)
    AND (bs IS NULL OR bearbeiter = bs)
)

pipeline = SELECT * FROM pipeline JOIN kunden
IF ks: pipeline WHERE kunden.status = ks
IF ps: pipeline WHERE pipeline.status = ps
IF bs: pipeline WHERE pipeline.bearbeiter = bs
```

---

## UI-Layout

### `app/berichte/page.tsx` (Server)

```tsx
export default async function BerichtePage({
  searchParams,
}: {
  searchParams: Promise<{ ks?: string; ps?: string; bs?: string; mock?: string }>;
}) {
  const params = await searchParams;
  const filter = parseFilter(params);
  const mockMode = params.mock ?? 'normal';

  const [kunden, pipeline] = await Promise.all([
    getKundenGefiltert(filter, mockMode),
    getPipelineGefiltert(filter, mockMode),
  ]);

  const anzahlKunden = kunden.length;
  const auftragsvolumenTTM = berechneAuftragsvolumenTTM(pipeline, filter.ps);
  const kundenVerteilung = countByStatus(kunden, kundenLabels);
  const pipelineVerteilung = countByStatus(pipeline, pipelineLabels);
  const bearbeiterVerteilung = berechneBearbeiterVolumen(pipeline, filter.ps);

  return (
    <BerichteClient
      filter={filter}
      anzahlKunden={anzahlKunden}
      auftragsvolumenTTM={auftragsvolumenTTM}
      kundenVerteilung={kundenVerteilung}
      pipelineVerteilung={pipelineVerteilung}
      bearbeiterVerteilung={bearbeiterVerteilung}
    />
  );
}
```

### `berechneAuftragsvolumenTTM`

```ts
function berechneAuftragsvolumenTTM(pipeline: PipelineEintrag[], statusFilter: string | null): {
  wert: number;
  statusLabel: string; // fuer Tooltip/Untertitel
  ttmHinweis: string;  // "Ohne verloren/loeschbar" oder Status-Label
} {
  const heute = new Date();
  const ttmGrenze = new Date(heute.getFullYear(), heute.getMonth() - 12, heute.getDate());

  const gefiltert = pipeline.filter((p) => {
    if (new Date(p.angebotsdatum) < ttmGrenze) return false;
    if (statusFilter) return p.status === statusFilter;
    return p.status !== 'verloren' && p.status !== 'loeschbar';
  });

  const wert = gefiltert.reduce((sum, p) => sum + (p.volumen_eur ?? 0), 0);
  return {
    wert,
    statusLabel: statusFilter ?? 'alle',
    ttmHinweis: statusFilter ? `TTM, ${statusFilter}` : 'TTM, ohne verloren/loeschbar',
  };
}
```

### `berechneBearbeiterVolumen`

```ts
function berechneBearbeiterVolumen(pipeline: PipelineEintrag[], statusFilter: string | null): {
  bearbeiter: string;
  volumen: number;
}[] {
  const effektiverStatus = statusFilter ?? 'gewonnen';
  const map = new Map<string, number>();
  for (const p of pipeline) {
    if (p.status !== effektiverStatus) continue;
    map.set(p.bearbeiter, (map.get(p.bearbeiter) ?? 0) + p.volumen_eur);
  }
  return Array.from(map.entries())
    .map(([bearbeiter, volumen]) => ({ bearbeiter, volumen }))
    .sort((a, b) => b.volumen - a.volumen);
}
```

### `berichte-client.tsx` (Client) — Layout

```
+-----------------------------------------------------------+
| [Filterauswahl loeschen]  (rechts oben, nur wenn Filter)  |
+-----------------------------+-----------------------------+
| Big Number: Anzahl Kunden   | Big Number: Auftragsvolumen |
| 36                          | 123.456 EUR                 |
|                             | (Tooltip: "TTM, ohne ...")  |
+-----------------------------+-----------------------------+
| Kunden nach Status (Pie)    | Pipeline nach Status (Bar)  |
| Klick auf Segment → Filter  | Klick auf Bar → Filter      |
+-----------------------------+-----------------------------+
| Bearbeiter nach Volumen (horizontaler Bar)                |
| Klick auf Bar → Filter                                    |
+-----------------------------------------------------------+
```

### Cross-Filter-Click-Handler (Client)

```tsx
"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function useFilterToggle() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  return (key: 'ks' | 'ps' | 'bs', value: string) => {
    const next = new URLSearchParams(params);
    if (next.get(key) === value) {
      next.delete(key); // Toggle off
    } else {
      next.set(key, value);
    }
    router.push(`${pathname}?${next.toString()}`);
  };
}
```

### Aktive Auspraegung visuell markieren

- Pie-Segment: erhoehte `opacity`, Border, Ring
- Bar (vertikal + horizontal): satter Farbton + Border, andere Bars `opacity: 0.4`

### Reset-Button

```tsx
{(filter.ks || filter.ps || filter.bs) && (
  <button onClick={() => router.push(pathname)}>
    Filterauswahl loeschen
  </button>
)}
```

---

## Status-Status-Mapping

| Wert (DB) | Label (UI) | Pipeline-Chart anzeigen | Big-Number-Default beruecksichtigen |
|---|---|---|---|
| erstkontakt | Erstkontakt | ja | ja |
| angebot_raus | Angebot raus | ja | ja |
| verhandlung | Verhandlung | ja | ja |
| gewonnen | Gewonnen | ja | ja (Default-Sortierung Bearbeiter-Chart) |
| verloren | Verloren | ja | nein (Default Auftragsvolumen ausschliessen) |
| loeschbar | Loeschbar | ja | nein (Default Auftragsvolumen ausschliessen) |

---

## Edge Cases

1. **Was passiert bei:** `?ks=aktiv&ps=gewonnen&bs=Anna` aber keine Kombination existiert
   **Erwartetes Verhalten:** Big Numbers = 0, alle Charts zeigen "0"-Bars/leere Segmente, Reset-Button sichtbar.

2. **Was passiert bei:** Klick auf bereits aktive Auspraegung (z.B. `ks=aktiv` → erneut auf Aktiv klicken)
   **Erwartetes Verhalten:** URL-Param `ks` wird entfernt, andere Filter bleiben, Charts re-rendern ohne Kunden-Status-Filter.

3. **Was passiert bei:** `?ps=loeschbar` gesetzt
   **Erwartetes Verhalten:** Big Number Auftragsvolumen zeigt TTM-Summe der `loeschbar`-Eintraege (User-Override des Default-Excludes). Tooltip: "TTM, loeschbar".

4. **Was passiert bei:** Pipeline-Eintrag mit `angebotsdatum` > heute (Zukunft)
   **Erwartetes Verhalten:** Wird nicht in TTM-Summe gezaehlt (TTM = past 12 months). Aber in Pipeline-Status-Chart zaehlt voll mit.

5. **Was passiert bei:** Bearbeiter-Wert in DB der nicht in Anna/Ben/Clara liegt (z.B. neuer User legt "Daniel" an)
   **Erwartetes Verhalten:** Bearbeiter-Chart zeigt zusaetzliche Bar fuer "Daniel" automatisch (dynamisch aus Daten). Dropdown im `pipeline/neu`-Form zeigt aber nur Anna/Ben/Clara — Manuelle DB-Aenderung sichtbar in Berichten.

6. **Was passiert bei:** Mock-State `?mock=error` zusammen mit Filter-Params
   **Erwartetes Verhalten:** Mock-State greift in `getKundenGefiltert`/`getPipelineGefiltert` via `mockMode`-Parameter, `error.tsx` faengt ab. Filter-Params bleiben in URL.

7. **Was passiert bei:** 0 Bearbeiter haben gewonnene Pipeline-Eintraege
   **Erwartetes Verhalten:** Bearbeiter-Chart leer (keine Bars), Hinweis "Keine Daten fuer Filterauswahl".

---

## Akzeptanzkriterien

- [ ] Spalte `pipeline.bearbeiter text not null` existiert
- [ ] 12 bestehende Pipeline-Eintraege haben random Anna/Ben/Clara
- [ ] `pipeline/neu` Form hat Pflicht-Dropdown "Bearbeiter" mit Anna/Ben/Clara
- [ ] `lib/validation.ts` validiert `bearbeiter` als required
- [ ] API-Routes `POST /api/pipeline` + `PUT /api/pipeline/[id]` schreiben `bearbeiter`
- [ ] `/berichte` zeigt 5 Komponenten: 2 Big Numbers + 3 Charts
- [ ] Big Number "Anzahl Kunden" passt sich allen 3 Filtern an
- [ ] Big Number "Auftragsvolumen TTM" zeigt Default-Summe ohne verloren/loeschbar
- [ ] Big Number Tooltip zeigt "Ohne verloren/loeschbar" wenn `ps` nicht gesetzt, sonst Status-Label
- [ ] Klick auf Pipeline-Status-Bar setzt `?ps=<status>` in URL
- [ ] Klick auf Kunden-Status-Pie-Segment setzt `?ks=<status>` in URL
- [ ] Klick auf Bearbeiter-Bar setzt `?bs=<bearbeiter>` in URL
- [ ] Erneuter Klick auf bereits aktive Auspraegung entfernt den Param
- [ ] Aktive Auspraegung visuell hervorgehoben (saturierte Farbe, andere blass)
- [ ] AND-Logik zwischen Charts: `?ks=aktiv&ps=gewonnen` filtert Kunden auf aktiv UND deren Pipeline auf gewonnen
- [ ] Bearbeiter-Chart sortiert absteigend nach Volumen des aktiven `ps` (Default `gewonnen`)
- [ ] "Filterauswahl loeschen"-Button entfernt alle 3 Params
- [ ] URL ohne Params zeigt ungefilterten Zustand
- [ ] Reload mit URL-Params zeigt gefilterten Zustand identisch
- [ ] `npm run build` erfolgreich
- [ ] **Alle Edge Cases aus dem Abschnitt oben sind getestet**

---

## Betroffene Dateien

| Datei | Aenderung |
|---|---|
| Supabase | `alter table pipeline` (siehe SQL-Migration) |
| `types/index.ts` | `PipelineEintrag.bearbeiter: string` ergaenzen |
| `lib/data.ts` | Neue `getKundenGefiltert`, `getPipelineGefiltert`, SELECT um `bearbeiter` erweitern |
| `lib/berichte-filter.ts` | **Neu** — `BerichteFilter`-Typ + `parseFilter` |
| `lib/berichte-aggregate.ts` | **Neu** — `berechneAuftragsvolumenTTM`, `berechneBearbeiterVolumen`, `countByStatus` |
| `lib/validation.ts` | `bearbeiter` zu `PipelineInput`, Validierung gegen Anna/Ben/Clara |
| `app/berichte/page.tsx` | Komplett-Refactor: searchParams lesen, Aggregate berechnen |
| `app/berichte/berichte-client.tsx` | Komplett-Refactor: 2 Big Numbers + 3 Charts + Click-Handler + Reset-Button |
| `app/api/pipeline/route.ts` | `bearbeiter` in INSERT aufnehmen |
| `app/api/pipeline/[id]/route.ts` | `bearbeiter` in UPDATE aufnehmen |
| `app/pipeline/neu/pipeline-neu-client.tsx` | Dropdown "Bearbeiter" hinzufuegen |
| `app/pipeline/[id]/pipeline-detail-client.tsx` | Bearbeiter-Feld in Edit-Form |

---

## Abgrenzung (Out of Scope)

- Kein Datum-Range-Picker fuer TTM (TTM ist fix = letzte 12 Monate ab heute)
- Keine Drill-Down-Tabelle unter Charts (nur Chart-Cross-Filter)
- Keine Aenderung an `/dashboard` oder `/kunden`-Seite
- Keine neue Tabelle `bearbeiter` (freitext-Feld, fixe Liste UI-seitig erzwungen)
- Keine Auth-Verknuepfung Bearbeiter → `auth.users`
- Keine Animation der Filter-Transitions (Recharts-Default reicht)
- Kein Export der gefilterten Daten (CSV/PDF)
