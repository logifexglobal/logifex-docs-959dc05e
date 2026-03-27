import { type Term, layerInfo, getTermById, getRelatedTerms, domainInfo } from '@/data/terminology';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Lightbulb, 
  AlertTriangle, 
  Link2, 
  BookOpen,
  X,
  History,
  Target,
  Shield,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TermCard } from './TermCard';

interface TermDetailProps {
  term: Term;
  onBack: () => void;
  onTermSelect: (termId: string) => void;
}

export function TermDetail({ term, onBack, onTermSelect }: TermDetailProps) {
  const relatedTerms = getRelatedTerms(term.id);

  return (
    <article className="max-w-4xl mx-auto animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to terminology</span>
      </button>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <Badge variant={term.layer} className="text-sm px-3 py-1">
            {layerInfo[term.layer].label}
          </Badge>
          <Badge variant={term.knowledge}>
            {term.knowledge}
          </Badge>
          <Badge variant={term.status}>
            {term.status}
          </Badge>
          {term.domain && (
            <span className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-md",
              "bg-gradient-to-r backdrop-blur-sm border",
              domainInfo[term.domain].color
            )}>
              {domainInfo[term.domain].label}
            </span>
          )}
          <span className="text-sm font-mono text-muted-foreground ml-auto">
            {term.version}
          </span>
        </div>
        
        <h1 className={cn(
          "font-mono text-4xl md:text-5xl font-bold mb-4",
          term.layer === 'core' && "text-gradient-core",
          term.layer === 'plugin' && "text-gradient-plugin",
          term.layer === 'ui' && "text-gradient-ui",
          term.layer === 'tooling' && "text-gradient-tooling",
          term.layer === 'meta' && "text-gradient-meta"
        )}>
          {term.name}
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed">
          {term.oneLine}
        </p>

        {term.domain && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-muted-foreground font-medium">Primary Domain:</span>
            <span className={cn(
              "px-3 py-1 text-sm font-semibold rounded-lg",
              "bg-gradient-to-r backdrop-blur-sm border",
              domainInfo[term.domain].color
            )}>
              {domainInfo[term.domain].label}
            </span>
          </div>
        )}
      </header>

      {/* Mental Model */}
      <Section
        icon={<Lightbulb className="w-5 h-5" />}
        title="Mental Model"
        variant={term.layer}
      >
        <p className="text-foreground leading-relaxed">
          {term.mentalModel}
        </p>
      </Section>

      {/* Why Logifex Needs This */}
      <Section
        icon={<Target className="w-5 h-5" />}
        title="Why Logifex Needs This"
        variant={term.layer}
      >
        <p className="text-foreground leading-relaxed">
          {term.whyNeeded}
        </p>
      </Section>

      {/* Core Guarantees */}
      <Section
        icon={<Shield className="w-5 h-5" />}
        title="Core Guarantees"
        variant={term.layer}
      >
        <ul className="space-y-3">
          {term.guarantees.map((guarantee, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className={cn(
                "w-1.5 h-1.5 rounded-full mt-2 shrink-0",
                term.layer === 'core' && "bg-cyan-400",
                term.layer === 'plugin' && "bg-emerald-400",
                term.layer === 'ui' && "bg-violet-400",
                term.layer === 'tooling' && "bg-amber-400",
                term.layer === 'meta' && "bg-rose-400"
              )} />
              <span className="text-foreground">{guarantee}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* What It Is Not */}
      {term.notThis && term.notThis.length > 0 && (
        <Section
          icon={<X className="w-5 h-5" />}
          title="What It Is Not"
          variant={term.layer}
        >
          <ul className="space-y-3">
            {term.notThis.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-muted-foreground">
                <span className="text-muted-foreground/50 mt-0.5">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Anti-Patterns */}
      <Section
        icon={<AlertTriangle className="w-5 h-5" />}
        title="Anti-Patterns & Misuse"
        variant="warning"
      >
        <ul className="space-y-3">
          {term.antiPatterns.map((pattern, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
              <span className="text-foreground">{pattern}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Relationships */}
      <Section
        icon={<Link2 className="w-5 h-5" />}
        title="Relationships"
        variant={term.layer}
      >
        <div className="space-y-2">
          {term.relationships.map(rel => {
            const related = getTermById(rel.termId);
            return related ? (
              <button
                key={rel.termId}
                onClick={() => onTermSelect(rel.termId)}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-accent/50 transition-all text-left group"
              >
                <Badge variant={related.layer} className="shrink-0">
                  {layerInfo[related.layer].label}
                </Badge>
                <span className="font-mono text-foreground group-hover:text-primary transition-colors">
                  {related.name}
                </span>
                <span className="text-sm text-muted-foreground italic">
                  {rel.relation}
                </span>
              </button>
            ) : null;
          })}
        </div>
      </Section>

      {/* Example */}
      {term.example && (
        <Section
          icon={<BookOpen className="w-5 h-5" />}
          title="Example"
          variant={term.layer}
        >
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-foreground leading-relaxed font-mono text-sm">
              {term.example}
            </p>
          </div>
        </Section>
      )}

      {/* Lifecycle */}
      {term.lifecycle && (
        <Section
          icon={<History className="w-5 h-5" />}
          title="Lifecycle & Version Notes"
          variant={term.layer}
        >
          <p className="text-foreground leading-relaxed">
            {term.lifecycle}
          </p>
        </Section>
      )}

      {/* Future Evolution */}
      {term.futureEvolution && (
        <Section
          icon={<Zap className="w-5 h-5" />}
          title="Future Evolution"
          variant={term.layer}
        >
          <p className="text-muted-foreground leading-relaxed italic">
            {term.futureEvolution}
          </p>
        </Section>
      )}

      {/* Related Terms */}
      {relatedTerms.length > 0 && (
        <section className="mt-12 pt-8 border-t border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Related Terms
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedTerms.slice(0, 4).map(related => (
              <TermCard
                key={related.id}
                term={related}
                onClick={() => onTermSelect(related.id)}
                variant="compact"
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  variant?: 'core' | 'plugin' | 'ui' | 'tooling' | 'meta' | 'warning';
}

function Section({ icon, title, children, variant = 'core' }: SectionProps) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          "p-2 rounded-lg",
          variant === 'core' && "bg-cyan-500/10 text-cyan-400",
          variant === 'plugin' && "bg-emerald-500/10 text-emerald-400",
          variant === 'ui' && "bg-violet-500/10 text-violet-400",
          variant === 'tooling' && "bg-amber-500/10 text-amber-400",
          variant === 'meta' && "bg-rose-500/10 text-rose-400",
          variant === 'warning' && "bg-amber-500/10 text-amber-400"
        )}>
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          {title}
        </h2>
      </div>
      <div className="pl-12">
        {children}
      </div>
    </section>
  );
}
