// Module content sourced exclusively from user-uploaded documents:
// - V2X_State_of_the_Art_Report.docx
// - EV_Bidirectional_Charging_Report_Generation.docx
// - Strategic_State_of_the_Art_Report_Vehicle-to-Everything_V2X_Technology_for_DC_Fast_Charging_Infrastructure.docx
// - Comprehensive_Analysis_of_V2X_Ecosystems_The_DriVe2X_Electromobility_Project_and_V2X_Inc._Defense_Infrastructure.docx

export const marketsContent = {
  metrics: [
    { title: 'Global V2X Market (2025)', value: '$5.75B', subtitle: '→ $19.5B by 2030 (CAGR 27.6%)', icon: 'DollarSign', color: 'from-primary to-accent' },
    { title: 'Bidirectional Charger SW', value: '$0.6B', subtitle: '→ $8.2B by 2035 (CAGR 29.8%)', icon: 'TrendingUp', color: 'from-energy-blue to-energy-teal' },
    { title: 'Bidirectional Charger HW', value: '$1.4B', subtitle: '→ $14.5B by 2035 (CAGR 21.3%)', icon: 'BarChart3', color: 'from-energy-teal to-energy-green' },
    { title: 'US V2X Capacity', value: '20 MW', subtitle: '2024, doubling to 40 MW in 2025', icon: 'Zap', color: 'from-energy-amber to-primary' },
  ],
  // Share of V2G pilot deployments by charger type — the only quantitative
  // technical split cited in the source documents (EV_Bid §4.2).
  regionData: [
    { name: 'DC bidirectional (commercial)', value: 70, color: 'hsl(var(--primary))' },
    { name: 'AC bidirectional (residential)', value: 30, color: 'hsl(var(--accent))' },
  ],
  // Revenue streams named in the V2X and EV_Bid reports. Shares reflect the
  // qualitative ordering discussed in §2.1 (V2X SOTA) and §4 (EV_Bid),
  // with frequency regulation cited as the fastest-paying market.
  revenueStreams: [
    { name: 'Frequency regulation', share: 30, icon: 'Activity', color: 'from-primary to-accent' },
    { name: 'Demand-charge management', share: 25, icon: 'Zap', color: 'from-energy-blue to-energy-teal' },
    { name: 'Energy arbitrage', share: 20, icon: 'ArrowUpDown', color: 'from-energy-teal to-energy-green' },
    { name: 'Capacity / demand response', share: 15, icon: 'Shield', color: 'from-energy-amber to-primary' },
    { name: 'V2H backup / resilience', share: 10, icon: 'Sun', color: 'from-accent to-primary' },
  ],
  evidence: [
    'Global V2X market projected to grow from <b>$5.75B in 2025 to $19.5B by 2030</b> (CAGR 27.6%). (V2X SOTA Report, Executive Summary)',
    '<b>ABB E-mobility and Alpitronic</b> each surpassed 4.5 TWh of energy delivered by late 2025; <b>Kempower</b> shows the strongest growth in depot charging for buses and commercial vehicles. (V2X SOTA §4.2)',
    'Octopus Energy <b>Powerloop (UK)</b> demonstrated that residential participants can earn <b>up to £800/year</b> through arbitrage and grid services with a Nissan Leaf and bidirectional charger. (EV_Bid §4.1)',
    '<b>DC bidirectional chargers dominate the commercial V2G market (>70% of pilots)</b>; AC solutions are projected to gain share in residential post-2027 as Renault and Volvo standardize on AC V2G. (EV_Bid §4.2)',
    'North America propelled by <b>NEVI federal funding</b> mandating high-power, reliable, and increasingly V2X-capable infrastructure. (V2X SOTA §4.1)',
    'Bifurcated market: <b>Pure Players</b> (Nuvve, Fermata Energy, The Mobility House) vs. <b>Traditional OEMs</b> (Nissan, Ford, Renault, Hyundai/Kia). (EV_Bid §4.4)',
  ],
};

export const engineeringContent = {
  highlights: [
    { title: 'Round-trip efficiency', value: '80–85%', subtitle: 'Losses across rectification, DC-DC, battery, inversion', icon: 'Gauge', color: 'from-primary to-accent' },
    { title: 'Bidirectional round-trip', value: '88–92%', subtitle: 'vs 94–96% unidirectional conductive (V2X SOTA)', icon: 'Zap', color: 'from-energy-blue to-energy-teal' },
    { title: 'V2G cycling current', value: '<0.5C', subtitle: 'Optimized V2G reduced capacity loss 13.51% (Nottingham)', icon: 'Battery', color: 'from-energy-teal to-energy-green' },
    { title: 'Onboard charger cap', value: '22 kW', subtitle: 'vs off-board DC at hundreds of kW to MW-level', icon: 'Cpu', color: 'from-energy-amber to-primary' },
  ],
  techSpecs: [
    { label: 'SiC / GaN power devices', value: 'Wide-bandgap', status: 'mature' },
    { label: 'Bidirectional DC/DC (CLLC, DAB)', value: 'Commercial', status: 'mature' },
    { label: 'Grid-tied AC/DC inverter + PLL', value: 'Anti-islanding req.', status: 'mature' },
    { label: 'ISO 15118-20 (BPT, PnC, TLS 1.3)', value: 'Rolling out', status: 'developing' },
    { label: 'VPP aggregation (OCPP 2.0.1)', value: 'Scaling', status: 'developing' },
    { label: 'ML-based battery-health control', value: 'R&D', status: 'developing' },
    { label: 'MCS / SAE J3271 (megawatt DC)', value: 'Early', status: 'early' },
    { label: 'AC V2G residential (SAE J3072)', value: 'Emerging', status: 'developing' },
  ],
  evidence: [
    'Bidirectional DC V2X <b>externalizes power conversion to the charger</b>, unlike AC-based V2X which relies on the vehicle onboard charger (limited to ~22 kW). (V2X SOTA §1.1)',
    'Discharge chain: battery → bidirectional DC/DC → centralized DC bus → grid-tied bidirectional AC/DC inverter synchronized via <b>Phase-Locked Loop</b>. (V2X SOTA §1.1; EV_Bid §2.3)',
    '<b>Anti-islanding is safety-critical</b>: passive ROCOF detection plus active impedance perturbation methods; codified in UL 9741. (EV_Bid §2.3)',
    'Fixed auxiliary losses (cooling, control) can drive efficiency <b>below 80% at &lt;3 kW</b>, destroying the economic case for arbitrage. (EV_Bid §2.3)',
    'Nottingham University: optimized V2G kept batteries near <b>50% SoC</b>, <b>reducing capacity loss by 13.51%</b> vs a non-V2G baseline. (EV_Bid §2.3)',
    'Innovation has shifted from converter topologies to the <b>application layer</b>: control algorithms, cybersecurity, blockchain energy trading, ML battery-health prediction. (EV_Bid §3.2)',
  ],
};

export const standardsContent = {
  standards: [
    {
      name: 'ISO 15118-20',
      year: '2022',
      status: 'active',
      description: 'Definitive V2G comms standard. Supports Bidirectional Power Transfer (AC & DC), Plug & Charge with TLS 1.3, dynamic tariff negotiation. Mandatory for public EU infrastructure under AFIR from 2027.',
      features: ['BPT AC/DC', 'Plug & Charge', 'TLS 1.3', 'AFIR 2027'],
    },
    {
      name: 'UL 9741',
      year: 'North America',
      status: 'active',
      description: 'Safety standard for Bidirectional EV Charging System Equipment in the US. Mandates strict anti-islanding and over-current protection. Prerequisite for any commercial V2G deployment. Fermata FE-20 was the first UL 9741–certified charger.',
      features: ['Anti-islanding', 'Over-current', 'US mandatory'],
    },
    {
      name: 'IEEE 1547-2018',
      year: '2018',
      status: 'active',
      description: 'US standard for interconnecting Distributed Energy Resources. Requires smart inverters (V2G chargers) to provide voltage ride-through and frequency response. Driven at state level by e.g. California Rule 21.',
      features: ['Smart inverter', 'Grid support', 'DER interconnection'],
    },
    {
      name: 'SAE J3072',
      year: 'SAE',
      status: 'active',
      description: 'Interconnection requirements for on-board inverters (AC V2G), bridging automotive and utility standards.',
      features: ['AC V2G', 'Onboard inverter'],
    },
    {
      name: 'IEC 61851-1',
      year: 'IEC',
      status: 'active',
      description: 'General requirements for conductive EV charging systems — the baseline referenced by higher-layer V2G standards.',
      features: ['Conductive', 'Baseline'],
    },
    {
      name: 'SAE J3271 (MCS)',
      year: 'Emerging',
      status: 'draft',
      description: 'Megawatt Charging System for heavy-duty vehicles; positioned as the primary communication path for high-power bidirectional flows alongside ISO 15118-20.',
      features: ['Megawatt DC', 'Heavy-duty'],
    },
    {
      name: 'OCPP 2.0.1',
      year: 'OCA',
      status: 'active',
      description: 'Open Charge Point Protocol between charger and cloud aggregator; carries SoC and power limits in VPP architectures.',
      features: ['Charger↔cloud', 'VPP', 'Open'],
    },
    {
      name: 'DIN 70121 / ISO 15118-2',
      year: 'Legacy',
      status: 'active',
      description: 'Legacy communication baseline for unidirectional DC fast charging, superseded for bidirectional use by ISO 15118-20.',
      features: ['Legacy DC', 'V1G'],
    },
  ],
  challenges: [
    { challenge: 'Interconnection rules vary by US state and utility (Rule 21)', region: 'USA', status: 'critical' },
    { challenge: 'Double taxation of energy charged then discharged', region: 'Multiple', status: 'critical' },
    { challenge: 'ISO 15118-20 certification test labs and procedures scarce', region: 'Global', status: 'major' },
    { challenge: 'Residential proprietary ecosystems (vehicle-locked chargers)', region: 'USA (MA V2X)', status: 'major' },
    { challenge: 'Warranty and safety limits on discharge depth', region: 'Global', status: 'major' },
    { challenge: 'Fragmented DER interconnection agreements for mobile storage', region: 'USA / EU', status: 'moderate' },
    { challenge: 'DSRC vs C-V2X spectrum harmonization (comms layer)', region: 'Global', status: 'moderate' },
  ],
  evidence: [
    'ISO 15118-20 becomes a <b>mandatory requirement for public EU infrastructure under AFIR from 2027</b>. (EV_Bid §3.1)',
    'UL 9741 certification is a <b>prerequisite</b> for any commercial V2G charger deployment in the US; the Fermata FE-20 was first to receive it. (EV_Bid §3.1, §4.4)',
    'Massachusetts V2X Demonstration Program: commercial and school-bus sectors show <b>high interoperability</b> via open protocols, while residential is hampered by <b>proprietary ecosystems</b>. (V2X SOTA §4.3)',
    'IEEE 1547-2018 requires <b>smart inverters</b>, including V2G chargers, to provide voltage ride-through and frequency response; state-level adoption (California Rule 21) drives compliance. (EV_Bid §3.1)',
    'The SCALE Horizon Europe project (29 partners) has developed <b>tender requirements for cities</b> to ensure interoperability through open standards. (V2X SOTA §4.3)',
  ],
};

export const architecturesContent = {
  architectures: [
    {
      name: 'DC Off-Board Bidirectional (V2G)',
      power: '50 kW – MW-scale',
      maturity: 'Mature',
      pros: [
        'Externalizes power conversion to the charger',
        'Bypasses onboard-charger 22 kW limit',
        '>70% of commercial V2G pilots today',
      ],
      cons: [
        'Higher hardware CAPEX than AC',
        'Requires ISO 15118-20 support end-to-end',
      ],
      useCase: 'Fleet depots, transit, commercial buildings',
    },
    {
      name: 'AC Onboard Bidirectional',
      power: '11 – 22 kW',
      maturity: 'Emerging',
      pros: [
        'Lower hardware cost for consumers',
        'Standardized by Renault, Volvo (post-2027)',
        'Simpler home-side installation',
      ],
      cons: [
        'Limited by onboard-charger power',
        'Regulatory hurdles for residential DER',
      ],
      useCase: 'Residential V2G / V2H',
    },
    {
      name: 'Aggregated Virtual Power Plant',
      power: 'Fleet-aggregated MW',
      maturity: 'Emerging',
      pros: [
        'Presents dispersed EVs as a single dispatchable plant',
        'Enables revenue stacking across markets',
        'Predictable fleet duty cycles ease aggregation',
      ],
      cons: [
        'Depends on OCPP 2.0.1 + ISO 15118-20 maturity',
        'Requires cloud optimization and market access',
      ],
      useCase: 'School buses, delivery fleets, depot charging',
    },
  ],
  components: [
    { name: 'Bidirectional DC/DC converter', function: 'CLLC / DAB topology, SiC devices', icon: 'Cpu' },
    { name: 'Grid-tied AC/DC inverter', function: 'PLL sync, anti-islanding (ROCOF)', icon: 'Zap' },
    { name: 'EV traction battery + BMS', function: 'SoC / SoH mgmt, degradation control', icon: 'Battery' },
    { name: 'Aggregator / VPP platform', function: 'OCPP 2.0.1, ISO 15118-20, market bidding', icon: 'Network' },
    { name: 'Charging Station Management', function: 'Depot orchestration, load shedding', icon: 'Building2' },
    { name: 'Cybersecurity layer (TLS 1.3 / PKI)', function: 'Plug & Charge, message integrity', icon: 'Cpu' },
    { name: 'Smart meter / DER interface', function: 'IEEE 1547 smart-inverter functions', icon: 'Zap' },
    { name: 'Energy Management System', function: 'Battery-health-aware dispatch', icon: 'Network' },
  ],
  evidence: [
    'VPP stack has three layers: <b>Physical (EV + EVSE)</b>, <b>Communication (OCPP 2.0.1, ISO 15118-20)</b>, <b>Optimization (cloud dispatch)</b>. (EV_Bid §2.4)',
    'Kempower positions in <b>depot charging for buses and commercial vehicles</b>, where predictable parking windows make VPP aggregation easier than for passenger cars. (V2X SOTA §4.2)',
    'DC V2X shifts power conversion to the charger, allowing <b>hundreds of kW to megawatt-level</b> bidirectional transfer beyond onboard-charger limits. (V2X SOTA §1.1)',
    'Wide-bandgap devices (SiC, GaN) drive current topology innovation; basic AC/DC and DC/DC converter topologies are <b>saturated</b> in the patent landscape. (EV_Bid §3.2)',
  ],
};

export const risksContent = {
  categories: [
    {
      name: 'Grid & System Stability',
      icon: 'Zap',
      color: 'from-energy-red to-energy-amber',
      risks: [
        { risk: 'Local transformer overheating from simultaneous discharge', severity: 'high' },
        { risk: 'Loss of anti-islanding protection', severity: 'critical' },
        { risk: 'Frequency / voltage sync errors (PLL mismatch)', severity: 'high' },
        { risk: 'Declining inertial support from renewables', severity: 'medium' },
      ],
    },
    {
      name: 'Cybersecurity',
      icon: 'Lock',
      color: 'from-primary to-accent',
      risks: [
        { risk: 'Massive attack surface (millions of two-way endpoints)', severity: 'critical' },
        { risk: 'PKI / TLS 1.3 key management at scale', severity: 'high' },
        { risk: 'Compromised aggregator = grid-level impact', severity: 'critical' },
      ],
    },
    {
      name: 'Battery & Asset',
      icon: 'AlertTriangle',
      color: 'from-energy-amber to-energy-red',
      risks: [
        { risk: 'V2G cycling accelerating capacity fade', severity: 'medium' },
        { risk: 'OEM warranty limits on discharge depth', severity: 'high' },
        { risk: 'Calendar aging at 100% SoC', severity: 'medium' },
      ],
    },
    {
      name: 'Regulatory & Commercial',
      icon: 'Scale',
      color: 'from-energy-blue to-energy-teal',
      risks: [
        { risk: 'Double taxation of charged / discharged energy', severity: 'critical' },
        { risk: 'Fragmented interconnection rules (US Rule 21 variants)', severity: 'high' },
        { risk: 'ISO 15118-20 certification bottlenecks', severity: 'high' },
        { risk: 'Proprietary residential ecosystems (vehicle-locked chargers)', severity: 'medium' },
      ],
    },
  ],
  threats: [
    { threat: 'Massive cyber-attack surface from two-way EV↔grid links', likelihood: 'high', impact: 'critical' },
    { threat: 'Double taxation destroying arbitrage economics', likelihood: 'high', impact: 'critical' },
    { threat: 'Round-trip efficiency stuck at 80–85% erodes revenue', likelihood: 'high', impact: 'high' },
    { threat: 'Distribution transformer overload from clustered V2G', likelihood: 'medium', impact: 'high' },
    { threat: 'OEM warranty voidance blocking consumer participation', likelihood: 'medium', impact: 'high' },
    { threat: 'Certification lab shortage delaying ISO 15118-20 rollout', likelihood: 'high', impact: 'high' },
    { threat: 'Consumer friction from V2H installation complexity', likelihood: 'high', impact: 'medium' },
  ],
  concerns: [
    'Opening a <b>two-way data and power channel</b> between the grid and millions of vehicles creates a massive attack surface — TLS encryption and PKI management are non-negotiable. (EV_Bid §5.2)',
    'Total round-trip efficiency hovers around <b>80–85%</b>; improving via SiC-based CLLC/DAB converters is essential to preserve economic returns. (EV_Bid §5.2)',
    'V2G cycling risks battery aging, but optimized strategies keeping SoC near 50% <b>reduced capacity loss by 13.51%</b> vs baseline (Nottingham University). (EV_Bid §2.3)',
    '<b>Double taxation</b> — energy taxed when charged and again when discharged — destroys arbitrage economics in many jurisdictions. (EV_Bid §5.1)',
    'Local distribution transformers may <b>overheat if multiple neighbors discharge simultaneously</b>; smart coordination is required. (EV_Bid §5.3)',
    'Regulatory Framework maturity is only <b>TRL 4–5</b>, lagging hardware (TRL 8–9) and standards (TRL 7–8). (EV_Bid §4.3)',
  ],
};
