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

    // Retry with backoff. GDELT often returns HTTP 200 with a plain-text
    // rate-limit body (not 429), so we must detect that too.
    let res!: Response;
    let text = "";
    let rateLimited = false;
    const delays = [0, 6000, 12000, 20000, 30000];
    for (let attempt = 0; attempt < delays.length; attempt++) {
      if (delays[attempt] > 0) await new Promise((r) => setTimeout(r, delays[attempt]));
      res = await fetch(url.toString(), { headers: { "User-Agent": "Mozilla/5.0 (compatible; BidirectionalResearchBot/1.0)" } });
      text = await res.text();
      rateLimited = res.status === 429 || /Please limit requests to one every/i.test(text);
      if (!rateLimited && res.ok) break;
    }
    if (!res.ok || rateLimited) {
      await logQA({ level: "error", category: "api_error", section: "gdelt", message: `GDELT ${res.status}${rateLimited ? " rate-limited" : ""}`, details: { body: text.slice(0, 500) } });
      const friendly = rateLimited
        ? "GDELT is rate-limiting our IP (max 1 request per 5 seconds). Please wait a minute and try again."
        : "GDELT request failed";
      return new Response(JSON.stringify({ error: friendly, status: rateLimited ? 429 : res.status, details: text.slice(0, 500) }), { status: rateLimited ? 429 : res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
