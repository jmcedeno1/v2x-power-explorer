import { motion } from 'framer-motion';
import { FileText, TrendingUp, Cpu, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FindingCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  findings: string[];
}

const findingCategories: FindingCategory[] = [
  {
    id: 'maturity',
    title: 'Maturity and Diffusion',
    icon: FileText,
    color: 'text-energy-amber',
    findings: [
      'Patenting trend indicates <strong>shifting investment focus</strong> since 2020, with emphasis moving from basic hardware to commercial-enablement IP and aggregation platforms.',
      'Standards coverage is <strong>rapidly maturing</strong> with ISO 15118-20 enabling bidirectional power transfer. <strong>Regional divergence remains</strong> between China (high-power DC) and Europe (AC focus).',
      'Technology maturity rated at <strong>TRL 7-8 for core components</strong>, while grid-forming and aggregation logic are at TRL 5-6 and still evolving.',
    ],
  },
  {
    id: 'market',
    title: 'Market and Main Players',
    icon: TrendingUp,
    color: 'text-energy-green',
    findings: [
      'Market size projected to grow from <strong>$5.75B (2025) to $19.5B (2030)</strong>, with a CAGR of 27.6%, driven by fleet electrification and grid services.',
      'Traction concentrated in <strong>commercial fleets, bus depots, and logistics hubs</strong> where 300-600 kWh battery packs enable massive energy aggregation.',
      'Key players include infrastructure providers, technology suppliers (SiC-based modules), and emerging V2G aggregators patenting fleet control platforms.',
    ],
  },
  {
    id: 'technology',
    title: 'Technological Development',
    icon: Cpu,
    color: 'text-energy-blue',
    findings: [
      '<strong>Off-board DC bidirectional architectures</strong> favored for fleet depots, handling 100-600 kW today with >1 MW expected for heavy-duty contexts.',
      'Power electronics transitioning from silicon to <strong>Silicon Carbide (SiC)</strong> for higher switching frequencies, efficiency, and smaller footprints.',
      'Core bottlenecks identified: <strong>thermal management</strong> for long-duration discharge, real-time control stability, and grid-code compliance certification.',
    ],
  },
  {
    id: 'grid',
    title: 'Grid Integration & Services',
    icon: Zap,
    color: 'text-energy-purple',
    findings: [
      'Technical emphasis shifted to grid services: <strong>frequency regulation, peak shaving, and renewable balancing</strong> represent strongest revenue opportunities.',
      'Round-trip bidirectional efficiency at <strong>88-92%</strong> compared to 94-96% for standard charging, driving research toward continuous duty optimization.',
      'Business models focus on <strong>"revenue stacking"</strong>: combining demand-charge avoidance, ancillary services, peak shaving, backup power, and energy arbitrage.',
    ],
  },
];

export function KeyFindings() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 rounded-2xl bg-card border border-border"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">Key Findings</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {findingCategories.map((category, categoryIndex) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * categoryIndex }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  category.color === 'text-energy-amber' && 'bg-energy-amber/10',
                  category.color === 'text-energy-green' && 'bg-energy-green/10',
                  category.color === 'text-energy-blue' && 'bg-energy-blue/10',
                  category.color === 'text-energy-purple' && 'bg-energy-purple/10',
                )}>
                  <Icon className={cn("w-4 h-4", category.color)} />
                </div>
                <h4 className={cn("font-semibold text-sm", category.color)}>
                  {category.title}
                </h4>
              </div>
              <ul className="space-y-2 pl-10">
                {category.findings.map((finding, findingIndex) => (
                  <motion.li
                    key={findingIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * categoryIndex + 0.05 * findingIndex }}
                    className="text-sm text-muted-foreground relative before:content-['•'] before:absolute before:-left-4 before:text-primary"
                    dangerouslySetInnerHTML={{ __html: finding }}
                  />
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
