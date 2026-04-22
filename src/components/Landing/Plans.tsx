import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    daily: '1.5%',
    min: '$500',
    max: '$5,000',
    duration: '30 Day Duration',
    features: ['Min: $500', 'Max: $5,000', '30 Day Duration'],
    progress: 25,
    popular: false
  },
  {
    name: 'Silver',
    daily: '2.8%',
    min: '$5,001',
    max: '$25,000',
    duration: '60 Day Duration',
    features: ['Min: $5,001', 'Max: $25,000', '60 Day Duration'],
    progress: 50,
    popular: false
  },
  {
    name: 'Gold',
    daily: '4.2%',
    min: '$25,001',
    max: '$100,000',
    duration: '90 Day Duration',
    features: ['Min: $25,001', 'Max: $100,000', '90 Day Duration', 'Priority Manager'],
    progress: 75,
    popular: true
  },
  {
    name: 'VIP',
    daily: '6.5%',
    min: '$100,001+',
    max: 'Unlimited',
    duration: '180 Day Duration',
    features: ['Min: $100,001+', 'Unlimited Ceiling', '180 Day Duration', 'Insider Events'],
    progress: 100,
    popular: false
  }
];

export const Plans = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 sm:px-8 bg-surface-container-low/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-white mb-4">Investment Tiers</h2>
            <p className="text-on-surface-variant font-body-md text-body-md max-w-xl">Choose a strategy that aligns with your capital goals. High performance, guaranteed precision.</p>
          </div>
          <div className="flex bg-surface-container-highest p-1 rounded-lg">
            <button className="bg-surface-variant text-white px-4 py-2 rounded-md font-label-sm text-label-sm">Daily</button>
            <button className="text-on-surface-variant px-4 py-2 rounded-md font-label-sm text-label-sm hover:text-white transition-colors">Compound</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, idx) => (
            <div 
              key={idx}
              className={`glass-card flex flex-col p-8 rounded-3xl inner-glow-top relative group ${
                plan.popular ? 'border-primary-container/30 ring-1 ring-primary-container/20' : 'border-white/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary-container text-on-primary-container font-label-sm text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-tighter font-black">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <span className={`font-label-sm text-label-sm uppercase tracking-widest block mb-2 ${plan.popular ? 'text-primary-container' : 'text-on-surface-variant'}`}>
                  {plan.name}
                </span>
                <div className="text-white font-display-lg text-4xl mb-4">
                  {plan.daily} <span className="text-surface-tint text-lg uppercase font-label-md">Daily</span>
                </div>
                <div className="h-1 w-full bg-surface-variant rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-container neon-tube transition-all"
                    style={{ width: `${plan.progress}%` }}
                  ></div>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className={`flex items-center font-body-md text-sm ${plan.popular ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    <Check size={16} className={`${plan.popular ? 'text-primary-container' : 'text-surface-tint'} mr-3`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => navigate('/register')}
                className={`w-full py-4 rounded-xl font-label-md transition-all ${
                  plan.popular 
                    ? 'primary-gradient text-on-primary hover:opacity-90 shadow-lg shadow-emerald-500/10' 
                    : 'border border-white/10 text-white hover:bg-white/5 group-hover:border-primary-container/50'
                }`}
              >
                {plan.popular ? 'Select Gold' : `Select ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
