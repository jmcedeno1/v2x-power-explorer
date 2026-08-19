import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

// Global Vehicle-to-Grid (V2G) market, Astute Analytica (Feb 2026).
// Base value US$ 6.27B (2025) growing to US$ 65.84B (2035) at 26.50% CAGR.
// Intermediate years interpolated with the reported CAGR.
const data = [
  { year: '2025', astute: 6270 },
  { year: '2026', astute: 7931 },
  { year: '2027', astute: 10033 },
  { year: '2028', astute: 12692 },
  { year: '2029', astute: 16056 },
  { year: '2030', astute: 20311 },
  { year: '2031', astute: 25693 },
  { year: '2032', astute: 32501 },
  { year: '2033', astute: 41114 },
  { year: '2034', astute: 52010 },
  { year: '2035', astute: 65840 },
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
      <h3 className="text-lg font-semibold text-foreground mb-1 text-center">Global Vehicle-to-Grid Market Size</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        USD Millions, Astute Analytica forecast 2025-2035 (V2G hardware, software and services)
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
              domain={[0, 70000]}
              ticks={[0, 10000, 20000, 30000, 40000, 50000, 60000, 70000]}
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
              formatter={(value: number) => [fmt(value), 'V2G market']}
            />
            <Line
              type="monotone"
              dataKey="astute"
              name="Astute Analytica (2026) - CAGR 26.5%"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{ r: 3, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2 italic">
        Single-source view. Values interpolated between the reported 2025 base and 2035 forecast using the 26.50% CAGR.
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <Badge className="bg-primary/10 text-primary border-primary/30">CAGR 26.5%</Badge>
        <Badge variant="outline">North America 38.22% share</Badge>
        <Badge variant="outline">Frequency regulation 21.40%</Badge>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground font-medium mb-2">Source:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• <a href="https://finance.yahoo.com/news/vehicle-grid-market-reach-us-170200563.html" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary underline">Astute Analytica</a> - "Vehicle-to-Grid Market to Reach US$ 65.84 Billion by 2035" (Feb 2026): $6.27B (2025) → $65.84B (2035), CAGR 26.50%</li>
        </ul>
      </div>
    </motion.div>
  );
}
