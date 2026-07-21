import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TrendingUp, Lightbulb, Target, Layers } from 'lucide-react';
import { ReactNode, useState } from 'react';

// Brief tooltip text for scope tags used across publication topics.
const SCOPE_DESCRIPTIONS: Record<string, string> = {
  // EMS / HEMS
  'Home energy management (HEMS)': 'Residential controllers that coordinate PV, batteries, EVs and loads to minimize cost and maximize self-consumption.',
  'Building energy management (BEMS)': 'Commercial building systems that orchestrate HVAC, lighting, chargers and on-site generation.',
  'Rule-based and MPC controllers': 'From simple threshold logic to Model Predictive Control that anticipates prices and PV output.',
  'Multi-agent coordination': 'Distributed algorithms where devices negotiate energy exchanges among themselves.',
  // Policy
  'Tariff and incentive design': 'Time-of-use, dynamic pricing and rebate structures that reward flexibility.',
  'Grid code and interconnection rules': 'Technical requirements EVs and chargers must meet to connect to the distribution network.',
  'Market participation frameworks': 'Rules that let EVs bid into wholesale, capacity and balancing markets.',
  'Consumer protection and data privacy': 'Regulations governing how charging data can be used and shared.',
  // Field Trials
  'Fleet and depot pilots': 'Real-world V2G trials on bus, taxi and delivery fleets.',
  'Residential V2H demonstrations': 'In-home pilots using EVs as backup or self-consumption power sources.',
  'Utility-run V2G programs': 'Aggregator or utility programs that pay drivers for grid services.',
  'Longitudinal case studies': 'Multi-year studies tracking pilot performance, degradation and revenue.',
  // Renewable Integration
  'PV self-consumption with EVs': 'Charging patterns that maximize use of local solar generation.',
  'Wind-forecast-driven charging': 'Shifting charging to match forecast wind output.',
  'Hybrid renewable-EV microgrids': 'Local grids combining renewables, storage and EV fleets.',
  'Curtailment mitigation': 'Using EVs to absorb otherwise-curtailed renewable generation.',
  // LCA
  'Life-cycle assessment (LCA) methods': 'Standardized approaches to measure cradle-to-grave impacts of EVs and V2G.',
  'CO2 accounting for V2G': 'Attributing emissions savings or increases to bidirectional cycling.',
  'Battery second-life LCA': 'Environmental impact of reusing EV batteries as stationary storage.',
  'Well-to-wheel comparisons': 'Comparing total emissions of EV/V2G scenarios versus alternatives.',
  // With Renewables & Solar
  'V2G + PV co-optimization': 'Joint optimization of EV charging/discharging and PV production.',
  'Solar carport charging': 'Parking canopies with PV that charge EVs directly.',
  'Renewable-priority dispatch': 'Charging logic that prefers renewable-heavy hours.',
  'Grid-forming inverters': 'Inverters that establish grid voltage/frequency, supporting islanded renewable operation.',
  // Optimal Scheduling & Bidding
  'Mixed-integer optimization': 'Formulations that handle on/off decisions in charging schedules.',
  'Stochastic and robust optimization': 'Methods that account for uncertainty in prices, load and PV.',
  'Real-time market bidding': 'Automated bidding of aggregated EV flexibility into short-term markets.',
  'Rolling-horizon control': 'Continuously re-planning schedules as new data arrives.',
  // Simulation & Modeling
  'Co-simulation (grid + traffic)': 'Coupled simulation platforms combining power system and mobility models.',
  'Digital twin platforms': 'Live digital replicas of chargers, fleets or feeders for planning and control.',
  'Monte Carlo scenario analysis': 'Sampling over uncertain inputs to characterize risk and reward.',
  'Agent-based models': 'Simulations where drivers, chargers and aggregators are modeled as autonomous agents.',
  // Economics
  'Revenue stacking models': 'Combining energy arbitrage, ancillary services and capacity payments for one asset.',
  'Aggregator business models': 'Commercial structures for third parties monetizing fleet flexibility.',
  'Willingness-to-pay studies': 'Consumer research on payments needed to accept V2G participation.',
  'Techno-economic assessment': 'Combined engineering and financial evaluation of V2G projects.',
  // EV Charging Infrastructure
  'Public and depot charging networks': 'Buildout and operation of public and fleet-focused charging.',
  'Fast-charging hubs': 'High-power (150+ kW) DC charging clusters.',
  'Charging demand forecasting': 'Models predicting when and where charging load will appear.',
  'Bidirectional EVSE deployment': 'Rollout of chargers capable of two-way power flow.',
};

export type GrowingTopicInfo = {
  description: string;
  scope: string[];
  drivers: string[];
  opportunities: string[];
};

// Descriptions for each publication topic in the growing-topics list.
export const PUBLICATION_TOPIC_INFO: Record<string, GrowingTopicInfo> = {
  'Energy Management Systems (EMS/HEMS)': {
    description:
      'Research on home and building energy management systems that coordinate EVs, PV, storage and loads to reduce cost, boost self-consumption and provide flexibility.',
    scope: ['Home energy management (HEMS)', 'Building energy management (BEMS)', 'Rule-based and MPC controllers', 'Multi-agent coordination'],
    drivers: ['Rooftop PV growth', 'Dynamic electricity tariffs', 'Residential batteries and V2H adoption'],
    opportunities: ['AI-driven HEMS with EV forecasting', 'Standardized EMS interoperability APIs', 'Community-level (peer-to-peer) EMS'],
  },
  'V2G Policy & Regulation': {
    description:
      'Studies of the policy, tariff, market and grid-code frameworks that enable (or block) V2G participation and bidirectional charging services.',
    scope: ['Tariff and incentive design', 'Grid code and interconnection rules', 'Market participation frameworks', 'Consumer protection and data privacy'],
    drivers: ['EU AFIR and Net-Zero directives', 'FERC 2222 in the US', 'Redispatch 3.0 and DSO flexibility platforms'],
    opportunities: ['Harmonized bidirectional grid codes', 'Aggregator market access reforms', 'Incentives for battery-warranty-safe V2G'],
  },
  'V2G Field Trials & Pilots': {
    description:
      'Empirical papers analyzing real-world V2G pilots and demonstrations, including fleet, depot, residential and utility-run programs.',
    scope: ['Fleet and depot pilots', 'Residential V2H demonstrations', 'Utility-run V2G programs', 'Longitudinal case studies'],
    drivers: ['Growing pilot count (BDL Next, TEPCO, XL-Connect, EV4EU)', 'Public funding (Horizon Europe, DOE)', 'Learning-by-doing needs from OEMs'],
    opportunities: ['Cross-pilot benchmarking studies', 'Long-term degradation datasets', 'Open pilot data repositories'],
  },
  'Renewable Integration & Solar+EV': {
    description:
      'Papers on integrating variable renewables with EV charging and V2G to increase renewable use and reduce curtailment.',
    scope: ['PV self-consumption with EVs', 'Wind-forecast-driven charging', 'Hybrid renewable-EV microgrids', 'Curtailment mitigation'],
    drivers: ['Global renewable capacity growth', 'Corporate RE100 goals', 'Rising PV self-consumption in EU/US'],
    opportunities: ['PV-linked V2H optimization', 'Aggregated renewable+EV portfolios', 'Curtailment-absorbing charging tariffs'],
  },
  'V2G Environmental & LCA': {
    description:
      'Life-cycle and environmental studies quantifying the carbon, resource and health impacts of bidirectional charging and second-life battery use.',
    scope: ['Life-cycle assessment (LCA) methods', 'CO2 accounting for V2G', 'Battery second-life LCA', 'Well-to-wheel comparisons'],
    drivers: ['Corporate ESG reporting requirements', 'EU battery passport regulation', 'Scope 3 emissions scrutiny'],
    opportunities: ['V2G-specific LCA guidelines', 'Second-life LCA harmonization', 'Real-time carbon-aware dispatch'],
  },
  'V2G with Renewables & Solar': {
    description:
      'V2G-specific research coupled with photovoltaic or wind generation, including co-optimization, solar carports and renewable-first dispatch.',
    scope: ['V2G + PV co-optimization', 'Solar carport charging', 'Renewable-priority dispatch', 'Grid-forming inverters'],
    drivers: ['Solar+storage cost declines', 'Grid decarbonization targets', 'Rise of hybrid DER assets'],
    opportunities: ['Multi-port PV/EV/battery converters', 'Grid-forming bidirectional chargers', 'Community solar + V2G models'],
  },
  'V2G Optimal Scheduling & Bidding': {
    description:
      'Optimization and market-bidding studies that decide charging/discharging schedules under price, load and renewable uncertainty.',
    scope: ['Mixed-integer optimization', 'Stochastic and robust optimization', 'Real-time market bidding', 'Rolling-horizon control'],
    drivers: ['Growth of balancing and intraday markets', 'Aggregator platform maturity', 'Advances in convex/robust optimization'],
    opportunities: ['Cross-market revenue stacking', 'Fast solvers for real-time bidding', 'Uncertainty-aware fleet co-optimization'],
  },
  'V2G Simulation & Modeling': {
    description:
      'Computational studies using simulation, co-simulation, digital twins or agent-based models to evaluate V2G at scale.',
    scope: ['Co-simulation (grid + traffic)', 'Digital twin platforms', 'Monte Carlo scenario analysis', 'Agent-based models'],
    drivers: ['Cheaper compute and open-source tools', 'Growing datasets from pilots', 'Need to de-risk grid investments'],
    opportunities: ['Open reference V2G digital twins', 'Coupled grid + mobility + market platforms', 'AI surrogate models for fast studies'],
  },
  'V2G Economics & Business Models': {
    description:
      'Techno-economic and market studies quantifying V2G value, business models, willingness-to-pay and revenue-stacking strategies.',
    scope: ['Revenue stacking models', 'Aggregator business models', 'Willingness-to-pay studies', 'Techno-economic assessment'],
    drivers: ['Aggregator platform maturity', 'Rising ancillary-service prices', 'OEM interest in service revenue'],
    opportunities: ['Standardized V2G TEA frameworks', 'Battery-degradation-aware valuation', 'Consumer-friendly V2G contracts'],
  },
  'EV Charging Infrastructure': {
    description:
      'Publications on the planning, deployment and operation of EV charging infrastructure - increasingly including bidirectional (V2G-capable) hardware.',
    scope: ['Public and depot charging networks', 'Fast-charging hubs', 'Charging demand forecasting', 'Bidirectional EVSE deployment'],
    drivers: ['EU AFIR / US NEVI buildout', 'Fleet electrification', 'Rise of >150 kW DC hubs'],
    opportunities: ['V2G-ready public EVSE', 'Optimal siting for bidirectional hubs', 'Charging-load forecasting with AI'],
  },
};

interface Props {
  topic: string;
  y2020: number;
  y2025: number;
  growthAbs: number;
  growthPct: number;
  total: number;
  children: ReactNode;
}

export function PublicationGrowingTopicPopup({ topic, y2020, y2025, growthAbs, growthPct, total, children }: Props) {
  const [open, setOpen] = useState(false);
  const info = PUBLICATION_TOPIC_INFO[topic];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="font-semibold text-foreground text-base">{topic}</h4>
              {info && (
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{info.description}</p>
              )}
            </div>
            <Badge className="shrink-0 bg-primary/10 text-primary">
              <TrendingUp className="w-3 h-3 mr-1" />
              {y2020 > 0 ? `+${Math.round(growthPct)}%` : 'NEW'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x border-b bg-card">
          <div className="p-3 text-center">
            <div className="text-xs text-muted-foreground">2020</div>
            <div className="text-lg font-bold text-foreground tabular-nums">{y2020}</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-xs text-muted-foreground">2025</div>
            <div className="text-lg font-bold text-primary tabular-nums">{y2025}</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-xs text-muted-foreground">Growth</div>
            <div className="text-lg font-bold text-foreground tabular-nums">+{growthAbs}</div>
          </div>
        </div>

        {info && (
          <>
            <div className="p-4 border-b bg-card">
              <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Scope
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {info.scope.map((s) => {
                  const desc = SCOPE_DESCRIPTIONS[s];
                  return desc ? (
                    <Popover key={s}>
                      <PopoverTrigger asChild>
                        <button type="button" title={desc} className="focus:outline-none">
                          <Badge variant="secondary" className="text-xs cursor-help hover:bg-secondary/80">{s}</Badge>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent side="top" className="w-64 text-xs leading-relaxed z-[100]">
                        <div className="font-medium text-foreground mb-1">{s}</div>
                        <div className="text-muted-foreground">{desc}</div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-b bg-card">
              <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> What is driving growth
              </h5>
              <ul className="space-y-1">
                {info.drivers.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-br from-primary/5 to-accent/5">
              <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-energy-amber" /> Strategic Opportunities
              </h5>
              <ul className="space-y-1">
                {info.opportunities.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <div className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="p-3 border-t bg-muted/30 text-center text-[11px] text-muted-foreground">
          {total.toLocaleString()} publications classified in this topic
        </div>
      </DialogContent>
    </Dialog>
  );
}
