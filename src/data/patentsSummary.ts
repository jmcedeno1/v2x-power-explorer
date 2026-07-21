// Precomputed patents summary — snapshot from the documents table.
// Regenerate manually via SQL if the corpus changes.

export type PatentGrowingTopic = {
  topic: string;
  y2020: number;
  y2025: number;
  growthAbs: number;
  growthPct: number;
  total: number;
};

const rawTopics = [
  { topic: 'V2G Control & Dispatch', y2020: 205, y2025: 311 },
  { topic: 'Charging Infrastructure & EVSE', y2020: 61, y2025: 142 },
  { topic: 'V2G Bidirectional Power Conversion', y2020: 122, y2025: 186 },
  { topic: 'Battery Management (BMS)', y2020: 57, y2025: 111 },
  { topic: 'Communication & Protocols', y2020: 69, y2025: 120 },
  { topic: 'On-Board Bidirectional Charger', y2020: 7, y2025: 31 },
  { topic: 'Fleet & Microgrid Integration', y2020: 9, y2025: 33 },
  { topic: 'Battery Degradation & Ageing', y2020: 17, y2025: 38 },
  { topic: 'Renewables Integration (PV/Wind)', y2020: 10, y2025: 30 },
  { topic: 'Standards (ISO 15118, CCS, CHAdeMO)', y2020: 0, y2025: 12 },
];

export const patentsSummary = {
  total: 10130,
  grants: 2451,
  apps: 7679,
  minYear: 1990,
  maxYear: 2026,
  peakYear: 2025,
  countries: 61,
  assignees: 4534,
  perYear: [
    { year: 1990, count: 9 },{ year: 1991, count: 9 },{ year: 1992, count: 13 },{ year: 1993, count: 12 },{ year: 1994, count: 14 },{ year: 1995, count: 17 },{ year: 1996, count: 17 },{ year: 1997, count: 16 },{ year: 1998, count: 26 },{ year: 1999, count: 28 },
    { year: 2000, count: 31 },{ year: 2001, count: 31 },{ year: 2002, count: 33 },{ year: 2003, count: 62 },{ year: 2004, count: 48 },{ year: 2005, count: 53 },{ year: 2006, count: 68 },{ year: 2007, count: 91 },{ year: 2008, count: 125 },{ year: 2009, count: 143 },
    { year: 2010, count: 178 },{ year: 2011, count: 260 },{ year: 2012, count: 228 },{ year: 2013, count: 309 },{ year: 2014, count: 353 },{ year: 2015, count: 349 },{ year: 2016, count: 408 },{ year: 2017, count: 382 },{ year: 2018, count: 457 },{ year: 2019, count: 542 },
    { year: 2020, count: 629 },{ year: 2021, count: 698 },{ year: 2022, count: 849 },{ year: 2023, count: 921 },{ year: 2024, count: 1027 },{ year: 2025, count: 1064 },{ year: 2026, count: 556 },
  ],
  topAssignees: [
    { name: 'TOYOTA MOTOR CO LTD', count: 1046 },
    { name: 'FORD GLOBAL TECH LLC', count: 209 },
    { name: 'HYUNDAI MOTOR CO LTD', count: 200 },
    { name: 'HONDA MOTOR CO LTD', count: 140 },
    { name: 'GM GLOBAL TECH OPERATIONS LLC', count: 140 },
    { name: 'BYD CO LTD', count: 135 },
    { name: 'MITSUBISHI ELECTRIC CORP', count: 111 },
    { name: 'KIA CORP', count: 103 },
    { name: 'DENSO CORP', count: 86 },
    { name: 'BAYERISCHE MOTOREN WERKE AG', count: 85 },
  ],
  topCountries: [
    { name: 'US', count: 6052 },
    { name: 'CN', count: 2459 },
    { name: 'JP', count: 2160 },
    { name: 'EP', count: 1411 },
    { name: 'WO', count: 962 },
    { name: 'DE', count: 753 },
    { name: 'KR', count: 546 },
    { name: 'IT', count: 198 },
    { name: 'FR', count: 177 },
    { name: 'CA', count: 172 },
  ],
  growingTopics: rawTopics.map((t): PatentGrowingTopic => {
    const growthAbs = t.y2025 - t.y2020;
    const growthPct = t.y2020 > 0 ? (growthAbs / t.y2020) * 100 : t.y2025 > 0 ? 100 : 0;
    return { ...t, growthAbs, growthPct, total: t.y2020 + t.y2025 };
  }),
};
