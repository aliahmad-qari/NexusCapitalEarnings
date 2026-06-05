import { useEffect, useState, useMemo } from 'react';
import { 
  TrendingUp, ShieldCheck, Zap, Star, X, Award, Plus, 
  ArrowUpRight, Info, Calculator, CheckCircle2, Filter, 
  BarChart2, Layers, Globe, Clock, Cpu, Lock, Wallet, Headphones, 
  Flame, Gem, Crown, Rocket, Search
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { motion, AnimatePresence } from 'motion/react';

export const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [investing, setInvesting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [comparingPlans, setComparingPlans] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [filterRisk, setFilterRisk] = useState('all');
  const [calcPlanId, setCalcPlanId] = useState('');
  const [calcAmountStr, setCalcAmountStr] = useState('1000');
  const [calcResults, setCalcResults] = useState({ dailyProfit: 0, totalProfit: 0, totalReturn: 0 });
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    if (plans.length > 0 && !calcPlanId) {
      const defaultPlan = plans[0];
      setCalcPlanId(defaultPlan._id);
      setCalcResults(calculateROI(defaultPlan, 1000));
    }
  }, [plans]);

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/investment/plans`);
      const data = await res.json();
      setPlans(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const calculateROI = (plan: any, amount: number) => {
    const dailyProfit = (amount * (plan.dailyProfitPercent || 0)) / 100;
    const totalProfit = dailyProfit * (plan.durationDays || 0);
    return { dailyProfit, totalProfit, totalReturn: amount + totalProfit };
  };

  const handleCalculate = () => {
    const plan = plans.find((p: any) => p._id === calcPlanId);
    if (plan) setCalcResults(calculateROI(plan, Number(calcAmountStr) || 0));
  };

  const featureIconMapping = (feature: string) => {
    const f = feature.toLowerCase();
    if (f.includes('profit') || f.includes('yield') || f.includes('return')) return <TrendingUp size={12} />;
    if (f.includes('support') || f.includes('chat')) return <Headphones size={12} />;
    if (f.includes('lock') || f.includes('secure') || f.includes('audit')) return <Lock size={12} />;
    if (f.includes('fee')) return <Wallet size={12} />;
    if (f.includes('instant') || f.includes('fast')) return <Zap size={12} />;
    if (f.includes('global') || f.includes('access')) return <Globe size={12} />;
    if (f.includes('ai') || f.includes('bot') || f.includes('algo')) return <Cpu size={12} />;
    if (f.includes('duration') || f.includes('day')) return <Clock size={12} />;
    return <CheckCircle2 size={12} />;
  };

  const planMapping = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('starter')) return { risk: 'Low', icon: Rocket, color: 'text-nexus-primary' };
    if (lowerName.includes('silver')) return { risk: 'Low', badge: 'Recommended', icon: Star, color: 'text-nexus-primary' };
    if (lowerName.includes('gold')) return { risk: 'Medium', badge: 'Most Popular', icon: Flame, color: 'text-nexus-gold', featured: true };
    if (lowerName.includes('platinum')) return { risk: 'Medium', badge: 'Premium', icon: Gem, color: 'text-nexus-primary' };
    if (lowerName.includes('vip')) return { risk: 'High', badge: 'Elite', icon: Crown, color: 'text-nexus-magenta', featured: true };
    return { risk: 'Medium', badge: '', icon: Zap, color: 'text-nexus-primary' };
  };

  const processedPlans = useMemo(() => {
    let filtered = [...plans].map(p => ({ ...p, ...planMapping(p.name) }));
    if (filterRisk !== 'all') filtered = filtered.filter(p => p.risk === filterRisk);
    if (sortBy === 'min_investment') filtered.sort((a, b) => a.minInvestment - b.minInvestment);
    else if (sortBy === 'return') filtered.sort((a, b) => b.dailyProfitPercent - a.dailyProfitPercent);
    else if (sortBy === 'risk') { const o: any = { Low: 1, Medium: 2, High: 3 }; filtered.sort((a, b) => o[a.risk] - o[b.risk]); }
    return filtered;
  }, [plans, sortBy, filterRisk]);

  const openPlanDetails = (plan: any) => { setSelectedPlan(plan); setAmount(plan.minInvestment.toString()); setIsModalOpen(true); };

  const handleInvestInitiate = () => {
    const investAmount = Number(amount);
    if (!amount || investAmount < selectedPlan.minInvestment) { alert(`Minimum investment is $${selectedPlan.minInvestment}`); return; }
    if (investAmount > selectedPlan.maxInvestment) { alert(`Maximum investment is $${selectedPlan.maxInvestment}`); return; }
    setIsConfirmOpen(true);
  };

  const handleInvestConfirm = async () => {
    setIsConfirmOpen(false);
    setInvesting(true);
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/investment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planId: selectedPlan._id, amount: Number(amount) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert('Investment successful!');
      refreshUser();
      setAmount('');
      setIsModalOpen(false);
    } catch (err: any) { alert(err.message); } finally { setInvesting(false); }
  };

  const toggleCompare = (planId: string) => {
    if (comparingPlans.includes(planId)) { setComparingPlans(comparingPlans.filter(id => id !== planId)); }
    else { if (comparingPlans.length >= 3) return; setComparingPlans([...comparingPlans, planId]); }
  };

  const plansToCompare = plans.filter(p => comparingPlans.includes(p._id));

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-nexus-primary/10 border-t-nexus-primary rounded-full animate-spin"></div>
      <p className="text-nexus-primary/50 text-xs font-medium">Loading investment plans...</p>
    </div>
  );

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-6 pb-16 max-w-[1700px] mx-auto space-y-8 text-slate-200 selection:bg-nexus-primary/20 selection:text-nexus-primary">
      
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-nexus-primary">
            <BarChart2 size={14} className="animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Investment Plans</span>
          </div>
          <h2 className="text-xl font-bold text-white">Strategy Matrix</h2>
          <p className="text-slate-500 text-xs max-w-xl">Choose from AI-driven investment strategies tailored to different risk levels and capital amounts.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {comparingPlans.length > 0 && (
            <button onClick={() => setIsCompareOpen(true)} className="gradient-primary px-4 py-2 rounded-xl text-xs font-semibold text-slate-900 shadow-lg flex items-center gap-2">
              <Layers size={13} /> Compare ({comparingPlans.length})
            </button>
          )}
          <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl border-white/5">
            <Filter size={12} className="text-slate-500" />
            <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)} className="bg-transparent outline-none text-xs font-medium text-slate-300 pr-1">
              <option value="all">All Risks</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
          <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl border-white/5">
            <TrendingUp size={12} className="text-slate-500" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent outline-none text-xs font-medium text-slate-300 pr-1">
              <option value="default">Sort By</option>
              <option value="min_investment">Min Investment</option>
              <option value="return">Highest Return</option>
              <option value="risk">Risk Level</option>
            </select>
          </div>
        </div>
      </header>

      {/* ROI Calculator */}
      <section className="nexus-card rounded-2xl p-6 md:p-8 border-white/8 bg-gradient-to-tr from-nexus-primary/[0.02] to-transparent shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2.5 rounded-xl glass border-nexus-primary/20 text-nexus-primary">
            <Calculator size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">ROI Calculator</h3>
            <p className="text-[10px] text-slate-600">Estimate your returns before investing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-end">
          <div className="xl:col-span-3 space-y-2">
            <label className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Select Plan</label>
            <div className="glass p-3 rounded-xl border-white/5 bg-black/40">
              <select className="w-full bg-transparent outline-none text-xs font-medium text-slate-300" onChange={(e) => setCalcPlanId(e.target.value)} value={calcPlanId}>
                {plans.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div className="xl:col-span-3 space-y-2">
            <label className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Amount ($)</label>
            <div className="flex gap-3">
              <div className="flex-1 glass p-3 rounded-xl border-white/5 bg-black/40 flex items-center">
                <span className="text-nexus-primary opacity-40 font-bold text-sm mr-2">$</span>
                <input type="number" placeholder="0.00" value={calcAmountStr} onChange={(e) => setCalcAmountStr(e.target.value)} className="w-full bg-transparent outline-none text-sm font-bold text-white" />
              </div>
              <button onClick={handleCalculate} className="w-11 h-11 gradient-primary text-slate-900 rounded-xl flex items-center justify-center hover:scale-[1.05] active:scale-95 transition-all shadow-lg">
                <TrendingUp size={16} />
              </button>
            </div>
          </div>

          <div className="xl:col-span-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Daily Profit', value: calcResults.dailyProfit },
                { label: 'Total Profit', value: calcResults.totalProfit },
                { label: 'Total Return', value: calcResults.totalReturn, highlight: true }
              ].map((res, i) => (
                <div key={i} className={`p-4 glass rounded-xl border-white/5 flex flex-col justify-end min-h-[80px] ${res.highlight ? 'ring-1 ring-nexus-primary/20' : ''}`}>
                  <p className="text-[10px] text-slate-600 font-medium mb-1">{res.label}</p>
                  <p className={`text-sm font-bold ${res.highlight ? 'text-nexus-primary' : 'text-white'}`}>+${res.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {processedPlans.map((plan: any, idx: number) => {
          const PlanIcon = plan.icon || Zap;
          return (
            <motion.div key={plan._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }} whileHover={{ y: -6 }}
              className={`nexus-card group relative p-0 overflow-hidden border-white/5 ${plan.featured ? 'border-nexus-primary/20' : ''}`}>
              
              {/* Compare */}
              <div className="absolute top-4 left-4 z-20">
                <button onClick={() => toggleCompare(plan._id)}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${comparingPlans.includes(plan._id) ? 'bg-nexus-primary border-nexus-primary text-slate-950' : 'bg-white/5 border-white/10 text-slate-600 hover:text-white'}`}>
                  <Layers size={13} />
                </button>
              </div>

              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-4 right-4 z-20">
                  <div className={`px-3 py-1 rounded-xl border text-[10px] font-semibold flex items-center gap-1.5 ${plan.badge === 'Most Popular' ? 'bg-nexus-gold/10 text-nexus-gold border-nexus-gold/20' : plan.badge === 'Elite' ? 'bg-nexus-magenta/10 text-nexus-magenta border-nexus-magenta/20' : 'bg-nexus-primary/10 text-nexus-primary border-nexus-primary/20'}`}>
                    <Award size={11} /> {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-3 pt-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-110 ${plan.color === 'text-nexus-gold' ? 'bg-nexus-gold/10 text-nexus-gold border-nexus-gold/20' : plan.color === 'text-nexus-magenta' ? 'bg-nexus-magenta/10 text-nexus-magenta border-nexus-magenta/20' : 'bg-nexus-primary/10 text-nexus-primary border-nexus-primary/20'}`}>
                    <PlanIcon size={26} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{plan.name}</h3>
                    <div className={`inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full glass border-white/5 ${plan.risk === 'Low' ? 'text-nexus-primary' : plan.risk === 'Medium' ? 'text-nexus-gold' : 'text-nexus-magenta'}`}>
                      <Info size={10} />
                      <span className="text-[10px] font-medium">{plan.risk} Risk</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                  <div className="text-center space-y-0.5">
                    <p className="text-[10px] text-slate-600 font-medium">Daily Yield</p>
                    <p className="text-lg font-bold text-white">{plan.dailyProfitPercent}<span className="text-nexus-primary text-sm">%</span></p>
                  </div>
                  <div className="text-center space-y-0.5">
                    <p className="text-[10px] text-slate-600 font-medium">Duration</p>
                    <p className="text-lg font-bold text-white">{plan.durationDays}<span className="text-slate-500 text-sm"> days</span></p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {plan.features.slice(0, 4).map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 glass border-white/5 rounded-xl">
                      <div className="p-1.5 rounded-lg bg-white/5 text-nexus-primary">{featureIconMapping(f)}</div>
                      <span className="text-[11px] font-medium text-slate-400">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-1 space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <div>
                      <p className="text-[10px] text-slate-600 font-medium">Min Investment</p>
                      <p className="text-sm font-bold text-white">${plan.minInvestment.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-600 font-medium">Max Investment</p>
                      <p className="text-xs font-semibold text-slate-400">${plan.maxInvestment >= 1000000 ? 'Unlimited' : plan.maxInvestment.toLocaleString()}</p>
                    </div>
                  </div>
                  <button onClick={() => openPlanDetails(plan)}
                    className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-xs transition-all hover:scale-[1.02] active:scale-95 ${plan.featured ? 'gradient-primary text-slate-900 shadow-nexus-primary/20' : 'glass border-white/10 text-white hover:border-nexus-primary/40'}`}>
                    Invest Now <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Compare Modal */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCompareOpen(false)} className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="action-island w-full max-w-5xl p-7 md:p-10 border-white/10 relative z-10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-lg font-bold text-white">Compare Plans</h2>
                  <p className="text-[10px] text-slate-600 mt-0.5">Side-by-side performance comparison</p>
                </div>
                <button onClick={() => setIsCompareOpen(false)} className="w-9 h-9 bg-white/5 rounded-xl hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-white/5 flex items-center justify-center"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {plansToCompare.map(plan => {
                  const meta = planMapping(plan.name);
                  const Icon = meta.icon;
                  return (
                    <div key={plan._id} className="nexus-card p-6 border-white/5 space-y-5 relative">
                      <button onClick={() => toggleCompare(plan._id)} className="absolute top-3 right-3 p-1.5 bg-white/5 rounded-lg text-slate-700 hover:text-rose-500 transition-all"><X size={14} /></button>
                      <div className="flex items-center gap-3 pt-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${meta.color === 'text-nexus-gold' ? 'bg-nexus-gold/10 border-nexus-gold/20 text-nexus-gold' : meta.color === 'text-nexus-magenta' ? 'bg-nexus-magenta/10 border-nexus-magenta/20 text-nexus-magenta' : 'bg-nexus-primary/10 border-nexus-primary/20 text-nexus-primary'}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{plan.name}</h3>
                          <p className={`text-[10px] font-medium ${meta.risk === 'Low' ? 'text-nexus-primary' : meta.risk === 'Medium' ? 'text-nexus-gold' : 'text-nexus-magenta'}`}>{meta.risk} Risk</p>
                        </div>
                      </div>
                      <div className="space-y-3 pt-3 border-t border-white/5">
                        {[
                          { label: 'Daily Yield', value: `${plan.dailyProfitPercent}%`, color: 'text-nexus-primary' },
                          { label: 'Duration', value: `${plan.durationDays} days` },
                          { label: 'Min Investment', value: `$${plan.minInvestment.toLocaleString()}` },
                          { label: 'Max Investment', value: `$${plan.maxInvestment.toLocaleString()}` },
                        ].map(row => (
                          <div key={row.label} className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-600 font-medium">{row.label}</span>
                            <span className={`text-xs font-bold ${row.color || 'text-white'}`}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1.5 pt-3 border-t border-white/5">
                        {plan.features.slice(0, 3).map((f: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-[10px] text-slate-500">
                            <div className="w-1 h-1 rounded-full bg-nexus-primary/40" /> {f}
                          </div>
                        ))}
                      </div>
                      <button onClick={() => { setIsCompareOpen(false); openPlanDetails(plan); }} className="w-full py-2.5 gradient-primary rounded-xl text-xs font-semibold text-slate-900">Invest Now</button>
                    </div>
                  );
                })}
                {plansToCompare.length < 3 && (
                  <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-white/5 rounded-2xl text-slate-800">
                    <Plus size={28} className="opacity-20 mb-3" />
                    <p className="text-[10px] font-medium text-center">Add another plan to compare</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Plan Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPlan && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }} className="action-island w-full max-w-3xl p-0 border-white/10 relative z-10 shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Info */}
                <div className="lg:col-span-5 p-7 space-y-5 bg-white/[0.01] border-r border-white/5">
                  <div>
                    <p className="text-[10px] text-nexus-primary font-semibold uppercase tracking-widest mb-2">Plan Details</p>
                    <h1 className="text-xl font-bold text-white mb-1">{selectedPlan.name}</h1>
                    <p className="text-[10px] text-slate-600">{selectedPlan.dailyProfitPercent}% daily yield · {selectedPlan.durationDays} days duration</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wider">Features</p>
                    {selectedPlan.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-nexus-primary/5 flex items-center justify-center text-nexus-primary border border-white/5">{featureIconMapping(feature)}</div>
                        <span className="text-xs text-slate-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-600 mb-1">Risk Level</p>
                      <p className="text-sm font-bold text-nexus-primary">{planMapping(selectedPlan.name).risk}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-600 mb-1">Daily Return</p>
                      <p className="text-sm font-bold text-white">{selectedPlan.dailyProfitPercent}%</p>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="lg:col-span-7 p-7 flex flex-col justify-between">
                  <div className="flex justify-end mb-4">
                    <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-600 hover:text-white transition-all border-white/5"><X size={18} /></button>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wider">Investment Amount ($)</p>
                        <p className="text-[10px] text-slate-500">Balance: <span className="text-nexus-primary font-semibold">${user?.wallet.totalBalance.toLocaleString()}</span></p>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center focus-within:border-nexus-primary/20 transition-all">
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-transparent text-center text-4xl font-bold outline-none w-full text-white placeholder:text-white/5" placeholder="0.00" autoFocus />
                        <div className="w-3/4 h-px bg-white/5 my-4" />
                        <p className="text-[10px] text-slate-700">Range: ${selectedPlan.minInvestment} – {selectedPlan.maxInvestment >= 1000000 ? 'Unlimited' : `$${selectedPlan.maxInvestment}`}</p>
                      </div>
                    </div>
                    <button onClick={handleInvestInitiate} className="w-full py-4 gradient-primary text-slate-900 font-semibold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-nexus-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm">
                      Confirm Investment <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmOpen && selectedPlan && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" />
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} className="relative nexus-card w-full max-w-sm p-8 border-nexus-primary/40 bg-black/60 text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 bg-nexus-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-nexus-primary/20">
                <ShieldCheck size={32} className="text-nexus-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Confirm Investment</h3>
                <p className="text-[10px] text-slate-600">Review details before proceeding</p>
              </div>
              <div className="nexus-card p-5 border-white/5 space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Plan</span>
                  <span className="text-xs font-semibold text-white">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">Amount</span>
                  <span className="text-sm font-bold text-nexus-primary">${Number(amount).toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Daily Profit</span>
                    <span className="text-xs font-semibold text-nexus-primary">+${calculateROI(selectedPlan, Number(amount)).dailyProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Total Profit</span>
                    <span className="text-xs font-semibold text-white">+${calculateROI(selectedPlan, Number(amount)).totalProfit.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2.5">
                <button onClick={handleInvestConfirm} disabled={investing} className="w-full py-3 gradient-primary text-slate-900 font-semibold rounded-xl shadow-lg text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                  {investing ? 'Processing...' : 'Confirm & Invest'}
                </button>
                <button onClick={() => setIsConfirmOpen(false)} className="w-full py-2.5 text-xs font-medium text-slate-600 hover:text-white transition-colors">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
