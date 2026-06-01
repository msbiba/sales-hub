# Spec: Supabase Authentifizierung

## Zweck

Der Mock-Login in `app/login/page.tsx` wird durch echte Supabase-Authentifizierung ersetzt. Die Tabellen `public.kunden` und `public.pipeline` (aktuell unrestricted) bekommen Row Level Security, sodass ausschliesslich eingeloggte Nutzer lesen und schreiben koennen. Nicht-authentifizierte Aufrufe werden vom Next.js Middleware-Guard auf `/login` umgeleitet.

---

## Inputs

- `app/login/page.tsx` — bestehender Mockup (kein Auth, redirect nach `/`)
- `lib/supabase.ts` — Singleton-Client mit Anon-Key, ohne Session-Handling
- `app/nav.tsx` — Navigation, aktuell ohne Login-Status oder Logout
- `app/api/kunden/*`, `app/api/pipeline/*` — API-Routes, nutzen Singleton-Client ohne User-Kontext
- Alle Server-Pages (`app/kunden/page.tsx`, `app/pipeline/page.tsx`, `app/berichte/page.tsx`, etc.) — lesen via `lib/data.ts` mit Anon-Key
- `.env.local` — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Supabase-Projekt: Tabellen `kunden` + `pipeline` ohne RLS

---

## Verhalten

1. Besucher ohne gueltige Session, der eine geschuetzte Route aufruft, wird per Middleware auf `/login?redirect=<original>` umgeleitet.
2. Auf `/login` kann der Nutzer zwischen **Anmelden** und **Registrieren** wechseln (Tab-Toggle im selben Formular).
3. Erfolgreiche Anmeldung setzt Session-Cookies via `@supabase/ssr` und redirected auf `redirect`-Param oder `/`.
4. Erfolgreiche Registrierung loggt den Nutzer sofort ein (Email-Confirmation deaktiviert).
5. "Passwort vergessen"-Link auf Login-Seite → `/passwort-reset`-Page, sendet Reset-Mail.
6. Reset-Mail-Link fuehrt zu `/passwort-neu`-Page, dort kann neues Passwort gesetzt werden.
7. Nav zeigt rechts: User-Email + Logout-Button, wenn eingeloggt; Link "Anmelden", wenn nicht.
8. Logout: Session-Cookies loeschen, redirect auf `/login`.
9. Alle DB-Reads/Writes laufen ueber den Server-Client mit Cookie-basierter Session. Anon-Key bleibt im Client (Login-Form), Service-Role-Key wird nicht verwendet.
10. RLS auf `kunden` + `pipeline` erlaubt CRUD ausschliesslich fuer Rolle `authenticated`.

---

## Architektur-Entscheidungen

### Entscheidung 1: `@supabase/ssr` statt `@supabase/auth-helpers-nextjs`

- **Gewaehlt:** `@supabase/ssr` mit `createBrowserClient` + `createServerClient`
- **Alternative waere:** `@supabase/auth-helpers-nextjs`
- **Warum diese:** `auth-helpers-nextjs` ist deprecated, Supabase empfiehlt fuer App-Router-Projekte explizit `@supabase/ssr`. Cookie-Handling ist Server-Component-kompatibel.

### Entscheidung 2: Email-Confirmation deaktiviert

- **Gewaehlt:** Supabase-Dashboard → Auth → Providers → Email → "Confirm email" = aus
- **Alternative waere:** Confirmation-Mail an, User klickt Link
- **Warum diese:** Lehr-Repo. Default-SMTP des Free-Plans ist rate-limited (3 Mails/h), fuehrt zu Aussperrungen. Signup → sofort eingeloggt vereinfacht Kursdemo.

### Entscheidung 3: RLS-Modell `authenticated`-only (kein Owner-basiertes Model)

- **Gewaehlt:** RLS-Policies pruefen `auth.role() = 'authenticated'` fuer SELECT/INSERT/UPDATE/DELETE
- **Alternative waere:** Owner-basiert via `created_by = auth.uid()` mit neuer Spalte in beiden Tabellen
- **Warum diese:** Sales-Hub ist internes Tool, alle Mitarbeiter sollen alle Kunden sehen. Owner-Modell erfordert Backfill der bestehenden Zeilen und macht Lehrbeispiel unnoetig komplex.

### Entscheidung 4: Middleware-Guard statt Per-Page-Checks

- **Gewaehlt:** `middleware.ts` an der Repo-Root prueft Session und redirected
- **Alternative waere:** In jeder Server-Page einzeln `auth.getUser()` und redirect
- **Warum diese:** Zentral, weniger duplizierter Code, neue Pages sind automatisch geschuetzt. Middleware refresht zusaetzlich abgelaufene Access-Tokens.

### Entscheidung 5: Self-Signup auf Login-Seite an

- **Gewaehlt:** Toggle "Anmelden / Registrieren" direkt im Login-Formular
- **Alternative waere:** User nur via Supabase-Dashboard anlegen
- **Warum diese:** User-Wunsch + Lehr-Repo: Kurs-Teilnehmer koennen sich selbst registrieren.

### Entscheidung 6: Client-Split in `lib/supabase/`

- **Gewaehlt:** `lib/supabase/client.ts` (Browser), `lib/supabase/server.ts` (Server mit Cookie-Adapter), `lib/supabase/middleware.ts` (Middleware-Adapter). Altes `lib/supabase.ts` wird entfernt.
- **Alternative waere:** Eine Datei mit beiden Factory-Funktionen
- **Warum diese:** Server-Client darf NICHT im Client-Bundle landen (greift auf `next/headers` zu). Saubere Trennung erzwingt das.

---

## SQL-Befehle

### 1. RLS aktivieren auf beiden Tabellen

```sql
alter table public.kunden enable row level security;
alter table public.pipeline enable row level security;
```

### 2. Policies fuer `kunden`

```sql
create policy "authenticated_select_kunden"
  on public.kunden for select
  to authenticated
  using (true);

create policy "authenticated_insert_kunden"
  on public.kunden for insert
  to authenticated
  with check (true);

create policy "authenticated_update_kunden"
  on public.kunden for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated_delete_kunden"
  on public.kunden for delete
  to authenticated
  using (true);
```

### 3. Policies fuer `pipeline`

```sql
create policy "authenticated_select_pipeline"
  on public.pipeline for select
  to authenticated
  using (true);

create policy "authenticated_insert_pipeline"
  on public.pipeline for insert
  to authenticated
  with check (true);

create policy "authenticated_update_pipeline"
  on public.pipeline for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated_delete_pipeline"
  on public.pipeline for delete
  to authenticated
  using (true);
```

### 4. Email-Confirmation deaktivieren (manuell im Dashboard)

Dashboard → Authentication → Sign In / Providers → Email → **Confirm email = OFF** → Save.

---

## Code-Migration

### Dateien

| Datei | Aenderung |
|---|---|
| `package.json` | `@supabase/ssr` hinzufuegen |
| `lib/supabase.ts` | **Loeschen** |
| `lib/supabase/client.ts` | Neu: `createBrowserClient` Factory |
| `lib/supabase/server.ts` | Neu: `createServerClient` mit `next/headers`-Cookie-Adapter |
| `lib/supabase/middleware.ts` | Neu: Session-Refresh + Cookie-Handling fuer Middleware |
| `middleware.ts` | Neu: Auth-Guard, redirect auf `/login` falls keine Session |
| `lib/data.ts` | Imports umstellen: `supabase` → `await createServerSupabase()` |
| `app/api/kunden/route.ts` | Server-Client statt Singleton |
| `app/api/kunden/[id]/route.ts` | Server-Client statt Singleton |
| `app/api/pipeline/route.ts` | Server-Client statt Singleton |
| `app/api/pipeline/[id]/route.ts` | Server-Client statt Singleton |
| `app/login/page.tsx` | Echtes `signInWithPassword` + `signUp`, Tab-Toggle, Error-Anzeige, redirect-Param-Handling |
| `app/login/login-form.tsx` | Neu: Client-Component mit Auth-Logik (Page wird Server-Component fuer Header) |
| `app/passwort-reset/page.tsx` | Neu: Email-Eingabe, `resetPasswordForEmail` |
| `app/passwort-neu/page.tsx` | Neu: Neues Passwort setzen via `updateUser` (Session aus URL-Code) |
| `app/auth/callback/route.ts` | Neu: OAuth/Magic-Link-Callback-Handler (auch fuer Passwort-Reset-Code-Tausch) |
| `app/nav.tsx` | User-Email + Logout-Button anzeigen, Auth-State aus Server-Client |
| `app/logout/route.ts` | Neu: POST → `signOut` + redirect `/login` |

### Geschuetzte vs. oeffentliche Routes

- **Oeffentlich** (Middleware laesst durch ohne Session): `/login`, `/passwort-reset`, `/passwort-neu`, `/auth/callback`, statische Assets
- **Geschuetzt** (Session erforderlich, sonst Redirect): alle anderen Routes inkl. `/`, `/kunden/*`, `/pipeline/*`, `/berichte`, `/api/*`

### Type-Anpassung

Keine. Auth-Daten kommen aus Supabase-User-Objekt, kein Domain-Typ aendert sich.

---

## Edge Cases

1. **Was passiert bei:** Nutzer ruft `/kunden/abc-123` ohne Session auf
   **Erwartetes Verhalten:** Middleware redirected zu `/login?redirect=/kunden/abc-123`. Nach erfolgreichem Login: redirect zur urspruenglichen URL.

2. **Was passiert bei:** Login mit falschem Passwort
   **Erwartetes Verhalten:** Supabase liefert Error `Invalid login credentials`. Login-Form zeigt Fehlertext rot ueber dem Submit-Button. Keine Cookies gesetzt.

3. **Was passiert bei:** Signup mit bereits existierender Email
   **Erwartetes Verhalten:** Supabase-Error `User already registered`. Form zeigt Fehlertext. Nutzer kann auf "Anmelden"-Tab wechseln.

4. **Was passiert bei:** Session-Cookie ist abgelaufen (Access-Token), Refresh-Token noch gueltig
   **Erwartetes Verhalten:** Middleware refresht Token automatisch via `supabase.auth.getUser()`, neuer Cookie wird gesetzt. Request laeuft normal durch.

5. **Was passiert bei:** API-Route POST `/api/kunden` ohne Session
   **Erwartetes Verhalten:** Middleware blockiert bereits, redirect (auf API-Routes als JSON 401 zurueckgeben, kein HTML-Redirect).

6. **Was passiert bei:** Logout-Button klicken
   **Erwartetes Verhalten:** POST an `/logout` → `supabase.auth.signOut()` → Cookies geloescht → redirect `/login`. Nach Reload: keine Session, geschuetzte Routes redirecten.

7. **Was passiert bei:** Passwort-Reset-Link aus Email wird geoeffnet
   **Erwartetes Verhalten:** Link enthaelt Code-Param, fuehrt zu `/auth/callback` → tauscht Code gegen Session → redirect zu `/passwort-neu`. Nutzer setzt neues Passwort, wird danach automatisch eingeloggt und auf `/` redirected.

8. **Was passiert bei:** RLS aktiv, aber Anon-Key direkt im Browser nutzt jemand fuer DB-Query
   **Erwartetes Verhalten:** Ohne Session-Cookie ist Rolle `anon`, Policies erlauben nur `authenticated` → leeres Result bzw. Insert/Update/Delete blockiert mit 403.

9. **Was passiert bei:** `redirect`-Param in `/login?redirect=...` enthaelt externe URL (z.B. `https://evil.com`)
   **Erwartetes Verhalten:** Nach Login wird `redirect`-Param validiert (muss mit `/` beginnen, nicht mit `//` oder `http`). Bei ungueltigem Wert: redirect auf `/`.

---

## Akzeptanzkriterien

- [ ] `@supabase/ssr` in `package.json` + installiert
- [ ] `lib/supabase.ts` entfernt, `lib/supabase/{client,server,middleware}.ts` existieren
- [ ] `middleware.ts` redirected nicht-authentifizierte Browser-Requests zu `/login?redirect=...`
- [ ] `middleware.ts` liefert 401 JSON fuer API-Routes ohne Session
- [ ] Login mit gueltigen Credentials erfolgreich → Cookies gesetzt → redirect `/` oder `redirect`-Param
- [ ] Login mit falschen Credentials zeigt Fehlertext
- [ ] Signup im Tab "Registrieren" legt User in Supabase an und loggt sofort ein
- [ ] Passwort-Reset-Flow: Email anfordern → Mail-Link → neues Passwort setzen → automatisch eingeloggt
- [ ] RLS aktiv auf `kunden` und `pipeline`, je 4 Policies fuer `authenticated`
- [ ] Eingeloggte Session sieht alle Kunden (24+12) und Pipeline-Eintraege (12)
- [ ] Nicht-eingeloggte DB-Query via Anon-Key liefert leeres Result
- [ ] Nav zeigt User-Email rechts + Logout-Button
- [ ] Logout loescht Cookies und redirected `/login`
- [ ] Alle Server-Pages (`/`, `/kunden`, `/kunden/[id]`, `/pipeline`, `/pipeline/[id]`, `/berichte`) laden mit Daten nach Login
- [ ] Alle API-Routes (POST/PUT/DELETE) funktionieren mit Session
- [ ] `redirect`-Param-Open-Redirect-Schutz: externe URLs werden ignoriert
- [ ] `npm run build` erfolgreich
- [ ] `npm run lint` ohne Errors
- [ ] **Alle Edge Cases aus dem Abschnitt oben sind getestet**

---

## Abgrenzung (Out of Scope)

- Keine OAuth-Provider (Google, GitHub, etc.)
- Kein Magic-Link-Login
- Keine Rollen-Verwaltung (Admin/User), alle authenticated-User sind gleichberechtigt
- Keine Owner-basierten RLS-Policies (`created_by = auth.uid()`)
- Keine Audit-Logs (wer hat wann was geaendert)
- Keine Multi-Factor-Auth
- Kein Service-Role-Key, keine serverseitige RLS-Umgehung
- Email-Templates (Reset-Mail-Inhalt) bleiben Supabase-Default
- Kein Account-Loeschen-Flow
