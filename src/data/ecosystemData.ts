import { Car, Plug, Building2, Zap, LineChart, Battery, ArrowUpDown, Shield, Clock, Leaf, DollarSign, Server, Cpu, Network, Users, Factory, Building, Globe, Lightbulb, AlertTriangle, Target } from 'lucide-react';

export interface Capability {
  icon: React.ElementType;
  label: string;
  tooltip: string;
}

export interface TechLayer {
  name: string;
  items: string[];
}

export interface PlayerCategory {
  category: string;
  examples: string[];
}

export interface StrategicInsight {
  opportunity: string;
  challenge: string;
  controlPoint: string;
}

export interface EcosystemNode {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  color: string;
  roleStatement: string;
  roleDescription: string;
  roleTags: string[];
  capabilities: Capability[];
  technologies: TechLayer[];
  players: PlayerCategory[];
  strategic: StrategicInsight;
}

export const ecosystemNodes: Record<string, EcosystemNode> = {
  ev: {
    id: 'ev',
    label: 'Electric Vehicles',
    sublabel: 'DER Assets',
    icon: Car,
    color: 'from-energy-blue to-energy-teal',
    roleStatement: 'EVs as distributed energy resources',
    roleDescription: 'Mobile energy storage units that function as flexible distributed energy resources connected to the grid through chargers. EVs transform transportation assets into active participants in the energy system.',
    roleTags: ['Energy Storage Asset', 'Flexible Load', 'Mobile Battery'],
    capabilities: [
      { icon: Battery, label: 'Store Electricity', tooltip: 'High-capacity battery packs store energy for later use' },
      { icon: ArrowUpDown, label: 'Inject Power', tooltip: 'Return stored energy back to sites or grid' },
      { icon: Clock, label: 'Fast Response', tooltip: 'Provide rapid frequency response within seconds' },
      { icon: Shield, label: 'Backup Power', tooltip: 'Emergency power supply during outages' },
      { icon: Leaf, label: 'Renewable Balancing', tooltip: 'Absorb excess solar/wind generation' },
    ],
    technologies: [
      { name: 'Hardware', items: ['High-capacity Li-ion packs', 'Battery Management Systems', 'Thermal management'] },
      { name: 'Control', items: ['Onboard DC interfaces', 'State-of-charge monitoring', 'Discharge protocols'] },
      { name: 'Interface', items: ['Grid-compliant discharge', 'Communication protocols', 'Safety interlocks'] },
    ],
    players: [
      { category: 'OEMs', examples: ['Passenger vehicle manufacturers', 'Heavy-duty truck OEMs', 'Bus manufacturers'] },
      { category: 'Battery', examples: ['Cell manufacturers', 'Pack integrators', 'BMS providers'] },
      { category: 'Fleet', examples: ['Logistics operators', 'Transit agencies', 'Commercial fleets'] },
    ],
    strategic: {
      opportunity: 'Transforms mobility infrastructure into distributed energy assets',
      challenge: 'Battery lifetime warranties, availability conflicts, degradation concerns',
      controlPoint: 'Controls physical energy capacity and mobile storage availability',
    },
  },
  charger: {
    id: 'charger',
    label: 'Bidirectional Chargers',
    sublabel: 'Grid Inverters',
    icon: Plug,
    color: 'from-energy-teal to-energy-green',
    roleStatement: 'Grid-connected power conversion interface',
    roleDescription: 'The critical interface between vehicles and the energy system, acting as controllable grid-connected inverters that enable bidirectional power flow with full grid-code compliance.',
    roleTags: ['Grid Inverter', 'Power Converter', 'Control Node'],
    capabilities: [
      { icon: ArrowUpDown, label: 'AC/DC Conversion', tooltip: 'Bidirectional power conversion between AC grid and DC vehicle' },
      { icon: Zap, label: 'Power Flow Control', tooltip: 'Precise control of power magnitude and direction' },
      { icon: Shield, label: 'Grid Compliance', tooltip: 'Meet IEEE 1547 and local grid-code requirements' },
      { icon: Server, label: 'Protection & Isolation', tooltip: 'Safety systems and galvanic isolation' },
      { icon: Network, label: 'Aggregation Ready', tooltip: 'Communication interfaces for fleet management' },
    ],
    technologies: [
      { name: 'Hardware', items: ['SiC power modules', 'Bidirectional inverters', 'Thermal systems'] },
      { name: 'Control', items: ['Grid-forming control', 'Grid-following modes', 'Real-time DSP'] },
      { name: 'Interface', items: ['Cybersecurity layers', 'EMS communication', 'Metering & billing'] },
    ],
    players: [
      { category: 'Charger OEMs', examples: ['DC fast-charger manufacturers', 'Infrastructure providers', 'V2G specialists'] },
      { category: 'Power Electronics', examples: ['Semiconductor suppliers', 'Module integrators', 'Inverter specialists'] },
      { category: 'Software', examples: ['Charging network operators', 'Backend providers', 'Certification bodies'] },
    ],
    strategic: {
      opportunity: 'Enables all V2X power use cases through the grid interface',
      challenge: 'Certification complexity, thermal limits at high power, unit economics',
      controlPoint: 'Controls grid interface compliance and power conversion quality',
    },
  },
  site: {
    id: 'site',
    label: 'Sites & Buildings',
    sublabel: 'V2B/V2H Nodes',
    icon: Building2,
    color: 'from-energy-green to-energy-amber',
    roleStatement: 'Local energy optimization nodes',
    roleDescription: 'Physical locations where EVs connect to real demand, serving as the optimization and resilience layer. Sites orchestrate local energy flows to maximize value from behind-the-meter operations.',
    roleTags: ['Local Energy Node', 'Demand Center', 'Microgrid Host'],
    capabilities: [
      { icon: LineChart, label: 'Peak Shaving', tooltip: 'Reduce demand charges by discharging during peaks' },
      { icon: Leaf, label: 'Self-Consumption', tooltip: 'Maximize use of on-site renewable generation' },
      { icon: Shield, label: 'Backup Power', tooltip: 'Maintain critical loads during outages' },
      { icon: Network, label: 'Microgrid Operation', tooltip: 'Island mode capability for resilience' },
      { icon: Server, label: 'Fleet Orchestration', tooltip: 'Coordinate multiple vehicles for site optimization' },
    ],
    technologies: [
      { name: 'Hardware', items: ['Energy Management Systems', 'Local BESS', 'Smart meters'] },
      { name: 'Control', items: ['Building management systems', 'Load forecasting', 'Optimization algorithms'] },
      { name: 'Interface', items: ['Microgrid controllers', 'Utility interconnection', 'DR program interfaces'] },
    ],
    players: [
      { category: 'Site Owners', examples: ['Fleet operators', 'Logistics companies', 'Commercial buildings'] },
      { category: 'Technology', examples: ['EMS providers', 'Microgrid developers', 'Solar installers'] },
      { category: 'Services', examples: ['Energy consultants', 'Facility managers', 'ESCOs'] },
    ],
    strategic: {
      opportunity: 'Strongest early business cases with immediate behind-the-meter value',
      challenge: 'Integration complexity across building systems and fleet operations',
      controlPoint: 'Controls real operational value and site-level optimization decisions',
    },
  },
  grid: {
    id: 'grid',
    label: 'Power Grid',
    sublabel: 'V2G Services',
    icon: Zap,
    color: 'from-energy-amber to-energy-orange',
    roleStatement: 'System stability and reliability layer',
    roleDescription: 'The electrical infrastructure that integrates EVs as active grid assets, leveraging their flexibility for system stability, renewable integration, and grid resilience.',
    roleTags: ['System Operator', 'Stability Provider', 'Grid Infrastructure'],
    capabilities: [
      { icon: Zap, label: 'Frequency Regulation', tooltip: 'Fast response to maintain 50/60 Hz stability' },
      { icon: ArrowUpDown, label: 'Voltage Support', tooltip: 'Reactive power for local voltage management' },
      { icon: Network, label: 'Congestion Management', tooltip: 'Reduce overloads on constrained feeders' },
      { icon: Leaf, label: 'Renewable Balancing', tooltip: 'Absorb excess or fill gaps in variable generation' },
      { icon: Shield, label: 'Emergency Response', tooltip: 'Grid support during contingency events' },
    ],
    technologies: [
      { name: 'Hardware', items: ['Substation automation', 'Protection systems', 'Smart transformers'] },
      { name: 'Control', items: ['DER management systems', 'Dispatch platforms', 'SCADA integration'] },
      { name: 'Interface', items: ['Grid-code frameworks', 'Interconnection standards', 'Telemetry systems'] },
    ],
    players: [
      { category: 'Grid Operators', examples: ['Transmission System Operators', 'Distribution System Operators', 'ISOs/RTOs'] },
      { category: 'Utilities', examples: ['Integrated utilities', 'Distribution companies', 'Municipal utilities'] },
      { category: 'Technology', examples: ['Grid automation vendors', 'DERMS providers', 'Smart grid solutions'] },
    ],
    strategic: {
      opportunity: 'Unlocks large-scale system value and grid-level revenue streams',
      challenge: 'Safety requirements, liability frameworks, cybersecurity mandates',
      controlPoint: 'Controls system access rules and grid service qualification',
    },
  },
  market: {
    id: 'market',
    label: 'Energy Markets',
    sublabel: 'Revenue Stacking',
    icon: LineChart,
    color: 'from-energy-orange to-energy-purple',
    roleStatement: 'Value creation and coordination layer',
    roleDescription: 'The economic infrastructure that converts EV flexibility into monetary value, enabling revenue stacking across multiple market products and creating the business case for V2X investment.',
    roleTags: ['Value Exchange', 'Price Discovery', 'Revenue Layer'],
    capabilities: [
      { icon: DollarSign, label: 'Ancillary Trading', tooltip: 'Participate in frequency and reserve markets' },
      { icon: LineChart, label: 'Flexibility Markets', tooltip: 'Trade local flexibility with DSOs' },
      { icon: Battery, label: 'Capacity Mechanisms', tooltip: 'Earn capacity payments for availability' },
      { icon: Network, label: 'Bilateral Contracts', tooltip: 'Direct agreements with offtakers' },
      { icon: Zap, label: 'Revenue Stacking', tooltip: 'Combine multiple value streams optimally' },
    ],
    technologies: [
      { name: 'Platforms', items: ['Market trading systems', 'Aggregation software', 'Settlement engines'] },
      { name: 'Intelligence', items: ['Forecasting systems', 'Optimization algorithms', 'AI-based dispatch'] },
      { name: 'Interface', items: ['Verification tools', 'Metering integration', 'Regulatory compliance'] },
    ],
    players: [
      { category: 'Aggregators', examples: ['Virtual power plants', 'Flexibility aggregators', 'Energy retailers'] },
      { category: 'Markets', examples: ['Power exchanges', 'Flexibility platforms', 'Capacity markets'] },
      { category: 'Software', examples: ['Energy trading companies', 'Optimization vendors', 'Fintech providers'] },
    ],
    strategic: {
      opportunity: 'Makes V2X financially viable through stacked revenue streams',
      challenge: 'Market access barriers, price volatility, regulatory uncertainty',
      controlPoint: 'Controls monetization logic and value distribution across ecosystem',
    },
  },
};
