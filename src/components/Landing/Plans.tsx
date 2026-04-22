import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';

type Mode = 'daily' | 'compound';

const plans = [
  {
    name: 'Starter',
    dailyRate: 1.5,
    compoundRate: 1.8,
    min: 500,
    max: 5000,
    duration: 30,
    features: ['Min: $500', 'Max: $5,000', '30-Day Duration', 'Daily Payouts', 'Email Support'],
    popular: false,
    accent: 'text-slate-300',
    progress: 25,
  },
  {
    name: 'Silver',
    dailyRate: 2.8,
    compoundRate: 3.2,
    min: 5001,
    max: 25000,
    duration: 60,
    features: ['Min: $5,001', 'Max: $25,000', '60-Day Duration', 'Daily Payouts', 'Priority Support'],
    popular: false,
    accent: 'text-slate-300',
    progress: 50,
  },
  {
    name: 'Gold',
    dailyRate: 4.2,
    compoundRate: 5.0,
    min: 25001,
    max: 100000,
    duration: 90,
    features: ['Min: $25,001', 'Max: $100,000', '90-Day Duration', 'Instant Payouts', 'Dedicated Manager', 'VIP Access'],
    popular: true,
    accent: 'text-nexus-primary',
    progress: 75,
  },
  {
    name: 'VIP',
    dailyRate: 6.5,
    compoundRate: 7.8,
    min: 100001,
    max: Infinity,
    duration: 180,
    features: ['Min: $100,001+', 'No Ceiling', '180-Day Duration', 'Instant Payouts', 'Private Wealth Manager', 'Insider Events', 'Custom Strategy'],
    popular: false,
    accent: 'text-nexus-gold',
    progress: 100,
  },
];

export const Plans = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('daily');

  return (
    <section id="plans" className="py-28 px-5 sm:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-20">
          <div>
            <p className="text-nexus-primary text-xs font-semibold uppercase tracking-widest mb-4">
              Investment Tiers
            </p>
            <h2 className="text-headline-lg font-headline-lg text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-slate-400 text-body-md max-w-xl">
              Strategies designed for every level of capital. High performance,
              transparent returns.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-surface-container-highest p-1 rounded-xl border border-white/6 shrink-0">
            {(['daily', 'compound'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  mode === m
                    ? 'bg-surface-variant text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {m === 'compound' ? 'Compound +' : 'Daily'}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, idx) => {
            const rate = mode === 'daily' ? plan.dailyRate : plan.compoundRate;
            return (
              <div
                key={idx}
                className={`glass-card inner-glow-top flex flex-col p-7 rounded-3xl relative group transition-all duration-300 ${
                  plan.popular
                    ? 'border-nexus-primary/30 ring-1 ring-nexus-primary/15 shadow-2xl shadow-nexus-primary/10'
                    : 'hover:border-white/12'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-primary/60 to-transparent" />
                )}
                {plan.popular && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-nexus-primary/15 border border-nexus-primary/25 text-nexus-primary text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                    <Sparkles size={10} />
                    Popular
                  </div>
                )}

                {/* Plan name */}
                <div className="mb-6">
                  <span className={`text-xs font-black uppercase tracking-widest ${plan.popular ? 'text-nexus-primary' : 'text-slate-500'}`}>
                    {plan.name}
                  </span>

                  {/* Rate */}
                  <div className="flex items-baseline gap-1.5 mt-2 mb-1">
                    <span className="text-white text-4xl font-black tracking-tight">
                      {rate}%
                    </span>
                    <span className={`text-sm font-semibold uppercase ${plan.popular ? 'text-nexus-primary' : 'text-slate-500'}`}>
                      {mode === 'daily' ? '/ day' : '/ day'}
                    </span>
                  </div>

                  <p className="text-slate-500 text-xs">
                    {plan.duration}-day duration · min ${plan.min.toLocaleString()}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div
                      className="h-full neon-tube rounded-full transition-all"
                      style={{ width: `${plan.progress}%` }}
                    />
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <Check
                        size={14}
                        strokeWidth={2.5}
                        className={plan.popular ? 'text-nexus-primary' : 'text-slate-500'}
                      />
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => navigate('/register')}
                  className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
                    plan.popular
                      ? 'primary-gradient text-nexus-bg hover:opacity-90 shadow-lg shadow-nexus-primary/20'
                      : 'border border-white/10 text-white hover:bg-white/5 group-hover:border-white/20'
                  }`}
                >
                  Select {plan.name}
                </button>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-slate-600 text-xs mt-10">
          Investment returns shown are based on historical performance. Past results do not guarantee future returns.
        </p>
      </div>
    </section>
  );
};
