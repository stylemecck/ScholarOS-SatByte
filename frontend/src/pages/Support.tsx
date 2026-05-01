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
          contact: phone || '',
        },
        theme: { color: "#8b5cf6" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      alert("Failed to initiate payment.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-16">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex p-4 bg-amber-500/10 text-amber-500 rounded-full"
        >
          <Coffee className="w-12 h-12" />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">Buy Me a <span className="text-primary">Coffee</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fuel our development! Choose how many coffees you'd like to send.
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-center gap-4 pt-4">
          {[1, 3, 5, 10].map((num) => (
            <button
              key={num}
              onClick={() => setQuantity(num)}
              className={`w-14 h-14 rounded-2xl font-black text-lg transition-all flex items-center justify-center border-2 ${
                quantity === num 
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-110' 
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              {num}x
            </button>
          ))}
          <span className="text-sm font-bold text-muted-foreground ml-2">Coffees</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CoffeeCard 
          amount={50 * quantity} 
          label="Single Shot" 
          icon={<Coffee className="w-6 h-6" />}
          description="A small token of appreciation. Every drop counts!"
          loading={loading === "Single Shot"}
          onClick={() => handleSupport(50, "Single Shot")}
        />
        <CoffeeCard 
          amount={150 * quantity} 
          label="Double Espresso" 
          icon={<Zap className="w-6 h-6" />}
          popular={true}
          description="A significant boost to our development speed!"
          loading={loading === "Double Espresso"}
          onClick={() => handleSupport(150, "Double Espresso")}
        />
        <CoffeeCard 
          amount={500 * quantity} 
          label="The Whole Pot" 
          icon={<Sparkles className="w-6 h-6" />}
          description="Fuel for late-night coding sessions and new features."
          loading={loading === "The Whole Pot"}
          onClick={() => handleSupport(500, "The Whole Pot")}
        />
      </div>

      <div className="bg-card border border-border p-12 rounded-[3.5rem] shadow-2xl text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <h3 className="text-3xl font-black tracking-tight flex items-center justify-center gap-3">
          <Heart className="fill-rose-500 text-rose-500 w-8 h-8" />
          Thank You for Supporting!
        </h3>
        <p className="text-muted-foreground font-medium max-w-lg mx-auto">
          All contributions go directly towards maintaining the AI infrastructure and adding more free tools for everyone.
        </p>
        
        <div className="max-w-xs mx-auto space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your Mobile Number (Optional)</label>
          <input 
            type="tel"
            placeholder="e.g. 9988776655"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-center font-bold"
          />
        </div>

        <div className="pt-4 flex flex-col items-center gap-4">
          <button 
            onClick={() => handleSupport(100, "Coffee")}
            disabled={loading !== null}
            className="px-12 py-5 bg-primary text-primary-foreground rounded-[2rem] font-black text-xl shadow-xl hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-70"
          >
            {loading === "Coffee" ? <Loader2 className="w-6 h-6 animate-spin" /> : <Coffee className="w-6 h-6" />}
            Buy {quantity} Coffee(s) (₹{100 * quantity})
          </button>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Securely via Razorpay</p>
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
