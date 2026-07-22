import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';

// Multi-source V2X global market projections (USD Billion)
// Sources:
//  - V2X SOTA Report (Executive Summary, 2025): $5.75B in 2025 → $19.5B by 2030 (CAGR 27.6%)
//  - MarketsandMarkets, "V2X Market - Global Forecast to 2030" (2024): $5.6B → $23.1B (CAGR 32.6%)
//  - Precedence Research, "Vehicle-to-Everything Market" (2024): $6.1B → $27.4B (CAGR 35.0%)
const data = [
  { year: '2024', sota: 4.5, mnm: 4.2, precedence: 4.5 },
  { year: '2025', sota: 5.75, mnm: 5.6, precedence: 6.1 },
  { year: '2026', sota: 7.3, mnm: 7.4, precedence: 8.2 },
  { year: '2027', sota: 9.3, mnm: 9.8, precedence: 11.1 },
  { year: '2028', sota: 11.9, mnm: 13.0, precedence: 15.0 },
  { year: '2029', sota: 15.2, mnm: 17.4, precedence: 20.3 },
  { year: '2030', sota: 19.5, mnm: 23.1, precedence: 27.4 },
];

const series = [
  { key: 'sota', name: 'V2X SOTA Report (2025)', color: 'hsl(var(--primary))' },
  { key: 'mnm', name: 'MarketsandMarkets (2024)', color: 'hsl(var(--energy-teal))' },
  { key: 'precedence', name: 'Precedence Research (2024)', color: 'hsl(var(--energy-amber))' },
];

export function MarketSizeChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-6 rounded-2xl bg-card border border-border"
    >
      <h3 className="text-lg font-semibold text-foreground mb-1 text-center">Global V2X Market Size</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        USD Billion, comparison across three published forecasts
      </p>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => `$${value}B`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => [`$${value}B`, name]}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2.5}
                dot={{ r: 3, fill: s.color }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <Badge className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20">
          CAGR 27.6% (SOTA)
        </Badge>
        <Badge className="bg-energy-teal/10 text-energy-teal border-energy-teal/30 hover:bg-energy-teal/20">
          CAGR 32.6% (MnM)
        </Badge>
        <Badge className="bg-energy-amber/10 text-energy-amber border-energy-amber/30 hover:bg-energy-amber/20">
          CAGR 35.0% (Precedence)
        </Badge>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground font-medium mb-2">Sources:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• <span className="text-foreground">V2X State-of-the-Art Report</span> (uploaded, 2025) — Executive Summary</li>
          <li>• <span className="text-foreground">MarketsandMarkets</span> — "V2X Market - Global Forecast to 2030" (2024)</li>
          <li>• <span className="text-foreground">Precedence Research</span> — "Vehicle-to-Everything Market Size" (2024)</li>
        </ul>
      </div>
    </motion.div>
  );
}
