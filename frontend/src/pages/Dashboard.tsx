import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, History, Trash2, ExternalLink, 
  Calendar, BarChart3, Target, Loader2, Coins, Zap
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('${import.meta.env.VITE_API_URL}/api/auth/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResults(response.data.savedResults.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setCredits(response.data.credits || 0);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteResult = async (_id: string) => {
    // Note: We'd need a backend endpoint for specific deletion, 
    // for now we'll just filter locally or implement a simple clear all if needed.
    alert("Delete functionality coming soon! All results are currently preserved for your history.");
  };

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
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Personal <span className="text-primary">Dashboard</span></h1>
          <p className="text-muted-foreground font-medium">Welcome back, {user.name}! Track all your AI-powered insights in one place.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-card border border-border px-6 py-3 rounded-2xl shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Available Credits</p>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-500" />
              <p className="text-2xl font-black">{credits}</p>
            </div>
          </div>
          <div className="bg-card border border-border px-6 py-3 rounded-2xl shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Analyses</p>
            <p className="text-2xl font-black">{results.length}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end -mt-6">
        <Link to="/pricing" className="flex items-center gap-2 text-xs font-black text-primary hover:underline">
          <Zap className="w-3.5 h-3.5" /> Buy More Credits
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Stats / Welcome */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-primary text-primary-foreground p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 space-y-6 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700" />
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black leading-tight">Ready for your next big goal?</h3>
              <p className="text-sm opacity-80 font-medium">Use our smart tools to stay ahead of the competition.</p>
              <Link to="/" className="inline-block px-6 py-2 bg-white text-primary rounded-xl font-bold text-sm hover:scale-105 transition-all">
                Explore Tools
              </Link>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-[2rem] space-y-4">
            <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Recent Activity
            </h4>
            <div className="space-y-4">
              {results.slice(0, 3).map((res, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-grow">
                    <p className="text-xs font-bold leading-none">{res.toolName}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(res.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {results.length === 0 && <p className="text-xs text-muted-foreground italic">No recent activity found.</p>}
            </div>
          </div>
        </div>

        {/* Saved Results History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Saved Analysis History
            </h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="font-bold text-muted-foreground">Loading your history...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-20 text-center border-2 border-dashed border-border rounded-[3rem] space-y-4">
              <div className="p-5 bg-muted rounded-full inline-block">
                <BarChart3 className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <h4 className="text-lg font-bold">No results saved yet</h4>
                <p className="text-sm text-muted-foreground">Start using our AI tools and your results will appear here automatically.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {results.map((res, idx) => (
                  <motion.div 
                    key={res._id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-card border border-border p-6 rounded-[2rem] hover:border-primary/30 transition-all shadow-sm flex flex-col justify-between h-full"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className={`p-2 rounded-lg ${res.toolName === 'Rank Predictor' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'}`}>
                          {res.toolName === 'Rank Predictor' ? <TrendingUp className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-1 rounded-md uppercase">
                          {new Date(res.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="font-black text-lg leading-tight">{res.toolName}</h4>
                        <p className="text-xs text-muted-foreground font-medium mt-1">
                          Exam: <span className="text-foreground">{res.data.exam}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-muted/50 p-3 rounded-xl">
                          <p className="text-[10px] font-black uppercase text-muted-foreground opacity-70">Result</p>
                          <p className="text-sm font-black text-primary">
                            {res.toolName === 'Rank Predictor' ? res.data.predictedRank : `${res.data.percentile}%`}
                          </p>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-xl">
                          <p className="text-[10px] font-black uppercase text-muted-foreground opacity-70">Performance</p>
                          <p className="text-sm font-black text-foreground">{res.data.performanceLevel || res.data.admissionChances}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                      <Link 
                        to={res.toolName === 'Rank Predictor' ? '/tools/rank-predictor' : '/tools/marks-percentile'}
                        className="flex-grow flex items-center justify-center gap-2 py-2.5 bg-muted text-muted-foreground rounded-xl text-xs font-black hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Re-Analyze
                      </Link>
                      <button 
                        onClick={() => deleteResult(res._id)}
                        className="p-2.5 bg-muted text-muted-foreground rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TrendingUp = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
    <polyline points="16 7 22 7 22 13"></polyline>
  </svg>
);

export default Dashboard;
