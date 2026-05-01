import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Trash2, ExternalLink, 
  Calendar, BarChart3, Target, Loader2, Coins, Zap, ShieldCheck, TrendingUp, Share2
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { Link, Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [creditHistory, setCreditHistory] = useState<any[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'results' | 'credits'>('results');

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
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteResult = async (_id: string) => {
    alert("Delete functionality coming soon! All results are currently preserved for your history.");
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
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
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
          className="backdrop-blur-md bg-card/40 border border-white/10 p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between group"
        >
          <div className="flex justify-between items-start">
            <div className="p-4 bg-indigo-500/10 rounded-2xl w-fit">
              <Share2 className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">Referrals</p>
                <h3 className="text-xl font-black text-indigo-500">{user?.referralsCount || 0}</h3>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-70">Your Code</p>
              <h3 className="text-lg font-black tracking-widest">{user?.referralCode || 'N/A'}</h3>
            </div>
            <button 
              onClick={() => {
                if (user?.referralCode) {
                    navigator.clipboard.writeText(user.referralCode);
                    alert("Referral code copied to clipboard!");
                }
              }}
              className="w-full py-2 bg-indigo-500/10 text-indigo-500 rounded-xl text-[10px] font-black hover:bg-indigo-500 hover:text-white transition-all border border-indigo-500/20"
            >
              Copy Code
            </button>
          </div>
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
                    className="backdrop-blur-md bg-card/40 border border-white/10 p-6 rounded-[2rem] hover:bg-card/60 transition-all group"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className={`p-2.5 rounded-xl ${res.toolName === 'Rank Predictor' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                          {res.toolName === 'Rank Predictor' ? <TrendingUp className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground bg-white/5 px-2 py-1 rounded-lg uppercase">
                          {new Date(res.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-black text-lg">{res.toolName}</h4>
                        <p className="text-xs text-muted-foreground font-medium">{res.data.exam}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="bg-white/5 p-3 rounded-2xl">
                          <p className="text-[9px] font-black uppercase text-muted-foreground opacity-60">Result</p>
                          <p className="text-xs font-black text-primary">
                            {res.toolName === 'Rank Predictor' ? res.data.predictedRank : `${res.data.percentile}%`}
                          </p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl">
                          <p className="text-[9px] font-black uppercase text-muted-foreground opacity-60">Status</p>
                          <p className="text-xs font-black truncate">{res.data.performanceLevel || res.data.admissionChances}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Link 
                          to={res.toolName === 'Rank Predictor' ? '/tools/rank-predictor' : '/tools/marks-percentile'}
                          className="flex-grow flex items-center justify-center gap-2 py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-black hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Re-Analyze
                        </Link>
                        <button 
                          onClick={() => deleteResult(res._id)}
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;
