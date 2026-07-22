// Bing News RSS importer. No API key required, no per-IP rate limits like Google/GDELT.
// URL: https://www.bing.com/news/search?q=<query>&format=rss&setmkt=en-US
import { z } from "npm:zod@3.25.76";
import { corsHeaders, upsertDocuments, logQA, sha1Hex, type Doc } from "../_shared/corpus.ts";

const BodySchema = z.object({
  query: z.string().trim().min(1).max(800),
  setmkt: z.string().trim().max(10).optional(),
  count: z.number().int().min(1).max(100).optional(),
});

const RELEVANCE_RE = /\b(v2g|v2h|v2b|v2l|v2x|vehicle[- ]to[- ](grid|home|building|load|everything|x)|bidirectional (charg|ev|inverter|power)|two[- ]way charg|reverse charg)\b/i;
const ENERGY_CONTEXT_RE = /\b(ev|electric vehicle|charging|charger|battery|grid|utility|energy|power|renewable|vehicle-to|fleet|bidirectional)\b/i;
const OFF_TOPIC_RE = /\b(business jet|private jet|bombardier|saudi contract|aviation|airline|aircraft|football|soccer|basketball|baseball|celebrity|movie|film festival)\b/i;

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function stripCdata(s: string): string {
  return s.replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1").trim();
}

function pick(item: string, tag: string): string | null {
  const m = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? decodeEntities(stripCdata(m[1])) : null;
}

function stripHtml(s: string | null): string | null {
  if (!s) return null;
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || null;
}

type ParsedItem = { title: string; link: string; pubDate: string | null; source: string | null; description: string | null };

function parseRss(xml: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  const matches = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  for (const raw of matches) {
    const title = pick(raw, "title");
    const link = pick(raw, "link");
    const pubDate = pick(raw, "pubDate");
    const source = pick(raw, "source") ?? pick(raw, "News:Source");
    const description = pick(raw, "description");
    if (title && link) items.push({ title, link, pubDate, source, description });
  }
  return items;
}

function domainFrom(link: string): string | null {
  try { return new URL(link).hostname.replace(/^www\./, ""); } catch { return null; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { query, setmkt = "en-US", count = 50 } = parsed.data;

    const url = new URL("https://www.bing.com/news/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "rss");
    url.searchParams.set("setmkt", setmkt);
    url.searchParams.set("count", String(count));

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
      },
    });
    if (!res.ok) {
      const text = await res.text();
      await logQA({ level: "error", category: "api_error", section: "bing_news", message: `Bing News ${res.status}`, details: { body: text.slice(0, 500) } });
      return new Response(JSON.stringify({ error: "Bing News request failed", status: res.status }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const xml = await res.text();
    const items = parseRss(xml);

    const docs: Doc[] = [];
    let filtered = 0;
    for (const it of items) {
      const cleanDesc = stripHtml(it.description);
      const haystack = `${it.title} ${cleanDesc ?? ""} ${it.source ?? ""} ${it.link}`;
      const relevant = RELEVANCE_RE.test(haystack) && ENERGY_CONTEXT_RE.test(haystack);
      if (!relevant || OFF_TOPIC_RE.test(haystack)) { filtered++; continue; }

      const uidHash = await sha1Hex(it.link);
      let iso: string | null = null;
      if (it.pubDate) {
        const d = new Date(it.pubDate);
        if (!isNaN(d.getTime())) iso = d.toISOString().slice(0, 10);
      }
      const dom = it.source || domainFrom(it.link) || null;
      docs.push({
        uid: `bnews:${uidHash}`,
        source: "gdelt", // reuse existing enum key so NewsPage picks it up
        doc_type: "news",
        title: it.title,
        url: it.link,
        date: iso,
        year: iso ? parseInt(iso.slice(0, 4)) : null,
        orgs: dom ? [dom] : [],
        countries: [],
        abstract: cleanDesc,
        raw: {
          provider: "bing_news",
          gdelt_query: query,
          setmkt,
          source_name: it.source,
          pubDate: it.pubDate,
        },
      });
    }

    const result = await upsertDocuments(docs);
    await logQA({ level: "info", category: "ingest", section: "bing_news", message: `Ingested ${docs.length} Bing News articles (filtered ${filtered})`, details: { query } });
    return new Response(JSON.stringify({ source: "bing_news", fetched: items.length, kept: docs.length, filtered, upserted: result.inserted, query }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await logQA({ level: "error", category: "api_error", section: "bing_news", message: msg });
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
