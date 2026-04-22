import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { motion } from 'motion/react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-nexus-bg p-8 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-auto"
      >
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-xl">R</div>
          <span className="text-2xl font-bold tracking-tight">ROI<span className="text-blue-500">WEALTH</span></span>
        </div>

        <h2 className="text-3xl font-bold mb-2 tracking-tight">System Login</h2>
        <p className="text-white/40 mb-10 text-sm">Initialize session to access portfolio.</p>

        {error && <div className="glass border-rose-500/20 text-rose-500 p-4 rounded-2xl mb-8 text-[11px] font-bold uppercase tracking-wider">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="NETWORK ADDRESS"
              className="w-full glass rounded-2xl py-4.5 pl-14 pr-5 outline-none focus:border-blue-500 transition-all text-xs font-bold tracking-widest placeholder:text-white/10 uppercase"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ACCESS KEY"
              className="w-full glass rounded-2xl py-4.5 pl-14 pr-5 outline-none focus:border-blue-500 transition-all text-xs font-bold tracking-widest placeholder:text-white/10 uppercase"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-white/5 text-white font-bold py-4.5 rounded-2xl mt-4 flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 uppercase text-xs tracking-[0.2em]"
          >
            {loading ? 'Decrypting...' : 'Initialize'}
            <ChevronRight size={16} />
          </button>
        </form>

        <p className="text-center text-white/30 mt-10 text-[10px] font-bold uppercase tracking-widest">
          New to the network?{' '}
          <Link to="/register" className="text-blue-400">Join now</Link>
        </p>
      </motion.div>
    </div>
  );
};
