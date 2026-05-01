import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Moon, Sun, Menu, X, Zap, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark');
    }
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  };

  const navLinks = [
    { name: 'Tools', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Pricing', path: '/pricing' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
      <nav className={`
        max-w-6xl mx-auto flex items-center justify-between px-6 h-16 pointer-events-auto
        transition-all duration-500 rounded-[2rem]
        ${scrolled 
          ? 'bg-background/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)]' 
          : 'bg-background/40 backdrop-blur-md border border-white/5'}
      `}>
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group" 
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            <Zap className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight leading-none">STP <span className="text-primary">PRO</span></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Toolkit</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`
                relative px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                ${location.pathname === link.path ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="nav-active"
                  className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-xl bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all border border-white/5"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <div className="h-6 w-px bg-white/10 mx-1 hidden md:block" />

          {user ? (
            <div className="flex items-center gap-3">
               {user.role === 'admin' && (
                <Link to="/admin" className="hidden lg:flex items-center gap-2 text-[10px] font-black text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> Admin
                </Link>
              )}
              <Link to="/dashboard" className="hidden md:flex items-center gap-3 p-1.5 pr-4 bg-primary/10 hover:bg-primary/20 rounded-xl border border-primary/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-black text-primary">{user.name.split(' ')[0]}</span>
              </Link>
              <button 
                onClick={logout}
                className="hidden md:block p-2.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                title="Logout"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">
              Get Started
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="md:hidden mt-4 max-w-sm mx-auto bg-background/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-6 pointer-events-auto"
          >
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary/10 transition-all group"
                >
                  <span className="text-sm font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">{link.name}</span>
                  <div className="p-2 rounded-lg bg-white/5 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10">
                    <Zap className="w-4 h-4" />
                  </div>
                </Link>
              ))}

              <div className="pt-4 border-t border-white/10">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl">
                      <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-lg font-black">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black leading-none">{user.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{user.role}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center py-4 bg-primary/10 text-primary rounded-2xl font-black text-xs uppercase tracking-widest">
                            Profile
                        </Link>
                        <button 
                            onClick={() => { logout(); setIsMenuOpen(false); }}
                            className="flex items-center justify-center py-4 bg-rose-500/10 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest"
                        >
                            Logout
                        </button>
                    </div>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full py-5 bg-primary text-primary-foreground text-center rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
                  >
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
