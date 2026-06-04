-- Migration: Add pipeline_stufe, vertriebler, produkt_interesse to kunden
-- Also: extend status CHECK to include 'interessent', relax anlagengroesse_kwp to >= 0

-- 1. Drop and recreate CHECK constraints
ALTER TABLE public.kunden DROP CONSTRAINT IF EXISTS kunden_status_check;
ALTER TABLE public.kunden ADD CONSTRAINT kunden_status_check
  CHECK (status IN ('aktiv', 'in_wartung', 'beschwerde', 'interessent'));

ALTER TABLE public.kunden DROP CONSTRAINT IF EXISTS kunden_anlagengroesse_kwp_check;
ALTER TABLE public.kunden ADD CONSTRAINT kunden_anlagengroesse_kwp_check
  CHECK (anlagengroesse_kwp >= 0);

-- 2. Add new columns (nullable)
ALTER TABLE public.kunden ADD COLUMN IF NOT EXISTS pipeline_stufe text;
ALTER TABLE public.kunden ADD COLUMN IF NOT EXISTS vertriebler text;
ALTER TABLE public.kunden ADD COLUMN IF NOT EXISTS produkt_interesse text;

-- 3. Create index on pipeline_stufe for filtering
CREATE INDEX IF NOT EXISTS idx_kunden_pipeline_stufe ON public.kunden(pipeline_stufe);
