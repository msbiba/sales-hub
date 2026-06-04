-- Seed: aktivitaeten table — 12 records from solarwerk_aktivitaeten.csv
-- Run AFTER migration 20260604_create_aktivitaeten.sql AND seed_kunden.sql
-- Uses firma-based subqueries because kunden.id is UUID (no integer mapping)

TRUNCATE public.aktivitaeten CASCADE;

INSERT INTO public.aktivitaeten (kunde_id, typ, datum, notiz)
VALUES
  ((SELECT id FROM public.kunden WHERE firma = 'Huber Schreinerei GmbH'), 'Anruf', '2026-02-10', 'Erstgespraech zur Erweiterung. Interesse an 25 kWp zusaetzlich.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Huber Schreinerei GmbH'), 'Termin', '2026-02-28', 'Vor-Ort-Termin. Dachflaeche vermessen. Statik unkritisch.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Huber Schreinerei GmbH'), 'E-Mail', '2026-03-12', 'Angebotsentwurf fuer Erweiterung zugesandt. Rueckmeldung offen.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Lechner Praezisionstechnik GmbH'), 'E-Mail', '2026-04-22', 'Zufriedenheit bestaetigt. Thema Speicher-Aufstockung aufgekommen.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Lechner Praezisionstechnik GmbH'), 'Anruf', '2026-05-21', 'Speicher-Aufstockung besprochen. Angebot folgt diese Woche.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Mayrhofer Logistik GmbH'), 'E-Mail', '2026-05-19', 'Eckdaten fuer Halle-2-Erweiterung angefragt.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Hotel Sonnenwinkel'), 'Termin', '2026-01-15', 'Vor-Ort-Gespraech Wellnessbereich. Seitdem kein Kontakt.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Schwarzhuber Hof'), 'Anruf', '2026-02-08', 'Routine-Check. Anlage laeuft einwandfrei.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Gruber Stahlbau GmbH'), 'E-Mail', '2026-04-10', 'Statik-Pruefung angestossen. Angebot in Vorbereitung.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Klinik Am Rosengarten'), 'Anruf', '2026-03-30', 'Notstromfaehigkeit als Anforderung aufgenommen.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Klinik Am Rosengarten'), 'Termin', '2026-04-18', 'Speicher-Dimensionierung besprochen. Angebot in Arbeit.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Kfz-Werkstatt Sedlmeier'), 'Termin', '2026-05-31', 'Konditionen final besprochen. Unterschrift zugesagt.');
