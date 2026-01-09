import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Sparkles, Building2, Lightbulb, Target, Cpu, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PatentAreaDetails } from '@/data/patentAreasData';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface InnovationAreaPopupProps {
  area: PatentAreaDetails;
  children: ReactNode;
}

const statusConfig = {
  saturated: {
    label: 'Saturated',
    color: 'bg-muted text-muted-foreground',
    icon: TrendingDown,
    description: 'Crowded IP space, declining new filings'
  },
  active: {
    label: 'Active',
    color: 'bg-energy-blue/10 text-energy-blue',
    icon: Minus,
    description: 'Steady innovation, established players'
  },
  growing: {
    label: 'Growing',
    color: 'bg-energy-amber/10 text-energy-amber',
    icon: TrendingUp,
    description: 'Increasing patent activity, emerging space'
  },
  'white-space': {
    label: 'White Space',
    color: 'bg-energy-green/10 text-energy-green',
    icon: Sparkles,
    description: 'Open opportunity, limited existing IP'
  }
};

const chartColors = [
  'hsl(142, 76%, 36%)',  // green
  'hsl(262, 83%, 58%)',  // purple
  'hsl(199, 89%, 48%)',  // blue
  'hsl(43, 96%, 56%)',   // amber
  'hsl(346, 77%, 49%)',  // pink
];

export function InnovationAreaPopup({ area, children }: InnovationAreaPopupProps) {
  const [open, setOpen] = useState(false);
  const StatusIcon = statusConfig[area.status].icon;
  
  // Get technology keys from first trend point (excluding 'year')
  const techKeys = Object.keys(area.patentTrends[0]).filter(k => k !== 'year');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className={cn(
          'p-4 border-b',
          area.status === 'saturated' ? 'bg-muted/50' :
          area.status === 'active' ? 'bg-energy-blue/5' :
          area.status === 'growing' ? 'bg-energy-amber/5' :
          'bg-gradient-to-r from-primary/10 to-accent/10'
        )}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-semibold text-foreground text-base">{area.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">{area.description}</p>
            </div>
            <Badge className={cn('shrink-0', statusConfig[area.status].color)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig[area.status].label}
            </Badge>
          </div>
        </div>

        {/* Patent Trend Chart */}
        <div className="p-4 border-b bg-card">
          <h5 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Patent Applications by Technology
          </h5>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={area.patentTrends} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  width={35}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }}
                  iconSize={8}
                />
                {techKeys.map((key, idx) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={chartColors[idx % chartColors.length]}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Technologies with Status */}
        <div className="p-4 border-b bg-card">
          <h5 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Technology Status Overview
            <span className="text-xs text-muted-foreground font-normal ml-1">(hover for details)</span>
          </h5>
          <div className="grid grid-cols-2 gap-2">
            {area.technologies.map((tech, idx) => (
              <HoverCard key={tech.name} openDelay={100} closeDelay={50}>
                <HoverCardTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div 
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: chartColors[idx % chartColors.length] }}
                      />
                      <span className="text-xs text-foreground truncate">{tech.name}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'text-[10px] px-1.5 py-0 shrink-0 ml-1',
                        statusConfig[tech.status].color
                      )}
                    >
                      {statusConfig[tech.status].label}
                    </Badge>
                  </motion.div>
                </HoverCardTrigger>
                <HoverCardContent className="w-72 p-0 overflow-hidden" side="top" align="center">
                  <div className={cn(
                    'px-3 py-2 border-b flex items-center gap-2',
                    statusConfig[tech.status].color
                  )}>
                    <Cpu className="w-4 h-4" />
                    <span className="font-medium text-sm">{tech.name}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tech.description}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FileText className="w-3 h-3" />
                        <span>{tech.patents.toLocaleString()} patents</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn('text-[10px]', statusConfig[tech.status].color)}
                      >
                        {statusConfig[tech.status].description}
                      </Badge>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>

        {/* Key Players */}
        <div className="p-4 border-b bg-card">
          <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Key Players
            <span className="text-xs text-muted-foreground font-normal ml-1">(hover for details)</span>
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {area.keyPlayers.map((player) => (
              <HoverCard key={player.name} openDelay={100} closeDelay={50}>
                <HoverCardTrigger asChild>
                  <Badge 
                    variant="secondary" 
                    className="text-xs cursor-pointer hover:bg-secondary/80 transition-colors"
                  >
                    {player.name}
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="w-72 p-0 overflow-hidden" side="top" align="center">
                  <div className="px-3 py-2 border-b bg-secondary/50 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{player.name}</span>
                  </div>
                  <div className="p-3 space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {player.description}
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                        <Target className="w-3 h-3 text-primary" />
                        <span>IP Focus Areas</span>
                      </div>
                      <ul className="space-y-1">
                        {player.ipFocus.map((focus, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                            {focus}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="p-4 bg-gradient-to-br from-primary/5 to-accent/5">
          <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-energy-amber" />
            Strategic Opportunities
          </h5>
          <ul className="space-y-1">
            {area.opportunities.map((opp, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-energy-green mt-1.5 shrink-0" />
                {opp}
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
