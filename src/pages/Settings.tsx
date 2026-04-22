import { useState } from 'react';
import { 
  Settings as SettingsIcon, Bell, Globe, Moon, Sun, 
  Shield, CreditCard, Mail, Sliders, ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    email: true,
    push: true,
    profit: true,
    referral: false,
  });

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1200px] mx-auto space-y-12 pb-32 lg:pb-12 text-slate-200">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-nexus-primary">
            <SettingsIcon size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Global Config</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Nexus <span className="text-gradient">Settings</span></h2>
          <p className="text-slate-500 text-sm max-w-md normal-case font-medium">Fine-tuning the terminal environment, notification nodes, and system preferences.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-4">
           {[
             { icon: Sliders, label: 'Preferences', desc: 'Environment configuration' },
             { icon: Bell, label: 'Notifications', desc: 'Signal alerts' },
             { icon: Globe, label: 'Language', desc: 'Regional localization' },
             { icon: CreditCard, label: 'Billing', desc: 'Invoicing and receipts' },
           ].map((item, i) => (
             <button key={i} className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all group ${i === 0 ? 'bg-nexus-primary/5 border-nexus-primary/20 text-white' : 'glass border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10'}`}>
                <div className="flex items-center gap-4">
                   <div className={`p-2.5 rounded-xl border ${i === 0 ? 'bg-nexus-primary/10 border-nexus-primary/20 text-nexus-primary' : 'bg-white/5 border-white/5 group-hover:bg-white/10'}`}>
                      <item.icon size={18} />
                   </div>
                   <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-tight leading-none mb-1.5">{item.label}</p>
                      <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{item.desc}</p>
                   </div>
                </div>
                <ChevronRight size={14} className={i === 0 ? 'opacity-100' : 'opacity-0'} />
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-8">
           {/* Preferences Block */}
           <div className="nexus-card p-10 space-y-10 border-white/5 bg-gradient-to-br from-white/[0.01] to-transparent">
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <div>
                       <h4 className="text-sm font-black uppercase tracking-widest text-white">Interface Protocol</h4>
                       <p className="text-[10px] font-medium text-slate-600 uppercase tracking-widest mt-1">Select visual node appearance</p>
                    </div>
                    <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                       <button 
                        onClick={() => setIsDarkMode(false)}
                        className={`p-3 rounded-xl transition-all ${!isDarkMode ? 'bg-white/10 text-white' : 'text-slate-600'}`}
                       >
                          <Sun size={18} />
                       </button>
                       <button 
                        onClick={() => setIsDarkMode(true)}
                        className={`p-3 rounded-xl transition-all ${isDarkMode ? 'bg-nexus-primary/20 text-nexus-primary' : 'text-slate-600'}`}
                       >
                          <Moon size={18} />
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2">Signal Notification Nodes</p>
                    {[
                      { key: 'email', label: 'Email Digest', desc: 'Receive weekly performance reports via secure mail.' },
                      { key: 'push', label: 'Push Signals', desc: 'Real-time hub alerts for all capital movements.' },
                      { key: 'profit', label: 'Profit Alerts', desc: 'Sync notification on every yield harvesting event.' },
                      { key: 'referral', label: 'Network Alerts', desc: 'Notify when a new node joins your affiliate network.' },
                    ].map((n) => (
                      <div key={n.key} className="flex items-center justify-between p-6 glass border-white/5 rounded-3xl hover:border-white/10 transition-all">
                         <div className="space-y-1">
                            <p className="text-xs font-black uppercase tracking-tight text-slate-200">{n.label}</p>
                            <p className="text-[10px] font-medium text-slate-600 normal-case leading-tight">{n.desc}</p>
                         </div>
                         <button 
                          onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                          className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${notifications[n.key] ? 'bg-nexus-primary' : 'bg-white/10'}`}
                         >
                            <div className={`w-4 h-4 rounded-full bg-slate-950 transition-all duration-300 ${notifications[n.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="pt-10 border-t border-white/5 flex gap-4">
                 <button className="px-10 h-16 gradient-primary text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-nexus-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    Sync Configuration
                 </button>
                 <button className="px-10 h-16 glass border-white/5 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-all">
                    Reset Nodes
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
