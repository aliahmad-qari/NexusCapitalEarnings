import React from 'react';
import { useNavigate } from 'react-router-dom';

export const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-4 sm:px-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-container/5 via-transparent to-transparent"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="font-display-lg text-display-lg text-white mb-6">Ready to Compound Your Future?</h2>
        <p className="text-on-surface-variant font-body-lg text-body-lg mb-10">Don't wait for opportunity. Create it with ROI Prestige's intelligent asset growth systems.</p>
        <div className="flex justify-center gap-6">
          <button 
            onClick={() => navigate('/register')}
            className="primary-gradient text-on-primary font-headline-md px-12 py-5 rounded-2xl hover:scale-105 transition-transform shadow-2xl shadow-emerald-500/20"
          >
            Open Account Now
          </button>
        </div>
      </div>
    </section>
  );
};
