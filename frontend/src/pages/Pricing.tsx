import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Zap, ShieldCheck, CreditCard, 
  Sparkles, Star, Loader2, Coins 
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

const Pricing = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 10,
      price: 49,
      description: 'Perfect for a single exam season.',
      features: ['10 AI Credits', 'Rank Prediction', 'Marks vs Percentile', '24/7 Access'],
      color: 'blue'
    },
    {
      id: 'popular',
      name: 'Scholar Pro',
      credits: 50,
      price: 199,
      description: 'The most popular choice for serious aspirants.',
      features: ['50 AI Credits', 'Priority AI Processing', 'Detailed Roadmaps', 'Saved Analysis History'],
      color: 'primary',
      popular: true
    },
    {
      id: 'ultimate',
      name: 'Ultimate Toolkit',
      credits: 200,
      price: 499,
      description: 'Complete academic support for the year.',
      features: ['200 AI Credits', 'Unlimited Document Parsing', 'Early Access to Tools', 'Premium Templates'],
      color: 'indigo'
    }
  ];

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (plan: any) => {
    if (!user) {
      alert("Please login to purchase credits.");
      return;
    }

    setLoading(plan.id);
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(null);
      return;
    }

    try {
      // 1. Create order on backend
      const orderRes = await axios.post('http://localhost:5000/api/payments/create-order', {
        amount: plan.price,
        credits: plan.credits
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const { amount, id: order_id, currency } = orderRes.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use Environment Variable
        amount: amount.toString(),
        currency: currency,
        name: "Student Toolkit Pro",
        description: `Purchase ${plan.credits} AI Credits`,
        order_id: order_id,
        handler: async (response: any) => {
          try {
            const verifyRes = await axios.post('http://localhost:5000/api/payments/verify-payment', {
              ...response,
              credits: plan.credits
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (verifyRes.data.message) {
              alert("Payment Successful! Credits added to your account.");
              window.location.href = '/dashboard';
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed. If amount was deducted, please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#8b5cf6",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-20 px-4 space-y-16">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest"
        >
          <Coins className="w-4 h-4" />
          Pricing Plans
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">Supercharge your <span className="text-primary">Academic Journey</span></h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Purchase credits to unlock high-precision AI predictions, detailed roadmaps, and professional resume enhancements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: plan.id === 'starter' ? 0.1 : plan.id === 'popular' ? 0.2 : 0.3 }}
            className={`relative flex flex-col p-8 rounded-[3rem] border transition-all ${
              plan.popular 
                ? 'bg-card border-primary shadow-2xl shadow-primary/20 scale-105 z-10' 
                : 'bg-card border-border shadow-lg hover:border-primary/30'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-2 shadow-lg">
                <Star className="w-3.5 h-3.5" /> Most Popular
              </div>
            )}

            <div className="space-y-4 mb-8">
              <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
              <p className="text-sm text-muted-foreground font-medium">{plan.description}</p>
              <div className="pt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black">₹{plan.price}</span>
                <span className="text-muted-foreground font-bold">/ {plan.credits} credits</span>
              </div>
            </div>

            <div className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-medium text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handlePayment(plan)}
              disabled={loading !== null}
              className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                plan.popular
                  ? 'bg-primary text-primary-foreground hover:shadow-primary/25 hover:-translate-y-1'
                  : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              {loading === plan.id ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
              ) : (
                <><Zap className="w-5 h-5" /> Buy {plan.credits} Credits</>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-8 pt-12 border-t border-border opacity-60">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> Secure Payments
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <CreditCard className="w-4 h-4" /> All Cards Accepted
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> AI Powered Analysis
        </div>
      </div>
    </div>
  );
};

export default Pricing;
