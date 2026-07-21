import { BookOpen, FileText, TrendingUp, Calendar, Globe, Building2, Sparkles } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { publicationsSummary } from '@/data/publicationsSummary';
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

const StatCard = ({ icon: Icon, value, label }: { icon: any; value: string | number; label: string }) => (
  <div className="p-4 rounded-xl bg-card border flex flex-col gap-2">
    <Icon className="w-5 h-5 text-primary" />
    <div className="text-2xl font-bold text-foreground leading-tight">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export default function PublicationsPage() {
  const data = publicationsSummary;
  const isLoading = false;

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
            <StatCard icon={BookOpen} value={data?.themes ?? 0} label="Growing themes" />
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
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Top 10 growing publication topics (2020 to 2025)</h3>
          </div>
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 text-sm text-muted-foreground">Loading…</div>
              ) : !data?.growingTopics?.length ? (
                <div className="p-6 text-sm text-muted-foreground">
                  Not enough publications in 2020 and 2025 to compute topic growth.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="p-4 h-[420px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[...data.growingTopics].reverse()}
                        layout="vertical"
                        margin={{ left: 20, right: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <YAxis
                          type="category"
                          dataKey="topic"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={10}
                          width={200}
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          formatter={(value: number, name: string) => [value, name === 'y2020' ? '2020' : '2025']}
                        />
                        <Bar dataKey="y2020" fill="hsl(var(--muted-foreground))" name="2020" radius={[0, 2, 2, 0]} />
                        <Bar dataKey="y2025" fill="hsl(var(--primary))" name="2025" radius={[0, 2, 2, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="divide-y divide-border border-l border-border">
                    {data.growingTopics.map((t, i) => (
                      <li key={t.topic} className="p-3 flex items-center gap-3 hover:bg-muted/30">
                        <div className="text-lg font-bold text-muted-foreground w-6 shrink-0 tabular-nums">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{t.topic}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {t.y2020} in 2020 &rarr; {t.y2025} in 2025 &middot; {t.total.toLocaleString()} total
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-primary tabular-nums">
                            +{t.growthAbs}
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {t.y2020 > 0 ? `+${Math.round(t.growthPct)}%` : 'new'}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
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
