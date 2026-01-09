import { useState } from 'react';
import { motion } from 'framer-motion';
import { StickyNote, Plus, Tag, Filter } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ModuleHeader } from '@/components/ui/module-header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const noteTypes = [
  { id: 'correction', label: 'Correction', color: 'bg-energy-red/10 text-energy-red border-energy-red/20' },
  { id: 'improvement', label: 'Improvement', color: 'bg-energy-blue/10 text-energy-blue border-energy-blue/20' },
  { id: 'addition', label: 'Addition', color: 'bg-energy-green/10 text-energy-green border-energy-green/20' },
  { id: 'risk', label: 'Risk', color: 'bg-energy-amber/10 text-energy-amber border-energy-amber/20' },
  { id: 'research_gap', label: 'Research Gap', color: 'bg-energy-purple/10 text-energy-purple border-energy-purple/20' },
  { id: 'commercialization', label: 'Commercialization', color: 'bg-primary/10 text-primary border-primary/20' },
];

const sampleNotes = [
  {
    id: '1',
    content: 'Battery warranty terms need to be standardized across OEMs for V2X adoption to scale.',
    type: 'risk',
    module: 'Markets',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    content: 'Consider adding analysis of solid-state battery impact on V2X cycling tolerance.',
    type: 'research_gap',
    module: 'Engineering',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    content: 'School bus V2G pilots showing strong results - recommend expanding fleet focus section.',
    type: 'addition',
    module: 'Pilots',
    createdAt: '2024-01-13',
  },
];

export default function NotesPage() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [selectedType, setSelectedType] = useState('improvement');

  const filteredNotes = activeFilter
    ? sampleNotes.filter(n => n.type === activeFilter)
    : sampleNotes;

  return (
    <MainLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <ModuleHeader
          icon={<StickyNote className="w-7 h-7 text-white" />}
          title="Notes & Change Requests"
          description="Collect, organize, and synthesize feedback for report improvement"
          badge="Collaboration"
        />

        {/* Add new note */}
        <section className="mb-8">
          <div className="p-6 rounded-xl bg-card border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Add New Note</h3>
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note, observation, or change request..."
              className="mb-4 min-h-[100px]"
            />
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Type:</span>
                <div className="flex flex-wrap gap-2">
                  {noteTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                        selectedType === type.id
                          ? type.color + ' ring-2 ring-offset-1'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              <Button className="ml-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>
          </div>
        </section>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground mr-2">Filter:</span>
          <Button
            variant={activeFilter === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(null)}
          >
            All
          </Button>
          {noteTypes.map((type) => (
            <Button
              key={type.id}
              variant={activeFilter === type.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(type.id)}
            >
              {type.label}
            </Button>
          ))}
        </div>

        {/* Notes list */}
        <section>
          <div className="space-y-3">
            {filteredNotes.map((note, index) => {
              const typeConfig = noteTypes.find(t => t.id === note.type);
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-card border hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{note.content}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium border',
                          typeConfig?.color
                        )}>
                          {typeConfig?.label}
                        </span>
                        <span className="text-xs text-muted-foreground">Module: {note.module}</span>
                        <span className="text-xs text-muted-foreground">{note.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Synthesis preview */}
        <section className="mt-10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Notes-to-Insight Preview</h3>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-4">
              Based on collected notes, the synthesis engine identifies:
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-card">
                <p className="text-2xl font-bold text-primary">3</p>
                <p className="text-sm text-muted-foreground">Total notes</p>
              </div>
              <div className="p-4 rounded-lg bg-card">
                <p className="text-2xl font-bold text-energy-amber">1</p>
                <p className="text-sm text-muted-foreground">Risk items</p>
              </div>
              <div className="p-4 rounded-lg bg-card">
                <p className="text-2xl font-bold text-energy-purple">1</p>
                <p className="text-sm text-muted-foreground">Research gaps</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
