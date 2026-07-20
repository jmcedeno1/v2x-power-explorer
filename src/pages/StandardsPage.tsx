import { motion } from 'framer-motion';
import heroImg from "@/assets/hero-standards.jpg";
import { Scale, FileCheck, Shield } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { EmptyModuleState } from '@/components/ui/empty-module-state';
import { useModuleContent } from '@/hooks/useGeneratedContent';
import { cn } from '@/lib/utils';

export default function StandardsPage() {
  const { data: content, isLoading } = useModuleContent('standards');
  
  const hasContent = true;

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Scale className="w-7 h-7 text-white" />}
          title="Standards & Regulation"
          description="Grid codes, protocols, and regulatory landscape for V2X deployment"
          badge="Regulatory"
          heroImage={heroImg}
        />

        {!hasContent && !isLoading ? (
          <EmptyModuleState moduleName="Standards" />
        ) : (
          <>
            {/* Standards overview */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Key Standards</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {((content?.standards as any[]) || []).map((standard: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-5 rounded-xl bg-card border hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{standard.name}</h4>
                          <p className="text-xs text-muted-foreground">{standard.year}</p>
                        </div>
                      </div>
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        standard.status === 'active' 
                          ? 'bg-energy-green/10 text-energy-green' 
                          : 'bg-energy-amber/10 text-energy-amber'
                      )}>
                        {standard.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{standard.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(standard.features || []).map((feature: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Grid code challenges */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Grid Code Challenges</h3>
              <div className="p-6 rounded-xl bg-card border">
                <div className="space-y-4">
                  {((content?.challenges as any[]) || []).map((item: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Shield className={cn(
                          'w-5 h-5',
                          item.status === 'critical' ? 'text-energy-red' :
                          item.status === 'major' ? 'text-energy-amber' : 'text-energy-blue'
                        )} />
                        <span className="text-sm font-medium text-foreground">{item.challenge}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{item.region}</span>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                          item.status === 'critical' ? 'bg-energy-red/10 text-energy-red' :
                          item.status === 'major' ? 'bg-energy-amber/10 text-energy-amber' :
                          'bg-energy-blue/10 text-energy-blue'
                        )}>
                          {item.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Key evidence */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Institutional Highlights</h3>
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
          </>
        )}
      </div>
    </MainLayout>
  );
}
