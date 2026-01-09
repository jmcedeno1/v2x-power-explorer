import { motion } from 'framer-motion';

interface BreakthroughEvent {
  period: string;
  milestone: string;
  description: string;
  companies: string[];
  highlight?: boolean;
}

const breakthroughEvents: BreakthroughEvent[] = [
  {
    period: '1975',
    milestone: 'First EV wireless power transfer patent',
    description: 'Inductive energized cables laid in the road to power an electrically driven vehicle.',
    companies: [],
  },
  {
    period: '1985',
    milestone: 'First patents filed by automakers',
    description: 'Magnetic coupling device for power transmission (Honda) and ferromagnetic shell core for electric coils (Porsche).',
    companies: ['Honda', 'Porsche'],
    highlight: true,
  },
  {
    period: '1985-1990',
    milestone: 'Japanese companies take patent lead',
    description: 'First patents on wireless chargers for EVs from Toyota, Hitachi, Honda, Mitsubishi, and Yamaha.',
    companies: ['Toyota', 'Hitachi', 'Honda'],
  },
  {
    period: '1990-1995',
    milestone: 'First patents on dynamic charging',
    description: 'Noncontact power supply for moving object (Daifuku) and noncontact current collector of running vehicle (Sumitomo).',
    companies: ['Daifuku', 'Sumitomo'],
    highlight: true,
  },
  {
    period: '1995',
    milestone: 'Patent applicants expand worldwide',
    description: 'First patents on cooling (Hughes Aircraft) and self-aligning systems (Delco Electronics).',
    companies: ['Hughes Aircraft', 'Delco'],
  },
  {
    period: '2000-2005',
    milestone: 'Focus on transmission and receiver coils',
    description: 'Systems for transmitting energy and signals (Bosch), automakers patent coil units (BMW, Nissan, Honda).',
    companies: ['Bosch', 'BMW', 'Nissan'],
  },
  {
    period: '2005-2010',
    milestone: 'Focus on signaling and adaptive control',
    description: 'Power control unit (U. of Auckland), power supply system (KAIST) and power control device (Panasonic).',
    companies: ['Panasonic', 'KAIST'],
  },
  {
    period: '2010',
    milestone: 'Magnetic Inductive Resonance Breakthrough',
    description: 'Qualcomm (WiTricity today) first patented its Wireless Energy Transfer Using Repeater Resonators Patent.',
    companies: ['Qualcomm', 'WiTricity'],
    highlight: true,
  },
  {
    period: '2010-2015',
    milestone: 'FOD and renewable energy integration',
    description: 'Wind/solar wireless power transmission (Tianjin Polytechnic), system to detect foreign objects (Bombardier).',
    companies: ['Bombardier'],
  },
  {
    period: '2015-2020',
    milestone: 'Expansion in aerial, maritime and industrial vehicles',
    description: 'Wireless charger for underwater vehicles (Utah University), wireless charging for industrial vehicles (KAIST).',
    companies: ['KAIST'],
  },
  {
    period: '2020-2025',
    milestone: 'Focus on dynamic and high-power applications',
    description: 'Dynamic transmitting track (BYD), high-power dynamic wireless charging (Shenzhen Polytechnic).',
    companies: ['BYD'],
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
      <h4 className="text-base font-semibold text-foreground mb-4">
        Breakthrough Patents Timeline
      </h4>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[72px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />

        <div className="space-y-4">
          {breakthroughEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex gap-4 items-start group"
            >
              {/* Period badge */}
              <div className="w-[60px] flex-shrink-0 text-right">
                <span className="text-xs font-semibold text-primary">
                  {event.period}
                </span>
              </div>

              {/* Timeline dot */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-3 h-3 rounded-full border-2 z-10 relative transition-all duration-300 ${
                    event.highlight
                      ? 'bg-primary border-primary shadow-md shadow-primary/40'
                      : 'bg-card border-primary/50 group-hover:border-primary group-hover:bg-primary/20'
                  }`}
                />
              </div>

              {/* Content */}
              <div
                className={`flex-1 rounded-lg p-3 transition-all duration-300 ${
                  event.highlight
                    ? 'bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/20'
                    : 'bg-muted/30 hover:bg-muted/50'
                }`}
              >
                <p className="text-sm font-medium text-foreground mb-1">
                  {event.milestone}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
                {event.companies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
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
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
