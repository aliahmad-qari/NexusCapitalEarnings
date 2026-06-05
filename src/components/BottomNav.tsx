import { Home, Wallet, PieChart, History, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

const navItems = [
  { icon: Home,     label: 'HUB',     path: '/dashboard' },
  { icon: Wallet,   label: 'WALLET',  path: '/dashboard/wallet' },
  { icon: PieChart, label: 'NODES',   path: '/dashboard/plans' },
  { icon: History,  label: 'AUDIT',   path: '/dashboard/history' },
  { icon: User,     label: 'PROFILE', path: '/dashboard/profile' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 flex justify-center">
      <div className="action-island w-full max-w-lg px-8 py-4 flex justify-between items-center border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-2 transition-all relative ${
                isActive ? 'text-nexus-primary' : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              <motion.div
                whileTap={{ scale: 0.8 }}
                className={`transition-all ${
                  isActive ? 'scale-110 drop-shadow-[0_0_12px_rgba(0,230,160,0.5)]' : ''
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 3 : 2.5} />
              </motion.div>
              <span className={`text-[7px] font-black uppercase tracking-[0.25em] ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-6 h-1 w-6 gradient-primary rounded-full blur-[2px]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
