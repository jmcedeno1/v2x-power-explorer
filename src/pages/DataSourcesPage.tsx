import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Filter, FileText, Link, Video, BarChart3 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CategorySection } from '@/components/datasources/CategorySection';
import { AddSourceDialog } from '@/components/datasources/AddSourceDialog';
import { DataSource, SourceCategory, sourceCategoryLabels } from '@/types/dataSource';
import { sampleDataSources } from '@/data/dataSources';

const categories: SourceCategory[] = [
  'patents',
  'scientific',
  'technical',
  'standards',
  'market_studies',
  'pilots',
  'commercial',
  'industry_news',
  'transcripts_notes',
];

export default function DataSourcesPage() {
  const [sources, setSources] = useState<DataSource[]>(sampleDataSources);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddSource = (newSource: Omit<DataSource, 'id' | 'createdAt'>) => {
    const source: DataSource = {
      ...newSource,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setSources([source, ...sources]);
  };

  const handleDeleteSource = (id: string) => {
    setSources(sources.filter((s) => s.id !== id));
  };

  const filteredSources = sources.filter((source) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      source.title.toLowerCase().includes(query) ||
      source.description?.toLowerCase().includes(query) ||
      source.author?.toLowerCase().includes(query) ||
      source.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const getSourcesByCategory = (category: SourceCategory) => {
    return filteredSources.filter((s) => s.category === category);
  };

  const totalFiles = sources.filter((s) => s.type === 'file').length;
  const totalLinks = sources.filter((s) => s.type === 'weblink').length;
  const totalVideos = sources.filter((s) => s.type === 'video').length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <ModuleHeader
          title="Data Sources"
          description="Repository of sources utilized for the V2X Power State-of-the-Art Explorer"
          icon={<Database className="w-7 h-7 text-white" />}
        />

        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-energy-blue/10 to-energy-teal/10 border-energy-blue/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sources</p>
                    <p className="text-2xl font-bold text-foreground">{sources.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-energy-blue/20">
                    <BarChart3 className="w-6 h-6 text-energy-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Files</p>
                    <p className="text-2xl font-bold text-foreground">{totalFiles}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/20">
                    <FileText className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Web Links</p>
                    <p className="text-2xl font-bold text-foreground">{totalLinks}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/20">
                    <Link className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Videos</p>
                    <p className="text-2xl font-bold text-foreground">{totalVideos}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Video className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sources by title, author, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <AddSourceDialog onAdd={handleAddSource} totalSources={sources.length} maxSources={300} />
        </div>

        {/* Category Sections */}
        <div className="space-y-4">
          {categories.map((category) => (
            <CategorySection
              key={category}
              category={category}
              sources={getSourcesByCategory(category)}
              onAddSource={handleAddSource}
              onDeleteSource={handleDeleteSource}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
