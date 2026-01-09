import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, PieChart, Layers, Zap, Activity, ArrowUpDown, Shield, Sun, BarChart3, Building2, Globe, Users } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { expertQuestions } from '@/data/v2xData';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const marketMetrics = [
  {
    icon: DollarSign,
    title: 'Global V2X Market',
    value: '$19.5B',
    subtitle: 'Projected by 2030',
    color: 'from-energy-green to-energy-teal',
  },
  {
    icon: TrendingUp,
    title: 'CAGR',
    value: '27.6%',
    subtitle: 'Compound growth rate',
    color: 'from-energy-teal to-energy-blue',
  },
  {
    icon: BarChart3,
    title: 'Annual Sales (2024)',
    value: '$3.2B',
    subtitle: 'V2X equipment & services',
    color: 'from-energy-blue to-energy-purple',
  },
  {
    icon: TrendingUp,
    title: 'Sales Growth',
    value: '+34%',
    subtitle: 'YoY growth (2023-2024)',
    color: 'from-energy-purple to-energy-orange',
  },
  {
    icon: Building2,
    title: 'Annual Investment',
    value: '$4.8B',
    subtitle: 'Global V2X infrastructure',
    color: 'from-energy-orange to-energy-amber',
  },
  {
    icon: PieChart,
    title: 'Commercial Share',
    value: '73%',
    subtitle: 'Fleet/commercial deployments',
    color: 'from-energy-amber to-energy-green',
  },
  {
    icon: Layers,
    title: 'Revenue Stacking',
    value: '3-4x',
    subtitle: 'Service multiplier potential',
    color: 'from-energy-green to-energy-teal',
  },
  {
    icon: Globe,
    title: 'Active Markets',
    value: '28',
    subtitle: 'Countries with V2X programs',
    color: 'from-energy-teal to-energy-blue',
  },
];

const marketByRegion = [
  { name: 'Europe', value: 38, color: '#0EA5E9' },
  { name: 'North America', value: 28, color: '#10B981' },
  { name: 'Asia Pacific', value: 24, color: '#8B5CF6' },
  { name: 'Rest of World', value: 10, color: '#F59E0B' },
];

const marketPlayers = [
  {
    region: 'Europe',
    players: [
      { name: 'Nuvve', country: '🇩🇰', investment: '$180M', focus: 'Fleet V2G aggregation' },
      { name: 'Fermata Energy', country: '🇬🇧', investment: '$65M', focus: 'Commercial V2B' },
      { name: 'Wallbox', country: '🇪🇸', investment: '$450M', focus: 'Residential & commercial' },
      { name: 'ABB E-mobility', country: '🇨🇭', investment: '$280M', focus: 'DC fast charging + V2G' },
    ],
  },
  {
    region: 'North America',
    players: [
      { name: 'Dcbel', country: '🇨🇦', investment: '$42M', focus: 'Residential V2H' },
      { name: 'Fermata Energy', country: '🇺🇸', investment: '$25M', focus: 'Fleet V2G/V2B' },
      { name: 'Ford Pro', country: '🇺🇸', investment: '$500M+', focus: 'Integrated F-150 Lightning' },
      { name: 'GM Energy', country: '🇺🇸', investment: '$750M', focus: 'Ultium-based V2H/V2G' },
    ],
  },
  {
    region: 'Asia Pacific',
    players: [
      { name: 'Nissan', country: '🇯🇵', investment: '$200M', focus: 'CHAdeMO V2H pioneer' },
      { name: 'Hyundai/Kia', country: '🇰🇷', investment: '$350M', focus: 'V2L & V2G integration' },
      { name: 'BYD', country: '🇨🇳', investment: '$600M', focus: 'Integrated energy ecosystem' },
      { name: 'CATL', country: '🇨🇳', investment: '$1.2B', focus: 'Battery + grid services' },
    ],
  },
];

const revenueStreams = [
  { 
    name: 'Demand Charge Avoidance (V2B)', 
    share: 35, 
    description: 'Offset site-level power spikes',
    icon: Zap,
    color: 'from-energy-green to-energy-teal',
    tooltip: {
      title: 'Demand Charge Avoidance',
      definition: 'Using EV batteries to reduce peak power demand at commercial sites, lowering utility demand charges.',
      mechanism: 'EVs discharge during peak demand periods to flatten load curves and reduce the highest 15-minute power draw.',
      value: '$50-150/kW-month savings',
      bestFor: 'Fleet depots, logistics hubs, commercial buildings with high peak loads',
      example: 'A bus depot using 10 buses to shave 500kW peaks can save $75,000/year in demand charges.'
    }
  },
  { 
    name: 'Frequency Regulation (V2G)', 
    share: 25, 
    description: 'Sub-second grid responses',
    icon: Activity,
    color: 'from-energy-teal to-energy-blue',
    tooltip: {
      title: 'Frequency Regulation',
      definition: 'Providing rapid power injection/absorption to maintain grid frequency at 50/60 Hz.',
      mechanism: 'EVs respond to AGC signals within seconds, injecting or absorbing power to balance supply and demand.',
      value: '$15-40/MW-hour',
      bestFor: 'Aggregated EV fleets with fast-response bidirectional chargers',
      example: 'A 50-vehicle fleet providing 2MW of regulation can earn $25,000-60,000/year in ancillary service payments.'
    }
  },
  { 
    name: 'Energy Arbitrage', 
    share: 20, 
    description: 'Buy low, sell high',
    icon: ArrowUpDown,
    color: 'from-energy-blue to-energy-purple',
    tooltip: {
      title: 'Energy Arbitrage',
      definition: 'Charging EVs during low-price periods and discharging during high-price periods.',
      mechanism: 'Leverage time-of-use rates or wholesale price differentials to generate revenue from price spreads.',
      value: '$0.05-0.15/kWh spread',
      bestFor: 'Markets with high price volatility, sites with dynamic pricing tariffs',
      example: 'Charging at $0.08/kWh overnight and discharging at $0.25/kWh during peak yields $0.17/kWh gross margin.'
    }
  },
  { 
    name: 'Backup Power', 
    share: 15, 
    description: 'Resilience as a service',
    icon: Shield,
    color: 'from-energy-purple to-energy-orange',
    tooltip: {
      title: 'Backup Power',
      definition: 'Using EV batteries to provide emergency power during grid outages.',
      mechanism: 'EVs island from the grid and power critical loads, providing hours of backup depending on battery size.',
      value: '$2,000-10,000/year avoided costs',
      bestFor: 'Critical facilities, healthcare, data centers, residential in outage-prone areas',
      example: 'A 100kWh EV battery can power a home for 3+ days or keep critical business systems running for 8-12 hours.'
    }
  },
  { 
    name: 'RES Integration', 
    share: 5, 
    description: 'Renewable energy smoothing',
    icon: Sun,
    color: 'from-energy-orange to-energy-amber',
    tooltip: {
      title: 'Renewable Energy Integration',
      definition: 'Using EVs to absorb excess renewable generation and smooth intermittent output.',
      mechanism: 'EVs charge when solar/wind production peaks and discharge when renewables are unavailable.',
      value: 'Avoided curtailment + green premium',
      bestFor: 'Sites with on-site solar, renewable-heavy grids, sustainability-focused operators',
      example: 'Absorbing excess midday solar prevents curtailment and maximizes self-consumption rates up to 90%.'
    }
  },
];

export default function MarketsPage() {
  const marketQuestions = expertQuestions.filter(q => q.module === 'markets');

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<TrendingUp className="w-7 h-7 text-white" />}
          title="Markets & Business Models"
          description="Economic landscape and revenue opportunities in bidirectional energy"
          badge="Economic"
        />

        {/* Market metrics */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Market Indicators</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {marketMetrics.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-card border hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-muted-foreground">{item.title}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Market Players Section */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Global Market Players & Investment
          </h3>
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Pie Chart */}
            <div className="lg:col-span-2 p-6 rounded-xl bg-card border">
              <h4 className="text-sm font-semibold text-muted-foreground mb-4">Market Share by Region</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={marketByRegion}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {marketByRegion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Market Share']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {marketByRegion.map((region, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: region.color }} />
                    <span className="text-xs text-muted-foreground">{region.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Players by Region */}
            <div className="lg:col-span-3 space-y-4">
              {marketPlayers.map((regionData, regionIndex) => (
                <motion.div
                  key={regionData.region}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: regionIndex * 0.1 }}
                  className="p-4 rounded-xl bg-card border"
                >
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    {regionData.region}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {regionData.players.map((player, playerIndex) => (
                      <div 
                        key={playerIndex}
                        className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">{player.country} {player.name}</span>
                          <span className="text-xs font-bold text-primary">{player.investment}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{player.focus}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Revenue stacking visualization */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Stacking Portfolio</h3>
          <div className="p-6 rounded-xl bg-card border">
            <div className="space-y-4">
            {revenueStreams.map((stream, index) => {
              const StreamIcon = stream.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="flex justify-between mb-1">
                    <HoverCard openDelay={100} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer group">
                          <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${stream.color} flex items-center justify-center`}>
                            <StreamIcon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors underline decoration-dotted underline-offset-4">
                            {stream.name}
                          </span>
                          <span className="text-xs text-muted-foreground">– {stream.description}</span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 p-0 overflow-hidden" side="right" align="start">
                        <div className={`h-2 bg-gradient-to-r ${stream.color}`} />
                        <div className="p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stream.color} flex items-center justify-center`}>
                              <StreamIcon className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="font-semibold text-foreground">{stream.tooltip.title}</h4>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{stream.tooltip.definition}</p>
                          
                          <div className="space-y-2 text-xs">
                            <div className="p-2 rounded-md bg-muted/50">
                              <span className="font-medium text-foreground">How it works: </span>
                              <span className="text-muted-foreground">{stream.tooltip.mechanism}</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-2 rounded-md bg-primary/10">
                              <span className="font-medium text-foreground">Value Potential</span>
                              <span className="font-semibold text-primary">{stream.tooltip.value}</span>
                            </div>
                            
                            <div className="p-2 rounded-md bg-muted/50">
                              <span className="font-medium text-foreground">Best for: </span>
                              <span className="text-muted-foreground">{stream.tooltip.bestFor}</span>
                            </div>
                            
                            <div className="p-2 rounded-md border border-primary/20 bg-primary/5">
                              <span className="font-medium text-primary">💡 Example: </span>
                              <span className="text-muted-foreground">{stream.tooltip.example}</span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <span className="text-sm font-bold text-primary">{stream.share}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stream.share}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                </motion.div>
              );
            })}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Strategic Insight:</strong> Commercial traction is highest in heavy-duty fleets 
                and bus depots, where vehicles have batteries exceeding 300–600 kWh and predictable schedules.
              </p>
            </div>
          </div>
        </section>

        {/* Key evidence */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Market Evidence</h3>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-energy-green mt-2" />
                <p className="text-sm text-foreground">
                  <strong>"Revenue stacking"</strong> is the primary model, combining peak shaving, ancillary services, and demand-charge avoidance
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-energy-amber mt-2" />
                <p className="text-sm text-foreground">
                  <strong>"Double taxation"</strong> remains a barrier in several jurisdictions, taxing energy at draw and again at discharge
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <p className="text-sm text-foreground">
                  Centralized depots simplify <strong>grid-code compliance</strong> and utility interconnection logic vs. distributed residential
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* Expert questions */}
        <section>
          <h3 className="text-lg font-semibold text-foreground mb-4">Expert Interview Questions</h3>
          <div className="space-y-3">
            {marketQuestions.map((question, index) => (
              <QuestionCard key={question.id} question={question} index={index} />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
