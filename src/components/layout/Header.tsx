import { Search, GitBranch, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSearchClick: () => void;
  onMobileMenuClick: () => void;
  activeTab?: 'terminology' | 'core' | 'adapters' | 'plugins';
}

export function Header({ onSearchClick, onMobileMenuClick, activeTab }: HeaderProps) {
  const location = useLocation();
  
  const getActiveTab = () => {
    if (activeTab) return activeTab;
    if (location.pathname.startsWith('/core')) return 'core';
    if (location.pathname.startsWith('/adapters')) return 'adapters';
    if (location.pathname.startsWith('/plugins')) return 'plugins';
    return 'terminology';
  };
  
  const currentTab = getActiveTab();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMobileMenuClick}
            className="lg:hidden p-2 hover:bg-accent rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold text-sm">Lx</span>
            </div>
            <span className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              Logifex
            </span>
            <span className="hidden sm:inline text-muted-foreground text-sm font-mono">
              docs
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <Link 
            to="/" 
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              currentTab === 'terminology' 
                ? "text-primary hover:text-primary/80" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Terminology
          </Link>
          <Link 
            to="/core" 
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              currentTab === 'core' 
                ? "text-primary hover:text-primary/80" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Core
          </Link>
          <Link 
            to="/adapters" 
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              currentTab === 'adapters' 
                ? "text-primary hover:text-primary/80" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Adapters
          </Link>
          <Link 
            to="/plugins" 
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              currentTab === 'plugins' 
                ? "text-primary hover:text-primary/80" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Plugins
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSearchClick}
            className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline">Search...</span>
            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <GitBranch className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
