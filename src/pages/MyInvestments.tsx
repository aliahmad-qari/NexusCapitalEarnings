import { useEffect, useState } from 'react';
import {
  TrendingUp, Calendar, Clock, Activity, PieChart, Zap,
  AlertCircle, RefreshCw, CheckCircle2, ArrowRight, Target,
  DollarSign, BarChart2, Timer
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { formatPKR } from '../utils/currency.ts';

// ── Live countdown to next payout ────────────────────────────────────────────
function useCountdown(target: Date | null) {
  // Initialize to the actual diff immediately (not 0) to avoid "Processing…" flash
  const [diff, setDiff] = useState<number>(() =>
    target ? Math.max(0, target.getTime() - Date.now()) : 0
  );

  useEffect(() => {
    if (!target) { setDiff(0); return; }
    const tick = () => setDiff(Math.max(0, target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target?.getTime()]); // re-run if target changes

  const h  = Math.floor(diff / 3_600_000);
  const m  = Math.floor((diff % 3_600_000) / 60_000);
  const s  = Math.floor((diff % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return { h: pad(h), m: pad(m), s: pad(s), done: diff === 0 };
}

function CountdownBadge({ target }: { target: Date | null }) {
  const { h, m, s, done } = useCountdown(target);
  if (!target) return <span className="text-[10px] text-slate-600">—</span>;
  // "Processing…" only if target is actually in the past by more than 2 minutes
  if (done && target.getTime() < Date.now() - 120_000) {
    return <span className="text-[10px] font-bold text-nexus-primary animate-pulse">Processing…</span>;
  }
  return (
    <span className="font-mono text-[11px] font-bold text-cyan-400">
      {h}:{m}:{s}
    </span>
  );
}

export const MyInvestments = () => {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyInvestments();
    const id = setInterval(fetchMyInvestments, 30_000); // refresh every 30s
    return () => clearInterval(id);
  }, []);

  const fetchMyInvestments = async () => {
    setLoading(true);
    try {
      const token   = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res     = await fetch(`${apiBase}/api/investment/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setInvestments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Aggregate portfolio stats
  const active    = investments.filter(i => i.status === 'active');
  const totalInvested  = investments.reduce((s, i) => s + i.principalAmount, 0);
  const totalEarned    = investments.reduce((s, i) => s + (i.totalProfitEarned || 0), 0);
  const dailyTotal     = active.reduce((s, i) => s + (i.dailyProfit || 0), 0);

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-6 pb-16 max-w-[1700px] mx-auto space-y-6 text-slate-200">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] to-[#080c18]" />
        <div className="absolute inset-0 bg-gradient-to-r from-nexus-magenta/8 via-transparent to-nexus-primary/8" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-primary/40 to-transparent" />
        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-nexus-primary/30 bg-nexus-primary/10 w-fit">
              <PieChart size={11} className="text-nexus-primary" />
              <span className="text-[10px] font-bold text-nexus-primary uppercase tracking-widest">My Portfolio</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Investment <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-primary to-nexus-magenta">Tracker</span>
            </h2>
            <p className="text-slate-500 text-xs max-w-md">Live ROI tracking, payout countdowns and earnings — all database-driven.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchMyInvestments} className="p-3 glass rounded-xl border-white/5 text-slate-400 hover:text-white transition-all">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <Link to="/dashboard/plans" className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-nexus-primary to-cyan-400 rounded-xl opacity-50 blur group-hover:opacity-80 transition-opacity" />
              <div className="relative px-5 py-2.5 gradient-primary text-slate-900 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xl">
                <Zap size={13} /> New Investment
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Portfolio Summary ──────────────────────────────────────── */}
      {investments.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Invested',  value: formatPKR(totalInvested), icon: DollarSign, color: 'text-purple-400', border: 'border-purple-400/20', bg: 'bg-purple-400/5' },
            { label: 'Total Earned',    value: formatPKR(totalEarned),   icon: TrendingUp, color: 'text-nexus-primary', border: 'border-nexus-primary/20', bg: 'bg-nexus-primary/5' },
            { label: 'Active Plans',    value: String(active.length),    icon: BarChart2,  color: 'text-cyan-400', border: 'border-cyan-400/20', bg: 'bg-cyan-400/5' },
            { label: 'Daily Earnings',  value: formatPKR(dailyTotal),    icon: Target,     color: 'text-nexus-magenta', border: 'border-nexus-magenta/20', bg: 'bg-nexus-magenta/5' },
          ].map(s => (
            <div key={s.label} className={`nexus-card flex flex-col justify-between h-[100px] border ${s.border}`}>
              <div className={`p-1.5 rounded-lg ${s.bg} border ${s.border} w-fit`}>
                <s.icon size={13} className={s.color} />
              </div>
              <div>
                <p className="text-[9px] text-slate-600 font-medium uppercase tracking-wider">{s.label}</p>
                <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Investment Cards ───────────────────────────────────────── */}
      {loading && investments.length === 0 ? (
        <div className="p-20 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-nexus-primary/10 border-t-nexus-primary rounded-full animate-spin" />
          <p className="text-nexus-primary/50 text-xs">Loading your investments…</p>
        </div>
      ) : investments.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="nexus-card rounded-2xl p-14 flex flex-col items-center border-white/5 text-center">
          <PieChart className="text-slate-800 mb-4" size={40} />
          <h3 className="text-base font-bold mb-2 text-white">No Investments Yet</h3>
          <p className="text-slate-600 text-xs max-w-sm mb-6">Browse our plans to start earning daily ROI.</p>
          <Link to="/dashboard/plans" className="gradient-primary px-8 py-3 rounded-xl text-slate-900 font-semibold text-xs shadow-lg">
            Browse Plans
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {investments.map((inv: any, idx) => {
            const isPending   = inv.status === 'pending';
            const isActive    = inv.status === 'active';
            const isCompleted = inv.status === 'completed';
            const isCancelled = inv.status === 'cancelled';

            // All values from DB — nothing hardcoded
            const totalDays        = inv.totalDays || 7;
            const completedDays    = inv.completedDays ?? (totalDays - (inv.remainingDays ?? totalDays));
            const remainingDays    = inv.remainingDays ?? totalDays;
            const progressPct      = inv.progressPct ?? Math.min(Math.round((completedDays / totalDays) * 100), 100);
            const dailyProfit      = inv.dailyProfit   ?? Math.round((inv.principalAmount * inv.dailyROI) / 100);
            const totalExpected    = inv.totalExpectedProfit ?? (dailyProfit * totalDays);
            const earned           = inv.totalProfitEarned   ?? 0;
            const nextPayout       = inv.nextPayoutDate ? new Date(inv.nextPayoutDate) : null;

            const statusColor = isPending   ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5'
                              : isActive    ? 'text-nexus-primary border-nexus-primary/20 bg-nexus-primary/5'
                              : isCompleted ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5'
                              : 'text-slate-500 border-white/10 bg-white/5';

            const barColor = isPending   ? 'bg-yellow-400'
                           : isCompleted ? 'bg-emerald-400'
                           : 'gradient-primary';

            return (
              <motion.div
                key={inv._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className={`nexus-card p-6 space-y-4 border-white/8 hover:border-nexus-primary/30 transition-all shadow-xl`}
              >
                {/* ── Title row ── */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${statusColor}`}>
                      {isPending   && <Clock size={9} className="animate-pulse" />}
                      {isActive    && <Activity size={9} className="animate-pulse" />}
                      {isCompleted && <CheckCircle2 size={9} />}
                      {isPending ? 'Awaiting Approval' : isActive ? 'Active ROI' : isCompleted ? 'Completed' : 'Cancelled'}
                    </span>
                    <h3 className="text-base font-bold text-white">{inv.planName}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-white">{formatPKR(inv.principalAmount)}</p>
                    <p className="text-[9px] text-slate-600">invested</p>
                  </div>
                </div>

                {/* ── Progress bar ── */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">
                      {isPending ? 'Pending activation' : `Day ${completedDays} of ${totalDays}`}
                    </span>
                    <span className="font-bold text-white">{progressPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/[0.04] border border-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className={`h-full rounded-full ${barColor}`}
                    />
                  </div>
                  <p className="text-[9px] text-slate-700">
                    {isPending   ? 'Start date set after admin approval'
                    : isCompleted ? `Completed — principal returned`
                    : `${remainingDays} day${remainingDays !== 1 ? 's' : ''} remaining`}
                  </p>
                </div>

                {/* ── Key stats grid ── */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass p-3 rounded-xl border-white/5 space-y-0.5">
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider">Daily ROI</p>
                    <p className="text-sm font-bold text-cyan-400">+{inv.dailyROI}%</p>
                    <p className="text-[10px] text-slate-500">{formatPKR(dailyProfit)} / day</p>
                  </div>
                  <div className="glass p-3 rounded-xl border-white/5 space-y-0.5">
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider">Earned So Far</p>
                    <p className="text-sm font-bold text-nexus-primary">{formatPKR(earned)}</p>
                    <p className="text-[10px] text-slate-500">of {formatPKR(totalExpected)}</p>
                  </div>
                  <div className="glass p-3 rounded-xl border-white/5 space-y-0.5">
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider">Total Return</p>
                    <p className="text-sm font-bold text-emerald-400">{formatPKR(inv.principalAmount + totalExpected)}</p>
                    <p className="text-[10px] text-slate-500">principal + profit</p>
                  </div>
                  <div className="glass p-3 rounded-xl border-white/5 space-y-0.5">
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider">
                      {isActive ? 'Next Payout In' : isCompleted ? 'Final Profit' : 'Daily Profit'}
                    </p>
                    {isActive ? (
                      <CountdownBadge target={nextPayout} />
                    ) : (
                      <p className="text-sm font-bold text-white">{formatPKR(dailyProfit)}</p>
                    )}
                    {isActive && nextPayout && (
                      <p className="text-[9px] text-slate-600">
                        {nextPayout.toLocaleString('en-PK', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Dates ── */}
                <div className="flex justify-between text-[10px] text-slate-600 pt-1 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={10} />
                    <span>Start: {isPending ? 'TBD' : new Date(inv.startDate).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Timer size={10} />
                    <span>End: {isPending ? 'TBD' : new Date(inv.endDate).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* ── Completed banner ── */}
                {isCompleted && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/20">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 size={14} />
                      <span className="text-[11px] font-semibold">Investment Complete</span>
                    </div>
                    <span className="text-[10px] text-emerald-300 font-bold">+{formatPKR(earned)} earned</span>
                  </div>
                )}

                {/* ── Pending note ── */}
                {isPending && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-400/5 border border-yellow-400/20 text-yellow-400">
                    <Clock size={13} />
                    <p className="text-[10px]">Awaiting admin deposit verification</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Info footer ───────────────────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-black/20 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 glass rounded-xl flex items-center justify-center border-white/5">
            <AlertCircle size={18} className="text-slate-600" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-300">ROI Distribution</h4>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Profit is credited exactly 24 hours after each activation. Countdowns update in real-time.
            </p>
          </div>
        </div>
        <Link to="/dashboard/support" className="px-5 py-2 glass border-white/5 text-[10px] font-semibold text-slate-500 hover:text-white rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5">
          Get Support <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
};
