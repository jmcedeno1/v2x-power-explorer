// Takahashi / Bass diffusion model applied to THIS app's own corpora only.
// All input series come from the app databases:
//   - Patent applications and granted patents: Lens.org patents corpus (10,130 records) as
//     summarised in src/data/patentsSummary.ts (7,679 applications + 2,451 grants).
//   - Academic publications: OpenAlex publications corpus (8,294 records), src/data/publicationsSummary.ts.
//   - Pilot adoption: vehicles deployed per start year in the Pilots & Demonstrators module (43 pilots).
//   - News and media: articles per year in the News & Media corpus (195 articles).
// Bass: dN/dt = (p + q*N/m)*(m - N);  cumulative fit F(t) = m*(1-e^-(p+q)t)/(1+(q/p)e^-(p+q)t)
// Takeoff (left inflection, Venkatesan & Kumar): t* = 1/(p+q) * ln((q/p)*(2-sqrt(3)))
// Fitted with nonlinear least squares on cumulative counts from 2004 (t=0 at 2003) to 2025;
// 2026 is excluded from fitting because the corpora are only partially populated for that year.

export type DiffusionPoint = {
  year: number;
  filings?: number; filingsFit: number;
  grants?: number; grantsFit: number;
  publications?: number; publicationsFit: number;
  pilots?: number; pilotsFit: number;
  news?: number; newsFit: number;
};

// Values are cumulative adoption as a percentage of each series' estimated potential (m).
export const diffusionCurves: DiffusionPoint[] = [
  {"year": 2004, "filingsFit": 0.1, "filings": 0.05, "grantsFit": 0.14, "grants": 0.3, "publicationsFit": 0.2, "publications": 0.02, "pilotsFit": 0.02, "pilots": 0.0, "newsFit": 0.0, "news": 0.0},
  {"year": 2005, "filingsFit": 0.2, "filings": 0.12, "grantsFit": 0.31, "grants": 0.52, "publicationsFit": 0.44, "publications": 0.07, "pilotsFit": 0.05, "pilots": 0.0, "newsFit": 0.0, "news": 0.0},
  {"year": 2006, "filingsFit": 0.33, "filings": 0.2, "grantsFit": 0.54, "grants": 0.77, "publicationsFit": 0.74, "publications": 0.14, "pilotsFit": 0.11, "pilots": 0.0, "newsFit": 0.01, "news": 0.0},
  {"year": 2007, "filingsFit": 0.47, "filings": 0.31, "grantsFit": 0.83, "grants": 1.07, "publicationsFit": 1.1, "publications": 0.28, "pilotsFit": 0.19, "pilots": 0.0, "newsFit": 0.01, "news": 0.0},
  {"year": 2008, "filingsFit": 0.63, "filings": 0.47, "grantsFit": 1.21, "grants": 1.4, "publicationsFit": 1.54, "publications": 0.47, "pilotsFit": 0.32, "pilots": 0.0, "newsFit": 0.02, "news": 0.0},
  {"year": 2009, "filingsFit": 0.81, "filings": 0.66, "grantsFit": 1.69, "grants": 1.73, "publicationsFit": 2.08, "publications": 0.8, "pilotsFit": 0.53, "pilots": 0.0, "newsFit": 0.03, "news": 0.0},
  {"year": 2010, "filingsFit": 1.01, "filings": 0.88, "grantsFit": 2.31, "grants": 2.23, "publicationsFit": 2.74, "publications": 1.44, "pilotsFit": 0.86, "pilots": 0.26, "newsFit": 0.05, "news": 0.43},
  {"year": 2011, "filingsFit": 1.24, "filings": 1.19, "grantsFit": 3.09, "grants": 3.35, "publicationsFit": 3.53, "publications": 2.62, "pilotsFit": 1.37, "pilots": 0.26, "newsFit": 0.08, "news": 0.43},
  {"year": 2012, "filingsFit": 1.5, "filings": 1.45, "grantsFit": 4.09, "grants": 4.56, "publicationsFit": 4.49, "publications": 4.09, "pilotsFit": 2.18, "pilots": 6.55, "newsFit": 0.13, "news": 0.43},
  {"year": 2013, "filingsFit": 1.79, "filings": 1.83, "grantsFit": 5.36, "grants": 5.66, "publicationsFit": 5.65, "publications": 5.6, "pilotsFit": 3.43, "pilots": 6.55, "newsFit": 0.2, "news": 0.43},
  {"year": 2014, "filingsFit": 2.13, "filings": 2.26, "grantsFit": 6.94, "grants": 7.03, "publicationsFit": 7.03, "publications": 7.56, "pilotsFit": 5.35, "pilots": 6.55, "newsFit": 0.32, "news": 0.43},
  {"year": 2015, "filingsFit": 2.5, "filings": 2.67, "grantsFit": 8.92, "grants": 8.49, "publicationsFit": 8.68, "publications": 9.4, "pilotsFit": 8.24, "pilots": 6.55, "newsFit": 0.5, "news": 0.43},
  {"year": 2016, "filingsFit": 2.92, "filings": 3.13, "grantsFit": 11.35, "grants": 10.74, "publicationsFit": 10.63, "publications": 11.42, "pilotsFit": 12.49, "pilots": 7.07, "newsFit": 0.79, "news": 0.87},
  {"year": 2017, "filingsFit": 3.4, "filings": 3.52, "grantsFit": 14.31, "grants": 13.79, "publicationsFit": 12.91, "publications": 13.62, "pilotsFit": 18.47, "pilots": 8.9, "newsFit": 1.24, "news": 0.87},
  {"year": 2018, "filingsFit": 3.93, "filings": 3.95, "grantsFit": 17.86, "grants": 17.97, "publicationsFit": 15.56, "publications": 16.08, "pilotsFit": 26.44, "pilots": 35.25, "newsFit": 1.94, "news": 1.08},
  {"year": 2019, "filingsFit": 4.54, "filings": 4.49, "grantsFit": 22.04, "grants": 22.26, "publicationsFit": 18.62, "publications": 19.07, "pilotsFit": 36.31, "pilots": 44.78, "newsFit": 3.02, "news": 1.73},
  {"year": 2020, "filingsFit": 5.21, "filings": 5.13, "grantsFit": 26.86, "grants": 27.15, "publicationsFit": 22.08, "publications": 22.31, "pilotsFit": 47.49, "pilots": 47.46, "newsFit": 4.67, "news": 1.73},
  {"year": 2021, "filingsFit": 5.97, "filings": 5.83, "grantsFit": 32.27, "grants": 32.56, "publicationsFit": 25.96, "publications": 25.53, "pilotsFit": 58.92, "pilots": 48.24, "newsFit": 7.17, "news": 2.82},
  {"year": 2022, "filingsFit": 6.81, "filings": 6.74, "grantsFit": 38.19, "grants": 38.28, "publicationsFit": 30.23, "publications": 29.48, "pilotsFit": 69.47, "pilots": 70.56, "newsFit": 10.83, "news": 8.66},
  {"year": 2023, "filingsFit": 7.75, "filings": 7.74, "grantsFit": 44.47, "grants": 44.16, "publicationsFit": 34.85, "publications": 34.09, "pilotsFit": 78.3, "pilots": 81.35, "newsFit": 16.05, "news": 16.68},
  {"year": 2024, "filingsFit": 8.8, "filings": 8.85, "grantsFit": 50.92, "grants": 50.72, "publicationsFit": 39.76, "publications": 39.31, "pilotsFit": 85.12, "pilots": 87.21, "newsFit": 23.13, "news": 25.99},
  {"year": 2025, "filingsFit": 9.96, "filings": 10.0, "grantsFit": 57.34, "grants": 57.51, "publicationsFit": 44.87, "publications": 45.84, "pilotsFit": 90.07, "pilots": 88.21, "newsFit": 32.13, "news": 32.06},
  {"year": 2026, "filingsFit": 11.25, "grantsFit": 63.51, "publicationsFit": 50.08, "pilotsFit": 93.5, "newsFit": 42.69},
  {"year": 2027, "filingsFit": 12.66, "grantsFit": 69.26, "publicationsFit": 55.27, "pilotsFit": 95.8, "newsFit": 53.96},
  {"year": 2028, "filingsFit": 14.22, "grantsFit": 74.47, "publicationsFit": 60.35, "pilotsFit": 97.31, "newsFit": 64.85},
  {"year": 2029, "filingsFit": 15.93, "grantsFit": 79.06, "publicationsFit": 65.21, "pilotsFit": 98.29, "newsFit": 74.38},
  {"year": 2030, "filingsFit": 17.78, "grantsFit": 83.01, "publicationsFit": 69.77, "pilotsFit": 98.91, "newsFit": 82.04},
];

export type DiffusionFit = {
  key: 'filings' | 'grants' | 'publications' | 'pilots' | 'news';
  label: string;
  color: string;
  m: number;
  p: number;
  q: number;
  takeoff: number | null;
  takeoffLabel: string;
  r2: number;
  observedCum: number;
  unit: string;
  source: string;
};

export const diffusionFits: DiffusionFit[] = [
  { key: 'publications', label: 'Academic publications', color: 'hsl(var(--muted-foreground))', m: 16585, p: 0.00179, q: 0.20531, takeoff: 2019.5, takeoffLabel: '2019', r2: 0.9972, observedCum: 7603, unit: 'papers', source: 'OpenAlex corpus, 8,294 records' },
  { key: 'filings', label: 'Patent applications', color: 'hsl(var(--energy-amber))', m: 70890, p: 0.0009, q: 0.12725, takeoff: null, takeoffLabel: 'after 2030', r2: 0.9986, observedCum: 7089, unit: 'applications', source: 'Lens.org corpus, 7,679 applications' },
  { key: 'grants', label: 'Granted patents', color: 'hsl(var(--foreground))', m: 3639, p: 0.0012, q: 0.25645, takeoff: 2018.7, takeoffLabel: '2019', r2: 0.9997, observedCum: 2093, unit: 'grants', source: 'Lens.org corpus, 2,451 grants' },
  { key: 'pilots', label: 'Pilot adoption (vehicles)', color: 'hsl(var(--energy-green))', m: 1909, p: 0.00016, q: 0.46095, takeoff: 2017.4, takeoffLabel: '2017', r2: 0.9797, observedCum: 1684, unit: 'vehicles', source: 'Pilots & Demonstrators module, 43 pilots' },
  { key: 'news', label: 'News and media coverage', color: 'hsl(var(--primary))', m: 462, p: 0.00001, q: 0.45336, takeoff: 2023.7, takeoffLabel: '2024', r2: 0.9736, observedCum: 148, unit: 'articles', source: 'News & Media corpus, 195 articles' },
];

// News and media score: cumulative articles reached as a share of the fitted potential (m),
// using article counts per year from the News & Media corpus.
export const newsMediaScore = {
  score: 32,
  perYear: [
    { year: 2010, count: 2 },
    { year: 2016, count: 2 },
    { year: 2018, count: 1 },
    { year: 2019, count: 3 },
    { year: 2021, count: 5 },
    { year: 2022, count: 27 },
    { year: 2023, count: 37 },
    { year: 2024, count: 43 },
    { year: 2025, count: 28 },
    { year: 2026, count: 47 },
  ],
  note:
    'Coverage takes off in 2024, the latest of the five curves: media attention follows deployment and research rather than leading it. 2026 already carries 47 articles, the highest annual count in the corpus.',
};

// Search interest (Google Trends module) is tracked weekly for 2025-2026 only, which is too
// short a window for a Bass fit, so it is reported without coefficients.
export const searchTrendNote =
  'Search interest is tracked in the Trends module, but the available Google Trends history (2025-2026) is too short to estimate Bass coefficients, so no curve is fitted here.';

// Pilot technology-adoption score: composite of four normalised indicators from the Pilots module.
export const pilotAdoptionScore = {
  score: 80,
  components: [
    { label: 'Diffusion progress', value: 88, detail: '1,684 of an estimated 1,909 vehicle potential deployed' },
    { label: 'Imitation strength (q)', value: 92, detail: 'q = 0.461, the strongest word-of-mouth coefficient of the five curves' },
    { label: 'Deployment scale', value: 74, detail: '32 of 43 pilots reach depot or grid-critical scale' },
    { label: 'Programme continuity', value: 65, detail: '28 of 43 pilots are still active' },
  ],
  verdict:
    'Pilots took off first (2017), publications and granted patents followed around 2019, news coverage only in 2024, while patent filings are still pre-takeoff - the successive diffusion pattern Takahashi et al. describe.',
};
