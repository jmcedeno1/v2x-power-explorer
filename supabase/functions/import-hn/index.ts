// Hacker News importer via Algolia public search API. No key required.
// Stores stories into `documents` (source='gdelt' reused so NewsPage picks them up,
// with raw.provider='hn' so the UI can distinguish HN from Bing News).
import { corsHeaders, upsertDocuments, sha1Hex, logQA, type Doc } from "../_shared/corpus.ts";

const RELEVANCE_RE = /\b(v2g|v2h|v2b|v2l|v2x|vehicle[- ]to[- ](grid|home|building|load|everything|x)|bidirectional (charg|ev|inverter|power)|two[- ]way charg|reverse charg)\b/i;
const OFF_TOPIC_RE = /\b(business jet|private jet|bombardier|saudi contract|aviation|airline|aircraft|football|soccer|basketball|baseball|celebrity|movie|film festival)\b/i;

async function fetchHN(query: string, hitsPerPage = 100) {
  const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=${hitsPerPage}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HN ${r.status}`);
  return (await r.json())?.hits ?? [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const queries: string[] = body.queries ?? [
      "V2G", "V2H", "V2B", "V2L", "vehicle-to-grid", "vehicle-to-home",
      "bidirectional charging", "bidirectional charger",
    ];

    const docs: Doc[] = [];
    let fetched = 0, filtered = 0;
    const seen = new Set<string>();

    for (const q of queries) {
      let hits: any[] = [];
      try { hits = await fetchHN(q); } catch (_) { continue; }
      fetched += hits.length;
      for (const h of hits) {
        if (!h.title) continue;
        const link = h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`;
        if (seen.has(link)) continue;
        seen.add(link);
        const hay = `${h.title} ${h.story_text ?? ""} ${link}`;
        if (!RELEVANCE_RE.test(hay) || OFF_TOPIC_RE.test(hay)) { filtered++; continue; }
        const iso = h.created_at ? new Date(h.created_at).toISOString().slice(0, 10) : null;
        const uidHash = await sha1Hex(link);
        docs.push({
          uid: `hn:${uidHash}`,
          source: "gdelt",
          doc_type: "news",
          title: h.title,
          url: link,
          date: iso,
          year: iso ? parseInt(iso.slice(0, 4)) : null,
          orgs: ["news.ycombinator.com"],
          countries: [],
          abstract: h.story_text ?? null,
          raw: {
            provider: "hn",
            hn_query: q,
            points: h.points ?? 0,
            num_comments: h.num_comments ?? 0,
            author: h.author,
            objectID: h.objectID,
            created_at: h.created_at,
          },
        });
      }
    }

    const result = await upsertDocuments(docs);
    await logQA({ level: "info", category: "ingest", section: "hn", message: `Ingested ${docs.length} HN stories (filtered ${filtered})` });
    return new Response(JSON.stringify({ source: "hn", fetched, kept: docs.length, filtered, upserted: result.inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
