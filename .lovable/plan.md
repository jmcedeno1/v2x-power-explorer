
# Plan: Evidence-grounded backend + external data imports

Rebuild the Lovable Cloud database using the schema from your WIP repo (`supabase/migrations/0001_init.sql`), adapt it to the constraints of this project (RLS + GRANTs), and add edge functions that import patents/publications and GDELT news directly into it.

## 1. Database schema (single migration)

Recreate the "TechScope" schema from your repo, adapted for Lovable Cloud (proper GRANTs, split INDEX into separate CREATE INDEX statements, add updated_at triggers). Tables:

- `documents` — universal record for publications / patents / news. Key fields: `uid` (unique), `source` (openalex | lens_scholar | lens_patent | gdelt), `doc_type` (publication | patent_application | patent_grant | news), title, abstract, year, date, url, doi, lens_id, orgs[], countries[], citations, taxonomy_tags[], standards_mentions[], `raw` JSONB (full API payload for audit).
- `organizations` — normalized name, role, confidence, evidence_uids[], patent/publication counts.
- `pilots` — name, location, country, partners[], power_kw, fleet_size, status, dates, evidence_uid, description.
- `standards_mentions` — standard_id, standard_name, status, document_uid, mention_context.
- `quantitative_claims` — metric, value, unit, context, document_uid, confidence.
- `taxonomy_tags` — document_uid ↔ tag_id ↔ tag_name, confidence.
- `maturity_scores` — tag_id, patent maturity level + count, standardization level + evidence count.
- `diffusion_series` — series_type, year, value (for trend charts).
- `generated_sections` — section_name, content JSONB, content_type, evidence_uids[].
- `corpus_manifest` — section, document_uids[], source_breakdown, doc_type_breakdown.
- `qa_log` — timestamp, level, category, section, message, details.
- `taxonomy_nodes` — profile-driven hierarchical taxonomy (id, parent_id, name, aliases[], profile).
- `profiles` — technology profile (name, aliases[], queries JSONB, taxonomy_ref, standards_watchlist[]) so the app is config-driven like the repo.

Each table gets: `GRANT SELECT, INSERT, UPDATE, DELETE ... TO authenticated`, `GRANT ALL ... TO service_role`, plus `GRANT SELECT ... TO anon` for read-only public tables (documents, generated_sections, diffusion_series, maturity_scores). RLS enabled with permissive read policies and authenticated-write policies (matches current app posture — no auth wall yet).

### Existing tables

`data_sources` and `generated_content` (used by the current Data Sources UI + Gemini pipeline) stay in place. They serve user-uploaded PDFs/notes; the new tables serve automated API ingestion. `generated_sections` in the new schema and `generated_content` in the old one coexist — the UI keeps working while the new pipeline populates the richer schema.

## 2. Config: technology profile

Port `config/profiles/bidirectional_charging.yaml` into a seeded row in the `profiles` table plus taxonomy_nodes seed rows. This drives search queries and tagging without code changes.

## 3. Edge functions (import pipeline)

Three ingestion functions + one orchestrator, all writing to `documents` (upsert on `uid`) and caching the raw payload:

- `import-openalex` — calls OpenAlex works API with the profile's query, paginates, normalizes to `Document`, upserts.
- `import-lens` — calls Lens Scholarly + Lens Patents APIs (needs `LENS_API_KEY`), paginates, normalizes patents/scholar records, upserts.
- `import-gdelt` — calls GDELT 2.0 DOC API (`https://api.gdeltproject.org/api/v2/doc/doc?query=...&mode=ArtList&format=json&maxrecords=250&timespan=...`), maps each article to a `news` document with `uid = 'gdelt:' + sha1(url)`, extracting title, url, seendate, sourcecountry, domain, language. No API key required.
- `run-ingest` — orchestrator that reads the active profile and invokes the three importers in parallel, then logs a `corpus_manifest` row.

Each importer records failures to `qa_log` and returns `{ inserted, updated, skipped, errors }`.

### Secrets needed

- `LENS_API_KEY` — required for Lens (patents + scholar). Requested via `add_secret` once you confirm.
- `OPENALEX_MAILTO` — polite-pool email, optional but recommended.
- GDELT: none.

## 4. Frontend: minimal control surface

Add a "Corpus" page (or a section inside Data Sources) with:
- Buttons: Run OpenAlex import, Run Lens import, Run GDELT import, Run all.
- Live counts of `documents` by source and doc_type.
- Table view of recent documents with source badge, year, orgs, and a link to the raw url.
- A "Rebuild trends" button that recomputes `diffusion_series` from `documents` (yearly counts per source).

The existing V2X module pages are not touched by this plan — they continue to read `generated_content`. A follow-up plan can migrate them to read the new `generated_sections` + analytics tables.

## 5. Technical notes

- All timestamps use `TIMESTAMP WITH TIME ZONE DEFAULT now()`, and `updated_at` is maintained by the existing `public.update_updated_at_column` trigger reused across new tables.
- `INDEX idx_...` inline in CREATE TABLE (Postgres does not support that) is split into standalone `CREATE INDEX` statements.
- `pgvector` extension is skipped for now (not needed until embedding-based retrieval).
- Upsert key is `uid` for `documents`; array fields merged in code (importer reads existing row, unions arrays).
- GDELT free API returns max 250 rows per request; importer paginates by narrowing `startdatetime`/`enddatetime` windows.

## 6. Open items to confirm before implementing

- **Lens API key.** Do you have one, or should we start with OpenAlex + GDELT only and add Lens later?
- **Query scope.** Use the exact queries from `bidirectional_charging.yaml`, or refine them first?
- **Auth.** Keep the current "no login, public writes" posture, or add authenticated user requirement for imports? Recommend authenticated-only writes for ingestion endpoints even without a full login UI.

```text
[profile YAML] ──► profiles table
       │
       ▼
run-ingest ──► import-openalex ─┐
           ├── import-lens ─────┼──► documents (upsert by uid)
           └── import-gdelt ────┘
                                       │
                                       ▼
                              analytics (diffusion_series,
                                         maturity_scores,
                                         organizations)
                                       │
                                       ▼
                              generated_sections ──► React pages
```
