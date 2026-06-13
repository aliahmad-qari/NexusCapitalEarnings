import { useEffect, useState } from 'react';
import { History as HistoryIcon, Filter, Search, ArrowUpRight, ArrowDownRight, Activity, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPKR } from '../utils/currency.ts';

export const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchType] = useState('');

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(() => { if (document.visibilityState === 'visible') fetchHistory(); }, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/wallet/history`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setHistory(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const filteredHistory = history.filter((item: any) => {
    const matchesFilter = filterType === 'all' || item.type === filterType;
    const matchesSearch = item._id.toLowerCase().includes(searchQuery.toLowerCase()) || item.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': case 'approved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-400/20';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'rejected': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-white/40 bg-white/5 border-white/5';
    }
  };

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-6 pb-16 max-w-[1700px] mx-auto space-y-6 selection:bg-nexus-primary/20 selection:text-nexus-primary">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] to-[#080c18]" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/8 via-transparent to-nexus-primary/8" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 p-6 md:p-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-400/30 bg-purple-400/10 w-fit">
              <HistoryIcon size={11} className="text-purple-400" />
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Audit Ledger</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">Transaction <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-nexus-primary">History</span></h2>
            <p className="text-slate-500 text-xs max-w-md">Full audit trail of all deposits, withdrawals, profits and investments.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
            <div className="flex-1 sm:w-72 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-primary transition-colors" size={15} />
              <input type="text" placeholder="Search transactions..." value={searchQuery} onChange={(e) => setSearchType(e.target.value)} className="w-full bg-black/50 border border-white/8 py-2.5 pl-10 pr-4 rounded-xl outline-none focus:border-nexus-primary/30 text-xs font-medium placeholder:text-slate-700 text-white transition-all" />
            </div>
            <button className="h-10 px-5 gradient-primary rounded-xl text-xs font-semibold text-slate-900 shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <div className="p-2 glass rounded-xl border-white/5 shrink-0">
          <Filter size={13} className="text-slate-600" />
        </div>
        {['all', 'deposit', 'withdraw', 'profit', 'investment', 'referral'].map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-4 py-2 rounded-xl border text-[10px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${filterType === t ? 'bg-nexus-primary/10 border-nexus-primary/30 text-nexus-primary' : 'bg-white/[0.01] border-white/5 text-slate-600 hover:text-white hover:bg-white/[0.03]'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <AnimatePresence mode="wait">
        {loading && history.length === 0 ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-nexus-primary/10 border-t-nexus-primary rounded-full animate-spin"></div>
            <p className="text-nexus-primary/50 font-medium text-xs">Loading transactions...</p>
          </motion.div>
        ) : filteredHistory.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="nexus-card rounded-2xl p-16 flex flex-col items-center border-white/5">
            <Activity className="text-slate-800 mb-4" size={36} />
            <h3 className="text-sm font-bold mb-2 text-white">No Transactions Found</h3>
            <p className="text-slate-600 text-center text-xs">No records match your current filter.</p>
          </motion.div>
        ) : (
          <motion.div key="table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="nexus-card p-0 overflow-hidden border-white/5 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Amount (PKR)</th>
                    <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right">Reference ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredHistory.map((item: any) => (
                    <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-medium text-slate-300">
                          {new Date(item.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-semibold uppercase tracking-wider ${item.type === 'withdraw' ? 'border-rose-500/20 bg-rose-500/5 text-rose-500' : 'border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary'}`}>
                          {item.type === 'withdraw' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-bold ${item.type === 'withdraw' ? 'text-rose-500' : 'text-white'}`}>
                          {item.type === 'withdraw' ? '-' : '+'}{formatPKR(item.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-semibold px-3 py-1 rounded-lg border uppercase tracking-wider ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-[10px] text-slate-700 uppercase tracking-wider group-hover:text-slate-500 transition-colors">
                        #{item._id.slice(-10).toUpperCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
