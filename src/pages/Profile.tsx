import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, Mail, Copy, LogOut, Shield, Award, Users, 
  ChevronRight, Settings, X, Lock, Wallet, Briefcase, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Clock, Trash2, CheckCircle2, Share2
} from 'lucide-react';
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

  useEffect(() => {
    fetchHistory();
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
        setRecentTransactions(data.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName, password: newPassword || undefined })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setIsEditing(false);
      setNewPassword('');
      refreshUser();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-10 pb-8 lg:pb-0 text-slate-200">
      
      {/* 1. User Info Section (Top) */}
      <section className="nexus-card p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-nexus-primary/5 to-transparent">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <UserIcon className="text-white w-64 h-64" />
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative z-10">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[48px] gradient-primary p-1 shadow-2xl shadow-nexus-primary/20 transition-transform group-hover:scale-105 duration-500">
              <div className="w-full h-full rounded-[44px] bg-[#030408] flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                  alt="avatar" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </div>
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute -bottom-2 -right-2 bg-nexus-primary text-slate-900 p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
              <Settings size={20} />
            </button>
          </div>

          <div className="text-center md:text-left space-y-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white">{user?.name}</h2>
              <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                <Mail size={16} className="text-nexus-primary" /> {user?.email}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="px-4 py-2 glass rounded-2xl border-white/5 flex items-center gap-2">
                <Award size={16} className="text-nexus-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Elite Member</span>
              </div>
              <div className="px-4 py-2 glass rounded-2xl border-white/5 flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ID: {user?.id.slice(-6).toUpperCase()}</span>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 gradient-primary text-slate-900 font-black rounded-xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
              >
                Edit Profile
              </button>
              <button 
                onClick={logout}
                className="px-6 py-2.5 glass border-white/10 text-slate-400 font-black rounded-xl text-xs uppercase tracking-widest hover:text-white hover:border-nexus-primary/30 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Account Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Available Balance', value: user?.wallet.totalBalance, icon: Wallet, color: 'text-nexus-primary' },
          { label: 'Total Invested', value: user?.wallet.depositBalance, icon: Briefcase, color: 'text-nexus-magenta' },
          { label: 'Total Profit Earned', value: user?.wallet.profitBalance, icon: TrendingUp, color: 'text-nexus-primary' },
          { label: 'Referral Earnings', value: user?.wallet.referralEarnings, icon: Award, color: 'text-nexus-magenta' },
        ].map((item, i) => (
          <div key={item.label} className="nexus-card p-8 flex flex-col justify-between h-44 bg-gradient-to-tr from-white/[0.01] to-transparent">
            <div className="flex justify-between items-start">
              <div className="p-3 glass rounded-2xl border-white/5">
                <item.icon className={item.color} size={24} />
              </div>
              <div className="h-2 w-2 rounded-full bg-nexus-primary animate-pulse" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em]">{item.label}</p>
              <h3 className="text-3xl font-black mt-2 tracking-tighter text-white">${item.value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-8">
          
          {/* 3. Referral Section */}
          <div className="nexus-card p-10 bg-gradient-to-br from-nexus-magenta/5 to-transparent relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <Share2 size={200} className="text-nexus-magenta" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6 text-center md:text-left">
                <div className="inline-flex p-3 glass rounded-2xl border-nexus-magenta/20 mb-2">
                  <Users className="text-nexus-magenta" size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tight uppercase">Referral System</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-sm">Grow your network and earn 10% commission on all peer investments.</p>
                </div>
                <div className="flex flex-center md:justify-start gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Accrued</p>
                    <p className="text-2xl font-black text-nexus-magenta">${user?.wallet.referralEarnings.toFixed(2)}</p>
                  </div>
                  <div className="w-px h-10 bg-white/5 my-auto" />
                  <div className="text-center md:text-left">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Network Size</p>
                    <p className="text-2xl font-black text-white">4 Peers</p> {/* Mock peer count as not in model */}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.4em] px-2 text-center md:text-left">Your Referral Code</p>
                  <div 
                    onClick={copyReferralCode}
                    className="bg-black/40 border border-white/5 rounded-[32px] p-6 flex items-center justify-between group cursor-pointer hover:border-nexus-magenta/30 transition-all"
                  >
                    <span className="font-black text-2xl tracking-[0.3em] text-white group-hover:text-nexus-magenta transition-colors pl-4">{user?.referralCode}</span>
                    <div className="p-4 glass rounded-2xl border-white/10 group-hover:bg-nexus-magenta group-hover:text-slate-900 transition-all">
                      {copied ? <CheckCircle2 size={24} /> : <Copy size={24} />}
                    </div>
                  </div>
                </div>
                <button className="w-full py-5 glass border-nexus-magenta/20 hover:bg-nexus-magenta/5 text-nexus-magenta font-black rounded-3xl text-sm uppercase tracking-widest transition-all">
                  Invite Peers
                </button>
              </div>
            </div>
          </div>

          {/* 5. Recent Activity */}
          <div className="nexus-card p-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 glass rounded-[20px] border-white/5">
                  <Clock size={20} className="text-nexus-primary" />
                </div>
                <h3 className="text-2xl font-black tracking-tight uppercase">Recent Activity</h3>
              </div>
              <button className="text-[10px] font-black text-nexus-primary uppercase tracking-widest hover:underline">View History</button>
            </div>

            <div className="space-y-4">
              {recentTransactions.map((tx: any) => (
                <div key={tx._id} className="flex items-center justify-between p-6 glass border-white/5 rounded-[32px] hover:bg-white/[0.02] transition-all group">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl border ${tx.type === 'withdraw' ? 'border-nexus-magenta/20 bg-nexus-magenta/5 text-nexus-magenta' : 'border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary'}`}>
                      {tx.type === 'withdraw' ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
                    </div>
                    <div>
                      <p className="text-lg font-black capitalize text-white tracking-tight">{tx.type}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(tx.createdAt).toLocaleDateString()} â€¢ {tx.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-black tracking-tight ${tx.type === 'withdraw' ? 'text-nexus-magenta' : 'text-nexus-primary'}`}>
                      {tx.type === 'withdraw' ? '-' : '+'}${tx.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 glass rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Clock className="text-slate-700" size={32} />
                  </div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">No activity detected</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-8">
          
          {/* 4. Security Settings */}
          <div className="nexus-card p-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 glass rounded-[20px] border-nexus-primary/20 bg-nexus-primary/5">
                <Shield size={20} className="text-nexus-primary" />
              </div>
              <h3 className="text-xl font-black tracking-tight uppercase">Security</h3>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Change Password', icon: Lock, action: () => setIsEditing(true) },
                { label: 'Enable 2FA', icon: Shield, extra: 'COMING SOON', disabled: true },
                { label: 'Logout All Devices', icon: LogOut, action: () => alert('Feature in development') }
              ].map((item, i) => (
                <button 
                  key={i}
                  onClick={item.action}
                  disabled={item.disabled}
                  className={`w-full p-6 glass border-white/5 rounded-[32px] hover:bg-white/[0.03] transition-all flex items-center justify-between group ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={18} className="text-slate-500 group-hover:text-white transition-colors" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-300">{item.label}</span>
                  </div>
                  {item.extra ? (
                    <span className="text-[8px] font-black bg-nexus-primary/10 text-nexus-primary px-2 py-1 rounded-md">{item.extra}</span>
                  ) : (
                    <ChevronRight size={16} className="text-slate-700 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Account Actions */}
          <div className="nexus-card p-10 space-y-6">
            <button 
              onClick={logout}
              className="w-full py-5 gradient-primary text-slate-900 font-black rounded-3xl text-sm uppercase tracking-widest transition-all shadow-lg shadow-nexus-primary/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
            >
              <LogOut size={20} /> Logout System
            </button>
            <button 
              className="w-full py-5 glass border-rose-500/20 text-rose-500 font-black rounded-3xl text-sm uppercase tracking-widest transition-all hover:bg-rose-500/5 flex items-center justify-center gap-3"
            >
              <Trash2 size={20} /> Delete Account
            </button>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal (simplified and modernized) */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="nexus-card w-full max-w-lg p-10 md:p-14 border-white/10 relative z-10 rounded-[64px] overflow-hidden shadow-[0_0_100px_rgba(0,245,160,0.1)]"
            >
              <div className="flex justify-between items-center mb-14">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Edit Account</h3>
                  <p className="text-[10px] text-nexus-primary font-black uppercase tracking-[0.4em]">Personal Information</p>
                </div>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all border border-white/10"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-10">
                <div className="space-y-4">
                  <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.4em] px-4 font-mono">Display Name</p>
                  <div className="relative group">
                    <UserIcon className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-nexus-primary transition-colors" size={20} />
                    <input 
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/5 rounded-[40px] py-7 pl-20 pr-8 outline-none focus:border-nexus-primary/40 transition-all font-black text-base tracking-tight text-white uppercase placeholder:text-slate-800"
                      placeholder="Enter Name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.4em] px-4 font-mono">New Password</p>
                  <div className="relative group">
                    <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-nexus-primary transition-colors" size={20} />
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/5 rounded-[40px] py-7 pl-20 pr-8 outline-none focus:border-nexus-primary/40 transition-all font-black text-base tracking-tight text-white placeholder:text-slate-800"
                      placeholder="••••••••••••"
                    />
                  </div>
                  <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.2em] px-4 leading-relaxed">Leave empty to keep existing password encryption</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-24 gradient-primary text-slate-900 font-black rounded-[48px] mt-8 flex items-center justify-center gap-4 transition-all shadow-2xl shadow-nexus-primary/30 hover:scale-[1.02] active:scale-95 uppercase text-xs tracking-[0.4em]"
                >
                  {loading ? 'Processing...' : 'Apply Changes'}
                  <ChevronRight size={22} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
