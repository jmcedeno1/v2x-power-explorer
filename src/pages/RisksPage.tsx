import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Lock, Zap, Users, Scale } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { EmptyModuleState } from '@/components/ui/empty-module-state';
import { useModuleContent } from '@/hooks/useGeneratedContent';
import { cn } from '@/lib/utils';

export default function RisksPage() {
  const { data: content, isLoading } = useModuleContent('risks');
  
  const hasContent = content && Object.keys(content).length > 0;

  const iconMap: Record<string, any> = { Zap, Lock, Scale, Users, ShieldAlert, AlertTriangle };

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<ShieldAlert className="w-7 h-7 text-white" />}
          title="Risks, Stability & Responsibility"
          description="Grid-level risks, security considerations, and liability frameworks for V2X deployment"
          badge="Risk Analysis"
        />

        {!hasContent && !isLoading ? (
          <EmptyModuleState moduleName="Risks" />
        ) : (
          <>
            {/* Risk categories grid */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Risk Categories</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {((content?.categories as any[]) || []).map((category: any, index: number) => {
                  const Icon = iconMap[category.icon] || ShieldAlert;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="p-5 rounded-xl bg-card border hover:border-primary/40 transition-all"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color || 'from-primary to-accent'} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-foreground mb-3">{category.name}</h4>
                      <ul className="space-y-2">
                        {(category.risks || []).map((item: any, i: number) => (
                          <li key={i} className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{item.risk}</span>
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded-full capitalize',
                              item.severity === 'critical' ? 'bg-energy-red/10 text-energy-red' :
                              item.severity === 'high' ? 'bg-energy-amber/10 text-energy-amber' :
                              'bg-energy-blue/10 text-energy-blue'
                            )}>
                              {item.severity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* System threats */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">System-Level Threats</h3>
              <div className="p-6 rounded-xl bg-card border">
                <div className="space-y-3">
                  {((content?.threats as any[]) || []).map((item: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={cn(
                          'w-5 h-5',
                          item.impact === 'critical' ? 'text-energy-red' : 'text-energy-amber'
                        )} />
                        <span className="text-sm font-medium text-foreground">{item.threat}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Likelihood</p>
                          <p className={cn(
                            'text-xs font-medium capitalize',
                            item.likelihood === 'high' ? 'text-energy-red' :
                            item.likelihood === 'medium' ? 'text-energy-amber' : 'text-energy-green'
                          )}>
                            {item.likelihood}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Impact</p>
                          <p className={cn(
                            'text-xs font-medium capitalize',
                            item.impact === 'critical' ? 'text-energy-red' : 'text-energy-amber'
                          )}>
                            {item.impact}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Key concerns */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Critical Concerns</h3>
              <div className="p-6 rounded-xl bg-gradient-to-br from-energy-red/5 to-energy-amber/5 border border-energy-red/20">
                <ul className="space-y-3">
                  {((content?.concerns as string[]) || []).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-energy-red mt-2" />
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
