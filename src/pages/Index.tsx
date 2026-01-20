import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SearchDialog } from '@/components/layout/SearchDialog';
import { TerminologyGrid } from '@/components/terminology/TerminologyGrid';
import { TermDetail } from '@/components/terminology/TermDetail';
import { getTermById } from '@/data/terminology';

const Index = () => {
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedTerm = selectedTermId ? getTermById(selectedTermId) : null;

  // Handle keyboard shortcut for search
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

  // Scroll to top when selecting a term
  useEffect(() => {
    if (selectedTermId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedTermId]);

  const handleTermSelect = (termId: string) => {
    setSelectedTermId(termId);
  };

  const handleBack = () => {
    setSelectedTermId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearchClick={() => setSearchOpen(true)} 
        onMobileMenuClick={() => setSidebarOpen(true)}
      />
      
      <Sidebar 
        activeTerm={selectedTermId}
        onTermSelect={handleTermSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
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
            <TerminologyGrid onTermSelect={handleTermSelect} />
          )}
        </div>
      </main>

      {/* Footer */}
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

export default Index;
