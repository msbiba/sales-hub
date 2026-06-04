-- Seed: pipeline table — 12 records from solarwerk_pipeline.csv (cleaned, IDs 1-12)
-- Run AFTER seed_kunden.sql (kunden must exist for FK resolution)
-- Step 1: Insert 12 Lead-Kunden (Pipeline-Firmen die nicht in seed_kunden.sql sind)
-- Step 2: Insert 12 Pipeline-Eintraege
--
-- IMPORTANT: After running, assign bearbeiter_id on BOTH kunden (lead) AND pipeline records.
-- Without bearbeiter_id, RLS-filtered users (role=bearbeiter) will see NO records.

-- 1. Pipeline-Lead-Kunden anlegen (mit neuen Spalten)
INSERT INTO public.kunden (firma, ansprechpartner, branche, anlagengroesse_kwp, status, letzter_kontakt, telefon, email, notiz, pipeline_stufe, vertriebler, produkt_interesse)
VALUES
  ('Druckhaus Lindauer', 'Martin Lindauer', 'Industrie', 95, 'aktiv', '2026-04-20', NULL, NULL, 'Lead aus Pipeline. Anfrage ueber Website.', 'Lead', 'Tobias Frank', 'Solar fuer KMU'),
  ('Obsthof Berger', 'Claudia Berger', 'Landwirtschaft', 130, 'aktiv', '2026-04-15', NULL, NULL, 'Lead aus Pipeline. Kuehlhalle fuer Obstlagerung.', 'Angebot', 'Klara Berger', 'Solar fuer Landwirtschaft'),
  ('Sporthotel Weitblick', 'Juergen Hintermeier', 'Gewerbe', 180, 'aktiv', '2026-03-28', NULL, NULL, 'Lead aus Pipeline. Foerderberatung laeuft.', 'Angebot', 'Tobias Frank', 'Solar Plus'),
  ('Baeckerei Kronenbrot', 'Stefanie Kronenberger', 'Handwerk', 42, 'aktiv', '2026-04-02', NULL, NULL, 'Lead aus Pipeline. Backstube und Laden.', 'Angebot', 'Klara Berger', 'Solar fuer KMU'),
  ('Metallwerk Donau GmbH', 'Karl-Heinz Riedl', 'Industrie', 350, 'aktiv', '2026-03-10', NULL, NULL, 'Lead aus Pipeline. Foerderzusage erwartet.', 'Verhandlung', 'Tobias Frank', 'Solar Plus'),
  ('Weingut Am Sonnenberg', 'Elisabeth Frey', 'Landwirtschaft', 75, 'aktiv', '2026-04-08', NULL, NULL, 'Lead aus Pipeline. Interesse an Agri-PV.', 'Lead', 'Klara Berger', 'Solar fuer Landwirtschaft'),
  ('Fitnessstudio PowerZone', 'Timo Albrecht', 'Gewerbe', 60, 'aktiv', '2026-04-25', NULL, NULL, 'Lead aus Pipeline. Hohe Klimaanlage-Kosten.', 'Angebot', 'Tobias Frank', 'Solar fuer KMU'),
  ('Weber Maschinenbau AG', 'Iris Weber', 'Industrie', 480, 'aktiv', '2026-02-14', NULL, NULL, 'Lead aus Pipeline. Grossauftrag in Klaerung.', 'Verhandlung', 'Klara Berger', 'Solar Plus'),
  ('Blumengrossmarkt Suedwest', 'Gerhard Pfaff', 'Gewerbe', 110, 'aktiv', '2026-05-02', NULL, NULL, 'Lead aus Pipeline. Halle mit Kuehlzellen.', 'Lead', 'Tobias Frank', 'Solar fuer KMU'),
  ('Tischlerei Seefeld', 'Monika Seefeld', 'Handwerk', 35, 'aktiv', '2026-04-30', NULL, NULL, 'Lead aus Pipeline. Budget knapp, Foerderpruefung.', 'Lead', 'Klara Berger', 'Solar fuer KMU'),
  ('Kaeserei Allgaeuer Gold', 'Anton Schmid', 'Landwirtschaft', 200, 'aktiv', '2026-03-20', NULL, NULL, 'Lead aus Pipeline. Kaesereifung-Kuehlung.', 'Angebot', 'Tobias Frank', 'Solar fuer Landwirtschaft'),
  ('Stadtwerke Mering', 'Dr. Ulrich Fink', 'Gewerbe', 650, 'aktiv', '2026-01-18', NULL, NULL, 'Lead aus Pipeline. Groesstes Projekt Q3 2026.', 'Gewonnen', 'Klara Berger', 'Solar Plus');

-- 2. Pipeline-Eintraege (FK via firma-Subquery)
TRUNCATE public.pipeline CASCADE;

INSERT INTO public.pipeline (customer_id, firma, volumen_eur, angebotsdatum, status, notiz)
VALUES
  ((SELECT id FROM public.kunden WHERE firma = 'Druckhaus Lindauer'), 'Druckhaus Lindauer', 89000, '2026-04-20', 'erstkontakt', 'Anfrage ueber Website. Termin fuer Erstgespraech am 15.05.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Obsthof Berger'), 'Obsthof Berger', 124000, '2026-04-15', 'angebot_raus', 'Kuehlhalle fuer Obstlagerung. Hoher Sommerverbrauch.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Sporthotel Weitblick'), 'Sporthotel Weitblick', 168000, '2026-03-28', 'angebot_raus', 'Angebot versendet. Foerderberatung laeuft parallel.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Baeckerei Kronenbrot'), 'Baeckerei Kronenbrot', 38500, '2026-04-02', 'angebot_raus', 'Angebot fuer Backstube und Laden. Dachstatik geprueft.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Metallwerk Donau GmbH'), 'Metallwerk Donau GmbH', 298000, '2026-03-10', 'verhandlung', 'Verhandlung ueber Zahlungskonditionen. Foerderzusage erwartet.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Weingut Am Sonnenberg'), 'Weingut Am Sonnenberg', 68000, '2026-04-08', 'erstkontakt', 'Interesse an Agri-PV. Erste Begehung geplant.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Fitnessstudio PowerZone'), 'Fitnessstudio PowerZone', 54500, '2026-04-25', 'angebot_raus', 'Klimaanlage verursacht hohe Kosten. PV soll entlasten.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Weber Maschinenbau AG'), 'Weber Maschinenbau AG', 415000, '2026-02-14', 'verhandlung', 'Grossauftrag. Technische Klaerung Netzanschluss laeuft.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Blumengrossmarkt Suedwest'), 'Blumengrossmarkt Suedwest', 98000, '2026-05-02', 'erstkontakt', 'Halle mit Kuehlzellen. Stromkosten ueber 80.000 EUR p.a.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Tischlerei Seefeld'), 'Tischlerei Seefeld', 32000, '2026-04-30', 'erstkontakt', 'Kleine Werkstatt. Budget knapp. Foerderprogramme pruefen.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Kaeserei Allgaeuer Gold'), 'Kaeserei Allgaeuer Gold', 185000, '2026-03-20', 'angebot_raus', 'Kaesereifung braucht konstante Kuehlung. Speicher im Angebot.'),
  ((SELECT id FROM public.kunden WHERE firma = 'Stadtwerke Mering'), 'Stadtwerke Mering', 580000, '2026-01-18', 'gewonnen', 'Zuschlag erteilt. Projektstart Q3 2026. Groesstes Pipeline-Projekt.');
