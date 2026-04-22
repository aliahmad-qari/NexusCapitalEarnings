import { useEffect, useState } from 'react';
import { 
  Users, Search, Shield, ShieldOff, Trash2, 
  ChevronRight, Filter, MoreVertical, CheckCircle2,
  AlertTriangle, Mail, User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/user-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, status: newStatus })
      });
      if (res.ok) {
        fetchUsers();
        if (selectedUser?._id === userId) {
          setSelectedUser({ ...selectedUser, isBlocked: newStatus === 'blocked' });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('CRITICAL: Permanent deletion of user node. Proceed?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/user/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers();
        setSelectedUser(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users
    .filter((u: any) => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           u._id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' ? true : 
                           filterStatus === 'blocked' ? u.isBlocked : !u.isBlocked;
      const matchesRole = filterRole === 'all' ? true :
                         filterRole === 'admin' ? u.isAdmin : !u.isAdmin;
      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      // Handle nested wallet balance
      if (sortBy === 'balance') {
        valA = a.wallet.totalBalance;
        valB = b.wallet.totalBalance;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-nexus-primary">
            <Users size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node Directory Matrix</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Peer <span className="text-gradient">Management</span></h2>
          <p className="text-slate-500 text-sm max-w-md normal-case font-medium uppercase tracking-widest">Controlling protocol permissions and network access for all nexus nodes.</p>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-4 w-full md:w-auto">
           <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH BY NAME, EMAIL, OR ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass py-4 pl-12 pr-6 rounded-2xl border-white/5 outline-none focus:border-nexus-primary/30 text-[10px] font-black tracking-widest text-white placeholder:text-slate-800"
              />
           </div>
           <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <div className="flex items-center gap-2 glass px-4 py-3 rounded-2xl border-white/5">
                <Shield size={14} className="text-slate-600" />
                <select 
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest text-slate-300"
                >
                   <option value="all">Global Roles</option>
                   <option value="user">Investors</option>
                   <option value="admin">Controllers</option>
                </select>
              </div>
              <div className="flex items-center gap-2 glass px-4 py-3 rounded-2xl border-white/5">
                <Filter size={14} className="text-slate-600" />
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest text-slate-300"
                >
                   <option value="all">All Statuses</option>
                   <option value="active">Active Nodes</option>
                   <option value="blocked">Restricted</option>
                </select>
              </div>
           </div>
        </div>
      </header>

      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center gap-6">
           <div className="w-12 h-12 border-4 border-nexus-primary/20 border-t-nexus-primary rounded-full animate-spin"></div>
           <p className="text-nexus-primary/40 font-black uppercase tracking-[0.4em] text-[10px]">Scanning Identity Matrix...</p>
        </div>
      ) : (
        <div className="nexus-card p-0 overflow-hidden border-white/5">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-white/[0.01] border-b border-white/5">
                       <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer hover:text-white" onClick={() => toggleSort('name')}>Peer Identity</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Auth Level</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Network Status</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer hover:text-white" onClick={() => toggleSort('balance')}>Capital Units</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer hover:text-white" onClick={() => toggleSort('createdAt')}>Joined Pulse</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Terminal Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((u: any) => (
                       <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-8">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-xs text-slate-500 overflow-hidden shrink-0">
                                   <img 
                                     src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} 
                                     alt="avatar" 
                                     className="w-full h-full object-cover" 
                                     referrerPolicy="no-referrer"
                                   />
                                </div>
                                <div className="space-y-1">
                                   <p className="text-sm font-black text-white uppercase tracking-tight">{u.name}</p>
                                   <div className="flex items-center gap-2 text-slate-600">
                                      <p className="text-[10px] font-bold uppercase tracking-widest">ID_{u._id.slice(-6).toUpperCase()}</p>
                                   </div>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-8">
                             <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${u.isAdmin ? 'border-nexus-magenta/20 bg-nexus-magenta/5 text-nexus-magenta' : 'border-slate-800 bg-slate-900/40 text-slate-500'}`}>
                                {u.isAdmin ? 'Controller' : 'Investor'}
                             </span>
                          </td>
                          <td className="px-8 py-8">
                             <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${
                                u.isBlocked ? 'border-rose-500/20 bg-rose-500/5 text-rose-500' : 'border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary'
                             }`}>
                                {u.isBlocked ? <ShieldOff size={12} /> : <Shield size={12} />}
                                {u.isBlocked ? 'Restricted' : 'Synchronized'}
                             </span>
                          </td>
                          <td className="px-8 py-8">
                             <div className="space-y-1">
                                <p className="text-xs font-black text-slate-200">${u.wallet?.totalBalance.toLocaleString() || '0'}</p>
                                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Liquidity Signal</p>
                             </div>
                          </td>
                          <td className="px-8 py-8 whitespace-nowrap">
                             <div className="space-y-1">
                                <p className="text-xs font-black text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</p>
                             </div>
                          </td>
                          <td className="px-8 py-8 text-right">
                             <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                <button 
                                  onClick={() => setSelectedUser(u)}
                                  className="p-3 glass rounded-xl text-slate-600 hover:text-white transition-all"
                                  title="View Credentials"
                                >
                                   <Search size={18} />
                                </button>
                                <button 
                                  onClick={() => updateUserStatus(u._id, u.isBlocked ? 'active' : 'blocked')}
                                  title={u.isBlocked ? 'Re-authorize Node' : 'Restrict Node'}
                                  className={`p-3 rounded-xl border transition-all ${u.isBlocked ? 'border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary hover:bg-nexus-primary/20' : 'border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/20'}`}
                                >
                                   {u.isBlocked ? <Shield size={18} /> : <ShieldOff size={18} />}
                                </button>
                                <button 
                                  onClick={() => deleteUser(u._id)}
                                  title="Purge Node"
                                  className="p-3 rounded-xl border border-white/5 bg-white/5 text-slate-500 hover:text-white hover:bg-rose-500 hover:border-rose-500 transition-all"
                                >
                                   <Trash2 size={18} />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                       <tr>
                          <td colSpan={6} className="p-24 text-center">
                             <div className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center mx-auto mb-6">
                                <Search size={24} className="text-slate-800" />
                             </div>
                             <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">No matching identity nodes found</p>
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative nexus-card w-full max-w-lg p-10 bg-[#0a0b10] border-white/10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-[0.03]">
                 <UserIcon size={200} className="text-nexus-primary" />
              </div>

              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 p-1">
                     <img 
                       src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`} 
                       alt="avatar" 
                       className="w-full h-full object-cover rounded-2xl" 
                       referrerPolicy="no-referrer"
                     />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{selectedUser.name}</h3>
                    <p className="text-[10px] font-black text-nexus-primary uppercase tracking-[0.2em]">{selectedUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                  <ChevronRight size={24} className="rotate-90 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 relative z-10 mb-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Protocol Role</p>
                  <p className="text-sm font-black text-slate-200">{selectedUser.isAdmin ? 'Network Controller' : 'Capital Investor'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Sync Status</p>
                  <p className={`text-sm font-black ${selectedUser.isBlocked ? 'text-rose-500' : 'text-nexus-primary'}`}>
                    {selectedUser.isBlocked ? 'Restricted' : 'Synchronized'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Net liquidity</p>
                  <p className="text-sm font-black text-nexus-primary">${selectedUser.wallet?.totalBalance.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Date Joined</p>
                  <p className="text-sm font-black text-slate-200">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <button 
                  onClick={() => updateUserStatus(selectedUser._id, selectedUser.isBlocked ? 'active' : 'blocked')}
                  className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    selectedUser.isBlocked ? 'gradient-primary text-slate-900' : 'bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white'
                  }`}
                >
                  {selectedUser.isBlocked ? 'Re-authorize Node' : 'Restrict Node'}
                </button>
                <button 
                  onClick={() => deleteUser(selectedUser._id)}
                  className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-slate-600 hover:text-white transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
