import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { year: '2016', patents: 35, granted: 12, publications: 45, searchTrends: 20 },
  { year: '2017', patents: 48, granted: 18, publications: 52, searchTrends: 25 },
  { year: '2018', patents: 62, granted: 28, publications: 68, searchTrends: 32 },
  { year: '2019', patents: 78, granted: 42, publications: 85, searchTrends: 38 },
  { year: '2020', patents: 95, granted: 55, publications: 92, searchTrends: 48 },
  { year: '2021', patents: 88, granted: 68, publications: 78, searchTrends: 62 },
  { year: '2022', patents: 72, granted: 75, publications: 65, searchTrends: 75 },
  { year: '2023', patents: 65, granted: 82, publications: 58, searchTrends: 88 },
  { year: '2024', patents: 58, granted: 88, publications: 52, searchTrends: 95 },
];

export function MaturityDiffusionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-card border border-border"
    >
      <h3 className="text-lg font-semibold text-foreground mb-2">Maturity and Diffusion</h3>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-energy-amber rounded"></span>
          Patent Applications
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-foreground rounded"></span>
          Granted Patents
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-muted-foreground rounded"></span>
          Academic Publications
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-energy-red rounded"></span>
          Search Trends
        </div>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="year" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
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
            />
            <Line
              type="monotone"
              dataKey="patents"
              stroke="hsl(var(--energy-amber))"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(var(--energy-amber))' }}
              name="Patent Applications"
            />
            <Line
              type="monotone"
              dataKey="granted"
              stroke="hsl(var(--foreground))"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(var(--foreground))' }}
              name="Granted Patents"
            />
            <Line
              type="monotone"
              dataKey="publications"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(var(--muted-foreground))' }}
              name="Publications"
            />
            <Line
              type="monotone"
              dataKey="searchTrends"
              stroke="hsl(var(--energy-red))"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(var(--energy-red))' }}
              name="Search Trends"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        V2X Technology Diffusion Model (2016-2024)
      </p>
    </motion.div>
  );
}
