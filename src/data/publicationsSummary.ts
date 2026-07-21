// Precomputed publications summary — snapshot from the documents table.
// Regenerate manually via SQL if the corpus changes.

export type GrowingTopic = {
  topic: string;
  y2020: number;
  y2025: number;
  growthAbs: number;
  growthPct: number;
  total: number;
};

const rawTopics = [
  { topic: 'Energy Management Systems (EMS/HEMS)', y2020: 158, y2025: 475 },
  { topic: 'V2G Policy & Regulation', y2020: 109, y2025: 368 },
  { topic: 'V2G Field Trials & Pilots', y2020: 60, y2025: 277 },
  { topic: 'Renewable Integration & Solar+EV', y2020: 114, y2025: 325 },
  { topic: 'V2G Environmental & LCA', y2020: 64, y2025: 264 },
  { topic: 'V2G with Renewables & Solar', y2020: 110, y2025: 286 },
  { topic: 'V2G Optimal Scheduling & Bidding', y2020: 112, y2025: 284 },
  { topic: 'V2G Simulation & Modeling', y2020: 112, y2025: 269 },
  { topic: 'V2G Economics & Business Models', y2020: 89, y2025: 235 },
  { topic: 'EV Charging Infrastructure', y2020: 83, y2025: 221 },
];

export const publicationsSummary = {
  total: 8294,
  minYear: 1990,
  maxYear: 2026,
  peakYear: 2025,
  countries: 111,
  institutions: 3523,
  themes: rawTopics.length,
  perYear: [
    { year: 1990, count: 4 },{ year: 1991, count: 8 },{ year: 1992, count: 3 },{ year: 1993, count: 3 },{ year: 1994, count: 3 },{ year: 1995, count: 2 },{ year: 1996, count: 2 },{ year: 1997, count: 1 },{ year: 1998, count: 4 },{ year: 1999, count: 3 },
    { year: 2000, count: 9 },{ year: 2001, count: 9 },{ year: 2002, count: 8 },{ year: 2003, count: 17 },{ year: 2004, count: 3 },{ year: 2005, count: 9 },{ year: 2006, count: 11 },{ year: 2007, count: 24 },{ year: 2008, count: 31 },{ year: 2009, count: 55 },
    { year: 2010, count: 105 },{ year: 2011, count: 197 },{ year: 2012, count: 244 },{ year: 2013, count: 249 },{ year: 2014, count: 326 },{ year: 2015, count: 305 },{ year: 2016, count: 335 },{ year: 2017, count: 365 },{ year: 2018, count: 407 },{ year: 2019, count: 497 },
    { year: 2020, count: 537 },{ year: 2021, count: 534 },{ year: 2022, count: 655 },{ year: 2023, count: 764 },{ year: 2024, count: 866 },{ year: 2025, count: 1084 },{ year: 2026, count: 615 },
  ],
  topInstitutions: [
    { name: 'North China Electric Power University', count: 132 },
    { name: 'Tsinghua University', count: 119 },
    { name: 'State Grid Corporation of China (China)', count: 84 },
    { name: 'Delft University of Technology', count: 71 },
    { name: 'University of Hong Kong', count: 62 },
    { name: 'Aalborg University', count: 58 },
    { name: 'Hong Kong Polytechnic University', count: 58 },
    { name: 'Technical University of Denmark', count: 55 },
  ],
  topCountries: [
    { name: 'CN', count: 1623 },
    { name: 'US', count: 1079 },
    { name: 'IN', count: 969 },
    { name: 'GB', count: 446 },
    { name: 'DE', count: 373 },
    { name: 'CA', count: 291 },
    { name: 'AU', count: 273 },
    { name: 'IT', count: 267 },
  ],
  growingTopics: rawTopics.map((t): GrowingTopic => {
    const growthAbs = t.y2025 - t.y2020;
    const growthPct = t.y2020 > 0 ? (growthAbs / t.y2020) * 100 : t.y2025 > 0 ? 100 : 0;
    return { ...t, growthAbs, growthPct, total: t.y2020 + t.y2025 };
  }),
};
