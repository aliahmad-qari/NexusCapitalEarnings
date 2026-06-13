import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Usman T.',
    location: 'Karachi, PK',
    avatar: 'https://i.pravatar.cc/80?u=usman-t',
    plan: 'Gold Plan',
    quote: "I've been investing with Nexus Capital for 3 months and the consistency of daily payouts is unmatched. My Gold plan has returned over 170% of my initial investment.",
    earned: 'PKR 35,000',
    rating: 5,
  },
  {
    name: 'Ayesha S.',
    location: 'Lahore, PK',
    avatar: 'https://i.pravatar.cc/80?u=ayesha-s',
    plan: 'Diamond Plan',
    quote: "Started with the Diamond plan and the platform is transparent, withdrawals process quickly, and the support team responds within minutes. Highly recommended.",
    earned: 'PKR 70,000',
    rating: 5,
  },
  {
    name: 'Bilal O.',
    location: 'Islamabad, PK',
    avatar: 'https://i.pravatar.cc/80?u=bilal-o',
    plan: 'Silver Plan',
    quote: "Started with the Silver plan 2 months ago. Simple interface, daily profits credited automatically, and I've already referred 3 friends who love it too.",
    earned: 'PKR 21,000',
    rating: 5,
  },
];

  export const Testimonials = () => {
    return (
      <section className="py-28 px-5 sm:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <p className="text-nexus-primary text-xs font-semibold uppercase tracking-widest mb-4">
              Investor Stories
            </p>
            <h2 className="text-headline-lg font-headline-lg text-white mb-4">
              What Our Investors Say
            </h2>
            <p className="text-slate-400 text-body-md max-w-xl mx-auto">
              Join 12,000+ investors who trust ROI with their financial future.
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, location, avatar, plan, quote, earned, rating }) => (
            <div key={name} className="glass-card inner-glow-top rounded-2xl p-7 flex flex-col gap-5 hover:border-white/12 transition-all duration-300">
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-nexus-gold fill-nexus-gold" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-300 text-sm leading-relaxed flex-grow">
                "{quote}"
              </p>

              {/* Earnings badge */}
              <div className="flex items-center gap-2 bg-nexus-primary/8 border border-nexus-primary/15 rounded-xl px-3.5 py-2.5">
                <span className="text-slate-400 text-xs">Total earned:</span>
                <span className="text-nexus-primary text-sm font-bold">{earned}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-1 border-t border-white/6">
                <img
                  src={avatar}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <p className="text-white text-sm font-bold">{name}</p>
                  <p className="text-slate-500 text-xs">{location} · {plan}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
