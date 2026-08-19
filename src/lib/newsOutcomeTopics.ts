/**
 * Classifies news articles into outcome topics (Range, Power, Compensation,
 * Savings, Costs, Deployments, Pilots, Energy efficiency, Other).
 * Presentation-layer derivation only: no fetching, no data-model change.
 */

export type OutcomeTopic =
  | 'range'
  | 'power'
  | 'compensation'
  | 'savings'
  | 'costs'
  | 'deployments'
  | 'pilots'
  | 'efficiency'
  | 'other';

export const OUTCOME_TOPIC_META: Record<
  OutcomeTopic,
  { label: string; description: string; accent: string; stroke: string }
> = {
  range: {
    label: 'Range',
    description: 'Driving range, range loss and range anxiety',
    accent: 'text-energy-red',
    stroke: 'hsl(var(--energy-red))',
  },
  power: {
    label: 'Power',
    description: 'Power ratings, charging speed and discharge rates',
    accent: 'text-energy-blue',
    stroke: 'hsl(var(--energy-blue))',
  },
  compensation: {
    label: 'Compensation',
    description: 'Payments, incentives and grid revenue to owners',
    accent: 'text-energy-green',
    stroke: 'hsl(var(--energy-green))',
  },
  savings: {
    label: 'Savings',
    description: 'Bill, energy and demand-charge reductions',
    accent: 'text-energy-green',
    stroke: 'hsl(var(--energy-green))',
  },
  costs: {
    label: 'Costs',
    description: 'Prices, capex, investment and market size',
    accent: 'text-energy-purple',
    stroke: 'hsl(var(--energy-purple))',
  },
  deployments: {
    label: 'Deployments',
    description: 'Rollouts, installed units and fleets in service',
    accent: 'text-primary',
    stroke: 'hsl(var(--primary))',
  },
  pilots: {
    label: 'Pilots',
    description: 'Trials, demonstrations and field tests',
    accent: 'text-energy-amber',
    stroke: 'hsl(var(--energy-amber))',
  },
  efficiency: {
    label: 'Energy efficiency',
    description: 'Round-trip efficiency, conversion losses and degradation',
    accent: 'text-energy-teal',
    stroke: 'hsl(var(--energy-teal))',
  },
  other: {
    label: 'Other',
    description: 'Coverage without a specific outcome reported',
    accent: 'text-muted-foreground',
    stroke: 'hsl(var(--muted-foreground))',
  },
};

export const OUTCOME_TOPIC_ORDER: OutcomeTopic[] = [
  'range',
  'power',
  'compensation',
  'savings',
  'costs',
  'deployments',
  'pilots',
  'efficiency',
  'other',
];

const RANGE_RE =
  /\b(driving range|range loss|range anxiety|range)\b|\b\d[\d,.]*\s?(miles|mi\b|km|kilometers|kilometres)\b|\bmi\/cycle\b/i;

const POWER_RE =
  /\b\d[\d,.]*\s?(kw|mw|kilowatts?|megawatts?)\b|\b(kilowatt|megawatt|power output|charging speed|bidirectional power|discharge rate|onboard charger|on-board charger)\b|\bac\/dc\b/i;

const COMPENSATION_RE =
  /\b(compensation|compensated|payments?|paid|pays|earn(?:s|ed|ing)?|incentives?|rewards?|grid revenue|utility payment)\b|\$\s?[\d.]+\s?\/?\s?kwh|\bper kwh\b/i;

const REDUCTION_RE = /\b(saves?|saving|savings|saved|lower(?:s|ed|ing)?|reduc\w+|cuts?|cutting|cheaper|less expensive)\b/i;
const BILL_RE = /\b(bill|bills|cost|costs|demand charge|demand charges|electricity|energy cost|energy costs|tariff)\b/i;

const SPEND_RE =
  /\b(costs?|price[ds]?|pricing|priced at|investment|invests?|capex|installation cost|upfront|market size|market value|worth)\b/i;
const FIGURE_RE = /(\$|€|£|\busd\b|\beur\b|\bbillion\b|\bmillion\b|\bbn\b|\btrillion\b)/i;

const DEPLOYMENTS_RE =
  /\b(deploy\w*|installed|installing|installation[s]?|rollout|rolls? out|rolled out|fleets?|units|vehicles live|operational|in service|scaled|scaling)\b/i;

const PILOTS_RE = /\b(pilots?|pilot program|trials?|demonstrations?|demonstrator[s]?|proof of concept|field test[s]?)\b/i;

const EFFICIENCY_RE =
  /\b(round[- ]trip|conversion (?:efficiency|loss(?:es)?)|energy loss(?:es)?|throughput|degradation|efficiency)\b/i;
const EFFICIENCY_FIGURE_RE =
  /\d[\d.]*\s?%\s*(?:\w+\s+){0,3}?(efficien\w+|round[- ]trip|conversion|loss(?:es)?|throughput|degradation)|(efficien\w+|round[- ]trip|conversion|loss(?:es)?|throughput|degradation)(?:\W+\w+){0,4}?\W+\d[\d.]*\s?%/i;

export interface TopicArticle {
  id: string;
  title: string | null;
  abstract?: string | null;
  url: string | null;
  date: string | null;
  orgs?: string[] | null;
  raw?: any;
}

/** Topics an article reports on. Title matches take precedence over summary. */
export function classifyArticle(a: TopicArticle): OutcomeTopic[] {
  const title = a.title ?? '';
  const full = `${title} ${a.abstract ?? ''}`;
  const topics = new Set<OutcomeTopic>();

  // Broad/over-matching topics are restricted to the title.
  if (RANGE_RE.test(title)) topics.add('range');
  if (POWER_RE.test(full)) topics.add('power');
  if (COMPENSATION_RE.test(title)) topics.add('compensation');
  if (DEPLOYMENTS_RE.test(title)) topics.add('deployments');
  if (PILOTS_RE.test(full)) topics.add('pilots');

  const isSaving = REDUCTION_RE.test(full) && BILL_RE.test(full);
  if (isSaving) topics.add('savings');

  const isSpend = SPEND_RE.test(full) && FIGURE_RE.test(full);
  // Savings vs Costs precedence: a reduction alone is never a Cost.
  if (isSpend && (!isSaving || /\b(investment|invests?|capex|market size|market value|priced at|price[ds]?)\b/i.test(full))) {
    topics.add('costs');
  }

  if (EFFICIENCY_RE.test(full) && EFFICIENCY_FIGURE_RE.test(full)) topics.add('efficiency');

  if (topics.size === 0) topics.add('other');
  return OUTCOME_TOPIC_ORDER.filter((t) => topics.has(t));
}

export interface TopicGroup {
  topic: OutcomeTopic;
  label: string;
  description: string;
  count: number;
  trend: { month: string; count: number }[];
  peak: { month: string; count: number };
  sources: { name: string; count: number }[];
  articles: TopicArticle[];
}

function domainOf(a: TopicArticle): string {
  const o = a.orgs?.[0];
  if (o) return o;
  try {
    return a.url ? new URL(a.url).hostname.replace(/^www\./, '') : 'unknown';
  } catch {
    return 'unknown';
  }
}

/** Build one group per outcome topic, with a monthly coverage timeline. */
export function groupByOutcomeTopic(articles: TopicArticle[]): TopicGroup[] {
  const allMonths = [...new Set(articles.map((a) => (a.date ? a.date.slice(0, 7) : null)).filter(Boolean) as string[])].sort();

  const buckets = new Map<OutcomeTopic, TopicArticle[]>();
  for (const a of articles) {
    for (const t of classifyArticle(a)) {
      const arr = buckets.get(t) ?? [];
      arr.push(a);
      buckets.set(t, arr);
    }
  }

  const groups: TopicGroup[] = [];
  for (const topic of OUTCOME_TOPIC_ORDER) {
    const list = buckets.get(topic);
    if (!list || list.length === 0) continue;
    const meta = OUTCOME_TOPIC_META[topic];

    const monthMap = new Map<string, number>();
    const sourceMap = new Map<string, number>();
    for (const a of list) {
      const m = a.date ? a.date.slice(0, 7) : null;
      if (m) monthMap.set(m, (monthMap.get(m) ?? 0) + 1);
      const d = domainOf(a);
      sourceMap.set(d, (sourceMap.get(d) ?? 0) + 1);
    }
    const trend = allMonths.map((m) => ({ month: m, count: monthMap.get(m) ?? 0 }));
    const peak = trend.reduce((x, y) => (y.count > x.count ? y : x), { month: '', count: 0 });
    const sources = [...sourceMap.entries()]
      .sort((x, y) => y[1] - x[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
    const sorted = [...list].sort((x, y) => (y.date ?? '').localeCompare(x.date ?? ''));

    groups.push({
      topic,
      label: meta.label,
      description: meta.description,
      count: list.length,
      trend,
      peak,
      sources,
      articles: sorted.slice(0, 4),
    });
  }
  return groups;
}
