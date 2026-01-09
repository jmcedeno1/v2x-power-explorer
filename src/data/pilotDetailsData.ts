import { Pilot } from '@/types/v2x';

export interface PilotDetails extends Pilot {
  description: string;
  businessModel: {
    type: string;
    description: string;
  };
  metrics: {
    powerLevel: string;
    vehicles: number;
    efficiency: string;
    demandChargeReduction?: string;
    annualRevenue?: string;
    annualSavings?: string;
    investment?: string;
    peakReduction?: string;
    backupCapability?: string;
    solarConsumption?: string;
  };
  standardization: {
    standard: string;
    status: string;
  };
  technology: {
    overview: string;
    hardware: {
      name: string;
      details: string[];
    }[];
    software: {
      name: string;
      details: string[];
    }[];
    control: {
      name: string;
      details: string[];
    }[];
  };
  projectInfo: {
    partner: string;
    description: string;
  };
  timeline: {
    phase: string;
    year: string;
    description: string;
  }[];
}

export const pilotDetailsMap: Record<string, PilotDetails> = {
  p1: {
    id: 'p1',
    name: 'Copenhagen Bus Depot V2G',
    type: 'bus_depot',
    location: 'Denmark',
    powerLevel: '600 kW',
    vehicleCount: 12,
    gridServices: ['Frequency regulation', 'Peak shaving', 'Grid balancing'],
    bottlenecks: ['Warranty constraints', 'Coordination complexity'],
    maturity: 'depot',
    status: 'active',
    description: 'A flagship V2G demonstration at the Movia public transit depot in Copenhagen, integrating 12 electric buses with Denmark\'s national grid operator Energinet. Established through a 2022 partnership agreement, this pilot showcases how municipal transit fleets can provide critical grid services during off-peak hours while maintaining full operational readiness for daily routes.',
    businessModel: {
      type: 'Fleet-as-a-Service',
      description: 'Commercial & Municipal. Revenue through grid services and demand charge avoidance.'
    },
    metrics: {
      powerLevel: '600 kW',
      vehicles: 12,
      efficiency: '89%',
      demandChargeReduction: '45%',
      annualRevenue: '€120K',
      investment: '€2.4M'
    },
    standardization: {
      standard: 'ISO 15118-20',
      status: 'Full compliance. Aligned with Danish grid codes for V2G.'
    },
    technology: {
      overview: 'Centralized DC Bus Depot Architecture',
      hardware: [
        { name: 'Central Power Cabinet', details: ['600 kW max output', 'Modular 50 kW blocks'] },
        { name: 'CCS2 Connectors', details: ['Bidirectional capable', 'ISO 15118-20 compliant'] }
      ],
      software: [
        { name: 'Fleet EMS', details: ['Real-time SoC monitoring', 'Dispatch optimization'] },
        { name: 'Grid Interface', details: ['TSO signal integration', 'Frequency response'] }
      ],
      control: [
        { name: 'Grid Impact', details: ['Frequency regulation', 'Peak shaving'] },
        { name: 'Access Control', details: ['Operator priority', 'Grid operator dispatch'] }
      ]
    },
    projectInfo: {
      partner: 'Movia (Copenhagen Transit) & Energinet',
      description: 'Integration of electric bus fleet with Danish grid for frequency regulation and peak shaving services during off-peak hours.'
    },
    timeline: [
      { phase: 'Partnership Announcement', year: '2022', description: 'Agreement with Movia and Energinet' },
      { phase: 'Infrastructure Deployment', year: '2023', description: '12 bidirectional chargers installed' },
      { phase: 'Pilot Operations', year: '2023', description: 'Initial grid services testing' },
      { phase: 'Commercial Operations', year: '2024', description: 'Full V2G service provision' }
    ]
  },
  p2: {
    id: 'p2',
    name: 'Rotterdam Port Logistics Hub',
    type: 'port',
    location: 'Netherlands',
    powerLevel: '1.2 MW',
    vehicleCount: 24,
    gridServices: ['Peak shaving', 'Demand response', 'Energy arbitrage'],
    bottlenecks: ['Interconnection delays', 'Utility approval'],
    maturity: 'depot',
    status: 'active',
    description: 'Europe\'s first megawatt-scale V2G deployment in an active port environment, located at the Port of Rotterdam in partnership with grid operator Stedin. This pilot integrates 24 heavy-duty electric terminal tractors and reach stackers, demonstrating how industrial logistics hubs can optimize energy costs while supporting grid stability through coordinated vehicle-to-grid operations.',
    businessModel: {
      type: 'Industrial Energy Hub',
      description: 'Port logistics optimization. Combines charging with grid services for terminal operators.'
    },
    metrics: {
      powerLevel: '1.2 MW',
      vehicles: 24,
      efficiency: '91%',
      peakReduction: '60%',
      annualSavings: '€280K',
      investment: '€4.8M'
    },
    standardization: {
      standard: 'MCS Preliminary',
      status: 'Testing megawatt charging protocols. Aligned with EU grid codes.'
    },
    technology: {
      overview: 'Megawatt-Scale Port Infrastructure',
      hardware: [
        { name: 'MCS Chargers', details: ['Up to 500 kW per point', 'Heavy-duty connectors'] },
        { name: 'Grid Substation', details: ['Direct MV connection', '2 MW capacity'] }
      ],
      software: [
        { name: 'Terminal EMS', details: ['Crane scheduling integration', 'Load forecasting'] },
        { name: 'Market Platform', details: ['Day-ahead bidding', 'Real-time arbitrage'] }
      ],
      control: [
        { name: 'Grid Impact', details: ['Peak shaving', 'Congestion relief'] },
        { name: 'Access Control', details: ['Port operator priority', 'Grid signals'] }
      ]
    },
    projectInfo: {
      partner: 'Port of Rotterdam & Stedin',
      description: 'First megawatt-scale V2G deployment in European port environment, integrating electric terminal tractors and reach stackers.'
    },
    timeline: [
      { phase: 'Feasibility Study', year: '2022', description: 'Grid connection assessment' },
      { phase: 'Infrastructure Build', year: '2023', description: 'MCS charger installation' },
      { phase: 'Fleet Integration', year: '2024', description: '24 vehicles connected' },
      { phase: 'Full Operations', year: '2024', description: 'Commercial grid services active' }
    ]
  },
  p3: {
    id: 'p3',
    name: 'California School Bus V2G',
    type: 'fleet',
    location: 'USA',
    powerLevel: '300 kW',
    vehicleCount: 8,
    gridServices: ['Frequency regulation', 'Backup power'],
    bottlenecks: ['Double taxation', 'Battery warranty'],
    maturity: 'pilot',
    status: 'completed',
    description: 'A pioneering school bus V2G pilot funded by the California Energy Commission, deploying 8 Type C electric school buses in partnership with Blue Bird and Nuvve. This demonstration proved that school buses—with their predictable schedules and long idle periods—are ideal candidates for grid services, earning revenue during 10am-2pm windows and summer breaks while providing emergency backup power to schools.',
    businessModel: {
      type: 'Public Fleet Services',
      description: 'School district fleet monetization. Grid services during idle hours (10am-2pm, summer).'
    },
    metrics: {
      powerLevel: '300 kW',
      vehicles: 8,
      efficiency: '88%',
      annualRevenue: '$45K',
      backupCapability: '100%',
      investment: '$1.2M'
    },
    standardization: {
      standard: 'SAE J3072',
      status: 'Compliant with California Rule 21 for V2G interconnection.'
    },
    technology: {
      overview: 'School Fleet Bidirectional System',
      hardware: [
        { name: 'Type 2 Chargers', details: ['40 kW per bus', 'CCS1 connectors'] },
        { name: 'Central Controller', details: ['Fleet aggregation', 'Grid interface'] }
      ],
      software: [
        { name: 'Route Planning', details: ['SoC prediction', 'Availability forecasting'] },
        { name: 'Grid Services', details: ['CAISO integration', 'Real-time dispatch'] }
      ],
      control: [
        { name: 'Grid Impact', details: ['Frequency regulation', 'Emergency backup'] },
        { name: 'Access Control', details: ['School schedule priority', 'Utility dispatch'] }
      ]
    },
    projectInfo: {
      partner: 'Blue Bird & Nuvve',
      description: 'Pioneering V2G deployment with electric school buses, demonstrating grid services and emergency backup for schools and communities.'
    },
    timeline: [
      { phase: 'Grant Award', year: '2021', description: 'CEC funding secured' },
      { phase: 'Bus Delivery', year: '2022', description: '8 electric buses deployed' },
      { phase: 'V2G Testing', year: '2022', description: 'Initial grid integration' },
      { phase: 'Project Completion', year: '2023', description: 'Full demonstration completed' }
    ]
  },
  p4: {
    id: 'p4',
    name: 'Tokyo Building Integration',
    type: 'building',
    location: 'Japan',
    powerLevel: '200 kW',
    vehicleCount: 15,
    gridServices: ['Demand charge avoidance', 'Emergency backup'],
    bottlenecks: ['Building code integration', 'User acceptance'],
    maturity: 'depot',
    status: 'active',
    description: 'A landmark vehicle-to-building (V2B) integration project in Tokyo\'s commercial district, developed by Nissan and Mitsubishi Electric. This pilot connects 15 company fleet EVs to an office complex\'s energy management system, providing daily peak shaving during business hours and critical earthquake emergency backup power—a key priority in Japan\'s disaster-resilient building strategies.',
    businessModel: {
      type: 'Building Energy Management',
      description: 'Commercial building V2B. Peak shaving and emergency backup for office complexes.'
    },
    metrics: {
      powerLevel: '200 kW',
      vehicles: 15,
      efficiency: '90%',
      peakReduction: '30%',
      backupCapability: '72 hrs',
      investment: '¥350M'
    },
    standardization: {
      standard: 'CHAdeMO V2H/V2B',
      status: 'Full compliance with Japanese V2X standards and building codes.'
    },
    technology: {
      overview: 'Integrated Building-Vehicle Energy System',
      hardware: [
        { name: 'CHAdeMO Chargers', details: ['Bidirectional 22 kW each', 'V2H certified'] },
        { name: 'Building Interface', details: ['BMS integration', 'Transfer switch'] }
      ],
      software: [
        { name: 'Building EMS', details: ['Load prediction', 'EV scheduling'] },
        { name: 'Disaster Mode', details: ['Automatic failover', 'Priority loads'] }
      ],
      control: [
        { name: 'Grid Impact', details: ['Peak shaving', 'Demand response'] },
        { name: 'Access Control', details: ['Employee priority', 'Building operator'] }
      ]
    },
    projectInfo: {
      partner: 'Nissan & Mitsubishi Electric',
      description: 'Integration of company fleet EVs with commercial building energy system for peak shaving and earthquake emergency backup power.'
    },
    timeline: [
      { phase: 'Design Phase', year: '2022', description: 'Building integration planning' },
      { phase: 'Installation', year: '2023', description: 'V2B infrastructure deployment' },
      { phase: 'Commissioning', year: '2023', description: 'System testing and certification' },
      { phase: 'Operations', year: '2024', description: 'Daily V2B operations active' }
    ]
  },
  p5: {
    id: 'p5',
    name: 'Munich Logistics Center',
    type: 'logistics',
    location: 'Germany',
    powerLevel: '800 kW',
    vehicleCount: 18,
    gridServices: ['Peak shaving', 'Self-consumption optimization'],
    bottlenecks: ['Grid code compliance', 'Fleet coordination'],
    maturity: 'depot',
    status: 'active',
    description: 'A solar-integrated logistics hub operated by BMW Group in partnership with E.ON, located at a last-mile delivery center near Munich. This pilot combines 500 kWp rooftop solar, a 200 kWh stationary battery, and 18 electric delivery vehicles to maximize renewable self-consumption while providing grid support services—demonstrating a replicable model for sustainable logistics operations.',
    businessModel: {
      type: 'Logistics Hub Optimization',
      description: 'Last-mile delivery fleet. Combining solar self-consumption with grid services.'
    },
    metrics: {
      powerLevel: '800 kW',
      vehicles: 18,
      efficiency: '92%',
      solarConsumption: '85%',
      annualSavings: '€180K',
      investment: '€3.2M'
    },
    standardization: {
      standard: 'ISO 15118-20',
      status: 'VDE-AR-N 4110 compliant for German grid connection.'
    },
    technology: {
      overview: 'Solar-Integrated Logistics Hub',
      hardware: [
        { name: 'DC Chargers', details: ['50 kW bidirectional', 'CCS2 compatible'] },
        { name: 'Solar + BESS', details: ['500 kWp PV', '200 kWh battery'] }
      ],
      software: [
        { name: 'Fleet Manager', details: ['Route optimization', 'SoC prediction'] },
        { name: 'Energy Platform', details: ['Solar forecasting', 'Grid optimization'] }
      ],
      control: [
        { name: 'Grid Impact', details: ['Self-consumption', 'Feed-in management'] },
        { name: 'Access Control', details: ['Dispatch priority', 'Grid operator signals'] }
      ]
    },
    projectInfo: {
      partner: 'BMW Group & E.ON',
      description: 'Integration of electric delivery fleet with on-site solar generation for maximum self-consumption and grid support services.'
    },
    timeline: [
      { phase: 'Site Planning', year: '2022', description: 'Solar and V2G design' },
      { phase: 'Construction', year: '2023', description: 'Infrastructure installation' },
      { phase: 'Fleet Transition', year: '2023', description: '18 EVs integrated' },
      { phase: 'Full Operation', year: '2024', description: 'V2G services active' }
    ]
  },
  p6: {
    id: 'p6',
    name: 'Hamburg Port MW Trial',
    type: 'port',
    location: 'Germany',
    powerLevel: '2.5 MW',
    vehicleCount: 35,
    gridServices: ['Frequency regulation', 'Congestion management', 'RES integration'],
    bottlenecks: ['MCS infrastructure', 'Scale coordination'],
    maturity: 'grid_critical',
    status: 'planned',
    description: 'Europe\'s most ambitious grid-critical V2G project, planned for Hamburg Port in collaboration with transmission operator 50Hertz. This MW-scale trial will deploy 35 heavy-duty electric vehicles with megawatt charging system (MCS) infrastructure, targeting grid-forming capabilities and black-start support—establishing ports as critical energy infrastructure for Germany\'s renewable energy transition.',
    businessModel: {
      type: 'Grid-Critical Infrastructure',
      description: 'Megawatt-scale port energy hub. Combining MCS charging with grid-critical services.'
    },
    metrics: {
      powerLevel: '2.5 MW',
      vehicles: 35,
      efficiency: '93%',
      annualRevenue: '€500K',
      investment: '€12M'
    },
    standardization: {
      standard: 'MCS (Megawatt Charging)',
      status: 'Developing MCS integration with German grid codes for MW-scale V2G.'
    },
    technology: {
      overview: 'Megawatt Charging + V2G Hub',
      hardware: [
        { name: 'MCS Chargers', details: ['Up to 1 MW each', '3000A connectors'] },
        { name: 'Grid Infrastructure', details: ['5 MVA substation', 'Grid-forming inverters'] }
      ],
      software: [
        { name: 'Port EMS', details: ['Terminal optimization', 'Vessel scheduling'] },
        { name: 'Grid Platform', details: ['TSO integration', 'Ancillary services'] }
      ],
      control: [
        { name: 'Grid Impact', details: ['Grid-forming', 'Black-start support'] },
        { name: 'Access Control', details: ['Port priority', 'TSO dispatch'] }
      ]
    },
    projectInfo: {
      partner: 'Hamburg Port Authority & 50Hertz',
      description: 'First grid-critical megawatt-scale V2G deployment, demonstrating grid-forming capabilities for port infrastructure and renewable integration.'
    },
    timeline: [
      { phase: 'Concept Design', year: '2024', description: 'Technical feasibility and grid studies' },
      { phase: 'Infrastructure Planning', year: '2025', description: 'MCS and grid connection design' },
      { phase: 'Construction', year: '2026', description: 'Substation and charger installation' },
      { phase: 'Commissioning', year: '2027', description: 'Grid-critical operations begin' }
    ]
  }
};
