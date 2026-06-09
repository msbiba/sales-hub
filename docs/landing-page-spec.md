# Spec: Landing Page — Solarwerk-Süd (Gewerbe-PV)

> Hochkonvertierende Landing Page für B2B-Photovoltaik in Baden-Württemberg.
> Primärziel: Beratungstermin buchen.

---

## Zweck

Die Landing Page führt mittelständische Gewerbe-Entscheider aus Baden-Württemberg vom ersten Klick (Google Ads / SEO) zur verbindlichen Buchung eines kostenlosen Vor-Ort- oder Online-Beratungstermins. Sie übersetzt drei Trigger — explodierende Stromkosten, Anbietervergleich, Förderdeadlines — in eine sachlich-ingenieurhafte Argumentation, die Solarwerk-Süd messbar gegen überregionale Big Player (Enpal, 1Komma5°, Zolar) und regionale BW-Mitbewerber abgrenzt.

---

## 1. Strategic Brief

### Value Proposition (ein Satz)
**„Festpreis-Photovoltaik für Gewerbedächer in Baden-Württemberg — geplant und montiert von eigenen Ingenieuren, mit 20 Jahren Garantie und Wartung inklusive."**

### Conversion-Ziele
- **Primär:** Beratungstermin buchen (Calendly-Slot, Vor-Ort oder Video)
- **Sekundär (Mikro-Conversions):**
  - Wirtschaftlichkeits-Schnellrechner ausfüllen → E-Mail-Lead
  - Case-Study-PDF („Logistik-Halle Heilbronn, 480 kWp, 7,2 Jahre Amortisation") Download
  - Telefon-Click-to-Call (Mobile)

### Visitor Intent & Awareness
- **Awareness-Level:** warm (Problem klar — Stromkosten/ESG/Förderung — Lösung wird gerade evaluiert)
- **Mentale Frage des Besuchers:** *„Lohnt sich PV für unser Hallendach, und wer setzt das ohne Nachforderungs-Drama um?"*
- **Traffic-Mix:** Google Ads (Keywords: „Photovoltaik Gewerbe BW", „PV Halle Festpreis", „Solaranlage Firmendach Förderung") + SEO (Ratgeber-Funnel)

### Tone → Art-Direction
| Adjektiv | CSS/Design-Implikation |
|---|---|
| **ingenieurhaft** | Technische Diagramme, kWp-/€-/CO₂-Zahlen prominent, Monospace-Akzente für Daten, Grid sichtbar |
| **vertrauenswürdig** | Echte Gesichter (Monteure, Geschäftsführer mit Namen), Klarnamen-Testimonials mit Firma + Standort, keine Stockfoto-Anzugträger |
| **modern** | Großzügiger Whitespace, große Typo, dezente Scroll-Reveals, kein Web-2.0-Schlagschatten-Stock |

---

## 2. Page Architecture

Reihenfolge optimiert für **warm + sachlich-skeptisch** (Mittelstand BW prüft, glaubt nicht).

### Section 1 — Hero
- **Purpose:** Innerhalb 3 Sekunden klarmachen: *für wen, was, warum anders.*
- **Content:**
  - H1: Headline (siehe §3)
  - Subline: 1 Satz, konkret mit Zahl (z. B. „Festpreis, 20 Jahre Garantie, in 8 Wochen am Netz.")
  - Primary CTA: „Kostenlose Dach-Analyse buchen" → Calendly-Modal
  - Sekundär-Link (Text-Link, kein zweiter Button): „Erst rechnen lassen →" zum Rechner
  - Trust-Signal-Leiste direkt unter CTA: „480+ Gewerbeanlagen in BW · TÜV-zertifiziert · Eigene Monteure"
- **Conversion-Rolle:** Klick auf Primär-CTA ODER Scroll-Tiefe ≥ Section 3

### Section 2 — Stakes / Problem
- **Purpose:** Schmerzpunkt sachlich quantifizieren, nicht dramatisieren.
- **Content:** 3-Spalten-Block **bewusst asymmetrisch** (Spalte 1 doppelt breit, Spalten 2+3 kompakt):
  - Spalte 1 (breit): Kurzer Fließtext mit aktueller Industriestrom-Zahl (z. B. „Industriestrom 2026 im Schnitt 27,4 ct/kWh — Tendenz steigend.")
  - Spalte 2: Zahl „+38 %" — „Strompreis Gewerbe seit 2021"
  - Spalte 3: Zahl „31.12.2026" — „Auslauf §6 EEG-Direktvermarktungs-Bonus"
- **Conversion-Rolle:** Dringlichkeit ohne FOMO-Schreierei.

### Section 3 — Solution & Mechanism
- **Purpose:** Wie läuft Projekt ab? Skepsis gegen „die buddeln drei Monate auf meinem Dach" abbauen.
- **Content:** Horizontaler 4-Schritt-Prozess mit Zeitangaben:
  1. **Tag 1–3:** Dach-Analyse vor Ort (Drohne + Statik-Check)
  2. **Tag 4–14:** Festpreis-Angebot + Förder-Antrag (KfW, EEG, BW)
  3. **Woche 4–8:** Montage durch eigene Monteure
  4. **Ab Woche 8:** Netzanschluss + 20 Jahre Wartung
- **Conversion-Rolle:** Reduziert wahrgenommene Komplexität → senkt CTA-Schwelle.

### Section 4 — Social Proof
- **Purpose:** Beweis, nicht Behauptung.
- **Content:** Drei Formate kombiniert:
  - **Metrik-Bar:** „480+ Anlagen · 142 MWp installiert · ⌀ 7,4 Jahre Amortisation" (animierte Counter beim Scroll-In)
  - **2 Case-Study-Cards** (links: Logo + Firma + Standort, rechts: kWp + Amortisation + 1-Zeiler-Zitat von Entscheider mit Klarnamen + Funktion). Beispiel: „Maier Logistik GmbH, Heilbronn · 480 kWp · 7,2 J. ROI · ‚Festpreis hat gehalten, Termin auch.' — Klaus Maier, GF"
  - **Logo-Leiste:** 8–10 Kundenlogos in Graustufe, monochrom, gleiche Höhe (keine bunten Original-Logos = wirkt seriöser)
- **Conversion-Rolle:** Validierung. Direkter Nachbar-Effekt („andere BW-Mittelständler haben es gemacht").

### Section 5 — Features → Benefits
- **Purpose:** USPs (regional + Festpreis + Garantie + Gewerbe-only + eigene Monteure) als **Outcomes**, nicht als Features.
- **Content:** 5 Zeilen, **vertikal gestapelt links-bündig** (KEINE 3-Spalten-Icon-Grid):
  - **Festpreis-Garantie.** „Was im Angebot steht, steht in der Rechnung. Keine Nachforderung, schriftlich."
  - **Eigene Monteure, keine Sub-Unternehmer.** „Sie kennen den Vorarbeiter beim Namen. Wir auch."
  - **20 Jahre Garantie inkl. Wartung.** „Module, Wechselrichter, Montage — eine Garantie, ein Ansprechpartner."
  - **Nur Gewerbe.** „Kein B2C-Nebengeschäft. Wir kennen Statik, Brandschutz und Netzanschluss > 100 kWp."
  - **Regional Süddeutschland.** „Sitz in Stadtbergen bei Augsburg. Servicewagen in 90 Minuten in Bayrisch-Schwaben, Allgäu, Ulm und östliches Baden-Württemberg."
- **Conversion-Rolle:** Differenzierung vs. Enpal/1Komma5°/Zolar.

### Section 6 — Wirtschaftlichkeits-Rechner (Inline-Tool)
- **Purpose:** Selbst-Qualifizierung + Mikro-Conversion.
- **Content:** 3-Feld-Slider:
  - Dachfläche (m²)
  - Jahresstromverbrauch (kWh)
  - Strompreis aktuell (ct/kWh, default 27)
- **Ausgabe live:** geschätzte kWp · jährliche Einsparung € · CO₂-Reduktion t · Amortisation Jahre
- **CTA am Rechner-Ende:** „Detail-Berechnung per Mail erhalten" (E-Mail-Capture) → triggert Sales-Sequenz
- **Conversion-Rolle:** Self-Service-Qualifizierung, senkt Hemmschwelle gegenüber direktem Termin.

### Section 7 — Objection Handler (FAQ)
- **Purpose:** Top-5-Einwände der Zielgruppe vorwegnehmen.
- **Content:** Accordion, links-bündig, keine bunten Icons. Fragen:
  1. *„Was, wenn der Strompreis wieder fällt?"*
  2. *„Wer haftet bei Schäden am Dach während Montage?"*
  3. *„Was passiert nach 20 Jahren mit den Modulen?"*
  4. *„Wir sind Mieter / Erbbaurecht — geht das auch?"*
  5. *„Wie lange dauert Förderantrag und wer macht das?"*
- **Conversion-Rolle:** Zweifel entkräften vor Final-CTA.

### Section 8 — Comparison Table (vs. überregionale Anbieter)
- **Purpose:** Differenzierung visuell festnageln.
- **Content:** Schlanke Tabelle, 4 Zeilen × 3 Spalten (Solarwerk-Süd · Überregionale Plattform-Anbieter · Generalunternehmer):
  - Festpreis-Garantie: ✓ · variabel · ✓ aber teurer
  - Eigene Monteure: ✓ · ✗ (Sub) · gemischt
  - Service in ≤ 90 Min vor Ort: ✓ · ✗ · ✗
  - Spezialisierung Gewerbe > 100 kWp: ✓ · gemischt · ✓
- **Conversion-Rolle:** Letzter rationaler Anker vor CTA.

### Section 9 — Final CTA
- **Purpose:** Reibung minimieren, Angebot reframen.
- **Content:**
  - H2: „30 Minuten. Ihr Dach. Ein ehrlicher Wert."
  - Subline: „Wir analysieren Ihr Hallendach per Drohne und sagen Ihnen, was geht — und was nicht. Kostenlos, unverbindlich, ohne Verkaufs-Theater."
  - Großer Calendly-Embed (inline, nicht Modal — reduziert Klick-Schritt)
  - Risk-Reversal-Badge: „Wenn sich PV bei Ihnen nicht rechnet, sagen wir es Ihnen — schriftlich."
- **Conversion-Rolle:** Hauptkonversion.

### Section 10 — Footer
- Impressum (generisch, kurz — siehe Implementation Notes)
- Datenschutz-Link
- Kontakt (Telefon, E-Mail, Adresse BW)
- Kein Newsletter-Spam-Feld.

---

## 3. Copywriting Directives

### Hero-Headline-Varianten (A/B-fähig)
1. **„Photovoltaik fürs Hallendach. Festpreis. Eigene Monteure. 20 Jahre Garantie."**
   *(Sachlich, drei USPs als Fragment-Reihung — ingenieurhaft.)*
2. **„Ihr Hallendach produziert ab 2026 Strom — oder Sie zahlen weiter 27 Cent."**
   *(Stakes-fokussiert, konkrete Zahl, leicht konfrontativ.)*
3. **„480 Gewerbedächer in BW. Festpreis gehalten. Termin gehalten."**
   *(Proof-first, kürzeste Variante.)*

**Empfehlung Variante 1 als Default.** Variante 2 für Cost-Pressure-Ads, Variante 3 für SEO/Retargeting.

### CTA-Button-Copy
- Primär: **„Kostenlose Dach-Analyse buchen"** (nicht „Termin vereinbaren", nicht „Jetzt starten")
- Sekundär-Link: **„Erst rechnen lassen →"**
- Final-CTA-Button: **„30-Min-Slot wählen"**
- Mobile Click-to-Call: **„07XX XXX XXX — Vertrieb direkt"**

### Tone-Regeln
**Sagen:**
- Konkrete Zahlen (kWp, ct/kWh, Jahre Amortisation, € gespart)
- Klarnamen + Funktion bei Testimonials
- Schriftliche Garantien wörtlich zitieren
- Erste-Person-Plural: „Wir montieren", „Unsere Ingenieure"

**Vermeiden:**
- „Unlock the power of solar" / „Nachhaltige Zukunft" / „Energiewende gestalten"
- Greenwashing-Vokabular („grün", „eco", „klimafreundlich" als Adjektiv-Schmuck)
- „Innovativ", „revolutionär", „smart"
- Konjunktive: „könnte", „würde", „bis zu" (außer mit konkreter Range)
- Ausrufezeichen
- Englische Buzzwords (kein „Solar-as-a-Service")

---

## 4. Visual Design Direction

### Farbpalette
| Token | HEX | Rolle | Rationale |
|---|---|---|---|
| `--ink` | `#0E1116` | Primärtext, Headlines | Kein reines Schwarz — wirkt weicher, ingenieurhaft |
| `--paper` | `#F7F6F2` | Background Haupt | Warmes Off-White, kein bläuliches Tech-Weiß |
| `--steel` | `#2C3E4C` | Sekundärfarbe, Datentabellen, Icons | Industrie-Anthrazit, kein Tech-Blau |
| `--solar` | `#E8A33D` | Akzent (CTA-Hintergrund, Hervorhebung Zahlen) | Gedecktes Sonnen-Ocker statt Greenwashing-Grün — differenziert |
| `--leaf` | `#3D7A5C` | Sparsamer Sekundärakzent (CO₂-Metrik) | Gedeckt, kein Pantone-Grün |
| `--line` | `#D8D4C8` | Borders, Grid-Linien | Sichtbares Grid = ingenieurhaft |

**Bewusst KEIN Verlauf, kein Glow.** CTA = solider `--solar`-Hintergrund mit `--ink`-Text.

### Typography Pairing
- **Display:** [Söhne](https://klim.co.nz/retail-fonts/soehne/) (kommerziell) ODER **Inter Display** (Google Fonts, frei) — geometrisch, modern, vertrauenswürdig
- **Body:** **Inter** (Google Fonts) 17 px Basis, line-height 1.55
- **Mono-Akzent:** **JetBrains Mono** für Zahlen in Datentabellen / Metrik-Bars — verstärkt ingenieurhaften Eindruck
- **Fontshare-Alternative (falls kostenlose Premium-Optik):** [Switzer](https://www.fontshare.com/fonts/switzer) (Display + Body) + JetBrains Mono

### Layout-Rhythm
- 12-Spalten-Grid, max-width 1200 px, äußere Margen 24 px (mobile) / 64 px (desktop)
- **Strukturiert bleiben:** Hero, Prozess (Sec. 3), Vergleichstabelle (Sec. 8), Final-CTA
- **Grid bewusst brechen:** Stakes (Sec. 2, asymmetrisch), Features→Benefits (Sec. 5, links-bündig vertikal statt 3-Spalten), Case-Studies (Sec. 4, alternierende Bildseite)
- **Vertikaler Rhythmus:** 96 px Section-Padding desktop / 64 px mobile, konsequent

### Key Interaction Moments
1. **Metrik-Counter** (Sec. 4): Zahlen zählen beim Scroll-In von 0 hoch (450 ms easing-out), einmalig.
2. **Rechner** (Sec. 6): Live-Berechnung beim Slider-Drag, Ergebnis-Card pulsiert kurz (1 × 200 ms) bei Änderung.
3. **Hover auf Case-Study-Card:** sanftes `translateY(-4px)` + Border `--solar`, keine Schatten-Explosion.
4. **Sticky-Mini-CTA** ab Scroll > 800 px: schmaler Bar oben (`Kostenlose Dach-Analyse buchen →`), entfernbar.
5. **Scroll-Reveals:** dezent, nur Opacity 0→1 + 8 px Translate, KEINE Stagger-Choreografien.

### Mobile-First
- Hero-CTA full-width, Sticky-Bottom-CTA ab Scroll
- Vergleichstabelle (Sec. 8) als horizontal scrollbarer Card-Stack
- Rechner-Slider: native `<input type="range">` mit großen Hit-Targets (≥ 44 px)
- Click-to-Call statt nur Telefon-Anzeige
- Bilder: WebP + LQIP-Blur-Placeholder, max 80 KB above-the-fold

---

## 5. Non-Obvious Recommendations

### Empfehlung 1 — Drohnen-Dach-Vorschau im Hero
**Was:** Eingabefeld unter Hero: „Postleitzahl + Hausnummer eingeben → Wir zeigen Ihr Dach in 24 h per Drohnen-Aufnahme." Lead-Capture via PLZ + E-Mail.
**Warum (Conversion-Rationale):** Aktiviert Neugier-Trigger („wie sieht mein Dach von oben aus?"), liefert Sales-Team qualifizierten Lead inkl. Adresse, differenziert radikal von Generalunternehmern, deren Erst-Kontakt = Formular-Rückruf-Spiel.

### Empfehlung 2 — Live-Förder-Ticker
**Was:** Schmaler Bar oberhalb Footer: *„Aktueller Förder-Stand BW: KfW 270 — 12,3 Mio € verbleibend · §6 EEG endet in 204 Tagen"* — täglich aktualisiert via simplem JSON.
**Warum:** Verstärkt Dringlichkeit ohne Fake-Countdown, untermauert Förder-Service-USP, signalisiert Aktualität (= Vertrauen). Mittelstand BW reagiert auf Förder-Konkretheit, nicht auf Knappheits-Theater.

### Empfehlung 3 (bonus) — Inline-„Was haben Sie auf dem Dach?"-Konfigurator
**Was:** Vor Rechner-Sektion 3 Buttons: „Trapezblech · Bitumen · Ziegel" + „PV bereits teilweise installiert? Ja/Nein". Beeinflusst Rechner-Output (Statik-Hinweise).
**Warum:** Self-Qualifikation, filtert nicht-passende Leads (z. B. Asbest-Dächer), spart Vertrieb-Zeit, signalisiert technische Tiefe.

---

## 6. Implementation Notes

### Tech-Stack
- **Framework:** Next.js 16 App Router (existierender Repo-Stack)
- **Styling:** Tailwind v4 (Tokens als CSS-Vars in `app/globals.css`)
- **Route:** `app/landing/page.tsx` (Server Component) + Client Components nur für Rechner, Counter, Accordion, Sticky-CTA
- **Lead-Capture:** Formulare posten an `app/api/lead/route.ts` → schreibt JSON nach `data/leads.jsonl` (Lehr-Repo-Stil, kein DB-Setup)
- **Calendly:** `<iframe>` Embed, lazy-loaded ab Scroll-Nähe zu Section 9
- **Bilder:** `next/image` mit Stockfotos aus Unsplash (Lizenz-Filter „Free to use"), Suchbegriffe: *„industrial rooftop solar Germany", „warehouse logistics building", „solar engineer hardhat"*. **Hinweis im Code:** TODO-Marker für späteres Replacement durch echte Anlagen-Fotos.

### Performance-Targets
- **LCP < 2.5 s** (Hero-Headline + Hero-Image als priority-Image, kein Hero-Video)
- **CLS < 0.1** (feste Höhen für Counter-Bar und Calendly-Iframe-Wrapper)
- **TBT < 200 ms** (Rechner-Logik lazy, Calendly nur on-demand)
- **Bundle:** Client-JS < 90 KB gz (Tailwind purged, lucide-react tree-shaken)

### Brand-Assets-Vorschlag (mangels Originalen)
- **Logo-Vorschlag:** Wortmarke „solarwerk·süd" — Switzer Semibold, `--ink`, kleiner `--solar`-Punkt zwischen „werk" und „süd". SVG inline in `app/landing/_components/logo.tsx`.
- **Favicon:** 32 × 32 SVG, gleicher Punkt als Mark
- **OG-Image:** 1200 × 630, Headline-Variante 1 auf `--paper`-BG mit Hallendach-Stockfoto rechts angeschnitten

### Generischer Impressum-Stub
Datei `app/impressum/page.tsx`:
```
Solarwerk-Süd GmbH
Musterstraße 1, 70173 Stuttgart
Geschäftsführer: [Name]
Handelsregister: HRB [Nummer], Amtsgericht Stuttgart
USt-IdNr.: DE[Nummer]
Kontakt: kontakt@solarwerk-sued.de · 0711 XXX XXX
```
Mit klarem `TODO:`-Kommentar — vor Go-Live durch echte Daten zu ersetzen.

### Generischer Cookie-Banner
- Eigene minimale Implementation, **kein** Drittanbieter-SDK für Lehr-Setup
- Three-State: „Alle akzeptieren · Nur essenziell · Einstellungen"
- Speichert Consent in `localStorage` unter `sw-cookie-consent` (Wert: `essential` | `all`)
- Calendly + Google-Analytics-Tags laden nur bei `all`
- Komponente: `app/_components/cookie-banner.tsx` (Client), eingebunden in `app/layout.tsx`

### A/B-Test-Hypothesen (erste Iteration)
1. **H1:** Hero-Variante 2 („…oder Sie zahlen weiter 27 Cent.") schlägt Variante 1 bei kalten Google-Ads-Klicks um ≥ 15 % CTR auf Primär-CTA.
2. **H2:** Inline-Calendly in Section 9 schlägt Modal-Calendly um ≥ 20 % Termin-Buchungen, da ein Klick-Schritt entfällt.
3. **H3:** Drohnen-Dach-Vorschau im Hero (statt Trust-Signal-Leiste) erhöht Gesamt-Lead-Rate um ≥ 30 %, senkt aber Termin-Konversion-Rate — Net positiv bei Lead-Wert > 80 €.

---

## Inputs

- PLZ + optionale Hausnummer (Drohnen-Vorschau-Lead-Form, Hero)
- Dachfläche m² · Jahresverbrauch kWh · aktueller Strompreis ct/kWh (Rechner, Sec. 6)
- E-Mail (Mikro-Conversion am Rechner-Ende)
- Calendly-Slot-Auswahl (Sec. 9, externer Service)
- Bestehende Repo-Daten unverändert (`data/solarwerk_kunden.csv`, `data/solarwerk_pipeline.csv` werden NICHT auf Landing Page genutzt — separater Sales-Hub-Bereich)

---

## Verhalten

1. Besucher landet via Google Ads / SEO auf `/landing`
2. Hero rendert SSR mit Headline + CTA + Trust-Signal — LCP-Image ist Hallendach-Stockfoto
3. Scroll triggert dezente Reveal-Animationen ab Section 2
4. Bei Scroll > 800 px erscheint Sticky-Mini-CTA oben
5. Counter-Bar (Sec. 4) startet Animation einmalig bei Intersection-Observer-Trigger
6. Rechner (Sec. 6) berechnet bei jedem Slider-Change client-seitig; E-Mail-Submit postet an `/api/lead`
7. FAQ-Accordion (Sec. 7) öffnet/schließt einzeln (keine Multi-Open)
8. Calendly-Iframe (Sec. 9) lädt erst bei Annäherung (rootMargin 400 px) — Performance
9. Cookie-Banner überlagert Page beim ersten Besuch; Auswahl persistiert `localStorage`
10. Bei Buchung → Calendly-Confirmation-Page (extern), keine eigene Thank-You-Route nötig

---

## Architektur-Entscheidungen

### Entscheidung 1: Landing Page als eigene Route `/landing`, nicht als `/`
- **Gewählt:** Neue Route `app/landing/page.tsx`, bestehender Sales-Hub bleibt auf `/`
- **Alternative wäre:** Landing Page als neue Root, Sales-Hub nach `/app` verschieben
- **Warum diese:** Lehr-Repo behält bewusste pädagogische Struktur (Sales-Hub auf `/`). Landing Page ist eigenständiger Funnel-Eingang mit anderer Zielgruppe (Prospects vs. Sales-Team) — Trennung ist semantisch sauber.

### Entscheidung 2: Rechner client-seitig, Lead-Persistenz JSONL
- **Gewählt:** Rechner als Client Component mit reiner Math-Formel, Lead-Submit an `/api/lead` schreibt JSONL in `data/leads.jsonl`
- **Alternative wäre:** Server-Action mit DB (SQLite/Postgres)
- **Warum diese:** Konsistent mit Lehr-Repo-Stil (CSV als Datenspeicher, kein DB-Overhead). JSONL ist append-only, idiotensicher, exportierbar. Rechner-Berechnung braucht keine Server-Roundtrip → Latenz ≈ 0.

### Entscheidung 3: Cookie-Banner Eigenbau statt SaaS (Cookiebot/Usercentrics)
- **Gewählt:** Minimaler eigener Banner, Consent in `localStorage`
- **Alternative wäre:** Cookiebot-Embed
- **Warum diese:** Lehr-Repo, generischer Stub. SaaS-Banner ist ~80 KB JS, blockt Render, kostet Geld. Eigenbau passt zum Mittelstand-Tone („wir machen es selbst") und ist DSGVO-konform solange nur essenzielle Cookies default.

---

## Edge Cases

1. **Was passiert bei:** Rechner-Submit mit Dachfläche „0" oder leerem Verbrauchsfeld
   **Erwartetes Verhalten:** Inline-Fehler unter dem Feld („Bitte ≥ 50 m² angeben"), CTA-Button bleibt deaktiviert, keine API-Anfrage abgesetzt.
2. **Was passiert bei:** Besucher öffnet `/landing` mit JavaScript deaktiviert
   **Erwartetes Verhalten:** Hero, alle Statik-Sections (1–5, 7, 8, 10) bleiben voll lesbar (SSR). Rechner zeigt Fallback-Text „Rechner benötigt JavaScript — alternativ buchen Sie direkt einen Termin: [Link]". Calendly-Iframe wird durch `<noscript>` mit Telefonnummer ersetzt.
3. **Was passiert bei:** Drohnen-Vorschau-Form abgesendet mit ungültiger PLZ (z. B. „12345" außerhalb BW)
   **Erwartetes Verhalten:** Sofort-Validierung gegen BW-PLZ-Range (70000–79999, 88000–88999, etc.). Bei Fehlschlag: Hinweis „Wir bedienen aktuell nur Baden-Württemberg. Trotzdem Kontakt aufnehmen?" mit Link zum Telefon.
4. **Was passiert bei:** Cookie-Banner-Klick „Nur essenziell" + späterer Versuch, Calendly zu öffnen
   **Erwartetes Verhalten:** Calendly-Iframe-Slot zeigt Placeholder „Bitte Marketing-Cookies erlauben, um Termin zu buchen — oder rufen Sie an: 0711 XXX". Re-Consent-Link direkt im Placeholder.
5. **Was passiert bei:** Mobile-Viewport < 360 px (alte Geräte)
   **Erwartetes Verhalten:** Layout bleibt nutzbar (Single-Column, Schriftgrößen min. 15 px), Vergleichstabelle (Sec. 8) wird zu Card-Stack, kein horizontaler Body-Scroll.

---

## Akzeptanzkriterien

- [ ] Route `/landing` rendert SSR ohne JS-Fehler in Konsole
- [ ] LCP < 2.5 s auf throttled Fast 3G (Chrome DevTools)
- [ ] CLS < 0.1 (gemessen mit Lighthouse)
- [ ] Primär-CTA „Kostenlose Dach-Analyse buchen" öffnet Calendly-Modal/Embed
- [ ] Rechner berechnet plausible Werte (Dachfläche 1000 m² · 200.000 kWh · 27 ct → Amortisation 6–9 Jahre Range)
- [ ] Rechner-E-Mail-Submit schreibt Eintrag in `data/leads.jsonl`
- [ ] FAQ-Accordion öffnet/schließt korrekt, max. 1 offen gleichzeitig
- [ ] Sticky-Mini-CTA erscheint ab Scroll > 800 px, verschwindbar via Close-Button
- [ ] Metrik-Counter animieren einmalig bei Intersection
- [ ] Vergleichstabelle (Sec. 8) ist auf Mobile als Card-Stack lesbar
- [ ] Cookie-Banner erscheint beim ersten Besuch, Auswahl persistiert über Reload
- [ ] Calendly lädt nur bei Consent = `all` ODER bei direktem User-Klick auf CTA
- [ ] Impressum-Route `/impressum` erreichbar mit Platzhalter-Daten + TODO-Kommentar
- [ ] Hero-Headline ist als A/B-Variante via Env-Var oder URL-Param schaltbar
- [ ] Lighthouse SEO-Score ≥ 95
- [ ] Lighthouse Accessibility-Score ≥ 95 (Kontraste, ARIA für Accordion, alt-Texte)
- [ ] **Alle Edge Cases aus dem Abschnitt oben sind getestet**
