import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { fitBass } from '@/lib/bassFit';

export const NEWS_DIFFUSION_QUERY_KEY = ['news-diffusion'] as const;

export type NewsDiffusion = {
  total: number;
  perYear: { year: number; count: number }[];
  fit: { m: number; p: number; q: number; r2: number; takeoff: number | null };
  score: number;
  /** year -> observed cumulative % of potential (only up to last complete year) */
  observed: Record<number, number>;
  /** year -> fitted cumulative % of potential */
  fitted: Record<number, number>;
  lastFittedYear: number;
};

const START_YEAR = 2004;
const END_YEAR = 2030;

async function fetchNewsDiffusion(): Promise<NewsDiffusion | null> {
  const { data, error } = await supabase
    .from('documents')
    .select('year')
    .eq('doc_type', 'news')
    .not('year', 'is', null)
    .limit(20000);
  if (error || !data?.length) return null;

  const counts = new Map<number, number>();
  for (const row of data) {
    const y = row.year as number;
    if (!y) continue;
    counts.set(y, (counts.get(y) ?? 0) + 1);
  }
  const total = data.length;

  // The current year is only partially populated, so it is excluded from the fit.
  const currentYear = new Date().getFullYear();
  const lastFittedYear = currentYear - 1;

  const years: number[] = [];
  const t: number[] = [];
  const cum: number[] = [];
  let running = 0;
  for (let y = START_YEAR; y <= lastFittedYear; y++) {
    running += counts.get(y) ?? 0;
    years.push(y);
    t.push(y - START_YEAR + 1);
    cum.push(running);
  }

  const fit = fitBass(t, cum, START_YEAR - 1);
  if (!fit) return null;

  const observed: Record<number, number> = {};
  years.forEach((y, i) => {
    observed[y] = Math.round((1000 * cum[i]) / fit.m) / 10;
  });

  const fitted: Record<number, number> = {};
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    const e = Math.exp(-(fit.p + fit.q) * (y - START_YEAR + 1));
    const f = (fit.m * (1 - e)) / (1 + (fit.q / fit.p) * e);
    fitted[y] = Math.round((1000 * f) / fit.m) / 10;
  }

  const perYear = [...counts.entries()]
    .filter(([y]) => y >= START_YEAR)
    .sort((a, b) => a[0] - b[0])
    .map(([year, count]) => ({ year, count }));

  return {
    total,
    perYear,
    fit,
    score: Math.min(100, Math.round((100 * cum[cum.length - 1]) / fit.m)),
    observed,
    fitted,
    lastFittedYear,
  };
}

export function useNewsDiffusion() {
  return useQuery({ queryKey: NEWS_DIFFUSION_QUERY_KEY, queryFn: fetchNewsDiffusion, staleTime: 5 * 60 * 1000 });
}
