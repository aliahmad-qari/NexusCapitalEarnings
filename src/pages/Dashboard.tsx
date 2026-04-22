import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, ShieldCheck, Activity,
  Plus, Send, Briefcase, Zap, Bell, Copy, CheckCircle2, Clock, Award,
  Target, Calendar, Edit3, X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState({
    totalInvested: 0,
    dailyProfit: 0,
    activeInvestments: 0
  });
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

  useEffect(() => {
    fetchPerformance(chartRange);
  }, [chartRange]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/investment/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!Array.isArray(data)) return;
      
      setInvestments(data);
      const total = data.reduce((acc: number, inv: any) => acc + inv.amount, 0);
      const active = data.filter((inv: any) => inv.status === 'active').length;
      const daily = data
        .filter((inv: any) => inv.status === 'active')
        .reduce((acc: number, inv: any) => acc + (inv.amount * inv.dailyProfitPercent) / 100, 0);
      
      setStats({ totalInvested: total, dailyProfit: daily, activeInvestments: active });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/wallet/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!Array.isArray(data)) return;
      setRecentTransactions(data.slice(0, 3)); // Only keep 3 as requested
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPerformance = async (range: string) => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/analytics/performance?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setChartData(data);
      }
    } catch (err) {
      console.error('Error fetching performance:', err);
    }
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          investmentGoal: {
            targetAmount: Number(goalAmount),
            targetDate: goalDate
          }
        })
      });
      if (res.ok) {
        setIsEditingGoal(false);
        refreshUser();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const goalProgress = user?.investmentGoal?.targetAmount && user.investmentGoal.targetAmount > 0
    ? Math.min(Math.round((stats.totalInvested / user.investmentGoal.targetAmount) * 100), 100)
    : 0;

  const daysLeft = user?.investmentGoal?.targetDate
    ? Math.max(0, Math.ceil((new Date(user.investmentGoal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-4 md:pt-8 lg:pt-12 max-w-[1600px] mx-auto space-y-8">
      
      {/* 1. Top Bar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, <span className="text-gradient font-black">{user?.name}</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">NEXUS Core System status: <span className="text-nexus-primary uppercase font-bold text-[10px] tracking-widest">Running</span></p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2.5 glass rounded-2xl hover:bg-white/5 transition-all group">
            <Bell size={20} className="text-slate-400 group-hover:text-white" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-nexus-magenta rounded-full"></span>
          </button>
        </div>
      </header>

      {/* 2. Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/wallet" className="gradient-primary soft-glow-primary p-4 rounded-3xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-100">
          <Plus size={20} className="text-slate-900" />
          <span className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Deposit</span>
        </Link>
        <Link to="/plans" className="glass p-4 rounded-3xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all text-nexus-primary border-nexus-primary/20">
          <Zap size={20} />
          <span className="font-extrabold text-sm uppercase tracking-wider">Invest</span>
        </Link>
        <Link to="/wallet" className="glass p-4 rounded-3xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all text-slate-200">
          <ArrowUpRight size={20} className="text-nexus-magenta" />
          <span className="font-extrabold text-sm uppercase tracking-wider">Withdraw</span>
        </Link>
      </section>

      {/* 3. Wallet Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Available Balance', value: user?.wallet.totalBalance, icon: Wallet, gradient: 'primary' },
          { label: 'Total Invested', value: stats.totalInvested, icon: Briefcase, gradient: 'secondary' },
          { label: 'Yield Earned', value: user?.wallet.profitBalance, icon: TrendingUp, gradient: 'primary' },
          { label: 'Referral Earnings', value: user?.wallet.referralEarnings, icon: Award, gradient: 'secondary' },
        ].map((item, i) => (
          <div key={item.label} className="nexus-card p-6 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className={`p-2.5 rounded-xl bg-nexus-${item.gradient}/10 border border-nexus-${item.gradient}/20`}>
                <item.icon className={item.gradient === 'primary' ? 'text-nexus-primary' : 'text-nexus-magenta'} size={20} />
              </div>
              <Activity className="text-white/10" size={16} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{item.label}</p>
              <h2 className="text-2xl font-black mt-1">${item.value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Investment Goals Section */}
          <div className="nexus-card p-8 bg-gradient-to-br from-white/[0.01] to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <Target size={120} className="text-nexus-primary" />
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-nexus-primary mb-1">
                  <Target size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Investment Milestone</span>
                </div>
                <h3 className="text-2xl font-black tracking-tighter uppercase">Capital Objective</h3>
                <p className="text-slate-500 text-sm max-w-xs">Programmed target for institutional growth and wealth accumulation.</p>
              </div>

              {!isEditingGoal ? (
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Target Pool</p>
                    <p className="text-3xl font-black tracking-tighter text-white">
                      ${user?.investmentGoal?.targetAmount?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setGoalAmount(user?.investmentGoal?.targetAmount || 0);
                      setGoalDate(user?.investmentGoal?.targetDate ? new Date(user.investmentGoal.targetDate).toISOString().split('T')[0] : '');
                      setIsEditingGoal(true);
                    }}
                    className="flex items-center gap-1.5 text-[10px] font-black text-nexus-primary uppercase tracking-widest hover:text-white transition-colors"
                  >
                    <Edit3 size={12} /> Adjust Objective
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-end gap-3 shrink-0">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Amount</p>
                    <input 
                      type="number"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(Number(e.target.value))}
                      className="bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-sm font-black text-white w-32 outline-none focus:border-nexus-primary/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Deadline</p>
                    <input 
                      type="date"
                      value={goalDate}
                      onChange={(e) => setGoalDate(e.target.value)}
                      className="bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-sm font-black text-white w-40 outline-none focus:border-nexus-primary/30"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveGoal} className="p-2.5 gradient-primary rounded-xl text-slate-900 transition-transform active:scale-90">
                      <CheckCircle2 size={18} />
                    </button>
                    <button onClick={() => setIsEditingGoal(false)} className="p-2.5 glass rounded-xl text-slate-500 hover:text-white transition-transform active:scale-90">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-4xl font-black tracking-tighter text-nexus-primary">{goalProgress}%</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Progress Index</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-200 tracking-tighter">
                    {daysLeft !== null ? `${daysLeft} Units` : 'N/A'}
                  </p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Temporal Distance</p>
                </div>
              </div>
              
              <div className="h-4 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden p-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${goalProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full gradient-primary shadow-[0_0_15px_rgba(0,245,160,0.3)]"
                />
              </div>

              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-600 pt-1">
                <span>Deployment Alpha: ${stats.totalInvested.toLocaleString()}</span>
                <span>Milestone: ${user?.investmentGoal?.targetAmount?.toLocaleString() || '0'}</span>
              </div>
            </div>
          </div>

          {/* 4. Status Card */}
          <div className={`glass p-6 rounded-[32px] border-l-4 ${stats.activeInvestments > 0 ? 'border-nexus-primary bg-nexus-primary/[0.02]' : 'border-slate-700 bg-slate-900/40'} flex flex-col md:flex-row justify-between items-center gap-6`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stats.activeInvestments > 0 ? 'bg-nexus-primary/20 text-nexus-primary animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg leading-none">NEXUS Node Status: <span className={stats.activeInvestments > 0 ? 'text-nexus-primary' : 'text-slate-500'}>{stats.activeInvestments > 0 ? 'Active' : 'Standby'}</span></h4>
                <p className="text-slate-500 text-sm mt-1">{stats.activeInvestments > 0 ? 'AI-driven high-frequency strategies are live.' : 'Deploy capital to initialize node strategies.'}</p>
              </div>
            </div>
            {!stats.activeInvestments && (
              <Link to="/plans" className="px-8 py-3.5 gradient-primary text-slate-900 font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-nexus-primary/20 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap">
                Deploy Now
              </Link>
            )}
          </div>

          {/* 5. Performance Analytics */}
          <div className="nexus-card p-8 group">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-nexus-primary/10 border border-nexus-primary/20">
                  <Activity className="text-nexus-primary" size={18} />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Performance Flow</h3>
              </div>
              <div className="flex bg-white/[0.03] border border-white/5 rounded-xl p-1 gap-1">
                {['7D', '1M', '3M', 'ALL'].map((r) => (
                  <button 
                    key={r} 
                    onClick={() => setChartRange(r)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${chartRange === r ? 'gradient-primary text-slate-900 shadow-md' : 'text-slate-500 hover:text-white'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.length > 0 ? chartData : []}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F5A0" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00F5A0" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#030408', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '12px' }}
                    itemStyle={{ color: '#00F5A0', fontWeight: '900', fontSize: '14px' }}
                    labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#00F5A0" strokeWidth={4} fillOpacity={1} fill="url(#chartGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 6. Active Investments */}
          {investments.filter(i => i.status === 'active').length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Zap size={20} className="text-nexus-primary" />
                  Active Deployments
                </h3>
                <Link to="/plans" className="text-xs font-bold text-nexus-primary hover:underline">View All Strategies</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investments.filter(i => i.status === 'active').map((inv) => (
                  <div key={inv._id} className="nexus-card p-6 group">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h5 className="font-black text-slate-200 group-hover:text-white transition-colors uppercase tracking-tight">{inv.planName}</h5>
                        <p className="text-[10px] font-black text-nexus-primary uppercase mt-0.5">Strategy Executing</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black tracking-tight">${inv.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Allocated</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500 mb-2">
                      <span>Progress</span>
                      <span className="text-nexus-primary">Daily +{inv.dailyProfitPercent}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '45%' }}
                        className="gradient-primary h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* 7. Recent Activity */}
          <div className="nexus-card p-6">
            <h4 className="font-black text-sm uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Audit Stream</h4>
            <div className="space-y-4">
              {recentTransactions.map((tx: any) => (
                <div key={tx._id} className="flex items-center justify-between group p-3 hover:bg-white/[0.02] rounded-2xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${tx.type === 'withdraw' ? 'border-nexus-magenta/20 bg-nexus-magenta/5 text-nexus-magenta' : 'border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary'}`}>
                      {tx.type === 'withdraw' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold capitalize text-slate-200">{tx.type}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">{tx.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ${tx.type === 'withdraw' ? 'text-nexus-magenta' : 'text-nexus-primary'}`}>
                      {tx.type === 'withdraw' ? '-' : '+'}${tx.amount.toLocaleString()}
                    </p>
                    <p className="text-[9px] text-slate-700 font-bold">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="mx-auto text-slate-800 mb-2" size={32} />
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">No activity found</p>
                </div>
              )}
            </div>
          </div>

          {/* 8. Market Data */}
          <div className="nexus-card p-6 bg-gradient-to-br from-slate-900/40 to-transparent">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-extrabold text-sm uppercase tracking-widest">Network Assets</h4>
              <Activity className="text-slate-600" size={16} />
            </div>
            <div className="space-y-5">
              {marketAssets.map(asset => (
                <div key={asset.symbol} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-[10px] text-slate-400">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{asset.name}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">{asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black">${asset.price}</p>
                    <p className={`text-[9px] font-black ${asset.trend === 'up' ? 'text-nexus-primary' : 'text-nexus-magenta'}`}>{asset.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Card (Keep as requested) */}
          <div className="nexus-card p-6 bg-gradient-to-tr from-nexus-purple/10 to-nexus-magenta/10 border-nexus-magenta/20">
            <div className="flex items-center gap-2 mb-4">
               <Award size={20} className="text-nexus-magenta" />
               <h4 className="font-black text-xs uppercase tracking-[0.25em]">Nexus Referral</h4>
            </div>
            <p className="text-[11px] text-slate-400 mb-5 leading-relaxed font-medium">Invite colleagues to expand the institutional network and accrue <span className="text-nexus-magenta">dividend tier bonuses</span>.</p>
            <div className="p-3 bg-black/40 rounded-2xl flex items-center justify-between border border-white/5 mb-4 group cursor-pointer" onClick={handleCopyCode}>
              <span className="text-xs font-mono text-slate-300 tracking-wider">CODE: {user?.referralCode || 'NEXUS-X'}</span>
              {copied ? <CheckCircle2 className="text-nexus-primary" size={16} /> : <Copy className="text-slate-600 group-hover:text-white" size={16} />}
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Accrued Rewards</span>
               <span className="text-sm font-black text-nexus-magenta">${user?.wallet.referralEarnings.toFixed(2)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
