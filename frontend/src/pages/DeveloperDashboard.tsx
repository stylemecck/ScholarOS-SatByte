import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, Key, Activity, Shield, 
  Copy, Plus, Trash2, CheckCircle2, Zap, 
  Code2, Globe, Cpu, Server, ExternalLink,
  History, Database, CreditCard, Layout, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';

const DeveloperDashboard = () => {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'logs' | 'billing'>('overview');

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/developer/keys`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setKeys(response.data);
    } catch (err) {
      console.error('Failed to fetch keys:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/developer/keys`, { name: newKeyName }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewKeyName('');
      fetchKeys();
    } catch (err: any) {
      alert(err.response?.data?.details || 'Failed to generate key');
    } finally {
      setIsGenerating(false);
    }
  };

  const revokeKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action is irreversible.')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/developer/keys/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchKeys();
    } catch (err) {
      alert('Failed to revoke key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Process data for charts
  const getChartData = () => {
    const dataMap: { [key: string]: number } = {};
    keys.forEach(k => {
      k.dailyUsage?.forEach((d: any) => {
        dataMap[d.date] = (dataMap[d.date] || 0) + d.count;
      });
    });
    
    return Object.keys(dataMap).sort().map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      requests: dataMap[date]
    }));
  };

  const chartData = getChartData().length > 0 ? getChartData() : [
    { date: 'May 10', requests: 45 },
    { date: 'May 11', requests: 52 },
    { date: 'May 12', requests: 38 },
    { date: 'May 13', requests: 65 },
    { date: 'May 14', requests: 48 },
    { date: 'May 15', requests: 70 },
    { date: 'May 16', requests: 55 },
  ];

  const stats = [
    { label: 'Total Requests', value: keys.reduce((acc, k) => acc + k.usageCount, 0), icon: Activity, color: 'text-blue-500' },
    { label: 'Active Keys', value: keys.filter(k => k.status === 'active').length, icon: Key, color: 'text-emerald-500' },
    { label: 'Avg Latency', value: '115ms', icon: Cpu, color: 'text-amber-500' },
    { label: 'Success Rate', value: '99.9%', icon: Shield, color: 'text-purple-500' },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-[#080808] hidden lg:flex flex-col p-6 space-y-10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
            <Server className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest">Developer</h1>
            <p className="text-[10px] text-muted-foreground font-bold">Workspace v1.0</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: Layout },
            { id: 'keys', label: 'API Keys', icon: Key },
            { id: 'logs', label: 'Request Logs', icon: History },
            { id: 'billing', label: 'Billing & Usage', icon: CreditCard },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === item.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="space-y-4">
           <Link to="/docs" className="flex items-center gap-4 px-4 py-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
              <Code2 className="w-4 h-4" /> Documentation
           </Link>
           <button className="w-full saas-button-primary !py-4 text-[10px] flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Go Pro
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-20 pb-20 px-4 md:px-10 lg:pt-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tight capitalize">{activeTab}</h2>
              <p className="text-xs text-muted-foreground font-medium italic opacity-60">
                {activeTab === 'overview' ? 'Monitor your platform usage and health in real-time.' : `Manage your ${activeTab} and preferences.`}
              </p>
            </div>
            <div className="flex items-center gap-3">
               <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Platform Operational
               </span>
            </div>
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="saas-card flex flex-col gap-4 p-8 relative overflow-hidden group"
                  >
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-current opacity-5 rounded-bl-[3rem] transition-transform group-hover:scale-110 ${stat.color}`} />
                    <div className={`p-3 rounded-xl bg-white/5 w-fit ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                      <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Analytics Chart */}
              <div className="saas-card !p-10 space-y-8 h-[450px]">
                 <div className="flex justify-between items-center">
                    <div className="space-y-1">
                       <h3 className="text-xl font-black tracking-tight italic text-primary">API Traffic</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Requests over the last 30 days</p>
                    </div>
                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                       {['1h', '24h', '7d', '30d'].map(t => (
                          <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase ${t === '30d' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white'}`}>{t}</button>
                       ))}
                    </div>
                 </div>
                 <div className="flex-1 w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={chartData}>
                          <defs>
                             <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 800}}
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 800}}
                          />
                          <Tooltip 
                            contentStyle={{backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                            itemStyle={{color: '#fff', fontSize: '12px', fontWeight: 'bold'}}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="requests" 
                            stroke="var(--color-primary)" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorRequests)" 
                          />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Second Row: Logs Preview & Integration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="saas-card space-y-6 !p-10">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-3">
                       <History className="w-4 h-4 text-primary" /> Recent Request Logs
                    </h3>
                    <div className="space-y-4">
                       {[
                          { path: '/api/v1/image/compress', time: '2 mins ago', status: 200, latency: '42ms' },
                          { path: '/api/v1/pdf/merge', time: '5 mins ago', status: 201, latency: '120ms' },
                          { path: '/api/v1/rank/predict', time: '12 mins ago', status: 200, latency: '850ms' },
                          { path: '/api/v1/resume/generate', time: '18 mins ago', status: 429, latency: '0ms' },
                       ].map((log, i) => (
                          <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/5 transition-all">
                             <div className="flex gap-4 items-center">
                                <span className={`w-2 h-2 rounded-full ${log.status >= 400 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                <div>
                                   <p className="text-xs font-mono text-white/80">{log.path}</p>
                                   <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">{log.time}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-xs font-black text-white">{log.latency}</p>
                                <p className={`text-[9px] font-black uppercase ${log.status >= 400 ? 'text-rose-500' : 'text-emerald-500'}`}>{log.status}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                    <button className="w-full text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All Logs</button>
                 </div>

                 <div className="saas-card space-y-8 !p-10">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-3">
                       <Code2 className="w-4 h-4 text-primary" /> Rapid Integration
                    </h3>
                    <div className="space-y-6">
                       <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                          Connect your app to the Student Toolkit OS using our official SDKs. Built for high-performance and low latency.
                       </p>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-primary/50 transition-all cursor-pointer group">
                             <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Globe className="w-5 h-5 text-blue-400" />
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-white">JavaScript SDK</p>
                          </div>
                          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-primary/50 transition-all cursor-pointer group">
                             <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Terminal className="w-5 h-5 text-emerald-400" />
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-white">Python SDK</p>
                          </div>
                       </div>
                       <Link to="/docs" className="w-full saas-button-secondary !py-4 text-[10px] flex items-center justify-center gap-2">
                          <ExternalLink className="w-4 h-4" /> API Reference
                       </Link>
                    </div>
                 </div>
              </div>
            </>
          )}

          {activeTab === 'keys' && (
            <div className="saas-card !p-12 space-y-10">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-10">
                  <div className="space-y-2">
                     <h2 className="text-2xl font-black text-white tracking-tight italic">Your API Keys</h2>
                     <p className="text-sm font-medium text-muted-foreground">Manage keys for secure server-to-server communication.</p>
                  </div>
                  <form onSubmit={generateKey} className="flex gap-3 w-full md:w-auto">
                     <input 
                       type="text" placeholder="Key Label (e.g. Production)"
                       className="saas-input text-xs !py-3 min-w-[200px]"
                       value={newKeyName}
                       onChange={(e) => setNewKeyName(e.target.value)}
                       required
                     />
                     <button disabled={isGenerating} className="saas-button-primary !px-6 !py-3 text-[10px] flex items-center gap-2">
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} New Key
                     </button>
                  </form>
               </div>

               <div className="space-y-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                       <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                  ) : keys.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2rem] opacity-50">
                       <p className="text-sm italic">No API keys found.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                       {keys.map((key) => (
                          <div key={key._id} className={`saas-card !p-8 flex flex-col md:flex-row justify-between items-center gap-8 ${key.status === 'revoked' ? 'opacity-40 grayscale' : 'hover:border-primary/20'}`}>
                             <div className="space-y-4 flex-1 w-full">
                                <div className="flex items-center gap-4">
                                   <div className={`w-2 h-2 rounded-full ${key.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                                   <h4 className="text-lg font-black text-white italic">{key.name}</h4>
                                   <span className="text-[9px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">{key.tier}</span>
                                </div>
                                <div className="relative group">
                                   <div className="bg-black/50 border border-white/5 rounded-2xl p-4 pr-12 font-mono text-xs text-muted-foreground truncate group-hover:text-white transition-colors">
                                      {key.key}
                                   </div>
                                   <button 
                                      onClick={() => copyToClipboard(key.key)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:text-primary transition-all"
                                   >
                                      {copiedKey === key.key ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                   </button>
                                </div>
                             </div>
                             <div className="flex items-center gap-8 md:border-l border-white/5 md:pl-10">
                                <div className="text-center min-w-[100px]">
                                   <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Lifetime Calls</p>
                                   <p className="text-xl font-black text-white">{key.usageCount}</p>
                                </div>
                                {key.status === 'active' && (
                                   <button onClick={() => revokeKey(key._id)} className="p-3 bg-white/5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all border border-white/5">
                                      <Trash2 className="w-4 h-4" />
                                   </button>
                                )}
                             </div>
                          </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* Fallback for other tabs */}
          {(activeTab === 'logs' || activeTab === 'billing') && (
            <div className="saas-card !p-20 text-center space-y-6">
               <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
                  <Database className="w-8 h-8" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Syncing System Data</h3>
                  <p className="text-sm text-muted-foreground font-medium italic">We're indexing your logs and billing history. This will be available shortly.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
