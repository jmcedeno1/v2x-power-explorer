import heroImg from "@/assets/hero-standards.jpg";
import { Scale } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { EmptyModuleState } from '@/components/ui/empty-module-state';
import { StandardsCatalog } from '@/components/standards/StandardsCatalog';

const STANDARDS_EVIDENCE: string[] = [
  '<strong>The rulebook is essentially written, but only on paper.</strong> The large majority of the catalogue is already published, so the bottleneck for bidirectional charging is no longer standards availability but certification, conformance testing and real product implementation.',
  '<strong>ISO 15118-20 is the single anchor of the whole stack.</strong> Almost every other work item (DC and AC power transfer, connectors, cybersecurity, aggregation interfaces) assumes its second-generation message set, which makes its adoption pace the de facto pace of V2G market entry.',
  '<strong>Standardisation moved from the vehicle to the grid edge.</strong> Early entries concentrate on the vehicle-charger interface, while the most recent ones deal with inverter behaviour, islanding, grid support functions and aggregation, mirroring the shift seen in patents and pilots from hardware feasibility to system integration.',
  '<strong>Two competing regulatory logics dominate.</strong> Global bodies (ISO/IEC, IEC, OCA) define interoperable protocols, while North American work (SAE, UL, IEEE) is much heavier on equipment certification and interconnection approval, so the same product needs two very different compliance paths.',
  '<strong>Europe has few own standards but the strongest legal mandates.</strong> European entries are mostly grid-connection rules layered on top of global protocols, meaning deployment friction in the EU comes from national grid codes and DSO approval rather than from missing technical specifications.',
  '<strong>Interconnection is the practical gatekeeper.</strong> The recurring cluster around inverter grid support, anti-islanding and utility interconnection shows that a compliant vehicle and charger still cannot dispatch energy until the DSO recognises the EV as a legitimate distributed energy resource.',
  '<strong>Cybersecurity and identity remain the thinnest layer.</strong> Only a small part of the catalogue covers certificates, PKI and secure channels, which matches the white space observed in the patent landscape and is the most likely source of future mandatory requirements.',
  '<strong>Under-revision and under-development items concentrate where money is made.</strong> The open work items sit in bidirectional DC power transfer, grid-code compliance and aggregation interfaces, exactly the functions needed for market participation and settlement.',
  '<strong>AC bidirectional is the least settled path.</strong> DC bidirectional charging benefits from a mature communication and safety chain, while AC discharge relies on newer or still-forming rules, which explains why most pilots continue to choose DC hardware despite its higher cost.',
  '<strong>Regional forks are appearing outside Europe and the US.</strong> Dedicated work in Japan, China and Oceania signals that connector, protocol and grid-code divergence is being institutionalised, so global OEM platforms will need configurable rather than single-standard compliance.',
  '<strong>Standards do not yet cover the commercial layer.</strong> Nothing in the catalogue defines how discharged energy is metered, verified and settled between vehicle owner, aggregator and utility, which is the same gap reported by nearly every pilot in the pilot module.',
];

export default function StandardsPage() {
  const isLoading = false;
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
            {/* Standards & Regulation Evidence */}
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Standards &amp; Regulation Evidence</h3>
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                <ul className="space-y-3">
                  {STANDARDS_EVIDENCE.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <p className="text-sm text-foreground" dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Standards catalogue */}
            <section className="mb-10">
              <StandardsCatalog />
            </section>


          </>
        )}
      </div>
    </MainLayout>
  );
}
