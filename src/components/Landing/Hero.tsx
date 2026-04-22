import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[870px] flex items-center overflow-hidden px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        <div className="z-10">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-surface-tint"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant tracking-widest uppercase">Institutional Grade Platform</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-white mb-6 leading-tight">
            Smart Investments: <br/>
            <span className="text-transparent bg-clip-text primary-gradient">Grow Your Wealth</span> <br/>
            With Daily Profits
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-10">
            Join the elite circle of prestige investors. Secure your future with our algorithmically driven wealth management ecosystem designed for institutional performance.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/register')}
              className="primary-gradient text-on-primary font-label-md text-label-md px-8 py-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform active:scale-95 flex items-center gap-2"
            >
              Invest Now
              <ChevronRight size={16} />
            </button>
            <button className="glass-card text-white font-label-md text-label-md px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              Explore Plans
            </button>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-container/20 blur-[120px] rounded-full"></div>
          <div className="relative glass-card rounded-3xl p-4 overflow-hidden border-white/20 aspect-square flex items-center justify-center">
            <img 
              alt="3D Digital Asset" 
              className="w-full h-full object-cover rounded-2xl opacity-80 mix-blend-screen" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu7yJT0H4vPg_r8ZR73aqoFbgaoDouI05W-J4iwebEc3gJ--2na2qNTT79IdxIWNgaNXdB0ITR5lWdVaaIezsLYjXLsr275XWaBRiSpNiNRLin6Fyc304vl9IKAe8tz1PCNFReKn4PtZV2Gtg5Lp-u1tD4YzolAZZcqaErIa8fPbYp126hTOhyux0ShdXUHtdfFt1OFNZAn8nzRSmvfxkBeHsv6hWMSzF6Gwvixgp2NqR_nNBGN_w0FpzSvI9tfxheUtUoOlrDnpJ5"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
