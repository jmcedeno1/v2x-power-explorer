import { motion } from 'framer-motion';
import { Telescope, TrendingUp, Target, Lightbulb, ArrowRight, Compass } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { cn } from '@/lib/utils';

const strategicPriorities = [
  {
    priority: 'Aggregation Platforms',
    description: 'VPP orchestration and fleet energy management systems',
    urgency: 'immediate',
  },
  {
    priority: 'Regulatory Positioning',
    description: 'Influence grid codes and interconnection processes',
    urgency: 'immediate',
  },
  {
    priority: 'Ecosystem Orchestration',
    description: 'Build partnerships across OEMs, utilities, and operators',
    urgency: 'near-term',
  },
  {
    priority: 'Heavy-Duty Electrification',
    description: 'Position for megawatt charging and V2X at scale',
    urgency: 'near-term',
  },
];

const futureSignals = [
  { signal: 'Major OEM announces V2X-inclusive battery warranty', impact: 'Accelerator' },
  { signal: 'Utility creates dedicated V2X grid service market', impact: 'Accelerator' },
  { signal: 'Government mandates V2X in commercial EVs', impact: 'Accelerator' },
  { signal: 'Grid service prices collapse due to oversupply', impact: 'Decelerator' },
  { signal: 'High-profile V2X-related grid incident', impact: 'Decelerator' },
  { signal: 'OEMs withdraw V2X support or limit warranties', impact: 'Decelerator' },
];

const investmentAreas = [
  { area: 'Grid-forming algorithms', focus: 'R&D', timeline: 'Now' },
  { area: 'Battery health monitoring', focus: 'R&D', timeline: 'Now' },
  { area: 'Cybersecurity frameworks', focus: 'R&D', timeline: 'Now' },
  { area: 'Fleet operator partnerships', focus: 'Business Dev', timeline: 'Now' },
  { area: 'Utility/grid operator relationships', focus: 'Business Dev', timeline: '1-2 years' },
  { area: 'Standards development influence', focus: 'Strategic', timeline: 'Ongoing' },
];

export default function ForesightPage() {

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Telescope className="w-7 h-7 text-white" />}
          title="Foresight & Strategic Hand-off"
          description="Forward-looking analysis and strategic recommendations for V2X stakeholders"
          badge="Foresight"
        />

        {/* Strategic priorities */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Strategic Priorities</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {strategicPriorities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-5 rounded-xl bg-card border hover:border-primary/40 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{item.priority}</h4>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium capitalize',
                    item.urgency === 'immediate' 
                      ? 'bg-energy-green/10 text-energy-green' 
                      : 'bg-energy-blue/10 text-energy-blue'
                  )}>
                    {item.urgency}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Future signals */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-energy-amber" />
            <h3 className="text-lg font-semibold text-foreground">Signals to Watch</h3>
          </div>
          <div className="p-6 rounded-xl bg-card border">
            <div className="grid md:grid-cols-2 gap-4">
              {futureSignals.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <ArrowRight className={cn(
                    'w-4 h-4 flex-shrink-0',
                    item.impact === 'Accelerator' ? 'text-energy-green' : 'text-energy-red'
                  )} />
                  <span className="text-sm text-foreground flex-1">{item.signal}</span>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    item.impact === 'Accelerator' 
                      ? 'bg-energy-green/10 text-energy-green' 
                      : 'bg-energy-red/10 text-energy-red'
                  )}>
                    {item.impact}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Investment focus */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-energy-green" />
            <h3 className="text-lg font-semibold text-foreground">Investment Focus Areas</h3>
          </div>
          <div className="p-6 rounded-xl bg-card border">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {investmentAreas.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-muted/50"
                >
                  <p className="font-medium text-foreground text-sm">{item.area}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{item.focus}</span>
                    <span className={cn(
                      'text-xs font-medium',
                      item.timeline === 'Now' ? 'text-energy-green' : 'text-energy-blue'
                    )}>
                      {item.timeline}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Key conclusions */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-energy-purple" />
            <h3 className="text-lg font-semibold text-foreground">Key Conclusions</h3>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/20">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  V2X power has shifted from <strong>technical feasibility</strong> to <strong>scaling and system integration</strong>
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  Competitive advantage is moving toward <strong>aggregation platforms</strong>, <strong>regulatory positioning</strong>, and <strong>ecosystem orchestration</strong>
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  <strong>Heavy-duty electrification</strong> and <strong>megawatt charging</strong> are the structural drivers that will define the future of V2X power
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                <p className="text-sm text-foreground">
                  Success requires balancing <strong>technology development</strong>, <strong>market positioning</strong>, and <strong>stakeholder alignment</strong>
                </p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
