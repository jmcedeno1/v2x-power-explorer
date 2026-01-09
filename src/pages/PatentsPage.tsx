import { motion } from 'framer-motion';
import { FileText, TrendingUp, Search, Lock, Cpu, Cloud } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { expertQuestions } from '@/data/v2xData';
import { patentAreasData } from '@/data/patentAreasData';
import { InnovationAreaPopup } from '@/components/patents/InnovationAreaPopup';
import { PatentEvolutionChart } from '@/components/patents/PatentEvolutionChart';
import { PatentBreakthroughTimeline } from '@/components/patents/PatentBreakthroughTimeline';
import { cn } from '@/lib/utils';

const ipMetrics = [
  { label: 'Total V2X Patents', value: '126,000+', trend: 'Growing' },
  { label: 'Hardware Focus', value: '< 2020', trend: 'Legacy' },
  { label: 'Commercial IP', value: '2020+', trend: 'Active' },
  { label: 'White Space', value: 'Security', trend: 'Opportunity' },
];

const strategicGaps = [
  { area: 'Grid-isolated control algorithms', description: 'Managing power during total blackout without central help', icon: Cloud },
  { area: 'Bidirectional cybersecurity', description: 'Securing the energy loop from malicious discharge attacks', icon: Lock },
  { area: 'Thermal management for V2G', description: 'Long-duration discharge cooling solutions', icon: Cpu },
];

export default function PatentsPage() {
  const patentQuestions = expertQuestions.filter(q => q.module === 'patents');

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<FileText className="w-7 h-7 text-white" />}
          title="Patents & IP"
          description="Intellectual property landscape and strategic innovation opportunities"
          badge="IP Analysis"
        />

        {/* IP metrics */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">IP Landscape Overview</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ipMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-5 rounded-xl bg-card border"
              >
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                <p className={cn(
                  'text-xs mt-1',
                  metric.trend === 'Growing' || metric.trend === 'Opportunity' ? 'text-energy-green' :
                  metric.trend === 'Active' ? 'text-energy-blue' : 'text-muted-foreground'
                )}>
                  {metric.trend}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Key evidence - moved above Innovation Area Maturity */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">IP Landscape Highlights</h3>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  Since 2020, patent filings have shifted from <strong>hardware to "commercial enablement" IP</strong> such as grid-stabilization and VPP platforms
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-energy-green mt-2" />
                <p className="text-sm text-foreground">
                  Strategic gaps remain in <strong>grid-isolated control algorithms</strong> and <strong>cybersecurity of the bidirectional loop</strong>
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  Core inversion topologies are <strong>largely saturated</strong>, with innovation moving to software and system integration
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* Patent evolution chart and Innovation Area side by side */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Patent Maturity</h3>
          <div className="grid lg:grid-cols-2 gap-6">
            <PatentEvolutionChart />
            
            {/* Innovation Area Maturity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-xl bg-card border"
            >
              <h4 className="text-base font-semibold text-foreground mb-1">Innovation Area Maturity</h4>
              <p className="text-xs text-muted-foreground mb-4">Click each area for detailed patent trends</p>
              <div className="space-y-3">
                {patentAreasData.map((area, index) => (
                  <InnovationAreaPopup key={area.id} area={area}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="cursor-pointer hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors"
                    >
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{area.name}</span>
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full capitalize',
                          area.status === 'saturated' ? 'bg-muted text-muted-foreground' :
                          area.status === 'active' ? 'bg-energy-blue/10 text-energy-blue' :
                          area.status === 'growing' ? 'bg-energy-amber/10 text-energy-amber' :
                          'bg-energy-green/10 text-energy-green'
                        )}>
                          {area.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${area.maturity}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                          className={cn(
                            'h-full rounded-full',
                            area.status === 'saturated' ? 'bg-muted-foreground' :
                            area.status === 'active' ? 'bg-energy-blue' :
                            area.status === 'growing' ? 'bg-energy-amber' :
                            'bg-gradient-to-r from-primary to-accent'
                          )}
                        />
                      </div>
                    </motion.div>
                  </InnovationAreaPopup>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* V2X Breakthrough Timeline - full width */}
        <section className="mb-10">
          <PatentBreakthroughTimeline />
        </section>

        {/* Strategic gaps */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Strategic White Space</h3>
          <div className="grid lg:grid-cols-3 gap-4">
            {strategicGaps.map((gap, index) => {
              const Icon = gap.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">{gap.area}</h4>
                  <p className="text-sm text-muted-foreground">{gap.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Expert questions */}
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-4">Expert Interview Questions</h3>
          <div className="space-y-3">
            {patentQuestions.map((question, index) => (
              <QuestionCard key={question.id} question={question} index={index} />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
