import React from 'react';
import { TrendingUp } from 'lucide-react';

export const Stats = () => {
  return (
    <section className="py-12 border-y border-white/5 bg-surface-container-lowest/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Total Investors</span>
            <div className="flex items-end space-x-3">
              <span className="font-display-lg text-4xl text-white">12,842</span>
              <span className="flex items-center text-primary-container font-label-sm text-label-sm mb-2">
                <TrendingUp size={16} className="mr-1" /> +8.4%
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Total Invested</span>
            <div className="flex items-end space-x-3">
              <span className="font-display-lg text-4xl text-white">$2.4B</span>
              <span className="flex items-center text-primary-container font-label-sm text-label-sm mb-2">
                <TrendingUp size={16} className="mr-1" /> +12.5%
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Total Payouts</span>
            <div className="flex items-end space-x-3">
              <span className="font-display-lg text-4xl text-white">$482M</span>
              <span className="flex items-center text-primary-container font-label-sm text-label-sm mb-2">
                <TrendingUp size={16} className="mr-1" /> +5.2%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
