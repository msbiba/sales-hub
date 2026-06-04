# Spec: KI-Follow-up-E-Mail-Generator

---

## Zweck

Vertriebsmitarbeiter sollen direkt aus der Kundendetail-Seite heraus kontextbezogene Follow-up-E-Mails per KI generieren koennen, basierend auf Kundendaten und Pipeline-Historie. Der generierte Text (Betreff + Body) ist editierbar und kann per Copy-Button in den E-Mail-Client uebernommen werden.

---

## Inputs

### Automatisch aus Datenbank gelesen (Server-side, im Route Handler)
- `kunde.ansprechpartner` — `string`, Name der Kontaktperson
- `kunde.letzter_kontakt` — `string` (ISO-Datum), Datum des letzten Kontakts
- `kunde.notiz` — `string`, Freitext-Notiz zum Kunden
- `kunde.firma` — `string`, Firmenname (fuer Anrede/Kontext)
- `kunde.status` — `KundenStatus` (`aktiv` | `in_wartung` | `beschwerde`)
- Pipeline-Eintraege zum Kunden (via `customer_id`-Filter auf `pipeline`-Tabelle):
  - `pipeline.volumen_eur` — `number`
  - `pipeline.status` — `PipelineStatus`
  - `pipeline.angebotsdatum` — `string` (ISO-Datum)
  - `pipeline.notiz` — `string`
- `profile.full_name` — `string | null`, Name des eingeloggten Users (fuer Signatur)

### Fuer Button-Sichtbarkeit (Server Component, als Prop)
- `hasPipelineEintraege` — `boolean`, wird in `page.tsx` via neuer Funktion `hatPipelineEintraege(kundeId)` ermittelt und als Prop an Client Component uebergeben

### User-Eingaben (Client-side)
- **E-Mail-Typ** — Dropdown, Pflichtfeld. Optionen:
  - `nachfass` — Nachfass-E-Mail
  - `angebot` — Angebot nachfassen/senden
  - `termin` — Terminvereinbarung
  - `beschwerde_antwort` — Antwort auf Beschwerde
  - `statusupdate` — Projektstatus-Update
  - `wartungserinnerung` — Wartungserinnerung
  - `upselling` — Upselling/Cross-Selling
  - `projektabschluss` — Projektabschluss-Mitteilung
- **Ton** — Dropdown, Pflichtfeld. Optionen:
  - `formell` — Siezen, geschaeftlich
  - `locker` — Duzen, informell
  - `neutral` — Sachlich, weder besonders formell noch locker
- **Zusaetzlicher Kontext** — Freitextfeld, optional, max 500 Zeichen. Beispiel: "War letzte Woche vor Ort, hat neues Dach erwaehnt"

---

## Verhalten

### UI-Flow

1. User oeffnet `/kunden/[id]` — Server Component laedt Kundendaten + `hasPipelineEintraege`-Boolean
2. Wenn `hasPipelineEintraege === true` UND `canEdit === true`: Button "Follow-up E-Mail generieren" erscheint unterhalb der Kundenkarte, links buendig (gegenueber dem Loeschen-Button rechts)
3. Wenn `hasPipelineEintraege === false` ODER `canEdit === false`: Button nicht sichtbar
4. User klickt Button → **Collapsible Section** klappt direkt darunter auf (kein Modal) mit:
   - Dropdown "E-Mail-Typ" (Pflicht, Default: kein Wert gewaehlt)
   - Dropdown "Ton" (Pflicht, Default: kein Wert gewaehlt)
   - Freitextfeld "Zusaetzlicher Kontext" (optional, max 500 Zeichen, Zeichen-Zaehler sichtbar)
   - Button "E-Mail generieren" (disabled bis E-Mail-Typ UND Ton gewaehlt)
   - Zaehler "X von 5 Generierungen verbleibend"
5. User waehlt Typ + Ton, optional Freitext → klickt "E-Mail generieren"
6. Button wechselt in Loading-State ("Generiere..."), wird disabled
7. **Streaming**: Betreff erscheint in einem `input`-Feld, Body baut sich Token fuer Token in `textarea` auf
8. Nach Abschluss: Betreff-Feld und Body-Textarea sind editierbar, darunter zwei Buttons:
   - "In Zwischenablage kopieren" — kopiert "Betreff: {betreff}\n\n{body}", zeigt kurz "Kopiert!" Feedback
   - "Neu generieren" — zaehlt Limit runter, generiert erneut mit gleichen/geaenderten Inputs
9. Generierungs-Zaehler dekrementiert pro **erfolgreicher** Generation. Bei 0 verbleibend: "Generieren"-Button disabled, Hinweis "Limit erreicht. Seite neu laden fuer weitere Generierungen."
10. Erneuter Klick auf "Follow-up E-Mail generieren" (Haupt-Button) klappt Section zu

### API-Flow (Server-side Route Handler)

1. `POST /api/ai/followup-email` empfaengt JSON: `{ kundeId: string, emailTyp: string, ton: string, zusatzKontext?: string }`
2. **Auth-Check**: Route Handler liest User via `supabase.auth.getUser()`. Wenn nicht eingeloggt → `401`. Dann liest `profiles`-Tabelle fuer Rolle. Wenn Rolle `buchhaltung` → `403`.
3. **Input-Validierung**: `kundeId` muss vorhanden sein, `emailTyp` muss in erlaubter Liste sein, `ton` muss in erlaubter Liste sein, `zusatzKontext` max 500 Zeichen
4. Route Handler liest Kundendaten via `getKunde(kundeId)` — wenn nicht gefunden → `404`
5. Route Handler liest Pipeline-Eintraege via `getPipelineFuerKunde(kundeId)` — wenn 0 Eintraege → `400 "Keine Pipeline-Eintraege vorhanden"`
6. Route Handler liest `profile.full_name` (aus Schritt 2 bereits vorhanden)
7. **API-Key-Check**: `process.env.OPENROUTER_API_KEY` — wenn nicht gesetzt → `500 "KI-Feature nicht konfiguriert"`
8. Baut System-Prompt + User-Prompt zusammen
9. Sendet Request an OpenRouter:
   - **URL:** `https://openrouter.ai/api/v1/chat/completions`
   - **Method:** `POST`
   - **Headers:**
     - `Authorization: Bearer ${OPENROUTER_API_KEY}`
     - `Content-Type: application/json`
     - `HTTP-Referer: ${request.headers.get('origin') || 'http://localhost:3000'}`
     - `X-Title: Solarwerk Sued Sales Hub`
   - **Body:**
     ```json
     {
       "model": "~anthropic/claude-haiku-latest",
       "stream": true,
       "messages": [
         { "role": "system", "content": "..." },
         { "role": "user", "content": "..." }
       ],
       "max_tokens": 1024
     }
     ```
10. Streamt Response zurueck: Route Handler liest OpenRouter SSE-Stream, extrahiert `choices[0].delta.content` aus jedem `data:`-Chunk, und schreibt Plain-Text-Chunks in einen `ReadableStream` der als `Response` mit `Content-Type: text/plain; charset=utf-8` zurueckgegeben wird

---

## Architektur-Entscheidungen

### Entscheidung 1: Server-side Route Handler statt direktem Client-Call

- **Gewaehlt:** Next.js Route Handler (`app/api/ai/followup-email/route.ts`) als Proxy zu OpenRouter
- **Alternative waere:** Direkter Fetch von Client zu OpenRouter
- **Warum diese:** API-Key bleibt in `.env.local` und wird nie an den Browser ausgeliefert. Zusaetzlich koennen wir serverseitig Kundendaten via Supabase laden und muessen diese nicht ueber den Client senden.

### Entscheidung 2: Pipeline-Daten serverseitig laden statt vom Client mitsenden

- **Gewaehlt:** Route Handler laedt Pipeline-Eintraege selbst via `customer_id`
- **Alternative waere:** Client sendet Pipeline-Daten im Request Body mit
- **Warum diese:** Verhindert Manipulation der KI-Inputs durch den Client. Daten kommen direkt aus der DB mit RLS. Weniger Payload im Request.

### Entscheidung 3: Generierungs-Limit als Client-State statt Server-Tracking

- **Gewaehlt:** `useState` Zaehler im Client, startet bei 5, dekrementiert pro erfolgreicher Generation
- **Alternative waere:** Server-seitiges Rate-Limiting pro User in DB oder Redis
- **Warum diese:** Fuer Kurs-Kontext ausreichend. Kein zusaetzliches DB-Schema noetig. Seiten-Reload setzt Zaehler zurueck — akzeptabel fuer Lehr-Repo.

### Entscheidung 4: Streaming via native ReadableStream (Plain-Text-Weiterleitung)

- **Gewaehlt:** Route Handler parst OpenRouter SSE-Stream serverseitig und gibt reinen Text-Stream (`text/plain`) an Client weiter. Client konsumiert via `fetch` + `getReader()` + `TextDecoder`.
- **Alternative waere:** OpenRouter SSE direkt an Client durchreichen, Client parst SSE selbst
- **Warum diese:** Client-Code bleibt simpel (nur Text-Chunks lesen). Kein SSE-Parsing im Browser noetig. Route Handler kann Fehler aus dem Stream abfangen bevor sie den Client erreichen.

### Entscheidung 5: Collapsible Section statt Modal

- **Gewaehlt:** Aufklappbare Section im Seitenflow, Toggle via Button
- **Alternative waere:** Overlay-Modal/Dialog
- **Warum diese:** Kein Portal/Overlay noetig, einfacherer Code. Kundendaten bleiben sichtbar waehrend der E-Mail-Generierung — User kann Kontext vergleichen. Natuerlicher im Seitenflow.

### Entscheidung 6: Auth-Check im Route Handler eigenstaendig

- **Gewaehlt:** Route Handler prueft Auth + Rolle unabhaengig vom Client via `supabase.auth.getUser()` + `profiles`-Query
- **Alternative waere:** Nur RLS und Client-seitige Button-Sichtbarkeit als Schutz
- **Warum diese:** Defense-in-depth. Client-seitige Checks (Button ausblenden) sind UI-Convenience, kein Sicherheits-Gate. Direkter API-Call wuerde sonst RLS umgehen und API-Key-Kosten verursachen.

### Entscheidung 7: Prompt-Struktur

- **Gewaehlt:** Fester System-Prompt (Rolle + Regeln + Output-Format) + dynamischer User-Prompt (Kundendaten + Typ + Ton + Kontext)
- **System-Prompt:**
  ```
  Du bist ein Vertriebs-Assistent fuer Solarwerk Sued GmbH, einen Anbieter von
  Photovoltaik-Anlagen fuer Gewerbe und Landwirtschaft. Du schreibst professionelle
  Follow-up-E-Mails an Bestandskunden und Interessenten.

  Regeln:
  - Antworte IMMER im folgenden Format, exakt so:
    BETREFF: [passender E-Mail-Betreff]
    ---
    [E-Mail-Body]
  - Beginne den Body mit passender Anrede basierend auf dem gewaehlten Ton
  - Beziehe dich konkret auf vorhandene Kundendaten (Anlagengroesse, letzte Interaktion, Pipeline-Status)
  - Schliesse mit Signatur: [Absender-Name], Solarwerk Sued GmbH
  - Halte den Body zwischen 80-200 Woertern
  - Verwende keine Platzhalter wie [DATUM] oder [NAME] — nutze die echten Daten
  - Schreibe auf Deutsch
  ```
- **User-Prompt Template:**
  ```
  Erstelle eine Follow-up-E-Mail vom Typ "{emailTyp}" im Ton "{ton}".

  Kundendaten:
  - Firma: {firma}
  - Ansprechpartner: {ansprechpartner}
  - Kundenstatus: {kundenStatus}
  - Letzter Kontakt: {letzterKontakt}
  - Notiz: {notiz || "Keine Notiz vorhanden"}

  Pipeline-Eintraege:
  {pipelineEintraege.map(e => `- ${e.status}: ${e.volumen_eur} EUR (Angebot: ${e.angebotsdatum})${e.notiz ? ' — ' + e.notiz : ''}`).join('\n')}

  Absender: {fullName || "Ihr Solarwerk Sued Team"}
  {zusatzKontext ? "Zusaetzlicher Kontext: " + zusatzKontext : ""}
  ```
- **Client-seitiges Parsing:** Response-Text wird am ersten `---` gesplittet. Alles vor dem Separator (nach "BETREFF: ") wird in das Betreff-Input-Feld geschrieben, alles danach in die Body-Textarea. Falls kein `---` gefunden wird: gesamter Text in Body, Betreff-Feld bleibt leer.

---

## Edge Cases

1. **Was passiert bei:** Kunde hat Pipeline-Eintraege, aber `notiz` ist leer
   **Erwartetes Verhalten:** E-Mail wird trotzdem generiert. Prompt zeigt "Keine Notiz vorhanden" — KI bezieht sich dann staerker auf Pipeline-Daten

2. **Was passiert bei:** OpenRouter API gibt 401 (ungueltiger API-Key) oder 429 (Rate Limit) zurueck
   **Erwartetes Verhalten:** Route Handler gibt passenden HTTP-Status zurueck mit Fehlermeldung. Client zeigt "E-Mail-Generierung fehlgeschlagen: [Fehlertext]". Generierungs-Zaehler wird **nicht** dekrementiert.

3. **Was passiert bei:** User klickt "Generieren" waehrend ein Stream noch laeuft
   **Erwartetes Verhalten:** Button ist waehrend Streaming disabled. Kein Doppel-Request moeglich.

4. **Was passiert bei:** Netzwerkverbindung bricht waehrend Streaming ab
   **Erwartetes Verhalten:** Bereits empfangener Text bleibt im Textfeld stehen (editierbar). Fehlermeldung "Verbindung unterbrochen" erscheint. Zaehler wird dekrementiert (Text ist teilweise nutzbar).

5. **Was passiert bei:** `profile.full_name` ist `null` (User hat keinen Namen hinterlegt)
   **Erwartetes Verhalten:** Signatur faellt auf "Ihr Solarwerk Sued Team" zurueck statt personalisiertem Namen.

6. **Was passiert bei:** Freitextfeld enthaelt mehr als 500 Zeichen
   **Erwartetes Verhalten:** Client-seitige Validierung mit Zeichen-Zaehler. `maxLength={500}` auf dem Input. Submit ist nur moeglich wenn <= 500.

7. **Was passiert bei:** User hat `canEdit = false` (Rolle `buchhaltung`)
   **Erwartetes Verhalten:** Button wird nicht angezeigt. Falls API-Endpoint direkt aufgerufen wird: `403 Forbidden`.

8. **Was passiert bei:** `OPENROUTER_API_KEY` ist nicht in `.env.local` gesetzt
   **Erwartetes Verhalten:** Route Handler gibt `500` mit Meldung "KI-Feature nicht konfiguriert. Bitte API-Key hinterlegen." Client zeigt Fehlermeldung.

9. **Was passiert bei:** User nicht eingeloggt und ruft `/api/ai/followup-email` direkt auf
   **Erwartetes Verhalten:** Route Handler gibt `401 Unauthorized` zurueck. Kein Supabase-Query, kein OpenRouter-Call.

10. **Was passiert bei:** KI-Response enthaelt keinen `---` Separator (unerwartetes Format)
    **Erwartetes Verhalten:** Gesamter Text landet im Body-Textarea. Betreff-Feld bleibt leer mit Placeholder "Betreff manuell eingeben".

---

## Akzeptanzkriterien

- [ ] Button "Follow-up E-Mail generieren" erscheint unter Kundenkarte wenn `hasPipelineEintraege === true` und `canEdit === true`
- [ ] Button erscheint NICHT wenn keine Pipeline-Eintraege vorhanden
- [ ] Button erscheint NICHT fuer Rolle `buchhaltung`
- [ ] Klick oeffnet Collapsible Section mit Dropdowns (Typ, Ton) und Freitextfeld
- [ ] Erneuter Klick auf Button klappt Section wieder zu
- [ ] "Generieren"-Button ist disabled bis Typ UND Ton gewaehlt
- [ ] Generierter Text streamt Token fuer Token in Textfelder (Betreff + Body getrennt)
- [ ] Betreff-Feld und Body-Textarea sind nach Abschluss editierbar
- [ ] "In Zwischenablage kopieren" kopiert "Betreff: ...\n\n..." und zeigt "Kopiert!" Feedback
- [ ] Zaehler zeigt verbleibende Generierungen (startet bei 5, dekrementiert nur bei Erfolg)
- [ ] Bei Limit 0: Button disabled mit Hinweistext
- [ ] API-Key wird nie an den Client ausgeliefert (nur in Route Handler)
- [ ] Kundendaten und Pipeline werden serverseitig im Route Handler geladen
- [ ] Route Handler prueft Auth (401 wenn nicht eingeloggt) und Rolle (403 wenn buchhaltung)
- [ ] Route Handler validiert Inputs (emailTyp, ton gegen Allowlist; zusatzKontext max 500)
- [ ] Signatur nutzt `full_name` des eingeloggten Users, Fallback "Ihr Solarwerk Sued Team"
- [ ] Bei API-Fehler: Fehlermeldung sichtbar, Zaehler nicht dekrementiert
- [ ] Doppelklick auf "Generieren" waehrend Streaming unmoeglich (Button disabled)
- [ ] Freitextfeld hat `maxLength={500}` mit sichtbarem Zeichen-Zaehler
- [ ] Wenn KI-Response kein `---` enthaelt: gesamter Text in Body, Betreff leer
- [ ] **Alle Edge Cases aus dem Abschnitt oben sind getestet**

---

## Dateien (geplant)

| Datei | Aenderung |
|---|---|
| `lib/data.ts` | Neue Funktion `getPipelineFuerKunde(kundeId: string): Promise<PipelineEintrag[]>` — filtert Pipeline-Tabelle nach `customer_id`. Zusaetzlich `hatPipelineEintraege(kundeId: string): Promise<boolean>` als leichtgewichtige Variante fuer page.tsx (nur COUNT, keine vollen Daten). |
| `app/kunden/[id]/page.tsx` | Import `hatPipelineEintraege`. Parallel zu `getKunde` + `getCurrentUserProfile` aufrufen. Neues Prop `hasPipelineEintraege` an `KundeDetailClient` weiterreichen. |
| `app/kunden/[id]/kunde-detail-client.tsx` | Neues Prop `hasPipelineEintraege: boolean`. Import + Render von `FollowupEmailClient` wenn `hasPipelineEintraege && canEdit`. |
| `app/kunden/[id]/followup-email-client.tsx` | Neue Client Component. Collapsible Section, Formular (Typ/Ton/Freitext), Streaming-Fetch, Betreff+Body-Felder, Copy-Button, Zaehler. Props: `kundeId: string`. |
| `app/api/ai/followup-email/route.ts` | Neuer Route Handler. Auth-Check, Input-Validierung, Supabase-Queries, Prompt-Bau, OpenRouter-Streaming, Plain-Text-Weiterleitung. |
| `.env.local` | `OPENROUTER_API_KEY=sk-or-v1-...` (bereits vom User gesetzt) |

---

## Nicht im Scope

- Kein E-Mail-Versand (nur Text-Generierung + Kopieren)
- Kein Speichern generierter E-Mails in der Datenbank
- Kein Betreff-Vorschlag-Dropdown (KI generiert Betreff)
- Kein Template-Management (Prompts sind hardcoded)
- Keine Pipeline-Page (existiert ohnehin nicht im Starter)
