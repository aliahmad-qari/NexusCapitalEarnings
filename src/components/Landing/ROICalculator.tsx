import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, ChevronRight, DollarSign, Zap, Target, Award } from 'lucide-react';

const calcPlans = [
  { name: 'Starter', rate: 1.5, duration: 30, icon: Zap },
  { name: 'Silver',  rate: 2.8, duration: 60, icon: Target },
  { name: 'Gold',    rate: 4.2, duration: 90, icon: Award },
  { name: 'VIP',     rate: 6.5, duration: 180, icon: TrendingUp },
];

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(2)}M`
    : `${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const ROICalculator = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(10000);
  const [planIdx, setPlanIdx] = useState(2);

  const plan = calcPlans[planIdx];
  const daily   = useMemo(() => (amount * plan.rate) / 100, [amount, plan]);
  const monthly = useMemo(() => daily * 30, [daily]);
  const total   = useMemo(() => daily * plan.duration, [daily, plan]);
  const totalReturn = useMemo(() => amount + total, [amount, total]);

  const sliderMax = 500000;

  return (
    <section id="calculator" className="py-12 md:py-20 px-3 sm:px-6 lg:px-8 bg-surface-container-low/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-nexus-primary text-xs font-semibold uppercase tracking-widest mb-2">
            ROI Estimator
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3">
            Calculate Your Returns
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
            Estimate your earnings based on investment and plan selection
          </p>
        </div>

        <div className="nexus-card rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
            {/* Inputs */}
            <div className="space-y-4 md:space-y-6">
              {/* Amount input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-slate-400 text-xs md:text-sm font-semibold uppercase tracking-wider">
                    Investment
                  </label>
                  <span className="text-nexus-primary text-base md:text-xl font-bold">
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
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8B5CF6 ${(amount / sliderMax) * 100}%, rgba(255,255,255,0.08) ${(amount / sliderMax) * 100}%)`,
                  }}
                />
                <div className="flex justify-between text-slate-600 text-xs mt-1.5">
                  <span>$500</span>
                  <span>$500K</span>
                </div>
              </div>

              {/* Manual amount input */}
              <div>
                <label className="text-slate-400 text-xs md:text-sm font-semibold uppercase tracking-wider block mb-1.5">
                  Enter Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="number"
                    min={500}
                    value={amount}
                    onChange={(e) => setAmount(Math.min(Number(e.target.value), sliderMax))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 md:pl-10 pr-3 py-2 md:py-2.5 text-xs md:text-sm text-white font-semibold focus:outline-none focus:border-nexus-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Plan selector */}
              <div>
                <label className="text-slate-400 text-xs md:text-sm font-semibold uppercase tracking-wider block mb-2">
                  Plans
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {calcPlans.map((p, i) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.name}
                        onClick={() => setPlanIdx(i)}
                        className={`p-2 md:p-2.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          planIdx === i
                            ? 'border-nexus-primary/40 bg-nexus-primary/15 text-nexus-primary'
                            : 'border-white/8 text-slate-400 hover:border-white/15 hover:text-white'
                        }`}
                      >
                        <Icon size={14} className="md:w-4 md:h-4" />
                        <div className="text-left">
                          <div>{p.name}</div>
                          <div className="text-[9px] opacity-70">{p.rate}%</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-between">
              <div className="space-y-2.5 md:space-y-3">
                {[
                  { label: 'Daily', value: fmt(daily), color: 'text-white', sub: `${plan.rate}%/day`, icon: Zap },
                  { label: 'Monthly', value: fmt(monthly), color: 'text-nexus-secondary', sub: '30-day', icon: Target },
                  { label: `Total (${plan.duration}d)`, value: fmt(total), color: 'text-nexus-primary', sub: `${plan.name}`, icon: Award },
                ].map(({ label, value, color, sub, icon: Icon }) => (
                  <div key={label} className="bg-white/4 rounded-lg md:rounded-xl p-2.5 md:p-3 border border-white/6 flex items-start gap-2 md:gap-3">
                    <div className="p-1 md:p-1.5 bg-white/8 rounded-md md:rounded-lg shrink-0">
                      <Icon size={14} className="text-nexus-primary md:w-4 md:h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-500 text-[9px] md:text-xs uppercase tracking-wider font-semibold">{label}</p>
                      <p className={`text-sm md:text-lg font-bold tracking-tight ${color} truncate`}>{value}</p>
                      <p className="text-slate-600 text-[8px] md:text-xs mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}

                {/* Total portfolio value */}
                <div className="bg-nexus-primary/12 border border-nexus-primary/20 rounded-lg md:rounded-xl p-2.5 md:p-3 mt-1">
                  <p className="text-slate-400 text-[9px] md:text-xs uppercase tracking-wider font-semibold mb-1">
                    Final Value
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="p-1 md:p-1.5 bg-nexus-primary/20 rounded-md md:rounded-lg shrink-0">
                      <TrendingUp size={14} className="text-nexus-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm md:text-lg font-bold tracking-tight truncate">{fmt(totalReturn)}</p>
                      <p className="text-nexus-primary text-[8px] md:text-xs font-semibold">
                        +{((total / amount) * 100).toFixed(1)}% gain
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/register')}
                className="mt-3 md:mt-4 w-full gradient-primary text-slate-900 font-bold py-2 md:py-2.5 lg:py-3 rounded-lg md:rounded-xl shadow-lg shadow-nexus-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm"
              >
                <Calculator size={14} className="md:w-5 md:h-5" />
                Start Earning
                <ChevronRight size={14} className="md:w-5 md:h-5" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-[10px] md:text-xs mt-4 md:mt-6 px-2">
          Estimates based on plan rates. Returns not guaranteed.
        </p>
      </div>
    </section>
  );
};
