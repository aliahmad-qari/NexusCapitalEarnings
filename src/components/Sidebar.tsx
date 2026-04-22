import { 
  LayoutDashboard, Wallet, BarChart3, Clock, User, Award, 
  ShieldCheck, HelpCircle, LogOut, X, PieChart, Users, 
  Bell, Lock, Settings as SettingsIcon, MessageSquare
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
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Wallet, label: 'Capital Ledger', path: '/wallet' },
    { icon: BarChart3, label: 'Investment Plans', path: '/plans' },
    { icon: PieChart, label: 'My Investments', path: '/my-investments' },
    { icon: Clock, label: 'Transaction History', path: '/history' },
    { icon: Users, label: 'Referrals', path: '/referrals' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const supportNavItems = [
    { icon: Lock, label: 'Security Settings', path: '/security' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  const adminNavItems = [
    { icon: ShieldCheck, label: 'Admin Hub', path: '/admin' },
    { icon: Users, label: 'User Nodes', path: '/admin/users' },
    { icon: BarChart3, label: 'Investment Strategies', path: '/admin/plans' },
    { icon: Clock, label: 'Registry Queue', path: '/admin/transactions' },
    { icon: Lock, label: 'Audit Logs', path: '/admin/logs' },
  ];

  const SidebarContent = () => {
    const { user } = useAuth();
    
    return (
      <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-10 px-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center font-black text-slate-900 shadow-lg shadow-nexus-primary/20">
              N
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase leading-none text-white">NEXUS</span>
              <span className="text-[9px] font-black text-nexus-primary tracking-[0.4em] uppercase opacity-70">Capital</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {/* Admin Navigation (Only for Admins) */}
        {user?.isAdmin && (
          <div className="mb-10 bg-nexus-magenta/[0.03] border border-nexus-magenta/10 rounded-3xl p-2">
            <p className="text-[10px] font-black text-nexus-magenta uppercase tracking-[0.3em] mb-4 mt-2 px-4 flex items-center gap-2">
              <ShieldCheck size={12} />
              Control Matrix
            </p>
            <nav className="space-y-1">
              {adminNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 group ${
                      isActive 
                        ? 'text-white bg-nexus-magenta/10 border border-nexus-magenta/20 shadow-lg shadow-nexus-magenta/5 font-black' 
                        : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'
                    }`}
                  >
                    <Icon size={16} className={`mr-4 transition-transform duration-300 ${isActive ? 'text-nexus-magenta' : 'group-hover:scale-110'}`} />
                    <span className="text-xs font-bold tracking-tight">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
        
        {/* Main Navigation */}
        <div className="mb-8">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6 px-4">Executive Suite</p>
        <nav className="space-y-1.5">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'text-white glass border-nexus-primary/30 bg-nexus-primary/[0.03] shadow-lg shadow-nexus-primary/5' 
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'
                }`}
              >
                <Icon size={18} className={`mr-4 transition-transform duration-300 ${isActive ? 'text-nexus-primary' : 'group-hover:scale-110'}`} />
                <span className={`font-bold text-sm tracking-tight ${isActive ? 'font-black' : ''}`}>{item.label}</span>
                {isActive && (
                  <motion.div layoutId="activeInd" className="ml-auto w-1 h-4 bg-nexus-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Support Navigation */}
      <div className="mb-10">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6 px-4">Network Ops</p>
        <nav className="space-y-1.5">
          {supportNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'text-white glass border-nexus-primary/30 bg-nexus-primary/[0.03] shadow-lg shadow-nexus-primary/5' 
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]'
                }`}
              >
                <Icon size={18} className={`mr-4 transition-transform duration-300 ${isActive ? 'text-nexus-primary' : 'group-hover:scale-110'}`} />
                <span className={`font-bold text-sm tracking-tight ${isActive ? 'font-black' : ''}`}>{item.label}</span>
                {isActive && (
                  <motion.div layoutId="activeIndSupport" className="ml-auto w-1 h-4 bg-nexus-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Tier Card */}
      <div className="mt-auto pt-6">
        <div className="glass p-5 rounded-3xl border border-white/5 mb-8 bg-gradient-to-br from-nexus-magenta/[0.02] to-transparent shrink-0">
          <div className="flex justify-between items-center mb-4">
             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Network Tier</p>
             <Award size={14} className="text-nexus-magenta" />
          </div>
          <p className="text-sm font-black mb-3 tracking-tight text-slate-200">Institutional Access</p>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="gradient-primary h-full w-[65%] rounded-full"></div>
          </div>
          <p className="text-[9px] text-slate-600 font-bold mt-2.5 normal-case">35% more yield to unlock <span className="text-nexus-primary font-black uppercase">Alpha Node</span></p>
        </div>

        <button 
          onClick={() => { logout(); onClose(); }}
          className="w-full flex items-center px-5 py-4.5 bg-nexus-magenta/5 text-nexus-magenta rounded-2xl hover:bg-nexus-magenta/10 transition-all font-black text-xs uppercase tracking-[0.1em] border border-nexus-magenta/20 group shrink-0"
        >
          <LogOut size={16} className="mr-4 group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </div>
    </div>
  );
};

  return (
    <>
      <aside className="w-72 border-r border-white/5 bg-[#05060b] p-8 flex-col h-screen sticky top-0 hidden lg:flex shrink-0">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#05060b] p-8 z-50 lg:hidden flex flex-col border-r border-white/10"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
