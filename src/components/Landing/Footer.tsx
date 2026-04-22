import React from 'react';
import { TrendingUp, Twitter, Linkedin, Github, Globe } from 'lucide-react';

const links = {
  Company: ['About Us', 'Blog', 'Careers', 'Press Kit'],
  Legal: ['Terms of Service', 'Privacy Policy', 'Compliance', 'Licenses'],
  Support: ['Help Center', 'Contact Us', 'System Status', 'Bug Report'],
};

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Globe, href: '#', label: 'Website' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-nexus-bg" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                Nexus<span className="text-gradient">Capital</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Institutional-grade investment platform delivering consistent daily returns
              through AI-powered algorithmic trading strategies.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-white text-xs font-black uppercase tracking-widest">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-slate-600 text-xs">
            © 2025 NexusCapital. All rights reserved.
          </p>
          <p className="text-slate-700 text-xs max-w-lg text-right">
            Investment involves risk. Past performance is not indicative of future results.
            Please read our{' '}
            <a href="#" className="text-slate-500 hover:text-slate-400 underline underline-offset-2">
              Risk Disclosure
            </a>{' '}
            before investing.
          </p>
        </div>
      </div>
    </footer>
  );
};
