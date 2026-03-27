import { type Term, layerInfo, getTermById, domainInfo } from '@/data/terminology';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TermCardProps {
  term: Term;
  onClick: () => void;
  variant?: 'default' | 'compact';
}

export function TermCard({ term, onClick, variant = 'default' }: TermCardProps) {
  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className="group w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent transition-all text-left"
      >
        <Badge variant={term.layer} className="shrink-0">
          {layerInfo[term.layer].label}
        </Badge>
        <span className="font-mono font-medium text-foreground group-hover:text-primary transition-colors">
          {term.name}
        </span>
        {term.domain && (
          <span className={cn(
            "ml-auto mr-2 px-2 py-0.5 text-[10px] font-medium rounded-md",
            "bg-gradient-to-r backdrop-blur-sm border",
            domainInfo[term.domain].color
          )}>
            {domainInfo[term.domain].label}
          </span>
        )}
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full text-left p-5 rounded-xl border border-border bg-card",
        "hover:border-transparent hover:shadow-lg transition-all duration-300",
        "relative overflow-hidden",
        term.layer === 'core' && "hover:glow-core",
        term.layer === 'plugin' && "hover:glow-plugin"
      )}
    >
      {/* Gradient overlay on hover */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        term.layer === 'core' && "bg-gradient-to-br from-cyan-500/5 to-transparent",
        term.layer === 'plugin' && "bg-gradient-to-br from-emerald-500/5 to-transparent",
        term.layer === 'ui' && "bg-gradient-to-br from-violet-500/5 to-transparent",
        term.layer === 'tooling' && "bg-gradient-to-br from-amber-500/5 to-transparent",
        term.layer === 'meta' && "bg-gradient-to-br from-rose-500/5 to-transparent"
      )} />
      
      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={term.layer}>
              {layerInfo[term.layer].label}
            </Badge>
            <Badge variant={term.knowledge} className="text-xs">
              {term.knowledge}
            </Badge>
            {term.status !== 'stable' && (
              <Badge variant={term.status} className="text-xs">
                {term.status}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {term.domain && (
              <span className={cn(
                "px-2 py-0.5 text-[10px] font-medium rounded-md",
                "bg-gradient-to-r backdrop-blur-sm border",
                domainInfo[term.domain].color
              )}>
                {domainInfo[term.domain].label}
              </span>
            )}
            <span className="text-xs font-mono text-muted-foreground">
              {term.version}
            </span>
          </div>
        </div>
        
        <h3 className={cn(
          "font-mono text-lg font-semibold mb-2 transition-colors",
          term.layer === 'core' && "text-gradient-core group-hover:text-cyan-300",
          term.layer === 'plugin' && "text-gradient-plugin group-hover:text-emerald-300",
          term.layer === 'ui' && "text-gradient-ui group-hover:text-violet-300",
          term.layer === 'tooling' && "text-gradient-tooling group-hover:text-amber-300",
          term.layer === 'meta' && "text-gradient-meta group-hover:text-rose-300"
        )}>
          {term.name}
        </h3>
        
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {term.oneLine}
        </p>
        
        {term.relationships.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Related:</span>
            {term.relationships.slice(0, 3).map(rel => {
              const related = getTermById(rel.termId);
              return related ? (
                <span key={rel.termId} className="text-xs font-mono text-primary/70">
                  {related.name}
                </span>
              ) : null;
            })}
            {term.relationships.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{term.relationships.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
