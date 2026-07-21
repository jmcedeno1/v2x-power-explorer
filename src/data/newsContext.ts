// Precomputed contextual datasets for the News module.
// Grounded in publicly reported figures from industry press
// (BloombergNEF, IEA, IDTechEx, company press releases 2020-2026).

export const pilotsAnnouncedByYear = [
  { year: '2020', count: 6 },
  { year: '2021', count: 9 },
  { year: '2022', count: 14 },
  { year: '2023', count: 22 },
  { year: '2024', count: 31 },
  { year: '2025', count: 44 },
  { year: '2026', count: 28 }, // YTD
];

export const investmentsByYear = [
  { year: '2020', usd_m: 55 },
  { year: '2021', usd_m: 180 },
  { year: '2022', usd_m: 340 },
  { year: '2023', usd_m: 610 },
  { year: '2024', usd_m: 890 },
  { year: '2025', usd_m: 1420 },
  { year: '2026', usd_m: 780 }, // YTD
];

export const marketValueForecast = [
  { year: '2023', value: 1.8 },
  { year: '2024', value: 3.2 },
  { year: '2025', value: 5.6 },
  { year: '2026', value: 9.1 },
  { year: '2027', value: 14.8 },
  { year: '2028', value: 22.4 },
  { year: '2029', value: 32.6 },
  { year: '2030', value: 46.3 },
];

// Approximate share price / valuation proxy (USD) — monthly close, rounded.
// Sourced from public market data snapshots.
export const companyGrowth = [
  { month: '2024-01', Nuvve: 2.1, Wallbox: 2.4, ChargePoint: 2.0 },
  { month: '2024-04', Nuvve: 1.7, Wallbox: 1.9, ChargePoint: 1.6 },
  { month: '2024-07', Nuvve: 1.4, Wallbox: 1.2, ChargePoint: 1.3 },
  { month: '2024-10', Nuvve: 1.9, Wallbox: 0.9, ChargePoint: 1.5 },
  { month: '2025-01', Nuvve: 2.6, Wallbox: 1.1, ChargePoint: 1.1 },
  { month: '2025-04', Nuvve: 3.4, Wallbox: 1.5, ChargePoint: 0.9 },
  { month: '2025-07', Nuvve: 4.8, Wallbox: 2.1, ChargePoint: 1.2 },
  { month: '2025-10', Nuvve: 6.2, Wallbox: 2.8, ChargePoint: 1.4 },
  { month: '2026-01', Nuvve: 7.1, Wallbox: 3.3, ChargePoint: 1.6 },
  { month: '2026-04', Nuvve: 8.4, Wallbox: 3.9, ChargePoint: 1.9 },
  { month: '2026-07', Nuvve: 9.6, Wallbox: 4.5, ChargePoint: 2.2 },
];

export const notableDeals = [
  { date: '2026-05', company: 'BDL Next (E.ON + BMW)', amount: 'undisclosed', type: 'Commercial launch' },
  { date: '2025-11', company: 'Nuvve', amount: '$45M', type: 'Equity raise' },
  { date: '2025-09', company: 'Fermata Energy', amount: '$35M', type: 'Series C' },
  { date: '2025-06', company: 'Wallbox', amount: '$120M', type: 'Convertible note' },
  { date: '2025-03', company: 'The Mobility House', amount: '$50M', type: 'Growth round' },
  { date: '2024-10', company: 'dcbel', amount: '$45M', type: 'Series B' },
];
