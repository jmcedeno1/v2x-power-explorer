import { motion } from 'framer-motion';
import { FileText, Link, Video, Calendar, User, Tag, ExternalLink, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataSource, sourceCategoryLabels } from '@/types/dataSource';
import { cn } from '@/lib/utils';

interface SourceCardProps {
  source: DataSource;
  onDelete?: (id: string) => void;
}

const typeIcons = {
  file: FileText,
  weblink: Link,
  video: Video,
};

const typeColors = {
  file: 'text-energy-blue',
  weblink: 'text-energy-teal',
  video: 'text-energy-purple',
};

export function SourceCard({ source, onDelete }: SourceCardProps) {
  const TypeIcon = typeIcons[source.type];

  const handleOpen = () => {
    if (source.url) {
      window.open(source.url, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group bg-card/50 border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              'p-2 rounded-lg bg-muted/50 flex-shrink-0',
              typeColors[source.type]
            )}>
              <TypeIcon className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-foreground text-sm leading-tight line-clamp-2">
                  {source.title}
                </h4>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {source.url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handleOpen}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                      onClick={() => onDelete(source.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              
              {source.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {source.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                {source.author && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {source.author}
                  </span>
                )}
                {source.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {source.date}
                  </span>
                )}
              </div>
              
              {source.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {source.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-5 bg-muted/50"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {source.tags.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-5 bg-muted/50"
                    >
                      +{source.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
