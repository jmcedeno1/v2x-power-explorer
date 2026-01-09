import { motion } from 'framer-motion';
import { Scale, FileCheck, Globe, Shield, Zap } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { expertQuestions } from '@/data/v2xData';
import { cn } from '@/lib/utils';

const standards = [
  {
    name: 'ISO 15118-20',
    year: '2022',
    status: 'active',
    description: 'First global standard explicitly enabling bidirectional power transfer',
    features: ['Dynamic Power Management', 'Bidirectional energy', 'Plug and Charge'],
  },
  {
    name: 'SAE J3271 (MCS)',
    year: '2024',
    status: 'active',
    description: 'Megawatt Charging System for heavy-duty vehicles',
    features: ['Up to 3.75 MW', 'Automotive Ethernet', 'Heavy-duty focus'],
  },
  {
    name: 'IEC 61850',
    year: 'Ongoing',
    status: 'developing',
    description: 'Grid integration and communication standards',
    features: ['Substation automation', 'DER integration', 'Grid services'],
  },
  {
    name: 'IEEE 2030.5',
    year: 'Ongoing',
    status: 'developing',
    description: 'Smart Energy Profile for demand response',
    features: ['Demand response', 'Load control', 'Pricing signals'],
  },
];

const gridCodeChallenges = [
  { challenge: 'Anti-islanding requirements', status: 'critical', region: 'Global' },
  { challenge: 'Utility interconnection timelines', status: 'major', region: '11-24 months avg' },
  { challenge: 'Security certificate trust', status: 'emerging', region: 'Cross-border' },
  { challenge: 'Double taxation policies', status: 'varies', region: 'Regional' },
];

export default function StandardsPage() {
  const standardsQuestions = expertQuestions.filter(q => q.module === 'standards');

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Scale className="w-7 h-7 text-white" />}
          title="Standards & Regulation"
          description="Grid codes, protocols, and regulatory landscape for V2X deployment"
          badge="Regulatory"
        />

        {/* Standards overview */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Key Standards</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {standards.map((standard, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-5 rounded-xl bg-card border hover:border-primary/40 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{standard.name}</h4>
                      <p className="text-xs text-muted-foreground">{standard.year}</p>
                    </div>
                  </div>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    standard.status === 'active' 
                      ? 'bg-energy-green/10 text-energy-green' 
                      : 'bg-energy-amber/10 text-energy-amber'
                  )}>
                    {standard.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{standard.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {standard.features.map((feature, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Grid code challenges */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Grid Code Challenges</h3>
          <div className="p-6 rounded-xl bg-card border">
            <div className="space-y-4">
              {gridCodeChallenges.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Shield className={cn(
                      'w-5 h-5',
                      item.status === 'critical' ? 'text-energy-red' :
                      item.status === 'major' ? 'text-energy-amber' : 'text-energy-blue'
                    )} />
                    <span className="text-sm font-medium text-foreground">{item.challenge}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{item.region}</span>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                      item.status === 'critical' ? 'bg-energy-red/10 text-energy-red' :
                      item.status === 'major' ? 'bg-energy-amber/10 text-energy-amber' :
                      'bg-energy-blue/10 text-energy-blue'
                    )}>
                      {item.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Key evidence */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Institutional Highlights</h3>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  <strong>ISO 15118-20</strong> includes "Dynamic Power Management" allowing vehicles to negotiate specific power levels based on battery health
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  The <strong>Megawatt Charging System (MCS)</strong> replaces Powerline Communication with Automotive Ethernet for higher bandwidth
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-energy-amber mt-2" />
                <p className="text-sm text-foreground">
                  Utility interconnection timelines averaging <strong>11-24 months</strong> remain a major barrier to rapid deployment
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* Expert questions */}
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-4">Expert Interview Questions</h3>
          <div className="space-y-3">
            {standardsQuestions.map((question, index) => (
              <QuestionCard key={question.id} question={question} index={index} />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
