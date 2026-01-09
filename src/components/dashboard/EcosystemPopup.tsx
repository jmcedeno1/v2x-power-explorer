import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, AlertTriangle, Target, Eye, Briefcase, Network, ExternalLink, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ecosystemNodes, type EcosystemNode } from '@/data/ecosystemData';

type ViewMode = 'technical' | 'business' | 'system';

interface EcosystemPopupProps {
  nodeId: string | null;
  open: boolean;
  onClose: () => void;
  onNavigate?: (section: string) => void;
}

export function EcosystemPopup({ nodeId, open, onClose, onNavigate }: EcosystemPopupProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('technical');
  
  if (!nodeId || !ecosystemNodes[nodeId]) return null;
  
  const node = ecosystemNodes[nodeId];
  const Icon = node.icon;

  const handleNavigate = (section: string) => {
    onClose();
    onNavigate?.(section);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden bg-card border-2 border-primary/20">
        <DialogTitle className="sr-only">{node.label} - V2X Ecosystem</DialogTitle>
        
        {/* Header */}
        <div className={cn(
          "relative p-6 bg-gradient-to-br",
          node.color
        )}>
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <Icon className="w-9 h-9 text-white" />
            </motion.div>
            <div className="flex-1">
              <motion.h2
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-bold text-white"
              >
                {node.label}
              </motion.h2>
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="text-white/90 mt-1"
              >
                {node.roleStatement}
              </motion.p>
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex gap-2 mt-3"
              >
                {node.roleTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </motion.div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="absolute top-4 right-12 flex gap-1 bg-white/10 rounded-lg p-1">
            {[
              { mode: 'technical' as ViewMode, icon: Network, label: 'Technical' },
              { mode: 'business' as ViewMode, icon: Briefcase, label: 'Business' },
              { mode: 'system' as ViewMode, icon: Eye, label: 'System' },
            ].map(({ mode, icon: ModeIcon, label }) => (
              <TooltipProvider key={mode}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setViewMode(mode)}
                      className={cn(
                        "p-2 rounded-md transition-all",
                        viewMode === mode 
                          ? "bg-white/30 text-white" 
                          : "text-white/60 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <ModeIcon className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{label} View</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 max-h-[calc(90vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Role Section */}
            <ContentSection title="What is its role?" icon="💡">
              <p className="text-muted-foreground leading-relaxed">
                {node.roleDescription}
              </p>
            </ContentSection>

            {/* Capabilities Section */}
            <ContentSection title="What can it do?" icon="⚡">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <TooltipProvider>
                  {node.capabilities.map((cap, index) => {
                    const CapIcon = cap.icon;
                    return (
                      <Tooltip key={cap.label}>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default"
                          >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <CapIcon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xs font-medium text-center">{cap.label}</span>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                          <p>{cap.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </div>
            </ContentSection>

            {/* Technologies Section */}
            <ContentSection title="How does it work?" icon="🔧">
              <div className="space-y-3">
                {node.technologies.map((layer, layerIndex) => (
                  <motion.div
                    key={layer.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: layerIndex * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/80 to-muted/30 border border-border"
                  >
                    <div className="flex-shrink-0 w-24">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {layer.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {layer.items.map((item) => (
                        <Badge key={item} variant="outline" className="bg-background">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ContentSection>

            {/* Players Section */}
            <ContentSection title="Who is active here?" icon="👥">
              <div className="grid md:grid-cols-3 gap-4">
                {node.players.map((group, groupIndex) => (
                  <motion.div
                    key={group.category}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: groupIndex * 0.1 }}
                    className="p-4 rounded-xl border border-border bg-card"
                  >
                    <h4 className="font-semibold text-sm mb-3 text-primary">{group.category}</h4>
                    <ul className="space-y-1.5">
                      {group.examples.map((example) => (
                        <li key={example} className="text-sm text-muted-foreground flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-primary/50" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </ContentSection>

            {/* Strategic Section */}
            <ContentSection title="Why it matters for V2X" icon="🎯">
              <div className="grid md:grid-cols-3 gap-4">
                <StrategicCard
                  icon={<Zap className="w-5 h-5" />}
                  label="Opportunity"
                  content={node.strategic.opportunity}
                  color="text-energy-green"
                  bgColor="bg-energy-green/10"
                  borderColor="border-energy-green/30"
                />
                <StrategicCard
                  icon={<AlertTriangle className="w-5 h-5" />}
                  label="Challenge"
                  content={node.strategic.challenge}
                  color="text-energy-amber"
                  bgColor="bg-energy-amber/10"
                  borderColor="border-energy-amber/30"
                />
                <StrategicCard
                  icon={<Target className="w-5 h-5" />}
                  label="Strategic Control Point"
                  content={node.strategic.controlPoint}
                  color="text-energy-blue"
                  bgColor="bg-energy-blue/10"
                  borderColor="border-energy-blue/30"
                />
              </div>
            </ContentSection>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground mr-2">Explore related:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate('/pilots')}
                className="gap-1.5"
              >
                <ExternalLink className="w-3 h-3" />
                Pilot Cases
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate('/patents')}
                className="gap-1.5"
              >
                <ExternalLink className="w-3 h-3" />
                Patents
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate('/standards')}
                className="gap-1.5"
              >
                <ExternalLink className="w-3 h-3" />
                Standards
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate('/recommendations')}
                className="gap-1.5"
              >
                <ExternalLink className="w-3 h-3" />
                Recommendations
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function ContentSection({ 
  title, 
  icon, 
  children 
}: { 
  title: string; 
  icon: string; 
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </motion.section>
  );
}

function StrategicCard({
  icon,
  label,
  content,
  color,
  bgColor,
  borderColor,
}: {
  icon: React.ReactNode;
  label: string;
  content: string;
  color: string;
  bgColor: string;
  borderColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-xl border",
        bgColor,
        borderColor
      )}
    >
      <div className={cn("flex items-center gap-2 mb-2", color)}>
        {icon}
        <span className="font-semibold text-sm">{label}</span>
      </div>
      <p className="text-sm text-foreground/80">{content}</p>
    </motion.div>
  );
}
