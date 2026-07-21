import { useQuery } from '@tanstack/react-query';
import { FileText, TrendingUp, Calendar, Globe, Building2, Quote, ExternalLink, Sparkles, Award, ScrollText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

type Pat = {
  id: string;
  title: string | null;
  abstract: string | null;
  year: number | null;
  citations: number | null;
  orgs: string[] | null;
  countries: string[] | null;
  url: string | null;
  doc_type: string | null;
  lens_id: string | null;
};

async function fetchAllPatents(): Promise<Pat[]> {
  const pageSize = 1000;
  const { count, error: countError } = await supabase
    .from('documents')
    .select('id', { count: 'exact', head: true })
    .in('doc_type', ['patent_application', 'patent_grant']);
  if (countError) throw countError;
  const total = count ?? 0;

  const offsets: number[] = [];
  for (let from = 0; from < total; from += pageSize) offsets.push(from);

  const results = await Promise.all(
    offsets.map(async (from) => {
      const { data, error } = await supabase
        .from('documents')
        .select('id,title,abstract,year,citations,orgs,countries,url,doc_type,lens_id')
        .in('doc_type', ['patent_application', 'patent_grant'])
        .range(from, from + pageSize - 1);
      if (error) throw error;
      return (data ?? []) as Pat[];
    }),
  );
  return results.flat();
}

// Bidirectional-charging patent taxonomy (title + abstract regex).
const TOPIC_PATTERNS: { topic: string; pattern: RegExp }[] = [
  { topic: 'V2G Bidirectional Power Conversion', pattern: /(?=.*\b(vehicle[- ]to[- ]grid|v2g|bidirectional)\b)(?=.*\b(inverter|converter|dc[- ]dc|dc[- ]ac|power electronic)\b)/is },
  { topic: 'V2G Control & Dispatch', pattern: /(?=.*\b(v2g|vehicle[- ]to[- ]grid|bidirectional)\b)(?=.*\b(control|dispatch|scheduling|management|command)\b)/is },
  { topic: 'V2H / Vehicle-to-Home', pattern: /\b(vehicle[- ]to[- ]home|\bv2h\b|home backup|residential.{0,30}(discharge|bidirectional))\b/i },
  { topic: 'V2B / Vehicle-to-Building', pattern: /\b(vehicle[- ]to[- ]building|\bv2b\b|building.{0,30}(discharge|bidirectional))\b/i },
  { topic: 'On-Board Bidirectional Charger', pattern: /\b(on[- ]board charger|obc|onboard.{0,20}bidirectional|integrated charger)\b/i },
  { topic: 'Off-Board / DC Bidirectional Charger', pattern: /\b(off[- ]board|dc charger|dc fast|external charger).{0,40}(bidirectional|v2g|discharge)/i },
  { topic: 'Wireless Bidirectional Charging', pattern: /\b(wireless|inductive|resonant).{0,30}(bidirectional|v2g|two[- ]way)/i },
  { topic: 'Battery Management (BMS)', pattern: /\b(battery management|\bbms\b|state of charge|state of health|\bsoc\b|\bsoh\b)\b/i },
  { topic: 'Battery Degradation & Ageing', pattern: /\b(degradation|aging|cycle life|calendar life|capacity fade)\b/i },
  { topic: 'Grid Services & Ancillary', pattern: /\b(frequency regulation|ancillary service|grid service|peak shaving|load balancing|reactive power)\b/i },
  { topic: 'Smart Charging & Scheduling', pattern: /\b(smart charging|charging schedul|charging optimi[sz]|managed charging)\b/i },
  { topic: 'Renewables Integration (PV/Wind)', pattern: /\b(photovoltaic|solar|\bpv\b|wind).{0,40}(charging|vehicle|grid)/i },
  { topic: 'Standards (ISO 15118, CCS, CHAdeMO)', pattern: /\b(iso[ -]?15118|\bccs\b|chademo|ocpp|iec 61851)\b/i },
  { topic: 'Cybersecurity of Charging', pattern: /\b(cybersecurity|cyber[- ]?security|authentication.{0,20}charg|secure.{0,20}charg)\b/i },
  { topic: 'Communication & Protocols', pattern: /\b(protocol|communication|handshake|plug[- ]and[- ]charge)\b/i },
  { topic: 'Charging Infrastructure & EVSE', pattern: /\b(charging (station|infrastructure|point|pile)|\bevse\b|charging pole|charging pillar)\b/i },
  { topic: 'Cell Balancing & Pack', pattern: /\b(cell balancing|pack balancing|equalization circuit)\b/i },
  { topic: 'Thermal Management', pattern: /\b(thermal management|cooling system|liquid cool|heat dissipation)\b/i },
  { topic: 'Isolation & Safety Circuits', pattern: /\b(galvanic isolation|isolation transformer|protection circuit|ground fault|leakage current)\b/i },
  { topic: 'Fleet & Microgrid Integration', pattern: /\b(fleet|microgrid|virtual power plant|\bvpp\b|aggregator)\b/i },
];

function classify(p: Pat): string[] {
  const hay = `${p.title ?? ''} ${p.abstract ?? ''}`;
  if (!hay.trim()) return [];
  const hits: string[] = [];
  for (const { topic, pattern } of TOPIC_PATTERNS) if (pattern.test(hay)) hits.push(topic);
  return hits;
}

function useSummary() {
  return useQuery({
    queryKey: ['patents-summary'],
    queryFn: async () => {
      const pats = await fetchAllPatents();

      const yearCounts = new Map<number, number>();
      const orgCounts = new Map<string, number>();
      const countryCounts = new Map<string, number>();
      let grants = 0;
      let apps = 0;
      let minYear = Infinity;
      let maxYear = -Infinity;

      for (const p of pats) {
        if (p.doc_type === 'patent_grant') grants++;
        else if (p.doc_type === 'patent_application') apps++;
        if (p.year) {
          yearCounts.set(p.year, (yearCounts.get(p.year) ?? 0) + 1);
          if (p.year < minYear) minYear = p.year;
          if (p.year > maxYear) maxYear = p.year;
        }
        (p.orgs ?? []).forEach((o) => { if (o) orgCounts.set(o, (orgCounts.get(o) ?? 0) + 1); });
        (p.countries ?? []).forEach((c) => { if (c) countryCounts.set(c, (countryCounts.get(c) ?? 0) + 1); });
      }

      let peakYear = 0, peakCount = 0;
      for (const [y, c] of yearCounts) if (c > peakCount) { peakCount = c; peakYear = y; }

      const perYear = Array.from(yearCounts.entries())
        .filter(([y]) => y >= 1990 && y <= new Date().getFullYear())
        .sort((a, b) => a[0] - b[0])
        .map(([year, count]) => ({ year, count }));

      const topAssignees = Array.from(orgCounts.entries())
        .sort((a, b) => b[1] - a[1]).slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      const topCountries = Array.from(countryCounts.entries())
        .sort((a, b) => b[1] - a[1]).slice(0, 10)
        .map(([name, count]) => ({ name, count }));

      const mostCited = [...pats]
        .filter((p) => (p.citations ?? 0) > 0)
        .sort((a, b) => (b.citations ?? 0) - (a.citations ?? 0))
        .slice(0, 10);

      // Topic growth 2020 -> 2025
      const topicCounts = new Map<string, { y2020: number; y2025: number }>();
      for (const p of pats) {
        if (p.year !== 2020 && p.year !== 2025) continue;
        for (const t of classify(p)) {
          const rec = topicCounts.get(t) ?? { y2020: 0, y2025: 0 };
          if (p.year === 2020) rec.y2020 += 1; else rec.y2025 += 1;
          topicCounts.set(t, rec);
        }
      }
      const growingTopics = Array.from(topicCounts.entries())
        .map(([topic, r]) => {
          const growthAbs = r.y2025 - r.y2020;
          const growthPct = r.y2020 > 0 ? ((r.y2025 - r.y2020) / r.y2020) * 100 : r.y2025 > 0 ? 100 : 0;
          return { topic, y2020: r.y2020, y2025: r.y2025, growthAbs, growthPct, total: r.y2020 + r.y2025 };
        })
        .filter((t) => t.growthAbs > 0 && t.y2025 >= 2)
        .sort((a, b) => b.growthAbs - a.growthAbs)
        .slice(0, 10);

      return {
        total: pats.length,
        grants, apps,
        minYear: isFinite(minYear) ? minYear : null,
        maxYear: isFinite(maxYear) ? maxYear : null,
        peakYear,
        countries: countryCounts.size,
        assignees: orgCounts.size,
        perYear,
        topAssignees,
        topCountries,
        mostCited,
        growingTopics,
      };
    },
  });
}

const StatCard = ({ icon: Icon, value, label }: { icon: any; value: string | number; label: string }) => (
  <div className="p-4 rounded-xl bg-card border flex flex-col gap-2">
    <Icon className="w-5 h-5 text-primary" />
    <div className="text-2xl font-bold text-foreground leading-tight">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export function PatentLandscape() {
  const { data, isLoading } = useSummary();

  return (
    <>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <ScrollText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Patent Landscape Summary</h3>
          <span className="text-xs text-muted-foreground">(lens.org corpus)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard icon={FileText} value={isLoading ? '-' : (data?.total ?? 0).toLocaleString()} label="Patents in corpus" />
          <StatCard icon={Award} value={isLoading ? '-' : (data?.grants ?? 0).toLocaleString()} label="Granted" />
          <StatCard icon={ScrollText} value={isLoading ? '-' : (data?.apps ?? 0).toLocaleString()} label="Applications" />
          <StatCard icon={TrendingUp} value={data?.minYear && data?.maxYear ? `${data.minYear}-${data.maxYear}` : '-'} label="Coverage" />
          <StatCard icon={Calendar} value={data?.peakYear || '-'} label="Peak filing year" />
          <StatCard icon={Building2} value={data?.assignees ?? 0} label="Unique assignees" />
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Patent filings per year</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.perYear ?? []}>
                <defs>
                  <linearGradient id="patFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#patFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Top assignees</CardTitle></CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.topAssignees ?? []} layout="vertical" margin={{ left: 120 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} width={160} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Top jurisdictions</CardTitle></CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.topCountries ?? []} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={60} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Top 10 growing patent topics (2020 to 2025)</h3>
        </div>
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 text-sm text-muted-foreground">Loading…</div>
            ) : !data?.growingTopics?.length ? (
              <div className="p-6 text-sm text-muted-foreground">Not enough patents in 2020 and 2025 to compute topic growth.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-4 h-[420px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[...data.growingTopics].reverse()} layout="vertical" margin={{ left: 20, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <YAxis type="category" dataKey="topic" stroke="hsl(var(--muted-foreground))" fontSize={10} width={220} />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                        formatter={(value: number, name: string) => [value, name === 'y2020' ? '2020' : '2025']} />
                      <Bar dataKey="y2020" fill="hsl(var(--muted-foreground))" name="2020" radius={[0, 2, 2, 0]} />
                      <Bar dataKey="y2025" fill="hsl(var(--primary))" name="2025" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <ul className="divide-y divide-border border-l border-border">
                  {data.growingTopics.map((t, i) => (
                    <li key={t.topic} className="p-3 flex items-center gap-3 hover:bg-muted/30">
                      <div className="text-lg font-bold text-muted-foreground w-6 shrink-0 tabular-nums">{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{t.topic}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {t.y2020} in 2020 &rarr; {t.y2025} in 2025 &middot; {t.total.toLocaleString()} total
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-primary tabular-nums">+{t.growthAbs}</div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {t.y2020 > 0 ? `+${Math.round(t.growthPct)}%` : 'new'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Quote className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Most-cited patents in the corpus</h3>
        </div>
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 text-sm text-muted-foreground">Loading…</div>
            ) : !data?.mostCited.length ? (
              <div className="p-6 text-sm text-muted-foreground">No patents ingested yet.</div>
            ) : (
              <ul className="divide-y divide-border">
                {data.mostCited.map((p, i) => {
                  const url = p.url || (p.lens_id ? `https://www.lens.org/lens/patent/${p.lens_id}` : null);
                  return (
                    <li key={p.id} className="p-4 flex items-start gap-4 hover:bg-muted/30">
                      <div className="text-2xl font-bold text-muted-foreground w-8 shrink-0 tabular-nums">{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground line-clamp-2">{p.title || 'Untitled'}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                          {p.year && <span>{p.year}</span>}
                          <span className="capitalize">{p.doc_type?.replace('patent_', '').replace('_', ' ')}</span>
                          {(p.orgs ?? []).slice(0, 2).length > 0 && (
                            <span className="truncate">{(p.orgs ?? []).slice(0, 2).join(', ')}</span>
                          )}
                          {(p.countries ?? []).length > 0 && <span>{(p.countries ?? []).join(', ')}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary tabular-nums">{p.citations ?? 0}</div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">citations</div>
                        </div>
                        {url && (
                          <a href={url} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/70" aria-label="Open patent">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
