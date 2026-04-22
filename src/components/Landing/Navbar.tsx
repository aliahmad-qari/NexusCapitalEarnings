import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-slate-950/60 backdrop-blur-xl border-b border-white/10 fixed top-0 w-full z-50 shadow-2xl shadow-emerald-500/5">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-8 py-4">
        <div className="text-2xl font-black tracking-tighter text-white">ROI</div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#solutions" className="text-emerald-400 border-b-2 border-emerald-400 pb-1 font-inter tracking-tight text-sm uppercase font-bold hover:text-white hover:bg-white/5 transition-all duration-300">Solutions</a>
          <a href="#portfolio" className="text-slate-400 font-inter tracking-tight text-sm uppercase font-bold hover:text-white hover:bg-white/5 transition-all duration-300">Portfolio</a>
          <a href="#security" className="text-slate-400 font-inter tracking-tight text-sm uppercase font-bold hover:text-white hover:bg-white/5 transition-all duration-300">Security</a>
          <a href="#insights" className="text-slate-400 font-inter tracking-tight text-sm uppercase font-bold hover:text-white hover:bg-white/5 transition-all duration-300">Insights</a>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-slate-400 font-inter tracking-tight text-sm uppercase font-bold px-4 py-2 hover:text-white transition-all"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="bg-primary-container text-on-primary-container font-inter tracking-tight text-sm uppercase font-bold px-6 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all"
          >
            Register
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-4 py-4 space-y-4">
          <a href="#solutions" className="block text-emerald-400 font-inter tracking-tight text-sm uppercase font-bold py-2">Solutions</a>
          <a href="#portfolio" className="block text-slate-400 font-inter tracking-tight text-sm uppercase font-bold py-2 hover:text-white">Portfolio</a>
          <a href="#security" className="block text-slate-400 font-inter tracking-tight text-sm uppercase font-bold py-2 hover:text-white">Security</a>
          <a href="#insights" className="block text-slate-400 font-inter tracking-tight text-sm uppercase font-bold py-2 hover:text-white">Insights</a>
          <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
            <button 
              onClick={() => {
                navigate('/login');
                setIsOpen(false);
              }}
              className="text-slate-400 font-inter tracking-tight text-sm uppercase font-bold px-4 py-2 hover:text-white transition-all w-full text-left"
            >
              Login
            </button>
            <button 
              onClick={() => {
                navigate('/register');
                setIsOpen(false);
              }}
              className="bg-primary-container text-on-primary-container font-inter tracking-tight text-sm uppercase font-bold px-6 py-2 rounded-lg hover:opacity-90 w-full"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
