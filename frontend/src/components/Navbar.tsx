import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
  Menu, X, Zap, Sparkles,
  BarChart3, ChevronDown, LayoutDashboard, Settings,
  FileText, Image as ImageIcon, GraduationCap, ArrowRight,
  LogOut, CreditCard, Sun, Moon, ChevronRight,
  BrainCircuit, Mic, Map, BookOpenCheck
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoIcon } from './LogoIcon';

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

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setIsToolsOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { name: 'Pricing', path: '/pricing' },
    { name: 'Docs', path: '/docs' },
    { name: 'About', path: '/about' },
  ];

  const toolCategories = [
    {
      title: 'AI Premium Suite',
      icon: <BrainCircuit className="w-4 h-4" />,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      tools: [
        { name: 'AI Study Assistant', path: '/tools/ai-study-assistant', desc: 'Smart chat for any subject', icon: BrainCircuit },
        { name: 'AI Interview Prep',  path: '/tools/ai-interview-prep',  desc: 'Voice mock interview coach',  icon: Mic        },
        { name: 'Career Roadmaps',    path: '/tools/career-roadmaps',    desc: 'Personalised career tracks',  icon: Map        },
        { name: 'AI PDF Workspace',   path: '/tools/ai-pdf-workspace',   desc: 'Chat & summarise docs',       icon: BookOpenCheck },
      ]
    },
    {
      title: 'Academic & Resume',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      tools: [
        { name: 'Rank Predictor',  path: '/tools/rank-predictor',  desc: 'AI-powered entrance insights', icon: Sparkles  },
        { name: 'Resume Builder',  path: '/tools/resume-builder',  desc: 'ATS-optimised profiles',       icon: FileText  },
        { name: 'Study Planner',   path: '/tools/study-planner',   desc: 'Personalised study roadmaps',  icon: BarChart3 },
      ]
    },
    {
      title: 'Media & PDF',
      icon: <ImageIcon className="w-4 h-4" />,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      tools: [
        { name: 'Merge PDF',       path: '/tools/pdf/merge',        desc: 'Combine multiple files',      icon: Zap       },
        { name: 'Compress Image',  path: '/tools/image/compress',   desc: 'Reduce size, keep quality',   icon: ImageIcon },
        { name: 'Rotate PDF',      path: '/tools/pdf/rotate',       desc: 'Fix orientation instantly',   icon: ArrowRight },
      ]
    },
  ];

  return (
    <div className="fixed top-0 inset-x-0 z-[100] flex justify-center pointer-events-none px-3 sm:px-6 pt-3 sm:pt-5">
      {/* ── Floating Pill Nav ── */}
      <nav className={`
        w-full max-w-6xl flex items-center justify-between
        h-[54px] sm:h-[60px] px-3 sm:px-5
        rounded-full border pointer-events-auto transition-all duration-500
        ${scrolled
          ? 'bg-background/90 backdrop-blur-2xl border-border/60 shadow-sm'
          : 'bg-background/60 backdrop-blur-xl border-border/30'}
      `}>

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 group-hover:rotate-[360deg] transition-transform duration-700 relative overflow-hidden">
              <LogoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <div className="absolute inset-0 bg-primary/10 blur-sm -z-10" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] sm:text-[17px] font-black tracking-tight">
              Scholar<span className="text-primary italic">OS</span>
            </span>
            <span className="text-[6px] sm:text-[7px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60 hidden sm:block">AI Student Suite</span>
          </div>
        </Link>

        {/* ── Desktop Centre Links ── */}
        <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
          {/* Tools Mega Dropdown */}
          <div className="relative" ref={toolsRef}>
            <button
              onMouseEnter={() => setIsToolsOpen(true)}
              className={`flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-full text-sm lg:text-[15px] font-medium transition-all ${isToolsOpen ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]'}`}
            >
              Tools
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isToolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  onMouseLeave={() => setIsToolsOpen(false)}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] bg-background/97 backdrop-blur-3xl border border-border/50 rounded-3xl p-5 shadow-sm overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-indigo-500 to-purple-500" />
                  <div className="grid grid-cols-3 gap-6">
                    {toolCategories.map((cat) => (
                      <div key={cat.title} className="space-y-3">
                        <div className={`flex items-center gap-2 ${cat.color}`}>
                          <div className={`p-1 rounded-lg ${cat.bg}`}>{cat.icon}</div>
                          <span className="text-[10px] font-black uppercase tracking-[0.18em]">{cat.title}</span>
                        </div>
                        <div className="space-y-0.5">
                          {cat.tools.map((tool) => (
                            <Link
                              key={tool.path}
                              to={tool.path}
                              className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-foreground/[0.05] transition-all"
                            >
                              <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                                <tool.icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-xs font-bold group-hover:text-primary transition-colors">{tool.name}</p>
                                <p className="text-[10px] text-muted-foreground leading-tight">{tool.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/30">
                    <Link
                      to="/tools"
                      className="flex items-center justify-between px-4 py-3 bg-primary/8 hover:bg-primary/12 rounded-xl group transition-all"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Browse All Modules</span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Regular nav links */}
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-3 lg:px-4 py-2 rounded-full text-sm lg:text-[15px] font-medium transition-all ${location.pathname === link.path ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]'}`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div layoutId="nav-pill" className="absolute inset-0 bg-primary/10 rounded-full -z-10" />
              )}
            </Link>
          ))}
        </div>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-foreground/[0.06] hover:bg-foreground/[0.1] border border-border/40 transition-all active:scale-90"
            aria-label="Toggle theme"
          >
            {theme === 'dark'
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {user ? (
            /* User Avatar Menu */
            <div className="relative hidden md:block" ref={userRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-3 h-9 bg-foreground/[0.05] hover:bg-foreground/[0.09] rounded-full border border-border/30 transition-all group"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-purple-600 text-white flex items-center justify-center text-[11px] font-black overflow-hidden border border-border/20">
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    : user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[11px] font-bold text-foreground hidden lg:block max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-3 w-56 bg-background/98 backdrop-blur-3xl border border-border/50 rounded-2xl p-3 shadow-sm"
                  >
                    {/* Credits pill */}
                    <div className="flex items-center justify-between px-3 py-2.5 bg-primary/8 rounded-xl mb-2 border border-primary/15">
                      <div>
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Balance</p>
                        <p className="text-base font-black">{user.credits} <span className="text-[9px] font-medium text-muted-foreground">Credits</span></p>
                      </div>
                      <CreditCard className="w-4 h-4 text-primary/60" />
                    </div>
                    <div className="space-y-0.5">
                      <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-foreground/[0.05] transition-all group">
                        <LayoutDashboard className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[11px] font-bold">Dashboard</span>
                      </Link>
                      <Link to="/settings" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-foreground/[0.05] transition-all group">
                        <Settings className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[11px] font-bold">Settings</span>
                      </Link>
                      <div className="h-px bg-border/30 my-1" />
                      <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-all">
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 h-9 px-4 rounded-full bg-primary text-primary-foreground text-[12px] font-bold hover:opacity-90 transition-all active:scale-95"
            >
              <Zap className="w-3 h-3 fill-current" /> Join Free
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white active:scale-90 transition-all"
            aria-label="Open menu"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Menu className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* ══════════════════ MOBILE DRAWER ══════════════════ */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] md:hidden pointer-events-auto"
            />

            {/* Drawer panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.15 }}
              onDragEnd={(_, info) => { if (info.offset.x > 80) setIsMenuOpen(false); }}
              className="fixed top-0 right-0 bottom-0 z-[90] md:hidden w-[82vw] max-w-[360px] bg-background border-l border-border/40 flex flex-col shadow-2xl pointer-events-auto"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/20 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
                    <LogoIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-black tracking-tight">Scholar<span className="text-primary italic">OS</span></span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground/[0.06] hover:bg-foreground/[0.12] text-foreground transition-all"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">

                {/* Logged-in user card */}
                {user && (
                  <div className="p-4 bg-foreground/[0.03] border border-border/20 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-purple-600 p-0.5 shrink-0">
                        <div className="w-full h-full rounded-[0.6rem] bg-background flex items-center justify-center text-sm font-black text-foreground overflow-hidden">
                          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{user.name}</p>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-[0.1em]">{user.credits} Credits</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link to="/dashboard" className="flex items-center justify-center gap-1.5 py-2 bg-muted border border-border/30 rounded-xl text-[11px] font-bold hover:bg-foreground/[0.06] transition-all">
                        <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                      </Link>
                      <Link to="/settings" className="flex items-center justify-center gap-1.5 py-2 bg-muted border border-border/30 rounded-xl text-[11px] font-bold hover:bg-foreground/[0.06] transition-all">
                        <Settings className="w-3.5 h-3.5" /> Settings
                      </Link>
                    </div>
                  </div>
                )}

                {/* Main nav links */}
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.35em] text-muted-foreground/50 px-1 mb-2">Navigation</p>
                  <div className="flex flex-col divide-y divide-border/10">
                    {[{ name: 'Home', path: '/' }, ...navLinks].map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center justify-between py-3.5 px-1 text-sm font-semibold transition-colors group ${location.pathname === link.path ? 'text-primary' : 'text-foreground hover:text-primary'}`}
                      >
                        {link.name}
                        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Premium AI tools */}
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.35em] text-amber-400/70 px-1 mb-2">⚡ AI Premium Suite</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { name: 'AI Study Assistant', path: '/tools/ai-study-assistant', icon: BrainCircuit },
                      { name: 'AI Interview Prep',  path: '/tools/ai-interview-prep',  icon: Mic         },
                      { name: 'Career Roadmaps',    path: '/tools/career-roadmaps',    icon: Map          },
                      { name: 'AI PDF Workspace',   path: '/tools/ai-pdf-workspace',   icon: BookOpenCheck},
                    ].map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="flex items-center gap-3 p-3 bg-amber-400/5 hover:bg-amber-400/10 border border-amber-400/10 hover:border-amber-400/20 rounded-xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0">
                          <tool.icon className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold group-hover:text-amber-400 transition-colors">{tool.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick tools */}
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.35em] text-muted-foreground/50 px-1 mb-2">Quick Tools</p>
                  <div className="grid grid-cols-1 gap-2">
                    {toolCategories.flatMap(c => c.tools).slice(3, 7).map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="flex items-center gap-3 p-3 bg-foreground/[0.02] hover:bg-foreground/[0.05] border border-border/20 rounded-xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <tool.icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold group-hover:text-primary transition-colors truncate">{tool.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{tool.desc}</p>
                        </div>
                      </Link>
                    ))}
                    <Link to="/tools" className="py-2.5 text-center text-[11px] font-bold text-primary hover:underline">
                      Explore All Tools →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Drawer footer */}
              <div className="px-4 py-4 border-t border-border/20 shrink-0 space-y-3">
                {user ? (
                  <button
                    onClick={() => logout()}
                    className="w-full h-11 flex items-center justify-center gap-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-rose-500/20 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full h-11 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                  >
                    <Zap className="w-4 h-4" /> Get Started Free
                  </Link>
                )}
                <p className="text-[8px] text-center text-muted-foreground/40 font-bold uppercase tracking-[0.4em]">ScholarOS © 2026</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
