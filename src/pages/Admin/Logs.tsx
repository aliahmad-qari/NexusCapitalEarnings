import { useEffect, useState } from 'react';
import { Shield, Clock, Search, User as UserIcon, RefreshCw } from 'lucide-react';
import { API_BASE } from '../../utils/api.ts';

export const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/admin/logs`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setLogs(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const filtered = logs.filter((log: any) => {
    const q = searchQuery.toLowerCase();
    return !q || log.action?.toLowerCase().includes(q) || log.adminId?.email?.toLowerCase().includes(q) || log.details?.toLowerCase().includes(q);
  });

  const actionColor = (action: string) => {
    if (action.includes('USER')) return 'border-blue-500/20 bg-blue-500/5 text-blue-400';
    if (action.includes('TRANSACTION') || action.includes('DEPOSIT')) return 'border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary';
    if (action.includes('DELETE')) return 'border-rose-500/20 bg-rose-500/5 text-rose-400';
    return 'border-nexus-magenta/20 bg-nexus-magenta/5 text-nexus-magenta';
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Audit Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">{logs.length} actions recorded</p>
        </div>
        <button onClick={fetchLogs} className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/8 text-xs font-semibold text-slate-400 hover:text-white transition-all">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
        <input type="text" placeholder="Search logs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 glass rounded-xl border border-white/8 outline-none focus:border-nexus-primary/30 text-xs text-white placeholder-slate-700" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-nexus-primary/20 border-t-nexus-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="nexus-card p-0 overflow-hidden border-white/8">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Admin</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Action</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Target</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Time</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((log: any) => (
                  <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-nexus-magenta/10 border border-nexus-magenta/20 flex items-center justify-center">
                          <UserIcon size={11} className="text-nexus-magenta" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-white">{log.adminId?.name || 'Admin'}</p>
                          <p className="text-[9px] text-slate-600">{log.ipAddress || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-semibold uppercase ${actionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[10px] text-slate-400">{log.targetType || 'System'}</p>
                      <p className="text-[9px] text-slate-600">{log.targetId ? `#${log.targetId.toString().slice(-6)}` : '—'}</p>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Clock size={10} />
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-[10px] text-slate-400">{log.details || '—'}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <Shield size={24} className="text-slate-700 mx-auto mb-2" />
                      <p className="text-xs text-slate-700">No logs found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
