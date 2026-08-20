import { motion } from 'framer-motion';
import heroImg from "@/assets/hero-patents.jpg";
import { FileText, Cloud, Lock, Cpu } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { EmptyModuleState } from '@/components/ui/empty-module-state';
import { useModuleContent } from '@/hooks/useGeneratedContent';
import { PatentBreakthroughTimeline } from '@/components/patents/PatentBreakthroughTimeline';
import { PatentLandscape } from '@/components/patents/PatentLandscape';

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
