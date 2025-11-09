import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import NavLogo from "../../assets/StudyMate.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { theme, toggleTheme } = useTheme();


  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/findpartners", label: "Find Partners" },
    { to: "/createprofile", label: "Create Profile" },
    { to: "/myconnection", label: "My Connection" }, 
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-3 transition-colors">
      <nav className="mx-auto max-w-[1700px] px-4 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center">
              <img src={NavLogo} alt="StudyMate" className="h-15 w-auto" />
            </Link>
          </div>

          {/* Center: desktop links */}
          <div className="hidden lg:flex lg:items-center lg:justify-center flex-1">
            <ul className="menu menu-horizontal px-1 flex gap-6 text-[#300A91] dark:text-purple-400 text-[16px] font-semibold">
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:underline transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: desktop auth buttons OR mobile menu button */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#300A91] dark:focus:ring-purple-400"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-[#300A91]" />
              )}
            </button>

            {/* Desktop auth buttons */}
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              <Link to="/login" className="btn bg-[#300A91] dark:bg-purple-600 rounded-[50px] px-4 py-1 text-white hover:bg-[#3C0AA4] dark:hover:bg-purple-700 transition-colors">
                Log in
              </Link>
              <Link to="/register" className="btn bg-[#300A91] dark:bg-purple-600 rounded-[50px] px-4 py-1 text-white hover:bg-[#3C0AA4] dark:hover:bg-purple-700 transition-colors">
                Registration
              </Link>
            </div>

            {/* Mobile menu button (visible on small screens) */}
            <div className="lg:hidden" ref={menuRef}>
              <button
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((s) => !s)}
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#300A91] dark:focus:ring-purple-400"
              >
                <svg className="h-6 w-6 text-[#300A91] dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {open ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Mobile dropdown */}
              {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-b-md z-50 border border-gray-200 dark:border-gray-700">
                  <ul className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
                    {links.map((l) => (
                      <li key={l.to}>
                        <Link
                          to={l.to}
                          className="block px-4 py-3 text-[#300A91] dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}

                    <li>
                      <Link
                        to="/login"
                        className="block px-4 py-3 text-[#300A91] dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Log in
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="block px-4 py-3 text-[#300A91] dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Registration
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          toggleTheme();
                          setOpen(false);
                        }}
                        className="w-full text-left block px-4 py-3 text-[#300A91] dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        {theme === 'dark' ? (
                          <>
                            <Sun className="h-5 w-5" />
                            Light Mode
                          </>
                        ) : (
                          <>
                            <Moon className="h-5 w-5" />
                            Dark Mode
                          </>
                        )}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
