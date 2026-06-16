import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Upload, Wallet as WalletIcon, ChevronRight, Activity, Award, ArrowUpRight, ArrowDownRight, History as HistoryIcon, Clock, CheckCircle2, AlertCircle, Lock, X, Shield, Cpu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { formatPKR } from '../utils/currency.ts';
import { API_BASE } from '../utils/api.ts';

export const Wallet = () => {
  const { user, refreshUser } = useAuth();
  const [activeAction, setActiveAction] = useState<'withdraw' | null>(null);
  const [amount, setAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyType, setHistoryType] = useState('all');
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'pending'; message: string } | null>(null);

  useEffect(() => {
    fetchHistory();
    refreshUser();
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') { refreshUser(); fetchHistory(); }
    }, 10000);
    const onVisible = () => { if (document.visibilityState === 'visible') { refreshUser(); fetchHistory(); } };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(pollInterval); document.removeEventListener('visibilitychange', onVisible); };
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/wallet/history`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setHistory(data);
    } catch (err) { console.error(err); }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    if ((user?.wallet?.totalBalance || 0) < Number(amount)) {
      setAlert({ type: 'error', message: 'Insufficient balance.' });
      return;
    }
    if (Number(amount) < 1000) {
      setAlert({ type: 'error', message: 'Minimum withdrawal amount is PKR 1,000' });
      return;
    }

    setLoading(true);
    setAlert({ type: 'pending', message: 'Processing your request...' });
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/wallet/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(amount), destination: destinationAddress }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAlert({ type: 'success', message: `Withdrawal request of ${formatPKR(Number(amount))} submitted successfully.` });
      setAmount('');
      setDestinationAddress('');
      setActiveAction(null);
      refreshUser();
      fetchHistory();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 6000);
    }
  };

  const filteredHistory = history.filter((item: any) => historyType === 'all' || item.type === historyType);
  const totalWithdrawn = history
    .filter((item: any) => item.type === 'withdraw' && (item.status === 'completed' || item.status === 'approved'))
    .reduce((acc, curr: any) => acc + curr.amount, 0);

  const userBalance = user?.wallet?.totalBalance || 0;
  const userReferrals = user?.referralCount || 0;
  const hasMinBalance = userBalance >= 1000;
  const hasMinReferrals = userReferrals >= 2;
  const isWithdrawLocked = !hasMinBalance || !hasMinReferrals;

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-6 pb-16 max-w-[1700px] mx-auto space-y-6 selection:bg-nexus-primary/20 selection:text-nexus-primary">

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] to-[#080c18]" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/8 via-transparent to-nexus-primary/8" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-nexus-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 w-fit">
              <WalletIcon size={11} className="text-cyan-400" />
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">My Wallet</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-nexus-primary">Funds</span></h2>
            <p className="text-slate-500 text-xs max-w-md">Track your balance, withdraw earnings, and view all transactions.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="px-4 py-3 glass rounded-xl border border-white/8 text-center">
              <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-0.5">Balance</p>
              <p className="text-sm font-bold text-white">{formatPKR(user?.wallet.totalBalance || 0)}</p>
            </div>
            <div className="px-4 py-3 glass rounded-xl border border-white/8 text-center">
              <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-0.5">Profits</p>
              <p className="text-sm font-bold text-nexus-primary">+{formatPKR(user?.wallet.profitBalance || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Available Balance', value: user?.wallet.totalBalance,  icon: WalletIcon,     color: 'text-nexus-primary',  trend: 'Withdrawable' },
          { label: 'Total Deposited',   value: user?.wallet.depositBalance, icon: Download,       color: 'text-cyan-400',       trend: 'Cumulative'   },
          { label: 'Total Withdrawn',   value: totalWithdrawn,              icon: Upload,         color: 'text-nexus-magenta',  trend: 'Completed'    },
          { label: 'Profit Earned',     value: user?.wallet.profitBalance,  icon: Award,          color: 'text-emerald-400',    trend: 'From ROI'     },
        ].map((item) => (
          <div key={item.label} className="nexus-card flex flex-col justify-between h-[110px] group">
            <div className="flex justify-between items-start">
              <div className="p-1.5 glass rounded-lg border-white/5 group-hover:border-nexus-primary/20 transition-colors">
                <item.icon className={item.color} size={14} />
              </div>
              <span className="text-[8px] text-slate-700">{item.trend}</span>
            </div>
            <div>
              <p className="text-slate-500 text-[8px] font-medium uppercase tracking-wider mb-0.5">{item.label}</p>
              <h3 className="text-sm font-bold text-white">{formatPKR(item.value || 0)}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Alert */}
      <AnimatePresence>
        {alert && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`p-4 rounded-2xl border flex items-center gap-3 shadow-xl ${alert.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : alert.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-nexus-primary/10 border-nexus-primary/20 text-nexus-primary'}`}>
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
              {alert.type === 'success' ? <CheckCircle2 size={16} /> : alert.type === 'error' ? <AlertCircle size={16} /> : <Cpu size={16} className="animate-spin" />}
            </div>
            <span className="text-xs font-medium leading-relaxed">{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">

          {/* Deposit → always goes to Plans (all deposits are plan-based) */}
          <Link
            to="/dashboard/plans"
            className="px-5 py-3 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all hover:scale-[1.03] active:scale-95 shadow-lg gradient-primary text-slate-900 shadow-nexus-primary/20"
          >
            <Download size={15} /> Deposit via Plans
          </Link>

          {/* Withdraw */}
          <button
            onClick={() => setActiveAction(activeAction === 'withdraw' ? null : 'withdraw')}
            className={`px-5 py-3 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all hover:scale-[1.03] active:scale-95 shadow-lg ${
              isWithdrawLocked
                ? 'bg-slate-800 text-slate-500 border border-white/5 hover:text-white'
                : 'bg-nexus-magenta text-white shadow-nexus-magenta/20'
            } ${activeAction === 'withdraw' ? 'ring-2 ring-white/30' : ''}`}
          >
            {isWithdrawLocked ? <Lock size={15} /> : <Upload size={15} />}
            {isWithdrawLocked ? 'Withdraw (Locked)' : 'Withdraw'}
          </button>
        </div>

        {/* Withdraw panel */}
        <AnimatePresence>
          {activeAction === 'withdraw' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
              className="nexus-card rounded-2xl p-6 md:p-8 border-white/10 shadow-2xl">

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-nexus-magenta/10 border-nexus-magenta/20 text-nexus-magenta">
                    <Upload size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Withdraw</h3>
                    <p className="text-[10px] text-slate-500">Enter amount and payout details</p>
                  </div>
                </div>
                <button onClick={() => setActiveAction(null)} className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all border-white/5">
                  <X size={16} />
                </button>
              </div>

              {isWithdrawLocked ? (
                <div className="py-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
                    <Lock size={28} />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h4 className="text-sm font-bold text-white">Withdrawal Locked</h4>
                    <p className="text-xs text-slate-500">Both conditions below must be true to unlock withdrawals.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                    <div className={`p-4 rounded-xl border text-left flex items-start gap-3 bg-white/[0.01] ${hasMinBalance ? 'border-emerald-500/20' : 'border-white/5'}`}>
                      <div className={`p-1.5 rounded-lg shrink-0 ${hasMinBalance ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {hasMinBalance ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">Minimum Balance</h5>
                        <p className="text-[10px] text-slate-500 mt-1">At least PKR 1,000 available.</p>
                        <p className="text-xs font-black text-slate-300 mt-2">{formatPKR(userBalance)} / PKR 1,000</p>
                      </div>
                    </div>
                    <div className={`p-4 rounded-xl border text-left flex items-start gap-3 bg-white/[0.01] ${hasMinReferrals ? 'border-emerald-500/20' : 'border-white/5'}`}>
                      <div className={`p-1.5 rounded-lg shrink-0 ${hasMinReferrals ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {hasMinReferrals ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">Referrals Required</h5>
                        <p className="text-[10px] text-slate-500 mt-1">At least 2 successful referrals.</p>
                        <p className="text-xs font-black text-slate-300 mt-2">{userReferrals} / 2 Referrals</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleWithdraw} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-5">
                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Amount (PKR)</p>
                      <div className="bg-black/60 border border-white/5 rounded-2xl p-6 flex flex-col items-center focus-within:border-nexus-magenta/30 transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-nexus-magenta opacity-40">PKR</span>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0"
                            className="bg-transparent text-3xl font-bold outline-none w-full text-center text-white placeholder:text-white/5"
                            autoFocus
                          />
                        </div>
                        <div className="w-full h-px bg-white/5 my-4" />
                        <p className="text-[10px] text-slate-700">
                          Available: <span className="text-nexus-primary font-semibold">{formatPKR(userBalance)}</span> · Min: PKR 1,000
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Payout Destination</p>
                      <input
                        required
                        type="text"
                        value={destinationAddress}
                        onChange={(e) => setDestinationAddress(e.target.value)}
                        placeholder="Account number, IBAN, or wallet address"
                        className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-nexus-magenta/40 text-xs text-white placeholder:text-slate-700"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <div className="p-4 glass rounded-xl border border-white/5 flex items-start gap-3">
                        <div className="p-2 bg-white/5 rounded-lg text-nexus-primary shrink-0">
                          <Lock size={15} />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-white mb-1">Secure Transaction</h4>
                          <p className="text-[10px] text-slate-500 leading-relaxed">Processed with end-to-end encryption and instant hold.</p>
                        </div>
                      </div>
                      <div className="p-4 glass rounded-xl border border-white/5 flex items-start gap-3">
                        <div className="p-2 bg-white/5 rounded-lg text-nexus-magenta shrink-0">
                          <Shield size={15} />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-white mb-1">Admin Approval</h4>
                          <p className="text-[10px] text-slate-500 leading-relaxed">Withdrawals are reviewed and processed within 24 hours.</p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-semibold text-sm shadow-xl bg-nexus-magenta text-white shadow-nexus-magenta/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                      {loading
                        ? <><div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /><span>Processing...</span></>
                        : <>Confirm Withdrawal <ChevronRight size={18} /></>
                      }
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Transaction History */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 glass rounded-xl border-white/5">
              <HistoryIcon size={16} className="text-nexus-primary" />
            </div>
            <h3 className="text-sm font-bold text-white">Transaction History</h3>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {['all', 'deposit', 'withdraw', 'profit', 'referral', 'investment'].map((t) => (
              <button key={t} onClick={() => setHistoryType(t)}
                className={`px-3.5 py-2 rounded-lg border text-[10px] font-medium uppercase tracking-wider transition-all whitespace-nowrap ${historyType === t ? 'bg-nexus-primary/10 border-nexus-primary/20 text-nexus-primary' : 'bg-white/[0.02] border-white/5 text-slate-600 hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="nexus-card p-0 overflow-hidden border-white/5 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-5 py-4 text-[10px] font-medium text-slate-600 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-4 text-[10px] font-medium text-slate-600 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-4 text-[10px] font-medium text-slate-600 uppercase tracking-wider">Amount (PKR)</th>
                  <th className="px-5 py-4 text-[10px] font-medium text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-4 text-[10px] font-medium text-slate-600 uppercase tracking-wider text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredHistory.map((item: any) => (
                  <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-slate-700" />
                        <span className="text-xs text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-medium uppercase tracking-wider ${
                        item.type === 'deposit' || item.type === 'profit'
                          ? 'border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary'
                          : item.type === 'withdraw'
                          ? 'border-nexus-magenta/20 bg-nexus-magenta/5 text-nexus-magenta'
                          : 'border-white/10 bg-white/5 text-slate-400'
                      }`}>
                        {item.type === 'deposit' ? <ArrowDownRight size={11} /> : item.type === 'withdraw' ? <ArrowUpRight size={11} /> : <Activity size={11} />}
                        {item.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${item.type === 'withdraw' ? 'text-nexus-magenta' : 'text-slate-200'}`}>
                        {item.type === 'withdraw' ? '−' : '+'}{formatPKR(item.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-medium px-3 py-1 rounded-lg border uppercase tracking-wider ${
                        item.status === 'completed' || item.status === 'approved'
                          ? 'bg-emerald-500/10 border-emerald-400/20 text-emerald-400'
                          : item.status === 'pending'
                          ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-[10px] text-slate-700 uppercase tracking-wider">
                      #{item._id.slice(-8).toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredHistory.length === 0 && (
            <div className="p-16 flex flex-col items-center justify-center space-y-4 opacity-40">
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-white/5">
                <Activity size={22} className="text-slate-600" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-white mb-1">No Transactions</p>
                <p className="text-[10px] text-slate-500">No transactions match your filter.</p>
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
