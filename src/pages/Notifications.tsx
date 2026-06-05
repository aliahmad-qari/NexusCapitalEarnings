import { useState } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, Clock, Activity, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'deposit', title: 'Deposit Confirmed', message: 'Your deposit of $1,000.00 has been confirmed and added to your balance.', time: '2 hours ago', unread: true },
    { id: 2, type: 'profit', title: 'Daily Profit Credited', message: 'Daily profit of $50.00 from your Gold Strategy plan has been credited.', time: '5 hours ago', unread: true },
    { id: 3, type: 'withdraw', title: 'Withdrawal Processing', message: 'Your withdrawal of $2,500.00 is currently being processed.', time: '1 day ago', unread: false },
    { id: 4, type: 'system', title: 'Security Update', message: 'Your account security protocols have been upgraded.', time: '2 days ago', unread: false },
    { id: 5, type: 'profit', title: 'Daily Profit Credited', message: 'Daily profit of $12.50 from your Starter plan has been credited.', time: '3 days ago', unread: false },
  ]);

  const markAsRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const deleteNotification = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return n.unread;
    return n.type === filter;
  });

  const TrendingUpIcon = ({ className, size }: { className?: string, size?: number }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <CheckCircle2 className="text-nexus-primary" size={18} />;
      case 'withdraw': return <AlertCircle className="text-nexus-magenta" size={18} />;
      case 'profit': return <TrendingUpIcon className="text-emerald-400" size={18} />;
      case 'system': return <Info className="text-nexus-gold" size={18} />;
      default: return <Bell className="text-slate-500" size={18} />;
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-6 pb-16 max-w-[1400px] mx-auto space-y-6 selection:bg-nexus-primary/20 selection:text-nexus-primary">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-nexus-primary">
            <Bell size={14} className="animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Notifications</span>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Alerts & Updates</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-nexus-primary/20 text-nexus-primary text-[10px] font-bold rounded-full border border-nexus-primary/30">{unreadCount} new</span>
            )}
          </div>
          <p className="text-slate-500 text-xs">Stay updated with your account activity and system alerts.</p>
        </div>
        <button onClick={markAllRead} className="px-5 py-2.5 glass border-white/5 text-xs font-semibold text-nexus-primary hover:text-white hover:border-nexus-primary/30 rounded-xl transition-all">
          Mark All Read
        </button>
      </header>

      {/* Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl w-fit">
        {['all', 'unread', 'deposit', 'withdraw', 'profit', 'system'].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-xl border text-[10px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${filter === t ? 'bg-nexus-primary/10 border-nexus-primary/30 text-nexus-primary' : 'border-transparent text-slate-600 hover:text-white hover:bg-white/[0.02]'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="nexus-card rounded-2xl p-14 flex flex-col items-center border-white/5 text-center">
              <Bell className="text-slate-800 mb-4" size={36} />
              <h3 className="text-sm font-bold mb-2 text-white">No Notifications</h3>
              <p className="text-slate-600 text-xs">You're all caught up. No notifications match this filter.</p>
            </motion.div>
          ) : (
            filteredNotifications.map((n) => (
              <motion.div key={n.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                onClick={() => markAsRead(n.id)}
                className={`nexus-card p-5 flex items-start gap-5 group hover:border-white/10 transition-all cursor-pointer ${n.unread ? 'bg-gradient-to-r from-nexus-primary/[0.03] to-transparent border-nexus-primary/15' : 'bg-white/[0.01] border-white/5 opacity-80 hover:opacity-100'}`}>
                
                {n.unread && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-nexus-primary shadow-[0_0_8px_rgba(0,230,160,0.8)] animate-pulse" />}

                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${n.unread ? 'bg-nexus-primary/10 border-nexus-primary/30' : 'bg-white/5 border-white/5 opacity-50 group-hover:opacity-100'}`}>
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h4 className={`text-sm font-semibold leading-none mb-1 ${n.unread ? 'text-white' : 'text-slate-400'}`}>{n.title}</h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                        <Clock size={10} />
                        {n.time}
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                      className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-700 hover:text-rose-500 hover:border-rose-500/30 transition-all shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className={`text-xs leading-relaxed ${n.unread ? 'text-slate-300' : 'text-slate-500'}`}>{n.message}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <Activity size={11} className="text-nexus-primary opacity-40" />
                    <span className="text-[10px] text-slate-600">Verified</span>
                    <span className="text-slate-800">·</span>
                    <button className="flex items-center gap-1 text-[10px] font-medium text-nexus-primary">
                      View Details <ArrowUpRight size={10} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <div className="p-5 bento-card border-none bg-black/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 glass rounded-xl flex items-center justify-center border-white/5">
            <Activity size={18} className="text-slate-700" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">System Status</h4>
            <p className="text-[10px] text-slate-600 mt-0.5">All notifications loaded · {notifications.length} total · 99.9% uptime</p>
          </div>
        </div>
        <button className="px-5 py-2.5 glass border-white/10 text-xs font-semibold text-slate-400 hover:text-white hover:border-white/20 rounded-xl transition-all">Download Report</button>
      </div>
    </div>
  );
};
