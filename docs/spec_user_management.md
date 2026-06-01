# Spec: User-Management mit Rollen + RLS

## Zweck

Bestehende Auth-Schicht (siehe `spec_auth.md`, RLS aktuell `to authenticated`-pauschal) wird auf rollenbasierte Zugriffskontrolle (RBAC) erweitert. Neue Tabelle `public.profiles` verknüpft jeden `auth.users`-Eintrag mit einer Rolle (`admin` | `bearbeiter` | `buchhaltung`) und `is_active`-Flag. Neue Seite `/nutzer` (admin-only) erlaubt Verwaltung aller User: Liste, Rolle ändern, aktivieren/deaktivieren, einladen, CSV-Export. `/berichte` wird auf `admin` + `buchhaltung` beschraenkt. `kunden`- und `pipeline`-RLS wird auf Eigentuemer-Modell umgestellt: Bearbeiter sehen nur eigene Datensaetze, Buchhaltung liest alles, Admin Vollzugriff. Inaktive User werden zentral in `proxy.ts` ausgeloggt. Eigene Profile-Seite `/profil` fuer Name + Passwort.

---

## Inputs

- **Bestehende Auth-Layer** (siehe `spec_auth.md`): `@supabase/ssr`, `lib/supabase/{client,server,middleware}.ts`, `proxy.ts`, Session via Cookie
- **`public.kunden`** — RLS aktiv, 4 Policies fuer `authenticated`, ohne Owner-Spalte (36 Zeilen)
- **`public.pipeline`** — RLS aktiv, 4 Policies fuer `authenticated`, Spalte `bearbeiter TEXT` (Klartext-Name, kein FK), 12 Zeilen
- **`public.handle_updated_at`** Funktion (aus spec_pipeline) bereits vorhanden
- **`auth.users`** — bestehende User aus Self-Signup (mind. `marko.schweigerer@gmail.com`)
- **Env**: `.env.local` mit `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **`pipeline.bearbeiter`-Text-Werte** enthalten Namen, die nach Migration auf neu angelegte Auth-User (`ben@solarwerk.de`, `clara@solarwerk.de`, `anna@solarwerk.de`) gematcht werden sollen

---

## Verhalten

1. **Login**: jeder User wird nach erfolgreichem `signIn`/`signUp` automatisch mit einem `profiles`-Row verknuepft (DB-Trigger), Default-Rolle `bearbeiter`, Sonderfall `marko.schweigerer@gmail.com` → `admin`.
2. **`/nutzer` (admin-only)**: Liste aller User mit Avatar, Name, Email, Rolle-Dropdown (inline-Aenderung), Status-Indicator, Created-at, Action-Icons (Eye = Detail-Modal, Trash = soft-delete, Refresh = reaktivieren).
3. **Stat-Cards** auf `/nutzer`: Gesamte Nutzer / Aktive Nutzer / Rollen verteilt (admin/bearbeiter/buchhaltung).
4. **Suche + Rollen-Filter + CSV-Export**: Suche filtert Name+Email; Rollen-Filter Dropdown (Alle | admin | bearbeiter | buchhaltung); CSV-Export erzeugt Datei mit 6 Spalten basierend auf gefilterter Ansicht.
5. **Einladung**: Modal mit Email + Pflicht-Rollen-Dropdown (Placeholder "Rolle waehlen..."); Submit ruft Server-Action mit Service-Role-Key, Supabase sendet Einladungs-Email.
6. **Toggle aktiv/inaktiv** via Trash-Icon: setzt `is_active=false`; Reaktivieren via Refresh-Icon (nur sichtbar bei inaktiven Zeilen).
7. **Self-Protection**: Server blockt Self-Role-Change und Self-Deactivate mit HTTP 400.
8. **Last-Admin-Protection**: Server blockt Demote/Deactivate des letzten Admins mit HTTP 400.
9. **`/berichte`** zugaenglich fuer `admin` + `buchhaltung`; Bearbeiter redirected auf `/403`.
10. **`/nutzer`** zugaenglich nur fuer `admin`; alle anderen redirected auf `/403`.
11. **Nav** zeigt Links rollenabhaengig: Bearbeiter sieht kein "Berichte" und kein "Nutzer"; Buchhaltung sieht "Berichte" aber kein "Nutzer"; Admin sieht alles.
12. **Inaktive User** werden zentral in `proxy.ts` geblockt: bei `is_active=false` → `auth.signOut()` + Redirect `/login?inactive=1`.
13. **Kunden-Sichtbarkeit (RLS)**:
    - `bearbeiter` sieht/aendert nur Kunden mit `bearbeiter_id = auth.uid()`
    - `buchhaltung` liest alle Kunden, kein Schreibrecht
    - `admin` Vollzugriff
14. **Pipeline-Sichtbarkeit (RLS)**: identische Logik wie Kunden, basierend auf `pipeline.bearbeiter_id`.
15. **Neue Kunden/Pipeline-Eintraege**: Server-Routes injizieren `bearbeiter_id = auth.uid()` automatisch beim INSERT (falls nicht explizit gesetzt; Admin/Buchhaltung kann setzen).
16. **`/profil`**: User kann eigenen `full_name` und Passwort aendern.
17. **`last_login_at`**: bei jedem Login (Server-Action nach `signInWithPassword` und in `/auth/callback`) wird Spalte aktualisiert, throttled auf max. 1x pro Stunde.
18. **Detail-Modal (Eye-Icon)**: zeigt read-only Avatar, Name, Email, Rolle, Status, Created-at, Last-Login-at; keine Impersonation.

---

## Architektur-Entscheidungen

### Entscheidung 1: Separate `profiles`-Tabelle statt JWT-Claims

- **Gewaehlt:** Eigene Tabelle `public.profiles` mit FK auf `auth.users(id)`
- **Alternative:** Rollen in `auth.users.raw_user_meta_data` (JWT-Claim)
- **Warum diese:** Profiles erlauben SQL-Joins, Trigger, einfache Admin-CRUD. JWT-Claims sind frueher invalidiert (Token-Refresh noetig) und schwerer abfragbar.

### Entscheidung 2: `SECURITY DEFINER` Function fuer Rollen-Check

- **Gewaehlt:** `public.current_user_role()` als `SECURITY DEFINER`, liest `profiles` mit `auth.uid()` und liefert Rollen-String
- **Alternative:** Subquery `(SELECT role FROM profiles WHERE id = auth.uid())` direkt in jeder Policy
- **Warum diese:** Direkter Subquery erzeugt Rekursion sobald `profiles` selbst RLS hat (Policy fragt Tabelle ab, die wieder Policy triggert). `SECURITY DEFINER` umgeht RLS innerhalb der Function sauber und ist offiziell empfohlenes Supabase-Pattern.

### Entscheidung 3: Owner-Spalte `bearbeiter_id` zusaetzlich zu `bearbeiter`-Text (Pipeline)

- **Gewaehlt:** Neue Spalte `pipeline.bearbeiter_id UUID REFERENCES auth.users(id)`; alte Spalte `bearbeiter TEXT` bleibt als Snapshot
- **Alternative:** Alte Spalte ersetzen / loeschen
- **Warum diese:** Spec-Konsistenz mit `pipeline.firma` (Snapshot-Pattern aus spec_pipeline.md Entscheidung 3); historische Bearbeiter-Namen gehen nicht verloren.

### Entscheidung 4: RLS-Backfill via Mapping aus `pipeline.bearbeiter`-Text + Random-Fallback

- **Gewaehlt:** Existierende `kunden`- und `pipeline`-Zeilen bekommen `bearbeiter_id` durch ILIKE-Mapping (Ben → ben@solarwerk.de, etc.). Unmapped Kunden bekommen Random-Bearbeiter aus Pool [Ben, Clara, Anna].
- **Alternative:** Alle Bestands-Zeilen NULL setzen, Admin weist manuell zu
- **Warum diese:** Bestand soll nach Migration sofort fuer Bearbeiter sichtbar sein (Realitaets-naeher als leerer Pool). Random ist akzeptabel im Lehr-Repo.

### Entscheidung 5: Service-Role-Key serverseitig fuer Admin-Operationen

- **Gewaehlt:** `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (server-only, kein `NEXT_PUBLIC_`-Prefix). Verwendung ausschliesslich in `app/api/nutzer/*` und Seed-Script.
- **Alternative:** Magic-Link-Invite ohne Service-Role-Key + Pending-Invites-Tabelle
- **Warum diese:** Direkter, robuster, klarer Audit-Pfad. Service-Role bleibt durch Code-Pattern hart auf Server-Routes beschraenkt.

### Entscheidung 6: Inaktiv-Enforcement zentral in `proxy.ts`

- **Gewaehlt:** Bei jedem authentifizierten Request prueft `proxy.ts` `profiles.is_active`; bei `false` → `signOut()` + Redirect `/login?inactive=1`
- **Alternative:** Inaktive User von Anfang an blocken via RLS (`is_active = true` in Policies)
- **Warum diese:** Klare User-Experience (Login-Page zeigt Hinweis "Account inaktiv"); RLS-Block wuerde stumm leere Daten liefern.

### Entscheidung 7: Trigger `handle_new_user()` mit Hardcoded-Admin-Email

- **Gewaehlt:** DB-Trigger auf `auth.users` INSERT erzeugt `profiles`-Zeile. Wenn Email = `marko.schweigerer@gmail.com` → Rolle `admin`, sonst `bearbeiter`.
- **Alternative:** Allowlist-Tabelle `admin_emails`, separate Logik
- **Warum diese:** Einfach, deterministisch, kein Bootstrap-Problem.

### Entscheidung 8: Route `/nutzer` statt `/nutzermanagement`

- **Gewaehlt:** Kurze Route `/nutzer` (konsistent mit `/kunden`, `/pipeline`)
- **Alternative:** `/nutzermanagement` (wie urspruengliche Fach-Spec)
- **Warum diese:** Konsistenz mit existierender Naming-Convention.

### Entscheidung 9: Trash-Icon = Soft-Delete

- **Gewaehlt:** Trash-Icon setzt `is_active=false`; bei inaktiven Zeilen erscheint Refresh-Icon zum Reaktivieren
- **Alternative:** Trash = Hard-Delete via `auth.admin.deleteUser`
- **Warum diese:** Audit-Trail bleibt, kein Datenverlust, FKs auf `kunden.bearbeiter_id` brechen nicht.

### Entscheidung 10: `last_login_at` mit Throttle

- **Gewaehlt:** Update nur wenn `last_login_at < now() - interval '1 hour'`
- **Alternative:** Jede Authentifizierung schreibt
- **Warum diese:** Verhindert DB-Last bei vielen Requests, kein nennenswerter Genauigkeits-Verlust.

### Entscheidung 11: `full_name` optional, Avatar-Fallback aus Email

- **Gewaehlt:** Signup bleibt minimal (Email+Passwort). `full_name` via `/profil` ergaenzbar. Avatar-Initialen: erste 2 Zeichen vor `@` wenn `full_name` leer, sonst aus `full_name`.
- **Alternative:** Pflichtfeld `full_name` im Signup
- **Warum diese:** Keine Breaking-Change am Signup-Flow.

### Entscheidung 12: CSV-Export folgt Filter-Status

- **Gewaehlt:** Export liefert genau die Zeilen, die nach Suche+Rollen-Filter sichtbar sind
- **Alternative:** Immer alle User
- **Warum diese:** Erwartungs-konform (User exportiert was er sieht).

### Entscheidung 13: Seed-User mit fixem Dev-Passwort

- **Gewaehlt:** Seed-Script legt Ben/Clara/Anna/Bibi mit `Solarwerk2026!` an, Passwort kann via `/passwort-reset` geaendert werden
- **Alternative:** Random-Passwoerter, Magic-Link
- **Warum diese:** Lehr-Repo-tauglich, reproduzierbar, keine SMTP-Abhaengigkeit.

---

## SQL-Befehle (Reihenfolge zwingend)

> **Wichtig:** Alle SQL-Befehle in der angegebenen Reihenfolge ausfuehren. Reihenfolge verhindert Self-Lockout des Admin-Users.

### 1. `profiles`-Tabelle anlegen (ohne RLS)

```sql
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  email        text not null,
  role         text not null check (role in ('admin', 'bearbeiter', 'buchhaltung')),
  is_active    boolean not null default true,
  last_login_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_profiles_email on public.profiles(email);
create index idx_profiles_role on public.profiles(role);

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

comment on table public.profiles is 'Rollen + Status pro Auth-User (RBAC)';
```

### 2. `SECURITY DEFINER` Rollen-Function

```sql
create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_user_is_active()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(is_active, false) from public.profiles where id = auth.uid();
$$;
```

### 3. Trigger `handle_new_user`

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, is_active)
  values (
    new.id,
    new.email,
    case
      when lower(new.email) = 'marko.schweigerer@gmail.com' then 'admin'
      else 'bearbeiter'
    end,
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
```

### 4. Backfill: existierende `auth.users` → `profiles`

```sql
insert into public.profiles (id, email, role, is_active)
select
  id,
  email,
  case
    when lower(email) = 'marko.schweigerer@gmail.com' then 'admin'
    else 'bearbeiter'
  end,
  true
from auth.users
on conflict (id) do nothing;
```

### 5. Seed-User anlegen — via Seed-Script (siehe Code-Migration §3)

Nach Schritt 4 ausfuehren: `node scripts/seed-users.mjs`. Script legt Ben, Clara, Anna (bearbeiter), Bibi (buchhaltung) mit Passwort `Solarwerk2026!` an. Trigger setzt automatisch Profile-Rows mit role=bearbeiter; Script korrigiert anschliessend Bibis Rolle auf `buchhaltung` und setzt `full_name`.

### 6. `bearbeiter_id`-Spalten ergaenzen

```sql
alter table public.kunden
  add column bearbeiter_id uuid references auth.users(id) on delete set null;

alter table public.pipeline
  add column bearbeiter_id uuid references auth.users(id) on delete set null;

create index idx_kunden_bearbeiter on public.kunden(bearbeiter_id);
create index idx_pipeline_bearbeiter_id on public.pipeline(bearbeiter_id);
```

### 7. Pipeline-Backfill: `bearbeiter`-Text → `bearbeiter_id`

```sql
-- Mapping per ILIKE: existierende pipeline.bearbeiter-Text-Werte auf neue Auth-User
update public.pipeline p
set bearbeiter_id = u.id
from auth.users u
where (
  (p.bearbeiter ilike 'ben%'   and u.email = 'ben@solarwerk.de')   or
  (p.bearbeiter ilike 'clara%' and u.email = 'clara@solarwerk.de') or
  (p.bearbeiter ilike 'anna%'  and u.email = 'anna@solarwerk.de')
);
```

### 8. Kunden-Backfill: aus Pipeline-Match + Random-Fallback

```sql
-- Schritt 1: Kunden, die in pipeline mit gematchtem bearbeiter_id auftauchen → uebernehmen
update public.kunden k
set bearbeiter_id = p.bearbeiter_id
from public.pipeline p
where p.customer_id = k.id
  and p.bearbeiter_id is not null
  and k.bearbeiter_id is null;

-- Schritt 2: verbleibende Kunden ohne bearbeiter_id → Random aus Bearbeiter-Pool
with bearbeiter_pool as (
  select id from auth.users
  where email in ('ben@solarwerk.de', 'clara@solarwerk.de', 'anna@solarwerk.de')
)
update public.kunden k
set bearbeiter_id = (
  select id from bearbeiter_pool order by random() limit 1
)
where k.bearbeiter_id is null;
```

### 9. Alte `to authenticated`-Policies aus spec_auth droppen

```sql
drop policy if exists "authenticated_select_kunden"   on public.kunden;
drop policy if exists "authenticated_insert_kunden"   on public.kunden;
drop policy if exists "authenticated_update_kunden"   on public.kunden;
drop policy if exists "authenticated_delete_kunden"   on public.kunden;

drop policy if exists "authenticated_select_pipeline" on public.pipeline;
drop policy if exists "authenticated_insert_pipeline" on public.pipeline;
drop policy if exists "authenticated_update_pipeline" on public.pipeline;
drop policy if exists "authenticated_delete_pipeline" on public.pipeline;
```

### 10. Neue rollen-basierte Policies auf `kunden`

```sql
-- Admin: Vollzugriff
create policy "admin_all_kunden"
  on public.kunden for all
  to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

-- Buchhaltung: SELECT alles, kein Write
create policy "buchhaltung_select_kunden"
  on public.kunden for select
  to authenticated
  using (public.current_user_role() = 'buchhaltung');

-- Bearbeiter: SELECT/INSERT/UPDATE/DELETE nur eigene
create policy "bearbeiter_select_own_kunden"
  on public.kunden for select
  to authenticated
  using (
    public.current_user_role() = 'bearbeiter'
    and bearbeiter_id = auth.uid()
  );

create policy "bearbeiter_insert_own_kunden"
  on public.kunden for insert
  to authenticated
  with check (
    public.current_user_role() = 'bearbeiter'
    and bearbeiter_id = auth.uid()
  );

create policy "bearbeiter_update_own_kunden"
  on public.kunden for update
  to authenticated
  using (
    public.current_user_role() = 'bearbeiter'
    and bearbeiter_id = auth.uid()
  )
  with check (
    public.current_user_role() = 'bearbeiter'
    and bearbeiter_id = auth.uid()
  );

create policy "bearbeiter_delete_own_kunden"
  on public.kunden for delete
  to authenticated
  using (
    public.current_user_role() = 'bearbeiter'
    and bearbeiter_id = auth.uid()
  );
```

### 11. Neue Policies auf `pipeline` (analog)

```sql
create policy "admin_all_pipeline"
  on public.pipeline for all
  to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

create policy "buchhaltung_select_pipeline"
  on public.pipeline for select
  to authenticated
  using (public.current_user_role() = 'buchhaltung');

create policy "bearbeiter_select_own_pipeline"
  on public.pipeline for select
  to authenticated
  using (
    public.current_user_role() = 'bearbeiter'
    and bearbeiter_id = auth.uid()
  );

create policy "bearbeiter_insert_own_pipeline"
  on public.pipeline for insert
  to authenticated
  with check (
    public.current_user_role() = 'bearbeiter'
    and bearbeiter_id = auth.uid()
  );

create policy "bearbeiter_update_own_pipeline"
  on public.pipeline for update
  to authenticated
  using (
    public.current_user_role() = 'bearbeiter'
    and bearbeiter_id = auth.uid()
  )
  with check (
    public.current_user_role() = 'bearbeiter'
    and bearbeiter_id = auth.uid()
  );

create policy "bearbeiter_delete_own_pipeline"
  on public.pipeline for delete
  to authenticated
  using (
    public.current_user_role() = 'bearbeiter'
    and bearbeiter_id = auth.uid()
  );
```

### 12. `profiles`-RLS aktivieren + Policies

```sql
alter table public.profiles enable row level security;

-- Jeder authentifizierte User darf eigenes Profil lesen
create policy "user_read_own_profile"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- Eigener Update auf full_name (Passwort laeuft ueber auth.updateUser, nicht profiles)
create policy "user_update_own_profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- Admin: Vollzugriff auf alle Profile
create policy "admin_all_profiles"
  on public.profiles for all
  to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');
```

---

## Code-Migration

### 1. Env

| Datei | Aenderung |
|---|---|
| `.env.local` | Neu: `SUPABASE_SERVICE_ROLE_KEY=<service_role_aus_dashboard>` (server-only, kein `NEXT_PUBLIC_`-Prefix) |
| `.gitignore` | Bereits ignoriert |

### 2. Typen

| Datei | Aenderung |
|---|---|
| `types/index.ts` | Neue Typen: `UserRole = 'admin'\|'bearbeiter'\|'buchhaltung'`, `Profile { id, email, full_name, role, is_active, last_login_at, created_at }`. `Kunde` + `PipelineEintrag` bekommen optionalen `bearbeiter_id: string \| null`. |

### 3. Seed-Script

| Datei | Aenderung |
|---|---|
| `scripts/seed-users.mjs` | Neu: Node-Script, nutzt `@supabase/supabase-js` mit Service-Role-Key, ruft `supabase.auth.admin.createUser` fuer Ben/Clara/Anna/Bibi mit Passwort `Solarwerk2026!`, `email_confirm: true`. Anschliessend Update auf `profiles`: setzt `full_name` und korrigiert Bibis Rolle auf `buchhaltung`. |
| `package.json` | Neuer Script-Eintrag: `"seed:users": "node scripts/seed-users.mjs"` |

Seed-Daten:

```
ben@solarwerk.de     → Ben Schmidt   → bearbeiter
clara@solarwerk.de   → Clara Weber   → bearbeiter
anna@solarwerk.de    → Anna Mueller  → bearbeiter
bibi@solarwerk.de    → Bibi Hartmann → buchhaltung
```

Passwort fuer alle: `Solarwerk2026!`

### 4. Supabase-Server-Helpers

| Datei | Aenderung |
|---|---|
| `lib/supabase/admin.ts` | Neu: `createSupabaseAdminClient()` mit Service-Role-Key. Nur in Server-Routes/Actions verwenden. Niemals in Client-Component importieren. |
| `lib/auth/role.ts` | Neu: `getCurrentUserProfile()` (cached pro Request via `cache()`), `requireRole(role: UserRole \| UserRole[])` Helper-Function wirft Redirect bei Fehlmatch. |

### 5. `proxy.ts` erweitern

| Datei | Aenderung |
|---|---|
| `lib/supabase/middleware.ts` | `updateSession()` erweitern: nach `getUser()` zusaetzlich `profiles`-Row lesen (via `current_user_role()`-RPC oder direkter Select). Bei `is_active=false` → `signOut()` + Redirect `/login?inactive=1`. Bei Route-Permission-Fail → Redirect `/403`. Definiere Map `ROUTE_ROLES`: `/berichte` → `['admin','buchhaltung']`, `/nutzer` → `['admin']`. |
| `proxy.ts` | Unveraendert (delegiert an `updateSession`) |

### 6. Pages

| Datei | Aenderung |
|---|---|
| `app/login/login-form.tsx` | Bei `?inactive=1` Param: Banner "Account inaktiv, bitte Admin kontaktieren". Nach Login Server-Action `recordLogin()` aufrufen (siehe §7). |
| `app/403/page.tsx` | Neu: Klartext "Zugriff verweigert", Link zurueck zu `/` |
| `app/nutzer/page.tsx` | Neu (Server-Component): `requireRole('admin')`, laedt alle Profile via Server-Client, rendert `NutzerClient` |
| `app/nutzer/nutzer-client.tsx` | Neu (Client-Component): Header, 3 Stat-Cards, Suchfeld, Rollen-Filter, CSV-Export-Button, Tabelle mit Avatar+Rolle-Dropdown+Status+Aktionen, Invite-Modal, Detail-Modal |
| `app/nutzer/avatar.tsx` | Neu: Server-Component fuer farbig-deterministischen Avatar-Circle mit Initialen |
| `app/profil/page.tsx` | Neu (Server-Component): laedt eigenes Profil, rendert `ProfilClient` |
| `app/profil/profil-client.tsx` | Neu: Form fuer `full_name` (PATCH `/api/profil`) + Passwort (`supabase.auth.updateUser`) |
| `app/nav.tsx` | Akzeptiert neuen Prop `userRole: UserRole \| null`. Links rollenabhaengig filtern: Bearbeiter sieht kein `/berichte` und kein `/nutzer`; Buchhaltung sieht kein `/nutzer`; Admin sieht alles. Neuer Link `/profil`. |
| `app/layout.tsx` | Zusaetzlich zu `userEmail` jetzt `userRole` an Nav reichen |
| `app/berichte/page.tsx` | `requireRole(['admin','buchhaltung'])` ergaenzen |

### 7. API-Routes

| Datei | Aenderung |
|---|---|
| `app/api/profil/route.ts` | Neu: PATCH (`full_name`), nutzt Server-Client, RLS schuetzt |
| `app/api/login-hook/route.ts` | Neu: POST setzt `last_login_at` (throttled 1h), aufgerufen aus Login-Form-Action und `/auth/callback` |
| `app/api/nutzer/route.ts` | Neu: GET (Liste, nur admin via `requireRole`), GET `?format=csv` fuer Export |
| `app/api/nutzer/[id]/route.ts` | Neu: PATCH (role, is_active). Nutzt Admin-Client. Validierungen: Self-Protection, Last-Admin-Protection. |
| `app/api/nutzer/invite/route.ts` | Neu: POST (email + role). Nutzt `supabase.auth.admin.inviteUserByEmail`. Setzt nach Invite die Ziel-Rolle in `profiles`. |
| `app/api/kunden/route.ts` | INSERT: `bearbeiter_id` aus `auth.uid()` setzen wenn Body keinen Wert hat |
| `app/api/pipeline/route.ts` | INSERT: `bearbeiter_id` aus `auth.uid()` setzen wenn Body keinen Wert hat |

### 8. `/auth/callback`

| Datei | Aenderung |
|---|---|
| `app/auth/callback/route.ts` | Nach `exchangeCodeForSession`: POST an `/api/login-hook` (fire-and-forget) |

---

## Edge Cases

1. **Was passiert bei:** Neuer User registriert sich via `/login` (Tab Registrieren)
   **Erwartetes Verhalten:** Auth-User wird angelegt. Trigger `handle_new_user` legt Profile-Row mit `role='bearbeiter'`, `is_active=true` an. Login erfolgt, Redirect `/`. Bearbeiter sieht 0 Kunden (kein `bearbeiter_id`-Match), bis Admin Zuweisung macht oder neue Kunden anlegt.

2. **Was passiert bei:** Bearbeiter ruft `/berichte` auf
   **Erwartetes Verhalten:** `proxy.ts` prueft Route + Rolle, kein Match → Redirect `/403`. Nav zeigt Link gar nicht erst.

3. **Was passiert bei:** Bearbeiter ruft `/nutzer` direkt via URL auf
   **Erwartetes Verhalten:** Redirect `/403`.

4. **Was passiert bei:** Admin deaktiviert sich selbst
   **Erwartetes Verhalten:** API `PATCH /api/nutzer/[id]` mit `id=self.id` und `is_active=false` → HTTP 400 "Eigene Deaktivierung nicht erlaubt".

5. **Was passiert bei:** Admin (einziger) demoted sich auf Bearbeiter
   **Erwartetes Verhalten:** API zaehlt aktive Admins, count=1 → HTTP 400 "Letzter Admin kann nicht degradiert werden".

6. **Was passiert bei:** Admin deaktiviert anderen Admin, danach einzigen verbleibenden Admin demoten
   **Erwartetes Verhalten:** Erste Aktion erlaubt (`is_active=false`). Zweite Aktion: aktive-Admin-Count=1 → HTTP 400.

7. **Was passiert bei:** Inaktiver User hat noch gueltiges Session-Cookie
   **Erwartetes Verhalten:** `proxy.ts` liest `is_active=false`, ruft `signOut()`, Cookies werden geloescht, Redirect `/login?inactive=1`. Login-Page zeigt Banner.

8. **Was passiert bei:** Buchhaltung versucht POST `/api/kunden`
   **Erwartetes Verhalten:** Insert wird durch RLS blockiert (keine INSERT-Policy fuer `buchhaltung`). Supabase-Fehler 42501 (insufficient_privilege). API-Route gibt 400 mit Klartext-Meldung zurueck.

9. **Was passiert bei:** Bearbeiter ruft GET `/api/pipeline` mit fremden Kunden-ID via direktem Link
   **Erwartetes Verhalten:** RLS filtert, Result leer oder 404. Detail-Page redirected via `getPipelineEintrag` → null → 404.

10. **Was passiert bei:** Admin lockt einen User mit `last_login_at` vor 2 Jahren
    **Erwartetes Verhalten:** Detail-Modal zeigt korrekt das Datum. Keine besondere Behandlung.

11. **Was passiert bei:** Admin ruft Invite mit bereits existierender Email auf
    **Erwartetes Verhalten:** `inviteUserByEmail` liefert Fehler "User already registered" → Modal zeigt rotes Banner.

12. **Was passiert bei:** Invite ohne Rolle (Dropdown leer) submitten
    **Erwartetes Verhalten:** Client-Validierung blockt Submit, Server-Action zusaetzlich validiert und gibt 400 "Rolle ist Pflicht".

13. **Was passiert bei:** Service-Role-Key nicht gesetzt in `.env.local`
    **Erwartetes Verhalten:** `app/api/nutzer/invite` und `app/api/nutzer/[id]` werfen 500 mit klarer Meldung "Server nicht korrekt konfiguriert". Andere Routen funktionieren normal.

14. **Was passiert bei:** `current_user_role()` wird ohne authentifizierte Session aufgerufen
    **Erwartetes Verhalten:** `auth.uid()` liefert NULL, Function liefert NULL, Policy-Check schlaegt fehl, Zugriff verweigert.

15. **Was passiert bei:** Bearbeiter legt neuen Kunden an (POST `/api/kunden` ohne `bearbeiter_id` im Body)
    **Erwartetes Verhalten:** API setzt `bearbeiter_id = auth.uid()`, RLS-Check erlaubt INSERT.

16. **Was passiert bei:** Buchhaltung exportiert CSV von `/nutzer`
    **Erwartetes Verhalten:** Page nicht erreichbar (Buchhaltung blockiert), Export-Button nie sichtbar.

17. **Was passiert bei:** User klickt Reaktivieren bei inaktivem User
    **Erwartetes Verhalten:** PATCH `/api/nutzer/[id]` mit `is_active=true`. Self-Protection greift nicht (Reaktivieren von sich selbst geht eh nicht weil eingeloggt).

18. **Was passiert bei:** `pipeline.bearbeiter`-Text-Wert matcht keinen der 3 Bearbeiter (z.B. "Felix")
    **Erwartetes Verhalten:** Backfill SQL §7 setzt `pipeline.bearbeiter_id = NULL`. Kunden-Backfill §8 Schritt 1 uebernimmt NULL nicht. Kunden-Backfill §8 Schritt 2 (Random) wird ausgefuehrt fuer die zugehoerigen Kunden falls noch NULL.

19. **Was passiert bei:** Admin laedt CSV mit Suchterm "anna" und Rollen-Filter "bearbeiter"
    **Erwartetes Verhalten:** Export enthaelt nur Zeilen die beiden Filtern entsprechen.

20. **Was passiert bei:** User aendert eigenen `full_name` via `/profil`
    **Erwartetes Verhalten:** PATCH `/api/profil` schreibt nur `full_name`, RLS-Policy `user_update_own_profile` erlaubt es. Rolle und `is_active` koennen ueber diese Policy nicht geaendert werden (WITH CHECK `role = (select role from profiles where id = auth.uid())`).

---

## Akzeptanzkriterien

### DB

- [ ] `public.profiles`-Tabelle existiert mit allen Spalten und Constraints
- [ ] Funktionen `current_user_role()` + `current_user_is_active()` existieren als `SECURITY DEFINER`
- [ ] Trigger `on_auth_user_created` erzeugt automatisch Profile fuer neue Auth-User mit Default-Rolle und Marko-Sonderfall
- [ ] Backfill: alle existierenden `auth.users` haben Profile-Eintrag
- [ ] Seed-User Ben, Clara, Anna, Bibi sind in `auth.users` UND `profiles` mit korrekten Rollen + `full_name`
- [ ] `kunden.bearbeiter_id` Spalte existiert, alle 36 Bestandszeilen haben einen UUID-Wert
- [ ] `pipeline.bearbeiter_id` Spalte existiert, alle 12 Bestandszeilen haben einen UUID-Wert (gemappt aus `bearbeiter`-Text)
- [ ] Alte `to authenticated`-Policies sind dropped
- [ ] Neue rollen-basierte Policies sind aktiv auf `kunden`, `pipeline`, `profiles`

### RLS-Verhalten

- [ ] Bearbeiter sieht via `select * from kunden` nur eigene Zeilen
- [ ] Buchhaltung sieht via `select * from kunden` alle Zeilen, INSERT/UPDATE/DELETE schlaegt fehl
- [ ] Admin sieht alle Zeilen, CRUD funktioniert
- [ ] Gleiche Beobachtungen fuer `pipeline`
- [ ] User liest nur eigenes `profiles`-Row; Admin liest alle

### App

- [ ] `npm run build` erfolgreich
- [ ] `npm run lint` clean
- [ ] `npx tsc --noEmit` clean
- [ ] Login als Marko (admin) → `/` zeigt 36 Kunden, Nav zeigt Dashboard/Pipeline/Berichte/Neuer Kunde/Nutzer/Profil
- [ ] Login als Ben (bearbeiter) → `/` zeigt nur eigene Kunden, Nav zeigt Dashboard/Pipeline/Neuer Kunde/Profil (kein Berichte/Nutzer)
- [ ] Login als Bibi (buchhaltung) → `/` zeigt alle Kunden, Nav zeigt Dashboard/Pipeline/Berichte/Profil (kein Neuer Kunde/Nutzer); Anlegen-Buttons gesperrt
- [ ] `/berichte` als Bearbeiter → Redirect `/403`
- [ ] `/nutzer` als Bearbeiter/Buchhaltung → Redirect `/403`
- [ ] `/nutzer` als Admin → Tabelle zeigt 5 User (Marko + 4 Seed), 3 Stat-Cards stimmen
- [ ] Suche "ben" zeigt nur Ben
- [ ] Rollen-Filter "bearbeiter" zeigt 3 User
- [ ] CSV-Export liefert 6 Spalten der gefilterten Ansicht
- [ ] Rolle aendern via Dropdown: PATCH ruft API, RLS bleibt korrekt
- [ ] Trash-Icon: User wird `is_active=false`, naechster Request loggt User aus, Banner "Account inaktiv" auf Login-Page
- [ ] Refresh-Icon auf inaktivem User: reaktiviert
- [ ] Eye-Icon: Detail-Modal zeigt alle Felder inkl. `last_login_at`
- [ ] Invite-Modal: Email + Pflicht-Rolle → Supabase sendet Einladung, neuer User taucht in Tabelle auf
- [ ] Self-Protection: Marko kann sich selbst nicht deaktivieren (HTTP 400)
- [ ] Last-Admin-Protection: Marko kann seine eigene Rolle nicht aendern wenn er einziger Admin (HTTP 400)
- [ ] `/profil` ladbar, Name speichern funktioniert, Passwort aendern funktioniert
- [ ] `last_login_at` wird nach Login aktualisiert, throttled (zweiter Login innerhalb 1h ohne Update)
- [ ] Inaktiver User mit gueltigem Cookie → `proxy.ts` loggt aus + Redirect mit Banner
- [ ] **Alle Edge Cases aus dem Abschnitt oben sind getestet**

---

## Out of Scope

- Audit-Log-Tabelle fuer Rollen-Aenderungen (`role_audit_log`)
- Impersonation ("Login als User X")
- 2FA / Multi-Factor-Authentication
- OAuth-Provider
- Granulare Berechtigungen jenseits der 3 Rollen (z.B. "darf nur lesen" pro Tabelle)
- Audit-Log fuer Datenaenderungen (wer hat Kunde X wann editiert)
- Bulk-Aktionen (mehrere User gleichzeitig aktivieren/deaktivieren)
- Soft-Delete fuer Kunden/Pipeline (orthogonal zu User-Management)
- Anpassbare Einladungs-Email-Templates (bleiben Supabase-Default)
- Avatar-Upload (nur Initialen)
- E-Mail-Aenderung in `/profil` (nur `full_name` + Passwort; Email-Change waere eigene Flow inkl. Confirmation)
- Account-Loeschen-Flow (User loescht sich selbst)
