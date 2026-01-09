import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowRight, Zap } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { SystemMapDiagram } from '@/components/dashboard/SystemMapDiagram';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { HighlightCard } from '@/components/dashboard/HighlightCard';
import { MaturityTimeline } from '@/components/dashboard/MaturityTimeline';
import { PilotTypeChart } from '@/components/dashboard/PilotTypeChart';
import { keyMetrics, reportHighlights } from '@/data/v2xData';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleNodeClick = (nodeId: string) => {
    const routes: Record<string, string> = {
      ev: '/engineering',
      charger: '/architectures',
      site: '/markets',
      grid: '/standards',
      market: '/opportunities',
    };
    if (routes[nodeId]) {
      navigate(routes[nodeId]);
    }
  };

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<LayoutDashboard className="w-7 h-7 text-white" />}
          title="V2X Power Landscape"
          description="Interactive exploration of bidirectional energy technology state-of-the-art"
          badge="State of the Art 2024"
        />

        {/* Hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Bidirectional Energy Future</h2>
              <p className="text-sm text-muted-foreground">V2G • V2B • V2H • V2E</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            Transform static reports into a living, visual, question-driven synthesis system. 
            Explore engineering innovations, market signals, regulatory landscapes, and pilot projects 
            shaping the future of vehicle-to-everything power technology.
          </p>
        </motion.div>

        {/* Key metrics */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Key Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {keyMetrics.map((metric, index) => (
              <MetricCard key={metric.id} metric={metric} index={index} />
            ))}
          </div>
        </section>

        {/* System map */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">V2X Energy Ecosystem</h3>
          <SystemMapDiagram onNodeClick={handleNodeClick} />
        </section>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <MaturityTimeline />
          <PilotTypeChart />
        </div>

        {/* Report highlights */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Report Highlights</h3>
            <button
              onClick={() => navigate('/engineering')}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <span>Explore all modules</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportHighlights.slice(0, 8).map((highlight, index) => (
              <HighlightCard
                key={highlight.id}
                highlight={highlight}
                index={index}
                onClick={() => navigate('/engineering')}
              />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
