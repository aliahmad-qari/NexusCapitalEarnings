import React from 'react';
import { Globe, Building2, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/5 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-12 py-16 max-w-7xl mx-auto space-y-8 md:space-y-0">
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="text-xl font-bold text-white tracking-tight">ROI PRESTIGE</div>
          <p className="text-xs font-inter tracking-widest text-slate-500 uppercase">© 2024 ROI PRESTIGE. SECURE WEALTH MANAGEMENT.</p>
        </div>
        <div className="flex space-x-8">
          <a href="#" className="text-xs font-inter tracking-widest text-slate-500 hover:text-emerald-400 transition-colors uppercase">Terms</a>
          <a href="#" className="text-xs font-inter tracking-widest text-slate-500 hover:text-emerald-400 transition-colors uppercase">Privacy</a>
          <a href="#" className="text-xs font-inter tracking-widest text-slate-500 hover:text-emerald-400 transition-colors uppercase">Institutional</a>
          <a href="#" className="text-xs font-inter tracking-widest text-slate-500 hover:text-emerald-400 transition-colors uppercase">Support</a>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
            <Globe size={20} />
          </a>
          <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
            <Building2 size={20} />
          </a>
          <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
            <Shield size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};
