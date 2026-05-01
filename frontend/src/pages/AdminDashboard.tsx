import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, DollarSign, Zap, BarChart3, TrendingUp, 
  ArrowUpRight, Loader2, ShieldCheck, LayoutDashboard 
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { Link, Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(response.data);
    } catch (err: any) {
      console.error("Failed to fetch admin stats:", err);
      setError(err.response?.data?.error || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="font-bold text-muted-foreground">Initializing Admin Panel...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-6 px-4">
        <div className="p-6 bg-rose-500/10 rounded-full text-rose-500">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black">Dashboard Error</h2>
          <p className="text-muted-foreground max-w-md mx-auto">{error || "The analytics engine encountered an issue. Please check the backend connection."}</p>
        </div>
        <button 
          onClick={() => { setLoading(true); setError(null); fetchStats(); }}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-primary/20 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#fbbf24', '#10b981', '#f43f5e', '#8b5cf6'];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <ShieldCheck className="w-4 h-4" /> Admin Access Only
          </div>
          <h1 className="text-4xl font-black tracking-tight">Platform <span className="text-primary">Analytics</span></h1>
          <p className="text-muted-foreground font-medium">Overview of Student Toolkit Pro performance and growth.</p>
        </div>
        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold bg-muted px-4 py-2 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
          <LayoutDashboard className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', trend: '+12%' },
          { label: 'Est. Revenue', value: `₹${Math.round(stats.totalRevenue)}`, icon: DollarSign, color: 'text-emerald-500', trend: '+24%' },
          { label: 'AI Requests', value: stats.totalAIRequests, icon: Zap, color: 'text-amber-500', trend: '+18%' },
          { label: 'Top Tool', value: stats.topTools[0]?.name.split(' ')[0] || 'N/A', icon: TrendingUp, color: 'text-purple-500', trend: 'Active' },
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border p-6 rounded-[2rem] shadow-sm space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl bg-muted/50 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> {item.trend}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground">{item.label}</p>
              <h3 className="text-3xl font-black">{item.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Growth Chart */}
        <div className="lg:col-span-8 bg-card border border-border p-8 rounded-[2.5rem] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              User Growth Trend
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.userGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tool Popularity */}
        <div className="lg:col-span-4 bg-card border border-border p-8 rounded-[2.5rem] shadow-sm space-y-6 flex flex-col">
          <h3 className="text-xl font-black flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Tool Popularity
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.topTools}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {stats.topTools.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-auto">
            {stats.topTools.map((tool: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs font-bold">{tool.name}</span>
                </div>
                <span className="text-xs font-black">{tool.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Growth Chart */}
        <div className="lg:col-span-12 bg-card border border-border p-8 rounded-[2.5rem] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Monthly Revenue Performance
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueHistory}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
