import { useState } from 'react';
import heroImg from "@/assets/hero-pilots.jpg";
import { motion } from 'framer-motion';
import { FlaskConical, Grid3X3, List } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { EmptyModuleState } from '@/components/ui/empty-module-state';
import { useModuleContent } from '@/hooks/useGeneratedContent';
import { PilotCard } from '@/components/pilots/PilotCard';
import { PilotPopup } from '@/components/pilots/PilotPopup';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { pilotDetailsMap } from '@/data/pilotDetailsData';

export default function PilotsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<string>('all');
  const [selectedPilot, setSelectedPilot] = useState<string | null>(null);
  
  const { data: content, isLoading } = useModuleContent('pilots');
  
  const hasContent = true;
  
  const generated = (content?.projects as any[]) || [];
  const pilots = generated.length > 0 ? generated : Object.values(pilotDetailsMap);
  
  const filteredPilots = filter === 'all' 
    ? pilots 
    : pilots.filter((p: any) => p.status === filter);

  const pilotStats = [
    { label: 'Total Pilots', value: pilots.length, color: 'text-primary' },
    { label: 'Active', value: pilots.filter((p: any) => p.status === 'active').length, color: 'text-energy-green' },
    { label: 'Completed', value: pilots.filter((p: any) => p.status === 'completed').length, color: 'text-energy-blue' },
    { label: 'Planned', value: pilots.filter((p: any) => p.status === 'planned').length, color: 'text-energy-amber' },
  ];

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<FlaskConical className="w-7 h-7 text-white" />}
          title="Pilots & Demonstrators"
          description="Real-world V2X deployments from lab research to grid-critical infrastructure"
          badge="Demonstrators"
          heroImage={heroImg}
        />

        {!hasContent && !isLoading ? (
          <EmptyModuleState moduleName="Pilots" />
        ) : (
          <>
            {/* Stats overview */}
            <section className="mb-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {pilotStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-5 rounded-xl bg-card border text-center"
                  >
                    <p className={cn('text-3xl font-bold', stat.color)}>{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('active')}
                >
                  Active
                </Button>
                <Button
                  variant={filter === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </Button>
                <Button
                  variant={filter === 'planned' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('planned')}
                >
                  Planned
                </Button>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'grid' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    viewMode === 'list' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pilots grid */}
            <section className="mb-10">
              <div className={cn(
                'grid gap-4',
                viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              )}>
                {filteredPilots.map((pilot: any, index: number) => (
                  <PilotCard 
                    key={pilot.id} 
                    pilot={pilot} 
                    index={index} 
                    onClick={() => setSelectedPilot(pilot.id)}
                  />
                ))}
              </div>
            </section>

            {/* Pilot Popup */}
            <PilotPopup 
              pilotId={selectedPilot}
              open={!!selectedPilot}
              onClose={() => setSelectedPilot(null)}
            />

            {/* Key observations */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Key Observations</h3>
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                <ul className="space-y-3">
                  {((content?.observations as string[]) || []).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <p className="text-sm text-foreground" dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
}
