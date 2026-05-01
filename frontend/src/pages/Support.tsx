import { motion } from 'framer-motion';
import { Coffee, Heart, Star, Sparkles, Zap } from 'lucide-react';

const Support = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-16">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex p-4 bg-amber-500/10 text-amber-500 rounded-full mb-4"
        >
          <Coffee className="w-12 h-12" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">Buy Me a <span className="text-primary">Coffee</span></h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Love using Student Toolkit Pro? Your support helps us keep the servers running and build more awesome tools for the student community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CoffeeCard 
          amount="₹50" 
          label="Single Shot" 
          icon={<Coffee className="w-6 h-6" />}
          description="A small token of appreciation. Every drop counts!"
        />
        <CoffeeCard 
          amount="₹150" 
          label="Double Espresso" 
          icon={<Zap className="w-6 h-6" />}
          popular={true}
          description="A significant boost to our development speed!"
        />
        <CoffeeCard 
          amount="₹500" 
          label="The Whole Pot" 
          icon={<Sparkles className="w-6 h-6" />}
          description="Fuel for late-night coding sessions and new features."
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
        
        <div className="pt-4 flex flex-col items-center gap-4">
          <button className="px-12 py-5 bg-[#FFDD00] text-black rounded-[2rem] font-black text-xl shadow-xl hover:scale-105 transition-all flex items-center gap-3">
            <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="BMC" className="w-6 h-6" />
            Buy Me a Coffee
          </button>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Securely via BuyMeACoffee</p>
        </div>
      </div>
    </div>
  );
};

const CoffeeCard = ({ amount, label, icon, description, popular }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`p-8 rounded-[2.5rem] border flex flex-col items-center text-center space-y-4 transition-all ${
      popular ? 'bg-card border-primary shadow-xl shadow-primary/10 relative' : 'bg-card border-border shadow-sm'
    }`}
  >
    {popular && (
      <div className="absolute -top-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
        <Star className="w-3 h-3 fill-current" /> Most Loved
      </div>
    )}
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${popular ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className="text-2xl font-black">{amount}</h4>
      <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
    </div>
    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export default Support;
