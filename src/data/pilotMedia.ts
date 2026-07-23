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
  'redispatch v2g (tennet, nissan, the mobility house)': {
    references: [
      { title: 'V2G Redispatch - TenneT / Nissan / The Mobility House', url: 'https://www.v2g-hub.com/projects/v2g-redispatch-tennet-nissan-the-mobility-house-nissan/', source: 'V2G Hub' },
      { title: 'TenneT, The Mobility House and Nissan start V2G project', url: 'https://www.electrive.com/2018/03/13/tennet-the-mobility-house-nissan-start-v2g-project/', source: 'electrive', date: 'Mar 2018' },
      { title: 'Nissan, TenneT and The Mobility House: electric cars save surplus wind energy and reduce CO2', url: 'https://europe.nissannews.com/en-GB/releases/nissan-tennet-and-the-mobility-house-electric-cars-save-surplus-wind-energy-and-reduce-co2', source: 'Nissan Europe press release' },
      { title: 'Vehicle-to-Grid - The Mobility House', url: 'https://www.mobilityhouse.com/int_en/vehicle-to-grid', source: 'The Mobility House' },
      { title: 'VGI projects of The Mobility House', url: 'https://mobilityhouse-energy.com/int_en/knowledge-center/article/vgi-projects-of-the-mobility-house', source: 'The Mobility House - Knowledge Center' },
      { title: 'V2G control for TSO redispatch (research article)', url: 'https://ietresearch.onlinelibrary.wiley.com/doi/10.1049/gtd2.13066', source: 'IET Generation, Transmission & Distribution' },
      { title: 'Energy Sharing Opportunities V2B & V2G (Walgama, 2025)', url: 'https://sustain.ubc.ca/sites/default/files/2025-022_Energy%20Sharing%20Opportunities%20V2B%20&%20V2G_Walgama.pdf', source: 'UBC Sustainability' },
    ],
    gapExplanations: {
      'Standards':
        'The pilot ran exclusively on CHAdeMO bidirectional chargers - at the time the only production V2G-capable standard. ISO 15118-20 was not yet available and CCS bidirectional was still a concept, limiting the fleet to Nissan LEAF vehicles.',
      'TSO-DSO signalling':
        'Activating distributed EVs for TSO-level redispatch required custom signalling between TenneT (TSO), the DSOs hosting the chargers, and The Mobility House aggregator. No standard interface existed; the pilot built a bespoke chain that later informed Redispatch 3.0 design.',
      'Business model':
        'German regulation in 2018-2021 did not allow a small distributed asset to be paid as a redispatch resource. Compensation was demonstrated via a blockchain-based settlement layer but required a regulatory sandbox - not a repeatable commercial framework.',
      'Warranty':
        'Nissan LEAF batteries used for repeated V2G cycling raised warranty questions. The project produced early evidence that controlled V2G cycling did not materially accelerate degradation, feeding Nissan\'s later official V2G warranty policy.',
      'Metering':
        'Sub-metering the redispatch-relevant kWh at each vehicle - separate from household consumption - required dedicated meters at each charger and a data pipeline back to TenneT.',
      'Allocation':
        'How to split the value of a redispatch-serving kWh between vehicle owner, aggregator and TSO was resolved contractually in the pilot but never codified into German market rules.',
    },
    businessModel: {
      type: 'TSO-led redispatch demonstrator',
      description:
        'TenneT (German/Dutch TSO) contracts The Mobility House as aggregator of a Nissan LEAF fleet. EV owners are compensated for making their bidirectional charger available; TenneT uses the aggregated asset to substitute for conventional redispatch dispatch, targeting a share of its ~EUR 1B/year redispatch cost.',
    },
    standardization: {
      standard: 'CHAdeMO bidirectional, blockchain-based settlement (IBM Hyperledger)',
      status: 'Regulatory sandbox under BNetzA. Findings fed into the design of Redispatch 3.0 and the German aggregator framework.',
    },
    technology: {
      overview: 'TSO-orchestrated V2G aggregation using bidirectional Nissan LEAF fleet across northern and southern Germany',
      hardware: [
        { name: 'Nissan LEAF fleet', details: ['~20 vehicles, CHAdeMO bidirectional', '40-62 kWh battery packs', 'Northern (wind) and southern (load) sites'] },
        { name: 'Bidirectional CHAdeMO chargers', details: ['~10 kW per unit, DC bidirectional', 'Aggregate flexibility ~100 kW', 'Located at homes and depot sites'] },
      ],
      software: [
        { name: 'The Mobility House aggregator platform', details: ['Real-time dispatch of EV fleet', 'Interface to TenneT redispatch signals', 'Vehicle SOC forecasting and constraint management'] },
        { name: 'IBM blockchain settlement layer', details: ['Per-kWh transaction ledger', 'Automated payments to vehicle owners', 'Auditable proof of redispatch service delivery'] },
      ],
    },
    timeline: [
      { phase: 'Project launch', year: 'Mar 2018', description: 'TenneT, Nissan and The Mobility House publicly announce the joint V2G redispatch pilot at Hannover Messe.' },
      { phase: 'Fleet deployment', year: '2018-2019', description: 'Nissan LEAF vehicles and CHAdeMO bidirectional chargers commissioned at sites in northern and southern Germany.' },
      { phase: 'Operational demonstration', year: '2019-2021', description: 'TenneT dispatches the aggregated fleet to absorb surplus wind and support southern loads; blockchain settles transactions per kWh.' },
      { phase: 'Project completion', year: '2021', description: 'Findings fed into BNetzA regulatory work and into TenneT\'s Redispatch 3.0 framework for <100 kW distributed flexibility.' },
      { phase: 'Legacy', year: '2022+', description: 'Aggregator platform re-used in BDL Next and other successor projects; cited as a foundational V2G-for-TSO reference case.' },
    ],
    partnerLead: 'TenneT (TSO), Nissan (OEM), The Mobility House (aggregator), IBM (blockchain settlement)',
  },
  'project sciurus': {
    references: [
      { title: 'Sciurus - project page', url: 'https://www.cenex.co.uk/projects-case-studies/sciurus/', source: 'Cenex' },
      { title: 'OVO Energy V2G Project Sciurus', url: 'https://www.v2g-hub.com/projects/ovo-energy-v2g-project-sciurus/', source: 'V2G Hub' },
      { title: 'Sciurus V2G trial - A. Ireland presentation (PDF)', url: 'https://www.chademo.com/wp2016/wp-content/uploads/2021/07/A._Ireland_V2G.pdf', source: 'CHAdeMO Association', date: '2021' },
      { title: 'Sciurus - UKRI Gateway to Research', url: 'https://gtr.ukri.org/projects?ref=104248', source: 'UKRI / Innovate UK' },
      { title: 'Project Sciurus - video overview', url: 'https://www.youtube.com/watch?v=hXaLCf4TcVM', source: 'YouTube' },
      { title: 'Project Sciurus - trial report', url: 'https://www.scribd.com/document/702149344/PROJECT-SCIURUS', source: 'Scribd (OVO/Cenex report)' },
    ],
    gapExplanations: {
      'Â£3,700 hardware premium':
        'The Indra V2G unit cost around £3,700 more than a comparable unidirectional home charger at deployment. Without subsidy, payback on customer revenue alone (~£420/year average) exceeded 8 years - a key barrier to unsubsidised residential V2G roll-out.',
      '£3,700 hardware premium':
        'The Indra V2G unit cost around £3,700 more than a comparable unidirectional home charger at deployment. Without subsidy, payback on customer revenue alone (~£420/year average) exceeded 8 years - a key barrier to unsubsidised residential V2G roll-out.',
      'G98/G99 certification bureaucracy':
        'Every V2G install required Distribution Network Operator (DNO) approval under G98/G99 export rules. In practice this added weeks of paperwork per site and blocked some three-phase / high-import households entirely - a process designed for solar PV, not consumer EV chargers.',
      'Warranty':
        'Nissan LEAF batteries were covered for capacity loss but not explicitly for V2G cycling. Cenex battery-health analysis found no accelerated degradation, but the absence of an OEM warranty statement remained a commercial blocker for scaling.',
      'Standards':
        'Sciurus ran on CHAdeMO bidirectional DC. The UK and EU market has since shifted toward CCS + ISO 15118-20, so hardware from the trial is not directly reusable for new CCS-only vehicles - a stranded-asset risk flagged in the final report.',
      'User acceptance':
        'Customer research showed strong appetite for automated V2G once minimum state-of-charge and departure guarantees were in place. Drop-out was low, but onboarding UX (installer visit + app + tariff switch) took ~4 weeks and needs simplification for mass market.',
    },
    businessModel: {
      type: 'Residential V2G aggregator',
      description:
        'Fully residential. OVO/Kaluza aggregated 320+ home chargers to offer flexibility to National Grid ESO (balancing, frequency response) and optimise against wholesale prices. Customers were paid via bill credits: ~£420/year average, up to £725/year for high-availability users.',
    },
    standardization: {
      standard: 'CHAdeMO bidirectional DC + G98/G99',
      status: 'Full compliance. Delivered evidence base for Ofgem/BEIS smart-tariff and G98/G99 treatment of bidirectional home chargers; input to UK Smart Systems and Flexibility Plan.',
    },
    technology: {
      overview: 'Distributed residential DC V2G under a single aggregator platform',
      hardware: [
        { name: 'Indra V2G Charger', details: ['6 kW bidirectional DC', 'CHAdeMO V2G connector', 'G98/G99 certified'] },
        { name: 'Nissan LEAF / e-NV200', details: ['CHAdeMO bidirectional', '24-62 kWh battery', '320+ vehicles across GB'] },
      ],
      software: [
        { name: 'Kaluza Platform', details: ['Cloud dispatch of every charger', 'Day-ahead + imbalance optimisation', 'Customer app with min-SoC guarantee'] },
        { name: 'Grid Services Interface', details: ['National Grid ESO balancing', 'Firm Frequency Response (FFR)', 'DNO export management'] },
      ],
    },
    timeline: [
      { phase: 'Project award', year: '2018', description: 'OZEV / Innovate UK £9.8M grant; consortium formed with OVO, Cenex, Indra, Nissan.' },
      { phase: 'Charger rollout', year: '2018-2020', description: '320+ Indra V2G units installed in customer homes across GB.' },
      { phase: 'Operational trial', year: '2019-2021', description: 'Kaluza dispatches fleet for grid services; battery-health monitoring by Cenex.' },
      { phase: 'Final report', year: '2021', description: 'Published customer savings (~£420/yr avg, up to £725), no accelerated battery degradation, £3,700 hardware premium as key barrier.' },
      { phase: 'Legacy', year: '2022+', description: 'Findings feed OVO/Kaluza commercial V2G offer and UK smart-tariff / G98-G99 policy evolution.' },
    ],
    partnerLead: 'OVO Energy, Kaluza, Cenex, Indra, Nissan, National Grid ESO, Western Power Distribution, OZEV, Innovate UK',
  },
  'parker project': {
    references: [
      { title: 'Parker Denmark - project page', url: 'https://www.v2g-hub.com/projects/parker-denmark/', source: 'V2G Hub' },
      { title: 'The Parker Project - Final Report', url: 'https://orbit.dtu.dk/en/publications/the-parker-project-final-report/', source: 'DTU Orbit', date: '2018' },
      { title: 'Vehicle-to-Grid (V2G) pilots overview', url: 'https://m2mserver.com/en/vehicle-to-grid-v2g-pilots/', source: 'M2M Server' },
      { title: 'Parker - project page', url: 'https://www.v2g-hub.com/projects/parker/', source: 'V2G Hub' },
      { title: 'The Parker Project: cross-brand service testing of V2G', url: 'https://www.mdpi.com/2032-6653/10/4/66', source: 'MDPI - World Electric Vehicle Journal', date: '2019' },
    ],
    gapExplanations: {
      'Cross-OEM interoperability':
        'Parker deliberately mixed Nissan, Mitsubishi and PSA vehicles on the same Enel X CHAdeMO chargers to verify that V2G behaviour (SoC reporting, dispatch response, safe shutdown) was consistent across brands. Divergent OEM implementations of CHAdeMO 2.0 required per-vehicle tuning - a barrier the project formalised via the "Grid Integrated Vehicle" (GIV) rating framework.',
      'FCR-N market rules':
        'Parker qualified as a real market participant in the Nordic FCR-N (symmetric primary reserve) product. Bidding EV fleets into a market designed for large generators required minimum-bid aggregation, 4-hour blocks and 100% availability guarantees - resolved commercially by Nuvve\'s aggregator platform.',
      'Battery degradation':
        'DTU\'s measurement campaign over the trial found no measurable accelerated capacity fade attributable to V2G cycling under FCR-N duty. This became a widely-cited evidence point unlocking OEM comfort with bidirectional use.',
      'Standards':
        'Deployed on CHAdeMO 2.0 bidirectional DC. Lessons on symmetric power flow, protection and vehicle-charger handshaking were fed into IEC 61851-23 / ISO 15118-20 for CCS bidirectional and into CHAdeMO 3.0.',
      'Hardware cost':
        'Enel X 10 kW bidirectional DC units were purpose-built for the trial and carried a substantial cost premium over unidirectional AC wallboxes - identified as the main barrier to residential scale-up despite viable FCR-N revenue at fleet level.',
    },
    businessModel: {
      type: 'Commercial fleet V2G aggregator (FCR-N)',
      description:
        'Frederiksberg Forsyning municipal fleet aggregated by Nuvve to sell Frequency Containment Reserve (FCR-N) on the Danish/Nordic ancillary services market operated by Energinet. Average revenue of approximately EUR 1,860 per vehicle per year - the first documented positive-business-case V2G operation on a live TSO market.',
    },
    standardization: {
      standard: 'CHAdeMO 2.0 bidirectional DC; Energinet FCR-N market qualification',
      status: 'Full commercial qualification. Contributed to IEC 61851-23 / ISO 15118-20 bidirectional work and to the CHAdeMO 3.0 (ChaoJi) evolution.',
    },
    technology: {
      overview: 'Municipal fleet with cross-OEM EVs on Enel X 10 kW bidirectional DC chargers, aggregated by Nuvve for Energinet FCR-N.',
      hardware: [
        { name: 'Enel X V2G Charger', details: ['10 kW bidirectional DC', 'CHAdeMO 2.0 connector', 'Depot deployment at Frederiksberg Forsyning'] },
        { name: 'EV fleet', details: ['10 Nissan e-NV200 (core commercial fleet)', 'Mitsubishi Outlander PHEV & i-MiEV', 'PSA Peugeot iOn - cross-OEM testing'] },
      ],
      software: [
        { name: 'Nuvve GIVe platform', details: ['Real-time dispatch of fleet to FCR-N signal', '4-hour market bidding blocks', 'Per-vehicle SoC and availability optimisation'] },
        { name: 'DTU measurement & analytics', details: ['Battery-health tracking', 'Grid-service performance verification', '"Grid Integrated Vehicle" (GIV) cross-brand rating framework'] },
      ],
    },
    timeline: [
      { phase: 'Project start', year: '2016', description: 'Consortium formed under EUDP funding; DTU coordinates, Nuvve provides aggregator, Enel X supplies 10 kW bidirectional CHAdeMO units, Frederiksberg Forsyning hosts the fleet.' },
      { phase: 'Commercial operation', year: '2017', description: 'World\'s first fully commercial V2G hub goes live - fleet begins bidding FCR-N on Energinet\'s ancillary services market.' },
      { phase: 'Cross-OEM testing', year: '2017-2018', description: 'Nissan, Mitsubishi and PSA vehicles tested on the same chargers; GIV rating framework published.' },
      { phase: 'Final report', year: 'Aug 2018', description: 'DTU publishes final report: ~EUR 1,860/vehicle/year FCR-N revenue, no accelerated battery degradation, cross-OEM interoperability validated.' },
      { phase: 'Legacy', year: '2019+', description: 'Findings feed IEC/ISO 15118-20 and CHAdeMO 3.0 standardisation; Nuvve scales the commercial V2G-for-FCR model internationally.' },
    ],
    partnerLead: 'DTU (Technical University of Denmark), Nuvve (aggregator), Enel X (charger OEM), Nissan / Mitsubishi / PSA (vehicle OEMs), Frederiksberg Forsyning (fleet operator), Energinet (TSO), Insero',
  },
  'shanghai district grid v2g pilot': {
    references: [
      { title: 'Shanghai starts V2G pilot', url: 'https://www.electrive.com/2025/04/05/shanghai-starts-v2g-pilot/', source: 'electrive', date: 'Apr 2025' },
      { title: 'China sets up 30 large-scale V2G pilot projects', url: 'https://www.enlit.world/library/china-sets-up-30-large-scale-vehicle-to-grid-pilot-projects', source: 'Enlit World', date: 'Apr 2025' },
      { title: 'China\'s electric vehicle bidirectional charging', url: 'https://restofworld.org/2025/china-electric-vehicle-bidirectional-charging/', source: 'Rest of World', date: '2025' },
      { title: 'V2G in Shanghai - technical study', url: 'https://www.mdpi.com/1996-1073/19/8/1986', source: 'Energies (MDPI)' },
      { title: 'Shanghai V2G research article', url: 'https://base4zgdl.xml-journal.net/en/article/doi/10.11930/j.issn.1004-9649.2012.4.92.3', source: 'Power System Technology' },
      { title: 'IEEE paper on Shanghai V2G integration', url: 'https://ieeexplore.ieee.org/document/10991793', source: 'IEEE Xplore' },
    ],
    gapExplanations: {
      'Equipment compatibility':
        'The pilot deliberately mixes 19 EVs from 10 automakers with 13 chargers from 9 manufacturers to stress-test interoperability of bidirectional handshakes, SoC reporting and safe shutdown - a prerequisite before scaling to the 30,000-50,000 V2G stations Shanghai plans by 2030.',
      'Grid adaptability':
        'State Grid Shanghai is validating that the distribution grid can absorb the 20 MW of V2G discharge on top of a 300 MW smart-charging network without protection or voltage-quality issues.',
      'Demand response flexibility':
        'The test measures how quickly the aggregated fleet can respond to dispatch signals during peak demand - the core value proposition justifying the national rollout.',
      'Business model':
        'Chinese industry experts flag that viable commercial models are still missing: inter-regional/inter-provincial market rules, retail tariffs and revenue-sharing between drivers, aggregators and grid companies remain underdeveloped.',
      'Battery degradation':
        'Battery lifespan under frequent bidirectional cycling is one of the explicit hurdles named by China Briefing; the pilot generates the evidence base needed to reassure OEMs and consumers.',
      'Charger cost':
        'Upgrading existing charging stations to bidirectional operation carries substantial capex, cited as a key barrier to large-scale rollout even after the technical pilots succeed.',
    },
    businessModel: {
      type: 'Government-led multi-OEM V2G pilot (grid utility as aggregator)',
      description:
        'State Grid Shanghai operates the pilot on behalf of the NDRC program. EV owners and fleet operators provide vehicles; grid company handles dispatch, metering and settlement. Commercial retail products are expected to follow post-evaluation, contingent on the NDRC establishing market rules for V2G participation in electricity trading.',
    },
    standardization: {
      standard: 'Chinese GB/T bidirectional DC (ChaoJi-aligned)',
      status: 'Pilot supports the NDRC-led national framework for large-scale V2G interaction; results feed a post-pilot evaluation - projects that underperform are removed from the national list.',
    },
    technology: {
      overview: 'District-scale bidirectional network combining passenger cars, buses and heavy trucks on 13 multi-vendor V2G stations, operated by State Grid Shanghai.',
      hardware: [
        { name: 'V2G charging stations', details: ['13 bidirectional units', '9 different manufacturers', 'Support cars, buses and heavy trucks'] },
        { name: 'EV fleet', details: ['19 vehicles', '10 automakers', 'Mixed vehicle classes: passenger, bus, truck'] },
        { name: 'Underlying network', details: ['300,000 kW smart charging capacity', '20,000 kW V2G discharge capacity'] },
      ],
      software: [
        { name: 'State Grid dispatch platform', details: ['Peak-shaving dispatch', 'Grid access and metering', 'Multi-OEM interoperability testing'] },
        { name: 'NDRC evaluation framework', details: ['Compatibility, adaptability and flexibility KPIs', 'Post-pilot removal mechanism for underperformers'] },
      ],
    },
    timeline: [
      { phase: 'National policy', year: 'Jan 2024', description: 'NDRC publishes implementation guidelines for EV/PHEV interaction with the power grid.' },
      { phase: 'Call for pilots', year: 'Sep 2024', description: 'NDRC opens applications for large-scale V2G pilot cities.' },
      { phase: 'Pilot selection', year: 'Apr 2025', description: 'NDRC announces 30 pilot projects across 9 cities; Shanghai gets 4.' },
      { phase: 'Test launch', year: '31 Mar 2025', description: 'First fully integrated V2G test kicks off in Shanghai with 19 EVs and 13 chargers.' },
      { phase: 'Initial test window', year: 'Mar-Apr 2025', description: 'One-month integrated test evaluates compatibility, grid adaptability and flexibility.' },
      { phase: 'City rollout target', year: 'by 2030', description: 'Shanghai plan targets 30,000-50,000 V2G-enabled charging stations.' },
    ],
    partnerLead: 'State Grid Shanghai (operator), NDRC, National Energy Administration, MIIT, SAMR, 10 automakers, 9 EVSE manufacturers',
  },
  'bus2grid': {
    references: [
      { title: 'Bus2Grid - UKRI Gateway to Research', url: 'https://gtr.ukri.org/projects?ref=104230', source: 'UKRI / Innovate UK' },
      { title: 'Project Bus2Grid will explore V2G charging with buses', url: 'https://www.electrive.com/2018/03/07/project-bus2grid-will-explore-v2g-charging-buses/', source: 'electrive', date: 'Mar 2018' },
      { title: 'Bus2Grid: Innovating Hard and Soft (whitepaper, PDF)', url: 'https://plugin-power.com/wp-content/uploads/2021/02/Bus2Grid-Innovating-Hard-and-Soft.pdf', source: 'Plugin Power / SSE', date: '2021' },
      { title: 'Bus2Grid: The next step in decarbonising transport?', url: 'https://www.evinfrastructurenews.com/emobility/bus2grid-the-next-step-in-decarbonising-transport', source: 'EV Infrastructure News', date: 'Oct 2020' },
      { title: 'Road to Renewables', url: 'https://www.sseenergysolutions.co.uk/roadtorenewables', source: 'SSE Energy Solutions' },
      { title: 'Bus2Grid project uses BYD London double-decker buses for V2G', url: 'https://www.yolegroup.com/industry-news/bus2grid-project-aims-the-use-of-byd-london-double-decker-buses-for-v2g-solutions/', source: 'Yole Group', date: 'Aug 2020' },
    ],
    gapExplanations: {
      'AC bidirectional dispatch':
        'Bus2Grid runs AC-based V2G, so the on-board charger controls the discharge. The team originally hoped to signal via the Type 2 socket, but it could not carry enough information. They shifted to a cloud-based control path (Origami router - Origami cloud - BYD cloud - bus) to trigger safe discharge, which added latency and required tight coordination between energy and vehicle stacks.',
      'G99 certification':
        'G99 came into force in 2019 for stationary generators. Because the "generator" in Bus2Grid is the bus itself (battery + on-board inverter) and it leaves the depot every day, the project had to test and certify voltage, harmonics and reactive-power behaviour for the aggregated buses when parked - a novel interpretation of the standard.',
      'Battery degradation':
        'BYD engineers modelled expected V2G duty on the depot buses and concluded the impact was small enough that the standard battery warranty was unaffected. Direct measurement was ruled out because degradation over the project window would be too small to isolate.',
      'Business model':
        'University of Leeds led business-model design, working out how bus operators, transport authorities, DSOs and National Grid ESO share value from wholesale trades, DSO services and frequency response. New commercial arrangements between energy and transport sectors are the main non-technical barrier to replication.',
      'Cross-industry collaboration':
        'The project required an OEM (BYD), a DNO (UK Power Networks), an energy services company (SSE), a university and multiple regulators to align on data, dispatch and safety. Bus2Grid was, in effect, the first at-scale template for that collaboration in the UK.',
    },
    businessModel: {
      type: 'Depot-scale bus V2G aggregator',
      description:
        'SSE Enterprise aggregates BYD electric buses parked overnight at Northumberland Park depot and sells the resulting flexibility into wholesale energy markets, UK Power Networks DSO services, and National Grid ESO frequency response. Predictable route timings make buses an attractive asset class for grid services relative to consumer EVs.',
    },
    standardization: {
      standard: 'AC V2G on Type 2 with cloud dispatch; G99 depot compliance',
      status: 'Delivered UK evidence base for AC V2G at depot scale and for aggregated G99 certification of mobile generators. Findings feed the UK smart-charging and flexibility policy tracks.',
    },
    technology: {
      overview: 'AC-based V2G at Europe\'s largest e-bus depot, with an Origami energy router coordinating BYD buses through the cloud to trigger safe discharge back to the grid.',
      hardware: [
        { name: 'BYD electric double-decker bus', details: ['Battery up to 382 kWh', 'AC charging at 80 kW', 'Two 150 kW electric motors', 'V2G-enabled variant'] },
        { name: 'Northumberland Park depot', details: ['Europe\'s largest electric bus depot', 'Nearly 100 zero-emission buses on site', 'V2G export power not publicly disclosed'] },
        { name: 'Origami energy router', details: ['Local site dispatch and metering', 'Detects site frequency for FFR'] },
      ],
      software: [
        { name: 'Origami cloud + BYD cloud', details: ['Dispatch signal path: router -> Origami cloud -> BYD cloud -> bus', 'Enables safe AC discharge control'] },
        { name: 'Market interfaces', details: ['Wholesale energy trades', 'UK Power Networks DSO services', 'National Grid ESO static & dynamic frequency response'] },
        { name: 'University of Leeds analytics', details: ['Business-model design', 'Barriers-to-market analysis'] },
      ],
    },
    timeline: [
      { phase: 'V2G competition award', year: '2018', description: 'OLEV / BEIS award Bus2Grid under the V2G competition (UKRI ref 104230); consortium formed with SSE Enterprise, BYD, UK Power Networks and University of Leeds.' },
      { phase: 'Project launch', year: 'Summer 2018', description: 'Bus2Grid begins - billed as the world\'s largest V2G project.' },
      { phase: 'G99 regulation', year: '2019', description: 'New G99 rules for generators take effect; consortium develops aggregated certification approach for depot buses.' },
      { phase: 'Depot operational', year: '2020', description: 'Northumberland Park depot begins returning energy to the grid; wholesale, DSO and ESO services tested (site export power not publicly disclosed).' },
      { phase: 'Whitepaper', year: '2021', description: '"Innovating Hard and Soft" whitepaper published, sharing technical and commercial lessons.' },
      { phase: 'Project completion', year: '2022', description: 'Findings inform UK V2G policy, DNO connection rules and SSE\'s commercial flexibility offer.' },
    ],
    partnerLead: 'SSE Enterprise (lead), BYD, UK Power Networks, University of Leeds, Innovate UK, BEIS/OLEV, Origami Energy',
  },
  'revs': {
    references: [
      { title: 'REVS project page', url: 'https://arena.gov.au/projects/realising-electric-vehicle-to-grid-services/', source: 'ARENA', date: '2020-2025' },
      { title: 'Insights from the REVS Project - Final Report (Energeia for ARENA)', url: 'https://arena.gov.au/assets/2024/02/ARENA-Vehicle-to-Grid-Insights-Final-Report.pdf', source: 'ARENA / Energeia', date: 'Feb 2024' },
      { title: 'REVS Lessons Learnt 1 (BSGIP, ANU)', url: 'https://arena.gov.au/assets/2021/09/revs-lessons-learnt-report.pdf', source: 'ARENA / ANU BSGIP', date: 'Apr 2021' },
      { title: 'REVS Lessons Learnt 2 - Certification against AS/NZS 4777.2', url: 'https://arena.gov.au/assets/2022/05/realising-electric-vehicle-to-grid-services-lessons-learnt-2.pdf', source: 'ARENA / ANU BSGIP', date: 'May 2022' },
      { title: 'Crossing sectors - a how-to guide for putting V2G into practice', url: 'https://arena.gov.au/assets/2022/08/realising-electric-vehicle-to-grid-services-crossing-sectors-report.pdf', source: 'ARENA / ANU BSGIP', date: 'Jun 2022' },
      { title: 'Evaluation of FCAS Capabilities of a V2G-Capable EV Charger - Case Study', url: 'https://arena.gov.au/assets/2023/01/assessment-of-fcas-capabilities-of-v2g-capable-ev-charger-case-study.pdf', source: 'BSGIP, ANU', date: 'Jun 2022' },
      { title: 'World-leading electric vehicle-to-grid trial in ACT', url: 'https://arena.gov.au/news/world-leading-electric-vehicle-to-grid-trial-in-act/', source: 'ARENAWIRE', date: 'Jul 2020' },
      { title: 'REVS on V2G-Hub', url: 'https://www.v2g-hub.com/projects/realising-electric-vehicle-to-grid-services/', source: 'V2G-Hub' },
      { title: 'The vehicle-to-grid revolution has arrived in Australia', url: 'https://www.nissan.com.au/about-nissan/news-and-events/news/2022/Dec/the-vehicle-to-grid-revolution-ha-arrived-in-australia.html', source: 'Nissan Australia', date: 'Dec 2022' },
      { title: 'V2G charging approved in South Australia (Wallbox Quasar)', url: 'https://wallbox.com/en/newsroom/v2g-charging-approved-south-australia', source: 'Wallbox' },
      { title: 'When 500,000 homes in Victoria lost power, these Canberra EVs got to work', url: 'https://region.com.au/when-500000-homes-in-victoria-lost-power-these-canberra-evs-got-to-work/787013/', source: 'Region Canberra', date: 'Jul 2024' },
      { title: 'BSGIP research page - REVS', url: 'https://bsgip.com/research/realising-electric-vehicles-to-grid-services/', source: 'ANU BSGIP' },
      { title: 'V2G tech offers lucrative market for EV fleet owners', url: 'https://www.pv-magazine-australia.com/2024/03/12/vehicle-to-grid-tech-offers-potentially-lucrative-market-for-ev-fleet-owners/', source: 'pv magazine Australia', date: 'Mar 2024' },
    ],
    gapExplanations: {
      'inverter certification delays':
        'The Wallbox Quasar had to be certified against AS/NZS 4777.2:2020 as a bidirectional inverter - the first such certification in Australia. Test procedures written for stationary PV inverters had to be reinterpreted for a vehicle-coupled asset, driving multi-year delays and rework of firmware, protection settings and grid-support functions before commercial deployment could proceed.',
      'scaling beyond government fleet':
        'REVS relied on ACT Government and ActewAGL fleet vehicles with predictable duty cycles, workplace charging and a single retailer. Extending V2G to private drivers, mixed-brand vehicles and multi-retailer settings needs new consumer contracts, warranty positions from OEMs, and a metering/settlement framework that today does not exist at scale in the NEM.',
    },
    businessModel: {
      type: 'Contingency FCAS revenue + fleet charging optimisation',
      description: 'ActewAGL, as the registered market participant, monetized aggregated Quasar chargers as a contingency FCAS (raise) resource in the AEMO NEM. Fleet owners retained the vehicles for daily use; V2G revenue offset charging cost and part of the vehicle TCO. ARENA/Energeia\'s 2024 final report modelled up to ~AUD 12k/vehicle/year of FCAS revenue under favourable conditions.',
    },
    standardization: {
      standard: 'AS/NZS 4777.2:2020 (grid-connect inverter), CHAdeMO V2G, AEMO FCAS market rules',
      status: 'First bidirectional EV charger (Wallbox Quasar) certified in Australia via REVS; certification later unlocked residential V2G approval in South Australia.',
    },
    technology: {
      overview: 'DC bidirectional charging via CHAdeMO between Nissan LEAF ZE1 vehicles and Wallbox Quasar 1 chargers, aggregated by ActewAGL for contingency-raise FCAS bids into the AEMO NEM.',
      hardware: [
        { name: 'Nissan LEAF ZE1', details: ['40 kWh battery', 'CHAdeMO port used for V2G', '51 fleet vehicles across 11 sites'] },
        { name: 'Wallbox Quasar 1', details: ['Single-phase bidirectional DC charger', '7.4 kW per unit', 'First unit certified against AS/NZS 4777.2:2020 in Australia'] },
        { name: 'Site metering + comms', details: ['Per-site sub-metering', 'Cellular / site LAN backhaul to aggregator platform'] },
      ],
      software: [
        { name: 'ActewAGL aggregator platform', details: ['Bids aggregated Quasar fleet as contingency FCAS (raise)', 'Dispatch integrated with AEMO market signals'] },
        { name: 'BSGIP analytics (ANU)', details: ['Charger performance vs AS/NZS 4777.2', 'FCAS response characterisation', 'Fleet duty-cycle and SoC analysis'] },
        { name: 'Fleet booking integration', details: ['Departure-time SoC guarantees for ACT Government / ActewAGL drivers'] },
      ],
    },
    timeline: [
      { phase: 'ARENA funding announcement', year: 'Jul 2020', description: 'ARENA commits AUD 2.4M to ActewAGL for a ~AUD 7.22M V2G trial - billed as one of the largest in the world at the time.' },
      { phase: 'Deployment', year: '2021-2022', description: 'Wallbox Quasar chargers rolled out across 11 Canberra fleet sites paired with Nissan LEAFs; certification work against AS/NZS 4777.2 runs in parallel.' },
      { phase: 'First certification', year: '2022', description: 'Wallbox Quasar becomes the first bidirectional EV charger certified against AS/NZS 4777.2 in Australia, later enabling residential V2G approval in South Australia.' },
      { phase: 'FCAS market participation', year: '2023', description: 'ActewAGL registers and dispatches the aggregated Quasar fleet as a contingency-raise FCAS resource in the AEMO NEM.' },
      { phase: 'Victoria storm event', year: 'Feb 2024', description: 'REVS EVs contribute contingency FCAS during the 13 February Victorian storm event that blacked out ~500,000 homes - a live demonstration of fleet V2G value.' },
      { phase: 'Final report', year: 'Feb 2024', description: 'Energeia publishes the ARENA V2G Insights Final Report, quantifying up to ~AUD 12k/vehicle/year of FCAS revenue potential.' },
      { phase: 'Project completion', year: 'Nov 2025', description: 'REVS formally concludes on 21 November 2025; lessons feed BSGIP\'s follow-on residential and fleet V2G programs.' },
    ],
    partnerLead: 'ActewAGL Retail (lead), Nissan Australia, Wallbox, JET Charge, SG Fleet, ANU BSGIP, ACT Government, Evoenergy, ARENA',
  },
  'shenzhen ultra-fast v2g hub (hongqiao park)': {
    references: [
      { title: 'Largest V2G Ultra-Fast Charging Station in Greater Bay Area Launches in Shenzhen', url: 'https://english.news18a.com/news/english_247035.html', source: 'News18a', date: 'Apr 2026' },
      { title: 'SZ to lead V2G integration as national pilot city', url: 'https://www.sz.gov.cn/en_szgov/news/latest/content/post_12104344.html', source: 'Shenzhen Daily', date: 'Apr 2025' },
      { title: 'Shenzhen developing a top-tier charging network', url: 'https://www.sz.gov.cn/en_szgov/news/latest/content/post_11961881.html', source: 'Shenzhen Daily', date: 'Jan 2025' },
      { title: 'Industry Leaders Tour Ultra-Fast Charging Hub, Unlocking New Value in the EV Charging Ecosystem', url: 'https://www.linkedin.com/pulse/industry-leaders-tour-ultra-fast-charging-hub-unlocking-new-vfihc/', source: 'Shenzhen NEV Operators Association (LinkedIn)', date: 'Jul 2025' },
      { title: 'Hongqiao Park V2G station walkthrough (video)', url: 'https://www.youtube.com/watch?v=wTiBSttdoPY', source: 'YouTube', date: '2026' },
      { title: 'Hongqiao Park V2G station reel', url: 'https://www.instagram.com/reels/DX_iFzqO5cs/', source: 'Instagram' },
    ],
    gapExplanations: {
      'Megawatt V2G hardware':
        'A single-gun 1,000 kW fully liquid-cooled bidirectional charger for passenger cars is a first-of-a-kind product. Thermal management, connector standards and battery-side acceptance of megawatt discharge are all beyond today\'s CCS/GB/T V2G specifications, so the Hongqiao Park deployment doubles as a real-world validation environment for the next generation of ultra-fast V2G equipment.',
      'Grid interconnection':
        'Discharging up to 2,770 kW at a single site requires medium-voltage grid access. The project uses China\'s first 20 kV prefabricated "Power Cube" substation to shorten construction time and enable zero-carbon site operation, and is dispatched through Shenzhen\'s Virtual Power Plant Management Center rather than as an isolated charger.',
      'Storage for high-power buffering':
        'To keep peak charging/discharging from stressing the upstream feeder, the site pairs V2G with a purpose-built sodium-ion battery energy storage system - China\'s first sodium-ion BESS designed specifically for ultra-fast charging duty cycles - plus rooftop PV in a DC-coupled PV-storage-charging microgrid.',
      'Business model at city scale':
        'Shenzhen\'s prior city-wide V2G test paid drivers 4 yuan/kWh for exports against ~0.4 yuan/kWh off-peak charging. Hongqiao Park translates that experimental price signal into permanent infrastructure aggregated by a municipal VPP, giving the pilot city model a real revenue and settlement backbone.',
    },
    businessModel: {
      type: 'Municipal virtual power plant + ultra-fast charging revenue',
      description:
        'Hongqiao Park is operated as an asset of Shenzhen\'s Virtual Power Plant Management Center. Revenue stacks EV ultra-fast charging fees, peak-shaving/ancillary payments from the VPP, and on-site PV self-consumption. It anchors the national V2G pilot program (NDRC/NEA) that selected Shenzhen as one of China\'s first nine V2G pilot cities in April 2025.',
    },
    standardization: {
      standard: 'GB/T V2G, 20 kV MV grid interconnection, China VPP dispatch protocols',
      status: 'Reference site for China\'s national V2G pilot program; showcases megawatt liquid-cooled V2G charger, 20 kV Power Cube substation and sodium-ion BESS as candidate building blocks for scale-out to the other pilot cities.',
    },
    technology: {
      overview:
        '23 V2G charging piles across 37 parking spaces at Hongqiao Park, dispatched by Shenzhen\'s Virtual Power Plant Management Center. Peak site discharge is 2,770 kW, combined with a ~140,000 kWh/year rooftop PV canopy and a dedicated sodium-ion BESS in a DC-coupled microgrid.',
      hardware: [
        { name: 'Megawatt liquid-cooled V2G charger', details: ['1,000 kW single-gun for passenger vehicles', 'Fully liquid-cooled', '~400 km of range added in ~5 minutes'] },
        { name: 'Ultra-fast chargers', details: ['6 x 600 kW ultra-fast chargers', '11 x 250-300 kW fast chargers (0-80% in <30 min)', 'Additional 30-120 kW units for legacy vehicles'] },
        { name: '20 kV Power Cube substation', details: ['China\'s first 20 kV prefabricated MV substation', 'Enables zero-carbon site operation', 'Compact footprint for urban sites'] },
        { name: 'Sodium-ion BESS', details: ['China\'s first sodium-ion BESS designed for ultra-fast charging duty', 'Buffers high-power charge/discharge cycles', 'Improves stability during simultaneous V2G dispatch'] },
        { name: 'Rooftop PV canopy', details: ['~600 m2 of PV panels above the parking canopy', '~140,000 kWh/year generation', 'DC-coupled with storage and chargers'] },
      ],
      software: [
        { name: 'Shenzhen VPP Management Center', details: ['Aggregates Hongqiao Park with other city assets', 'Dispatches V2G discharge for peak shaving and ancillary services', 'Settles export revenue with drivers/operators'] },
        { name: 'Site energy management platform', details: ['Real-time control of PV-storage-charger microgrid', 'Round-the-clock O&M and safety alarms', 'Coordinates charging demand with grid signals'] },
      ],
    },
    timeline: [
      { phase: 'City-wide V2G test', year: 'Mar 2025', description: 'Shenzhen runs China\'s largest V2G test to date - 17,000+ NEVs and 760 charging stations - paying drivers 4 yuan/kWh for grid exports.' },
      { phase: 'National pilot designation', year: 'Apr 2025', description: 'NDRC selects Shenzhen as one of China\'s first nine cities for large-scale V2G integration; city commits to permanent high-power V2G infrastructure.' },
      { phase: 'Model site tour', year: 'Jul 2025', description: 'Shenzhen NEV Operators Association hosts industry tour of ultra-fast + V2G sites (incl. CheDianXingNeng Jinkui Zone II) as templates for the Hongqiao Park build-out.' },
      { phase: 'Hongqiao Park launch', year: 'Apr 2026', description: 'Hongqiao Park Ultra-Fast Charging Station opens with 23 V2G piles / 37 stalls, 2,770 kW peak discharge, integrated with Shenzhen\'s Virtual Power Plant Management Center.' },
    ],
    partnerLead: 'State Grid Shenzhen and Shenzhen Virtual Power Plant Management Center (operations); NDRC / NEA (national V2G pilot program); Guangming District Government (site host)',
  },
  'budapest v2h demonstrator (drive2x)': {

    references: [
      { title: 'DriVe2X Demo Site: Budapest (V2H)', url: 'https://drive2x.eu/demo_sites/budapest/', source: 'DriVe2X' },
      { title: 'DriVe2X Demo Sites overview', url: 'https://drive2x.eu/demo-sites/', source: 'DriVe2X' },
      { title: 'DriVe2X pushes the boundaries of residential energy management with new bidirectional charging control system', url: 'https://www.linkedin.com/pulse/drive2x-project-pushes-boundaries-residential-energy-l1fde/', source: 'LinkedIn (Gonçalo Pinto Mendes)', date: 'May 2025' },
      { title: 'Integrating Bidirectional EV Charging with Residential Energy Management Systems (ISGT Europe 2025)', url: 'https://lutpub.lut.fi/bitstream/handle/10024/171211/seyfi_et_al_integrating_bidirectional_ev_charging_aam.pdf?sequence=3', source: 'Seyfi et al., LUT University / IEEE PES ISGT Europe 2025', date: '2025' },
    ],
    gapExplanations: {
      'V2H hardware availability':
        'Residential single-phase bidirectional chargers with integrated HEMS functionality are not yet a mainstream product in Europe. DriVe2X is producing purpose-built units through General Mechatronics (Hungary) to enable real-time monitoring and optimal control of renewables and key household loads.',
      'HEMS and control':
        'Most V2H studies rely on simulation. Budapest is one of the first sites to run smart charging algorithms embedded in an open-source HEMS (Home Assistant) with real-world constraints - user departure time, minimum state of charge, battery warranty, CC/CV charging phases, PV forecasts and time-of-use prices.',
      'Prosumer business case':
        'V2H revenue in Hungary depends on tariff optimization and self-consumption rather than grid-service payments. The demo characterises what homeowners can realistically save through smart charging + PV + HEMS, and how much of the technical value can be captured today under current retail structures.',
      'Grid interconnection':
        'Single-phase installations at residential homes must comply with Hungarian low-voltage connection rules for bidirectional flows. The pilot works with local partners to validate metering, protection and export configuration for behind-the-meter V2H.',
    },
    businessModel: {
      type: 'Behind-the-meter V2H: prosumer tariff optimization + PV self-consumption',
      description:
        'Homeowners save on electricity bills by charging when prices are low, discharging the EV to cover the home when prices are high, and maximising the self-consumption of rooftop PV via the HEMS. Bidirectional charging is treated as an additional household flexibility resource, not a wholesale-market asset. Participation in demand response programmes is explored where market frameworks allow.',
    },
    standardization: {
      standard: 'Single-phase residential bidirectional charging; Home Assistant HEMS add-on (open source)',
      status: 'Reference implementation for the DriVe2X V2H use case. The Smart Charging Algorithm is deployed as a Home Assistant add-on to maximise replicability across European homes.',
    },
    technology: {
      overview:
        'Five single-phase bidirectional EV chargers installed in Budapest homes (city center and suburbs), covering a mix of prosumers (with rooftop PV) and consumers. Each charger acts as a central controller running a Smart Charging Algorithm (SCA) inside a Home Assistant HEMS, coordinating EV charging/discharging with household loads, PV generation and market prices.',
      hardware: [
        { name: 'General Mechatronics single-phase bidirectional home charger', details: ['Purpose-built residential V2H unit', 'Real-time monitoring and control of renewables and household loads', 'Integrated HEMS functionality'] },
        { name: 'Rooftop PV (prosumer homes)', details: ['On-site generation coupled behind the meter', 'Self-consumption maximised by the HEMS'] },
      ],
      software: [
        { name: 'Smart Charging Algorithm (SCA) - University of Salford', details: ['Time-indexed optimization of charge/discharge', 'Inputs: ToU prices, PV forecast, grid emission intensity', 'Respects driver departure time and minimum SoC', 'Considers CC/CV charging phases and battery warranty'] },
        { name: 'Home Assistant HEMS add-on - LUT University', details: ['Open-source home automation platform', 'Runs the SCA natively as a modular add-on', 'Real-time data collection and device control', 'Designed for maximum replicability across European homes'] },
      ],
    },
    timeline: [
      { phase: 'DriVe2X project start', year: '2023', description: 'EU Horizon Europe / UKRI project DriVe2X launched (grant No 101056934 / UKRI 10055673); Budapest selected as the V2H demonstrator city.' },
      { phase: 'Hardware and algorithm development', year: '2023-2024', description: 'General Mechatronics develops single-phase bidirectional home chargers; Salford develops the Smart Charging Algorithm; LUT builds the Home Assistant HEMS add-on.' },
      { phase: 'Home recruitment and installation', year: '2024-2025', description: 'Five homes recruited across Budapest city center and suburbs, mixing prosumers (with rooftop PV) and consumers.' },
      { phase: 'Real-world testing phase', year: '2025', description: 'SCA deployed in Home Assistant at the recruited homes; results published at IEEE PES ISGT Europe 2025 (Seyfi et al.).' },
      { phase: 'Project end', year: '2026', description: 'Final assessment of V2H impact on household demand curves, energy bills and self-consumption; comparison with traditional EV charging and fossil-fuel baselines.' },
    ],
    partnerLead: 'LUT University (coordinator, HEMS integration); University of Salford (smart charging algorithms); General Mechatronics LLC (bidirectional home charger hardware)',
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
