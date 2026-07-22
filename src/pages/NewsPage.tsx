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
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

type NewsDoc = {
  id: string;
  title: string | null;
  abstract: string | null;
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

const RELEVANCE_RE = /\b(v2g|v2h|v2b|v2l|v2x|vehicle[- ]to[- ](grid|home|building|load|everything|x)|bidirectional (charg|ev|inverter|power)|two[- ]way charg|reverse charg)\b/i;
const OFF_TOPIC_RE = /\b(business jet|private jet|bombardier|saudi contract|aviation|airline|aircraft|football|soccer|basketball|baseball|celebrity|movie|film festival)\b/i;

async function fetchNews(): Promise<NewsDoc[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('id,title,abstract,url,date,year,orgs,countries,raw')
    .eq('source', 'gdelt')
    .order('date', { ascending: false })
    .limit(2000);
  if (error) throw error;
  return ((data ?? []) as NewsDoc[]).filter((d) => {
    if (!d.title) return false;
    const raw = d.raw as any;
    const textForFilter = `${d.title} ${d.abstract ?? ''} ${d.url ?? ''} ${raw?.gdelt_query ?? ''}`;
    return RELEVANCE_RE.test(textForFilter) && !OFF_TOPIC_RE.test(textForFilter);
  });
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
    // Bidirectional charging taxonomy — Bing News RSS. Uses individual terms
    // (Bing's OR/quotes handling is weaker than Google's).
    const queries = [
      'V2G',
      'V2H',
      'V2B',
      'V2L',
      'V2X charging',
      '"vehicle-to-grid"',
      '"vehicle-to-home"',
      '"vehicle-to-building"',
      '"vehicle-to-load"',
      '"vehicle-to-everything"',
      '"bidirectional charging"',
      '"bidirectional charger"',
      '"bidirectional EV charger"',
      '"bidirectional inverter" electric vehicle',
      '"two-way charging" EV',
      '"reverse charging" electric vehicle',
    ];
    let fetched = 0, upserted = 0, failed = 0;
    try {
      for (const q of queries) {
        try {
          const { data, error } = await supabase.functions.invoke('import-google-news', {
            body: { query: q, when: '12m' },
          });
          if (error) { failed++; continue; }
          fetched += data?.fetched ?? 0;
          upserted += data?.upserted ?? 0;
        } catch { failed++; }
      }
    } finally {
      setRefreshing(false);
    }
    if (upserted > 0) toast.success(`Fetched ${fetched} articles, stored ${upserted} new${failed ? ` (${failed} queries failed)` : ''}`);
    else if (failed > 0) toast.warning(`Some queries failed. Existing news remains available.`);
    else toast.info(`No new articles found (all already stored).`);
    await refetch();
  };

  const stats = useMemo(() => {
    const total = news.length;
    const byMonth = new Map<string, number>();
    const topicCounts = new Map<string, number>();
    const topicMonths = new Map<string, Map<string, number>>();
    const topicSources = new Map<string, Map<string, number>>();
    const topicArticles = new Map<string, NewsDoc[]>();

    for (const n of news) {
      const month = n.date ? n.date.slice(0, 7) : null;
      if (month) byMonth.set(month, (byMonth.get(month) ?? 0) + 1);
      const title = n.title ?? '';
      const dom = extractDomain(n);
      for (const t of TOPIC_PATTERNS) {
        if (!t.re.test(title)) continue;
        topicCounts.set(t.name, (topicCounts.get(t.name) ?? 0) + 1);
        if (month) {
          const m = topicMonths.get(t.name) ?? new Map<string, number>();
          m.set(month, (m.get(month) ?? 0) + 1);
          topicMonths.set(t.name, m);
        }
        const s = topicSources.get(t.name) ?? new Map<string, number>();
        s.set(dom, (s.get(dom) ?? 0) + 1);
        topicSources.set(t.name, s);
        const arr = topicArticles.get(t.name) ?? [];
        if (arr.length < 3) arr.push(n);
        topicArticles.set(t.name, arr);
      }
    }

    const allMonths = [...byMonth.keys()].sort();
    const topics = [...topicCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => {
        const monthMap = topicMonths.get(name) ?? new Map<string, number>();
        const trend = allMonths.map((m) => ({ month: m, count: monthMap.get(m) ?? 0 }));
        const sources = [...(topicSources.get(name) ?? new Map<string, number>()).entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([n, c]) => ({ name: n, count: c as number }));
        const articles = topicArticles.get(name) ?? [];
        return { name, count, trend, sources, articles };
      });

    const last30 = news.filter((n) => {
      if (!n.date) return false;
      const dt = new Date(n.date).getTime();
      return Date.now() - dt < 30 * 24 * 3600 * 1000;
    }).length;

    const uniqueDomains = new Set(news.map(extractDomain)).size;
    const uniqueCountries = new Set(news.map(extractCountry).filter(Boolean) as string[]).size;

    return { total, topics, last30, uniqueDomains, uniqueCountries };
  }, [news]);

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Newspaper className="w-7 h-7 text-white" />}
          title="News & Media Landscape"
          description="Bidirectional charging news aggregated from Bing News — all charts derived from ingested articles"
          badge={<Badge variant="outline">Bing News</Badge>}
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
            {/* Topic breakdown cards */}
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold">Most frequent topics in coverage</h2>
              <span className="text-xs text-muted-foreground">
                — one visual per topic, built from ingested article titles
              </span>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
              {stats.topics.map((t) => {
                const share = stats.total ? Math.round((t.count / stats.total) * 100) : 0;
                const peak = t.trend.reduce((a, b) => (b.count > a.count ? b : a), { month: '', count: 0 });
                return (
                  <Card key={t.name} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm leading-snug">{t.name}</CardTitle>
                        <Badge variant="secondary" className="shrink-0">{t.count}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {share}% of coverage{peak.month ? ` · peak ${peak.month}` : ''}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <ResponsiveContainer width="100%" height={80}>
                        <AreaChart data={t.trend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                          <XAxis dataKey="month" hide />
                          <YAxis hide allowDecimals={false} />
                          <Tooltip
                            contentStyle={{ fontSize: 11 }}
                            formatter={(v: number) => [v, 'articles']}
                            labelFormatter={(l) => String(l)}
                          />
                          <Area
                            type="monotone"
                            dataKey="count"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.2}
                            strokeWidth={1.5}
                          />
                        </AreaChart>
                      </ResponsiveContainer>

                      {t.sources.length > 0 && (
                        <div>
                          <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                            Top sources
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {t.sources.map((s) => (
                              <Badge key={s.name} variant="outline" className="text-[11px] font-normal">
                                {s.name} <span className="ml-1 text-muted-foreground">{s.count}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {t.articles.length > 0 && (
                        <div>
                          <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
                            Example headlines
                          </div>
                          <ul className="space-y-1">
                            {t.articles.map((a) => (
                              <li key={a.id} className="text-xs leading-snug">
                                <a
                                  href={a.url ?? '#'}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="text-foreground hover:text-primary line-clamp-2"
                                >
                                  {a.title}
                                </a>
                                <div className="text-[10px] text-muted-foreground">
                                  {extractDomain(a)}{a.date ? ` · ${a.date}` : ''}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>


            {/* Latest articles */}
            <ArticlesList news={news} />

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

function ArticlesList({ news }: { news: NewsDoc[] }) {
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(news.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const items = news.slice(start, start + PAGE_SIZE);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Latest articles</CardTitle>
        <div className="text-xs text-muted-foreground">
          {news.length === 0 ? '0 articles' : `${start + 1}–${start + items.length} of ${news.length}`}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((n) => (
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" disabled={current === 1} onClick={() => setPage(current - 1)}>
              Previous
            </Button>
            <div className="text-xs text-muted-foreground">Page {current} of {totalPages}</div>
            <Button variant="outline" size="sm" disabled={current === totalPages} onClick={() => setPage(current + 1)}>
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
