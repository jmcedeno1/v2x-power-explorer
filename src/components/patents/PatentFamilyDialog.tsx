import { ReactNode, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Building2, Cpu, Lightbulb, Target, TrendingUp } from 'lucide-react';
import type { PatentFamily, PatentFamilyStatus, PatentSubTech } from '@/data/patentFamilies';
import { cn } from '@/lib/utils';

const SUB_COLORS = ['hsl(var(--foreground))', 'hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--energy-amber))'];

export const statusClass = (status: PatentFamilyStatus) =>
  status === 'growing'
    ? 'bg-energy-green/10 text-energy-green border-energy-green/30'
    : status === 'active'
    ? 'bg-energy-blue/10 text-energy-blue border-energy-blue/30'
    : status === 'emerging'
    ? 'bg-energy-amber/10 text-energy-amber border-energy-amber/30'
    : 'bg-muted text-muted-foreground border-border';

export function StatusBadge({ status }: { status: PatentFamilyStatus }) {
  return (
    <span className={cn('text-[11px] px-2 py-0.5 rounded-full border capitalize shrink-0', statusClass(status))}>
      {status}
    </span>
  );
}

export function PatentFamilyDialog({ family, children }: { family: PatentFamily; children: ReactNode }) {
  const years = family.subs[0]?.perYear.map((p) => p.year) ?? [];
  const chartData = years.map((year, i) => {
    const row: Record<string, number | string> = { year };
    family.subs.forEach((s) => {
      row[s.name] = s.perYear[i]?.count ?? 0;
    });
    return row;
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 pr-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{family.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{family.description}</p>
          </div>
          <StatusBadge status={family.status} />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-muted/40 border text-center">
            <div className="text-xl font-bold tabular-nums text-foreground">{family.total.toLocaleString()}</div>
            <div className="text-[11px] text-muted-foreground">Total documents</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 border text-center">
            <div className="text-xl font-bold tabular-nums text-foreground">{family.granted2426}</div>
            <div className="text-[11px] text-muted-foreground">Granted 2024-2026</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 border text-center">
            <div className="text-xl font-bold tabular-nums text-foreground">{family.filings2425}</div>
            <div className="text-[11px] text-muted-foreground">Filings 2024-2025</div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Patent activity by sub-technology</h3>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {family.subs.map((s, i) => (
                  <Line
                    key={s.name}
                    type="monotone"
                    dataKey={s.name}
                    stroke={SUB_COLORS[i % SUB_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Sub-technology status</h3>
            <span className="text-[11px] text-muted-foreground">
              from {family.total.toLocaleString()} matched patents
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {family.subs.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: SUB_COLORS[i % SUB_COLORS.length] }}
                />
                <span className="text-xs font-medium text-foreground flex-1 truncate">{s.name}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{s.total}</span>
                <StatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Key players</h3>
            <span className="text-[11px] text-muted-foreground">by filings in this family</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {family.players.map((p) => (
              <span key={p.name} className="text-[11px] px-2 py-1 rounded-md bg-primary/5 border border-primary/20 text-foreground">
                {p.name} <span className="text-muted-foreground tabular-nums">&middot; {p.count}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl border bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Strategic opportunities</h3>
          </div>
          <ul className="space-y-2">
            {family.opportunities.map((o) => (
              <li key={o} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span className="text-sm text-foreground">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
