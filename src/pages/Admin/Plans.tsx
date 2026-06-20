import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Zap, X, Edit2, Gift, Save, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPKR } from '../../utils/currency.ts';
import { API_BASE } from '../../utils/api.ts';

export const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [form, setForm] = useState({ name: '', investmentAmount: 1000, dailyROI: 3, durationDays: 10, isActive: true });

  // Delete confirmation state
  const [deletingPlan, setDeletingPlan] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Referral setting state
  const [referralReward, setReferralReward] = useState<number>(85);
  const [referralInput, setReferralInput] = useState<string>('85');
  const [referralSaving, setReferralSaving] = useState(false);
  const [referralMsg, setReferralMsg] = useState('');

  useEffect(() => { fetchPlans(); fetchReferralSetting(); }, []);

  const fetchReferralSetting = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/admin/referral-setting`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.rewardAmount) { setReferralReward(data.rewardAmount); setReferralInput(String(data.rewardAmount)); }
    } catch (err) { console.error(err); }
  };

  const saveReferralSetting = async () => {
    const val = Number(referralInput);
    if (!val || val <= 0) return;
    setReferralSaving(true);
    setReferralMsg('');
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/admin/referral-setting`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rewardAmount: val }),
      });
      const data = await res.json();
      if (res.ok) { setReferralReward(val); setReferralMsg(`✅ Updated to PKR ${val}`); }
      else setReferralMsg(data.message || 'Failed');
    } catch { setReferralMsg('Error saving'); }
    finally { setReferralSaving(false); setTimeout(() => setReferralMsg(''), 3000); }
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      // Use admin endpoint — returns ALL plans including inactive
      const res = await fetch(`${apiBase}/api/admin/plans/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setPlans(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditingPlan(null);
    setForm({ name: '', investmentAmount: 1000, dailyROI: 3, durationDays: 10, isActive: true });
    setIsModalOpen(true);
  };

  const openEdit = (plan: any) => {
    setEditingPlan(plan);
    setForm({ name: plan.name, investmentAmount: plan.investmentAmount, dailyROI: plan.dailyROI, durationDays: plan.durationDays, isActive: plan.isActive });
    setIsModalOpen(true);
  };

  const toggleActive = async (plan: any) => {
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      await fetch(`${apiBase}/api/admin/plan/${plan._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !plan.isActive }),
      });
      fetchPlans();
    } catch (err) { console.error(err); }
  };

  const confirmDelete = (plan: any) => {
    setDeletingPlan(plan);
    setDeleteError('');
  };

  const executePlanDelete = async () => {
    if (!deletingPlan) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/admin/plan/${deletingPlan._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setDeletingPlan(null);
        fetchPlans();
      } else {
        setDeleteError(data.message || 'Failed to delete plan');
      }
    } catch {
      setDeleteError('Network error. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiBase = API_BASE;
      const url = editingPlan ? `${apiBase}/api/admin/plan/${editingPlan._id}` : `${apiBase}/api/admin/create-plan`;
      const res = await fetch(url, {
        method: editingPlan ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) { setIsModalOpen(false); fetchPlans(); }
      else { const d = await res.json(); alert(d.message || 'Failed'); }
    } catch (err) { console.error(err); }
  };

  const totalProfit = (plan: any) => Math.round((plan.investmentAmount * plan.dailyROI * plan.durationDays) / 100);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Investment Plans</h1>
          <p className="text-xs text-slate-500 mt-0.5">{plans.length} plans configured</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 gradient-primary text-slate-900 rounded-xl font-semibold text-xs shadow-lg shadow-nexus-primary/20 hover:scale-[1.02] transition-all">
          <Plus size={14} /> New Plan
        </button>
      </div>

      {/* Referral Reward Setting */}
      <div className="nexus-card border-white/8 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <Gift size={16} className="text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Referral Reward</p>
            <p className="text-[10px] text-slate-500 mt-0.5">PKR credited to referrer per new signup</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-600 font-semibold">PKR</span>
          <input
            type="number"
            value={referralInput}
            onChange={(e) => setReferralInput(e.target.value)}
            className="w-24 glass px-3 py-2 rounded-xl border border-white/8 text-xs text-white outline-none focus:border-purple-500/30 text-center font-bold"
            min={0}
          />
          <button
            onClick={saveReferralSetting}
            disabled={referralSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white text-[10px] font-semibold transition-all disabled:opacity-50"
          >
            <Save size={12} /> {referralSaving ? 'Saving...' : 'Save'}
          </button>
          {referralMsg && <span className="text-[10px] text-nexus-primary">{referralMsg}</span>}
        </div>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-nexus-primary/20 border-t-nexus-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan: any) => (
            <div key={plan._id} className={`nexus-card group relative border ${plan.isActive ? 'border-white/8' : 'border-rose-500/20 bg-rose-500/[0.02]'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{plan.name}</h3>
                    {!plan.isActive && <span className="px-1.5 py-0.5 rounded text-[8px] bg-rose-500/10 border border-rose-500/20 text-rose-400">Off</span>}
                  </div>
                  <p className="text-[9px] text-slate-500 mt-0.5">{plan.durationDays} days duration</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-nexus-primary">+{plan.dailyROI}%</p>
                  <p className="text-[9px] text-slate-600">daily ROI</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                  <p className="text-[9px] text-slate-600">Investment</p>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">{formatPKR(plan.investmentAmount)}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                  <p className="text-[9px] text-slate-600">Total Profit</p>
                  <p className="text-xs font-bold text-nexus-primary mt-0.5">+{formatPKR(totalProfit(plan))}</p>
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleActive(plan)}
                  className={`flex-1 py-2 rounded-lg border text-[10px] font-semibold transition-all ${plan.isActive ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400 hover:bg-yellow-500/10' : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10'}`}>
                  {plan.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => openEdit(plan)} className="px-3 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all">
                  <Edit2 size={12} />
                </button>
                <button onClick={() => confirmDelete(plan)} className="px-3 py-2 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <Zap size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-xs text-slate-600">No plans yet. Create your first plan.</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
              className="relative nexus-card w-full max-w-md p-6 border-white/10">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white">{editingPlan ? 'Edit Plan' : 'New Plan'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 transition-all"><X size={16} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider">Plan Name</label>
                  <input required type="text" placeholder="e.g. Bronze Plan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full glass px-4 py-2.5 rounded-xl border border-white/8 text-xs text-white outline-none focus:border-nexus-primary/30" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider">Amount (PKR)</label>
                    <input required type="number" value={form.investmentAmount} onChange={(e) => setForm({ ...form, investmentAmount: Number(e.target.value) })}
                      className="w-full glass px-4 py-2.5 rounded-xl border border-white/8 text-xs text-white outline-none focus:border-nexus-primary/30" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider">Daily ROI (%)</label>
                    <input required type="number" value={form.dailyROI} onChange={(e) => setForm({ ...form, dailyROI: Number(e.target.value) })}
                      className="w-full glass px-4 py-2.5 rounded-xl border border-white/8 text-xs text-white outline-none focus:border-nexus-primary/30" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider">Duration (days)</label>
                    <input required type="number" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
                      className="w-full glass px-4 py-2.5 rounded-xl border border-white/8 text-xs text-white outline-none focus:border-nexus-primary/30" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider">Status</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setForm({ ...form, isActive: true })}
                        className={`flex-1 py-2 rounded-lg border text-[10px] font-semibold transition-all ${form.isActive ? 'border-nexus-primary bg-nexus-primary/10 text-nexus-primary' : 'border-white/8 text-slate-600'}`}>On</button>
                      <button type="button" onClick={() => setForm({ ...form, isActive: false })}
                        className={`flex-1 py-2 rounded-lg border text-[10px] font-semibold transition-all ${!form.isActive ? 'border-rose-500 bg-rose-500/10 text-rose-400' : 'border-white/8 text-slate-600'}`}>Off</button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 py-2.5 gradient-primary text-slate-900 rounded-xl font-semibold text-xs shadow-lg">
                    {editingPlan ? 'Save Changes' : 'Create Plan'}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 glass rounded-xl border border-white/8 text-xs text-slate-400 hover:text-white transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !deleteLoading && setDeletingPlan(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
              className="relative nexus-card w-full max-w-sm p-6 border-rose-500/20"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent rounded-t-xl" />
              <div className="flex items-start gap-4 mb-5">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 shrink-0">
                  <AlertTriangle size={20} className="text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Delete Plan</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">This action cannot be undone.</p>
                </div>
                <button onClick={() => !deleteLoading && setDeletingPlan(null)} className="ml-auto p-1.5 hover:bg-white/10 rounded-lg text-slate-500 transition-all">
                  <X size={14} />
                </button>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/8 space-y-2 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Plan</span>
                  <span className="text-xs font-bold text-white">{deletingPlan.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Amount</span>
                  <span className="text-xs font-semibold text-slate-200">{formatPKR(deletingPlan.investmentAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">ROI</span>
                  <span className="text-xs font-semibold text-nexus-primary">+{deletingPlan.dailyROI}% / day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Duration</span>
                  <span className="text-xs font-semibold text-slate-200">{deletingPlan.durationDays} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Status</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${deletingPlan.isActive ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-slate-500 bg-white/5 border border-white/10'}`}>
                    {deletingPlan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-5">
                <AlertTriangle size={12} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-300 leading-relaxed">
                  Existing investments linked to this plan will not be affected — they continue earning ROI until completion. Only new deposits for this plan will stop.
                </p>
              </div>
              {deleteError && (
                <div className="p-3 rounded-xl bg-rose-500/8 border border-rose-500/20 text-rose-300 text-[11px] mb-4">
                  {deleteError}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={executePlanDelete} disabled={deleteLoading}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2">
                  {deleteLoading
                    ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting…</>
                    : <><Trash2 size={13} /> Delete Plan</>}
                </button>
                <button onClick={() => setDeletingPlan(null)} disabled={deleteLoading}
                  className="px-5 py-2.5 glass rounded-xl border border-white/8 text-xs text-slate-400 hover:text-white disabled:opacity-50 transition-all">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
