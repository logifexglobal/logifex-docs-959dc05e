import { useState } from 'react';
import { terminology, lukTerminology, layerInfo, domainInfo, type Layer, type Knowledge, type Section, type Domain } from '@/data/terminology';
import { TermCard } from './TermCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Filter, LayoutGrid, List, Sparkles, Box, Wrench, Globe } from 'lucide-react';

interface TerminologyGridProps {
  onTermSelect: (termId: string) => void;
}

const layers: Layer[] = ['core', 'plugin', 'ui', 'tooling', 'meta'];
const knowledgeLevels: Knowledge[] = ['mandatory', 'optional', 'advanced'];
const domains: Domain[] = ['universal', 'e-commerce', 'finance'];

export function TerminologyGrid({ onTermSelect }: TerminologyGridProps) {
  const [activeSection, setActiveSection] = useState<Section>('core-ecosystem');
  const [activeLayer, setActiveLayer] = useState<Layer | 'all'>('all');
  const [activeKnowledge, setActiveKnowledge] = useState<Knowledge | 'all'>('all');
  const [activeDomain, setActiveDomain] = useState<Domain | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const sourceTerms = activeSection === 'luk' ? lukTerminology : terminology;

  const filteredTerms = sourceTerms.filter(term => {
    if (activeLayer !== 'all' && term.layer !== activeLayer) return false;
    if (activeKnowledge !== 'all' && term.knowledge !== activeKnowledge) return false;
    if (activeSection === 'luk' && activeDomain !== 'all' && term.domain !== activeDomain) return false;
    return true;
  });

  const mandatoryCount = sourceTerms.filter(t => t.knowledge === 'mandatory').length;

  const layerHasTerms = (layer: Layer) => sourceTerms.some(t => t.layer === layer);

  return (
    <div className="animate-fade-in">
      {/* Hero section */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(190_95%_50%/0.15),transparent)]" />
        <div className="relative pt-4 ps-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">v1.0 — v12.0</span>
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
              <strong className="text-foreground">{sourceTerms.length}</strong> terms
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

      {/* Section Switcher */}
      <div className="mb-8">
        <div className="inline-flex items-center rounded-lg border border-border bg-card p-1 gap-1">
          <button
            onClick={() => { setActiveSection('core-ecosystem'); setActiveLayer('all'); setActiveKnowledge('all'); setActiveDomain('all'); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200",
              activeSection === 'core-ecosystem'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Box className="w-4 h-4" />
            Core Ecosystem
          </button>
          <button
            onClick={() => { setActiveSection('luk'); setActiveLayer('all'); setActiveKnowledge('all'); setActiveDomain('all'); }}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200",
              activeSection === 'luk'
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Wrench className="w-4 h-4" />
            LUK Utilities
          </button>
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
                !layerHasTerms(layer) && "opacity-40 cursor-not-allowed",
                activeLayer === layer
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              disabled={!layerHasTerms(layer)}
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

      {/* Domain filter - only for LUK */}
      {activeSection === 'luk' && (
        <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-border">
          <div className="flex items-center gap-2 mr-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Industry Domain:</span>
          </div>
          <button
            onClick={() => setActiveDomain('all')}
            className={cn(
              "px-3 py-1 text-sm rounded-full border transition-colors",
              activeDomain === 'all'
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
            )}
          >
            All
          </button>
          {domains.map(domain => (
            <button
              key={domain}
              onClick={() => setActiveDomain(domain)}
              className={cn(
                "px-3 py-1 text-sm rounded-full border backdrop-blur-sm transition-all",
                activeDomain === domain
                  ? cn("bg-gradient-to-r", domainInfo[domain].color)
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
              )}
            >
              {domainInfo[domain].label}
            </button>
          ))}
        </div>
      )}

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
          Showing <strong className="text-foreground">{filteredTerms.length}</strong> {activeSection === 'luk' ? 'utility' : ''} terms
          {activeLayer !== 'all' && (
            <> in <Badge variant={activeLayer}>{layerInfo[activeLayer].label}</Badge></>
          )}
          {activeKnowledge !== 'all' && (
            <> ({activeKnowledge})</>
          )}
          {activeDomain !== 'all' && (
            <> · <span className={cn("font-medium", domainInfo[activeDomain].color.split(' ').pop())}>{domainInfo[activeDomain].label}</span> domain</>
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
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <div className="text-muted-foreground space-y-2">
            <p className="text-lg font-medium">No terms in this category yet</p>
            <p className="text-sm">
              {activeSection === 'luk' 
                ? 'LUK Utility terms for this layer are coming soon.' 
                : 'No terms match your current filters.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
