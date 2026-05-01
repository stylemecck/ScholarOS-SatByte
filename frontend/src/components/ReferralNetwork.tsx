import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowRight, Star, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Referral {
  _id: string;
  name: string;
  email: string;
  referralsCount: number;
  createdAt: string;
}

interface NetworkData {
  user: {
    name: string;
    referralCode: string;
    referralsCount: number;
  };
  referrals: Referral[];
}

const ReferralNetwork = () => {
  const [data, setData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/referrals/network`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch referral network:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNetwork();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!data) return null;

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-black tracking-tight">Social <span className="text-primary">Network</span></h3>
          <p className="text-sm text-muted-foreground font-medium">Track your influence and connections.</p>
        </div>
        <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xs font-black text-primary">{data.referrals.length} Direct Referrals</span>
        </div>
      </div>

      {/* Visual Graph Representation */}
      <div className="relative p-12 bg-white/5 rounded-[3rem] border border-white/5 overflow-hidden min-h-[400px] flex items-center justify-center">
        {/* Connection Lines (SVGs) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {data.referrals.map((_, i) => (
             <motion.line 
                key={i}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: i * 0.2 }}
                x1="50%" y1="50%" 
                x2={`${50 + 35 * Math.cos((2 * Math.PI * i) / data.referrals.length)}%`}
                y2={`${50 + 35 * Math.sin((2 * Math.PI * i) / data.referrals.length)}%`}
                stroke="currentColor" 
                strokeWidth="2"
                className="text-primary"
             />
          ))}
        </svg>

        {/* Central Node (User) */}
        <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative z-10 w-24 h-24 bg-primary rounded-full flex flex-col items-center justify-center shadow-2xl shadow-primary/40 border-4 border-background"
        >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-1">
                <Star className="text-white fill-white w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase text-white tracking-widest">YOU</span>
        </motion.div>

        {/* Referral Nodes */}
        {data.referrals.map((ref, i) => (
            <motion.div 
                key={ref._id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.5 }}
                style={{
                    position: 'absolute',
                    left: `${50 + 35 * Math.cos((2 * Math.PI * i) / data.referrals.length)}%`,
                    top: `${50 + 35 * Math.sin((2 * Math.PI * i) / data.referrals.length)}%`,
                    transform: 'translate(-50%, -50%)'
                }}
                className="group cursor-pointer"
            >
                <div className="relative">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all shadow-xl">
                        <span className="text-lg font-black text-white">{ref.name.charAt(0)}</span>
                    </div>
                    {/* Tooltip on hover */}
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none bg-background/90 border border-white/10 px-3 py-1.5 rounded-lg whitespace-nowrap shadow-2xl z-20">
                        <p className="text-[10px] font-black text-white leading-none">{ref.name}</p>
                        <p className="text-[8px] text-muted-foreground font-bold mt-1">{new Date(ref.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </motion.div>
        ))}
      </div>

      {/* List View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.referrals.map((ref, idx) => (
            <motion.div 
                key={ref._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 bg-card/40 backdrop-blur-md border border-white/10 rounded-3xl hover:border-primary/30 transition-all group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        {ref.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-black text-sm">{ref.name}</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Level 1 Referral</p>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase opacity-60">Connections</p>
                        <p className="text-xs font-black">{ref.referralsCount} Users</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg text-muted-foreground opacity-50">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReferralNetwork;
