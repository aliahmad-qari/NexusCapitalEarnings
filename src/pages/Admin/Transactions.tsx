import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, Search, ArrowDownRight, ArrowUpRight, RefreshCw, AlertCircle, X, Image, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPKR } from '../../utils/currency.ts';

export const TransactionApprovals = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [imgZoom, setImgZoom] = useState(false);

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/admin/transactions`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setTransactions(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    if (!window.confirm(`${status === 'approved' ? 'Approve' : 'Reject'} this transaction?`)) return;
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/admin/approve-transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ transactionId: id, status }),
      });
      if (res.ok) { fetchTransactions(); setSelectedTx(null); }
      else { const d = await res.json(); alert(d.message || 'Action failed'); }
    } catch (err) { console.error(err); }
  };

  const filtered = transactions.filter((tx: any) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || tx.user?.email?.toLowerCase().includes(q) || tx.user?.name?.toLowerCase().includes(q);
    const matchType = filterType === 'all' || tx.type === filterType;
    const matchStatus = filterStatus === 'all' || tx.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const pending = transactions.filter((t: any) => t.status === 'pending').length;

  const screenshotUrl = (tx: any) => {
    if (!tx.depositId?.screenshotUrl) return null;
    const apiBase = API_BASE;
    const raw = tx.depositId.screenshotUrl as string;
    // If already a full URL, use as-is
    if (raw.startsWith('http')) return raw;
    // Extract just the filename — handles both relative names and old full OS paths
    const filename = raw.replace(/\\/g, '/').split('/').pop();
    return `${apiBase}/uploads/deposits/${filename}`;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Transactions</h1>
          <p className="text-xs text-slate-500 mt-0.5">Review and approve deposit / withdrawal requests</p>
        </div>
        <button onClick={fetchTransactions} className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/8 text-xs font-semibold text-slate-400 hover:text-white transition-all">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pending', count: pending, color: 'text-yellow-400', bg: 'border-yellow-400/20 bg-yellow-400/5' },
          { label: 'Total', count: transactions.length, color: 'text-slate-300', bg: 'border-white/8 bg-white/[0.02]' },
          { label: 'Approved', count: transactions.filter((t: any) => t.status === 'approved' || t.status === 'completed').length, color: 'text-emerald-400', bg: 'border-emerald-400/20 bg-emerald-400/5' },
          { label: 'Rejected', count: transactions.filter((t: any) => t.status === 'rejected').length, color: 'text-rose-400', bg: 'border-rose-400/20 bg-rose-400/5' },
        ].map((s) => (
          <div key={s.label} className={`p-3 rounded-xl border ${s.bg} flex items-center justify-between`}>
            <span className="text-[10px] text-slate-500">{s.label}</span>
            <span className={`text-lg font-bold ${s.color}`}>{s.count}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
          <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 glass rounded-xl border border-white/8 outline-none focus:border-nexus-primary/30 text-xs text-white placeholder-slate-700" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'deposit', 'withdraw', 'profit', 'investment'].map((t) => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-2 rounded-lg border text-[10px] font-semibold uppercase transition-all ${filterType === t ? 'bg-nexus-primary/10 border-nexus-primary/30 text-nexus-primary' : 'border-white/8 text-slate-600 hover:text-white'}`}>
              {t}
            </button>
          ))}
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-white/8 bg-slate-900 text-[10px] text-slate-400 outline-none">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
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
            <table className="w-full text-left min-w-[750px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">User</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Screenshot</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-[9px] text-slate-600 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((tx: any) => {
                  const imgUrl = screenshotUrl(tx);
                  return (
                    <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <Clock size={11} />
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-xs font-semibold text-white">{tx.user?.name}</p>
                        <p className="text-[9px] text-slate-600">{tx.user?.email}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[9px] font-semibold uppercase ${tx.type === 'withdraw' ? 'border-nexus-magenta/20 bg-nexus-magenta/5 text-nexus-magenta' : 'border-nexus-primary/20 bg-nexus-primary/5 text-nexus-primary'}`}>
                          {tx.type === 'withdraw' ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span className={`text-sm font-bold ${tx.type === 'withdraw' ? 'text-nexus-magenta' : 'text-nexus-primary'}`}>
                          {tx.type === 'withdraw' ? '−' : '+'}{formatPKR(tx.amount)}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {imgUrl ? (
                          <button onClick={() => { setSelectedTx(tx); setImgZoom(false); }}
                            className="group relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all">
                            <img src={imgUrl} alt="screenshot" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Image size={14} className="text-white" />
                            </div>
                          </button>
                        ) : (
                          <span className="text-[9px] text-slate-700">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase border ${tx.status === 'pending' ? 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400' : tx.status === 'approved' || tx.status === 'completed' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : 'bg-rose-400/10 border-rose-400/20 text-rose-400'}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {tx.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => { setSelectedTx(tx); setImgZoom(false); }}
                              className="px-3 py-1.5 rounded-lg glass border border-white/8 text-slate-400 hover:text-white text-[10px] font-semibold transition-all">
                              View
                            </button>
                            <button onClick={() => handleAction(tx._id, 'approved')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-semibold transition-all">
                              <CheckCircle2 size={12} /> Approve
                            </button>
                            <button onClick={() => handleAction(tx._id, 'rejected')}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-[10px] font-semibold transition-all">
                              <XCircle size={12} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-700 font-mono">#{tx._id.slice(-6).toUpperCase()}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <AlertCircle size={24} className="text-slate-700 mx-auto mb-2" />
                      <p className="text-xs text-slate-700">No transactions found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <motion.div initial={{ scale: 0.93, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.93, opacity: 0 }}
              className="relative nexus-card w-full max-w-md border-white/10 overflow-hidden">

              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <h3 className="text-sm font-bold text-white">Deposit Proof</h3>
                <button onClick={() => setSelectedTx(null)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">

                {/* Screenshot */}
                {screenshotUrl(selectedTx) ? (
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Payment Screenshot</p>
                    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 cursor-zoom-in"
                      onClick={() => setImgZoom(true)}>
                      <img src={screenshotUrl(selectedTx)!} alt="Payment proof"
                        className="w-full max-h-56 object-contain" />
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <a href={screenshotUrl(selectedTx)!} target="_blank" rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-[10px] text-slate-300 hover:text-white transition-all">
                          <ExternalLink size={10} /> Open
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-white/5">
                    <Image size={20} className="text-slate-600" />
                    <p className="text-xs text-slate-500">No screenshot uploaded</p>
                  </div>
                )}

                {/* Deposit Details */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'User', value: selectedTx.user?.name },
                    { label: 'Email', value: selectedTx.user?.email },
                    { label: 'Amount', value: formatPKR(selectedTx.amount) },
                    { label: 'Method', value: selectedTx.depositId?.paymentMethod?.toUpperCase() || '—' },
                    { label: 'Ref / TxID', value: selectedTx.depositId?.transactionReference || '—' },
                    { label: 'Date', value: new Date(selectedTx.createdAt).toLocaleString() },
                  ].map((r) => (
                    <div key={r.label} className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                      <p className="text-[9px] text-slate-600 uppercase">{r.label}</p>
                      <p className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{r.value}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {selectedTx.status === 'pending' ? (
                  <div className="flex gap-3">
                    <button onClick={() => handleAction(selectedTx._id, 'approved')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white font-semibold text-sm transition-all">
                      <CheckCircle2 size={16} /> Approve
                    </button>
                    <button onClick={() => handleAction(selectedTx._id, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white font-semibold text-sm transition-all">
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                ) : (
                  <div className={`p-3 rounded-xl border text-center text-sm font-semibold ${selectedTx.status === 'approved' || selectedTx.status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-rose-500/20 bg-rose-500/5 text-rose-400'}`}>
                    {selectedTx.status.charAt(0).toUpperCase() + selectedTx.status.slice(1)}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full-size image zoom */}
      <AnimatePresence>
        {imgZoom && selectedTx && screenshotUrl(selectedTx) && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setImgZoom(false)}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-sm" />
            <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              src={screenshotUrl(selectedTx)!} alt="Payment proof"
              className="relative max-w-full max-h-full object-contain rounded-xl shadow-2xl cursor-zoom-out" />
            <button onClick={() => setImgZoom(false)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all">
              <X size={20} />
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
