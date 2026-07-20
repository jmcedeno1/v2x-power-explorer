import { motion } from 'framer-motion';
import heroImg from "@/assets/hero-engineering.jpg";
import { Cpu, Thermometer, Gauge, Battery, Zap } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { EmptyModuleState } from '@/components/ui/empty-module-state';
import { useModuleContent } from '@/hooks/useGeneratedContent';

export default function EngineeringPage() {
  const { data: content, isLoading } = useModuleContent('engineering');
  
  const hasContent = true;

  const iconMap: Record<string, any> = { Gauge, Thermometer, Battery, Zap, Cpu };

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Cpu className="w-7 h-7 text-white" />}
          title="Engineering & Research"
          description="Technical deep-dive into bidirectional power electronics and system design"
          badge="Technical"
          heroImage={heroImg}
        />

        {!hasContent && !isLoading ? (
          <EmptyModuleState moduleName="Engineering" />
        ) : (
          <>
            {/* Highlights grid */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Key Technical Metrics</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {((content?.highlights as any[]) || []).map((item: any, index: number) => {
                  const Icon = iconMap[item.icon] || Cpu;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="p-5 rounded-xl bg-card border hover:border-primary/40 hover:shadow-md transition-all"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color || 'from-primary to-accent'} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm text-muted-foreground">{item.title}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{item.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Technical specifications */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">System Requirements</h3>
              <div className="p-6 rounded-xl bg-card border">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {((content?.techSpecs as any[]) || []).map((spec: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex flex-col"
                    >
                      <span className="text-sm text-muted-foreground">{spec.label}</span>
                      <span className="text-lg font-semibold text-foreground mt-1">{spec.value}</span>
                      <span className={`text-xs mt-1 ${
                        spec.status === 'mature' ? 'text-energy-green' :
                        spec.status === 'developing' ? 'text-energy-amber' : 'text-energy-red'
                      }`}>
                        {spec.status?.charAt(0).toUpperCase() + spec.status?.slice(1)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Evidence panel */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Key Evidence</h3>
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
