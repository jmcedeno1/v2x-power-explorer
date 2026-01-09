export interface Pilot {
  id: string;
  name: string;
  type: 'bus_depot' | 'fleet' | 'port' | 'logistics' | 'building' | 'residential';
  location: string;
  powerLevel: string;
  vehicleCount: number;
  gridServices: string[];
  bottlenecks: string[];
  maturity: 'lab' | 'pilot' | 'depot' | 'grid_critical';
  status: 'active' | 'completed' | 'planned';
}

export interface Highlight {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'technology' | 'market' | 'regulation' | 'infrastructure';
  impact: 'high' | 'medium' | 'low';
}

export interface MetricData {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: string;
}

export interface ExpertQuestion {
  id: string;
  module: string;
  type: 'opportunity' | 'challenge' | 'strategic';
  question: string;
  options: QuestionOption[];
  notes?: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  description: string;
}

export interface Note {
  id: string;
  content: string;
  type: 'correction' | 'improvement' | 'addition' | 'risk' | 'research_gap' | 'commercialization';
  targetId: string;
  targetType: 'highlight' | 'pilot' | 'question' | 'chart';
  createdAt: Date;
}

export interface ModuleData {
  id: string;
  name: string;
  icon: string;
  description: string;
  highlights: string[];
  questions: ExpertQuestion[];
}

export type NavigationModule = 
  | 'overview'
  | 'engineering'
  | 'patents'
  | 'markets'
  | 'standards'
  | 'architectures'
  | 'pilots'
  | 'risks'
  | 'foresight'
  | 'opportunities'
  | 'notes'
  | 'recommendations';
