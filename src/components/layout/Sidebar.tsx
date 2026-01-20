import { terminology, layerInfo, type Layer, type Term } from '@/data/terminology';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeTerm: string | null;
  onTermSelect: (termId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const layers: Layer[] = ['core', 'plugin', 'ui', 'tooling', 'meta'];

export function Sidebar({ activeTerm, onTermSelect, isOpen, onClose }: SidebarProps) {
  const [expandedLayers, setExpandedLayers] = useState<Set<Layer>>(new Set(layers));

  const toggleLayer = (layer: Layer) => {
    setExpandedLayers(prev => {
      const next = new Set(prev);
      if (next.has(layer)) {
        next.delete(layer);
      } else {
        next.add(layer);
      }
      return next;
    });
  };

  const groupedTerms = layers.reduce((acc, layer) => {
    acc[layer] = terminology.filter(t => t.layer === layer);
    return acc;
  }, {} as Record<Layer, Term[]>);

  return (
    <>
      {/* Mobile overlay */}
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
            Terminology Map
          </h2>
          
          <div className="space-y-2">
            {layers.map(layer => (
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
                      ({groupedTerms[layer].length})
                    </span>
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    expandedLayers.has(layer) ? "rotate-0" : "-rotate-90"
                  )} />
                </button>
                
                {expandedLayers.has(layer) && (
                  <div className="ml-3 border-l border-border pl-3 space-y-0.5">
                    {groupedTerms[layer].map(term => (
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
                        <span className="font-mono">{term.name}</span>
                        {term.knowledge === 'mandatory' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Mandatory knowledge</span>
            </div>
            <p className="leading-relaxed">
              v1.0 · Last updated January 2026
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
