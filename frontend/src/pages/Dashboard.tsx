import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Trash2, ExternalLink, 
  BarChart3, Target, Loader2, Coins, Zap, ShieldCheck, TrendingUp,
  X, Sparkles, Award, MapPin, IndianRupee, Users, Briefcase, Zap as ZapIcon, Info, AlignLeft,
  Calendar, Gift, Send, Mail
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
  const [activeTab, setActiveTab] = useState<'results' | 'credits' | 'network'>('results');
  const [selectedResult, setSelectedResult] = useState<any | null>(null);
  const [pulse, setPulse] = useState<any[]>([]);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [giftData, setGiftData] = useState({ email: '', amount: 5 });
  const [giftLoading, setGiftLoading] = useState(false);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [customAmountVal, setCustomAmountVal] = useState('');

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
      alert("Please enter a valid credit amount greater than 0.");
      return;
    }
    
    if (credits < amountToGiftVal) {
      alert("You do not have enough credits to complete this transfer.");
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
      alert("Credits gifted successfully!");
      setIsGiftModalOpen(false);
      setGiftData({ email: '', amount: 5 });
      setIsCustomAmount(false);
      setCustomAmountVal('');
      fetchUserData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to gift credits");
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
        alert("Failed to delete result. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold text-muted-foreground tracking-tight">Checking authentication...</p>
      </div>
    );
  }

  if (user && user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  if (!user) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="p-6 bg-primary/10 rounded-full">
          <LayoutDashboard className="w-12 h-12 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black">Authentication Required</h2>
          <p className="text-muted-foreground">Please login to view your personal dashboard and saved analyses.</p>
        </div>
        <Link to="/login" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-primary/20 transition-all">
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 px-4 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Personal <span className="text-primary">Dashboard</span></h1>
          <p className="text-muted-foreground font-medium">Welcome back, {user.name}! Track all your AI-powered insights.</p>
        </div>
        <div className="flex items-center gap-2">
           {user.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-2 text-xs font-black text-amber-500 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
            </Link>
          )}
          <button 
            onClick={() => setIsGiftModalOpen(true)}
            className="flex items-center gap-2 text-xs font-black text-amber-500 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20"
          >
            <Gift className="w-3.5 h-3.5" /> Gift Credits
          </button>
          <Link to="/pricing" className="flex items-center gap-2 text-xs font-black text-primary bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
            <Zap className="w-3.5 h-3.5" /> Buy Credits
          </Link>
        </div>
      </div>

      {/* Quick Overview Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 bg-primary text-primary-foreground p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 relative overflow-hidden group"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700" />
          <div className="relative z-10 space-y-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black leading-tight">Ready for your next goal?</h3>
              <p className="text-sm opacity-80 font-medium mt-2">Our AI is ready to analyze your next target.</p>
            </div>
            <Link to="/" className="inline-block px-8 py-3 bg-white text-primary rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg">
              Explore Tools
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-md bg-card/40 border border-white/10 p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between"
        >
          <div className="p-4 bg-amber-500/10 rounded-2xl w-fit">
            <Coins className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">Credits Available</p>
            <h3 className="text-4xl font-black">{credits}</h3>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-md bg-card/40 border border-white/10 p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between"
        >
          <div className="p-4 bg-emerald-500/10 rounded-2xl w-fit">
            <BarChart3 className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">Total Saved</p>
            <h3 className="text-4xl font-black">{results.length}</h3>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-1 backdrop-blur-md bg-card/40 border border-white/10 p-6 rounded-[2.5rem] shadow-xl flex flex-col justify-between group overflow-hidden relative"
        >
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
             <Calendar className="w-20 h-20" />
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-primary">Academic Pulse</h3>
            </div>
            {pulse.length > 0 && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />}
          </div>
          
          <div className="space-y-3 mb-4">
            {pulse.length > 0 ? (
              pulse.map((task, i) => (
                <div key={i} className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between group/task">
                   <div className="min-w-0">
                      <p className="text-[10px] font-black text-foreground truncate uppercase">{task.subject}</p>
                      <p className="text-[9px] text-muted-foreground truncate font-medium">{task.topic}</p>
                   </div>
                   <div className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                      task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' :
                      task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-emerald-500/10 text-emerald-500'
                   }`}>
                      {task.priority}
                   </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center space-y-2 opacity-30">
                <Sparkles className="w-6 h-6 mx-auto" />
                <p className="text-[9px] font-black uppercase">No tasks today</p>
              </div>
            )}
          </div>

          <Link to="/tools/study-planner" className="w-full py-2.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black hover:bg-primary hover:text-white transition-all border border-primary/20 text-center block uppercase tracking-widest">
            Planner
          </Link>
        </motion.div>
      </div>

      {/* Main Tabs Area */}
      <div className="space-y-8">
        <div className="flex items-center gap-6 border-b border-white/10">
          <button 
            onClick={() => setActiveTab('results')}
            className={`pb-4 px-2 text-sm font-black transition-all relative ${activeTab === 'results' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Saved Analyses
            {activeTab === 'results' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('credits')}
            className={`pb-4 px-2 text-sm font-black transition-all relative ${activeTab === 'credits' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Credit History
            {activeTab === 'credits' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('network')}
            className={`pb-4 px-2 text-sm font-black transition-all relative ${activeTab === 'network' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            My Network
            {activeTab === 'network' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="font-bold text-muted-foreground">Loading your data...</p>
          </div>
        ) : activeTab === 'results' ? (
          results.length === 0 ? (
            <div className="p-20 text-center border-2 border-dashed border-white/10 rounded-[3rem] space-y-4">
              <div className="p-5 bg-muted rounded-full inline-block text-muted-foreground">
                <BarChart3 className="w-12 h-12" />
              </div>
              <p className="text-sm font-bold text-muted-foreground">No analyses saved yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {results.map((res, idx) => (
                  <motion.div 
                    key={res._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="backdrop-blur-md bg-card/40 border border-white/10 p-6 rounded-[2rem] hover:bg-card/60 transition-all group cursor-pointer"
                    onClick={() => setSelectedResult(res)}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className={`p-2.5 rounded-xl ${
                          res.toolName.includes('Rank') ? 'bg-amber-500/10 text-amber-500' : 
                          res.toolName.includes('Percentile') ? 'bg-indigo-500/10 text-indigo-500' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {res.toolName.includes('Rank') ? <Target className="w-5 h-5" /> : 
                           res.toolName.includes('Percentile') ? <TrendingUp className="w-5 h-5" /> : 
                           <Sparkles className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground bg-white/5 px-2 py-1 rounded-lg uppercase">
                          {new Date(res.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-black text-lg">{res.toolName}</h4>
                        <p className="text-xs text-muted-foreground font-medium">{res.data.exam || res.data.jobTitle || 'AI Analysis'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="bg-white/5 p-3 rounded-2xl">
                          <p className="text-[9px] font-black uppercase text-muted-foreground opacity-60">Result</p>
                          <p className="text-xs font-black text-primary truncate">
                            {res.toolName === 'Rank Predictor' ? res.data.predictedRank : 
                             res.toolName === 'Marks vs Percentile' ? `${res.data.percentile}%` : 
                             res.toolName.includes('Resume') ? 'Generated' : 'Analyzed'}
                          </p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl">
                          <p className="text-[9px] font-black uppercase text-muted-foreground opacity-60">Detail</p>
                          <p className="text-xs font-black truncate">
                            {res.data.performanceLevel || res.data.admissionChances || res.data.marks || 'View More'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedResult(res); }}
                          className="flex-grow flex items-center justify-center gap-2 py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-black hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View Analysis
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteResult(res._id); }}
                          className="p-2.5 bg-white/5 text-muted-foreground rounded-xl hover:bg-rose-500/20 hover:text-rose-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )
        ) : activeTab === 'credits' ? (
          creditHistory.length === 0 ? (
            <div className="p-20 text-center border-2 border-dashed border-white/10 rounded-[3rem] space-y-4">
              <div className="p-5 bg-muted rounded-full inline-block text-muted-foreground">
                <Coins className="w-12 h-12" />
              </div>
              <p className="text-sm font-bold text-muted-foreground">No credit transactions yet.</p>
            </div>
          ) : (
            <div className="bg-card/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <th className="px-8 py-5">Transaction</th>
                    <th className="px-8 py-5">Type</th>
                    <th className="px-8 py-5 text-center">Amount</th>
                    <th className="px-8 py-5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {creditHistory.map((item, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-all">
                      <td className="px-8 py-5 font-bold text-sm">{item.description}</td>
                      <td className="px-8 py-5">
                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${
                          item.type === 'added' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center font-black text-sm">
                        <span className={item.type === 'added' ? 'text-emerald-500' : 'text-rose-500'}>
                          {item.type === 'added' ? '+' : '-'}{item.amount}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right text-xs text-muted-foreground font-medium">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <ReferralNetwork />
        )}
      </div>

      {/* Gifting Modal */}
      <AnimatePresence>
        {isGiftModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/90 backdrop-blur-md" 
              onClick={closeGiftModal} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-card border border-white/10 w-full max-w-md rounded-[3rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 opacity-5">
                 <Gift className="w-40 h-40" />
              </div>

              <div className="space-y-8 relative z-10">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                     <Gift className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Gift Credits</h3>
                  <p className="text-xs text-muted-foreground font-medium">Spread the academic fuel to your friends.</p>
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
                         className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all font-bold"
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
                           className={`py-3 rounded-xl text-sm font-black border transition-all ${(!isCustomAmount && giftData.amount === amt) ? 'bg-amber-500 text-amber-950 border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-white/5 border-white/5 hover:bg-white/10 text-foreground'}`}
                         >
                           {amt}
                         </button>
                       ))}
                       <button 
                         type="button"
                         onClick={() => {
                           setIsCustomAmount(true);
                         }}
                         className={`py-3 rounded-xl text-sm font-black border transition-all ${isCustomAmount ? 'bg-amber-500 text-amber-950 border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-white/5 border-white/5 hover:bg-white/10 text-foreground'}`}
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
                            placeholder="Enter amount (e.g. 15.5)"
                            value={customAmountVal}
                            onChange={(e) => setCustomAmountVal(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all font-bold"
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
                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed text-center pt-1">
                      Total deducted from your balance: <span className="font-black text-amber-500/80">{amountToGift.toFixed(2)} credits</span> (Current balance: {credits})
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button" onClick={closeGiftModal}
                      className="flex-grow py-4 bg-muted text-muted-foreground rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" disabled={giftLoading || credits < amountToGift || amountToGift <= 0}
                      className="flex-[2] py-4 bg-amber-500 text-amber-950 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
        className="absolute inset-0 bg-background/90 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-card border border-border w-full max-w-4xl max-h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-8 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                {result.toolName.includes('Rank') ? <Target className="w-6 h-6" /> : 
                 result.toolName.includes('Percentile') ? <TrendingUp className="w-6 h-6" /> : 
                 <Sparkles className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-2xl font-black">{result.toolName}</h3>
              <p className="text-sm text-muted-foreground font-medium">Analysis from {new Date(result.date).toLocaleDateString()}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-muted hover:bg-rose-500/10 hover:text-rose-500 rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
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
                <div className="col-span-4 bg-muted/30 p-4 rounded-2xl border border-border">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Details</p>
                    <pre className="text-xs font-medium whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
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
              <div className="p-6 bg-muted/30 rounded-3xl border border-border space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Original Bullet</p>
                <p className="text-sm font-medium text-muted-foreground">{data.original}</p>
              </div>
              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-2">
                <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="w-4 h-4" />
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
                        <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-xl border border-border/50 text-[11px] font-bold">
                            <div className="w-5 h-5 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0">{i+1}</div>
                            {s}
                        </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Paper Difficulty Analysis (Rank Predictor specific) */}
          {data.paperDifficultyAnalysis && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-orange-500">
                <ZapIcon className="w-5 h-5" />
                <h4 className="font-black uppercase tracking-wider text-sm">Historical Difficulty Analysis</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 <div className="bg-card border border-border p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Level</p>
                    <p className="text-lg font-black text-orange-500">{data.paperDifficultyAnalysis.currentYear?.difficultyLevel || 'N/A'}</p>
                 </div>
                 <div className="bg-card border border-border p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Avg Marks</p>
                    <p className="text-lg font-black">{data.paperDifficultyAnalysis.currentYear?.avgMarksScored || 'N/A'}</p>
                 </div>
                 <div className="bg-card border border-border p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Normalized</p>
                    <p className="text-lg font-black text-emerald-500">{data.paperDifficultyAnalysis.yourPerformance?.normalizedScore || 'N/A'}</p>
                 </div>
                 <div className="bg-card border border-border p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Verdict</p>
                    <p className="text-xs font-black">{data.paperDifficultyAnalysis.yourPerformance?.verdict || 'N/A'}</p>
                 </div>
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed px-2">{data.paperDifficultyAnalysis.paperInsight}</p>
            </div>
          )}

          {/* Suggested Colleges (Rank Predictor specific) */}
          {data.collegeDetails && data.collegeDetails.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Briefcase className="w-5 h-5" />
                <h4 className="font-black uppercase tracking-wider text-sm">Eligible Institutions</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.collegeDetails.slice(0, 6).map((college: any, idx: number) => (
                  <div key={idx} className="bg-card border border-border p-5 rounded-[2rem] space-y-3 shadow-sm">
                    <div className="flex justify-between items-start gap-2">
                        <h5 className="font-black text-sm leading-tight">{college.name}</h5>
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
        <div className="p-8 border-t border-border flex items-center justify-between shrink-0 bg-muted/10">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Saved on {new Date(result.date).toLocaleDateString()}</p>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-muted text-muted-foreground rounded-xl text-xs font-black hover:bg-muted/80 transition-all"
            >
              Close
            </button>
            <Link 
              to={result.toolName === 'Rank Predictor' ? '/tools/rank-predictor' : '/tools/marks-percentile'}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-black hover:scale-105 transition-all shadow-lg"
            >
              Run New Analysis
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StatItem = ({ label, value, icon: Icon, color, bg }: any) => (
  <div className="bg-card border border-border p-4 rounded-2xl space-y-2 shadow-sm">
    <div className={`p-1.5 rounded-lg ${bg} ${color} w-fit`}><Icon className="w-4 h-4" /></div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
    <p className={`text-lg font-black ${color} truncate`}>{value || 'N/A'}</p>
  </div>
);

export default Dashboard;
