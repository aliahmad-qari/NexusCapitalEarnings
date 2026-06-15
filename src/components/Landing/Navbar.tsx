import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { DownloadAppButton } from '../DownloadAppButton.tsx';

const navLinks = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Plans', href: '#plans' },
  { label: 'Calculator', href: '#calculator' },
  { label: 'Security', href: '#security' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-nexus-bg/80 backdrop-blur-2xl border-b border-white/8 shadow-xl shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-5 sm:px-10 py-4">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-full border border-nexus-primary/30 flex items-center justify-center bg-nexus-primary/10 shadow-lg shadow-nexus-primary/10">
            <span className="text-nexus-primary font-black text-sm">$</span>
          </div>
          <span className="text-xl font-black tracking-tight text-white uppercase">
            ROI
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-400 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-1.5 px-3 py-2 text-slate-400 hover:text-white text-sm font-medium cursor-pointer rounded-lg hover:bg-white/5 transition-all duration-200">
            <Globe size={16} />
            <span>EN</span>
          </div>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <DownloadAppButton variant="ghost" />
          <button
            onClick={() => navigate('/login')}
            className="text-slate-400 hover:text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="primary-gradient text-nexus-bg text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-nexus-primary/20"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-nexus-bg/95 backdrop-blur-2xl border-t border-white/8 px-5 py-5 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-slate-400 hover:text-white text-sm font-medium px-4 py-3 rounded-xl hover:bg-white/5 transition-all"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-1.5 px-4 py-3 text-slate-400 hover:text-white text-sm font-medium cursor-pointer rounded-xl hover:bg-white/5 transition-all">
            <Globe size={16} />
            <span>EN</span>
          </div>
          <div className="flex flex-col gap-2 pt-4 border-t border-white/8 mt-3">
            <DownloadAppButton variant="compact" className="w-full" onNavigate={() => setIsOpen(false)} />
            <button
              onClick={() => { navigate('/login'); setIsOpen(false); }}
              className="text-slate-400 hover:text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-left"
            >
              Log In
            </button>
            <button
              onClick={() => { navigate('/register'); setIsOpen(false); }}
              className="primary-gradient text-nexus-bg text-sm font-bold px-4 py-3 rounded-xl hover:opacity-90 text-center"
            >
              Get Started — It's Free
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
