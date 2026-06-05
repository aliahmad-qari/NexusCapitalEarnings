import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { BottomNav } from './BottomNav.tsx';
import { Sidebar } from './Sidebar.tsx';
import { Menu, Bell, Shield } from 'lucide-react';

export const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hideNavPaths = ['/login', '/register'];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-nexus-bg text-white flex selection:bg-nexus-primary/20 selection:text-nexus-primary">
      {!shouldHideNav && (
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}
      
      <main className={`flex-1 min-h-screen relative overflow-x-hidden`}>
        {!shouldHideNav && (
          <header className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#0a0e1a]/80 backdrop-blur-2xl sticky top-0 z-40">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 -ml-2 glass border-white/5 rounded-xl text-white/60 hover:text-white transition-all active:scale-90">
              <Menu size={22} />
            </button>
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-nexus-primary/30 flex items-center justify-center bg-nexus-primary/5 shadow-lg shadow-nexus-primary/10">
                <Shield size={20} className="text-nexus-primary" strokeWidth={2.5} />
              </div>
              <span className="font-black tracking-tight text-lg uppercase leading-none">ROI_<span className="text-gradient">HUB</span></span>
            </Link>
            <Link to="/dashboard/notifications" className="p-2.5 -mr-2 glass border-white/5 rounded-xl text-white/60 hover:text-white transition-all relative active:scale-90">
              <Bell size={22} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-nexus-magenta rounded-full shadow-[0_0_8px_rgba(255,0,255,0.6)]"></span>
            </Link>
          </header>
        )}
        
        <div className={`${shouldHideNav ? '' : 'w-full mx-auto pb-32 lg:pb-12'}`}>
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
