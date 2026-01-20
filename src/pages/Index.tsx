import { LayoutDashboard, ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { EmptyModuleState } from '@/components/ui/empty-module-state';
import { SystemMapDiagram } from '@/components/dashboard/SystemMapDiagram';
import { HighlightCard } from '@/components/dashboard/HighlightCard';
import { MaturityDiffusionChart } from '@/components/dashboard/MaturityDiffusionChart';
import { MarketSizeChart } from '@/components/dashboard/MarketSizeChart';
import { KeyFindings } from '@/components/dashboard/KeyFindings';
import { useModuleContent } from '@/hooks/useGeneratedContent';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const { data: content, isLoading } = useModuleContent('dashboard');
  
  const hasContent = content && Object.keys(content).length > 0;

  const handleNodeClick = (nodeId: string) => {
    const routes: Record<string, string> = {
      ev: '/engineering',
      charger: '/architectures',
      site: '/markets',
      grid: '/standards',
      market: '/opportunities'
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

        {!hasContent && !isLoading ? (
          <EmptyModuleState moduleName="Dashboard" />
        ) : (
          <>
            {/* System map */}
            <section className="mb-10">
              <h3 className="text-lg font-semibold text-foreground mb-4">V2X Energy Ecosystem</h3>
              <SystemMapDiagram onNodeClick={handleNodeClick} />
            </section>

            {/* Charts Section - Maturity & Market Size */}
            <div className="grid lg:grid-cols-2 gap-6 mb-10">
              <MaturityDiffusionChart />
              <MarketSizeChart />
            </div>

            {/* Key Findings */}
            <div className="mb-10">
              <KeyFindings />
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
                {((content?.highlights as unknown[]) || []).slice(0, 8).map((highlight: any, index: number) => (
                  <HighlightCard 
                    key={highlight.id || index} 
                    highlight={highlight} 
                    index={index} 
                    onClick={() => navigate('/engineering')} 
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
