import { motion } from 'framer-motion';
import { FileQuestion, Upload, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyModuleStateProps {
  moduleName: string;
}

export function EmptyModuleState({ moduleName: _moduleName }: EmptyModuleStateProps) {
  return null;
}
