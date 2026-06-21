import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ArrowUpRight, ArrowDownRight, Activity, TrendingUp,
  Briefcase, Zap, Bell, Copy, CheckCircle2, Clock,
  Target, Calendar, X, ZapOff, Wallet, Users, ChevronRight,
  ShieldCheck, BarChart2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { formatPKR, formatPKRDecimal } from '../utils/currency.ts';
import { API_BASE } from '../utils/api.ts';

export const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState({ totalInvested: 0, dailyProfit: 0, activeInvestments: 0 });
  const [investments, setInvestments] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [copied, setCopied] = useState(false);
  const [chartRange, setChartRange] = useState('1M');
  const [chartData, setChartData] = useState<any[]>([]);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalAmount, setGoalAmount] = useState(user?.investmentGoal?.targetAmount || 0);
  const [goalDate, setGoalDate] = useState(user?.investmentGoal?.targetDate ? new Date(user.investmentGoal.targetDate).toISOString().split('T')[0] : '');

  // ── Live payout countdown ─────────────────────────────────────
  const [countdown, setCountdown] = useState({ h: '00', m: '00', s: '00' });
  useEffect(() => {
    const tick = () => {
      const active = investments.filter((i: any) => i.status === 'active' && i.nextPayoutDate);
      if (active.length === 0) { setCountdown({ h: '00', m: '00', s: '00' }); return; }
      // Find the soonest next payout among all active investments
      const soonest = active.reduce((a: any, b: any) =>
        new Date(a.nextPayoutDate).getTime() < new Date(b.nextPayoutDate).getTime() ? a : b
      );
      const diff = Math.max(0, new Date(soonest.nextPayoutDate).getTime() - Date.now());
      const h  = Math.floor(diff / 3_600_000);
      const m  = Math.floor((diff % 3_600_000) / 60_000);
      const s  = Math.floor((diff % 60_000) / 1000);
      const pad = (n: number) => String(n).padStart(2, '0');
      setCountdown({ h: pad(h), m: pad(m), s: pad(s) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [investments]);

  useEffect(() => {
    refreshUser(); // Sync balance on mount
    fetchStats();
    fetchHistory();
    fetchPerformance('1M');
    // Refresh balance every 10s and on tab focus
    const poll = setInterval(() => { if (document.visibilityState === 'visible') refreshUser(); }, 10000);
    const onVisible = () => { if (document.visibilityState === 'visible') { refreshUser(); fetchStats(); } };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(poll); document.removeEventListener('visibilitychange', onVisible); };
  }, []);

  useEffect(() => { fetchPerformance(chartRange); }, [chartRange]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/investment/my`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!Array.isArray(data)) return;
      setInvestments(data);
      const total = data.filter((inv: any) => inv.status === 'active' || inv.status === 'completed').reduce((acc: number, inv: any) => acc + inv.principalAmount, 0);
      const active = data.filter((inv: any) => inv.status === 'active').length;
      const daily = data.filter((inv: any) => inv.status === 'active').reduce((acc: number, inv: any) => acc + inv.dailyProfit, 0);
      setStats({ totalInvested: total, dailyProfit: daily, activeInvestments: active });
    } catch (err) { console.error(err); }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/wallet/history`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!Array.isArray(data)) return;
      setRecentTransactions(data.slice(0, 5));
    } catch (err) { console.error(err); }
  };

  const fetchPerformance = async (range: string) => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/analytics/performance?range=${range}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setChartData(data);
    } catch (err) { console.error(err); }
  };

  const handleCopyCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveGoal = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ investmentGoal: { targetAmount: Number(goalAmount), targetDate: goalDate } })
      });
      if (res.ok) { setIsEditingGoal(false); refreshUser(); }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-4 md:pt-6 pb-16 max-w-[1700px] mx-auto space-y-5">

      {/* ── TOP BANNER ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/8">
        {/* bg layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#070b14] via-[#0b1120] to-[#060910]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,230,160,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.06),transparent_60%)]" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-nexus-primary/40 to-transparent" />

        <div className="relative z-10 px-6 md:px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left: greeting */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                  alt="avatar"
                  className="w-full h-full object-cover scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-nexus-primary border-2 border-[#070b14]" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Good day,</p>
              <h1 className="text-base font-bold text-white leading-tight">
                {user?.name?.split(' ')[0]} <span className="text-slate-500 font-normal text-sm">— welcome back</span>
              </h1>
            </div>
          </div>

          {/* Center: live balance */}
          <div className="flex flex-col items-start md:items-center gap-0.5">
            <p className="text-[9px] text-slate-600 uppercase tracking-widest font-semibold">Total Balance</p>
            <motion.p
              className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-nexus-primary via-cyan-300 to-nexus-primary"
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {formatPKR(user?.wallet.totalBalance || 0)}
            </motion.p>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={10} className="text-nexus-primary" />
              <span className="text-[10px] text-slate-400">+<span className="text-nexus-primary font-semibold">{formatPKR(stats.dailyProfit)}</span> today</span>
            </div>
          </div>

          {/* Right: actions + status */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 glass rounded-xl border border-nexus-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-nexus-primary animate-ping" />
              <span className="text-[10px] font-semibold text-nexus-primary">Live</span>
            </div>
            <Link
              to="/dashboard/plans"
              className="px-4 py-2 gradient-primary text-slate-900 rounded-xl font-bold text-[11px] flex items-center gap-1.5 shadow-lg shadow-nexus-primary/20 hover:scale-[1.03] active:scale-95 transition-all"
            >
              <Zap size={12} />
              Start Earning
            </Link>
            <Link to="/dashboard/notifications" className="relative p-2.5 glass rounded-xl border border-white/8 hover:border-white/20 transition-all">
              <Bell size={15} className="text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-nexus-magenta rounded-full" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'Available Balance', value: formatPKR(user?.wallet.totalBalance || 0),
            icon: Wallet, accent: 'text-nexus-primary', border: 'border-nexus-primary/15', bg: 'bg-nexus-primary/5',
            sub: 'Withdrawable funds', trend: null
          },
          {
            label: 'Total Invested', value: formatPKR(stats.totalInvested),
            icon: Briefcase, accent: 'text-purple-400', border: 'border-purple-400/15', bg: 'bg-purple-400/5',
            sub: 'Across all plans', trend: null
          },
          {
            label: 'Total Profit', value: formatPKR(user?.wallet.profitBalance || 0),
            icon: TrendingUp, accent: 'text-cyan-400', border: 'border-cyan-400/15', bg: 'bg-cyan-400/5',
            sub: 'All-time earnings', trend: '+' + formatPKR(stats.dailyProfit) + ' today'
          },
          {
            label: 'Active Plans', value: String(stats.activeInvestments),
            icon: BarChart2, accent: 'text-nexus-magenta', border: 'border-nexus-magenta/15', bg: 'bg-nexus-magenta/5',
            sub: 'Running strategies', trend: null
          },
        ].map((card) => (
          <motion.div
            key={card.label}
            whileHover={{ y: -2 }}
            className={`nexus-card border ${card.border} flex flex-col justify-between h-[110px] md:h-[120px] group gap-1 cursor-default`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg ${card.bg} border ${card.border}`}>
                <card.icon size={15} className={card.accent} />
              </div>
              {card.trend && (
                <span className="text-[9px] font-semibold text-nexus-primary bg-nexus-primary/10 px-2 py-0.5 rounded-full border border-nexus-primary/20">
                  {card.trend}
                </span>
              )}
            </div>
            <div>
              <p className="text-[9px] text-slate-600 font-medium uppercase tracking-wider mb-0.5">{card.label}</p>
              <p className={`text-lg font-bold ${card.accent}`}>{card.value}</p>
              <p className="text-[9px] text-slate-700 mt-0.5">{card.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── MAIN GRID ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Performance Chart */}
        <div className="lg:col-span-8 nexus-card flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="p-2 glass rounded-lg border-nexus-primary/20 text-nexus-primary">
                <Activity size={14} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Performance Analytics</p>
                <p className="text-[9px] text-slate-600">Portfolio growth over time</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-black/40 border border-white/5 rounded-lg p-1 shrink-0">
              {['7D', '1M', '3M', 'ALL'].map((r) => (
                <button
                  key={r}
                  onClick={() => setChartRange(r)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-md text-[10px] font-bold transition-all whitespace-nowrap ${chartRange === r ? 'gradient-primary text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-200'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-[240px] md:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length > 0 ? chartData : []} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e6a0" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00e6a0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 9 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 9 }} dx={-5} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(7,11,20,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,230,160,0.15)', borderRadius: '12px', padding: '10px 14px' }}
                  itemStyle={{ color: '#00e6a0', fontWeight: '700', fontSize: '13px' }}
                  labelStyle={{ color: '#475569', fontSize: '10px', marginBottom: '4px' }}
                  cursor={{ stroke: 'rgba(0,230,160,0.15)', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="value" stroke="#00e6a0" strokeWidth={2} fillOpacity={1} fill="url(#chartGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column: Quick Actions + Referral */}
        <div className="lg:col-span-4 flex flex-col gap-4">

          {/* Quick Actions */}
          <div className="nexus-card border-white/8 space-y-3">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/dashboard/wallet" className="flex flex-col items-center gap-1.5 p-3.5 glass rounded-xl border border-white/8 hover:border-nexus-primary/30 hover:bg-nexus-primary/5 transition-all group">
                <div className="p-2 bg-nexus-primary/10 rounded-lg border border-nexus-primary/20 group-hover:scale-110 transition-transform">
                  <ArrowDownRight size={14} className="text-nexus-primary" />
                </div>
                <span className="text-[10px] font-semibold text-slate-300 group-hover:text-white transition-colors">Deposit</span>
              </Link>
              <Link to="/dashboard/wallet" className="flex flex-col items-center gap-1.5 p-3.5 glass rounded-xl border border-white/8 hover:border-nexus-magenta/30 hover:bg-nexus-magenta/5 transition-all group">
                <div className="p-2 bg-nexus-magenta/10 rounded-lg border border-nexus-magenta/20 group-hover:scale-110 transition-transform">
                  <ArrowUpRight size={14} className="text-nexus-magenta" />
                </div>
                <span className="text-[10px] font-semibold text-slate-300 group-hover:text-white transition-colors">Withdraw</span>
              </Link>
              <Link to="/dashboard/plans" className="flex flex-col items-center gap-1.5 p-3.5 glass rounded-xl border border-white/8 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all group">
                <div className="p-2 bg-cyan-400/10 rounded-lg border border-cyan-400/20 group-hover:scale-110 transition-transform">
                  <Zap size={14} className="text-cyan-400" />
                </div>
                <span className="text-[10px] font-semibold text-slate-300 group-hover:text-white transition-colors">Invest</span>
              </Link>
              <Link to="/dashboard/history" className="flex flex-col items-center gap-1.5 p-3.5 glass rounded-xl border border-white/8 hover:border-purple-400/30 hover:bg-purple-400/5 transition-all group">
                <div className="p-2 bg-purple-400/10 rounded-lg border border-purple-400/20 group-hover:scale-110 transition-transform">
                  <Clock size={14} className="text-purple-400" />
                </div>
                <span className="text-[10px] font-semibold text-slate-300 group-hover:text-white transition-colors">History</span>
              </Link>
            </div>
          </div>

          {/* Referral */}
          <div className="nexus-card border-white/8 flex-1 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
                  <Users size={13} />
                </div>
                <p className="text-xs font-bold text-white">Referral</p>
              </div>
              <Link to="/dashboard/referrals" className="text-[9px] font-semibold text-nexus-primary hover:underline">Details →</Link>
            </div>

            <div
              onClick={handleCopyCode}
              className="flex items-center justify-between gap-2 bg-black/50 border border-white/8 rounded-xl px-3 py-2.5 cursor-pointer hover:border-purple-400/30 transition-all group"
            >
              <div>
                <p className="text-[8px] text-slate-600 uppercase tracking-wider mb-0.5">Your code</p>
                <span className="text-sm font-bold tracking-widest text-white group-hover:text-purple-300 transition-colors">{user?.referralCode}</span>
              </div>
              {copied
                ? <CheckCircle2 size={15} className="text-nexus-primary shrink-0" />
                : <Copy size={13} className="text-slate-700 group-hover:text-purple-400 shrink-0 transition-colors" />
              }
            </div>

            <div className="flex items-center justify-between px-1">
              <p className="text-[9px] text-slate-600">Commission earned</p>
              <p className="text-sm font-bold text-purple-400">{formatPKR(user?.wallet.referralEarnings || 0)}</p>
            </div>
          </div>
        </div>

        {/* Active Investments */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 glass rounded-lg border-nexus-primary/20 text-nexus-primary">
                <Zap size={13} />
              </div>
              <p className="text-xs font-bold text-white">Active Investments</p>
            </div>
            <Link to="/dashboard/plans" className="text-[9px] font-semibold text-nexus-primary hover:underline flex items-center gap-1">
              Browse Plans <ChevronRight size={11} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {investments.filter(i => i.status === 'active').map((inv, idx) => (
              <motion.div
                key={inv._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="nexus-card border-white/8 group hover:border-nexus-primary/20 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-nexus-primary animate-pulse" />
                      <span className="text-[9px] font-semibold text-nexus-primary uppercase tracking-wider">Active</span>
                    </div>
                    <h5 className="text-sm font-bold text-white">{inv.planName}</h5>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{formatPKR(inv.principalAmount)}</p>
                    <p className="text-[9px] text-slate-600">invested</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-medium text-slate-600">
                    <span>Progress ({(inv.completedDays ?? (inv.totalDays - inv.remainingDays))}/{inv.totalDays} days)</span>
                    <span className="text-nexus-primary font-bold">{inv.progressPct ?? Math.round(((inv.totalDays - inv.remainingDays) / inv.totalDays) * 100)}%</span>
                  </div>
                  <div className="w-full bg-white/[0.04] h-1 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${inv.progressPct ?? Math.round(((inv.totalDays - inv.remainingDays) / inv.totalDays) * 100)}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full gradient-primary rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-700">
                    <span>+{formatPKR(inv.dailyProfit ?? Math.round((inv.principalAmount * inv.dailyROI) / 100))}/day</span>
                    <span>{inv.remainingDays} day{inv.remainingDays !== 1 ? 's' : ''} left</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {investments.filter(i => i.status === 'active').length === 0 && (
              <div className="md:col-span-2 nexus-card flex flex-col items-center justify-center text-center py-12 border-dashed border-white/8 bg-black/20 space-y-4">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border border-white/5">
                  <ZapOff size={22} className="text-slate-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-400 mb-1">No Active Investments</p>
                  <p className="text-[10px] text-slate-600">Start a plan to grow your portfolio</p>
                </div>
                <Link
                  to="/dashboard/plans"
                  className="px-6 py-2.5 gradient-primary text-slate-900 rounded-xl font-bold text-xs shadow-lg shadow-nexus-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Browse Plans
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-4">
          <div className="nexus-card border-white/8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 glass rounded-lg border-white/8 text-slate-500">
                  <Clock size={13} />
                </div>
                <p className="text-xs font-bold text-white">Recent Transactions</p>
              </div>
              <Link to="/dashboard/history" className="text-[9px] font-semibold text-nexus-primary hover:underline">View all</Link>
            </div>

            <div className="flex-1 space-y-1">
              {recentTransactions.map((tx: any) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg border ${tx.type === 'withdraw' ? 'border-nexus-magenta/20 bg-nexus-magenta/8 text-nexus-magenta' : 'border-nexus-primary/20 bg-nexus-primary/8 text-nexus-primary'}`}>
                      {tx.type === 'withdraw' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold capitalize text-slate-200">{tx.type}</p>
                      <p className="text-[9px] text-slate-600">{new Date(tx.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold ${tx.type === 'withdraw' ? 'text-nexus-magenta' : 'text-nexus-primary'}`}>
                      {tx.type === 'withdraw' ? '−' : '+'}{ formatPKR(tx.amount)}
                    </p>
                    <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded-md ${tx.status === 'completed' || tx.status === 'approved' ? 'text-emerald-400 bg-emerald-500/10' : tx.status === 'pending' ? 'text-yellow-400 bg-yellow-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}

              {recentTransactions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 opacity-30 space-y-2">
                  <Clock size={24} className="text-slate-600" />
                  <p className="text-[10px] font-medium text-slate-600">No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Earnings Banner (compact) */}
        <div className="lg:col-span-12 relative overflow-hidden rounded-2xl border border-white/8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#060a12] via-[#0c1426] to-[#060a12]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,230,160,0.07),transparent_70%)]" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-nexus-primary/30 to-transparent" />

          <div className="relative z-10 px-6 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Balance */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-nexus-primary/25 bg-nexus-primary/8">
                <div className="w-1.5 h-1.5 rounded-full bg-nexus-primary animate-ping" />
                <span className="text-[9px] font-bold text-nexus-primary uppercase tracking-widest">Live Earnings</span>
              </div>
              <div>
                <p className="text-[9px] text-slate-600 uppercase tracking-wider">Current Balance</p>
                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-nexus-primary to-cyan-300">
                  {formatPKR(user?.wallet.totalBalance || 0)}
                </p>
              </div>
            </div>

            {/* Payout Timer */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-[9px] text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <Zap size={9} className="text-yellow-400" /> Next payout
              </p>
              <div className="flex items-center gap-1">
                {[countdown.h, countdown.m, countdown.s].map((v, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.33 }}
                      className="w-9 h-9 flex items-center justify-center bg-black/60 border border-white/8 rounded-lg font-mono font-black text-base text-white"
                    >
                      {v}
                    </motion.span>
                    {i < 2 && <span className="text-slate-700 font-bold text-sm">:</span>}
                  </span>
                ))}
              </div>
              <p className="text-[8px] text-slate-700 tracking-wider">HH · MM · SS</p>
            </div>

            {/* Stats strip */}
            <div className="flex items-center gap-6 md:gap-8">
              {[
                { label: 'Invested', value: formatPKR(stats.totalInvested) },
                { label: 'Active Plans', value: stats.activeInvestments },
                { label: 'Profit', value: formatPKR(user?.wallet.profitBalance || 0), highlight: true },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-[8px] text-slate-600 uppercase tracking-wider">{s.label}</p>
                  <p className={`text-sm font-bold ${s.highlight ? 'text-nexus-primary' : 'text-white'}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link to="/dashboard/plans" className="group relative shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-nexus-primary to-cyan-400 rounded-xl opacity-40 blur group-hover:opacity-70 transition-opacity" />
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative px-6 py-2.5 gradient-primary rounded-xl font-bold text-sm text-slate-900 flex items-center gap-2 shadow-xl"
              >
                <Zap size={14} className="text-slate-800" />
                Start Earning Now
                <ChevronRight size={14} />
              </motion.div>
            </Link>
          </div>
        </div>

      </div>

      {/* ── GOAL MODAL ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isEditingGoal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditingGoal(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }} className="nexus-card w-full max-w-md p-8 border-white/10 relative z-10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">Set Investment Goal</h3>
                  <p className="text-[10px] text-slate-600 mt-0.5">Define your financial target</p>
                </div>
                <button onClick={() => setIsEditingGoal(false)} className="p-2 glass rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all border-white/5"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[9px] text-slate-600 font-semibold uppercase tracking-wider">Target Amount ($)</p>
                  <div className="relative group">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-primary transition-colors" size={14} />
                    <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-nexus-primary/30 transition-all font-bold text-sm text-white" autoFocus />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] text-slate-600 font-semibold uppercase tracking-wider">Target Date</p>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-primary transition-colors" size={14} />
                    <input type="date" value={goalDate} onChange={(e) => setGoalDate(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-nexus-primary/30 transition-all text-sm text-white" />
                  </div>
                </div>
                <button onClick={handleSaveGoal} className="w-full py-3 gradient-primary text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                  Save Goal <CheckCircle2 size={15} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
