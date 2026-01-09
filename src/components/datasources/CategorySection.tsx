import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Plus, FileText, Link, Video, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataSource, SourceCategory, sourceCategoryLabels, sourceCategoryDescriptions } from '@/types/dataSource';
import { SourceCard } from './SourceCard';
import { AddSourceDialog } from './AddSourceDialog';
import { cn } from '@/lib/utils';

interface CategorySectionProps {
  category: SourceCategory;
  sources: DataSource[];
  onAddSource: (source: Omit<DataSource, 'id' | 'createdAt'>) => void;
  onDeleteSource: (id: string) => void;
}

const categoryIcons: Record<SourceCategory, React.ElementType> = {
  patents: FileText,
  scientific: FileText,
  technical: FileText,
  standards: FileText,
  market_studies: FileText,
  pilots: FileText,
  commercial: Link,
  industry_news: Link,
};

const categoryColors: Record<SourceCategory, string> = {
  patents: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  scientific: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
  technical: 'from-slate-500/20 to-zinc-500/20 border-slate-500/30',
  standards: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
  market_studies: 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
  pilots: 'from-cyan-500/20 to-sky-500/20 border-cyan-500/30',
  commercial: 'from-rose-500/20 to-pink-500/20 border-rose-500/30',
  industry_news: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
};

export function CategorySection({ category, sources, onAddSource, onDeleteSource }: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(sources.length > 0);
  const Icon = categoryIcons[category];

  const fileCount = sources.filter((s) => s.type === 'file').length;
  const linkCount = sources.filter((s) => s.type === 'weblink').length;
  const videoCount = sources.filter((s) => s.type === 'video').length;

  return (
    <div className={cn(
      'rounded-xl border bg-gradient-to-br p-4 transition-all duration-300',
      categoryColors[category]
    )}>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-background/50">
            <Folder className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              {sourceCategoryLabels[category]}
              <Badge variant="secondary" className="ml-2">
                {sources.length}
              </Badge>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {sourceCategoryDescriptions[category]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
            {fileCount > 0 && (
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {fileCount}
              </span>
            )}
            {linkCount > 0 && (
              <span className="flex items-center gap-1">
                <Link className="w-3.5 h-3.5" />
                {linkCount}
              </span>
            )}
            {videoCount > 0 && (
              <span className="flex items-center gap-1">
                <Video className="w-3.5 h-3.5" />
                {videoCount}
              </span>
            )}
          </div>
          
          <div onClick={(e) => e.stopPropagation()}>
            <AddSourceDialog onAdd={onAddSource} defaultCategory={category} />
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {sources.length > 0 ? (
              <div className="grid gap-3 mt-4 sm:grid-cols-2 lg:grid-cols-3">
                {sources.map((source) => (
                  <SourceCard
                    key={source.id}
                    source={source}
                    onDelete={onDeleteSource}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-4 p-6 rounded-lg bg-background/30 border border-dashed border-border/50 text-center">
                <p className="text-sm text-muted-foreground">
                  No sources added yet. Click "Add Source" to get started.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
