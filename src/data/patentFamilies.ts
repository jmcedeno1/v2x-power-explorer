// Precomputed patent family analytics - snapshot from the lens.org patent corpus.
// Each patent is matched by title and abstract to one or more V2G technology families.

export type PatentFamilyStatus = 'growing' | 'active' | 'saturated' | 'emerging';

export type PatentSubTech = {
  name: string;
  total: number;
  status: PatentFamilyStatus;
  perYear: { year: number; count: number }[];
};

export type PatentFamily = {
  name: string;
  description: string;
  total: number;
  minYear: number;
  maxYear: number;
  granted2426: number;
  filings2425: number;
  share5: number;
  status: PatentFamilyStatus;
  perYear: { year: number; apps: number; grants: number }[];
  subs: PatentSubTech[];
  players: { name: string; count: number }[];
  opportunities: string[];
};

export const patentFamilies: PatentFamily[] = [
  {
    "name": "Bidirectional Converter / Inverter",
    "description": "Power electronics that let energy flow in both directions between the battery and the grid. Includes on-board chargers, dual-active-bridge stages and off-board bidirectional inverters.",
    "total": 3097,
    "minYear": 1976,
    "maxYear": 2026,
    "granted2426": 327,
    "filings2425": 432,
    "share5": 55,
    "status": "growing",
    "perYear": [
      {
        "year": 2016,
        "apps": 83,
        "grants": 38
      },
      {
        "year": 2017,
        "apps": 68,
        "grants": 50
      },
      {
        "year": 2018,
        "apps": 70,
        "grants": 66
      },
      {
        "year": 2019,
        "apps": 113,
        "grants": 76
      },
      {
        "year": 2020,
        "apps": 130,
        "grants": 90
      },
      {
        "year": 2021,
        "apps": 162,
        "grants": 96
      },
      {
        "year": 2022,
        "apps": 173,
        "grants": 121
      },
      {
        "year": 2023,
        "apps": 171,
        "grants": 115
      },
      {
        "year": 2024,
        "apps": 209,
        "grants": 143
      },
      {
        "year": 2025,
        "apps": 223,
        "grants": 139
      },
      {
        "year": 2026,
        "apps": 110,
        "grants": 45
      }
    ],
    "subs": [
      {
        "name": "On-board charger (OBC)",
        "total": 94,
        "status": "growing",
        "perYear": [
          {
            "year": 2016,
            "count": 3
          },
          {
            "year": 2017,
            "count": 1
          },
          {
            "year": 2018,
            "count": 4
          },
          {
            "year": 2019,
            "count": 7
          },
          {
            "year": 2020,
            "count": 3
          },
          {
            "year": 2021,
            "count": 11
          },
          {
            "year": 2022,
            "count": 16
          },
          {
            "year": 2023,
            "count": 10
          },
          {
            "year": 2024,
            "count": 15
          },
          {
            "year": 2025,
            "count": 20
          },
          {
            "year": 2026,
            "count": 3
          }
        ]
      },
      {
        "name": "Dual-active-bridge",
        "total": 13,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 1
          },
          {
            "year": 2017,
            "count": 1
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 1
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 3
          },
          {
            "year": 2023,
            "count": 1
          },
          {
            "year": 2024,
            "count": 1
          },
          {
            "year": 2025,
            "count": 3
          },
          {
            "year": 2026,
            "count": 2
          }
        ]
      },
      {
        "name": "Bidirectional inverter",
        "total": 131,
        "status": "growing",
        "perYear": [
          {
            "year": 2016,
            "count": 12
          },
          {
            "year": 2017,
            "count": 4
          },
          {
            "year": 2018,
            "count": 7
          },
          {
            "year": 2019,
            "count": 11
          },
          {
            "year": 2020,
            "count": 7
          },
          {
            "year": 2021,
            "count": 13
          },
          {
            "year": 2022,
            "count": 11
          },
          {
            "year": 2023,
            "count": 11
          },
          {
            "year": 2024,
            "count": 10
          },
          {
            "year": 2025,
            "count": 17
          },
          {
            "year": 2026,
            "count": 9
          }
        ]
      },
      {
        "name": "Wide-bandgap (SiC/GaN)",
        "total": 1,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 1
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 0
          }
        ]
      }
    ],
    "players": [
      {
        "name": "TOYOTA MOTOR CO LTD",
        "count": 144
      },
      {
        "name": "HYUNDAI MOTOR CO LTD",
        "count": 90
      },
      {
        "name": "BYD CO LTD",
        "count": 80
      },
      {
        "name": "FORD GLOBAL TECH LLC",
        "count": 50
      },
      {
        "name": "GM GLOBAL TECH OPERATIONS LLC",
        "count": 41
      },
      {
        "name": "KIA CORP",
        "count": 39
      },
      {
        "name": "STATE GRID CORP CHINA",
        "count": 31
      },
      {
        "name": "KIA MOTORS CORP",
        "count": 29
      },
      {
        "name": "HUAWEI DIGITAL POWER TECH CO LTD",
        "count": 26
      }
    ],
    "opportunities": [
      "Integrated OBC + DC/DC stages to shrink onboard footprint",
      "Wide-bandgap devices for higher efficiency at 11-22 kW",
      "Modular multi-port topologies for V2G plus solar and storage"
    ]
  },
  {
    "name": "Charging Infrastructure & EVSE",
    "description": "Charging hardware and site-level systems: bidirectional wallboxes, depot chargers, DC hubs and the connectors and cables that carry two-way power.",
    "total": 802,
    "minYear": 1994,
    "maxYear": 2026,
    "granted2426": 112,
    "filings2425": 187,
    "share5": 74,
    "status": "growing",
    "perYear": [
      {
        "year": 2016,
        "apps": 13,
        "grants": 4
      },
      {
        "year": 2017,
        "apps": 10,
        "grants": 10
      },
      {
        "year": 2018,
        "apps": 7,
        "grants": 8
      },
      {
        "year": 2019,
        "apps": 16,
        "grants": 12
      },
      {
        "year": 2020,
        "apps": 37,
        "grants": 24
      },
      {
        "year": 2021,
        "apps": 38,
        "grants": 18
      },
      {
        "year": 2022,
        "apps": 50,
        "grants": 21
      },
      {
        "year": 2023,
        "apps": 71,
        "grants": 40
      },
      {
        "year": 2024,
        "apps": 97,
        "grants": 49
      },
      {
        "year": 2025,
        "apps": 90,
        "grants": 50
      },
      {
        "year": 2026,
        "apps": 60,
        "grants": 13
      }
    ],
    "subs": [
      {
        "name": "Depot & fleet charging",
        "total": 16,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 1
          },
          {
            "year": 2022,
            "count": 2
          },
          {
            "year": 2023,
            "count": 1
          },
          {
            "year": 2024,
            "count": 4
          },
          {
            "year": 2025,
            "count": 7
          },
          {
            "year": 2026,
            "count": 1
          }
        ]
      },
      {
        "name": "Residential wallbox",
        "total": 22,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 3
          },
          {
            "year": 2022,
            "count": 2
          },
          {
            "year": 2023,
            "count": 1
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 14
          },
          {
            "year": 2026,
            "count": 1
          }
        ]
      },
      {
        "name": "DC fast charging hubs",
        "total": 24,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 2
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 3
          },
          {
            "year": 2022,
            "count": 2
          },
          {
            "year": 2023,
            "count": 6
          },
          {
            "year": 2024,
            "count": 2
          },
          {
            "year": 2025,
            "count": 4
          },
          {
            "year": 2026,
            "count": 3
          }
        ]
      },
      {
        "name": "Connectors & cables",
        "total": 53,
        "status": "growing",
        "perYear": [
          {
            "year": 2016,
            "count": 3
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 3
          },
          {
            "year": 2019,
            "count": 1
          },
          {
            "year": 2020,
            "count": 2
          },
          {
            "year": 2021,
            "count": 2
          },
          {
            "year": 2022,
            "count": 9
          },
          {
            "year": 2023,
            "count": 8
          },
          {
            "year": 2024,
            "count": 6
          },
          {
            "year": 2025,
            "count": 10
          },
          {
            "year": 2026,
            "count": 3
          }
        ]
      }
    ],
    "players": [
      {
        "name": "TOYOTA MOTOR CO LTD",
        "count": 26
      },
      {
        "name": "GM GLOBAL TECH OPERATIONS LLC",
        "count": 22
      },
      {
        "name": "VOLVO CAR CORP",
        "count": 21
      },
      {
        "name": "HYUNDAI MOTOR CO LTD",
        "count": 16
      },
      {
        "name": "KIA CORP",
        "count": 14
      },
      {
        "name": "MYONGJI UNIV INDUSTRY AND ACADEMIA COOPERATION FOUNDATION",
        "count": 13
      },
      {
        "name": "STATE GRID CORP CHINA",
        "count": 13
      },
      {
        "name": "WOBBEN PROPERTIES GMBH",
        "count": 13
      },
      {
        "name": "GUANGZHOU POWER SUPPLY BUREAU GUANGDONG POWER GRID CO LTD",
        "count": 13
      }
    ],
    "opportunities": [
      "Cost-optimised bidirectional AC wallboxes for households",
      "Depot-scale DC hubs with shared power blocks",
      "Retrofit kits that upgrade unidirectional EVSE to V2G"
    ]
  },
  {
    "name": "Battery Management & Degradation",
    "description": "Battery-side IP that makes frequent bidirectional cycling acceptable: state estimation, degradation models, balancing and thermal safety.",
    "total": 630,
    "minYear": 1983,
    "maxYear": 2026,
    "granted2426": 31,
    "filings2425": 117,
    "share5": 57,
    "status": "growing",
    "perYear": [
      {
        "year": 2016,
        "apps": 24,
        "grants": 3
      },
      {
        "year": 2017,
        "apps": 16,
        "grants": 5
      },
      {
        "year": 2018,
        "apps": 16,
        "grants": 6
      },
      {
        "year": 2019,
        "apps": 27,
        "grants": 6
      },
      {
        "year": 2020,
        "apps": 26,
        "grants": 8
      },
      {
        "year": 2021,
        "apps": 42,
        "grants": 9
      },
      {
        "year": 2022,
        "apps": 43,
        "grants": 9
      },
      {
        "year": 2023,
        "apps": 57,
        "grants": 7
      },
      {
        "year": 2024,
        "apps": 56,
        "grants": 14
      },
      {
        "year": 2025,
        "apps": 61,
        "grants": 14
      },
      {
        "year": 2026,
        "apps": 42,
        "grants": 3
      }
    ],
    "subs": [
      {
        "name": "SoC / SoH estimation",
        "total": 181,
        "status": "growing",
        "perYear": [
          {
            "year": 2016,
            "count": 9
          },
          {
            "year": 2017,
            "count": 5
          },
          {
            "year": 2018,
            "count": 3
          },
          {
            "year": 2019,
            "count": 13
          },
          {
            "year": 2020,
            "count": 10
          },
          {
            "year": 2021,
            "count": 13
          },
          {
            "year": 2022,
            "count": 20
          },
          {
            "year": 2023,
            "count": 12
          },
          {
            "year": 2024,
            "count": 20
          },
          {
            "year": 2025,
            "count": 20
          },
          {
            "year": 2026,
            "count": 9
          }
        ]
      },
      {
        "name": "Degradation & ageing models",
        "total": 280,
        "status": "growing",
        "perYear": [
          {
            "year": 2016,
            "count": 15
          },
          {
            "year": 2017,
            "count": 8
          },
          {
            "year": 2018,
            "count": 11
          },
          {
            "year": 2019,
            "count": 11
          },
          {
            "year": 2020,
            "count": 16
          },
          {
            "year": 2021,
            "count": 17
          },
          {
            "year": 2022,
            "count": 16
          },
          {
            "year": 2023,
            "count": 30
          },
          {
            "year": 2024,
            "count": 30
          },
          {
            "year": 2025,
            "count": 37
          },
          {
            "year": 2026,
            "count": 29
          }
        ]
      },
      {
        "name": "Cell balancing",
        "total": 46,
        "status": "growing",
        "perYear": [
          {
            "year": 2016,
            "count": 1
          },
          {
            "year": 2017,
            "count": 3
          },
          {
            "year": 2018,
            "count": 3
          },
          {
            "year": 2019,
            "count": 2
          },
          {
            "year": 2020,
            "count": 2
          },
          {
            "year": 2021,
            "count": 5
          },
          {
            "year": 2022,
            "count": 3
          },
          {
            "year": 2023,
            "count": 2
          },
          {
            "year": 2024,
            "count": 7
          },
          {
            "year": 2025,
            "count": 4
          },
          {
            "year": 2026,
            "count": 3
          }
        ]
      },
      {
        "name": "Thermal & safety",
        "total": 50,
        "status": "growing",
        "perYear": [
          {
            "year": 2016,
            "count": 4
          },
          {
            "year": 2017,
            "count": 1
          },
          {
            "year": 2018,
            "count": 1
          },
          {
            "year": 2019,
            "count": 2
          },
          {
            "year": 2020,
            "count": 5
          },
          {
            "year": 2021,
            "count": 6
          },
          {
            "year": 2022,
            "count": 4
          },
          {
            "year": 2023,
            "count": 5
          },
          {
            "year": 2024,
            "count": 5
          },
          {
            "year": 2025,
            "count": 8
          },
          {
            "year": 2026,
            "count": 2
          }
        ]
      }
    ],
    "players": [
      {
        "name": "TOYOTA MOTOR CO LTD",
        "count": 73
      },
      {
        "name": "HONDA MOTOR CO LTD",
        "count": 17
      },
      {
        "name": "TOYOTA MOTOR NORTH AMERICA INC",
        "count": 14
      },
      {
        "name": "GM GLOBAL TECH OPERATIONS LLC",
        "count": 12
      },
      {
        "name": "CONTEMPORARY AMPEREX TECHNOLOGY CO LTD",
        "count": 11
      },
      {
        "name": "SAMSUNG SDI CO LTD",
        "count": 10
      },
      {
        "name": "TOYOTA ENG & MFG NORTH AMERICA",
        "count": 8
      },
      {
        "name": "THUNDER POWER HONG KONG LTD",
        "count": 8
      },
      {
        "name": "HYUNDAI MOTOR CO LTD",
        "count": 8
      }
    ],
    "opportunities": [
      "V2G-aware state-of-health models that protect OEM warranties",
      "Ageing-aware dispatch limits inside the BMS",
      "Cloud analytics that certify cycling impact for fleet owners"
    ]
  },
  {
    "name": "Vehicle-to-Grid (V2G)",
    "description": "Explicit vehicle-to-grid IP: dispatching parked EVs as a grid resource through aggregators, market bids and grid-support set-points.",
    "total": 252,
    "minYear": 2004,
    "maxYear": 2026,
    "granted2426": 65,
    "filings2425": 36,
    "share5": 74,
    "status": "growing",
    "perYear": [
      {
        "year": 2016,
        "apps": 11,
        "grants": 1
      },
      {
        "year": 2017,
        "apps": 2,
        "grants": 3
      },
      {
        "year": 2018,
        "apps": 6,
        "grants": 3
      },
      {
        "year": 2019,
        "apps": 7,
        "grants": 3
      },
      {
        "year": 2020,
        "apps": 10,
        "grants": 6
      },
      {
        "year": 2021,
        "apps": 10,
        "grants": 11
      },
      {
        "year": 2022,
        "apps": 16,
        "grants": 10
      },
      {
        "year": 2023,
        "apps": 13,
        "grants": 14
      },
      {
        "year": 2024,
        "apps": 15,
        "grants": 27
      },
      {
        "year": 2025,
        "apps": 21,
        "grants": 25
      },
      {
        "year": 2026,
        "apps": 12,
        "grants": 13
      }
    ],
    "subs": [
      {
        "name": "Market bidding & aggregation",
        "total": 18,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 1
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 2
          },
          {
            "year": 2019,
            "count": 1
          },
          {
            "year": 2020,
            "count": 1
          },
          {
            "year": 2021,
            "count": 2
          },
          {
            "year": 2022,
            "count": 1
          },
          {
            "year": 2023,
            "count": 1
          },
          {
            "year": 2024,
            "count": 3
          },
          {
            "year": 2025,
            "count": 2
          },
          {
            "year": 2026,
            "count": 4
          }
        ]
      },
      {
        "name": "Dispatch & scheduling control",
        "total": 55,
        "status": "growing",
        "perYear": [
          {
            "year": 2016,
            "count": 1
          },
          {
            "year": 2017,
            "count": 1
          },
          {
            "year": 2018,
            "count": 1
          },
          {
            "year": 2019,
            "count": 1
          },
          {
            "year": 2020,
            "count": 2
          },
          {
            "year": 2021,
            "count": 5
          },
          {
            "year": 2022,
            "count": 6
          },
          {
            "year": 2023,
            "count": 3
          },
          {
            "year": 2024,
            "count": 14
          },
          {
            "year": 2025,
            "count": 11
          },
          {
            "year": 2026,
            "count": 8
          }
        ]
      },
      {
        "name": "Grid support services",
        "total": 77,
        "status": "growing",
        "perYear": [
          {
            "year": 2016,
            "count": 7
          },
          {
            "year": 2017,
            "count": 3
          },
          {
            "year": 2018,
            "count": 2
          },
          {
            "year": 2019,
            "count": 5
          },
          {
            "year": 2020,
            "count": 3
          },
          {
            "year": 2021,
            "count": 8
          },
          {
            "year": 2022,
            "count": 9
          },
          {
            "year": 2023,
            "count": 11
          },
          {
            "year": 2024,
            "count": 9
          },
          {
            "year": 2025,
            "count": 8
          },
          {
            "year": 2026,
            "count": 6
          }
        ]
      },
      {
        "name": "Battery-aware V2G",
        "total": 12,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 1
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 1
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 3
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 2
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 1
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 2
          }
        ]
      }
    ],
    "players": [
      {
        "name": "HONDA MOTOR CO LTD",
        "count": 22
      },
      {
        "name": "VOLVO CAR CORP",
        "count": 15
      },
      {
        "name": "HYUNDAI MOTOR CO LTD",
        "count": 12
      },
      {
        "name": "KIA CORP",
        "count": 11
      },
      {
        "name": "UNIV MARYLAND",
        "count": 7
      },
      {
        "name": "MYONGJI UNIV INDUSTRY AND ACADEMIA COOPERATION FOUNDATION",
        "count": 7
      },
      {
        "name": "GOVERNING COUNCIL UNIV TORONTO",
        "count": 6
      },
      {
        "name": "IBM",
        "count": 5
      },
      {
        "name": "INVENTUS HOLDINGS LLC",
        "count": 4
      }
    ],
    "opportunities": [
      "AI dispatch that co-optimises driver needs and market prices",
      "Standardised aggregator-to-charger control APIs",
      "Cross-market revenue stacking within one control loop"
    ]
  },
  {
    "name": "Smart Charging & Scheduling",
    "description": "Managed and scheduled charging that shifts load in time, including tariff optimisation, fleet scheduling and renewable-aware charging.",
    "total": 201,
    "minYear": 2008,
    "maxYear": 2026,
    "granted2426": 25,
    "filings2425": 30,
    "share5": 58,
    "status": "growing",
    "perYear": [
      {
        "year": 2016,
        "apps": 7,
        "grants": 0
      },
      {
        "year": 2017,
        "apps": 4,
        "grants": 1
      },
      {
        "year": 2018,
        "apps": 4,
        "grants": 3
      },
      {
        "year": 2019,
        "apps": 5,
        "grants": 1
      },
      {
        "year": 2020,
        "apps": 5,
        "grants": 2
      },
      {
        "year": 2021,
        "apps": 12,
        "grants": 2
      },
      {
        "year": 2022,
        "apps": 10,
        "grants": 3
      },
      {
        "year": 2023,
        "apps": 13,
        "grants": 3
      },
      {
        "year": 2024,
        "apps": 15,
        "grants": 6
      },
      {
        "year": 2025,
        "apps": 15,
        "grants": 12
      },
      {
        "year": 2026,
        "apps": 18,
        "grants": 7
      }
    ],
    "subs": [
      {
        "name": "Tariff & price optimization",
        "total": 18,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 1
          },
          {
            "year": 2017,
            "count": 1
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 1
          },
          {
            "year": 2020,
            "count": 2
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 1
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 4
          },
          {
            "year": 2025,
            "count": 2
          },
          {
            "year": 2026,
            "count": 2
          }
        ]
      },
      {
        "name": "Fleet / multi-vehicle scheduling",
        "total": 15,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 1
          },
          {
            "year": 2017,
            "count": 1
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 4
          },
          {
            "year": 2023,
            "count": 2
          },
          {
            "year": 2024,
            "count": 3
          },
          {
            "year": 2025,
            "count": 2
          },
          {
            "year": 2026,
            "count": 2
          }
        ]
      },
      {
        "name": "Demand response",
        "total": 30,
        "status": "growing",
        "perYear": [
          {
            "year": 2016,
            "count": 1
          },
          {
            "year": 2017,
            "count": 2
          },
          {
            "year": 2018,
            "count": 1
          },
          {
            "year": 2019,
            "count": 1
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 4
          },
          {
            "year": 2023,
            "count": 5
          },
          {
            "year": 2024,
            "count": 2
          },
          {
            "year": 2025,
            "count": 6
          },
          {
            "year": 2026,
            "count": 4
          }
        ]
      },
      {
        "name": "Renewable-aware charging",
        "total": 16,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 2
          },
          {
            "year": 2022,
            "count": 1
          },
          {
            "year": 2023,
            "count": 3
          },
          {
            "year": 2024,
            "count": 2
          },
          {
            "year": 2025,
            "count": 3
          },
          {
            "year": 2026,
            "count": 3
          }
        ]
      }
    ],
    "players": [
      {
        "name": "V2GREEN INC",
        "count": 28
      },
      {
        "name": "GRIDPOINT INC",
        "count": 20
      },
      {
        "name": "POLLACK SETH B",
        "count": 15
      },
      {
        "name": "BRIDGES SETH W",
        "count": 15
      },
      {
        "name": "KAPLAN DAVID L",
        "count": 14
      },
      {
        "name": "V2 GREEN INC",
        "count": 9
      },
      {
        "name": "HONDA MOTOR CO LTD",
        "count": 9
      },
      {
        "name": "SWTCH ENERGY INC",
        "count": 5
      },
      {
        "name": "NUVVE CORP",
        "count": 5
      }
    ],
    "opportunities": [
      "Tariff-following control that also respects local grid limits",
      "Fleet schedulers that mix charging with depot flexibility",
      "Solar-first scheduling for households with PV"
    ]
  },
  {
    "name": "Wireless / Inductive Transfer",
    "description": "Inductive and resonant systems that move energy without a cable, increasingly specified for two-way transfer in parked and dynamic use cases.",
    "total": 157,
    "minYear": 1992,
    "maxYear": 2026,
    "granted2426": 9,
    "filings2425": 27,
    "share5": 55,
    "status": "growing",
    "perYear": [
      {
        "year": 2016,
        "apps": 5,
        "grants": 0
      },
      {
        "year": 2017,
        "apps": 3,
        "grants": 0
      },
      {
        "year": 2018,
        "apps": 4,
        "grants": 2
      },
      {
        "year": 2019,
        "apps": 8,
        "grants": 2
      },
      {
        "year": 2020,
        "apps": 10,
        "grants": 5
      },
      {
        "year": 2021,
        "apps": 10,
        "grants": 2
      },
      {
        "year": 2022,
        "apps": 14,
        "grants": 4
      },
      {
        "year": 2023,
        "apps": 12,
        "grants": 4
      },
      {
        "year": 2024,
        "apps": 13,
        "grants": 2
      },
      {
        "year": 2025,
        "apps": 14,
        "grants": 5
      },
      {
        "year": 2026,
        "apps": 5,
        "grants": 2
      }
    ],
    "subs": [
      {
        "name": "Coil & compensation design",
        "total": 37,
        "status": "growing",
        "perYear": [
          {
            "year": 2016,
            "count": 2
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 2
          },
          {
            "year": 2020,
            "count": 2
          },
          {
            "year": 2021,
            "count": 3
          },
          {
            "year": 2022,
            "count": 5
          },
          {
            "year": 2023,
            "count": 5
          },
          {
            "year": 2024,
            "count": 5
          },
          {
            "year": 2025,
            "count": 5
          },
          {
            "year": 2026,
            "count": 3
          }
        ]
      },
      {
        "name": "Alignment & positioning",
        "total": 24,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 1
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 2
          },
          {
            "year": 2020,
            "count": 3
          },
          {
            "year": 2021,
            "count": 1
          },
          {
            "year": 2022,
            "count": 2
          },
          {
            "year": 2023,
            "count": 2
          },
          {
            "year": 2024,
            "count": 1
          },
          {
            "year": 2025,
            "count": 5
          },
          {
            "year": 2026,
            "count": 2
          }
        ]
      },
      {
        "name": "Dynamic (in-road) charging",
        "total": 2,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 1
          },
          {
            "year": 2021,
            "count": 1
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 0
          }
        ]
      },
      {
        "name": "Foreign object detection",
        "total": 0,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 0
          }
        ]
      }
    ],
    "players": [
      {
        "name": "WITRICITY CORP",
        "count": 20
      },
      {
        "name": "QUALCOMM INC",
        "count": 13
      },
      {
        "name": "UT BATTELLE LLC",
        "count": 10
      },
      {
        "name": "TOYOTA MOTOR CO LTD",
        "count": 8
      },
      {
        "name": "EV CHARGING SOLUTIONS LLC",
        "count": 7
      },
      {
        "name": "AUCKLAND UNISERVICES LTD",
        "count": 6
      },
      {
        "name": "THE FLORIDA INTERNATIONAL UNIV BOARD OF TRUSTEES",
        "count": 5
      },
      {
        "name": "RIVIAN IP HOLDINGS LLC",
        "count": 5
      },
      {
        "name": "SIEBER LUKAS",
        "count": 5
      }
    ],
    "opportunities": [
      "High-power (>20 kW) bidirectional resonant links",
      "Automated alignment for autonomous fleets",
      "Dynamic in-road transfer for buses and shuttles"
    ]
  },
  {
    "name": "Cybersecurity & Authentication",
    "description": "Security IP for charging and V2G: certificates and PKI, encrypted channels, vehicle and user authentication, and intrusion detection.",
    "total": 91,
    "minYear": 2000,
    "maxYear": 2026,
    "granted2426": 13,
    "filings2425": 12,
    "share5": 66,
    "status": "growing",
    "perYear": [
      {
        "year": 2016,
        "apps": 4,
        "grants": 2
      },
      {
        "year": 2017,
        "apps": 0,
        "grants": 0
      },
      {
        "year": 2018,
        "apps": 0,
        "grants": 1
      },
      {
        "year": 2019,
        "apps": 5,
        "grants": 1
      },
      {
        "year": 2020,
        "apps": 3,
        "grants": 2
      },
      {
        "year": 2021,
        "apps": 3,
        "grants": 0
      },
      {
        "year": 2022,
        "apps": 9,
        "grants": 8
      },
      {
        "year": 2023,
        "apps": 6,
        "grants": 2
      },
      {
        "year": 2024,
        "apps": 10,
        "grants": 3
      },
      {
        "year": 2025,
        "apps": 2,
        "grants": 2
      },
      {
        "year": 2026,
        "apps": 7,
        "grants": 8
      }
    ],
    "subs": [
      {
        "name": "User / vehicle authentication",
        "total": 60,
        "status": "growing",
        "perYear": [
          {
            "year": 2016,
            "count": 5
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 1
          },
          {
            "year": 2019,
            "count": 4
          },
          {
            "year": 2020,
            "count": 3
          },
          {
            "year": 2021,
            "count": 2
          },
          {
            "year": 2022,
            "count": 8
          },
          {
            "year": 2023,
            "count": 6
          },
          {
            "year": 2024,
            "count": 11
          },
          {
            "year": 2025,
            "count": 2
          },
          {
            "year": 2026,
            "count": 9
          }
        ]
      },
      {
        "name": "Certificates & PKI",
        "total": 16,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 1
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 2
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 3
          },
          {
            "year": 2023,
            "count": 1
          },
          {
            "year": 2024,
            "count": 2
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 6
          }
        ]
      },
      {
        "name": "Encryption & secure channels",
        "total": 31,
        "status": "growing",
        "perYear": [
          {
            "year": 2016,
            "count": 2
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 1
          },
          {
            "year": 2019,
            "count": 2
          },
          {
            "year": 2020,
            "count": 2
          },
          {
            "year": 2021,
            "count": 1
          },
          {
            "year": 2022,
            "count": 6
          },
          {
            "year": 2023,
            "count": 3
          },
          {
            "year": 2024,
            "count": 3
          },
          {
            "year": 2025,
            "count": 3
          },
          {
            "year": 2026,
            "count": 3
          }
        ]
      },
      {
        "name": "Intrusion & anomaly detection",
        "total": 1,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 1
          }
        ]
      }
    ],
    "players": [
      {
        "name": "HYUNDAI MOTOR CO LTD",
        "count": 13
      },
      {
        "name": "MYONGJI UNIV INDUSTRY AND ACADEMIA COOPERATION FOUNDATION",
        "count": 12
      },
      {
        "name": "KIA CORP",
        "count": 11
      },
      {
        "name": "KOREA ELECTRIC POWER CORP",
        "count": 6
      },
      {
        "name": "HYUNDAI MOBIS CO LTD",
        "count": 5
      },
      {
        "name": "LG ENERGY SOLUTION LTD",
        "count": 3
      },
      {
        "name": "GOGORO INC",
        "count": 3
      },
      {
        "name": "NIO TECHNOLOGY ANHUI CO LTD",
        "count": 2
      },
      {
        "name": "POSTE",
        "count": 2
      }
    ],
    "opportunities": [
      "Zero-trust architectures for aggregator-controlled fleets",
      "Hardware root-of-trust inside bidirectional chargers",
      "Lightweight PKI for Plug-and-Charge at depot scale"
    ]
  },
  {
    "name": "Grid Services & Ancillary",
    "description": "Application-level IP for the services EVs actually sell: frequency regulation, voltage and reactive support, peak shaving and VPP orchestration.",
    "total": 73,
    "minYear": 2010,
    "maxYear": 2026,
    "granted2426": 9,
    "filings2425": 13,
    "share5": 66,
    "status": "growing",
    "perYear": [
      {
        "year": 2016,
        "apps": 3,
        "grants": 1
      },
      {
        "year": 2017,
        "apps": 2,
        "grants": 1
      },
      {
        "year": 2018,
        "apps": 2,
        "grants": 2
      },
      {
        "year": 2019,
        "apps": 1,
        "grants": 0
      },
      {
        "year": 2020,
        "apps": 3,
        "grants": 1
      },
      {
        "year": 2021,
        "apps": 3,
        "grants": 1
      },
      {
        "year": 2022,
        "apps": 4,
        "grants": 3
      },
      {
        "year": 2023,
        "apps": 8,
        "grants": 5
      },
      {
        "year": 2024,
        "apps": 3,
        "grants": 5
      },
      {
        "year": 2025,
        "apps": 10,
        "grants": 3
      },
      {
        "year": 2026,
        "apps": 2,
        "grants": 1
      }
    ],
    "subs": [
      {
        "name": "Frequency regulation",
        "total": 4,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 1
          },
          {
            "year": 2026,
            "count": 0
          }
        ]
      },
      {
        "name": "Peak shaving",
        "total": 0,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 0
          }
        ]
      },
      {
        "name": "VPP orchestration",
        "total": 18,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 1
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 2
          },
          {
            "year": 2023,
            "count": 6
          },
          {
            "year": 2024,
            "count": 2
          },
          {
            "year": 2025,
            "count": 6
          },
          {
            "year": 2026,
            "count": 1
          }
        ]
      },
      {
        "name": "Voltage & reactive power",
        "total": 39,
        "status": "growing",
        "perYear": [
          {
            "year": 2016,
            "count": 1
          },
          {
            "year": 2017,
            "count": 2
          },
          {
            "year": 2018,
            "count": 2
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 2
          },
          {
            "year": 2021,
            "count": 2
          },
          {
            "year": 2022,
            "count": 3
          },
          {
            "year": 2023,
            "count": 9
          },
          {
            "year": 2024,
            "count": 5
          },
          {
            "year": 2025,
            "count": 6
          },
          {
            "year": 2026,
            "count": 2
          }
        ]
      }
    ],
    "players": [
      {
        "name": "KYDD PAUL HARRIMAN",
        "count": 8
      },
      {
        "name": "NUVVE CORP",
        "count": 5
      },
      {
        "name": "WATT & WELL",
        "count": 4
      },
      {
        "name": "TOYOTA MOTOR CO LTD",
        "count": 3
      },
      {
        "name": "SK INNOVATION CO LTD",
        "count": 3
      },
      {
        "name": "NETZERO V2G TECH LLC",
        "count": 3
      },
      {
        "name": "ABB TECHNOLOGY LTD",
        "count": 2
      },
      {
        "name": "AUDI AG",
        "count": 2
      },
      {
        "name": "SANNINO AMBRA",
        "count": 2
      }
    ],
    "opportunities": [
      "Fast frequency response qualified from EV fleets",
      "Reactive power from bidirectional chargers as a paid service",
      "Local congestion relief products for DSOs"
    ]
  },
  {
    "name": "Charging Communication & Protocols",
    "description": "The messaging layer between vehicle, charger and backend, where bidirectional operation is standardised (ISO 15118-20, OCPP, CHAdeMO, CCS).",
    "total": 49,
    "minYear": 2010,
    "maxYear": 2026,
    "granted2426": 2,
    "filings2425": 20,
    "share5": 73,
    "status": "growing",
    "perYear": [
      {
        "year": 2016,
        "apps": 2,
        "grants": 0
      },
      {
        "year": 2017,
        "apps": 0,
        "grants": 0
      },
      {
        "year": 2018,
        "apps": 0,
        "grants": 2
      },
      {
        "year": 2019,
        "apps": 1,
        "grants": 0
      },
      {
        "year": 2020,
        "apps": 2,
        "grants": 2
      },
      {
        "year": 2021,
        "apps": 0,
        "grants": 0
      },
      {
        "year": 2022,
        "apps": 3,
        "grants": 0
      },
      {
        "year": 2023,
        "apps": 3,
        "grants": 1
      },
      {
        "year": 2024,
        "apps": 4,
        "grants": 1
      },
      {
        "year": 2025,
        "apps": 16,
        "grants": 0
      },
      {
        "year": 2026,
        "apps": 7,
        "grants": 1
      }
    ],
    "subs": [
      {
        "name": "ISO 15118 / Plug and Charge",
        "total": 13,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 1
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 2
          },
          {
            "year": 2025,
            "count": 10
          },
          {
            "year": 2026,
            "count": 0
          }
        ]
      },
      {
        "name": "OCPP & backend APIs",
        "total": 2,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 2
          }
        ]
      },
      {
        "name": "CHAdeMO / CCS",
        "total": 5,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 2
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 1
          },
          {
            "year": 2025,
            "count": 1
          },
          {
            "year": 2026,
            "count": 1
          }
        ]
      },
      {
        "name": "Wireless / cellular links",
        "total": 3,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 1
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 2
          },
          {
            "year": 2026,
            "count": 0
          }
        ]
      }
    ],
    "players": [
      {
        "name": "VOLVO CAR CORP",
        "count": 10
      },
      {
        "name": "GRIDPOINT INC",
        "count": 7
      },
      {
        "name": "HYUNDAI MOTOR CO LTD",
        "count": 6
      },
      {
        "name": "KIA CORP",
        "count": 6
      },
      {
        "name": "MYONGJI UNIV INDUSTRY AND ACADEMIA COOPERATION FOUNDATION",
        "count": 6
      },
      {
        "name": "NIO TECHNOLOGY ANHUI CO LTD",
        "count": 2
      },
      {
        "name": "EMOBI INC",
        "count": 2
      },
      {
        "name": "ETHICON LLC",
        "count": 2
      },
      {
        "name": "GM GLOBAL TECH OPERATIONS LLC",
        "count": 2
      }
    ],
    "opportunities": [
      "Bridging stacks between ISO 15118-20 and legacy CHAdeMO",
      "Certified V2G conformance and test suites",
      "Streaming telemetry for real-time market participation"
    ]
  },
  {
    "name": "Vehicle-to-Vehicle (V2V)",
    "description": "Direct energy transfer between vehicles, from roadside rescue charging to peer-to-peer trading between fleet units.",
    "total": 39,
    "minYear": 1993,
    "maxYear": 2026,
    "granted2426": 4,
    "filings2425": 7,
    "share5": 69,
    "status": "growing",
    "perYear": [
      {
        "year": 2016,
        "apps": 0,
        "grants": 2
      },
      {
        "year": 2017,
        "apps": 0,
        "grants": 0
      },
      {
        "year": 2018,
        "apps": 0,
        "grants": 0
      },
      {
        "year": 2019,
        "apps": 5,
        "grants": 1
      },
      {
        "year": 2020,
        "apps": 2,
        "grants": 1
      },
      {
        "year": 2021,
        "apps": 2,
        "grants": 3
      },
      {
        "year": 2022,
        "apps": 3,
        "grants": 2
      },
      {
        "year": 2023,
        "apps": 2,
        "grants": 2
      },
      {
        "year": 2024,
        "apps": 2,
        "grants": 2
      },
      {
        "year": 2025,
        "apps": 5,
        "grants": 2
      },
      {
        "year": 2026,
        "apps": 2,
        "grants": 0
      }
    ],
    "subs": [
      {
        "name": "EV-to-EV rescue charging",
        "total": 2,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 1
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 1
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 0
          }
        ]
      },
      {
        "name": "Connector & cable systems",
        "total": 11,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 1
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 3
          },
          {
            "year": 2020,
            "count": 1
          },
          {
            "year": 2021,
            "count": 2
          },
          {
            "year": 2022,
            "count": 1
          },
          {
            "year": 2023,
            "count": 1
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 1
          },
          {
            "year": 2026,
            "count": 0
          }
        ]
      },
      {
        "name": "Peer-to-peer energy trading",
        "total": 0,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 0
          }
        ]
      }
    ],
    "players": [
      {
        "name": "VOLVO CAR CORP",
        "count": 4
      },
      {
        "name": "GM GLOBAL TECH OPERATIONS LLC",
        "count": 4
      },
      {
        "name": "PACCAR INC",
        "count": 3
      },
      {
        "name": "SAIC MOTOR CORP LTD",
        "count": 3
      },
      {
        "name": "BEIJING ELECTRIC VEHICLE CO LTD",
        "count": 2
      },
      {
        "name": "ALPITRONIC SRL",
        "count": 2
      },
      {
        "name": "INTEL CORP",
        "count": 2
      },
      {
        "name": "UNIV ALABAMA",
        "count": 2
      },
      {
        "name": "BAIC BJEV CO LTD",
        "count": 1
      }
    ],
    "opportunities": [
      "Roadside rescue charging as an OEM service feature",
      "Peer-to-peer energy settlement between fleet vehicles",
      "Dual-role connectors that work as source and sink"
    ]
  },
  {
    "name": "Vehicle-to-Load (V2L)",
    "description": "Using the vehicle as a mobile AC outlet for tools, appliances and worksites, the entry point most OEMs ship before full V2G.",
    "total": 23,
    "minYear": 2019,
    "maxYear": 2026,
    "granted2426": 3,
    "filings2425": 4,
    "share5": 87,
    "status": "emerging",
    "perYear": [
      {
        "year": 2016,
        "apps": 0,
        "grants": 0
      },
      {
        "year": 2017,
        "apps": 0,
        "grants": 0
      },
      {
        "year": 2018,
        "apps": 0,
        "grants": 0
      },
      {
        "year": 2019,
        "apps": 0,
        "grants": 1
      },
      {
        "year": 2020,
        "apps": 1,
        "grants": 1
      },
      {
        "year": 2021,
        "apps": 0,
        "grants": 1
      },
      {
        "year": 2022,
        "apps": 0,
        "grants": 3
      },
      {
        "year": 2023,
        "apps": 2,
        "grants": 2
      },
      {
        "year": 2024,
        "apps": 1,
        "grants": 2
      },
      {
        "year": 2025,
        "apps": 3,
        "grants": 0
      },
      {
        "year": 2026,
        "apps": 5,
        "grants": 1
      }
    ],
    "subs": [
      {
        "name": "Portable AC outlets",
        "total": 1,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 1
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 0
          }
        ]
      },
      {
        "name": "Tool & appliance supply",
        "total": 5,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 1
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 1
          },
          {
            "year": 2023,
            "count": 1
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 2
          }
        ]
      },
      {
        "name": "Safety & protection",
        "total": 0,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 0
          }
        ]
      }
    ],
    "players": [
      {
        "name": "RIVIAN IP HOLDINGS LLC",
        "count": 3
      },
      {
        "name": "HYUNDAI MOTOR CO LTD",
        "count": 3
      },
      {
        "name": "KIA CORP",
        "count": 3
      },
      {
        "name": "GM GLOBAL TECH OPERATIONS LLC",
        "count": 2
      },
      {
        "name": "FRANKLINWH ENERGY STORAGE INC",
        "count": 2
      },
      {
        "name": "SAIC MOTOR CORP LTD",
        "count": 2
      },
      {
        "name": "ORNAMENTAL AUTOMOBILE LTD COMPANY",
        "count": 1
      },
      {
        "name": "UNIV NAT MOKPO IND ACAD COOP GROUP",
        "count": 1
      },
      {
        "name": "ATIEVA INC",
        "count": 1
      }
    ],
    "opportunities": [
      "Higher-power (>7 kW) V2L outlets for construction sites",
      "Integrated protection and earthing for outdoor use",
      "V2L to V2H upgrade paths on the same power stage"
    ]
  },
  {
    "name": "Vehicle-to-Home / Building",
    "description": "Powering a home or building from the EV, covering backup and islanding, home energy management, demand-charge reduction and PV coupling.",
    "total": 16,
    "minYear": 2016,
    "maxYear": 2026,
    "granted2426": 0,
    "filings2425": 4,
    "share5": 75,
    "status": "emerging",
    "perYear": [
      {
        "year": 2016,
        "apps": 0,
        "grants": 1
      },
      {
        "year": 2017,
        "apps": 0,
        "grants": 0
      },
      {
        "year": 2018,
        "apps": 0,
        "grants": 1
      },
      {
        "year": 2019,
        "apps": 1,
        "grants": 1
      },
      {
        "year": 2020,
        "apps": 0,
        "grants": 0
      },
      {
        "year": 2021,
        "apps": 0,
        "grants": 0
      },
      {
        "year": 2022,
        "apps": 2,
        "grants": 0
      },
      {
        "year": 2023,
        "apps": 1,
        "grants": 3
      },
      {
        "year": 2024,
        "apps": 1,
        "grants": 0
      },
      {
        "year": 2025,
        "apps": 3,
        "grants": 0
      },
      {
        "year": 2026,
        "apps": 2,
        "grants": 0
      }
    ],
    "subs": [
      {
        "name": "Home backup & islanding",
        "total": 2,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 1
          },
          {
            "year": 2026,
            "count": 1
          }
        ]
      },
      {
        "name": "Building / demand charges",
        "total": 9,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 1
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 1
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 2
          },
          {
            "year": 2024,
            "count": 1
          },
          {
            "year": 2025,
            "count": 2
          },
          {
            "year": 2026,
            "count": 2
          }
        ]
      },
      {
        "name": "PV coupling",
        "total": 1,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 1
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 0
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 0
          }
        ]
      },
      {
        "name": "Home energy management",
        "total": 1,
        "status": "emerging",
        "perYear": [
          {
            "year": 2016,
            "count": 0
          },
          {
            "year": 2017,
            "count": 0
          },
          {
            "year": 2018,
            "count": 0
          },
          {
            "year": 2019,
            "count": 0
          },
          {
            "year": 2020,
            "count": 0
          },
          {
            "year": 2021,
            "count": 0
          },
          {
            "year": 2022,
            "count": 0
          },
          {
            "year": 2023,
            "count": 1
          },
          {
            "year": 2024,
            "count": 0
          },
          {
            "year": 2025,
            "count": 0
          },
          {
            "year": 2026,
            "count": 0
          }
        ]
      }
    ],
    "players": [
      {
        "name": "ATIEVA INC",
        "count": 3
      },
      {
        "name": "TOYOTA MOTOR CO LTD",
        "count": 2
      },
      {
        "name": "KOREA ELECTRIC POWER CORP",
        "count": 1
      },
      {
        "name": "GM GLOBAL TECHNOLOGY OPERATIONS LLC",
        "count": 1
      },
      {
        "name": "GOVERNING COUNCIL UNIV TORONTO",
        "count": 1
      },
      {
        "name": "HAVELAAR CANADA IND R & D LABORATORY LTD",
        "count": 1
      },
      {
        "name": "YANGGUANG LECHONG TECH CO LTD",
        "count": 1
      },
      {
        "name": "HYUNDAI MOTOR CO LTD",
        "count": 1
      },
      {
        "name": "KIA CORP",
        "count": 1
      }
    ],
    "opportunities": [
      "Plug-and-play V2H kits bundled with residential PV",
      "Islanding hardware certified for whole-home backup",
      "Behind-the-meter dispatch that cuts commercial demand charges"
    ]
  }
];
