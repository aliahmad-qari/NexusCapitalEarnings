import { Home, Wallet, PieChart, History, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: PieChart, label: 'Plans', path: '/plans' },
    { icon: History, label: 'History', path: '/history' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#030408]/80 backdrop-blur-2xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1.5 transition-all relative ${
              isActive ? 'text-nexus-primary' : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`transition-all ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,245,160,0.3)]' : ''}`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </motion.div>
            <span className={`text-[8px] font-black uppercase tracking-[0.15em] ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
            {isActive && (
              <motion.div 
                layoutId="indicator"
                className="absolute -top-0.5 h-0.5 w-6 gradient-primary rounded-full"
              />
            )}
          </Link>
        );
      })}
    </div>
  );
};
