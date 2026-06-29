import { motion } from 'framer-motion';
import { Activity, Server, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';
import { useEffect, useState } from 'react';

const Status = () => {
  const [uptime] = useState("99.98%");
  const [latency, setLatency] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(30, Math.min(60, prev + (Math.random() > 0.5 ? 2 : -2))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    { name: "Global Auth API", status: "Operational", uptime: "100%", latency: "24ms", icon: <ShieldCheck className="w-5 h-5" /> },
    { name: "Rank Predictor Engine", status: "Operational", uptime: "99.9%", latency: "142ms", icon: <Cpu className="w-5 h-5" /> },
    { name: "PDF Processing Core", status: "Operational", uptime: "99.7%", latency: "210ms", icon: <Server className="w-5 h-5" /> },
    { name: "Image Optimization API", status: "Operational", uptime: "100%", latency: "85ms", icon: <Zap className="w-5 h-5" /> },
    { name: "CDN Edge Nodes", status: "Operational", uptime: "100%", latency: "12ms", icon: <Globe className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 space-y-12">
      <div className="text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
        >
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">All Systems Operational</span>
        </motion.div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
          System <span className="text-primary italic">Pulse</span>
        </h1>
        <p className="text-muted-foreground font-medium text-lg max-w-xl mx-auto">
          Real-time health monitoring and performance metrics for the ScholarOS ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-card border border-border rounded-[3rem] space-y-4 shadow-xl"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Overall Uptime</p>
          <p className="text-5xl font-black tracking-tight text-white">{uptime}</p>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="w-[99%] h-full bg-emerald-500" />
          </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-card border border-border rounded-[3rem] space-y-4 shadow-xl"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">API Latency</p>
          <p className="text-5xl font-black tracking-tight text-white">{latency}<span className="text-lg ml-1 opacity-40">ms</span></p>
          <div className="flex items-end gap-1 h-8">
            {[4, 6, 8, 5, 9, 12, 10, 8, 11, 14, 12].map((h, i) => (
                <div key={i} className="flex-grow bg-primary/20 rounded-full" style={{ height: `${h * 6}%` }} />
            ))}
          </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-card border border-border rounded-[3rem] space-y-4 shadow-xl"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Queries</p>
          <p className="text-5xl font-black tracking-tight text-white">4,812</p>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Real-time Traffic</span>
          </div>
        </motion.div>
      </div>

      <div className="bg-card border border-border rounded-[4rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-border bg-muted/30">
          <h3 className="text-xl font-black uppercase tracking-widest">Individual Services</h3>
        </div>
        <div className="divide-y divide-border">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 flex items-center justify-between group hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  {service.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold tracking-tight">{service.name}</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{service.status}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-12 text-right hidden md:flex">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Uptime</p>
                  <p className="font-bold">{service.uptime}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Latency</p>
                  <p className="font-bold text-primary">{service.latency}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Status;
