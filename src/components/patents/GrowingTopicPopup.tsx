import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TrendingUp, Sparkles, Lightbulb, Target, Layers } from 'lucide-react';
import { ReactNode, useState } from 'react';

// Brief explanations shown on hover for each scope tag.
const SCOPE_DESCRIPTIONS: Record<string, string> = {
  // V2G Bidirectional Power Conversion
  'Bidirectional inverters': 'Power electronics that convert DC battery energy to grid-synchronized AC and vice versa.',
  'DC-DC / DC-AC converters': 'Stages that step DC voltages up/down or convert between DC and AC in a bidirectional charger.',
  'Isolated and non-isolated topologies': 'Circuit families with or without galvanic isolation between battery and grid sides.',
  'Wide-bandgap (SiC/GaN) devices': 'Silicon-carbide and gallium-nitride semiconductors enabling higher efficiency and power density.',
  // V2G Control & Dispatch
  'Aggregator control loops': 'Software loops that coordinate many EVs as a single grid resource.',
  'Predictive dispatch': 'Algorithms that forecast prices, load and driver behavior to plan charge/discharge.',
  'Fleet optimization': 'Optimization across a full vehicle fleet to maximize revenue or minimize cost.',
  'Real-time market bidding': 'Automated bidding of EV flexibility into wholesale or balancing markets.',
  // V2H
  'Home backup inverters': 'Inverters that supply a home from the EV battery during grid outages.',
  'Islanding and transfer switches': 'Devices that safely disconnect the home from the grid to run in island mode.',
  'Home energy management': 'Software controlling PV, battery, EV and loads inside a residence.',
  'Residential bidirectional wall boxes': 'Home-scale AC/DC bidirectional chargers.',
  // V2B
  'Commercial bidirectional chargers': 'Higher-power bidirectional EVSE for commercial and industrial sites.',
  'Building energy management integration': 'Integration between chargers and BMS/BEMS to optimize building loads.',
  'Demand-charge reduction': 'Discharging EVs during peak-demand windows to lower utility demand charges.',
  'Behind-the-meter dispatch': 'Local dispatch of EV flexibility on the customer side of the utility meter.',
  // OBC
  'Integrated bidirectional OBCs': 'Onboard chargers designed to send power back to the grid or home.',
  'Motor-drive-based charging': 'Using the traction inverter and motor windings as part of the charger.',
  'Single/three-phase AC bidirectional': 'AC bidirectional charging on 1-phase and 3-phase mains.',
  'High-efficiency OBC topologies': 'Circuit topologies that maximize efficiency of the onboard charger.',
  // Off-Board DC
  'DC bidirectional wall boxes': 'Wall-mounted DC chargers with two-way power flow.',
  'Grid-tied DC charging piles': 'Public/depot DC chargers connected directly to grid feeders.',
  'CHAdeMO and CCS DC V2G': 'DC V2G stacks over CHAdeMO or CCS connectors.',
  'Modular DC power blocks': 'Stackable DC power modules for scalable charging hubs.',
  // Wireless
  'Resonant inductive coupling': 'Magnetic resonance between coils to transfer power without wires.',
  'Dynamic and static wireless V2G': 'Wireless V2G while parked (static) or while driving (dynamic in-road).',
  'Coil and compensation network design': 'Coil geometry and matching networks for efficient wireless transfer.',
  'Foreign-object detection': 'Sensing metallic objects between coils to prevent hazards.',
  // BMS
  'SoC / SoH estimation': 'Estimating battery state of charge and state of health in real time.',
  'Cell monitoring and protection': 'Measuring cell voltages/temperatures and enforcing safe operating limits.',
  'Fault detection': 'Detecting internal short-circuits, thermal runaway precursors, sensor faults.',
  'Bidirectional-aware BMS logic': 'BMS strategies tuned for frequent charge/discharge cycling in V2G.',
  // Battery Degradation
  'Cycle life modeling': 'Models predicting how many charge/discharge cycles a battery can sustain.',
  'Calendar ageing': 'Capacity loss over time even when the battery is idle.',
  'Capacity fade under V2G': 'How bidirectional cycling affects usable capacity.',
  'Ageing-aware control strategies': 'Dispatch rules that trade off revenue against battery wear.',
  // Grid Services
  'Frequency regulation': 'Fast up/down power adjustments that keep grid frequency at 50/60 Hz.',
  'Voltage / reactive power support': 'Injecting or absorbing reactive power to hold voltage in limits.',
  'Peak shaving and load balancing': 'Discharging during peaks and charging during valleys to flatten load.',
  'Congestion management (Redispatch)': 'Relieving overloaded grid segments via targeted charge/discharge (e.g., Redispatch 3.0).',
  // Smart Charging
  'Managed charging platforms': 'Cloud platforms that control when connected EVs charge.',
  'Time-of-use optimization': 'Shifting charging to cheap tariff windows.',
  'PV self-consumption': 'Charging preferentially from local solar generation.',
  'Multi-vehicle scheduling': 'Coordinating chargers across many vehicles at a site.',
  // Renewables
  'PV + EV coupled systems': 'Architectures that share power electronics between PV and EV.',
  'Solar carports': 'Parking canopies with PV that charge vehicles directly.',
  'Wind-farm-linked charging': 'Charging schemes co-located with or contracted to wind generation.',
  'Renewable-priority scheduling': 'Charging logic that maximizes renewable share.',
  // Standards
  'ISO 15118-2 / -20 implementations': 'Communication stacks implementing the EV-EVSE ISO standard, including bidirectional -20.',
  'CCS bidirectional': 'Bidirectional extensions for the Combined Charging System connector.',
  'CHAdeMO V2X': 'CHAdeMO protocol extensions supporting V2G/V2H/V2B.',
  'Plug-and-Charge (PnC)': 'Automatic vehicle authentication and billing via ISO 15118 certificates.',
  // Cybersecurity
  'Charging authentication': 'Verifying identity of vehicles, chargers and backends.',
  'Secure communication (TLS, PKI)': 'Encrypted, certificate-based charging communications.',
  'Intrusion detection': 'Monitoring charger networks for anomalies and attacks.',
  'Firmware integrity': 'Signing and verifying charger firmware to prevent tampering.',
  // Communication
  'OCPP 2.0.1 / 2.1': 'Open Charge Point Protocol between chargers and backend platforms.',
  'OpenADR / IEEE 2030.5': 'Utility demand-response and DER communication standards.',
  'Plug-and-Charge (ISO 15118)': 'PnC identification and billing over ISO 15118.',
  'Aggregator-to-charger APIs': 'APIs used by aggregators to command fleets of chargers.',
  // Infrastructure
  'AC and DC EVSE': 'AC (slow/medium) and DC (fast) charging station hardware.',
  'Bidirectional wall boxes': 'Compact bidirectional chargers for residential or light-commercial use.',
  'Depot and fleet chargers': 'High-power charging infrastructure for bus/truck/taxi depots.',
  'Curbside and public charging': 'Publicly accessible on-street or destination chargers.',
  // Cell Balancing
  'Active and passive balancing': 'Redistributing energy between cells or bleeding it off resistively.',
  'Cell equalization circuits': 'Analog/digital circuits that equalize cell voltages during cycling.',
  'Pack topology innovations': 'New series/parallel arrangements and switching schemes.',
  'Module-level power electronics': 'Per-module converters (MLPE) for finer control and higher availability.',
  // Thermal
  'Liquid cooling systems': 'Circulating coolant to remove heat from cells and power electronics.',
  'Immersion cooling': 'Submerging cells or components in dielectric fluid for efficient cooling.',
  'Heat pumps and integrated thermal loops': 'Shared thermal loops between cabin, battery and power electronics.',
  'Cell-level thermal design': 'Optimizing heat paths at the individual cell level.',
  // Isolation & Safety
  'Galvanic isolation transformers': 'Transformers that block DC coupling between battery and grid.',
  'Ground-fault detection': 'Sensing leakage currents to ground for personnel safety.',
  'Leakage current mitigation': 'Filters and circuit design to minimize leakage in bidirectional systems.',
  'Islanding and anti-islanding': 'Detecting grid loss and safely disconnecting or continuing in island mode.',
  // Fleet & Microgrid
  'Fleet aggregation platforms': 'Software aggregating many fleet EVs into a controllable resource.',
  'VPP orchestration': 'Virtual Power Plant control layer combining EVs, batteries and DERs.',
  'Microgrid controllers': 'Local controllers that operate a site as a grid-connected or islanded microgrid.',
  'Depot energy management': 'Depot-level optimization of charging, discharging and site load.',
};



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
                {info.scope.map((s) => {
                  const desc = SCOPE_DESCRIPTIONS[s];
                  const badge = (
                    <Badge variant="secondary" className={desc ? 'text-xs cursor-help' : 'text-xs'}>{s}</Badge>
                  );
                  return desc ? (
                    <HoverCard key={s} openDelay={100} closeDelay={80}>
                      <HoverCardTrigger asChild>{badge}</HoverCardTrigger>
                      <HoverCardContent side="top" className="w-64 text-xs leading-relaxed">
                        <div className="font-medium text-foreground mb-1">{s}</div>
                        <div className="text-muted-foreground">{desc}</div>
                      </HoverCardContent>
                    </HoverCard>
                  ) : <span key={s}>{badge}</span>;
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
