import { useEffect, useState } from 'react';
import { 
  Shield, Clock, Terminal, Activity, 
  Search, Filter, ChevronRight, User as UserIcon,
  Monitor, Info, Lock
} from 'lucide-react';

export const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log: any) => {
    return log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
           log.adminId?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-nexus-magenta">
            <Lock size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Audit Trail Registry</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Syndicate <span className="text-gradient">Logs</span></h2>
          <p className="text-slate-500 text-sm max-w-md normal-case font-medium uppercase tracking-widest">Global audit registry for all administrative node operations and integrity shifts.</p>
        </div>
        <div className="relative w-full md:w-80">
           <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
           <input 
             type="text" 
             placeholder="FILTER LOGS..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full glass py-4 pl-12 pr-6 rounded-2xl border-white/5 outline-none focus:border-nexus-magenta/30 text-[10px] font-black tracking-widest text-white placeholder:text-slate-800"
           />
        </div>
      </header>

      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center gap-6">
           <div className="w-12 h-12 border-4 border-nexus-magenta/20 border-t-nexus-magenta rounded-full animate-spin"></div>
           <p className="text-nexus-magenta/40 font-black uppercase tracking-[0.4em] text-[10px]">Retrieving Audit Registry...</p>
        </div>
      ) : (
        <div className="nexus-card p-0 overflow-hidden border-white/5 bg-black/20">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-white/[0.01] border-b border-white/5">
                       <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Node ID</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Operation Protocol</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Entity Signal</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Transmission Time</th>
                       <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Details</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {filteredLogs.map((log: any) => (
                       <tr key={log._id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-8">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-nexus-magenta/10 border border-nexus-magenta/20 flex items-center justify-center text-nexus-magenta">
                                   <UserIcon size={14} />
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-white uppercase tracking-wider leading-none">{log.adminId?.name}</p>
                                   <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mt-1">{log.ipAddress || '127.0.0.1'}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-8">
                             <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
                                   log.action.includes('USER') ? 'border-blue-500/20 bg-blue-500/5 text-blue-500' :
                                   log.action.includes('TRANSACTION') ? 'border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary' :
                                   'border-nexus-magenta/20 bg-nexus-magenta/5 text-nexus-magenta'
                                }`}>
                                   {log.action}
                                </span>
                             </div>
                          </td>
                          <td className="px-8 py-8">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.targetType || 'SYSTEM'}</p>
                             <p className="text-[9px] text-slate-700 font-bold tracking-widest">{log.targetId ? `ID: ${log.targetId.slice(-8)}` : 'GLOBAL'}</p>
                          </td>
                          <td className="px-8 py-8 whitespace-nowrap">
                             <div className="flex items-center gap-2 text-slate-500">
                                <Clock size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{new Date(log.createdAt).toLocaleString()}</span>
                             </div>
                          </td>
                          <td className="px-8 py-8 text-right">
                             <p className="text-[10px] font-black text-slate-300 normal-case">{log.details || 'Baseline Operation'}</p>
                          </td>
                       </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                       <tr>
                          <td colSpan={5} className="p-24 text-center">
                             <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Audit Registry Silent</p>
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
