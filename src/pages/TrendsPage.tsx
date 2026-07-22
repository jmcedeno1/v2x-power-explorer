import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Activity, Search, MessageSquare, TrendingUp, ExternalLink,
  Sparkles, HelpCircle, RefreshCw,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
} from 'recharts';

const DEFAULT_KEYWORDS = [
  'bidirectional charging',
  'V2G',
  'vehicle-to-grid',
  'vehicle-to-home',
];

type FetchResult<T> = { ok: boolean; data?: T; error?: string };

async function callTrends<T>(source: string, keyword: string, extra?: Record<string, string>): Promise<FetchResult<T>> {
  const { data, error } = await supabase.functions.invoke('fetch-trends', {
    body: { source, keyword, ...(extra ?? {}) },
  });
  if (error) return { ok: false, error: error.message };
  if (!data?.ok) return { ok: false, error: data?.error ?? 'unknown' };
  return { ok: true, data: data.data as T };
}

type GTrends = {
  keyword: string;
  series: { date: string; value: number }[];
  top: { query: string; value: number }[];
  rising: { query: string; value: number; formattedValue?: string }[];
  geo: { name: string; value: number }[];
};

type AutoRes = { keyword: string; suggestions: string[]; questions: string[] };
type RedditRes = { keyword: string; count: number; posts: { title: string; subreddit: string; score: number; num_comments: number; created_utc: number; permalink: string }[] };

export default function TrendsPage() {
  const [keyword, setKeyword] = useState('bidirectional charging');
  const [submitted, setSubmitted] = useState('bidirectional charging');

  const gt = useQuery({
    queryKey: ['trends', 'google', submitted],
    queryFn: () => callTrends<GTrends>('google_trends', submitted),
    staleTime: 60_000,
  });
  const ac = useQuery({
    queryKey: ['trends', 'autocomplete', submitted],
    queryFn: () => callTrends<AutoRes>('autocomplete', submitted),
    staleTime: 60_000,
  });
  const rd = useQuery({
    queryKey: ['trends', 'reddit', submitted],
    queryFn: () => callTrends<RedditRes>('reddit', submitted),
    staleTime: 60_000,
  });

  const redditBySub = useMemo(() => {
    const posts = rd.data?.data?.posts ?? [];
    const map = new Map<string, number>();
    for (const p of posts) map.set(p.subreddit, (map.get(p.subreddit) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }, [rd.data]);

  const refetchAll = () => { gt.refetch(); ac.refetch(); rd.refetch(); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(keyword.trim() || 'bidirectional charging');
  };

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Activity className="w-7 h-7 text-white" />}
          title="Search & Interest Trends"
          description="User interest in bidirectional charging across Google Search, autocomplete queries, Reddit and Hacker News discussion, plus Bing News coverage."
          badge={<Badge variant="outline">Live sources</Badge>}
        />

        <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-2 mb-6">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Keyword (e.g. bidirectional charging)"
            className="max-w-xs"
          />
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

        <Tabs defaultValue="google" className="space-y-4">
          <TabsList>
            <TabsTrigger value="google"><TrendingUp className="w-4 h-4 mr-2" />Google Trends</TabsTrigger>
            <TabsTrigger value="autocomplete"><Sparkles className="w-4 h-4 mr-2" />Autocomplete & PAA</TabsTrigger>
            <TabsTrigger value="reddit"><MessageSquare className="w-4 h-4 mr-2" />Reddit</TabsTrigger>
            <TabsTrigger value="hn"><MessageSquare className="w-4 h-4 mr-2" />Hacker News</TabsTrigger>
            <TabsTrigger value="bing"><Globe2 className="w-4 h-4 mr-2" />News Coverage</TabsTrigger>
          </TabsList>

          {/* Google Trends */}
          <TabsContent value="google" className="space-y-4">
            {gt.isLoading && <SkeletonBlock label="Fetching Google Trends…" />}
            {gt.data?.error && <ErrorBlock label="Google Trends" msg={gt.data.error} />}
            {gt.data?.ok && gt.data.data && (
              <>
                <Card>
                  <CardHeader><CardTitle className="text-base">Interest over time — "{gt.data.data.keyword}"</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground mb-2">
                      Relative search interest (0-100). Source: Google Trends, last 12 months.
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={gt.data.data.series}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" fontSize={11} />
                        <YAxis fontSize={11} domain={[0, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader><CardTitle className="text-base">Top related queries</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-1.5">
                        {gt.data.data.top.slice(0, 15).map((q) => (
                          <div key={q.query} className="flex items-center gap-2 text-sm">
                            <div className="flex-1 truncate">{q.query}</div>
                            <div className="w-24 h-1.5 bg-muted rounded overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${q.value}%` }} />
                            </div>
                            <div className="w-8 text-right text-xs text-muted-foreground">{q.value}</div>
                          </div>
                        ))}
                        {gt.data.data.top.length === 0 && <div className="text-sm text-muted-foreground">No related queries.</div>}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="text-base">Rising queries</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-1.5">
                        {gt.data.data.rising.slice(0, 15).map((q) => (
                          <div key={q.query} className="flex items-center gap-2 text-sm">
                            <div className="flex-1 truncate">{q.query}</div>
                            <Badge variant="secondary" className="text-[11px]">{q.formattedValue ?? `+${q.value}%`}</Badge>
                          </div>
                        ))}
                        {gt.data.data.rising.length === 0 && <div className="text-sm text-muted-foreground">No rising queries.</div>}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader><CardTitle className="text-base">Top countries by interest</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={gt.data.data.geo} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" fontSize={11} domain={[0, 100]} />
                        <YAxis type="category" dataKey="name" fontSize={11} width={120} />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Autocomplete */}
          <TabsContent value="autocomplete" className="space-y-4">
            {ac.isLoading && <SkeletonBlock label="Fetching Google autocomplete…" />}
            {ac.data?.error && <ErrorBlock label="Autocomplete" msg={ac.data.error} />}
            {ac.data?.ok && ac.data.data && (
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />What people search
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground mb-2">Live Google autocomplete for "{ac.data.data.keyword}".</div>
                    <div className="flex flex-wrap gap-1.5">
                      {ac.data.data.suggestions.map((s) => (
                        <Badge key={s} variant="outline" className="font-normal">{s}</Badge>
                      ))}
                      {ac.data.data.suggestions.length === 0 && <div className="text-sm text-muted-foreground">No suggestions.</div>}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />What people ask
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
                      {ac.data.data.questions.length === 0 && <div className="text-sm text-muted-foreground">No questions found.</div>}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Reddit */}
          <TabsContent value="reddit" className="space-y-4">
            {rd.isLoading && <SkeletonBlock label="Fetching Reddit…" />}
            {rd.data?.error && <ErrorBlock label="Reddit" msg={rd.data.error} />}
            {rd.data?.ok && rd.data.data && (
              <>
                <div className="grid md:grid-cols-3 gap-4">
                  <MetricTile label="Posts (last year)" value={rd.data.data.count} />
                  <MetricTile label="Subreddits" value={redditBySub.length} />
                  <MetricTile
                    label="Avg. score"
                    value={rd.data.data.posts.length
                      ? Math.round(rd.data.data.posts.reduce((s, p) => s + (p.score ?? 0), 0) / rd.data.data.posts.length)
                      : 0}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader><CardTitle className="text-base">Top subreddits</CardTitle></CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={redditBySub} layout="vertical" margin={{ left: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis type="number" fontSize={11} allowDecimals={false} />
                          <YAxis type="category" dataKey="name" fontSize={11} width={120} />
                          <Tooltip />
                          <Bar dataKey="count" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="text-base">Top posts by score</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {[...rd.data.data.posts].sort((a, b) => b.score - a.score).slice(0, 8).map((p) => (
                        <a key={p.permalink} href={p.permalink} target="_blank" rel="noreferrer noopener"
                           className="block text-sm hover:bg-muted/50 rounded px-2 py-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="line-clamp-2 flex-1">{p.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            r/{p.subreddit} · {p.score} pts · {p.num_comments} comments
                          </div>
                        </a>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Hacker News */}
          <TabsContent value="hn" className="space-y-4">
            {hn.isLoading && <SkeletonBlock label="Fetching Hacker News…" />}
            {hn.data?.error && <ErrorBlock label="HN" msg={hn.data.error} />}
            {hn.data?.ok && hn.data.data && (
              <>
                <div className="grid md:grid-cols-3 gap-4">
                  <MetricTile label="Total stories matched" value={hn.data.data.count} />
                  <MetricTile label="Stories fetched" value={hn.data.data.stories.length} />
                  <MetricTile
                    label="Avg. points"
                    value={hn.data.data.stories.length
                      ? Math.round(hn.data.data.stories.reduce((s, p) => s + (p.points ?? 0), 0) / hn.data.data.stories.length)
                      : 0}
                  />
                </div>

                <Card>
                  <CardHeader><CardTitle className="text-base">Story volume over time</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={hnByMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" fontSize={11} />
                        <YAxis fontSize={11} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-base">Top HN stories</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {[...hn.data.data.stories].sort((a, b) => (b.points ?? 0) - (a.points ?? 0)).slice(0, 10).map((s) => (
                      <a key={s.objectID}
                         href={s.url ?? `https://news.ycombinator.com/item?id=${s.objectID}`}
                         target="_blank" rel="noreferrer noopener"
                         className="block text-sm hover:bg-muted/50 rounded px-2 py-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="line-clamp-2 flex-1">{s.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {s.points ?? 0} pts · {s.num_comments ?? 0} comments · {s.created_at?.slice(0, 10)}
                        </div>
                      </a>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Bing News */}
          <TabsContent value="bing" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">News coverage volume (Bing News)</CardTitle></CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground mb-2">
                  Monthly count of ingested bidirectional-charging news articles. Refresh from the News module to update.
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={bing.data ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" fontSize={11} />
                    <YAxis fontSize={11} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-xs text-muted-foreground">
          Note: ChatGPT, Gemini and Claude do not publish "what users ask" data — we use Google autocomplete + question-prefix completions as the closest public proxy for AI-assistant user interest.
        </div>
      </div>
    </MainLayout>
  );
}

function MetricTile({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
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
