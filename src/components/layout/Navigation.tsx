import { useState, useEffect } from 'react';
import { FileText, Menu, X, ArrowRight } from 'lucide-react';

interface NavigationProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenConsult: () => void;
}

export default function Navigation({ onOpenAuth, onOpenConsult }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/92 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-semibold text-[17px] text-ink">The Paperwork Squad</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[['How It Works', 'how-it-works'], ['Services', 'services'], ['Pricing', 'pricing'], ['FAQ', 'faq']].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm text-muted hover:text-ink transition-colors font-medium"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="text-sm text-muted hover:text-ink transition-colors font-medium px-3 py-2"
          >
            Client Login
          </button>
          <button onClick={onOpenConsult} className="btn-primary text-sm">
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-ink"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-4">
          {[['How It Works', 'how-it-works'], ['Services', 'services'], ['Pricing', 'pricing'], ['FAQ', 'faq']].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-left text-sm text-muted font-medium py-1"
            >
              {label}
            </button>
          ))}
          <hr className="border-gray-100" />
          <button onClick={() => { onOpenAuth('login'); setMobileOpen(false); }} className="text-left text-sm text-muted font-medium">
            Client Login
          </button>
          <button onClick={() => { onOpenConsult(); setMobileOpen(false); }} className="btn-primary text-sm w-full justify-center">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}
