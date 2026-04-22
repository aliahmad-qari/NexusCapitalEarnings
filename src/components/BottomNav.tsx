import { Home, Wallet, PieChart, History, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

const navItems = [
  { icon: Home,     label: 'Dashboard', path: '/dashboard' },
  { icon: Wallet,   label: 'Wallet',    path: '/dashboard/wallet' },
  { icon: PieChart, label: 'Plans',     path: '/dashboard/plans' },
  { icon: History,  label: 'History',   path: '/dashboard/history' },
  { icon: User,     label: 'Profile',   path: '/dashboard/profile' },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-nexus-bg/85 backdrop-blur-2xl border-t border-white/5 px-6 py-4 flex justify-between items-center z-50">
      {navItems.map(({ icon: Icon, label, path }) => {
        const isActive = location.pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center gap-1.5 transition-all relative ${
              isActive ? 'text-nexus-primary' : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`transition-all ${
                isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,245,160,0.35)]' : ''
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </motion.div>
            <span className={`text-[8px] font-black uppercase tracking-[0.15em] ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {label}
            </span>
            {isActive && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute -top-0.5 h-0.5 w-6 gradient-primary rounded-full"
              />
            )}
          </Link>
        );
      })}
    </div>
  );
};
