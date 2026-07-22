import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EU_MEMBERS = new Set([
  'EU', 'Denmark', 'France', 'Germany', 'Hungary', 'Italy', 'Netherlands',
  'Portugal', 'Portugal / Netherlands', 'Spain', 'Sweden', 'Belgium',
  'Austria', 'Poland', 'Finland', 'Ireland', 'Greece', 'Czech Republic',
]);

function normalizeCountry(c?: string | null): string | null {
  if (!c) return null;
  const t = c.trim();
  if (!t) return null;
  if (t === 'USA') return 'United States';
  if (EU_MEMBERS.has(t)) return 'EU';
  return t;
}

const PALETTE = [
  'hsl(var(--primary))',
  'hsl(var(--energy-teal))',
  'hsl(var(--energy-amber))',
  'hsl(var(--energy-green))',
  'hsl(var(--energy-red))',
  'hsl(var(--accent))',
  'hsl(var(--muted-foreground))',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
];

interface Props {
  pilots: any[];
}

export function PilotTimelines({ pilots }: Props) {
  const { fleetData, investData, countries } = useMemo(() => {
    // Group events by country + year
    const events: Record<string, Record<number, { fleet: number; invest: number }>> = {};
    let minYear = Infinity;
    let maxYear = -Infinity;

    for (const p of pilots) {
      const country = normalizeCountry(p.country);
      if (!country) continue;
      const dateStr = p.startDate || p.start_date;
      if (!dateStr) continue;
      const year = new Date(dateStr).getFullYear();
      if (!year || isNaN(year)) continue;
      minYear = Math.min(minYear, year);
      maxYear = Math.max(maxYear, year);
      events[country] ??= {};
      events[country][year] ??= { fleet: 0, invest: 0 };
      events[country][year].fleet += Number(p.vehicleCount || 0);
      events[country][year].invest += Number(p.investmentUsd || 0);
    }

    if (!isFinite(minYear)) {
      return { fleetData: [], investData: [], countries: [] };
    }
    maxYear = Math.max(maxYear, new Date().getFullYear());

    // Country totals for ranking + filter zeros
    const totals = Object.entries(events).map(([c, y]) => {
      let f = 0, i = 0;
      Object.values(y).forEach(v => { f += v.fleet; i += v.invest; });
      return { country: c, fleet: f, invest: i };
    });
    const countryList = totals
      .filter(t => t.fleet > 0 || t.invest > 0)
      .sort((a, b) => (b.fleet + b.invest / 1e6) - (a.fleet + a.invest / 1e6))
      .map(t => t.country);

    // Build cumulative rows per year
    const years: number[] = [];
    for (let y = minYear; y <= maxYear; y++) years.push(y);
    const running: Record<string, { fleet: number; invest: number }> = {};
    countryList.forEach(c => (running[c] = { fleet: 0, invest: 0 }));

    const fleetRows: any[] = [];
    const investRows: any[] = [];
    for (const y of years) {
      const fRow: any = { year: String(y) };
      const iRow: any = { year: String(y) };
      for (const c of countryList) {
        const ev = events[c]?.[y];
        if (ev) {
          running[c].fleet += ev.fleet;
          running[c].invest += ev.invest;
        }
        fRow[c] = running[c].fleet;
        iRow[c] = running[c].invest / 1e6; // USD millions
      }
      fleetRows.push(fRow);
      investRows.push(iRow);
    }

    return { fleetData: fleetRows, investData: investRows, countries: countryList };
  }, [pilots]);

  if (!countries.length) return null;

  const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: '12px',
  } as const;

  return (
    <section className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-card border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-1">Vehicles Piloted (Cumulative)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Total EVs deployed in bidirectional pilots, by country over time. EU projects consolidated.
        </p>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fleetData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={{ stroke: 'hsl(var(--border))' }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={{ stroke: 'hsl(var(--border))' }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => v.toLocaleString()} />
              <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
              {countries.map((c, i) => (
                <Line key={c} type="monotone" dataKey={c} stroke={PALETTE[i % PALETTE.length]} strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-card border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-1">Investment (Cumulative, USD Millions)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Disclosed investment in bidirectional pilots, by country over time. EU projects consolidated.
        </p>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={investData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={{ stroke: 'hsl(var(--border))' }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={{ stroke: 'hsl(var(--border))' }} tickFormatter={(v) => `$${v}M`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `$${v.toFixed(1)}M`} />
              <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
              {countries.map((c, i) => (
                <Line key={c} type="monotone" dataKey={c} stroke={PALETTE[i % PALETTE.length]} strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
}
