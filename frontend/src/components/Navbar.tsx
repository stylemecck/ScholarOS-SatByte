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

  const [isToolsOpen, setIsToolsOpen] = useState(false);



  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
      <nav className={`
        max-w-7xl mx-auto flex items-center justify-between px-6 h-16 pointer-events-auto
        transition-all duration-500 rounded-[2rem]
        ${scrolled 
          ? 'bg-background/80 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)]' 
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
            <span className="text-lg font-black tracking-tight leading-none">STP <span className="text-primary italic">PRO</span></span>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Mega Toolkit</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {/* Tools Mega Menu Trigger */}
          <div 
            className="relative"
            onMouseEnter={() => setIsToolsOpen(true)}
            onMouseLeave={() => setIsToolsOpen(false)}
          >
            <button className={`
              px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2
              ${isToolsOpen ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'}
            `}>
              Tools <Menu className={`w-3 h-3 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mega Menu Overlay */}
            <AnimatePresence>
              {isToolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-[480px] bg-background/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl grid grid-cols-2 gap-4"
                >
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 px-2">PDF & Image</h3>
                    <div className="space-y-1">
                        <Link to="/tools/pdf/merge" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-rose-500/10 group transition-all">
                            <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform"><Zap className="w-4 h-4" /></div>
                            <div>
                                <p className="text-xs font-bold">Merge PDF</p>
                                <p className="text-[9px] text-muted-foreground font-medium">Combine files</p>
                            </div>
                        </Link>
                        <Link to="/tools/image/compress" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-indigo-500/10 group transition-all">
                            <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform"><Menu className="w-4 h-4" /></div>
                            <div>
                                <p className="text-xs font-bold">Compress Image</p>
                                <p className="text-[9px] text-muted-foreground font-medium">Optimize size</p>
                            </div>
                        </Link>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 px-2">Academic & AI</h3>
                    <div className="space-y-1">
                        <Link to="/tools/rank-predictor" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-amber-500/10 group transition-all">
                            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform"><Zap className="w-4 h-4" /></div>
                            <div>
                                <p className="text-xs font-bold">Rank Predictor</p>
                                <p className="text-[9px] text-muted-foreground font-medium">AI Insights</p>
                            </div>
                        </Link>
                        <Link to="/tools/resume-builder" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-primary/10 group transition-all">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><ShieldCheck className="w-4 h-4" /></div>
                            <div>
                                <p className="text-xs font-bold">Resume Builder</p>
                                <p className="text-[9px] text-muted-foreground font-medium">Pro Templates</p>
                            </div>
                        </Link>
                    </div>
                  </div>
                  <Link to="/" className="col-span-2 mt-2 p-3 bg-white/5 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">
                    View All 15+ Tools
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-4 w-px bg-white/10 mx-2" />

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
              <Link to="/dashboard" className="hidden md:flex items-center gap-3 p-1.5 pr-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                    <span className="text-[10px] font-black text-foreground leading-none">{user.name.split(' ')[0]}</span>
                    <span className="text-[8px] font-black text-primary uppercase tracking-tighter mt-0.5">{user.credits} Credits</span>
                </div>
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
