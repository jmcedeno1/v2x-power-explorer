// Lightweight Bass diffusion fit (coarse-to-fine grid search on p, q, m).
// Bass cumulative: F(t) = m * (1 - e^-(p+q)t) / (1 + (q/p) e^-(p+q)t)
// Takeoff (left inflection, Venkatesan & Kumar): t* = ln((q/p)(2-sqrt(3))) / (p+q)

export type BassFit = {
  m: number;
  p: number;
  q: number;
  r2: number;
  takeoff: number | null;
};

export function bassCum(t: number, m: number, p: number, q: number): number {
  const e = Math.exp(-(p + q) * t);
  return (m * (1 - e)) / (1 + (q / p) * e);
}

function sse(t: number[], y: number[], m: number, p: number, q: number): number {
  let s = 0;
  for (let i = 0; i < t.length; i++) {
    const d = bassCum(t[i], m, p, q) - y[i];
    s += d * d;
  }
  return s;
}

/**
 * @param t   time index (0-based, e.g. year - firstYear + 1)
 * @param cum cumulative observed counts
 */
export function fitBass(t: number[], cum: number[], baseYear: number): BassFit | null {
  const last = cum[cum.length - 1];
  if (!t.length || last <= 0) return null;

  let best = { m: last * 1.2, p: 0.001, q: 0.4, err: Infinity };

  const search = (
    mRange: [number, number],
    pRange: [number, number],
    qRange: [number, number],
    steps: number,
  ) => {
    for (let i = 0; i <= steps; i++) {
      const m = mRange[0] + ((mRange[1] - mRange[0]) * i) / steps;
      if (m < last) continue;
      for (let j = 0; j <= steps; j++) {
        // log spacing for p (usually very small)
        const lp = Math.log(pRange[0]) + ((Math.log(pRange[1]) - Math.log(pRange[0])) * j) / steps;
        const p = Math.exp(lp);
        for (let k = 0; k <= steps; k++) {
          const q = qRange[0] + ((qRange[1] - qRange[0]) * k) / steps;
          if (q <= 0) continue;
          const err = sse(t, cum, m, p, q);
          if (err < best.err) best = { m, p, q, err };
        }
      }
    }
  };

  search([last, last * 6], [1e-6, 0.05], [0.02, 1.6], 26);
  search(
    [Math.max(last, best.m * 0.7), best.m * 1.4],
    [Math.max(1e-7, best.p * 0.2), best.p * 5],
    [Math.max(0.005, best.q * 0.6), best.q * 1.5],
    22,
  );
  search(
    [Math.max(last, best.m * 0.9), best.m * 1.12],
    [Math.max(1e-8, best.p * 0.5), best.p * 2],
    [Math.max(0.005, best.q * 0.85), best.q * 1.18],
    18,
  );

  const mean = cum.reduce((a, b) => a + b, 0) / cum.length;
  const ssTot = cum.reduce((a, b) => a + (b - mean) * (b - mean), 0);
  const r2 = ssTot > 0 ? 1 - best.err / ssTot : 0;

  const ratio = (best.q / best.p) * (2 - Math.sqrt(3));
  const tStar = ratio > 1 ? Math.log(ratio) / (best.p + best.q) : null;
  const takeoff = tStar !== null ? baseYear + tStar : null;

  return { m: Math.round(best.m), p: best.p, q: best.q, r2, takeoff };
}
