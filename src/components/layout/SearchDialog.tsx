import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { terminology, layerInfo, type Term, type Layer } from '@/data/terminology';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTermSelect: (termId: string) => void;
}

export function SearchDialog({ open, onOpenChange, onTermSelect }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredTerms = useMemo(() => {
    if (!query.trim()) return terminology;
    const lowerQuery = query.toLowerCase();
    return terminology.filter(term => 
      term.name.toLowerCase().includes(lowerQuery) ||
      term.oneLine.toLowerCase().includes(lowerQuery) ||
      term.layer.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredTerms.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredTerms[selectedIndex]) {
        e.preventDefault();
        onTermSelect(filteredTerms[selectedIndex].id);
        onOpenChange(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredTerms, selectedIndex, onTermSelect, onOpenChange]);

  const handleSelect = (termId: string) => {
    onTermSelect(termId);
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-card border-border">
        <DialogHeader className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search terminology..."
              className="flex-1 bg-transparent text-foreground text-lg placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border bg-muted px-2 font-mono text-xs text-muted-foreground">
              ESC
            </kbd>
          </div>
          <DialogTitle className="sr-only">Search Terminology</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredTerms.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No terms found matching "{query}"
            </div>
          ) : (
            <div className="p-2">
              {filteredTerms.map((term, index) => (
                <button
                  key={term.id}
                  onClick={() => handleSelect(term.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                    index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                  )}
                >
                  <Badge variant={term.layer} className="mt-0.5 shrink-0">
                    {layerInfo[term.layer].label}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-foreground">
                        {term.name}
                      </span>
                      <Badge variant={term.knowledge} className="text-xs">
                        {term.knowledge}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {term.oneLine}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">↵</kbd>
                select
              </span>
            </div>
            <span>{filteredTerms.length} results</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
