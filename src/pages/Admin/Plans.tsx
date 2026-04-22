import React, { useEffect, useState } from 'react';
import { 
  BarChart3, Plus, Trash2, Zap, Shield, 
  ChevronRight, Activity, Percent, DollarSign,
  Clock, List as ListIcon, X, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    dailyProfitPercent: 0,
    minInvestment: 0,
    maxInvestment: 0,
    durationDays: 30,
    features: ['']
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/investment/plans`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPlans(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = () => {
    setNewPlan({ ...newPlan, features: [...newPlan.features, ''] });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...newPlan.features];
    updatedFeatures[index] = value;
    setNewPlan({ ...newPlan, features: updatedFeatures });
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = newPlan.features.filter((_, i) => i !== index);
    setNewPlan({ ...newPlan, features: updatedFeatures });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/admin/create-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newPlan,
          features: newPlan.features.filter(f => f.trim() !== '')
        })
      });
      if (res.ok) {
        setIsCreating(false);
        setNewPlan({
          name: '',
          dailyProfitPercent: 0,
          minInvestment: 0,
          maxInvestment: 0,
          durationDays: 30,
          features: ['']
        });
        fetchPlans();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-nexus-magenta">
            <BarChart3 size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Strategy Configurator</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Investment <span className="text-gradient">Architect</span></h2>
          <p className="text-slate-500 text-sm max-w-md normal-case font-medium uppercase tracking-widest">Engineering high-performance yield protocols and institutional strategy nodes.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="gradient-primary px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl shadow-nexus-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus size={18} /> New Protocol
        </button>
      </header>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="nexus-card h-80 animate-pulse border-white/5 bg-white/[0.01]" />
          ))
        ) : plans.map((plan: any) => (
          <div key={plan._id} className="nexus-card p-10 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
               <Zap size={120} className="text-nexus-primary" />
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-2xl font-black tracking-tighter text-white uppercase">{plan.name}</h4>
                  <p className="text-nexus-primary text-[10px] font-black uppercase tracking-widest">Strategy Alpha</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-nexus-primary tracking-tighter">+{plan.dailyProfitPercent}%</p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Daily Yield</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                 <div>
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Scale Limit</p>
                    <p className="text-sm font-black text-slate-200">${plan.minInvestment.toLocaleString()} - ${plan.maxInvestment.toLocaleString()}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Cycle Duration</p>
                    <p className="text-sm font-black text-slate-200">{plan.durationDays} Pulse Units</p>
                 </div>
              </div>

              <div className="space-y-3">
                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Capabilities</p>
                 <ul className="space-y-2">
                    {plan.features.slice(0, 3).map((f: string, i: number) => (
                       <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                          <CheckCircle2 size={12} className="text-nexus-primary" />
                          {f}
                       </li>
                    ))}
                 </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Plan Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative nexus-card w-full max-w-2xl p-10 bg-[#0a0b10] border-white/10"
            >
               <h3 className="text-3xl font-black mb-8 tracking-tighter uppercase flex items-center gap-4">
                  <Shield className="text-nexus-magenta" size={28} />
                  Initialize <span className="text-nexus-magenta">New Protocol</span>
               </h3>

               <form onSubmit={handleSubmit} className="space-y-8 h-[60vh] overflow-y-auto pr-4 no-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Protocol Designation</label>
                        <input 
                           type="text"
                           required
                           placeholder="e.g., NEURON GOLD"
                           value={newPlan.name}
                           onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                           className="w-full glass p-4 rounded-xl border-white/5 text-sm font-black outline-none focus:border-nexus-magenta/30"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Daily Yield Signal (%)</label>
                        <input 
                           type="number"
                           step="0.01"
                           required
                           placeholder="e.g., 2.5"
                           value={newPlan.dailyProfitPercent}
                           onChange={(e) => setNewPlan({ ...newPlan, dailyProfitPercent: Number(e.target.value) })}
                           className="w-full glass p-4 rounded-xl border-white/5 text-sm font-black outline-none focus:border-nexus-magenta/30"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Min Threshold ($)</label>
                        <input 
                           type="number"
                           required
                           placeholder="100"
                           value={newPlan.minInvestment}
                           onChange={(e) => setNewPlan({ ...newPlan, minInvestment: Number(e.target.value) })}
                           className="w-full glass p-4 rounded-xl border-white/5 text-sm font-black outline-none focus:border-nexus-magenta/30"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Max Capacity ($)</label>
                        <input 
                           type="number"
                           required
                           placeholder="10000"
                           value={newPlan.maxInvestment}
                           onChange={(e) => setNewPlan({ ...newPlan, maxInvestment: Number(e.target.value) })}
                           className="w-full glass p-4 rounded-xl border-white/5 text-sm font-black outline-none focus:border-nexus-magenta/30"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Pulse Duration (Days)</label>
                        <input 
                           type="number"
                           required
                           placeholder="30"
                           value={newPlan.durationDays}
                           onChange={(e) => setNewPlan({ ...newPlan, durationDays: Number(e.target.value) })}
                           className="w-full glass p-4 rounded-xl border-white/5 text-sm font-black outline-none focus:border-nexus-magenta/30"
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Core Capabilities</label>
                        <button 
                           type="button" 
                           onClick={handleAddFeature}
                           className="text-[10px] font-black text-nexus-primary uppercase tracking-widest hover:text-white"
                        >
                           Add Vector
                        </button>
                     </div>
                     <div className="grid grid-cols-1 gap-3">
                        {newPlan.features.map((feature, index) => (
                           <div key={index} className="flex gap-2">
                              <input 
                                 type="text"
                                 placeholder="Protocol feature..."
                                 value={feature}
                                 onChange={(e) => handleFeatureChange(index, e.target.value)}
                                 className="flex-1 glass p-4 rounded-xl border-white/5 text-xs font-bold outline-none focus:border-nexus-primary/30"
                              />
                              {newPlan.features.length > 1 && (
                                 <button 
                                    type="button" 
                                    onClick={() => handleRemoveFeature(index)}
                                    className="p-4 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-colors"
                                 >
                                    <X size={16} />
                                 </button>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="pt-8 flex gap-4">
                     <button 
                        type="submit"
                        className="flex-1 gradient-primary py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl shadow-nexus-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                     >
                        Confirm Architecture Deployment
                     </button>
                     <button 
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="px-10 py-5 rounded-2xl bg-white/5 border border-white/5 text-slate-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
                     >
                        Abort
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
