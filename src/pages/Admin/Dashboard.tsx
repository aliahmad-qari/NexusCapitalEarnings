import { useEffect, useState } from 'react';
import { Users, Activity, TrendingUp, ShieldCheck, Briefcase, Clock, Award, Users2, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPKR } from '../../utils/currency.ts';
import { API_BASE } from '../../utils/api.ts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, activeInvestments: 0, totalInvestedAmount: 0, totalDeposits: 0, totalWithdrawals: 0, revenue: 0, activePlans: 0, pendingTransactions: 0, approvedTransactions: 0 });
  const [refStats, setRefStats] = useState({ totalReferrals: 0, totalReferralEarnings: 0, topReferrers: [] });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); fetchLogs(); fetchReferralStats(); }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
      setStats(await res.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/admin/logs`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setRecentLogs(data.slice(0, 5));
    } catch (err) { console.error(err); }
  };

  const fetchReferralStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/admin/referral-stats`, { headers: { Authorization: `Bearer ${token}` } });
      setRefStats(await res.json());
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Platform overview and management</p>
        </div>
        <Link to="/dashboard/admin/transactions" className="px-4 py-2 gradient-primary text-slate-900 rounded-xl font-semibold text-xs shadow-lg shadow-nexus-primary/20 hover:scale-[1.02] transition-all">
          Review Transactions
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue', value: formatPKR(stats.revenue || 0), icon: TrendingUp, color: 'text-nexus-primary', bg: 'bg-nexus-primary/10 border-nexus-primary/20' },
          { label: 'Total Invested', value: formatPKR(stats.totalInvestedAmount || 0), icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
          { label: 'Active Plans', value: stats.activePlans, icon: BarChart2, color: 'text-nexus-magenta', bg: 'bg-nexus-magenta/10 border-nexus-magenta/20' },
        ].map((s) => (
          <div key={s.label} className="nexus-card flex flex-col justify-between h-[100px]">
            <div className={`p-1.5 rounded-lg border w-fit ${s.bg}`}>
              <s.icon size={14} className={s.color} />
            </div>
            <div>
              <p className="text-[9px] text-slate-600 uppercase tracking-wider">{s.label}</p>
              <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Pending Transactions', value: stats.pendingTransactions, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: Clock },
          { label: 'Approved Transactions', value: stats.approvedTransactions, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: ShieldCheck },
          { label: 'Active Investments', value: stats.activeInvestments, color: 'text-nexus-primary', bg: 'bg-nexus-primary/10 border-nexus-primary/20', icon: Activity },
        ].map((s) => (
          <div key={s.label} className={`flex items-center gap-4 p-4 rounded-xl border ${s.bg}`}>
            <s.icon size={20} className={s.color} />
            <div>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top Referrers */}
        <div className="lg:col-span-2 nexus-card p-0 overflow-hidden border-white/8">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <p className="text-xs font-bold text-white">Top Referrers</p>
            <span className="text-[9px] text-slate-600">{refStats.topReferrers.length} users</span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">User</th>
                <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Referrals</th>
                <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider text-right">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {refStats.topReferrers.map((ref: any) => (
                <tr key={ref._id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <p className="text-xs font-semibold text-white">{ref.name}</p>
                    <p className="text-[9px] text-slate-600">{ref.email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded bg-nexus-primary/10 border border-nexus-primary/20 text-nexus-primary text-[9px] font-bold">{ref.referralCount}</span>
                  </td>
                  <td className="px-5 py-3 text-right text-xs font-semibold text-slate-300">{formatPKR(ref.wallet?.referralEarnings || 0)}</td>
                </tr>
              ))}
              {refStats.topReferrers.length === 0 && (
                <tr><td colSpan={3} className="px-5 py-8 text-center text-[10px] text-slate-700">No referrers yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Referral Summary + Quick Links */}
        <div className="space-y-4">
          <div className="nexus-card border-white/8 space-y-3">
            <p className="text-xs font-bold text-white">Referral Summary</p>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <div>
                <p className="text-[9px] text-slate-500">Total Signups</p>
                <p className="text-base font-bold text-white">{refStats.totalReferrals}</p>
              </div>
              <Users2 size={18} className="text-nexus-primary" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <div>
                <p className="text-[9px] text-slate-500">Rewards Paid</p>
                <p className="text-base font-bold text-nexus-primary">{formatPKR(refStats.totalReferralEarnings)}</p>
              </div>
              <Award size={18} className="text-nexus-magenta" />
            </div>
          </div>

          <div className="nexus-card border-white/8 space-y-2">
            <p className="text-xs font-bold text-white">Quick Links</p>
            {[
              { label: 'Manage Plans', path: '/dashboard/admin/plans' },
              { label: 'Users', path: '/dashboard/admin/users' },
              { label: 'Audit Logs', path: '/dashboard/admin/logs' },
            ].map((n) => (
              <Link key={n.path} to={n.path} className="flex items-center justify-between p-3 rounded-lg glass border border-white/5 hover:border-white/15 transition-all group">
                <span className="text-xs font-medium text-slate-400 group-hover:text-white">{n.label}</span>
                <span className="text-slate-700 group-hover:text-slate-400 text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Logs */}
      <div className="nexus-card p-0 overflow-hidden border-white/8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <p className="text-xs font-bold text-white">Recent Activity</p>
          <Link to="/dashboard/admin/logs" className="text-[10px] text-nexus-primary hover:underline">View all</Link>
        </div>
        <table className="w-full text-left min-w-[500px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Admin</th>
              <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Action</th>
              <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Time</th>
              <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {recentLogs.map((log: any) => (
              <tr key={log._id} className="hover:bg-white/[0.02]">
                <td className="px-5 py-3">
                  <p className="text-xs font-semibold text-slate-200">{log.adminId?.name}</p>
                  <p className="text-[9px] text-slate-600">{log.adminId?.email}</p>
                </td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 rounded bg-nexus-primary/10 border border-nexus-primary/20 text-nexus-primary text-[9px] font-semibold">{log.action}</span>
                </td>
                <td className="px-5 py-3 text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="px-5 py-3 text-right text-[10px] text-slate-400">{log.details || '—'}</td>
              </tr>
            ))}
            {recentLogs.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-[10px] text-slate-700">No recent activity</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
