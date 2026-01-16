import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
interface ModuleHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
  className?: string;
}
export function ModuleHeader({
  icon,
  title,
  description,
  badge,
  className
}: ModuleHeaderProps) {
  return <motion.div initial={{
    opacity: 0,
    y: -10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.4
  }} className={cn('mb-8', className)}>
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
    </motion.div>;
}