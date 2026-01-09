import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';

const data = [
  { year: '2024', value: 5.75 },
  { year: '2025', value: 7.3 },
  { year: '2026', value: 9.2 },
  { year: '2027', value: 11.5 },
  { year: '2028', value: 14.2 },
  { year: '2029', value: 17.1 },
  { year: '2030', value: 19.5 },
];

export function MarketSizeChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-6 rounded-2xl bg-card border border-border"
    >
      <h3 className="text-lg font-semibold text-foreground mb-1 text-center">Market Size</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        V2X Market Size (USD Billion)
      </p>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`$${value}B`, 'Market Size']}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index < 3 ? 'hsl(var(--muted-foreground))' : 'hsl(var(--energy-amber))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-3 mt-4">
        <Badge className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20">
          CAGR 27.6%
        </Badge>
        <Badge className="bg-energy-amber/10 text-energy-amber border-energy-amber/30 hover:bg-energy-amber/20">
          Exponential Growth
        </Badge>
      </div>
    </motion.div>
  );
}
