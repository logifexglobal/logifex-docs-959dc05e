import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SearchDialog } from '@/components/layout/SearchDialog';
import { TermDetail } from '@/components/terminology/TermDetail';
import { terminology, getTermById, layerInfo } from '@/data/terminology';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Code } from 'lucide-react';

const CoreDocs = () => {
  const navigate = useNavigate();
  const { termId } = useParams();
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const coreTerms = terminology.filter(t => t.layer === 'core');
  const selectedTerm = termId ? getTermById(termId) : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (termId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [termId]);

  const handleTermSelect = (id: string) => {
    navigate(`/core/${id}`);
  };

  const handleBack = () => {
    navigate('/core');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearchClick={() => setSearchOpen(true)} 
        onMobileMenuClick={() => setSidebarOpen(true)}
        activeTab="core"
      />
      
      <Sidebar 
        activeTerm={termId || null}
        onTermSelect={handleTermSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        filterLayer="core"
      />
      
      <SearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onTermSelect={handleTermSelect}
      />

      <main className="lg:pl-72 pt-16">
        <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
          {selectedTerm ? (
            <TermDetail
              term={selectedTerm}
              onBack={handleBack}
              onTermSelect={handleTermSelect}
            />
          ) : (
            <>
              {/* Hero Section */}
              <div className="mb-12">
                <Badge variant="core" className="mb-4">
                  {layerInfo.core.label}
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Core Architecture
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  {layerInfo.core.description}. The Core layer defines the immutable runtime kernel
                  that orchestrates all system behaviors.
                </p>
              </div>

              {/* Key Concepts */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Event-Driven</h3>
                  <p className="text-sm text-muted-foreground">
                    All communication flows through immutable events via the Event Bus.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                    <Shield className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Contract-Based</h3>
                  <p className="text-sm text-muted-foreground">
                    Explicit contracts define all interfaces and guarantees between components.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                    <Code className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Lifecycle-Aware</h3>
                  <p className="text-sm text-muted-foreground">
                    Every component follows deterministic initialization and cleanup phases.
                  </p>
                </div>
              </div>

              {/* Core Terms List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Core Terminology
                </h2>
                <div className="space-y-3">
                  {coreTerms.map(term => (
                    <button
                      key={term.id}
                      onClick={() => handleTermSelect(term.id)}
                      className="w-full p-4 rounded-xl border border-border bg-card/30 hover:bg-card/60 hover:border-cyan-500/30 transition-all text-left group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono font-semibold text-foreground group-hover:text-cyan-400 transition-colors">
                              {term.name}
                            </span>
                            <Badge variant={term.knowledge} className="text-xs">
                              {term.knowledge}
                            </Badge>
                            <Badge variant={term.status} className="text-xs">
                              {term.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {term.oneLine}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="lg:pl-72 border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>© 2026 Logifex</span>
              <span className="hidden sm:inline">·</span>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
              <span className="hidden sm:inline">·</span>
              <a href="#" className="hover:text-foreground transition-colors">Discord</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs">v1.0.0</span>
              <span>·</span>
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CoreDocs;
