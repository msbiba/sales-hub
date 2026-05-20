# Spec: "Kunde anlegen" – Button-Submit implementieren

## Zweck

Formular "Neuen Kunden anlegen" ist visuell vorhanden, aber Button "Kunde anlegen"
hat keine Funktion. Ziel: Klick speichert Kundendaten in solarwerk_kunden.csv
via POST-API-Route und gibt dem Nutzer klares Feedback.

---

## Persistenz

Daten werden per POST an `/api/kunden` gesendet. Die API hängt den neuen Datensatz
an `data/solarwerk_kunden.csv` an. Kein externes System, keine Datenbank —
CSV bleibt die einzige Datenquelle, konsistent mit der bestehenden Architektur.

---

## Pflichtfelder

| Feld               | Pflicht | Typ    | Validierung                        |
|--------------------|---------|--------|------------------------------------|
| Firma              | ✅ ja   | String | Nicht leer                         |
| Ansprechpartner    | ❌ nein | String | –                                  |
| Branche            | ❌ nein | String | –                                  |
| Anlagengroesse kWp | ❌ nein | Number | Wenn ausgefüllt: muss Zahl sein    |
| Status             | ❌ nein | Enum   | Siehe Optionen unten               |
| Telefon            | ❌ nein | String | –                                  |
| E-Mail             | ❌ nein | String | Wenn ausgefüllt: gültiges Format   |
| Notiz              | ❌ nein | String | –                                  |

### Status-Optionen (Dropdown)

Werte aus bestehender CSV übernehmen:
`Neu`, `In Verhandlung`, `Angebot gesendet`, `Gewonnen`, `Verloren`, `Beschwerde`

---

## Verhalten nach Klick auf "Kunde anlegen"

1. Client-Validierung läuft:
   - Firma leer → Fehler direkt am Feld, kein Submit
   - kWp-Feld ausgefüllt aber nicht numerisch → Fehler direkt am Feld, kein Submit
   - E-Mail ausgefüllt aber ungültiges Format → Fehler direkt am Feld, kein Submit
2. Button wird deaktiviert, Text wechselt zu "Wird gespeichert…"
3. POST `/api/kunden` mit Formulardaten als JSON
4. **Erfolg:** Formular wird zurückgesetzt, Erfolgsmeldung erscheint ("Kunde wurde angelegt."),
   nach 2 Sekunden Redirect zu `/kunden`
5. **Fehler:** Button wird wieder aktiv, Fehlermeldung erscheint im UI,
   Eingaben bleiben erhalten

---

## Edge Cases

| Situation                              | Erwartetes Verhalten                                                                 |
|----------------------------------------|--------------------------------------------------------------------------------------|
| Formular komplett leer absenden        | Kein Submit. Firma-Feld rot markiert: "Firmenname ist erforderlich"                 |
| Buchstaben im kWp-Feld                 | Kein Submit. Feld zeigt: "Bitte eine gültige Zahl eingeben"                         |
| Ungültige E-Mail (z.B. `abc@`)         | Kein Submit. Feld zeigt: "Bitte eine gültige E-Mail-Adresse eingeben"               |
| Serververbindung bricht ab / Timeout   | Nach 10s Timeout: "Speichern fehlgeschlagen, bitte erneut versuchen." Formular bleibt befüllt, Button wieder aktiv |
| Doppelklick auf Button                 | Zweiter Klick ignoriert (Button disabled während Submit)                            |

---

## Akzeptanzkriterien

Alle Punkte müssen live im Browser testbar sein:

- [ ] Gültige Eingaben speichern Kunden — Datensatz erscheint danach unter `/kunden`
- [ ] Nach Erfolg: Formular geleert, Meldung "Kunde wurde angelegt.", Redirect zu `/kunden`
- [ ] Button disabled + Text "Wird gespeichert…" während POST läuft
- [ ] Leere Firma verhindert Submit mit sichtbarem Feldhinweis
- [ ] Buchstaben in kWp verhindern Submit mit sichtbarem Feldhinweis
- [ ] Ungültige E-Mail verhindert Submit mit sichtbarem Feldhinweis
- [ ] Serverfehler: Formular bleibt befüllt, Fehlermeldung erscheint, Button aktiv
- [ ] `data/solarwerk_kunden.csv` enthält nach erfolgreichem Submit neue Zeile

---

## Architektur-Entscheidungen

### Persistenz: CSV-Append via API Route
Neue Route `app/api/kunden/route.ts` (POST). Liest CSV, generiert neue ID
(max + 1), setzt `letzter_kontakt` = heute, hängt Zeile an. Kein neues
Datenbank-System — CSV bleibt Single Source of Truth.

### Scope: Alles in einem Schritt
Validierung, Fehlerfälle und Erfolgsfluss werden gemeinsam implementiert,
weil die Akzeptanzkriterien alle Fälle abdecken müssen. Kein sinnvoller
Teilschnitt möglich ohne halbfertige UX.
