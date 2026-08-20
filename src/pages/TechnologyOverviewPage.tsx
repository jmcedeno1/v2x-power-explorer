import { useState } from 'react';
import { Lightbulb, Zap, Home, Plug, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { howItWorks, technologyDeepDive } from '@/data/technologyOverview';

type ApplicationType = 'all' | 'v2g' | 'v2h' | 'v2l';

const applicationIcons = {
  v2g: Zap,
  v2h: Home,
  v2l: Plug,
};

const filterOptions: { value: ApplicationType; label: string }[] = [
  { value: 'all', label: 'All applications' },
  { value: 'v2g', label: 'V2G' },
  { value: 'v2h', label: 'V2H' },
  { value: 'v2l', label: 'V2L' },
];

export default function TechnologyOverviewPage() {
  const [applicationFilter, setApplicationFilter] = useState<ApplicationType>('all');

  const filteredApplications = howItWorks.applicationTypes.filter(
    (app) => applicationFilter === 'all' || app.id === applicationFilter
  );

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<Lightbulb className="w-7 h-7 text-white" />}
          title="Technology Overview"
          description="How bidirectional charging works: principles, application types, architectures and power electronics"
          badge="Fundamentals"
        />

        {/* How it works */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">{howItWorks.basicPrinciples.title}</h3>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 space-y-4">
            {howItWorks.basicPrinciples.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-sm text-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* V1G vs V2G */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">{howItWorks.v1gVsV2g.title}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {howItWorks.v1gVsV2g.items.map((item) => (
              <Card key={item.type}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{item.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-primary" /> Benefits
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {item.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                        <XCircle className="h-4 w-4 text-muted-foreground" /> Limitations
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {item.limitations.map((l, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-muted-foreground">•</span> {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application types */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-3">Application types</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {filterOptions.map((opt) => (
              <Button
                key={opt.value}
                size="sm"
                variant={applicationFilter === opt.value ? 'default' : 'outline'}
                onClick={() => setApplicationFilter(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <div className="grid gap-4">
            {filteredApplications.map((app) => {
              const Icon = applicationIcons[app.id as keyof typeof applicationIcons];
              return (
                <Card key={app.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                      {app.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{app.description}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Use cases</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {app.useCases.map((u, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary">•</span> {u}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Revenue / value potential</p>
                        <Badge variant="secondary" className="text-sm whitespace-normal text-left">
                          {app.revenue}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Technology deep dive */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Technology deep dive</h3>
          <Tabs defaultValue="architectures" className="space-y-6">
            <TabsList className="flex flex-wrap h-auto gap-2">
              <TabsTrigger value="architectures">System architectures</TabsTrigger>
              <TabsTrigger value="electronics">Power electronics</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
            </TabsList>

            <TabsContent value="architectures" className="space-y-4">
              <h4 className="text-base font-semibold text-foreground">
                {technologyDeepDive.architectures.title}
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {technologyDeepDive.architectures.comparison.map((arch) => (
                  <Card key={arch.type} className="h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{arch.type}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{arch.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="font-medium text-foreground">Efficiency</p>
                          <p className="text-muted-foreground">{arch.efficiency}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Power level</p>
                          <p className="text-muted-foreground">{arch.powerLevel}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Cost</p>
                          <p className="text-muted-foreground">{arch.cost}</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Complexity</p>
                          <p className="text-muted-foreground">{arch.complexity}</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm mb-2">Standards</p>
                        <div className="flex flex-wrap gap-1">
                          {arch.standards.map((std) => (
                            <Badge key={std} variant="outline" className="text-xs">
                              {std}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm mb-2">Examples</p>
                        <p className="text-sm text-muted-foreground">{arch.examples.join(', ')}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="electronics" className="space-y-4">
              <h4 className="text-base font-semibold text-foreground">
                {technologyDeepDive.powerElectronics.title}
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {technologyDeepDive.powerElectronics.topologies.map((topology) => (
                  <Card key={topology.name} className="h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{topology.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{topology.description}</p>
                      <Badge variant="secondary">Efficiency: {topology.efficiency}</Badge>
                      <div>
                        <p className="font-medium text-foreground text-sm mb-2">Advantages</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {topology.advantages.map((adv, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary">•</span> {adv}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm mb-2">Applications</p>
                        <p className="text-sm text-muted-foreground">{topology.applications.join(', ')}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="challenges" className="space-y-4">
              <h4 className="text-base font-semibold text-foreground">{technologyDeepDive.challenges.title}</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {technologyDeepDive.challenges.items.map((item) => (
                  <Card key={item.challenge}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-primary" />
                        {item.challenge}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                      <div className="flex items-start gap-2 bg-muted/50 p-3 rounded-lg">
                        <Lightbulb className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Mitigation</p>
                          <p className="text-sm text-muted-foreground">{item.mitigation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </MainLayout>
  );
}
