import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricData } from '@/types/v2x';

interface MetricCardProps {
  metric: MetricData;
  index: number;
}

export function MetricCard({ metric, index }: MetricCardProps) {
  const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="metric-card group"
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">{metric.value}</span>
          {metric.unit && (
            <span className="text-sm text-muted-foreground">{metric.unit}</span>
          )}
        </div>
        {metric.change && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium',
            metric.trend === 'up' && 'text-energy-green',
            metric.trend === 'down' && 'text-energy-red',
            metric.trend === 'stable' && 'text-muted-foreground'
          )}>
            <TrendIcon className="w-3 h-3" />
            <span>{metric.change}</span>
          </div>
        )}
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </motion.div>
  );
}
