import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Activity,
  Briefcase, Zap, Bell, Copy, CheckCircle2, Clock,
  Target, Calendar, Edit3, X, Cpu, ZapOff, Wallet, Users, ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

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

  const marketAssets = [
    { name: 'Bitcoin', symbol: 'BTC', price: '68,432.10', change: '+1.25%', trend: 'up' },
    { name: 'Ethereum', symbol: 'ETH', price: '3,845.20', change: '+2.10%', trend: 'up' },
    { name: 'Solana', symbol: 'SOL', price: '168.45', change: '-1.40%', trend: 'down' },
  ];

  useEffect(() => {
    refreshUser();
    fetchStats();
    fetchHistory();
    fetchPerformance('1M');
  }, []);

  useEffect(() => { fetchPerformance(chartRange); }, [chartRange]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/investment/my`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!Array.isArray(data)) return;
      setInvestments(data);
      const total = data.reduce((acc: number, inv: any) => acc + inv.amount, 0);
      const active = data.filter((inv: any) => inv.status === 'active').length;
      const daily = data.filter((inv: any) => inv.status === 'active').reduce((acc: number, inv: any) => acc + (inv.amount * inv.dailyProfitPercent) / 100, 0);
      setStats({ totalInvested: total, dailyProfit: daily, activeInvestments: active });
    } catch (err) { console.error(err); }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/wallet/history`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!Array.isArray(data)) return;
      setRecentTransactions(data.slice(0, 4));
    } catch (err) { console.error(err); }
  };

  const fetchPerformance = async (range: string) => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
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
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ investmentGoal: { targetAmount: Number(goalAmount), targetDate: goalDate } })
      });
      if (res.ok) { setIsEditingGoal(false); refreshUser(); }
    } catch (err) { console.error(err); }
  };

  const goalProgress = user?.investmentGoal?.targetAmount && user.investmentGoal.targetAmount > 0
    ? Math.min(Math.round((stats.totalInvested / user.investmentGoal.targetAmount) * 100), 100) : 0;

  const daysLeft = user?.investmentGoal?.targetDate
    ? Math.max(0, Math.ceil((new Date(user.investmentGoal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : null;

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-6 pb-10 max-w-[1700px] mx-auto space-y-6 selection:bg-nexus-primary/20 selection:text-nexus-primary">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-nexus-primary">
            <Activity size={14} className="animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Live Dashboard</span>
          </div>
          <h1 className="text-xl font-bold text-white">
            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 text-xs">Your portfolio overview and recent activity</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 glass rounded-xl border-nexus-primary/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-nexus-primary animate-ping" />
            <span className="text-[10px] font-semibold text-white">System Online</span>
          </div>
          <Link to="/dashboard/notifications" className="relative p-2.5 hover:bg-white/5 rounded-xl transition-all group">
            <Bell size={18} className="text-slate-500 group-hover:text-white transition-colors" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-nexus-magenta rounded-full"></span>
          </Link>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        
        {/* Row 1: Stats */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Wallet */}
          <div className="bento-card bg-gradient-to-br from-nexus-primary/[0.03] to-transparent border-nexus-primary/10 flex flex-col justify-between h-[200px]">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-nexus-primary/10 border border-nexus-primary/20 rounded-xl text-nexus-primary">
                <Wallet size={18} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Available Balance</p>
                <h2 className="text-xl font-bold text-white">${user?.wallet.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/dashboard/wallet" className="flex-1 py-3 bg-nexus-primary text-slate-900 rounded-xl font-semibold text-xs uppercase tracking-wider text-center hover:scale-[1.02] transition-all">Deposit</Link>
              <Link to="/dashboard/wallet" className="flex-1 py-3 glass border-white/10 text-white rounded-xl font-semibold text-xs uppercase tracking-wider text-center hover:bg-white/5 transition-all">Withdraw</Link>
            </div>
          </div>

          {/* Performance */}
          <div className="bento-card flex flex-col justify-between h-[200px]">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-nexus-magenta/10 border border-nexus-magenta/20 rounded-xl text-nexus-magenta">
                <Briefcase size={18} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Invested</p>
                <h2 className="text-xl font-bold text-white">${stats.totalInvested.toLocaleString()}</h2>
              </div>
            </div>
            <div className="p-4 glass border-white/5 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Total Profits</p>
                <p className="text-base font-bold text-nexus-primary">+${user?.wallet.profitBalance.toFixed(2)}</p>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="text-right space-y-0.5">
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Active Plans</p>
                <p className="text-base font-bold text-white">{stats.activeInvestments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral */}
        <div className="lg:col-span-4">
          <div className="bento-card h-full bg-gradient-to-tr from-nexus-purple/[0.05] to-transparent border-nexus-purple/10 flex flex-col justify-between py-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-nexus-purple/10 border border-nexus-purple/20 rounded-lg text-nexus-purple">
                <Users size={15} />
              </div>
              <h4 className="text-xs font-semibold text-white">Referral Program</h4>
            </div>
            <div onClick={handleCopyCode} className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:border-nexus-purple/30 transition-all mb-3">
              <span className="text-sm font-bold tracking-widest text-white group-hover:text-nexus-purple transition-colors">{user?.referralCode}</span>
              {copied ? <CheckCircle2 className="text-nexus-primary" size={16} /> : <Copy className="text-slate-700" size={16} />}
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed">Refer users and earn commission bonuses. Earned so far: <span className="text-nexus-purple font-semibold">${user?.wallet.referralEarnings.toFixed(2)}</span></p>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-8 bento-card min-h-[380px] flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 glass rounded-xl border-nexus-primary/20 text-nexus-primary">
                <Activity size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Performance Chart</h3>
                <p className="text-[10px] text-slate-600">Strategy analytics over time</p>
              </div>
            </div>
            <div className="flex bg-white/[0.03] border border-white/5 rounded-xl p-1 gap-1">
              {['7D', '1M', '3M', 'ALL'].map((r) => (
                <button key={r} onClick={() => setChartRange(r)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-semibold tracking-wider transition-all ${chartRange === r ? 'gradient-primary text-slate-900 shadow-xl' : 'text-slate-600 hover:text-white hover:bg-white/5'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length > 0 ? chartData : []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e6a0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00e6a0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} dx={-10} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 14, 26, 0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px' }} itemStyle={{ color: '#00e6a0', fontWeight: '600', fontSize: '13px' }} labelStyle={{ color: '#64748b', fontSize: '10px' }} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="value" stroke="#00e6a0" strokeWidth={2} fillOpacity={1} fill="url(#flowGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-4">
          {/* Goal */}
          <div className="bento-card bg-gradient-to-br from-nexus-gold/[0.03] to-transparent border-nexus-gold/10">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-nexus-gold/10 border border-nexus-gold/20 rounded-lg text-nexus-gold">
                  <Target size={15} />
                </div>
                <h4 className="text-xs font-semibold text-white">Investment Goal</h4>
              </div>
              <button onClick={() => setIsEditingGoal(true)} className="p-1.5 hover:bg-white/5 rounded-lg transition-all"><Edit3 size={13} className="text-slate-600" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-white">{goalProgress}%</p>
                  <p className="text-[10px] font-medium text-slate-600 mt-1">Completion</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-slate-300">{daysLeft !== null ? `${daysLeft} days` : 'N/A'}</p>
                  <p className="text-[10px] font-medium text-slate-600">Remaining</p>
                </div>
              </div>
              <div className="h-2 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${goalProgress}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} className="h-full rounded-full bg-nexus-gold shadow-[0_0_10px_rgba(212,165,116,0.3)]" />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-slate-700">Current: ${stats.totalInvested.toLocaleString()}</p>
                <p className="text-[10px] text-slate-700">Target: ${user?.investmentGoal?.targetAmount?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>

          {/* Market */}
          <div className="bento-card border-white/5 bg-black/20">
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-4">Live Market</h4>
            <div className="space-y-3">
              {marketAssets.map(asset => (
                <div key={asset.symbol} className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center font-semibold text-xs text-slate-400 group-hover:border-nexus-primary/30 group-hover:text-nexus-primary transition-all">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{asset.name}</p>
                      <p className="text-[10px] text-slate-600">{asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">${asset.price}</p>
                    <div className={`flex items-center justify-end gap-1 text-[10px] font-semibold mt-0.5 ${asset.trend === 'up' ? 'text-nexus-primary' : 'text-nexus-magenta'}`}>
                      {asset.trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      {asset.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Investments */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap size={16} className="text-nexus-primary" />
              Active Investments
            </h3>
            <Link to="/dashboard/plans" className="text-[10px] font-semibold text-nexus-primary hover:underline">View Plans</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investments.filter(i => i.status === 'active').map((inv) => (
              <div key={inv._id} className="bento-card group relative overflow-hidden">
                <div className="flex justify-between items-start mb-5">
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-white">{inv.planName}</h5>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-nexus-primary animate-pulse" />
                      <span className="text-[10px] font-semibold text-nexus-primary">Active</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-200">${inv.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-600">Invested</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-medium text-slate-600">
                    <span>Daily Return</span>
                    <span className="text-nexus-primary">+{inv.dailyProfitPercent}%</span>
                  </div>
                  <div className="w-full bg-white/[0.03] h-1.5 rounded-full overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full gradient-primary rounded-full" />
                  </div>
                </div>
              </div>
            ))}
            {investments.filter(i => i.status === 'active').length === 0 && (
              <div className="md:col-span-2 bento-card flex flex-col items-center justify-center text-center py-10 space-y-4 border-dashed border-white/10 bg-black/20">
                <ZapOff size={32} className="text-slate-800" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-400">No Active Investments</h4>
                  <p className="text-[10px] text-slate-600">Start investing to see your portfolio here</p>
                </div>
                <Link to="/dashboard/plans" className="px-6 py-2.5 gradient-primary text-slate-900 rounded-xl font-semibold text-xs uppercase tracking-wider shadow-xl shadow-nexus-primary/20">Browse Plans</Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-4">
          <div className="bento-card border-white/5 h-full">
            <h4 className="text-xs font-semibold text-slate-500 mb-4 pb-3 border-b border-white/5">Recent Transactions</h4>
            <div className="space-y-2">
              {recentTransactions.map((tx: any) => (
                <div key={tx._id} className="flex items-center justify-between p-3 hover:bg-white/[0.02] rounded-xl border border-transparent hover:border-white/5 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${tx.type === 'withdraw' ? 'border-nexus-magenta/20 bg-nexus-magenta/5 text-nexus-magenta' : 'border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary'}`}>
                      {tx.type === 'withdraw' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold capitalize text-slate-200">{tx.type}</p>
                      <p className="text-[10px] text-slate-600">{tx.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold ${tx.type === 'withdraw' ? 'text-nexus-magenta' : 'text-nexus-primary'}`}>
                      {tx.type === 'withdraw' ? '-' : '+'}${tx.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-700">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <div className="text-center py-10 opacity-30">
                  <Clock className="mx-auto text-white mb-3" size={28} />
                  <p className="text-[10px] font-semibold">No transactions yet</p>
                </div>
              )}
            </div>
            {recentTransactions.length > 0 && (
              <Link to="/dashboard/history" className="w-full py-3 mt-4 glass border-white/5 text-[10px] font-semibold text-slate-500 hover:text-white hover:border-white/10 rounded-xl flex items-center justify-center gap-2 transition-all">
                View All <ChevronRight size={12} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Goal Edit Modal */}
      <AnimatePresence>
        {isEditingGoal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditingGoal(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="nexus-card w-full max-w-md p-8 border-white/10 relative z-10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">Set Investment Goal</h3>
                  <p className="text-[10px] text-nexus-gold mt-0.5">Update your financial target</p>
                </div>
                <button onClick={() => setIsEditingGoal(false)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all"><X size={18} /></button>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Target Amount ($)</p>
                  <div className="relative group">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-gold transition-colors" size={16} />
                    <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-nexus-gold/40 transition-all font-bold text-sm text-white" autoFocus />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Target Date</p>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-gold transition-colors" size={16} />
                    <input type="date" value={goalDate} onChange={(e) => setGoalDate(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-nexus-gold/40 transition-all font-medium text-sm text-white" />
                  </div>
                </div>
                <button onClick={handleSaveGoal} className="w-full py-3 bg-nexus-gold text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02] active:scale-95 text-sm">
                  Save Goal <CheckCircle2 size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
