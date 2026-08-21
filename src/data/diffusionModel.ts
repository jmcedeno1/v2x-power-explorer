// Takahashi / Bass diffusion model applied to the project corpora.
// Bass: dN/dt = (p + q*N/m)*(m - N);  cumulative fit F(t) = m*(1-e^-(p+q)t)/(1+(q/p)e^-(p+q)t)
// Takeoff (left inflection, Venkatesan & Kumar): t* = 1/(p+q) * ln((q/p)*(2-sqrt(3)))
// Fitted with nonlinear least squares on cumulative counts, origin t=0 at 2003.
// Sources: Lens.org patents corpus (filings, grants), OpenAlex publications corpus,
// project pilots database (cumulative vehicles deployed).

export type DiffusionPoint = {
  year: number;
  filings?: number; filingsFit: number;
  grants?: number; grantsFit: number;
  publications?: number; publicationsFit: number;
  pilots?: number; pilotsFit: number;
};

// Values are cumulative adoption as a percentage of each series' estimated potential (m).
export const diffusionCurves: DiffusionPoint[] = [
  {"year": 2004, "filingsFit": 0.09, "filings": 0.05, "grantsFit": 0.14, "grants": 0.3, "publicationsFit": 0.2, "publications": 0.02, "pilotsFit": 0.02, "pilots": 0.0},
  {"year": 2005, "filingsFit": 0.2, "filings": 0.11, "grantsFit": 0.31, "grants": 0.52, "publicationsFit": 0.44, "publications": 0.07, "pilotsFit": 0.05, "pilots": 0.0},
  {"year": 2006, "filingsFit": 0.32, "filings": 0.2, "grantsFit": 0.54, "grants": 0.77, "publicationsFit": 0.74, "publications": 0.14, "pilotsFit": 0.11, "pilots": 0.0},
  {"year": 2007, "filingsFit": 0.46, "filings": 0.31, "grantsFit": 0.83, "grants": 1.07, "publicationsFit": 1.1, "publications": 0.28, "pilotsFit": 0.19, "pilots": 0.0},
  {"year": 2008, "filingsFit": 0.62, "filings": 0.46, "grantsFit": 1.21, "grants": 1.4, "publicationsFit": 1.54, "publications": 0.47, "pilotsFit": 0.32, "pilots": 0.0},
  {"year": 2009, "filingsFit": 0.79, "filings": 0.65, "grantsFit": 1.69, "grants": 1.73, "publicationsFit": 2.08, "publications": 0.8, "pilotsFit": 0.53, "pilots": 0.0},
  {"year": 2010, "filingsFit": 1.0, "filings": 0.87, "grantsFit": 2.31, "grants": 2.23, "publicationsFit": 2.74, "publications": 1.44, "pilotsFit": 0.86, "pilots": 0.26},
  {"year": 2011, "filingsFit": 1.22, "filings": 1.17, "grantsFit": 3.09, "grants": 3.35, "publicationsFit": 3.53, "publications": 2.62, "pilotsFit": 1.37, "pilots": 0.26},
  {"year": 2012, "filingsFit": 1.48, "filings": 1.43, "grantsFit": 4.09, "grants": 4.56, "publicationsFit": 4.49, "publications": 4.09, "pilotsFit": 2.18, "pilots": 6.55},
  {"year": 2013, "filingsFit": 1.77, "filings": 1.8, "grantsFit": 5.36, "grants": 5.66, "publicationsFit": 5.65, "publications": 5.6, "pilotsFit": 3.43, "pilots": 6.55},
  {"year": 2014, "filingsFit": 2.1, "filings": 2.23, "grantsFit": 6.94, "grants": 7.03, "publicationsFit": 7.03, "publications": 7.56, "pilotsFit": 5.35, "pilots": 6.55},
  {"year": 2015, "filingsFit": 2.47, "filings": 2.64, "grantsFit": 8.92, "grants": 8.49, "publicationsFit": 8.68, "publications": 9.4, "pilotsFit": 8.24, "pilots": 6.55},
  {"year": 2016, "filingsFit": 2.88, "filings": 3.09, "grantsFit": 11.35, "grants": 10.74, "publicationsFit": 10.63, "publications": 11.42, "pilotsFit": 12.49, "pilots": 7.07},
  {"year": 2017, "filingsFit": 3.35, "filings": 3.47, "grantsFit": 14.31, "grants": 13.79, "publicationsFit": 12.91, "publications": 13.62, "pilotsFit": 18.47, "pilots": 8.9},
  {"year": 2018, "filingsFit": 3.88, "filings": 3.89, "grantsFit": 17.86, "grants": 17.97, "publicationsFit": 15.56, "publications": 16.08, "pilotsFit": 26.44, "pilots": 35.25},
  {"year": 2019, "filingsFit": 4.47, "filings": 4.43, "grantsFit": 22.04, "grants": 22.26, "publicationsFit": 18.62, "publications": 19.07, "pilotsFit": 36.31, "pilots": 44.78},
  {"year": 2020, "filingsFit": 5.14, "filings": 5.06, "grantsFit": 26.86, "grants": 27.15, "publicationsFit": 22.08, "publications": 22.31, "pilotsFit": 47.49, "pilots": 47.46},
  {"year": 2021, "filingsFit": 5.88, "filings": 5.75, "grantsFit": 32.27, "grants": 32.56, "publicationsFit": 25.96, "publications": 25.53, "pilotsFit": 58.92, "pilots": 48.24},
  {"year": 2022, "filingsFit": 6.72, "filings": 6.65, "grantsFit": 38.19, "grants": 38.28, "publicationsFit": 30.23, "publications": 29.48, "pilotsFit": 69.47, "pilots": 70.56},
  {"year": 2023, "filingsFit": 7.64, "filings": 7.63, "grantsFit": 44.47, "grants": 44.16, "publicationsFit": 34.85, "publications": 34.09, "pilotsFit": 78.3, "pilots": 81.35},
  {"year": 2024, "filingsFit": 8.68, "filings": 8.73, "grantsFit": 50.92, "grants": 50.72, "publicationsFit": 39.76, "publications": 39.31, "pilotsFit": 85.12, "pilots": 87.21},
  {"year": 2025, "filingsFit": 9.82, "filings": 9.86, "grantsFit": 57.34, "grants": 57.51, "publicationsFit": 44.87, "publications": 45.84, "pilotsFit": 90.07, "pilots": 88.21},
  {"year": 2026, "filingsFit": 11.09, "grantsFit": 63.51, "publicationsFit": 50.08, "pilotsFit": 93.5},
  {"year": 2027, "filingsFit": 12.49, "grantsFit": 69.26, "publicationsFit": 55.27, "pilotsFit": 95.8},
  {"year": 2028, "filingsFit": 14.03, "grantsFit": 74.47, "publicationsFit": 60.35, "pilotsFit": 97.31},
  {"year": 2029, "filingsFit": 15.71, "grantsFit": 79.06, "publicationsFit": 65.21, "pilotsFit": 98.29},
  {"year": 2030, "filingsFit": 17.55, "grantsFit": 83.01, "publicationsFit": 69.77, "pilotsFit": 98.91},
];

export type DiffusionFit = {
  key: 'filings' | 'grants' | 'publications' | 'pilots';
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
};

export const diffusionFits: DiffusionFit[] = [
  { key: 'publications', label: 'Academic publications', color: 'hsl(var(--muted-foreground))', m: 16585, p: 0.00179, q: 0.205, takeoff: 2019.5, takeoffLabel: '2019', r2: 0.9972, observedCum: 7603, unit: 'papers' },
  { key: 'filings', label: 'Patent applications', color: 'hsl(var(--energy-amber))', m: 71881, p: 0.00089, q: 0.127, takeoff: null, takeoffLabel: 'after 2030', r2: 0.9986, observedCum: 7089, unit: 'applications' },
  { key: 'grants', label: 'Granted patents', color: 'hsl(var(--foreground))', m: 3639, p: 0.0012, q: 0.256, takeoff: 2018.7, takeoffLabel: '2019', r2: 0.9997, observedCum: 2093, unit: 'grants' },
  { key: 'pilots', label: 'Pilot adoption (vehicles)', color: 'hsl(var(--energy-green))', m: 1909, p: 0.00016, q: 0.461, takeoff: 2017.4, takeoffLabel: '2017', r2: 0.9797, observedCum: 1684, unit: 'vehicles' },
];

// Search-trend history in the app covers 2025-2026 only (weekly Google Trends exports),
// which is too short a window for a Bass fit, so it is reported without coefficients.
export const searchTrendNote =
  'Search interest is tracked in the Trends module, but the available Google Trends history (2025-2026) is too short to estimate Bass coefficients, so no curve is fitted here.';

// Pilot technology-adoption score: composite of four normalised pilot-corpus indicators.
export const pilotAdoptionScore = {
  score: 80,
  components: [
    { label: 'Diffusion progress', value: 88, detail: '1,684 of an estimated 1,909 vehicle potential deployed' },
    { label: 'Imitation strength (q)', value: 92, detail: 'q = 0.461, the strongest word-of-mouth coefficient of the four curves' },
    { label: 'Deployment scale', value: 74, detail: '32 of 43 pilots reach depot or grid-critical scale' },
    { label: 'Programme continuity', value: 65, detail: '28 of 43 pilots are still active' },
  ],
  verdict:
    'Pilots took off first (2017), publications and granted patents followed around 2019, while patent filings are still pre-takeoff - the successive diffusion pattern Takahashi et al. describe.',
};
