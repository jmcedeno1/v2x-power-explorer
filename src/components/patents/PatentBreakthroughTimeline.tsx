import { motion } from 'framer-motion';

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

      {/* Horizontal timeline - full width */}
      <div className="relative">
        {/* Horizontal line */}
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {breakthroughEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group"
            >
              {/* Dot */}
              <div className="flex justify-center mb-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full border-2 z-10 relative transition-all duration-300 ${
                    event.highlight
                      ? 'bg-primary border-primary shadow-sm shadow-primary/40'
                      : 'bg-card border-primary/50 group-hover:border-primary group-hover:bg-primary/20'
                  }`}
                />
              </div>

              {/* Content card */}
              <div
                className={`rounded-lg p-2.5 transition-all duration-300 h-full ${
                  event.highlight
                    ? 'bg-gradient-to-b from-primary/10 to-accent/5 border border-primary/20'
                    : 'bg-muted/30 hover:bg-muted/50'
                }`}
              >
                <p className="text-xs font-bold text-primary mb-1">{event.year}</p>
                <p className="text-xs font-medium text-foreground leading-tight mb-1">
                  {event.title}
                </p>
                <p className="text-[10px] text-muted-foreground leading-snug mb-1.5 line-clamp-2">
                  {event.detail}
                </p>
                <div className="flex flex-wrap gap-1">
                  {event.companies.slice(0, 2).map((company) => (
                    <span
                      key={company}
                      className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
