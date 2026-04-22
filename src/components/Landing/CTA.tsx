import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, TrendingUp } from 'lucide-react';

export const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-5 sm:px-10 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-nexus-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-primary/30 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-nexus-primary/10 border border-nexus-primary/20 rounded-full px-4 py-1.5 mb-8">
          <TrendingUp size={12} className="text-nexus-primary" />
          <span className="text-nexus-primary text-xs font-semibold uppercase tracking-widest">
            Join 12,000+ Active Investors
          </span>
        </div>

        <h2 className="text-display-lg font-display-lg text-white mb-6">
          Ready to Compound{' '}
          <span className="text-gradient">Your Future?</span>
        </h2>

        <p className="text-slate-400 text-body-lg font-body-lg mb-12 max-w-2xl mx-auto">
          Don't wait for opportunity — create it. Open your NexusCapital account
          today and start earning daily returns from our intelligent asset growth systems.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={() => navigate('/register')}
            className="primary-gradient text-nexus-bg font-bold text-base px-10 py-5 rounded-2xl hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-nexus-primary/25 flex items-center gap-2"
          >
            Open Account — It's Free
            <ChevronRight size={18} strokeWidth={3} />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="glass-card text-slate-300 hover:text-white font-semibold text-sm px-8 py-5 rounded-2xl hover:bg-white/6 transition-all"
          >
            Already have an account? Log in
          </button>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-xs">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-nexus-primary/60" />
            No hidden fees
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-nexus-primary/60" />
            Withdraw anytime
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-nexus-primary/60" />
            Bank-grade security
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-nexus-primary/60" />
            Fully regulated
          </div>
        </div>
      </div>
    </section>
  );
};
