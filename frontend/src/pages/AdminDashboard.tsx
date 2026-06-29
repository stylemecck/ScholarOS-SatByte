import { toast } from '../lib/toast';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, DollarSign, Zap, BarChart3, TrendingUp, 
  ArrowUpRight, Loader2, ShieldCheck, LayoutDashboard,
  Search, History, Database, ArrowLeft, RefreshCw
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
  
  // Dashboard Section Tabs
  const [activeSection, setActiveSection] = useState<'analytics' | 'users' | 'settings'>('analytics');

  // Platform Analytics State
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Users Directory & Activity State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Site Configuration State
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<{
    adsCode: string;
    announcement: string;
    googleVerification: string;
    adsterraSmartlink: string;
    adsterraSocialBar: string;
    adsterraNativeBanner: string;
    adsterraPopunder: string;
  }>({
    adsCode: '',
    announcement: '',
    googleVerification: '',
    adsterraSmartlink: '',
    adsterraSocialBar: '',
    adsterraNativeBanner: '',
    adsterraPopunder: ''
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
      fetchSettings();
    }
  }, [user]);

  // Load users directory when section is opened
  useEffect(() => {
    if (user?.role === 'admin' && activeSection === 'users') {
      fetchUsers();
    }
  }, [activeSection, user]);

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

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`);
      setSettings({
        adsCode: response.data.adsCode || '',
        announcement: response.data.announcement || '',
        googleVerification: response.data.googleVerification || '',
        adsterraSmartlink: response.data.adsterraSmartlink || '',
        adsterraSocialBar: response.data.adsterraSocialBar || '',
        adsterraNativeBanner: response.data.adsterraNativeBanner || '',
        adsterraPopunder: response.data.adsterraPopunder || ''
      });
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsersList(response.data);
    } catch (err: any) {
      console.error("Failed to fetch admin users directory:", err);
      toast.error("Failed to load users directory.");
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    setDetailsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSelectedUserDetails(response.data);
    } catch (err: any) {
      console.error("Failed to fetch admin user details:", err);
      toast.error("Failed to load user details and activities.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/settings`, { key: 'adsCode', value: settings.adsCode }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await axios.post(`${import.meta.env.VITE_API_URL}/api/settings`, { key: 'announcement', value: settings.announcement }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await axios.post(`${import.meta.env.VITE_API_URL}/api/settings`, { key: 'googleVerification', value: settings.googleVerification }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await axios.post(`${import.meta.env.VITE_API_URL}/api/settings`, { key: 'adsterraSmartlink', value: settings.adsterraSmartlink }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await axios.post(`${import.meta.env.VITE_API_URL}/api/settings`, { key: 'adsterraSocialBar', value: settings.adsterraSocialBar }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await axios.post(`${import.meta.env.VITE_API_URL}/api/settings`, { key: 'adsterraNativeBanner', value: settings.adsterraNativeBanner }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await axios.post(`${import.meta.env.VITE_API_URL}/api/settings`, { key: 'adsterraPopunder', value: settings.adsterraPopunder }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('All settings saved successfully!');
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save settings.';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setSaving(false);
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
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-10 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <ShieldCheck className="w-4 h-4" /> Admin Controls & Audit
          </div>
          <h1 className="text-4xl font-black tracking-tight">System <span className="text-primary">Console</span></h1>
          <p className="text-muted-foreground font-medium">Manage server configurations, audit transactions, and review analytics.</p>
        </div>
        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold bg-muted px-5 py-2.5 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
          <LayoutDashboard className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      {/* Navigation Section Tabs */}
      <div className="flex border-b border-border/60 pb-1 gap-2 overflow-x-auto shrink-0">
        {[
          { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
          { id: 'users', label: 'Users & Activity Audit', icon: Users },
          { id: 'settings', label: 'Site Configuration', icon: ShieldCheck }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSection(tab.id as any);
              setSelectedUserDetails(null);
            }}
            className={`flex items-center gap-2.5 px-6 py-3 border-b-2 font-bold text-sm tracking-tight transition-all duration-300 whitespace-nowrap ${
              activeSection === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── SECTION 1: Platform Analytics ── */}
      {activeSection === 'analytics' && (
        <div className="space-y-10 animate-fadeIn">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', trend: 'Active' },
              { label: 'Est. Revenue', value: `₹${Math.round(stats.totalRevenue)}`, icon: DollarSign, color: 'text-emerald-500', trend: 'Growth' },
              { label: 'AI Requests', value: stats.totalAIRequests, icon: Zap, color: 'text-amber-500', trend: 'Usage' },
              { label: 'Top Tool', value: stats.topTools[0]?.name.split(' ')[0] || 'N/A', icon: TrendingUp, color: 'text-purple-500', trend: 'Popular' },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border p-6 rounded-[2rem] shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-2xl bg-muted/50 ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full flex items-center gap-1">
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

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* User Growth Chart */}
            <div className="lg:col-span-8 bg-card border border-border p-8 rounded-[2.5rem] shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  User Registration Growth
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

            {/* Tool Popularity Pie Chart */}
            <div className="lg:col-span-4 bg-card border border-border p-8 rounded-[2.5rem] shadow-sm space-y-6 flex flex-col">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Tool Executions
              </h3>
              <div className="h-[200px] w-full my-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.topTools}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
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
              <div className="space-y-2 mt-auto">
                {stats.topTools.map((tool: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs font-bold">{tool.name}</span>
                    </div>
                    <span className="text-xs font-black">{tool.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 2: Users & Activity Audit ── */}
      {activeSection === 'users' && (
        <div className="animate-fadeIn">
          {!selectedUserDetails ? (
            /* User Listing View */
            <div className="bg-card border border-border p-6 sm:p-8 rounded-[2.5rem] shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Users Directory
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium">Verify credentials, remaining credits, and plans for all accounts.</p>
                </div>
                
                {/* Search & Refresh Options */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full bg-muted/40 border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <button 
                    onClick={fetchUsers} 
                    className="p-2.5 bg-muted hover:bg-primary hover:text-primary-foreground rounded-xl transition-all shrink-0 flex items-center justify-center"
                    title="Refresh user data"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {usersLoading ? (
                <div className="py-24 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="text-sm font-bold text-slate-400">Loading user accounts directory...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-border/40 text-[10px] uppercase font-black tracking-widest text-muted-foreground/80">
                        <th className="pb-4 pt-2 pl-4">Account Owner</th>
                        <th className="pb-4 pt-2">System Role</th>
                        <th className="pb-4 pt-2">Subscription Plan</th>
                        <th className="pb-4 pt-2">Remaining Balance</th>
                        <th className="pb-4 pt-2">Joined Date</th>
                        <th className="pb-4 pt-2 text-right pr-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-sm">
                      {usersList
                        .filter(u => 
                          u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((userItem) => (
                          <tr key={userItem._id} className="hover:bg-muted/10 transition-colors">
                            <td className="py-4 pl-4 font-bold flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-purple-600 p-0.5 shrink-0">
                                <div className="w-full h-full rounded-[0.5rem] bg-background flex items-center justify-center text-xs font-black text-foreground overflow-hidden">
                                  {userItem.avatar ? <img src={userItem.avatar} className="w-full h-full object-cover" /> : userItem.name.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div>
                                <span className="block text-foreground leading-tight">{userItem.name}</span>
                                <span className="block text-[11px] text-muted-foreground/80 font-medium leading-normal">{userItem.email}</span>
                              </div>
                            </td>
                            <td className="py-4">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                userItem.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted/60 text-muted-foreground'
                              }`}>
                                {userItem.role}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                userItem.plan === 'Enterprise' ? 'bg-purple-500/20 text-purple-400' :
                                userItem.plan === 'Pro' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-yellow-500/10 text-yellow-500'
                              }`}>
                                {userItem.plan || 'Free'}
                              </span>
                            </td>
                            <td className="py-4 font-black text-foreground">{userItem.credits} CR</td>
                            <td className="py-4 text-xs font-semibold text-muted-foreground">
                              {new Date(userItem.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="py-4 text-right pr-4">
                              <button
                                onClick={() => fetchUserDetails(userItem._id)}
                                className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all"
                              >
                                View Activity
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* Selected User Audit View */
            <div className="space-y-8 animate-fadeIn">
              
              {/* Profile Overview Card */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border p-8 rounded-[2rem] shadow-sm">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedUserDetails(null)}
                    className="p-3 bg-muted/60 hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-black text-foreground leading-none">{selectedUserDetails.name}</h3>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        selectedUserDetails.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {selectedUserDetails.role}
                      </span>
                    </div>
                    <span className="block text-sm text-muted-foreground font-medium leading-none">{selectedUserDetails.email}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="bg-muted/50 border border-border/40 px-5 py-3 rounded-2xl text-center">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Remaining Credits</span>
                    <span className="block text-xl font-black text-[#FACC15]">{selectedUserDetails.credits} CR</span>
                  </div>
                  <div className="bg-muted/50 border border-border/40 px-5 py-3 rounded-2xl text-center">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">SaaS Tier Plan</span>
                    <span className="block text-xl font-black text-primary">{selectedUserDetails.plan || 'Free'}</span>
                  </div>
                  <div className="bg-muted/50 border border-border/40 px-5 py-3 rounded-2xl text-center">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Account Created</span>
                    <span className="block text-xs font-black text-slate-300 mt-1">
                      {new Date(selectedUserDetails.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transaction Logs vs Activity Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Credit Event Logger */}
                <div className="lg:col-span-7 bg-card border border-border p-8 rounded-[2.5rem] shadow-sm space-y-6">
                  <h3 className="text-lg font-black flex items-center gap-2.5 text-foreground">
                    <History className="w-5 h-5 text-primary" />
                    Credit Ledger History
                  </h3>
                  
                  {detailsLoading ? (
                    <div className="py-24 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                  ) : !selectedUserDetails.creditHistory || selectedUserDetails.creditHistory.length === 0 ? (
                    <div className="py-16 text-center text-muted-foreground font-medium bg-muted/10 rounded-3xl border border-dashed border-border/40">
                      No transaction entries found for this account.
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
                      {selectedUserDetails.creditHistory
                        .slice()
                        .reverse()
                        .map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-4 bg-muted/10 border border-border/20 rounded-2xl hover:border-border transition-colors">
                            <div className="space-y-1">
                              <span className="block font-bold text-foreground text-sm">{item.description || 'Credit allocation event'}</span>
                              <span className="block text-[10px] text-muted-foreground/80 font-medium">
                                {new Date(item.date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className={`block font-black text-base ${
                                item.type === 'added' || item.type === 'bonus' ? 'text-emerald-400' : 'text-rose-400'
                              }`}>
                                {item.type === 'added' || item.type === 'bonus' ? '+' : '-'}{item.amount} CR
                              </span>
                              <span className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{item.type}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Saved Actions & Profiles */}
                <div className="lg:col-span-5 space-y-8">
                  
                  {/* Additional Metadata Card */}
                  <div className="bg-card border border-border p-6 rounded-[2rem] shadow-sm space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Account System Details</h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs font-medium">
                      <div>
                        <span className="block text-[10px] text-muted-foreground font-bold uppercase">Google Account</span>
                        <span className="font-bold text-foreground">{selectedUserDetails.isGoogleUser ? 'Connected' : 'Credentials'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-muted-foreground font-bold uppercase">Referral Code</span>
                        <span className="font-bold text-foreground">{selectedUserDetails.referralCode || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-muted-foreground font-bold uppercase">Referrals Driven</span>
                        <span className="font-bold text-foreground">{selectedUserDetails.referralsCount || 0} user registrations</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-muted-foreground font-bold uppercase">Contact Number</span>
                        <span className="font-bold text-foreground">{selectedUserDetails.phoneNumber || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Saved Results Audit */}
                  <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm space-y-6">
                    <h3 className="text-lg font-black flex items-center gap-2.5 text-foreground">
                      <Database className="w-5 h-5 text-amber-500" />
                      Saved Outputs History
                    </h3>

                    {detailsLoading ? (
                      <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                    ) : !selectedUserDetails.savedResults || selectedUserDetails.savedResults.length === 0 ? (
                      <div className="py-12 text-center text-muted-foreground font-medium bg-muted/10 rounded-2xl border border-dashed border-border/40">
                        No saved calculations or records.
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
                        {selectedUserDetails.savedResults
                          .slice()
                          .reverse()
                          .map((res: any, idx: number) => (
                            <div key={idx} className="p-4 bg-muted/10 border border-border/20 rounded-2xl space-y-2 hover:border-border transition-colors">
                              <div className="flex justify-between items-center">
                                <span className="font-black text-foreground text-xs uppercase tracking-wide">{res.toolName}</span>
                                <span className="text-[10px] text-muted-foreground font-semibold">{new Date(res.date).toLocaleDateString()}</span>
                              </div>
                              {res.data && typeof res.data === 'object' && (
                                <pre className="bg-black/25 p-3 rounded-xl font-mono text-[9px] max-h-24 overflow-y-auto text-slate-400 border border-border/10">
                                  {JSON.stringify(res.data, null, 2)}
                                </pre>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          )}
        </div>
      )}

      {/* ── SECTION 3: Site Configuration ── */}
      {activeSection === 'settings' && (
        <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm space-y-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-black flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Global Platform Script Configuration
              </h3>
              <p className="text-sm text-muted-foreground font-medium">Manage script injection layers, verification codes, and global headers.</p>
            </div>
            <button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              Save Configuration
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Header Injection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Global Script Header Injector</label>
                <span className="text-[8px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full uppercase">Google AdSense</span>
              </div>
              <textarea 
                value={settings.adsCode}
                onChange={(e) => setSettings({ ...settings, adsCode: e.target.value })}
                placeholder="Paste code elements (e.g. AdSense tags, Tag Manager scripts) here..."
                className="w-full h-56 bg-muted/30 border border-border rounded-2xl p-4 text-xs font-mono focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              />
              <p className="text-[10px] text-muted-foreground italic">Inserted immediately before the final &lt;/head&gt; element of all rendered assets.</p>
            </div>

            {/* Details Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Global Announcement Banner Content</label>
                <input 
                  type="text"
                  value={settings.announcement}
                  onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                  placeholder="Leave blank to disable global warning banner..."
                  className="w-full bg-muted/30 border border-border rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Adsterra Smartlink Endpoint</label>
                  <input 
                    type="text"
                    value={settings.adsterraSmartlink}
                    onChange={(e) => setSettings({ ...settings, adsterraSmartlink: e.target.value })}
                    placeholder="Enter Smartlink URL..."
                    className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Adsterra Popunder Script</label>
                  <input 
                    type="text"
                    value={settings.adsterraPopunder}
                    onChange={(e) => setSettings({ ...settings, adsterraPopunder: e.target.value })}
                    placeholder="Enter Popunder endpoint script..."
                    className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Adsterra Social Bar Script</label>
                <textarea 
                  value={settings.adsterraSocialBar}
                  onChange={(e) => setSettings({ ...settings, adsterraSocialBar: e.target.value })}
                  placeholder="Paste Adsterra Social Bar scripts here..."
                  className="w-full h-20 bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Adsterra Native Banner Script</label>
                <textarea 
                  value={settings.adsterraNativeBanner}
                  onChange={(e) => setSettings({ ...settings, adsterraNativeBanner: e.target.value })}
                  placeholder="Paste Native Banner scripts here..."
                  className="w-full h-20 bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Google Search Console Tag Content</label>
                <input 
                  type="text"
                  value={settings.googleVerification}
                  onChange={(e) => setSettings({ ...settings, googleVerification: e.target.value })}
                  placeholder="Paste search console google-site-verification token..."
                  className="w-full bg-muted/30 border border-border rounded-xl p-4 text-xs font-mono focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FACC15]">Configuration Safe Warning</h4>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Modifications apply live in real-time across the client application. Verify tags are correct to avoid styling crashes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
