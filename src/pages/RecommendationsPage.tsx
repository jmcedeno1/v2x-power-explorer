import { motion } from 'framer-motion';
import { Award, Download, FileText, Presentation, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const keyHighlights = [
  'EVs are transitioning from passive loads to active Distributed Energy Resources',
  'Bidirectional chargers function as grid-tied inverters enabling megawatt-level services',
  'Heavy-duty fleets with 300-600 kWh batteries drive commercial V2X adoption',
  'Revenue stacking (peak shaving + ancillary services + demand-charge avoidance) is essential',
  'ISO 15118-20 and MCS standards enable next-generation bidirectional infrastructure',
  'Depot-scale hubs represent the optimal deployment model for near-term value capture',
];

const recommendations = [
  {
    category: 'For OEMs',
    items: [
      'Enable V2X capability by default in commercial vehicle software',
      'Standardize battery warranty terms for bidirectional usage',
      'Partner with fleet operators for pilot deployments',
    ],
  },
  {
    category: 'For Charger Manufacturers',
    items: [
      'Prioritize off-board DC V2X architecture for fleet applications',
      'Integrate local BESS buffering for grid compliance',
      'Develop modular satellite hub topologies for depot scaling',
    ],
  },
  {
    category: 'For Utilities',
    items: [
      'Streamline interconnection approval processes',
      'Create clear tariff structures for bidirectional energy',
      'Develop VPP aggregation partnerships with fleet operators',
    ],
  },
  {
    category: 'For Research Centers',
    items: [
      'Focus on grid-isolated control algorithms for blackout scenarios',
      'Advance cybersecurity frameworks for bidirectional power loops',
      'Study long-term battery health impacts of V2X cycling',
    ],
  },
];

const nextPilots = [
  'Multi-site depot orchestration (50+ vehicles)',
  'Cross-border energy trading demonstration',
  'Grid-critical emergency response validation',
  'MCS-enabled megawatt discharge trial',
];

export default function RecommendationsPage() {
  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Award className="w-7 h-7 text-white" />}
          title="Final Highlights & Recommendations"
          description="Strategic synthesis and actionable recommendations for V2X stakeholders"
          badge="Executive"
        />

        {/* Key highlights */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Key Highlights</h3>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/20">
            <ul className="space-y-3">
              {keyHighlights.map((highlight, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-energy-green mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{highlight}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* Recommendations by stakeholder */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Strategic Recommendations</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.map((rec, catIndex) => (
              <motion.div
                key={catIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: catIndex * 0.1 }}
                className="p-5 rounded-xl bg-card border"
              >
                <h4 className="font-semibold text-primary mb-4">{rec.category}</h4>
                <ul className="space-y-2">
                  {rec.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recommended next pilots */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recommended Next Pilots</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {nextPilots.map((pilot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 rounded-xl bg-card border hover:border-primary/40 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {pilot}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Export options */}
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-4">Export Options</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              <span>PDF Report</span>
              <span className="text-xs text-muted-foreground">Full executive summary</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Presentation className="w-6 h-6 text-primary" />
              <span>Slide Deck</span>
              <span className="text-xs text-muted-foreground">Presentation format</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <span>Workshop Handout</span>
              <span className="text-xs text-muted-foreground">Expert interview guide</span>
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
