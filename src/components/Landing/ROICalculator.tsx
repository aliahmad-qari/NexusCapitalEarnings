import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, ChevronRight, Zap, Target, Award, Sparkles } from 'lucide-react';
import { formatPKR } from '../../utils/currency.ts';

const calcPlans = [
  { name: 'Starter', amount: 300, dailyROI: 10, duration: 7, icon: Zap },
  { name: 'Bronze', amount: 1000, dailyROI: 10, duration: 7, icon: Target },
  { name: 'Silver', amount: 3000, dailyROI: 10, duration: 7, icon: Award },
  { name: 'Gold', amount: 5000, dailyROI: 10, duration: 7, icon: Sparkles },
  { name: 'Diamond', amount: 10000, dailyROI: 10, duration: 7, icon: TrendingUp },
];

export const ROICalculator = () => {
  const navigate = useNavigate();
  const [planIdx, setPlanIdx] = useState(2); // Default to Silver
  const [customAmount, setCustomAmount] = useState(false);
  const [customInputAmount, setCustomInputAmount] = useState('3000');

  const plan = calcPlans[planIdx];
  const investmentAmount = customAmount ? Number(customInputAmount) || plan.amount : plan.amount;
  
  const daily = useMemo(() => (investmentAmount * plan.dailyROI) / 100, [investmentAmount, plan]);
  const totalProfit = useMemo(() => daily * plan.duration, [daily, plan]);
  const totalReturn = useMemo(() => investmentAmount + totalProfit, [investmentAmount, totalProfit]);

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
            Estimate your earnings based on 10% daily ROI for 7 days
          </p>
        </div>

        <div className="nexus-card rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
            {/* Inputs */}
            <div className="space-y-4 md:space-y-6">
              {/* Plan selector */}
              <div>
                <label className="text-slate-400 text-xs md:text-sm font-semibold uppercase tracking-wider block mb-2">
                  Investment Plans
                </label>
                <div className="space-y-2">
                  {calcPlans.map((p, i) => {
                    const Icon = p.icon;
                    const dailyProfit = (p.amount * p.dailyROI) / 100;
                    const totalProfit7Days = dailyProfit * p.duration;
                    return (
                      <button
                        key={p.name}
                        onClick={() => {
                          setPlanIdx(i);
                          setCustomAmount(false);
                        }}
                        className={`w-full p-3 md:p-4 rounded-lg border text-left transition-all flex items-start justify-between ${
                          planIdx === i && !customAmount
                            ? 'border-nexus-primary/40 bg-nexus-primary/15'
                            : 'border-white/8 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                          <div className={`p-2 md:p-2.5 rounded-lg shrink-0 ${planIdx === i && !customAmount ? 'bg-nexus-primary/25' : 'bg-white/8'}`}>
                            <Icon size={16} className="text-nexus-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs md:text-sm font-bold ${planIdx === i && !customAmount ? 'text-white' : 'text-slate-300'}`}>
                              {p.name} Plan
                            </p>
                            <p className={`text-[9px] md:text-xs ${planIdx === i && !customAmount ? 'text-nexus-primary' : 'text-slate-500'}`}>
                              {formatPKR(p.amount)} • +{formatPKR(Math.round(totalProfit7Days))} in 7 days
                            </p>
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <p className={`text-xs md:text-sm font-bold ${planIdx === i && !customAmount ? 'text-nexus-primary' : 'text-slate-400'}`}>
                            {formatPKR(p.amount + totalProfit7Days)}
                          </p>
                          <p className="text-[8px] md:text-[9px] text-slate-600">total</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom amount toggle */}
              <div>
                <label className="text-slate-400 text-xs md:text-sm font-semibold uppercase tracking-wider block mb-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={customAmount}
                    onChange={(e) => setCustomAmount(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20"
                  />
                  Custom Amount
                </label>
                {customAmount && (
                  <div className="relative">
                    <span className="text-nexus-primary text-xs md:text-sm font-bold absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2">PKR</span>
                    <input
                      type="number"
                      value={customInputAmount}
                      onChange={(e) => setCustomInputAmount(e.target.value)}
                      className="w-full bg-white/5 border border-nexus-primary/30 rounded-lg pl-12 pr-3 py-2 md:py-2.5 text-xs md:text-sm text-white font-semibold focus:outline-none focus:border-nexus-primary/50 transition-colors"
                      placeholder="Enter amount in PKR"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-between">
              <div className="space-y-2.5 md:space-y-3">
                {[
                  { label: 'Investment', value: formatPKR(investmentAmount), color: 'text-slate-300', icon: Zap },
                  { label: 'Daily ROI (10%)', value: formatPKR(Math.round(daily)), color: 'text-cyan-400', icon: Target },
                  { label: `Total Profit (7 days)`, value: formatPKR(Math.round(totalProfit)), color: 'text-nexus-primary', icon: Award },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className="bg-white/4 rounded-lg md:rounded-xl p-2.5 md:p-3 border border-white/6 flex items-start gap-2 md:gap-3">
                    <div className="p-1 md:p-1.5 bg-white/8 rounded-md md:rounded-lg shrink-0">
                      <Icon size={14} className="text-nexus-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-500 text-[9px] md:text-xs uppercase tracking-wider font-semibold">{label}</p>
                      <p className={`text-sm md:text-lg font-bold tracking-tight ${color} truncate`}>{value}</p>
                    </div>
                  </div>
                ))}

                {/* Total return */}
                <div className="bg-nexus-primary/12 border border-nexus-primary/20 rounded-lg md:rounded-xl p-2.5 md:p-3 mt-1">
                  <p className="text-slate-400 text-[9px] md:text-xs uppercase tracking-wider font-semibold mb-1">
                    Total Return (Principal + Profit)
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="p-1 md:p-1.5 bg-nexus-primary/20 rounded-md md:rounded-lg shrink-0">
                      <TrendingUp size={14} className="text-nexus-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm md:text-lg font-bold tracking-tight truncate">{formatPKR(Math.round(totalReturn))}</p>
                      <p className="text-nexus-primary text-[8px] md:text-xs font-semibold">
                        +{((totalProfit / investmentAmount) * 100).toFixed(0)}% total gain
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
                Start Earning Now
                <ChevronRight size={14} className="md:w-5 md:h-5" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-[10px] md:text-xs mt-4 md:mt-6 px-2">
          All amounts in PKR. Fixed 10% daily ROI for 7-day investment period. Principal returned after completion.
        </p>
      </div>
    </section>
  );
};
