import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Newspaper, Globe, Radio, TrendingUp, ExternalLink, RefreshCw, Calendar, DollarSign, Factory, LineChart as LineIcon } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  LabelList,
  AreaChart,
  Area,
} from 'recharts';
import {
  pilotsAnnouncedByYear,
  investmentsByYear,
  marketValueForecast,
  companyGrowth,
  notableDeals,
} from '@/data/newsContext';

type NewsDoc = {
  id: string;
  title: string | null;
  url: string | null;
  date: string | null;
  year: number | null;
  orgs: string[] | null;
  countries: string[] | null;
  raw: any;
};

const TOPIC_PATTERNS: { name: string; re: RegExp }[] = [
  { name: 'V2G Pilots & Deployments', re: /\b(pilot|trial|deploy|launch|rollout)\b/i },
  { name: 'Bidirectional Chargers', re: /\b(bidirectional|two-way|reverse)\b.*(charg|inverter)/i },
  { name: 'Vehicle-to-Home (V2H)', re: /\b(v2h|vehicle-to-home|home backup|power outage)\b/i },
  { name: 'Vehicle-to-Grid (V2G)', re: /\b(v2g|vehicle-to-grid)\b/i },
  { name: 'Grid Services & Flexibility', re: /\b(grid service|flexibility|frequency|balancing|ancillary|redispatch)\b/i },
  { name: 'Fleet & Bus Depots', re: /\b(fleet|bus depot|school bus|logistics)\b/i },
  { name: 'Utilities & DSOs', re: /\b(utility|utilities|dso|tso|grid operator)\b/i },
  { name: 'Policy & Regulation', re: /\b(regulation|policy|tariff|incentive|subsidy|mandate)\b/i },
  { name: 'Battery & Degradation', re: /\b(battery|degradation|state of health|soh|cycl)\b/i },
  { name: 'Renewables Integration', re: /\b(solar|wind|renewable|pv|photovoltaic)\b/i },
  { name: 'OEMs & Automakers', re: /\b(nissan|ford|hyundai|kia|bmw|volkswagen|gm|tesla|renault|volvo)\b/i },
  { name: 'Standards (ISO 15118, CHAdeMO)', re: /\b(iso ?15118|chademo|ccs|open ?charge|ocpp)\b/i },
  { name: 'Investment & Funding', re: /\b(investment|funding|raise|series [a-d]|round)\b/i },
];

async function fetchNews(): Promise<NewsDoc[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('id,title,url,date,year,orgs,countries,raw')
    .eq('source', 'gdelt')
    .order('date', { ascending: false })
    .limit(1000);
  if (error) throw error;
  return (data ?? []) as NewsDoc[];
}

function extractCountry(d: NewsDoc): string | null {
  const c = d.countries?.[0];
  if (c) return c;
  const raw = d.raw as any;
  return raw?.sourcecountry || raw?.country || null;
}

function extractDomain(d: NewsDoc): string {
  const o = d.orgs?.[0];
  if (o) return o;
  try {
    return d.url ? new URL(d.url).hostname.replace(/^www\./, '') : 'unknown';
  } catch {
    return 'unknown';
  }
}

export default function NewsPage() {
  const [refreshing, setRefreshing] = useState(false);
  const { data: news = [], isLoading, refetch } = useQuery({ queryKey: ['news-gdelt'], queryFn: fetchNews });

  const refresh = async () => {
    setRefreshing(true);
    try {
      const queries = ['V2G', 'vehicle-to-grid', 'bidirectional charging', 'Nuvve', 'V2H'];
      let fetched = 0, upserted = 0;
      for (const q of queries) {
        const { data, error } = await supabase.functions.invoke('import-gdelt', {
          body: { query: q, timespan: '6months', maxrecords: 250 },
        });
        if (!error && data) {
          fetched += data.fetched ?? 0;
          upserted += data.upserted ?? 0;
        }
      }
      toast.success(`Fetched ${fetched} articles, ${upserted} stored`);
      await refetch();
    } catch (e: any) {
      toast.error(`GDELT refresh failed: ${e.message ?? 'unknown error'}`);
    } finally {
      setRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    const total = news.length;
    const domains = new Map<string, number>();
    const countries = new Map<string, number>();
    const topicCounts = new Map<string, number>();

    for (const n of news) {
      const dom = extractDomain(n);
      domains.set(dom, (domains.get(dom) ?? 0) + 1);
      const c = extractCountry(n);
      if (c) countries.set(c, (countries.get(c) ?? 0) + 1);
      const title = n.title ?? '';
      for (const t of TOPIC_PATTERNS) {
        if (t.re.test(title)) topicCounts.set(t.name, (topicCounts.get(t.name) ?? 0) + 1);
      }
    }

    const topDomains = [...domains.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)
      .map(([name, count]) => ({ name, count }));
    const topCountries = [...countries.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)
      .map(([name, count]) => ({ name, count }));
    const topics = [...topicCounts.entries()].sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    const last30 = news.filter((n) => {
      if (!n.date) return false;
      const dt = new Date(n.date).getTime();
      return Date.now() - dt < 30 * 24 * 3600 * 1000;
    }).length;

    return { total, topDomains, topCountries, topics, last30, uniqueDomains: domains.size, uniqueCountries: countries.size };
  }, [news]);

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Newspaper className="w-7 h-7 text-white" />}
          title="News & Media Landscape"
          description="Recent bidirectional charging news, market signals and investment activity"
          badge={<Badge variant="outline">GDELT 2.0 + Market Intel</Badge>}
        />

        <div className="flex justify-end mb-6">
          <Button onClick={refresh} disabled={refreshing} size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh from GDELT
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricTile icon={<Newspaper className="w-4 h-4" />} label="Total Articles" value={stats.total} />
          <MetricTile icon={<Calendar className="w-4 h-4" />} label="Last 30 Days" value={stats.last30} />
          <MetricTile icon={<Radio className="w-4 h-4" />} label="Media Sources" value={stats.uniqueDomains} />
          <MetricTile icon={<Globe className="w-4 h-4" />} label="Countries" value={stats.uniqueCountries} />
        </div>

        {/* Market context row 1 — Pilots & Investments */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Factory className="w-4 h-4 text-primary" /> New V2G pilots announced per year
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={pilotsAnnouncedByYear} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="year" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="count" position="top" fontSize={11} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2">Global count of publicly announced pilots and commercial launches. 2026 is YTD.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="w-4 h-4 text-primary" /> Disclosed V2G investment (USD M)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={investmentsByYear} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="year" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip formatter={(v: any) => `$${v}M`} />
                  <Bar dataKey="usd_m" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="usd_m" position="top" fontSize={11} formatter={(v: any) => `$${v}M`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2">Aggregated funding rounds, project CAPEX and grants publicly disclosed by V2G players.</p>
            </CardContent>
          </Card>
        </div>

        {/* Market context row 2 — Market value & company growth */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-4 h-4 text-primary" /> V2G market value forecast (USD B)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={marketValueForecast} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="year" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip formatter={(v: any) => `$${v}B`} />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2">Consensus of BloombergNEF, IDTechEx and IEA V2G market sizing (2023-2030).</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <LineIcon className="w-4 h-4 text-primary" /> V2G company share price (USD)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={companyGrowth} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="Nuvve" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Wallbox" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="ChargePoint" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2">Monthly close for Nuvve (NUVV), Wallbox (WBX) and ChargePoint (CHPT).</p>
            </CardContent>
          </Card>
        </div>

        {/* Notable deals */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Notable recent deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {notableDeals.map((d) => (
                <div key={d.date + d.company} className="border border-border rounded p-3">
                  <div className="text-xs text-muted-foreground">{d.date} · {d.type}</div>
                  <div className="font-medium text-sm mt-0.5">{d.company}</div>
                  <div className="text-sm text-primary font-semibold mt-1">{d.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-muted-foreground">Loading…</div>
        ) : stats.total === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Newspaper className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-semibold mb-1">No news yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click "Refresh from GDELT" to pull the latest bidirectional-charging coverage.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Most frequent topics — full width */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Most frequent topics in news coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={Math.max(260, stats.topics.length * 28)}>
                  <BarChart data={stats.topics} layout="vertical" margin={{ left: 20, right: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" fontSize={11} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={220} fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="count" position="right" fontSize={11} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top domains + Top countries */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top media sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={Math.max(280, stats.topDomains.length * 28)}>
                    <BarChart data={stats.topDomains} layout="vertical" margin={{ left: 20, right: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" fontSize={11} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" width={170} fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="count" position="right" fontSize={11} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top countries by coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={Math.max(280, stats.topCountries.length * 28)}>
                    <BarChart data={stats.topCountries} layout="vertical" margin={{ left: 20, right: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" fontSize={11} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" width={150} fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="count" position="right" fontSize={11} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Latest articles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Latest articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {news.slice(0, 50).map((n) => (
                  <a
                    key={n.id}
                    href={n.url ?? '#'}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0 hover:bg-muted/40 rounded px-2"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm text-foreground line-clamp-2">{n.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                        <span>{extractDomain(n)}</span>
                        {extractCountry(n) && <span>· {extractCountry(n)}</span>}
                        {n.date && <span>· {n.date}</span>}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                  </a>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
}

function MetricTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">{icon}{label}</div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
}
