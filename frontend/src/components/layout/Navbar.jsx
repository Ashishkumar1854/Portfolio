import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User as UserIcon, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');


  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Resources', path: '/resources' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg-primary/95 md:bg-bg-primary/90 md:backdrop-blur-glass border-b border-border-subtle shadow-sm'
          : 'bg-bg-primary md:bg-bg-primary/70 md:backdrop-blur-glass border-b border-transparent'
      } h-16`}
    >
      <div className="container h-full mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-display font-bold text-text-primary tracking-tight hover:opacity-80 transition-opacity"
        >
          Ashish
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium px-3 py-2 rounded-lg transition-all ${
                isActive(link.path)
                  ? 'text-accent-blue bg-accent-blue/8'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/60'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-text-secondary hover:text-accent-blue transition-colors rounded-lg hover:bg-bg-elevated/60"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-accent-purple hover:text-purple-400 transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/dashboard"
                className="w-9 h-9 rounded-full bg-accent-blue/15 hover:bg-accent-blue/25 border border-accent-blue/20 hover:border-accent-blue/40 flex items-center justify-center text-lg transition-all hover:scale-105"
                title={`${user.name}'s Profile`}
              >
                <span className="leading-none">{user.avatar || '👨‍💻'}</span>
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Login
            </Link>
          )}

          <Link
            to="/hire"
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-accent-blue hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-glow-blue hover:scale-[1.03] active:scale-[0.98]"
          >
            Hire Me →
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-text-secondary rounded-lg"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            className="text-text-primary p-2 rounded-lg hover:bg-bg-elevated/60 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-16 left-0 w-full bg-bg-card border-b border-border-subtle shadow-lg"
          >
            <div className="flex flex-col p-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-base font-medium px-3 py-3 rounded-lg transition-all ${
                    isActive(link.path)
                      ? 'text-accent-blue bg-accent-blue/8'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/60'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="h-px w-full bg-border-subtle my-3" />

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 text-base font-medium text-text-secondary px-3 py-3 rounded-lg hover:bg-bg-elevated/60 hover:text-text-primary transition-all"
                  >
                    <span className="text-xl">{user.avatar || '👨‍💻'}</span>
                    My Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-base font-medium text-accent-purple px-3 py-3 rounded-lg"
                    >
                      Admin Panel
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-base font-medium text-text-secondary px-3 py-3 rounded-lg hover:text-text-primary"
                >
                  Login
                </Link>
              )}

              <Link
                to="/hire"
                className="mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-blue text-white text-sm font-semibold"
              >
                Hire Me →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
