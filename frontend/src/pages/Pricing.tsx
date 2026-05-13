import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Zap, Shield, Crown, 
  Terminal, Code2, Globe, Cpu,
  ChevronRight, ArrowRight, Info, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free',
      tagline: 'For students & explorers',
      price: { monthly: 0, yearly: 0 },
      features: [
        '1,000 API Requests / mo',
        'Standard Tool Access',
        'Up to 10MB file size',
        'Community Support',
        'Public SDK Access'
      ],
      button: 'Get Started',
      pro: false
    },
    {
      name: 'Pro',
      tagline: 'For power users & creators',
      price: { monthly: 99, yearly: 990 },
      features: [
        '50,000 API Requests / mo',
        'Priority Processing Queue',
        'Up to 100MB file size',
        'AI Resume Summary (Unlimited)',
        'Email Support',
        'Advanced Analytics'
      ],
      button: 'Upgrade to Pro',
      pro: true,
      popular: true
    },
    {
      name: 'Business',
      tagline: 'For teams & platforms',
      price: { monthly: 499, yearly: 4990 },
      features: [
        'Unlimited API Requests',
        'Dedicated Support Manager',
        'Custom Webhooks',
        'SLA Guarantee (99.9%)',
        'Whitelabel Export support',
        'Multi-user Dashboard'
      ],
      button: 'Contact Sales',
      pro: true
    }
  ];

  return (
    <div className="space-y-32 pb-32">
      {/* Premium Hero */}
      <section className="relative pt-24 px-4 text-center space-y-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10" />
        
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
          >
            <Zap className="w-4 h-4" /> SaaS & API Pricing
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-white italic">
            Fair pricing for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 pr-4">everyone.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto italic">
            Choose the plan that fits your ambition. From individual student tools to industrial-grade APIs.
          </p>

          <div className="flex justify-center pt-8">
             <div className="bg-[#111] p-1 rounded-2xl border border-white/5 flex gap-1">
                <button 
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-primary text-white shadow-xl' : 'text-muted-foreground hover:text-white'}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${billingCycle === 'yearly' ? 'bg-primary text-white shadow-xl' : 'text-muted-foreground hover:text-white'}`}
                >
                  Yearly <span className="text-[10px] opacity-60 ml-2">(Save 20%)</span>
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`saas-card flex flex-col gap-10 p-12 relative overflow-hidden group ${plan.popular ? 'border-primary/50 shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)]' : 'border-white/5'}`}
          >
            {plan.popular && (
              <div className="absolute top-6 right-[-35px] bg-primary text-white text-[9px] font-black uppercase tracking-widest px-10 py-1 rotate-45 shadow-xl">
                Most Popular
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white italic">{plan.name}</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{plan.tagline}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-white italic">₹{plan.price[billingCycle]}</span>
              <span className="text-muted-foreground font-medium italic">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
            </div>

            <div className="space-y-6 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">What's Included</p>
              <div className="space-y-4">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-4 text-sm text-muted-foreground font-medium italic">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <button className={`w-full !py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
              plan.popular ? 'saas-button-primary' : 'saas-button-secondary'
            }`}>
              {plan.button} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </section>

      {/* Comparison Section */}
      <section className="max-w-5xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-white tracking-tighter italic">Compare Platform Features</h2>
          <p className="text-muted-foreground font-medium max-w-xl mx-auto italic opacity-60">A detailed breakdown of our student and developer offerings.</p>
        </div>

        <div className="saas-card !p-0 overflow-hidden border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Feature</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Free</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Pro</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">API Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'Tool Access', free: 'Basic', pro: 'All', api: 'Full API' },
                { name: 'API Quota', free: '1K', pro: '50K', api: 'Unlimited' },
                { name: 'File Storage', free: 'Temp', pro: 'Permanent', api: 'S3 Sync' },
                { name: 'AI Generation', free: 'Limited', pro: 'Priority', api: 'Direct AI' },
                { name: 'Support', free: 'Discord', pro: 'Email', api: 'Dedicated' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6 text-sm font-bold text-white italic">{row.name}</td>
                  <td className="px-8 py-6 text-center text-xs text-muted-foreground font-medium">{row.free}</td>
                  <td className="px-8 py-6 text-center text-xs text-white font-black">{row.pro}</td>
                  <td className="px-8 py-6 text-center text-xs text-primary font-black uppercase tracking-widest">{row.api}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ or Trust Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="saas-card !p-12 text-center space-y-10 bg-white/[0.01]">
           <div className="space-y-4">
              <h3 className="text-2xl font-black text-white italic">Frequently Asked Questions</h3>
              <p className="text-muted-foreground font-medium max-w-xl mx-auto italic">Everything you need to know about our billing and API platform.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {[
                 { q: 'Can I cancel my Pro subscription?', a: 'Yes, you can cancel at any time. Your Pro features will remain active until the end of the billing period.' },
                 { q: 'What happens if I exceed my API limit?', a: 'For the Free tier, requests will be blocked. For Pro users, you can buy extra credits or upgrade to Business.' },
              ].map((faq, i) => (
                 <div key={i} className="space-y-3">
                    <p className="text-sm font-black text-white flex items-center gap-2 italic">
                       <HelpCircle className="w-4 h-4 text-primary" /> {faq.q}
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
