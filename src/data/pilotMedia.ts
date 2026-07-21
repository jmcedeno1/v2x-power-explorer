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
  'tepco v2g aggregator': {
    images: [
      {
        url: '/__l5e/assets-v1/d1f0eb13-5a02-4d08-a5f1-2e7e597a777e/tepco-v2g-leaf.jpg',
        caption: 'Nissan LEAF connected to a CHAdeMO bidirectional DC charger in the Tokyo service area',
        credit: 'Illustrative / TEPCO',
      },
      {
        url: '/__l5e/assets-v1/6f587b4f-2685-4e7f-8174-e3d7555ddbe9/tepco-control-room.jpg',
        caption: 'TEPCO aggregator control room dispatching V2G flexibility across 63 chargers',
        credit: 'Illustrative / TEPCO',
      },
    ],
    references: [
      {
        title: 'Commencement of V2G aggregator business',
        url: 'https://www.tepco.co.jp/en/hd/newsroom/press/archives/2019/commencement-of-v2g.html',
        source: 'TEPCO Holdings press release',
        date: 'Apr 2019',
      },
      {
        title: 'TEPCO V2G project overview (PDF)',
        url: 'https://www.tepco.co.jp/en/wp-content/uploads/1a6e08e849ea53ba28a5f1a20dcbf9ae.pdf',
        source: 'TEPCO Holdings',
      },
      {
        title: 'Global V2X and TEPCO challenge for carbon neutrality (Imazu)',
        url: 'https://www.chademo.com/wp2021/wp-content/uploads/2022/10/Global%20V2X%20and%20TEPCO%20challenge%20for%20CN%20imazu.pdf',
        source: 'CHAdeMO Association',
        date: '2022',
      },
      {
        title: 'CHAdeMO V2X at COP26 (PDF)',
        url: 'https://www.copjapan.go.jp/cop/cop26/assets/pdf/chademo.pdf',
        source: 'CHAdeMO / COP Japan',
        date: '2021',
      },
      {
        title: 'Mitsubishi Motors joins TEPCO V2G demonstration',
        url: 'https://www.mitsubishi-motors.com/en/newsroom/newsrelease/2018/20180606_1.html',
        source: 'Mitsubishi Motors press release',
        date: 'Jun 2018',
      },
      {
        title: 'TEPCO demand-side technologies (EMAK12)',
        url: 'https://energyefficiencyhub.org/wp-content/uploads/2024/01/EMAK12-TEPCO-Demand-Side-Technologies-of-Electric-Power-Company.pdf',
        source: 'IEA Energy Efficiency Hub',
        date: '2024',
      },
      {
        title: 'V2G business models',
        url: 'https://emabler.com/resource/v2g-business-models',
        source: 'eMabler',
      },
      {
        title: 'Vehicle-to-Grid (V2G) technology in Japan',
        url: 'https://linchpin-consulting.com/vehicle-to-grid-v2g-technology-in-japan-turning-ev-fleets-into-distributed-energy-assets/',
        source: 'Linchpin Consulting',
      },
    ],
    gapExplanations: {
      'Standards':
        'The pilot runs entirely on CHAdeMO bidirectional DC, which is dominant in Japan but has limited traction in Europe and North America where CCS and ISO 15118-20 are winning. Scaling the TEPCO model abroad requires cross-standard translation or dual-protocol hardware.',
      'Business model':
        'Japan\'s balancing and capacity markets only opened to aggregators progressively from 2021. Stacking JEPX arbitrage + frequency regulation + demand response in a single contract is still being formalised; today most revenue comes from one stream at a time.',
      'Metering':
        'Behind-the-meter measurement of import vs. V2G export at commercial sites relies on retrofitted sub-meters. A standardised billing meter for bidirectional flows is not yet mandated by METI.',
      'TSO-DSO signalling':
        'TEPCO Power Grid (TSO-like) and TEPCO Energy Partner (retailer/aggregator) coordinate internally, but external DSO/TSO signalling APIs for third-party V2G aggregators are still being defined under Japan\'s new balancing market rules.',
      'User acceptance':
        'Owners of Nissan LEAF and Mitsubishi Outlander PHEV report concerns about battery cycling under CHAdeMO V2G. TEPCO caps discharge depth and offers tariff incentives, but broader consumer roll-out needs clearer warranty coverage from OEMs.',
    },
    businessModel: {
      type: 'Utility-led V2G aggregator',
      description:
        'Commercial and residential mix. TEPCO Energy Partner stacks JEPX energy arbitrage, TSO balancing/frequency regulation, and C&I peak-shaving. Vehicle owners are compensated via reduced tariffs and per-kWh discharge payments.',
    },
    standardization: {
      standard: 'CHAdeMO 2.0 bidirectional DC',
      status: 'Commercially deployed since 2019. Reference implementation for CHAdeMO V2G globally; feeds into METI 2030 balancing market design.',
    },
    technology: {
      overview: 'Centralised DC bidirectional aggregator across 5 Tokyo sites',
      hardware: [
        { name: 'Nissan LEAF + Mitsubishi Outlander PHEV', details: ['CHAdeMO bidirectional DC', 'Native V2G/V2H firmware', 'Fleet of 59 vehicles'] },
        { name: '63 CHAdeMO Bidirectional Chargers', details: ['10-20 kW DC per charger', '~630 kW aggregated', '5 sites in Tokyo area'] },
      ],
      software: [
        { name: 'TEPCO Aggregator Platform', details: ['Sub-second dispatch to chargers', 'JEPX + balancing market bidding', 'Revenue-stacking optimiser'] },
        { name: 'CHAdeMO V2G Protocol', details: ['CHAdeMO 2.0 bidirectional', 'Nissan/Mitsubishi vehicle integration', 'OCPP-style site controller'] },
      ],
    },
    timeline: [
      { phase: 'Nuvve / Nissan demo', year: '2017-2018', description: 'Early CHAdeMO V2G demonstrations with Nissan LEAF at TEPCO facilities.' },
      { phase: 'Mitsubishi partnership', year: 'Jun 2018', description: 'Mitsubishi Motors joins the TEPCO V2G demonstration with Outlander PHEV.' },
      { phase: 'Commercial launch', year: 'Apr 2019', description: 'Japan\'s first commercial V2G aggregator service begins under TEPCO Energy Partner.' },
      { phase: 'Fleet expansion', year: '2022', description: '59 vehicles / 63 chargers across 5 sites providing ~630 kW aggregated flexibility.' },
      { phase: 'Balancing market integration', year: '2024-2030', description: 'Full integration into Japan\'s new capacity and balancing markets under METI framework.' },
    ],
    partnerLead: 'TEPCO Holdings, TEPCO Energy Partner, Nissan, Mitsubishi Motors, Nuvve, CHAdeMO Association',
  },
  'v2x cluster (horizon europe)': {
    references: [
      { title: 'Get to know the V2X cluster', url: 'https://scale-horizon.eu/get-to-know-the-v2x-cluster/', source: 'SCALE (Horizon Europe)', date: 'Sep 2025' },
      { title: 'EV4EU - V2X cluster page', url: 'https://ev4eu.eu/v2xcluster/', source: 'EV4EU' },
      { title: 'AHEAD - Horizon Europe project', url: 'https://horizon-ahead.eu/', source: 'AHEAD' },
      { title: 'XL-Connect: new European project', url: 'https://www.e-redes.pt/en/news/2022/10/13/xl-connect-new-european-project', source: 'E-Redes press release', date: 'Oct 2022' },
      { title: 'XL-Connect - V2X cluster news', url: 'https://xlconnect.eu/category/v2xcluster/', source: 'XL-Connect' },
      { title: 'Ricardo - engineering and consultancy', url: 'https://www.ricardo.com/', source: 'Ricardo plc (XL-Connect coordinator)' },
    ],
    gapExplanations: {
      'Standards':
        'The eight cluster projects deliberately test overlapping standards (ISO 15118-20, OCPP 2.0.1, IEEE 2030.5, IEC 61851-28, EEBUS) to identify interoperability gaps. Cross-demo test protocols are being co-developed but no single European conformance certification exists yet.',
      'TSO-DSO signalling':
        'Each demo country (PT, DE, NL, DK, SI, GR, IT, CZ, IE) has a different TSO-DSO coordination model for behind-the-meter flexibility. The cluster is producing a comparative gap analysis feeding into ENTSO-E and CEER work on grid-code alignment.',
      'Business model':
        'Revenue stacking (arbitrage + FCR/aFRR + capacity + self-consumption) is tested in isolation by different demos but no single regulatory envelope in the EU allows all streams simultaneously; joint policy recommendation is a core cluster deliverable.',
      'Cybersecurity':
        'IEC 62443 and ISO/SAE 21434 compliance for bidirectional chargers and aggregator platforms is uneven across OEMs. The cluster is defining a shared cybersecurity baseline and shared threat model.',
      'Interoperability':
        'XL-Connect specifically targets multi-standard integration; early tests show significant vendor-specific behaviour in ISO 15118-20 bidirectional AC and DC implementations across BMW, Renault, Stellantis, Nissan and Kia vehicles.',
      'User acceptance':
        'EV4EU and FLOW run parallel user studies on opt-in/opt-out UX, guaranteed state-of-charge and battery-warranty concerns. Findings will feed a joint EU communication and consumer-protection framework.',
      'Metering':
        'Sub-metering of import vs. export from EV, PV and household at a single grid connection point is not harmonised across member states; the cluster is preparing a proposal to DG ENER on a common metering concept.',
      'Allocation':
        'No agreed allocation key for the value of an exported kWh between owner, aggregator, DSO and TSO. Cluster projects are trialling different splits and will compare results.',
    },
    businessModel: {
      type: 'EU-funded R&I cluster',
      description:
        'Eight Horizon Europe projects (XL-Connect, SCALE, EV4EU, FLOW, Drive2X, AHEAD, ePowerMove, Neverflat) with ~EUR 80-90M combined public funding, 150+ partners across 15+ member states. Non-commercial R&I; outputs feed regulators (DG ENER, CEER, ENTSO-E), TSOs, DSOs and OEMs.',
    },
    standardization: {
      standard: 'ISO 15118-20, OCPP 2.0.1, IEEE 2030.5, IEC 61851-28, EEBUS',
      status: 'Cross-demo test protocols in development. Cluster targets a harmonised European conformance / certification approach for bidirectional charging by 2027.',
    },
    technology: {
      overview: 'Multi-project pan-European bidirectional charging framework',
      hardware: [
        { name: 'Bidirectional AC/DC chargers', details: ['3.7-50 kW AC and up to 150 kW DC', 'Vendors: Wallbox, Enel X, Ricardo, ABB, EVBox', 'ISO 15118-20 + OCPP 2.0.1'] },
        { name: 'EV fleet (~500 vehicles)', details: ['Renault, Stellantis, Nissan, Kia, Volvo', 'Mix of CCS bidirectional and CHAdeMO', 'Household, corporate and municipal fleets'] },
      ],
      software: [
        { name: 'Aggregator + HEMS platforms', details: ['e-Redes, EDP, Iberdrola, Enel X', 'Cross-project data exchange schema', 'AHEAD AI dispatch layer'] },
        { name: 'TSO-DSO signalling stack', details: ['TenneT, EirGrid, REN, Terna interfaces', 'Local flex-market pilots', 'Redispatch and congestion signals'] },
      ],
    },
    timeline: [
      { phase: 'XL-Connect launch', year: 'Oct 2022', description: 'XL-Connect kicks off under Horizon Europe, coordinated by Ricardo with e-Redes as demo host.' },
      { phase: 'SCALE, EV4EU, FLOW launch', year: '2022-2023', description: 'First wave of sister projects starts field demonstrators across PT, DK, NL, SI, IT, IE, CZ, GR.' },
      { phase: 'Drive2X, AHEAD, ePowerMove, Neverflat', year: '2023-2024', description: 'Second wave joins, adding scale-up demos, AI orchestration, high-power charging and battery resilience.' },
      { phase: 'V2X Cluster formalised', year: 'Sep 2025', description: 'Eight projects publicly consolidate as the V2X Cluster with joint dissemination and policy roadmap.' },
      { phase: 'Joint policy recommendations', year: '2026', description: 'Shared deliverables on metering, revenue stacking, cybersecurity and TSO-DSO coordination to DG ENER, CEER, ENTSO-E.' },
      { phase: 'Cluster completion', year: '2027', description: 'Final demonstrators close; harmonised European V2X interoperability and certification framework proposed.' },
    ],
    partnerLead: 'Ricardo, e-Redes, EDP, Enel X, Iberdrola, TenneT, RWTH Aachen, TU Delft, DTU, IST, ElaadNL, Renault, Stellantis, Nissan, EirGrid',
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
