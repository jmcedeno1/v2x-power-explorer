// Technology Overview content: fundamentals of bidirectional charging,
// application types, system architectures, power electronics and engineering challenges.

export const howItWorks = {
  basicPrinciples: {
    title: 'Basic principles of bidirectional charging',
    content: `Bidirectional charging fundamentally transforms how energy flows between an EV and external loads. Unlike conventional unidirectional charging, which only transfers power from the grid to the vehicle battery, bidirectional systems enable reverse power flow, allowing the EV to supply electricity back to the grid, a building, or other loads.

At the core of this technology is a bidirectional power converter, capable of operating in two modes: charging mode (grid-to-vehicle), where AC power from the grid is converted to DC to charge the battery, and discharging mode (vehicle-to-grid, home or load), where DC power from the battery is converted to AC for external use.

Modern bidirectional chargers achieve round-trip efficiencies of 85-93%, with advanced topologies such as Dual Active Bridge (DAB) and CLLC resonant converters pushing efficiencies even higher.`,
  },
  v1gVsV2g: {
    title: 'V1G vs V2G: understanding the difference',
    items: [
      {
        type: 'V1G (smart / managed charging)',
        description:
          'Adjusts the rate and timing of charging based on grid signals, but power only flows from grid to vehicle.',
        benefits: ['Lower implementation cost', 'No battery degradation concerns', 'Simpler infrastructure requirements'],
        limitations: ['Cannot provide power back to grid', 'Limited grid services available'],
      },
      {
        type: 'V2G (bidirectional charging)',
        description:
          'Enables two-way power flow, allowing EVs to both charge from and discharge to the grid or other loads.',
        benefits: [
          'Full grid services (frequency regulation, peak shaving)',
          'Backup power capability',
          'Revenue generation potential',
        ],
        limitations: ['Higher hardware costs', 'Potential battery degradation', 'Complex grid integration requirements'],
      },
    ],
  },
  applicationTypes: [
    {
      id: 'v2g',
      title: 'Vehicle-to-Grid (V2G)',
      description:
        'EVs provide power back to the electrical grid, participating in grid services such as frequency regulation, peak demand reduction and capacity markets.',
      useCases: [
        'Frequency regulation services',
        'Peak demand shaving',
        'Renewable energy integration',
        'Grid capacity support',
      ],
      revenue: 'Up to $100/month for frequency regulation services (California pilot data)',
    },
    {
      id: 'v2h',
      title: 'Vehicle-to-Home (V2H)',
      description:
        'EVs supply power to residential buildings, serving as backup power during outages or reducing peak electricity costs.',
      useCases: [
        'Emergency backup power during outages',
        'Peak shaving to reduce utility bills',
        'Solar energy storage optimisation',
        'Time-of-use arbitrage',
      ],
      revenue: 'Potential savings of 20-40% on electricity bills through time-of-use optimisation',
    },
    {
      id: 'v2l',
      title: 'Vehicle-to-Load (V2L)',
      description:
        'EVs power external devices or appliances directly, useful for outdoor activities, construction sites or emergency situations.',
      useCases: [
        'Powering tools at job sites',
        'Outdoor recreational activities',
        'Emergency power for critical devices',
        'Off-grid and camping use',
      ],
      revenue: 'Eliminates need for portable generators ($500-2000+ value)',
    },
  ],
};

export const technologyDeepDive = {
  architectures: {
    title: 'System architectures: AC vs DC bidirectional charging',
    comparison: [
      {
        type: 'AC bidirectional (on-board)',
        description: "The bidirectional power conversion occurs within the vehicle's on-board charger (OBC).",
        efficiency: '85-92%',
        powerLevel: 'Typically 3.3-19.2 kW',
        cost: 'Lower infrastructure cost (uses standard EVSE)',
        complexity: 'Higher vehicle complexity',
        standards: ['SAE J3072', 'ISO 15118-20'],
        examples: ['Ford F-150 Lightning', 'Hyundai Ioniq 5/6', 'Kia EV6/EV9'],
      },
      {
        type: 'DC bidirectional (off-board)',
        description: 'The bidirectional power conversion occurs in external charging equipment (EVSE).',
        efficiency: '90-95%',
        powerLevel: 'Up to 350+ kW (typically 10-50 kW for V2G)',
        cost: 'Higher infrastructure cost',
        complexity: 'Lower vehicle complexity',
        standards: ['CHAdeMO (established)', 'CCS / ISO 15118-20 (emerging)'],
        examples: ['Nissan Leaf (CHAdeMO)', 'Fleet charging stations'],
      },
    ],
  },
  powerElectronics: {
    title: 'Power electronics topologies',
    topologies: [
      {
        name: 'Dual Active Bridge (DAB)',
        description:
          'Uses two full-bridge converters with a high-frequency transformer, enabling bidirectional power flow with soft-switching capabilities.',
        efficiency: '95-98%',
        advantages: ['High power density', 'Excellent efficiency', 'Inherent bidirectional capability'],
        applications: ['High-power DC-DC conversion', 'V2G systems'],
      },
      {
        name: 'CLLC resonant converter',
        description:
          'Employs resonant tank circuits (capacitor-inductor-inductor-capacitor) for soft-switching across wide operating ranges.',
        efficiency: '96-98%',
        advantages: ['Wide voltage range operation', 'Low EMI', 'High efficiency at partial loads'],
        applications: ['Wide battery voltage range EVs', 'High-efficiency charging'],
      },
      {
        name: 'Totem-pole PFC',
        description:
          'Bridgeless power factor correction topology using GaN switches for high-frequency AC-DC conversion.',
        efficiency: '98-99%',
        advantages: ['Highest efficiency', 'Compact size', 'Low conduction losses'],
        applications: ['AC bidirectional chargers', 'High-efficiency on-board chargers'],
      },
    ],
  },
  challenges: {
    title: 'Engineering challenges',
    items: [
      {
        challenge: 'Battery degradation',
        description:
          'Additional charge-discharge cycles may accelerate battery wear, though studies show impact is often less than 10% over vehicle lifetime with proper management.',
        mitigation: 'Intelligent state-of-charge management, limiting depth of discharge, thermal management.',
      },
      {
        challenge: 'Grid synchronisation',
        description:
          'Bidirectional inverters must precisely match grid frequency, voltage and phase to safely export power.',
        mitigation: 'Advanced grid-following and grid-forming inverter controls, compliance with IEEE 1547.',
      },
      {
        challenge: 'Anti-islanding protection',
        description:
          'Systems must detect grid outages and cease exporting power within 2 seconds to protect utility workers.',
        mitigation: 'Active anti-islanding detection methods, IEEE 1547 compliance testing.',
      },
      {
        challenge: 'Power quality',
        description: 'Exported power must meet strict harmonic distortion and power factor requirements.',
        mitigation:
          'Advanced filtering, high-switching-frequency converters, active power factor correction.',
      },
    ],
  },
};
