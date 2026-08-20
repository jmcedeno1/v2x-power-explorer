import { useMemo, useState } from 'react';
import { BookOpen, Globe, FileStack, ExternalLink, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  standardsCatalog,
  euRegulations,
  usRegulations,
  type StandardBody,
  type RegulationEntry,
} from '@/data/standardsCatalog';

const BODIES: (StandardBody | 'All Bodies')[] = [
  'All Bodies',
  'ISO/IEC',
  'IEC',
  'SAE',
  'IEEE',
  'UL',
  'OCA',
  'CHAdeMO',
  'CENELEC',
  'VDE/FNN',
  'Standards Australia',
  'SAC (China)',
];


function Chip({ children, tone = 'muted' }: { children: React.ReactNode; tone?: 'muted' | 'primary' | 'warning' }) {
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-[11px] font-medium',
        tone === 'primary'
          ? 'bg-primary text-primary-foreground'
          : tone === 'warning'
            ? 'bg-energy-amber/15 text-energy-amber border border-energy-amber/25'
            : 'bg-muted text-muted-foreground'
      )}
    >
      {children}
    </span>
  );
}

function Section({
  icon,
  title,
  children,
  defaultOpen = true,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border bg-card mb-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 p-5"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

function RegulationList({ items }: { items: RegulationEntry[] }) {
  return (
    <div className="space-y-3">
      {items.map((r) => (
        <div key={r.id} className="p-4 rounded-lg border bg-background">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h4 className="text-sm font-semibold text-foreground">{r.title}</h4>
            <div className="flex items-center gap-2 shrink-0">
              <Chip>{r.type}</Chip>
              <Chip>{r.year}</Chip>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{r.description}</p>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            {r.linkLabel} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ))}
    </div>
  );
}

export function StandardsCatalog() {
  const [body, setBody] = useState<StandardBody | 'All Bodies'>('All Bodies');

  const filtered = useMemo(
    () => (body === 'All Bodies' ? standardsCatalog : standardsCatalog.filter((s) => s.body === body)),
    [body]
  );

  return (
    <>
      <Section icon={<BookOpen className="w-5 h-5 text-primary" />} title="Technical Standards">
        <p className="text-sm text-muted-foreground mb-4">
          Curated V2G / bidirectional-charging standards from IEC, ISO, SAE, IEEE, UL, Open Charge Alliance and
          CHAdeMO. Each entry links to the official catalogue page.
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {BODIES.map((b) => (
            <button
              key={b}
              onClick={() => setBody(b)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                body === b
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
              )}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <div key={s.id} className="p-4 rounded-lg border bg-background flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-sm font-semibold text-foreground">{s.id}</span>
                <Chip>{s.body}</Chip>
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1.5 leading-snug">{s.title}</h4>
              <p className="text-xs text-muted-foreground mb-3 flex-1">{s.description}</p>
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone="primary">{s.status}</Chip>
                  <Chip>{s.year}</Chip>
                  <Chip>{s.region}</Chip>
                </div>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
                >
                  Source <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={<Globe className="w-5 h-5 text-primary" />} title="European Union - Regulatory Acts">
        <RegulationList items={euRegulations} />
      </Section>

      <Section
        icon={<FileStack className="w-5 h-5 text-primary" />}
        title="United States - Federal and State Rules"
        defaultOpen={false}
      >
        <RegulationList items={usRegulations} />
      </Section>
    </>
  );
}
