import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  pilots: any[];
}

export function PilotTimelines({ pilots }: Props) {
  const { fleetData, investData } = useMemo(() => {
    const events: Record<number, { fleet: number; invest: number }> = {};
    let minYear = Infinity;
    let maxYear = -Infinity;

    for (const p of pilots) {
      const dateStr = p.startDate || p.start_date;
      if (!dateStr) continue;
      const year = new Date(dateStr).getFullYear();
      if (!year || isNaN(year)) continue;
      minYear = Math.min(minYear, year);
      maxYear = Math.max(maxYear, year);
      events[year] ??= { fleet: 0, invest: 0 };
      events[year].fleet += Number(p.vehicleCount || 0);
      events[year].invest += Number(p.investmentUsd || 0);
    }

    if (!isFinite(minYear)) return { fleetData: [], investData: [] };
    maxYear = Math.max(maxYear, new Date().getFullYear());

    const fleetRows: any[] = [];
    const investRows: any[] = [];
    let fleet = 0;
    let invest = 0;
    for (let y = minYear; y <= maxYear; y++) {
      const ev = events[y];
      if (ev) {
        fleet += ev.fleet;
        invest += ev.invest;
      }
      fleetRows.push({ year: String(y), vehicles: fleet });
      investRows.push({ year: String(y), investment: invest / 1e6 });
    }

    return { fleetData: fleetRows, investData: investRows };
  }, [pilots]);

  if (!fleetData.length) return null;

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
          Total EVs deployed in bidirectional pilots worldwide over time.
        </p>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fleetData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={{ stroke: 'hsl(var(--border))' }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={{ stroke: 'hsl(var(--border))' }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v.toLocaleString(), 'Vehicles']} />
              <Line type="monotone" dataKey="vehicles" name="Vehicles" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 5 }} />
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
          Disclosed investment in bidirectional pilots worldwide over time.
        </p>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={investData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={{ stroke: 'hsl(var(--border))' }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={{ stroke: 'hsl(var(--border))' }} tickFormatter={(v) => `$${v}M`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toFixed(1)}M`, 'Investment']} />
              <Line type="monotone" dataKey="investment" name="Investment" stroke="hsl(var(--energy-teal))" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
}
