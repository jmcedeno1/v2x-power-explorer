// GDELT 2.0 DOC API news importer — no API key required.
// https://api.gdeltproject.org/api/v2/doc/doc?query=...&mode=ArtList&format=json
import { corsHeaders, getActiveProfile, upsertDocuments, logQA, sha1Hex, type Doc } from "../_shared/corpus.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const profile = await getActiveProfile();
    if (!profile) throw new Error("No active profile configured");

    const cfg = (profile.queries as any)?.gdelt ?? {};
    const query: string = body.query ?? cfg.query ?? profile.aliases?.[0] ?? "vehicle-to-grid";
    const timespan: string = body.timespan ?? cfg.timespan ?? "1month";
    const maxrecords: number = body.maxrecords ?? cfg.maxrecords ?? 250;

    const url = new URL("https://api.gdeltproject.org/api/v2/doc/doc");
    url.searchParams.set("query", query);
    url.searchParams.set("mode", "ArtList");
    url.searchParams.set("format", "json");
    url.searchParams.set("timespan", timespan);
    url.searchParams.set("maxrecords", String(maxrecords));
    url.searchParams.set("sort", "DateDesc");

    const res = await fetch(url.toString());
    const text = await res.text();
    if (!res.ok) {
      await logQA({ level: "error", category: "api_error", section: "gdelt", message: `GDELT ${res.status}`, details: { body: text.slice(0, 500) } });
      return new Response(JSON.stringify({ error: "GDELT request failed", status: res.status, details: text.slice(0, 500) }), { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    let json: any = {};
    try { json = JSON.parse(text); } catch { json = { articles: [] }; }
    const articles: any[] = json.articles ?? [];

    const docs: Doc[] = [];
    for (const a of articles) {
      if (!a?.url || !a?.title) continue;
      const uidHash = await sha1Hex(a.url);
      // GDELT seendate example: "20260119T142100Z"
      const sd: string | undefined = a.seendate;
      const iso = sd && sd.length >= 15
        ? `${sd.slice(0,4)}-${sd.slice(4,6)}-${sd.slice(6,8)}`
        : null;
      docs.push({
        uid: `gdelt:${uidHash}`,
        source: "gdelt",
        doc_type: "news",
        title: a.title,
        url: a.url,
        date: iso,
        year: iso ? parseInt(iso.slice(0, 4)) : null,
        orgs: a.domain ? [a.domain] : [],
        countries: a.sourcecountry ? [a.sourcecountry] : [],
        raw: a,
      });
    }
    const result = await upsertDocuments(docs);
    await logQA({ level: "info", category: "ingest", section: "gdelt", message: `Ingested ${docs.length} GDELT articles`, details: { query, timespan } });
    return new Response(JSON.stringify({ source: "gdelt", fetched: articles.length, upserted: result.inserted, query, timespan }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await logQA({ level: "error", category: "api_error", section: "gdelt", message: msg });
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
