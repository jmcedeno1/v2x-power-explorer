import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, BarChart3, PieChart, Layers } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { expertQuestions } from '@/data/v2xData';

const marketMetrics = [
  {
    icon: DollarSign,
    title: 'Global V2X Market',
    value: '$19.5B',
    subtitle: 'Projected by 2030',
    color: 'from-energy-green to-energy-teal',
  },
  {
    icon: TrendingUp,
    title: 'CAGR',
    value: '27.6%',
    subtitle: 'Compound growth rate',
    color: 'from-energy-teal to-energy-blue',
  },
  {
    icon: PieChart,
    title: 'Commercial Share',
    value: '73%',
    subtitle: 'Fleet/commercial deployments',
    color: 'from-energy-blue to-energy-purple',
  },
  {
    icon: Layers,
    title: 'Revenue Stacking',
    value: '3-4x',
    subtitle: 'Service multiplier potential',
    color: 'from-energy-purple to-energy-orange',
  },
];

const revenueStreams = [
  { name: 'Demand Charge Avoidance (V2B)', share: 35, description: 'Offset site-level power spikes' },
  { name: 'Frequency Regulation (V2G)', share: 25, description: 'Sub-second grid responses' },
  { name: 'Energy Arbitrage', share: 20, description: 'Buy low, sell high' },
  { name: 'Backup Power', share: 15, description: 'Resilience as a service' },
  { name: 'RES Integration', share: 5, description: 'Renewable energy smoothing' },
];

export default function MarketsPage() {
  const marketQuestions = expertQuestions.filter(q => q.module === 'markets');

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<TrendingUp className="w-7 h-7 text-white" />}
          title="Markets & Business Models"
          description="Economic landscape and revenue opportunities in bidirectional energy"
          badge="Economic"
        />

        {/* Market metrics */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Market Indicators</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketMetrics.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-5 rounded-xl bg-card border hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Revenue stacking visualization */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Stacking Portfolio</h3>
          <div className="p-6 rounded-xl bg-card border">
            <div className="space-y-4">
              {revenueStreams.map((stream, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex justify-between mb-1">
                    <div>
                      <span className="text-sm font-medium text-foreground">{stream.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">– {stream.description}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">{stream.share}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stream.share}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Strategic Insight:</strong> Commercial traction is highest in heavy-duty fleets 
                and bus depots, where vehicles have batteries exceeding 300–600 kWh and predictable schedules.
              </p>
            </div>
          </div>
        </section>

        {/* Key evidence */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Market Evidence</h3>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-energy-green mt-2" />
                <p className="text-sm text-foreground">
                  <strong>"Revenue stacking"</strong> is the primary model, combining peak shaving, ancillary services, and demand-charge avoidance
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-energy-amber mt-2" />
                <p className="text-sm text-foreground">
                  <strong>"Double taxation"</strong> remains a barrier in several jurisdictions, taxing energy at draw and again at discharge
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  Centralized depots simplify <strong>grid-code compliance</strong> and utility interconnection logic vs. distributed residential
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* Expert questions */}
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-4">Expert Interview Questions</h3>
          <div className="space-y-3">
            {marketQuestions.map((question, index) => (
              <QuestionCard key={question.id} question={question} index={index} />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
