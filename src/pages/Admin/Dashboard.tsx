import { useEffect, useState } from 'react';
import { 
  Users, Activity, TrendingUp, ShieldCheck, 
  ArrowUpRight, ArrowDownRight, Briefcase, 
  Settings, LogOut, Search, Clock, Shield
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeInvestments: 0,
    totalInvestedAmount: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    revenue: 0,
    activePlans: 0,
    pendingTransactions: 0,
    approvedTransactions: 0
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchLogs();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setRecentLogs(data.slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-nexus-magenta">
            <Shield size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Administrative Hub</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Nexus <span className="text-gradient">Control</span></h2>
          <p className="text-slate-500 text-sm max-w-md normal-case font-medium uppercase tracking-widest">Global oversight of institutional strategy nodes and network integrity.</p>
        </div>
        <div className="flex items-center gap-4">
           <Link to="/admin/transactions" className="gradient-primary px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl shadow-nexus-primary/20 hover:scale-105 active:scale-95 transition-all">
              Settlement Queue
           </Link>
        </div>
      </header>

      {/* Primary Stats Matrix */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Platform Revenue', value: stats.revenue ? `$${stats.revenue.toLocaleString()}` : '$0', icon: TrendingUp, color: 'text-nexus-primary' },
          { label: 'Active Capital', value: stats.totalInvestedAmount ? `$${stats.totalInvestedAmount.toLocaleString()}` : '$0', icon: Briefcase, color: 'text-nexus-magenta' },
          { label: 'Network Users', value: stats.totalUsers, icon: Users, color: 'text-nexus-primary' },
          { label: 'Active Strategies', value: stats.activePlans, icon: Activity, color: 'text-nexus-magenta' },
        ].map((item, i) => (
          <div key={item.label} className="nexus-card p-8 flex flex-col justify-between h-44 bg-gradient-to-tr from-white/[0.01] to-transparent">
            <div className="flex justify-between items-start">
              <div className="p-3 glass rounded-2xl border-white/5">
                <item.icon className={item.color} size={24} />
              </div>
              <Activity className="text-white/10" size={16} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em]">{item.label}</p>
              <h3 className="text-3xl font-black mt-2 tracking-tighter text-white">{item.value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Operational Signal Breakdown */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending Signals', value: stats.pendingTransactions, icon: Clock, color: 'text-yellow-500' },
          { label: 'Settled Operations', value: stats.approvedTransactions, icon: ShieldCheck, color: 'text-nexus-primary' },
          { label: 'Managed Nodes', value: stats.activeInvestments, icon: Briefcase, color: 'text-nexus-magenta' },
        ].map((item, i) => (
          <div key={item.label} className="nexus-card p-6 flex items-center gap-6 bg-white/[0.01]">
            <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${item.color}`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
              <h3 className="text-2xl font-black text-white tracking-tighter">{item.value}</h3>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Audit Logs */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Institutional Audit Trail</h3>
              <Link to="/admin/logs" className="text-[10px] font-black text-nexus-primary uppercase tracking-widest hover:underline">View Full Registry</Link>
           </div>
           <div className="nexus-card p-0 overflow-hidden border-white/5">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-white/[0.01] border-b border-white/5">
                          <th className="px-8 py-6 text-[9px] font-black text-slate-600 uppercase tracking-widest">Admin Node</th>
                          <th className="px-8 py-6 text-[9px] font-black text-slate-600 uppercase tracking-widest">Operation</th>
                          <th className="px-8 py-6 text-[9px] font-black text-slate-600 uppercase tracking-widest">Temporal Signature</th>
                          <th className="px-8 py-6 text-[9px] font-black text-slate-600 uppercase tracking-widest text-right">Details</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {recentLogs.map((log: any) => (
                          <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                             <td className="px-8 py-6">
                                <div className="space-y-1">
                                   <p className="text-xs font-black text-slate-300">{log.adminId?.name}</p>
                                   <p className="text-[9px] text-slate-600 font-bold uppercase">{log.adminId?.email}</p>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <span className="px-3 py-1 rounded-lg border border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary text-[8px] font-black uppercase tracking-widest">
                                   {log.action}
                                </span>
                             </td>
                             <td className="px-8 py-6 text-xs text-slate-500 font-bold">{new Date(log.createdAt).toLocaleString()}</td>
                             <td className="px-8 py-6 text-right text-[10px] font-black text-slate-400 normal-case">{log.details || 'System Signal'}</td>
                          </tr>
                       ))}
                       {recentLogs.length === 0 && (
                          <tr>
                             <td colSpan={4} className="p-20 text-center">
                                <p className="text-slate-700 font-black uppercase text-[10px] tracking-[0.4em]">Audit Registry Empty</p>
                             </td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Quick Management Suite */}
        <div className="lg:col-span-4 space-y-8">
           <div className="nexus-card p-10 bg-gradient-to-br from-nexus-primary/[0.03] to-transparent border-nexus-primary/20 space-y-8">
              <h4 className="text-sm font-black uppercase tracking-widest text-white leading-none">Management Nodes</h4>
              <div className="space-y-4">
                 {[
                   { label: 'Register Strategy', path: '/plans', icon: Briefcase, color: 'text-nexus-primary' },
                   { label: 'Node Directory', path: '/admin/users', icon: Users, color: 'text-nexus-magenta' },
                   { label: 'Syndicate Audit', path: '/admin/logs', icon: ShieldCheck, color: 'text-nexus-primary' },
                 ].map((nav, i) => (
                    <Link key={i} to={nav.path} className="flex items-center justify-between p-5 glass border-white/5 rounded-3xl group hover:border-white/10 transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 ${nav.color}`}>
                             <nav.icon size={20} />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-slate-300 group-hover:text-white">{nav.label}</span>
                       </div>
                    </Link>
                 ))}
              </div>
           </div>

           <div className="nexus-card p-10 border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                 <Activity size={18} className="text-nexus-primary" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Integrity</h4>
              </div>
              <div className="space-y-4">
                 <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Arbitrage Engine</span>
                    <span className="text-[10px] font-black text-emerald-400">ONLINE</span>
                 </div>
                 <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Withdrawal Node</span>
                    <span className="text-[10px] font-black text-emerald-400">ACTIVE</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
