import { useQuery } from '@tanstack/react-query';
import { BookOpen, FileText, TrendingUp, Calendar, Globe, Building2, Quote, ExternalLink } from 'lucide-react';
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
  year: number | null;
  citations: number | null;
  orgs: string[] | null;
  countries: string[] | null;
  url: string | null;
};

async function fetchAllPublications(): Promise<Pub[]> {
  const all: Pub[] = [];
  const pageSize = 1000;
  for (let from = 0; from < 20000; from += pageSize) {
    const { data, error } = await supabase
      .from('documents')
      .select('id,title,year,citations,orgs,countries,url')
      .eq('doc_type', 'publication')
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...(data as Pub[]));
    if (data.length < pageSize) break;
  }
  return all;
}

function useSummary() {
  return useQuery({
    queryKey: ['publications-summary'],
    queryFn: async () => {
      const pubs = await fetchAllPublications();

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

      return {
        total: pubs.length,
        minYear: isFinite(minYear) ? minYear : null,
        maxYear: isFinite(maxYear) ? maxYear : null,
        peakYear,
        countries: countryCounts.size,
        institutions: instCounts.size,
        perYear,
        topInstitutions,
        topCountries,
        mostCited,
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
  const { data, isLoading } = useSummary();

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
            <StatCard icon={BookOpen} value={0} label="Themes" />
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
