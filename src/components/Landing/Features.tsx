import React from 'react';
import { Shield, Zap, Headset, Brain, BarChart3, BadgeCheck } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description:
      'Multi-layer AES-256 encryption, cold storage, and biometric authentication protect every dollar you invest.',
    color: 'text-nexus-primary',
    bg: 'bg-nexus-primary/10',
    border: 'border-nexus-primary/15',
  },
  {
    icon: Zap,
    title: 'Instant Withdrawals',
    description:
      'Access your profits anytime. Our proprietary liquidity rail processes withdrawals in under 60 seconds.',
    color: 'text-nexus-secondary',
    bg: 'bg-nexus-secondary/10',
    border: 'border-nexus-secondary/15',
  },
  {
    icon: Headset,
    title: '24/7 Expert Support',
    description:
      'Dedicated wealth managers and live support available around the clock — phone, chat, or email.',
    color: 'text-nexus-gold',
    bg: 'bg-nexus-gold/10',
    border: 'border-nexus-gold/15',
  },
  {
    icon: Brain,
    title: 'AI-Powered Trading',
    description:
      'Our proprietary algorithms analyze 50+ market indicators in real-time to optimize every position.',
    color: 'text-nexus-purple',
    bg: 'bg-nexus-purple/10',
    border: 'border-nexus-purple/15',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description:
      'Live portfolio dashboard with granular performance data, ROI tracking, and custom reporting tools.',
    color: 'text-nexus-secondary',
    bg: 'bg-nexus-secondary/10',
    border: 'border-nexus-secondary/15',
  },
  {
    icon: BadgeCheck,
    title: 'Regulatory Compliance',
    description:
      'Fully licensed and audited. We operate under strict financial regulatory frameworks across 30+ jurisdictions.',
    color: 'text-nexus-primary',
    bg: 'bg-nexus-primary/10',
    border: 'border-nexus-primary/15',
  },
];

export const Features = () => {
  return (
    <section id="solutions" className="py-28 px-5 sm:px-10 bg-surface-container-low/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-nexus-primary text-xs font-semibold uppercase tracking-widest mb-4">
            Platform Advantages
          </p>
          <h2 className="text-headline-lg font-headline-lg text-white mb-4">
            Why NexusCapital?
          </h2>
          <p className="text-slate-400 text-body-md max-w-2xl mx-auto">
            The industry standard for security, speed, and reliability in
            algorithmic wealth management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color, bg, border }, idx) => (
            <div
              key={idx}
              className="glass-card inner-glow-top rounded-2xl p-8 hover:border-white/12 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 ${bg} border ${border} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={color} size={22} strokeWidth={1.75} />
              </div>
              <h3 className="text-white font-bold text-base mb-3">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
