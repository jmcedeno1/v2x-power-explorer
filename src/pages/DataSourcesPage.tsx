import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, FileText, Link, Video, BarChart3, Sparkles, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CategorySection } from '@/components/datasources/CategorySection';
import { AddSourceDialog } from '@/components/datasources/AddSourceDialog';
import { SourceCategory, sourceCategoryLabels } from '@/types/dataSource';
import { useDataSources, useAddDataSource, useDeleteDataSource, useProcessSource, useUploadFile } from '@/hooks/useDataSources';
import { useGenerateAllReports } from '@/hooks/useGeneratedContent';
import { toast } from 'sonner';

const categories: SourceCategory[] = [
  'commercial',
  'industry_news',
  'market_studies',
  'patents',
  'pilots',
  'scientific',
  'standards',
  'technical',
  'transcripts_notes',
];

export default function DataSourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: sources = [], isLoading } = useDataSources();
  const addSource = useAddDataSource();
  const deleteSource = useDeleteDataSource();
  const processSource = useProcessSource();
  const uploadFile = useUploadFile();
  const generateAllReports = useGenerateAllReports();

  const handleAddSource = async (newSource: {
    title: string;
    description?: string;
    category: SourceCategory;
    type: 'file' | 'weblink' | 'video';
    url?: string;
    fileName?: string;
    author?: string;
    date?: string;
    tags: string[];
  }) => {
    try {
      const result = await addSource.mutateAsync({
        title: newSource.title,
        description: newSource.description || null,
        category: newSource.category,
        source_type: newSource.type,
        url: newSource.url || null,
        file_path: null,
        file_name: newSource.fileName || null,
        author: newSource.author || null,
        source_date: newSource.date || null,
        tags: newSource.tags || [],
      });

      // Process the source with its content if it's a note/pasted text
      if (newSource.description && result?.id) {
        processSource.mutate({ sourceId: result.id, content: newSource.description });
      }
    } catch (error) {
      console.error('Error adding source:', error);
    }
  };

  const handleDeleteSource = (id: string) => {
    deleteSource.mutate(id);
  };

  const handleGenerateReport = async () => {
    const processedCount = sources.filter(s => s.is_processed).length;
    if (processedCount === 0) {
      toast.warning('No processed sources available. Add and process some sources first.');
      return;
    }
    generateAllReports.mutate();
  };

  // Transform DB sources to component format
  const transformedSources = sources.map(s => ({
    id: s.id,
    title: s.title,
    description: s.description || undefined,
    category: s.category as SourceCategory,
    type: s.source_type as 'file' | 'weblink' | 'video',
    url: s.url || undefined,
    fileName: s.file_name || undefined,
    author: s.author || undefined,
    date: s.source_date || undefined,
    tags: s.tags || [],
    createdAt: new Date(s.created_at),
    isProcessed: s.is_processed,
  }));

  const filteredSources = transformedSources.filter((source) => {
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

  const totalFiles = sources.filter((s) => s.source_type === 'file').length;
  const totalLinks = sources.filter((s) => s.source_type === 'weblink').length;
  const totalVideos = sources.filter((s) => s.source_type === 'video').length;
  const processedCount = sources.filter((s) => s.is_processed).length;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <ModuleHeader
          title="Data Sources"
          description="Repository of sources utilized for the V2X Power State-of-the-Art Explorer"
          icon={<Database className="w-7 h-7 text-white" />}
        />

        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Processed</p>
                    <p className="text-2xl font-bold text-foreground">{processedCount}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search, Actions, and Generate Button */}
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
          <div className="flex gap-3">
            <AddSourceDialog onAdd={handleAddSource} totalSources={sources.length} maxSources={300} />
            <Button
              onClick={handleGenerateReport}
              disabled={generateAllReports.isPending || sources.length === 0}
              className="gap-2"
              variant="default"
            >
              {generateAllReports.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Generate Report
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {sources.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 text-center"
          >
            <Database className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Data Sources Yet</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Upload documents, add web links, or paste content to build your research repository. 
              Once you have sources, click "Generate Report" to create content for all modules.
            </p>
            <AddSourceDialog onAdd={handleAddSource} totalSources={0} maxSources={300} />
          </motion.div>
        )}

        {/* Category Sections */}
        {sources.length > 0 && (
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
        )}
      </div>
    </MainLayout>
  );
}
