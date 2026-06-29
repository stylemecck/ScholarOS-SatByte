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
      alert('✅ All settings saved successfully!');
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save settings.';
      alert(`❌ Error: ${errorMessage}`);
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
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <ShieldCheck className="w-4 h-4" /> Admin Access Only
          </div>
          <h1 className="text-4xl font-black tracking-tight">Platform <span className="text-primary">Analytics</span></h1>
          <p className="text-muted-foreground font-medium">Overview of ScholarOS performance and growth.</p>
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
      </div>

      {/* Site Settings Section */}
      <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-black flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Site Configuration
            </h3>
            <p className="text-sm text-muted-foreground font-medium">Manage global scripts, ads, and platform-wide settings.</p>
          </div>
          <button 
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
            Save All Settings
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AdSense / Script Injection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Ads & Scripts (Header)</label>
              <span className="text-[8px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full uppercase">Google AdSense</span>
            </div>
            <textarea 
              value={settings.adsCode}
              onChange={(e) => setSettings({ ...settings, adsCode: e.target.value })}
              placeholder="Paste your <script> tags here for AdSense, Analytics, or other tracking tools..."
              className="w-full h-48 bg-muted/30 border border-border rounded-2xl p-4 text-xs font-mono focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
            />
            <p className="text-[10px] text-muted-foreground italic">Code injected here will be placed in the &lt;head&gt; of all pages.</p>
          </div>

          {/* Other Settings */}
          <div className="space-y-6">
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Global Announcement Bar</label>
                <input 
                    type="text"
                    value={settings.announcement}
                    onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                    placeholder="E.g. New PDF compression engine is now live!"
                    className="w-full bg-muted/30 border border-border rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Adsterra Smartlink</label>
                <input 
                  type="text"
                  value={settings.adsterraSmartlink}
                  onChange={(e) => setSettings({ ...settings, adsterraSmartlink: e.target.value })}
                  placeholder="Paste Smartlink URL..."
                  className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Adsterra Popunder</label>
                <input 
                  type="text"
                  value={settings.adsterraPopunder}
                  onChange={(e) => setSettings({ ...settings, adsterraPopunder: e.target.value })}
                  placeholder="Paste Popunder Script..."
                  className="w-full bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Adsterra Social Bar (Script)</label>
              <textarea 
                value={settings.adsterraSocialBar}
                onChange={(e) => setSettings({ ...settings, adsterraSocialBar: e.target.value })}
                placeholder="Paste Social Bar script here..."
                className="w-full h-20 bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Adsterra Native Banner (Script)</label>
              <textarea 
                value={settings.adsterraNativeBanner}
                onChange={(e) => setSettings({ ...settings, adsterraNativeBanner: e.target.value })}
                placeholder="Paste Native Banner code here..."
                className="w-full h-24 bg-muted/30 border border-border rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Google Search Console Verification</label>
                <input 
                    type="text"
                    value={settings.googleVerification}
                    onChange={(e) => setSettings({ ...settings, googleVerification: e.target.value })}
                    placeholder="Paste the 'content' value from your verification tag here..."
                    className="w-full bg-muted/30 border border-border rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                />
            </div>
            <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary">Admin Warning</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Changes made here take effect immediately for all visitors. Be extremely careful when pasting script tags as malformed code can break the entire frontend application.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
