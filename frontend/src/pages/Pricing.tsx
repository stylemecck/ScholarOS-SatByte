import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Zap, ArrowRight, HelpCircle, Loader2
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';

const loadRazorpaySDK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    text: string;
  } | null>(null);

  const plans = [
    {
      name: 'Free Trial',
      tagline: 'For students & explorers',
      price: { monthly: 0, yearly: 0 },
      features: [
        '1,000 API Requests / mo',
        'Standard Tool Access',
        'Up to 10MB file size limit',
        'Discord Community Support',
        'Public Workspace Access'
      ],
      button: 'Get Started',
      pro: false
    },
    {
      name: 'Achiever Pro',
      tagline: 'For power users & creators',
      price: { monthly: 99, yearly: 990 },
      features: [
        '50,000 API Requests / mo',
        'Priority AI Processing Queue',
        'Up to 100MB file size limit',
        'AI Resume Summary (Unlimited)',
        'Email Support Workspace',
        'Advanced Analytics Console'
      ],
      button: 'Upgrade to Pro',
      pro: true,
      popular: true
    },
    {
      name: 'Elite Enterprise',
      tagline: 'For college teams & platforms',
      price: { monthly: 499, yearly: 4990 },
      features: [
        'Unlimited API Requests',
        'Dedicated Support Manager',
        'Custom Webhooks Integration',
        'SLA Guarantee (99.9%)',
        'Whitelabel Export Support',
        'Multi-user Team Dashboard'
      ],
      button: 'Upgrade to Elite',
      pro: true
    }
  ];

  const [showBillingModal, setShowBillingModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number } | null>(null);
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('India');
  const [savingBilling, setSavingBilling] = useState(false);

  const handlePayment = async (planName: string, price: number) => {
    if (planName === 'Free Trial') {
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

    // Prefill billing info from user context if available
    setPhone(user.phoneNumber || '');
    setAddressLine1(user.address?.line1 || '');
    setCity(user.address?.city || '');
    setStateName(user.address?.state || '');
    setZipCode(user.address?.postalCode || '');
    setCountry(user.address?.country || 'India');
    
    setSelectedPlan({ name: planName, price });
    setShowBillingModal(true);
  };

  const proceedToCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    
    const planName = selectedPlan.name;
    const price = selectedPlan.price;

    const creditsMap: Record<string, Record<'monthly' | 'yearly', number>> = {
      'Achiever Pro': {
        monthly: 100,
        yearly: 1200
      },
      'Elite Enterprise': {
        monthly: 1000,
        yearly: 12000
      }
    };

    const credits = creditsMap[planName]?.[billingCycle] || 0;

    try {
      setSavingBilling(true);
      setLoadingPlan(planName);
      const token = localStorage.getItem('token');

      // 1. Save Billing Info to Profile First
      console.log("Saving customer billing details to user profile...");
      await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/update-profile`, {
        phoneNumber: phone,
        address: {
          line1: addressLine1,
          city: city,
          state: stateName,
          postalCode: zipCode,
          country: country
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh context so invoice has latest details
      await refreshUser();
      
      // Close Billing modal
      setShowBillingModal(false);

      // 2. Create Razorpay order
      console.log(`Creating order on backend for ${planName} (${billingCycle}): Amount ${price}, Credits ${credits}`);
      const orderRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/create-order`, {
        amount: price,
        credits: credits
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Backend Order Response:", orderRes.data);

      const sdkLoaded = await loadRazorpaySDK();
      if (!sdkLoaded) {
        setAlertMessage({
          type: 'error',
          title: 'SDK Loading Error',
          text: 'Failed to load Razorpay Checkout. Please check your network connection and try again.'
        });
        setLoadingPlan(null);
        setSavingBilling(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "ScholarOS",
        description: `${planName} ${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} Plan (${credits} Credits)`,
        order_id: orderRes.data.id,
        handler: async function (response: any) {
          try {
            setLoadingPlan(planName);
            console.log("Razorpay Checkout payment success, sending for backend verification:", response);
            
            const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              credits: credits
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Verification Response:", verifyRes.data);

            // Confetti explosion!
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 }
            });

            setAlertMessage({
              type: 'success',
              title: 'Purchase Successful!',
              text: `Fantastic! Your workspace has been upgraded and credited with ${credits} tokens. A compliant GST tax invoice has been generated and sent to your email. Redirecting to console...`
            });

            await refreshUser();

            setTimeout(() => {
              navigate('/dashboard');
            }, 3500);

          } catch (err: any) {
            console.error("Payment Verification Error:", err);
            setAlertMessage({
              type: 'error',
              title: 'Verification Failed',
              text: err.response?.data?.error || 'Unable to verify your payment. Please contact our support if money was debited from your account.'
            });
          } finally {
            setLoadingPlan(null);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: phone
        },
        theme: {
          color: "#3B82F6"
        },
        modal: {
          ondismiss: function() {
            setLoadingPlan(null);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error("Checkout Initialization Error:", err);
      setAlertMessage({
        type: 'error',
        title: 'Checkout Initialization Error',
        text: err.response?.data?.error || 'Failed to start payment process. Please try again.'
      });
      setLoadingPlan(null);
    } finally {
      setSavingBilling(false);
    }
  };

  return (
    <div className="space-y-24 md:space-y-32 pb-32 bg-background text-foreground transition-colors duration-300">
      {/* Premium Billing Modal Overlay */}
      {showBillingModal && selectedPlan && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg w-full saas-card space-y-6 my-8 border-border/40 shadow-md relative bg-card text-foreground p-8 sm:p-10 rounded-[3rem]"
          >
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-foreground italic">Confirm Billing Address</h3>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">
                Required for Compliant GST Tax Invoicing
              </p>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-foreground uppercase tracking-wider block">Selected Plan</span>
                <span className="text-muted-foreground italic font-medium">
                  {selectedPlan.name} ({billingCycle === 'monthly' ? 'Monthly' : 'Yearly'})
                </span>
              </div>
              <span className="text-2xl font-black text-primary italic">₹{selectedPlan.price}</span>
            </div>

            <form onSubmit={proceedToCheckout} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Mobile Number</label>
                <input 
                  type="tel" 
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="saas-input text-foreground focus:ring-1 focus:ring-primary/50 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Billing Address (Line 1)</label>
                <input 
                  type="text" 
                  required
                  placeholder="House/Flat No, Street name"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="saas-input text-foreground focus:ring-1 focus:ring-primary/50 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">City</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Noida"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="saas-input text-foreground focus:ring-1 focus:ring-primary/50 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">State</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Uttar Pradesh"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="saas-input text-foreground focus:ring-1 focus:ring-primary/50 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">PIN Code</label>
                  <input 
                    type="text" 
                    required
                    pattern="[0-9]{6}"
                    placeholder="6-digit PIN code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="saas-input text-foreground focus:ring-1 focus:ring-primary/50 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Country</label>
                  <input 
                    type="text" 
                    required
                    disabled
                    value={country}
                    className="saas-input text-muted-foreground bg-muted/30 border border-border/30 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowBillingModal(false)}
                  className="saas-button-secondary flex-1 py-4 text-xs font-black animate-none hover:bg-foreground/[0.05]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={savingBilling}
                  className="saas-button-primary flex-1 py-4 flex items-center justify-center gap-2 text-xs font-black"
                >
                  {savingBilling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      Proceed <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Sleek Custom Notification Overlay */}
      {alertMessage && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`max-w-md w-full saas-card text-center space-y-6 p-8 rounded-[2.5rem] bg-card ${
              alertMessage.type === 'success' 
                ? 'border-emerald-500/30' 
                : alertMessage.type === 'error' 
                  ? 'border-red-500/30' 
                  : 'border-primary/30'
            }`}
          >
            <div className="space-y-2">
              <h3 className={`text-2xl font-black italic ${
                alertMessage.type === 'success' 
                  ? 'text-emerald-400' 
                  : alertMessage.type === 'error' 
                    ? 'text-red-400' 
                    : 'text-primary'
              }`}>
                {alertMessage.title}
              </h3>
              <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">
                {alertMessage.text}
              </p>
            </div>
            {alertMessage.type !== 'success' && (
              <button 
                onClick={() => setAlertMessage(null)}
                className="saas-button-primary w-full py-4 text-xs font-black"
              >
                Acknowledge
              </button>
            )}
          </motion.div>
        </div>
      )}

      {/* Premium Hero */}
      <section className="relative pt-24 px-4 text-center space-y-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10" />
        
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/[0.04] text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20 shadow-sm"
          >
            <Zap className="w-4 h-4" /> Subscription Tiers
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-foreground italic">
            Fair rates for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 pr-4">academic scale.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto italic leading-relaxed">
            Choose the workspace plan that coordinates your study pace. Standard tool limits up to fully integrated team interfaces.
          </p>

          <div className="flex justify-center pt-4">
             <div className="bg-muted p-1 rounded-2xl border border-border/30 flex gap-1">
                <button 
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'yearly' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Yearly <span className="text-[10px] opacity-60 ml-2">(Save 20%)</span>
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => {
          const creditsMap: Record<string, Record<'monthly' | 'yearly', number>> = {
            'Achiever Pro': { monthly: 100, yearly: 1200 },
            'Elite Enterprise': { monthly: 1000, yearly: 12000 }
          };
          const credits = creditsMap[plan.name]?.[billingCycle] || 0;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`saas-card flex flex-col gap-10 p-12 relative overflow-hidden group rounded-[2.5rem] bg-card/80 backdrop-blur-xl border ${
                plan.popular ? 'border-primary/50 shadow-sm' : 'border-border/40'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-6 right-[-35px] bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest px-10 py-1.5 rotate-45 shadow-sm">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-foreground italic">{plan.name}</h3>
                  {plan.price[billingCycle] > 0 && (
                    <span className="text-[9px] font-black uppercase bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full shrink-0">
                      +{credits} Tokens
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-relaxed">{plan.tagline}</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-foreground italic">₹{plan.price[billingCycle]}</span>
                <span className="text-muted-foreground font-medium italic">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>

              <div className="space-y-6 flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Workspace Benefits</p>
                <div className="space-y-4">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-4 text-sm text-muted-foreground font-medium italic">
                      <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handlePayment(plan.name, plan.price[billingCycle])}
                disabled={loadingPlan !== null}
                className={`w-full !py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                  plan.popular ? 'saas-button-primary' : 'saas-button-secondary'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loadingPlan === plan.name ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    {plan.button} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </section>

      {/* Comparison Section */}
      <section className="max-w-5xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-foreground tracking-tighter italic">Compare Platform Features</h2>
          <p className="text-muted-foreground font-medium max-w-xl mx-auto italic opacity-60">A detailed breakdown of our student and developer offerings.</p>
        </div>

        <div className="saas-card !p-0 overflow-hidden border border-border/40 rounded-[2.5rem] bg-card/40 backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/[0.04] border-b border-border/40">
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Feature</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Free Trial</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Achiever Pro</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-center">Elite Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {[
                { name: 'Workspace Modules', free: 'Basic', pro: 'All', api: 'Full API Stack' },
                { name: 'API Quotas', free: '1K Limit', pro: '50K Limit', api: 'Unlimited' },
                { name: 'File Storage Limit', free: '10 MB', pro: '100 MB', api: '1 GB' },
                { name: 'AI Priority Queue', free: 'Standard', pro: 'Priority Queue', api: 'Direct Pipeline' },
                { name: 'Workspace Support', free: 'Discord', pro: 'Email Desk', api: 'Dedicated Manager' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-8 py-6 text-sm font-bold text-foreground italic">{row.name}</td>
                  <td className="px-8 py-6 text-center text-xs text-muted-foreground font-medium">{row.free}</td>
                  <td className="px-8 py-6 text-center text-xs text-foreground font-black">{row.pro}</td>
                  <td className="px-8 py-6 text-center text-xs text-primary font-black uppercase tracking-widest">{row.api}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="saas-card !p-12 text-center space-y-10 bg-card/20 border border-border/40 rounded-[3rem]">
           <div className="space-y-4">
              <h3 className="text-2xl font-black text-foreground italic">Frequently Asked Questions</h3>
              <p className="text-muted-foreground font-medium max-w-xl mx-auto italic">Everything you need to know about our billing and subscription cycles.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {[
                 { q: 'Can I cancel my Achiever Pro subscription?', a: 'Yes, you can cancel at any time via your billing workspace settings. Your Pro benefits remain active until your current term expires.' },
                 { q: 'What happens if I exhaust my credit quota?', a: 'If your token balance reaches 0, you can top-up additional credits from your dashboard or upgrade to a higher tier.' },
              ].map((faq, i) => (
                 <div key={i} className="space-y-3">
                    <p className="text-sm font-black text-foreground flex items-center gap-2 italic">
                       <HelpCircle className="w-4 h-4 text-primary shrink-0" /> {faq.q}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">{faq.a}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
