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
