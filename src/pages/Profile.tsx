import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon, Mail, Copy, LogOut, Shield, Award, Users, ChevronRight, Settings, X, Lock, Wallet, Briefcase, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Trash2, CheckCircle2, Activity, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { motion, AnimatePresence } from 'motion/react';
import { formatPKR } from '../utils/currency.ts';

export const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/wallet/history`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setRecentTransactions(data.slice(0, 5));
    } catch (err) { console.error(err); }
  };

  const copyReferralCode = () => {
    if (user?.referralCode) { navigator.clipboard.writeText(user.referralCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newName, password: newPassword || undefined })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setIsEditing(false); setNewPassword(''); refreshUser();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="px-3 sm:px-5 md:px-8 pt-3 sm:pt-5 pb-16 max-w-[1400px] mx-auto space-y-3 sm:space-y-4 text-slate-200">

      {/* ── Identity Card ── */}
      <section className="relative overflow-hidden rounded-xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0d1225] to-[#080c18]" />
        <div className="absolute inset-0 bg-gradient-to-r from-nexus-primary/6 via-transparent to-nexus-magenta/6" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-nexus-primary/40 to-transparent" />
        <div className="relative z-10 p-3 sm:p-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl p-0.5" style={{ background: 'linear-gradient(135deg,#00e6a0,#a855f7)' }}>
                <div className="w-full h-full rounded-[calc(0.75rem-2px)] bg-[#030408] overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="avatar" className="w-full h-full object-cover scale-110" referrerPolicy="no-referrer" />
                </div>
              </div>
              <button onClick={() => setIsEditing(true)} className="absolute -bottom-1 -right-1 bg-white text-slate-900 p-1.5 rounded-lg shadow-md hover:scale-110 transition-all">
                <Settings size={11} />
              </button>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1 min-w-0 space-y-2">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 glass rounded-full border-nexus-primary/20 text-nexus-primary mb-1">
                  <div className="w-1 h-1 rounded-full bg-nexus-primary animate-ping" />
                  <span className="text-[9px] font-semibold">Active</span>
                </div>
                <h2 className="text-base sm:text-xl font-black text-white truncate">{user?.name}</h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Mail size={10} className="text-nexus-primary/50 shrink-0" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{user?.email}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Shield size={10} className="text-nexus-primary/50 shrink-0" />
                    <span className="font-mono">#{user?.id.slice(-6).toUpperCase()}</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 gradient-primary text-slate-900 font-semibold rounded-lg text-[11px] hover:scale-[1.03] active:scale-95 transition-all shadow">
                  Edit Profile
                </button>
                <button onClick={logout} className="px-3 py-1.5 glass border-white/10 text-slate-400 font-semibold rounded-lg text-[11px] hover:text-rose-400 hover:border-rose-500/30 transition-all flex items-center gap-1">
                  <LogOut size={11} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: 'Balance',    value: user?.wallet.totalBalance,    icon: Wallet,    color: 'text-nexus-primary'  },
          { label: 'Invested',   value: user?.wallet.depositBalance,  icon: Briefcase, color: 'text-nexus-magenta'  },
          { label: 'Profit',     value: user?.wallet.profitBalance,   icon: TrendingUp,color: 'text-nexus-primary'  },
          { label: 'Referrals',  value: user?.wallet.referralEarnings,icon: Award,     color: 'text-nexus-magenta'  },
        ].map((item) => (
          <div key={item.label} className="nexus-card p-3 flex flex-col justify-between h-20 sm:h-24 border-white/5">
            <div className="p-1.5 glass rounded-lg border-white/5 w-fit">
              <item.icon className={item.color} size={13} />
            </div>
            <div>
              <p className="text-[8px] text-slate-500 uppercase tracking-wider">{item.label}</p>
              <p className="text-xs sm:text-sm font-bold text-white">{formatPKR(item.value || 0)}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">

        {/* ── Left ── */}
        <div className="lg:col-span-8 space-y-3 sm:space-y-4">

          {/* Referral */}
          <div className="nexus-card p-4 border-white/8">
            <div className="flex items-center gap-1.5 text-nexus-magenta mb-3">
              <Users size={13} />
              <span className="text-[9px] font-semibold uppercase tracking-widest">Referral</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-white">Earn per referral</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">Share your code and earn commission on every signup.</p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[9px] text-slate-600">Earned</p>
                    <p className="text-sm font-bold text-nexus-magenta">{formatPKR(user?.wallet.referralEarnings || 0)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-600">Total</p>
                    <p className="text-sm font-bold text-white">{user?.referralCount ?? 0}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] text-slate-600 uppercase tracking-wider">Your Code</p>
                <div onClick={copyReferralCode} className="bg-black/50 border border-white/5 rounded-xl p-2.5 flex items-center justify-between gap-2 cursor-pointer hover:border-nexus-magenta/30 transition-all group">
                  <span className="font-bold text-base tracking-widest text-white group-hover:text-nexus-magenta truncate">{user?.referralCode}</span>
                  <div className="p-1.5 glass rounded-lg border-white/10 group-hover:bg-nexus-magenta group-hover:text-slate-900 transition-all shrink-0">
                    {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                  </div>
                </div>
                <button className="w-full py-2 glass border-nexus-magenta/20 text-nexus-magenta font-semibold rounded-lg text-[11px] hover:bg-nexus-magenta/5 transition-all">
                  Invite Friends
                </button>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="nexus-card p-4 border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 glass rounded-lg border-white/5 text-nexus-primary">
                  <Activity size={13} />
                </div>
                <p className="text-xs font-bold text-white">Recent Transactions</p>
              </div>
              <Link to="/dashboard/history" className="text-[9px] font-semibold text-nexus-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-1.5">
              {recentTransactions.map((tx: any) => (
                <div key={tx._id} className="flex items-center justify-between gap-2 px-2.5 py-2 glass border-white/5 rounded-lg hover:bg-white/[0.02] transition-all">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`p-1.5 rounded-md border shrink-0 ${tx.type === 'withdraw' ? 'border-nexus-magenta/20 bg-nexus-magenta/5 text-nexus-magenta' : 'border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary'}`}>
                      {tx.type === 'withdraw' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold capitalize text-white truncate">{tx.type}</p>
                      <p className="text-[9px] text-slate-600">{new Date(tx.createdAt).toLocaleDateString()} · {tx.status}</p>
                    </div>
                  </div>
                  <p className={`text-xs font-bold shrink-0 ${tx.type === 'withdraw' ? 'text-nexus-magenta' : 'text-nexus-primary'}`}>
                    {tx.type === 'withdraw' ? '-' : '+'}{formatPKR(tx.amount)}
                  </p>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <div className="text-center py-8 opacity-30">
                  <Clock className="text-slate-700 mx-auto mb-2" size={22} />
                  <p className="text-[10px] text-slate-600">No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right ── */}
        <div className="lg:col-span-4 space-y-3">
          <div className="nexus-card p-4 space-y-3 border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-nexus-primary/10 border border-nexus-primary/20 rounded-lg text-nexus-primary">
                <Lock size={13} />
              </div>
              <p className="text-xs font-bold text-white">Security</p>
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'Change Password', icon: Lock,     action: () => setIsEditing(true) },
                { label: 'Enable 2FA',      icon: Shield,   extra: 'Soon', disabled: true },
                { label: 'Active Sessions', icon: Activity, action: () => alert('Session management...') },
              ].map((item, i) => (
                <button key={i} onClick={item.action} disabled={item.disabled}
                  className={`w-full px-3 py-2.5 glass border-white/5 rounded-lg hover:bg-white/[0.04] transition-all flex items-center justify-between group ${item.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}>
                  <div className="flex items-center gap-2">
                    <item.icon size={13} className="text-slate-600 group-hover:text-white transition-colors" />
                    <span className="text-[11px] font-medium text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
                  </div>
                  {item.extra
                    ? <span className="text-[9px] font-medium bg-nexus-primary/20 text-nexus-primary px-1.5 py-0.5 rounded border border-nexus-primary/30">{item.extra}</span>
                    : <ChevronRight size={12} className="text-slate-700 group-hover:text-nexus-primary transition-colors" />
                  }
                </button>
              ))}
            </div>
            <div className="pt-3 border-t border-white/5 flex flex-col gap-1.5">
              <button onClick={() => logout()} className="w-full py-2 gradient-primary text-slate-900 font-semibold rounded-lg text-[11px] flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all">
                <LogOut size={13} /> Sign Out
              </button>
              <button className="w-full py-2 glass border-rose-500/20 text-rose-500 font-semibold rounded-lg text-[11px] hover:bg-rose-500/5 flex items-center justify-center gap-1.5 active:scale-95 transition-all">
                <Trash2 size={13} /> Delete Account
              </button>
            </div>
          </div>

          <div className="nexus-card border-white/5 bg-black/40 flex items-center justify-between p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 glass border-white/5 rounded-lg flex items-center justify-center text-slate-700">
                <Activity size={16} />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-white">System Status</p>
                <p className="text-[9px] text-slate-600">All services operational</p>
              </div>
            </div>
            <span className="text-[9px] text-nexus-primary font-mono bg-nexus-primary/10 px-1.5 py-0.5 rounded">v4.1</span>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="action-island w-full max-w-sm p-5 border-white/10 relative z-10 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Edit Profile</h3>
                  <p className="text-[9px] text-nexus-primary mt-0.5">Update account info</p>
                </div>
                <button onClick={() => setIsEditing(false)} className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-all border border-white/5">
                  <X size={14} />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="space-y-3">
                <div className="space-y-1">
                  <p className="text-[9px] text-slate-600 font-medium uppercase tracking-wider">Name</p>
                  <div className="relative group">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-primary transition-colors" size={13} />
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-lg py-2.5 pl-9 pr-3 outline-none focus:border-nexus-primary/40 transition-all text-xs text-white" required autoFocus />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-slate-600 font-medium uppercase tracking-wider">New Password <span className="normal-case text-slate-700">(optional)</span></p>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-primary transition-colors" size={13} />
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-lg py-2.5 pl-9 pr-3 outline-none focus:border-nexus-primary/40 transition-all text-xs text-white" placeholder="Leave blank to keep current" />
                  </div>
                  <p className="text-[9px] text-slate-700 flex items-center gap-1"><Info size={9} /> Blank = keep current password</p>
                </div>
                <button type="submit" disabled={loading} className="w-full py-2.5 gradient-primary text-slate-900 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow hover:scale-[1.02] active:scale-95 text-xs">
                  {loading ? <><div className="w-3 h-3 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" /> Saving…</> : <>Save Changes <ChevronRight size={13} /></>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
