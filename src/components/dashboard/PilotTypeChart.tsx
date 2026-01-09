import { motion } from 'framer-motion';
import { Bus, Truck, Ship, Building2, Home, Warehouse } from 'lucide-react';
import { pilotProjects } from '@/data/v2xData';
import { cn } from '@/lib/utils';

const pilotTypes = [
  { id: 'bus_depot', label: 'Bus Depots', icon: Bus, color: 'bg-energy-blue' },
  { id: 'fleet', label: 'Fleets', icon: Truck, color: 'bg-energy-teal' },
  { id: 'port', label: 'Ports', icon: Ship, color: 'bg-energy-green' },
  { id: 'logistics', label: 'Logistics', icon: Warehouse, color: 'bg-energy-amber' },
  { id: 'building', label: 'Buildings', icon: Building2, color: 'bg-energy-orange' },
  { id: 'residential', label: 'Residential', icon: Home, color: 'bg-energy-purple' },
];

export function PilotTypeChart() {
  const maxCount = Math.max(...pilotTypes.map(type => 
    pilotProjects.filter(p => p.type === type.id).length
  ), 1);

  return (
    <div className="p-6 bg-card rounded-2xl border">
      <h3 className="text-lg font-semibold text-foreground mb-6">Pilots by Application Domain</h3>

      <div className="space-y-4">
        {pilotTypes.map((type, index) => {
          const Icon = type.icon;
          const count = pilotProjects.filter(p => p.type === type.id).length;
          const percentage = (count / maxCount) * 100;

          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              {/* Icon */}
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                type.color,
                'bg-opacity-20'
              )}>
                <Icon className={cn('w-5 h-5', type.color.replace('bg-', 'text-'))} />
              </div>

              {/* Bar */}
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{type.label}</span>
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                    className={cn('h-full rounded-full', type.color)}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total count */}
      <div className="mt-6 pt-4 border-t flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Total Pilots Tracked</span>
        <span className="text-2xl font-bold text-gradient-energy">{pilotProjects.length}</span>
      </div>
    </div>
  );
}
