import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Globe, Moon, Sun, CreditCard, Sliders, ChevronRight, Activity } from 'lucide-react';

export const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState<Record<string, boolean>>({ email: true, push: true, profit: true, referral: false });

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-6 pb-16 max-w-[1400px] mx-auto space-y-6 text-slate-200 selection:bg-nexus-primary/20 selection:text-nexus-primary">
      
      {/* Header */}
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-nexus-primary">
          <SettingsIcon size={14} className="animate-pulse" />
          <span className="text-[10px] font-semibold uppercase tracking-widest">Settings</span>
        </div>
        <h2 className="text-xl font-bold text-white">Account Settings</h2>
        <p className="text-slate-500 text-xs">Manage your notification preferences and display options.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Sidebar */}
        <div className="xl:col-span-4 space-y-2">
          {[
            { icon: Sliders, label: 'Preferences', desc: 'Display & interface' },
            { icon: Bell, label: 'Notifications', desc: 'Alert preferences' },
            { icon: Globe, label: 'Localization', desc: 'Language & region' },
            { icon: CreditCard, label: 'Billing', desc: 'Payment methods' },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${i === 0 ? 'bg-nexus-primary/[0.03] border-nexus-primary/20 text-white' : 'glass border-white/5 text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl border transition-all ${i === 0 ? 'bg-nexus-primary/10 border-nexus-primary/20 text-nexus-primary' : 'bg-white/5 border-white/5 group-hover:border-white/10'}`}>
                  <item.icon size={16} />
                </div>
                <div className="text-left">
                  <p className={`text-xs font-semibold leading-none mb-0.5 ${i === 0 ? 'text-white' : ''}`}>{item.label}</p>
                  <p className="text-[10px] text-slate-600">{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={14} className={`transition-all ${i === 0 ? 'text-nexus-primary' : 'opacity-0'}`} />
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="xl:col-span-8">
          <div className="nexus-card p-6 md:p-8 space-y-8 border-white/8 shadow-xl">
            
            {/* Theme */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Display Theme</h4>
                <p className="text-[10px] text-slate-600">Choose your preferred interface theme</p>
              </div>
              <div className="flex p-1.5 bg-black/40 rounded-xl border border-white/5">
                <button onClick={() => setIsDarkMode(false)} className={`px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-xs font-semibold ${!isDarkMode ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-600 hover:text-white'}`}>
                  <Sun size={14} /> Light
                </button>
                <button onClick={() => setIsDarkMode(true)} className={`px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-xs font-semibold ${isDarkMode ? 'bg-nexus-primary text-slate-900 shadow-lg' : 'text-slate-600 hover:text-white'}`}>
                  <Moon size={14} /> Dark
                </button>
              </div>
            </div>

            <div className="border-t border-white/5" />

            {/* Notifications */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Notification Preferences</h4>
                <p className="text-[10px] text-slate-600">Control which alerts you receive</p>
              </div>
              <div className="space-y-2">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive weekly performance reports via email.' },
                  { key: 'push', label: 'Push Notifications', desc: 'Instant alerts for all account activity.' },
                  { key: 'profit', label: 'Profit Alerts', desc: 'Get notified when daily profits are credited.' },
                  { key: 'referral', label: 'Referral Alerts', desc: 'Notifications when someone uses your referral code.' },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between p-4 glass border-white/5 rounded-xl hover:bg-white/[0.02] hover:border-white/10 transition-all">
                    <div className="space-y-0.5 pr-6">
                      <p className="text-xs font-semibold text-slate-200">{n.label}</p>
                      <p className="text-[10px] text-slate-600 leading-relaxed">{n.desc}</p>
                    </div>
                    <button onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                      className={`w-12 h-6 rounded-full p-1 transition-all duration-500 shrink-0 ${notifications[n.key] ? 'bg-nexus-primary shadow-[0_0_10px_rgba(0,230,160,0.3)]' : 'bg-white/10'}`}>
                      <div className={`w-4 h-4 rounded-full bg-slate-900 transition-all duration-500 ${notifications[n.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/5" />

            <div className="flex flex-wrap gap-3">
              <button className="flex-1 min-w-[200px] py-3 gradient-primary text-slate-900 rounded-xl font-semibold text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                Save Settings <Activity size={15} />
              </button>
              <button className="px-6 py-3 glass border-white/5 text-slate-600 rounded-xl font-semibold text-xs hover:text-white hover:border-white/20 transition-all">
                Reset Defaults
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
