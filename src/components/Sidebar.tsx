import { 
  LayoutDashboard, Wallet, BarChart3, Clock, User, Award, 
  ShieldCheck, HelpCircle, LogOut, X, PieChart, Users, 
  Bell, Lock, Settings as SettingsIcon, Activity
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();

  const mainNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Wallet, label: 'Wallet', path: '/dashboard/wallet' },
    { icon: BarChart3, label: 'Investment Plans', path: '/dashboard/plans' },
    { icon: PieChart, label: 'My Investments', path: '/dashboard/my-investments' },
    { icon: Clock, label: 'History', path: '/dashboard/history' },
    { icon: Users, label: 'Referrals', path: '/dashboard/referrals' },
    { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ];

  const supportNavItems = [
    { icon: ShieldCheck, label: 'Security', path: '/dashboard/security' },
    { icon: HelpCircle, label: 'Support', path: '/dashboard/support' },
    { icon: SettingsIcon, label: 'Settings', path: '/dashboard/settings' },
  ];

  const adminNavItems = [
    { icon: Activity, label: 'Admin Overview', path: '/dashboard/admin' },
    { icon: Users, label: 'Users', path: '/dashboard/admin/users' },
    { icon: BarChart3, label: 'Plans', path: '/dashboard/admin/plans' },
    { icon: Clock, label: 'Transactions', path: '/dashboard/admin/transactions' },
    { icon: Lock, label: 'Audit Logs', path: '/dashboard/admin/logs' },
  ];

  const SidebarContent = () => {
    const { user } = useAuth();

    return (
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar py-2">
        
        {/* Brand */}
        <div className="flex items-center justify-between mb-8 px-2 shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl gradient-primary p-0.5 shadow-lg shadow-nexus-primary/20 transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-[calc(0.75rem-2px)] bg-[#0a0e1a] flex items-center justify-center border border-black/40">
                <span className="text-nexus-primary font-bold text-sm">$</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white leading-none">Nexus<span className="text-gradient">Capital</span></span>
              <span className="text-[9px] text-slate-600 tracking-wider mt-0.5">Investment Platform</span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden w-8 h-8 glass border-white/5 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Admin Section */}
        {user?.isAdmin && (
          <div className="mb-6 bg-nexus-magenta/[0.03] border border-nexus-magenta/10 rounded-2xl p-2">
            <p className="text-[9px] font-semibold text-nexus-magenta uppercase tracking-widest mb-2 mt-1 px-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-nexus-magenta animate-pulse" />
              Admin Panel
            </p>
            <nav className="space-y-0.5">
              {adminNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path} onClick={onClose}
                    className={`flex items-center px-3 py-2.5 rounded-xl transition-all group/nav ${isActive ? 'text-white bg-nexus-magenta/15 border border-nexus-magenta/20' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'}`}>
                    <Icon size={15} className={`mr-3 transition-all ${isActive ? 'text-nexus-magenta' : 'group-hover/nav:text-slate-300'}`} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Main Navigation */}
        <div className="mb-6">
          <p className="text-[9px] font-medium text-slate-700 uppercase tracking-widest mb-2 px-3">Main Menu</p>
          <nav className="space-y-0.5">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} onClick={onClose}
                  className={`flex items-center px-3 py-2.5 rounded-xl transition-all group/nav relative ${isActive ? 'text-white glass border-nexus-primary/20 bg-nexus-primary/[0.03] shadow-sm' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'}`}>
                  <Icon size={16} className={`mr-3 transition-all ${isActive ? 'text-nexus-primary' : 'group-hover/nav:text-slate-300'}`} />
                  <span className={`text-xs ${isActive ? 'font-semibold text-white' : 'font-medium'}`}>{item.label}</span>
                  {isActive && (
                    <motion.div layoutId="activeInd" className="ml-auto w-1 h-4 bg-nexus-primary rounded-full shadow-[0_0_6px_rgba(0,230,160,0.5)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Support Navigation */}
        <div className="mb-6">
          <p className="text-[9px] font-medium text-slate-700 uppercase tracking-widest mb-2 px-3">Account</p>
          <nav className="space-y-0.5">
            {supportNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} onClick={onClose}
                  className={`flex items-center px-3 py-2.5 rounded-xl transition-all group/nav ${isActive ? 'text-white glass border-nexus-primary/20 bg-nexus-primary/[0.03] shadow-sm' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'}`}>
                  <Icon size={16} className={`mr-3 transition-all ${isActive ? 'text-nexus-primary' : 'group-hover/nav:text-slate-300'}`} />
                  <span className={`text-xs ${isActive ? 'font-semibold text-white' : 'font-medium'}`}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tier Card + Logout */}
        <div className="mt-auto pt-4 px-1 space-y-3">
          <div className="glass p-4 rounded-2xl border border-white/5 bg-gradient-to-br from-nexus-primary/[0.02] to-transparent">
            <div className="flex items-center gap-2 mb-3">
              <Award size={13} className="text-nexus-primary" />
              <span className="text-[10px] font-semibold text-slate-400">Account Tier</span>
            </div>
            <p className="text-xs font-bold text-white mb-2">Elite Member</p>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden border border-white/5">
              <div className="h-full w-[72%] rounded-full gradient-primary"></div>
            </div>
            <p className="text-[10px] text-slate-600 mt-2 leading-relaxed">Invest 28% more to unlock <span className="text-nexus-primary font-medium">Alpha tier</span>.</p>
          </div>

          <button onClick={() => { logout(); onClose(); }}
            className="w-full py-3 glass border-nexus-magenta/20 bg-nexus-magenta/5 text-nexus-magenta rounded-xl hover:bg-nexus-magenta/10 hover:border-nexus-magenta/40 transition-all font-semibold text-xs flex items-center justify-center gap-2 group/logout">
            <LogOut size={14} className="group-hover/logout:-translate-x-0.5 transition-transform" />
            Sign Out
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <aside className="w-64 border-r border-white/5 bg-[#0a0e1a] px-4 py-6 flex-col h-screen sticky top-0 hidden lg:flex shrink-0 shadow-2xl">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-40 lg:hidden" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-[#0a0e1a] px-4 py-6 z-50 lg:hidden flex flex-col border-r border-white/10 shadow-2xl">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
