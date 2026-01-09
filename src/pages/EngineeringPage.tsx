import { motion } from 'framer-motion';
import { Cpu, Thermometer, Gauge, Battery, Zap } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { expertQuestions } from '@/data/v2xData';

const engineeringHighlights = [
  {
    icon: Gauge,
    title: 'Round-trip Efficiency',
    value: '88-92%',
    subtitle: 'vs 94-96% unidirectional',
    color: 'from-energy-blue to-energy-teal',
  },
  {
    icon: Thermometer,
    title: 'SiC Semiconductors',
    value: '+40%',
    subtitle: 'Better thermal performance',
    color: 'from-energy-teal to-energy-green',
  },
  {
    icon: Battery,
    title: 'Ripple Reduction',
    value: '20x',
    subtitle: 'Interleaved converters',
    color: 'from-energy-green to-energy-amber',
  },
  {
    icon: Zap,
    title: 'Power Levels',
    value: '600kW+',
    subtitle: 'Current DC V2G systems',
    color: 'from-energy-amber to-energy-orange',
  },
];

const techSpecs = [
  { label: 'DC-link Voltage', value: '800-1000V', status: 'mature' },
  { label: 'Power Reversal Time', value: '<100ms', status: 'developing' },
  { label: 'Anti-islanding', value: 'Required', status: 'critical' },
  { label: 'Liquid Cooling', value: 'Standard', status: 'mature' },
];

export default function EngineeringPage() {
  const engineeringQuestions = expertQuestions.filter(q => q.module === 'engineering');

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Cpu className="w-7 h-7 text-white" />}
          title="Engineering & Research"
          description="Technical deep-dive into bidirectional power electronics and system design"
          badge="Technical"
        />

        {/* Highlights grid */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Key Technical Metrics</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {engineeringHighlights.map((item, index) => {
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

        {/* Technical specifications */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Requirements</h3>
          <div className="p-6 rounded-xl bg-card border">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {techSpecs.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex flex-col"
                >
                  <span className="text-sm text-muted-foreground">{spec.label}</span>
                  <span className="text-lg font-semibold text-foreground mt-1">{spec.value}</span>
                  <span className={`text-xs mt-1 ${
                    spec.status === 'mature' ? 'text-energy-green' :
                    spec.status === 'developing' ? 'text-energy-amber' : 'text-energy-red'
                  }`}>
                    {spec.status.charAt(0).toUpperCase() + spec.status.slice(1)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Evidence panel */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Key Evidence</h3>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  Engineering focus has shifted to <strong>Silicon Carbide (SiC) semiconductors</strong> to handle higher heat during continuous operation
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  <strong>Interleaved converters</strong> reduce battery stress by decreasing current ripple by nearly 20 times
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  <strong>Off-board DC V2X</strong> enables discharge rates of hundreds of kilowatts or even megawatt-level transfers
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  Significant challenges remain in <strong>stabilization of DC-link voltage</strong> during rapid power flow reversals
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* Expert questions */}
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-4">Expert Interview Questions</h3>
          <div className="space-y-3">
            {engineeringQuestions.map((question, index) => (
              <QuestionCard key={question.id} question={question} index={index} />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
