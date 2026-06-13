import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, Menu, X, ChevronRight, Sun, Moon } from 'lucide-react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const isTransparent = location.pathname === '/' && !scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isTransparent
      ? 'bg-transparent backdrop-blur-none'
      : 'bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl shadow-sm border-b border-neutral-100/50 dark:border-neutral-800/50'
      }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-gold-600 rounded-xl flex items-center justify-center shadow-gold group-hover:shadow-gold-lg transition-shadow">
              <Logo size="sm" />
            </div>
            <span className={`text-2xl font-black font-serif tracking-tighter transition-colors ${isTransparent ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
              SUMA <span className="text-gradient-gold">BARBER</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {[
              { to: '/', label: 'Home' },
              { to: '/barbers', label: 'Barbers' },
              { to: '/booking', label: 'Book Now' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative text-sm font-semibold uppercase tracking-[0.15em] transition-all duration-200 ${location.pathname === item.to
                  ? isTransparent ? 'text-white' : 'text-accent'
                  : isTransparent ? 'text-white/70 hover:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-accent'
                  }`}
              >
                {item.label}
                {location.pathname === item.to && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${isTransparent
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-neutral-400 hover:text-accent hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${isTransparent
                    ? 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-accent" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-neutral-200 dark:border-neutral-700">
                  <div className="w-9 h-9 bg-gradient-to-br from-accent to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-gold">
                    {user.name.charAt(0)}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all duration-200 cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  to="/login"
                  className={`text-sm font-bold uppercase tracking-[0.15em] transition-all px-3 py-2 rounded-lg ${isTransparent
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-accent hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                >
                  Login
                </Link>
                <Link
                  to="/booking"
                  className="bg-gradient-to-r from-accent to-gold-600 hover:from-accent-hover hover:to-gold-700 text-white text-sm font-bold uppercase tracking-[0.15em] py-3 px-8 rounded-xl shadow-gold hover:shadow-gold-lg transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  Reserve
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-200 cursor-pointer ${isTransparent
                ? 'text-white hover:bg-white/10'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-accent hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-neutral-100 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl animate-slide-in-top">
          <div className="px-6 py-6 space-y-2">
            {[
              { to: '/', label: 'Home' },
              { to: '/barbers', label: 'Barbers' },
              { to: '/booking', label: 'Book Now' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-[0.15em] transition-all duration-200 ${location.pathname === item.to
                  ? 'text-accent bg-accent-light/50 dark:bg-accent/10'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-accent hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
              >
                {item.label}
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
            ))}

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200 w-full cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-accent" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200"
                  >
                    <LayoutDashboard className="w-5 h-5 text-accent" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 w-full cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl font-bold text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200 text-center cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link
                    to="/booking"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 bg-gradient-to-r from-accent to-gold-600 text-white rounded-xl font-bold text-sm uppercase tracking-[0.15em] text-center shadow-gold cursor-pointer"
                  >
                    Reserve Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
