import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Moon, Sun, Menu, X, Zap, ShieldCheck, Sparkles, BarChart3 } from 'lucide-react';
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
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-primary/5 group-hover:scale-110 transition-transform duration-300 border border-primary/20">
            <img src="/logo.svg" alt="STP Pro Logo" className="w-full h-full object-cover" />
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

      {/* Professional Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] md:hidden bg-background/60 backdrop-blur-2xl pointer-events-auto"
          >
            {/* Header / Logo in Menu */}
            <div className="flex items-center justify-between px-6 h-24 border-b border-white/5">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden border border-primary/20">
                  <img src="/logo.svg" alt="STP Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-lg font-black tracking-tight uppercase">STP <span className="text-primary italic">PRO</span></span>
              </Link>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar p-6 space-y-10">
              {/* User Profile Section */}
              <div className="p-1 bg-gradient-to-r from-primary/20 via-indigo-500/20 to-amber-500/20 rounded-[2.5rem]">
                {user ? (
                  <div className="bg-background/40 backdrop-blur-md rounded-[2.4rem] p-6 space-y-4 border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black shadow-xl shadow-primary/20">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow">
                        <p className="text-lg font-black leading-none">{user.name}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">{user.credits} Credits</span>
                          <span className="text-[10px] font-black bg-white/5 text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-widest">{user.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center py-4 bg-primary text-primary-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
                      >
                        Dashboard
                      </Link>
                      <button 
                        onClick={() => { logout(); setIsMenuOpen(false); }}
                        className="flex items-center justify-center py-4 bg-white/5 text-rose-500 border border-rose-500/10 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-background/40 backdrop-blur-md rounded-[2.4rem] p-8 text-center space-y-6 border border-white/5">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black uppercase tracking-tight">Ready for <span className="text-primary italic">Pro?</span></h3>
                      <p className="text-xs text-muted-foreground font-medium px-4">Join 850K+ students and unlock elite AI-powered academic tools.</p>
                    </div>
                    <Link 
                      to="/login" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full py-5 bg-primary text-primary-foreground rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 active:scale-95 transition-all"
                    >
                      Get Started Free
                    </Link>
                  </div>
                )}
              </div>

              {/* Tool Categories */}
              <div className="grid grid-cols-1 gap-10">
                {/* PDF & Image Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-1 h-4 bg-rose-500 rounded-full" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Creative & PDF</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { name: 'Merge PDF', path: '/tools/pdf/merge', icon: Zap, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                      { name: 'Compress Image', path: '/tools/image/compress', icon: Menu, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                      { name: 'Rotate PDF', path: '/tools/pdf/rotate', icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    ].map((tool) => (
                      <Link 
                        key={tool.path} 
                        to={tool.path} 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl active:bg-white/10 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 ${tool.bg} ${tool.color} rounded-xl flex items-center justify-center`}>
                            <tool.icon className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold">{tool.name}</span>
                        </div>
                        <Zap className="w-4 h-4 text-muted-foreground/20" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Academic Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-1 h-4 bg-primary rounded-full" />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Success & Academic</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { name: 'Rank Predictor', path: '/tools/rank-predictor', icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10' },
                      { name: 'Resume Builder', path: '/tools/resume-builder', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                      { name: 'Study Planner', path: '/tools/study-planner', icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    ].map((tool) => (
                      <Link 
                        key={tool.path} 
                        to={tool.path} 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl active:bg-white/10 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 ${tool.bg} ${tool.color} rounded-xl flex items-center justify-center`}>
                            <tool.icon className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold">{tool.name}</span>
                        </div>
                        <Zap className="w-4 h-4 text-muted-foreground/20" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links Footer */}
              <div className="pt-10 border-t border-white/5 pb-10">
                <div className="grid grid-cols-2 gap-4">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-center py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <p className="text-center mt-8 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-30">
                  Product of SatByte Technologies
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
