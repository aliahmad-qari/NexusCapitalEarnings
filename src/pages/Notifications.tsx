import { useState } from 'react';
import { 
  Bell, CheckCircle2, AlertCircle, Info, 
  Trash2, Filter, Clock, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'deposit', title: 'Capital Sync Successful', message: 'Institutional node injection of $1,000.00 has been verified and settled.', time: '2 hours ago', unread: true },
    { id: 2, type: 'profit', title: 'Yield Harvested', message: 'Daily yield of $50.00 from GOLD_STRATEGY node has been balanced.', time: '5 hours ago', unread: true },
    { id: 3, type: 'withdraw', title: 'Liquidity Drain Initialized', message: 'Extraction of $2,500.00 is currently in the settlement queue.', time: '1 day ago', unread: false },
    { id: 4, type: 'system', title: 'Security Protocol Update', message: 'Global encryption protocols have been upgraded to AES-512 standard.', time: '2 days ago', unread: false },
    { id: 5, type: 'profit', title: 'Yield Harvested', message: 'Daily yield of $12.50 from STARTER node has been balanced.', time: '3 days ago', unread: false },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return n.unread;
    return n.type === filter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <CheckCircle2 className="text-nexus-primary" size={20} />;
      case 'withdraw': return <AlertCircle className="text-nexus-magenta" size={20} />;
      case 'profit': return <TrendingUpIcon className="text-emerald-400" size={20} />;
      case 'system': return <Info className="text-nexus-gold" size={20} />;
      default: return <Bell className="text-slate-500" size={20} />;
    }
  };

  const TrendingUpIcon = ({ className, size }: { className?: string, size?: number }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1200px] mx-auto space-y-12 pb-8 lg:pb-0 text-slate-200">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-nexus-primary">
            <Bell size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Signal Registry</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Nexus <span className="text-gradient">Signals</span></h2>
          <p className="text-slate-500 text-sm max-w-md normal-case font-medium">Monitoring system alerts, capital movements, and harvesting logs in real-time.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="text-[10px] font-black uppercase tracking-widest text-nexus-primary hover:text-white transition-colors"
        >
          Mark all as synchronised
        </button>
      </header>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['all', 'unread', 'deposit', 'withdraw', 'profit', 'system'].map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === t ? 'bg-nexus-primary/10 border-nexus-primary/30 text-nexus-primary' : 'bg-white/[0.02] border-white/5 text-slate-600 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-700">
             <Filter size={14} />
             <span className="text-[9px] font-black uppercase tracking-widest leading-none">Filtering Terminal</span>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="nexus-card rounded-[40px] p-24 flex flex-col items-center border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent"
              >
                 <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-[32px] flex items-center justify-center mb-8">
                    <Bell className="text-slate-800" size={32} />
                 </div>
                 <h3 className="text-xl font-black mb-3 tracking-tighter uppercase">Registry Clear</h3>
                 <p className="text-slate-600 text-center max-w-xs text-xs leading-relaxed font-bold uppercase tracking-widest">No signals match your current filter parameters.</p>
              </motion.div>
            ) : (
              filteredNotifications.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => markAsRead(n.id)}
                  className={`nexus-card p-6 md:p-8 flex items-start gap-6 group hover:border-white/10 transition-all cursor-pointer relative overflow-hidden ${n.unread ? 'bg-gradient-to-r from-nexus-primary/[0.03] to-transparent border-nexus-primary/10' : 'bg-white/[0.01] border-white/5'}`}
                >
                  {n.unread && (
                    <div className="absolute top-0 right-0 p-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-nexus-primary animate-pulse" />
                    </div>
                  )}

                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500 ${n.unread ? 'bg-nexus-primary/5 border-nexus-primary/20' : 'bg-white/5 border-white/5 opacity-50'}`}>
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                       <h4 className={`font-black tracking-tight uppercase ${n.unread ? 'text-white' : 'text-slate-400'}`}>{n.title}</h4>
                       <div className="flex items-center gap-1 text-[9px] font-black text-slate-600 tracking-tighter">
                          <Clock size={10} />
                          {n.time.toUpperCase()}
                       </div>
                    </div>
                    <p className={`text-xs font-medium leading-relaxed max-w-2xl ${n.unread ? 'text-slate-300' : 'text-slate-600'}`}>{n.message}</p>
                    
                    <div className="flex items-center gap-4 pt-2">
                       <button 
                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                        className="text-[9px] font-black uppercase tracking-widest text-slate-700 hover:text-rose-500 transition-colors flex items-center gap-2"
                       >
                         <Trash2 size={12} /> Purge Entry
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
