import { motion } from 'framer-motion';
import { Check, Zap, Star, ShieldCheck, ArrowRight, Loader2, Coffee } from 'lucide-react';
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
      navigate(`/login?redirect=${location.pathname}`);
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
    } catch (err: any) {
      console.error("PAYMENT INITIATION ERROR:", err);
      const errorMsg = err.response?.data?.details || err.response?.data?.error || "Failed to initiate payment. Please check your connection.";
      alert(errorMsg);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-20 px-4 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/20"
          >
            <Star className="w-3 h-3 fill-current" /> Simple, Transparent Pricing
          </motion.div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] uppercase">Invest in <br /><span className="text-primary italic">Your Success.</span></h1>
        <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto pt-4">Choose the fuel for your academic journey. Our one-time credit packs never expire and offer industrial-grade tools at student prices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Background glow for the whole grid */}
        <div className="absolute inset-0 bg-primary/5 blur-[150px] -z-10 rounded-full" />
        
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`
              relative p-10 rounded-[3rem] border transition-all duration-700 flex flex-col justify-between group
              ${plan.popular 
                ? 'bg-primary text-primary-foreground border-primary shadow-[0_20px_80px_rgba(59,130,246,0.3)] scale-105 z-10' 
                : 'bg-card/40 backdrop-blur-2xl border-white/5 hover:border-primary/30 shadow-2xl'}
            `}
          >
            {plan.popular && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-2xl animate-bounce">
                Most Popular
              </div>
            )}

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">{plan.name}</h3>
                  {plan.id === 'starter' ? <Coffee className="w-6 h-6 opacity-40" /> : plan.id === 'pro' ? <Zap className="w-6 h-6 opacity-40" /> : <Star className="w-6 h-6 opacity-40" />}
                </div>
                <p className={`text-sm font-medium leading-relaxed ${plan.popular ? 'text-white/80' : 'text-muted-foreground'}`}>{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter">₹{plan.price}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${plan.popular ? 'text-white/60' : 'text-muted-foreground opacity-50'}`}>One-Time</span>
              </div>

              <div className="space-y-4 pt-8 border-t border-white/10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 group/item">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${plan.popular ? 'bg-white/20' : 'bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-white'}`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm font-bold tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handlePayment(plan)}
              disabled={!!loading}
              className={`
                mt-12 w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300
                ${plan.popular 
                  ? 'bg-white text-primary hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/10' 
                  : 'bg-primary text-primary-foreground hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20'}
              `}
            >
              {loading === plan.id ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Unlock Now <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto space-y-12 py-20">
        <div className="text-center space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tight">Common <span className="text-primary italic">Questions</span></h2>
            <p className="text-muted-foreground font-medium">Everything you need to know about our credits system.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
                { q: "What are AI Credits?", a: "Credits are used for high-end features like Rank Prediction, Resume Analysis, and AI-driven study planning. PDF & Image tools are always free!" },
                { q: "Do credits expire?", a: "No! Once purchased, your credits stay in your account forever until you use them. No monthly pressure." },
                { q: "Can I upgrade later?", a: "Yes, you can purchase any pack at any time. Credits are cumulative and will be added to your existing balance." },
                { q: "Is the payment secure?", a: "We use Razorpay, India's leading payment gateway, ensuring military-grade encryption for all transactions." }
            ].map((faq, i) => (
                <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-3 hover:bg-white/10 transition-all">
                    <h4 className="font-black text-foreground uppercase tracking-widest text-xs flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" /> {faq.q}
                    </h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">{faq.a}</p>
                </div>
            ))}
        </div>
      </section>

      <div className="bg-gradient-to-br from-card/40 to-card/10 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-16 text-center space-y-8 max-w-5xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
        <div className="flex justify-center -space-x-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-16 h-16 rounded-full border-4 border-[#0a0a0a] bg-primary/20 overflow-hidden hover:translate-y-[-4px] transition-transform duration-300">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}`} alt="User" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <p className="text-2xl font-black">Join 10,000+ ambitious students worldwide.</p>
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
            </div>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] border-l border-white/10 pl-3">4.9/5 Student Rating</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-10 pt-10 border-t border-white/5">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            <ShieldCheck className="w-5 h-5 text-primary" /> Secure Razorpay Checkout
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            <Zap className="w-5 h-5 text-amber-500" /> Instant Access
          </div>
        </div>
      </div>

    </div>
  );
};

export default Pricing;
