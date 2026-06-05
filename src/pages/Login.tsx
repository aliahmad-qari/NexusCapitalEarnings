import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ChevronRight, Eye, EyeOff, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { motion, AnimatePresence } from 'motion/react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-nexus-bg p-6 md:p-12 relative overflow-hidden selection:bg-nexus-primary/20 selection:text-nexus-primary">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nexus-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-nexus-magenta/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md mx-auto my-auto relative z-10"
      >
        <div className="action-island p-7 md:p-10 inner-glow-top border-white/8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-5 p-1.5 glass rounded-xl border-white/5 pr-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-lg shadow-nexus-primary/20">
                <Shield size={16} className="text-slate-900" />
              </div>
              <span className="text-[10px] font-semibold tracking-widest text-white uppercase opacity-70">Secure Login</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-xs">Sign in to your Nexus Capital account</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-5">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-500 text-xs font-medium">
                  <AlertCircle size={14} />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider px-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-primary transition-colors" size={15} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-nexus-primary/30 transition-all text-sm font-medium text-white placeholder:text-slate-800" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider px-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-nexus-primary transition-colors" size={15} />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-12 outline-none focus:border-nexus-primary/30 transition-all text-sm font-medium text-white placeholder:text-slate-800" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative w-4 h-4">
                  <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="w-4 h-4 rounded border border-white/10 bg-white/5 peer-checked:bg-nexus-primary peer-checked:border-nexus-primary transition-all flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-slate-900 opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                </div>
                <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-300">Remember me</span>
              </label>
              <Link to="#" className="text-[10px] font-medium text-nexus-primary hover:text-white transition-colors">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 gradient-primary text-slate-900 font-semibold rounded-xl mt-2 flex items-center justify-center gap-3 transition-all shadow-xl shadow-nexus-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 text-sm">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>Sign In <ChevronRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-600 mb-3">Don't have an account?</p>
            <Link to="/register" className="glass px-6 py-3 rounded-xl border-white/5 text-xs font-semibold text-white hover:border-nexus-primary/30 hover:bg-white/[0.04] transition-all inline-block">
              Create Account
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-[10px] text-slate-700 leading-relaxed px-4">
            Your session is protected with end-to-end encryption.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
