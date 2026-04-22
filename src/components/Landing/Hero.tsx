import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, TrendingUp, Zap } from 'lucide-react';

const portfolioReturns = [
  { plan: 'Gold Plan', amount: '+$847.20', time: 'Today', color: '#F59E0B' },
  { plan: 'Silver Plan', amount: '+$234.15', time: 'Yesterday', color: '#94a3b8' },
  { plan: 'Starter Plan', amount: '+$89.50', time: '2 days ago', color: '#00F5A0' },
];

const bars = [42, 58, 45, 72, 55, 85, 68, 91, 74, 88, 95, 100];

const trustBadges = [
  { icon: ShieldCheck, label: 'Bank-Grade Security' },
  { icon: Zap, label: 'Instant Withdrawals' },
  { icon: TrendingUp, label: 'Daily Returns' },
];

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden px-5 sm:px-10 pt-24 pb-16">
      {/* Background glows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-nexus-primary/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-nexus-secondary/6 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left: Text Content */}
        <div className="z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-nexus-primary/10 border border-nexus-primary/20 rounded-full px-4 py-1.5 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-nexus-primary animate-pulse" />
            <span className="text-nexus-primary text-xs font-semibold uppercase tracking-widest">
              Institutional Grade Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-display-lg font-display-lg text-white mb-6">
            Smart Investments.{' '}
            <span className="text-gradient">Real Returns.</span>
          </h1>

          <p className="text-body-lg font-body-lg text-slate-400 max-w-lg mb-10">
            Join thousands of investors earning consistent daily returns through
            our algorithmically-driven wealth management platform built for
            institutional performance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => navigate('/register')}
              className="primary-gradient text-nexus-bg font-bold text-sm px-8 py-4 rounded-xl shadow-xl shadow-nexus-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              Start Investing
              <ChevronRight size={16} strokeWidth={3} />
            </button>
            <button
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass-card text-white font-semibold text-sm px-8 py-4 rounded-xl hover:bg-white/8 transition-all"
            >
              Explore Plans
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-slate-400 text-xs">
                <Icon size={14} className="text-nexus-primary" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Animated Portfolio Card */}
        <div className="relative hidden lg:block z-10">
          {/* Glow behind card */}
          <div className="absolute inset-0 bg-nexus-primary/10 blur-3xl rounded-full scale-75" />

          <div className="glass-card inner-glow-top rounded-3xl p-7 relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1.5">
                  Portfolio Value
                </p>
                <p className="text-white text-4xl font-black tracking-tight">
                  $48,392<span className="text-2xl text-slate-400">.50</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-nexus-primary/10 border border-nexus-primary/20 rounded-xl px-3 py-1.5">
                <TrendingUp size={14} className="text-nexus-primary" />
                <span className="text-nexus-primary text-sm font-bold">+12.4%</span>
              </div>
            </div>

            {/* Mini Bar Chart */}
            <div className="flex items-end gap-1 h-20 mb-6 px-1">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all"
                  style={{
                    height: `${h}%`,
                    background: `rgba(0,245,160,${0.15 + (h / 100) * 0.65})`,
                  }}
                />
              ))}
            </div>

            {/* Recent Returns */}
            <div className="space-y-2.5">
              <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-3">
                Recent Returns
              </p>
              {portfolioReturns.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3.5 bg-white/4 hover:bg-white/6 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-300 text-sm">{item.plan}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-nexus-primary text-sm font-bold">{item.amount}</span>
                    <span className="text-slate-500 text-xs ml-2">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom divider */}
            <div className="mt-5 pt-5 border-t border-white/6 flex justify-between items-center">
              <span className="text-slate-500 text-xs">Next payout in</span>
              <span className="text-nexus-primary text-sm font-bold font-mono">
                06:42:18
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
