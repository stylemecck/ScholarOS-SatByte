import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { 
  Menu, X, Zap, Sparkles, 
  BarChart3, ChevronDown, LayoutDashboard, Settings,
  FileText, Image as ImageIcon, GraduationCap, ArrowRight,
  LogOut, CreditCard, Sun, Moon
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Pricing', path: '/pricing' },
    { name: 'Docs', path: '/docs' },
    { name: 'About', path: '/about' },
  ];

  const toolCategories = [
    {
      title: 'Academic & AI',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      tools: [
        { name: 'Rank Predictor', path: '/tools/rank-predictor', desc: 'AI-powered insights', icon: Sparkles },
        { name: 'Resume Builder', path: '/tools/resume-builder', desc: 'Pro job-ready profiles', icon: FileText },
        { name: 'Study Planner', path: '/tools/study-planner', desc: 'Optimize your learning', icon: BarChart3 },
      ]
    },
    {
      title: 'Media & PDF',
      icon: <ImageIcon className="w-4 h-4" />,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      tools: [
        { name: 'Merge PDF', path: '/tools/pdf/merge', desc: 'Combine multiple files', icon: Zap },
        { name: 'Compress Image', path: '/tools/image/compress', desc: 'Reduce size, keep quality', icon: ImageIcon },
        { name: 'Rotate PDF', path: '/tools/pdf/rotate', desc: 'Fix orientation', icon: ArrowRight },
      ]
    }
  ];

  return (
    <div className="fixed top-0 inset-x-0 z-[100] px-2 sm:px-4 py-4 sm:py-6 flex justify-center pointer-events-none">
      <nav className={`
        flex items-center justify-between px-3 sm:px-6 h-14 sm:h-16 w-full max-w-7xl
        transition-all duration-500 rounded-full border pointer-events-auto
        ${scrolled 
          ? 'bg-background/80 backdrop-blur-3xl border-border/60 shadow-sm' 
          : 'bg-background/40 backdrop-blur-xl border-border/30 shadow-none'}
      `}>
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 group shrink-0" 
          >
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 group-hover:rotate-[360deg] transition-transform duration-700 relative overflow-hidden">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="absolute inset-0 bg-primary/10 blur-sm -z-10" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary rounded-full border-2 border-background animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-black tracking-tighter leading-none">
                Scholar<span className="text-primary italic">OS</span>
              </span>
              <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50 hidden sm:block">SEO & PDF Suite</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <div className="relative" ref={toolsRef}>
              <button 
                onMouseEnter={() => setIsToolsOpen(true)}
                className={`
                  px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2
                  ${isToolsOpen ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]'}
                `}
              >
                Tools <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isToolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    onMouseLeave={() => setIsToolsOpen(false)}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[560px] bg-background/95 backdrop-blur-3xl border border-border/50 rounded-[2.5rem] p-6 shadow-sm overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-indigo-500 to-rose-500" />
                    
                    <div className="grid grid-cols-2 gap-8">
                      {toolCategories.map((category) => (
                        <div key={category.title} className="space-y-5">
                          <div className={`flex items-center gap-2.5 ${category.color}`}>
                            <div className={`p-1.5 rounded-lg ${category.bg}`}>{category.icon}</div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">{category.title}</h3>
                          </div>
                          <div className="space-y-1">
                            {category.tools.map((tool) => (
                              <Link 
                                key={tool.path}
                                to={tool.path}
                                className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-foreground/[0.04] transition-all"
                              >
                                <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                  <tool.icon className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold group-hover:text-primary transition-colors">{tool.name}</span>
                                  <span className="text-[9px] text-muted-foreground line-clamp-1">{tool.desc}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-border/40">
                      <Link to="/tools" className="flex items-center justify-between p-4 bg-primary/10 rounded-2xl group hover:bg-primary transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white">Explore All Marketplace Tools</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  relative px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all
                  ${location.pathname === link.path ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]'}
                `}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-foreground/[0.05] hover:bg-foreground/[0.1] text-foreground border border-border/40 transition-all transform active:scale-90 cursor-pointer shrink-0"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-indigo-600" />}
            </button>

            {user ? (
              <div className="relative" ref={userRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 lg:pr-4 bg-foreground/[0.04] hover:bg-foreground/[0.08] rounded-full border border-border/30 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 text-white flex items-center justify-center text-xs font-black group-hover:scale-105 transition-transform overflow-hidden border border-border/20">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">{user.name.split(' ')[0]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-4 w-64 bg-background/95 backdrop-blur-3xl border border-border/50 rounded-[2rem] p-4 shadow-sm"
                    >
                      <div className="p-4 bg-foreground/[0.04] rounded-2xl mb-2 border border-border/30">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Balance</p>
                          <CreditCard className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-black">{user.credits} <span className="text-[10px] font-medium text-muted-foreground uppercase">Credits</span></p>
                      </div>
                      
                      <div className="space-y-1">
                        <Link 
                          to="/dashboard" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/[0.04] transition-all group"
                        >
                          <LayoutDashboard className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                        </Link>
                        <Link 
                          to="/settings" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/[0.04] transition-all group"
                        >
                          <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
                        </Link>
                        <div className="h-px bg-border/40 my-1 mx-2" />
                        <button 
                          onClick={() => { logout(); setIsUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="saas-button-primary !px-4 sm:!px-6 !py-2 sm:!py-2.5 flex items-center gap-2 text-[10px] sm:text-xs"
              >
                <span className="hidden sm:inline">Join</span> <Zap className="w-3 h-3 fill-current" />
              </Link>
            )}

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white transform active:scale-90 transition-all"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] sm:w-[400px] z-[90] md:hidden bg-background border-l border-border/40 flex flex-col pointer-events-auto"
            >
              <div className="flex flex-col h-full overflow-y-auto p-8 pt-24">
                {/* User Info on Mobile */}
                {user && (
                  <div className="mb-10 p-6 bg-foreground/[0.04] rounded-[2.5rem] border border-border/40">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 p-0.5">
                         <div className="w-full h-full rounded-[0.9rem] overflow-hidden bg-background flex items-center justify-center text-xl font-black">
                            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                         </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tight">{user.name}</span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{user.credits} Credits</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <Link to="/dashboard" className="flex items-center justify-center gap-2 p-3 bg-foreground/[0.04] rounded-xl text-[10px] font-black uppercase tracking-widest">
                          <LayoutDashboard className="w-3.5 h-3.5" /> Dash
                       </Link>
                       <Link to="/settings" className="flex items-center justify-center gap-2 p-3 bg-foreground/[0.04] rounded-xl text-[10px] font-black uppercase tracking-widest">
                          <Settings className="w-3.5 h-3.5" /> Settings
                       </Link>
                    </div>
                  </div>
                )}

                <div className="space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50 px-2">Navigation</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <Link to="/" className="p-5 bg-foreground/[0.04] rounded-3xl text-2xl font-black tracking-tighter hover:bg-primary/10 hover:text-primary transition-all">Home</Link>
                      {navLinks.map(link => (
                        <Link key={link.path} to={link.path} className="p-5 bg-foreground/[0.04] rounded-3xl text-2xl font-black tracking-tighter hover:bg-primary/10 hover:text-primary transition-all">{link.name}</Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Link to="/tools" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
                    <div className="grid grid-cols-1 gap-3">
                      {toolCategories.flatMap(c => c.tools).slice(0, 4).map(tool => (
                        <Link 
                          key={tool.path}
                          to={tool.path}
                          className="flex items-center gap-4 p-4 bg-foreground/[0.04] rounded-3xl border border-border/40 hover:border-primary/30 transition-all group"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <tool.icon className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">{tool.name}</span>
                            <span className="text-[10px] text-muted-foreground font-medium">{tool.desc}</span>
                          </div>
                        </Link>
                      ))}
                      <Link to="/tools" className="p-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:underline">Explore Marketplace</Link>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-10 border-t border-border/40 space-y-6">
                  {user ? (
                    <button 
                      onClick={() => logout()}
                      className="w-full py-5 bg-rose-500/10 text-rose-500 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                      <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                  ) : (
                    <Link to="/login" className="w-full py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3">
                      <Zap className="w-5 h-5" /> Get Started Now
                    </Link>
                  )}
                  <p className="text-[9px] text-center text-muted-foreground font-black uppercase tracking-[0.5em] opacity-30">
                    SatByte Technology © 2026
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
