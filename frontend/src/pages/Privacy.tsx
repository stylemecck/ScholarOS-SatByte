import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, CheckCircle } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      title: "Data Collection",
      icon: <Eye className="w-6 h-6" />,
      content: "We collect minimal data required to provide our services. This includes your name, email address, and any study data you explicitly choose to save in your profile. We do not track your browsing history or sell your personal information."
    },
    {
      title: "How We Use Data",
      icon: <FileText className="w-6 h-6" />,
      content: "Your data is used solely to provide personalized tool results, sync your study plans across devices, and manage your AI credits. We use anonymous aggregated data to improve our AI models."
    },
    {
      title: "Security Measures",
      icon: <Lock className="w-6 h-6" />,
      content: "We use industry-standard SSL/TLS encryption for all data transfers. Your passwords are encrypted using strong hashing algorithms (bcrypt) and are never stored in plain text."
    },
    {
      title: "Third-Party Services",
      icon: <Shield className="w-6 h-6" />,
      content: "We use trusted third-party services like Google OAuth for secure login and Razorpay for encrypted payment processing. These services have their own strict privacy policies."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-16">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl mb-4"
        >
          <Shield className="w-10 h-10" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">Privacy <span className="text-primary">Policy</span></h1>
        <p className="text-muted-foreground text-lg">Your data security is our top priority. Learn how we protect your information.</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all flex gap-6"
          >
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
              {section.icon}
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight">{section.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {section.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-muted/50 p-10 rounded-[3rem] border border-border text-center space-y-6">
        <h3 className="text-2xl font-black">Your Rights</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          You have the right to access, export, or delete your data at any time. Simply visit your dashboard or contact our support team for any data-related requests.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full text-xs font-bold border border-border">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Right to Erasure
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full text-xs font-bold border border-border">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Data Portability
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full text-xs font-bold border border-border">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> Right to Rectification
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground font-bold uppercase tracking-widest">
        Last Updated: May 2026
      </div>
    </div>
  );
};

export default Privacy;
