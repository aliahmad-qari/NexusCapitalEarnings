import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, ChevronRight } from 'lucide-react';

const calcPlans = [
  { name: 'Starter', rate: 1.5, duration: 30 },
  { name: 'Silver',  rate: 2.8, duration: 60 },
  { name: 'Gold',    rate: 4.2, duration: 90 },
  { name: 'VIP',     rate: 6.5, duration: 180 },
];

const fmt = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const ROICalculator = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(10000);
  const [planIdx, setPlanIdx] = useState(2); // Gold default

  const plan = calcPlans[planIdx];

  const daily   = useMemo(() => (amount * plan.rate) / 100, [amount, plan]);
  const monthly = useMemo(() => daily * 30, [daily]);
  const total   = useMemo(() => daily * plan.duration, [daily, plan]);
  const totalReturn = useMemo(() => amount + total, [amount, total]);

  const sliderMax = 500000;

  return (
    <section id="calculator" className="py-28 px-5 sm:px-10 bg-surface-container-low/30">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-nexus-primary text-xs font-semibold uppercase tracking-widest mb-4">
            ROI Estimator
          </p>
          <h2 className="text-headline-lg font-headline-lg text-white mb-4">
            Calculate Your Returns
          </h2>
          <p className="text-slate-400 text-body-md max-w-xl mx-auto">
            Estimate how much you could earn based on your investment amount and selected plan.
          </p>
        </div>

        <div className="glass-card inner-glow-top rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Inputs */}
            <div className="space-y-8">
              {/* Amount input */}
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                    Investment Amount
                  </label>
                  <span className="text-nexus-primary text-2xl font-black tracking-tight">
                    {fmt(amount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={sliderMax}
                  step={500}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00F5A0 ${(amount / sliderMax) * 100}%, rgba(255,255,255,0.08) ${(amount / sliderMax) * 100}%)`,
                  }}
                />
                <div className="flex justify-between text-slate-600 text-xs mt-2">
                  <span>$500</span>
                  <span>$500K</span>
                </div>
              </div>

              {/* Manual amount input */}
              <div>
                <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider block mb-3">
                  Or Enter Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min={500}
                    value={amount}
                    onChange={(e) => setAmount(Math.min(Number(e.target.value), sliderMax))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3.5 text-white font-bold focus:outline-none focus:border-nexus-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Plan selector */}
              <div>
                <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider block mb-3">
                  Select Plan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {calcPlans.map((p, i) => (
                    <button
                      key={p.name}
                      onClick={() => setPlanIdx(i)}
                      className={`p-3 rounded-xl border text-sm font-semibold text-left transition-all ${
                        planIdx === i
                          ? 'border-nexus-primary/40 bg-nexus-primary/10 text-nexus-primary'
                          : 'border-white/8 text-slate-400 hover:border-white/15 hover:text-white'
                      }`}
                    >
                      <span className="font-bold">{p.name}</span>
                      <span className="text-xs ml-2 opacity-70">{p.rate}%/day</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                {[
                  { label: 'Daily Return', value: fmt(daily), color: 'text-white', sub: `at ${plan.rate}% per day` },
                  { label: 'Monthly Return', value: fmt(monthly), color: 'text-nexus-secondary', sub: '30-day estimate' },
                  { label: `Total Return (${plan.duration} days)`, value: fmt(total), color: 'text-nexus-primary', sub: `${plan.duration}-day ${plan.name} plan` },
                ].map(({ label, value, color, sub }) => (
                  <div key={label} className="bg-white/4 rounded-2xl p-5 border border-white/6">
                    <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-2">{label}</p>
                    <p className={`text-3xl font-black tracking-tight ${color}`}>{value}</p>
                    <p className="text-slate-600 text-xs mt-1">{sub}</p>
                  </div>
                ))}

                {/* Total portfolio value */}
                <div className="bg-nexus-primary/8 border border-nexus-primary/20 rounded-2xl p-5">
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">
                    Portfolio at Maturity
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-nexus-primary" />
                    <p className="text-white text-3xl font-black tracking-tight">{fmt(totalReturn)}</p>
                  </div>
                  <p className="text-nexus-primary text-xs mt-1 font-semibold">
                    +{((total / amount) * 100).toFixed(1)}% total gain
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/register')}
                className="mt-6 w-full primary-gradient text-nexus-bg font-bold py-4 rounded-xl shadow-lg shadow-nexus-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Calculator size={16} />
                Start Earning Now
                <ChevronRight size={16} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          Projections are estimates based on plan rates and do not guarantee actual returns.
        </p>
      </div>
    </section>
  );
};
