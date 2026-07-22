// Fetch search / discussion trend signals for bidirectional charging keywords.
// Sources: Google Trends (unofficial), Google Autocomplete, Reddit, HN Algolia.
// All sources are best-effort; failures are returned as { error } instead of throwing.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

type Src = "google_trends" | "autocomplete" | "reddit" | "hn";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36";

function stripGooglePrefix(t: string) {
  return t.replace(/^\)\]\}',?\s*/, "");
}

async function googleTrends(keyword: string, geo = "", timeframe = "today 12-m") {
  // Step 1: /explore to obtain widget tokens
  const req = {
    comparisonItem: [{ keyword, geo, time: timeframe }],
    category: 0,
    property: "",
  };
  const exploreUrl =
    `https://trends.google.com/trends/api/explore?hl=en-US&tz=0&req=${encodeURIComponent(
      JSON.stringify(req),
    )}`;
  const exp = await fetch(exploreUrl, { headers: { "User-Agent": UA } });
  if (!exp.ok) throw new Error(`explore ${exp.status}`);
  const expJson = JSON.parse(stripGooglePrefix(await exp.text()));
  const widgets: any[] = expJson.widgets ?? [];
  const timeline = widgets.find((w) => w.id === "TIMESERIES");
  const related = widgets.find((w) => w.id === "RELATED_QUERIES");
  const geoW = widgets.find((w) => w.id === "GEO_MAP");

  const fetchWidget = async (widget: any, endpoint: string) => {
    if (!widget) return null;
    const url =
      `https://trends.google.com/trends/api/widgetdata/${endpoint}?hl=en-US&tz=0&req=${encodeURIComponent(
        JSON.stringify(widget.request),
      )}&token=${widget.token}`;
    const r = await fetch(url, { headers: { "User-Agent": UA } });
    if (!r.ok) return null;
    try { return JSON.parse(stripGooglePrefix(await r.text())); } catch { return null; }
  };

  const [tl, rel, geoData] = await Promise.all([
    fetchWidget(timeline, "multiline"),
    fetchWidget(related, "relatedsearches"),
    fetchWidget(geoW, "comparedgeo"),
  ]);

  const series = (tl?.default?.timelineData ?? []).map((p: any) => ({
    date: p.formattedAxisTime ?? p.formattedTime,
    value: p.value?.[0] ?? 0,
  }));

  const top = (rel?.default?.rankedList?.[0]?.rankedKeyword ?? []).map((k: any) => ({
    query: k.query,
    value: k.value,
  }));
  const rising = (rel?.default?.rankedList?.[1]?.rankedKeyword ?? []).map((k: any) => ({
    query: k.query,
    value: k.value,
    formattedValue: k.formattedValue,
  }));

  const geoList = (geoData?.default?.geoMapData ?? [])
    .map((g: any) => ({ name: g.geoName, value: g.value?.[0] ?? 0 }))
    .filter((g: any) => g.value > 0)
    .slice(0, 15);

  return { keyword, series, top, rising, geo: geoList };
}

async function autocomplete(keyword: string) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(keyword)}`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`autocomplete ${r.status}`);
  const j = await r.json();
  const suggestions: string[] = j?.[1] ?? [];
  // Also fetch "people also ask" style completions with question prefixes
  const questionPrefixes = ["what is", "how does", "can", "is", "why"];
  const questions: string[] = [];
  for (const p of questionPrefixes) {
    try {
      const r2 = await fetch(
        `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(`${p} ${keyword}`)}`,
        { headers: { "User-Agent": UA } },
      );
      if (r2.ok) {
        const j2 = await r2.json();
        for (const s of (j2?.[1] ?? []) as string[]) questions.push(s);
      }
    } catch { /* ignore */ }
  }
  return { keyword, suggestions, questions: [...new Set(questions)].slice(0, 20) };
}

async function reddit(keyword: string) {
  const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&t=year&limit=100`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`reddit ${r.status}`);
  const j = await r.json();
  const posts = (j?.data?.children ?? []).map((c: any) => ({
    title: c.data.title,
    subreddit: c.data.subreddit,
    score: c.data.score,
    num_comments: c.data.num_comments,
    created_utc: c.data.created_utc,
    permalink: `https://reddit.com${c.data.permalink}`,
  }));
  return { keyword, count: posts.length, posts };
}

async function hn(keyword: string) {
  const url = `https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(keyword)}&tags=story&hitsPerPage=100`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`hn ${r.status}`);
  const j = await r.json();
  const stories = (j?.hits ?? []).map((h: any) => ({
    title: h.title,
    url: h.url,
    points: h.points,
    num_comments: h.num_comments,
    created_at: h.created_at,
    author: h.author,
    objectID: h.objectID,
  }));
  return { keyword, count: j?.nbHits ?? stories.length, stories };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const source = (url.searchParams.get("source") ?? body.source) as Src;
    const keyword = (url.searchParams.get("keyword") ?? body.keyword ?? "bidirectional charging") as string;
    const geo = (url.searchParams.get("geo") ?? body.geo ?? "") as string;
    const timeframe = (url.searchParams.get("timeframe") ?? body.timeframe ?? "today 12-m") as string;

    let data: unknown;
    switch (source) {
      case "google_trends": data = await googleTrends(keyword, geo, timeframe); break;
      case "autocomplete":  data = await autocomplete(keyword); break;
      case "reddit":        data = await reddit(keyword); break;
      case "hn":            data = await hn(keyword); break;
      default: return new Response(JSON.stringify({ error: "unknown source" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ ok: true, source, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
