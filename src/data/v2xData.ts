import { Pilot, Highlight, MetricData, ExpertQuestion } from '@/types/v2x';

// Empty arrays - content is now generated from uploaded data sources
export const keyMetrics: MetricData[] = [];

export const reportHighlights: Highlight[] = [];

export const pilotProjects: Pilot[] = [];

// Expert questions removed - no longer used in modules
export const expertQuestions: ExpertQuestion[] = [];

// Legacy exports for backwards compatibility
export const engineeringQuestions: ExpertQuestion[] = [];
export const patentsQuestions: ExpertQuestion[] = [];
export const marketsQuestions: ExpertQuestion[] = [];
export const pilotsQuestions: ExpertQuestion[] = [];
export const standardsQuestions: ExpertQuestion[] = [];
export const architecturesQuestions: ExpertQuestion[] = [];
export const risksQuestions: ExpertQuestion[] = [];
export const foresightQuestions: ExpertQuestion[] = [];
