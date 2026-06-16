import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, UserPlus, ChevronRight, Eye, EyeOff, Shield, AlertCircle, CheckCircle2, Gift } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { motion, AnimatePresence } from 'motion/react';

export const Register = () => {
  const [searchParams] = useSearchParams();
  // Pre-fill referredBy from ?ref= query param — works with share links
  const refFromUrl = searchParams.get('ref') || '';

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    referredBy: refFromUrl,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // If the URL changes (e.g. user navigates to a new ref link), update the field
  useEffect(() => {
    if (refFromUrl) {
      setFormData(prev => ({ ...prev, referredBy: refFromUrl }));
    }
  }, [refFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    setError('');
    try {
      const apiBase = API_BASE;
      const res = await fetch(`${apiBase}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, referredBy: formData.referredBy || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-nexus-bg relative overflow-hidden selection:bg-nexus-primary/20 selection:text-nexus-primary">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nexus-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-20 -left-40 w-[400px] h-[400px] bg-nexus-secondary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-nexus-magenta/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[42%] flex-col justify-between p-12 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-nexus-primary/20">
            <UserPlus size={16} className="text-slate-900" />
          </div>
          <span className="text-base font-black text-white tracking-tight">Nexus Capital</span>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-nexus-primary/30 bg-nexus-primary/10 w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-nexus-primary animate-ping" />
              <span className="text-[10px] font-bold text-nexus-primary uppercase tracking-widest">Join Today</span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight">
              Start Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-primary via-cyan-400 to-purple-400">Investment Journey</span>
            </h1>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Create your free account and start earning daily passive income within minutes.</p>
          </div>
          <div className="space-y-3">
            {[
              { icon: Shield, label: 'Bank-grade security & encryption' },
              { icon: CheckCircle2, label: 'No hidden fees, ever' },
              { icon: UserPlus, label: 'Earn 10% referral commission' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-nexus-primary/10 border border-nexus-primary/20 flex items-center justify-center">
                  <Icon size={13} className="text-nexus-primary" />
                </div>
                <span className="text-xs text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-slate-700">© 2025 Nexus Capital. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative z-10 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-lg py-10">
        <div className="action-island p-7 md:p-10 inner-glow-top border-white/8">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-2 mb-5 p-1.5 glass rounded-xl border-white/5 pr-4 lg:hidden">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-lg shadow-nexus-primary/20">
                <UserPlus size={16} className="text-slate-900" />
              </div>
              <span className="text-[10px] font-semibold tracking-widest text-white uppercase opacity-70">Nexus Capital</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Get Started</h1>
            <p className="text-slate-500 text-xs">Create your Nexus Capital account today</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-5">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-500 text-xs">
                  <AlertCircle size={14} /> {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-primary transition-colors" size={14} />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-nexus-primary/30 transition-all text-xs font-medium text-white placeholder:text-slate-800" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-primary transition-colors" size={14} />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-nexus-primary/30 transition-all text-sm text-white placeholder:text-slate-800" required />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-primary transition-colors" size={14} />
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-10 outline-none focus:border-nexus-primary/30 transition-all text-sm text-white placeholder:text-slate-800" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-primary transition-colors" size={14} />
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-10 pr-10 outline-none focus:border-nexus-primary/30 transition-all text-sm text-white placeholder:text-slate-800" required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                Referral Code
                <span className="normal-case text-slate-700">(optional)</span>
                {refFromUrl && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-nexus-primary/10 border border-nexus-primary/20 text-nexus-primary text-[9px] font-bold">
                    <Gift size={9} /> Applied
                  </span>
                )}
              </label>
              <div className="relative group">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-primary transition-colors" size={14} />
                <input
                  type="text"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                  placeholder="Enter referral code if you have one"
                  className={`w-full bg-black/40 border rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-xs text-white placeholder:text-slate-800 ${
                    formData.referredBy
                      ? 'border-nexus-primary/40 bg-nexus-primary/5'
                      : 'border-white/5 focus:border-nexus-primary/30'
                  }`}
                />
              </div>
              {refFromUrl && (
                <p className="text-[10px] text-nexus-primary px-1">
                  ✓ Referral code <strong>{refFromUrl}</strong> applied from your invite link.
                </p>
              )}
            </div>

            <div className="px-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative w-5 h-5 mt-0.5 shrink-0">
                  <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" required />
                  <div className="w-5 h-5 rounded-md border border-white/10 bg-white/5 peer-checked:bg-nexus-primary peer-checked:border-nexus-primary transition-all flex items-center justify-center">
                    <CheckCircle2 size={11} className="text-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                </div>
                <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-400 leading-relaxed">
                  I agree to the <Link to="#" className="text-nexus-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-nexus-primary hover:underline">Privacy Policy</Link>
                </span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 gradient-primary text-slate-900 font-semibold rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-nexus-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 text-sm">
              {loading ? (
                <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /><span>Creating account...</span></div>
              ) : (<>Create Account <ChevronRight size={16} /></>)}
            </button>
          </form>

          <div className="mt-7 text-center">
            <p className="text-xs text-slate-600 mb-3">Already have an account?</p>
            <Link to="/login" className="glass px-6 py-3 rounded-xl border-white/5 text-xs font-semibold text-white hover:border-nexus-primary/30 hover:bg-white/[0.04] transition-all inline-block">
              Sign In
            </Link>
          </div>
        </div>

        <p className="text-center mt-5 text-[10px] text-slate-700 leading-relaxed px-4">Nexus Capital is a regulated investment platform. All data is encrypted and secure.</p>
        </motion.div>
      </div>
    </div>
  );
};
