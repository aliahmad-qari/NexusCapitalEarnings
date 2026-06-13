import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  X, Zap, TrendingUp, Users, Shield, ChevronRight,
  CheckCircle2, Star, Clock, DollarSign, Gift, Lock,
  BarChart2, ArrowRight, Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';

// ── Storage key — unique per user ID so each account gets their own preference
const storageKey = (userId: string) => `nexus_welcome_seen_${userId}`;

export const WelcomeModal = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  // Show on first visit — check localStorage keyed by user ID
  useEffect(() => {
    if (!user?.id) return;
    const alreadySeen = localStorage.getItem(storageKey(user.id));
    if (!alreadySeen) {
      // Small delay so the dashboard loads first before modal appears
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [user?.id]);

  const handleClose = () => {
    if (dontShow && user?.id) {
      localStorage.setItem(storageKey(user.id), 'true');
    }
    setVisible(false);
  };

  const handleStartInvesting = () => {
    if (user?.id) localStorage.setItem(storageKey(user.id), 'true');
    setVisible(false);
  };

  const firstName = user?.name?.split(' ')[0] || 'Investor';

  const sections = [
    {
      id: 'overview',
      icon: BarChart2,
      title: 'Platform Overview',
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10',
      border: 'border-cyan-400/20',
      content: (
        <div className="space-y-2.5">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            NexusCapital is a professional investment platform offering fixed daily returns
            on all plans. Every plan is managed by admin with full transparency.
          </p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: 'Daily ROI',    value: '10%',  icon: TrendingUp, color: 'text-nexus-primary' },
              { label: 'Duration',     value: '7 Days', icon: Clock,      color: 'text-cyan-400'    },
              { label: 'Principal',    value: 'Returned', icon: DollarSign, color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="glass p-2.5 rounded-xl border border-white/8 text-center">
                <s.icon size={14} className={`mx-auto mb-1 ${s.color}`} />
                <p className={`text-xs font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[9px] text-slate-600 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'plans',
      icon: Zap,
      title: 'Investment Plans',
      color: 'text-nexus-primary',
      bg: 'bg-nexus-primary/10',
      border: 'border-nexus-primary/20',
      content: (
        <div className="space-y-2">
          {[
            { name: 'Starter',  amount: 'PKR 300',    daily: 'PKR 30',     total: 'PKR 510' },
            { name: 'Bronze',   amount: 'PKR 1,000',  daily: 'PKR 100',    total: 'PKR 1,700' },
            { name: 'Silver',   amount: 'PKR 3,000',  daily: 'PKR 300',    total: 'PKR 5,100' },
            { name: 'Gold',     amount: 'PKR 5,000',  daily: 'PKR 500',    total: 'PKR 8,500' },
            { name: 'Diamond',  amount: 'PKR 10,000', daily: 'PKR 1,000',  total: 'PKR 17,000' },
          ].map((p, i) => (
            <div key={p.name}
              className="flex items-center justify-between px-3 py-2 rounded-xl border border-white/6 bg-white/[0.025] hover:border-nexus-primary/25 transition-all">
              <div className="flex items-center gap-2.5">
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold
                  ${i === 0 ? 'border-cyan-400/40 text-cyan-400 bg-cyan-400/10'
                  : i === 1 ? 'border-amber-400/40 text-amber-400 bg-amber-400/10'
                  : i === 2 ? 'border-nexus-primary/40 text-nexus-primary bg-nexus-primary/10'
                  : i === 3 ? 'border-yellow-300/40 text-yellow-300 bg-yellow-300/10'
                  : 'border-purple-400/40 text-purple-400 bg-purple-400/10'}`}>
                  {i + 1}
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-white">{p.name}</p>
                  <p className="text-[9px] text-slate-600">{p.amount} invested</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-nexus-primary">{p.daily}/day</p>
                <p className="text-[9px] text-slate-500">{p.total} total</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'profit',
      icon: TrendingUp,
      title: 'How Profits Work',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/20',
      content: (
        <div className="space-y-3">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            After your deposit is approved by admin, your investment activates automatically.
            Daily profit is credited to your wallet every 24 hours.
          </p>
          <div className="space-y-2">
            {[
              { step: '1', text: 'Submit deposit with payment proof (JazzCash / Easypaisa)', icon: DollarSign, color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
              { step: '2', text: 'Admin verifies & activates your plan within 24 hours',      icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
              { step: '3', text: '10% daily ROI credited to your wallet every 24h for 7 days', icon: TrendingUp,  color: 'text-nexus-primary bg-nexus-primary/10 border-nexus-primary/20' },
              { step: '4', text: 'After 7 days: full principal + all profits returned',         icon: Star,        color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/6">
                <div className={`p-1.5 rounded-lg border shrink-0 ${s.color}`}>
                  <s.icon size={12} />
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed pt-0.5">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'referral',
      icon: Gift,
      title: 'Referral Commissions',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-400/20',
      content: (
        <div className="space-y-3">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Earn instant commissions every time a friend registers using your unique referral code.
            No investment required from you — just share and earn.
          </p>
          <div className="p-4 rounded-xl border border-purple-400/20 bg-purple-400/5 text-center space-y-1">
            <p className="text-[9px] text-slate-500 uppercase tracking-wider">Per Referral Reward</p>
            <p className="text-2xl font-black text-purple-400">PKR 85</p>
            <p className="text-[9px] text-slate-600">Credited instantly on signup</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="glass p-3 rounded-xl border border-white/8 space-y-0.5">
              <p className="text-[9px] text-slate-600 uppercase">Your Code</p>
              <p className="text-sm font-bold text-white tracking-widest">{user?.referralCode}</p>
            </div>
            <div className="glass p-3 rounded-xl border border-white/8 space-y-0.5">
              <p className="text-[9px] text-slate-600 uppercase">Withdrawal unlock</p>
              <p className="text-xs font-bold text-white">2 referrals min.</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 px-1">
            ⚠️ You need at least <span className="text-white font-semibold">2 successful referrals</span> to unlock the withdrawal feature.
          </p>
        </div>
      ),
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Security & Important Notice',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
      content: (
        <div className="space-y-2.5">
          {[
            { icon: Lock,         color: 'text-emerald-400', title: 'Secure Transactions',   desc: 'All deposits verified manually by admin. Screenshots required for every deposit.' },
            { icon: Shield,       color: 'text-cyan-400',    title: 'Admin Controlled',       desc: 'Every deposit, withdrawal and investment activation is handled by a verified admin.' },
            { icon: Clock,        color: 'text-blue-400',    title: '24h Processing',         desc: 'Deposits approved within 24 hours. Withdrawals processed in the same timeframe.' },
            { icon: CheckCircle2, color: 'text-amber-400',   title: 'No Re-Investment',       desc: 'Wallet profits cannot be re-invested. Each plan requires a fresh external deposit.' },
          ].map(s => (
            <div key={s.title} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/6">
              <div className={`p-1.5 rounded-lg bg-white/5 border border-white/8 shrink-0 ${s.color}`}>
                <s.icon size={12} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-white">{s.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="relative w-full max-w-2xl max-h-[96vh] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,230,160,0.12)]"
            style={{ background: 'linear-gradient(135deg, #0d1422 0%, #0a0f1c 50%, #090d18 100%)' }}
          >
            {/* ── Top glow line ── */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-nexus-primary/60 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-nexus-primary/8 rounded-full blur-3xl pointer-events-none" />

            {/* ── Header ── */}
            <div className="relative shrink-0 px-6 pt-6 pb-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Logo mark */}
                  <motion.div
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                    className="relative shrink-0"
                  >
                    <div className="w-14 h-14 rounded-2xl border border-nexus-primary/30 bg-nexus-primary/10 flex items-center justify-center shadow-lg shadow-nexus-primary/20">
                      <span className="text-2xl font-black text-nexus-primary">$</span>
                    </div>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-nexus-primary rounded-full border-2 border-[#0a0f1c] flex items-center justify-center">
                      <Sparkles size={8} className="text-slate-900" />
                    </span>
                  </motion.div>

                  <div>
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                      className="text-[10px] text-nexus-primary font-bold uppercase tracking-widest mb-0.5 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-nexus-primary animate-ping inline-block" />
                      Welcome to NexusCapital
                    </motion.p>
                    <motion.h2
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl sm:text-2xl font-black text-white leading-tight"
                    >
                      Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-primary to-cyan-400">{firstName}</span> 👋
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.38 }}
                      className="text-[11px] text-slate-500 mt-0.5"
                    >
                      Here's everything you need to know before you start.
                    </motion.p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="p-2 glass rounded-xl border-white/8 text-slate-500 hover:text-white hover:border-white/20 transition-all shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Section nav pills */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 }}
                className="flex gap-1.5 mt-5 overflow-x-auto pb-0.5 no-scrollbar"
              >
                {sections.map((s, i) => {
                  const Icon = s.icon;
                  const isActive = activeSection === i;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSection(i)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-semibold whitespace-nowrap transition-all shrink-0 ${
                        isActive
                          ? `${s.bg} ${s.border} ${s.color}`
                          : 'border-white/8 text-slate-600 hover:text-slate-300 hover:border-white/15 bg-white/[0.02]'
                      }`}
                    >
                      <Icon size={11} />
                      {s.title.split(' ')[0]}
                    </button>
                  );
                })}
              </motion.div>
            </div>

            {/* ── Content area ── */}
            <div className="flex-1 overflow-y-auto px-6 pb-2 min-h-0">
              <div className="border border-white/8 rounded-2xl bg-white/[0.02] overflow-hidden">
                {/* Section header */}
                <div className={`flex items-center gap-3 px-5 py-4 border-b border-white/8 ${sections[activeSection].bg}`}>
                  {(() => {
                    const Icon = sections[activeSection].icon;
                    return (
                      <div className={`p-2 rounded-xl border ${sections[activeSection].border} bg-white/5`}>
                        <Icon size={16} className={sections[activeSection].color} />
                      </div>
                    );
                  })()}
                  <div>
                    <p className={`text-sm font-bold ${sections[activeSection].color}`}>
                      {sections[activeSection].title}
                    </p>
                    <p className="text-[9px] text-slate-600">
                      Section {activeSection + 1} of {sections.length}
                    </p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {sections.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveSection(i)}
                        className={`h-1 rounded-full transition-all ${
                          i === activeSection
                            ? `w-5 ${sections[activeSection].color.replace('text-', 'bg-')}`
                            : 'w-1.5 bg-white/15 hover:bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Section body */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                    className="p-5"
                  >
                    {sections[activeSection].content}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Prev / Next navigation */}
              <div className="flex justify-between items-center mt-3 mb-1">
                <button
                  onClick={() => setActiveSection(p => Math.max(0, p - 1))}
                  disabled={activeSection === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-xl border border-white/8 text-[10px] font-semibold text-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>
                {activeSection < sections.length - 1 ? (
                  <button
                    onClick={() => setActiveSection(p => p + 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-nexus-primary/10 border border-nexus-primary/30 text-nexus-primary rounded-xl text-[10px] font-semibold hover:bg-nexus-primary/20 transition-all"
                  >
                    Next <ArrowRight size={11} />
                  </button>
                ) : (
                  <span className="text-[10px] text-nexus-primary font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> All sections read
                  </span>
                )}
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 px-6 py-4 border-t border-white/8 bg-black/30 space-y-3">
              {/* Don't show again */}
              <label className="flex items-center gap-2.5 cursor-pointer group w-fit">
                <div
                  onClick={() => setDontShow(v => !v)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${
                    dontShow
                      ? 'bg-nexus-primary border-nexus-primary'
                      : 'border-white/20 bg-white/5 group-hover:border-white/40'
                  }`}
                >
                  {dontShow && <CheckCircle2 size={10} className="text-slate-900" />}
                </div>
                <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors select-none">
                  Don't show this again
                </span>
              </label>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2.5 glass rounded-xl border border-white/8 text-[11px] font-semibold text-slate-400 hover:text-white hover:border-white/20 transition-all"
                >
                  Maybe later
                </button>
                <Link
                  to="/dashboard/plans"
                  onClick={handleStartInvesting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 gradient-primary text-slate-900 rounded-xl font-bold text-sm shadow-lg shadow-nexus-primary/25 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Zap size={15} />
                  Start Investing Now
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
