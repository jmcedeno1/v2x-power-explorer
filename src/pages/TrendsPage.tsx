import { useMemo, useState } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  BarChart, Bar, LabelList,
} from 'recharts';
import raw from '@/data/googleTrendsData.json';

type Row = { rank: number; query: string; interest: number; change: string };
type TS = { date: string; value: number };
type Dataset = {
  terms: string[];
  timeSeries: Record<string, TS[]>;
  top: Record<string, Row[]>;
  rising: Record<string, Row[]>;
};
const data = raw as Dataset;

// Google Trends palette
const COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#FF6D01', '#9C27B0', '#00ACC1'];

const LOCATIONS = [
  { code: 'WW', label: 'Worldwide', available: true },
  { code: 'US', label: 'United States', available: false },
  { code: 'GB', label: 'United Kingdom', available: false },
  { code: 'DE', label: 'Germany', available: false },
  { code: 'JP', label: 'Japan', available: false },
];
const TIMES = [
  { code: '12m', label: 'Past 12 months', available: true },
  { code: '1h', label: 'Past hour', available: false },
  { code: '4h', label: 'Past 4 hours', available: false },
  { code: '1d', label: 'Past day', available: false },
  { code: '7d', label: 'Past 7 days', available: false },
  { code: '30d', label: 'Past 30 days', available: false },
  { code: '90d', label: 'Past 90 days', available: false },
  { code: '5y', label: 'Past 5 years', available: false },
];
const SOURCES = [
  { code: 'web', label: 'Web Search', available: true },
  { code: 'image', label: 'Image Search', available: false },
  { code: 'news', label: 'News Search', available: false },
  { code: 'shopping', label: 'Google Shopping', available: false },
  { code: 'youtube', label: 'YouTube Search', available: false },
];

export default function TrendsPage() {
  const [location, setLocation] = useState('WW');
  const [time, setTime] = useState('12m');
  const [source, setSource] = useState('web');
  const [activeTerm, setActiveTerm] = useState(data.terms[0]);
  const [queryType, setQueryType] = useState<'top' | 'rising'>('top');

  const termColor = useMemo(
    () => Object.fromEntries(data.terms.map((t, i) => [t, COLORS[i % COLORS.length]])),
    [],
  );

  // Merge all term series onto shared date axis
  const chartData = useMemo(() => {
    const dates = data.timeSeries[data.terms[0]].map((p) => p.date);
    return dates.map((d, i) => {
      const row: Record<string, string | number> = { date: d };
      for (const term of data.terms) row[term] = data.timeSeries[term][i]?.value ?? 0;
      return row;
    });
  }, []);

  const avgInterest = useMemo(() => {
    return data.terms
      .map((term) => {
        const s = data.timeSeries[term];
        const avg = s.reduce((a, b) => a + b.value, 0) / s.length;
        return { term, avg: Math.round(avg), fill: termColor[term] };
      })
      .sort((a, b) => b.avg - a.avg);
  }, [termColor]);

  const rows = queryType === 'top' ? data.top[activeTerm] : data.rising[activeTerm];

  const timeLabel = TIMES.find((t) => t.code === time)?.label ?? '';
  const locLabel = LOCATIONS.find((l) => l.code === location)?.label ?? '';

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Activity className="w-7 h-7 text-white" />}
          title="Search & Interest Trends"
          description="Google Trends analysis of bidirectional charging terminology: interest over time, average interest, and commonly searched queries (top and rising) per term."
          badge={<Badge variant="outline">Google Trends · Jul 2025 - Jul 2026</Badge>}
        />

        {/* Term chips */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-3">Compared search terms</div>
            <div className="flex flex-wrap gap-2">
              {data.terms.map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-background text-sm"
                  style={{ borderColor: `${termColor[t]}55` }}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: termColor[t] }} />
                  <span className="font-medium">{t}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <FilterRow
          location={location} setLocation={setLocation}
          time={time} setTime={setTime}
          source={source} setSource={setSource}
        />

        {/* Interest over time + Average interest */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                Interest over time
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent className="max-w-xs text-xs">
                      Numbers represent search interest relative to the highest point on the chart for the
                      given region and time. A value of 100 is peak popularity. 0 means insufficient data.
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </CardTitle>
              <div className="text-xs text-muted-foreground">{locLabel} · {timeLabel} · Web Search</div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date" fontSize={10} tickMargin={6}
                    tickFormatter={(d: string) => {
                      const dt = new Date(d);
                      return dt.toLocaleString('en', { month: 'short', year: '2-digit' });
                    }}
                    minTickGap={40}
                  />
                  <YAxis fontSize={11} domain={[0, 100]} width={32} />
                  <Tooltip
                    labelFormatter={(d: string) => new Date(d).toLocaleDateString('en', { day:'numeric', month:'short', year:'numeric' })}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                  {data.terms.map((t) => (
                    <Line
                      key={t} type="monotone" dataKey={t}
                      stroke={termColor[t]} strokeWidth={2}
                      dot={false} activeDot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Average interest</CardTitle>
              <div className="text-xs text-muted-foreground">{locLabel} · {timeLabel}</div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={avgInterest} margin={{ top: 20, right: 12, left: 0, bottom: 40 }}>
                  <XAxis
                    dataKey="term" fontSize={9} interval={0}
                    angle={-30} textAnchor="end" height={60}
                    tickFormatter={(t: string) => (t.length > 12 ? t.slice(0, 12) + '…' : t)}
                  />
                  <YAxis fontSize={11} width={28} />
                  <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="avg" position="top" fontSize={11} />
                    {avgInterest.map((entry, i) => (
                      <Bar key={i} dataKey="avg" fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Commonly searched queries */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Commonly searched queries</CardTitle>
            <div className="text-xs text-muted-foreground">
              People who searched for the selected term also searched for these queries.
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTerm} onValueChange={setActiveTerm}>
              <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0 mb-4">
                {data.terms.map((t) => (
                  <TabsTrigger
                    key={t} value={t}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full text-xs px-3 py-1.5 border"
                    style={{
                      borderColor: activeTerm === t ? termColor[t] : `${termColor[t]}55`,
                      background: activeTerm === t ? termColor[t] : `${termColor[t]}18`,
                      color: activeTerm === t ? '#fff' : undefined,
                    }}
                  >
                    {t}
                  </TabsTrigger>
                ))}
              </TabsList>

              {data.terms.map((t) => (
                <TabsContent key={t} value={t} className="mt-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-muted-foreground">
                      People who searched for <span className="font-semibold text-foreground">{t}</span> also searched for these queries
                    </div>
                    <Tabs value={queryType} onValueChange={(v) => setQueryType(v as 'top' | 'rising')}>
                      <TabsList>
                        <TabsTrigger value="top">Top queries</TabsTrigger>
                        <TabsTrigger value="rising">Rising queries</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <QueryTable rows={rows} type={queryType} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 text-xs text-muted-foreground">
          <strong>Source:</strong> Google Trends export ({timeLabel.toLowerCase()}, {locLabel},
          Web Search), integrated across 7 bidirectional charging search terms. Search interest is
          Google's relative popularity index (0-100). Rising queries labelled <em>Breakout</em>
          grew by more than 5,000% in the period.
        </div>
      </div>
    </MainLayout>
  );
}

function FilterRow({
  location, setLocation, time, setTime, source, setSource,
}: {
  location: string; setLocation: (v: string) => void;
  time: string; setTime: (v: string) => void;
  source: string; setSource: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <FilterSelect label="Location" value={location} onChange={setLocation} options={LOCATIONS} />
      <FilterSelect label="Time range" value={time} onChange={setTime} options={TIMES} />
      <FilterSelect label="Search source" value={source} onChange={setSource} options={SOURCES} />
    </div>
  );
}

function FilterSelect({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { code: string; label: string; available: boolean }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground pl-1">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px] h-9"><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.code} value={o.code} disabled={!o.available}>
              <span className="flex items-center gap-2">
                {o.label}
                {!o.available && <span className="text-[10px] text-muted-foreground">(no data)</span>}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function QueryTable({ rows, type }: { rows: Row[]; type: 'top' | 'rising' }) {
  if (!rows?.length) return <div className="text-sm text-muted-foreground">No data.</div>;
  const max = Math.max(...rows.map((r) => r.interest), 1);
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-[40px_1fr_180px_120px] gap-3 px-4 py-2 bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
        <div>#</div>
        <div>Query</div>
        <div className="text-right">Search interest</div>
        <div className="text-right">{type === 'top' ? 'Change (YoY)' : 'Growth'}</div>
      </div>
      {rows.map((r) => (
        <div
          key={`${r.rank}-${r.query}`}
          className="grid grid-cols-[40px_1fr_180px_120px] gap-3 px-4 py-2 items-center text-sm border-t"
        >
          <div className="text-muted-foreground tabular-nums">{r.rank}</div>
          <div className="truncate">{r.query}</div>
          <div className="flex items-center gap-2 justify-end">
            <div className="w-24 h-1.5 bg-muted rounded overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${(r.interest / max) * 100}%` }} />
            </div>
            <span className="tabular-nums text-xs w-8 text-right">{r.interest}</span>
          </div>
          <div className="text-right">
            <ChangeBadge value={r.change} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ChangeBadge({ value }: { value: string }) {
  const v = (value || '').trim();
  if (!v) return <span className="text-xs text-muted-foreground">-</span>;
  if (/breakout/i.test(v)) {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">BREAKOUT</span>;
  }
  const neg = v.startsWith('-');
  const pos = !neg && /\d/.test(v);
  const cls = neg
    ? 'bg-red-500/10 text-red-700 dark:text-red-400'
    : pos ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
    : 'bg-muted text-muted-foreground';
  const Icon = neg ? TrendingDown : pos ? TrendingUp : Minus;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${cls}`}>
      <Icon className="w-3 h-3" />{v}
    </span>
  );
}
