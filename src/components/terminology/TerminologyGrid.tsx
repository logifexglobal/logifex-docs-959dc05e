import { useState } from 'react';
import { terminology, layerInfo, type Layer, type Knowledge } from '@/data/terminology';
import { TermCard } from './TermCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Filter, LayoutGrid, List, Sparkles } from 'lucide-react';

interface TerminologyGridProps {
  onTermSelect: (termId: string) => void;
}

const layers: Layer[] = ['core', 'plugin', 'ui', 'tooling', 'meta'];
const knowledgeLevels: Knowledge[] = ['mandatory', 'optional', 'advanced'];

export function TerminologyGrid({ onTermSelect }: TerminologyGridProps) {
  const [activeLayer, setActiveLayer] = useState<Layer | 'all'>('all');
  const [activeKnowledge, setActiveKnowledge] = useState<Knowledge | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredTerms = terminology.filter(term => {
    if (activeLayer !== 'all' && term.layer !== activeLayer) return false;
    if (activeKnowledge !== 'all' && term.knowledge !== activeKnowledge) return false;
    return true;
  });

  const mandatoryCount = terminology.filter(t => t.knowledge === 'mandatory').length;

  return (
    <div className="animate-fade-in">
      {/* Hero section */}
      <div className="mb-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(190_95%_50%/0.15),transparent)]" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">v1.0 Stable</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Terminology Map
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            The complete vocabulary of Logifex. Master these concepts to understand 
            the framework's architecture, constraints, and extension points.
          </p>
          <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{terminology.length}</strong> terms
            </span>
            <span>
              <strong className="text-cyan-400">{mandatoryCount}</strong> mandatory
            </span>
            <span>
              <strong className="text-foreground">5</strong> layers
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 mr-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Layer:</span>
          </div>
          <button
            onClick={() => setActiveLayer('all')}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              activeLayer === 'all'
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {layers.map(layer => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                activeLayer === layer
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Badge variant={layer} className="pointer-events-none">
                {layerInfo[layer].label}
              </Badge>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              "p-2 rounded-md transition-colors",
              viewMode === 'grid' ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "p-2 rounded-md transition-colors",
              viewMode === 'list' ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Knowledge filter */}
      <div className="flex flex-wrap items-center gap-2 mb-8 pb-6 border-b border-border">
        <span className="text-sm text-muted-foreground mr-2">Knowledge:</span>
        <button
          onClick={() => setActiveKnowledge('all')}
          className={cn(
            "px-3 py-1 text-sm rounded-full border transition-colors",
            activeKnowledge === 'all'
              ? "border-primary text-primary"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
          )}
        >
          All
        </button>
        {knowledgeLevels.map(level => (
          <button
            key={level}
            onClick={() => setActiveKnowledge(level)}
            className={cn(
              "px-3 py-1 text-sm rounded-full border transition-colors capitalize",
              activeKnowledge === level
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
            )}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing <strong className="text-foreground">{filteredTerms.length}</strong> terms
          {activeLayer !== 'all' && (
            <> in <Badge variant={activeLayer}>{layerInfo[activeLayer].label}</Badge></>
          )}
          {activeKnowledge !== 'all' && (
            <> ({activeKnowledge})</>
          )}
        </p>
      </div>

      {/* Grid/List */}
      <div className={cn(
        viewMode === 'grid'
          ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          : "space-y-3"
      )}>
        {filteredTerms.map((term, index) => (
          <div
            key={term.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <TermCard
              term={term}
              onClick={() => onTermSelect(term.id)}
              variant={viewMode === 'list' ? 'compact' : 'default'}
            />
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No terms match your filters.</p>
        </div>
      )}
    </div>
  );
}
