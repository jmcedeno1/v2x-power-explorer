import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Newspaper, Globe, Radio, TrendingUp, ExternalLink, RefreshCw, Calendar } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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
  LabelList,
} from 'recharts';

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

// Topics detected from article titles. Grouped so charts communicate more than
// generic terms — each group counts an article once per group.
const TOPIC_PATTERNS: { name: string; re: RegExp }[] = [
  { name: 'V2G Pilots & Deployments', re: /\b(pilot|trial|deploy|launch|rollout|demonstrat)/i },
  { name: 'Investment & Funding', re: /\b(invest|funding|raise|series [a-e]\b|round|million|billion|\$\d)/i },
  { name: 'Vehicle-to-Home (V2H)', re: /\b(v2h|vehicle[- ]to[- ]home|home backup|power outage|blackout)/i },
  { name: 'Vehicle-to-Grid (V2G)', re: /\b(v2g|vehicle[- ]to[- ]grid)/i },
  { name: 'Bidirectional Chargers', re: /\b(bidirectional|two[- ]way|reverse)\b.*(charg|inverter|power)/i },
  { name: 'Grid Services & Flexibility', re: /\b(grid service|flexibility|frequency|balancing|ancillary|redispatch|demand response)/i },
  { name: 'Fleet & Bus Depots', re: /\b(fleet|bus depot|school bus|logistics|delivery)/i },
  { name: 'Utilities & DSOs', re: /\b(utility|utilities|dso|tso|grid operator|iso[- ]ne|ercot|caiso)/i },
  { name: 'Policy & Regulation', re: /\b(regulation|policy|tariff|incentive|subsidy|mandate|ferc|doe)/i },
  { name: 'Battery & Degradation', re: /\b(battery|degradation|state of health|soh|cycl|second[- ]life)/i },
  { name: 'Renewables Integration', re: /\b(solar|wind|renewable|pv|photovoltaic|microgrid)/i },
  { name: 'OEMs & Automakers', re: /\b(nissan|ford|hyundai|kia|bmw|volkswagen|\bgm\b|tesla|renault|volvo|stellantis|honda|mercedes)/i },
  { name: 'Standards (ISO 15118, CHAdeMO)', re: /\b(iso ?15118|chademo|ccs|open ?charge|ocpp)/i },
  { name: 'Charger / Hardware Vendors', re: /\b(wallbox|dcbel|enphase|emporia|fermata|the mobility house|nuvve|indra|delta)/i },
];

const COMPANIES = ['Nuvve', 'Wallbox', 'Fermata', 'The Mobility House', 'dcbel', 'Enphase', 'ChargePoint', 'Emporia', 'Indra'];

async function fetchNews(): Promise<NewsDoc[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('id,title,url,date,year,orgs,countries,raw')
    .eq('source', 'gdelt')
    .order('date', { ascending: false })
    .limit(2000);
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
    const queries = [
      'V2G', 'vehicle-to-grid', 'bidirectional charging', 'Nuvve', 'V2H',
      'vehicle-to-home', 'Wallbox V2G', 'Fermata Energy', 'V2G pilot',
      'V2G investment', 'bidirectional EV', 'V2G fleet',
    ];
    let fetched = 0, upserted = 0, rateLimited = 0;
    for (const q of queries) {
      try {
        const { data, error } = await supabase.functions.invoke('import-gdelt', {
          body: { query: q, timespan: '12months', maxrecords: 250 },
        });
        if (error) { rateLimited++; continue; }
        fetched += data?.fetched ?? 0;
        upserted += data?.upserted ?? 0;
      } catch { rateLimited++; }
      // GDELT allows ~1 req per 5s. Pace client-side too.
      await new Promise((r) => setTimeout(r, 6000));
    }
    if (upserted > 0) toast.success(`Fetched ${fetched} articles, stored ${upserted} new${rateLimited ? ` (${rateLimited} queries rate-limited)` : ''}`);
    else toast.error(`GDELT rate-limited every query. Try again in a minute.`);
    await refetch();
    setRefreshing(false);
  };

  const stats = useMemo(() => {
    const total = news.length;
    const domains = new Map<string, number>();
    const countries = new Map<string, number>();
    const byMonth = new Map<string, number>();
    const topicCounts = new Map<string, number>();
    const companyCounts = new Map<string, number>();
    const pilotByMonth = new Map<string, number>();
    const investmentByMonth = new Map<string, number>();

    const pilotRe = TOPIC_PATTERNS.find((t) => t.name.startsWith('V2G Pilots'))!.re;
    const investRe = TOPIC_PATTERNS.find((t) => t.name.startsWith('Investment'))!.re;

    for (const n of news) {
      const dom = extractDomain(n);
      domains.set(dom, (domains.get(dom) ?? 0) + 1);
      const c = extractCountry(n);
      if (c) countries.set(c, (countries.get(c) ?? 0) + 1);
      const month = n.date ? n.date.slice(0, 7) : null;
      if (month) byMonth.set(month, (byMonth.get(month) ?? 0) + 1);
      const title = n.title ?? '';
      for (const t of TOPIC_PATTERNS) {
        if (t.re.test(title)) topicCounts.set(t.name, (topicCounts.get(t.name) ?? 0) + 1);
      }
      for (const co of COMPANIES) {
        if (new RegExp(`\\b${co}\\b`, 'i').test(title)) {
          companyCounts.set(co, (companyCounts.get(co) ?? 0) + 1);
        }
      }
      if (month && pilotRe.test(title)) pilotByMonth.set(month, (pilotByMonth.get(month) ?? 0) + 1);
      if (month && investRe.test(title)) investmentByMonth.set(month, (investmentByMonth.get(month) ?? 0) + 1);
    }

    const sortedMonths = [...new Set([...byMonth.keys(), ...pilotByMonth.keys(), ...investmentByMonth.keys()])].sort();
    const pilotsTimeline = sortedMonths.map((m) => ({ month: m, count: pilotByMonth.get(m) ?? 0 }));
    const investmentTimeline = sortedMonths.map((m) => ({ month: m, count: investmentByMonth.get(m) ?? 0 }));

    const topDomains = [...domains.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([name, count]) => ({ name, count }));
    const topCountries = [...countries.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([name, count]) => ({ name, count }));
    const topics = [...topicCounts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
    const companies = [...companyCounts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));

    const last30 = news.filter((n) => {
      if (!n.date) return false;
      const dt = new Date(n.date).getTime();
      return Date.now() - dt < 30 * 24 * 3600 * 1000;
    }).length;

    return { total, topDomains, topCountries, topics, companies, pilotsTimeline, investmentTimeline, last30, uniqueDomains: domains.size, uniqueCountries: countries.size };
  }, [news]);

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Newspaper className="w-7 h-7 text-white" />}
          title="News & Media Landscape"
          description="Bidirectional charging news aggregated from GDELT global media monitoring — all charts derived from ingested articles"
          badge={<Badge variant="outline">GDELT 2.0</Badge>}
        />

        <div className="flex justify-end mb-6">
          <Button onClick={refresh} disabled={refreshing} size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh (12 months, all queries)
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricTile icon={<Newspaper className="w-4 h-4" />} label="Total Articles" value={stats.total} />
          <MetricTile icon={<Calendar className="w-4 h-4" />} label="Last 30 Days" value={stats.last30} />
          <MetricTile icon={<Radio className="w-4 h-4" />} label="Media Sources" value={stats.uniqueDomains} />
          <MetricTile icon={<Globe className="w-4 h-4" />} label="Countries" value={stats.uniqueCountries} />
        </div>

        {isLoading ? (
          <div className="text-muted-foreground">Loading…</div>
        ) : stats.total === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Newspaper className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-semibold mb-1">No news yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click "Refresh" to pull the latest bidirectional-charging coverage.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Most frequent topics — full width */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-4 h-4 text-primary" /> Most frequent topics in coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={Math.max(260, stats.topics.length * 30)}>
                  <BarChart data={stats.topics} layout="vertical" margin={{ left: 20, right: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis type="number" fontSize={11} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={230} fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="count" position="right" fontSize={11} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground mt-2">Count of ingested article titles matching each topic pattern. Articles can match multiple topics.</p>
              </CardContent>
            </Card>

            {/* Pilots and Investment mentions over time */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Articles about new pilots / deployments (per month)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={stats.pilotsTimeline}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" fontSize={11} />
                      <YAxis fontSize={11} allowDecimals={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-2">Titles containing "pilot", "trial", "deploy", "launch", "rollout" or "demonstrat".</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Articles about investment / funding (per month)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={stats.investmentTimeline}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" fontSize={11} />
                      <YAxis fontSize={11} allowDecimals={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.25} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-2">Titles mentioning "invest", "funding", "raise", "round", "series A-E" or a dollar amount.</p>
                </CardContent>
              </Card>
            </div>

            {/* Companies mentions */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">V2G companies mentioned in coverage</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.companies.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tracked company names detected in current article titles.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={Math.max(220, stats.companies.length * 32)}>
                    <BarChart data={stats.companies} layout="vertical" margin={{ left: 20, right: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" fontSize={11} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" width={170} fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                        <LabelList dataKey="count" position="right" fontSize={11} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
                <p className="text-xs text-muted-foreground mt-2">Article titles matching Nuvve, Wallbox, Fermata, The Mobility House, dcbel, Enphase, ChargePoint, Emporia, Indra.</p>
              </CardContent>
            </Card>

            {/* Top domains + Top countries */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Top media sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={Math.max(280, stats.topDomains.length * 30)}>
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
                  <ResponsiveContainer width="100%" height={Math.max(280, stats.topCountries.length * 30)}>
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
