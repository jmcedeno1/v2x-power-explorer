import { motion } from 'framer-motion';
import heroImg from "@/assets/hero-patents.jpg";
import { FileText, Cloud, Lock, Cpu } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { EmptyModuleState } from '@/components/ui/empty-module-state';
import { useModuleContent } from '@/hooks/useGeneratedContent';
import { patentAreasData } from '@/data/patentAreasData';
import { InnovationAreaPopup } from '@/components/patents/InnovationAreaPopup';
import { PatentEvolutionChart } from '@/components/patents/PatentEvolutionChart';
import { PatentBreakthroughTimeline } from '@/components/patents/PatentBreakthroughTimeline';
import { PatentLandscape } from '@/components/patents/PatentLandscape';
import { cn } from '@/lib/utils';

export default function PatentsPage() {
  const { data: content, isLoading } = useModuleContent('patents');
  
  const hasContent = true;

  const iconMap: Record<string, any> = { Cloud, Lock, Cpu };

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader 
          icon={<FileText className="w-7 h-7 text-white" />} 
          title="Patents & IP" 
          description="Intellectual property landscape and strategic innovation opportunities" 
          badge="IP Analysis" 
          heroImage={heroImg}
        />

        {!hasContent && !isLoading ? (
          <EmptyModuleState moduleName="Patents" />
        ) : (
          <>
            {/* Real patent corpus analytics (lens.org) */}
            <PatentLandscape />

            {/* Key evidence - moved above Innovation Area Maturity */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">IP Landscape Highlights</h3>
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                <ul className="space-y-3">
                  {((content?.evidence as string[]) || []).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <p className="text-sm text-foreground" dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Patent evolution chart and Innovation Area side by side */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Patent Maturity</h3>
              <div className="grid lg:grid-cols-2 gap-6">
                <PatentEvolutionChart />
                
                {/* Innovation Area Maturity */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }} 
                  className="p-6 rounded-xl bg-card border"
                >
                  <h4 className="text-base font-semibold text-foreground mb-1">Innovation Area Maturity</h4>
                  <p className="text-xs text-muted-foreground mb-4">Click each area for detailed patent trends</p>
                  <div className="space-y-3">
                    {(((content?.areas as any[]) || patentAreasData)).map((area: any, index: number) => (
                      <InnovationAreaPopup key={area.id} area={area}>
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ duration: 0.4, delay: index * 0.1 }} 
                          className="cursor-pointer hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors"
                        >
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-foreground">{area.name}</span>
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded-full capitalize', 
                              area.status === 'saturated' ? 'bg-muted text-muted-foreground' : 
                              area.status === 'active' ? 'bg-energy-blue/10 text-energy-blue' : 
                              area.status === 'growing' ? 'bg-energy-amber/10 text-energy-amber' : 
                              'bg-energy-green/10 text-energy-green'
                            )}>
                              {area.status?.replace('-', ' ')}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${area.maturity}%` }} 
                              transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }} 
                              className={cn(
                                'h-full rounded-full', 
                                area.status === 'saturated' ? 'bg-muted-foreground' : 
                                area.status === 'active' ? 'bg-energy-blue' : 
                                area.status === 'growing' ? 'bg-energy-amber' : 
                                'bg-gradient-to-r from-primary to-accent'
                              )} 
                            />
                          </div>
                        </motion.div>
                      </InnovationAreaPopup>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* V2X Breakthrough Timeline - full width */}
            <section className="mb-10">
              <PatentBreakthroughTimeline />
            </section>

            {/* Strategic gaps */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Strategic White Space</h3>
              <div className="grid lg:grid-cols-3 gap-4">
                {((content?.strategicGaps as any[]) || []).map((gap: any, index: number) => {
                  const Icon = iconMap[gap.icon] || Cloud;
                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ duration: 0.4, delay: index * 0.1 }} 
                      className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">{gap.area}</h4>
                      <p className="text-sm text-muted-foreground">{gap.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
}
