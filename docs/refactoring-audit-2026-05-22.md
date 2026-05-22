# Refactoring-Audit — 2026-05-22

Audit der beiden groessten Client-Komponenten:

- `app/dashboard-client.tsx` (257 LOC)
- `app/kunden/[id]/kunde-detail-client.tsx` (364 LOC)

Top 3 Refactoring-Kandidaten, sortiert nach Wichtigkeit. Jede Empfehlung wird anhand der Heuristiken **Wiederholung**, **Wiederverwendbarkeit** und **Groesse** begruendet.

---

## Top 1 — Kunden-StatusBadge

**Empfehlung:** Extrahieren als `components/KundeStatusBadge.tsx`, analog zum bestehenden `components/StatusBadge.tsx` fuer Pipeline-Status.

**Fundstellen:**

- `app/dashboard-client.tsx:226-242` — Inline-JSX in der Tabellenzelle (Status-Pille mit ternaerer Farb- und Label-Logik).
- `app/kunden/[id]/kunde-detail-client.tsx:36-46` — Helper-Funktionen `statusLabel` und `statusClass`; verwendet in `:138-144`.

**Begruendung:**

- **Wiederholung:** Status-Label plus farbige Pille existiert 2x in den Audit-Files mit identischer Farb-/Label-Logik. Pipeline besitzt bereits eine `StatusBadge`-Komponente — fuer Kunden fehlt sie noch, was zu einer asymmetrischen Architektur fuehrt.
- **Wiederverwendbarkeit und Groesse:** Komponente wird in jeder neuen Kunden-Listen- oder Detailansicht wiederverwendbar; pro Stelle ca. 15 LOC eingespart, dazu Single-Source-of-Truth fuer das Farb-Mapping.

---

## Top 2 — DualRangeSlider

**Empfehlung:** Extrahieren als `components/DualRangeSlider.tsx` mit Props `min`, `max`, `value: [number, number]`, `onChange`, `label`, optional `format`.

**Fundstellen:**

- `app/dashboard-client.tsx:147-179` — Anlagengroesse-Range mit zwei `<input type="range">` plus Clamp-Logik via `Math.min`/`Math.max`.
- Cross-Reference (ausserhalb der Audit-Files): `app/pipeline/pipeline-client.tsx` enthaelt zwei weitere Instanzen (kWp- und EUR-Slider) — insgesamt also 3x dupliziert im Projekt.

**Begruendung:**

- **Groesse:** Pro Instanz ca. 30 LOC dichter JSX-Block mit Label-Formatierung und Clamp-Handlern; verstopft die Filterleiste und macht das umgebende Markup unleserlich.
- **Wiederholung und Wiederverwendbarkeit:** Drei nahezu identische Kopien im Projekt liessen sich mit einer Komponente in einem Schnitt aufloesen; jeder neue numerische Bereichsfilter ist danach einzeilig nutzbar.

---

## Top 3 — ConfirmDialog

**Empfehlung:** Extrahieren als `components/ConfirmDialog.tsx` mit Props `open`, `title`, `body`, `confirmLabel`, `onConfirm`, `onCancel`, `loading`, `errorText`.

**Fundstellen:**

- `app/kunden/[id]/kunde-detail-client.tsx:324-360` — Loeschen-Bestaetigungs-Modal mit Backdrop, `role="dialog"`, Abbrechen + Bestaetigungs-Button und Loading-State.
- Cross-Reference: `app/pipeline/[id]/pipeline-detail-client.tsx` enthaelt eine nahezu identische Variante.

**Begruendung:**

- **Groesse:** Ein in sich geschlossener 35-LOC-Block mit eigenem Verantwortungsbereich (Overlay, Fokus-Trap-aehnliche Struktur, Buttons, Status-Text) — gehoert nicht in den Detail-Client.
- **Wiederholung und Wiederverwendbarkeit:** Existiert bereits in zwei Detail-Clients fast wortgleich; eine generische Komponente macht jede zukuenftige destruktive Aktion (Pipeline-Eintrag, Beleg, Filter-Set) per `<ConfirmDialog>` einheitlich.

---

## Nicht in Top 3 — bewusst ausgelassen

- **Edit-Form-Block** (`kunde-detail-client.tsx:158-265`, 87 LOC) — groesster einzelner Lesbarkeits-Block, aber sehr Kunden-spezifisch; niedrige Wiederverwendbarkeit ueber den eigenen Kontext hinaus.
- **Stat-Cards** (`dashboard-client.tsx:85-113`, 3x wiederholt) — nur in einer Datei, geringe LOC pro Karte; Hebel klein.
