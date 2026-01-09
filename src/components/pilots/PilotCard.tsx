import { motion } from 'framer-motion';
import { MapPin, Zap, Car, Activity, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Pilot } from '@/types/v2x';
import { Badge } from '@/components/ui/badge';

interface PilotCardProps {
  pilot: Pilot;
  index: number;
  onClick?: () => void;
}

const maturityColors = {
  lab: 'bg-energy-blue/10 text-energy-blue border-energy-blue/20',
  pilot: 'bg-energy-amber/10 text-energy-amber border-energy-amber/20',
  depot: 'bg-energy-green/10 text-energy-green border-energy-green/20',
  grid_critical: 'bg-energy-purple/10 text-energy-purple border-energy-purple/20',
};

const statusColors = {
  active: 'bg-energy-green',
  completed: 'bg-energy-blue',
  planned: 'bg-energy-amber',
};

export function PilotCard({ pilot, index, onClick }: PilotCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group relative w-full text-left p-6 rounded-xl bg-card border hover:border-primary/40 hover:shadow-lg transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {pilot.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{pilot.location}</span>
          </div>
        </div>
        <div className={cn('w-2.5 h-2.5 rounded-full', statusColors[pilot.status])} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
          <Zap className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Power</p>
            <p className="text-sm font-medium text-foreground">{pilot.powerLevel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
          <Car className="w-4 h-4 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">Vehicles</p>
            <p className="text-sm font-medium text-foreground">{pilot.vehicleCount}</p>
          </div>
        </div>
      </div>

      {/* Grid Services */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Activity className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Grid Services</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {pilot.gridServices.slice(0, 3).map((service, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {service}
            </Badge>
          ))}
        </div>
      </div>

      {/* Bottlenecks */}
      {pilot.bottlenecks.length > 0 && (
        <div className="pt-3 border-t">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-energy-amber" />
            <span className="text-xs text-muted-foreground">Key Bottlenecks</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {pilot.bottlenecks.join(' • ')}
          </p>
        </div>
      )}

      {/* Maturity badge */}
      <Badge
        variant="outline"
        className={cn('absolute top-4 right-4 text-xs capitalize', maturityColors[pilot.maturity])}
      >
        {pilot.maturity.replace('_', ' ')}
      </Badge>
    </motion.button>
  );
}
