-- Create the updated_at function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create storage bucket for data source files
INSERT INTO storage.buckets (id, name, public)
VALUES ('data-sources', 'data-sources', false);

-- Policy for uploads
CREATE POLICY "Allow uploads to data-sources"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'data-sources');

-- Policy for reads
CREATE POLICY "Allow reads from data-sources"
ON storage.objects FOR SELECT
USING (bucket_id = 'data-sources');

-- Policy for deletes
CREATE POLICY "Allow deletes from data-sources"
ON storage.objects FOR DELETE
USING (bucket_id = 'data-sources');

-- Data sources table
CREATE TABLE public.data_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  source_type TEXT NOT NULL,
  url TEXT,
  file_path TEXT,
  file_name TEXT,
  author TEXT,
  source_date TEXT,
  tags TEXT[] DEFAULT '{}',
  content TEXT,
  content_summary TEXT,
  is_processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;

-- Allow all operations
CREATE POLICY "Allow all read access to data_sources"
ON public.data_sources FOR SELECT USING (true);

CREATE POLICY "Allow all insert access to data_sources"
ON public.data_sources FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update access to data_sources"
ON public.data_sources FOR UPDATE USING (true);

CREATE POLICY "Allow all delete access to data_sources"
ON public.data_sources FOR DELETE USING (true);

-- Generated content table
CREATE TABLE public.generated_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  source_ids UUID[] DEFAULT '{}',
  last_generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(module, content_type)
);

-- Enable RLS
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all read access to generated_content"
ON public.generated_content FOR SELECT USING (true);

CREATE POLICY "Allow all insert access to generated_content"
ON public.generated_content FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update access to generated_content"
ON public.generated_content FOR UPDATE USING (true);

CREATE POLICY "Allow all delete access to generated_content"
ON public.generated_content FOR DELETE USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_data_sources_updated_at
BEFORE UPDATE ON public.data_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();