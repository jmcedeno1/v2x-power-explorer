// Lens.org patents + scholar importer. Requires LENS_API_KEY.
// Docs: https://docs.api.lens.org/
import { corsHeaders, getActiveProfile, upsertDocuments, logQA, type Doc } from "../_shared/corpus.ts";

async function callLens(endpoint: string, body: unknown, token: string) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Lens ${res.status}: ${text.slice(0, 400)}`);
  return JSON.parse(text);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const token = Deno.env.get("LENS_API_KEY");
    if (!token) return new Response(JSON.stringify({ error: "LENS_API_KEY not configured" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json().catch(() => ({}));
    const kind: "patents" | "scholar" = body.kind ?? "patents";
    const profile = await getActiveProfile();
    if (!profile) throw new Error("No active profile");
    const queries = (profile.queries as any) ?? {};
    const size = Math.min(body.size ?? 100, 100);

    const docs: Doc[] = [];
    if (kind === "patents") {
      const p = queries.lens_patents ?? {};
      const keywordsQ = body.query ?? p.keywords ?? '"bidirectional charging" OR "vehicle-to-grid"';
      const cpc: string[] = body.cpc_classes ?? p.cpc_classes ?? [];
      const shouldCpc = cpc.map((c) => ({ term: { "class_cpc.symbol": c } }));
      const q = {
        query: {
          bool: {
            must: [{ query_string: { query: keywordsQ, fields: ["title", "abstract", "claims"] } }],
            ...(shouldCpc.length ? { should: shouldCpc, minimum_should_match: 1 } : {}),
          },
        },
        size,
        include: ["lens_id", "biblio", "abstract", "doc_key", "publication_type", "date_published", "jurisdiction"],
      };
      const data = await callLens("https://api.lens.org/patent/search", q, token);
      const rows: any[] = data.data ?? [];
      for (const r of rows) {
        const title = r.biblio?.invention_title?.[0]?.text ?? r.biblio?.invention_title?.text ?? "";
        const abstract = r.abstract?.[0]?.text ?? r.abstract?.text ?? null;
        const pubDate: string | null = r.date_published ?? null;
        const applicants: string[] = (r.biblio?.parties?.applicants ?? []).map((a: any) => a.extracted_name?.value).filter(Boolean);
        const countries: string[] = r.jurisdiction ? [r.jurisdiction] : [];
        const isGrant = String(r.publication_type ?? "").toLowerCase().includes("grant");
        docs.push({
          uid: `lens_p:${r.lens_id}`,
          source: "lens_patent",
          doc_type: isGrant ? "patent_grant" : "patent_application",
          title,
          abstract,
          year: pubDate ? parseInt(pubDate.slice(0, 4)) : null,
          date: pubDate,
          url: r.lens_id ? `https://www.lens.org/lens/patent/${r.lens_id}` : null,
          lens_id: r.lens_id,
          orgs: applicants,
          countries,
          raw: r,
        });
      }
    } else {
      const q = {
        query: { query_string: { query: (queries.lens_scholar?.query ?? body.query ?? '"vehicle-to-grid"'), fields: ["title", "abstract"] } },
        size,
      };
      const data = await callLens("https://api.lens.org/scholarly/search", q, token);
      const rows: any[] = data.data ?? [];
      for (const r of rows) {
        docs.push({
          uid: `lens_s:${r.lens_id}`,
          source: "lens_scholar",
          doc_type: "publication",
          title: r.title ?? "",
          abstract: r.abstract ?? null,
          year: r.year_published ?? null,
          date: r.date_published ?? null,
          url: r.external_ids?.[0]?.value ? `https://doi.org/${r.external_ids[0].value}` : null,
          doi: (r.external_ids ?? []).find((e: any) => e.type === "doi")?.value ?? null,
          lens_id: r.lens_id,
          orgs: (r.author_affiliations ?? []).map((a: any) => a.name).filter(Boolean),
          citations: r.scholarly_citations_count ?? null,
          raw: r,
        });
      }
    }
    const result = await upsertDocuments(docs);
    await logQA({ level: "info", category: "ingest", section: `lens_${kind}`, message: `Ingested ${docs.length} Lens ${kind}` });
    return new Response(JSON.stringify({ source: `lens_${kind}`, upserted: result.inserted, count: docs.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await logQA({ level: "error", category: "api_error", section: "lens", message: msg });
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
