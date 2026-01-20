import { motion } from 'framer-motion';
import { FileQuestion, Upload, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyModuleStateProps {
  moduleName: string;
}

export function EmptyModuleState({ moduleName }: EmptyModuleStateProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-8 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-6">
        <FileQuestion className="w-10 h-10 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No Content Available
      </h3>
      
      <p className="text-muted-foreground max-w-md mb-6">
        Add data sources and generate a report to populate the {moduleName} module with insights and analysis.
      </p>
      
      <Button 
        onClick={() => navigate('/datasources')}
        className="gap-2"
      >
        <Upload className="w-4 h-4" />
        Add Data Sources
        <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}
