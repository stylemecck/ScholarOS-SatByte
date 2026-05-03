import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { 
  Moon, Sun, Menu, X, Zap, ShieldCheck, Sparkles, 
  BarChart3, ChevronDown, LayoutDashboard, Settings,
  FileText, Image as ImageIcon, GraduationCap, ArrowRight
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark');
    }
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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark');
    setTheme(newTheme);
  };

  const navLinks = [
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
  ];

  const toolCategories = [
    {
      title: 'Academic & AI',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      tools: [
        { name: 'Rank Predictor', path: '/tools/rank-predictor', desc: 'AI-powered insights', icon: Sparkles },
        { name: 'Study Planner', path: '/tools/study-planner', desc: 'Optimize your learning', icon: BarChart3 },
        { name: 'Resume Builder', path: '/tools/resume-builder', desc: 'Pro job-ready profiles', icon: FileText },
      ]
    },
    {
      title: 'Media & PDF',
      icon: <ImageIcon className="w-4 h-4" />,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      tools: [
        { name: 'Merge PDF', path: '/tools/pdf/merge', desc: 'Combine multiple files', icon: Zap },
        { name: 'Compress Image', path: '/tools/image/compress', desc: 'Reduce size, keep quality', icon: ImageIcon },
        { name: 'Rotate PDF', path: '/tools/pdf/rotate', desc: 'Fix orientation', icon: ArrowRight },
      ]
    }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] px-4 py-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center pointer-events-auto">
        <nav className={`
          flex items-center justify-between px-6 h-16 w-full
          transition-all duration-500 rounded-full border
          ${scrolled 
            ? 'bg-background/70 backdrop-blur-3xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)]' 
            : 'bg-background/40 backdrop-blur-xl border-white/5 shadow-xl'}
        `}>
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group shrink-0" 
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center overflow-hidden border border-primary/30 group-hover:rotate-[360deg] transition-transform duration-700">
                <img src="/logo.svg" alt="STP PRO" className="w-7 h-7 object-contain" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-black tracking-tighter leading-none group-hover:tracking-normal transition-all duration-300">
                STP <span className="text-primary italic">PRO</span>
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">AI Student Hub</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <div className="relative" ref={toolsRef}>
              <button 
                onMouseEnter={() => setIsToolsOpen(true)}
                className={`
                  px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2
                  ${isToolsOpen ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}
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
                    className="absolute top-full left-0 mt-4 w-[520px] bg-background/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden"
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
                                className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all"
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
                    
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <Link to="/" className="flex items-center justify-between p-4 bg-primary/10 rounded-2xl group hover:bg-primary transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white">Explore All 15+ Advanced Tools</span>
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
                  relative px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all
                  ${location.pathname === link.path ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}
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
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-white/5"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative" ref={userRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1 pr-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform overflow-hidden border border-white/20">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-xs font-bold hidden lg:block">{user.name.split(' ')[0]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-4 w-64 bg-background/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-4 shadow-2xl"
                    >
                      <div className="p-4 bg-white/5 rounded-2xl mb-2">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Balance</p>
                        <p className="text-xl font-black">{user.credits} <span className="text-xs font-medium text-muted-foreground">Credits</span></p>
                      </div>
                      
                      <div className="space-y-1">
                        <Link 
                          to="/dashboard" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs font-bold">User Dashboard</span>
                        </Link>
                        {user.role === 'admin' && (
                          <Link 
                            to="/admin" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-500/10 text-amber-500 transition-all"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-bold">Admin Panel</span>
                          </Link>
                        )}
                        <Link 
                          to="/settings" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all"
                        >
                          <Settings className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs font-bold">Account Settings</span>
                        </Link>
                        <button 
                          onClick={() => { logout(); setIsUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-all"
                        >
                          <X className="w-4 h-4" />
                          <span className="text-xs font-bold">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                Join Now <Zap className="w-3 h-3 fill-current" />
              </Link>
            )}

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[90] md:hidden bg-background pointer-events-auto"
          >
            <div className="flex flex-col h-full overflow-y-auto p-6 pt-24 space-y-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50 px-2">Main Navigation</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="p-4 bg-white/5 rounded-3xl text-lg font-black tracking-tight">Home</Link>
                  <Link to="/pricing" onClick={() => setIsMenuOpen(false)} className="p-4 bg-white/5 rounded-3xl text-lg font-black tracking-tight">Pricing</Link>
                  <Link to="/about" onClick={() => setIsMenuOpen(false)} className="p-4 bg-white/5 rounded-3xl text-lg font-black tracking-tight">About</Link>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50 px-2">Popular Tools</h3>
                <div className="grid grid-cols-1 gap-3">
                  {toolCategories.flatMap(c => c.tools).map(tool => (
                    <Link 
                      key={tool.path}
                      to={tool.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/5"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                        <tool.icon className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{tool.name}</span>
                        <span className="text-[10px] text-muted-foreground">{tool.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-auto border-t border-white/5">
                <p className="text-center text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-30">
                  SatByte Technologies
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
