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
import { ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';

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

// Sub-themes inside each topic - what the coverage is actually about.
const SUBTOPIC_PATTERNS: Record<string, { name: string; re: RegExp }[]> = {
  'V2G Pilots & Deployments': [
    { name: 'New pilot launches', re: /\b(launch|kick[- ]?off|begins|starts|unveil)/i },
    { name: 'Fleet / depot trials', re: /\b(fleet|depot|bus|truck|van)/i },
    { name: 'Utility partnerships', re: /\b(utility|utilities|partner|collaborat|agreement)/i },
    { name: 'Results & scale-up', re: /\b(result|expand|scale|success|milestone|complete)/i },
  ],
  'Investment & Funding': [
    { name: 'Venture rounds', re: /\b(series [a-e]\b|round|venture|vc\b|seed)/i },
    { name: 'Public / grant funding', re: /\b(grant|doe\b|government|public funding|subsidy|award)/i },
    { name: 'Large capex', re: /\b(billion|\$\d{3,}|plant|factory|gigafactory)/i },
    { name: 'M&A / partnerships', re: /\b(acquir|merger|stake|joint venture|partnership)/i },
  ],
  'Vehicle-to-Home (V2H)': [
    { name: 'Backup power / outages', re: /\b(backup|outage|blackout|resilien|storm|hurricane)/i },
    { name: 'Home energy management', re: /\b(hems|home energy|smart home|heat pump|tariff)/i },
    { name: 'Solar + home battery', re: /\b(solar|pv\b|home battery|powerwall)/i },
    { name: 'Products & wallboxes', re: /\b(wallbox|charger|inverter|launch|product)/i },
  ],
  'Vehicle-to-Grid (V2G)': [
    { name: 'Regulation & mandates', re: /\b(regulat|mandate|rule|law|directive|ferc|ofgem|permit)/i },
    { name: 'Agreements & partnerships', re: /\b(agreement|partner|deal|mou|contract|collaborat)/i },
    { name: 'Market participation', re: /\b(market|frequency|ancillary|balancing|bid|revenue|earn)/i },
    { name: 'Technology & standards', re: /\b(iso ?15118|chademo|ccs|standard|protocol|software|platform)/i },
  ],
  'Bidirectional Chargers': [
    { name: 'Product launches', re: /\b(launch|unveil|introduc|new charger|available)/i },
    { name: 'Certification & standards', re: /\b(certif|approv|ul ?9741|standard|compliance)/i },
    { name: 'Pricing & availability', re: /\b(price|cost|\$\d|affordab|order|ship)/i },
    { name: 'OEM integration', re: /\b(nissan|ford|hyundai|kia|bmw|volkswagen|tesla|renault|volvo|gm\b)/i },
  ],
  'Grid Services & Flexibility': [
    { name: 'Frequency response', re: /\b(frequency|fcas|primary reserve|regulation service)/i },
    { name: 'Demand response', re: /\b(demand response|peak|load shift|curtail|event)/i },
    { name: 'Market rules & access', re: /\b(market rule|prequalif|aggregat|regulat|tariff)/i },
    { name: 'Grid congestion', re: /\b(congestion|redispatch|constraint|capacity|connection queue)/i },
  ],
  'Fleet & Bus Depots': [
    { name: 'School buses', re: /\b(school bus)/i },
    { name: 'Transit buses', re: /\b(transit|city bus|coach|public transport)/i },
    { name: 'Logistics & delivery', re: /\b(logistic|delivery|last[- ]mile|parcel|van)/i },
    { name: 'Depot charging tech', re: /\b(depot|charging hub|smart charg|managed charg)/i },
  ],
  'Utilities & DSOs': [
    { name: 'Utility programs', re: /\b(program|pilot|tariff|rate|enroll|incentive)/i },
    { name: 'Grid operator rules', re: /\b(tso|iso|dso|grid operator|interconnect|prequalif)/i },
    { name: 'Regional deployments', re: /\b(ercot|caiso|pjm|national grid|state of|county)/i },
    { name: 'Flexibility procurement', re: /\b(procure|tender|auction|contract|flexibility market)/i },
  ],
  'Policy & Regulation': [
    { name: 'Mandates & standards', re: /\b(mandate|require|standard|directive|law)/i },
    { name: 'Incentives & subsidies', re: /\b(incentive|subsid|rebate|tax credit|grant)/i },
    { name: 'Tariffs & market design', re: /\b(tariff|rate design|market design|net metering|pricing)/i },
    { name: 'Permitting & interconnection', re: /\b(permit|interconnect|approval|code|inspection)/i },
  ],
  'Battery & Degradation': [
    { name: 'Degradation studies', re: /\b(degrad|state of health|soh|cycl|lifetime|wear)/i },
    { name: 'Warranty concerns', re: /\b(warrant|guarantee|liability)/i },
    { name: 'Second-life storage', re: /\b(second[- ]life|repurpos|stationary storage|recycl)/i },
    { name: 'Chemistry & performance', re: /\b(lfp|nmc|solid[- ]state|energy density|chemistry)/i },
  ],
  'Renewables Integration': [
    { name: 'Solar pairing', re: /\b(solar|pv\b|photovoltaic|rooftop)/i },
    { name: 'Wind & curtailment', re: /\b(wind|curtail|negative price|surplus)/i },
    { name: 'Microgrids & islanding', re: /\b(microgrid|island|off[- ]grid|resilien)/i },
    { name: 'Storage & balancing', re: /\b(storage|battery|balanc|flexibility|dispatch)/i },
  ],
  'OEMs & Automakers': [
    { name: 'Model announcements', re: /\b(new|launch|unveil|model|202\d [a-z]+|debut)/i },
    { name: 'Software / OTA features', re: /\b(software|ota|update|app|enable)/i },
    { name: 'Home energy ecosystems', re: /\b(home|wallbox|energy service|ecosystem|solar)/i },
    { name: 'Grid partnerships', re: /\b(partner|utility|aggregat|grid|pilot)/i },
  ],
  'Standards (ISO 15118, CHAdeMO)': [
    { name: 'ISO 15118 / -20', re: /\b(iso ?15118|15118[- ]?20)/i },
    { name: 'CHAdeMO & DC', re: /\b(chademo|dc\b|chaoji)/i },
    { name: 'CCS & AC bidirectional', re: /\b(ccs|combo|ac bidirectional|type 2)/i },
    { name: 'OCPP / interoperability', re: /\b(ocpp|open ?charge|interoperab|plug ?and ?charge)/i },
  ],
  'Charger / Hardware Vendors': [
    { name: 'Product releases', re: /\b(launch|release|unveil|new|announc)/i },
    { name: 'Certification', re: /\b(certif|ul ?9741|approv|listed)/i },
    { name: 'Partnerships', re: /\b(partner|deal|agreement|collaborat|integrat)/i },
    { name: 'Funding & growth', re: /\b(funding|raise|round|expand|invest)/i },
  ],
};

const SUB_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--energy-amber))',
  'hsl(var(--energy-blue))',
  'hsl(var(--energy-green))',
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
      // Hacker News (Algolia) — one call sweeps the taxonomy internally.
      try {
        const { data } = await supabase.functions.invoke('import-hn', { body: {} });
        fetched += data?.fetched ?? 0;
        upserted += data?.upserted ?? 0;
      } catch { failed++; }
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
    const topicQuarters = new Map<string, Map<string, number>>();
    const topicSources = new Map<string, Map<string, number>>();
    const topicArticles = new Map<string, NewsDoc[]>();
    // topic -> subtopic -> quarter -> count
    const topicSubs = new Map<string, Map<string, Map<string, number>>>();
    const allQuarters = new Set<string>();


    for (const n of news) {
      const month = n.date ? n.date.slice(0, 7) : null;
      const quarter = month ? `${month.slice(0, 4)} Q${Math.floor((Number(month.slice(5, 7)) - 1) / 3) + 1}` : null;
      if (quarter) allQuarters.add(quarter);
      if (month) byMonth.set(month, (byMonth.get(month) ?? 0) + 1);
      const title = n.title ?? '';
      const text = `${title} ${n.abstract ?? ''}`;
      const dom = extractDomain(n);
      for (const t of TOPIC_PATTERNS) {
        if (!t.re.test(title)) continue;
        topicCounts.set(t.name, (topicCounts.get(t.name) ?? 0) + 1);
        if (month) {
          const m = topicMonths.get(t.name) ?? new Map<string, number>();
          m.set(month, (m.get(month) ?? 0) + 1);
          topicMonths.set(t.name, m);
        }
        if (quarter) {
          const q = topicQuarters.get(t.name) ?? new Map<string, number>();
          q.set(quarter, (q.get(quarter) ?? 0) + 1);
          topicQuarters.set(t.name, q);
        }

        const s = topicSources.get(t.name) ?? new Map<string, number>();
        s.set(dom, (s.get(dom) ?? 0) + 1);
        topicSources.set(t.name, s);
        const arr = topicArticles.get(t.name) ?? [];
        if (arr.length < 3) arr.push(n);
        topicArticles.set(t.name, arr);

        const subs = SUBTOPIC_PATTERNS[t.name] ?? [];
        if (quarter && subs.length) {
          const bySub = topicSubs.get(t.name) ?? new Map<string, Map<string, number>>();
          for (const sub of subs) {
            if (!sub.re.test(text)) continue;
            const q = bySub.get(sub.name) ?? new Map<string, number>();
            q.set(quarter, (q.get(quarter) ?? 0) + 1);
            bySub.set(sub.name, q);
          }
          topicSubs.set(t.name, bySub);
        }
      }
    }

    const allMonths = [...byMonth.keys()].sort();
    const quarters = [...allQuarters].sort();
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

        const bySub = topicSubs.get(name) ?? new Map<string, Map<string, number>>();
        const subNames = (SUBTOPIC_PATTERNS[name] ?? [])
          .map((s) => s.name)
          .filter((s) => (bySub.get(s)?.size ?? 0) > 0);
        const subSeries = quarters.map((q) => {
          const row: Record<string, string | number> = { quarter: q };
          for (const s of subNames) row[s] = bySub.get(s)?.get(q) ?? 0;
          return row;
        });
        const subTotals = subNames
          .map((s) => ({ name: s, count: [...(bySub.get(s) ?? new Map()).values()].reduce((a, b) => a + b, 0) }))
          .sort((a, b) => b.count - a.count);

        return { name, count, trend, sources, articles, subNames, subSeries, subTotals };
      });

    const last30 = news.filter((n) => {
      if (!n.date) return false;
      const dt = new Date(n.date).getTime();
      return Date.now() - dt < 30 * 24 * 3600 * 1000;
    }).length;

    const uniqueDomains = new Set(news.map(extractDomain)).size;
    const uniqueCountries = new Set(news.map(extractCountry).filter(Boolean) as string[]).size;

    const hnStories = news
      .filter((n) => (n.raw as any)?.provider === 'hn')
      .map((n) => ({
        id: n.id,
        title: n.title ?? '',
        url: n.url ?? '#',
        date: n.date,
        points: Number((n.raw as any)?.points ?? 0),
        num_comments: Number((n.raw as any)?.num_comments ?? 0),
      }))
      .sort((a, b) => b.points - a.points);

    return { total, topics, last30, uniqueDomains, uniqueCountries, hnStories };
  }, [news]);

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Newspaper className="w-7 h-7 text-white" />}
          title="News & Media Landscape"
          description="Bidirectional charging news and discussion aggregated from Bing News and Hacker News - all charts derived from ingested items"
          badge={<Badge variant="outline">Bing News + Hacker News</Badge>}
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
                — sub-themes covered inside each topic, from ingested articles
              </span>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
              {stats.topics.map((t) => {
                const share = stats.total ? Math.round((t.count / stats.total) * 100) : 0;
                return (
                  <Card key={t.name} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm leading-snug">{t.name}</CardTitle>
                        <Badge variant="secondary" className="shrink-0">{t.count}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {share}% of coverage{t.subTotals[0] ? ` · lead sub-theme: ${t.subTotals[0].name}` : ''}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      {t.subNames.length > 0 ? (
                        <>
                          <ResponsiveContainer width="100%" height={130}>
                            <LineChart data={t.subSeries} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="quarter" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} interval="preserveStartEnd" />
                              <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                              <Tooltip contentStyle={{ fontSize: 11, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                              {t.subNames.map((s, i) => (
                                <Line
                                  key={s}
                                  type="monotone"
                                  dataKey={s}
                                  stroke={SUB_COLORS[i % SUB_COLORS.length]}
                                  strokeWidth={1.8}
                                  dot={{ r: 2 }}
                                />
                              ))}
                            </LineChart>
                          </ResponsiveContainer>
                          <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {t.subTotals.map((s) => {
                              const idx = t.subNames.indexOf(s.name);
                              return (
                                <div key={s.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                  <span
                                    className="w-2.5 h-0.5 rounded"
                                    style={{ background: SUB_COLORS[idx % SUB_COLORS.length] }}
                                  />
                                  {s.name} <span className="tabular-nums">{s.count}</span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-muted-foreground py-6 text-center">
                          No sub-theme signal detected yet
                        </div>
                      )}


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

            {/* Hacker News discussion */}
            {stats.hnStories.length > 0 && (
              <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Radio className="w-4 h-4 text-primary" />
                    Hacker News discussion
                  </CardTitle>
                  <Badge variant="secondary">{stats.hnStories.length} stories</Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.hnStories.slice(0, 10).map((s) => (
                    <a key={s.id} href={s.url} target="_blank" rel="noreferrer noopener"
                       className="block hover:bg-muted/40 rounded px-2 py-1.5">
                      <div className="text-sm font-medium line-clamp-2">{s.title}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {s.points} pts · {s.num_comments} comments{s.date ? ` · ${s.date}` : ''}
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}

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
