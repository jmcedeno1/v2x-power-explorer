import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageSquare, Lightbulb, AlertTriangle, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExpertQuestion } from '@/types/v2x';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface QuestionCardProps {
  question: ExpertQuestion;
  index: number;
}

const typeConfig = {
  opportunity: { icon: Lightbulb, label: 'Opportunity', color: 'text-energy-green bg-energy-green/10 border-energy-green/20' },
  challenge: { icon: AlertTriangle, label: 'Challenge', color: 'text-energy-amber bg-energy-amber/10 border-energy-amber/20' },
  strategic: { icon: Target, label: 'Strategic', color: 'text-primary bg-primary/10 border-primary/20' },
};

export function QuestionCard({ question, index }: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const config = typeConfig[question.type];
  const TypeIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-card rounded-xl border overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-muted/50 transition-colors"
      >
        <span className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
          config.color
        )}>
          <TypeIcon className="w-3.5 h-3.5" />
          {config.label}
        </span>

        <div className="flex-1">
          <p className="text-sm font-medium text-foreground leading-relaxed pr-4">
            Q{index + 1}: {question.question}
          </p>
        </div>

        <ChevronDown className={cn(
          'w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0',
          isExpanded && 'rotate-180'
        )} />
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {/* Options */}
              <div className="space-y-2">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={cn(
                      'w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all duration-200',
                      selectedOption === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40 hover:bg-muted/50'
                    )}
                  >
                    <span className={cn(
                      'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5',
                      selectedOption === option.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/40 text-muted-foreground'
                    )}>
                      {option.label}
                    </span>
                    <span className="text-sm text-foreground">{option.description}</span>
                  </button>
                ))}
              </div>

              {/* Notes section */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Expert Notes</span>
                </div>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your expert notes, comments, or insights..."
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" variant="outline">
                    Save Note
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
