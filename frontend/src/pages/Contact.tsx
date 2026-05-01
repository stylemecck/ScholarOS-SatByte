import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-16">
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tight"
        >
          Get in <span className="text-primary">Touch</span>
        </motion.h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Have questions or feedback? We'd love to hear from you. Our team usually responds within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="bg-card border border-border p-8 rounded-[3rem] shadow-xl space-y-8">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary" />
              Contact Details
            </h3>
            
            <div className="space-y-6">
              <ContactCard 
                icon={<Mail className="w-5 h-5" />} 
                label="Email Us" 
                value="satyam91081@gmail.com" 
                href="mailto:satyam91081@gmail.com"
              />
              <ContactCard 
                icon={<Phone className="w-5 h-5" />} 
                label="Call Us" 
                value="+91 9199499081" 
                href="tel:+919199499081"
              />
              <ContactCard 
                icon={<MapPin className="w-5 h-5" />} 
                label="Location" 
                value="New Delhi, India" 
                href="#"
              />
            </div>
          </div>

          <div className="p-8 bg-primary/5 rounded-[3rem] border border-primary/10">
            <p className="text-sm font-medium text-muted-foreground italic">
              "We are dedicated to building tools that help students achieve their dreams. Your feedback helps us grow."
            </p>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Full Name</label>
                <input 
                  type="text" required placeholder="John Doe"
                  className="w-full px-5 py-4 rounded-2xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Email</label>
                <input 
                  type="email" required placeholder="john@example.com"
                  className="w-full px-5 py-4 rounded-2xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Subject</label>
              <input 
                type="text" required placeholder="How can we help?"
                className="w-full px-5 py-4 rounded-2xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Message</label>
              <textarea 
                required placeholder="Your message here..."
                className="w-full px-5 py-4 rounded-2xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all min-h-[150px] resize-none"
              />
            </div>
            <button 
              type="submit"
              disabled={status !== 'idle'}
              className="w-full py-5 bg-primary text-primary-foreground rounded-[2rem] font-black text-xl shadow-xl hover:shadow-primary/25 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {status === 'idle' && <><Send className="w-6 h-6" /> Send Message</>}
              {status === 'sending' && <span className="animate-pulse">Sending...</span>}
              {status === 'sent' && <>Message Sent Successfully!</>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const ContactCard = ({ icon, label, value, href }: any) => (
  <a href={href} className="flex items-center gap-5 p-4 rounded-2xl hover:bg-muted/50 transition-all group">
    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
      <p className="font-bold text-lg">{value}</p>
    </div>
  </a>
);

export default Contact;
