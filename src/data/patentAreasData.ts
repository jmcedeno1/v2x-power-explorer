export interface Technology {
  name: string;
  status: 'saturated' | 'active' | 'growing' | 'white-space';
  patents: number;
}

export interface PatentTrendPoint {
  year: number;
  [key: string]: number;
}

export interface PatentAreaDetails {
  id: string;
  name: string;
  maturity: number;
  status: 'saturated' | 'active' | 'growing' | 'white-space';
  description: string;
  keyPlayers: string[];
  technologies: Technology[];
  patentTrends: PatentTrendPoint[];
  insights: string[];
  opportunities: string[];
}

export const patentAreasData: PatentAreaDetails[] = [
  {
    id: 'core-inversion',
    name: 'Core Inversion Topologies',
    maturity: 80,
    status: 'saturated',
    description: 'Fundamental power conversion architectures for bidirectional energy flow between EVs and the grid. Includes H-bridge, multi-level, and resonant converter designs.',
    keyPlayers: ['Toyota', 'Nissan', 'Hyundai', 'ABB', 'Siemens'],
    technologies: [
      { name: 'H-Bridge Inverters', status: 'saturated', patents: 2850 },
      { name: 'Multi-level Converters', status: 'saturated', patents: 1920 },
      { name: 'Resonant Topologies', status: 'active', patents: 890 },
      { name: 'Matrix Converters', status: 'growing', patents: 320 },
    ],
    patentTrends: [
      { year: 2015, 'H-Bridge': 180, 'Multi-level': 95, 'Resonant': 45, 'Matrix': 12 },
      { year: 2016, 'H-Bridge': 210, 'Multi-level': 120, 'Resonant': 52, 'Matrix': 18 },
      { year: 2017, 'H-Bridge': 285, 'Multi-level': 165, 'Resonant': 68, 'Matrix': 25 },
      { year: 2018, 'H-Bridge': 340, 'Multi-level': 210, 'Resonant': 85, 'Matrix': 32 },
      { year: 2019, 'H-Bridge': 380, 'Multi-level': 245, 'Resonant': 105, 'Matrix': 42 },
      { year: 2020, 'H-Bridge': 395, 'Multi-level': 265, 'Resonant': 125, 'Matrix': 55 },
      { year: 2021, 'H-Bridge': 385, 'Multi-level': 280, 'Resonant': 145, 'Matrix': 65 },
      { year: 2022, 'H-Bridge': 350, 'Multi-level': 275, 'Resonant': 155, 'Matrix': 72 },
      { year: 2023, 'H-Bridge': 325, 'Multi-level': 265, 'Resonant': 110, 'Matrix': 19 },
    ],
    insights: [
      'H-Bridge designs peaked in 2020, now declining as the space is crowded',
      'Multi-level converters still see activity for high-power applications',
      'Matrix converters emerging for compact, high-density designs'
    ],
    opportunities: [
      'Hybrid topologies combining multiple approaches',
      'Integration with wide-bandgap semiconductors',
      'Modular scalable architectures'
    ]
  },
  {
    id: 'wide-bandgap',
    name: 'Wide-bandgap Semiconductors',
    maturity: 65,
    status: 'active',
    description: 'Silicon Carbide (SiC) and Gallium Nitride (GaN) power devices enabling higher efficiency, faster switching, and reduced thermal management needs.',
    keyPlayers: ['Wolfspeed', 'Infineon', 'STMicroelectronics', 'ROHM', 'ON Semiconductor'],
    technologies: [
      { name: 'SiC MOSFETs', status: 'active', patents: 1450 },
      { name: 'GaN HEMTs', status: 'growing', patents: 680 },
      { name: 'SiC Diodes', status: 'saturated', patents: 890 },
      { name: 'GaN-on-Si Integration', status: 'growing', patents: 420 },
      { name: 'Diamond Semiconductors', status: 'white-space', patents: 45 },
    ],
    patentTrends: [
      { year: 2015, 'SiC MOSFET': 65, 'GaN HEMT': 28, 'SiC Diode': 85, 'GaN-on-Si': 15 },
      { year: 2016, 'SiC MOSFET': 82, 'GaN HEMT': 38, 'SiC Diode': 92, 'GaN-on-Si': 22 },
      { year: 2017, 'SiC MOSFET': 105, 'GaN HEMT': 52, 'SiC Diode': 98, 'GaN-on-Si': 35 },
      { year: 2018, 'SiC MOSFET': 135, 'GaN HEMT': 68, 'SiC Diode': 105, 'GaN-on-Si': 48 },
      { year: 2019, 'SiC MOSFET': 175, 'GaN HEMT': 85, 'SiC Diode': 108, 'GaN-on-Si': 62 },
      { year: 2020, 'SiC MOSFET': 210, 'GaN HEMT': 105, 'SiC Diode': 112, 'GaN-on-Si': 78 },
      { year: 2021, 'SiC MOSFET': 245, 'GaN HEMT': 125, 'SiC Diode': 115, 'GaN-on-Si': 85 },
      { year: 2022, 'SiC MOSFET': 265, 'GaN HEMT': 110, 'SiC Diode': 105, 'GaN-on-Si': 55 },
      { year: 2023, 'SiC MOSFET': 168, 'GaN HEMT': 69, 'SiC Diode': 70, 'GaN-on-Si': 20 },
    ],
    insights: [
      'SiC MOSFETs dominate high-power V2G applications (>11kW)',
      'GaN gaining traction in lower-power, high-frequency applications',
      'Diamond semiconductors represent next-generation opportunity'
    ],
    opportunities: [
      'Integrated driver ICs for SiC/GaN',
      'Cost reduction through manufacturing innovations',
      'Diamond-based ultra-high-voltage devices'
    ]
  },
  {
    id: 'vpp-aggregation',
    name: 'VPP Aggregation Platforms',
    maturity: 45,
    status: 'growing',
    description: 'Software platforms that aggregate distributed EV batteries into Virtual Power Plants for grid services, demand response, and energy trading.',
    keyPlayers: ['Tesla', 'Nuvve', 'Enel X', 'OVO Energy', 'Fermata Energy'],
    technologies: [
      { name: 'Fleet Management Systems', status: 'active', patents: 520 },
      { name: 'Real-time Optimization', status: 'growing', patents: 380 },
      { name: 'Blockchain Settlement', status: 'growing', patents: 185 },
      { name: 'AI/ML Prediction', status: 'growing', patents: 290 },
      { name: 'P2P Energy Trading', status: 'white-space', patents: 75 },
    ],
    patentTrends: [
      { year: 2015, 'Fleet Mgmt': 18, 'Optimization': 12, 'Blockchain': 2, 'AI/ML': 8 },
      { year: 2016, 'Fleet Mgmt': 28, 'Optimization': 18, 'Blockchain': 8, 'AI/ML': 15 },
      { year: 2017, 'Fleet Mgmt': 42, 'Optimization': 28, 'Blockchain': 18, 'AI/ML': 25 },
      { year: 2018, 'Fleet Mgmt': 58, 'Optimization': 42, 'Blockchain': 32, 'AI/ML': 38 },
      { year: 2019, 'Fleet Mgmt': 72, 'Optimization': 55, 'Blockchain': 38, 'AI/ML': 48 },
      { year: 2020, 'Fleet Mgmt': 85, 'Optimization': 68, 'Blockchain': 35, 'AI/ML': 55 },
      { year: 2021, 'Fleet Mgmt': 92, 'Optimization': 75, 'Blockchain': 28, 'AI/ML': 52 },
      { year: 2022, 'Fleet Mgmt': 88, 'Optimization': 58, 'Blockchain': 18, 'AI/ML': 35 },
      { year: 2023, 'Fleet Mgmt': 37, 'Optimization': 24, 'Blockchain': 6, 'AI/ML': 14 },
    ],
    insights: [
      'Fleet management IP maturing as standards emerge',
      'AI/ML for load prediction seeing rapid growth',
      'Blockchain interest cooled but P2P trading remains promising'
    ],
    opportunities: [
      'Cross-border VPP aggregation',
      'Integration with renewable forecasting',
      'Dynamic pricing optimization algorithms'
    ]
  },
  {
    id: 'grid-isolated',
    name: 'Grid-isolated Algorithms',
    maturity: 20,
    status: 'white-space',
    description: 'Control algorithms enabling V2X operation during grid outages without central coordination, including islanding detection and autonomous power management.',
    keyPlayers: ['Emerging startups', 'University research', 'Tesla (Powerwall synergy)'],
    technologies: [
      { name: 'Islanding Detection', status: 'active', patents: 145 },
      { name: 'Autonomous Load Mgmt', status: 'growing', patents: 85 },
      { name: 'Mesh Grid Formation', status: 'white-space', patents: 32 },
      { name: 'Blackstart Coordination', status: 'white-space', patents: 18 },
    ],
    patentTrends: [
      { year: 2015, 'Islanding': 8, 'Autonomous': 3, 'Mesh': 1, 'Blackstart': 0 },
      { year: 2016, 'Islanding': 12, 'Autonomous': 5, 'Mesh': 2, 'Blackstart': 1 },
      { year: 2017, 'Islanding': 15, 'Autonomous': 8, 'Mesh': 3, 'Blackstart': 1 },
      { year: 2018, 'Islanding': 18, 'Autonomous': 10, 'Mesh': 4, 'Blackstart': 2 },
      { year: 2019, 'Islanding': 22, 'Autonomous': 12, 'Mesh': 5, 'Blackstart': 3 },
      { year: 2020, 'Islanding': 25, 'Autonomous': 15, 'Mesh': 6, 'Blackstart': 3 },
      { year: 2021, 'Islanding': 22, 'Autonomous': 16, 'Mesh': 5, 'Blackstart': 4 },
      { year: 2022, 'Islanding': 18, 'Autonomous': 12, 'Mesh': 4, 'Blackstart': 3 },
      { year: 2023, 'Islanding': 5, 'Autonomous': 4, 'Mesh': 2, 'Blackstart': 1 },
    ],
    insights: [
      'Very limited IP activity - significant white space',
      'Most solutions adapted from stationary storage, not V2X-native',
      'Growing interest post-California wildfires and grid instability events'
    ],
    opportunities: [
      'V2X-native islanding algorithms',
      'Multi-vehicle coordination without grid',
      'Emergency response automation'
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity Frameworks',
    maturity: 15,
    status: 'white-space',
    description: 'Security architectures protecting bidirectional energy flow from malicious attacks, including authentication, encryption, and intrusion detection for V2X systems.',
    keyPlayers: ['Argus (Continental)', 'Upstream Security', 'C2A Security', 'ChargePoint'],
    technologies: [
      { name: 'V2G Authentication', status: 'growing', patents: 95 },
      { name: 'Energy Flow Encryption', status: 'white-space', patents: 42 },
      { name: 'Intrusion Detection', status: 'white-space', patents: 28 },
      { name: 'Secure Boot for EVSE', status: 'growing', patents: 65 },
    ],
    patentTrends: [
      { year: 2015, 'Authentication': 2, 'Encryption': 1, 'Intrusion': 0, 'Secure Boot': 3 },
      { year: 2016, 'Authentication': 4, 'Encryption': 2, 'Intrusion': 1, 'Secure Boot': 5 },
      { year: 2017, 'Authentication': 6, 'Encryption': 3, 'Intrusion': 2, 'Secure Boot': 7 },
      { year: 2018, 'Authentication': 10, 'Encryption': 5, 'Intrusion': 3, 'Secure Boot': 9 },
      { year: 2019, 'Authentication': 15, 'Encryption': 7, 'Intrusion': 5, 'Secure Boot': 12 },
      { year: 2020, 'Authentication': 18, 'Encryption': 9, 'Intrusion': 6, 'Secure Boot': 14 },
      { year: 2021, 'Authentication': 20, 'Encryption': 8, 'Intrusion': 6, 'Secure Boot': 10 },
      { year: 2022, 'Authentication': 15, 'Encryption': 5, 'Intrusion': 4, 'Secure Boot': 4 },
      { year: 2023, 'Authentication': 5, 'Encryption': 2, 'Intrusion': 1, 'Secure Boot': 1 },
    ],
    insights: [
      'Critically underserved area given V2X security implications',
      'Most V2G cybersecurity IP borrowed from general EV charging',
      'ISO 15118-20 driving some authentication innovation'
    ],
    opportunities: [
      'V2X-specific threat detection',
      'Secure multi-party energy transactions',
      'Hardware security modules for bidirectional chargers'
    ]
  }
];
