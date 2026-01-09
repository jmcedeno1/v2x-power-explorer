export type SourceCategory = 
  | 'patents'
  | 'scientific'
  | 'technical'
  | 'standards'
  | 'market_studies'
  | 'pilots'
  | 'commercial'
  | 'industry_news';

export type SourceType = 'file' | 'weblink' | 'video';

export interface DataSource {
  id: string;
  title: string;
  description?: string;
  category: SourceCategory;
  type: SourceType;
  url?: string;
  fileName?: string;
  author?: string;
  date?: string;
  tags: string[];
  createdAt: Date;
}

export const sourceCategoryLabels: Record<SourceCategory, string> = {
  patents: 'Patents',
  scientific: 'Scientific Publications & Books',
  technical: 'Technical Content',
  standards: 'Standards',
  market_studies: 'Market & Technology Studies',
  pilots: 'Pilots',
  commercial: 'Commercial Content',
  industry_news: 'Industry News',
};

export const sourceCategoryDescriptions: Record<SourceCategory, string> = {
  patents: 'Patent filings, IP documents, and patent analysis reports',
  scientific: 'Academic papers, journal articles, research publications, and books',
  technical: 'Technical specifications, datasheets, whitepapers, and engineering documents',
  standards: 'ISO standards, grid codes, regulatory frameworks, and compliance documents',
  market_studies: 'Market research, technology forecasts, and industry analysis reports',
  pilots: 'Pilot project reports, demonstration results, and case studies',
  commercial: 'Company websites, product brochures, corporate reports, and promotional videos',
  industry_news: 'News articles, press releases, industry updates, and news videos',
};
