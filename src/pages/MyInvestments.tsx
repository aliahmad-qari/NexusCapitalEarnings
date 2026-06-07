import { useEffect, useState } from 'react';
import { TrendingUp, Calendar, Clock, Activity, PieChart, Zap, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export const MyInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchMyInvestments(); }, []);

  const fetchMyInvestments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/investment/my`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setInvestments(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const calculateProgress = (start: string, duration: number) => {
    const startDate = new Date(start).getTime();
    const durationMs = duration * 24 * 60 * 60 * 1000;
    const elapsed = new Date().getTime() - startDate;
    return Math.min(Math.max((elapsed / durationMs) * 100, 0), 100);
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-6 pb-16 max-w-[1700px] mx-auto space-y-6 text-slate-200 selection:bg-nexus-primary/20 selection:text-nexus-primary">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] to-[#080c18]" />
        <div className="absolute inset-0 bg-gradient-to-r from-nexus-magenta/8 via-transparent to-nexus-primary/8" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-primary/40 to-transparent" />
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-nexus-magenta/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-nexus-primary/30 bg-nexus-primary/10 w-fit">
              <PieChart size={11} className="text-nexus-primary" />
              <span className="text-[10px] font-bold text-nexus-primary uppercase tracking-widest">My Portfolio</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-primary to-nexus-magenta">Investments</span></h2>
            <p className="text-slate-500 text-xs max-w-md">Track your active investment plans, yield cycles and earnings in real-time.</p>
          </div>
          <Link to="/dashboard/plans" className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-nexus-primary to-cyan-400 rounded-xl opacity-50 blur group-hover:opacity-80 transition-opacity" />
            <div className="relative px-6 py-3 gradient-primary text-slate-900 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xl">
              <Zap size={14} /> New Investment
            </div>
          </Link>
        </div>
      </div>

      {/* Content */}
      <section>
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-nexus-primary/10 border-t-nexus-primary rounded-full animate-spin"></div>
            <p className="text-nexus-primary/50 text-xs font-medium">Loading your investments...</p>
          </div>
        ) : investments.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="nexus-card rounded-2xl p-14 flex flex-col items-center border-white/5 text-center">
            <PieChart className="text-slate-800 mb-4" size={40} />
            <h3 className="text-base font-bold mb-2 text-white">No Investments Yet</h3>
            <p className="text-slate-600 text-xs max-w-sm mb-6">You don't have any active investment plans. Browse our plans to get started.</p>
            <Link to="/dashboard/plans" className="gradient-primary px-8 py-3 rounded-xl text-slate-900 font-semibold text-xs shadow-lg">Browse Plans</Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {investments.map((inv: any, idx) => {
              const progress = calculateProgress(inv.createdAt, inv.planId.durationDays);
              const totalProfit = inv.amount * (inv.planId.dailyProfitPercent / 100) * inv.planId.durationDays;
              const currentEarnings = (inv.amount * (inv.planId.dailyProfitPercent / 100)) * (progress / 100 * inv.planId.durationDays);

              return (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }} key={inv._id}
                  className="nexus-card p-6 space-y-5 border-white/8 group hover:border-nexus-primary/30 transition-all shadow-xl">

                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-nexus-primary">
                        <Activity size={11} className="animate-pulse" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Active</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{inv.planId.name}</h3>
                    </div>
                    <div className="p-2 glass rounded-xl border-white/5 text-nexus-primary group-hover:border-nexus-primary/20 transition-all">
                      <TrendingUp size={16} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Invested</p>
                      <p className="text-lg font-bold text-white">${inv.amount.toLocaleString()}</p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Daily Return</p>
                      <p className="text-lg font-bold text-nexus-primary">+{inv.planId.dailyProfitPercent}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-medium text-slate-600">Progress</p>
                      <p className="text-xs font-bold text-white">{progress.toFixed(1)}%</p>
                    </div>
                    <div className="w-full h-1.5 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} className="h-full gradient-primary rounded-full" />
                    </div>
                  </div>

                  <div className="glass p-4 rounded-xl border-white/5 grid grid-cols-2 gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-700 font-medium">Total Profit</p>
                      <p className="text-sm font-bold text-slate-400">${totalProfit.toFixed(2)}</p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-[10px] text-slate-700 font-medium">Earned So Far</p>
                      <p className="text-sm font-bold text-nexus-primary">${currentEarnings.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-medium text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={11} />
                      <span>Started: {new Date(inv.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} />
                      <span>{Math.max(inv.planId.durationDays - Math.floor((progress/100) * inv.planId.durationDays), 0)}d left</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Info Banner */}
      <div className="p-5 bento-card border-none bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 glass rounded-xl flex items-center justify-center border-white/5">
            <AlertCircle size={18} className="text-slate-600" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-300">Note</h4>
            <p className="text-[10px] text-slate-600 mt-0.5">New investments may take up to 24 hours to show their first yield.</p>
          </div>
        </div>
        <Link to="/dashboard/support" className="px-5 py-2 glass border-white/5 text-[10px] font-semibold text-slate-500 hover:text-white rounded-lg transition-all whitespace-nowrap">Get Support</Link>
      </div>
    </div>
  );
};
