import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SOURCE_URL = "https://axrelizqucwrfezrwwic.supabase.co";
const SOURCE_KEY = "sb_publishable_nq2GVoobq2UU2cRJ_Rd3Xw_7qcCepeT";
const PAGE_SIZE = 500;

type Row = Record<string, unknown>;

const COMMON_COLS = [
  "uid","source","doc_type","title","abstract","year","date","url",
  "lens_id","orgs","countries","citations","taxonomy_tags","standards_mentions","fetched_at",
];
const TABLE_COLS: Record<string, string[]> = {
  publications: [...COMMON_COLS, "doi"],
  patents: COMMON_COLS,
};

function normalize(row: Row): Row {
  const out: Row = {};
  for (const c of COLS) out[c] = row[c] ?? null;
  out.title = out.title ?? "(untitled)";
  out.orgs = out.orgs ?? [];
  out.countries = out.countries ?? [];
  out.taxonomy_tags = out.taxonomy_tags ?? [];
  out.standards_mentions = out.standards_mentions ?? [];
  out.fetched_at = out.fetched_at ?? new Date().toISOString();
  return out;
}

async function importTable(sourceTable: string, target: ReturnType<typeof createClient>) {
  let offset = 0;
  let total = 0;
  while (true) {
    const url = `${SOURCE_URL}/rest/v1/${sourceTable}?select=${COLS.join(",")}&order=created_at.asc&limit=${PAGE_SIZE}&offset=${offset}`;
    const res = await fetch(url, {
      headers: { apikey: SOURCE_KEY, Authorization: `Bearer ${SOURCE_KEY}` },
    });
    if (!res.ok) throw new Error(`${sourceTable} fetch ${res.status}: ${await res.text()}`);
    const rows = (await res.json()) as Row[];
    if (rows.length === 0) break;

    const payload = rows.map(normalize);
    const { error } = await target.from("documents").upsert(payload, { onConflict: "uid" });
    if (error) throw new Error(`${sourceTable} upsert: ${error.message}`);

    total += rows.length;
    offset += rows.length;
    if (rows.length < PAGE_SIZE) break;
  }
  return total;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const target = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json().catch(() => ({}));
    const which: string[] = body.tables ?? ["patents", "publications"];

    const results: Record<string, number> = {};
    for (const t of which) results[t] = await importTable(t, target);

    return new Response(JSON.stringify({ ok: true, imported: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
