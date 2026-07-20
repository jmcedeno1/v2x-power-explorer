import { motion } from 'framer-motion';
import { MapPin, Zap, Car, Activity, DollarSign, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface PilotCardProps {
  pilot: any;
  index: number;
  onClick?: () => void;
}

const maturityColors: Record<string, string> = {
  lab: 'bg-energy-blue/10 text-energy-blue border-energy-blue/20',
  pilot: 'bg-energy-amber/10 text-energy-amber border-energy-amber/20',
  depot: 'bg-energy-green/10 text-energy-green border-energy-green/20',
  grid_critical: 'bg-energy-purple/10 text-energy-purple border-energy-purple/20',
};

const statusColors: Record<string, string> = {
  active: 'bg-energy-green',
  completed: 'bg-energy-blue',
  planned: 'bg-energy-amber',
};

function formatInvestment(usd?: number | null) {
  if (!usd || usd <= 0) return null;
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(1)}B`;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}k`;
  return `$${usd}`;
}

function formatYear(d?: string | null) {
  if (!d) return null;
  const y = new Date(d).getFullYear();
  return isNaN(y) ? null : y;
}

export function PilotCard({ pilot, index, onClick }: PilotCardProps) {
  const investment = formatInvestment(pilot.investmentUsd);
  const startY = formatYear(pilot.startDate);
  const endY = formatYear(pilot.endDate);
  const timeline = startY ? (endY && endY !== startY ? `${startY}–${endY}` : `${startY}`) : null;
  const partnerCount = (pilot.partners || []).length;

  const metrics = [
    { icon: Zap, label: 'Power', value: pilot.powerLevel, color: 'text-primary' },
    { icon: Car, label: 'Vehicles', value: pilot.vehicleCount || '—', color: 'text-accent' },
    investment && { icon: DollarSign, label: 'Investment', value: investment, color: 'text-energy-green' },
    timeline && { icon: Calendar, label: 'Timeline', value: timeline, color: 'text-energy-blue' },
    partnerCount > 0 && { icon: Users, label: 'Partners', value: partnerCount, color: 'text-energy-amber' },
  ].filter(Boolean) as { icon: any; label: string; value: any; color: string }[];

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative w-full text-left rounded-xl bg-card border hover:border-primary/40 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Photo */}
      {pilot.imageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={pilot.imageUrl}
            alt={pilot.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {pilot.maturity && (
            <Badge
              variant="outline"
              className={cn('absolute top-3 right-3 text-xs capitalize backdrop-blur-sm bg-background/80', maturityColors[pilot.maturity])}
            >
              {pilot.maturity.replace('_', ' ')}
            </Badge>
          )}
        </div>
      ) : (
        <div className="relative h-2 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20">
          {pilot.maturity && (
            <Badge
              variant="outline"
              className={cn('absolute top-3 right-3 text-xs capitalize', maturityColors[pilot.maturity])}
            >
              {pilot.maturity.replace('_', ' ')}
            </Badge>
          )}
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {pilot.name}
            </h4>
            {pilot.location && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{pilot.location}</span>
              </div>
            )}
          </div>
          <div className={cn('w-2.5 h-2.5 rounded-full mt-1.5 shrink-0', pilot.status ? statusColors[pilot.status] : 'bg-muted')} />
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {metrics.slice(0, 6).map((m, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <m.icon className={cn('w-3.5 h-3.5 shrink-0', m.color)} />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground leading-tight">{m.label}</p>
                <p className="text-xs font-semibold text-foreground truncate">{m.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Grid Services */}
        {(pilot.gridServices || []).length > 0 && (
          <div className="mt-auto pt-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Activity className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">V2X Services</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {(pilot.gridServices || []).slice(0, 4).map((service: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.button>
  );
}
