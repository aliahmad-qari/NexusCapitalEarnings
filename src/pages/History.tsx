import { useEffect, useState } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, CreditCard, TrendingUp, 
  History as HistoryIcon, Clock, Filter, Activity, Search
} from 'lucide-react';
import { motion } from 'motion/react';

export const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchHistory();

    // Periodic polling to keep history and user balance in sync
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchHistory();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/wallet/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((item: any) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed':
      case 'approved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-400/20';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'rejected': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-white/40 bg-white/5 border-white/5';
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-4 md:pt-8 lg:pt-12 max-w-[1600px] mx-auto space-y-12 text-slate-200 uppercase tracking-tight">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-nexus-primary">
            <HistoryIcon size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Audit Registry</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Capital <span className="text-gradient">Registry</span></h2>
          <p className="text-slate-500 text-sm max-w-md normal-case font-medium">Comprehensive audit trail of institutional settlements and capital node deployments.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-none relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH REF_ID..." 
              className="w-full md:w-64 glass py-3.5 pl-12 pr-6 rounded-2xl border-white/5 outline-none focus:border-nexus-primary/30 text-[10px] font-black tracking-widest placeholder:text-slate-800"
            />
          </div>
          <button className="gradient-primary px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-lg shadow-nexus-primary/20 hover:scale-105 active:scale-95 transition-all">
             Export CSV
          </button>
        </div>
      </header>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-700" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Filter History</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['all', 'deposit', 'withdraw', 'profit', 'investment'].map(t => (
              <button 
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterType === t ? 'bg-nexus-primary/10 border-nexus-primary/30 text-nexus-primary' : 'bg-white/[0.02] border-white/5 text-slate-600 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-6">
             <div className="w-12 h-12 border-4 border-nexus-primary/20 border-t-nexus-primary rounded-full animate-spin"></div>
             <p className="text-nexus-primary/40 font-black uppercase tracking-[0.4em] text-[10px]">Synchronizing Ledger Registry...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="nexus-card rounded-[48px] p-24 flex flex-col items-center border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
             <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-[32px] flex items-center justify-center mb-8">
                <HistoryIcon className="text-slate-800" size={32} />
             </div>
             <h3 className="text-xl font-black mb-3 tracking-tighter uppercase">Audit Status: Null</h3>
             <p className="text-slate-600 text-center max-w-xs text-xs leading-relaxed font-bold uppercase tracking-widest">Perform a capital sequence to initiate audit logs.</p>
          </div>
        ) : (
          <div className="nexus-card p-0 overflow-hidden border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Entry Date</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Operation Type</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Amount (USD)</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredHistory.map((item: any) => (
                    <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-8 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Clock size={14} className="text-slate-700" />
                          <span className="text-xs font-black text-slate-300">
                            {new Date(item.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
                          item.type === 'withdraw' ? 'border-rose-500/20 bg-rose-500/5 text-rose-500' :
                          'border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-8 py-8 whitespace-nowrap">
                        <span className={`text-lg font-black tracking-tighter ${item.type === 'withdraw' ? 'text-rose-500' : 'text-slate-200'}`}>
                          {item.type === 'withdraw' ? '-' : '+'}${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-8 py-8">
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-[0.2em] ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-8 text-right font-mono text-[10px] text-slate-700 uppercase tracking-tighter">
                        REF_{item._id.slice(-8).toUpperCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
