import { useState, useRef } from 'react';
import { FileText, Link, Video, Plus, X, Search, Upload, Globe, FileUp, ClipboardPaste, ArrowRight, PenLine } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataSource, SourceCategory, sourceCategoryLabels } from '@/types/dataSource';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AddSourceDialogProps {
  onAdd: (source: Omit<DataSource, 'id' | 'createdAt'>) => void;
  defaultCategory?: SourceCategory;
  totalSources?: number;
  maxSources?: number;
}

type AddMode = 'main' | 'website' | 'file' | 'paste' | 'note';

const isTranscriptsCategory = (category?: SourceCategory) => category === 'transcripts_notes';

export function AddSourceDialog({ 
  onAdd, 
  defaultCategory,
  totalSources = 0,
  maxSources = 300,
}: AddSourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AddMode>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [url, setUrl] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SourceCategory>(defaultCategory || 'technical');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showTranscriptsMode = isTranscriptsCategory(defaultCategory);

  const resetForm = () => {
    setMode('main');
    setSearchQuery('');
    setUrl('');
    setPastedText('');
    setNoteText('');
    setTitle('');
    setCategory(defaultCategory || 'technical');
  };

  const handleSubmitNote = () => {
    if (!noteText.trim() || !title.trim()) return;
    
    onAdd({
      title: title.trim(),
      category: 'transcripts_notes',
      type: 'file',
      description: noteText.trim(),
      tags: ['note'],
    });
    
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(resetForm, 200);
  };

  const handleSubmitWebsite = () => {
    if (!url.trim()) return;
    
    // Extract title from URL if not provided
    const urlTitle = title.trim() || new URL(url).hostname.replace('www.', '');
    
    onAdd({
      title: urlTitle,
      category,
      type: url.includes('youtube.com') || url.includes('youtu.be') ? 'video' : 'weblink',
      url: url.trim(),
      tags: [],
    });
    
    handleClose();
  };

  const handleSubmitPaste = () => {
    if (!pastedText.trim()) return;
    
    // Check if pasted content is a URL
    const isUrl = /^https?:\/\//.test(pastedText.trim());
    
    if (isUrl) {
      onAdd({
        title: title.trim() || 'Pasted Link',
        category,
        type: 'weblink',
        url: pastedText.trim(),
        tags: [],
      });
    } else {
      onAdd({
        title: title.trim() || 'Pasted Content',
        category,
        type: 'file',
        description: pastedText.trim().slice(0, 500),
        tags: [],
      });
    }
    
    handleClose();
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach((file) => {
      onAdd({
        title: file.name,
        category,
        type: 'file',
        fileName: file.name,
        tags: [],
      });
    });
    
    handleClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleWebSearch = () => {
    if (!searchQuery.trim()) return;
    // For now, open Google search - could be enhanced later
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
  };

  const progressPercent = (totalSources / maxSources) * 100;

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Source
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-center text-xl font-medium">
            Add Sources to Your Repository
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {mode === 'main' && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-6 pb-6 space-y-4"
            >
              {/* Search Bar */}
              <div className="relative rounded-xl border border-border/50 bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <Input
                    placeholder="Search the web for new sources"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleWebSearch()}
                    className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-base placeholder:text-muted-foreground/60"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleWebSearch}
                    disabled={!searchQuery.trim()}
                    className="flex-shrink-0 rounded-full"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="secondary" size="sm" className="rounded-full gap-1.5 text-xs">
                    <Globe className="w-3.5 h-3.5" />
                    Web
                  </Button>
                </div>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200",
                  isDragging 
                    ? "border-primary bg-primary/5" 
                    : "border-border/50 bg-muted/20 hover:border-border hover:bg-muted/30"
                )}
              >
                <p className="text-muted-foreground text-lg">
                  or drop your files here
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant="secondary"
                  className="rounded-full gap-2 px-5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  Upload files
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full gap-2 px-5"
                  onClick={() => setMode('website')}
                >
                  <Link className="w-4 h-4" />
                  <Video className="w-4 h-4 -ml-1" />
                  Websites
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full gap-2 px-5"
                  onClick={() => setMode('paste')}
                >
                  <ClipboardPaste className="w-4 h-4" />
                  Copied text
                </Button>
                {showTranscriptsMode && (
                  <Button
                    variant="secondary"
                    className="rounded-full gap-2 px-5"
                    onClick={() => setMode('note')}
                  >
                    <PenLine className="w-4 h-4" />
                    Write note
                  </Button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.pptx"
              />
            </motion.div>
          )}

          {mode === 'website' && (
            <motion.div
              key="website"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-6 pb-6 space-y-4"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode('main')}
                className="mb-2"
              >
                ← Back
              </Button>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Website or Video URL</Label>
                  <Input
                    placeholder="https://example.com or YouTube link"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="text-base"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Title (optional)</Label>
                  <Input
                    placeholder="Auto-detected from URL"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as SourceCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(sourceCategoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSubmitWebsite} 
                  disabled={!url.trim()}
                  className="w-full"
                >
                  Add Website
                </Button>
              </div>
            </motion.div>
          )}

          {mode === 'paste' && (
            <motion.div
              key="paste"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-6 pb-6 space-y-4"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode('main')}
                className="mb-2"
              >
                ← Back
              </Button>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Paste content or URL</Label>
                  <textarea
                    placeholder="Paste your text, notes, or a URL here..."
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    className="w-full min-h-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Give this source a title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as SourceCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(sourceCategoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSubmitPaste} 
                  disabled={!pastedText.trim()}
                  className="w-full"
                >
                  Add Content
                </Button>
              </div>
            </motion.div>
          )}

          {mode === 'note' && (
            <motion.div
              key="note"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-6 pb-6 space-y-4"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode('main')}
                className="mb-2"
              >
                ← Back
              </Button>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Note Title *</Label>
                  <Input
                    placeholder="e.g., Meeting with Grid Operator, Expert Interview Notes"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Note Content *</Label>
                  <textarea
                    placeholder="Write your meeting transcript, expert contributions, ideas, or general notes here..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full min-h-[180px] rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                  />
                </div>

                <Button 
                  onClick={handleSubmitNote} 
                  disabled={!noteText.trim() || !title.trim()}
                  className="w-full"
                >
                  Add Note
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="border-t border-border/30 px-6 py-3 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {totalSources} / {maxSources}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
