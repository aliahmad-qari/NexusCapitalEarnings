import React from 'react';
import { UserPlus, Wallet, DollarSign } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create Account',
    description:
      'Sign up in under 2 minutes with full KYC verification and bank-grade identity protection.',
    color: 'text-nexus-primary',
    bg: 'bg-nexus-primary/10',
    border: 'border-nexus-primary/20',
  },
  {
    step: '02',
    icon: Wallet,
    title: 'Fund Your Wallet',
    description:
      'Deposit via crypto or bank transfer. Funds are secured in institutional cold storage immediately.',
    color: 'text-nexus-secondary',
    bg: 'bg-nexus-secondary/10',
    border: 'border-nexus-secondary/20',
  },
  {
    step: '03',
    icon: DollarSign,
    title: 'Earn Daily Returns',
    description:
      'Watch your portfolio grow with automated daily profit distributions directly to your wallet.',
    color: 'text-nexus-gold',
    bg: 'bg-nexus-gold/10',
    border: 'border-nexus-gold/20',
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-28 px-5 sm:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-nexus-primary text-xs font-semibold uppercase tracking-widest mb-4">
            Get Started in Minutes
          </p>
          <h2 className="text-headline-lg font-headline-lg text-white mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 text-body-md max-w-xl mx-auto">
            Three simple steps to start growing your wealth with NexusCapital.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-nexus-primary/30 via-nexus-secondary/30 to-nexus-gold/30" />

          {steps.map(({ step, icon: Icon, title, description, color, bg, border }) => (
            <div key={step} className="glass-card inner-glow-top rounded-2xl p-8 relative group hover:border-white/12 transition-all duration-300">
              {/* Step number */}
              <div className="text-slate-700 text-xs font-black uppercase tracking-widest mb-6">
                Step {step}
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 ${bg} border ${border} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={color} size={26} strokeWidth={1.75} />
              </div>

              <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
