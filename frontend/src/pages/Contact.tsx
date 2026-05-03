import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles, Globe, Twitter, Github } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 space-y-20">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex p-4 bg-primary/5 text-primary rounded-[1.5rem] mb-4"
        >
          <MessageSquare className="w-12 h-12" />
        </motion.div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
          Get in <span className="text-primary italic">Touch</span>
        </h1>
        <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto leading-relaxed">
          Whether you have a question about features, pricing, or just want to say hi, our team is ready to help you succeed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Column: Info & Socials */}
        <div className="lg:col-span-5 space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-card/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl space-y-10 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                <Globe className="w-40 h-40" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight">Contact Information</h3>
                <p className="text-muted-foreground text-sm font-medium">Reach out via any of these channels.</p>
              </div>
              
              <div className="space-y-6">
                <ContactItem 
                  icon={<Mail className="w-5 h-5" />} 
                  label="Support Email" 
                  value="satyam91081@gmail.com" 
                  href="mailto:satyam91081@gmail.com"
                />
                <ContactItem 
                  icon={<Phone className="w-5 h-5" />} 
                  label="Direct Line" 
                  value="+91 9199499081" 
                  href="tel:+919199499081"
                />
                <ContactItem 
                  icon={<MapPin className="w-5 h-5" />} 
                  label="Headquarters" 
                  value="New Delhi, India" 
                  href="#"
                />
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4">
                {[
                  { icon: Twitter, href: "#" },
                  { icon: Github, href: "#" },
                  { icon: Globe, href: "https://satbyte.in" }
                ].map((social, i) => (
                  <a key={i} href={social.href} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all border border-white/5">
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-primary/10 to-transparent rounded-[2.5rem] border border-primary/10 relative overflow-hidden">
                <Sparkles className="absolute top-4 right-4 w-6 h-6 text-primary opacity-20" />
                <p className="text-sm font-bold text-muted-foreground leading-relaxed italic pr-8">
                  "At SatByte, we believe in building tools that empower the next generation of engineers. Your feedback is our greatest asset."
                </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Premium Form */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border p-10 md:p-14 rounded-[4rem] shadow-2xl relative"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Full Name</label>
                  <input 
                    type="text" required placeholder="Satyam Kumar"
                    className="w-full px-8 py-5 rounded-[2rem] bg-white/5 border border-white/5 focus:ring-4 focus:ring-primary/20 outline-none transition-all font-medium text-lg placeholder:text-muted-foreground/30"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Work Email</label>
                  <input 
                    type="email" required placeholder="name@company.com"
                    className="w-full px-8 py-5 rounded-[2rem] bg-white/5 border border-white/5 focus:ring-4 focus:ring-primary/20 outline-none transition-all font-medium text-lg placeholder:text-muted-foreground/30"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Inquiry Subject</label>
                <input 
                  type="text" required placeholder="How can we help you?"
                  className="w-full px-8 py-5 rounded-[2rem] bg-white/5 border border-white/5 focus:ring-4 focus:ring-primary/20 outline-none transition-all font-medium text-lg placeholder:text-muted-foreground/30"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Detailed Message</label>
                <textarea 
                  required placeholder="Tell us more about your inquiry..."
                  className="w-full px-8 py-5 rounded-[2.5rem] bg-white/5 border border-white/5 focus:ring-4 focus:ring-primary/20 outline-none transition-all font-medium text-lg placeholder:text-muted-foreground/30 min-h-[200px] resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={status !== 'idle'}
                className="w-full py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-xl uppercase tracking-[0.1em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-70"
              >
                {status === 'idle' && <><Send className="w-6 h-6" /> Send Message</>}
                {status === 'sending' && <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />}
                {status === 'sent' && <>Message Sent Successfully!</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ContactItem = ({ icon, label, value, href }: any) => (
  <a href={href} className="flex items-center gap-6 p-2 rounded-2xl group transition-all">
    <div className="w-14 h-14 bg-white/5 text-muted-foreground border border-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all shadow-lg">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="font-bold text-xl tracking-tight text-white/90 group-hover:text-primary transition-colors">{value}</p>
    </div>
  </a>
);

export default Contact;
