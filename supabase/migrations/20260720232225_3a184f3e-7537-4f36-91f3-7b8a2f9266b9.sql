ALTER TABLE public.pilots
  ADD COLUMN IF NOT EXISTS latitude numeric,
  ADD COLUMN IF NOT EXISTS longitude numeric,
  ADD COLUMN IF NOT EXISTS v2x_type text[],
  ADD COLUMN IF NOT EXISTS investment_usd numeric,
  ADD COLUMN IF NOT EXISTS evidence_uids text[],
  ADD COLUMN IF NOT EXISTS failure_mode_count integer,
  ADD COLUMN IF NOT EXISTS gap_categories text[];

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='pilots' AND policyname='Pilots are viewable by everyone') THEN
    CREATE POLICY "Pilots are viewable by everyone" ON public.pilots FOR SELECT USING (true);
  END IF;
END$$;

GRANT SELECT ON public.pilots TO anon;
GRANT SELECT ON public.pilots TO authenticated;
GRANT ALL ON public.pilots TO service_role;