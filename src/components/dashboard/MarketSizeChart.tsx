import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';

// Bidirectional charging / V2G market projections (USD Billion)
// Source: V2X State-of-the-Art Report (uploaded, 2025) - Executive Summary
// Scope: energy-side V2X (V2G / V2H / V2B / V2L), NOT automotive V2X communications.
// Note: MarketsandMarkets "Automotive V2X" and Precedence Research "Vehicle-to-Everything"
// forecasts were excluded because they cover DSRC / C-V2X connectivity (V2V, V2I, V2P),
// which is out of scope for this bidirectional-charging report.
const data = [
  { year: '2024', sota: 4.5 },
  { year: '2025', sota: 5.75 },
  { year: '2026', sota: 7.3 },
  { year: '2027', sota: 9.3 },
  { year: '2028', sota: 11.9 },
  { year: '2029', sota: 15.2 },
  { year: '2030', sota: 19.5 },
];

const series = [
  { key: 'sota', name: 'V2X SOTA Report (2025) - bidirectional charging scope', color: 'hsl(var(--primary))' },
];

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
        USD Billion, energy-side V2X (V2G / V2H / V2B / V2L)
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
          CAGR 27.6% (2025-2030)
        </Badge>
      </div>
      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Source:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• <span className="text-foreground">V2X State-of-the-Art Report</span> (uploaded, 2025) - Executive Summary</li>
        </ul>
        <p className="text-xs text-muted-foreground font-medium pt-2">Excluded after verification (out of scope - automotive V2X communications, not bidirectional charging):</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• MarketsandMarkets "Automotive V2X Market" (2024) - covers DSRC / C-V2X (V2V, V2I, V2P)</li>
          <li>• Precedence Research "Vehicle-to-Everything Market" (2024) - covers connectivity technology</li>
        </ul>
      </div>
    </motion.div>
  );
}
