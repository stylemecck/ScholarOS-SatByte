import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Zap, Gift, Ticket
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '../lib/toast';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  const [alertMessage, setAlertMessage] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    text: string;
  } | null>(null);

  // Billing history mock logs
  const invoices = [
    { id: 'INV-2026-06', date: '2026-06-25', plan: 'Pro Monthly', amount: '₹299', status: 'Paid' },
    { id: 'INV-2026-05', date: '2026-05-25', plan: 'Pro Monthly', amount: '₹299', status: 'Paid' }
  ];
 
  const plans = [
    {
      name: 'Free',
      tagline: 'Ideal for basic study tools',
      price: { monthly: 0, yearly: 0 },
      features: [
        '20 AI Assistant messages / day',
        'Standard ATS Resume check',
        'Up to 10MB file uploads limit',
        'Basic study planners tracking',
        '2 Mock Interviews total'
      ],
      button: 'Get Started',
      pro: false
    },
    {
      name: 'Pro',
      tagline: 'Perfect for regular academic prep',
      price: { monthly: 299, yearly: 2990 },
      features: [
        'Unlimited AI chat queries',
        'Advanced ATS optimization checker',
        'AI Cover Letter generator',
        'Unlimited Interview practice rounds',
        'Up to 50MB documents size'
      ],
      button: 'Upgrade to Pro',
      pro: true,
      popular: true
    },
    {
      name: 'Ultimate',
      tagline: 'Best for placements & career pathing',
      price: { monthly: 799, yearly: 7990 },
      features: [
        'Unlimited Pro features access',
        'Speech analysis voice prep',
        'AI Career Advisor suggestions',
        'Dual-PDF document comparisons',
        'Weekly analytics metrics dashboards'
      ],
      button: 'Upgrade to Ultimate',
      pro: true
    }
  ];

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'SCHOLAR50') {
      setDiscountPercent(50);
      setCouponApplied(true);
      toast.success('Coupon Applied: 50% discount on first invoice!');
    } else {
      toast.error('Invalid Coupon Code');
    }
  };

  const handlePayment = async (planName: string, basePrice: number) => {
    if (planName === 'Free') {
      if (user) {
        setAlertMessage({
          type: 'info',
          title: 'Already on Free Tier',
          text: 'You are currently on the Free tier. You can explore all basic AI tools from your dashboard!'
        });
      } else {
        navigate('/signup');
      }
      return;
    }

    if (!user) {
      navigate('/login?redirect=/pricing');
      return;
    }

    const discountedPrice = Math.round(basePrice * (1 - discountPercent / 100));

    const creditsMap: Record<string, Record<'monthly' | 'yearly', number>> = {
      'Pro': {
        monthly: 100,
        yearly: 1200
      },
      'Ultimate': {
        monthly: 1000,
        yearly: 12000
      }
    };
    const credits = creditsMap[planName]?.[billingCycle] || 0;

    navigate('/checkout', {
      state: {
        planName,
        price: discountedPrice,
        billingCycle,
        credits
      }
    });
  };

  return (
    <div className="space-y-16 pb-24 bg-background text-foreground transition-colors duration-300">
      
      {/* Sleek Alert Notification Overlay */}
      {alertMessage && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`max-w-md w-full border border-white/5 text-center space-y-6 p-8 rounded-[2.5rem] bg-[#111]`}
          >
            <div className="space-y-2">
              <h3 className={`text-2xl font-black italic text-primary`}>
                {alertMessage.title}
              </h3>
              <p className="text-xs text-zinc-400 font-medium italic leading-relaxed">
                {alertMessage.text}
              </p>
            </div>
            <button 
              onClick={() => setAlertMessage(null)}
              className="w-full py-3.5 bg-primary hover:bg-primary-hover text-zinc-950 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            >
              Acknowledge
            </button>
          </motion.div>
        </div>
      )}

      {/* Hero section */}
      <section className="relative text-center space-y-4 py-8 md:py-12 overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/60 backdrop-blur-xl">
        <div className="space-y-4 px-4 relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-black uppercase tracking-wider border border-border">
            <Zap className="w-3.5 h-3.5 text-primary" /> Plans & Subscriptions
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-foreground">
            Unlock the <span className="text-primary italic">Premium Suite</span>
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto font-medium">
            Invest in your placement prep. Get faster models, longer AI query context, ATS analyzer scores, and interactive voice simulators.
          </p>

          {/* Billing Cycle Switch */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <span className={`text-xs font-black uppercase tracking-wider ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 bg-muted rounded-full p-1 transition-colors border border-border flex items-center"
            >
              <div className={`w-4 h-4 bg-primary rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`} />
            </button>
            <span className={`text-xs font-black uppercase tracking-wider ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'} flex items-center gap-1.5`}>
              Yearly <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] rounded-full">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
        {plans.map((p) => {
          const rawPrice = billingCycle === 'monthly' ? p.price.monthly : p.price.yearly;
          const discountedPrice = Math.round(rawPrice * (1 - discountPercent / 100));

          return (
            <div 
              key={p.name}
              className={`p-8 rounded-[2.5rem] border flex flex-col justify-between relative overflow-hidden transition-all ${
                p.popular 
                  ? 'bg-primary/5 border-primary shadow-2xl' 
                  : 'bg-[#111] border-white/5'
              }`}
            >
              {p.popular && (
                <span className="absolute top-4 right-4 bg-primary text-zinc-950 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white">{p.name}</h3>
                  <p className="text-[10px] text-zinc-500 mt-1">{p.tagline}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹{discountedPrice}</span>
                  <span className="text-xs text-zinc-500">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>

                <ul className="space-y-3.5 border-t border-white/5 pt-6">
                  {p.features.map((feat, i) => (
                    <li key={i} className="flex gap-3 text-xs text-zinc-400">
                      <span className="p-0.5 bg-primary/10 text-primary rounded h-fit shrink-0"><Check className="w-3.5 h-3.5" /></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handlePayment(p.name, rawPrice)}
                className={`w-full py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all mt-8 ${
                  p.popular 
                    ? 'bg-primary hover:bg-primary-hover text-zinc-950 shadow-xl shadow-primary/10' 
                    : 'bg-white/5 text-zinc-300 border border-white/5 hover:bg-white/10'
                }`}
              >
                {p.button}
              </button>
            </div>
          );
        })}
      </div>

      {/* Coupon & Referral details */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-6">
        
        {/* Coupon validation */}
        <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-primary animate-pulse" />
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300">Discount Coupons</h4>
          </div>
          <p className="text-[10px] text-zinc-500">Have a student promotional code? Apply it below.</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. SCHOLAR50"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={couponApplied}
              className="flex-grow bg-white/5 border border-white/5 text-zinc-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary uppercase font-bold"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={couponApplied || !couponCode.trim()}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-zinc-950 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Referrals bonus */}
        <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300">Student Referral Program</h4>
          </div>
          <p className="text-[10px] text-zinc-500">Share your referral code from your profile. Get 5 free credits for every signup!</p>
          <div className="p-3 bg-white/5 rounded-2xl text-[10px] text-zinc-400 font-semibold border border-white/5">
            🎁 Refer a friend, share credits, and unlock premium components together!
          </div>
        </div>

      </div>

      {/* Invoice list panel */}
      {user && (
        <div className="max-w-4xl mx-auto bg-[#111] border border-white/5 p-6 rounded-[2rem] space-y-6 shadow-xl">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300">Billing History & Invoices</h4>
            <p className="text-[10px] text-zinc-500">View your transaction summaries</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-zinc-400">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 text-left">Invoice No</th>
                  <th className="py-2.5 text-left">Date</th>
                  <th className="py-2.5 text-left">Plan</th>
                  <th className="py-2.5 text-left">Amount</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, idx) => (
                  <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="py-3 font-semibold text-white">{inv.id}</td>
                    <td className="py-3">{inv.date}</td>
                    <td className="py-3">{inv.plan}</td>
                    <td className="py-3">{inv.amount}</td>
                    <td className="py-3 text-right text-emerald-400 font-bold uppercase tracking-wider">{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default Pricing;
