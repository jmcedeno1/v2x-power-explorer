import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Download, RefreshCw, ExternalLink } from "lucide-react";

type DocRow = {
  id: string;
  uid: string;
  source: string;
  doc_type: string;
  title: string;
  year: number | null;
  date: string | null;
  url: string | null;
  orgs: string[] | null;
  countries: string[] | null;
  fetched_at: string;
};

const sourceColors: Record<string, string> = {
  openalex: "bg-blue-500/10 text-blue-600",
  lens_patent: "bg-purple-500/10 text-purple-600",
  lens_scholar: "bg-indigo-500/10 text-indigo-600",
  gdelt: "bg-teal-500/10 text-teal-600",
};

function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("fetched_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as DocRow[];
    },
  });
}

function useCounts() {
  return useQuery({
    queryKey: ["document-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("documents").select("source, doc_type");
      if (error) throw error;
      const bySource: Record<string, number> = {};
      const byType: Record<string, number> = {};
      (data ?? []).forEach((r: any) => {
        bySource[r.source] = (bySource[r.source] ?? 0) + 1;
        byType[r.doc_type] = (byType[r.doc_type] ?? 0) + 1;
      });
      return { total: data?.length ?? 0, bySource, byType };
    },
  });
}

function useIngest(name: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body?: Record<string, unknown>) => {
      const { data, error } = await supabase.functions.invoke(name, { body: body ?? {} });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["documents"] });
      qc.invalidateQueries({ queryKey: ["document-counts"] });
      toast.success(`${name}: ${JSON.stringify(data)}`);
    },
    onError: (e: Error) => toast.error(`${name} failed: ${e.message}`),
  });
}

export default function CorpusPage() {
  const docs = useDocuments();
  const counts = useCounts();
  const gdelt = useIngest("import-gdelt");
  const openalex = useIngest("import-openalex");
  const lensP = useIngest("import-lens");
  const lensS = useIngest("import-lens");
  const runAll = useIngest("run-ingest");

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Corpus & Ingestion</h1>
          <p className="text-sm text-muted-foreground">
            Import patents, publications and news from external APIs into the evidence-grounded corpus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Total documents</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-semibold">{counts.data?.total ?? "—"}</div></CardContent>
          </Card>
          {["openalex", "lens_patent", "lens_scholar", "gdelt"].map((s) => (
            <Card key={s}>
              <CardHeader className="pb-2"><CardTitle className="text-sm capitalize">{s.replace("_", " ")}</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-semibold">{counts.data?.bySource[s] ?? 0}</div></CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ingest data</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => gdelt.mutate(undefined)} disabled={gdelt.isPending}>
              {gdelt.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              Import GDELT news
            </Button>
            <Button onClick={() => openalex.mutate(undefined)} disabled={openalex.isPending} variant="secondary">
              {openalex.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              Import OpenAlex publications
            </Button>
            <Button onClick={() => lensP.mutate({ kind: "patents" })} disabled={lensP.isPending} variant="secondary">
              {lensP.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              Import Lens patents
            </Button>
            <Button onClick={() => lensS.mutate({ kind: "scholar" })} disabled={lensS.isPending} variant="secondary">
              {lensS.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              Import Lens scholar
            </Button>
            <Button onClick={() => runAll.mutate(undefined)} disabled={runAll.isPending} variant="default">
              {runAll.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Run all
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent documents (last 100)</CardTitle></CardHeader>
          <CardContent>
            {docs.isLoading ? (
              <div className="py-8 text-center text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Loading…</div>
            ) : !docs.data?.length ? (
              <p className="text-sm text-muted-foreground">No documents yet. Trigger an import above.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-muted-foreground">
                    <tr>
                      <th className="py-2 pr-3">Source</th>
                      <th className="py-2 pr-3">Type</th>
                      <th className="py-2 pr-3">Year</th>
                      <th className="py-2 pr-3">Title</th>
                      <th className="py-2 pr-3">Orgs</th>
                      <th className="py-2 pr-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.data.map((d) => (
                      <tr key={d.id} className="border-t border-border/50">
                        <td className="py-2 pr-3"><Badge className={sourceColors[d.source] ?? ""} variant="secondary">{d.source}</Badge></td>
                        <td className="py-2 pr-3 text-xs">{d.doc_type}</td>
                        <td className="py-2 pr-3">{d.year ?? "—"}</td>
                        <td className="py-2 pr-3 max-w-xl truncate" title={d.title}>{d.title}</td>
                        <td className="py-2 pr-3 max-w-xs truncate text-xs text-muted-foreground">{(d.orgs ?? []).slice(0, 2).join(", ")}</td>
                        <td className="py-2 pr-3">
                          {d.url && (
                            <a href={d.url} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 text-xs">
                              open <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
