import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Mail, Copy, LogOut, Shield, Award, Users, ChevronRight, Settings, X, Lock, Wallet, Briefcase, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Trash2, CheckCircle2, Share2, Activity, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { motion, AnimatePresence } from 'motion/react';

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
      setIsEditing(false);
      setNewPassword('');
      refreshUser();
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-6 pb-16 max-w-[1700px] mx-auto space-y-6 text-slate-200 selection:bg-nexus-primary/20 selection:text-nexus-primary">
      
      {/* Identity Card */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0d1225] to-[#080c18]" />
        <div className="absolute inset-0 bg-gradient-to-r from-nexus-primary/8 via-transparent to-nexus-magenta/8" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-primary/40 to-transparent" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-nexus-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-nexus-magenta/6 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col xl:flex-row items-center xl:items-start gap-8 xl:gap-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl p-0.5 shadow-lg" style={{background: 'linear-gradient(135deg, #00e6a0, #a855f7)'}}>
                <div className="w-full h-full rounded-[calc(1rem-2px)] bg-[#030408] flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="avatar" className="w-full h-full object-cover scale-110" referrerPolicy="no-referrer" />
                </div>
              </div>
              <button onClick={() => setIsEditing(true)} className="absolute -bottom-1 -right-1 bg-white text-slate-900 p-2 rounded-xl shadow-lg hover:scale-110 transition-all">
                <Settings size={14} />
              </button>
            </div>
            <div className="text-center xl:text-left space-y-4 flex-1">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full border-nexus-primary/20 text-nexus-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-nexus-primary animate-ping" />
                  <span className="text-[10px] font-semibold">Account Active</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">{user?.name}</h2>
                <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail size={13} className="text-nexus-primary opacity-50" />
                    <span className="text-xs">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Shield size={13} className="text-nexus-primary opacity-50" />
                    <span className="text-xs font-mono">ID: {user?.id.slice(-8).toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-3">
                <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 gradient-primary text-slate-900 font-semibold rounded-xl text-xs hover:scale-[1.03] active:scale-95 transition-all shadow-lg">
                  Edit Profile
                </button>
                <button onClick={logout} className="px-5 py-2.5 glass border-white/10 text-slate-400 font-semibold rounded-xl text-xs hover:text-rose-500 hover:border-rose-500/30 transition-all flex items-center gap-2">
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Available Balance', value: user?.wallet.totalBalance, icon: Wallet, color: 'text-nexus-primary' },
          { label: 'Total Invested', value: user?.wallet.depositBalance, icon: Briefcase, color: 'text-nexus-magenta' },
          { label: 'Total Profits', value: user?.wallet.profitBalance, icon: TrendingUp, color: 'text-nexus-primary' },
          { label: 'Referral Earnings', value: user?.wallet.referralEarnings, icon: Award, color: 'text-nexus-magenta' },
        ].map((item) => (
          <div key={item.label} className="nexus-card p-5 flex flex-col justify-between h-36 border-white/5 group hover:border-white/10">
            <div className="p-2.5 glass rounded-xl border-white/5 w-fit">
              <item.icon className={item.color} size={18} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider mb-1">{item.label}</p>
              <h3 className="text-lg font-bold text-white">${item.value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Referral + History */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Referral */}
          <div className="nexus-card p-6 bg-gradient-to-br from-nexus-magenta/[0.03] to-transparent border-white/8 shadow-xl">
            <div className="flex items-center gap-2 text-nexus-magenta mb-4">
              <Users size={16} />
              <span className="text-[10px] font-semibold uppercase tracking-widest">Referral Program</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">Earn Passive Income</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Share your referral code and earn <span className="text-nexus-magenta font-semibold">10% commission</span> on all investments made by your referred users.</p>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] text-slate-600 font-medium">Total Earned</p>
                    <p className="text-lg font-bold text-nexus-magenta">${user?.wallet.referralEarnings.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-600 font-medium">Referrals</p>
                    <p className="text-lg font-bold text-white">14</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Your Referral Code</p>
                <div onClick={copyReferralCode} className="bg-black/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:border-nexus-magenta/30 transition-all">
                  <span className="font-bold text-xl tracking-wider text-white group-hover:text-nexus-magenta transition-colors">{user?.referralCode}</span>
                  <div className="p-2 glass rounded-xl border-white/10 group-hover:bg-nexus-magenta group-hover:text-slate-900 transition-all">
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  </div>
                </div>
                <button className="w-full py-2.5 glass border-nexus-magenta/20 hover:bg-nexus-magenta/5 text-nexus-magenta font-semibold rounded-xl text-xs transition-all">
                  Invite Friends
                </button>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="nexus-card p-6 border-white/5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 glass rounded-xl border-white/5 text-nexus-primary">
                  <Activity size={15} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
                  <p className="text-[10px] text-slate-600">Your latest account activity</p>
                </div>
              </div>
              <Link to="/dashboard/history" className="text-[10px] font-semibold text-nexus-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-2">
              {recentTransactions.map((tx: any) => (
                <div key={tx._id} className="flex items-center justify-between p-3 glass border-white/5 rounded-xl hover:bg-white/[0.02] transition-all group border-transparent hover:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${tx.type === 'withdraw' ? 'border-nexus-magenta/20 bg-nexus-magenta/5 text-nexus-magenta' : 'border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary'}`}>
                      {tx.type === 'withdraw' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold capitalize text-white">{tx.type}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                        <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                        <span>·</span>
                        <span>{tx.status}</span>
                      </div>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${tx.type === 'withdraw' ? 'text-nexus-magenta' : 'text-nexus-primary'}`}>
                    {tx.type === 'withdraw' ? '-' : '+'}${tx.amount.toLocaleString()}
                  </p>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <div className="text-center py-10 opacity-30">
                  <Clock className="text-slate-700 mx-auto mb-3" size={28} />
                  <p className="text-xs font-medium text-slate-600">No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Security */}
        <div className="lg:col-span-4 space-y-6">
          <div className="nexus-card p-6 space-y-5 border-white/5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-nexus-primary/10 border border-nexus-primary/20 rounded-xl text-nexus-primary">
                <Lock size={16} />
              </div>
              <h3 className="text-sm font-bold text-white">Security</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Change Password', icon: Lock, action: () => setIsEditing(true) },
                { label: 'Enable 2FA', icon: Shield, extra: 'Coming Soon', disabled: true },
                { label: 'Active Sessions', icon: Activity, action: () => alert('Session management...') }
              ].map((item, i) => (
                <button key={i} onClick={item.action} disabled={item.disabled}
                  className={`w-full p-4 glass border-white/5 rounded-xl hover:bg-white/[0.04] transition-all flex items-center justify-between group ${item.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}>
                  <div className="flex items-center gap-3">
                    <item.icon size={15} className="text-slate-600 group-hover:text-white transition-colors" />
                    <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
                  </div>
                  {item.extra ? (
                    <span className="text-[10px] font-medium bg-nexus-primary/20 text-nexus-primary px-2 py-0.5 rounded-md border border-nexus-primary/30">{item.extra}</span>
                  ) : (
                    <ChevronRight size={14} className="text-slate-700 group-hover:translate-x-0.5 transition-transform group-hover:text-nexus-primary" />
                  )}
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
              <button onClick={() => logout()} className="w-full py-3 gradient-primary text-slate-900 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                <LogOut size={15} /> Sign Out
              </button>
              <button className="w-full py-3 glass border-rose-500/20 text-rose-500 font-semibold rounded-xl text-xs hover:bg-rose-500/5 flex items-center justify-center gap-2 active:scale-95 transition-all">
                <Trash2 size={15} /> Delete Account
              </button>
            </div>
          </div>

          <div className="bento-card border-white/5 bg-black/40 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 glass border-white/5 rounded-2xl flex items-center justify-center text-slate-700">
              <Activity size={22} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-white">System Status</p>
              <p className="text-[10px] text-slate-600 leading-relaxed">All services operational · v4.1.28</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditing(false)} className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="action-island w-full max-w-md p-8 border-white/10 relative z-10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">Edit Profile</h3>
                  <p className="text-[10px] text-nexus-primary mt-0.5">Update your account information</p>
                </div>
                <button onClick={() => setIsEditing(false)} className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all border border-white/5">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Display Name</p>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-primary transition-colors" size={15} />
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-nexus-primary/40 transition-all font-medium text-sm text-white" required autoFocus />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">New Password <span className="normal-case text-slate-700">(optional)</span></p>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-primary transition-colors" size={15} />
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-nexus-primary/40 transition-all text-sm text-white" placeholder="Leave blank to keep current" />
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    <Info size={11} className="text-slate-700" />
                    <p className="text-[10px] text-slate-700">Leave blank to keep your current password.</p>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 gradient-primary text-slate-900 font-semibold rounded-xl mt-2 flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-[1.02] active:scale-95 text-sm">
                  {loading ? (<div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" /><span>Saving...</span></div>) : (<>Save Changes <ChevronRight size={16} /></>)}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
