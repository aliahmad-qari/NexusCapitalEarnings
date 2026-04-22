import React, { useState, useEffect } from 'react';
import { 
  Download, Upload, Wallet as WalletIcon, CreditCard, ChevronRight, 
  ShieldCheck, Activity, Award, ArrowUpRight, ArrowDownRight, 
  History as HistoryIcon, Filter, Clock, CheckCircle2, AlertCircle,
  Repeat, Shield, Lock, X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { motion, AnimatePresence } from 'motion/react';

export const Wallet = () => {
  const { user, refreshUser } = useAuth();
  const [activeAction, setActiveAction] = useState<'deposit' | 'withdraw' | 'transfer' | null>(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyType, setHistoryType] = useState('all');
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'pending'; message: string } | null>(null);

  useEffect(() => {
    fetchHistory();
    
    // Set up periodic polling for real-time updates
    const pollInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshUser();
        fetchHistory();
      }
    }, 15000); // Poll every 15 seconds

    return () => clearInterval(pollInterval);
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/wallet/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    
    // Simple validation for withdrawal
    if (activeAction === 'withdraw' && (user?.wallet?.totalBalance || 0) < Number(amount)) {
      setAlert({ type: 'error', message: 'Insufficient balance for this withdrawal.' });
      return;
    }

    setLoading(true);
    setAlert({ type: 'pending', message: 'Processing your request...' });

    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const endpoint = activeAction === 'deposit' ? '/api/wallet/deposit' : '/api/wallet/withdraw';
      const res = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(amount), method: paymentMethod })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setAlert({ 
        type: 'success', 
        message: `${activeAction === 'deposit' ? 'Deposit' : 'Withdrawal'} request submitted! Our team will review it shortly.` 
      });
      setAmount('');
      setActiveAction(null);
      refreshUser();
      fetchHistory();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const filteredHistory = history.filter((item: any) => {
    if (historyType === 'all') return true;
    return item.type === historyType;
  });

  const totalWithdrawn = history
    .filter((item: any) => item.type === 'withdraw' && (item.status === 'completed' || item.status === 'approved'))
    .reduce((acc, curr: any) => acc + curr.amount, 0);

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 pb-8 lg:pb-0 text-slate-200 uppercase tracking-tight">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-nexus-primary">
            <CreditCard size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Capital Manager</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Nexus <span className="text-gradient">Ledger</span></h2>
          <p className="text-slate-500 text-sm max-w-md normal-case font-medium">Manage your institutional capital nodes, settlements, and harvesting cycles.</p>
        </div>
        
        {/* Alerts / Notifications */}
        <AnimatePresence>
          {alert && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-4 rounded-2xl border flex items-center gap-4 backdrop-blur-xl ${
                alert.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                alert.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' :
                'bg-nexus-primary/10 border-nexus-primary/30 text-nexus-primary'
              }`}
            >
              {alert.type === 'success' ? <CheckCircle2 size={20} /> : alert.type === 'error' ? <AlertCircle size={20} /> : <Clock size={20} className="animate-spin" />}
              <span className="text-[10px] font-black uppercase tracking-widest">{alert.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 1. Wallet Summary (Top Section) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Available Balance', value: user?.wallet.totalBalance, icon: WalletIcon, color: 'text-nexus-primary' },
          { label: 'Total Deposits', value: user?.wallet.depositBalance, icon: Download, color: 'text-nexus-primary' },
          { label: 'Total Withdrawn', value: totalWithdrawn, icon: Upload, color: 'text-rose-500' },
          { label: 'Total Profit Earned', value: user?.wallet.profitBalance, icon: Award, color: 'text-nexus-primary' },
        ].map((item, i) => (
          <div key={item.label} className="nexus-card p-8 flex flex-col justify-between h-44 bg-gradient-to-tr from-white/[0.01] to-transparent border-white/5 group hover:border-white/10 transition-all">
            <div className="flex justify-between items-start">
              <div className="p-3 glass rounded-2xl border-white/5 group-hover:scale-110 transition-transform">
                <item.icon className={item.color} size={24} />
              </div>
              <Activity size={18} className="text-slate-700 opacity-20" />
            </div>
            <div>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.25em]">{item.label}</p>
              <h3 className="text-3xl font-black mt-1 tracking-tighter text-white">${item.value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* 2. Quick Actions */}
      <section className="flex flex-wrap items-center gap-4">
        {[
          { id: 'deposit', label: 'Deposit Funds', icon: Download, color: 'gradient-primary', text: 'text-slate-900' },
          { id: 'withdraw', label: 'Withdraw Funds', icon: Upload, color: 'bg-rose-500 shadow-rose-500/20', text: 'text-white' },
          { id: 'transfer', label: 'Internal Transfer', icon: Repeat, color: 'glass border-white/10', text: 'text-slate-300' },
        ].map((action) => (
          <button 
            key={action.id}
            onClick={() => setActiveAction(activeAction === (action.id as any) ? null : action.id as any)}
            className={`px-8 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-[1.03] active:scale-95 shadow-xl ${action.color} ${action.text} ${activeAction === action.id ? 'ring-2 ring-white/20' : ''}`}
          >
            <action.icon size={20} /> {action.label}
          </button>
        ))}
      </section>

      <AnimatePresence>
        {activeAction && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="nexus-card rounded-[48px] p-10 md:p-14 border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${activeAction === 'deposit' ? 'bg-nexus-primary/10 text-nexus-primary' : 'bg-rose-500/10 text-rose-500'}`}>
                    {activeAction === 'deposit' ? <Download size={24} /> : <Upload size={24} />}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter uppercase">{activeAction} Terminal</h3>
                    <p className="text-[10px] text-slate-500 font-black tracking-[0.4em] uppercase">Manual Settlement Flow</p>
                  </div>
                </div>
                <button onClick={() => setActiveAction(null)} className="p-3 glass rounded-2xl hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-10">
                  {/* Common Amount Input */}
                  <div className="space-y-4">
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] px-4 font-mono">Amount (USD)</p>
                    <div className="bg-black/40 border border-white/5 rounded-[40px] p-8 flex flex-col items-center group focus-within:border-nexus-primary/40 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-black text-nexus-primary opacity-30">$</span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="bg-transparent text-6xl md:text-7xl font-black outline-none w-full text-center tracking-tighter placeholder:text-white/[0.03] text-white"
                          autoFocus
                        />
                      </div>
                    </div>
                    {activeAction === 'withdraw' && (
                      <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest px-4">
                        Max available: ${user?.wallet.totalBalance.toLocaleString()}
                      </p>
                    )}
                    {activeAction === 'deposit' && (
                      <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest px-4">
                        Minimum deposit: $10.00 | Fee: $0.00
                      </p>
                    )}
                  </div>

                  {activeAction === 'deposit' && (
                    <div className="space-y-4">
                       <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] px-4 font-mono">Select Payment Node</p>
                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {['CRYPTO', 'BANK', 'USDT'].map(m => (
                            <button 
                              key={m}
                              type="button"
                              onClick={() => setPaymentMethod(m)}
                              className={`p-5 rounded-2xl border text-[10px] font-black transition-all ${paymentMethod === m ? 'border-nexus-primary bg-nexus-primary/5 text-nexus-primary' : 'border-white/5 bg-white/[0.02] text-slate-500 hover:border-white/20'}`}
                            >
                              {m}
                            </button>
                          ))}
                       </div>
                    </div>
                  )}

                  {activeAction === 'withdraw' && (
                    <div className="space-y-4">
                       <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] px-4 font-mono">Recipient Configuration</p>
                       <input 
                         type="text" 
                         placeholder="WALLET ADDRESS / ACCOUNT DETAILS"
                         className="w-full bg-black/20 border border-white/5 rounded-[32px] py-6 px-8 outline-none focus:border-rose-500/40 text-xs font-black tracking-widest placeholder:text-slate-800"
                       />
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between space-y-12">
                   <div className="space-y-6">
                      <div className="p-6 glass rounded-3xl border border-white/5 flex items-start gap-4">
                        <Lock size={20} className="text-nexus-primary shrink-0 mt-1" />
                        <div>
                          <h4 className="text-[10px] font-black text-slate-300 mb-1 uppercase tracking-widest leading-none">Encrypted Processing</h4>
                          <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase normal-case tracking-normal">All settlements are audited through a secure institutional-grade node sequence.</p>
                        </div>
                      </div>
                      <div className="p-6 glass rounded-3xl border border-white/5 flex items-start gap-4">
                        <Shield size={20} className="text-nexus-magenta shrink-0 mt-1" />
                        <div>
                          <h4 className="text-[10px] font-black text-slate-300 mb-1 uppercase tracking-widest leading-none">Security Info</h4>
                          <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase normal-case tracking-normal">Withdrawals are generally processed within 24 standard terminal hours.</p>
                        </div>
                      </div>
                   </div>

                   <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-20 rounded-[32px] flex items-center justify-center gap-4 transition-all uppercase text-[11px] font-black tracking-[0.3em] shadow-xl ${
                      activeAction === 'deposit' ? 'gradient-primary text-slate-900 shadow-nexus-primary/20' : 
                      activeAction === 'withdraw' ? 'bg-rose-500 text-white shadow-rose-500/20' : 
                      'glass border-white/10 text-white'
                    } hover:scale-[1.02] active:scale-95`}
                   >
                     {loading ? 'Transmitting Registry...' : `Confirm ${activeAction} Sequence`}
                     <ChevronRight size={18} />
                   </button>
                </div>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 5. Transaction History */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-2">
          <div className="flex items-center gap-3">
            <div className="p-3 glass rounded-2xl border-white/5">
              <HistoryIcon size={20} className="text-nexus-primary" />
            </div>
            <h3 className="text-2xl font-black tracking-tighter uppercase">Audit <span className="text-gradient">Ledger</span></h3>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full sm:w-auto no-scrollbar">
            {['all', 'deposit', 'withdraw', 'profit', 'referral', 'investment'].map(t => (
              <button 
                key={t}
                onClick={() => setHistoryType(t)}
                className={`px-5 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${historyType === t ? 'bg-nexus-primary/10 border-nexus-primary/30 text-nexus-primary' : 'bg-white/[0.02] border-white/5 text-slate-600 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="nexus-card p-0 overflow-hidden border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Entry Date</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Operation Type</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Amount (USD)</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Registry Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredHistory.map((item: any) => (
                  <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-8 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Clock size={14} className="text-slate-700" />
                        <span className="text-xs font-black text-slate-300">
                          {new Date(item.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                       <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
                         item.type === 'deposit' || item.type === 'profit' ? 'border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary' :
                         item.type === 'withdraw' ? 'border-rose-500/20 bg-rose-500/5 text-rose-500' :
                         'border-white/10 bg-white/5 text-slate-400'
                       }`}>
                         {item.type === 'deposit' ? <ArrowDownRight size={12} /> : item.type === 'withdraw' ? <ArrowUpRight size={12} /> : null}
                         {item.type}
                       </span>
                    </td>
                    <td className="px-8 py-8 whitespace-nowrap">
                       <span className={`text-lg font-black tracking-tighter ${item.type === 'withdraw' ? 'text-rose-500' : 'text-slate-200'}`}>
                          {item.type === 'withdraw' ? '-' : '+'}${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       </span>
                    </td>
                    <td className="px-8 py-8">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-[0.2em] ${
                        item.status === 'completed' || item.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        item.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                        'bg-rose-500/10 border-rose-500/20 text-rose-500'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-8 text-right font-mono text-[10px] text-slate-700 uppercase tracking-tighter">
                      NODE_SET_{item._id.slice(-8).toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredHistory.length === 0 && (
             <div className="p-20 flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 glass rounded-[32px] flex items-center justify-center">
                  <Activity size={32} className="text-slate-700" />
                </div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">No matching records found in registry</p>
             </div>
          )}
        </div>
      </section>

    </div>
  );
};
