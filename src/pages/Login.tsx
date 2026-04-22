import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { motion } from 'motion/react';

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
    <div className="flex flex-col min-h-screen bg-nexus-bg p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto my-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/30">
              R
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight">ROI<span className="text-blue-400">WEALTH</span></span>
              <p className="text-white/40 text-xs mt-1">Investment Platform</p>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-white/50 text-sm">Sign in to your account to continue</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass border-l-4 border-red-500 bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full glass rounded-xl py-3.5 pl-12 pr-4 outline-none border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm placeholder:text-white/30"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass rounded-xl py-3.5 pl-12 pr-12 outline-none border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm placeholder:text-white/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border border-white/20 bg-white/5 cursor-pointer" />
              <span className="text-white/50 group-hover:text-white/70 transition-colors">Remember me</span>
            </label>
            <Link to="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-white/5 disabled:to-white/5 text-white font-semibold py-3.5 rounded-xl mt-6 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 disabled:shadow-none"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-white/50 mt-8 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
