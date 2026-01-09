import { motion } from 'framer-motion';
import { FlaskConical, Building2, Network, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { pilotProjects } from '@/data/v2xData';

const stages = [
  { id: 'lab', label: 'Lab Research', icon: FlaskConical, description: 'Proof of concept' },
  { id: 'pilot', label: 'Pilot Projects', icon: Building2, description: 'Controlled trials' },
  { id: 'depot', label: 'Depot Scale', icon: Network, description: 'Multi-vehicle hubs' },
  { id: 'grid_critical', label: 'Grid Critical', icon: Shield, description: 'Mission-critical' },
];

export function MaturityTimeline() {
  // Count pilots at each maturity stage
  const stageCounts = stages.map(stage => ({
    ...stage,
    count: pilotProjects.filter(p => p.maturity === stage.id).length,
  }));

  return (
    <div className="p-6 bg-card rounded-2xl border">
      <h3 className="text-lg font-semibold text-foreground mb-6">Technology Maturity Timeline</h3>

      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-8 left-8 right-8 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '75%' }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-primary via-accent to-energy-green rounded-full"
          />
        </div>

        {/* Stages */}
        <div className="relative flex justify-between">
          {stageCounts.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = index <= 2;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                className="flex flex-col items-center"
              >
                {/* Node */}
                <div className={cn(
                  'relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300',
                  isActive
                    ? 'bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30'
                    : 'bg-muted border-2 border-dashed border-muted-foreground/30'
                )}>
                  <Icon className={cn(
                    'w-6 h-6',
                    isActive ? 'text-white' : 'text-muted-foreground'
                  )} />

                  {/* Count badge */}
                  {stage.count > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-energy-green text-white text-xs font-bold flex items-center justify-center">
                      {stage.count}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-4 text-center">
                  <p className={cn(
                    'text-sm font-medium',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {stage.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stage.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current focus indicator */}
      <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-energy-green animate-pulse" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Current Focus:</span> Depot-scale deployments with 10-50 vehicles
          </p>
        </div>
      </div>
    </div>
  );
}
