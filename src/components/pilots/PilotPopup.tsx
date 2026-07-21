import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Zap,
  Car,
  MapPin,
  Building2,
  FileText,
  CircleDot,
  Gauge,
  TrendingDown,
  Banknote,
  PiggyBank,
  Sun,
  ShieldCheck,
  Clock,
  Info,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { pilotDetailsMap } from '@/data/pilotDetailsData';
import { getPilotMedia, explainGap } from '@/data/pilotMedia';

interface PilotPopupProps {
  pilotId: string | null;
  pilotData?: any; // fallback DB record
  open: boolean;
  onClose: () => void;
}

const maturityColors: Record<string, string> = {
  lab: 'bg-energy-blue/10 text-energy-blue border-energy-blue/30',
  pilot: 'bg-energy-amber/10 text-energy-amber border-energy-amber/30',
  depot: 'bg-energy-green/10 text-energy-green border-energy-green/30',
  grid_critical: 'bg-energy-purple/10 text-energy-purple border-energy-purple/30',
};

const statusColors: Record<string, string> = {
  active: 'bg-energy-green text-white',
  completed: 'bg-energy-blue text-white',
  planned: 'bg-energy-amber text-white',
};

function findRichDetails(pilotId: string | null, pilotData?: any) {
  if (!pilotId && !pilotData) return null;
  // Try by id first
  if (pilotId && pilotDetailsMap[pilotId]) return pilotDetailsMap[pilotId];
  // Then match by name (case-insensitive)
  const name = pilotData?.name?.toLowerCase().trim();
  if (!name) return null;
  const match = Object.values(pilotDetailsMap).find(
    (p: any) => p.name?.toLowerCase().trim() === name
  );
  return match || null;
}

export function PilotPopup({ pilotId, pilotData, open, onClose }: PilotPopupProps) {
  if (!pilotId && !pilotData) return null;

  const pilot: any = findRichDetails(pilotId, pilotData);

  // Fallback: render from DB record when rich details aren't available
  if (!pilot) {
    if (!pilotData) return null;
    return <FallbackPopup pilot={pilotData} open={open} onClose={onClose} />;
  }

  // Build metrics array based on available data
  const metricsToShow = [];
  
  metricsToShow.push({ 
    icon: <Zap className="w-5 h-5" />, 
    label: 'Power Level', 
    value: pilot.metrics.powerLevel,
    color: 'text-primary'
  });
  
  metricsToShow.push({ 
    icon: <Car className="w-5 h-5" />, 
    label: 'Vehicles', 
    value: pilot.metrics.vehicles.toString(),
    color: 'text-accent'
  });
  
  metricsToShow.push({ 
    icon: <Gauge className="w-5 h-5" />, 
    label: 'Efficiency', 
    value: pilot.metrics.efficiency,
    color: 'text-energy-green'
  });
  
  if (pilot.metrics.demandChargeReduction) {
    metricsToShow.push({ 
      icon: <TrendingDown className="w-5 h-5" />, 
      label: 'Demand Charge Reduction', 
      value: pilot.metrics.demandChargeReduction,
      color: 'text-energy-blue'
    });
  }
  
  if (pilot.metrics.peakReduction) {
    metricsToShow.push({ 
      icon: <TrendingDown className="w-5 h-5" />, 
      label: 'Peak Reduction', 
      value: pilot.metrics.peakReduction,
      color: 'text-energy-blue'
    });
  }
  
  if (pilot.metrics.annualRevenue) {
    metricsToShow.push({ 
      icon: <Banknote className="w-5 h-5" />, 
      label: 'Annual Grid Revenue', 
      value: pilot.metrics.annualRevenue,
      color: 'text-energy-amber'
    });
  }
  
  if (pilot.metrics.annualSavings) {
    metricsToShow.push({ 
      icon: <PiggyBank className="w-5 h-5" />, 
      label: 'Annual Savings', 
      value: pilot.metrics.annualSavings,
      color: 'text-energy-amber'
    });
  }
  
  if (pilot.metrics.solarConsumption) {
    metricsToShow.push({ 
      icon: <Sun className="w-5 h-5" />, 
      label: 'Solar Self-Consumption', 
      value: pilot.metrics.solarConsumption,
      color: 'text-energy-amber'
    });
  }
  
  if (pilot.metrics.backupCapability) {
    metricsToShow.push({ 
      icon: <ShieldCheck className="w-5 h-5" />, 
      label: 'Backup Capability', 
      value: pilot.metrics.backupCapability,
      color: 'text-energy-purple'
    });
  }
  
  if (pilot.metrics.investment) {
    metricsToShow.push({ 
      icon: <Banknote className="w-5 h-5" />, 
      label: 'Pilot Investment', 
      value: pilot.metrics.investment,
      color: 'text-muted-foreground'
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0 overflow-hidden">
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

            {/* Main Content Grid - Two Columns */}
            <div className="grid lg:grid-cols-5 gap-6 mb-6">
              {/* Left Column - Description, Business Model, Standardization */}
              <div className="lg:col-span-3 space-y-4">
                {/* Pilot Description */}
                <InfoSection 
                  title="Pilot Description" 
                  icon={<Info className="w-4 h-4" />}
                  accentColor="text-foreground"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pilot.description}
                  </p>
                </InfoSection>

                {/* Business Model */}
                <InfoSection 
                  title="Business Model" 
                  icon={<Building2 className="w-4 h-4" />}
                  accentColor="text-primary"
                >
                  <p className="font-semibold text-foreground">{pilot.businessModel.type}</p>
                  <p className="text-sm text-muted-foreground">{pilot.businessModel.description}</p>
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
              </div>

              {/* Right Column - Metric Boxes */}
              <div className="lg:col-span-2">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Key Metrics
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {metricsToShow.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg bg-muted/50 border text-center"
                    >
                      <div className={cn('flex justify-center mb-2', metric.color)}>
                        {metric.icon}
                      </div>
                      <p className="text-xs text-muted-foreground leading-tight mb-1">{metric.label}</p>
                      <p className="text-xl font-bold text-foreground">{metric.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Section - Technology Overview & Timeline Side by Side */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Technology Overview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Technology Overview
                </h3>
                
                {/* Overview Badge */}
                <div className="flex justify-center">
                  <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
                    {pilot.technology.overview}
                  </Badge>
                </div>

                {/* Hardware & Software Row */}
                <div className="grid grid-cols-2 gap-3">
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
                <div className="grid grid-cols-2 gap-3">
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

              {/* Project Timeline */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Project Timeline
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {pilot.projectInfo.partner}
                </p>

                {/* Timeline */}
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

// Fallback popup for DB pilots without rich hardcoded details
function FallbackPopup({ pilot, open, onClose }: { pilot: any; open: boolean; onClose: () => void }) {
  const media = getPilotMedia(pilot.name);
  const images: { url: string; caption?: string; credit?: string }[] =
    media?.images && media.images.length > 0
      ? media.images
      : pilot.imageUrl
      ? [{ url: pilot.imageUrl, caption: pilot.name }]
      : [];

  const metrics: { icon: React.ReactNode; label: string; value: string; color: string }[] = [];
  if (pilot.powerLevel && pilot.powerLevel !== '-')
    metrics.push({ icon: <Zap className="w-5 h-5" />, label: 'Power Level', value: pilot.powerLevel, color: 'text-primary' });
  if (pilot.vehicleCount)
    metrics.push({ icon: <Car className="w-5 h-5" />, label: 'Vehicles', value: String(pilot.vehicleCount), color: 'text-accent' });
  if (pilot.investmentUsd)
    metrics.push({ icon: <Banknote className="w-5 h-5" />, label: 'Investment (USD)', value: `$${Number(pilot.investmentUsd).toLocaleString()}`, color: 'text-energy-amber' });
  if (pilot.startDate)
    metrics.push({ icon: <Clock className="w-5 h-5" />, label: 'Start', value: String(pilot.startDate).slice(0, 10), color: 'text-energy-blue' });

  const references = media?.references || [];

  const gaps: string[] = pilot.bottlenecks || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6 space-y-5">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <DialogTitle className="text-xl font-semibold text-foreground">{pilot.name}</DialogTitle>
                {pilot.maturity && (
                  <Badge variant="outline" className={cn('text-xs capitalize', maturityColors[pilot.maturity])}>
                    {String(pilot.maturity).replace('_', ' ')}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{pilot.location || pilot.country || '-'}</span>
                {pilot.status && (
                  <>
                    <span className="mx-2">•</span>
                    <Badge className={cn('text-xs', statusColors[pilot.status])}>{pilot.status}</Badge>
                  </>
                )}
              </div>
            </DialogHeader>

            {metrics.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {metrics.map((m) => (
                  <div key={m.label} className="p-3 rounded-lg bg-muted/50 border text-center">
                    <div className={cn('flex justify-center mb-1', m.color)}>{m.icon}</div>
                    <p className="text-[11px] text-muted-foreground leading-tight mb-0.5">{m.label}</p>
                    <p className="text-base font-bold text-foreground">{m.value}</p>
                  </div>
                ))}
              </div>
            )}

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="gallery">
                  Gallery{images.length > 0 ? ` (${images.length})` : ''}
                </TabsTrigger>
                <TabsTrigger value="gaps">
                  Gaps{gaps.length > 0 ? ` (${gaps.length})` : ''}
                </TabsTrigger>
                <TabsTrigger value="partners">Partners</TabsTrigger>
                <TabsTrigger value="references">
                  References{references.length > 0 ? ` (${references.length})` : ''}
                </TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview" className="mt-4 space-y-4">
                {pilot.description ? (
                  <div className="p-4 rounded-lg border bg-card space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      <Info className="w-4 h-4" /> Description
                    </h4>
                    {renderDescriptionSections(pilot.description)}
                  </div>
                ) : null}

                {pilot.gridServices?.length > 0 && (
                  <div className="p-4 rounded-lg border bg-card">
                    <h4 className="text-sm font-semibold mb-2 text-primary flex items-center gap-2">
                      <Zap className="w-4 h-4" /> V2X Services
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {pilot.gridServices.map((s: string) => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Gallery */}
              <TabsContent value="gallery" className="mt-4">
                {images.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {images.map((img, i) => (
                      <figure key={i} className="rounded-lg overflow-hidden border bg-card">
                        <div className="aspect-[16/10] bg-muted overflow-hidden">
                          <img
                            src={img.url}
                            alt={img.caption || pilot.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        {(img.caption || img.credit) && (
                          <figcaption className="p-2.5 text-xs">
                            {img.caption && <p className="text-foreground">{img.caption}</p>}
                            {img.credit && <p className="text-muted-foreground mt-0.5">© {img.credit}</p>}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground text-center">
                    No photos available for this pilot yet.
                  </div>
                )}
              </TabsContent>

              {/* Gaps / Bottlenecks */}
              <TabsContent value="gaps" className="mt-4 space-y-3">
                {gaps.length > 0 ? (
                  gaps.map((g) => {
                    const detail = explainGap(g, media?.gapExplanations);
                    return (
                      <div key={g} className="p-4 rounded-lg border bg-card">
                        <div className="flex items-center gap-2 mb-1.5">
                          <TrendingDown className="w-4 h-4 text-energy-amber" />
                          <h5 className="text-sm font-semibold text-foreground">{g}</h5>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {detail || 'Identified as an open technical or regulatory gap for this pilot. Additional context to be added as sources are collected.'}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground text-center">
                    No gaps or bottlenecks recorded for this pilot.
                  </div>
                )}
              </TabsContent>

              {/* Partners */}
              <TabsContent value="partners" className="mt-4">
                {pilot.partners?.length > 0 ? (
                  <div className="p-4 rounded-lg border bg-card">
                    <h4 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Partners ({pilot.partners.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {pilot.partners.map((p: string) => (
                        <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground text-center">
                    No partner list recorded for this pilot.
                  </div>
                )}
              </TabsContent>

              {/* References */}
              <TabsContent value="references" className="mt-4">
                {references.length > 0 ? (
                  <ul className="space-y-2">
                    {references.map((r, i) => (
                      <li key={i} className="p-3 rounded-lg border bg-card">
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2 group"
                        >
                          <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {r.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {[r.source, r.date].filter(Boolean).join(' • ')}
                            </p>
                            <p className="text-[11px] text-muted-foreground/70 truncate mt-0.5">{r.url}</p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-6 rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground text-center">
                    No references recorded for this pilot yet.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
