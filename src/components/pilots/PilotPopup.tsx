import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Zap,
  Car,
  Activity,
  AlertCircle,
  MapPin,
  Building2,
  FileText,
  Settings,
  Cpu,
  Code,
  Shield,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2,
  CircleDot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PilotDetails, pilotDetailsMap } from '@/data/pilotDetailsData';

interface PilotPopupProps {
  pilotId: string | null;
  open: boolean;
  onClose: () => void;
}

const maturityColors = {
  lab: 'bg-energy-blue/10 text-energy-blue border-energy-blue/30',
  pilot: 'bg-energy-amber/10 text-energy-amber border-energy-amber/30',
  depot: 'bg-energy-green/10 text-energy-green border-energy-green/30',
  grid_critical: 'bg-energy-purple/10 text-energy-purple border-energy-purple/30',
};

const statusColors = {
  active: 'bg-energy-green text-white',
  completed: 'bg-energy-blue text-white',
  planned: 'bg-energy-amber text-white',
};

export function PilotPopup({ pilotId, open, onClose }: PilotPopupProps) {
  if (!pilotId) return null;
  
  const pilot = pilotDetailsMap[pilotId];
  if (!pilot) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            {/* Header */}
            <DialogHeader className="mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl font-bold text-primary">
                      Case: {pilot.name.split(' ')[0]}
                    </div>
                    <Badge variant="outline" className={cn('text-xs capitalize', maturityColors[pilot.maturity])}>
                      {pilot.maturity.replace('_', ' ')}
                    </Badge>
                  </div>
                  <DialogTitle className="text-xl font-semibold text-foreground">
                    {pilot.name}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{pilot.location}</span>
                    <span className="mx-2">•</span>
                    <Badge className={cn('text-xs', statusColors[pilot.status])}>
                      {pilot.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Left Column - Business Info */}
              <div className="space-y-4">
                {/* Business Model */}
                <InfoSection 
                  title="Business Model" 
                  icon={<Building2 className="w-4 h-4" />}
                  accentColor="text-primary"
                >
                  <p className="font-semibold text-foreground">{pilot.businessModel.type}</p>
                  <p className="text-sm text-muted-foreground">{pilot.businessModel.description}</p>
                </InfoSection>

                {/* Performance Metrics */}
                <InfoSection 
                  title="Performance Metrics" 
                  icon={<TrendingUp className="w-4 h-4" />}
                  accentColor="text-energy-green"
                >
                  <p className="text-sm text-foreground">
                    Efficiency: <span className="font-bold">{pilot.performance.efficiency}</span>
                  </p>
                  <p className="text-sm text-foreground">{pilot.performance.keyMetric}</p>
                  {pilot.performance.additionalMetrics && (
                    <ul className="mt-2 space-y-1">
                      {pilot.performance.additionalMetrics.map((metric, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-energy-green" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  )}
                </InfoSection>

                {/* Standardization */}
                <InfoSection 
                  title="Standardization Overview" 
                  icon={<FileText className="w-4 h-4" />}
                  accentColor="text-energy-blue"
                >
                  <p className="text-sm text-foreground">
                    Standard: <span className="font-bold">{pilot.standardization.standard}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{pilot.standardization.status}</p>
                </InfoSection>

                {/* Patents */}
                <InfoSection 
                  title="Patent Overview" 
                  icon={<Shield className="w-4 h-4" />}
                  accentColor="text-energy-amber"
                >
                  <p className="text-sm text-foreground">
                    <span className="font-bold">{pilot.patents.count} patents</span> - {pilot.patents.focus}
                  </p>
                  <p className="text-sm text-muted-foreground italic">Recent: {pilot.patents.recent}</p>
                </InfoSection>
              </div>

              {/* Right Column - Technology Overview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center text-foreground mb-4">
                  Technology Overview
                </h3>
                
                {/* Technology Diagram */}
                <div className="relative">
                  {/* Overview Badge */}
                  <div className="flex justify-center mb-4">
                    <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
                      {pilot.technology.overview}
                    </Badge>
                  </div>

                  {/* Hardware & Software Row */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <TechCategory 
                      title="Hardware" 
                      items={pilot.technology.hardware}
                      color="bg-energy-amber"
                    />
                    <TechCategory 
                      title="Software" 
                      items={pilot.technology.software}
                      color="bg-energy-green"
                    />
                  </div>

                  {/* Control Features */}
                  <div className="grid grid-cols-2 gap-4">
                    {pilot.technology.control.map((ctrl, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/50 border">
                        <h5 className="text-sm font-semibold text-foreground mb-2">{ctrl.name}</h5>
                        <ul className="space-y-1">
                          {ctrl.details.map((detail, j) => (
                            <li key={j} className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-primary" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricBox 
                icon={<Zap className="w-5 h-5" />}
                label="Power Level"
                value={pilot.powerLevel}
                color="text-primary"
              />
              <MetricBox 
                icon={<Car className="w-5 h-5" />}
                label="Vehicles"
                value={pilot.vehicleCount.toString()}
                color="text-accent"
              />
              <MetricBox 
                icon={<Activity className="w-5 h-5" />}
                label="Grid Services"
                value={pilot.gridServices.length.toString()}
                color="text-energy-green"
              />
              <MetricBox 
                icon={<AlertCircle className="w-5 h-5" />}
                label="Bottlenecks"
                value={pilot.bottlenecks.length.toString()}
                color="text-energy-amber"
              />
            </div>

            {/* Grid Services */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Grid Services
              </h4>
              <div className="flex flex-wrap gap-2">
                {pilot.gridServices.map((service, i) => (
                  <Badge key={i} variant="secondary" className="text-sm">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Key Bottlenecks */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-energy-amber" />
                Key Bottlenecks
              </h4>
              <div className="flex flex-wrap gap-2">
                {pilot.bottlenecks.map((bottleneck, i) => (
                  <Badge key={i} variant="outline" className="text-sm border-energy-amber/30 text-energy-amber">
                    {bottleneck}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Project Info & Timeline */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Pilot Project - {pilot.projectInfo.partner}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {pilot.projectInfo.description}
              </p>

              {/* Timeline */}
              <h4 className="text-center text-primary font-semibold mb-4">Project Timeline</h4>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/60 to-primary/20" />
                
                <div className="space-y-4">
                  {pilot.timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 pl-2"
                    >
                      <div className="relative z-10 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <CircleDot className="w-3 h-3 text-primary-foreground" />
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-primary italic">{item.phase}</span>
                          <Badge variant="outline" className="text-xs">{item.year}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Helper Components
function InfoSection({ 
  title, 
  icon, 
  children, 
  accentColor = 'text-primary' 
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div className="p-4 rounded-lg border bg-card">
      <h4 className={cn('text-sm font-semibold mb-2 flex items-center gap-2', accentColor)}>
        {icon}
        {title}
      </h4>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function TechCategory({ 
  title, 
  items, 
  color 
}: { 
  title: string; 
  items: { name: string; details: string[] }[];
  color: string;
}) {
  return (
    <div>
      <div className={cn('text-center py-2 px-4 rounded-t-lg text-white font-medium text-sm', color)}>
        {title}
      </div>
      <div className="border border-t-0 rounded-b-lg p-3 space-y-3 bg-card">
        {items.map((item, i) => (
          <div key={i}>
            <h5 className="text-sm font-semibold text-foreground">{item.name}</h5>
            <ul className="mt-1 space-y-0.5">
              {item.details.map((detail, j) => (
                <li key={j} className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricBox({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  color: string;
}) {
  return (
    <div className="p-4 rounded-lg bg-muted/50 border text-center">
      <div className={cn('flex justify-center mb-2', color)}>
        {icon}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
