import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, LogOut, User, ChevronDown, Menu, X, LayoutDashboard } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import NavLogo from "../../assets/StudyMate.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth() || {};

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate('/');
      setOpen(false);
      setProfileDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!profileDropdownRef.current) return;
      if (!profileDropdownRef.current.contains(e.target)) setProfileDropdownOpen(false);
    };
    if (profileDropdownOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [profileDropdownOpen]);

  // Main Navigation Links
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/findpartners", label: "Find Partners" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];
  return (
    <header 
      className={`fixed top-0 inset-x-0 z-100 transition-all duration-300 ${
        scrolled 
          ? "bg-base-100/80 backdrop-blur-md shadow-sm border-b border-base-200"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 transition-all duration-300">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
             {/* Use text logo if image fails or for better styling control */}
            <div className="">
             <img src={NavLogo} alt="" className="h-[50px]" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className={`text-[15px] font-medium transition-colors hover:text-primary ${
                      location.pathname === link.to 
                        ? "text-primary font-semibold" 
                        : "text-base-content/70 hover:text-base-content"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {user && (
                 <li>
                   <Link 
                     to="/dashboard" 
                     className={`text-sm font-medium transition-colors hover:text-primary ${
                        location.pathname.includes('/dashboard')
                         ? "text-primary font-semibold" 
                         : "text-base-content/70 hover:text-base-content"
                     }`}
                   >
                     Dashboard
                   </Link>
                 </li>
              )}
            </ul>

            <div className="h-6 w-px bg-base-300 mx-2"></div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-base-200 text-base-content/70 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
              </button>

              {user ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-base-200 transition-colors border border-transparent hover:border-base-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-primary to-secondary overflow-hidden flex items-center justify-center text-white text-xs font-bold">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        user.displayName?.charAt(0) || <User size={14} />
                      )}
                    </div>
                    <ChevronDown size={16} className={`text-base-content/50 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-base-100 rounded-xl shadow-xl border border-base-200 py-2 animate-fade-in overflow-hidden">
                      <div className="px-4 py-2 border-b border-base-200 mb-1">
                        <p className="text-sm font-semibold text-base-content">{user.displayName || 'User'}</p>
                        <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                      </div>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-base-content/70 hover:bg-base-200 hover:text-primary transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <Link 
                        to="/dashboard/myprofile" 
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-base-content/70 hover:bg-base-200 hover:text-primary transition-colors"
                      >
                        <User size={16} />
                        My Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-base-content/70 hover:text-primary transition-colors">
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            <button
               onClick={toggleTheme}
               className="p-2 rounded-full hover:bg-base-200 text-base-content/70 transition-colors"
             >
               {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
             </button>
            <button 
              onClick={() => setOpen(!open)}
              className="p-2 text-base-content/70 hover:bg-base-200 rounded-lg transition-colors"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-base-100 pt-24 px-6 animate-fade-in shadow-xl border-t border-base-200" ref={menuRef}>
           <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`text-lg font-medium py-2 border-b border-base-200 ${
                    location.pathname === link.to ? "text-primary" : "text-base-content/70"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className={`text-lg font-medium py-2 border-b border-base-200 ${
                    location.pathname.includes('/dashboard') ? "text-primary" : "text-base-content/70"
                  }`}
                >
                  Dashboard
                </Link>
              )}

              <div className="mt-8 flex flex-col gap-3">
                {user ? (
                   <button 
                     onClick={handleLogout}
                     className="w-full py-3 rounded-xl bg-red-50 text-red-500 font-medium dark:bg-red-900/20"
                   >
                     Sign Out
                   </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="w-full py-3 rounded-xl border border-base-300 text-center font-medium text-base-content/70">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setOpen(false)} className="w-full py-3 rounded-xl bg-primary text-white text-center font-medium shadow-lg shadow-primary/30">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
           </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;