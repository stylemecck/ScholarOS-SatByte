import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ArrowRight, Star, Loader2, Network, UserPlus } from 'lucide-react';
import axios from 'axios';

interface Referral {
  _id: string;
  name: string;
  email: string;
  referralsCount: number;
  createdAt: string;
  subNetwork?: Referral[];
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
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

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
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-black tracking-tight">Social <span className="text-primary">Graph</span></h3>
          <p className="text-sm text-muted-foreground font-medium">Visualizing your multi-level academic network.</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Master Node</span>
            </div>
            <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 flex items-center gap-2">
                <Network className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{data.referrals.length} Connections</span>
            </div>
        </div>
      </div>

      {/* Interactive Network Visualization */}
      <div className="relative p-20 bg-white/5 rounded-[4rem] border border-white/5 overflow-hidden min-h-[600px] flex items-center justify-center shadow-2xl">
        {/* Connection Lines Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {data.referrals.map((ref, i) => {
            const x1 = 50;
            const y1 = 50;
            const x2 = 50 + 30 * Math.cos((2 * Math.PI * i) / data.referrals.length);
            const y2 = 50 + 30 * Math.sin((2 * Math.PI * i) / data.referrals.length);

            return (
              <g key={ref._id}>
                <motion.line 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.1 }}
                  x1={`${x1}%`} y1={`${y1}%`} 
                  x2={`${x2}%`} y2={`${y2}%`}
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="text-primary"
                />
                
                {/* Level 2 lines */}
                {ref.subNetwork?.map((sub, j) => {
                    const angle = (2 * Math.PI * i) / data.referrals.length;
                    const subAngle = angle + (j - (ref.subNetwork!.length - 1) / 2) * 0.3;
                    const sx2 = x2 + 15 * Math.cos(subAngle);
                    const sy2 = y2 + 15 * Math.sin(subAngle);

                    return (
                        <motion.line 
                            key={sub._id}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 1 + i * 0.1 + j * 0.05 }}
                            x1={`${x2}%`} y1={`${y2}%`} 
                            x2={`${sx2}%`} y2={`${sy2}%`}
                            stroke="currentColor" 
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            className="text-white/40"
                        />
                    );
                })}
              </g>
            );
          })}
        </svg>

        {/* Central Node (User) */}
        <motion.div 
            whileHover={{ scale: 1.1 }}
            className="relative z-20 w-28 h-28 bg-primary rounded-[2rem] flex flex-col items-center justify-center shadow-2xl shadow-primary/40 border-4 border-background"
        >
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-1">
                <Star className="text-white fill-white w-7 h-7" />
            </div>
            <span className="text-[10px] font-black uppercase text-white tracking-widest">YOU</span>
        </motion.div>

        {/* Level 1 Nodes */}
        {data.referrals.map((ref, i) => {
            const x = 50 + 30 * Math.cos((2 * Math.PI * i) / data.referrals.length);
            const y = 50 + 30 * Math.sin((2 * Math.PI * i) / data.referrals.length);

            return (
                <div key={ref._id}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 + 0.5 }}
                        style={{
                            position: 'absolute',
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)'
                        }}
                        className="group z-10"
                        onMouseEnter={() => setSelectedNode(ref._id)}
                        onMouseLeave={() => setSelectedNode(null)}
                    >
                        <div className="relative">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:scale-110 transition-all shadow-xl">
                                <span className="text-xl font-black text-white group-hover:text-primary-foreground">{ref.name.charAt(0)}</span>
                            </div>
                            
                            {/* Hover Details Card */}
                            <AnimatePresence>
                                {selectedNode === ref._id && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -bottom-24 left-1/2 -translate-x-1/2 bg-background/95 border border-white/10 p-4 rounded-2xl shadow-2xl z-30 min-w-[160px]"
                                    >
                                        <p className="text-xs font-black text-white">{ref.name}</p>
                                        <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter">Level 1 Referral</p>
                                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                                            <span className="text-[9px] font-black text-primary uppercase">Referrals</span>
                                            <span className="text-xs font-black">{ref.referralsCount}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Level 2 Nodes */}
                    {ref.subNetwork?.map((sub, j) => {
                        const angle = (2 * Math.PI * i) / data.referrals.length;
                        const subAngle = angle + (j - (ref.subNetwork!.length - 1) / 2) * 0.3;
                        const sx = x + 15 * Math.cos(subAngle);
                        const sy = y + 15 * Math.sin(subAngle);

                        return (
                            <motion.div 
                                key={sub._id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 + i * 0.1 + j * 0.05 }}
                                style={{
                                    position: 'absolute',
                                    left: `${sx}%`,
                                    top: `${sy}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                                className="w-8 h-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg flex items-center justify-center shadow-lg group hover:bg-white/20 transition-all"
                            >
                                <span className="text-[10px] font-black text-white/60 group-hover:text-white">{sub.name.charAt(0)}</span>
                            </motion.div>
                        );
                    })}
                </div>
            );
        })}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-8 bg-card/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Level 1 Direct</p>
                <h4 className="text-3xl font-black">{data.referrals.length}</h4>
            </div>
         </div>
         <div className="p-8 bg-card/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] space-y-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                <Network className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Level 2 Indirect</p>
                <h4 className="text-3xl font-black">
                    {data.referrals.reduce((acc, curr) => acc + (curr.subNetwork?.length || 0), 0)}
                </h4>
            </div>
         </div>
         <div className="p-8 bg-primary text-primary-foreground rounded-[2.5rem] space-y-4 shadow-xl shadow-primary/20">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase opacity-70">Total Reach</p>
                <h4 className="text-3xl font-black">
                    {data.referrals.length + data.referrals.reduce((acc, curr) => acc + (curr.subNetwork?.length || 0), 0)}
                </h4>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ReferralNetwork;
