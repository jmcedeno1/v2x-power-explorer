import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModuleHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: ReactNode;
  className?: string;
  heroImage?: string;
  heroAlt?: string;
}

export function ModuleHeader({
  icon,
  title,
  description,
  badge,
  className,
  heroImage,
  heroAlt,
}: ModuleHeaderProps) {
  if (heroImage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn('mb-10 relative overflow-hidden rounded-2xl border border-border shadow-lg', className)}
      >
        <img
          src={heroImage}
          alt={heroAlt || title}
          width={1600}
          height={640}
          className="w-full h-56 md:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />
        <div className="absolute inset-0 flex items-end p-6 md:p-8">
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
              {icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground drop-shadow-sm">{title}</h1>
                {badge}
              </div>
              <p className="text-muted-foreground mt-1 max-w-2xl">{description}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('mb-8', className)}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {badge}
          </div>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
