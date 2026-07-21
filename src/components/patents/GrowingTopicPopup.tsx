import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Sparkles, Lightbulb, Target, Layers } from 'lucide-react';
import { ReactNode, useState } from 'react';

export type GrowingTopicInfo = {
  description: string;
  scope: string[];
  drivers: string[];
  opportunities: string[];
};

// Descriptions for each topic in the bidirectional-charging taxonomy.
export const TOPIC_INFO: Record<string, GrowingTopicInfo> = {
  'V2G Bidirectional Power Conversion': {
    description:
      'Patents covering the power electronics that enable two-way energy flow between an EV battery and the grid, including bidirectional DC-DC and DC-AC converters and inverter topologies.',
    scope: ['Bidirectional inverters', 'DC-DC / DC-AC converters', 'Isolated and non-isolated topologies', 'Wide-bandgap (SiC/GaN) devices'],
    drivers: ['V2G pilot deployments', 'ISO 15118-20 rollout', 'Grid-service revenue models'],
    opportunities: ['Higher power density with SiC', 'Integrated OBC + inverter designs', 'Multi-port converters for PV + EV'],
  },
  'V2G Control & Dispatch': {
    description:
      'Algorithms and control systems that decide when and how much to charge or discharge EV fleets to deliver grid services or optimize energy costs.',
    scope: ['Aggregator control loops', 'Predictive dispatch', 'Fleet optimization', 'Real-time market bidding'],
    drivers: ['TSO/DSO flexibility markets', 'Aggregator business models', 'Growth in VPP platforms'],
    opportunities: ['AI-based dispatch', 'Co-optimization with driver preferences', 'Cross-market stacking'],
  },
  'V2H / Vehicle-to-Home': {
    description:
      'Systems that use an EV as a backup or primary power source for a home, including bidirectional wall units, transfer switches and home energy management integration.',
    scope: ['Home backup inverters', 'Islanding and transfer switches', 'Home energy management', 'Residential bidirectional wall boxes'],
    drivers: ['Resilience against outages', 'Ford F-150 Lightning / Nissan LEAF V2H', 'Residential PV + storage growth'],
    opportunities: ['Plug-and-play V2H kits', 'Integration with residential PV/battery', 'Utility incentive programs'],
  },
  'V2B / Vehicle-to-Building': {
    description:
      'Using parked EV fleets to power or support commercial and industrial buildings, including peak shaving, demand-charge reduction and backup applications.',
    scope: ['Commercial bidirectional chargers', 'Building energy management integration', 'Demand-charge reduction', 'Behind-the-meter dispatch'],
    drivers: ['Corporate fleet electrification', 'Rising demand charges', 'Building resiliency requirements'],
    opportunities: ['Depot-scale V2B systems', 'Integration with BMS/BEMS', 'Bundled charging + flexibility services'],
  },
  'On-Board Bidirectional Charger': {
    description:
      'Integrated onboard chargers (OBCs) that support two-way power flow, enabling V2G/V2H without dedicated off-board hardware.',
    scope: ['Integrated bidirectional OBCs', 'Motor-drive-based charging', 'Single/three-phase AC bidirectional', 'High-efficiency OBC topologies'],
    drivers: ['OEM roadmaps (Hyundai, Renault, VW)', 'AC V2G standardization (ISO 15118-20)', 'Cost pressure on infrastructure'],
    opportunities: ['11-22 kW bidirectional OBCs', 'Motor-integrated bidirectional charging', 'Reduced BOM vs. off-board DC'],
  },
  'Off-Board / DC Bidirectional Charger': {
    description:
      'Standalone DC chargers that handle bidirectional conversion outside the vehicle, typically used with CHAdeMO and CCS DC V2G stacks.',
    scope: ['DC bidirectional wall boxes', 'Grid-tied DC charging piles', 'CHAdeMO and CCS DC V2G', 'Modular DC power blocks'],
    drivers: ['CHAdeMO V2G maturity', 'Aggregator hardware deployments', 'Depot and fleet V2G pilots'],
    opportunities: ['Lower-cost 20-50 kW units', 'Modular scalable DC blocks', 'Dual-standard CCS + CHAdeMO chargers'],
  },
  'Wireless Bidirectional Charging': {
    description:
      'Inductive / resonant systems that transfer energy wirelessly in both directions between the vehicle and the grid.',
    scope: ['Resonant inductive coupling', 'Dynamic and static wireless V2G', 'Coil and compensation network design', 'Foreign-object detection'],
    drivers: ['SAE J2954 standardization', 'Autonomous vehicle use cases', 'Convenience-driven adoption'],
    opportunities: ['High-power (>20 kW) resonant systems', 'Dynamic in-road charging', 'Fleet applications (buses, taxis)'],
  },
  'Battery Management (BMS)': {
    description:
      'Battery management system patents covering state estimation (SoC, SoH), safety, cell monitoring and control - critical for bidirectional cycling.',
    scope: ['SoC / SoH estimation', 'Cell monitoring and protection', 'Fault detection', 'Bidirectional-aware BMS logic'],
    drivers: ['Longer battery warranties', 'V2G cycling requirements', 'Second-life battery reuse'],
    opportunities: ['V2G-aware SoH models', 'Cloud-based BMS analytics', 'Predictive fault detection'],
  },
  'Battery Degradation & Ageing': {
    description:
      'Research and IP addressing how bidirectional cycling and calendar ageing impact battery capacity and lifetime, and how to mitigate it.',
    scope: ['Cycle life modeling', 'Calendar ageing', 'Capacity fade under V2G', 'Ageing-aware control strategies'],
    drivers: ['OEM warranty concerns about V2G', 'Financial models for V2G revenue', 'Second-life battery valuation'],
    opportunities: ['Ageing-aware dispatch algorithms', 'Warranty-compatible V2G protocols', 'Real-time degradation monitoring'],
  },
  'Grid Services & Ancillary': {
    description:
      'Application patents for using EVs to provide frequency regulation, voltage support, peak shaving, reactive power and other grid services.',
    scope: ['Frequency regulation', 'Voltage / reactive power support', 'Peak shaving and load balancing', 'Congestion management (Redispatch)'],
    drivers: ['Growing balancing markets', 'DSO flexibility platforms', 'Redispatch 3.0 in Europe'],
    opportunities: ['Fast frequency response with EVs', 'Local congestion services', 'Reactive power from bidirectional chargers'],
  },
  'Smart Charging & Scheduling': {
    description:
      'Managed and optimized charging patents that coordinate when EVs charge (and discharge) to match grid conditions, prices or renewable generation.',
    scope: ['Managed charging platforms', 'Time-of-use optimization', 'PV self-consumption', 'Multi-vehicle scheduling'],
    drivers: ['Dynamic electricity tariffs', 'Renewable integration', 'Utility managed-charging programs'],
    opportunities: ['User-friendly smart-charging apps', 'PV-linked V2H scheduling', 'Grid-aware AI optimization'],
  },
  'Renewables Integration (PV/Wind)': {
    description:
      'IP on coupling EVs with photovoltaic and wind generation - solar carports, PV-linked V2H and renewable-first charging strategies.',
    scope: ['PV + EV coupled systems', 'Solar carports', 'Wind-farm-linked charging', 'Renewable-priority scheduling'],
    drivers: ['Solar rooftop growth', 'RE100 corporate commitments', 'Grid decarbonization mandates'],
    opportunities: ['DC-coupled PV + EV systems', 'Multi-port PV/EV/battery converters', 'RE-priority V2G protocols'],
  },
  'Standards (ISO 15118, CCS, CHAdeMO)': {
    description:
      'Patents implementing or extending charging communication standards - especially ISO 15118-20 (AC/DC bidirectional), CCS and CHAdeMO.',
    scope: ['ISO 15118-2 / -20 implementations', 'CCS bidirectional', 'CHAdeMO V2X', 'Plug-and-Charge (PnC)'],
    drivers: ['ISO 15118-20 finalization', 'Regulatory mandates for interoperability', 'OEM harmonization efforts'],
    opportunities: ['Cross-standard bridging solutions', 'PnC identity and billing', 'Certified V2G test suites'],
  },
  'Cybersecurity of Charging': {
    description:
      'Security-focused IP for authentication, encryption and intrusion detection in EV charging and V2G communications.',
    scope: ['Charging authentication', 'Secure communication (TLS, PKI)', 'Intrusion detection', 'Firmware integrity'],
    drivers: ['Rising critical-infrastructure threats', 'EU NIS2 / US regulatory pressure', 'V2G expanding attack surface'],
    opportunities: ['Zero-trust charging architectures', 'Hardware root-of-trust in chargers', 'ISO 15118 PKI ecosystems'],
  },
  'Communication & Protocols': {
    description:
      'Patents on the messaging and protocol layer between vehicles, chargers, aggregators and the grid - including OCPP, OpenADR and Plug-and-Charge.',
    scope: ['OCPP 2.0.1 / 2.1', 'OpenADR / IEEE 2030.5', 'Plug-and-Charge (ISO 15118)', 'Aggregator-to-charger APIs'],
    drivers: ['Interoperability requirements', 'Managed-charging programs', 'V2G market participation'],
    opportunities: ['Edge computing for V2G', 'Standardized aggregator APIs', 'Real-time streaming telemetry'],
  },
  'Charging Infrastructure & EVSE': {
    description:
      'Hardware and system patents on charging stations (EVSE), including bidirectional units, DC fast chargers and depot-scale infrastructure.',
    scope: ['AC and DC EVSE', 'Bidirectional wall boxes', 'Depot and fleet chargers', 'Curbside and public charging'],
    drivers: ['EU AFIR mandate', 'Fleet electrification', 'Utility CAPEX programs'],
    opportunities: ['Cost-optimized bidirectional EVSE', 'Depot-optimized DC hubs', 'Modular upgradeable platforms'],
  },
  'Cell Balancing & Pack': {
    description:
      'Pack-level IP covering active/passive balancing, equalization circuits and pack topologies that support high-throughput bidirectional cycling.',
    scope: ['Active and passive balancing', 'Cell equalization circuits', 'Pack topology innovations', 'Module-level power electronics'],
    drivers: ['Larger high-voltage packs', 'V2G cycling stress', 'Cell-chemistry diversification'],
    opportunities: ['Module-level converters (MLPE)', 'Reconfigurable pack topologies', 'Bidirectional-optimized balancing'],
  },
  'Thermal Management': {
    description:
      'Patents on cooling and heating strategies for batteries and power electronics, essential for sustained bidirectional operation.',
    scope: ['Liquid cooling systems', 'Immersion cooling', 'Heat pumps and integrated thermal loops', 'Cell-level thermal design'],
    drivers: ['High-power DC V2G', 'Fast charging temperature limits', 'Extreme-climate reliability'],
    opportunities: ['Immersion cooling for V2G packs', 'Integrated vehicle/charger thermal loops', 'Predictive thermal management'],
  },
  'Isolation & Safety Circuits': {
    description:
      'Safety-critical patents on galvanic isolation, ground fault detection, leakage current mitigation and protection circuits for bidirectional systems.',
    scope: ['Galvanic isolation transformers', 'Ground-fault detection', 'Leakage current mitigation', 'Islanding and anti-islanding'],
    drivers: ['Bidirectional grid-tie safety codes', 'Residential V2H requirements', 'IEC 61851 / UL 1741 compliance'],
    opportunities: ['Compact isolation transformers', 'Solid-state protection devices', 'Advanced anti-islanding for V2H'],
  },
  'Fleet & Microgrid Integration': {
    description:
      'IP on aggregating EV fleets and integrating them into microgrids and virtual power plants (VPPs) for coordinated flexibility services.',
    scope: ['Fleet aggregation platforms', 'VPP orchestration', 'Microgrid controllers', 'Depot energy management'],
    drivers: ['Fleet-scale V2G economics', 'Utility VPP programs', 'Behind-the-meter optimization'],
    opportunities: ['Depot-as-a-VPP business models', 'Multi-site aggregation', 'Microgrid + EV fleet islanding'],
  },
};

interface GrowingTopicPopupProps {
  topic: string;
  y2020: number;
  y2025: number;
  growthAbs: number;
  growthPct: number;
  total: number;
  children: ReactNode;
}

export function GrowingTopicPopup({ topic, y2020, y2025, growthAbs, growthPct, total, children }: GrowingTopicPopupProps) {
  const [open, setOpen] = useState(false);
  const info = TOPIC_INFO[topic];

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
                {info.scope.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
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
                    <Sparkles className="w-3 h-3 text-energy-green mt-0.5 shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="p-3 text-center text-[11px] text-muted-foreground border-t bg-muted/30">
          {total.toLocaleString()} patents classified in this topic
        </div>
      </DialogContent>
    </Dialog>
  );
}
