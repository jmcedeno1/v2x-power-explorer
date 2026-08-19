import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Newspaper,
  Radio,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  RefreshCw,
  Zap,
  Flame,
  Users,
  MessageSquare,
  ArrowRight,
  ScanSearch,
  Sparkles,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  buildActorMoves,
  buildCommunityThreads,
  buildMomentum,
  buildNarratives,
  buildSignalRows,
  domainOf,
  type CommunityThread,
  type Direction,
  type Narrative,
  type NewsItem,
  type SignalRow,
} from '@/lib/newsNarratives';
import { rankHero, type Outcome } from '@/lib/newsOutcomes';
import { marketsContent } from '@/data/moduleContent';
import { publicationsSummary } from '@/data/publicationsSummary';
import { patentsSummary } from '@/data/patentsSummary';

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

async function fetchPilotCounts() {
  const { data, error } = await supabase.from('pilots').select('status');
  if (error) return null;
  const rows = data ?? [];
  const active = rows.filter((r: any) => (r.status || 'active') === 'active').length;
  return { total: rows.length, active };
}

function extractCountry(d: NewsDoc): string | null {
  const c = d.countries?.[0];
  if (c) return c;
  const raw = d.raw as any;
  return raw?.sourcecountry || raw?.country || null;
}

const marketClaim = (() => {
  const m = marketsContent.metrics?.find((x: any) => /market/i.test(x.title));
  return m ? `${m.title}: ${m.value} ${m.subtitle ?? ''}`.trim() : null;
})();

const pubPeak = publicationsSummary.perYear.find((p) => p.year === publicationsSummary.peakYear)?.count ?? 0;
const patPeak = patentsSummary.perYear.find((p) => p.year === patentsSummary.peakYear)?.count ?? 0;
const researchClaim = `Research output keeps climbing: ${pubPeak} papers and ${patPeak} patent records in ${publicationsSummary.peakYear}`;

export default function NewsPage() {
  const [refreshing, setRefreshing] = useState(false);
  const { data: news = [], isLoading, refetch } = useQuery({ queryKey: ['news-gdelt'], queryFn: fetchNews });
  const { data: pilotCounts } = useQuery({ queryKey: ['pilot-counts'], queryFn: fetchPilotCounts });

  const refresh = async () => {
    setRefreshing(true);
    const queries = [
      'V2G', 'V2H', 'V2B', 'V2L', 'V2X charging',
      '"vehicle-to-grid"', '"vehicle-to-home"', '"vehicle-to-building"', '"vehicle-to-load"',
      '"vehicle-to-everything"', '"bidirectional charging"', '"bidirectional charger"',
      '"bidirectional EV charger"', '"bidirectional inverter" electric vehicle',
      '"two-way charging" EV', '"reverse charging" electric vehicle',
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

  const derived = useMemo(() => {
    const items = news as unknown as NewsItem[];
    const narratives = buildNarratives(items);
    const momentum = buildMomentum(items, narratives);
    const moves = buildActorMoves(items);
    const threads = buildCommunityThreads(items);
    const hero = rankHero(items as any);
    const signals = buildSignalRows(items, {
      marketClaim,
      pilotClaim: pilotCounts ? `${pilotCounts.total} pilots tracked, ${pilotCounts.active} active` : null,
      researchClaim,
    });
    return { narratives, momentum, moves, threads, hero, signals };
  }, [news, pilotCounts]);

  const heroWhyMatters = useMemo(() => {
    const o = derived.hero?.outcomes?.[0];
    if (!o) return null;
    switch (o.type) {
      case 'cost':
        return `Reads against the Markets forecast of ${marketsContent.metrics?.[0]?.value ?? 'the global V2G market'} growing to $65.84B by 2035.`;
      case 'deployments':
      case 'pilots':
        return pilotCounts
          ? `Adds to the ${pilotCounts.total} pilots tracked in the Pilots module (${pilotCounts.active} active).`
          : 'Adds to the deployment base tracked in the Pilots module.';
      case 'compensation':
      case 'savings':
        return 'Tests the revenue-stacking assumptions behind the Markets module.';
      case 'power':
      case 'efficiency':
      case 'range':
        return 'Puts a field number against the engineering figures in the Patents and Publications modules.';
      default:
        return null;
    }
  }, [derived.hero, pilotCounts]);

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Newspaper className="w-7 h-7 text-white" />}
          title="News & Media Landscape"
          description="The real-time narrative layer - momentum, framing, and community signal behind bidirectional charging, read against the app's data."
          badge={<Badge variant="outline">Bing News + Hacker News</Badge>}
        />

        <div className="flex justify-end mb-6">
          <Button onClick={refresh} disabled={refreshing} size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh (12 months, all queries)
          </Button>
        </div>

        {/* 1. Momentum band */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MomentumTile
            icon={<TrendingUp className="w-4 h-4" />}
            label="Coverage momentum"
            value={derived.momentum.changePct === null ? '-' : `${derived.momentum.changePct > 0 ? '+' : ''}${derived.momentum.changePct}%`}
            note={`${derived.momentum.label} vs prior 30 days`}
            tone={derived.momentum.label === 'heating up' ? 'up' : derived.momentum.label === 'cooling' ? 'down' : 'flat'}
          />
          <MomentumTile
            icon={<Zap className="w-4 h-4" />}
            label="Breaking (7 days)"
            value={derived.momentum.breaking7}
            note="items published this week"
          />
          <MomentumTile
            icon={<Flame className="w-4 h-4" />}
            label="Fastest-rising narrative"
            value={derived.momentum.fastestNarrative ?? '-'}
            note={derived.momentum.fastestChangePct !== null ? `+${derived.momentum.fastestChangePct}% last quarter` : 'newly emerging'}
            small
          />
          <MomentumTile
            icon={<MessageSquare className="w-4 h-4" />}
            label="Community heat"
            value={derived.momentum.communityHeat?.title ?? '-'}
            note={
              derived.momentum.communityHeat
                ? `${derived.momentum.communityHeat.points} pts · ${derived.momentum.communityHeat.comments} comments`
                : 'no discussion yet'
            }
            small
            href={derived.momentum.communityHeat?.url}
          />
        </div>

        {isLoading ? (
          <div className="text-muted-foreground">Loading…</div>
        ) : news.length === 0 ? (
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
            {/* 2. Most important development */}
            {derived.hero && <HeroHighlight hero={derived.hero} whyMatters={heroWhyMatters} />}

            {/* 3. Emerging narratives */}
            {derived.narratives.length > 0 && (
              <section className="mb-8">
                <SectionTitle
                  icon={<Sparkles className="w-4 h-4 text-primary" />}
                  title="Emerging narratives"
                  subtitle="How the story is being framed, not how much is written"
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {derived.narratives.map((n) => (
                    <NarrativeCard key={n.key} narrative={n} />
                  ))}
                </div>
              </section>
            )}

            {/* 4 + 5 side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Who's making moves
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">Organizations and the action they announced</div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {derived.moves.length === 0 && (
                    <div className="text-sm text-muted-foreground">No named-actor announcements in the current window.</div>
                  )}
                  {derived.moves.map((m) => (
                    <a
                      key={`${m.id}-${m.actor}`}
                      href={m.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="block rounded-lg px-2 py-2 hover:bg-muted/40 border-b border-border last:border-0"
                    >
                      <div className="text-sm">
                        <span className="font-semibold text-foreground">{m.actor}</span>
                        <span className="text-muted-foreground"> - {m.action}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1">{m.title}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {m.source}{m.date ? ` · ${m.date}` : ''}
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Radio className="w-4 h-4 text-primary" />
                    Community signal
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">What the practitioner community on Hacker News argues</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {derived.threads.length === 0 && (
                    <div className="text-sm text-muted-foreground">No Hacker News discussion ingested yet.</div>
                  )}
                  {derived.threads.map((t) => (
                    <CommunityRow key={t.id} thread={t} />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* 6. Signal vs. data */}
            {derived.signals.length > 0 && (
              <Card className="mb-8 border-primary/25 bg-gradient-to-br from-primary/5 via-background to-background">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ScanSearch className="w-4 h-4 text-primary" />
                    Signal vs. data
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    Does the news flow support the conclusions the other modules draw?
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {derived.signals.map((r) => (
                    <SignalRowCard key={r.module} row={r} />
                  ))}
                </CardContent>
              </Card>
            )}

            <ArticlesList news={news} />
          </>
        )}
      </div>
    </MainLayout>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">{icon}{title}</h2>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function MomentumTile({
  icon, label, value, note, tone = 'flat', small, href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  note?: string;
  tone?: 'up' | 'down' | 'flat';
  small?: boolean;
  href?: string;
}) {
  const body = (
    <CardContent className="p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">{icon}{label}</div>
      <div
        className={cn(
          'font-bold text-foreground',
          small ? 'text-sm leading-snug line-clamp-2' : 'text-2xl',
          !small && tone === 'up' && 'text-energy-green',
          !small && tone === 'down' && 'text-energy-red',
        )}
      >
        {value}
      </div>
      {note && (
        <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
          {tone === 'up' && <TrendingUp className="w-3 h-3" />}
          {tone === 'down' && <TrendingDown className="w-3 h-3" />}
          <span className="line-clamp-1">{note}</span>
        </div>
      )}
    </CardContent>
  );
  return href ? (
    <Card className="hover:border-primary/40 transition-colors">
      <a href={href} target="_blank" rel="noreferrer noopener">{body}</a>
    </Card>
  ) : (
    <Card>{body}</Card>
  );
}

const DIRECTION_META: Record<Direction, { label: string; className: string; icon: React.ElementType }> = {
  gaining: { label: 'Gaining', className: 'border-energy-green/40 text-energy-green bg-energy-green/10', icon: TrendingUp },
  steady: { label: 'Steady', className: 'border-border text-muted-foreground bg-muted/40', icon: Minus },
  fading: { label: 'Fading', className: 'border-energy-red/40 text-energy-red bg-energy-red/10', icon: TrendingDown },
};

function NarrativeCard({ narrative }: { narrative: Narrative }) {
  const dir = DIRECTION_META[narrative.direction];
  const DirIcon = dir.icon;
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm leading-snug">{narrative.name}</CardTitle>
          <Badge variant="outline" className={cn('shrink-0 text-[11px] font-normal gap-1', dir.className)}>
            <DirIcon className="w-3 h-3" />
            {dir.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{narrative.claim}</p>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <ResponsiveContainer width="100%" height={64}>
          <AreaChart data={narrative.trend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <XAxis dataKey="month" hide />
            <YAxis hide allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v: number) => [v, 'articles']} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.15}
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
        <ul className="space-y-1">
          {narrative.headlines.map((a) => (
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
                {domainOf(a)}{a.date ? ` · ${a.date}` : ''}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

const SENTIMENT_META: Record<CommunityThread['sentiment'], string> = {
  enthusiastic: 'border-energy-green/40 text-energy-green bg-energy-green/10',
  skeptical: 'border-energy-red/40 text-energy-red bg-energy-red/10',
  mixed: 'border-energy-amber/40 text-energy-amber bg-energy-amber/10',
};

function CommunityRow({ thread }: { thread: CommunityThread }) {
  return (
    <a
      href={thread.url}
      target="_blank"
      rel="noreferrer noopener"
      className="block rounded-lg border border-border p-3 hover:bg-muted/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-medium text-foreground line-clamp-2">{thread.title}</div>
        <Badge variant="outline" className={cn('shrink-0 text-[10px] font-normal capitalize', SENTIMENT_META[thread.sentiment])}>
          {thread.sentiment}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{thread.takeaway}</p>
      <div className="text-[10px] text-muted-foreground mt-1">
        {thread.points} pts · {thread.comments} comments{thread.date ? ` · ${thread.date}` : ''}
      </div>
    </a>
  );
}

const SIGNAL_META: Record<SignalRow['signal'], { label: string; className: string }> = {
  strengthening: { label: 'Strengthening', className: 'border-energy-green/40 text-energy-green bg-energy-green/10' },
  mixed: { label: 'Mixed', className: 'border-energy-amber/40 text-energy-amber bg-energy-amber/10' },
  weakening: { label: 'Weakening', className: 'border-energy-red/40 text-energy-red bg-energy-red/10' },
};

function SignalRowCard({ row }: { row: SignalRow }) {
  const meta = SIGNAL_META[row.signal];
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{row.module} says</div>
          <div className="text-sm font-semibold text-foreground">{row.claim}</div>
        </div>
        <Badge variant="outline" className={cn('shrink-0 text-[11px] font-normal', meta.className)}>
          News signal: {meta.label}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{row.reason}</p>
      <div className="mt-2 space-y-1">
        {row.headlines.map((a) => (
          <a
            key={a.id}
            href={a.url ?? '#'}
            target="_blank"
            rel="noreferrer noopener"
            className="block text-xs text-foreground hover:text-primary line-clamp-1"
          >
            {a.title}
          </a>
        ))}
      </div>
      <Link
        to={row.route}
        className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
      >
        Open {row.module} module <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

function HeroHighlight({
  hero,
  whyMatters,
}: {
  hero: { article: { id: string; title: string | null; url: string | null; date: string | null; orgs?: string[] | null; raw?: any }; outcomes: Outcome[] };
  whyMatters: string | null;
}) {
  const a = hero.article;
  return (
    <Card className="mb-8 overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
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
          {domainOf(a as NewsItem)}{a.date ? ` · ${a.date}` : ''}
        </div>
        {whyMatters && (
          <p className="mt-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Why it matters: </span>
            {whyMatters}
          </p>
        )}
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
                <span>{domainOf(n as unknown as NewsItem)}</span>
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
