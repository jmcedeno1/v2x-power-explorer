// Technology Overview content: fundamentals of bidirectional charging,
// application types, system architectures, power electronics and engineering challenges.
//
// SOURCING RULE: every factual claim below must be traceable to one of the
// approved sources in `sources`, to the app's OpenAlex publications corpus, or to
// the app's Lens.org patents corpus. Statements that could not be grounded are
// marked with `unsupported` instead of receiving an invented citation.

export type SourceRef = {
  label: string;
  url: string;
};

export const sources = {
  iea: {
    label: 'IEA, Vehicle-to-grid technology (2026)',
    url: 'https://www.iea.org/reports/vehicle-to-grid-technology',
  },
  v2gReview2025: {
    label:
      'A comprehensive review of V2G technology: technical, economic, regulatory and social perspectives (2025)',
    url: 'https://www.sciencedirect.com/science/article/pii/S2590174525002703',
  },
  obcReview2024: {
    label: 'Performance of bidirectional On-Board Charger in EV: A review (2024)',
    url: 'https://www.sciencedirect.com/science/article/pii/S2772671124001931',
  },
  topologyReview2024: {
    label: 'V2G-based bidirectional EV charger topologies and its control techniques: a review (2024)',
    url: 'https://link.springer.com/article/10.1007/s42452-024-06297-z',
  },
  dab2024: {
    label: 'Soft-switching dual active bridge bidirectional on-board charger under V2G/G2V control (2024)',
    url: 'https://link.springer.com/article/10.1186/s44147-024-00384-z',
  },
  totemPole2022: {
    label: 'Kumar & Yi, Single-Phase Bidirectional 7.7 kW Totem-Pole On-Board Charging/Discharging (2022)',
    url: 'https://www.mdpi.com/2076-3417/12/4/2236',
  },
  tiTotemPole: {
    label: 'Texas Instruments, 98.6% Efficiency 6.6-kW Totem-Pole PFC Reference Design (TIDUE54)',
    url: 'https://www.ti.com/lit/ug/tidue54b/tidue54b.pdf',
  },
  nrelEconomics: {
    label: 'NREL, Critical Elements of Vehicle-to-Grid (V2G) Economics (NREL/TP-5400-69017, 2017)',
    url: 'https://docs.nrel.gov/docs/fy17osti/69017.pdf',
  },
  degradationAppliedEnergy2025: {
    label:
      'Vehicle-to-grid impact on battery degradation and estimation of V2G economic compensation (Applied Energy, 2025)',
    url: 'https://www.sciencedirect.com/science/article/pii/S0306261924019299',
  },
  cycleAging2024: {
    label: 'Vehicle-to-grid applications and battery cycle aging: A review (2024)',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S1364032124007391',
  },
  wang2016: {
    label: 'Wang et al., Quantifying EV battery degradation from driving vs. V2G services (2016)',
    url: 'https://ui.adsabs.harvard.edu/abs/2016JPS...332..193W/abstract',
  },
  nrelSmartInverters: {
    label: 'NREL, Smart Inverters and IEEE 1547 Applications in Power Systems',
    url: 'https://www.nrel.gov/media/docs/libraries/grid/smart-inverters-applications-in-power-systems.pdf',
  },
  ieee1547: {
    label: 'IEEE 1547-2018, Interconnection of Distributed Energy Resources',
    url: 'https://standards.ieee.org/ieee/1547/5915/',
  },
} satisfies Record<string, SourceRef>;

export const howItWorks = {
  basicPrinciples: {
    title: 'Basic principles of bidirectional charging',
    content: `Bidirectional charging changes how energy moves between an EV and external loads. Conventional unidirectional charging only transfers power from the grid to the vehicle battery, whereas bidirectional systems support reverse power flow so the vehicle can also supply electricity to the grid, a building or a local load.

The enabling element is a bidirectional power converter that operates in two directions: in charging mode, AC power from the grid is rectified to DC to charge the battery; in discharging mode, battery DC power is inverted back to AC for grid, building or load use.

Reported converter architectures for this duty are typically two-stage designs combining a bidirectional AC-DC stage (power factor correction) with an isolated bidirectional DC-DC stage, most commonly a dual active bridge or a resonant CLLC converter.`,
    sources: [sources.iea, sources.v2gReview2025, sources.obcReview2024, sources.topologyReview2024],
  },
  v1gVsV2g: {
    title: 'V1G vs V2G: understanding the difference',
    items: [
      {
        type: 'V1G (smart / managed charging)',
        description:
          'Charging rate and timing are shifted in response to grid or price signals, but power flows only from grid to vehicle.',
        benefits: [
          'Lower hardware and implementation cost than bidirectional charging',
          'Avoids the additional discharge cycling that drives V2G degradation concerns',
          'Simpler interconnection: the vehicle remains a controllable load, not a generator',
        ],
        limitations: [
          'Cannot export power to the grid, a building or a load',
          'Limited to load-shifting style flexibility rather than the full set of grid services',
        ],
        sources: [sources.iea, sources.v2gReview2025],
      },
      {
        type: 'V2G (bidirectional charging)',
        description:
          'Two-way power flow lets the EV both absorb power and export it to the grid or other loads, so the vehicle acts as a distributed energy resource.',
        benefits: [
          'Access to export-based services such as frequency response and peak reduction',
          'Backup and resilience capability when supplying a building or load',
          'Revenue and bill-saving potential from stacking multiple services',
        ],
        limitations: [
          'Higher converter and installation cost',
          'Additional cycling raises battery degradation questions that depend heavily on dispatch strategy',
          'Interconnection, protection and settlement requirements are more demanding',
        ],
        sources: [sources.iea, sources.v2gReview2025, sources.nrelEconomics, sources.cycleAging2024],
      },
    ],
  },
  applicationTypes: [
    {
      id: 'v2g',
      title: 'Vehicle-to-Grid (V2G)',
      description:
        'The EV exports power to the electricity system, participating in grid services such as frequency response, peak demand reduction and support for variable renewable integration.',
      useCases: [
        'Frequency regulation and other ancillary services',
        'Peak demand reduction',
        'Support for variable renewable integration',
        'Deferral of local network reinforcement',
      ],
      value:
        'Value depends on which services are stacked, dispatch frequency and market access; NREL frames V2G economics as a balance of service revenue against degradation and equipment cost rather than a single headline figure.',
      sources: [sources.iea, sources.nrelEconomics, sources.v2gReview2025],
    },
    {
      id: 'v2h',
      title: 'Vehicle-to-Home / Building (V2H / V2B)',
      description:
        'The EV supplies power to a home or building, providing backup during outages and shifting building consumption away from expensive or high-carbon periods.',
      useCases: [
        'Backup power during grid outages',
        'Reducing consumption at peak price periods',
        'Increasing self-consumption of on-site solar',
        'Time-of-use energy cost optimisation',
      ],
      value:
        'Savings depend on local tariff structure and household load profile; IEA presents V2H mainly as a bill-management and resilience use case.',
      sources: [sources.iea, sources.v2gReview2025],
    },
    {
      id: 'v2l',
      title: 'Vehicle-to-Load (V2L)',
      description:
        'The EV powers external equipment directly through an on-board outlet or adapter, without any grid interconnection.',
      useCases: [
        'Powering tools and equipment away from a fixed supply',
        'Recreational and off-grid use',
        'Emergency power for critical devices',
      ],
      value:
        'Described in the reviewed literature as a convenience and resilience function; no monetary value figure for V2L is available from the approved sources.',
      sources: [sources.v2gReview2025],
      unsupported:
        'The previous "$500-2000 generator replacement value" figure was not supported by any approved source and has been removed.',
    },
  ],
};

export const technologyDeepDive = {
  architectures: {
    title: 'System architectures: AC vs DC bidirectional charging',
    comparison: [
      {
        type: 'AC bidirectional (on-board)',
        description:
          "Power conversion happens inside the vehicle's on-board charger, so the external equipment only switches and meters AC.",
        efficiency:
          'Two-stage on-board topologies are reported in the low-to-mid 90% range per stage, with the best reported totem-pole PFC stage at 98.6%.',
        powerLevel: 'Single-phase on-board designs reviewed in the literature are typically in the 3.3 to 11 kW class, with 7.7 kW demonstrated for a bidirectional totem-pole OBC.',
        cost: 'Lower infrastructure cost: conversion hardware is carried by the vehicle.',
        complexity: 'Higher vehicle-side complexity: the OBC must invert, synchronise and protect.',
        sources: [sources.obcReview2024, sources.totemPole2022, sources.tiTotemPole],
        unsupported:
          'Vehicle model lists and a "19.2 kW" ceiling were dropped: not documented in the approved sources.',
      },
      {
        type: 'DC bidirectional (off-board)',
        description:
          'Power conversion happens in external charging equipment, which exchanges DC with the vehicle battery.',
        efficiency:
          'Off-board conversion avoids the vehicle packaging limits that constrain on-board designs, and the reviewed topologies target high-efficiency soft-switched operation.',
        powerLevel:
          'Off-board equipment covers a much wider power range than on-board chargers; specific product ratings are not given in the approved sources.',
        cost: 'Higher infrastructure cost: bidirectional conversion sits in the charging equipment.',
        complexity: 'Lower vehicle-side complexity: the vehicle mainly manages the battery and the interface.',
        sources: [sources.iea, sources.topologyReview2024, sources.v2gReview2025],
        unsupported:
          'Named connector/standard mappings and example station lists were removed here; standards are covered in the Standards & Regulation module.',
      },
    ],
  },
  powerElectronics: {
    title: 'Power electronics topologies',
    topologies: [
      {
        name: 'Dual Active Bridge (DAB)',
        description:
          'Two active full bridges linked by a high-frequency transformer. Phase-shift control gives inherently bidirectional power flow, and soft switching keeps switching losses low across the operating range.',
        efficiency: 'Soft-switched DAB on-board chargers are reported operating in the mid-90% range under V2G/G2V control.',
        advantages: ['Inherently bidirectional', 'Galvanic isolation', 'Soft switching reduces switching loss'],
        applications: ['Isolated DC-DC stage of bidirectional on-board chargers', 'V2G/G2V power transfer'],
        sources: [sources.dab2024, sources.topologyReview2024],
      },
      {
        name: 'CLLC resonant converter',
        description:
          'A resonant tank is added around the isolation transformer so the switches commutate softly, which suits the wide battery voltage window seen in both charge and discharge directions.',
        efficiency:
          'Reviewed as one of the highest-efficiency isolated bidirectional DC-DC options, with soft switching sustained over a wide voltage range.',
        advantages: ['Wide voltage range operation', 'Soft switching in both directions', 'Low EMI signature'],
        applications: ['Isolated DC-DC stage where the battery voltage window is wide'],
        sources: [sources.obcReview2024, sources.topologyReview2024],
      },
      {
        name: 'Totem-pole PFC',
        description:
          'A bridgeless PFC leg using wide-bandgap devices for the fast switching pair, giving low conduction loss and bidirectional AC-DC operation for the grid-side stage.',
        efficiency: 'A 6.6 kW totem-pole PFC reference design reports 98.6% peak efficiency; a bidirectional 7.7 kW totem-pole OBC has been demonstrated.',
        advantages: ['Very high stage efficiency', 'Bridgeless: fewer conducting devices', 'Compact grid-side stage'],
        applications: ['Grid-side AC-DC stage of bidirectional on-board chargers'],
        sources: [sources.tiTotemPole, sources.totemPole2022],
      },
    ],
  },
  challenges: {
    title: 'Engineering challenges',
    items: [
      {
        challenge: 'Battery degradation',
        description:
          'V2G adds cycling beyond driving needs. Quantitative studies separate degradation caused by driving from that caused by V2G dispatch and find the outcome is highly sensitive to how the service is scheduled, so degradation is treated as a cost term to be compensated rather than a fixed penalty.',
        mitigation:
          'State-of-charge and depth-of-discharge limits, degradation-aware dispatch, and economic compensation that prices the incremental aging.',
        sources: [sources.wang2016, sources.degradationAppliedEnergy2025, sources.cycleAging2024],
        unsupported:
          'The previous "less than 10% over vehicle lifetime" claim was removed: it is not attributable to any approved source.',
      },
      {
        challenge: 'Grid synchronisation and smart inverter functions',
        description:
          'Exporting power requires the converter to synchronise with grid voltage, frequency and phase and to support voltage and frequency ride-through and regulation functions expected of distributed energy resources.',
        mitigation:
          'Smart inverter control functions and interconnection performance requirements defined by IEEE 1547-2018.',
        sources: [sources.nrelSmartInverters, sources.ieee1547],
      },
      {
        challenge: 'Anti-islanding and protection',
        description:
          'A bidirectional charger must detect loss of the utility supply and stop energising the network so that an unintended island cannot form, which is a core interconnection requirement for distributed energy resources.',
        mitigation: 'Islanding detection and cease-to-energise behaviour per IEEE 1547-2018 interconnection requirements.',
        sources: [sources.ieee1547, sources.nrelSmartInverters],
        unsupported:
          'The specific "within 2 seconds" trip time was removed: the exact value is not stated in the approved sources.',
      },
      {
        challenge: 'Power quality',
        description:
          'Exported current must meet harmonic and power factor expectations, which is why bidirectional AC-DC stages are designed around power factor correction rather than simple rectification.',
        mitigation: 'Bidirectional PFC stages, high switching frequency with wide-bandgap devices, and output filtering.',
        sources: [sources.tiTotemPole, sources.obcReview2024, sources.ieee1547],
      },
      {
        challenge: 'Economics, market access and settlement',
        description:
          'Technical capability alone does not make V2G viable: revenue depends on which markets a vehicle can access, how availability is verified and how value is split between driver, aggregator and network. Reviews identify regulatory and market-design barriers alongside the technical ones.',
        mitigation:
          'Service stacking, aggregation, and regulatory frameworks that let vehicle fleets participate as distributed energy resources.',
        sources: [sources.nrelEconomics, sources.iea, sources.v2gReview2025],
      },
    ],
  },
};

export const corpusGrounding = {
  title: 'Grounding in the app corpora',
  note:
    'Topic-level statements about research and IP activity in this module are drawn from the app\u2019s own corpora: OpenAlex records in the Publications module and Lens.org records in the Patents & IP module. Converter topologies, wide-bandgap devices, aggregation platforms and cybersecurity appear as distinct families there, and the per-family counts and trends shown in those modules are the reference for any activity claim.',
  links: [
    { label: 'Publications module (OpenAlex corpus)', to: '/publications' },
    { label: 'Patents & IP module (Lens.org corpus)', to: '/patents' },
  ],
};
