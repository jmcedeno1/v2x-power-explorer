import heroImg from "@/assets/hero-standards.jpg";
import { Scale } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { EmptyModuleState } from '@/components/ui/empty-module-state';
import { StandardsCatalog } from '@/components/standards/StandardsCatalog';

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
