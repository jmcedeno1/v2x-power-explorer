import { motion } from 'framer-motion';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface BreakthroughEvent {
  year: string;
  title: string;
  detail: string;
  companies: string[];
  highlight?: boolean;
}

const breakthroughEvents: BreakthroughEvent[] = [
  {
    year: '2002',
    title: 'First V2G concept patents',
    detail: 'AC Propulsion files early bidirectional charger IP',
    companies: ['AC Propulsion'],
  },
  {
    year: '2008',
    title: 'Grid-interactive EV systems',
    detail: 'Toyota patents vehicle-to-home power supply systems',
    companies: ['Toyota'],
    highlight: true,
  },
  {
    year: '2011',
    title: 'CHAdeMO V2H standard',
    detail: 'Nissan Leaf becomes first V2H-capable production EV',
    companies: ['Nissan', 'CHAdeMO'],
  },
  {
    year: '2014',
    title: 'Bidirectional DC fast charging',
    detail: 'Patents on high-power DC V2G inverter topologies emerge',
    companies: ['ABB', 'Siemens'],
    highlight: true,
  },
  {
    year: '2018',
    title: 'VPP integration patents',
    detail: 'Grid aggregation and virtual power plant control systems',
    companies: ['Tesla', 'Nuvve'],
  },
  {
    year: '2020',
    title: 'ISO 15118-20 alignment',
    detail: 'Bidirectional power transfer protocol implementations',
    companies: ['CharIN', 'Ionity'],
    highlight: true,
  },
  {
    year: '2022',
    title: 'SiC-based V2G converters',
    detail: 'High-efficiency silicon carbide power electronics patents',
    companies: ['BYD', 'Hyundai'],
  },
  {
    year: '2024',
    title: 'Fleet V2G orchestration',
    detail: 'AI-driven grid services and depot management systems',
    companies: ['Ford Pro', 'bp pulse'],
    highlight: true,
  },
];

export function PatentBreakthroughTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="p-6 rounded-xl bg-card border"
    >
      <h4 className="text-base font-semibold text-foreground mb-6">
        V2X Breakthrough Patents Timeline
      </h4>

      {/* Horizontal timeline with alternating layout */}
      <div className="relative px-4">
        {/* Horizontal line - centered vertically */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -translate-y-1/2" />

        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
          {breakthroughEvents.map((event, index) => {
            const isTop = index % 2 === 0;
            
            return (
              <HoverCard key={index} openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: isTop ? -10 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`group cursor-pointer flex flex-col items-center ${
                      isTop ? 'flex-col' : 'flex-col-reverse'
                    }`}
                  >
                    {/* Content area (year + title) */}
                    <div className={`flex flex-col items-center ${isTop ? 'mb-2' : 'mt-2'}`}>
                      <p className={`text-xs font-bold transition-colors ${
                        event.highlight ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                      }`}>
                        {event.year}
                      </p>
                      <p className="text-[11px] font-medium text-foreground text-center leading-tight mt-1 px-1 min-h-[32px]">
                        {event.title}
                      </p>
                    </div>

                    {/* Dot */}
                    <div
                      className={`w-3 h-3 rounded-full border-2 z-10 relative transition-all duration-300 flex-shrink-0 ${
                        event.highlight
                          ? 'bg-primary border-primary shadow-md shadow-primary/40'
                          : 'bg-card border-primary/50 group-hover:border-primary group-hover:bg-primary/20'
                      }`}
                    />

                    {/* Spacer for the other side */}
                    <div className={`min-h-[48px] ${isTop ? 'mt-2' : 'mb-2'}`} />
                  </motion.div>
                </HoverCardTrigger>

                <HoverCardContent 
                  className="w-64 p-4 bg-card border shadow-lg z-50"
                  side={isTop ? 'top' : 'bottom'}
                  align="center"
                >
                  <div>
                    <p className="text-xs font-bold text-primary mb-1">{event.year}</p>
                    <p className="text-sm font-semibold text-foreground mb-2">{event.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {event.detail}
                    </p>
                    {event.companies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {event.companies.map((company) => (
                          <span
                            key={company}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
