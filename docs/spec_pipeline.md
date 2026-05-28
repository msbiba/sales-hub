# Spec: Pipeline-Tabelle mit FK auf Kunden

## Zweck

Die `solarwerk_pipeline.csv` wird in Supabase als Tabelle `public.pipeline` nachgebildet, mit Foreign-Key-Beziehung zu `public.kunden` (1:n). Ein Kunde kann nur geloescht werden, wenn alle zugehoerigen Pipeline-Eintraege den Status `loeschbar` haben.

---

## Inputs

- `data/solarwerk_pipeline.csv` — 12 valide Eintraege (IDs 1-12), bereinigt um dirty rows (ID 13 "Stadtw", ID 15 "Pipeline Test", ID 14 fehlt)
- `public.kunden` — bestehende Supabase-Tabelle mit 24 Bestandskunden
- TypeScript-Typ `PipelineEintrag` (`types/index.ts`)
- 12 neue Lead-Firmen aus Pipeline-CSV, die als Kunden in `public.kunden` ergaenzt werden muessen

---

## Verhalten

1. 12 Pipeline-Firmen als neue Kunden-Eintraege in `public.kunden` einfuegen (alle als Leads, Status `aktiv`)
2. Tabelle `public.pipeline` erstellen mit FK `customer_id` → `kunden(id)` und `ON DELETE NO ACTION`
3. 12 bereinigte Pipeline-Eintraege einfuegen, `customer_id` per Subquery aus `firma` aufloesen
4. PipelineStatus-Enum um `loeschbar` erweitern (CHECK-Constraint)
5. BEFORE-DELETE-Trigger auf `kunden`: blockiert Loeschung wenn nicht-`loeschbar` Pipeline-Eintraege existieren
6. `lib/data.ts` umschreiben: `getPipeline()` und `getPipelineEintrag()` lesen aus Supabase statt CSV
7. API-Routes `/api/pipeline` (POST) und `/api/pipeline/[id]` (PUT/DELETE) auf Supabase umstellen
8. TypeScript-Typen anpassen: `id: string`, neues Feld `customer_id: string`, Status-Enum erweitern

---

## Architektur-Entscheidungen

### Entscheidung 1: ON DELETE NO ACTION + BEFORE-DELETE-Trigger

- **Gewaehlt:** FK mit `ON DELETE NO ACTION`, dazu BEFORE-DELETE-Trigger auf `kunden` mit Custom-Logik
- **Alternative waere:** `ON DELETE RESTRICT` oder `ON DELETE CASCADE`
- **Warum diese:** `RESTRICT` blockiert ALLE Loeschungen sobald irgendein Pipeline-Eintrag existiert, unabhaengig vom Status. `CASCADE` loescht stillschweigend mit. Trigger erlaubt feingranulare Kontrolle: nur Pipeline-Eintraege mit Status `loeschbar` werden mitgeloescht, alle anderen blockieren das Loeschen mit klarer Fehlermeldung.

### Entscheidung 2: Neuer Status `loeschbar` statt `verloren` umdeuten

- **Gewaehlt:** Erweiterung der Status-Liste um `loeschbar` (sechs Werte: `erstkontakt`, `angebot_raus`, `verhandlung`, `gewonnen`, `verloren`, `loeschbar`)
- **Alternative waere:** `verloren` als Synonym fuer "darf geloescht werden" nutzen
- **Warum diese:** Semantische Trennung — `verloren` ist Sales-Outcome (Deal verloren), `loeschbar` ist Lifecycle-Marker (Datensatz darf weg). Vermischung wuerde Reports verfaelschen.

### Entscheidung 3: Pipeline-Tabelle behaelt `firma` als Snapshot

- **Gewaehlt:** Pipeline-Spalten: `id`, `customer_id`, `firma`, `volumen_eur`, `angebotsdatum`, `status`, `notiz`
- **Alternative waere:** Voll normalisiert — `firma` nur in `kunden`, immer per JOIN
- **Warum diese:** User-Vorgabe. Snapshot erlaubt Anzeige ohne JOIN und behaelt Firma auch dann, falls sich Firmenname im Kunden-Datensatz nachtraeglich aendert.

### Entscheidung 4: UUID-PK + UUID-FK

- **Gewaehlt:** `id uuid primary key default gen_random_uuid()`, `customer_id uuid not null references kunden(id)`
- **Alternative waere:** Sequentielle integer-IDs
- **Warum diese:** Konsistenz mit `kunden`-Tabelle, Supabase-Standard, API-sicher.

---

## SQL-Befehle

### 1. Fehlende Kunden anlegen (12 Lead-Firmen aus Pipeline-CSV)

```sql
insert into public.kunden (firma, ansprechpartner, branche, anlagengroesse_kwp, status, letzter_kontakt, telefon, email, notiz)
values
  ('Druckhaus Lindauer', 'Martin Lindauer', 'Industrie', 95, 'aktiv', '2026-04-20', null, null, 'Lead aus Pipeline. Anfrage ueber Website.'),
  ('Obsthof Berger', 'Claudia Berger', 'Landwirtschaft', 130, 'aktiv', '2026-04-15', null, null, 'Lead aus Pipeline. Kuehlhalle fuer Obstlagerung.'),
  ('Sporthotel Weitblick', 'Juergen Hintermeier', 'Gewerbe', 180, 'aktiv', '2026-03-28', null, null, 'Lead aus Pipeline. Foerderberatung laeuft.'),
  ('Baeckerei Kronenbrot', 'Stefanie Kronenberger', 'Handwerk', 42, 'aktiv', '2026-04-02', null, null, 'Lead aus Pipeline. Backstube und Laden.'),
  ('Metallwerk Donau GmbH', 'Karl-Heinz Riedl', 'Industrie', 350, 'aktiv', '2026-03-10', null, null, 'Lead aus Pipeline. Foerderzusage erwartet.'),
  ('Weingut Am Sonnenberg', 'Elisabeth Frey', 'Landwirtschaft', 75, 'aktiv', '2026-04-08', null, null, 'Lead aus Pipeline. Interesse an Agri-PV.'),
  ('Fitnessstudio PowerZone', 'Timo Albrecht', 'Gewerbe', 60, 'aktiv', '2026-04-25', null, null, 'Lead aus Pipeline. Hohe Klimaanlage-Kosten.'),
  ('Weber Maschinenbau AG', 'Iris Weber', 'Industrie', 480, 'aktiv', '2026-02-14', null, null, 'Lead aus Pipeline. Grossauftrag in Klaerung.'),
  ('Blumengrossmarkt Suedwest', 'Gerhard Pfaff', 'Gewerbe', 110, 'aktiv', '2026-05-02', null, null, 'Lead aus Pipeline. Halle mit Kuehlzellen.'),
  ('Tischlerei Seefeld', 'Monika Seefeld', 'Handwerk', 35, 'aktiv', '2026-04-30', null, null, 'Lead aus Pipeline. Budget knapp, Foerderpruefung.'),
  ('Kaeserei Allgaeuer Gold', 'Anton Schmid', 'Landwirtschaft', 200, 'aktiv', '2026-03-20', null, null, 'Lead aus Pipeline. Kaesereifung-Kuehlung.'),
  ('Stadtwerke Mering', 'Dr. Ulrich Fink', 'Gewerbe', 650, 'aktiv', '2026-01-18', null, null, 'Lead aus Pipeline. Groesstes Projekt Q3 2026.');
```

### 2. Pipeline-Tabelle erstellen

```sql
create table public.pipeline (
  id              uuid primary key default gen_random_uuid(),
  customer_id     uuid not null references public.kunden(id) on delete no action,
  firma           text not null,
  volumen_eur     integer not null check (volumen_eur >= 0),
  angebotsdatum   date not null,
  status          text not null check (status in (
                    'erstkontakt', 'angebot_raus', 'verhandlung',
                    'gewonnen', 'verloren', 'loeschbar'
                  )),
  notiz           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_pipeline_customer on public.pipeline(customer_id);
create index idx_pipeline_status on public.pipeline(status);

comment on table public.pipeline is 'Sales-Pipeline mit FK zu kunden (1:n)';
```

### 3. updated_at-Trigger

```sql
create trigger pipeline_updated_at
  before update on public.pipeline
  for each row
  execute function public.handle_updated_at();
```

### 4. Loesch-Schutz-Trigger auf kunden

```sql
create or replace function public.check_kunde_deletable()
returns trigger as $$
declare
  blocking_count integer;
begin
  -- Anzahl Pipeline-Eintraege mit Status != 'loeschbar' zaehlen
  select count(*) into blocking_count
  from public.pipeline
  where customer_id = old.id
    and status <> 'loeschbar';

  if blocking_count > 0 then
    raise exception 'Kunde % kann nicht geloescht werden: % offene(r) Pipeline-Eintrag(e). Status auf "loeschbar" setzen.',
      old.firma, blocking_count;
  end if;

  -- Erlaubte Loeschung: alle verbleibenden Pipeline-Eintraege (Status='loeschbar') zuerst loeschen
  delete from public.pipeline where customer_id = old.id;

  return old;
end;
$$ language plpgsql;

create trigger kunden_check_deletable
  before delete on public.kunden
  for each row
  execute function public.check_kunde_deletable();
```

### 5. Pipeline-Seed-Daten

```sql
insert into public.pipeline (customer_id, firma, volumen_eur, angebotsdatum, status, notiz)
select id, 'Druckhaus Lindauer', 89000, '2026-04-20', 'erstkontakt', 'Anfrage ueber Website. Termin fuer Erstgespraech am 15.05.' from public.kunden where firma = 'Druckhaus Lindauer' union all
select id, 'Obsthof Berger', 124000, '2026-04-15', 'angebot_raus', 'Kuehlhalle fuer Obstlagerung. Hoher Sommerverbrauch.' from public.kunden where firma = 'Obsthof Berger' union all
select id, 'Sporthotel Weitblick', 168000, '2026-03-28', 'angebot_raus', 'Angebot versendet. Foerderberatung laeuft parallel.' from public.kunden where firma = 'Sporthotel Weitblick' union all
select id, 'Baeckerei Kronenbrot', 38500, '2026-04-02', 'angebot_raus', 'Angebot fuer Backstube und Laden. Dachstatik geprueft.' from public.kunden where firma = 'Baeckerei Kronenbrot' union all
select id, 'Metallwerk Donau GmbH', 298000, '2026-03-10', 'verhandlung', 'Verhandlung ueber Zahlungskonditionen. Foerderzusage erwartet.' from public.kunden where firma = 'Metallwerk Donau GmbH' union all
select id, 'Weingut Am Sonnenberg', 68000, '2026-04-08', 'erstkontakt', 'Interesse an Agri-PV. Erste Begehung geplant.' from public.kunden where firma = 'Weingut Am Sonnenberg' union all
select id, 'Fitnessstudio PowerZone', 54500, '2026-04-25', 'angebot_raus', 'Klimaanlage verursacht hohe Kosten. PV soll entlasten.' from public.kunden where firma = 'Fitnessstudio PowerZone' union all
select id, 'Weber Maschinenbau AG', 415000, '2026-02-14', 'verhandlung', 'Grossauftrag. Technische Klaerung Netzanschluss laeuft.' from public.kunden where firma = 'Weber Maschinenbau AG' union all
select id, 'Blumengrossmarkt Suedwest', 98000, '2026-05-02', 'erstkontakt', 'Halle mit Kuehlzellen. Stromkosten ueber 80.000 EUR p.a.' from public.kunden where firma = 'Blumengrossmarkt Suedwest' union all
select id, 'Tischlerei Seefeld', 32000, '2026-04-30', 'erstkontakt', 'Kleine Werkstatt. Budget knapp. Foerderprogramme pruefen.' from public.kunden where firma = 'Tischlerei Seefeld' union all
select id, 'Kaeserei Allgaeuer Gold', 185000, '2026-03-20', 'angebot_raus', 'Kaesereifung braucht konstante Kuehlung. Speicher im Angebot.' from public.kunden where firma = 'Kaeserei Allgaeuer Gold' union all
select id, 'Stadtwerke Mering', 580000, '2026-01-18', 'gewonnen', 'Zuschlag erteilt. Projektstart Q3 2026. Groesstes Pipeline-Projekt.' from public.kunden where firma = 'Stadtwerke Mering';
```

---

## Code-Migration

### Dateien

| Datei | Aenderung |
|---|---|
| `types/index.ts` | `PipelineEintrag.id`: `number` → `string`. Neu: `customer_id: string`. Status-Enum + `loeschbar`. Felder `ansprechpartner`, `branche`, `anlagengroesse_kwp` entfernen. |
| `lib/data.ts` | `getPipeline()` / `getPipelineEintrag()` → Supabase-Queries, `ladePipelineAusCsv()` entfernen |
| `app/api/pipeline/route.ts` | POST → Supabase insert (mit `customer_id`) |
| `app/api/pipeline/[id]/route.ts` | PUT/DELETE → Supabase update/delete, `Number(id)` entfernen |
| `app/pipeline/[id]/page.tsx` | `Number(id)` entfernen (uuid ist string) |
| `app/pipeline/pipeline-client.tsx` | Nutzung entfernter Felder pruefen, Status-Anzeige um `loeschbar` erweitern |
| `app/pipeline/neu/*` | Formular: Kunden-Auswahl via Dropdown statt freier `firma`-Text |

### Type-Anpassung

```ts
export type PipelineStatus =
  | 'erstkontakt' | 'angebot_raus' | 'verhandlung'
  | 'gewonnen' | 'verloren' | 'loeschbar';

export interface PipelineEintrag {
  id: string;
  customer_id: string;
  firma: string;
  volumen_eur: number;
  angebotsdatum: string;
  status: PipelineStatus;
  notiz: string;
}
```

---

## Edge Cases

1. **Was passiert bei:** DELETE auf Kunde mit Pipeline-Eintraegen Status `erstkontakt` und `loeschbar`
   **Erwartetes Verhalten:** Trigger blockiert Loeschung mit Exception "1 offene(r) Pipeline-Eintrag(e)". Kein Kunde wird geloescht, keine Pipeline-Eintraege werden geloescht.

2. **Was passiert bei:** DELETE auf Kunde dessen Pipeline-Eintraege ALLE Status `loeschbar` haben
   **Erwartetes Verhalten:** Trigger loescht zuerst alle Pipeline-Eintraege, danach Kunde. Transaktion erfolgreich, UI zeigt Kunden weg.

3. **Was passiert bei:** INSERT in Pipeline mit `customer_id`, der nicht in `kunden` existiert
   **Erwartetes Verhalten:** FK-Constraint blockiert mit Postgres-Fehler `23503` (foreign_key_violation). API-Route gibt 400 mit Klartext-Fehlermeldung zurueck.

4. **Was passiert bei:** UPDATE eines Pipeline-Eintrags von `gewonnen` auf `loeschbar`
   **Erwartetes Verhalten:** Erlaubt, `updated_at`-Trigger setzt Timestamp. Kunde wird dadurch loeschbar (wenn keine anderen offenen Eintraege existieren).

5. **Was passiert bei:** UI-Submit "Pipeline-Eintrag neu" ohne Kunden-Auswahl (`customer_id` leer)
   **Erwartetes Verhalten:** Validierung in API-Route blockiert mit 400 "Kunde ist erforderlich". Kein DB-Aufruf.

---

## Akzeptanzkriterien

- [ ] 12 neue Kunden-Eintraege existieren in `public.kunden` mit korrekten Daten
- [ ] Tabelle `public.pipeline` existiert mit allen Spalten und Constraints
- [ ] FK `pipeline.customer_id → kunden(id)` mit `ON DELETE NO ACTION` aktiv
- [ ] CHECK-Constraint auf `status` erlaubt 6 Werte inkl. `loeschbar`
- [ ] 12 Pipeline-Eintraege eingefuegt, alle `customer_id` korrekt aufgeloest
- [ ] Trigger `kunden_check_deletable` blockiert Loeschung bei offenen Pipeline-Eintraegen
- [ ] Trigger erlaubt Loeschung wenn alle Pipeline-Eintraege Status `loeschbar` haben
- [ ] `npm run build` erfolgreich nach Code-Migration
- [ ] `/pipeline` zeigt 12 Eintraege aus Supabase
- [ ] `/pipeline/[id]` funktioniert mit UUID
- [ ] Neuer Pipeline-Eintrag via UI: Kunden-Dropdown waehlbar, INSERT erfolgreich
- [ ] Pipeline-Eintrag bearbeiten/loeschen via API funktioniert
- [ ] Mock-States (`?mock=error|empty|loading`) funktionieren weiterhin auf Pipeline-Seiten
- [ ] Keine Pipeline-CSV-Reads mehr im Code
- [ ] **Alle Edge Cases aus dem Abschnitt oben sind getestet**

---

## Abgrenzung (Out of Scope)

- Keine UI-Anzeige der Kunden-Detail-Daten in Pipeline-Listenansicht (nur `firma`-Snapshot)
- Keine Status-Workflow-Validierung (z.B. `verloren` → `erstkontakt` waere unlogisch, wird nicht blockiert)
- Kein automatisches Setzen von `loeschbar` (manuell durch User)
- CSV-Datei `solarwerk_pipeline.csv` bleibt im Repo als Referenz, wird aber nicht mehr gelesen
- Keine RLS-Policies (analog zu `kunden`, RLS bleibt deaktiviert)
