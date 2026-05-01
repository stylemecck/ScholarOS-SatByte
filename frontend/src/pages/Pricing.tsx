import { motion } from 'framer-motion';
import { Check, Zap, Star, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 99,
      credits: 20,
      description: 'Perfect for a single exam season.',
      features: ['20 AI Credits', 'Rank & Percentile Prediction', 'Basic PDF Reports', '7-Day History'],
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Pro Success',
      price: 249,
      credits: 60,
      description: 'Most popular for serious aspirants.',
      features: ['60 AI Credits', 'Priority AI Support', 'Premium PDF Reports', 'Unlimited History', 'Ad-Free Experience'],
      color: 'indigo',
      popular: true
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: 499,
      credits: 150,
      description: 'Complete toolkit for all entrances.',
      features: ['150 AI Credits', 'Resume Builder Pro', 'All Study Planner Tools', 'Lifetime History', 'Direct WhatsApp Support'],
      color: 'amber'
    }
  ];

  const handlePayment = async (plan: any) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(plan.id);
    try {
      const orderRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/create-order`, {
        amount: plan.price,
        credits: plan.credits
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "STP PRO",
        description: `Purchasing ${plan.name} Pack`,
        order_id: orderRes.data.id,
        handler: async (response: any) => {
          try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/verify`, {
              ...response,
              credits: plan.credits
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert("Payment successful! Credits added to your account.");
            navigate('/dashboard');
          } catch (err) {
            console.error(err);
            alert("Verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3b82f6",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-20 px-4 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-5xl font-black tracking-tight">Invest in your <span className="text-primary">Future</span></h1>
        <p className="text-lg text-muted-foreground font-medium">Choose a plan that powers your academic success with AI-driven insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`
              relative p-8 rounded-[3rem] border transition-all duration-500 flex flex-col justify-between
              ${plan.popular 
                ? 'bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/30 scale-105 z-10' 
                : 'bg-card/40 backdrop-blur-md border-white/10 hover:border-white/20 shadow-xl'}
            `}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-primary text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                Most Popular
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black">{plan.name}</h3>
                <p className={`text-sm ${plan.popular ? 'opacity-80' : 'text-muted-foreground'} font-medium`}>{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">₹{plan.price}</span>
                <span className={`text-xs ${plan.popular ? 'opacity-70' : 'text-muted-foreground'} font-bold uppercase tracking-widest`}>One-time</span>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${plan.popular ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handlePayment(plan)}
              disabled={!!loading}
              className={`
                mt-10 w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all
                ${plan.popular 
                  ? 'bg-white text-primary hover:bg-white/90' 
                  : 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20'}
              `}
            >
              {loading === plan.id ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Get Started <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/5 rounded-[3rem] p-12 text-center space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-center -space-x-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-12 h-12 rounded-full border-4 border-[#0a0a0a] bg-primary/20 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-lg font-bold">Join 5,000+ students predicting their future.</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />)}
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-2">4.9/5 Rating</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            <ShieldCheck className="w-4 h-4" /> Secure Checkout
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            <Zap className="w-4 h-4" /> Instant Activation
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
