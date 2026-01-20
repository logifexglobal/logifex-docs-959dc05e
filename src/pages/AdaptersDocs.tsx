import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SearchDialog } from '@/components/layout/SearchDialog';
import { TermDetail } from '@/components/terminology/TermDetail';
import { terminology, getTermById, layerInfo } from '@/data/terminology';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Layers, RefreshCw, Database } from 'lucide-react';

const AdaptersDocs = () => {
  const navigate = useNavigate();
  const { termId } = useParams();
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Adapters are in plugin layer and include adapter-related terms
  const adapterTerms = terminology.filter(t => 
    t.id === 'adapter' || 
    t.id === 'state-adapter' || 
    t.id === 'state-source' ||
    t.name.toLowerCase().includes('adapter')
  );
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
    navigate(`/adapters/${id}`);
  };

  const handleBack = () => {
    navigate('/adapters');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearchClick={() => setSearchOpen(true)} 
        onMobileMenuClick={() => setSidebarOpen(true)}
        activeTab="adapters"
      />
      
      <Sidebar 
        activeTerm={termId || null}
        onTermSelect={handleTermSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        filterLayer="plugin"
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
                <Badge variant="plugin" className="mb-4">
                  Adapters
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Adapter Architecture
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  Adapters are boundary components that translate between Logifex internals and external systems.
                  They ensure Core remains pure while integrating with the outside world.
                </p>
              </div>

              {/* Key Concepts */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                    <Layers className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Boundary Translation</h3>
                  <p className="text-sm text-muted-foreground">
                    Adapters speak Logifex on one side and external languages (React, REST, etc.) on the other.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                    <RefreshCw className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">State Synchronization</h3>
                  <p className="text-sm text-muted-foreground">
                    State Adapters bridge external state systems to the internal Event Bus.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                    <Database className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Isolation Guarantee</h3>
                  <p className="text-sm text-muted-foreground">
                    External concepts never leak into Core—adapters handle all translations.
                  </p>
                </div>
              </div>

              {/* Available Adapters */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Official Adapters
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-colors">
                    <h3 className="font-mono font-semibold text-foreground mb-2">@logifex/react</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      React bindings with hooks, context providers, and component utilities.
                    </p>
                    <Badge variant="stable" className="text-xs">Stable</Badge>
                  </div>
                  <div className="p-6 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-colors">
                    <h3 className="font-mono font-semibold text-foreground mb-2">@logifex/vue</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Vue 3 bindings with composables and reactive state integration.
                    </p>
                    <Badge variant="beta" className="text-xs">Beta</Badge>
                  </div>
                  <div className="p-6 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-colors">
                    <h3 className="font-mono font-semibold text-foreground mb-2">@logifex/rest</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      REST API adapter for server-side event synchronization.
                    </p>
                    <Badge variant="stable" className="text-xs">Stable</Badge>
                  </div>
                  <div className="p-6 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-colors">
                    <h3 className="font-mono font-semibold text-foreground mb-2">@logifex/graphql</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      GraphQL adapter with subscription support and cache integration.
                    </p>
                    <Badge variant="beta" className="text-xs">Beta</Badge>
                  </div>
                </div>
              </div>

              {/* Adapter Terms List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Adapter Terminology
                </h2>
                <div className="space-y-3">
                  {adapterTerms.map(term => (
                    <button
                      key={term.id}
                      onClick={() => handleTermSelect(term.id)}
                      className="w-full p-4 rounded-xl border border-border bg-card/30 hover:bg-card/60 hover:border-violet-500/30 transition-all text-left group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono font-semibold text-foreground group-hover:text-violet-400 transition-colors">
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
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-violet-400 transition-colors flex-shrink-0 mt-1" />
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

export default AdaptersDocs;
