
-- ============================================================================
-- TechScope evidence-grounded schema
-- ============================================================================

-- Profiles: technology profile config
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  aliases TEXT[] NOT NULL DEFAULT '{}',
  queries JSONB NOT NULL DEFAULT '{}'::jsonb,
  standards_watchlist TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles write" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Taxonomy nodes
CREATE TABLE public.taxonomy_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_slug TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  parent_tag_id TEXT,
  name TEXT NOT NULL,
  aliases TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (profile_slug, tag_id)
);
GRANT SELECT ON public.taxonomy_nodes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.taxonomy_nodes TO authenticated;
GRANT ALL ON public.taxonomy_nodes TO service_role;
ALTER TABLE public.taxonomy_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tax read" ON public.taxonomy_nodes FOR SELECT USING (true);
CREATE POLICY "tax write" ON public.taxonomy_nodes FOR ALL USING (true) WITH CHECK (true);

-- Documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL CHECK (source IN ('openalex','lens_scholar','lens_patent','gdelt')),
  doc_type TEXT NOT NULL CHECK (doc_type IN ('publication','patent_application','patent_grant','news')),
  title TEXT NOT NULL,
  abstract TEXT,
  year INTEGER,
  date DATE,
  url TEXT,
  doi TEXT,
  lens_id TEXT,
  orgs TEXT[] NOT NULL DEFAULT '{}',
  countries TEXT[] NOT NULL DEFAULT '{}',
  citations INTEGER,
  taxonomy_tags TEXT[] NOT NULL DEFAULT '{}',
  standards_mentions TEXT[] NOT NULL DEFAULT '{}',
  raw JSONB,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_documents_source ON public.documents(source);
CREATE INDEX idx_documents_doc_type ON public.documents(doc_type);
CREATE INDEX idx_documents_year ON public.documents(year);
CREATE INDEX idx_documents_doi ON public.documents(doi);
CREATE INDEX idx_documents_lens_id ON public.documents(lens_id);
GRANT SELECT ON public.documents TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "docs read" ON public.documents FOR SELECT USING (true);
CREATE POLICY "docs write" ON public.documents FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Organizations
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('Pure Player','Traditional OEM','Technology & Component Supplier','Infrastructure & IP Provider','Unclassified')),
  confidence NUMERIC(3,2) CHECK (confidence BETWEEN 0 AND 1),
  evidence_uids TEXT[] NOT NULL DEFAULT '{}',
  patent_families_count INTEGER NOT NULL DEFAULT 0,
  publication_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_organizations_role ON public.organizations(role);
GRANT SELECT ON public.organizations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org read" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "org write" ON public.organizations FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER organizations_updated_at BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Pilots
CREATE TABLE public.pilots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  country TEXT,
  partners TEXT[] NOT NULL DEFAULT '{}',
  power_kw NUMERIC,
  fleet_size INTEGER,
  status TEXT CHECK (status IN ('active','completed','planned','proposed')),
  start_date DATE,
  end_date DATE,
  evidence_uid TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_pilots_country ON public.pilots(country);
CREATE INDEX idx_pilots_status ON public.pilots(status);
GRANT SELECT ON public.pilots TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pilots TO authenticated;
GRANT ALL ON public.pilots TO service_role;
ALTER TABLE public.pilots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pilots read" ON public.pilots FOR SELECT USING (true);
CREATE POLICY "pilots write" ON public.pilots FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER pilots_updated_at BEFORE UPDATE ON public.pilots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Standards mentions
CREATE TABLE public.standards_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_id TEXT NOT NULL,
  standard_name TEXT,
  status TEXT CHECK (status IN ('published','draft','under development')),
  document_uid TEXT NOT NULL,
  mention_context TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (standard_id, document_uid)
);
CREATE INDEX idx_std_document ON public.standards_mentions(document_uid);
GRANT SELECT ON public.standards_mentions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.standards_mentions TO authenticated;
GRANT ALL ON public.standards_mentions TO service_role;
ALTER TABLE public.standards_mentions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "std read" ON public.standards_mentions FOR SELECT USING (true);
CREATE POLICY "std write" ON public.standards_mentions FOR ALL USING (true) WITH CHECK (true);

-- Quantitative claims
CREATE TABLE public.quantitative_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  context TEXT,
  document_uid TEXT NOT NULL,
  confidence TEXT NOT NULL DEFAULT 'medium' CHECK (confidence IN ('high','medium','low')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_qc_metric ON public.quantitative_claims(metric);
CREATE INDEX idx_qc_document ON public.quantitative_claims(document_uid);
GRANT SELECT ON public.quantitative_claims TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quantitative_claims TO authenticated;
GRANT ALL ON public.quantitative_claims TO service_role;
ALTER TABLE public.quantitative_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qc read" ON public.quantitative_claims FOR SELECT USING (true);
CREATE POLICY "qc write" ON public.quantitative_claims FOR ALL USING (true) WITH CHECK (true);

-- Taxonomy tags mapping
CREATE TABLE public.taxonomy_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_uid TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  tag_name TEXT,
  confidence NUMERIC(3,2) CHECK (confidence BETWEEN 0 AND 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (document_uid, tag_id)
);
CREATE INDEX idx_tt_tag ON public.taxonomy_tags(tag_id);
GRANT SELECT ON public.taxonomy_tags TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.taxonomy_tags TO authenticated;
GRANT ALL ON public.taxonomy_tags TO service_role;
ALTER TABLE public.taxonomy_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tt read" ON public.taxonomy_tags FOR SELECT USING (true);
CREATE POLICY "tt write" ON public.taxonomy_tags FOR ALL USING (true) WITH CHECK (true);

-- Maturity scores
CREATE TABLE public.maturity_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id TEXT NOT NULL UNIQUE,
  tag_name TEXT,
  patent_maturity_level TEXT CHECK (patent_maturity_level IN ('Saturated','Mature','Growth','Emerging')),
  patent_family_count INTEGER NOT NULL DEFAULT 0,
  standardization_maturity_level TEXT CHECK (standardization_maturity_level IN ('High','Medium','Low')),
  standards_evidence_count INTEGER NOT NULL DEFAULT 0,
  evidence_document_count INTEGER NOT NULL DEFAULT 0,
  evidence_uids TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.maturity_scores TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.maturity_scores TO authenticated;
GRANT ALL ON public.maturity_scores TO service_role;
ALTER TABLE public.maturity_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ms read" ON public.maturity_scores FOR SELECT USING (true);
CREATE POLICY "ms write" ON public.maturity_scores FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER maturity_scores_updated_at BEFORE UPDATE ON public.maturity_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Diffusion series
CREATE TABLE public.diffusion_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_type TEXT NOT NULL CHECK (series_type IN ('filed_patents','granted_patents','publications','news_volume')),
  year INTEGER NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (series_type, year)
);
GRANT SELECT ON public.diffusion_series TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diffusion_series TO authenticated;
GRANT ALL ON public.diffusion_series TO service_role;
ALTER TABLE public.diffusion_series ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ds read" ON public.diffusion_series FOR SELECT USING (true);
CREATE POLICY "ds write" ON public.diffusion_series FOR ALL USING (true) WITH CHECK (true);

-- Generated sections
CREATE TABLE public.generated_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT NOT NULL,
  content_type TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  evidence_uids TEXT[] NOT NULL DEFAULT '{}',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_gs_section ON public.generated_sections(section_name);
GRANT SELECT ON public.generated_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.generated_sections TO authenticated;
GRANT ALL ON public.generated_sections TO service_role;
ALTER TABLE public.generated_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gs read" ON public.generated_sections FOR SELECT USING (true);
CREATE POLICY "gs write" ON public.generated_sections FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER generated_sections_updated_at BEFORE UPDATE ON public.generated_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Corpus manifest
CREATE TABLE public.corpus_manifest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  document_uids TEXT[] NOT NULL,
  source_breakdown JSONB,
  doc_type_breakdown JSONB,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.corpus_manifest TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.corpus_manifest TO authenticated;
GRANT ALL ON public.corpus_manifest TO service_role;
ALTER TABLE public.corpus_manifest ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cm read" ON public.corpus_manifest FOR SELECT USING (true);
CREATE POLICY "cm write" ON public.corpus_manifest FOR ALL USING (true) WITH CHECK (true);

-- QA log
CREATE TABLE public.qa_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  level TEXT CHECK (level IN ('info','warning','error')),
  category TEXT,
  section TEXT,
  message TEXT NOT NULL,
  details JSONB
);
CREATE INDEX idx_qa_ts ON public.qa_log(ts DESC);
CREATE INDEX idx_qa_category ON public.qa_log(category);
GRANT SELECT ON public.qa_log TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.qa_log TO authenticated;
GRANT ALL ON public.qa_log TO service_role;
ALTER TABLE public.qa_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "qa read" ON public.qa_log FOR SELECT USING (true);
CREATE POLICY "qa write" ON public.qa_log FOR ALL USING (true) WITH CHECK (true);
