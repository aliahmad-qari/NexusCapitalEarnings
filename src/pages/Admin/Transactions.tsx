import { useEffect, useState } from 'react';
import { 
  CreditCard, CheckCircle2, XCircle, Clock, 
  Search, Filter, ArrowDownRight, ArrowUpRight,
  TrendingUp, Download, Eye, MoreHorizontal, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TransactionApprovals = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setTransactions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm('Acknowledge institutional capital settlement?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/approve-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ transactionId: id, status: 'approved' })
      });
      if (res.ok) {
        fetchTransactions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm('Reject this settlement signal?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/approve-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ transactionId: id, status: 'rejected' })
      });
      if (res.ok) {
        fetchTransactions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTransactions = transactions.filter((tx: any) => {
    const matchesSearch = tx.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tx._id.includes(searchQuery);
    const matchesType = filterType === 'all' ? true : tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const pendingCount = transactions.filter((t: any) => t.status === 'pending').length;

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-nexus-primary">
            <CreditCard size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Settlement Matrix</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Audit <span className="text-gradient">Registry</span></h2>
          <p className="text-slate-500 text-sm max-w-md normal-case font-medium uppercase tracking-widest">Verifying institutional node injections and liquidity extractions.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
              <input 
                type="text" 
                placeholder="REF_ID OR MAIL..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full glass py-4 pl-12 pr-6 rounded-2xl border-white/5 outline-none focus:border-nexus-primary/30 text-[10px] font-black tracking-widest text-white placeholder:text-slate-800"
              />
           </div>
           <button onClick={fetchTransactions} className="p-4 glass rounded-2xl border-white/5 text-slate-500 hover:text-white transition-all">
              <TrendingUp size={20} />
           </button>
        </div>
      </header>

      {/* Summary Band */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
         {[
           { label: 'Pending Signals', count: pendingCount, color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' },
           { label: 'Processed Deployments', count: transactions.length - pendingCount, color: 'text-nexus-primary', bg: 'bg-nexus-primary/10 border-nexus-primary/20' }
         ].map((stat, i) => (
           <div key={i} className={`px-8 py-5 rounded-[24px] border ${stat.bg} shrink-0`}>
              <div className="flex items-center gap-3">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                 <span className={`text-xl font-black ${stat.color}`}>{stat.count}</span>
              </div>
           </div>
         ))}
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-700" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Settlement Filters</span>
           </div>
           <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {['all', 'deposit', 'withdraw', 'investment', 'profit'].map(t => (
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
             <p className="text-nexus-primary/40 font-black uppercase tracking-[0.4em] text-[10px]">Scanning Settlement Queues...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="nexus-card rounded-[48px] p-24 flex flex-col items-center border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
             <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-[32px] flex items-center justify-center mb-8">
                <AlertCircle className="text-slate-800" size={32} />
             </div>
             <h3 className="text-xl font-black mb-3 tracking-tighter uppercase">Audit Quiet</h3>
             <p className="text-slate-600 text-center max-w-xs text-xs leading-relaxed font-bold uppercase tracking-widest">No transaction signals match your current focus parameters.</p>
          </div>
        ) : (
          <div className="nexus-card p-0 overflow-hidden border-white/5">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-white/[0.01] border-b border-white/5">
                         <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Audit Timestamp</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Origin Node</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Settlement Sum</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Protocol Type</th>
                         <th className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Approval Switch</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {filteredTransactions.map((tx: any) => (
                         <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-8 py-8 whitespace-nowrap">
                               <div className="flex items-center gap-3">
                                  <Clock size={14} className="text-slate-700" />
                                  <span className="text-xs font-black text-slate-300">{new Date(tx.createdAt).toLocaleDateString()}</span>
                               </div>
                            </td>
                            <td className="px-8 py-8">
                               <div className="space-y-1">
                                  <p className="text-sm font-black text-white tracking-tight uppercase leading-none">{tx.user?.name}</p>
                                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{tx.user?.email}</p>
                               </div>
                            </td>
                            <td className="px-8 py-8 whitespace-nowrap">
                               <span className={`text-xl font-black tracking-tighter ${tx.type === 'withdraw' ? 'text-nexus-magenta' : 'text-nexus-primary'}`}>
                                  {tx.type === 'withdraw' ? '-' : '+'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </td>
                            <td className="px-8 py-8">
                               <div className="flex flex-col gap-1.5">
                                  <span className={`inline-flex px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest w-fit ${
                                     tx.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                     tx.status === 'approved' ? 'bg-nexus-primary/10 border-nexus-primary/20 text-nexus-primary' : 
                                     'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                  }`}>
                                     {tx.status}
                                  </span>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Sequence: {tx.type}</span>
                               </div>
                            </td>
                            <td className="px-8 py-8 text-right">
                               {tx.status === 'pending' ? (
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                     <button 
                                       onClick={() => handleApprove(tx._id)}
                                       className="p-3 bg-nexus-primary/10 text-nexus-primary border border-nexus-primary/20 rounded-xl hover:bg-nexus-primary transition-all hover:text-slate-900"
                                     >
                                        <CheckCircle2 size={18} />
                                     </button>
                                     <button 
                                       onClick={() => handleReject(tx._id)}
                                       className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 transition-all hover:text-white"
                                     >
                                        <XCircle size={18} />
                                     </button>
                                  </div>
                               ) : (
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">REF_{tx._id.slice(-6).toUpperCase()}</span>
                               )}
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
