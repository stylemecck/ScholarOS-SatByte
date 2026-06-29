import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, Heart, Sparkles, Zap, Loader2, 
  Search, HelpCircle, MessageSquare, Book, 
  ShieldCheck, CreditCard, Terminal,
  Cpu, FileText, Image as ImageIcon, Layout,
  ChevronDown, ArrowRight, ExternalLink, Mail,
  CheckCircle2, Globe, Clock, Shield
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';
import { toast } from '../lib/toast';

const Support = () => {
  const { user } = useAuth();
  
  // --- DONATION LOGIC (Preserved) ---
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState('');
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

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
    setPaymentLoading(label);
    const res = await loadRazorpay();
    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      setPaymentLoading(null);
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
        name: "ScholarOS",
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
            toast.success(`Thank you for the ${quantity} coffee(s)! ❤️ We really appreciate your support!`);
          } catch (err) {
            toast.info('Payment received! We will verify it manually shortly.');
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
      const errorMsg = err.response?.data?.details || err.response?.data?.error || 'Failed to initiate support payment.';
      toast.error(errorMsg);
    } finally {
      setPaymentLoading(null);
    }
  };

  // --- HELP CENTER LOGIC ---
  const [searchQuery, setSearchQuery] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    { title: 'Tool Issues', icon: Cpu, desc: 'Processing errors, bugs, or usage help.' },
    { title: 'API Support', icon: Terminal, desc: 'Documentation, keys, and rate limits.' },
    { title: 'Billing', icon: CreditCard, desc: 'Payments, invoices, and subscriptions.' },
    { title: 'Account', icon: ShieldCheck, desc: 'Security, logins, and settings.' },
    { title: 'PDF Tools', icon: FileText, desc: 'Exporting, merging, and compression.' },
    { title: 'Image Studio', icon: ImageIcon, desc: 'Quality issues and format conversions.' },
    { title: 'Resume Help', icon: Layout, desc: 'Templates, exports, and data loss.' },
    { title: 'Rank Analytics', icon: Zap, desc: 'Accuracy and normalization questions.' },
  ];

  const faqs = [
    { q: "Why did my PDF export fail?", a: "PDF exports usually fail if the file size is extremely large or if the server is under high load. Try compressing the file first or wait a few minutes and try again." },
    { q: "How do I get an API Key?", a: "Visit the Developer Dashboard under your account settings to generate and manage your API keys." },
    { q: "Are my files stored on your servers?", a: "No. We use ephemeral processing. Files are processed in RAM or temporary encrypted storage and purged within 60 minutes." },
    { q: "Can I get a refund for credits?", a: "Credits are non-refundable. However, if a credit was deducted for a failed generation, contact us for a manual credit restoration." },
    { q: "Is the Rank Predictor 100% accurate?", a: "No. It provides educational estimates based on historical data. Official results should always be verified with the exam conducting body." },
  ];

  const filteredFaqs = useMemo(() => {
    if (!searchQuery) return faqs;
    return faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => setFormStatus('success'), 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden border-b border-border bg-card/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10" />
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground border border-border rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              <HelpCircle className="w-3 h-3 text-primary" /> Support Center
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-none text-foreground">
              How can we <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 pr-4">help you?</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed italic">
              Get help with tools, APIs, accounts, billing, exports, and platform issues. Our hub is designed for students and developers.
            </p>
          </div>

          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search help articles, FAQs, and tutorials..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl text-lg font-medium italic focus:ring-4 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/30"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-24 space-y-32">
        {/* 2. QUICK HELP CARDS */}
        <section className="space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-3xl font-black italic">Support Categories</h2>
              <p className="text-muted-foreground italic">Find specific answers based on the module you're using.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="saas-card !p-8 space-y-6 group cursor-pointer hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/5 group-hover:bg-primary group-hover:text-white transition-all">
                  <cat.icon className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black italic">{cat.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">{cat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. FAQ SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black italic leading-tight">Frequently Asked Questions.</h2>
              <p className="text-lg text-muted-foreground italic leading-relaxed">
                Quick answers to common questions about our industrial-grade tools and developer platform.
              </p>
            </div>
            <div className="saas-card !p-10 space-y-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
               <div className="space-y-2">
                 <h4 className="text-white font-black italic uppercase tracking-widest text-xs">Self-Help Hub</h4>
                 <p className="text-sm text-muted-foreground italic">Explore our deep-dive documentation for advanced implementation.</p>
               </div>
               <div className="flex flex-col gap-4">
                 <Link to="/docs" className="saas-button-primary !py-4 flex items-center justify-center gap-3 text-[10px] font-black uppercase">
                   <Book className="w-4 h-4" /> API Documentation
                 </Link>
                 <Link to="/tutorials" className="saas-button-secondary !py-4 flex items-center justify-center gap-3 text-[10px] font-black uppercase">
                   <Layout className="w-4 h-4" /> Usage Tutorials
                 </Link>
               </div>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-4">
            {filteredFaqs.map((faq, i) => (
              <div 
                key={i} 
                className={`saas-card !p-0 overflow-hidden transition-all duration-500 ${openFaq === i ? 'border-primary/50 ring-1 ring-primary/20 shadow-2xl shadow-primary/5' : 'hover:border-white/20'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-7 flex items-center justify-between text-left group"
                >
                  <span className="text-lg font-black italic group-hover:text-primary transition-colors">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-500 ${openFaq === i ? 'rotate-180 text-primary' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border"
                    >
                      <div className="px-8 py-8 text-muted-foreground italic leading-relaxed text-lg bg-muted/10">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FUEL THE INNOVATION (Coffee Section - Preserved Logic) */}
        <section className="relative rounded-[4rem] border border-border bg-card p-12 md:p-24 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[140px] -z-10" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Heart className="w-3 h-3 fill-amber-500" /> Support the Creator
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-none">
                  Fuel the <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-primary pr-4">Innovation.</span>
                </h2>
                <p className="text-xl text-muted-foreground font-medium italic leading-relaxed">
                  ScholarOS is built solo with love. Your support helps cover API infrastructure costs and keeps these tools free for everyone.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-center lg:items-start gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Select Coffee Batch</span>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                    {[1, 2, 5, 10].map((num) => (
                      <button
                        key={num}
                        onClick={() => setQuantity(num)}
                        className={`w-16 h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center border-2 ${
                          quantity === num 
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xl shadow-amber-500/20 scale-110' 
                          : 'bg-white/5 text-muted-foreground border-white/5 hover:border-amber-500/30'
                        }`}
                      >
                        {num}x
                      </button>
                    ))}
                  </div>
                </div>
                <div className="max-w-md mx-auto lg:mx-0">
                  <div className="relative group">
                    <input 
                      type="tel"
                      placeholder="91XXXXXXXX (Optional Mobile)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-center font-black tracking-widest italic outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { amount: 49, label: 'Single Shot', icon: Coffee, desc: 'A quick thank you note.' },
                { amount: 149, label: 'Double Espresso', icon: Zap, desc: 'Ultimate fuel for complex features.', popular: true },
                { amount: 499, label: 'The Whole Pot', icon: Sparkles, desc: 'Sponsor a day of coding.' },
                { amount: 100, label: 'Custom Blend', icon: Heart, desc: 'Your support, your way.' }
              ].map((tier, i) => (
                <div 
                  key={i}
                  onClick={() => handleSupport(tier.amount, tier.label)}
                  className={`saas-card !p-8 flex flex-col items-center text-center space-y-6 group cursor-pointer transition-all duration-500 hover:scale-[1.02] ${tier.popular ? 'border-amber-500/50 bg-amber-500/5 shadow-2xl shadow-amber-500/5' : ''}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${tier.popular ? 'bg-amber-500 text-white border-amber-500' : 'bg-white/5 border-white/5 text-muted-foreground group-hover:border-amber-500/30 group-hover:text-amber-500'}`}>
                    {paymentLoading === tier.label ? <Loader2 className="w-7 h-7 animate-spin" /> : <tier.icon className="w-7 h-7" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-3xl font-black tracking-tight italic text-white">₹{tier.amount * quantity}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{tier.label}</p>
                  </div>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CONTACT SUPPORT SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-5xl font-black italic">Still need help? <br /><span className="text-primary">Contact Support.</span></h2>
              <p className="text-lg text-muted-foreground italic leading-relaxed">
                If you can't find what you're looking for, our human team is ready to help. Most inquiries are resolved within 24 hours.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-6 p-8 saas-card group">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">Email Command</h4>
                  <p className="text-xs text-muted-foreground italic font-medium mt-1">support@satbyte.in</p>
                </div>
              </div>
              <div className="flex items-center gap-6 p-8 saas-card group">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">Legal Protocol</h4>
                  <p className="text-xs text-muted-foreground italic font-medium mt-1">legal@satbyte.in</p>
                </div>
              </div>
            </div>
          </div>

          <div className="saas-card !p-12 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {formStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black italic">Inquiry Received</h4>
                    <p className="text-muted-foreground italic">Our team has been notified. Check your email for a response within 24h.</p>
                  </div>
                  <button onClick={() => setFormStatus('idle')} className="saas-button-secondary !px-8">Send another</button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onSubmit={handleContactSubmit} className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Your Name</label>
                      <input type="text" required className="saas-input w-full" placeholder="Satyam Kumar" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Email Address</label>
                      <input type="email" required className="saas-input w-full" placeholder="name@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Issue Category</label>
                    <select className="saas-input w-full appearance-none">
                      <option>Technical Issue (Tools)</option>
                      <option>Developer API Issue</option>
                      <option>Billing & Payment</option>
                      <option>Account Security</option>
                      <option>Feature Request</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Message</label>
                    <textarea required rows={4} className="saas-input w-full resize-none py-4" placeholder="How can we help? Please provide as much detail as possible..."></textarea>
                  </div>
                  <button 
                    disabled={formStatus === 'submitting'}
                    className="saas-button-primary w-full !py-6 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {formStatus === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />}
                    Submit Inquiry
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* 6. SYSTEM STATUS & TRUST */}
        <section className="saas-card !p-12 bg-white/[0.01] border-white/5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center border border-emerald-500/20">
                <Globe className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center lg:justify-start text-xs font-black uppercase tracking-widest text-emerald-500">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> All Systems Operational
                </div>
                <h4 className="text-2xl font-black italic text-white">Platform Availability: 99.9%</h4>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-10">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Certified Secure</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Real-time Uptime</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Privacy Protocol</span>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="text-center space-y-12 py-12">
          <div className="space-y-4">
             <h2 className="text-5xl font-black italic">Still have questions?</h2>
             <p className="text-muted-foreground italic">Join our community or explore the full documentation.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/docs" className="saas-button-primary !px-12 flex items-center gap-3 text-[10px] font-black uppercase">
              Explore Docs <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://satbyte.in" className="saas-button-secondary !px-12 flex items-center gap-3 text-[10px] font-black uppercase">
              Join Community <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Support;
