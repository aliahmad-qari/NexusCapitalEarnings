import { useEffect, useState } from 'react';
import { Users, Copy, Share2, Award, TrendingUp, CheckCircle2, UserPlus, Gift, ExternalLink, Activity, RefreshCw, Loader } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth.tsx';
import { formatPKR } from '../utils/currency.ts';

export const Referrals = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralData, setReferralData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;

  useEffect(() => { fetchReferrals(); }, []);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const token   = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/investment/my-referrals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setReferralData(data);
    } catch (err) {
      console.error('fetchReferrals error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(user?.referralCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const referrals       = referralData?.referrals     || [];
  const totalCount      = referralData?.totalCount    ?? (user?.referralCount || 0);
  const rewardAmount    = referralData?.rewardAmount  ?? 85;
  // Use actual wallet referralEarnings as the source of truth for total earned
  const totalEarned     = referralData?.totalEarned   ?? (user?.wallet?.referralEarnings || 0);

  return (
    <div className="px-4 md:px-8 lg:px-12 pt-6 pb-16 max-w-[1700px] mx-auto space-y-6 text-slate-200 selection:bg-nexus-primary/20 selection:text-nexus-primary">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] to-[#080c18]" />
        <div className="absolute inset-0 bg-gradient-to-r from-nexus-magenta/8 via-transparent to-purple-500/8" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-magenta/40 to-transparent" />
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-nexus-magenta/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-nexus-magenta/30 bg-nexus-magenta/10 w-fit">
              <Users size={11} className="text-nexus-magenta" />
              <span className="text-[10px] font-bold text-nexus-magenta uppercase tracking-widest">Referral Program</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Earn While You <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-magenta to-purple-400">Share</span>
            </h2>
            <p className="text-slate-500 text-xs max-w-md">
              Invite friends and earn{' '}
              <span className="text-nexus-primary font-semibold">{formatPKR(rewardAmount)} per signup</span>
              {' '}— amount configured by admin, always from the database.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="px-4 py-3 glass rounded-xl border border-white/8 text-center">
              <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-0.5">Total Earned</p>
              <p className="text-sm font-bold text-nexus-magenta">{formatPKR(totalEarned)}</p>
            </div>
            <div className="px-4 py-3 glass rounded-xl border border-white/8 text-center">
              <p className="text-[9px] text-slate-600 uppercase tracking-wider mb-0.5">Referrals</p>
              <p className="text-sm font-bold text-white">{totalCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Main ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-6">

          {/* Share card */}
          <div className="nexus-card p-6 md:p-8 bg-gradient-to-br from-nexus-primary/[0.03] to-transparent border-white/10 shadow-xl">
            <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
              <div className="space-y-3">
                <div className="p-2.5 bg-nexus-primary/10 border border-nexus-primary/20 rounded-xl text-nexus-primary w-fit">
                  <UserPlus size={20} />
                </div>
                <h3 className="text-base font-bold text-white">Your Referral Code</h3>
                <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
                  Share your code and earn{' '}
                  <span className="text-nexus-primary font-semibold">{formatPKR(rewardAmount)}</span>
                  {' '}for every friend who registers.
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[10px] text-slate-600 font-medium mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-nexus-primary">{formatPKR(totalEarned)}</p>
                <p className="text-[10px] text-slate-500 mt-1">{totalCount} referral{totalCount !== 1 ? 's' : ''} × {formatPKR(rewardAmount)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="glass p-5 rounded-2xl border-white/5 space-y-3 hover:border-nexus-primary/20 transition-all">
                <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Referral Code</p>
                <div className="flex items-center justify-between gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-2 pl-4">
                  <span className="text-lg font-bold text-white tracking-widest">{user?.referralCode}</span>
                  <button onClick={copyCode}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${copied ? 'bg-nexus-primary text-slate-900' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}>
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div className="glass p-5 rounded-2xl border-white/5 space-y-3 hover:border-nexus-primary/20 transition-all">
                <p className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">Referral Link</p>
                <div className="flex items-center justify-between gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-2 pl-4">
                  <span className="text-xs text-slate-500 truncate">{referralLink}</span>
                  <button onClick={copyLink}
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-nexus-primary/10 text-nexus-primary hover:bg-nexus-primary/20 transition-all">
                    {copiedLink ? <CheckCircle2 size={16} /> : <Share2 size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button onClick={copyLink}
              className="w-full py-3 mt-4 gradient-primary text-slate-900 rounded-2xl font-semibold text-xs shadow-lg hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2">
              {copiedLink ? <><CheckCircle2 size={14} /> Link Copied!</> : <><ExternalLink size={14} /> Copy & Share Referral Link</>}
            </button>
          </div>

          {/* Referred Users Table */}
          <div className="nexus-card p-0 overflow-hidden border-white/5 shadow-xl">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 glass rounded-lg border-white/5 text-nexus-primary">
                  <Activity size={14} />
                </div>
                <h3 className="text-sm font-bold text-white">Referred Users</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-medium text-slate-600 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  {totalCount} user{totalCount !== 1 ? 's' : ''}
                </span>
                <button onClick={fetchReferrals} className="p-2 glass rounded-lg border-white/5 text-slate-500 hover:text-white transition-all">
                  <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-16 flex items-center justify-center gap-3 text-slate-600">
                <Loader size={18} className="animate-spin" />
                <span className="text-xs">Loading referrals…</span>
              </div>
            ) : referrals.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-3 text-center opacity-40">
                <Users size={28} className="text-slate-700" />
                <p className="text-xs text-slate-600">No referrals yet. Share your code to start earning.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-white/[0.01]">
                      <th className="px-5 py-3.5 text-[10px] font-medium text-slate-600 uppercase tracking-wider">User</th>
                      <th className="px-5 py-3.5 text-[10px] font-medium text-slate-600 uppercase tracking-wider">Joined</th>
                      <th className="px-5 py-3.5 text-[10px] font-medium text-slate-600 uppercase tracking-wider text-right">Reward Earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {referrals.map((r: any, i: number) => (
                      <tr key={r._id || i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-xs font-semibold text-slate-500 group-hover:border-nexus-primary/30 group-hover:text-nexus-primary transition-all">
                              {r.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-300">{r.name}</p>
                              <p className="text-[9px] text-slate-600">{r.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">
                          {new Date(r.joinedAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="text-sm font-bold text-nexus-primary group-hover:text-white transition-colors">
                            +{formatPKR(r.reward)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-nexus-primary/5 border-t border-nexus-primary/20">
                      <td colSpan={2} className="px-5 py-3 text-xs font-semibold text-slate-400">Total earned from referrals</td>
                      <td className="px-5 py-3 text-right text-sm font-black text-nexus-primary">{formatPKR(totalEarned)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ────────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-5">

          {/* Reward info card */}
          <div className="nexus-card p-6 bg-gradient-to-br from-nexus-magenta/[0.03] to-transparent border-nexus-magenta/10 shadow-xl">
            <div className="p-2.5 bg-nexus-magenta/10 border border-nexus-magenta/20 rounded-xl text-nexus-magenta w-fit mb-4">
              <Award size={18} />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Referral Reward</h4>
            <p className="text-[10px] text-slate-600 mb-5 leading-relaxed">
              Earn <span className="text-nexus-primary font-semibold">{formatPKR(rewardAmount)}</span> per successful referral signup.
              Reward amount is set by admin and comes directly from the database.
            </p>

            <div className="space-y-3">
              {[
                { label: 'Per Referral',     value: formatPKR(rewardAmount),                           color: 'text-nexus-primary' },
                { label: 'Your Referrals',   value: `${totalCount} signup${totalCount !== 1 ? 's' : ''}`, color: 'text-white' },
                { label: 'Total Credited',   value: formatPKR(totalEarned),                            color: 'text-nexus-magenta' },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
                  <span className="text-[11px] text-slate-500">{s.label}</span>
                  <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats card */}
          <div className="nexus-card p-6 border-white/5 bg-black/40">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 glass rounded-lg border-white/10">
                <TrendingUp size={15} className="text-nexus-primary" />
              </div>
              <h4 className="text-xs font-semibold text-white">Earnings Breakdown</h4>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-600">Referral earnings</span>
                  <span className="text-nexus-primary font-bold">{formatPKR(totalEarned)}</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.04] border border-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalCount / 10) * 100, 100)}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full gradient-primary rounded-full"
                  />
                </div>
                <p className="text-[9px] text-slate-600">{totalCount}/10 referrals milestone</p>
              </div>

              <div className="p-4 glass bg-white/[0.01] rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift size={14} className="text-nexus-primary" />
                  <span className="text-xs text-slate-400">Reward Rate</span>
                </div>
                <span className="text-sm font-bold text-nexus-primary">{formatPKR(rewardAmount)}/signup</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Rewards are credited instantly when a referred user registers.
                  The amount is admin-configurable and fetched from the database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
