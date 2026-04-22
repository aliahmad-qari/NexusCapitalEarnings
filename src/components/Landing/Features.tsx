import React from 'react';
import { Shield, Zap, Headset, Users } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Bank Grade Security',
    description: 'Multi-layer encryption and cold storage solutions for ultimate protection.',
    color: 'text-surface-tint'
  },
  {
    icon: Zap,
    title: 'Instant Withdrawals',
    description: 'Access your profits instantly through our proprietary high-speed rail.',
    color: 'text-secondary-container'
  },
  {
    icon: Headset,
    title: '24/7 Support',
    description: 'Dedicated wealth managers available round the clock for your peace of mind.',
    color: 'text-on-tertiary-container'
  },
  {
    icon: Users,
    title: 'Trusted by 10k+ Users',
    description: 'Join a global community of elite investors who trust ROI Prestige.',
    color: 'text-surface-tint'
  }
];

export const Features = () => {
  return (
    <section className="py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg text-white mb-4">Why ROI Prestige?</h2>
          <p className="text-on-surface-variant font-body-md text-body-md max-w-2xl mx-auto">The industry standard for security, speed, and reliability in wealth management.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass-card inner-glow-top p-8 rounded-2xl hover:border-surface-tint/50 transition-colors group">
                <div className="w-12 h-12 bg-primary-container/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className={`${feature.color}`} size={24} />
                </div>
                <h3 className="font-headline-md text-label-md text-white mb-3">{feature.title}</h3>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
