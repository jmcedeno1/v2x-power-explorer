// V2G revenue stacking value streams.
// Sources: IEA, "Vehicle-to-Grid Technology" (https://www.iea.org/reports/vehicle-to-grid-technology)
// and T. Lipman for Gridworks, "Vehicle-Grid Integration Value Study Literature Review Summary",
// v3, Feb 2019 (https://gridworks.org/wp-content/uploads/2019/03/VGI-Value-Literature-Review-Final.pdf).
// Only the value streams named in those references are listed. No share-of-revenue split is
// shown because neither reference publishes a verifiable revenue breakdown across streams.

export type RevenueStreamDetail = {
  id: string;
  name: string;
  icon: string;
  color: string;
  tagline: string;
  whatItIs: string;
  howItPays: string;
  marketLevel: 'Wholesale / ISO' | 'Retail / behind-the-meter' | 'Distribution utility' | 'Customer resilience';
  timescale: string;
  metrics: { label: string; value: string; note?: string }[];
  applications: string[];
  players: { name: string; role: string }[];
  evidence: string[];
  references: { title: string; url: string; source: string }[];
};

const IEA_REF = {
  title: 'Vehicle-to-Grid Technology',
  url: 'https://www.iea.org/reports/vehicle-to-grid-technology',
  source: 'IEA',
};

const GRIDWORKS_REF = {
  title: 'Vehicle-Grid Integration Value Study - Literature Review Summary (v3)',
  url: 'https://gridworks.org/wp-content/uploads/2019/03/VGI-Value-Literature-Review-Final.pdf',
  source: 'Gridworks / T. Lipman (2019)',
};

export const revenueStreamDetails: RevenueStreamDetail[] = [
  {
    id: 'frequency-regulation',
    name: 'Frequency regulation',
    icon: 'Activity',
    color: 'from-primary to-accent',
    tagline: 'Fastest-paying wholesale product and the most studied V2G value stream',
    whatItIs:
      'Aggregated EV batteries follow a second-by-second signal from the system operator, absorbing power when frequency is high (regulation down) and injecting when frequency is low (regulation up). Because the energy volume is small and symmetric, batteries are paid mainly for capacity availability rather than for energy delivered.',
    howItPays:
      'Revenue is a capacity payment per MW of bid availability, plus mileage/performance payments and penalties for poor following. Fixed costs (scheduling coordinator, telemetry, market fees) are per-fleet, so profitability improves sharply with fleet size.',
    marketLevel: 'Wholesale / ISO',
    timescale: 'Seconds to minutes (4-second dispatch signals)',
    metrics: [
      { label: 'US ancillary market size', value: '~$400M/yr', note: 'Frequency response across 6 ISO markets (2014 data)' },
      { label: 'Most lucrative V2G application', value: '21.40% share', note: 'Astute Analytica application split' },
      { label: 'Best-case net revenue', value: '~$42k/vehicle', note: 'NYISO central case over 16 years; PJM ~$38k, CAISO ~$27k, ERCOT ~$26k, ISO-NE ~$18k' },
      { label: 'Early fleet economics', value: '$25-72/vehicle/month gross', note: 'LA AFB 15-vehicle CAISO fleet; net positive in only 1 of 10 months' },
    ],
    applications: [
      'Depot fleets with long, predictable dwell times (school buses, postal and utility fleets)',
      'Military and campus fleets bidding into CAISO Regulation Up and Down',
      'Aggregated residential chargers pooled into a single MW-scale bid',
      'Commercial building fleets stacking regulation on top of demand-charge savings',
    ],
    players: [
      { name: 'Nuvve', role: 'Aggregator bidding school-bus and fleet capacity into ancillary markets' },
      { name: 'The Mobility House', role: 'Fleet aggregation and market bidding in EU and US programs' },
      { name: 'Hitachi', role: 'Bidirectional chargers and control platform (JUMPSmartMaui)' },
      { name: 'CAISO / PJM / NYISO', role: 'Market operators defining Reg Up/Down products and telemetry rules' },
      { name: 'Olivine', role: 'Scheduling-coordinator and market-access services for V2G fleets' },
    ],
    evidence: [
      'Early fleet modelling (Tomic and Kempton) estimated net profits of $70-700/vehicle/year for a 100-vehicle regulation-down fleet, and $95-1,030/vehicle/year for a 252-vehicle regulation up-and-down fleet. (Gridworks review)',
      'The LA Air Force Base demonstration delivered 255 MWh of regulation up and 118 MWh of regulation down over 20 months with 29 bidirectional PEVs. (Gridworks review)',
      'Monthly revenue variation was hard to disentangle because market prices, performance penalties and awarded capacity all moved together; larger fleets spread fixed costs over more vehicles. (Gridworks review)',
    ],
    references: [IEA_REF, GRIDWORKS_REF],
  },
  {
    id: 'demand-charge-management',
    name: 'Demand-charge management',
    icon: 'Zap',
    color: 'from-energy-blue to-energy-teal',
    tagline: 'Behind-the-meter savings that need no market registration',
    whatItIs:
      'The EV discharges into the site during the monthly peak-demand window so the building never sets a new billing peak. Because commercial tariffs bill demand in $/kW of the highest 15-minute interval, a few well-timed kW of discharge avoid a charge that persists for the whole billing period.',
    howItPays:
      'Value is an avoided cost on the host utility bill rather than a market payment, so it is available immediately, is low-risk, and stacks cleanly under wholesale participation. It requires accurate peak forecasting: a missed window loses the whole month of savings.',
    marketLevel: 'Retail / behind-the-meter',
    timescale: '15-60 minute peak windows, monthly billing cycle',
    metrics: [
      { label: 'Typical driver', value: '$/kW monthly peak', note: 'Commercial and industrial demand tariffs' },
      { label: 'Employer-parking case study', value: 'up to EUR 893/EV/yr', note: 'MAHLE chargeBIG Stuttgart, V2B optimisation' },
      { label: 'Demand-response revenue (SCE)', value: '~$2,200/peak season', note: 'LA AFB fleet, under $100/vehicle/year' },
      { label: 'Best fit', value: 'Sites with high peak-to-average ratio', note: 'Depots, offices, wastewater and municipal facilities' },
    ],
    applications: [
      'Employer and workplace parking where vehicles sit through the site peak',
      'Bus and delivery depots shaving the charging peak they create themselves',
      'Commercial buildings coupling EVs with on-site PV and stationary batteries',
      'Schools and municipal facilities offsetting summer cooling peaks',
    ],
    players: [
      { name: 'Fermata Energy', role: 'V2B platform explicitly monetising demand-charge reduction' },
      { name: 'MAHLE chargeBIG', role: 'Centralised multi-point employer charging with EMS-driven peak control' },
      { name: 'Nuvve', role: 'Depot orchestration combining peak shaving and market bids' },
      { name: 'Utility C&I tariffs (SCE, PG&E, SDG&E)', role: 'Define the demand charges being avoided' },
    ],
    evidence: [
      'Behind-the-meter bill savings are the most immediately accessible VGI value because they require no ISO registration or scheduling coordinator. (Gridworks review, site-level studies)',
      'IEA notes customer-bill optimisation as the entry-level V2G business case, with wholesale services layered on later as aggregation matures. (IEA, Vehicle-to-Grid Technology)',
    ],
    references: [IEA_REF, GRIDWORKS_REF],
  },
  {
    id: 'energy-arbitrage',
    name: 'Energy arbitrage / TOU optimisation',
    icon: 'ArrowUpDown',
    color: 'from-energy-teal to-energy-green',
    tagline: 'Buy cheap, discharge or avoid expensive - the most consumer-visible stream',
    whatItIs:
      'The vehicle charges in low-price hours and either discharges into the site or simply avoids charging during high-price hours. In its managed-charging (V1G) form it is pure load shifting; in its bidirectional form the battery exports at the price spread minus round-trip losses.',
    howItPays:
      'Revenue equals the price spread times the energy moved, minus 80-92% round-trip efficiency and any double taxation of energy that is charged and then discharged. Dynamic and day-ahead hourly tariffs materially increase the addressable spread.',
    marketLevel: 'Retail / behind-the-meter',
    timescale: 'Hours, day-ahead to intraday',
    metrics: [
      { label: 'Residential earnings', value: 'up to GBP 800/yr', note: 'Octopus Powerloop, arbitrage plus grid services' },
      { label: 'Load-shift response', value: '94% off-peak charging', note: 'SDG&E Power Your Drive hourly day-ahead prices vs 80% on EV-TOU, 74% tiered' },
      { label: 'Program scale', value: '238 sites / 932 charge points', note: 'SDG&E PYD as of Sept 2018' },
      { label: 'Efficiency drag', value: '80-92% round trip', note: 'Losses directly erode the price spread' },
    ],
    applications: [
      'Residential V2G on dynamic or TOU tariffs',
      'Day-ahead hourly price signals sent to workplace and public charge points',
      'Depot overnight valley charging with morning export',
      'Retail supplier-managed smart tariffs bundled with a bidirectional charger',
    ],
    players: [
      { name: 'Octopus Energy', role: 'Powerloop residential V2G tariff and aggregation' },
      { name: 'SDG&E', role: 'Power Your Drive hourly day-ahead price pilot' },
      { name: 'Renault / Nissan', role: 'OEMs bundling V2G tariffs with AC bidirectional vehicles' },
      { name: 'The Mobility House', role: 'Price-optimised charge/discharge scheduling' },
    ],
    evidence: [
      'SDG&E rate experiments showed EV drivers learn and respond strongly to on-peak/off-peak price signals, shifting load within and across days. (Gridworks review)',
      'IEA highlights that arbitrage alone is rarely sufficient and is normally stacked with grid services or bill savings. (IEA, Vehicle-to-Grid Technology)',
      'Double taxation of energy charged then discharged destroys arbitrage economics in many jurisdictions. (V2X SOTA / EV_Bid reports)',
    ],
    references: [IEA_REF, GRIDWORKS_REF],
  },
  {
    id: 'capacity-demand-response',
    name: 'Capacity / demand response',
    icon: 'Shield',
    color: 'from-energy-amber to-primary',
    tagline: 'Paid to be available when the system is tight',
    whatItIs:
      'Fleets commit a firm MW of reduction or export for a limited number of called events per season, either through a utility demand-response program or a wholesale capacity market. Payments are largely for availability, with modest energy delivery.',
    howItPays:
      'A $/kW availability payment for the committed capacity, plus per-event energy or performance payments. It is attractive because the number of called hours is small, but non-performance penalties require conservative capacity commitments from mobile assets.',
    marketLevel: 'Distribution utility',
    timescale: 'Called events, typically 2-4 hours, a few dozen hours per year',
    metrics: [
      { label: 'Bid capacity example', value: '100 kW at $10/kW', note: 'Honda / SCE SmartCharge residential DR study' },
      { label: 'Participant incentive', value: '$50 + $50 per 2 months', note: '60 Honda Fit EV drivers following charge schedules' },
      { label: 'Fleet DR revenue', value: '~$2,200/peak season', note: 'LA AFB fleet in SCE territory' },
      { label: 'Availability constraint', value: '14-31% of pack available at peak', note: 'JUMPSmartMaui V2G phase, 5-8pm window' },
    ],
    applications: [
      'Utility residential and commercial demand-response programs enrolling EVs',
      'School-bus fleets offering summer capacity while idle between school years',
      'Wholesale capacity or emergency-reserve participation via an aggregator',
      'Distribution-level non-wires alternatives deferring feeder upgrades',
    ],
    players: [
      { name: 'Southern California Edison', role: 'Demand-response programs enrolling EV fleets and drivers' },
      { name: 'Honda', role: 'SmartCharge residential DR and renewable-acceptance study' },
      { name: 'Highland Electric Fleets', role: 'School-bus subscription model offering summer V2G capacity' },
      { name: 'National Grid / utility programs', role: 'Program design and capacity payments' },
    ],
    evidence: [
      'Vehicle availability is the binding constraint: JUMPSmartMaui found only 14-31% of total pack capacity was dischargeable in the 5-8pm peak, and 6-16% in the early afternoon. (Gridworks review)',
      'US spinning and non-spinning reserve markets were estimated at roughly $200M/yr on 2014 system data, in addition to ~$400M for frequency response. (Gridworks review)',
    ],
    references: [IEA_REF, GRIDWORKS_REF],
  },
  {
    id: 'renewables-integration',
    name: 'Renewables integration / ramping',
    icon: 'Sun',
    color: 'from-accent to-primary',
    tagline: 'Duck-curve mitigation: the largest system-level value pool',
    whatItIs:
      'EVs absorb midday solar over-generation and export during the evening ramp, substituting for grid-scale stationary storage. The value is a system-level avoided cost - deferred storage, curtailment and peaking capacity - rather than a single traded product.',
    howItPays:
      'Today it is monetised indirectly through negative or very low midday prices, curtailment-avoidance schemes and utility programs. Direct products for fast-ramping support are still emerging, which is why this stream is large in modelling but thin in realised revenue.',
    marketLevel: 'Wholesale / ISO',
    timescale: 'Midday absorption and evening ramp, 2-6 hour blocks',
    metrics: [
      { label: 'V1G storage-equivalent value', value: '$1.45-1.75B', note: '1.0 GW of daytime over-generation and evening ramp support (California)' },
      { label: 'Cost of that V1G service', value: '~$150M', note: 'For 1.0 GW, versus building stationary storage' },
      { label: 'With V2G by 2025', value: '$12.8-15.4B equivalent', note: '5.0 GW of power capacity, far above the ~1.3 GW state mandate' },
      { label: 'Duck-curve breakdown', value: 'Valley fill 15 / peak shave 15 / ramp 14-15 ($B)', note: 'V1G+V2G equivalent-battery capital value' },
    ],
    applications: [
      'Midday solar soak-up at workplace and public charging hubs',
      'Evening ramp export from depot fleets in high-solar grids',
      'Island and isolated grids with steep net-load ramps (Maui)',
      'Co-located PV plus bidirectional charging at commercial sites',
    ],
    players: [
      { name: 'Hitachi / NEDO', role: 'JUMPSmartMaui V2H and V2G duck-curve mitigation, Maui virtual power plant' },
      { name: 'California ISO', role: 'Net-load ramping and over-generation context driving the value case' },
      { name: 'Utilities with high solar penetration', role: 'Program hosts for midday absorption tariffs' },
    ],
    evidence: [
      'Modelling for California found V1G-only vehicles can meet the majority of the state storage mandate at far lower cost, and V2G-capable fleets can outpace stationary storage entirely. (Gridworks review)',
      'The study assumed $500/kWh stationary storage, so the headline values are somewhat overstated at current battery prices. (Gridworks review)',
      'JUMPSmartMaui showed significant ability to shift EV charging load out of the 5-8pm peak into early-morning hours. (Gridworks review)',
    ],
    references: [IEA_REF, GRIDWORKS_REF],
  },
  {
    id: 'backup-resilience',
    name: 'V2H / V2B backup and resilience',
    icon: 'Home',
    color: 'from-energy-green to-energy-teal',
    tagline: 'High willingness-to-pay, hard to monetise as a market product',
    whatItIs:
      'The vehicle powers a home or building during an outage, running in islanded mode behind a transfer switch. The value is avoided outage cost and continuity of critical loads, which customers value highly but which no wholesale market pays for.',
    howItPays:
      'Monetised through hardware and subscription pricing, resilience incentives and utility storage rebates rather than energy revenue. It competes directly with stationary home batteries, and it constrains other streams because a reserve state of charge must be held back.',
    marketLevel: 'Customer resilience',
    timescale: 'Hours to days, event driven',
    metrics: [
      { label: 'Phase 2 V2G households', value: '80 households', note: 'JUMPSmartMaui, Hitachi bidirectional chargers, IEEE 2030.5/SEP 2.0 control' },
      { label: 'Residential program share', value: '200 households in V1G', note: 'Level 2 managed charging on Maui' },
      { label: 'Reserve trade-off', value: 'SoC held back for outages', note: 'Directly reduces capacity available for market bids' },
      { label: 'Interoperability barrier', value: 'Proprietary residential ecosystems', note: 'Vehicle-locked chargers, Massachusetts V2X program' },
    ],
    applications: [
      'Residential backup during storms and wildfire-related shutoffs',
      'Critical-load panels in affordable-housing and community facilities',
      'Microgrids and community resilience hubs in islanded operation',
      'Commercial buildings maintaining critical loads during outages',
    ],
    players: [
      { name: 'Nissan / CHAdeMO ecosystem', role: 'Longest-running V2H deployments' },
      { name: 'Hitachi', role: 'Residential bidirectional chargers with IEEE 2030.5 control' },
      { name: 'Fermata Energy', role: 'Certified bidirectional hardware for buildings and critical loads' },
      { name: 'Ford / Sunrun', role: 'Home integration packaging of vehicle backup power' },
    ],
    evidence: [
      'Resilience value is real but not traded: it appears in customer willingness-to-pay and utility incentive design, not in ISO revenue stacks. (IEA, Vehicle-to-Grid Technology)',
      'Massachusetts V2X demonstration found commercial and school-bus segments interoperable via open protocols, while residential was hampered by proprietary ecosystems. (V2X SOTA report)',
    ],
    references: [IEA_REF, GRIDWORKS_REF],
  },
];

export const revenueStackingNote =
  'These are the value streams identified in the IEA and Gridworks reviews. No share-of-revenue split is shown: neither reference publishes a verifiable breakdown, and realised value is highly site- and market-specific, depending on fleet size, tariff design and market access costs.';
