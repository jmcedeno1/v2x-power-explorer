import { FileText, TrendingUp, Calendar, Building2, Sparkles, Award, ScrollText, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { patentsSummary } from '@/data/patentsSummary';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { GrowingTopicPopup } from './GrowingTopicPopup';
import { PatentFamilies } from './PatentFamilies';


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

        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Patent Evidence</h3>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
            <ul className="space-y-3">
              {[
                '<strong>Filings are outpacing grants.</strong> The gap between annual applications and granted patents has widened, indicating a larger prosecution backlog and a field still in rapid expansion rather than mature grant conversion.',
                '<strong>Growth is broad, not a single spike.</strong> Nearly every major technology family shows rising activity from 2020 to 2025, suggesting sustained R&D investment across the stack rather than a one-time technology wave.',
                '<strong>The agenda is shifting from hardware to system integration.</strong> The fastest growth is in control/dispatch, charging infrastructure and battery management, while core converter work remains large but less dynamic.',
                '<strong>Real-world deployment concerns are now central.</strong> Battery degradation, fleet and microgrid integration, VPP aggregation and standards have moved from fringe to growing topics, reflecting a shift from lab concepts to operational products.',
                '<strong>Cybersecurity and wide-bandgap semiconductors remain white space.</strong> Both topics are flat or nascent relative to power and control IP, pointing to under-protected areas as products scale.',
                '<strong>OEMs still dominate, but the ecosystem is diversifying.</strong> Global automakers hold the largest assignee positions, yet grid operators, charging suppliers and Chinese energy players are increasingly present in charging and converter families.',
                '<strong>Geography follows market readiness.</strong> The US and China lead filings, with Europe as a consistent but smaller hub, mirroring regional regulatory push and pilot activity.',
                '<strong>Standards are becoming patentable.</strong> Standards-related patents only appear in the recent window, signalling that ISO 15118, CCS and CHAdeMO implementations are now being encoded into products.',
                '<strong>V2G dispatch is growing but still hardware-heavy.</strong> Explicit grid-dispatch and aggregation patents are rising, yet they remain a smaller share than converter, charger and battery IP, showing the stack is still dominated by physical components.',
                '<strong>Degradation modelling is the battery-side priority.</strong> Ageing and state-of-health patents are the fastest-growing BMS sub-theme, revealing warranty and cycle-life risk as the main barrier to commercial cycling.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="text-sm text-foreground" dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Card className="mb-6">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Patent filings and grants per year</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.perYear ?? []} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="apps" name="Patent filings (applications)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="grants" name="Granted patents" stroke="hsl(var(--energy-amber))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <PatentFamilies />


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
          <h3 className="text-lg font-semibold">Growing patent topics (2020 to 2025)</h3>
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
