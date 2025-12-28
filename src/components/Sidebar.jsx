import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { toast } from 'react-toastify';
import { 
  LayoutDashboard, 
  ScanLine, 
  History, 
  LogOut, 
  Settings 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

 const handleLogout = async () => {
     const toastId = toast.loading("Logging out...");
     
     await supabase.auth.signOut();
     
     // Update toast to success
     toast.update(toastId, { render: "Logged out", type: "success", isLoading: false, autoClose: 1000 });
     navigate('/login');
   };
   
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ScanLine, label: 'New Inspection', path: '/inspection' },
    { icon: History, label: 'History', path: '/history' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0">
      
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full border-2 border-blue-400 object-contain" />
          <span>ScreenSense AI</span>
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <NavLink to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl w-full hover:bg-slate-800 hover:text-white transition-all text-left cursor-pointer">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </NavLink>

        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-left cursor-pointer"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;