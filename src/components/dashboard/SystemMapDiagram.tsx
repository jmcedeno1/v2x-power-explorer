import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Plug, Building2, Zap, LineChart, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EcosystemPopup } from './EcosystemPopup';
import { useNavigate } from 'react-router-dom';

interface NodeData {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  color: string;
}

const nodes: NodeData[] = [
  { id: 'ev', label: 'Electric Vehicles', sublabel: 'DER Assets', icon: Car, color: 'from-energy-blue to-energy-teal' },
  { id: 'charger', label: 'Bidirectional Chargers', sublabel: 'Grid Inverters', icon: Plug, color: 'from-energy-teal to-energy-green' },
  { id: 'site', label: 'Sites & Buildings', sublabel: 'V2B/V2H', icon: Building2, color: 'from-energy-green to-energy-amber' },
  { id: 'grid', label: 'Power Grid', sublabel: 'V2G Services', icon: Zap, color: 'from-energy-amber to-energy-orange' },
  { id: 'market', label: 'Energy Markets', sublabel: 'Revenue Stacking', icon: LineChart, color: 'from-energy-orange to-energy-purple' },
];

interface SystemMapDiagramProps {
  onNodeClick?: (nodeId: string) => void;
}

export function SystemMapDiagram({ onNodeClick }: SystemMapDiagramProps) {
  const navigate = useNavigate();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeFlow, setActiveFlow] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="relative w-full p-8 bg-gradient-to-br from-muted/30 to-muted/50 rounded-2xl overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Title */}
      <div className="relative mb-8 text-center">
        <h3 className="text-lg font-semibold text-foreground">V2X Energy Ecosystem</h3>
        <p className="text-sm text-muted-foreground mt-1">Bidirectional power flow across the energy value chain</p>
      </div>

      {/* Nodes and connections */}
      <div className="relative flex items-center justify-between gap-4">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const isHovered = hoveredNode === node.id;

          return (
            <div key={node.id} className="relative flex items-center">
              {/* Node */}
              <motion.button
                onClick={() => handleNodeClick(node.id)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'relative z-10 flex flex-col items-center gap-2 p-4 rounded-xl bg-card border-2 transition-all duration-300 cursor-pointer min-w-[120px]',
                  isHovered ? 'border-primary shadow-glow' : 'border-border hover:border-primary/50'
                )}
              >
                <div className={cn(
                  'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center transition-transform duration-300',
                  node.color,
                  isHovered && 'animate-energy-pulse'
                )}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground leading-tight">{node.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{node.sublabel}</p>
                </div>

                {/* Pulse effect */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 rounded-xl bg-primary/5 -z-10"
                  />
                )}
              </motion.button>

              {/* Bidirectional arrow */}
              {index < nodes.length - 1 && (
                <div className="flex items-center mx-2">
                  <motion.div
                    animate={activeFlow ? { opacity: [0.3, 1, 0.3] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-1 px-2"
                  >
                    <ArrowLeftRight className="w-5 h-5 text-primary" />
                  </motion.div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Animated energy flow line */}
      <svg className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 pointer-events-none" style={{ top: '55%' }}>
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(199 89% 48%)" />
            <stop offset="50%" stopColor="hsl(172 66% 50%)" />
            <stop offset="100%" stopColor="hsl(262 83% 58%)" />
          </linearGradient>
        </defs>
        <motion.line
          x1="10%"
          y1="50%"
          x2="90%"
          y2="50%"
          stroke="url(#flowGradient)"
          strokeWidth="2"
          strokeDasharray="8 4"
          initial={{ strokeDashoffset: 24 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          opacity={0.6}
        />
      </svg>

      {/* Legend */}
      <div className="relative mt-8 flex justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-energy-blue to-energy-teal" />
          <span>Power Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-3 h-3 text-primary" />
          <span>Bidirectional</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-energy-green animate-pulse" />
          <span>Active</span>
        </div>
      </div>

      {/* Ecosystem Popup */}
      <EcosystemPopup
        nodeId={selectedNode}
        open={selectedNode !== null}
        onClose={() => setSelectedNode(null)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
