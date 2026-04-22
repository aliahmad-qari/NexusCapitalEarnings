import { useState } from 'react';
import { 
  Users, Copy, Share2, Award, TrendingUp, 
  CheckCircle2, UserPlus, Gift, ExternalLink
} from 'lucide-react';
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

  // Mock referred users (In a real app, this would come from an API)
  const mockReferredUsers = [
    { name: 'X_NODE_042', date: '2026-04-10', status: 'Active', reward: 125.50 },
    { name: 'QUANTUM_99', date: '2026-04-15', status: 'Pending', reward: 0.00 },
    { name: 'ALPHA_USER', date: '2026-04-18', status: 'Active', reward: 450.00 },
  ];

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12 pb-32 lg:pb-12 text-slate-200">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-nexus-primary">
            <Users size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Affiliate Network</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Affiliate <span className="text-gradient">Registry</span></h2>
          <p className="text-slate-500 text-sm max-w-md normal-case font-medium">Expand the nexus network and harvest passive yield from institutional referrals.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Referral Status Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="nexus-card p-10 bg-gradient-to-br from-nexus-primary/[0.03] to-transparent border-nexus-primary/10 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none">
               <UserPlus size={200} className="text-white" />
            </div>
            
            <div className="relative z-10 space-y-8">
              <div className="flex flex-col md:flex-row gap-8 justify-between items-center">
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-2xl font-black tracking-tighter uppercase text-white leading-none">Your Ambassador Node</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto md:mx-0">
                    Share your unique deployment signature to earn up to 10% on every capital node incepted by your network.
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Total Network Yield</p>
                  <p className="text-4xl font-black text-nexus-primary tracking-tighter">${user?.wallet.referralEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Referral Code */}
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">Ambassador ID</p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xl font-black text-white tracking-widest uppercase">{user?.referralCode}</span>
                    <button 
                      onClick={() => copyToClipboard(user?.referralCode || '')}
                      className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-nexus-primary transition-all active:scale-90"
                    >
                      {copied ? <CheckCircle2 size={18} className="text-nexus-primary" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                {/* Referral Link */}
                <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">Network Pathway</p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-bold text-slate-500 truncate w-40">{referralLink}</span>
                    <button 
                      onClick={() => copyToClipboard(referralLink)}
                      className="p-3 bg-nexus-primary/10 rounded-xl text-nexus-primary hover:bg-nexus-primary/20 transition-all active:scale-90"
                    >
                      {copied ? <CheckCircle2 size={18} /> : <Share2 size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button className="w-full h-16 gradient-primary text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl shadow-nexus-primary/20 hover:scale-[1.01] active:scale-95 transition-all">
                 Infect Network Registry
              </button>
            </div>
          </div>

          {/* Referred Users Table */}
          <div className="nexus-card p-0 overflow-hidden border-white/5">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
               <h3 className="text-sm font-black uppercase tracking-widest text-white">Network Connections</h3>
               <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{mockReferredUsers.length} Active Nodes</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.01]">
                    <th className="px-8 py-6 text-[9px] font-black text-slate-600 uppercase tracking-widest">Connection</th>
                    <th className="px-8 py-6 text-[9px] font-black text-slate-600 uppercase tracking-widest">Sync Date</th>
                    <th className="px-8 py-6 text-[9px] font-black text-slate-600 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[9px] font-black text-slate-600 uppercase tracking-widest text-right">Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockReferredUsers.map((u, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-xs font-black text-slate-500">
                             {u.name[0]}
                          </div>
                          <span className="text-xs font-black text-slate-300">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-500">{new Date(u.date).toLocaleDateString()}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${
                          u.status === 'Active' ? 'bg-nexus-primary/10 border-nexus-primary/20 text-nexus-primary' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right text-xs font-black text-slate-200">${u.reward.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-8">
           <div className="nexus-card p-8 bg-gradient-to-br from-nexus-magenta/[0.03] to-transparent border-nexus-magenta/10">
              <div className="p-4 bg-nexus-magenta/10 border border-nexus-magenta/20 rounded-2xl text-nexus-magenta w-fit mb-6">
                 <Award size={24} />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">Ambassador Perks</h4>
              <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed tracking-widest mb-8">Unlock exclusive institutional tiers as your network expands.</p>
              
              <div className="space-y-6">
                 {[
                   { label: 'Tier 1 (Bronze)', req: '5 Users', yield: '5%', status: 'Unlocked' },
                   { label: 'Tier 2 (Silver)', req: '20 Users', yield: '8%', status: 'Locked' },
                   { label: 'Tier 3 (Elite)', req: '100 Users', yield: '15%', status: 'Locked' },
                 ].map((t, i) => (
                   <div key={i} className={`p-4 rounded-2xl border ${t.status === 'Unlocked' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5 opacity-50'}`}>
                      <div className="flex justify-between items-center mb-1">
                         <span className={`text-[10px] font-black uppercase tracking-widest ${t.status === 'Unlocked' ? 'text-emerald-400' : 'text-slate-500'}`}>{t.label}</span>
                         <span className="text-[8px] font-bold text-slate-600">{t.status}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[8px] font-bold text-slate-600">{t.req}</span>
                         <span className="text-xs font-bold text-white">Yield: {t.yield}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="nexus-card p-8 border-white/5 bg-black/20">
              <div className="flex items-center gap-3 mb-6">
                 <TrendingUp size={18} className="text-nexus-primary" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Network Stats</h4>
              </div>
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Network Growth</span>
                       <span className="text-[9px] font-black text-nexus-primary">+12.5%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full">
                       <div className="w-[45%] h-full gradient-primary rounded-full" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-1">Impressions</p>
                       <p className="text-sm font-black text-white">1.2K</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-1">Conversions</p>
                       <p className="text-sm font-black text-white">24</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
