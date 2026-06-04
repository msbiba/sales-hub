-- Migration: Create aktivitaeten table for customer interaction tracking
-- Distinct from activity_history (audit log via triggers)

CREATE TABLE IF NOT EXISTS public.aktivitaeten (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kunde_id    uuid NOT NULL REFERENCES public.kunden(id) ON DELETE CASCADE,
  typ         text NOT NULL CHECK (typ IN ('Anruf', 'Termin', 'E-Mail')),
  datum       date NOT NULL,
  notiz       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aktivitaeten_kunde
  ON public.aktivitaeten (kunde_id, datum DESC);

ALTER TABLE public.aktivitaeten ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aktivitaeten lesen" ON public.aktivitaeten
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Aktivitaeten erstellen" ON public.aktivitaeten
  FOR INSERT TO authenticated
  WITH CHECK (true);
