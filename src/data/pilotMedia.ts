// Additional images and detailed gap explanations per pilot (matched by lowercase name)

export interface PilotReference {
  title: string;
  url: string;
  source?: string;
  date?: string;
}

export interface PilotBusinessModel {
  type: string;
  description: string;
}

export interface PilotStandardization {
  standard: string;
  status: string;
}

export interface PilotTechCategoryItem {
  name: string;
  details: string[];
}

export interface PilotTechnology {
  overview: string;
  hardware: PilotTechCategoryItem[];
  software: PilotTechCategoryItem[];
}

export interface PilotTimelineItem {
  phase: string;
  year: string;
  description: string;
}

export interface PilotMedia {
  images?: { url: string; caption?: string; credit?: string }[];
  gapExplanations?: Record<string, string>;
  references?: PilotReference[];
  businessModel?: PilotBusinessModel;
  standardization?: PilotStandardization;
  technology?: PilotTechnology;
  timeline?: PilotTimelineItem[];
  partnerLead?: string;
}



// Generic explanations reused across pilots when a specific one isn't provided
export const GENERIC_GAP_EXPLANATIONS: Record<string, string> = {
  'redispatch 3.0':
    'Integrating small consumer flexibility (household EVs, HEMS) into the German TSO Redispatch 3.0 process - today built for large generators - requires new signalling, forecasting and settlement rules between DSOs, TSOs and aggregators.',
  'eebus interoperability':
    'EEBUS is the German home-energy protocol used to coordinate EV, HEMS, heat pumps and PV. Real-world interoperability between OEM wallboxes/vehicles and third-party HEMS is still inconsistent, blocking multi-vendor V2H/V2G deployments.',
  'metering':
    'Sub-metering the bidirectional flow of a single connection point (import vs. export from the EV, from the PV, from the household) is not yet standardised for billing and grid-service settlement.',
  'allocation':
    'Assigning the economic value of a kWh discharged to the grid across owner, aggregator, DSO and TSO is unresolved - no agreed allocation key exists in most markets.',
  'tso-dso signalling':
    'Coordination of activation signals between transmission (TSO) and distribution (DSO) operators for behind-the-meter flexibility is immature; conflicts between local congestion and system-wide balancing are common.',
  'cold-climate validation':
    'Battery efficiency, thermal management losses and cable ratings degrade significantly below -10 °C. Few pilots have validated round-trip efficiency and cycle life for V2G/V2H in sustained cold-climate operation.',
  'warranty':
    'OEM battery warranties often exclude or cap V2G cycling. Without clear warranty frameworks tied to measured degradation, fleet operators cannot underwrite V2G revenue.',
  'cybersecurity':
    'A bidirectional charger is a controllable grid asset. IEC 62443 / IEEE 1547.3 compliance, secure firmware update, and OCPP 2.0.1 security profiles are inconsistently implemented across vendors.',
  'standards':
    'ISO 15118-20 (bidirectional AC/DC), IEC 61851-28 and IEEE 2030.5 are still being finalised or unevenly adopted. Interoperability certification programmes are only starting.',
  'business model':
    'Revenue stacking (energy arbitrage + FCR + capacity + self-consumption) is technically possible but rarely allowed in one regulatory envelope; pilots typically monetize only one stream.',
  'permitting':
    'Distribution grid connection approval for bidirectional assets often follows the same slow process as PV or storage, adding 6–18 months per site.',
  'user acceptance':
    'Owners are wary of battery wear, availability at departure time, and unclear compensation. UX for opt-in/opt-out and guaranteed state-of-charge is still being iterated.',
};

export const pilotMediaMap: Record<string, PilotMedia> = {
  'bdl next': {
    images: [
      {
        url: '/__l5e/assets-v1/910e578b-8e35-4efd-a97e-31a646a157c6/bdl-next-bmw-ix3.jpg',
        caption: 'BMW iX3 handover at BMW Welt, Munich - pilot launch May 2026',
        credit: 'E.ON / BMW',
      },
      {
        url: '/__l5e/assets-v1/1d5ba294-cc6f-4f54-b6c5-e87c089f10a5/bdl-next-household.jpg',
        caption: 'Household participant: BMW iX3 + wallbox + rooftop PV - bidirectional home setup',
        credit: 'Illustrative',
      },
      {
        url: '/__l5e/assets-v1/417e4559-0791-45a2-a83c-29bbf7493b17/bdl-next-eon-charging.jpg',
        caption: 'Bidirectional AC charging test bench - E.ON TestingLab',
        credit: 'E.ON via Vision Mobility',
      },
    ],
    references: [
      {
        title: 'More flexibility for the energy system - BDL Next launch',
        url: 'https://www.eon.com/en/about-us/media/press-release/2026/more-flexibility-for-the-energy-system.html',
        source: 'E.ON press release',
        date: 'May 2026',
      },
      {
        title: 'E.ON accelerates bidirectional charging',
        url: 'https://vision-mobility.de/en/news/e-on-accelerates-bidirectional-charging-391770.html',
        source: 'Vision Mobility',
      },
      {
        title: 'Bidirektional laden - VDE Dialog',
        url: 'https://dialog.vde.com/en/vde-dialog-editions/2025-03-vde-weltweit/2025-03-bidirektional-laden',
        source: 'VDE Dialog',
        date: '2025',
      },
      {
        title: 'E.ON wants to put bidirectional charging on a broad footing',
        url: 'https://www.bayern-innovativ.de/en/emagazine/detail/eon-wants-to-put-bidirectional-charging-on-a-broad-footing',
        source: 'Bayern Innovativ',
      },
      {
        title: 'Electric cars as batteries',
        url: 'https://building-technologies.messefrankfurt.com/frankfurt/en/media-library/specialized-articles/electric-cars-as-batteries.html',
        source: 'Messe Frankfurt - Building Technologies',
      },
      {
        title: 'Introducing bidirectional charging in the European energy system - LCA',
        url: 'https://www.ffe.de/en/publications/introducing-bidirectional-charging-in-the-european-energy-system-a-life-cycle-analysis/',
        source: 'FfE (Forschungsstelle für Energiewirtschaft)',
      },
      {
        title: 'Polestar and Clever test bidirectional charging',
        url: 'https://www.electrive.com/2026/06/01/polestar-and-clever-test-bidirectional-charging/',
        source: 'electrive.com',
        date: 'Jun 2026',
      },
    ],
    gapExplanations: {
      'Redispatch 3.0':
        'BDL Next is the first field trial that connects 20 household EVs into the TenneT/Bayernwerk Redispatch 3.0 process. The regulatory framework only covers >100 kW assets today - the pilot has to invent aggregation, forecasting and settlement rules for <11 kW distributed flexibility.',
      'EEBUS interoperability':
        'The stack couples BMW iX3, Compleo wallboxes, KEO gateways and third-party HEMS over EEBUS. Real-world tests are surfacing gaps in the SPINE data model for bidirectional use-cases, especially target-SoC and grid-service priority conflicts.',
      'Metering / allocation':
        'A single household grid connection now carries import, export from PV, and export from the EV. Splitting these flows for tax, EEG levy and grid-service payment requires a new metering concept that Bayernwerk and the BMWE are co-developing.',
      'TSO–DSO–household signalling':
        'Activation signals travel TenneT → Bayernwerk Netz → aggregator → HEMS → wallbox → vehicle in <15 min. The pilot is measuring end-to-end latency and failure modes of this chain.',
    },
    businessModel: {
      type: 'Aggregated household flexibility',
      description:
        'Residential. Revenue stacks self-consumption (PV + EV), dynamic tariff arbitrage and Redispatch 3.0 payments to household participants via E.ON as aggregator.',
    },
    standardization: {
      standard: 'ISO 15118-20 + EEBUS / SPINE',
      status: 'Under active validation. First real-world test of ISO 15118-20 bidirectional AC and EEBUS SPINE bidirectional profiles at household scale.',
    },
    technology: {
      overview: 'Distributed AC bidirectional home architecture',
      hardware: [
        { name: 'BMW iX3 50 xDrive', details: ['Bidirectional AC (ISO 15118-20)', '11 kW charge / discharge', 'Native V2H + V2G firmware'] },
        { name: 'Compleo Wallbox + KEO Gateway', details: ['AC bidirectional, up to 11 kW', 'EEBUS/SPINE endpoint', 'Sub-metering per flow'] },
      ],
      software: [
        { name: 'HEMS + Aggregator Platform', details: ['E.ON aggregator cloud', 'Third-party HEMS via EEBUS', 'Target-SoC and departure control'] },
        { name: 'Grid Signalling Stack', details: ['TenneT Redispatch 3.0 API', 'Bayernwerk DSO congestion signals', 'Sub-15 min activation chain'] },
      ],
    },
    timeline: [
      { phase: 'R&D Kickoff', year: '2023', description: 'BDL Next consortium formed under BMWE funding, FfE as scientific lead.' },
      { phase: 'Lab Validation', year: '2024–2025', description: 'Interoperability testing at E.ON TestingLab: BMW iX3, Compleo, KEO, HEMS.' },
      { phase: 'Field Pilot Launch', year: 'May 2026', description: '20 households onboarded at BMW Welt Munich with bidirectional wallboxes.' },
      { phase: 'Redispatch 3.0 Validation', year: '2026–2027', description: 'End-to-end TSO/DSO activation of household V2G for congestion management.' },
    ],
    partnerLead: 'E.ON, BMW, Bayernwerk Netz, TenneT, FfE',
  },
};


export function getPilotMedia(name?: string | null): PilotMedia | null {
  if (!name) return null;
  const key = name.toLowerCase().trim();
  return pilotMediaMap[key] || null;
}

export function explainGap(category: string, pilotSpecific?: Record<string, string>): string | null {
  if (pilotSpecific && pilotSpecific[category]) return pilotSpecific[category];
  const lower = category.toLowerCase();
  for (const k of Object.keys(GENERIC_GAP_EXPLANATIONS)) {
    if (lower.includes(k)) return GENERIC_GAP_EXPLANATIONS[k];
  }
  return null;
}
