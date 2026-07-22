import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Activity, Search, TrendingUp, Sparkles, HelpCircle, RefreshCw, DollarSign, Target, BarChart3,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

const DEFAULT_KEYWORDS = [
  'bidirectional charging',
  'V2G',
  'vehicle-to-grid',
  'vehicle-to-home',
  'V2H',
  'V2L',
];

const DATABASES = [
  { code: 'us', label: 'United States' },
  { code: 'uk', label: 'United Kingdom' },
  { code: 'de', label: 'Germany' },
  { code: 'fr', label: 'France' },
  { code: 'es', label: 'Spain' },
  { code: 'jp', label: 'Japan' },
  { code: 'au', label: 'Australia' },
  { code: 'ca', label: 'Canada' },
];

type FetchResult<T> = { ok: boolean; data?: T; error?: string };

async function callTrends<T>(source: string, keyword: string, database: string): Promise<FetchResult<T>> {
  const { data, error } = await supabase.functions.invoke('fetch-trends', {
    body: { source, keyword, database },
  });
  if (error) return { ok: false, error: error.message };
  if (!data?.ok) return { ok: false, error: data?.error ?? 'unknown' };
  return { ok: true, data: data.data as T };
}

type Overview = {
  keyword: string; database: string;
  volume: number; cpc: number; competition: number; results: number;
  trend: { month: number; value: number }[];
};
type Related = { keyword: string; items: { phrase: string; volume: number; cpc: number; competition: number; difficulty: number }[] };
type Questions = { keyword: string; items: { phrase: string; volume: number; cpc: number; difficulty: number }[] };
type AutoRes = { keyword: string; suggestions: string[]; questions: string[] };

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function difficultyColor(kd: number) {
  if (kd < 30) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400';
  if (kd < 50) return 'bg-amber-500/15 text-amber-700 dark:text-amber-400';
  if (kd < 70) return 'bg-orange-500/15 text-orange-700 dark:text-orange-400';
  return 'bg-red-500/15 text-red-700 dark:text-red-400';
}

export default function TrendsPage() {
  const [keyword, setKeyword] = useState('bidirectional charging');
  const [submitted, setSubmitted] = useState('bidirectional charging');
  const [database, setDatabase] = useState('us');

  const ov = useQuery({
    queryKey: ['trends', 'overview', submitted, database],
    queryFn: () => callTrends<Overview>('semrush_overview', submitted, database),
    staleTime: 5 * 60_000,
  });
  const rel = useQuery({
    queryKey: ['trends', 'related', submitted, database],
    queryFn: () => callTrends<Related>('semrush_related', submitted, database),
    staleTime: 5 * 60_000,
  });
  const qs = useQuery({
    queryKey: ['trends', 'questions', submitted, database],
    queryFn: () => callTrends<Questions>('semrush_questions', submitted, database),
    staleTime: 5 * 60_000,
  });
  const ac = useQuery({
    queryKey: ['trends', 'autocomplete', submitted],
    queryFn: () => callTrends<AutoRes>('autocomplete', submitted, database),
    staleTime: 5 * 60_000,
  });

  const refetchAll = () => { ov.refetch(); rel.refetch(); qs.refetch(); ac.refetch(); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(keyword.trim() || 'bidirectional charging');
  };

  const trendSeries = useMemo(() => {
    const t = ov.data?.data?.trend ?? [];
    return t.map((p) => ({ month: MONTH_LABELS[(p.month - 1) % 12], value: p.value }));
  }, [ov.data]);

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Activity className="w-7 h-7 text-white" />}
          title="Search & Interest Trends"
          description="User interest in bidirectional charging: search volume, cost-per-click, competition, related keywords and questions. Powered by Semrush."
          badge={<Badge variant="outline">Semrush · Google Autocomplete</Badge>}
        />

        <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-2 mb-6">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Keyword (e.g. bidirectional charging)"
            className="max-w-xs"
          />
          <Select value={database} onValueChange={(v) => setDatabase(v)}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DATABASES.map((d) => <SelectItem key={d.code} value={d.code}>{d.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button type="submit" size="sm"><Search className="w-4 h-4 mr-2" />Analyze</Button>
          <Button type="button" size="sm" variant="outline" onClick={refetchAll}>
            <RefreshCw className="w-4 h-4 mr-2" />Refresh
          </Button>
          <div className="flex flex-wrap gap-1 ml-2">
            {DEFAULT_KEYWORDS.map((k) => (
              <Button
                key={k} type="button" variant="ghost" size="sm"
                className="h-7 text-xs"
                onClick={() => { setKeyword(k); setSubmitted(k); }}
              >{k}</Button>
            ))}
          </div>
        </form>

        {/* Overview metrics */}
        {ov.isLoading && <SkeletonBlock label="Fetching Semrush data…" />}
        {ov.data?.error && <ErrorBlock label="Semrush overview" msg={ov.data.error} />}
        {ov.data?.ok && ov.data.data && (
          <>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <MetricTile
                icon={<BarChart3 className="w-4 h-4" />}
                label="Monthly search volume"
                value={ov.data.data.volume.toLocaleString()}
                hint={interestBand(ov.data.data.volume)}
              />
              <MetricTile
                icon={<DollarSign className="w-4 h-4" />}
                label="Avg. cost-per-click"
                value={`$${ov.data.data.cpc.toFixed(2)}`}
                hint={ov.data.data.cpc > 1 ? 'High commercial intent' : 'Informational intent'}
              />
              <MetricTile
                icon={<Target className="w-4 h-4" />}
                label="Ads competition"
                value={`${Math.round(ov.data.data.competition * 100)}%`}
                hint={competitionBand(ov.data.data.competition)}
              />
              <MetricTile
                icon={<TrendingUp className="w-4 h-4" />}
                label="SERP results"
                value={compactNumber(ov.data.data.results)}
                hint="Pages indexed for this term"
              />
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">12-month interest trend — "{ov.data.data.keyword}"</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground mb-2">
                  Relative search interest (0-100), Semrush {ov.data.data.database.toUpperCase()} database, last 12 months.
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={trendSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" fontSize={11} />
                    <YAxis fontSize={11} domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        <Tabs defaultValue="related" className="space-y-4">
          <TabsList>
            <TabsTrigger value="related"><Sparkles className="w-4 h-4 mr-2" />Related keywords</TabsTrigger>
            <TabsTrigger value="questions"><HelpCircle className="w-4 h-4 mr-2" />Questions people ask</TabsTrigger>
            <TabsTrigger value="autocomplete"><Search className="w-4 h-4 mr-2" />Live autocomplete</TabsTrigger>
          </TabsList>

          <TabsContent value="related" className="space-y-4">
            {rel.isLoading && <SkeletonBlock label="Fetching related keywords…" />}
            {rel.data?.error && <ErrorBlock label="Related keywords" msg={rel.data.error} />}
            {rel.data?.ok && rel.data.data && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Related keywords by search volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground mb-3">
                    Semantically related terms with their monthly volume, CPC and keyword difficulty (KD).
                  </div>
                  <KeywordTable
                    rows={rel.data.data.items.map((k) => ({
                      phrase: k.phrase, volume: k.volume, cpc: k.cpc, difficulty: k.difficulty,
                    }))}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            {qs.isLoading && <SkeletonBlock label="Fetching questions…" />}
            {qs.data?.error && <ErrorBlock label="Questions" msg={qs.data.error} />}
            {qs.data?.ok && qs.data.data && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Questions people ask about "{qs.data.data.keyword}"</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground mb-3">
                    Question-style queries with real monthly search volume — high-intent content opportunities.
                  </div>
                  <KeywordTable
                    rows={qs.data.data.items.map((k) => ({
                      phrase: k.phrase, volume: k.volume, cpc: k.cpc, difficulty: k.difficulty,
                    }))}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="autocomplete" className="space-y-4">
            {ac.isLoading && <SkeletonBlock label="Fetching Google autocomplete…" />}
            {ac.data?.error && <ErrorBlock label="Autocomplete" msg={ac.data.error} />}
            {ac.data?.ok && ac.data.data && (
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />Live Google autocomplete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground mb-2">What users type after "{ac.data.data.keyword}" in Google.</div>
                    <div className="flex flex-wrap gap-1.5">
                      {ac.data.data.suggestions.map((s) => (
                        <Badge key={s} variant="outline" className="font-normal">{s}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />Question completions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground mb-2">Question-style completions (what / how / can / is / why + keyword).</div>
                    <ul className="space-y-1 text-sm">
                      {ac.data.data.questions.map((q) => (
                        <li key={q} className="flex items-start gap-2">
                          <HelpCircle className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-xs text-muted-foreground space-y-1">
          <div>
            <strong>Sources:</strong> Semrush (search volume, CPC, competition, keyword difficulty, related terms, questions) and Google Autocomplete (live suggestions).
          </div>
          <div>
            <strong>On AI-assistant usage:</strong> ChatGPT, Gemini and Claude do not publish end-user query data. Google Autocomplete + Semrush's question keywords are the closest public proxies for what users are asking AI tools about bidirectional charging.
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function KeywordTable({ rows }: { rows: { phrase: string; volume: number; cpc: number; difficulty: number }[] }) {
  if (rows.length === 0) return <div className="text-sm text-muted-foreground">No keywords returned.</div>;
  const max = Math.max(...rows.map((r) => r.volume), 1);
  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[1fr_120px_80px_80px] gap-3 text-[11px] uppercase tracking-wide text-muted-foreground pb-2 border-b">
        <div>Keyword</div>
        <div className="text-right">Volume / mo</div>
        <div className="text-right">CPC</div>
        <div className="text-right">KD</div>
      </div>
      {rows.map((r) => (
        <div key={r.phrase} className="grid grid-cols-[1fr_120px_80px_80px] gap-3 items-center text-sm py-1.5 border-b border-border/40">
          <div className="truncate">{r.phrase}</div>
          <div className="flex items-center gap-2 justify-end">
            <div className="w-16 h-1.5 bg-muted rounded overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${(r.volume / max) * 100}%` }} />
            </div>
            <span className="tabular-nums text-xs w-14 text-right">{r.volume.toLocaleString()}</span>
          </div>
          <div className="text-right tabular-nums text-xs">${r.cpc.toFixed(2)}</div>
          <div className="text-right">
            <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium tabular-nums ${difficultyColor(r.difficulty)}`}>
              {Math.round(r.difficulty)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricTile({ icon, label, value, hint }: { icon?: React.ReactNode; label: string; value: number | string; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">{icon}{label}</div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {hint && <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>}
      </CardContent>
    </Card>
  );
}

function SkeletonBlock({ label }: { label: string }) {
  return <div className="text-sm text-muted-foreground py-6">{label}</div>;
}

function ErrorBlock({ label, msg }: { label: string; msg: string }) {
  return (
    <Card>
      <CardContent className="py-6 text-sm">
        <div className="font-medium mb-1">{label} unavailable</div>
        <div className="text-xs text-muted-foreground">{msg}</div>
      </CardContent>
    </Card>
  );
}

function interestBand(v: number) {
  if (v < 100) return 'Niche audience';
  if (v < 1000) return 'Small but engaged';
  if (v < 10_000) return 'Solid mainstream demand';
  if (v < 100_000) return 'High demand';
  return 'Massive demand';
}
function competitionBand(c: number) {
  if (c < 0.33) return 'Low ad competition';
  if (c < 0.66) return 'Medium ad competition';
  return 'High ad competition';
}
function compactNumber(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}
