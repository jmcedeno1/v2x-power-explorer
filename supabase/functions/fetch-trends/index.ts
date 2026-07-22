// Fetch search / discussion trend signals for bidirectional charging keywords.
// Primary source: Semrush (via connector gateway). Autocomplete fallback for
// "what people ask" via Google's suggest endpoint (no API key needed).
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

type Src =
  | "semrush_overview"
  | "semrush_related"
  | "semrush_questions"
  | "autocomplete";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36";

const GATEWAY = "https://connector-gateway.lovable.dev/semrush";

function gatewayHeaders() {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const semrushKey = Deno.env.get("SEMRUSH_API_KEY");
  if (!lovableKey || !semrushKey) {
    throw new Error("Semrush connector not configured (missing LOVABLE_API_KEY or SEMRUSH_API_KEY).");
  }
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": semrushKey,
  };
}

// Row response: { data: { columnNames: [...], rows: [[...]] }, status: 200 }
type SemrushRow = Record<string, string>;
async function semrushCall(path: string, params: Record<string, string>): Promise<SemrushRow[]> {
  const qs = new URLSearchParams(params).toString();
  const url = `${GATEWAY}${path}?${qs}`;
  const r = await fetch(url, { headers: gatewayHeaders() });
  const text = await r.text();
  if (text.includes("ERROR 134") || text.includes("TOTAL LIMIT EXCEEDED")) {
    throw new Error("Semrush API quota exhausted (ERROR 134). Live autocomplete remains available; Semrush metrics require quota reset or a higher Semrush API allowance.");
  }
  if (!r.ok) throw new Error(`Semrush ${path} ${r.status}: ${text.slice(0, 200)}`);
  let json: any;
  try { json = JSON.parse(text); } catch { throw new Error(`Semrush ${path}: non-JSON response`); }
  if (json?.error && String(json.error).includes("ERROR 134")) {
    throw new Error("Semrush API quota exhausted (ERROR 134). Live autocomplete remains available; Semrush metrics require quota reset or a higher Semrush API allowance.");
  }
  const columnNames: string[] = json?.data?.columnNames ?? [];
  const rows: string[][] = json?.data?.rows ?? [];
  if (json?.error) throw new Error(`Semrush: ${json.error}`);
  return rows.map((row) => {
    const obj: SemrushRow = {};
    columnNames.forEach((c, i) => { obj[c] = row[i]; });
    return obj;
  });
}

// Parse the Td trend string ("0.5,0.6,1,0.8,...") into a normalized 12-month series.
function parseTrend(td: string | undefined): { month: number; value: number }[] {
  if (!td) return [];
  const vals = td.split(",").map((v) => Number(v)).filter((v) => !Number.isNaN(v));
  return vals.map((value, i) => ({ month: i + 1, value: Math.round(value * 100) }));
}

// The gateway returns human-readable column names, not codes. Map both.
const COL = {
  phrase: ["Keyword", "Ph"],
  volume: ["Search Volume", "Nq"],
  cpc: ["CPC", "Cp"],
  competition: ["Competition", "Co"],
  results: ["Number of Results", "Nr"],
  trend: ["Trends", "Td"],
  difficulty: ["Keyword Difficulty Index", "Keyword Difficulty", "Kd"],
};
function pick(row: SemrushRow, keys: string[]): string | undefined {
  for (const k of keys) if (row[k] !== undefined) return row[k];
  return undefined;
}
const num = (v: string | undefined) => Number(v ?? 0) || 0;

async function semrushOverview(keyword: string, database = "us") {
  const rows = await semrushCall("/keywords/phrase_this", {
    phrase: keyword,
    database,
    export_columns: "Ph,Nq,Cp,Co,Nr,Td",
  });
  const row = rows[0] ?? {};
  return {
    keyword,
    database,
    volume: num(pick(row, COL.volume)),
    cpc: num(pick(row, COL.cpc)),
    competition: num(pick(row, COL.competition)),
    results: num(pick(row, COL.results)),
    trend: parseTrend(pick(row, COL.trend)),
  };
}

async function semrushRelated(keyword: string, database = "us", limit = 25) {
  const rows = await semrushCall("/keywords/phrase_related", {
    phrase: keyword,
    database,
    display_limit: String(limit),
    export_columns: "Ph,Nq,Cp,Co,Kd",
  });
  return {
    keyword,
    database,
    items: rows.map((r) => ({
      phrase: pick(r, COL.phrase) ?? "",
      volume: num(pick(r, COL.volume)),
      cpc: num(pick(r, COL.cpc)),
      competition: num(pick(r, COL.competition)),
      difficulty: num(pick(r, COL.difficulty)),
    })),
  };
}

async function semrushQuestions(keyword: string, database = "us", limit = 30) {
  const rows = await semrushCall("/keywords/phrase_questions", {
    phrase: keyword,
    database,
    display_limit: String(limit),
    export_columns: "Ph,Nq,Cp,Kd",
  });
  return {
    keyword,
    database,
    items: rows.map((r) => ({
      phrase: pick(r, COL.phrase) ?? "",
      volume: num(pick(r, COL.volume)),
      cpc: num(pick(r, COL.cpc)),
      difficulty: num(pick(r, COL.difficulty)),
    })),
  };
}

async function autocomplete(keyword: string) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(keyword)}`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`autocomplete ${r.status}`);
  const j = await r.json();
  const suggestions: string[] = j?.[1] ?? [];
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const source = (url.searchParams.get("source") ?? body.source) as Src;
    const keyword = (url.searchParams.get("keyword") ?? body.keyword ?? "bidirectional charging") as string;
    const database = (url.searchParams.get("database") ?? body.database ?? "us") as string;

    let data: unknown;
    switch (source) {
      case "semrush_overview":  data = await semrushOverview(keyword, database); break;
      case "semrush_related":   data = await semrushRelated(keyword, database); break;
      case "semrush_questions": data = await semrushQuestions(keyword, database); break;
      case "autocomplete":      data = await autocomplete(keyword); break;
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
