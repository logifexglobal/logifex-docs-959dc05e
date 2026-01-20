import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SearchDialog } from '@/components/layout/SearchDialog';
import { TermDetail } from '@/components/terminology/TermDetail';
import { terminology, getTermById, layerInfo } from '@/data/terminology';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Puzzle, Package, Plug } from 'lucide-react';

const PluginsDocs = () => {
  const navigate = useNavigate();
  const { termId } = useParams();
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pluginTerms = terminology.filter(t => t.layer === 'plugin');
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
    navigate(`/plugins/${id}`);
  };

  const handleBack = () => {
    navigate('/plugins');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearchClick={() => setSearchOpen(true)} 
        onMobileMenuClick={() => setSidebarOpen(true)}
        activeTab="plugins"
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
                  {layerInfo.plugin.label}
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Plugin Architecture
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  {layerInfo.plugin.description}. Plugins extend Logifex capabilities through 
                  defined extension points without modifying Core.
                </p>
              </div>

              {/* Key Concepts */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                    <Puzzle className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Extension Points</h3>
                  <p className="text-sm text-muted-foreground">
                    Designated locations where plugins can attach behavior safely.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                    <Package className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Capabilities</h3>
                  <p className="text-sm text-muted-foreground">
                    Declared features and permissions that plugins provide or require.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                    <Plug className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Isolation</h3>
                  <p className="text-sm text-muted-foreground">
                    Plugin failures are isolated—one crash doesn't affect others.
                  </p>
                </div>
              </div>

              {/* Featured Plugins */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Official Plugins
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-colors">
                    <h3 className="font-mono font-semibold text-foreground mb-2">@logifex/analytics</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Telemetry and analytics integration with automatic event tracking.
                    </p>
                    <Badge variant="stable" className="text-xs">Stable</Badge>
                  </div>
                  <div className="p-6 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-colors">
                    <h3 className="font-mono font-semibold text-foreground mb-2">@logifex/auth</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Authentication and authorization handlers with session management.
                    </p>
                    <Badge variant="stable" className="text-xs">Stable</Badge>
                  </div>
                  <div className="p-6 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-colors">
                    <h3 className="font-mono font-semibold text-foreground mb-2">@logifex/forms</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Form state management with validation engine integration.
                    </p>
                    <Badge variant="stable" className="text-xs">Stable</Badge>
                  </div>
                  <div className="p-6 rounded-xl border border-border bg-card/30 hover:bg-card/50 transition-colors">
                    <h3 className="font-mono font-semibold text-foreground mb-2">@logifex/persistence</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      State persistence with IndexedDB and localStorage support.
                    </p>
                    <Badge variant="beta" className="text-xs">Beta</Badge>
                  </div>
                </div>
              </div>

              {/* Plugin Terms List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Plugin Terminology
                </h2>
                <div className="space-y-3">
                  {pluginTerms.map(term => (
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

export default PluginsDocs;
