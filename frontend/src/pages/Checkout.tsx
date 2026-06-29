import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Loader2, CreditCard, ChevronLeft, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import SEO from '../components/SEO';

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

const Checkout = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get plan details from router state
  const planData = location.state as {
    planName: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    credits: number;
  } | null;

  // State
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('India');
  const [savingBilling, setSavingBilling] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    text: string;
  } | null>(null);

  // Redirect if no plan selected
  useEffect(() => {
    if (!planData) {
      navigate('/pricing');
      return;
    }

    if (!user) {
      navigate(`/login?redirect=/checkout`);
      return;
    }

    // Prefill billing info
    setPhone(user.phoneNumber || '');
    setAddressLine1(user.address?.line1 || '');
    setCity(user.address?.city || '');
    setStateName(user.address?.state || '');
    setZipCode(user.address?.postalCode || '');
    setCountry(user.address?.country || 'India');
  }, [planData, user, navigate]);

  if (!planData || !user) return null;

  const { planName, price, billingCycle, credits } = planData;

  // HSN code for SaaS subscription
  const hsnCode = '998311';
  const basePrice = parseFloat((price / 1.18).toFixed(2));
  const cgst = parseFloat((basePrice * 0.09).toFixed(2));
  const sgst = parseFloat((basePrice * 0.09).toFixed(2));

  const proceedToCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSavingBilling(true);
      setCheckoutLoading(true);
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

      // 2. Create Razorpay order
      console.log(`Creating order on backend for ${planName}: Amount ${price}, Credits ${credits}`);
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
        setCheckoutLoading(false);
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
            setCheckoutLoading(true);
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
            setCheckoutLoading(false);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: phone
        },
        notes: {
          address: `${addressLine1}, ${city}, ${stateName} - ${zipCode}`
        },
        theme: {
          color: "#D97706" // Match primary amber accent
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        console.error("Payment failed:", response.error);
        setAlertMessage({
          type: 'error',
          title: 'Payment Failed',
          text: response.error.description || 'The transaction failed or was cancelled. Please try again.'
        });
        setCheckoutLoading(false);
        setSavingBilling(false);
      });

      rzp1.open();

    } catch (err: any) {
      console.error("Profile Save or Order Creation Error:", err);
      setAlertMessage({
        type: 'error',
        title: 'Checkout Error',
        text: err.response?.data?.error || 'Failed to initialize payment process. Please review your details and try again.'
      });
      setCheckoutLoading(false);
      setSavingBilling(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10 pb-24 text-foreground">
      <SEO 
        title="Checkout - ScholarOS" 
        description="Verify your billing details and complete your upgrade checkout securely."
      />

      {/* Breadcrumb Back link */}
      <div>
        <button 
          onClick={() => navigate('/pricing')}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Back to pricing
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight italic">
              Checkout & <span className="text-primary">Billing</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm">
              Please confirm your billing details to secure a GST-compliant tax invoice.
            </p>
          </div>

          <form onSubmit={proceedToCheckout} className="saas-card p-8 md:p-10 space-y-6 rounded-[2.5rem] border border-border/40 bg-card">
            <div className="flex items-center gap-4 border-b border-border/30 pb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Billing Address</h3>
                <p className="text-xs text-muted-foreground font-medium">GST receipts require valid registration details.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 ml-1 block">Mobile Number</label>
                <input 
                  type="tel" 
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="saas-input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 ml-1 block">Billing Address (Line 1)</label>
                <input 
                  type="text" 
                  required
                  placeholder="House/Flat No, Street/Colony"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="saas-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 ml-1 block">City</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Muzaffarpur"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="saas-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 ml-1 block">State</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Bihar"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="saas-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 ml-1 block">PIN Code</label>
                  <input 
                    type="text" 
                    required
                    pattern="[0-9]{6}"
                    placeholder="6-digit PIN code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="saas-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 ml-1 block">Country</label>
                  <input 
                    type="text" 
                    required
                    disabled
                    value={country}
                    className="w-full bg-muted/40 border border-border/30 rounded-xl px-5 py-3.5 text-sm text-muted-foreground cursor-not-allowed outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-border/30">
              <button 
                type="button" 
                onClick={() => navigate('/pricing')}
                className="flex-grow py-4 border border-border/30 text-foreground font-bold hover:bg-foreground/[0.04] rounded-xl text-xs uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={savingBilling || checkoutLoading}
                className="flex-[2] py-4 bg-primary text-primary-foreground font-bold hover:opacity-90 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Invoice Summary Column */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="saas-card p-8 md:p-10 space-y-8 rounded-[2.5rem] border border-border/40 bg-card/60 backdrop-blur-xl">
            <h3 className="text-xl font-black text-foreground italic uppercase tracking-tight pb-4 border-b border-border/30">
              Order Summary
            </h3>

            <div className="space-y-6">
              {/* Plan Badge Info */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-bold text-base text-foreground">{planName}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                    {billingCycle === 'monthly' ? 'Monthly Subscription' : 'Yearly Subscription'}
                  </p>
                  <span className="inline-flex mt-2 items-center gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                    +{credits.toLocaleString()} AI Credits
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-foreground">₹{price.toFixed(2)}</span>
                  <span className="text-[10px] text-muted-foreground block font-bold">Billed now</span>
                </div>
              </div>

              {/* Tax Invoice Details Slip */}
              <div className="bg-foreground/[0.03] rounded-2xl p-5 border border-border/30 space-y-3 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Base Plan Price:</span>
                  <span className="font-bold text-foreground">Rs. {basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>CGST (9%):</span>
                  <span className="font-bold text-foreground">Rs. {cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>SGST (9%):</span>
                  <span className="font-bold text-foreground">Rs. {sgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>HSN Service Code:</span>
                  <span className="font-mono text-foreground font-bold">{hsnCode}</span>
                </div>
                <div className="border-t border-border/30 pt-3 flex justify-between items-center text-sm font-bold">
                  <span className="text-foreground">Grand Total (Inc. GST):</span>
                  <span className="text-primary text-base font-black">₹{price.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Shield */}
              <div className="flex gap-3 text-xs text-muted-foreground items-start leading-relaxed bg-primary/5 p-4 rounded-xl border border-primary/10">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <p className="font-medium text-foreground/70">
                  Payments are secure and encrypted. Under state regulations, a digitally signed invoice PDF will be issued upon transaction verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Custom Notification Overlay */}
      <AnimatePresence>
        {alertMessage && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
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
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
