import { useEffect, useState } from 'react';
import { 
  BarChart2, Clock, TrendingUp, Calendar, 
  ArrowUpRight, AlertCircle, PieChart, Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const MyInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyInvestments();
  }, []);

  const fetchMyInvestments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/investment/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setInvestments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (start: string, duration: number) => {
    const startDate = new Date(start).getTime();
    const durationMs = duration * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    const elapsed = now - startDate;
    const progress = Math.min(Math.max((elapsed / durationMs) * 100, 0), 100);
    return progress;
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 pb-32 lg:pb-12 text-slate-200">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-nexus-primary">
            <PieChart size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node Registry</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">My <span className="text-gradient">Deployments</span></h2>
          <p className="text-slate-500 text-sm max-w-md normal-case font-medium">Monitoring active capital nodes and yield harvesting cycles across the nexus.</p>
        </div>
        <Link 
          to="/plans" 
          className="gradient-primary px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl shadow-nexus-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          Deploy New Node
        </Link>
      </header>

      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center gap-6">
           <div className="w-12 h-12 border-4 border-nexus-primary/20 border-t-nexus-primary rounded-full animate-spin"></div>
           <p className="text-nexus-primary/40 font-black uppercase tracking-[0.4em] text-[10px]">Scanning Strategy Nodes...</p>
        </div>
      ) : investments.length === 0 ? (
        <div className="nexus-card rounded-[48px] p-24 flex flex-col items-center border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
           <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-[32px] flex items-center justify-center mb-8">
              <PieChart className="text-slate-800" size={32} />
           </div>
           <h3 className="text-xl font-black mb-3 tracking-tighter uppercase">No Active Nodes</h3>
           <p className="text-slate-600 text-center max-w-xs text-xs leading-relaxed font-bold uppercase tracking-widest mb-10">You have no active strategy deployments in the registry.</p>
           <Link to="/plans" className="gradient-primary px-10 py-5 rounded-2xl text-slate-900 font-black text-[11px] uppercase tracking-widest">Deploy First Node</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {investments.map((inv: any) => {
            const progress = calculateProgress(inv.createdAt, inv.planId.durationDays);
            const totalProfit = inv.amount * (inv.planId.dailyProfitPercent / 100) * inv.planId.durationDays;
            const currentEarnings = (inv.amount * (inv.planId.dailyProfitPercent / 100)) * (progress / 100 * inv.planId.durationDays);

            return (
              <motion.div 
                layout
                key={inv._id}
                className="nexus-card p-8 space-y-8 border-white/5 bg-gradient-to-br from-white/[0.01] to-transparent group hover:border-nexus-primary/20 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black tracking-tighter uppercase text-white">{inv.planId.name}</h3>
                    <div className="flex items-center gap-2 text-nexus-primary">
                      <Activity size={12} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Active Node</span>
                    </div>
                  </div>
                  <div className="p-3 glass rounded-xl border-white/5 text-nexus-primary">
                    <TrendingUp size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Capital Stake</p>
                    <p className="text-2xl font-black text-slate-200">${inv.amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Daily Yield</p>
                    <p className="text-2xl font-black text-nexus-primary">+{inv.planId.dailyProfitPercent}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Harvesting Progress</p>
                    <p className="text-[10px] font-black text-slate-400">{progress.toFixed(1)}%</p>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full gradient-primary rounded-full"
                    />
                  </div>
                </div>

                <div className="glass p-5 rounded-2xl border-white/5 bg-black/20 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.2em] mb-1">Total Profits</p>
                    <p className="text-sm font-black text-white">${totalProfit.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.2em] mb-1">Harvested</p>
                    <p className="text-sm font-black text-nexus-primary">${currentEarnings.toFixed(2)}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} />
                    <span>Incept: {new Date(inv.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} />
                    <span>Cycle Ends In {Math.max(inv.planId.durationDays - Math.floor((progress/100) * inv.planId.durationDays), 0)}D</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
