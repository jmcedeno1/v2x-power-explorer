export interface Technology {
  name: string;
  status: 'saturated' | 'active' | 'growing' | 'white-space';
  patents: number;
  description: string;
}

export interface KeyPlayer {
  name: string;
  description: string;
  ipFocus: string[];
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
  keyPlayers: KeyPlayer[];
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
    keyPlayers: [
      { 
        name: 'Toyota', 
        description: 'Japanese automotive giant pioneering hybrid and EV technology since 1997.',
        ipFocus: ['Bidirectional onboard chargers', 'Hybrid powertrain inverters', 'Solid-state battery integration']
      },
      { 
        name: 'Nissan', 
        description: 'Early V2G pioneer with Leaf, first mass-market EV with V2H capability.',
        ipFocus: ['CHAdeMO V2X protocols', 'Home energy management systems', 'Vehicle-to-building solutions']
      },
      { 
        name: 'Hyundai', 
        description: 'Korean automaker rapidly expanding EV portfolio with V2L features.',
        ipFocus: ['Vehicle-to-load technology', '800V architecture', 'Bidirectional charging systems']
      },
      { 
        name: 'ABB', 
        description: 'Swiss-Swedish multinational specializing in power and automation.',
        ipFocus: ['High-power DC charging', 'Grid integration solutions', 'Industrial inverter systems']
      },
      { 
        name: 'Siemens', 
        description: 'German conglomerate with extensive power electronics expertise.',
        ipFocus: ['Smart grid infrastructure', 'EV charging networks', 'Power conversion modules']
      }
    ],
    technologies: [
      { 
        name: 'H-Bridge Inverters', 
        status: 'saturated', 
        patents: 2850,
        description: 'Classic four-switch topology for DC-AC conversion. Simple, reliable, but limited in power quality. Widely used in entry-level V2X systems.'
      },
      { 
        name: 'Multi-level Converters', 
        status: 'saturated', 
        patents: 1920,
        description: 'Advanced topology using multiple voltage levels to reduce harmonic distortion. Enables higher power and efficiency for grid-tied applications.'
      },
      { 
        name: 'Resonant Topologies', 
        status: 'active', 
        patents: 890,
        description: 'Soft-switching converters using LC resonance for reduced switching losses. Critical for high-frequency, high-efficiency bidirectional charging.'
      },
      { 
        name: 'Matrix Converters', 
        status: 'growing', 
        patents: 320,
        description: 'Direct AC-AC conversion without intermediate DC link. Compact design with potential for higher power density in V2X applications.'
      },
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
    keyPlayers: [
      { 
        name: 'Wolfspeed', 
        description: 'Leading SiC wafer and device manufacturer, spun off from Cree.',
        ipFocus: ['SiC MOSFET technology', 'High-voltage power modules', 'Automotive-grade devices']
      },
      { 
        name: 'Infineon', 
        description: 'German semiconductor giant, #1 in automotive power semiconductors.',
        ipFocus: ['CoolSiC technology', 'GaN power ICs', 'Integrated driver solutions']
      },
      { 
        name: 'STMicroelectronics', 
        description: 'European semiconductor leader with strong automotive presence.',
        ipFocus: ['SiC power modules', 'Tesla partnership technology', 'Wide-bandgap integration']
      },
      { 
        name: 'ROHM', 
        description: 'Japanese semiconductor company, early SiC technology pioneer.',
        ipFocus: ['Full SiC power modules', 'Trench gate SiC MOSFETs', 'Automotive power solutions']
      },
      { 
        name: 'ON Semiconductor', 
        description: 'US-based company with growing SiC portfolio for EV applications.',
        ipFocus: ['EliteSiC technology', 'Intelligent power modules', 'EV traction inverters']
      }
    ],
    technologies: [
      { 
        name: 'SiC MOSFETs', 
        status: 'active', 
        patents: 1450,
        description: 'Silicon Carbide transistors enabling 10x lower losses than silicon. Key enabler for efficient high-power V2G chargers above 11kW.'
      },
      { 
        name: 'GaN HEMTs', 
        status: 'growing', 
        patents: 680,
        description: 'Gallium Nitride high-electron-mobility transistors for ultra-fast switching. Ideal for compact, high-frequency bidirectional converters.'
      },
      { 
        name: 'SiC Diodes', 
        status: 'saturated', 
        patents: 890,
        description: 'First commercial wide-bandgap devices, now mature. Zero reverse recovery enables efficient rectification in V2X systems.'
      },
      { 
        name: 'GaN-on-Si Integration', 
        status: 'growing', 
        patents: 420,
        description: 'Growing GaN on silicon substrates for cost reduction. Enables monolithic integration of power and control for compact chargers.'
      },
      { 
        name: 'Diamond Semiconductors', 
        status: 'white-space', 
        patents: 45,
        description: 'Ultimate wide-bandgap material with 20x thermal conductivity of silicon. Early research stage but transformative potential for extreme power.'
      },
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
    keyPlayers: [
      { 
        name: 'Tesla', 
        description: 'EV and energy company with integrated Autobidder VPP software.',
        ipFocus: ['Autobidder optimization', 'Powerwall/Megapack integration', 'Real-time grid services']
      },
      { 
        name: 'Nuvve', 
        description: 'Pure-play V2G company founded by V2G pioneer Professor Kempton.',
        ipFocus: ['GIVe platform', 'School bus V2G programs', 'Fleet aggregation software']
      },
      { 
        name: 'Enel X', 
        description: 'Global energy company\'s e-mobility and demand response division.',
        ipFocus: ['JuiceNet platform', 'Demand response aggregation', 'Smart charging optimization']
      },
      { 
        name: 'OVO Energy', 
        description: 'UK energy supplier with VPP and V2G services for residential customers.',
        ipFocus: ['Kaluza platform', 'Residential VPP', 'Time-of-use optimization']
      },
      { 
        name: 'Fermata Energy', 
        description: 'US V2G company focused on commercial fleet deployments.',
        ipFocus: ['Bidirectional charger hardware', 'Fleet management software', 'Behind-the-meter optimization']
      }
    ],
    technologies: [
      { 
        name: 'Fleet Management Systems', 
        status: 'active', 
        patents: 520,
        description: 'Software coordinating charging/discharging across vehicle fleets while meeting mobility needs. Balances energy revenue with operational requirements.'
      },
      { 
        name: 'Real-time Optimization', 
        status: 'growing', 
        patents: 380,
        description: 'Algorithms optimizing V2G dispatch in real-time based on grid signals, prices, and vehicle availability. Critical for frequency regulation revenue.'
      },
      { 
        name: 'Blockchain Settlement', 
        status: 'growing', 
        patents: 185,
        description: 'Distributed ledger for transparent energy transaction settlement. Enables peer-to-peer trading and automated smart contract payments.'
      },
      { 
        name: 'AI/ML Prediction', 
        status: 'growing', 
        patents: 290,
        description: 'Machine learning for predicting vehicle availability, energy prices, and grid needs. Enables proactive optimization of V2G scheduling.'
      },
      { 
        name: 'P2P Energy Trading', 
        status: 'white-space', 
        patents: 75,
        description: 'Direct energy trading between EV owners without utility intermediary. Nascent space with regulatory hurdles but high disruption potential.'
      },
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
    keyPlayers: [
      { 
        name: 'Emerging startups', 
        description: 'Early-stage companies exploring decentralized energy resilience.',
        ipFocus: ['Microgrid controllers', 'Islanding detection', 'Emergency power systems']
      },
      { 
        name: 'University research', 
        description: 'Academic institutions leading foundational research in grid resilience.',
        ipFocus: ['Distributed control theory', 'Multi-agent systems', 'Resilience algorithms']
      },
      { 
        name: 'Tesla (Powerwall synergy)', 
        description: 'Leveraging stationary storage expertise for V2X backup applications.',
        ipFocus: ['Backup Gateway technology', 'Seamless transfer switches', 'Home islanding systems']
      }
    ],
    technologies: [
      { 
        name: 'Islanding Detection', 
        status: 'active', 
        patents: 145,
        description: 'Methods to detect when grid connection is lost. Critical safety requirement enabling transition to backup mode without backfeeding utility.'
      },
      { 
        name: 'Autonomous Load Mgmt', 
        status: 'growing', 
        patents: 85,
        description: 'Algorithms prioritizing critical loads during outages without user intervention. Manages limited EV battery for maximum resilience value.'
      },
      { 
        name: 'Mesh Grid Formation', 
        status: 'white-space', 
        patents: 32,
        description: 'Multiple EVs forming ad-hoc power networks during emergencies. Enables neighborhood-scale resilience beyond single-home backup.'
      },
      { 
        name: 'Blackstart Coordination', 
        status: 'white-space', 
        patents: 18,
        description: 'Using EVs to restart grid sections after complete blackout. Highly complex but strategically valuable for grid operators.'
      },
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
    keyPlayers: [
      { 
        name: 'Argus (Continental)', 
        description: 'Israeli automotive cybersecurity company acquired by Continental.',
        ipFocus: ['In-vehicle network protection', 'V2X security modules', 'OTA update security']
      },
      { 
        name: 'Upstream Security', 
        description: 'Cloud-based automotive cybersecurity platform company.',
        ipFocus: ['Vehicle SOC services', 'Fleet-wide threat detection', 'Anomaly detection AI']
      },
      { 
        name: 'C2A Security', 
        description: 'Automotive cybersecurity lifecycle management solutions.',
        ipFocus: ['DevSecOps for vehicles', 'Vulnerability management', 'Compliance automation']
      },
      { 
        name: 'ChargePoint', 
        description: 'EV charging network operator with security focus.',
        ipFocus: ['Secure charging protocols', 'Network security', 'Payment protection']
      }
    ],
    technologies: [
      { 
        name: 'V2G Authentication', 
        status: 'growing', 
        patents: 95,
        description: 'Protocols verifying identity of vehicles, chargers, and grid operators. Based on ISO 15118 PKI but adapted for bidirectional requirements.'
      },
      { 
        name: 'Energy Flow Encryption', 
        status: 'white-space', 
        patents: 42,
        description: 'Cryptographic protection of energy transaction data and control signals. Prevents manipulation of charging/discharging commands.'
      },
      { 
        name: 'Intrusion Detection', 
        status: 'white-space', 
        patents: 28,
        description: 'Systems detecting cyberattacks on V2X infrastructure in real-time. Critical for preventing grid-scale attacks via compromised EVs.'
      },
      { 
        name: 'Secure Boot for EVSE', 
        status: 'growing', 
        patents: 65,
        description: 'Hardware-rooted trust ensuring charger firmware integrity. Prevents installation of malicious code on charging infrastructure.'
      },
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
