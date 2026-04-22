import { useEffect, useState, useMemo } from 'react';
import { 
  TrendingUp, ShieldCheck, Zap, Star, X, Award, Plus, 
  ArrowUpRight, Info, Calculator, CheckCircle2, Filter, 
  ChevronDown, BarChart2, Shield, LayoutGrid, Layers,
  Globe, Clock, Cpu, Lock, Wallet, Headphones, ZapOff,
  Flame, Gem, Crown, Rocket
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
  
  // Yield Forecaster State
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

  const handleCalculate = () => {
    const plan = plans.find((p: any) => p._id === calcPlanId);
    if (plan) {
      setCalcResults(calculateROI(plan, Number(calcAmountStr) || 0));
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/investment/plans`);
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateROI = (plan: any, amount: number) => {
    const dailyProfit = (amount * (plan.dailyProfitPercent || 0)) / 100;
    const totalProfit = dailyProfit * (plan.durationDays || 0);
    const totalReturn = amount + totalProfit;
    return { dailyProfit, totalProfit, totalReturn };
  };

  const featureIconMapping = (feature: string) => {
    const f = feature.toLowerCase();
    if (f.includes('profit') || f.includes('yield') || f.includes('return')) return <TrendingUp size={14} />;
    if (f.includes('support') || f.includes('chat')) return <Headphones size={14} />;
    if (f.includes('lock') || f.includes('secure') || f.includes('audit')) return <Lock size={14} />;
    if (f.includes('fee')) return <Wallet size={14} />;
    if (f.includes('instant') || f.includes('fast')) return <Zap size={14} />;
    if (f.includes('global') || f.includes('access')) return <Globe size={14} />;
    if (f.includes('ai') || f.includes('bot') || f.includes('algo')) return <Cpu size={14} />;
    if (f.includes('duration') || f.includes('day')) return <Clock size={14} />;
    return <CheckCircle2 size={14} />;
  };

  const planMapping = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('starter')) return { risk: 'Low', icon: Rocket, color: 'nexus-primary' };
    if (lowerName.includes('silver')) return { risk: 'Low', badge: 'Recommended', icon: Star, color: 'nexus-primary' };
    if (lowerName.includes('gold')) return { risk: 'Medium', badge: 'Most Popular', icon: Flame, color: 'nexus-gold', featured: true };
    if (lowerName.includes('platinum')) return { risk: 'Medium', badge: 'Premium', icon: Gem, color: 'nexus-primary' };
    if (lowerName.includes('vip')) return { risk: 'High', badge: 'Elite', icon: Crown, color: 'nexus-magenta', featured: true };
    return { risk: 'Medium', badge: '', icon: Zap, color: 'nexus-primary' };
  };

  const processedPlans = useMemo(() => {
    let filtered = [...plans].map(p => ({
      ...p,
      ...planMapping(p.name)
    }));

    if (filterRisk !== 'all') {
      filtered = filtered.filter(p => p.risk === filterRisk);
    }

    if (sortBy === 'min_investment') {
      filtered.sort((a, b) => a.minInvestment - b.minInvestment);
    } else if (sortBy === 'return') {
      filtered.sort((a, b) => b.dailyProfitPercent - a.dailyProfitPercent);
    } else if (sortBy === 'risk') {
      const riskOrder: any = { 'Low': 1, 'Medium': 2, 'High': 3 };
      filtered.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk]);
    }

    return filtered;
  }, [plans, sortBy, filterRisk]);

  const openPlanDetails = (plan: any) => {
    setSelectedPlan(plan);
    setAmount(plan.minInvestment.toString());
    setIsModalOpen(true);
  };

  const handleInvestInitiate = () => {
    const investAmount = Number(amount);
    if (!amount || investAmount < selectedPlan.minInvestment) {
      alert(`Minimum investment is $${selectedPlan.minInvestment}`);
      return;
    }
    if (investAmount > selectedPlan.maxInvestment) {
      alert(`Maximum investment for this plan is $${selectedPlan.maxInvestment}`);
      return;
    }
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ planId: selectedPlan._id, amount: Number(amount) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert('Investment successful!');
      refreshUser();
      setAmount('');
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setInvesting(false);
    }
  };

  const toggleCompare = (planId: string) => {
    if (comparingPlans.includes(planId)) {
      setComparingPlans(comparingPlans.filter(id => id !== planId));
    } else {
      if (comparingPlans.length >= 3) return;
      setComparingPlans([...comparingPlans, planId]);
    }
  };

  const plansToCompare = plans.filter(p => comparingPlans.includes(p._id));

  if (loading) return (
    <div className="p-6 md:p-12 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-nexus-primary/20 border-t-nexus-primary rounded-full animate-spin"></div>
      <p className="mt-6 text-nexus-primary/40 font-black uppercase tracking-[0.4em] text-[10px]">Optimizing Strategy Nodes...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 pb-8 lg:pb-0 text-slate-200">
      
      {/* Top Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-nexus-primary">
              <div className="p-2 glass rounded-lg border-nexus-primary/20">
                <BarChart2 size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Grade</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">Choose Your <span className="text-gradient">Investment Strategy</span></h2>
            <p className="text-slate-500 text-sm max-w-xl font-medium">Explore proprietary AI-driven strategies tailored to different risk appetites and capital capacities.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {comparingPlans.length > 0 && (
              <button 
                onClick={() => setIsCompareOpen(true)}
                className="gradient-primary px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl"
              >
                Compare ({comparingPlans.length})
              </button>
            )}
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-2xl border-white/5">
              <Filter size={14} className="text-slate-500" />
              <select 
                value={filterRisk} 
                onChange={(e) => setFilterRisk(e.target.value)}
                className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest text-slate-300"
              >
                <option value="all">All Risks</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-2xl border-white/5">
              <TrendingUp size={14} className="text-slate-500" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest text-slate-300"
              >
                <option value="default">Sort By</option>
                <option value="min_investment">Min Stake</option>
                <option value="return">Max Return</option>
                <option value="risk">Risk Level</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Projections Calculator */}
      <section className="nexus-card rounded-[40px] p-8 md:p-12 border-white/5 bg-gradient-to-tr from-nexus-primary/[0.02] to-transparent overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Calculator size={120} className="text-white" />
        </div>
        
        <div className="relative z-10 space-y-10">
          <div className="flex items-center gap-4">
            <div className="p-3 glass rounded-2xl border-nexus-primary/20 text-nexus-primary">
              <Calculator size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tighter uppercase">Yield <span className="text-gradient">Forecaster</span></h3>
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">Strategy Projection Simulator</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-3 space-y-4">
              <label className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] px-4 font-mono">Select Strategy Node</label>
              <div className="glass p-5 rounded-2xl border-white/5 bg-black/20">
                <select 
                  className="w-full bg-transparent outline-none text-xs font-black uppercase tracking-widest text-slate-300"
                  onChange={(e) => setCalcPlanId(e.target.value)}
                  value={calcPlanId}
                >
                  <option value="" disabled>Select a plan...</option>
                  {plans.map((p: any) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <label className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] px-4 font-mono">Allocation ($)</label>
              <div className="flex gap-4">
                <div className="flex-1 glass p-5 rounded-2xl border-white/5 bg-black/20 flex items-center">
                  <span className="text-nexus-primary opacity-40 font-black mr-2">$</span>
                  <input 
                    type="number"
                    placeholder="0.00"
                    value={calcAmountStr}
                    onChange={(e) => setCalcAmountStr(e.target.value)}
                    className="w-full bg-transparent outline-none text-xl font-black tracking-tighter text-white"
                  />
                </div>
                <button 
                  onClick={handleCalculate}
                  className="px-6 gradient-primary text-slate-900 rounded-2xl hover:scale-[1.03] active:scale-95 transition-all outline-none"
                >
                  <TrendingUp size={20} />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Daily Yield', value: calcResults.dailyProfit },
                  { label: 'Total Harvesting', value: calcResults.totalProfit },
                  { label: 'Terminal Sum', value: calcResults.totalReturn, highlight: true }
                ].map((res, i) => (
                  <div key={i} className={`p-6 glass rounded-2xl border-white/5 bg-white/[0.01] flex flex-col justify-end min-h-[100px] ${res.highlight ? 'ring-1 ring-nexus-primary/20' : ''}`}>
                    <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1 leading-none">{res.label}</p>
                    <p className={`text-xl font-black tracking-tighter ${res.highlight ? 'text-nexus-primary' : 'text-white'}`}>+${res.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Vertical List (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {processedPlans.map((plan: any, idx: number) => {
          const stats = calculateROI(plan, 1000 >= plan.minInvestment && 1000 <= plan.maxInvestment ? 1000 : plan.minInvestment);
          const sampleAmount = 1000 >= plan.minInvestment && 1000 <= plan.maxInvestment ? 1000 : plan.minInvestment;
          const PlanIcon = plan.icon || Zap;
          
          return (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className={`nexus-card group relative p-0 overflow-hidden border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent ${plan.featured ? 'border-nexus-primary/20' : ''}`}
            >
              <div className="absolute top-6 left-6 z-20">
                <button 
                  onClick={() => toggleCompare(plan._id)}
                  className={`p-2 rounded-lg border transition-all ${comparingPlans.includes(plan._id) ? 'bg-nexus-primary border-nexus-primary text-slate-950' : 'bg-white/5 border-white/10 text-slate-600 hover:text-white'}`}
                  title="Compare Strategy"
                >
                  <Layers size={14} />
                </button>
              </div>

              {plan.badge && (
                <div className="absolute top-6 right-6 z-20">
                  <div className={`px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                    plan.badge === 'Most Popular' ? 'bg-nexus-gold/10 text-nexus-gold border-nexus-gold/20' : 
                    plan.badge === 'Premium' ? 'bg-nexus-magenta/10 text-nexus-magenta border-nexus-magenta/20' :
                    'bg-nexus-primary/10 text-nexus-primary border-nexus-primary/20'
                  }`}>
                    <Award size={12} /> {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-10 space-y-8">
                <div className="flex items-center gap-6 mt-4">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110 ${
                    plan.color === 'nexus-gold' ? 'bg-nexus-gold/10 text-nexus-gold border-nexus-gold/20' :
                    plan.color === 'nexus-magenta' ? 'bg-nexus-magenta/10 text-nexus-magenta border-nexus-magenta/20' :
                    'bg-nexus-primary/10 text-nexus-primary border-nexus-primary/20'
                  }`}>
                    <PlanIcon size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase text-white">{plan.name}</h3>
                    <div className={`flex items-center gap-2 mt-1 ${
                      plan.risk === 'Low' ? 'text-nexus-primary' : 
                      plan.risk === 'Medium' ? 'text-nexus-gold' : 
                      'text-nexus-magenta'
                    }`}>
                      <Info size={12} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{plan.risk} Risk</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">Net Return</p>
                    <p className="text-3xl font-black text-white tracking-tighter">{plan.dailyProfitPercent}<span className="text-nexus-primary text-xl">%</span></p>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Daily Yield</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">Deployment</p>
                    <p className="text-3xl font-black text-white tracking-tighter">{plan.durationDays}<span className="text-slate-500 text-xl">D</span></p>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Cycle Duration</p>
                  </div>
                </div>

                {/* Features List Improved */}
                <div className="space-y-4">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol Capabilities</p>
                  <div className="grid grid-cols-1 gap-3">
                    {plan.features.slice(0, 4).map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 glass border-white/5 rounded-2xl group/feat hover:bg-white/5 transition-colors">
                        <div className="p-2 rounded-lg bg-white/5 text-nexus-primary">
                          {featureIconMapping(f)}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide group-hover/feat:text-white transition-colors">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                   <div className="flex justify-between items-center px-1">
                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Min Stake</p>
                     <p className="text-xl font-black text-white">${plan.minInvestment.toLocaleString()}</p>
                   </div>
                   <button 
                    onClick={() => openPlanDetails(plan)}
                    className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 ${
                      plan.featured ? 'gradient-primary text-slate-900 shadow-xl' : 'glass border-white/10 text-white hover:border-nexus-primary/40'
                    }`}
                   >
                     Inspect Strategy <ArrowUpRight size={18} />
                   </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Compare Plans Modal */}
      <AnimatePresence>
        {isCompareOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCompareOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass w-full max-w-6xl p-10 rounded-[48px] border-white/10 relative z-10 overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black tracking-tighter uppercase">Strategy <span className="text-gradient">Face-Off</span></h2>
                <button onClick={() => setIsCompareOpen(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-slate-500 hover:text-white transition-all"><X size={24} /></button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {plansToCompare.map(plan => (
                  <div key={plan._id} className="nexus-card p-8 border-white/5 bg-white/[0.01] space-y-8 relative">
                    <button onClick={() => toggleCompare(plan._id)} className="absolute top-4 right-4 p-2 bg-white/5 rounded-lg text-slate-600 hover:text-rose-500 transition-colors"><X size={16} /></button>
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-white uppercase">{plan.name}</h3>
                      <p className="text-[10px] text-nexus-primary font-black uppercase tracking-widest">{planMapping(plan.name).risk} Risk</p>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-white/5">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500"><span>Daily Return</span><span className="text-nexus-primary">{plan.dailyProfitPercent}%</span></div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500"><span>Cycle</span><span className="text-white">{plan.durationDays}D</span></div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500"><span>Entry Threshold</span><span className="text-white">${plan.minInvestment.toLocaleString()}</span></div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500"><span>Max Cap</span><span className="text-white">${plan.maxInvestment.toLocaleString()}</span></div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-white/5">
                      <p className="text-[9px] font-black uppercase text-slate-600 mb-2">Key Advantages</p>
                      {plan.features.slice(0, 4).map((f: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                          <CheckCircle2 size={12} className="text-nexus-primary" /> {f}
                        </div>
                      ))}
                    </div>

                    <button onClick={() => { setIsCompareOpen(false); openPlanDetails(plan); }} className="w-full py-4 gradient-primary rounded-2xl text-[10px] font-black uppercase text-slate-900 mt-4 tracking-widest">Select Mode</button>
                  </div>
                ))}
                {plansToCompare.length < 3 && (
                  <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-[40px] text-slate-700 bg-black/20">
                    <Plus size={40} className="mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Add strategy to compare</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Plan Configuration Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass w-full max-w-4xl p-0 rounded-[48px] border-white/10 relative z-10 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-10 md:p-14 space-y-10 bg-white/[0.02] border-r border-white/5">
                  <header>
                    <div className="flex items-center gap-2 text-nexus-primary mb-4"><Zap size={14} className="animate-pulse" /><span className="text-[9px] font-black uppercase tracking-[0.4em]">Node Configuration</span></div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none mb-4 uppercase">{selectedPlan.name}</h1>
                  </header>
                  <div className="space-y-4">
                    {selectedPlan.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 group">
                        <div className="w-7 h-7 rounded-lg bg-nexus-primary/10 flex items-center justify-center text-nexus-primary group-hover:scale-110 transition-transform">{featureIconMapping(feature)}</div>
                        <span className="text-slate-400 font-bold text-xs uppercase tracking-wide">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-10 border-t border-white/5 grid grid-cols-2 gap-8">
                    <div><p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Risk Parameter</p><p className="text-2xl font-black text-nexus-primary uppercase">{planMapping(selectedPlan.name).risk}</p></div>
                    <div><p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Max Cap</p><p className="text-2xl font-black text-slate-200 uppercase">${selectedPlan.maxInvestment.toLocaleString()}</p></div>
                  </div>
                </div>

                <div className="p-10 md:p-14 flex flex-col justify-between bg-nexus-primary/[0.01]">
                  <div className="flex justify-end"><button onClick={() => setIsModalOpen(false)} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"><X size={24} /></button></div>
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <div className="flex justify-between items-end px-2"><p className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Available Capital: <span className="text-nexus-primary">${user?.wallet.totalBalance.toLocaleString()}</span></p></div>
                      <div className="bg-black/40 border border-white/10 rounded-[40px] p-10 flex flex-col items-center group">
                        <label className="text-[9px] text-slate-600 font-black uppercase tracking-[0.4em] mb-4">Capital Allocation ($)</label>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-transparent text-center text-6xl font-black outline-none w-full text-white tracking-tighter" autoFocus />
                        <p className="mt-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Protocol Tolerance: {selectedPlan.minInvestment} - {selectedPlan.maxInvestment}</p>
                      </div>
                    </div>
                    <button onClick={handleInvestInitiate} className="w-full h-24 gradient-primary text-slate-900 font-black rounded-[40px] flex items-center justify-center gap-4 shadow-2xl shadow-nexus-primary/30 hover:scale-[1.02] transition-all uppercase text-[11px] tracking-[0.4em]">Initialize Deployment <ChevronDown size={22} className="-rotate-90" /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Step Modal */}
      <AnimatePresence>
        {isConfirmOpen && selectedPlan && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative nexus-card w-full max-w-lg p-12 border-nexus-primary/30 bg-black/60 text-center space-y-10">
               <div className="w-20 h-20 bg-nexus-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-nexus-primary/20"><ShieldCheck size={40} className="text-nexus-primary" /></div>
               <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Deployment Confirmation</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Institutional Strategy Authorization</p>
               </div>

               <div className="nexus-card p-8 border-white/5 space-y-6 text-left bg-white/[0.02]">
                  <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol</span><span className="text-sm font-black text-white uppercase">{selectedPlan.name}</span></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Allocation</span><span className="text-sm font-black text-nexus-primary">${Number(amount).toLocaleString()}</span></div>
                  <div className="pt-4 border-t border-white/5 space-y-4">
                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Yield Projections</p>
                     <div className="flex justify-between items-center font-black"><span className="text-[10px] text-slate-400 uppercase tracking-widest">Daily Payout</span><span className="text-nexus-primary">+${calculateROI(selectedPlan, Number(amount)).dailyProfit.toFixed(2)}</span></div>
                     <div className="flex justify-between items-center font-black text-white"><span className="text-[10px] text-slate-400 uppercase tracking-widest">Net Surplus</span><span className="">+${calculateROI(selectedPlan, Number(amount)).totalProfit.toFixed(2)}</span></div>
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                  <button onClick={handleInvestConfirm} disabled={investing} className="w-full py-6 gradient-primary text-slate-900 font-black rounded-2xl shadow-xl shadow-nexus-primary/30 text-[11px] uppercase tracking-widest transition-all hover:scale-[1.02]">
                    {investing ? 'Authenticating Pulse...' : 'Authorize Strategy Deployment'}
                  </button>
                  <button onClick={() => setIsConfirmOpen(false)} className="w-full py-5 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Abort Cycle</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
