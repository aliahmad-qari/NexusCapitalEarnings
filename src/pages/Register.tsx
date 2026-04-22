import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, UserPlus, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { motion } from 'motion/react';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referredBy: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    setError('');
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          referredBy: formData.referredBy || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col min-h-screen bg-nexus-bg p-4 sm:p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto my-auto py-8"
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

          <h1 className="text-4xl font-bold mb-2 tracking-tight">Create Account</h1>
          <p className="text-white/50 text-sm">Join our investment community today</p>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Full Name</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full glass rounded-xl py-3.5 pl-12 pr-4 outline-none border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm placeholder:text-white/30"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full glass rounded-xl py-3.5 pl-12 pr-4 outline-none border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm placeholder:text-white/30"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
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
            <p className="text-xs text-white/40 mt-1">At least 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Confirm Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full glass rounded-xl py-3.5 pl-12 pr-12 outline-none border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm placeholder:text-white/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Referral Code */}
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Referral Code (Optional)</label>
            <div className="relative group">
              <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="text"
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                placeholder="Enter referral code"
                className="w-full glass rounded-xl py-3.5 pl-12 pr-4 outline-none border border-white/10 focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-sm placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer group mt-6">
            <input type="checkbox" className="w-4 h-4 rounded border border-white/20 bg-white/5 cursor-pointer mt-1" required />
            <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
              I agree to the <span className="text-blue-400 hover:text-blue-300">Terms of Service</span> and <span className="text-blue-400 hover:text-blue-300">Privacy Policy</span>
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-white/5 disabled:to-white/5 text-white font-semibold py-3.5 rounded-xl mt-6 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 disabled:shadow-none"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-white/50 mt-8 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
