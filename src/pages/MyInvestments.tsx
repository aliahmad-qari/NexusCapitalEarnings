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
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-nexus-primary">
            <PieChart size={14} className="animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">My Portfolio</span>
          </div>
          <h2 className="text-xl font-bold text-white">My Investments</h2>
          <p className="text-slate-500 text-xs max-w-xl">Track your active investment plans and yield harvesting cycles.</p>
        </div>
        <Link to="/dashboard/plans" className="gradient-primary px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-900 shadow-lg hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-2">
          <Zap size={14} /> New Investment
        </Link>
      </header>

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
