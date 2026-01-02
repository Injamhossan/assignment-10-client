import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  PlusCircle,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth(); // Use real auth context
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (logout) await logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const sidebarLinks = [
    { name: 'Dashboard Home', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Profile', path: '/dashboard/myprofile', icon: <User size={20} /> },
    { name: 'My Connections', path: '/dashboard/myconnection', icon: <Users size={20} /> },
    { name: 'Create Profile', path: '/dashboard/createprofile', icon: <PlusCircle size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-base-200/50 flex font-sans transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-base-100 border-r border-base-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-base-200">
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            StudyMate
          </Link>
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-base-200 text-base-content/70">
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {sidebarLinks.map((link) => (
            <NavLink 
              key={link.path} 
              to={link.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/30' 
                    : 'text-base-content/70 hover:bg-base-200 hover:text-primary'
                }`
              }
              end={link.path === '/dashboard'}
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-base-200">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-base-100/80 backdrop-blur-md border-b border-base-200 sticky top-0 z-40 px-6 flex items-center justify-between transition-colors duration-300">
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-base-200 text-base-content/70">
            <Menu size={24} />
          </button>
          
          <div className="flex ml-auto items-center gap-4">
             {/* Profile Dropdown */}
             <div className="relative group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                   {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user?.displayName?.charAt(0) || <User size={20}/>}
                    </div>
                   )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-base-content">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-base-content/60">{user?.email}</p>
                  </div>
                </div>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
