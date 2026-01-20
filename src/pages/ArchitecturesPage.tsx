import { motion } from 'framer-motion';
import { Network, Cpu, Battery, Zap, Building2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { EmptyModuleState } from '@/components/ui/empty-module-state';
import { useModuleContent } from '@/hooks/useGeneratedContent';
import { cn } from '@/lib/utils';

export default function ArchitecturesPage() {
  const { data: content, isLoading } = useModuleContent('architectures');
  
  const hasContent = content && Object.keys(content).length > 0;

  const iconMap: Record<string, any> = { Cpu, Zap, Battery, Building2, Network };

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Network className="w-7 h-7 text-white" />}
          title="System Architectures"
          description="Technical topologies and system design patterns for V2X infrastructure"
          badge="Architecture"
        />

        {!hasContent && !isLoading ? (
          <EmptyModuleState moduleName="Architectures" />
        ) : (
          <>
            {/* Architecture comparison */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Architecture Options</h3>
              <div className="grid lg:grid-cols-3 gap-4">
                {((content?.architectures as any[]) || []).map((arch: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-5 rounded-xl bg-card border hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground">{arch.name}</h4>
                        <p className="text-sm text-primary font-medium">{arch.power}</p>
                      </div>
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        arch.maturity === 'Mature' ? 'bg-energy-green/10 text-energy-green' :
                        arch.maturity === 'Emerging' ? 'bg-energy-blue/10 text-energy-blue' :
                        'bg-energy-amber/10 text-energy-amber'
                      )}>
                        {arch.maturity}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">Advantages</p>
                      <ul className="space-y-1">
                        {(arch.pros || []).map((pro: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                            <div className="w-1 h-1 rounded-full bg-energy-green" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">Challenges</p>
                      <ul className="space-y-1">
                        {(arch.cons || []).map((con: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                            <div className="w-1 h-1 rounded-full bg-energy-amber" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground">Best for: <span className="text-foreground">{arch.useCase}</span></p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* System components */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Key System Components</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {((content?.components as any[]) || []).map((comp: any, index: number) => {
                  const Icon = iconMap[comp.icon] || Cpu;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="p-5 rounded-xl bg-card border text-center"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-medium text-foreground text-sm mb-1">{comp.name}</h4>
                      <p className="text-xs text-muted-foreground">{comp.function}</p>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Architecture evidence */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Architecture Highlights</h3>
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
