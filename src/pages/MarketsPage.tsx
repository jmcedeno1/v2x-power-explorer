import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, PieChart, Layers, Zap, Activity, ArrowUpDown, Shield, Sun, BarChart3, Building2, Globe, Users } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { EmptyModuleState } from '@/components/ui/empty-module-state';
import { useModuleContent } from '@/hooks/useGeneratedContent';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function MarketsPage() {
  const { data: content, isLoading } = useModuleContent('markets');
  
  const hasContent = content && Object.keys(content).length > 0;

  const iconMap: Record<string, any> = { 
    DollarSign, TrendingUp, BarChart3, Building2, PieChart, Layers, Globe, Users,
    Zap, Activity, ArrowUpDown, Shield, Sun
  };

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader 
          icon={<TrendingUp className="w-7 h-7 text-white" />} 
          title="Markets & Business Models" 
          description="Economic landscape and revenue opportunities in bidirectional energy" 
          badge="Economic" 
        />

        {!hasContent && !isLoading ? (
          <EmptyModuleState moduleName="Markets" />
        ) : (
          <>
            {/* Market metrics */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Market Indicators</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {((content?.metrics as any[]) || []).map((item: any, index: number) => {
                  const Icon = iconMap[item.icon] || TrendingUp;
                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ duration: 0.4, delay: index * 0.05 }} 
                      className="p-4 rounded-xl bg-card border hover:border-primary/40 hover:shadow-md transition-all"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color || 'from-primary to-accent'} flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs text-muted-foreground">{item.title}</p>
                      <p className="text-xl font-bold text-foreground mt-1">{item.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Market Players & Revenue Stacking Section */}
            <section className="mb-10">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Global Market Players & Investment */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Global Market Players & Investment
                  </h3>
                  <div className="p-6 rounded-xl bg-card border h-full">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-4">Market Share by Region</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie 
                            data={(content?.regionData as any[]) || []} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={50} 
                            outerRadius={80} 
                            paddingAngle={2} 
                            dataKey="value" 
                            label={({ name, value }) => `${name}: ${value}%`} 
                            labelLine={false}
                          >
                            {((content?.regionData as any[]) || []).map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [`${value}%`, 'Market Share']} 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }} 
                          />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                      {((content?.regionData as any[]) || []).map((region: any, index: number) => (
                        <div key={index} className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: region.color }} />
                          <span className="text-xs text-muted-foreground">{region.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Revenue Stacking Portfolio */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Stacking Portfolio</h3>
                  <div className="p-6 rounded-xl bg-card border h-full">
                    <div className="space-y-4">
                      {((content?.revenueStreams as any[]) || []).map((stream: any, index: number) => {
                        const StreamIcon = iconMap[stream.icon] || Zap;
                        return (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, x: -20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                          >
                            <div className="flex justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${stream.color || 'from-primary to-accent'} flex items-center justify-center`}>
                                  <StreamIcon className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="text-sm font-medium text-foreground">{stream.name}</span>
                              </div>
                              <span className="text-sm font-bold text-primary">{stream.share}%</span>
                            </div>
                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${stream.share}%` }} 
                                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }} 
                                className="h-full bg-gradient-to-r from-primary to-accent rounded-full" 
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Key evidence */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">Market Evidence</h3>
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
