import { useState } from 'react';
import { 
  ShieldCheck, Lock, Smartphone, History, 
  LogOut, Shield, CheckCircle2, AlertTriangle,
  RefreshCw, Fingerprint
} from 'lucide-react';
import { motion } from 'motion/react';

export const Security = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Nexus Matrix Terminal (Web)', location: 'London, UK', status: 'Active Now', current: true },
    { id: 2, device: 'iPhone 15 Pro (Session Node)', location: 'Berlin, DE', status: 'Active 2h ago', current: false },
  ]);

  const toggle2FA = () => setIs2FAEnabled(!is2FAEnabled);

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1200px] mx-auto space-y-12 pb-32 lg:pb-12 text-slate-200 uppercase tracking-tight">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-nexus-primary">
            <Lock size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Vault Security</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Security <span className="text-gradient">Protocols</span></h2>
          <p className="text-slate-500 text-sm max-w-md normal-case font-medium uppercase tracking-widest">Hardening institutional capital nodes and expanding encryption matrix.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Password Reset */}
        <div className="nexus-card p-10 space-y-8 bg-gradient-to-br from-white/[0.01] to-transparent border-white/5">
          <div className="flex items-center gap-4">
             <div className="p-3 glass rounded-2xl border-nexus-primary/20 text-nexus-primary shadow-lg shadow-nexus-primary/5">
                <ShieldCheck size={24} />
             </div>
             <div>
                <h3 className="text-xl font-black tracking-tighter uppercase">Access Keys</h3>
                <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.4em]">Credential Rotation Matrix</p>
             </div>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest px-2">Current Node Key</label>
              <input 
                type="password" 
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className="w-full glass p-5 rounded-2xl border-white/5 outline-none focus:border-nexus-primary/30 text-sm text-white placeholder:text-slate-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest px-2">New Sequence Key</label>
              <input 
                type="password" 
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className="w-full glass p-5 rounded-2xl border-white/5 outline-none focus:border-nexus-primary/30 text-sm text-white placeholder:text-slate-800"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] text-slate-600 font-black uppercase tracking-widest px-2">Verify New Key</label>
              <input 
                type="password" 
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className="w-full glass p-5 rounded-2xl border-white/5 outline-none focus:border-nexus-primary/30 text-sm text-white placeholder:text-slate-800"
              />
            </div>
            <button className="w-full h-16 gradient-primary text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-nexus-primary/20 transition-all hover:scale-[1.01] active:scale-95">
               Rotate Key Signature
            </button>
          </form>
        </div>

        {/* 2FA & Advanced Settings */}
        <div className="space-y-8">
           <div className="nexus-card p-10 bg-gradient-to-br from-nexus-magenta/[0.02] to-transparent border-nexus-magenta/10">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-nexus-magenta/10 border border-nexus-magenta/20 rounded-2xl text-nexus-magenta">
                       <Smartphone size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black tracking-tighter uppercase">Biometric 2FA</h3>
                       <p className="text-[8px] text-nexus-magenta/40 font-black uppercase tracking-[0.4em]">Multi-Sig verification</p>
                    </div>
                 </div>
                 <button 
                  onClick={toggle2FA}
                  className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${is2FAEnabled ? 'bg-nexus-primary' : 'bg-white/10'}`}
                 >
                    <div className={`w-6 h-6 rounded-full bg-slate-900 transition-all duration-500 ${is2FAEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                 </button>
              </div>

              <div className="space-y-6">
                 <div className="flex gap-4 p-4 border border-white/5 rounded-2xl bg-black/20">
                    <div className="shrink-0 pt-1 text-nexus-magenta">
                       <Fingerprint size={20} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase text-white">Institutional Fingerprinting</p>
                       <p className="text-[9px] font-medium text-slate-500 normal-case">Require TOTP authentication for all capital extractions and node re-configurations.</p>
                    </div>
                 </div>

                 <div className={`p-4 border rounded-2xl flex items-center gap-3 ${is2FAEnabled ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                    {is2FAEnabled ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    <span className="text-[9px] font-black uppercase tracking-widest">{is2FAEnabled ? 'Protocol Hardened' : 'Protocol Vulnerable'}</span>
                 </div>
              </div>
           </div>

           {/* Active Sessions */}
           <div className="nexus-card p-10 border-white/5 space-y-8">
              <div className="flex items-center gap-3">
                 <History size={18} className="text-slate-600" />
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Node Access</h3>
              </div>

              <div className="space-y-4">
                 {sessions.map((s) => (
                   <div key={s.id} className="flex items-center justify-between p-4 glass rounded-2xl border-white/5 group">
                      <div className="flex items-center gap-4">
                         <div className={`w-2 h-2 rounded-full ${s.current ? 'bg-nexus-primary shadow-[0_0_8px_rgba(0,245,160,0.5)]' : 'bg-slate-800'}`} />
                         <div>
                            <p className="text-xs font-black uppercase text-white">{s.device}</p>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{s.location} â€¢ {s.status}</p>
                         </div>
                      </div>
                      {!s.current && (
                        <button className="text-[9px] font-black uppercase tracking-widest text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                           Terminate
                        </button>
                      )}
                   </div>
                 ))}
              </div>

              <button className="w-full py-4 bg-rose-500/5 text-rose-500 border border-rose-500/10 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rose-500/10 transition-all">
                 <LogOut size={14} /> Terminate all remote nodes
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
