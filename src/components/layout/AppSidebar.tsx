import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Cpu,
  FileText,
  TrendingUp,
  Scale,
  Network,
  FlaskConical,
  Map,
  StickyNote,
  Award,
  ChevronLeft,
  ChevronRight,
  Zap,
  Database,
  ShieldAlert,
  Telescope,
  Download,
  BookOpen,
  Newspaper,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'patents', label: 'Patents & IP', icon: FileText, path: '/patents' },
  { id: 'publications', label: 'Publications', icon: BookOpen, path: '/publications' },
  { id: 'news', label: 'News & Media', icon: Newspaper, path: '/news' },
  { id: 'markets', label: 'Markets & Business', icon: TrendingUp, path: '/markets' },
  { id: 'pilots', label: 'Pilots & Demonstrators', icon: FlaskConical, path: '/pilots' },
  { id: 'engineering', label: 'Engineering & Research', icon: Cpu, path: '/engineering' },
  { id: 'standards', label: 'Standards & Regulation', icon: Scale, path: '/standards' },
  { id: 'architectures', label: 'System Architectures', icon: Network, path: '/architectures' },
  { id: 'risks', label: 'Risks & Stability', icon: ShieldAlert, path: '/risks' },
  { id: 'foresight', label: 'Foresight & Strategy', icon: Telescope, path: '/foresight' },
  { id: 'opportunities', label: 'Opportunity Map', icon: Map, path: '/opportunities' },
  { id: 'datasources', label: 'Data Sources', icon: Database, path: '/datasources' },
  { id: 'corpus', label: 'Corpus & Ingestion', icon: Download, path: '/corpus' },
  { id: 'notes', label: 'Notes & Changes', icon: StickyNote, path: '/notes' },
  { id: 'recommendations', label: 'Recommendations', icon: Award, path: '/recommendations' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        'relative flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-sidebar-border',
        collapsed && 'justify-center px-2'
      )}>
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse-glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">V2X Power</span>
            <span className="text-xs text-sidebar-foreground/60">Landscape Explorer</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            const navButton = (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'animate-pulse-glow')} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.id} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <li>{navButton}</li>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <li key={item.id}>{navButton}</li>;
          })}
        </ul>
      </nav>

      {/* Version info */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50">
            State-of-the-Art Report v1.0
          </p>
        </div>
      )}

      {/* Collapse button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border hover:bg-sidebar-accent shadow-md"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-sidebar-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-sidebar-foreground" />
        )}
      </Button>
    </aside>
  );
}
