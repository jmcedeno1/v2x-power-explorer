import { useQuery } from '@tanstack/react-query';
import { BookOpen, FileText, TrendingUp, Calendar, Globe, Building2, Quote, ExternalLink, Sparkles } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
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

type Pub = {
  id: string;
  title: string | null;
  abstract: string | null;
  year: number | null;
  citations: number | null;
  orgs: string[] | null;
  countries: string[] | null;
  url: string | null;
};

async function fetchAllPublications(): Promise<{ pubs: Pub[]; pages: number[] }> {
  const all: Pub[] = [];
  const pages: number[] = [];
  const pageSize = 1000;
  for (let from = 0; from < 20000; from += pageSize) {
    const { data, error } = await supabase
      .from('documents')
      .select('id,title,abstract,year,citations,orgs,countries,url')
      .eq('doc_type', 'publication')
      .range(from, from + pageSize - 1);
    if (error) {
      console.error('[Publications] fetch error at offset', from, error);
      throw error;
    }
    const n = data?.length ?? 0;
    pages.push(n);
    console.log('[Publications] fetched page offset', from, 'rows', n);
    if (!data || n === 0) break;
    all.push(...(data as Pub[]));
    if (n < pageSize) break;
  }
  console.log('[Publications] total fetched', all.length, 'pages', pages);
  return { pubs: all, pages };
}

// Topic taxonomy for V2X / bidirectional charging literature.
// Each topic is matched against title + abstract with case-insensitive regex.
const TOPIC_PATTERNS: { topic: string; pattern: RegExp }[] = [
  // V2G is too broad on its own — split into specific sub-angles.
  // Each requires a V2G/vehicle-to-grid mention plus a sub-topic keyword.
  { topic: 'V2G Economics & Business Models', pattern: /(?=.*\b(vehicle[- ]to[- ]grid|v2g)\b)(?=.*\b(econom|revenue|profit|business model|cost[- ]benefit|feasibility|monetiz|willingness[- ]to[- ]pay)\b)/is },
  { topic: 'V2G Control & Dispatch Algorithms', pattern: /(?=.*\b(vehicle[- ]to[- ]grid|v2g)\b)(?=.*\b(control (strateg|scheme|algorithm)|dispatch|model predictive|mpc|droop control|hierarchical control)\b)/is },
  { topic: 'V2G Optimal Scheduling & Bidding', pattern: /(?=.*\b(vehicle[- ]to[- ]grid|v2g)\b)(?=.*\b(schedul|optimi[sz]ation|bidding|stochastic|robust optimization|mixed[- ]integer)\b)/is },
  { topic: 'V2G with Renewables & Solar', pattern: /(?=.*\b(vehicle[- ]to[- ]grid|v2g)\b)(?=.*\b(photovoltaic|solar|wind|renewable)\b)/is },
  { topic: 'V2G Environmental & LCA', pattern: /(?=.*\b(vehicle[- ]to[- ]grid|v2g)\b)(?=.*\b(life[- ]cycle|\blca\b|emission|carbon|environmental|sustainab)\b)/is },
  { topic: 'V2G User Behavior & Adoption', pattern: /(?=.*\b(vehicle[- ]to[- ]grid|v2g)\b)(?=.*\b(user (behavior|acceptance|preference)|adoption|survey|willingness|consumer)\b)/is },
  { topic: 'V2G Field Trials & Pilots', pattern: /(?=.*\b(vehicle[- ]to[- ]grid|v2g)\b)(?=.*\b(pilot|demonstrat|field (trial|test)|case study|real[- ]world)\b)/is },
  { topic: 'V2G Policy & Regulation', pattern: /(?=.*\b(vehicle[- ]to[- ]grid|v2g)\b)(?=.*\b(polic|regulat|tariff|incentive|subsid|framework)\b)/is },
  { topic: 'V2G Battery Degradation', pattern: /(?=.*\b(vehicle[- ]to[- ]grid|v2g)\b)(?=.*\b(degradation|aging|ageing|state[- ]of[- ]health|\bsoh\b|lifetime|capacity fade)\b)/is },
  { topic: 'V2G Simulation & Modeling', pattern: /(?=.*\b(vehicle[- ]to[- ]grid|v2g)\b)(?=.*\b(simulation|co[- ]simulation|matlab|digital twin|monte carlo|agent[- ]based)\b)/is },
  { topic: 'Vehicle-to-Home / Building', pattern: /\b(vehicle[- ]to[- ](home|building|house|load|everything)|v2h|v2b|v2l|v2x)\b/i },
  { topic: 'Bidirectional Chargers & Power Electronics', pattern: /\b(bidirectional (charger|converter|inverter|dc[- ]dc)|dual[- ]active[- ]bridge|dab converter)\b/i },
  { topic: 'Wide-Bandgap Semiconductors (SiC/GaN)', pattern: /\b(silicon carbide|\bsic\b|gallium nitride|\bgan\b|wide[- ]bandgap)\b/i },
  { topic: 'Battery Degradation & SOH', pattern: /\b(battery (degradation|aging|ageing|health|lifetime)|state[- ]of[- ]health|\bsoh\b|calendar aging|cycle aging)\b/i },
  { topic: 'Smart / Optimal Charging Scheduling', pattern: /\b(smart charging|charging (schedul|strateg|optimi[sz]ation|coordination)|optimal charging)\b/i },
  { topic: 'Renewable Integration & Solar+EV', pattern: /\b(renewable (energy|integration)|photovoltaic|solar (pv|panel|energy)|wind (power|energy))\b/i },
  { topic: 'Microgrids & Islanded Operation', pattern: /\b(microgrid|islanded|island mode|nanogrid)\b/i },
  { topic: 'Frequency & Ancillary Services', pattern: /\b(frequency regulation|ancillary service|primary reserve|secondary reserve|grid support|frequency response)\b/i },
  { topic: 'Peak Shaving & Demand Response', pattern: /\b(peak shaving|peak load|demand response|load shifting|load leveling|valley filling)\b/i },
  { topic: 'Energy / Aggregator Markets', pattern: /\b(aggregator|energy market|electricity market|wholesale market|balancing market|day[- ]ahead)\b/i },
  { topic: 'Machine Learning & Forecasting', pattern: /\b(machine learning|deep learning|neural network|reinforcement learning|lstm|forecast(ing)?)\b/i },
  { topic: 'Energy Management Systems (EMS/HEMS)', pattern: /\b(energy management (system|strateg)|\bems\b|home energy management|\bhems\b|bems)\b/i },
  { topic: 'Wireless / Inductive Bidirectional Charging', pattern: /\b(wireless (power|charging)|inductive (power|charging)|resonant (coupling|charging))\b/i },
  { topic: 'Fleet & Commercial EV Charging', pattern: /\b(fleet|bus depot|electric bus|heavy[- ]duty|truck|logistics)\b/i },
  { topic: 'Second-Life & Repurposed Batteries', pattern: /\b(second[- ]life|repurposed batter|reuse.{0,15}batter)\b/i },
  { topic: 'EV Charging Infrastructure', pattern: /\b(charging (station|infrastructure|point)|\bevse\b|fast charg|dc fast)\b/i },
  { topic: 'Cybersecurity of Charging', pattern: /\b(cybersecurity|cyber[- ]?attack|cyber[- ]?security|intrusion detection)\b/i },
  { topic: 'Standards & Communication (ISO 15118, OCPP)', pattern: /\b(iso[ -]?15118|ocpp|chademo|\bccs\b|combined charging system|iec 61851)\b/i },
  { topic: 'Grid Impact & Distribution Networks', pattern: /\b(distribution (network|grid|system)|grid impact|voltage (regulation|control)|hosting capacity|transformer aging)\b/i },
];

function classifyPublication(p: Pub): string[] {
  const hay = `${p.title ?? ''} ${p.abstract ?? ''}`;
  if (!hay.trim()) return [];
  const hits: string[] = [];
  for (const { topic, pattern } of TOPIC_PATTERNS) {
    if (pattern.test(hay)) hits.push(topic);
  }
  return hits;
}

function useSummary() {
  return useQuery({
    queryKey: ['publications-summary'],
    queryFn: async () => {
      const { pubs, pages: fetchPages } = await fetchAllPublications();

      const yearCounts = new Map<number, number>();
      const instCounts = new Map<string, number>();
      const countryCounts = new Map<string, number>();
      let minYear = Infinity;
      let maxYear = -Infinity;
      let peakYear = 0;
      let peakCount = 0;

      for (const p of pubs) {
        if (p.year) {
          yearCounts.set(p.year, (yearCounts.get(p.year) ?? 0) + 1);
          if (p.year < minYear) minYear = p.year;
          if (p.year > maxYear) maxYear = p.year;
        }
        (p.orgs ?? []).forEach((o) => {
          if (o) instCounts.set(o, (instCounts.get(o) ?? 0) + 1);
        });
        (p.countries ?? []).forEach((c) => {
          if (c) countryCounts.set(c, (countryCounts.get(c) ?? 0) + 1);
        });
      }

      for (const [y, c] of yearCounts) {
        if (c > peakCount) {
          peakCount = c;
          peakYear = y;
        }
      }

      const perYear = Array.from(yearCounts.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([year, count]) => ({ year, count }));

      const topInstitutions = Array.from(instCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({ name, count }));

      const topCountries = Array.from(countryCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({ name, count }));

      const mostCited = [...pubs]
        .filter((p) => (p.citations ?? 0) > 0)
        .sort((a, b) => (b.citations ?? 0) - (a.citations ?? 0))
        .slice(0, 10);

      // Topic growth 2020 -> 2025
      const topicCounts = new Map<string, { y2020: number; y2025: number; total: number }>();
      for (const p of pubs) {
        if (!p.year) continue;
        if (p.year !== 2020 && p.year !== 2025) {
          // still count for total to gauge topic size
          const topics = classifyPublication(p);
          for (const t of topics) {
            const rec = topicCounts.get(t) ?? { y2020: 0, y2025: 0, total: 0 };
            rec.total += 1;
            topicCounts.set(t, rec);
          }
          continue;
        }
        const topics = classifyPublication(p);
        for (const t of topics) {
          const rec = topicCounts.get(t) ?? { y2020: 0, y2025: 0, total: 0 };
          if (p.year === 2020) rec.y2020 += 1;
          if (p.year === 2025) rec.y2025 += 1;
          rec.total += 1;
          topicCounts.set(t, rec);
        }
      }
      const growingTopics = Array.from(topicCounts.entries())
        .map(([topic, r]) => {
          const growthAbs = r.y2025 - r.y2020;
          const growthPct = r.y2020 > 0 ? ((r.y2025 - r.y2020) / r.y2020) * 100 : r.y2025 > 0 ? 100 : 0;
          return { topic, y2020: r.y2020, y2025: r.y2025, growthAbs, growthPct, total: r.total };
        })
        .filter((t) => t.growthAbs > 0 && t.y2025 >= 3) // require meaningful volume
        .sort((a, b) => b.growthAbs - a.growthAbs)
        .slice(0, 10);

      return {
        total: pubs.length,
        fetchPages,
        minYear: isFinite(minYear) ? minYear : null,
        maxYear: isFinite(maxYear) ? maxYear : null,
        peakYear,
        countries: countryCounts.size,
        institutions: instCounts.size,
        themes: growingTopics.length,
        perYear,
        topInstitutions,
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

export default function PublicationsPage() {
  const { data, isLoading, error } = useSummary();
  const err = error as { message?: string; code?: string; details?: string; hint?: string } | null;

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<BookOpen className="w-7 h-7 text-white" />}
          title="Publications & Scientific Landscape"
          description="Scholarly output on bidirectional charging and V2X energy flows, sourced from OpenAlex"
          badge="OpenAlex"
        />

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Publication Landscape Summary</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <StatCard icon={FileText} value={isLoading ? '-' : (data?.total ?? 0).toLocaleString()} label="Publications in corpus" />
            <StatCard
              icon={TrendingUp}
              value={data?.minYear && data?.maxYear ? `${data.minYear}-${data.maxYear}` : '-'}
              label="Coverage"
            />
            <StatCard icon={Calendar} value={data?.peakYear || '-'} label="Peak year" />
            <StatCard icon={Globe} value={data?.countries ?? 0} label="Countries" />
            <StatCard icon={Building2} value={data?.institutions ?? 0} label="Institutions" />
            <StatCard icon={BookOpen} value={data?.themes ?? 0} label="Growing themes" />
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Publications per year</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.perYear ?? []}>
                  <defs>
                    <linearGradient id="pubFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#pubFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Top institutions</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.topInstitutions ?? []} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      width={140}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Top countries</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.topCountries ?? []} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={60} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Top 10 growing publication topics (2020 to 2025)</h3>
          </div>
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 text-sm text-muted-foreground">Loading…</div>
              ) : !data?.growingTopics?.length ? (
                <div className="p-6 text-sm text-muted-foreground">
                  Not enough publications in 2020 and 2025 to compute topic growth.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="p-4 h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[...data.growingTopics].reverse()}
                        layout="vertical"
                        margin={{ left: 20, right: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <YAxis
                          type="category"
                          dataKey="topic"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={10}
                          width={200}
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          formatter={(value: number, name: string) => [value, name === 'y2020' ? '2020' : '2025']}
                        />
                        <Bar dataKey="y2020" fill="hsl(var(--muted-foreground))" name="2020" radius={[0, 2, 2, 0]} />
                        <Bar dataKey="y2025" fill="hsl(var(--primary))" name="2025" radius={[0, 2, 2, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="divide-y divide-border border-l border-border">
                    {data.growingTopics.map((t, i) => (
                      <li key={t.topic} className="p-3 flex items-center gap-3 hover:bg-muted/30">
                        <div className="text-lg font-bold text-muted-foreground w-6 shrink-0 tabular-nums">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{t.topic}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {t.y2020} in 2020 &rarr; {t.y2025} in 2025 &middot; {t.total.toLocaleString()} total
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-primary tabular-nums">
                            +{t.growthAbs}
                          </div>
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


        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Quote className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Most-cited publications in the corpus</h3>
          </div>
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 text-sm text-muted-foreground">Loading…</div>
              ) : !data?.mostCited.length ? (
                <div className="p-6 text-sm text-muted-foreground">
                  No publications ingested yet. Run "Import OpenAlex publications" on the Corpus page.
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {data.mostCited.map((p, i) => (
                    <li key={p.id} className="p-4 flex items-start gap-4 hover:bg-muted/30">
                      <div className="text-2xl font-bold text-muted-foreground w-8 shrink-0 tabular-nums">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground line-clamp-2">
                          {p.title || 'Untitled'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
                          {p.year && <span>{p.year}</span>}
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
                        {p.url && (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:text-primary/70"
                            aria-label="Open publication"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
}
