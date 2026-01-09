import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const patentData = [
  { year: '1967', applications: 0, publications: 0 },
  { year: '1975', applications: 5, publications: 3 },
  { year: '1980', applications: 12, publications: 8 },
  { year: '1987', applications: 25, publications: 18 },
  { year: '1996', applications: 45, publications: 35 },
  { year: '2003', applications: 120, publications: 95 },
  { year: '2007', applications: 280, publications: 220 },
  { year: '2010', applications: 480, publications: 380 },
  { year: '2014', applications: 550, publications: 450 },
  { year: '2017', applications: 620, publications: 580 },
  { year: '2020', applications: 780, publications: 720 },
  { year: '2022', applications: 890, publications: 820 },
  { year: '2024', applications: 920, publications: 880 },
];

export function PatentEvolutionChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-xl bg-card border"
    >
      <h4 className="text-base font-semibold text-foreground mb-4">
        Patent Applications & Publications Evolution
      </h4>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={patentData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              domain={[0, 1000]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              itemStyle={{ color: 'hsl(var(--muted-foreground))' }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="line"
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Line
              type="monotone"
              dataKey="applications"
              name="Patent Applications"
              stroke="hsl(220, 30%, 15%)"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(220, 30%, 15%)' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="publications"
              name="Patent Publications"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
