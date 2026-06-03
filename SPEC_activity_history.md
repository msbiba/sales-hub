# Spec: Aktivitäts-Historie (Audit-Log)

**Branch:** `activity_history`
**Stand:** 2026-06-02

---

## Zweck

Jede Änderung an `kunden`- und `pipeline`-Datensätzen wird automatisch protokolliert und auf der jeweiligen Detailseite als chronologische Historie sichtbar gemacht. Kein manueller Eintrag — Historie entsteht ausschließlich durch DB-Trigger bei INSERT, UPDATE, DELETE.

---

## Inputs

- Bestehende Supabase-Tabellen `kunden` und `pipeline` (Felder siehe `lib/data.ts`)
- `auth.uid()` und zugehörige `auth.users.email` aus Supabase-Auth (bereits aktiv)
- Bestehende Rollen aus `profiles`: `bearbeiter`, `admin`, `buchhaltung`
- Kein User-Input — Feature reagiert passiv auf DB-Writes

---

## Verhalten

1. **INSERT auf `kunden` oder `pipeline`** → Trigger schreibt 1 Zeile in `activity_history` mit `event_type='insert'`, `field=NULL`, `old_value=NULL`, `new_value=NULL`, `author_id=auth.uid()`, `author_email`= via JOIN auf `auth.users`.
2. **UPDATE auf `kunden` oder `pipeline`** → Trigger schreibt **pro tatsächlich geändertem Feld eine Zeile** (`OLD.x IS DISTINCT FROM NEW.x`) mit `event_type='update'`, `field='x'`, `old_value=OLD.x::text`, `new_value=NEW.x::text`.
3. **DELETE auf `kunden` oder `pipeline`** → FKs `activity_history.kunde_id` / `activity_history.pipeline_id` mit `ON DELETE CASCADE` löschen alle zugehörigen Historie-Einträge automatisch mit. Kein separater `delete`-Event wird geschrieben (Anzeigeort verschwindet ohnehin).
4. **Detailseite öffnen** (`/kunden/[id]` oder `/pipeline/[id]`) → Server Component lädt Historie via `getHistory(entityType, entityId)`, sortiert `created_at DESC`.
5. **Anzeige** unten auf Detailseite als `<details>`-Block, default **eingeklappt**, Titel „Historie (N)". Geöffnet: Tabelle mit Spalten Datum/Zeit, Typ, Autor, Beschreibung.
6. **Leerer Kunde/Eintrag** → `<details>`-Block zeigt „Noch keine Änderungen erfasst." statt Tabelle.

---

## Architektur-Entscheidungen

### Entscheidung 1: Eine Tabelle `activity_history` mit zwei FK-Spalten

- **Gewählt:** Eine Tabelle mit zwei nullable FK-Spalten `kunde_id uuid REFERENCES kunden(id) ON DELETE CASCADE` und `pipeline_id uuid REFERENCES pipeline(id) ON DELETE CASCADE`. CHECK-Constraint `((kunde_id IS NOT NULL) <> (pipeline_id IS NOT NULL))` erzwingt: genau eine der beiden ist je Zeile gesetzt. Quelle ist implizit über die nicht-NULL Spalte erkennbar — separates `entity_type`-Feld unnötig.
- **Alternative wäre:** Polymorpher Key (`entity_id` ohne FK) + Application-seitige Konsistenz, oder zwei getrennte Tabellen `kunden_history` und `pipeline_history`.
- **Warum diese:** Echte FKs erzwingen Konsistenz und liefern CASCADE-Löschung gratis. Eine Tabelle hält die Abfrage-Logik einheitlich. Zwei getrennte Tabellen wären sauberer, verdoppeln aber Trigger-Code und Daten-Layer ohne Mehrwert für 2 Quellen.

### Entscheidung 2: Audit via Postgres-Trigger, nicht in App-Code

- **Gewählt:** `AFTER INSERT/UPDATE/DELETE`-Trigger auf `kunden` und `pipeline`, eine gemeinsame `PL/pgSQL`-Funktion `log_changes()` (parametrisiert über `TG_TABLE_NAME`).
- **Alternative wäre:** Logging in Next.js Server Actions / API-Routen vor jedem Supabase-Write.
- **Warum diese:** Trigger fangen auch direkte DB-Edits (Supabase Studio, Migrations) ab und können nicht umgangen werden. Eine Funktion für beide Tabellen vermeidet Code-Duplikation.

### Entscheidung 3: RLS — Historie folgt den Rechten des Eltern-Objekts

- **Gewählt:** SELECT-Policy nutzt `EXISTS (select 1 from kunden where id = activity_history.kunde_id)` bzw. analog für `pipeline`. Da bestehende RLS auf `kunden`/`pipeline` rollenbasiert greift (bearbeiter=eigene, admin=alles, buchhaltung=nichts), filtert die EXISTS-Subquery automatisch nach denselben Regeln — kein Re-Implementieren der Rollen-Logik. Keine INSERT/UPDATE/DELETE-Policy → Schreiben aus App-Kontext unmöglich, nur Trigger (mit `SECURITY DEFINER`) füllt Tabelle.
- **Alternative wäre:** Flache Policy `USING (true) TO authenticated` (alle dürfen alles lesen) oder Replikation der Rollen-Logik direkt in der History-Policy.
- **Warum diese:** Single source of truth. Bestehende Rollen-Logik auf `kunden`/`pipeline` filtert die Historie automatisch mit — kein Re-Implementieren, kein Drift. Bearbeiter sieht nur Historie zu eigenen Kunden, Admin sieht alles, Buchhaltung sieht alles lesend (hat SELECT, nur Schreiben verboten).

**Voraussetzung (verifiziert via Live-`pg_policies`-Export 2026-06-02):** Bestehende RLS auf `kunden`/`pipeline` nutzt SQL-Funktion `current_user_role()` + Owner-Spalte `bearbeiter_id = auth.uid()`. 6 Policies pro Tabelle: `admin_all_*` (ALL), `buchhaltung_select_*` (SELECT), `bearbeiter_{select,insert,update,delete}_own_*`. Repo-Doku [spec_auth.md](docs/spec_auth.md) ist veraltet. Activity-History-Spec braucht weder `profiles` noch `current_user_role()` direkt — EXISTS-Subquery erbt komplette Rollen-Logik automatisch.

---

## Datenmodell

### Tabelle `activity_history`

```sql
create table activity_history (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  kunde_id      uuid references kunden(id) on delete cascade,
  pipeline_id   uuid references pipeline(id) on delete cascade,
  event_type    text not null check (event_type in ('insert','update')),
  field         text,
  old_value     text,
  new_value     text,
  author_id     uuid references auth.users(id) on delete set null,
  author_email  text,
  check ((kunde_id is not null) <> (pipeline_id is not null))
);

create index on activity_history (kunde_id, created_at desc) where kunde_id is not null;
create index on activity_history (pipeline_id, created_at desc) where pipeline_id is not null;

alter table activity_history enable row level security;

-- Historie erbt Lese-Recht vom Eltern-Objekt:
-- bestehende RLS auf kunden/pipeline filtert die EXISTS-Subquery
-- automatisch nach Rolle (bearbeiter=eigene, admin=alles, buchhaltung=nichts).
create policy "history_read_via_parent_kunde"
  on activity_history for select
  to authenticated
  using (
    kunde_id is not null
    and exists (select 1 from kunden k where k.id = activity_history.kunde_id)
  );

create policy "history_read_via_parent_pipeline"
  on activity_history for select
  to authenticated
  using (
    pipeline_id is not null
    and exists (select 1 from pipeline p where p.id = activity_history.pipeline_id)
  );

-- Keine INSERT/UPDATE/DELETE-Policy → kein User-Schreiben möglich.
-- Trigger-Funktion läuft mit SECURITY DEFINER und umgeht RLS bewusst.
```

### Geloggte Felder

- **kunden:** `firma`, `ansprechpartner`, `branche`, `anlagengroesse_kwp`, `status`, `letzter_kontakt`, `telefon`, `email`, `notiz`, `bearbeiter_id` *(→ als Email geloggt, field=`'bearbeiter'`)*
- **pipeline:** `firma`, `volumen_eur`, `angebotsdatum`, `status`, `notiz`, `bearbeiter_id` *(→ als Email geloggt, field=`'bearbeiter'`)*

Ignoriert: `id`, `created_at`, `customer_id` (UUID-String wäre in UI nicht lesbar), `pipeline.bearbeiter` (text-Anzeigename Anna/Ben/Clara — redundant zur `bearbeiter_id`-Auflösung, würde Field-Namens-Kollision mit gemappter Owner-Email verursachen), sonstige System-Spalten.

**Sonderbehandlung `bearbeiter_id`:** Spalte ist uuid (Auth-Owner), aber im Audit-Log sollen `old_value`/`new_value` die **Email-Adresse** des alten/neuen Owners enthalten, nicht die uuid. Trigger resolved via JOIN `auth.users`. Feld-Name in `activity_history.field` = `'bearbeiter'` (ohne `_id`-Suffix) für saubere UI-Anzeige. Wenn Resolution fehlschlägt (User gelöscht), Fallback `'(unbekannt)'`.

### Trigger-Funktion (Skizze)

```sql
create or replace function log_changes() returns trigger
language plpgsql security definer set search_path = public, auth as $$
declare
  v_email text;
  v_kunde uuid;
  v_pipeline uuid;
begin
  select email into v_email from auth.users where id = auth.uid();
  if tg_table_name = 'kunden' then
    v_kunde := coalesce(new.id, old.id);
  else
    v_pipeline := coalesce(new.id, old.id);
  end if;

  if tg_op = 'INSERT' then
    insert into activity_history (kunde_id, pipeline_id, event_type, author_id, author_email)
      values (v_kunde, v_pipeline, 'insert', auth.uid(), v_email);
    return new;
  end if;

  if tg_op = 'UPDATE' then
    -- pro Feld eine Zeile, falls geändert.
    -- Feld-Liste je Tabelle unterschiedlich → branching auf tg_table_name.
    if tg_table_name = 'kunden' then
      -- Pattern für jedes Kunden-Feld wiederholen:
      if new.firma is distinct from old.firma then
        insert into activity_history (kunde_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_kunde, 'update', 'firma', old.firma::text, new.firma::text, auth.uid(), v_email);
      end if;
      if new.status is distinct from old.status then
        insert into activity_history (kunde_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_kunde, 'update', 'status', old.status::text, new.status::text, auth.uid(), v_email);
      end if;
      -- Sonderbehandlung: bearbeiter_id → resolve zu Email für lesbare Anzeige
      if new.bearbeiter_id is distinct from old.bearbeiter_id then
        insert into activity_history (kunde_id, event_type, field, old_value, new_value, author_id, author_email)
          values (
            v_kunde, 'update', 'bearbeiter',
            coalesce((select email from auth.users where id = old.bearbeiter_id), '(unbekannt)'),
            coalesce((select email from auth.users where id = new.bearbeiter_id), '(unbekannt)'),
            auth.uid(), v_email
          );
      end if;
      -- analog: ansprechpartner, branche, anlagengroesse_kwp, letzter_kontakt, telefon, email, notiz
    elsif tg_table_name = 'pipeline' then
      -- Pattern für jedes Pipeline-Feld:
      if new.status is distinct from old.status then
        insert into activity_history (pipeline_id, event_type, field, old_value, new_value, author_id, author_email)
          values (v_pipeline, 'update', 'status', old.status::text, new.status::text, auth.uid(), v_email);
      end if;
      -- Sonderbehandlung: bearbeiter_id → Email
      if new.bearbeiter_id is distinct from old.bearbeiter_id then
        insert into activity_history (pipeline_id, event_type, field, old_value, new_value, author_id, author_email)
          values (
            v_pipeline, 'update', 'bearbeiter',
            coalesce((select email from auth.users where id = old.bearbeiter_id), '(unbekannt)'),
            coalesce((select email from auth.users where id = new.bearbeiter_id), '(unbekannt)'),
            auth.uid(), v_email
          );
      end if;
      -- analog: firma, volumen_eur, angebotsdatum, notiz
    end if;
    return new;
  end if;

  -- DELETE: CASCADE räumt Historie selbst auf, kein Insert hier nötig
  return old;
end $$;

create trigger trg_kunden_audit
  after insert or update or delete on kunden
  for each row execute function log_changes();

create trigger trg_pipeline_audit
  after insert or update or delete on pipeline
  for each row execute function log_changes();
```

Implementierungshinweis: Feld-Liste wird im Trigger-Code explizit aufgezählt (kein dynamisches `hstore`/`json`-Diff — bewusste Komplexitätsreduktion).

---

## App-Schicht

### `lib/history.ts` (neu)

```ts
export type HistoryEntry = {
  id: string;
  created_at: string;
  event_type: 'insert' | 'update';
  field: string | null;
  old_value: string | null;
  new_value: string | null;
  author_email: string | null;
};

export async function getHistory(
  entityType: 'kunde' | 'pipeline',
  entityId: string
): Promise<HistoryEntry[]>;
```

Liest aus `activity_history` mit Filter `kunde_id = entityId` bzw. `pipeline_id = entityId`, sortiert `created_at desc`. Nutzt `createSupabaseServerClient()` analog `lib/data.ts`.

### UI-Komponenten

**`app/kunden/[id]/historie.tsx`** (Server Component):
```tsx
export default async function Historie({ kundeId }: { kundeId: string }) {
  const entries = await getHistory('kunde', kundeId);
  return <HistorieClient entries={entries} />;
}
```

**`app/kunden/[id]/historie-client.tsx`** (Client Component):
- `<details>`-Element, default geschlossen
- `<summary>`: „Historie ({entries.length})"
- Inhalt: `<table>` mit Spalten Datum/Zeit | Typ | Autor | Beschreibung
- Leerzustand: `<p>Noch keine Änderungen erfasst.</p>` statt Tabelle wenn `entries.length === 0`

**Typ-Mapping** (deutsch in UI):
- `insert` → „Angelegt"
- `update` → „Geändert"

**Beschreibung-Mapping:**
- `insert`: „Datensatz angelegt"
- `update`: `{field}: „{old_value}" → „{new_value}"` (NULL → `—`)

**Datums-Format:** `dd.MM.yyyy HH:mm` (deutsch, via `toLocaleString('de-DE')`).

**Autor-Spalte:** `author_email` oder „System" wenn NULL.

**Einbindung:**
- `app/kunden/[id]/page.tsx` rendert `<Historie kundeId={kunde.id} />` unter `<KundeDetailClient />`.
- `app/pipeline/[id]/page.tsx` analog mit `<Historie pipelineId={eintrag.id} />` (zweite Variante der Komponente oder generisch via `entityType`-Prop).

---

## Edge Cases

1. **Was passiert bei:** Update auf `kunden`, wo der User nur die `notiz` ändert und sonst nichts.
   **Erwartetes Verhalten:** Genau 1 Zeile in `activity_history` mit `field='notiz'`, `old_value` und `new_value` korrekt befüllt. Keine Zeilen für unveränderte Felder.

2. **Was passiert bei:** Kunde wird gelöscht, der 47 Historie-Einträge hatte.
   **Erwartetes Verhalten:** Alle 47 Einträge sind via FK-CASCADE ebenfalls weg. Kein Reststand in `activity_history`. Kein Fehler im UI.

3. **Was passiert bei:** Aufruf von `/kunden/[id]` für einen Kunden, der noch nie geändert wurde (kein Insert-Event vorhanden, weil vor Feature-Rollout angelegt).
   **Erwartetes Verhalten:** `<details>`-Block sichtbar mit Titel „Historie (0)", beim Öffnen Text „Noch keine Änderungen erfasst." Kein Crash, keine leere Tabelle.

4. **Was passiert bei:** Direkter UPDATE in Supabase Studio (kein `auth.uid()` verfügbar).
   **Erwartetes Verhalten:** Historie-Eintrag wird trotzdem geschrieben, `author_id=NULL`, `author_email=NULL`. UI zeigt „System" in Autor-Spalte.

5. **Was passiert bei:** UPDATE setzt ein Feld von einem Wert auf `NULL` (z.B. `telefon` wird gelöscht).
   **Erwartetes Verhalten:** Historie-Zeile mit `field='telefon'`, `old_value='030-12345'`, `new_value=NULL`. UI zeigt `„030-12345" → „—"`.

---

## Akzeptanzkriterien

- [ ] Neue Tabelle `activity_history` existiert mit allen Spalten, FKs (CASCADE auf beide Eltern), CHECK-Constraint, Indizes, RLS-Policy.
- [ ] Trigger `trg_kunden_audit` und `trg_pipeline_audit` aktiv, Funktion `log_changes()` als `SECURITY DEFINER`.
- [ ] Bei INSERT in `kunden` erscheint 1 Historie-Eintrag mit `event_type='insert'`, korrektem `author_email`.
- [ ] Bei UPDATE von 2 Feldern in `kunden` erscheinen genau 2 Historie-Einträge mit korrektem `field`, `old_value`, `new_value`.
- [ ] Bei DELETE eines Kunden mit Historie ist die gesamte Historie für diese ID weg.
- [ ] `lib/history.ts` `getHistory()` liefert sortierte Liste (neueste zuerst).
- [ ] Auf `/kunden/[id]` und `/pipeline/[id]` ist unten der `<details>`-Block sichtbar, default geschlossen.
- [ ] Geöffneter Block zeigt Tabelle mit Datum/Zeit, Typ, Autor, Beschreibung in deutschem Format.
- [ ] Leerer Kunde zeigt „Noch keine Änderungen erfasst." statt leerer Tabelle.
- [ ] **Bearbeiter-User** sieht Historie **nur** für eigene Kunden/Pipeline-Einträge. Aufruf eines fremden Kunden: Detailseite gibt es ohnehin nicht (kunden-RLS blockt schon), Spezialfall daher nicht relevant.
- [ ] **Admin-User** sieht Historie für alle Kunden + Pipeline-Einträge.
- [ ] **Buchhaltungs-User** sieht alle Historie-Einträge (hat SELECT auf `kunden`/`pipeline`), kann aber weder Kunden/Pipeline noch Historie schreiben.
- [ ] Bestehende RLS-Policies auf `kunden`/`pipeline` bleiben unverändert.
- [ ] Keine zusätzliche Policy/Tabelle/Code für History-Berechtigung — vollständige Erbung via EXISTS.
- [ ] Direkte DB-Edits (Studio) erzeugen Eintrag mit Autor „System".
- [ ] Alle Edge Cases aus dem Abschnitt oben sind getestet.

---

## Out of Scope

- Manuelle Aktivitäts-Einträge (Anruf/Email/Termin-Notes)
- Filter/Suche/Pagination in der Historie
- Globaler Audit-Log-View über alle Entitäten
- Backfill für vor Feature-Rollout existierende Datensätze (Leerzustand reicht)
- Visueller Diff (alt/neu nebeneinander mit Hervorhebung)
- Export

---

## Umsetzungs-Reihenfolge

0. **Pre-Check erledigt (2026-06-02):** Live-Policies via `pg_policies`-Export verifiziert (siehe Voraussetzung in Entscheidung 3). Optional vor Trigger-Bau: `\d kunden` + `\d pipeline` für exakte Spalten-Typen (Enum vs. text) prüfen.
1. Supabase-Migration: Tabelle + Indizes + 2 RLS-Policies (history_read_via_parent_*)
2. Supabase-Migration: Trigger-Funktion `log_changes()` (`SECURITY DEFINER`) + 2 Trigger
3. Manuelle Tests in Supabase Studio: Insert/Update/Delete → Check Historie-Einträge
4. `lib/history.ts` + Typen
5. `historie.tsx` + `historie-client.tsx` für Kunden
6. Einbindung `app/kunden/[id]/page.tsx`
7. Wiederverwendung/Anpassung für Pipeline + Einbindung `app/pipeline/[id]/page.tsx`
8. Akzeptanzkriterien durchgehen, Edge Cases testen
