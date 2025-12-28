import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProfileMenu from './ProfileMenu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { 
  ChevronRight, Search, Bell, HelpCircle 
} from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const getPageConfig = (pathname) => {
     switch (pathname) {
      case '/': return { title: 'Dashboard', subtitle: 'Shop Overview & Statistics' };
      case '/inspection': return { title: 'New Inspection', subtitle: 'AI-Powered Defect Detection'};
      case '/history': return { title: 'Inspection History', subtitle: 'Archive of all past device scans' };
      default: return { title: 'QA System', subtitle: 'Quality Assurance Control' };
    }
  };

  const currentConfig = getPageConfig(location.pathname);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="dark"
      />

      <Sidebar />

      <div className="flex-1 flex flex-col ml-64 h-screen overflow-y-auto relative">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between transition-all">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <span>Application</span>
              <ChevronRight size={12} />
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full capitalize">
                {currentConfig.title}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              {currentConfig.title}
            </h1>
            <p className="text-sm text-slate-500 hidden md:block">
              {currentConfig.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Icon */}
            <button
              onClick={() => toast.info("No new notifications")}
              className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors cursor-pointer group"
            >
              <Bell size={20} className="group-hover:text-slate-700" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* Help Icon */}
            <button
              onClick={() => toast.info("Help Center coming soon!")}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors cursor-pointer group mr-2"
            >
              <HelpCircle size={20} className="group-hover:text-slate-700" />
            </button>

            <ProfileMenu />
          </div>
        </header>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;