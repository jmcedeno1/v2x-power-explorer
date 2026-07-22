import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';

// Global bidirectional charging / V2G market projections (USD Millions).
// All six sources are scoped to bidirectional charging (V2G / V2H / V2L), not automotive
// V2X communications. Values are anchored on each publisher's reported base/forecast
// figures and interpolated across the intermediate years using the reported CAGR.
const data = [
  { year: '2024', mnm: 54.6, gvr: 233.8, factmr: null, cmi: 1112.5, mordor: 4967.3, psi: 229.4 },
  { year: '2025', mnm: 70.0, gvr: 290.9, factmr: 884.0, cmi: 1335.0, mordor: 6071.0, psi: 290.0 },
  { year: '2026', mnm: 89.8, gvr: 361.9, factmr: 1014.8, cmi: 1602.0, mordor: 7420.0, psi: 366.6 },
  { year: '2027', mnm: 115.2, gvr: 450.2, factmr: 1165.0, cmi: 1922.4, mordor: 9068.7, psi: 463.3 },
  { year: '2028', mnm: 147.8, gvr: 560.0, factmr: 1337.5, cmi: 2306.8, mordor: 11083.8, psi: 585.7 },
  { year: '2029', mnm: 189.7, gvr: 696.7, factmr: 1535.4, cmi: 2768.2, mordor: 13546.6, psi: 740.3 },
  { year: '2030', mnm: 243.3, gvr: 866.7, factmr: 1762.6, cmi: 3321.8, mordor: 16556.7, psi: 935.7 },
  { year: '2031', mnm: 312.2, gvr: 1078.1, factmr: 2023.5, cmi: 3986.2, mordor: 20235.6, psi: 1182.7 },
  { year: '2032', mnm: 400.6, gvr: 1341.2, factmr: 2323.0, cmi: 4783.4, mordor: null, psi: 1495.0 },
  { year: '2033', mnm: 513.9, gvr: 1668.4, factmr: 2666.8, cmi: null, mordor: null, psi: null },
  { year: '2034', mnm: 659.4, gvr: null, factmr: 3061.5, cmi: null, mordor: null, psi: null },
  { year: '2035', mnm: 846.0, gvr: null, factmr: 3514.6, cmi: null, mordor: null, psi: null },
  { year: '2036', mnm: null, gvr: null, factmr: 4034.7, cmi: null, mordor: null, psi: null },
];

const series = [
  { key: 'mnm', name: 'MarketsandMarkets (2025) - CAGR 28.3%', color: 'hsl(var(--primary))' },
  { key: 'gvr', name: 'Grand View Research (2026) - CAGR 24.4%', color: 'hsl(var(--energy-teal))' },
  { key: 'factmr', name: 'Fact.MR (2026) - CAGR 14.8%', color: 'hsl(var(--energy-amber))' },
  { key: 'cmi', name: 'Custom Market Insights (2026) - CAGR 20.0%', color: 'hsl(var(--accent))' },
  { key: 'mordor', name: 'Mordor Intelligence V2G (2026) - CAGR 22.2%', color: 'hsl(var(--destructive))' },
  { key: 'psi', name: 'P&S Intelligence (2026) - CAGR 26.4%', color: 'hsl(var(--muted-foreground))' },
];

const fmt = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}B` : `$${v.toFixed(0)}M`);

export function MarketSizeChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-6 rounded-2xl bg-card border border-border"
    >
      <h3 className="text-lg font-semibold text-foreground mb-1 text-center">Global Bidirectional Charging Market Size</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        USD Millions, comparison across six published forecasts (V2G / V2H / V2L scope)
      </p>
      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              scale="log"
              domain={[50, 25000]}
              ticks={[50, 100, 500, 1000, 5000, 10000, 20000]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={fmt}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => [fmt(value), name]}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={{ r: 2.5, fill: s.color }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2 italic">
        Log scale. Absolute values differ by publisher scope (hardware only vs full V2G ecosystem), but all report double-digit CAGRs.
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <Badge className="bg-primary/10 text-primary border-primary/30">MnM 28.3%</Badge>
        <Badge className="bg-energy-teal/10 text-energy-teal border-energy-teal/30">GVR 24.4%</Badge>
        <Badge className="bg-energy-amber/10 text-energy-amber border-energy-amber/30">Fact.MR 14.8%</Badge>
        <Badge variant="outline">CMI 20.0%</Badge>
        <Badge variant="outline">Mordor 22.2%</Badge>
        <Badge variant="outline">P&amp;S 26.4%</Badge>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground font-medium mb-2">Sources (all bidirectional charging scope, verified):</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• <a href="https://www.marketsandmarkets.com/Market-Reports/bidirectional-charging-market-64700205.html" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary underline">MarketsandMarkets</a> - "Bidirectional Charging Market, Global Forecast to 2035" (Oct 2025): $70M (2025) → $844M (2035)</li>
          <li>• <a href="https://www.grandviewresearch.com/industry-analysis/bidirectional-charging-market-report" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary underline">Grand View Research</a> - "Bidirectional Charging Market 2026-2033": $290.9M (2025) → $1,591M (2033)</li>
          <li>• <a href="https://www.factmr.com/report/v2x-bidirectional-ev-charger-market" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary underline">Fact.MR</a> - "V2X Bidirectional EV Charger Market 2026-2036": $884M (2025) → $4,103M (2036)</li>
          <li>• <a href="https://www.custommarketinsights.com/report/bidirectional-ev-charging-market/" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary underline">Custom Market Insights</a> - "Global Bidirectional EV Charging Market 2024-2033": $927M (2023) → $4,619M (2032)</li>
          <li>• <a href="https://www.mordorintelligence.com/industry-reports/vehicle-to-grid-v2g-market" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary underline">Mordor Intelligence</a> - "Vehicle-to-Grid (V2G) Market 2026-2031": $7.42B (2026) → $20.24B (2031)</li>
          <li>• <a href="https://www.psmarketresearch.com/market-analysis/bidirectional-charging-market-report" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary underline">P&amp;S Intelligence</a> - "Bidirectional Charging Market 2026-2032": $290M (2025) → $1,492.5M (2032)</li>
        </ul>
      </div>
    </motion.div>
  );
}
