# Spec: Supabase Kunden-Tabelle

## Zweck

Die bestehende `solarwerk_kunden.csv` soll als relationale Tabelle in Supabase nachgebildet werden, inklusive SQL-Befehlen zum Erstellen und Befuellen. Ziel ist eine produktionsreife Tabellenstruktur nach Data-Engineering-Best-Practices.

---

## Inputs

- `data/solarwerk_kunden.csv` — 25 Datensaetze, 10 Spalten
- `types/index.ts` — TypeScript-Interface `Kunde` + `KundenStatus`-Enum

### CSV-Spalten (Ist-Zustand)

| Spalte | Beispielwert | TS-Typ |
|---|---|---|
| `id` | `2` | `number` |
| `firma` | `Lechner Praezisionstechnik GmbH` | `string` |
| `ansprechpartner` | `Dr. Sabine Lechner` | `string` |
| `branche` | `Industrie` | `string` |
| `anlagengroesse_kwp` | `120` | `number` |
| `status` | `aktiv` | `KundenStatus` |
| `letzter_kontakt` | `2026-04-22` | `string` (ISO-Date) |
| `telefon` | `08233-46-721` | `string` |
| `email` | `s.lechner@lechner-praezision.de` | `string` |
| `notiz` | Freitext, bis ~80 Zeichen | `string` |

---

## Architektur-Entscheidungen

### 1. Spalten → Datentypen

| Spalte | SQL-Typ | Begruendung |
|---|---|---|
| `id` | `uuid` | Supabase-Standard, nicht erratbar, sicher fuer APIs |
| `firma` | `text` | Kein `varchar(n)` — Postgres `text` ist performanter, Laengenlimits gehoeren in Validierung |
| `ansprechpartner` | `text` | Freitext, variable Laenge |
| `branche` | `text` | Aktuell 4 Werte (Industrie, Landwirtschaft, Gewerbe, Handwerk). Kein Enum, da erweiterbar ohne Migration |
| `anlagengroesse_kwp` | `integer` | Ganzzahl in CSV, kein Dezimalbedarf. Alternativ `numeric` wenn Nachkommastellen erwartet |
| `status` | `text` mit CHECK-Constraint | 3 feste Werte. CHECK statt Enum → einfacher zu erweitern per `ALTER` |
| `letzter_kontakt` | `date` | ISO-Format in CSV, reiner Datumswert ohne Uhrzeit |
| `telefon` | `text` | Keine Normalisierung — Format variiert (Bindestriche, Laengen) |
| `email` | `text` (citext optional) | E-Mail-Adressen, case-insensitive Suche ggf. spaeter |
| `notiz` | `text` | Freitext, unbegrenzt |

### 2. NOT NULL — und warum

| Spalte | NOT NULL? | Begruendung |
|---|---|---|
| `id` | Ja | Primaerschluessel, immer gesetzt |
| `firma` | Ja | Kernidentifikation, Kunde ohne Firma sinnlos |
| `ansprechpartner` | Ja | Vertrieb braucht immer Kontaktperson |
| `branche` | Ja | Segmentierung, Filter, Berichte — immer noetig |
| `anlagengroesse_kwp` | Ja | Kerndatum fuer Solarbranche |
| `status` | Ja | Steuert UI-Logik, darf nicht leer sein |
| `letzter_kontakt` | Nein | Neukunde koennte noch keinen Kontakt haben |
| `telefon` | Nein | Nicht jeder Kontakt hat Telefon |
| `email` | Nein | Nicht jeder Kontakt hat E-Mail |
| `notiz` | Nein | Optional, oft leer bei neuen Kunden |

### 3. E-Mail: UNIQUE oder nicht?

**Nicht UNIQUE.** Begruendung:
- Mehrere Ansprechpartner einer Firma koennten dieselbe `info@`-Adresse haben
- CSV zeigt: Jede E-Mail ist aktuell einzigartig, aber das ist Zufall, kein Business-Rule
- UNIQUE auf `email` wuerde spaetere Erweiterungen (mehrere Kontakte pro Firma) blockieren
- Wenn gewuenscht: `UNIQUE`-Index spaeter als bewusste Entscheidung nachruesten

### 4. Standard-Spalten (alle drei)

| Spalte | Typ | Default | Begruendung |
|---|---|---|---|
| `created_at` | `timestamptz` | `now()` | Audit-Trail: wann wurde Datensatz erstellt |
| `updated_at` | `timestamptz` | `now()` | Audit-Trail: letzte Aenderung. Trigger setzt automatisch |
| `created_by` | `uuid` | `auth.uid()` | Wer hat Datensatz erstellt (Supabase Auth-Integration) |

### 5. Primaerschluessel: UUID mit gen_random_uuid()

```sql
id uuid primary key default gen_random_uuid()
```

Begruendung:
- Supabase-Standard, konsistent mit `auth.users`
- Nicht erratbar → sicher fuer RLS und API-Endpoints
- Keine sequenziellen IDs die Geschaeftsdaten preisgeben (Kundenanzahl etc.)
- `gen_random_uuid()` ist Postgres-nativ (ab v13), kein Extension noetig

---

## SQL-Befehle

### 1. Tabelle erstellen

```sql
-- Kunden-Tabelle fuer SolarWerk Sued Sales-Hub
create table public.kunden (
  id              uuid primary key default gen_random_uuid(),
  firma           text not null,
  ansprechpartner text not null,
  branche         text not null,
  anlagengroesse_kwp integer not null check (anlagengroesse_kwp > 0),
  status          text not null check (status in ('aktiv', 'in_wartung', 'beschwerde')),
  letzter_kontakt date,
  telefon         text,
  email           text,
  notiz           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references auth.users(id)
);

-- Kommentar fuer Dokumentation
comment on table public.kunden is 'Bestandskunden mit Anlagendaten und Kontaktinformationen';
```

### 2. updated_at Trigger

```sql
-- Trigger-Funktion: updated_at automatisch setzen
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger an Tabelle binden
create trigger kunden_updated_at
  before update on public.kunden
  for each row
  execute function public.handle_updated_at();
```

### 3. Indizes

```sql
-- Haeufige Filter: Status, Branche
create index idx_kunden_status on public.kunden(status);
create index idx_kunden_branche on public.kunden(branche);

-- Suche nach Firma
create index idx_kunden_firma on public.kunden using gin(firma gin_trgm_ops);
-- Voraussetzung: create extension if not exists pg_trgm;
```

### 4. Seed-Daten (CSV → INSERT)

```sql
insert into public.kunden (firma, ansprechpartner, branche, anlagengroesse_kwp, status, letzter_kontakt, telefon, email, notiz)
values
  ('Lechner Praezisionstechnik GmbH', 'Dr. Sabine Lechner', 'Industrie', 120, 'aktiv', '2026-04-22', '08233-46-721', 's.lechner@lechner-praezision.de', 'Sehr zufrieden. Moechte Speicher von 35 auf 60 kWh aufstocken.'),
  ('Schwarzhuber Hof', 'Markus Schwarzhuber', 'Landwirtschaft', 380, 'aktiv', '2026-02-08', '08334-94-12', 'hof@schwarzhuber-allgaeu.de', 'Stallaufdach komplett belegt. Bewaesserung laeuft ueber PV.'),
  ('Sailer Spedition KG', 'Petra Sailer', 'Gewerbe', 540, 'in_wartung', '2026-04-30', '0821-217-8800', 'p.sailer@sailer-logistik.de', 'Wechselrichter 3 ausgefallen. Ersatzteil bestellt. Wartungstermin 06.05.2026.'),
  ('Hotel Sonnenwinkel', 'Florian Brunner', 'Gewerbe', 95, 'aktiv', '2026-01-15', '08362-988-456', 'brunner@sonnenwinkel-hotel.de', 'Eigenverbrauch bei 82 Prozent. Erweiterung Wellnessbereich diskutiert.'),
  ('Kreitmeier Druck und Verlag', 'Manfred Kreitmeier', 'Industrie', 78, 'beschwerde', '2026-05-02', '0821-450-2293', 'service@kreitmeier-druck.de', 'Reklamation: Monitoring zeigt 15 Prozent Minderleistung seit Maerz.'),
  ('Vogel Gefluegelhof', 'Christine Vogel', 'Landwirtschaft', 220, 'aktiv', '2026-03-28', '08293-771-44', 'info@vogel-gefluegel.de', 'Waermepumpe fuer Stallklimatisierung laeuft mit PV-Strom.'),
  ('Eichinger Metallbau OHG', 'Stefan Eichinger', 'Handwerk', 65, 'aktiv', '2026-04-05', '08251-639-12', 's.eichinger@eichinger-metallbau.de', 'Erste Wartung Q3 faellig. Plant Lackiererei-Erweiterung 2027.'),
  ('Tagungshotel Bergblick', 'Anna-Maria Holzer', 'Gewerbe', 110, 'in_wartung', '2026-04-25', '08323-401-700', 'holzer@bergblick-tagung.de', 'Modul-Reinigung gebucht fuer Mai. Vogelschaeden am Dach.'),
  ('Mayrhofer Logistik GmbH', 'Wolfgang Mayrhofer', 'Gewerbe', 720, 'aktiv', '2026-03-18', '0821-799-4400', 'w.mayrhofer@mayrhofer-logistik.de', 'Groesster Bestandskunde. Erweiterung Halle 2 diskutiert fuer 2027.'),
  ('Spargelhof Steininger', 'Bernhard Steininger', 'Landwirtschaft', 180, 'aktiv', '2026-02-14', '08252-882-15', 'hof@spargel-steininger.de', 'Saisonbetrieb. Kuehlanlage laeuft im Sommer ueber PV.'),
  ('Bachmaier Baeckerei', 'Julia Bachmaier', 'Handwerk', 52, 'beschwerde', '2026-05-08', '0821-336-9912', 'j.bachmaier@bachmaier-baeckerei.de', 'Reklamation Wechselrichter-Luefter laut. Stoert Backstube-Personal.'),
  ('Gruber Stahlbau GmbH', 'Thomas Gruber', 'Industrie', 290, 'aktiv', '2026-04-10', '0731-884-2200', 't.gruber@gruber-stahlbau.de', 'Neue Halle mit 150 kWp geplant. Statik-Pruefung laeuft.'),
  ('Bioland Hof Rieger', 'Katharina Rieger', 'Landwirtschaft', 160, 'aktiv', '2026-03-05', '07351-48-293', 'k.rieger@biohof-rieger.de', 'Agri-PV Pilotprojekt. Beweidung unter Modulen funktioniert gut.'),
  ('Autohaus Kessler', 'Michael Kessler', 'Gewerbe', 85, 'aktiv', '2026-01-28', '0821-992-3314', 'm.kessler@autohaus-kessler.de', 'E-Ladestationen am Autohaus geplant. PV-Erweiterung noetig.'),
  ('Brauerei Zum Goldenen Hirsch', 'Georg Brandner', 'Industrie', 195, 'in_wartung', '2026-05-01', '08382-704-88', 'g.brandner@brauerei-hirsch.de', 'Kuehlsystem-Wartung mit PV-Anlage gekoppelt. Saisonstart Mai.'),
  ('Zimmerei Obermaier', 'Franz Obermaier', 'Handwerk', 38, 'aktiv', '2026-02-20', '08191-335-67', 'f.obermaier@zimmerei-obermaier.de', 'Kleine Anlage aber zufriedener Kunde. Empfiehlt uns weiter.'),
  ('Reiterhof Sonnleitner', 'Maria Sonnleitner', 'Landwirtschaft', 240, 'aktiv', '2026-04-15', '08075-913-42', 'm.sonnleitner@reiterhof-sonnleitner.de', 'Reithalle und Stallungen komplett solar. Eigenverbrauch 91 Prozent.'),
  ('Mueller Fensterbau GmbH', 'Helmut Mueller', 'Handwerk', 72, 'aktiv', '2026-03-22', '07361-555-18', 'h.mueller@mueller-fensterbau.de', 'Produktionshalle mit Saegewerk. Hoher Tagesverbrauch ideal fuer PV.'),
  ('Klinik Am Rosengarten', 'Dr. Andrea Pfeiffer', 'Gewerbe', 310, 'aktiv', '2026-04-18', '0821-667-9100', 'a.pfeiffer@klinik-rosengarten.de', '24h-Betrieb. Speicher mit 120 kWh. Notstromfaehigkeit geplant.'),
  ('Schwabenmoebel GmbH', 'Robert Haas', 'Industrie', 420, 'beschwerde', '2026-05-10', '0731-220-4455', 'r.haas@schwabenmoebel.de', 'Ertrag 20 Prozent unter Prognose. Verschattung durch Neubau nebenan.'),
  ('Gaertnerei Blumenfeld', 'Ingrid Wieser', 'Landwirtschaft', 55, 'aktiv', '2026-02-01', '08233-81-456', 'i.wieser@gaertnerei-blumenfeld.de', 'Gewaechshaeuser teilweise mit PV-Glas. Pilotprojekt erfolgreich.'),
  ('Pension Alpenblick', 'Herbert Waldner', 'Gewerbe', 48, 'aktiv', '2026-01-10', '08322-765-21', 'h.waldner@pension-alpenblick.de', 'Kleine Pension mit guter Suedausrichtung. Warmwasser solar.'),
  ('Schreinerei Wagner und Sohn', 'Thomas Wagner', 'Handwerk', 86, 'aktiv', '2026-03-30', '08331-442-90', 't.wagner@wagner-schreinerei.de', 'Referenzkunde fuer Solar-fuer-KMU-Paket. Sehr zufrieden.'),
  ('Landtechnik Baumgartner', 'Josef Baumgartner', 'Landwirtschaft', 340, 'beschwerde', '2026-05-05', '08261-773-34', 'j.baumgartner@landtechnik-baumgartner.de', 'Grosse Maschinenhalle. Schneelast-Schaeden nach Winter. Reparatur laeuft.');
```

### 5. RLS aktivieren (Supabase Best Practice)

```sql
-- Row Level Security aktivieren
alter table public.kunden enable row level security;

-- Policy: Authentifizierte User duerfen lesen
create policy "Kunden lesen" on public.kunden
  for select
  to authenticated
  using (true);

-- Policy: Nur eigene Eintraege bearbeiten
create policy "Eigene Kunden bearbeiten" on public.kunden
  for update
  to authenticated
  using (created_by = auth.uid());
```

---

## Akzeptanzkriterien

- [ ] Tabelle `public.kunden` existiert in Supabase mit allen Spalten
- [ ] Primaerschluessel ist `uuid` mit `gen_random_uuid()` Default
- [ ] CHECK-Constraint auf `status` erlaubt nur `aktiv`, `in_wartung`, `beschwerde`
- [ ] CHECK-Constraint auf `anlagengroesse_kwp` erlaubt nur positive Werte
- [ ] NOT NULL auf: `firma`, `ansprechpartner`, `branche`, `anlagengroesse_kwp`, `status`
- [ ] Standard-Spalten: `created_at`, `updated_at`, `created_by` vorhanden
- [ ] `updated_at`-Trigger funktioniert (Update setzt Timestamp automatisch)
- [ ] Alle 24 CSV-Datensaetze eingefuegt (id 2-25, id 1 fehlt in CSV)
- [ ] RLS aktiviert mit Lese-Policy fuer authentifizierte User
- [ ] Indizes auf `status` und `branche` vorhanden
- [ ] SQL laeuft fehlerfrei im Supabase SQL-Editor

---

## Abgrenzung (Out of Scope)

- Keine Migration der App von CSV auf Supabase (nur Tabelle + Seed)
- Keine `pipeline`-Tabelle (separate Spec)
- Kein Supabase-Client im Next.js-Code
- Keine Edge Functions oder Realtime-Subscriptions
