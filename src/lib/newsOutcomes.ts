/**
 * Derives concrete "outcome" metrics from already-fetched news articles.
 * Purely a presentation-layer derivation: no fetching, no data-model change.
 */

export type OutcomeType =
  | 'power'
  | 'compensation'
  | 'range'
  | 'deployments'
  | 'pilots'
  | 'cost'
  | 'savings'
  | 'efficiency';

export interface OutcomeArticle {
  id: string;
  title: string | null;
  abstract?: string | null;
  url: string | null;
  date: string | null;
  raw?: any;
}

export interface Outcome {
  type: OutcomeType;
  value: string;
  label: string;
  /** small note under the tile: source · date */
  note: string;
  direction?: 'up' | 'down' | 'flat';
  article: OutcomeArticle;
  /** numeric magnitude used for ranking */
  weight: number;
}

export const OUTCOME_META: Record<OutcomeType, { label: string; accent: string; ring: string }> = {
  power: { label: 'Power', accent: 'text-energy-blue', ring: 'border-energy-blue/30 bg-energy-blue/5' },
  compensation: { label: 'Compensation', accent: 'text-energy-green', ring: 'border-energy-green/30 bg-energy-green/5' },
  range: { label: 'Range / Battery', accent: 'text-energy-red', ring: 'border-energy-red/30 bg-energy-red/5' },
  deployments: { label: 'Deployments', accent: 'text-primary', ring: 'border-primary/30 bg-primary/5' },
  pilots: { label: 'Pilots', accent: 'text-accent-foreground', ring: 'border-accent/40 bg-accent/10' },
  cost: { label: 'Market / Cost', accent: 'text-energy-teal', ring: 'border-energy-teal/30 bg-energy-teal/5' },
  savings: { label: 'Savings', accent: 'text-energy-green', ring: 'border-energy-green/30 bg-energy-green/5' },
  efficiency: { label: 'Efficiency', accent: 'text-energy-blue', ring: 'border-energy-blue/30 bg-energy-blue/5' },
};

export const OUTCOME_ORDER: OutcomeType[] = [
  'deployments',
  'compensation',
  'power',
  'cost',
  'savings',
  'efficiency',
  'range',
  'pilots',
];

export const OUTCOME_SECTIONS: { type: OutcomeType; title: string; description: string }[] = [
  { type: 'compensation', title: 'Compensation', description: 'What owners and fleets are actually paid' },
  { type: 'deployments', title: 'Deployments', description: 'Vehicles, chargers and homes live in the field' },
  { type: 'pilots', title: 'Pilots', description: 'Programs announced, launched or extended' },
  { type: 'cost', title: 'Cost & Market Size', description: 'Prices, investment and market forecasts' },
  { type: 'savings', title: 'Savings', description: 'Bill and demand-charge reductions reported' },
  { type: 'efficiency', title: 'Efficiency', description: 'Round-trip and conversion efficiency figures' },
  { type: 'range', title: 'Range & Battery', description: 'Range or degradation impact reported' },
  { type: 'power', title: 'Power', description: 'Bidirectional power levels reported' },
];

const TIER_1 = /(reuters|bloomberg|ft\.com|wsj|nytimes|bbc|guardian|axios|cnbc|iea\.org|utilitydive|canarymedia|electrek|greentechmedia|autoevolution|electrive)/i;

function domainOf(a: OutcomeArticle): string {
  const o = a.raw?.orgs?.[0];
  if (o) return o;
  try {
    return a.url ? new URL(a.url).hostname.replace(/^www\./, '') : 'unknown';
  } catch {
    return 'unknown';
  }
}

function noteFor(a: OutcomeArticle) {
  return `${domainOf(a)}${a.date ? ` · ${a.date}` : ''}`;
}

function textOf(a: OutcomeArticle) {
  return `${a.title ?? ''} ${a.abstract ?? ''}`;
}

const num = (s: string) => Number(s.replace(/,/g, ''));

/** Extract at most one outcome per type from a single article. */
export function extractOutcomes(a: OutcomeArticle): Outcome[] {
  const text = textOf(a);
  const out: Outcome[] = [];
  const push = (o: Omit<Outcome, 'article' | 'note'>) =>
    out.push({ ...o, article: a, note: noteFor(a) });

  // Power (kW / MW)
  const power = text.match(/(\d[\d,]*(?:\.\d+)?)\s?-?\s?(kw|mw|kilowatt|megawatt)s?\b/i);
  if (power) {
    const unit = /m/i.test(power[2][0]) ? 'MW' : 'kW';
    push({
      type: 'power',
      value: `${power[1]} ${unit}`,
      label: /bidirection|v2g|v2h|discharg/i.test(text) ? 'Bidirectional power' : 'Power rating',
      weight: num(power[1]) * (unit === 'MW' ? 1000 : 1),
    });
  }

  // Compensation to owners / fleets
  const comp = text.match(
    /\$\s?(\d[\d,]*(?:\.\d+)?)\s?(?:per\s+year|\/\s?yr|a\s+year|annually|per\s+month|\/\s?month|per\s+vehicle|per\s+bus)/i,
  );
  if (comp && /(pay|paid|earn|compensat|credit|revenue|incentive|bill)/i.test(text)) {
    const period = /month/i.test(comp[0]) ? '/mo' : /vehicle|bus/i.test(comp[0]) ? '/vehicle' : '/yr';
    push({
      type: 'compensation',
      value: `$${comp[1]}${period}`,
      label: 'Owner payment',
      direction: 'up',
      weight: num(comp[1]),
    });
  }

  // Deployments
  const dep = text.match(
    /(\d[\d,]{1,9})\s+(?:electric\s+|school\s+|new\s+)?(buses|bus|vehicles|cars|evs|chargers|charging points|units|homes|households|sites|depots)\b/i,
  );
  if (dep && num(dep[1]) >= 2) {
    push({
      type: 'deployments',
      value: num(dep[1]).toLocaleString(),
      label: dep[2].toLowerCase().replace(/^bus$/, 'buses'),
      direction: 'up',
      weight: num(dep[1]),
    });
  }

  // Pilots / programs
  const pilots = text.match(/(\d{1,3})\s+(?:active\s+)?(pilots?|programs?|projects?|trials?)\b/i);
  if (pilots) {
    push({
      type: 'pilots',
      value: pilots[1],
      label: `active ${pilots[2].toLowerCase().replace(/s?$/, 's')}`,
      weight: num(pilots[1]),
    });
  }

  // Cost / market size
  const money = text.match(/([€£$])\s?(\d[\d,]*(?:\.\d+)?)\s?(billion|bn|million|m\b|trillion)/i);
  if (money) {
    const scale = /tr/i.test(money[3]) ? 'T' : /b/i.test(money[3]) ? 'B' : 'M';
    const by = text.match(/\bby\s+(20\d{2})\b/i);
    push({
      type: 'cost',
      value: `${money[1]}${money[2]}${scale}`,
      label: by ? `market by ${by[1]}` : 'market / investment',
      direction: 'up',
      weight: num(money[2]) * (scale === 'T' ? 1e6 : scale === 'B' ? 1000 : 1),
    });
  }

  // Savings
  const save = text.match(
    /(\d{1,3})\s?%\s*(?:lower|less|reduction|cheaper|savings?|saved?|off)\b|(?:sav\w+|reduc\w+|cut\w*)\D{0,25}?(\d{1,3})\s?%/i,
  );
  if (save) {
    const v = save[1] ?? save[2];
    if (v && num(v) <= 100)
      push({
        type: 'savings',
        value: `${v}%`,
        label: /demand charge/i.test(text) ? 'lower demand charges' : 'cost reduction',
        direction: 'down',
        weight: num(v),
      });
  }

  // Efficiency
  const eff = text.match(/(\d{2,3}(?:\.\d+)?)\s?%\s*(?:round[- ]trip\s*)?efficien\w+|round[- ]trip\D{0,20}?(\d{2,3})\s?%/i);
  if (eff) {
    const v = eff[1] ?? eff[2];
    if (v && num(v) <= 100)
      push({ type: 'efficiency', value: `${v}%`, label: 'round-trip', weight: num(v) });
  }

  // Range / battery impact
  if (/(no measurable|no significant|negligible)\s+(loss|degradation|impact)/i.test(text)) {
    push({ type: 'range', value: 'No loss', label: 'measured degradation', direction: 'flat', weight: 1 });
  } else {
    const range = text.match(/(\d{1,4})\s?(miles|mi|km|kilometres|kilometers)\b/i);
    if (range && /(range|degrad|battery|cycle|health)/i.test(text)) {
      push({
        type: 'range',
        value: `${range[1]} ${/km|kilo/i.test(range[2]) ? 'km' : 'mi'}`,
        label: 'range impact',
        weight: num(range[1]),
      });
    }
  }

  return out;
}

/** Best outcome per type across a set of articles (highest magnitude, recent first). */
export function outcomesFor(articles: OutcomeArticle[], max = 4): Outcome[] {
  const best = new Map<OutcomeType, Outcome>();
  for (const a of articles) {
    for (const o of extractOutcomes(a)) {
      const prev = best.get(o.type);
      if (!prev || o.weight > prev.weight) best.set(o.type, o);
    }
  }
  return OUTCOME_ORDER.filter((t) => best.has(t))
    .map((t) => best.get(t)!)
    .slice(0, max);
}

/** All outcomes grouped by type, ranked, for the "By Outcome" lens. */
export function groupOutcomes(articles: OutcomeArticle[]): Map<OutcomeType, Outcome[]> {
  const map = new Map<OutcomeType, Outcome[]>();
  for (const a of articles) {
    for (const o of extractOutcomes(a)) {
      const arr = map.get(o.type) ?? [];
      arr.push(o);
      map.set(o.type, arr);
    }
  }
  for (const [k, arr] of map) {
    arr.sort((x, y) => {
      const dx = x.article.date ?? '';
      const dy = y.article.date ?? '';
      if (dx !== dy) return dy.localeCompare(dx);
      return y.weight - x.weight;
    });
    map.set(k, arr);
  }
  return map;
}

/** recency x source tier x hard-number presence */
export function rankHero(articles: OutcomeArticle[]): { article: OutcomeArticle; outcomes: Outcome[] } | null {
  let best: { article: OutcomeArticle; outcomes: Outcome[]; score: number } | null = null;
  const now = Date.now();
  for (const a of articles) {
    const outs = extractOutcomes(a);
    if (outs.length === 0) continue;
    const ageDays = a.date ? Math.max(0, (now - new Date(a.date).getTime()) / 86400000) : 365;
    const recency = 1 / (1 + ageDays / 45);
    const tier = TIER_1.test(`${a.url ?? ''} ${domainOf(a)}`) ? 1.6 : 1;
    const score = recency * tier * (1 + outs.length * 0.35);
    if (!best || score > best.score) best = { article: a, outcomes: outs, score };
  }
  return best ? { article: best.article, outcomes: best.outcomes } : null;
}
