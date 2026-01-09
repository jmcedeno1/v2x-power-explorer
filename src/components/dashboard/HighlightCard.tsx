import { motion } from 'framer-motion';
import { Zap, RefreshCw, Truck, Layers, Activity, Shield, Cpu, FileCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Highlight } from '@/types/v2x';
import { Badge } from '@/components/ui/badge';

interface HighlightCardProps {
  highlight: Highlight;
  index: number;
  onClick?: () => void;
}

const categoryColors = {
  technology: 'bg-energy-blue/10 text-energy-blue border-energy-blue/20',
  market: 'bg-energy-green/10 text-energy-green border-energy-green/20',
  regulation: 'bg-energy-amber/10 text-energy-amber border-energy-amber/20',
  infrastructure: 'bg-energy-purple/10 text-energy-purple border-energy-purple/20',
};

const impactColors = {
  high: 'from-primary to-accent',
  medium: 'from-energy-amber to-energy-orange',
  low: 'from-muted to-muted-foreground',
};

const iconMap: Record<string, React.ElementType> = {
  Zap, RefreshCw, Truck, Layers, Activity, Shield, Cpu, FileCheck
};

export function HighlightCard({ highlight, index, onClick }: HighlightCardProps) {
  const IconComponent = iconMap[highlight.icon] || Zap;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col items-start gap-4 p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 text-left w-full"
    >
      {/* Icon */}
      <div className={cn(
        'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300',
        impactColors[highlight.impact]
      )}>
        <IconComponent className="w-7 h-7 text-white" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {highlight.title}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {highlight.description}
        </p>
      </div>

      {/* Category badge */}
      <Badge variant="outline" className={cn('text-xs', categoryColors[highlight.category])}>
        {highlight.category}
      </Badge>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl pointer-events-none">
        <div className={cn(
          'absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300',
          'bg-gradient-to-br',
          impactColors[highlight.impact]
        )} />
      </div>

      {/* Click indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-4 h-4 text-primary" />
      </div>
    </motion.button>
  );
}
