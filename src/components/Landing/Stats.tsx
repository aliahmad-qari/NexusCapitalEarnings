import React from 'react';
import { TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Total Investors', value: '12,842', growth: '+8.4%' },
  { label: 'Total Invested', value: '$2.4B', growth: '+12.5%' },
  { label: 'Total Payouts', value: '$482M', growth: '+5.2%' },
];

export const Stats = () => {
  return (
    <section className="py-10 border-y border-white/5 bg-surface-container-low/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/6">
          {stats.map(({ label, value, growth }) => (
            <div key={label} className="flex flex-col gap-2 py-8 md:py-4 md:px-12 first:pl-0 last:pr-0">
              <span className="text-slate-500 text-xs uppercase tracking-widest font-semibold">
                {label}
              </span>
              <div className="flex items-end gap-3">
                <span className="text-white text-4xl font-black tracking-tight">
                  {value}
                </span>
                <div className="flex items-center gap-1 text-nexus-primary text-xs font-bold mb-1.5">
                  <TrendingUp size={13} />
                  {growth}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
