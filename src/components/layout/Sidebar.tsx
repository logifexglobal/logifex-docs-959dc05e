import { terminology, lukTerminology, allTerminology, layerInfo, type Layer, type Term } from '@/data/terminology';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  activeTerm: string | null;
  onTermSelect: (termId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  filterLayer?: Layer;
}

const layers: Layer[] = ['core', 'plugin', 'ui', 'tooling', 'meta'];

export function Sidebar({ activeTerm, onTermSelect, isOpen, onClose, filterLayer }: SidebarProps) {
  const displayLayers = filterLayer ? [filterLayer] : layers;
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set(displayLayers));
  const [lukExpanded, setLukExpanded] = useState(false);
  const [expandedLukLayers, setExpandedLukLayers] = useState<Set<Layer>>(new Set());

  useEffect(() => {
    setExpandedLayers(new Set(filterLayer ? [filterLayer] : layers));
  }, [filterLayer]);

  const toggleLayer = (layer: string) => {
    setExpandedLayers(prev => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  };

  const toggleLukLayer = (layer: Layer) => {
    setExpandedLukLayers(prev => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  };

  const coreGrouped = displayLayers.reduce((acc, layer) => {
    acc[layer] = terminology.filter(t => t.layer === layer);
    return acc;
  }, {} as Record<Layer, Term[]>);

  const lukGrouped = layers.reduce((acc, layer) => {
    const terms = lukTerminology.filter(t => t.layer === layer);
    if (terms.length > 0) acc[layer] = terms;
    return acc;
  }, {} as Partial<Record<Layer, Term[]>>);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed top-16 left-0 bottom-0 w-72 border-r border-border bg-sidebar overflow-y-auto z-50 transition-transform duration-300",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Core Ecosystem
          </h2>
          
          <div className="space-y-2">
            {displayLayers.map(layer => (
              <div key={layer} className="space-y-1">
                <button
                  onClick={() => toggleLayer(layer)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={layer} className="text-xs">
                      {layerInfo[layer].label}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      ({coreGrouped[layer].length})
                    </span>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    expandedLayers.has(layer) ? "rotate-0" : "-rotate-90"
                  )} />
                </button>
                
                {expandedLayers.has(layer) && (
                  <div className="ml-3 border-l border-border pl-3 space-y-0.5">
                    {coreGrouped[layer].map(term => (
                      <button
                        key={term.id}
                        onClick={() => {
                          onTermSelect(term.id);
                          onClose();
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors text-left",
                          activeTerm === term.id
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                      >
                        <span className="font-mono truncate">{term.name}</span>
                        {term.knowledge === 'mandatory' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* LUK Section */}
          <div className="mt-6 pt-4 border-t border-border">
            <button
              onClick={() => {
                setLukExpanded(!lukExpanded);
                if (!lukExpanded && expandedLukLayers.size === 0) {
                  setExpandedLukLayers(new Set(Object.keys(lukGrouped) as Layer[]));
                }
              }}
              className="w-full flex items-center justify-between mb-3"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                LUK Utilities
              </h2>
              <ChevronDown className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                lukExpanded ? "rotate-0" : "-rotate-90"
              )} />
            </button>

            {lukExpanded && (
              <div className="space-y-2">
                {(Object.keys(lukGrouped) as Layer[]).map(layer => (
                  <div key={`luk-${layer}`} className="space-y-1">
                    <button
                      onClick={() => toggleLukLayer(layer)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant={layer} className="text-xs">
                          {layerInfo[layer].label}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          ({lukGrouped[layer]!.length})
                        </span>
                      </div>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        expandedLukLayers.has(layer) ? "rotate-0" : "-rotate-90"
                      )} />
                    </button>
                    
                    {expandedLukLayers.has(layer) && (
                      <div className="ml-3 border-l border-border pl-3 space-y-0.5">
                        {lukGrouped[layer]!.map(term => (
                          <button
                            key={term.id}
                            onClick={() => {
                              onTermSelect(term.id);
                              onClose();
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-1.5 text-sm rounded-md transition-colors text-left",
                              activeTerm === term.id
                                ? "bg-accent text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            )}
                          >
                            <span className="font-mono truncate text-xs">{term.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Mandatory knowledge</span>
            </div>
            <p className="leading-relaxed">
              v1.0 — v12.0 · Last updated March 2026
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
