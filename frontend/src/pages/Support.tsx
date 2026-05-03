import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Heart, Star, Sparkles, Zap, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

const Support = () => {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSupport = async (baseAmount: number, label: string) => {
    const finalAmount = baseAmount * quantity;
    setLoading(label);

    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(null);
      return;
    }

    try {
      const orderRes = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/create-order`, {
        amount: finalAmount,
        credits: 0 
      }, {
        headers: user ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}
      });

      const { amount: orderAmount, id: order_id, currency } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderAmount.toString(),
        currency: currency,
        name: "Student Toolkit Pro",
        description: `Coffee Support: ${quantity}x ${label}`,
        order_id: order_id,
        handler: async (response: any) => {
          try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/verify-payment`, {
              ...response,
              credits: 0
            }, {
              headers: user ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}
            });
            alert(`Thank you so much for the ${quantity} coffee(s)! ❤️`);
          } catch (err) {
            alert("Verification failed, but we'll check it manually!");
          }
        },
        prefill: { 
          name: user?.name || '', 
          email: user?.email || '',
          ...(phone ? { contact: phone } : {})
        },
        theme: { color: "#8b5cf6" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      console.error("SUPPORT INITIATION ERROR:", err);
      const errorMsg = err.response?.data?.details || err.response?.data?.error || "Failed to initiate support payment.";
      alert(errorMsg);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 space-y-16">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex p-6 bg-primary/10 text-primary rounded-[2.5rem] shadow-2xl shadow-primary/10"
        >
          <Coffee className="w-14 h-14" />
        </motion.div>
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-[0.9]">Fuel the <br /><span className="text-primary italic">Innovation.</span></h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            Student Toolkit Pro is built solo with love. Your support helps cover server costs and keeps these tools free for everyone.
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="flex flex-col items-center gap-4 pt-8">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">Select Coffee Batch</label>
            <div className="flex items-center justify-center gap-3">
            {[1, 2, 5, 10].map((num) => (
                <button
                key={num}
                onClick={() => setQuantity(num)}
                className={`w-16 h-16 rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center border-2 ${
                    quantity === num 
                    ? 'bg-primary text-primary-foreground border-primary shadow-[0_10px_30px_rgba(59,130,246,0.3)] scale-110' 
                    : 'bg-white/5 text-muted-foreground border-white/5 hover:border-primary/30 hover:bg-white/10'
                }`}
                >
                {num}x
                </button>
            ))}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CoffeeCard 
          amount={49 * quantity} 
          label="Single Shot" 
          icon={<Coffee className="w-6 h-6" />}
          description="Perfect for a quick 'Thank You' note. Every bit helps!"
          loading={loading === "Single Shot"}
          onClick={() => handleSupport(49, "Single Shot")}
        />
        <CoffeeCard 
          amount={149 * quantity} 
          label="Double Espresso" 
          icon={<Zap className="w-6 h-6 text-amber-500" />}
          popular={true}
          description="The ultimate fuel for adding complex new features!"
          loading={loading === "Double Espresso"}
          onClick={() => handleSupport(149, "Double Espresso")}
        />
        <CoffeeCard 
          amount={499 * quantity} 
          label="The Whole Pot" 
          icon={<Sparkles className="w-6 h-6 text-primary" />}
          description="Sponsor a whole day of coding and maintenance."
          loading={loading === "The Whole Pot"}
          onClick={() => handleSupport(499, "The Whole Pot")}
        />
      </div>

      <div className="bg-card/40 backdrop-blur-3xl border border-white/5 p-12 md:p-20 rounded-[4rem] shadow-2xl text-center space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="space-y-4">
            <h3 className="text-4xl font-black tracking-tight flex items-center justify-center gap-4">
            <Heart className="fill-rose-500 text-rose-500 w-10 h-10 animate-pulse" />
            Support Satyam Kumar
            </h3>
            <p className="text-muted-foreground font-medium max-w-xl mx-auto text-lg leading-relaxed">
            All contributions go directly towards maintaining the API infrastructure and keeping Student Toolkit Pro ad-free and open for everyone.
            </p>
        </div>
        
        <div className="max-w-xs mx-auto space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">Mobile Number (Optional)</label>
          <input 
            type="tel"
            name="support_phone_guest"
            autoComplete="off"
            placeholder="91XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-8 py-4 rounded-2xl bg-white/5 border border-white/5 focus:ring-2 focus:ring-primary outline-none transition-all text-center font-black tracking-widest text-lg"
          />
        </div>

        <div className="pt-6 flex flex-col items-center gap-6">
          <button 
            onClick={() => handleSupport(100, "Support")}
            disabled={loading !== null}
            className="group w-full md:w-auto px-12 py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-xl shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-70"
          >
            {loading === "Support" ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <Coffee className="w-8 h-8 fill-primary-foreground/20 group-hover:rotate-12 transition-transform" />
            )}
            <span className="whitespace-nowrap uppercase tracking-widest">Send {quantity} Coffee(s) (₹{100 * quantity})</span>
          </button>
          
          <div className="flex flex-wrap items-center justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Top Contributor Badge
            </div>
            <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Instant Confirmation
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const CoffeeCard = ({ amount, label, icon, description, popular, loading, onClick }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onClick}
    className={`p-8 rounded-[2.5rem] border flex flex-col items-center text-center space-y-4 transition-all cursor-pointer ${
      popular ? 'bg-card border-primary shadow-xl shadow-primary/10 relative' : 'bg-card border-border shadow-sm'
    }`}
  >
    {popular && (
      <div className="absolute -top-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
        <Star className="w-3 h-3 fill-current" /> Most Loved
      </div>
    )}
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${popular ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : icon}
    </div>
    <div className="space-y-1">
      <h4 className="text-2xl font-black">₹{amount}</h4>
      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
    </div>
    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export default Support;
