import { motion } from 'framer-motion';
import { Map, Lightbulb, AlertTriangle, Clock, Target } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { cn } from '@/lib/utils';

const opportunities = [
  {
    category: 'Engineering',
    items: [
      { title: 'SiC/GaN Power Modules', impact: 'high', timeframe: 'near' },
      { title: 'Grid-isolated Algorithms', impact: 'high', timeframe: 'mid' },
      { title: 'Interleaved Converter Design', impact: 'medium', timeframe: 'near' },
    ],
  },
  {
    category: 'Markets',
    items: [
      { title: 'Fleet V2B Services', impact: 'high', timeframe: 'near' },
      { title: 'VPP Aggregation Platforms', impact: 'high', timeframe: 'mid' },
      { title: 'Cross-border Energy Trading', impact: 'medium', timeframe: 'long' },
    ],
  },
  {
    category: 'Infrastructure',
    items: [
      { title: 'Depot-scale Hubs', impact: 'high', timeframe: 'near' },
      { title: 'MCS Implementation', impact: 'high', timeframe: 'mid' },
      { title: 'Grid-integrated Microgrids', impact: 'medium', timeframe: 'mid' },
    ],
  },
];

const challenges = [
  { title: 'Battery Warranty Uncertainty', severity: 'critical', type: 'Commercial' },
  { title: 'Utility Interconnection Delays', severity: 'critical', type: 'Regulatory' },
  { title: 'Double Taxation Policies', severity: 'major', type: 'Regulatory' },
  { title: 'Cybersecurity Frameworks', severity: 'major', type: 'Technical' },
  { title: 'Herd Behavior Risk', severity: 'emerging', type: 'System' },
  { title: 'Exit Problem (Early Unplug)', severity: 'moderate', type: 'Operational' },
];

const timeHorizons = [
  { period: 'Near-term (1-2 years)', focus: 'V2B for fleet depots, demand charge avoidance', color: 'bg-energy-green' },
  { period: 'Mid-term (3-5 years)', focus: 'V2G frequency regulation, VPP aggregation', color: 'bg-energy-blue' },
  { period: 'Long-term (5+ years)', focus: 'Grid-critical infrastructure, megawatt-scale operations', color: 'bg-energy-purple' },
];

export default function OpportunitiesPage() {
  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Map className="w-7 h-7 text-white" />}
          title="Opportunity & Challenge Map"
          description="Strategic synthesis of opportunities, barriers, and time horizons"
          badge="Strategic"
        />

        {/* Opportunity grid */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-energy-green" />
            <h3 className="text-lg font-semibold text-foreground">Opportunity Landscape</h3>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            {opportunities.map((cat, catIndex) => (
              <motion.div
                key={catIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: catIndex * 0.1 }}
                className="p-5 rounded-xl bg-card border"
              >
                <h4 className="font-semibold text-foreground mb-4">{cat.category}</h4>
                <div className="space-y-3">
                  {cat.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-sm text-foreground">{item.title}</span>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'px-1.5 py-0.5 rounded text-xs',
                          item.impact === 'high' ? 'bg-energy-green/20 text-energy-green' :
                          'bg-energy-amber/20 text-energy-amber'
                        )}>
                          {item.impact}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">{item.timeframe}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Challenge stack */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-energy-amber" />
            <h3 className="text-lg font-semibold text-foreground">Challenge Stack</h3>
          </div>
          <div className="p-6 rounded-xl bg-card border">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    'p-4 rounded-lg border-l-4',
                    challenge.severity === 'critical' ? 'border-l-energy-red bg-energy-red/5' :
                    challenge.severity === 'major' ? 'border-l-energy-amber bg-energy-amber/5' :
                    challenge.severity === 'emerging' ? 'border-l-energy-blue bg-energy-blue/5' :
                    'border-l-muted-foreground bg-muted/30'
                  )}
                >
                  <p className="font-medium text-foreground text-sm">{challenge.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">{challenge.type}</span>
                    <span className={cn(
                      'text-xs capitalize',
                      challenge.severity === 'critical' ? 'text-energy-red' :
                      challenge.severity === 'major' ? 'text-energy-amber' : 'text-energy-blue'
                    )}>
                      {challenge.severity}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Time horizon view */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Time Horizon View</h3>
          </div>
          <div className="space-y-3">
            {timeHorizons.map((horizon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border"
              >
                <div className={cn('w-4 h-4 rounded-full', horizon.color)} />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{horizon.period}</p>
                  <p className="text-sm text-muted-foreground">{horizon.focus}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Control points */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-energy-purple" />
            <h3 className="text-lg font-semibold text-foreground">Control Points</h3>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-energy-purple/5 to-primary/5 border border-energy-purple/20">
            <p className="text-sm text-foreground mb-4">
              <strong>Where future power and value will concentrate:</strong>
            </p>
            <ul className="grid sm:grid-cols-2 gap-3">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-energy-purple mt-2" />
                <span className="text-sm text-foreground">VPP aggregation and orchestration platforms</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-energy-purple mt-2" />
                <span className="text-sm text-foreground">Fleet energy management systems</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-energy-purple mt-2" />
                <span className="text-sm text-foreground">Grid-interface hardware manufacturers</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-energy-purple mt-2" />
                <span className="text-sm text-foreground">Utility partnership frameworks</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
