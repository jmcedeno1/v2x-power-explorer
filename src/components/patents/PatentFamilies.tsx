import { Layers } from 'lucide-react';
import { patentFamilies } from '@/data/patentFamilies';
import { PatentFamilyDialog, StatusBadge } from './PatentFamilyDialog';

export function PatentFamilies() {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-2">
        <Layers className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Patent families by technology</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
        Each patent in the corpus is matched by title and abstract to one or more V2G technology families. Cards show
        granted patents from 2024 to 2026 and new applications filed from 2024 to 2025. Click a family for
        sub-technology trends, key players and white-space opportunities.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {patentFamilies.map((f) => (
          <PatentFamilyDialog key={f.name} family={f}>
            <div className="p-4 rounded-xl bg-card border hover:border-primary/40 hover:bg-muted/30 cursor-pointer transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">{f.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {f.minYear}-{f.maxYear}
                  </div>
                </div>
                <StatusBadge status={f.status} />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="p-2 rounded-lg bg-muted/40 text-center">
                  <div className="text-lg font-bold tabular-nums text-foreground">{f.total.toLocaleString()}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight">Total documents</div>
                </div>
                <div className="p-2 rounded-lg bg-muted/40 text-center">
                  <div className="text-lg font-bold tabular-nums text-foreground">{f.granted2426}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight">Granted 2024-2026</div>
                </div>
                <div className="p-2 rounded-lg bg-muted/40 text-center">
                  <div className="text-lg font-bold tabular-nums text-foreground">{f.filings2425}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight">Filings 2024-2025</div>
                </div>
              </div>

              <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${f.share5}%` }} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">{f.share5}% of documents in the last 5 years</div>
            </div>
          </PatentFamilyDialog>
        ))}
      </div>
    </section>
  );
}
