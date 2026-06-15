import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Zap, Headphones, Users } from 'lucide-react';
import { DownloadAppButton } from '../DownloadAppButton.tsx';

const trustBadges = [
  { icon: ShieldCheck, label: 'Bank Grade Security' },
  { icon: Zap, label: 'Instant Withdrawals' },
  { icon: Headphones, label: '24/7 Support' },
  { icon: Users, label: 'Trusted by 10K+ Users' },
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
        <div className="z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-nexus-primary/10 border border-nexus-primary/20 rounded-full px-4 py-1.5">
            <span className="flex h-2 w-2 rounded-full bg-nexus-primary animate-pulse" />
            <span className="text-nexus-primary text-xs font-semibold uppercase tracking-widest">
              Smart Investments
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-display-lg font-display-lg text-white">
            Grow Your Wealth With <br />
            <span className="text-gradient">Daily Profits</span>
          </h1>

          <p className="text-body-lg font-body-lg text-slate-400 max-w-lg">
            Invest once and earn daily profits. Secure. Transparent. Profitable.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => navigate('/register')}
              className="primary-gradient text-nexus-bg font-extrabold text-sm px-8 py-4 rounded-xl shadow-xl shadow-nexus-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              Invest Now
              <ChevronRight size={16} strokeWidth={3} />
            </button>
            <button
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass-card text-white font-semibold text-sm px-8 py-4 rounded-xl hover:bg-white/8 transition-all"
            >
              Explore Plans
            </button>
            <DownloadAppButton variant="primary" label="Install Nexus Capital APK" />
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-slate-400 text-sm">
                <div className="p-2 rounded-lg bg-white/5 border border-white/8 text-nexus-primary">
                  <Icon size={16} />
                </div>
                <span className="font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Modern 3D Illustration Placeholder */}
        <div className="relative hidden lg:flex items-center justify-center z-10 h-[450px]">
          {/* Glowing circles */}
          <div className="absolute w-[350px] h-[350px] rounded-full border border-nexus-primary/20 animate-[spin_40s_linear_infinite]" />
          <div className="absolute w-[280px] h-[280px] rounded-full border border-dashed border-nexus-secondary/15 animate-[spin_20s_linear_infinite_reverse]" />
          <div className="absolute w-[400px] h-[400px] bg-nexus-primary/5 blur-3xl rounded-full" />

          {/* Central CSS 3D Cube/Shield Structure */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Core Shield */}
            <div className="absolute w-36 h-36 rounded-[2.5rem] bg-gradient-to-tr from-nexus-primary to-nexus-secondary opacity-20 blur-xl animate-pulse" />
            <div className="absolute w-32 h-32 rounded-[2rem] border border-nexus-primary/40 bg-gradient-to-br from-white/[0.07] to-transparent backdrop-blur-2xl flex items-center justify-center shadow-2xl group hover:border-nexus-primary/60 transition-colors duration-500">
              <div className="w-16 h-16 rounded-full bg-nexus-primary/10 border border-nexus-primary/30 flex items-center justify-center text-nexus-primary">
                <ShieldCheck size={36} className="animate-[pulse_3s_ease-in-out_infinite]" />
              </div>
            </div>
            
            {/* Orbiting particles */}
            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl glass-premium flex items-center justify-center border-nexus-gold/40 shadow-lg animate-[bounce_4s_ease-in-out_infinite]">
              <span className="text-nexus-gold font-extrabold text-sm">$</span>
            </div>
            <div className="absolute -bottom-2 -left-6 w-10 h-10 rounded-xl glass flex items-center justify-center border-nexus-primary/30 shadow-lg animate-[bounce_5s_ease-in-out_infinite_1s]">
              <Zap size={16} className="text-nexus-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
