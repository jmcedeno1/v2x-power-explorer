import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Newspaper, Globe, Radio, TrendingUp, TrendingDown, Minus, ExternalLink, RefreshCw, Calendar, ChevronDown, Sparkles } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { OUTCOME_META, OUTCOME_SECTIONS, groupOutcomes, outcomesFor, rankHero, type Outcome } from '@/lib/newsOutcomes';
import { OUTCOME_TOPIC_META, groupByOutcomeTopic, type TopicGroup } from '@/lib/newsOutcomeTopics';

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
  const [sort, setSort] = useState<'count' | 'alpha'>('count');
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
    const topicSources = new Map<string, Map<string, number>>();
    const topicArticles = new Map<string, NewsDoc[]>();
    const topicAll = new Map<string, NewsDoc[]>();

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
        const all = topicAll.get(t.name) ?? [];
        all.push(n);
        topicAll.set(t.name, all);
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
        const outcomes = outcomesFor(topicAll.get(name) ?? [], 4);
        return { name, count, trend, sources, articles, outcomes };
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

    const hero = rankHero(news);
    const outcomeGroups = groupOutcomes(news);
    const topicGroups = groupByOutcomeTopic(news);

    return { total, topics, last30, uniqueDomains, uniqueCountries, hnStories, hero, outcomeGroups, topicGroups };
  }, [news]);

  const outcomeTopics = useMemo(() => {
    const g = [...stats.topicGroups];
    return sort === 'alpha'
      ? g.sort((a, b) => a.label.localeCompare(b.label))
      : g.sort((a, b) => b.count - a.count);
  }, [stats.topicGroups, sort]);


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
            {/* Hero highlight */}
            {stats.hero && <HeroHighlight hero={stats.hero} />}

            {/* Sort toggle */}
            <div className="flex items-center gap-2 mb-4">
              <div className="inline-flex rounded-lg border border-border p-1 bg-muted/30">
                <Button
                  size="sm"
                  variant={sort === 'count' ? 'default' : 'ghost'}
                  className="h-7 px-3 text-xs"
                  onClick={() => setSort('count')}
                >
                  Most covered
                </Button>
                <Button
                  size="sm"
                  variant={sort === 'alpha' ? 'default' : 'ghost'}
                  className="h-7 px-3 text-xs"
                  onClick={() => setSort('alpha')}
                >
                  A–Z
                </Button>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Coverage grouped by the outcome each article reports
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
              {stats.outcomeTopics.map((g) => (
                <OutcomeTopicCard key={g.topic} group={g} />
              ))}
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

function DirectionIcon({ direction }: { direction?: Outcome['direction'] }) {
  if (direction === 'up') return <TrendingUp className="w-3 h-3" />;
  if (direction === 'down') return <TrendingDown className="w-3 h-3" />;
  if (direction === 'flat') return <Minus className="w-3 h-3" />;
  return null;
}

function StatTile({ outcome, size = 'sm' }: { outcome: Outcome; size?: 'sm' | 'lg' }) {
  const meta = OUTCOME_META[outcome.type];
  return (
    <a
      href={outcome.article.url ?? '#'}
      target="_blank"
      rel="noreferrer noopener"
      className={cn('block rounded-lg border p-2.5 transition-colors hover:bg-muted/40', meta.ring)}
    >
      <div className={cn('font-bold leading-none', meta.accent, size === 'lg' ? 'text-2xl' : 'text-lg')}>
        {outcome.value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground line-clamp-1">
        {outcome.label}
      </div>
      <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground line-clamp-1">
        <DirectionIcon direction={outcome.direction} />
        <span className="truncate">{outcome.note}</span>
      </div>
    </a>
  );
}

function HeroHighlight({ hero }: { hero: { article: OutcomeArticleLike; outcomes: Outcome[] } }) {
  const a = hero.article;
  return (
    <Card className="mb-6 overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
      <CardContent className="p-5 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Most important development
          </span>
        </div>
        <a
          href={a.url ?? '#'}
          target="_blank"
          rel="noreferrer noopener"
          className="block text-lg md:text-2xl font-bold leading-snug text-foreground hover:text-primary"
        >
          {a.title}
        </a>
        <div className="mt-2 text-xs text-muted-foreground">
          {extractDomain(a as NewsDoc)}{a.date ? ` · ${a.date}` : ''}
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {hero.outcomes.slice(0, 4).map((o) => (
            <StatTile key={o.type} outcome={o} size="lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type OutcomeArticleLike = { id: string; title: string | null; url: string | null; date: string | null; orgs?: string[] | null; raw?: any };

function OutcomeLens({ groups }: { groups: Map<Outcome['type'], Outcome[]> }) {
  const sections = OUTCOME_SECTIONS.filter((s) => (groups.get(s.type) ?? []).length > 0);
  if (sections.length === 0) {
    return <div className="text-sm text-muted-foreground mb-6">No numeric outcomes detected yet.</div>;
  }
  return (
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      {sections.map((s) => {
        const items = groups.get(s.type)!;
        const meta = OUTCOME_META[s.type];
        return (
          <Card key={s.type}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className={cn('text-sm', meta.accent)}>{s.title}</CardTitle>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.description}</div>
                </div>
                <Badge variant="secondary" className="shrink-0">{items.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {items.slice(0, 2).map((o) => (
                  <StatTile key={o.article.id} outcome={o} size="lg" />
                ))}
              </div>
              <ul className="space-y-1">
                {items.slice(0, 2).map((o) => (
                  <li key={`h-${o.article.id}`} className="text-xs leading-snug">
                    <a
                      href={o.article.url ?? '#'}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-foreground hover:text-primary line-clamp-2"
                    >
                      {o.article.title}
                    </a>
                    <div className="text-[10px] text-muted-foreground">{o.note}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
