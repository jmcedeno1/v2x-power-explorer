/**
 * News & Media derivations: momentum, emerging narratives, actor moves,
 * community sentiment and corroboration against the app's other modules.
 * Presentation layer only - no fetching, no data-model change.
 */

export interface NewsItem {
  id: string;
  title: string | null;
  abstract?: string | null;
  url: string | null;
  date: string | null;
  orgs?: string[] | null;
  raw?: any;
}

const DAY = 86400000;

export function domainOf(a: NewsItem): string {
  const o = a.orgs?.[0];
  if (o) return o;
  try {
    return a.url ? new URL(a.url).hostname.replace(/^www\./, '') : 'unknown';
  } catch {
    return 'unknown';
  }
}

const isHN = (a: NewsItem) => (a.raw as any)?.provider === 'hn';
const ageDays = (a: NewsItem) => (a.date ? (Date.now() - new Date(a.date).getTime()) / DAY : Infinity);
const text = (a: NewsItem) => `${a.title ?? ''} ${a.abstract ?? ''}`;

/* ------------------------------------------------------------------ */
/* Narratives                                                          */
/* ------------------------------------------------------------------ */

export type Direction = 'gaining' | 'steady' | 'fading';

interface NarrativeDef {
  key: string;
  name: string;
  claim: string;
  re: RegExp;
}

const NARRATIVE_DEFS: NarrativeDef[] = [
  {
    key: 'compensation-blocker',
    name: 'Owner compensation as adoption blocker',
    claim: 'Drivers will only share their battery if the payment clearly beats the hassle and wear.',
    re: /\b(compensat\w+|payment|paid|earn\w*|incentive|reward|revenue share|tariff|export rate)\b/i,
  },
  {
    key: 'school-bus-onramp',
    name: 'School-bus electrification as the on-ramp',
    claim: 'Predictable, idle-heavy school and transit fleets are where bidirectional charging scales first.',
    re: /\b(school bus\w*|bus depot|transit fleet|student transport|yellow bus)\b/i,
  },
  {
    key: 'home-backup',
    name: 'The EV as household backup power',
    claim: 'Outage resilience, not grid revenue, is what sells bidirectional charging to homeowners.',
    re: /\b(v2h|vehicle[- ]to[- ]home|home backup|backup power|outage|blackout|storm|resilien\w+)\b/i,
  },
  {
    key: 'battery-doubt',
    name: 'Battery-wear skeptics',
    claim: 'Critics argue cycling the pack for the grid erodes battery life and warranty cover.',
    re: /\b(degradation|battery wear|warrant\w+|state of health|soh|cycle life|shorten\w* .{0,20}life)\b/i,
  },
  {
    key: 'grid-reliability',
    name: 'Grid reliability and flexibility promise',
    claim: 'Utilities frame parked EVs as the cheapest new source of flexibility for a strained grid.',
    re: /\b(grid stability|reliability|flexib\w+|frequency (regulation|response)|balancing|ancillary|peak demand|demand response|virtual power plant|vpp)\b/i,
  },
  {
    key: 'policy-unlock',
    name: 'Regulation as the real bottleneck',
    claim: 'Interconnection rules, metering and market access decide whether V2G projects can trade at all.',
    re: /\b(regulat\w+|policy|legislat\w+|ferc|ofgem|doe\b|permit\w*|interconnect\w*|metering|standard\w*|iso ?15118|approval)\b/i,
  },
  {
    key: 'hardware-race',
    name: 'Hardware and OEM race',
    claim: 'Automakers and charger vendors are competing to make bidirectional capability a stock feature.',
    re: /\b(launch\w*|unveil\w*|announc\w*|new (charger|wallbox|inverter)|onboard charger|bidirectional charger|wallbox|nuvve|dcbel|enphase|fermata|emporia|chargepoint|indra|sigenergy)\b/i,
  },
  {
    key: 'cost-hurdle',
    name: 'Upfront cost still the friction',
    claim: 'Equipment and installation prices are cited as the main reason uptake stays niche.',
    re: /\b(expensive|upfront cost|installation cost|price tag|cost\w* (barrier|hurdle)|capex|too costly|priced at)\b/i,
  },
  {
    key: 'fleet-commercial',
    name: 'Commercial fleets chasing depot economics',
    claim: 'Logistics and utility fleets adopt bidirectional charging to shave demand charges at the depot.',
    re: /\b(fleet\w*|depot\w*|logistics|delivery van|last mile|utility fleet|municipal fleet)\b/i,
  },
  {
    key: 'renewables-pairing',
    name: 'Pairing with solar and storage',
    claim: 'Bidirectional EVs are pitched as the flexible half of a home or campus solar system.',
    re: /\b(solar|photovoltaic|\bpv\b|rooftop|wind|renewable\w*|microgrid|home battery|storage system)\b/i,
  },
];

export interface Narrative {
  key: string;
  name: string;
  claim: string;
  count: number;
  direction: Direction;
  changePct: number | null;
  trend: { month: string; count: number }[];
  headlines: NewsItem[];
}

function monthlyTrend(items: NewsItem[], months: string[]) {
  const m = new Map<string, number>();
  for (const a of items) {
    const k = a.date ? a.date.slice(0, 7) : null;
    if (k) m.set(k, (m.get(k) ?? 0) + 1);
  }
  return months.map((k) => ({ month: k, count: m.get(k) ?? 0 }));
}

function directionOf(items: NewsItem[]): { direction: Direction; changePct: number | null } {
  const recent = items.filter((a) => ageDays(a) <= 90).length;
  const prior = items.filter((a) => ageDays(a) > 90 && ageDays(a) <= 180).length;
  if (recent === 0 && prior === 0) return { direction: 'steady', changePct: null };
  if (prior === 0) return { direction: 'gaining', changePct: null };
  const pct = ((recent - prior) / prior) * 100;
  const direction: Direction = pct >= 20 ? 'gaining' : pct <= -20 ? 'fading' : 'steady';
  return { direction, changePct: Math.round(pct) };
}

export function buildNarratives(news: NewsItem[]): Narrative[] {
  const months = [...new Set(news.map((a) => (a.date ? a.date.slice(0, 7) : null)).filter(Boolean) as string[])].sort();
  const out: Narrative[] = [];
  for (const def of NARRATIVE_DEFS) {
    const items = news.filter((a) => def.re.test(text(a)));
    if (items.length < 2) continue;
    const sorted = [...items].sort((x, y) => (y.date ?? '').localeCompare(x.date ?? ''));
    const { direction, changePct } = directionOf(items);
    out.push({
      key: def.key,
      name: def.name,
      claim: def.claim,
      count: items.length,
      direction,
      changePct,
      trend: monthlyTrend(items, months),
      headlines: sorted.slice(0, 3),
    });
  }
  return out.sort((a, b) => b.count - a.count);
}

/* ------------------------------------------------------------------ */
/* Momentum band                                                       */
/* ------------------------------------------------------------------ */

export interface Momentum {
  changePct: number | null;
  label: 'heating up' | 'cooling' | 'steady';
  breaking7: number;
  fastestNarrative: string | null;
  fastestChangePct: number | null;
  communityHeat: { title: string; url: string; points: number; comments: number; date: string | null } | null;
}

export function buildMomentum(news: NewsItem[], narratives: Narrative[]): Momentum {
  const recent = news.filter((a) => ageDays(a) <= 30).length;
  const prior = news.filter((a) => ageDays(a) > 30 && ageDays(a) <= 60).length;
  const changePct = prior > 0 ? Math.round(((recent - prior) / prior) * 100) : null;
  const label: Momentum['label'] =
    changePct === null ? 'steady' : changePct >= 10 ? 'heating up' : changePct <= -10 ? 'cooling' : 'steady';

  const rising = narratives
    .filter((n) => n.changePct !== null && n.direction === 'gaining')
    .sort((a, b) => (b.changePct ?? 0) - (a.changePct ?? 0))[0];

  const hn = news
    .filter(isHN)
    .map((a) => ({
      title: a.title ?? '',
      url: a.url ?? '#',
      date: a.date,
      points: Number((a.raw as any)?.points ?? 0),
      comments: Number((a.raw as any)?.num_comments ?? 0),
    }))
    .sort((x, y) => y.points + y.comments - (x.points + x.comments))[0];

  return {
    changePct,
    label,
    breaking7: news.filter((a) => ageDays(a) <= 7).length,
    fastestNarrative: rising?.name ?? narratives[0]?.name ?? null,
    fastestChangePct: rising?.changePct ?? null,
    communityHeat: hn ?? null,
  };
}

/* ------------------------------------------------------------------ */
/* Who's making moves                                                  */
/* ------------------------------------------------------------------ */

const ACTORS: { name: string; re: RegExp }[] = [
  { name: 'Nissan', re: /\bnissan\b/i },
  { name: 'Ford', re: /\bford\b/i },
  { name: 'GM', re: /\b(gm|general motors)\b/i },
  { name: 'Tesla', re: /\btesla\b/i },
  { name: 'Hyundai', re: /\bhyundai\b/i },
  { name: 'Kia', re: /\bkia\b/i },
  { name: 'BMW', re: /\bbmw\b/i },
  { name: 'Volkswagen', re: /\b(volkswagen|\bvw\b)\b/i },
  { name: 'Renault', re: /\brenault\b/i },
  { name: 'Volvo', re: /\bvolvo\b/i },
  { name: 'Stellantis', re: /\bstellantis\b/i },
  { name: 'Honda', re: /\bhonda\b/i },
  { name: 'Mercedes-Benz', re: /\bmercedes\b/i },
  { name: 'Rivian', re: /\brivian\b/i },
  { name: 'BYD', re: /\bbyd\b/i },
  { name: 'Nuvve', re: /\bnuvve\b/i },
  { name: 'Wallbox', re: /\bwallbox\b/i },
  { name: 'Fermata Energy', re: /\bfermata\b/i },
  { name: 'The Mobility House', re: /\bmobility house\b/i },
  { name: 'dcbel', re: /\bdcbel\b/i },
  { name: 'Enphase', re: /\benphase\b/i },
  { name: 'ChargePoint', re: /\bchargepoint\b/i },
  { name: 'Emporia', re: /\bemporia\b/i },
  { name: 'Indra', re: /\bindra\b/i },
  { name: 'SolarEdge', re: /\bsolaredge\b/i },
  { name: 'Sigenergy', re: /\bsigenergy\b/i },
  { name: 'E.ON', re: /\be\.?on\b/i },
  { name: 'Octopus Energy', re: /\boctopus\b/i },
  { name: 'EDF', re: /\bedf\b/i },
  { name: 'Enel', re: /\benel\b/i },
  { name: 'National Grid', re: /\bnational grid\b/i },
  { name: 'Duke Energy', re: /\bduke energy\b/i },
  { name: 'PG&E', re: /\b(pg&e|pacific gas)\b/i },
  { name: 'Xcel Energy', re: /\bxcel\b/i },
  { name: 'Highland Electric Fleets', re: /\bhighland electric\b/i },
  { name: 'TEPCO', re: /\btepco\b/i },
  { name: 'MAHLE', re: /\bmahle\b/i },
  { name: 'US DOE', re: /\b(department of energy|\bdoe\b)\b/i },
  { name: 'FERC', re: /\bferc\b/i },
  { name: 'Ofgem', re: /\bofgem\b/i },
  { name: 'European Commission', re: /\b(european commission|\beu\b commission)\b/i },
  { name: 'CARB / California', re: /\b(carb|california (energy|public utilities))\b/i },
];

const ACTIONS: { re: RegExp; action: string }[] = [
  { re: /\b(launch\w*|introduc\w*|unveil\w*|debut\w*)\b/i, action: 'launches bidirectional offering' },
  { re: /\b(pilot\w*|trial\w*|demonstrat\w*|field test\w*)\b/i, action: 'runs a bidirectional pilot' },
  { re: /\b(partner\w*|teams? up|collaborat\w*|joint venture|alliance)\b/i, action: 'partners on V2G delivery' },
  { re: /\b(invest\w*|funding|raises?|round|backs?)\b/i, action: 'puts money behind V2G' },
  { re: /\b(propos\w*|plans?|aims?|targets?|will offer)\b/i, action: 'proposes a new V2G model' },
  { re: /\b(approv\w*|rules?|mandat\w*|regulat\w*|authoriz\w*)\b/i, action: 'moves on V2G rules' },
  { re: /\b(certif\w*|standard\w*|iso ?15118|homologat\w*)\b/i, action: 'pushes standards compliance' },
  { re: /\b(expand\w*|scal\w*|rollout|rolls? out|deploy\w*)\b/i, action: 'expands deployment' },
  { re: /\b(enable\w*|adds?|update\w*|software|over[- ]the[- ]air)\b/i, action: 'enables the feature on its fleet' },
];

export interface ActorMove {
  id: string;
  actor: string;
  action: string;
  title: string;
  url: string;
  source: string;
  date: string | null;
}

export function buildActorMoves(news: NewsItem[], max = 12): ActorMove[] {
  const moves: ActorMove[] = [];
  const seen = new Set<string>();
  const sorted = [...news]
    .filter((a) => !isHN(a))
    .sort((x, y) => (y.date ?? '').localeCompare(x.date ?? ''));

  for (const a of sorted) {
    const t = a.title ?? '';
    const actor = ACTORS.find((c) => c.re.test(t));
    if (!actor) continue;
    const hit = ACTIONS.find((x) => x.re.test(t));
    if (!hit) continue;
    const key = `${actor.name}|${hit.action}`;
    if (seen.has(key)) continue;
    seen.add(key);
    moves.push({
      id: a.id,
      actor: actor.name,
      action: hit.action,
      title: t,
      url: a.url ?? '#',
      source: domainOf(a),
      date: a.date,
    });
    if (moves.length >= max) break;
  }
  return moves;
}

/* ------------------------------------------------------------------ */
/* Community signal (Hacker News)                                      */
/* ------------------------------------------------------------------ */

export type Sentiment = 'enthusiastic' | 'skeptical' | 'mixed';

const NEG_RE =
  /\b(not|won'?t|doubt\w*|skeptic\w*|myth|hype|overrated|problem\w*|fails?|failed|expensive|costly|degradation|warrant\w*|useless|barrier|drawback|caveat|why .{0,20}(isn'?t|hasn'?t))\b/i;
const POS_RE =
  /\b(finally|great|works|breakthrough|cheap\w*|free|saves?|impressive|first|unlock\w*|milestone|now available|standard)\b/i;

export interface CommunityThread {
  id: string;
  title: string;
  url: string;
  date: string | null;
  points: number;
  comments: number;
  sentiment: Sentiment;
  takeaway: string;
}

const TAKEAWAY: Record<Sentiment, string> = {
  enthusiastic: 'Practitioners treat this as real progress and swap setups that already work.',
  skeptical: 'Commenters push back on cost, warranty and whether the payback is real.',
  mixed: 'Interest is high but the thread splits on economics and hardware maturity.',
};

export function buildCommunityThreads(news: NewsItem[], max = 4): CommunityThread[] {
  return news
    .filter(isHN)
    .map((a) => {
      const t = text(a);
      const neg = NEG_RE.test(t);
      const pos = POS_RE.test(t);
      const sentiment: Sentiment = neg && pos ? 'mixed' : neg ? 'skeptical' : pos ? 'enthusiastic' : 'mixed';
      const points = Number((a.raw as any)?.points ?? 0);
      const comments = Number((a.raw as any)?.num_comments ?? 0);
      return {
        id: a.id,
        title: a.title ?? '',
        url: a.url ?? '#',
        date: a.date,
        points,
        comments,
        sentiment,
        takeaway: TAKEAWAY[sentiment],
      };
    })
    .sort((x, y) => y.comments + y.points - (x.comments + x.points))
    .slice(0, max);
}

/* ------------------------------------------------------------------ */
/* Signal vs. Data                                                     */
/* ------------------------------------------------------------------ */

export type SignalStrength = 'strengthening' | 'mixed' | 'weakening';

export interface SignalRow {
  module: string;
  route: string;
  claim: string;
  signal: SignalStrength;
  reason: string;
  headlines: NewsItem[];
}

function strengthFrom(items: NewsItem[]): { signal: SignalStrength; recent: number; prior: number } {
  const recent = items.filter((a) => ageDays(a) <= 90).length;
  const prior = items.filter((a) => ageDays(a) > 90 && ageDays(a) <= 180).length;
  const signal: SignalStrength =
    recent > prior * 1.2 ? 'strengthening' : recent < prior * 0.8 ? 'weakening' : 'mixed';
  return { signal, recent, prior };
}

const latest = (items: NewsItem[], n = 2) =>
  [...items].sort((x, y) => (y.date ?? '').localeCompare(x.date ?? '')).slice(0, n);

export function buildSignalRows(
  news: NewsItem[],
  refs: {
    marketClaim?: string | null;
    pilotClaim?: string | null;
    researchClaim?: string | null;
  },
): SignalRow[] {
  const rows: SignalRow[] = [];

  if (refs.marketClaim) {
    const items = news.filter((a) =>
      /\b(market|invest\w*|funding|billion|million|forecast|growth|revenue|business model)\b/i.test(text(a)),
    );
    if (items.length >= 2) {
      const { signal, recent, prior } = strengthFrom(items);
      rows.push({
        module: 'Markets',
        route: '/markets',
        claim: refs.marketClaim,
        signal,
        reason:
          signal === 'strengthening'
            ? `Commercial and investment coverage rose (${prior} to ${recent} items in the last two quarters), consistent with the forecast trajectory.`
            : signal === 'weakening'
              ? `Commercial coverage slowed (${prior} to ${recent} items), so the near-term ramp looks softer than the forecast.`
              : `Commercial coverage is flat (${prior} vs ${recent} items): the forecast is neither confirmed nor contradicted by news flow.`,
        headlines: latest(items),
      });
    }
  }

  if (refs.pilotClaim) {
    const items = news.filter((a) =>
      /\b(pilot\w*|trial\w*|demonstrat\w*|program launch|field test\w*|rollout|deploy\w*)\b/i.test(text(a)),
    );
    if (items.length >= 2) {
      const { signal, recent, prior } = strengthFrom(items);
      rows.push({
        module: 'Pilots',
        route: '/pilots',
        claim: refs.pilotClaim,
        signal,
        reason:
          signal === 'strengthening'
            ? `New pilot and rollout announcements are accelerating (${prior} to ${recent} items), so the pilot count is likely understated.`
            : signal === 'weakening'
              ? `Fewer new pilots are being announced (${prior} to ${recent} items): activity is shifting from trials to commercial rollout or pausing.`
              : `Pilot announcements hold steady (${prior} vs ${recent} items), matching the tracked project base.`,
        headlines: latest(items),
      });
    }
  }

  if (refs.researchClaim) {
    const items = news.filter((a) =>
      /\b(research\w*|study|studies|patent\w*|university|paper|trial results|test results|standard\w*|prototype)\b/i.test(
        text(a),
      ),
    );
    if (items.length >= 2) {
      const { signal, recent, prior } = strengthFrom(items);
      rows.push({
        module: 'Patents & Publications',
        route: '/publications',
        claim: refs.researchClaim,
        signal,
        reason:
          signal === 'strengthening'
            ? `News is catching up with the research curve: coverage of studies, patents and prototypes grew from ${prior} to ${recent} items.`
            : signal === 'weakening'
              ? `The narrative lags the research curve: coverage of studies and IP fell from ${prior} to ${recent} items while output keeps climbing.`
              : `News tracks the research curve loosely (${prior} vs ${recent} items): the IP and paper base is still ahead of the public story.`,
        headlines: latest(items),
      });
    }
  }

  return rows;
}
