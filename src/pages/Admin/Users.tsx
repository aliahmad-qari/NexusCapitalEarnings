import { useEffect, useState } from 'react';
import { Users, Search, Shield, ShieldOff, Trash2, X, Filter, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPKR } from '../../utils/currency.ts';
import { API_BASE } from '../../utils/api.ts';

export const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const updateStatus = async (userId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/admin/user-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, status }),
      });
      if (res.ok) { fetchUsers(); if (selectedUser?._id === userId) setSelectedUser({ ...selectedUser, isBlocked: status === 'blocked' }); }
    } catch (err) { console.error(err); }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/admin/user/${userId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { fetchUsers(); setSelectedUser(null); }
    } catch (err) { console.error(err); }
  };

  const filtered = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || (filterStatus === 'blocked' ? u.isBlocked : !u.isBlocked);
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Users</h1>
          <p className="text-xs text-slate-500 mt-0.5">{users.length} registered users</p>
        </div>
        <button onClick={fetchUsers} className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/8 text-xs font-semibold text-slate-400 hover:text-white transition-all">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
          <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 glass rounded-xl border border-white/8 outline-none focus:border-nexus-primary/30 text-xs text-white placeholder-slate-700" />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'blocked'].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg border text-[10px] font-semibold uppercase transition-all ${filterStatus === s ? 'bg-nexus-primary/10 border-nexus-primary/30 text-nexus-primary' : 'border-white/8 text-slate-600 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-nexus-primary/20 border-t-nexus-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="nexus-card p-0 overflow-hidden border-white/8">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[650px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">User</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Balance</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Joined</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt="" className="w-8 h-8 rounded-lg border border-white/10" referrerPolicy="no-referrer" />
                        <div>
                          <p className="text-xs font-semibold text-white">{u.name}</p>
                          <p className="text-[9px] text-slate-600">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold border ${u.isAdmin ? 'border-nexus-magenta/20 bg-nexus-magenta/5 text-nexus-magenta' : 'border-white/8 text-slate-500'}`}>
                        {u.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-semibold border ${u.isBlocked ? 'border-rose-500/20 bg-rose-500/5 text-rose-400' : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'}`}>
                        {u.isBlocked ? <ShieldOff size={9} /> : <Shield size={9} />}
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs font-semibold text-slate-300">{formatPKR(u.wallet?.totalBalance || 0)}</td>
                    <td className="px-5 py-3 text-[10px] text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => setSelectedUser(u)} className="p-1.5 glass rounded-lg text-slate-500 hover:text-white border border-white/5 transition-all">
                          <Search size={13} />
                        </button>
                        <button onClick={() => updateStatus(u._id, u.isBlocked ? 'active' : 'blocked')}
                          className={`p-1.5 rounded-lg border transition-all ${u.isBlocked ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white'}`}>
                          {u.isBlocked ? <Shield size={13} /> : <ShieldOff size={13} />}
                        </button>
                        <button onClick={() => deleteUser(u._id)} className="p-1.5 rounded-lg border border-white/8 text-slate-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="py-16 text-center text-xs text-slate-700">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
              className="relative nexus-card w-full max-w-sm p-6 border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">User Details</h3>
                <button onClick={() => setSelectedUser(null)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all"><X size={16} /></button>
              </div>
              <div className="flex items-center gap-3">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`} alt="" className="w-12 h-12 rounded-xl border border-white/10" referrerPolicy="no-referrer" />
                <div>
                  <p className="text-sm font-bold text-white">{selectedUser.name}</p>
                  <p className="text-[10px] text-slate-500">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Role', value: selectedUser.isAdmin ? 'Admin' : 'User' },
                  { label: 'Status', value: selectedUser.isBlocked ? 'Blocked' : 'Active' },
                  { label: 'Balance', value: formatPKR(selectedUser.wallet?.totalBalance || 0) },
                  { label: 'Referrals', value: selectedUser.referralCount || 0 },
                  { label: 'Profit', value: formatPKR(selectedUser.wallet?.profitBalance || 0) },
                  { label: 'Joined', value: new Date(selectedUser.createdAt).toLocaleDateString() },
                ].map((r) => (
                  <div key={r.label} className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <p className="text-[9px] text-slate-600 uppercase">{r.label}</p>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">{r.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => updateStatus(selectedUser._id, selectedUser.isBlocked ? 'active' : 'blocked')}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition-all ${selectedUser.isBlocked ? 'gradient-primary text-slate-900' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white'}`}>
                  {selectedUser.isBlocked ? 'Unblock' : 'Block'}
                </button>
                <button onClick={() => deleteUser(selectedUser._id)} className="px-4 py-2.5 rounded-xl border border-white/8 text-slate-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
