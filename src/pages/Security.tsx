import { useState } from 'react';
import { ShieldCheck, Lock, Smartphone, LogOut, Shield, CheckCircle2, AlertTriangle, RefreshCw, Fingerprint, Activity } from 'lucide-react';

export const Security = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome - Windows', location: 'London, UK', status: 'Active now', current: true },
    { id: 2, device: 'iPhone 15 Pro', location: 'Berlin, DE', status: '2 hours ago', current: false },
  ]);

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-6 pb-16 max-w-[1400px] mx-auto space-y-6 text-slate-200 selection:bg-nexus-primary/20 selection:text-nexus-primary">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] to-[#080c18]" />
        <div className="absolute inset-0 bg-gradient-to-r from-nexus-primary/8 via-transparent to-rose-500/5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-primary/40 to-transparent" />
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-nexus-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-nexus-primary/30 bg-nexus-primary/10 w-fit">
              <Lock size={11} className="text-nexus-primary" />
              <span className="text-[10px] font-bold text-nexus-primary uppercase tracking-widest">Account Security</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-primary to-cyan-400">Settings</span></h2>
            <p className="text-slate-500 text-xs max-w-md">Manage your passwords, two-factor authentication, and active sessions.</p>
          </div>
          <div className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-semibold transition-all ${is2FAEnabled ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-rose-500/30 bg-rose-500/10 text-rose-400'}`}>
            <Shield size={14} />
            {is2FAEnabled ? '2FA Enabled' : '2FA Disabled'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Password Change */}
        <div className="xl:col-span-7">
          <div className="nexus-card p-6 md:p-8 space-y-6 border-white/8 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl glass border-nexus-primary/20 text-nexus-primary">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Change Password</h3>
                <p className="text-[10px] text-slate-600 mt-0.5">Update your account password</p>
              </div>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Current Password</label>
                  <input type="password" placeholder="••••••••••••" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-nexus-primary/30 text-sm text-white tracking-widest placeholder:text-slate-800" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">New Password</label>
                  <input type="password" placeholder="••••••••••••" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-nexus-primary/30 text-sm text-white tracking-widest placeholder:text-slate-800" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Confirm New Password</label>
                <input type="password" placeholder="••••••••••••" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-nexus-primary/30 text-sm text-white tracking-widest placeholder:text-slate-800" />
              </div>
              <button className="w-full py-3 gradient-primary text-slate-900 rounded-xl font-semibold text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                Update Password <RefreshCw size={15} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-5 space-y-5">
          
          {/* 2FA */}
          <div className="nexus-card p-6 bg-gradient-to-br from-nexus-magenta/[0.03] to-transparent border-nexus-magenta/15 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-nexus-magenta/10 border border-nexus-magenta/20 rounded-xl text-nexus-magenta">
                  <Smartphone size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Two-Factor Auth</h3>
                  <p className="text-[10px] text-slate-600 mt-0.5">Multi-signature verification</p>
                </div>
              </div>
              <button onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                className={`w-14 h-7 rounded-full p-1 transition-all duration-500 ${is2FAEnabled ? 'bg-nexus-primary shadow-[0_0_12px_rgba(0,230,160,0.3)]' : 'bg-white/10'}`}>
                <div className={`w-5 h-5 rounded-full bg-slate-900 transition-all duration-500 ${is2FAEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex gap-3 p-4 border border-white/5 rounded-xl bg-black/30 mb-4">
              <Fingerprint size={18} className="text-nexus-magenta opacity-60 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white mb-1">Two-Factor Authentication</p>
                <p className="text-[10px] text-slate-500 leading-relaxed">Require a verification code for all withdrawals and account changes.</p>
              </div>
            </div>

            <div className={`p-3.5 border rounded-xl flex items-center justify-center gap-2 transition-all ${is2FAEnabled ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-500'}`}>
              {is2FAEnabled ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
              <span className="text-xs font-semibold">{is2FAEnabled ? 'Account Secured' : 'Not Protected'}</span>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="nexus-card p-6 border-white/5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 glass rounded-lg border-white/10 text-slate-600">
                  <Activity size={15} />
                </div>
                <h3 className="text-sm font-bold text-white">Active Sessions</h3>
              </div>
              <span className="text-[10px] font-medium text-slate-600 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">{sessions.length} active</span>
            </div>

            <div className="space-y-2">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3.5 glass rounded-xl border-white/5 group hover:bg-white/[0.02] transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.current ? 'bg-nexus-primary shadow-[0_0_8px_rgba(0,230,160,0.6)] animate-pulse' : 'bg-slate-700'}`} />
                    <div>
                      <p className="text-xs font-semibold text-white">{s.device}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-[10px] text-slate-600">{s.location}</p>
                        <span className="text-slate-700 text-[10px]">·</span>
                        <p className="text-[10px] text-slate-600">{s.status}</p>
                      </div>
                    </div>
                  </div>
                  {!s.current && (
                    <button className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-[10px] font-medium text-rose-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button className="w-full py-3 bg-rose-500/5 text-rose-500 border border-rose-500/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-rose-500/10 transition-all active:scale-95">
              <LogOut size={14} /> Sign Out All Devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
