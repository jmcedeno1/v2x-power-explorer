// OpenAlex publications importer. No key required; use polite pool with mailto.
import { corsHeaders, getActiveProfile, upsertDocuments, logQA, type Doc } from "../_shared/corpus.ts";

function reconstructAbstract(inverted: Record<string, number[]> | null | undefined): string | null {
  if (!inverted) return null;
  const positions: [number, string][] = [];
  for (const [word, idxs] of Object.entries(inverted)) for (const i of idxs) positions.push([i, word]);
  positions.sort((a, b) => a[0] - b[0]);
  return positions.map(([, w]) => w).join(" ");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const profile = await getActiveProfile();
    if (!profile) throw new Error("No active profile configured");

    const cfg = (profile.queries as any)?.openalex ?? {};
    const search: string = body.search ?? cfg.search ?? "vehicle-to-grid OR bidirectional charging";
    const perPage: number = Math.min(body.per_page ?? cfg.per_page ?? 200, 200);
    const fromYear: number = body.from_year ?? cfg.from_year ?? 2010;
    const maxPages: number = body.max_pages ?? 3;
    const mailto = Deno.env.get("OPENALEX_MAILTO") ?? "techscope@lovable.dev";

    let cursor = "*";
    const docs: Doc[] = [];
    let totalFetched = 0;
    for (let page = 0; page < maxPages; page++) {
      const url = new URL("https://api.openalex.org/works");
      url.searchParams.set("search", search);
      url.searchParams.set("filter", `from_publication_date:${fromYear}-01-01`);
      url.searchParams.set("per-page", String(perPage));
      url.searchParams.set("cursor", cursor);
      url.searchParams.set("mailto", mailto);

      const res = await fetch(url.toString());
      if (!res.ok) {
        const t = await res.text();
        await logQA({ level: "error", category: "api_error", section: "openalex", message: `OpenAlex ${res.status}`, details: { body: t.slice(0, 500) } });
        break;
      }
      const json = await res.json();
      const results: any[] = json.results ?? [];
      totalFetched += results.length;
      for (const w of results) {
        const oaId: string = w.id ?? "";
        const short = oaId.split("/").pop() ?? oaId;
        if (!short || !w.title) continue;
        const orgs = new Set<string>();
        const countries = new Set<string>();
        for (const auth of w.authorships ?? []) {
          for (const inst of auth.institutions ?? []) {
            if (inst.display_name) orgs.add(inst.display_name);
            if (inst.country_code) countries.add(inst.country_code);
          }
        }
        docs.push({
          uid: `oa:${short}`,
          source: "openalex",
          doc_type: "publication",
          title: w.title,
          abstract: reconstructAbstract(w.abstract_inverted_index),
          year: w.publication_year ?? null,
          date: w.publication_date ?? null,
          url: w.doi ? `https://doi.org/${w.doi.replace(/^https?:\/\/doi\.org\//, "")}` : (w.id ?? null),
          doi: w.doi?.replace(/^https?:\/\/doi\.org\//, "") ?? null,
          orgs: [...orgs],
          countries: [...countries],
          citations: w.cited_by_count ?? null,
          raw: { id: w.id, type: w.type, host_venue: w.host_venue?.display_name },
        });
      }
      cursor = json.meta?.next_cursor;
      if (!cursor || results.length < perPage) break;
    }
    const result = await upsertDocuments(docs);
    await logQA({ level: "info", category: "ingest", section: "openalex", message: `Ingested ${docs.length} OpenAlex works`, details: { search, fromYear } });
    return new Response(JSON.stringify({ source: "openalex", fetched: totalFetched, upserted: result.inserted, search }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await logQA({ level: "error", category: "api_error", section: "openalex", message: msg });
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
