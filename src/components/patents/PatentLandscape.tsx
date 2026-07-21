import { FileText, TrendingUp, Calendar, Building2, Sparkles, Award, ScrollText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { patentsSummary } from '@/data/patentsSummary';
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
import { GrowingTopicPopup } from './GrowingTopicPopup';

const StatCard = ({ icon: Icon, value, label }: { icon: any; value: string | number; label: string }) => (
  <div className="p-4 rounded-xl bg-card border flex flex-col gap-2">
    <Icon className="w-5 h-5 text-primary" />
    <div className="text-2xl font-bold text-foreground leading-tight">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export function PatentLandscape() {
  const data = patentsSummary;
  const isLoading = false;


  return (
    <>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <ScrollText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Patent Landscape Summary</h3>
          <span className="text-xs text-muted-foreground">(lens.org corpus)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard icon={FileText} value={isLoading ? '-' : (data?.total ?? 0).toLocaleString()} label="Patents in corpus" />
          <StatCard icon={Award} value={isLoading ? '-' : (data?.grants ?? 0).toLocaleString()} label="Granted" />
          <StatCard icon={ScrollText} value={isLoading ? '-' : (data?.apps ?? 0).toLocaleString()} label="Applications" />
          <StatCard icon={TrendingUp} value={data?.minYear && data?.maxYear ? `${data.minYear}-${data.maxYear}` : '-'} label="Coverage" />
          <StatCard icon={Calendar} value={data?.peakYear || '-'} label="Peak filing year" />
          <StatCard icon={Building2} value={data?.assignees ?? 0} label="Unique assignees" />
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Patent filings per year</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.perYear ?? []}>
                <defs>
                  <linearGradient id="patFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#patFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Top assignees</CardTitle></CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.topAssignees ?? []} layout="vertical" margin={{ left: 120 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} width={160} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Top jurisdictions</CardTitle></CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.topCountries ?? []} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={60} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Top 10 growing patent topics (2020 to 2025)</h3>
        </div>
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 text-sm text-muted-foreground">Loading…</div>
            ) : !data?.growingTopics?.length ? (
              <div className="p-6 text-sm text-muted-foreground">Not enough patents in 2020 and 2025 to compute topic growth.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-4 h-[420px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[...data.growingTopics].reverse()} layout="vertical" margin={{ left: 20, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <YAxis type="category" dataKey="topic" stroke="hsl(var(--muted-foreground))" fontSize={10} width={220} />
                      <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                        formatter={(value: number, name: string) => [value, name === 'y2020' ? '2020' : '2025']} />
                      <Bar dataKey="y2020" fill="hsl(var(--muted-foreground))" name="2020" radius={[0, 2, 2, 0]} />
                      <Bar dataKey="y2025" fill="hsl(var(--primary))" name="2025" radius={[0, 2, 2, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <ul className="divide-y divide-border border-l border-border">
                  {data.growingTopics.map((t, i) => (
                    <GrowingTopicPopup
                      key={t.topic}
                      topic={t.topic}
                      y2020={t.y2020}
                      y2025={t.y2025}
                      growthAbs={t.growthAbs}
                      growthPct={t.growthPct}
                      total={t.total}
                    >
                      <li className="p-3 flex items-center gap-3 hover:bg-muted/30 cursor-pointer transition-colors">
                        <div className="text-lg font-bold text-muted-foreground w-6 shrink-0 tabular-nums">{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{t.topic}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {t.y2020} in 2020 &rarr; {t.y2025} in 2025 &middot; {t.total.toLocaleString()} total
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-primary tabular-nums">+{t.growthAbs}</div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {t.y2020 > 0 ? `+${Math.round(t.growthPct)}%` : 'new'}
                          </div>
                        </div>
                      </li>
                    </GrowingTopicPopup>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

    </>
  );
}
