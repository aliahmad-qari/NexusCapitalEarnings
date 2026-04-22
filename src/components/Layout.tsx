import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { BottomNav } from './BottomNav.tsx';
import { Sidebar } from './Sidebar.tsx';
import { Menu, Bell } from 'lucide-react';

export const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hideNavPaths = ['/login', '/register'];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-nexus-bg text-white flex">
      {!shouldHideNav && (
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}
      
      <main className={`flex-1 min-h-screen relative overflow-x-hidden ${shouldHideNav ? '' : 'pb-24 lg:pb-0'}`}>
        {!shouldHideNav && (
          <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#05060b]/80 backdrop-blur-xl sticky top-0 z-30">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-white/60 hover:text-white transition-colors">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center font-black text-slate-900 text-xs text-center">
                N
              </div>
              <span className="font-extrabold tracking-tighter text-sm uppercase">NEXUS</span>
            </div>
            <Link to="/notifications" className="p-2 -mr-2 text-white/60 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-nexus-magenta rounded-full"></span>
            </Link>
          </header>
        )}
        
        <div className={`${shouldHideNav ? '' : 'w-full mx-auto'}`}>
          <Outlet />
        </div>
      </main>

      {!shouldHideNav && (
        <div className="lg:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
};
