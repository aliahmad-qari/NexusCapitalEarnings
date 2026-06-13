import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const stats = [
  { label: 'Total Investors', value: '25,689',         growth: '12.5%' },
  { label: 'Total Invested',  value: 'PKR 2,45,87,500', growth: '18.7%' },
  { label: 'Total Payouts',   value: 'PKR 1,15,48,900', growth: '15.3%' },
];

export const Stats = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-10">
        <div className="mb-10 text-center lg:text-left">
          <p className="text-nexus-primary text-xs font-black uppercase tracking-[0.2em] mb-2">Realtime Platform Metrics</p>
          <h2 className="text-xl font-black tracking-tight text-white">Live Platform Statistics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map(({ label, value, growth }) => (
            <div key={label} className="glass-card inner-glow-top rounded-3xl p-8 flex flex-col justify-between hover:border-nexus-primary/30 transition-all duration-300 group">
              <div>
                <span className="text-slate-500 text-xs uppercase tracking-widest font-semibold block mb-4">
                  {label}
                </span>
                <span className="text-white text-xl font-black tracking-tight group-hover:text-nexus-primary transition-colors">
                  {value}
                </span>
              </div>
              <div className="flex items-center gap-1 text-nexus-primary text-xs font-bold mt-4 bg-nexus-primary/10 w-fit px-3 py-1 rounded-full">
                <ArrowUpRight size={14} />
                <span>{growth} this week</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
