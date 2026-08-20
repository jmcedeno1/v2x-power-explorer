import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Activity, Zap, ArrowUpDown, Shield, Sun, Home, ExternalLink, Users,
  Target, Layers, Clock, BarChart3, Quote,
} from 'lucide-react';
import type { RevenueStreamDetail } from '@/data/revenueStreamsData';

const iconMap: Record<string, any> = { Activity, Zap, ArrowUpDown, Shield, Sun, Home };

interface Props {
  stream: RevenueStreamDetail;
  children: ReactNode;
}

export function RevenueStreamPopup({ stream, children }: Props) {
  const Icon = iconMap[stream.icon] || Zap;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start gap-4 pr-6">
          <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${stream.color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <DialogTitle className="text-xl font-bold text-foreground">{stream.name}</DialogTitle>
            <DialogDescription className="mt-1">{stream.tagline}</DialogDescription>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant="secondary">{stream.marketLevel}</Badge>

              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3" />
                {stream.timescale}
              </Badge>
            </div>
          </div>
        </div>

        {/* What it is / how it pays */}
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          <div className="p-4 rounded-lg bg-muted/40 border">
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> What the application consists of
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{stream.whatItIs}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/40 border">
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> How it earns revenue
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{stream.howItPays}</p>
          </div>
        </div>

        {/* Metrics */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Key figures</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {stream.metrics.map((m) => (
              <div key={m.label} className="p-3 rounded-lg border bg-card">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="text-base font-bold text-foreground mt-0.5">{m.value}</p>
                {m.note && <p className="text-xs text-muted-foreground mt-1">{m.note}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Applications + players */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Specific applications
            </h4>
            <ul className="space-y-2">
              {stream.applications.map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{a}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Main players
            </h4>
            <div className="space-y-2">
              {stream.players.map((p) => (
                <div key={p.name} className="p-2.5 rounded-lg border bg-card">
                  <div className="flex items-start justify-between gap-2">
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                      >
                        {p.name}
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                    )}
                    {p.region && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded border text-muted-foreground shrink-0">
                        {p.region}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evidence */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Quote className="w-4 h-4 text-primary" /> Evidence from the literature
          </h4>
          <ul className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
            {stream.evidence.map((e) => (
              <li key={e} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span className="text-sm text-foreground">{e}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* References */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Sources</h4>
          <div className="space-y-2">
            {stream.references.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2 p-2.5 rounded-lg border bg-card hover:border-primary/40 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">
                  {r.title}
                  <span className="text-muted-foreground"> - {r.source}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
