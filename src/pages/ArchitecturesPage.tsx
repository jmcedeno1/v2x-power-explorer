import { motion } from 'framer-motion';
import { Network, Cpu, Battery, Zap, Building2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { cn } from '@/lib/utils';

const architectures = [
  {
    name: 'On-board AC V2X',
    power: 'Up to 22 kW',
    pros: ['Lower infrastructure cost', 'Uses existing OBC', 'Simpler installation'],
    cons: ['Limited power level', 'Added vehicle weight', 'OEM dependency'],
    maturity: 'Mature',
    useCase: 'Residential, light commercial',
  },
  {
    name: 'Off-board DC V2X',
    power: '100 kW - 1+ MW',
    pros: ['High power levels', 'No vehicle modification', 'Easier grid compliance'],
    cons: ['Higher infrastructure cost', 'Requires DC connector', 'Complex installation'],
    maturity: 'Emerging',
    useCase: 'Fleet depots, heavy-duty',
  },
  {
    name: 'Satellite Hub Architecture',
    power: '600 kW per hub',
    pros: ['Centralized conversion', 'Multi-vehicle support', 'Efficient land use'],
    cons: ['Complex coordination', 'Single point of failure', 'Higher upfront cost'],
    maturity: 'Pilot',
    useCase: 'Bus depots, logistics centers',
  },
];

const systemComponents = [
  { name: 'Bidirectional DC/DC Converter', function: 'Voltage regulation', icon: Cpu },
  { name: 'Grid-tied AC/DC Inverter', function: 'Grid synchronization', icon: Zap },
  { name: 'Local BESS Buffer', function: 'Energy buffering', icon: Battery },
  { name: 'Site Energy Management', function: 'Coordination & optimization', icon: Building2 },
];

export default function ArchitecturesPage() {

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Network className="w-7 h-7 text-white" />}
          title="System Architectures"
          description="Technical topologies and system design patterns for V2X infrastructure"
          badge="Architecture"
        />

        {/* Architecture comparison */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Architecture Options</h3>
          <div className="grid lg:grid-cols-3 gap-4">
            {architectures.map((arch, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-5 rounded-xl bg-card border hover:border-primary/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-foreground">{arch.name}</h4>
                    <p className="text-sm text-primary font-medium">{arch.power}</p>
                  </div>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    arch.maturity === 'Mature' ? 'bg-energy-green/10 text-energy-green' :
                    arch.maturity === 'Emerging' ? 'bg-energy-blue/10 text-energy-blue' :
                    'bg-energy-amber/10 text-energy-amber'
                  )}>
                    {arch.maturity}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Advantages</p>
                  <ul className="space-y-1">
                    {arch.pros.map((pro, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <div className="w-1 h-1 rounded-full bg-energy-green" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Challenges</p>
                  <ul className="space-y-1">
                    {arch.cons.map((con, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <div className="w-1 h-1 rounded-full bg-energy-amber" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground">Best for: <span className="text-foreground">{arch.useCase}</span></p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* System components */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Key System Components</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemComponents.map((comp, index) => {
              const Icon = comp.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-5 rounded-xl bg-card border text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-medium text-foreground text-sm mb-1">{comp.name}</h4>
                  <p className="text-xs text-muted-foreground">{comp.function}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Architecture evidence */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Architecture Highlights</h3>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  <strong>Off-board DC V2X</strong> bypasses vehicle OBC constraints, enabling discharge rates of hundreds of kW or megawatt-level transfers
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  Modern systems integrate <strong>local BESS</strong> to buffer V2G discharge and avoid expensive substation upgrades
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  Kempower's <strong>modular satellite architecture</strong> centralizes bidirectional conversion in the Power Unit for megawatt-level services
                </p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
