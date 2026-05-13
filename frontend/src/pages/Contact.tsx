import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Send, MessageSquare, Globe, 
  Code2, Terminal, ShieldCheck, Zap, UserPlus, 
  Bug, Handshake, ArrowRight, CheckCircle2, 
  Loader2, MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 1500);
  };

  const contactOptions = [
    { title: 'General Support', icon: MessageSquare, desc: 'Help with tools and platform usage.', color: 'text-blue-500' },
    { title: 'Technical Help', icon: Terminal, desc: 'Bugs, errors, and performance issues.', color: 'text-purple-500' },
    { title: 'API & Developers', icon: Code2, desc: 'API keys, docs, and integration help.', color: 'text-emerald-500' },
    { title: 'Business & Sales', icon: Handshake, desc: 'SaaS licensing and partnerships.', color: 'text-amber-500' },
    { title: 'Career & Talent', icon: UserPlus, desc: 'Join the SatByte development team.', color: 'text-rose-500' },
    { title: 'Bug Reports', icon: Bug, desc: 'Found a security flaw or UI bug?', color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden border-b border-white/5 bg-[#080808]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10" />
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              <MessageCircle className="w-3 h-3" /> Communication Hub
            </motion.div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter italic leading-none">
              Let's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 pr-4">Connect.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed italic">
              Reach out for support, partnerships, APIs, collaborations, business inquiries, or technical assistance.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-24 space-y-32">
        {/* 2. CONTACT OPTIONS SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactOptions.map((opt, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="saas-card !p-10 space-y-6 group cursor-pointer hover:border-primary/50 transition-all duration-300"
            >
              <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-primary group-hover:text-white transition-all ${opt.color}`}>
                <opt.icon className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black italic">{opt.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed italic">{opt.desc}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* 3. CONTACT FORM & QUICK RESPONSE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black italic leading-tight">We're here to help you grow.</h2>
              <p className="text-lg text-muted-foreground italic leading-relaxed">
                Whether you're a student using our free tools or a developer integrating our APIs, we treat every message with priority.
              </p>
            </div>

            <div className="space-y-6">
              <div className="saas-card !p-8 space-y-4 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                   <Zap className="w-4 h-4 fill-primary" /> Response Protocol
                </div>
                <p className="text-sm text-muted-foreground italic font-medium">
                  We usually respond within 24–48 hours. Priority is given to verified developer accounts and business inquiries.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="saas-card !p-6 flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5">
                     <ShieldCheck className="w-5 h-5" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Certified Secure</span>
                 </div>
                 <div className="saas-card !p-6 flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5">
                     <Globe className="w-5 h-5" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Support</span>
                 </div>
              </div>
            </div>

            {/* SOCIAL & COMMUNITY */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">Connect Digitally</h4>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Globe, label: 'GitHub', href: '#' },
                  { icon: Mail, label: 'LinkedIn', href: '#' },
                  { icon: MessageCircle, label: 'X', href: '#' },
                  { icon: Mail, label: 'Email', href: 'mailto:support@satbyte.in' }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href}
                    className="flex items-center gap-3 px-6 py-4 saas-card group hover:border-primary/50 transition-all"
                  >
                    <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="saas-card !p-12 relative overflow-hidden">
               <AnimatePresence mode="wait">
                 {status === 'sent' ? (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                     className="py-20 flex flex-col items-center justify-center text-center space-y-6"
                   >
                     <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                       <CheckCircle2 className="w-10 h-10" />
                     </div>
                     <div className="space-y-2">
                       <h4 className="text-2xl font-black italic">Transmission Successful</h4>
                       <p className="text-muted-foreground italic">Your message has been received. Our team will reach out shortly.</p>
                     </div>
                     <button onClick={() => setStatus('idle')} className="saas-button-secondary !px-8">Send another</button>
                   </motion.div>
                 ) : (
                   <motion.form 
                     key="contact-form"
                     initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                     onSubmit={handleSubmit} className="space-y-8"
                   >
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Full Name</label>
                          <input type="text" required placeholder="Satyam Kumar" className="saas-input w-full" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Email Address</label>
                          <input type="email" required placeholder="name@company.com" className="saas-input w-full" />
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Subject</label>
                          <input type="text" required placeholder="Partnership Opportunity" className="saas-input w-full" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Category</label>
                          <select className="saas-input w-full appearance-none">
                             <option>General Support</option>
                             <option>API & Developer</option>
                             <option>Business & SaaS</option>
                             <option>Career Inquiry</option>
                             <option>Bug Report</option>
                          </select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Message</label>
                        <textarea required rows={6} placeholder="Tell us how we can collaborate or help you succeed..." className="saas-input w-full resize-none py-6" />
                     </div>
                     <button 
                       disabled={status === 'sending'}
                       className="saas-button-primary w-full !py-6 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                        {status === 'sending' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        Broadcast Message
                     </button>
                     <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                        Your information is protected by SatByte Privacy Protocols.
                     </p>
                   </motion.form>
                 )}
               </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 4. BUSINESS & API INQUIRIES */}
        <section className="saas-card !p-16 relative overflow-hidden bg-[#080808] border-white/5">
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[140px] -z-10" />
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8 space-y-6">
                 <h3 className="text-4xl font-black italic">Building the future of student utility?</h3>
                 <p className="text-lg text-muted-foreground italic leading-relaxed">
                   SatByte is a growing utility + developer platform. We offer custom API licensing, SaaS integrations, and academic collaboration opportunities.
                 </p>
              </div>
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                 <Link to="/developer" className="saas-button-primary !px-12 flex items-center gap-3 text-[10px] font-black uppercase">
                   Developer Console <ArrowRight className="w-4 h-4" />
                 </Link>
              </div>
           </div>
        </section>

        {/* 5. FINAL CTA SECTION */}
        <section className="text-center space-y-16 py-12">
           <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic">Still need help?</h2>
              <p className="text-muted-foreground text-xl italic">Explore our specialized support hubs for faster assistance.</p>
           </div>
           <div className="flex flex-wrap items-center justify-center gap-6">
              <Link to="/support" className="saas-button-primary !px-12 flex items-center gap-3 text-[10px] font-black uppercase">
                Support Center <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/docs" className="saas-button-secondary !px-12 flex items-center gap-3 text-[10px] font-black uppercase">
                Documentation <Code2 className="w-4 h-4" />
              </Link>
           </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
