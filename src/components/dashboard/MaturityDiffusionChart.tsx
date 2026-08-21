import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import {
  diffusionCurves,
  diffusionFits,
  pilotAdoptionScore,
  newsMediaScore,
  searchTrendNote,
} from '@/data/diffusionModel';
import { useNewsDiffusion } from '@/hooks/useNewsDiffusion';
import { useMemo } from 'react';

export function MaturityDiffusionChart() {
  const { data: liveNews } = useNewsDiffusion();

  const curves = useMemo(() => {
    if (!liveNews) return diffusionCurves;
    return diffusionCurves.map((row) => ({
      ...row,
      newsFit: liveNews.fitted[row.year] ?? row.newsFit,
      news: liveNews.observed[row.year] ?? (row.year <= liveNews.lastFittedYear ? row.news : undefined),
    }));
  }, [liveNews]);

  const fits = useMemo(() => {
    if (!liveNews) return diffusionFits;
    return diffusionFits.map((f) =>
      f.key === 'news'
        ? {
            ...f,
            m: liveNews.fit.m,
            p: liveNews.fit.p,
            q: liveNews.fit.q,
            r2: liveNews.fit.r2,
            takeoff: liveNews.fit.takeoff,
            takeoffLabel: liveNews.fit.takeoff ? String(Math.round(liveNews.fit.takeoff)) : 'after 2030',
            source: `News & Media corpus, ${liveNews.total.toLocaleString()} articles`,
          }
        : f,
    );
  }, [liveNews]);

  const newsScore = liveNews?.score ?? newsMediaScore.score;
  const newsPerYear = liveNews?.perYear ?? newsMediaScore.perYear;
  const newsTotal = liveNews?.total ?? 273;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-card border border-border"
    >
      <h3 className="text-lg font-semibold text-foreground mb-1">Maturity and Diffusion</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Bass diffusion model (Takahashi et al., 2024) fitted only to this app's own databases:
        the Lens.org patents corpus (10,130 records), the OpenAlex publications corpus (8,294
        records), the Pilots and Demonstrators module (43 pilots) and the News and Media corpus
        ({newsTotal.toLocaleString()} articles). Values are cumulative adoption as a share of each
        curve's estimated potential (m).
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs text-muted-foreground">
        {fits.map((f) => (
          <div key={f.key} className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded" style={{ backgroundColor: f.color }} />
            {f.label}
          </div>
        ))}
      </div>


      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curves} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="year"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              domain={[0, 100]}
              unit="%"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => [`${value}% of potential`, name]}
            />

            {fits
              .filter((f) => f.takeoff)
              .map((f) => (
                <ReferenceLine
                  key={`tk-${f.key}`}
                  x={Math.round(f.takeoff as number)}
                  stroke={f.color}
                  strokeDasharray="2 4"
                  strokeOpacity={0.5}
                />
              ))}

            {fits.map((f) => (
              <Line
                key={`${f.key}-fit`}
                type="monotone"
                dataKey={`${f.key}Fit`}
                stroke={f.color}
                strokeWidth={1}
                strokeDasharray="4 4"
                dot={false}
                name={`${f.label} (Bass fit)`}
              />
            ))}

            {fits.map((f) => (
              <Line
                key={f.key}
                type="monotone"
                dataKey={f.key}
                stroke={f.color}
                strokeWidth={2}
                dot={false}
                connectNulls
                name={f.label}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-muted-foreground text-center mt-2">
        Solid lines: observed cumulative adoption (2004-2025). Dashed: fitted Bass curve to 2030.
        Vertical marks: estimated takeoff (left inflection point).
      </p>

      {/* Coefficients */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground text-left">
              <th className="py-2 font-medium">Diffusion curve</th>
              <th className="py-2 font-medium">Takeoff</th>
              <th className="py-2 font-medium">p</th>
              <th className="py-2 font-medium">q</th>
              <th className="py-2 font-medium">m</th>
              <th className="py-2 font-medium">R²</th>
              <th className="py-2 font-medium">App data source</th>
            </tr>
          </thead>
          <tbody>
            {fits.map((f) => (
              <tr key={f.key} className="border-t border-border">
                <td className="py-2 text-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                    {f.label}
                  </span>
                </td>
                <td className="py-2 text-foreground font-medium">{f.takeoffLabel}</td>
                <td className="py-2 text-muted-foreground">{f.p.toFixed(4)}</td>
                <td className="py-2 text-muted-foreground">{f.q.toFixed(3)}</td>
                <td className="py-2 text-muted-foreground">
                  {f.m.toLocaleString()} {f.unit}
                </td>
                <td className="py-2 text-muted-foreground">{f.r2.toFixed(3)}</td>
                <td className="py-2 text-muted-foreground">{f.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[11px] text-muted-foreground mt-2">{searchTrendNote}</p>
      </div>

      {/* News and media score */}
      <div className="mt-5 p-4 rounded-xl bg-muted/40 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-foreground">News and media score</p>
            <p className="text-[11px] text-muted-foreground">
              Cumulative articles reached as a share of fitted potential, from the News and Media
              corpus
            </p>
          </div>
          <p className="text-3xl font-bold text-primary">
            {newsScore}
            <span className="text-sm text-muted-foreground font-normal">/100</span>
          </p>
        </div>

        <div className="h-[110px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={newsPerYear} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="year"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${value} articles`, 'Articles']}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-foreground mt-2 leading-relaxed">{newsMediaScore.note}</p>
      </div>

      {/* Pilot technology adoption score */}
      <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Pilot technology adoption score
            </p>
            <p className="text-[11px] text-muted-foreground">
              Composite of four normalised pilot-corpus indicators
            </p>
          </div>
          <p className="text-3xl font-bold text-primary">
            {pilotAdoptionScore.score}
            <span className="text-sm text-muted-foreground font-normal">/100</span>
          </p>
        </div>

        <div className="space-y-2">
          {pilotAdoptionScore.components.map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground">{c.label}</span>
                <span className="text-muted-foreground">{c.value}</span>
              </div>
              <div className="h-1.5 mt-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.value}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">{c.detail}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-foreground mt-3 leading-relaxed">
          {pilotAdoptionScore.verdict}
        </p>
      </div>
    </motion.div>
  );
}
