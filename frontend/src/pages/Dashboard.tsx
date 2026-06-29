import { useState, useEffect } from 'react';
import { toast } from '../lib/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Trash2, 
  BarChart3, Target, Loader2, Coins, Zap, ShieldCheck, TrendingUp,
  X, Sparkles, Award, MapPin, IndianRupee, Users, Briefcase, Zap as ZapIcon, Info, AlignLeft,
  Calendar, Gift, Send, Mail, ChevronRight, Menu, FileText, GraduationCap
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { Link, Navigate } from 'react-router-dom';
import ReferralNetwork from '../components/ReferralNetwork';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [creditHistory, setCreditHistory] = useState<any[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // Tab Management: overview, results, credits, network
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'credits' | 'network'>('overview');
  const [selectedResult, setSelectedResult] = useState<any | null>(null);
  const [pulse, setPulse] = useState<any[]>([]);
  
  // Gifting modal states
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [giftData, setGiftData] = useState({ email: '', amount: 5 });
  const [giftLoading, setGiftLoading] = useState(false);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [customAmountVal, setCustomAmountVal] = useState('');

  // Mobile sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const amountToGift = isCustomAmount ? (parseFloat(customAmountVal) || 0) : giftData.amount;
  const systemFee = parseFloat((amountToGift * 0.015).toFixed(2));
  const netTransferred = parseFloat((amountToGift - systemFee).toFixed(2));

  useEffect(() => {
    if (!isLoading && user) {
      fetchUserData();
    }
  }, [user, isLoading]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResults(response.data.savedResults.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setCreditHistory(response.data.creditHistory?.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()) || []);
      setCredits(response.data.credits || 0);
      setPulse(response.data.studyPlannerPulse || []);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGiftCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountToGiftVal = isCustomAmount ? parseFloat(customAmountVal) : giftData.amount;
    
    if (isNaN(amountToGiftVal) || amountToGiftVal <= 0) {
      toast.error('Enter a valid credit amount greater than 0.');
      return;
    }
    
    if (credits < amountToGiftVal) {
      toast.error('Not enough credits to complete this transfer.');
      return;
    }

    setGiftLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/gift-credits`, {
        recipientEmail: giftData.email,
        amount: amountToGiftVal
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Credits gifted successfully!');
      setIsGiftModalOpen(false);
      setGiftData({ email: '', amount: 5 });
      setIsCustomAmount(false);
      setCustomAmountVal('');
      fetchUserData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to gift credits');
    } finally {
      setGiftLoading(false);
    }
  };

  const closeGiftModal = () => {
    setIsGiftModalOpen(false);
    setGiftData({ email: '', amount: 5 });
    setIsCustomAmount(false);
    setCustomAmountVal('');
  };

  const deleteResult = async (_id: string) => {
    if (!confirm("Are you sure you want to delete this result?")) return;
    try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/tools/delete-result/${_id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchUserData();
    } catch (err) {
        toast.error('Failed to delete result. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="h-[65vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold text-muted-foreground tracking-tight">Accessing workspace...</p>
      </div>
    );
  }

  if (user && user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  if (!user) {
    return (
      <div className="h-[65vh] flex flex-col items-center justify-center space-y-6 bg-background text-foreground transition-colors duration-300">
        <div className="p-6 bg-primary/10 rounded-full">
          <LayoutDashboard className="w-12 h-12 text-primary animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black italic text-foreground">Authentication Required</h2>
          <p className="text-muted-foreground max-w-sm">Log in to launch your personal workspace and save your rank predictions.</p>
        </div>
        <Link to="/login" className="saas-button-primary !px-10 !py-4 shadow-sm">
          Login Now
        </Link>
      </div>
    );
  }

  // Credit Progress Ring Configuration
  const limit = 100;
  const radius = 34;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(credits, limit) / limit) * circumference;

  const sidebarTabs = [
    { id: 'overview', label: 'Workspace Home', icon: LayoutDashboard },
    { id: 'results', label: 'Saved Analyses', icon: BarChart3 },
    { id: 'credits', label: 'Billing & Limits', icon: Coins },
    { id: 'network', label: 'My Network', icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12 px-2 sm:px-4 flex flex-col lg:flex-row gap-8 relative min-h-[75vh] bg-background text-foreground transition-colors duration-300">
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden w-full flex justify-between items-center bg-foreground/[0.03] border border-border/40 px-6 py-4 rounded-2xl mb-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
            <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-foreground">ScholarOS</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-foreground/[0.08] rounded-lg text-foreground"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border/40 p-6 flex flex-col gap-6 shrink-0 transition-all duration-300
        lg:relative lg:translate-x-0 lg:w-64 lg:z-0 lg:bg-card/50 lg:backdrop-blur-3xl lg:border lg:border-border/30 lg:rounded-[2.5rem] lg:p-6 lg:h-fit lg:sticky lg:top-28 lg:shadow-sm
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="lg:hidden flex justify-between items-center mb-6">
          <span className="text-xs font-black text-foreground uppercase tracking-widest">Workspace Menu</span>
          <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-foreground/[0.08] rounded-lg">
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="hidden lg:flex items-center gap-3 bg-foreground/[0.03] border border-border/30 p-3 rounded-2xl mb-4 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-primary-foreground font-black text-xs shrink-0 border border-border/20 overflow-hidden">
               {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-full" /> : user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-grow">
              <h4 className="text-[11px] font-black text-foreground truncate">{user.name}</h4>
              <p className="text-[9px] text-muted-foreground font-bold truncate tracking-wider">{user.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-left flex items-center gap-3.5 transition-all group
                  ${activeTab === tab.id 
                    ? 'bg-primary border border-primary/20 text-primary-foreground shadow-sm' 
                    : 'border border-transparent text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground'}
                `}
              >
                <tab.icon className={`w-4 h-4 shrink-0 transition-colors ${activeTab === tab.id ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                <span className="flex-grow">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="w-1.5 h-1.5 rounded-full bg-primary-foreground shrink-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="mt-auto space-y-3 pt-6 border-t border-border/40">
          <button 
            onClick={() => setIsGiftModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Gift className="w-4 h-4 shrink-0" />
            Gift Credits
          </button>
          <Link 
            to="/pricing"
            className="w-full flex items-center gap-3 px-4 py-3 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/25 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center block"
          >
            <Zap className="w-4 h-4 shrink-0" />
            Upgrade Plan
          </Link>
        </div>
      </div>

      {/* Main Console Viewport */}
      <div className="flex-grow min-w-0 space-y-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="h-[50vh] flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="font-bold text-muted-foreground">Synchronizing workspace details...</p>
            </div>
          ) : activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Header Title Banner */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/40 pb-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground italic">
                    Workspace <span className="text-primary">Overview</span>
                  </h1>
                  <p className="text-muted-foreground font-medium text-sm">Monitor credits, verify activity logs, and launch active modules.</p>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-3.5 py-1.5 rounded-xl">
                  ● Cloud Online
                </div>
              </div>

              {/* Grid of Key SaaS Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Circular Progress Credits Ring */}
                <div className="bg-card border border-border/40 p-6 rounded-[2rem] shadow-sm flex items-center justify-between group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-bl-full blur-xl" />
                  <div className="space-y-4 relative z-10">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Limit balance</p>
                    <div>
                      <h3 className="text-3xl font-black text-foreground">{credits}</h3>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">AI Tokens Available</p>
                    </div>
                  </div>
                  
                  {/* SVG progress ring */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle 
                        className="text-foreground/[0.04]" 
                        strokeWidth={stroke} 
                        stroke="currentColor" 
                        fill="transparent" 
                        r={normalizedRadius} 
                        cx="40" 
                        cy="40" 
                      />
                      <circle 
                        className="text-primary" 
                        strokeWidth={stroke} 
                        strokeDasharray={circumference} 
                        strokeDashoffset={strokeDashoffset} 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r={normalizedRadius} 
                        cx="40" 
                        cy="40" 
                      />
                    </svg>
                    <span className="absolute text-[10px] font-black text-foreground">{Math.round((Math.min(credits, limit) / limit) * 100)}%</span>
                  </div>
                </div>

                {/* Total Saved Analyses Card */}
                <div className="bg-card border border-border/40 p-6 rounded-[2rem] shadow-sm flex flex-col justify-between group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full blur-xl" />
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl w-fit">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div className="mt-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Stored Repositories</p>
                    <h3 className="text-3xl font-black text-foreground mt-1">{results.length}</h3>
                  </div>
                </div>

                {/* Academic Pulse Planner widget */}
                <div className="bg-card border border-border/40 p-6 rounded-[2rem] shadow-sm flex flex-col justify-between group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/5 rounded-bl-full blur-xl" />
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-xl">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Roadmap Task</span>
                    </div>
                    {pulse.length > 0 && <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />}
                  </div>

                  <div className="space-y-2 my-2 min-h-[60px] max-h-[85px] overflow-y-auto scroll-hide">
                    {pulse.length > 0 ? (
                      pulse.slice(0, 2).map((task, i) => (
                        <div key={i} className="bg-foreground/[0.04] p-2 rounded-xl border border-border/30 flex items-center justify-between text-[10px]">
                          <span className="font-bold text-foreground truncate max-w-[100px]">{task.subject}</span>
                          <span className="text-muted-foreground truncate text-[8px] font-medium max-w-[80px]">{task.topic}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground opacity-30 space-y-1">
                        <Sparkles className="w-5 h-5 mx-auto" />
                        <p className="text-[8px] font-black uppercase">No goals assigned</p>
                      </div>
                    )}
                  </div>

                  <Link to="/tools/study-planner" className="w-full py-2 bg-foreground/[0.04] border border-border/40 hover:bg-primary hover:text-primary-foreground rounded-xl text-[9px] font-black uppercase tracking-widest transition-all text-center block">
                    Launch Scheduler
                  </Link>
                </div>
              </div>

              {/* Quick Launcher Suite Grid */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-foreground uppercase italic">Launcher Suite</h3>
                  <div className="h-px flex-grow bg-gradient-to-r from-border/40 to-transparent" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { title: 'AI Rank Predictor', path: '/tools/rank-predictor', color: 'border-primary/20 hover:border-primary/50', icon: Target },
                    { title: 'Resume Builder', path: '/tools/resume-builder', color: 'border-indigo-500/20 hover:border-indigo-500/50', icon: Briefcase },
                    { title: 'Study Planner', path: '/tools/study-planner', color: 'border-emerald-500/20 hover:border-emerald-500/50', icon: Calendar },
                    { title: 'Marks vs Percentile', path: '/tools/marks-vs-percentile', color: 'border-purple-500/20 hover:border-purple-500/50', icon: TrendingUp },
                    { title: 'PDF Editor', path: '/tools/pdf/merge', color: 'border-border/40 hover:border-primary/45', icon: FileText },
                    { title: 'Grade Calculator', path: '/tools/cgpa-calculator', color: 'border-border/40 hover:border-primary/45', icon: GraduationCap }
                  ].map((mod, i) => (
                    <Link 
                      key={i} 
                      to={mod.path}
                      className={`bg-card border ${mod.color} p-4 rounded-2xl flex items-center justify-between group hover:scale-[1.02] hover:bg-card transition-all shadow-sm`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-foreground/[0.04] rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors text-muted-foreground">
                          <mod.icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-foreground">{mod.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Activity Log Preview */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-foreground uppercase italic">Activity Log</h3>
                  <button onClick={() => setActiveTab('results')} className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">
                    View Stored Reports
                  </button>
                </div>
                
                {results.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-border/40 rounded-[2rem] text-muted-foreground italic text-xs bg-card">
                    No active processes registered in this workspace yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {results.slice(0, 3).map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSelectedResult(item)}
                        className="bg-card hover:bg-foreground/[0.02] border border-border/40 hover:border-primary/20 p-4 rounded-2xl flex items-center justify-between transition-all cursor-pointer group shadow-sm"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0">
                            {item.toolName.includes('Rank') ? <Target className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-foreground truncate">{item.toolName}</h4>
                            <p className="text-[9px] text-muted-foreground font-medium italic truncate">{item.data.exam || item.data.jobTitle || 'AI Session'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[9px] text-muted-foreground font-medium">{new Date(item.date).toLocaleDateString()}</span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeTab === 'results' ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="border-b border-border/40 pb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-foreground italic">Saved Analyses</h2>
                <p className="text-muted-foreground font-medium text-sm">Review, delete, or inspect details of your saved predictive files.</p>
              </div>

              {results.length === 0 ? (
                <div className="p-20 text-center border border-dashed border-border/40 bg-card rounded-[2.5rem] space-y-4">
                  <div className="p-4 bg-muted rounded-full inline-block text-muted-foreground">
                    <BarChart3 className="w-10 h-10" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground italic">No saved analysis records found.</p>
                  <Link to="/" className="saas-button-primary !py-3 inline-block text-[10px] tracking-wider font-black">
                    Run Analysis Now
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((res, idx) => (
                    <motion.div 
                      key={res._id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-card border border-border/40 hover:border-primary/30 p-6 rounded-3xl hover:bg-card/50 transition-all duration-300 group cursor-pointer shadow-sm"
                      onClick={() => setSelectedResult(res)}
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className={`p-2.5 rounded-xl ${res.toolName.includes('Rank') ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                            {res.toolName.includes('Rank') ? <Target className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                          </div>
                          <span className="text-[8px] font-black text-muted-foreground bg-foreground/[0.04] px-2.5 py-1 rounded-md uppercase">
                            {new Date(res.date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div>
                          <h4 className="font-black text-base text-foreground">{res.toolName}</h4>
                          <p className="text-[10px] text-muted-foreground font-medium italic mt-0.5">{res.data.exam || res.data.jobTitle || 'AI Session'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-foreground/[0.02] p-3 rounded-2xl border border-border/30">
                          <div>
                            <p className="text-[8px] font-black uppercase text-muted-foreground/60">Value</p>
                            <p className="text-xs font-black text-primary truncate mt-0.5">
                              {res.toolName === 'Rank Predictor' ? res.data.predictedRank : 
                               res.toolName === 'Marks vs Percentile' ? `${res.data.percentile}%` : 'Generated'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[8px] font-black uppercase text-muted-foreground/60">Rating</p>
                            <p className="text-xs font-black text-foreground truncate mt-0.5">
                              {res.data.performanceLevel || res.data.admissionChances || res.data.marks || 'Complete'}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedResult(res); }}
                            className="flex-grow py-2.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            Inspect Details
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteResult(res._id); }}
                            className="p-2.5 bg-foreground/[0.04] text-muted-foreground rounded-xl hover:bg-rose-500/25 hover:text-rose-500 transition-all border border-border/40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : activeTab === 'credits' ? (
            <motion.div
              key="credits"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="border-b border-border/40 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground italic">Billing & Ledger</h2>
                  <p className="text-muted-foreground font-medium text-sm">View transaction histories, deposits, and token usage reports.</p>
                </div>
                <Link to="/pricing" className="saas-button-primary !py-2.5 !px-6 text-[10px]">
                  Add Credits <Zap className="w-3.5 h-3.5 inline ml-1 fill-current" />
                </Link>
              </div>

              {creditHistory.length === 0 ? (
                <div className="p-20 text-center border border-dashed border-border/40 bg-card rounded-[2.5rem] space-y-4">
                  <div className="p-4 bg-muted rounded-full inline-block text-muted-foreground">
                    <Coins className="w-10 h-10" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground italic">No transactions cataloged yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Desktop view */}
                  <div className="hidden md:block bg-card border border-border/40 rounded-[2rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-foreground/[0.04] text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          <th className="px-8 py-5">Transaction Details</th>
                          <th className="px-8 py-5">Type</th>
                          <th className="px-8 py-5 text-center">Value</th>
                          <th className="px-8 py-5 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {creditHistory.map((item, i) => (
                          <tr key={i} className="hover:bg-foreground/[0.02] transition-all text-xs font-medium">
                            <td className="px-8 py-5 text-foreground font-bold">{item.description}</td>
                            <td className="px-8 py-5">
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${item.type === 'added' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {item.type}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-center font-black">
                              <span className={item.type === 'added' ? 'text-emerald-500' : 'text-rose-500'}>
                                {item.type === 'added' ? '+' : '-'}{item.amount}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right text-muted-foreground">{new Date(item.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile view */}
                  <div className="block md:hidden space-y-3">
                    {creditHistory.map((item, i) => (
                      <div key={i} className="bg-card border border-border/40 p-5 rounded-2xl flex flex-col gap-3">
                        <div className="flex justify-between items-start gap-2 text-xs">
                          <span className="font-bold text-foreground">{item.description}</span>
                          <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded ${item.type === 'added' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {item.type}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border/30 text-[10px]">
                          <span className="text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>
                          <span className={`font-black ${item.type === 'added' ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {item.type === 'added' ? '+' : '-'}{item.amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="network"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <ReferralNetwork />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gifting Modal Overlay */}
      <AnimatePresence>
        {isGiftModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
              onClick={closeGiftModal} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-card border border-border/40 w-full max-w-md rounded-[3rem] shadow-md p-10 overflow-hidden text-foreground"
            >
              <div className="absolute -right-10 -top-10 opacity-5">
                 <Gift className="w-40 h-40 text-primary" />
              </div>

              <div className="space-y-8 relative z-10">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                     <Gift className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground">Gift Credits</h3>
                  <p className="text-xs text-muted-foreground font-medium">Send tokens to other workspace users.</p>
                </div>

                <form onSubmit={handleGiftCredits} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Recipient Email</label>
                    <div className="relative">
                       <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                       <input 
                         type="email" required
                         placeholder="friend@example.com"
                         value={giftData.email}
                         onChange={(e) => setGiftData({ ...giftData, email: e.target.value })}
                         className="w-full bg-foreground/[0.04] border border-border/30 rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all font-bold text-foreground text-sm"
                       />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Amount to Gift</label>
                    <div className="grid grid-cols-4 gap-2">
                       {[5, 10, 20].map(amt => (
                         <button 
                           key={amt} type="button"
                           onClick={() => {
                             setIsCustomAmount(false);
                             setGiftData({ ...giftData, amount: amt });
                           }}
                           className={`py-3 rounded-xl text-sm font-black border transition-all ${(!isCustomAmount && giftData.amount === amt) ? 'bg-amber-500 text-amber-950 border-amber-500 shadow-sm' : 'bg-foreground/[0.04] border-border/30 hover:bg-foreground/[0.08] text-foreground'}`}
                         >
                           {amt}
                         </button>
                       ))}
                       <button 
                         type="button"
                         onClick={() => {
                           setIsCustomAmount(true);
                         }}
                         className={`py-3 rounded-xl text-sm font-black border transition-all ${isCustomAmount ? 'bg-amber-500 text-amber-950 border-amber-500 shadow-sm' : 'bg-foreground/[0.04] border-border/30 hover:bg-foreground/[0.08] text-foreground'}`}
                       >
                         Custom
                       </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isCustomAmount && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3 overflow-hidden"
                      >
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Custom Amount</label>
                        <div className="relative">
                          <Coins className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input 
                            type="number" 
                            step="any" 
                            required
                            min="0.01"
                            placeholder="Enter amount"
                            value={customAmountVal}
                            onChange={(e) => setCustomAmountVal(e.target.value)}
                            className="w-full bg-foreground/[0.04] border border-border/30 rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all font-bold text-foreground text-sm"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="bg-amber-500/5 p-5 rounded-2xl border border-amber-500/10 space-y-3">
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                      <span>Amount to Gift:</span>
                      <span className="font-bold text-foreground">{amountToGift.toFixed(2)} credits</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium text-amber-500/80">
                      <span>System Fee (1.5%):</span>
                      <span className="font-bold">-{systemFee.toFixed(2)} credits</span>
                    </div>
                    <div className="border-t border-amber-500/10 pt-2 flex justify-between items-center text-sm font-bold text-foreground">
                      <span>Recipient Receives:</span>
                      <span className="text-amber-500 font-black">{netTransferred > 0 ? netTransferred.toFixed(2) : '0.00'} credits</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button" onClick={closeGiftModal}
                      className="flex-grow py-4 bg-muted text-muted-foreground rounded-2xl font-black uppercase tracking-widest text-[10px]"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" disabled={giftLoading || credits < amountToGift || amountToGift <= 0}
                      className="flex-[2] py-4 bg-amber-500 text-amber-950 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {giftLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Gift</>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Analysis Detail Modal */}
      <AnalysisDetailModal 
        isOpen={!!selectedResult} 
        onClose={() => setSelectedResult(null)} 
        result={selectedResult} 
      />
    </div>
  );
};

const AnalysisDetailModal = ({ isOpen, onClose, result }: { isOpen: boolean, onClose: () => void, result: any }) => {
  if (!isOpen || !result) return null;

  const data = result.data;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-card border border-border/40 w-full max-w-4xl max-h-[85vh] rounded-[3rem] shadow-md overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-8 border-b border-border/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                {result.toolName.includes('Rank') ? <Target className="w-6 h-6" /> : 
                 result.toolName.includes('Percentile') ? <TrendingUp className="w-6 h-6" /> : 
                 <Sparkles className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-2xl font-black text-foreground italic">{result.toolName}</h3>
              <p className="text-sm text-muted-foreground font-medium">Session logs from {new Date(result.date).toLocaleDateString()}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-muted hover:bg-rose-500/10 hover:text-rose-500 rounded-2xl transition-all"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow space-y-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {result.toolName === 'Rank Predictor' ? (
                <>
                  <StatItem label="Predicted Rank" value={data.predictedRank} icon={Target} color="text-primary" bg="bg-primary/10" />
                  <StatItem label="Percentile" value={data.predictedPercentile} icon={TrendingUp} color="text-indigo-500" bg="bg-indigo-500/10" />
                  <StatItem label="Admission" value={data.admissionChances} icon={Award} color="text-amber-500" bg="bg-amber-500/10" />
                  <StatItem label="Exam" value={data.exam} icon={Info} color="text-emerald-500" bg="bg-emerald-500/10" />
                </>
             ) : result.toolName === 'Marks vs Percentile' ? (
                <>
                  <StatItem label="Percentile" value={`${data.percentile}%`} icon={TrendingUp} color="text-primary" bg="bg-primary/10" />
                  <StatItem label="Performance" value={data.performanceLevel} icon={Award} color="text-indigo-500" bg="bg-indigo-500/10" />
                  <StatItem label="Better Than" value={data.betterThan} icon={BarChart3} color="text-amber-500" bg="bg-amber-500/10" />
                  <StatItem label="Confidence" value={data.confidence} icon={ShieldCheck} color="text-emerald-500" bg="bg-emerald-500/10" />
                </>
             ) : result.toolName === 'Resume AI Summary' ? (
                <>
                  <StatItem label="Job Title" value={data.jobTitle} icon={Briefcase} color="text-primary" bg="bg-primary/10" />
                  <StatItem label="Tool" value="Resume AI" icon={ZapIcon} color="text-indigo-500" bg="bg-indigo-500/10" />
                  <StatItem label="Status" value="Generated" icon={Award} color="text-amber-500" bg="bg-amber-500/10" />
                  <StatItem label="Credits" value="1 Spent" icon={Coins} color="text-emerald-500" bg="bg-emerald-500/10" />
                </>
             ) : result.toolName === 'Resume Bullet Enhancer' ? (
                <>
                  <StatItem label="Tool" value="Enhancer" icon={ZapIcon} color="text-primary" bg="bg-primary/10" />
                  <StatItem label="Status" value="Enhanced" icon={Sparkles} color="text-indigo-500" bg="bg-indigo-500/10" />
                  <StatItem label="Credits" value="1 Spent" icon={Coins} color="text-amber-500" bg="bg-amber-500/10" />
                  <StatItem label="Type" value="Bullet" icon={Info} color="text-emerald-500" bg="bg-emerald-500/10" />
                </>
             ) : (
                <div className="col-span-4 bg-muted/30 p-4 rounded-2xl border border-border/30">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Details</p>
                    <pre className="text-xs font-medium text-foreground whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
                </div>
             )}
          </div>

          {/* AI Analysis Text / Summary / Enhanced Bullet */}
          {result.toolName === 'Resume AI Summary' && (
            <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <AlignLeft className="w-5 h-5" />
                <h4 className="font-black uppercase tracking-wider text-xs">Generated Professional Summary</h4>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground font-medium italic">
                "{data.summary}"
              </p>
            </div>
          )}

          {result.toolName === 'Resume Bullet Enhancer' && (
            <div className="space-y-6">
              <div className="p-6 bg-muted/30 rounded-3xl border border-border/30 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Original Bullet</p>
                <p className="text-sm font-medium text-muted-foreground">{data.original}</p>
              </div>
              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-2">
                <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Enhanced with AI</p>
                </div>
                <p className="text-sm font-black text-foreground leading-relaxed">{data.enhanced}</p>
              </div>
            </div>
          )}

          {data.analysis && (
            <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-black uppercase tracking-wider text-xs">Expert AI Analysis</h4>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground font-medium italic">
                "{data.analysis}"
              </p>
            </div>
          )}

          {/* Insights for Percentile */}
          {data.insights && (
            <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-indigo-500">
                <Info className="w-5 h-5" />
                <h4 className="font-black uppercase tracking-wider text-xs">AI Performance Insights</h4>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground font-medium italic">
                "{data.insights}"
              </p>
              {data.suggestions && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {data.suggestions.map((s: string, i: number) => (
                        <div key={i} className="flex gap-3 p-3 bg-card rounded-xl border border-border/30 text-[11px] font-bold text-foreground">
                            <div className="w-5 h-5 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0">{i+1}</div>
                            {s}
                        </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Paper Difficulty Analysis */}
          {data.paperDifficultyAnalysis && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-500">
                <ZapIcon className="w-5 h-5" />
                <h4 className="font-black uppercase tracking-wider text-sm">Historical Difficulty Analysis</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 <div className="bg-card border border-border/40 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Level</p>
                    <p className="text-lg font-black text-orange-500">{data.paperDifficultyAnalysis.currentYear?.difficultyLevel || 'N/A'}</p>
                 </div>
                 <div className="bg-card border border-border/40 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Avg Marks</p>
                    <p className="text-lg font-black text-foreground">{data.paperDifficultyAnalysis.currentYear?.avgMarksScored || 'N/A'}</p>
                 </div>
                 <div className="bg-card border border-border/40 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Normalized</p>
                    <p className="text-lg font-black text-emerald-500">{data.paperDifficultyAnalysis.yourPerformance?.normalizedScore || 'N/A'}</p>
                 </div>
                 <div className="bg-card border border-border/40 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Verdict</p>
                    <p className="text-xs font-black text-foreground">{data.paperDifficultyAnalysis.yourPerformance?.verdict || 'N/A'}</p>
                 </div>
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed px-2">{data.paperDifficultyAnalysis.paperInsight}</p>
            </div>
          )}

          {/* Suggested Colleges */}
          {data.collegeDetails && data.collegeDetails.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Briefcase className="w-5 h-5" />
                <h4 className="font-black uppercase tracking-wider text-sm">Eligible Institutions</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.collegeDetails.slice(0, 6).map((college: any, idx: number) => (
                  <div key={idx} className="bg-card border border-border/40 p-5 rounded-[2rem] space-y-3 shadow-sm">
                    <div className="flex justify-between items-start gap-2">
                        <h5 className="font-black text-sm leading-tight text-foreground">{college.name}</h5>
                        {college.naacGrade && <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black rounded-lg">NAAC {college.naacGrade}</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                            <IndianRupee className="w-3 h-3 text-emerald-500" /> {college.fee}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                            <Users className="w-3 h-3 text-blue-500" /> {college.totalSeats || 'N/A'} seats
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                            <Target className="w-3 h-3 text-orange-500" /> {college.cutoffRange}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                            <Briefcase className="w-3 h-3 text-violet-500" /> {college.avgPlacement || 'N/A'}
                        </div>
                    </div>
                    <div className="pt-2 flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground italic">
                        <MapPin className="w-3 h-3" /> {college.location || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-8 border-t border-border/40 flex items-center justify-between shrink-0 bg-muted/10">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Logs recorded on {new Date(result.date).toLocaleDateString()}</p>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-card hover:bg-foreground/[0.04] text-foreground rounded-xl text-xs font-black transition-all border border-border/40"
            >
              Close
            </button>
            <Link 
              to={result.toolName === 'Rank Predictor' ? '/tools/rank-predictor' : '/tools/marks-percentile'}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-black hover:scale-105 transition-all shadow-sm"
            >
              Restart Module
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StatItem = ({ label, value, icon: Icon, color, bg }: any) => (
  <div className="bg-card border border-border/40 p-4 rounded-2xl space-y-2 shadow-sm">
    <div className={`p-1.5 rounded-lg ${bg} ${color} w-fit`}><Icon className="w-4 h-4" /></div>
    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
    <p className={`text-base font-black ${color} truncate`}>{value || 'N/A'}</p>
  </div>
);

export default Dashboard;
