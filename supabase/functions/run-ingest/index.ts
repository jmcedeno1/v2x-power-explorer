// Orchestrator: runs OpenAlex + GDELT (+ Lens if key present) in parallel.
import { corsHeaders, admin, logQA } from "../_shared/corpus.ts";

async function invoke(name: string, body: unknown) {
  const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/${name}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
    },
    body: JSON.stringify(body ?? {}),
  });
  const text = await res.text();
  let payload: unknown; try { payload = JSON.parse(text); } catch { payload = text; }
  return { name, ok: res.ok, status: res.status, payload };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const sources: string[] = body.sources ?? ["openalex", "gdelt", ...(Deno.env.get("LENS_API_KEY") ? ["lens_patents", "lens_scholar"] : [])];

    const jobs: Promise<any>[] = [];
    if (sources.includes("openalex")) jobs.push(invoke("import-openalex", {}));
    if (sources.includes("gdelt")) jobs.push(invoke("import-gdelt", {}));
    if (sources.includes("lens_patents")) jobs.push(invoke("import-lens", { kind: "patents" }));
    if (sources.includes("lens_scholar")) jobs.push(invoke("import-lens", { kind: "scholar" }));

    const results = await Promise.all(jobs);

    // Update corpus manifest snapshot per source
    const { data: byType } = await admin().rpc("noop_dummy").select().limit(0).then(() => ({ data: null } as any)).catch(() => ({ data: null } as any));
    // Simpler: aggregate document counts
    const { data: counts } = await admin().from("documents").select("source, doc_type", { count: "exact", head: false });
    const source_breakdown: Record<string, number> = {};
    const doc_type_breakdown: Record<string, number> = {};
    (counts ?? []).forEach((r: any) => {
      source_breakdown[r.source] = (source_breakdown[r.source] ?? 0) + 1;
      doc_type_breakdown[r.doc_type] = (doc_type_breakdown[r.doc_type] ?? 0) + 1;
    });
    await admin().from("corpus_manifest").insert({
      section: "ingest_run",
      document_uids: [],
      source_breakdown,
      doc_type_breakdown,
    });

    await logQA({ level: "info", category: "ingest", section: "run", message: `Ingest run complete`, details: { results, source_breakdown } });
    return new Response(JSON.stringify({ results, source_breakdown, doc_type_breakdown }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
