import { useState } from 'react';
import { Users, Copy, Share2, Award, TrendingUp, CheckCircle2, UserPlus, Gift, ExternalLink, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth.tsx';

export const Referrals = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mockReferredUsers = [
    { name: 'Alex Johnson', date: '2026-04-10', status: 'Active', reward: 125.50 },
    { name: 'Maria Chen', date: '2026-04-15', status: 'Pending', reward: 0.00 },
    { name: 'David Smith', date: '2026-04-18', status: 'Active', reward: 450.00 },
    { name: 'Sarah Williams', date: '2026-05-02', status: 'Active', reward: 89.20 },
  ];

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-6 pb-16 max-w-[1700px] mx-auto space-y-6 text-slate-200 selection:bg-nexus-primary/20 selection:text-nexus-primary">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] to-[#080c18]" />
        <div className="absolute inset-0 bg-gradient-to-r from-nexus-magenta/8 via-transparent to-purple-500/8" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-magenta/40 to-transparent" />
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-nexus-magenta/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-nexus-magenta/30 bg-nexus-magenta/10 w-fit">
              <Users size={11} className="text-nexus-magenta" />
              <span className="text-[10px] font-bold text-nexus-magenta uppercase tracking-widest">Referral Program</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">Earn While You <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-magenta to-purple-400">Share</span></h2>
            <p className="text-slate-500 text-xs max-w-md">Invite friends and earn <span className="text-nexus-primary font-semibold">10% commission</span> on every investment they make — forever.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="px-4 py-3 glass rounded-xl border border-white/8 text-center">
              <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-0.5">Earned</p>
              <p className="text-sm font-bold text-nexus-magenta">${user?.wallet.referralEarnings.toFixed(2)}</p>
            </div>
            <div className="px-4 py-3 glass rounded-xl border border-white/8 text-center">
              <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-0.5">Referrals</p>
              <p className="text-sm font-bold text-white">{mockReferredUsers.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Ambassador Card */}
          <div className="nexus-card p-6 md:p-8 bg-gradient-to-br from-nexus-primary/[0.03] to-transparent border-white/10 shadow-xl">
            <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
              <div className="space-y-3">
                <div className="p-2.5 bg-nexus-primary/10 border border-nexus-primary/20 rounded-xl text-nexus-primary w-fit">
                  <UserPlus size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Your Referral Code</h3>
                <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
                  Share your code and earn <span className="text-nexus-primary font-semibold">10% commission</span> on every investment made by referred users.
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[10px] text-slate-600 font-medium mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-nexus-primary">${user?.wallet.referralEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5 mt-1.5">
                  <TrendingUp size={10} className="text-nexus-primary" />
                  <span className="text-[10px] text-slate-500">+12.4% this month</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="glass p-5 rounded-2xl border-white/5 space-y-3 group hover:border-nexus-primary/20 transition-all">
                <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Referral Code</p>
                <div className="flex items-center justify-between gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-2 pl-4">
                  <span className="text-lg font-bold text-white tracking-widest">{user?.referralCode}</span>
                  <button onClick={() => copyToClipboard(user?.referralCode || '')}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${copied ? 'bg-nexus-primary text-slate-900' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}>
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div className="glass p-5 rounded-2xl border-white/5 space-y-3 group hover:border-nexus-primary/20 transition-all">
                <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Referral Link</p>
                <div className="flex items-center justify-between gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-2 pl-4">
                  <span className="text-xs text-slate-500 truncate">{referralLink}</span>
                  <button onClick={() => copyToClipboard(referralLink)}
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-nexus-primary/10 text-nexus-primary hover:bg-nexus-primary/20 transition-all">
                    {copied ? <CheckCircle2 size={16} /> : <Share2 size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button className="w-full py-3 mt-4 gradient-primary text-slate-900 rounded-2xl font-semibold text-xs shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2">
              Share Referral Link <ExternalLink size={14} />
            </button>
          </div>

          {/* Referrals Table */}
          <div className="nexus-card p-0 overflow-hidden border-white/5 shadow-xl">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 glass rounded-lg border-white/5 text-nexus-primary">
                  <Activity size={14} />
                </div>
                <h3 className="text-sm font-bold text-white">Referred Users</h3>
              </div>
              <span className="text-[10px] font-medium text-slate-600 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{mockReferredUsers.length} users</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-white/[0.01]">
                    <th className="px-5 py-3.5 text-[10px] font-medium text-slate-600 uppercase tracking-wider">User</th>
                    <th className="px-5 py-3.5 text-[10px] font-medium text-slate-600 uppercase tracking-wider">Joined</th>
                    <th className="px-5 py-3.5 text-[10px] font-medium text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 text-[10px] font-medium text-slate-600 uppercase tracking-wider text-right">Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockReferredUsers.map((u, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-xs font-semibold text-slate-500 group-hover:border-nexus-primary/30 group-hover:text-nexus-primary transition-all">
                            {u.name[0]}
                          </div>
                          <span className="text-xs font-medium text-slate-300">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500">{new Date(u.date).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-medium ${u.status === 'Active' ? 'bg-nexus-primary/5 border-nexus-primary/20 text-nexus-primary' : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-500'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-bold text-white group-hover:text-nexus-primary transition-colors">${u.reward.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Commission Tiers */}
          <div className="nexus-card p-6 bg-gradient-to-br from-nexus-magenta/[0.03] to-transparent border-nexus-magenta/10 shadow-xl">
            <div className="p-2.5 bg-nexus-magenta/10 border border-nexus-magenta/20 rounded-xl text-nexus-magenta w-fit mb-4">
              <Award size={18} />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Commission Tiers</h4>
            <p className="text-[10px] text-slate-600 mb-5 leading-relaxed">Unlock higher commissions as your referral network grows.</p>
            <div className="space-y-3">
              {[
                { label: 'Bronze', req: '5 referrals', yield: '5%', status: 'Unlocked', current: true },
                { label: 'Silver', req: '20 referrals', yield: '8%', status: 'Locked' },
                { label: 'Elite', req: '100 referrals', yield: '15%', status: 'Locked' },
              ].map((t, i) => (
                <div key={i} className={`p-4 rounded-xl border transition-all ${t.current ? 'bg-emerald-500/[0.03] border-emerald-500/20' : 'bg-white/[0.01] border-white/5 opacity-50 hover:opacity-100'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-semibold ${t.current ? 'text-emerald-400' : 'text-slate-400'}`}>{t.label}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${t.current ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-600'}`}>{t.status}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] text-slate-500">{t.req}</p>
                    <p className="text-base font-bold text-white">{t.yield}</p>
                  </div>
                  {t.current && <div className="mt-3 w-full h-1 bg-emerald-500/10 rounded-full overflow-hidden"><div className="h-full w-full bg-emerald-400" /></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="nexus-card p-6 border-white/5 bg-black/40">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 glass rounded-lg border-white/10">
                <TrendingUp size={15} className="text-nexus-primary" />
              </div>
              <h4 className="text-xs font-semibold text-white">Network Stats</h4>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-slate-600">Monthly Growth</p>
                  <p className="text-sm font-bold text-nexus-primary">+12.5%</p>
                </div>
                <div className="w-full h-1.5 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} transition={{ duration: 2, ease: 'easeOut' }} className="h-full gradient-primary rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 glass bg-white/[0.01] rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-600 mb-1.5">Link Clicks</p>
                  <p className="text-lg font-bold text-white">1,200</p>
                </div>
                <div className="p-4 glass bg-white/[0.01] rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-600 mb-1.5">Conversions</p>
                  <p className="text-lg font-bold text-white">24</p>
                </div>
              </div>
              <div className="p-4 bg-nexus-primary/5 rounded-xl border border-nexus-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift size={14} className="text-nexus-primary" />
                  <span className="text-xs text-slate-400">Bonus Status</span>
                </div>
                <span className="text-[10px] font-medium bg-nexus-primary/20 text-nexus-primary px-2 py-0.5 rounded-md border border-nexus-primary/30">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
