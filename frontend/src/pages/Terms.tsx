import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Gavel, Scale, 
  Terminal, Cpu, Lock, 
  CreditCard, UserCheck, AlertTriangle, 
  MessageSquare, ChevronRight, Menu, X,
  Clock, Bookmark
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'intro', title: '1. Introduction', icon: Gavel },
    { id: 'accounts', title: '2. Accounts & Security', icon: Lock },
    { id: 'tool-usage', title: '3. Tool Usage Policy', icon: Cpu },
    { id: 'api-usage', title: '4. API & Platform', icon: Terminal },
    { id: 'payments', title: '5. Payments & Billing', icon: CreditCard },
    { id: 'responsibilities', title: '6. Responsibilities', icon: UserCheck },
    { id: 'privacy', title: '7. Privacy & Security', icon: Shield },
    { id: 'ip', title: '8. Intellectual Property', icon: Scale },
    { id: 'liability', title: '9. Limitations', icon: AlertTriangle },
    { id: 'termination', title: '10. Termination', icon: Clock },
    { id: 'contact', title: '11. Contact', icon: MessageSquare },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const SectionHeading = ({ id, title, icon: Icon }: any) => (
    <div id={id} className="pt-24 first:pt-0 group">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/5 group-hover:border-primary/30 transition-all">
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-black tracking-tight italic text-white">{title}</h2>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden border-b border-white/5 bg-[#080808]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10" />
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              <Bookmark className="w-3 h-3" /> Legal Core v2.5.0
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-none">
              Terms & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 pr-4">Conditions.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed italic">
              These terms govern the use of Toolkit by SatByte, our tools, APIs, and cloud services. By using our platform, you agree to these protocols.
            </p>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 pt-8 border-t border-white/5">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Last Updated: May 14, 2026</span>
            <span className="hidden md:block w-1.5 h-1.5 bg-white/10 rounded-full" />
            <span className="hidden md:block">Jurisdiction: SatByte Global Cloud</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 py-20 relative">
        {/* 2. STICKY SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-32 space-y-10">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 px-4">Navigation</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${
                      activeSection === section.id 
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' 
                      : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-primary' : 'opacity-40'}`} />
                    {section.title.split('. ')[1]}
                  </button>
                ))}
              </nav>
            </div>

            <div className="saas-card !p-8 space-y-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
               <p className="text-[10px] font-black text-white uppercase tracking-widest">Compliance Team</p>
               <p className="text-xs text-muted-foreground font-medium italic">Have questions about our data protocols?</p>
               <Link to="/contact" className="w-full saas-button-primary !py-3 text-[10px] font-black uppercase flex items-center justify-center gap-2">
                 <MessageSquare className="w-3 h-3" /> Contact Legal
               </Link>
            </div>
          </div>
        </aside>

        {/* 3. LEGAL CONTENT LAYOUT */}
        <main className="lg:col-span-9 space-y-0">
          <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg prose-headings:font-black prose-headings:italic">
            
            {/* Introduction */}
            <SectionHeading id="intro" title="1. Introduction" icon={Gavel} />
            <div className="space-y-6">
              <p>
                By accessing and using the SatByte AI ScholarOS ("ScholarOS"), you acknowledge and agree to be bound by the following terms and conditions. These terms constitute a legally binding agreement between you ("User") and SatByte AI ("Company").
              </p>
              <p>
                The materials contained in this website are protected by applicable copyright and trademark law. You are granted a limited, non-exclusive, non-transferable license to access the tools for personal, academic, or professional use subject to these terms.
              </p>
              <div className="bg-[#111] border border-white/5 p-8 rounded-3xl space-y-4">
                <p className="text-sm font-bold text-white italic">"Our mission is to provide industrial-grade utility tools while maintaining the highest standards of user privacy and data security."</p>
              </div>
            </div>

            {/* Accounts */}
            <SectionHeading id="accounts" title="2. Accounts & Security" icon={Lock} />
            <div className="space-y-6">
              <p>
                To access certain features of the platform, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <ul className="space-y-4 text-muted-foreground text-lg list-none p-0">
                <li className="flex gap-4"><ChevronRight className="w-5 h-5 text-primary shrink-0 mt-1" /> You must provide accurate and complete information.</li>
                <li className="flex gap-4"><ChevronRight className="w-5 h-5 text-primary shrink-0 mt-1" /> You are prohibited from sharing your account or API keys with unauthorized third parties.</li>
                <li className="flex gap-4"><ChevronRight className="w-5 h-5 text-primary shrink-0 mt-1" /> We reserve the right to suspend accounts that show signs of suspicious activity or abuse.</li>
              </ul>
            </div>

            {/* Tool Usage */}
            <SectionHeading id="tool-usage" title="3. Tool Usage Policy" icon={Cpu} />
            <div className="space-y-6">
              <p>
                ScholarOS provides a variety of browser-based and server-side tools (Image Compressor, PDF Suite, Rank Predictor, etc.). Usage of these tools is subject to the following rules:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="saas-card !p-8 space-y-4">
                  <h4 className="text-white font-black italic">Ephemeral Processing</h4>
                  <p className="text-sm">Files uploaded for compression or conversion are processed in ephemeral memory and are never stored permanently unless you explicitly save them to your cloud dashboard.</p>
                </div>
                <div className="saas-card !p-8 space-y-4">
                  <h4 className="text-white font-black italic">Fair Usage</h4>
                  <p className="text-sm">Automated scraping or bulk processing via browser-only tools is strictly prohibited and may result in a temporary or permanent IP block.</p>
                </div>
              </div>
            </div>

            {/* API & Platform */}
            <SectionHeading id="api-usage" title="4. API & Platform Usage" icon={Terminal} />
            <div className="space-y-6">
              <p>
                The SatByte Developer API allows for programmatic access to our tools. API usage is governed by specific rate limits and security protocols:
              </p>
              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden">
                <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">System Protocol</span>
                  <Terminal className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="p-8 space-y-4">
                  <p className="text-sm text-white/70 font-mono">1. Rate Limiting: 60 requests per minute for Free Tier.</p>
                  <p className="text-sm text-white/70 font-mono">2. Quotas: Credits are deducted based on the complexity of the operation.</p>
                  <p className="text-sm text-white/70 font-mono">3. Abuse: Reverse engineering our API or using it to host competing services is forbidden.</p>
                </div>
              </div>
            </div>

            {/* Payments */}
            <SectionHeading id="payments" title="5. Payments & Subscriptions" icon={CreditCard} />
            <div className="space-y-6">
              <p>
                ScholarOS operates on a credit-based system and subscription tiers. 
              </p>
              <p>
                Credits are non-refundable and non-transferable. Subscription plans are billed monthly or annually and can be cancelled at any time, but no partial refunds will be issued for remaining billing cycles. In the event of a verified technical failure, we may issue credit restorations at our discretion.
              </p>
            </div>

            {/* User Responsibilities */}
            <SectionHeading id="responsibilities" title="6. User Responsibilities" icon={UserCheck} />
            <div className="space-y-6">
              <p>
                You represent and warrant that you own or have the necessary rights to all content you upload to our platform. You agree not to use the service to process:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                {['Copyrighted material without permission', 'Malicious software or scripts', 'Personally Identifiable Information of others', 'Illegal or harmful content'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl text-sm font-medium italic">
                    <X className="w-4 h-4 text-rose-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Privacy */}
            <SectionHeading id="privacy" title="7. Privacy & Security" icon={Shield} />
            <div className="space-y-6">
              <p>
                We utilize AES-256 encryption at rest and TLS 1.3 in transit. We do not sell your academic performance data to third-party recruiters without your explicit opt-in consent.
              </p>
              <p>
                We use cookies to maintain your login state and analyze platform performance. By using the platform, you consent to our use of these essential and analytical cookies.
              </p>
            </div>

            {/* Intellectual Property */}
            <SectionHeading id="ip" title="8. Intellectual Property" icon={Scale} />
            <div className="space-y-6">
              <p>
                All platform infrastructure, algorithms, branding, and designs are the exclusive property of SatByte AI. You may not copy, reverse engineer, or redistribute our platform components.
              </p>
              <p>
                Any content generated by the tools (e.g., converted PDFs, compressed images) remains the intellectual property of the User. SatByte AI is granted a temporary license to process this data solely to provide the service.
              </p>
            </div>

            {/* Liability */}
            <SectionHeading id="liability" title="9. Limitation of Liability" icon={AlertTriangle} />
            <div className="space-y-6">
              <p>
                The Rank Predictor and Percentile Engine provide educational estimates based on historical data. These are NOT official results. SatByte AI is not responsible for any academic or financial decisions made based on these predictions.
              </p>
              <p>
                We provide the platform "as is" and "as available" without any warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service.
              </p>
            </div>

            {/* Termination */}
            <SectionHeading id="termination" title="10. Termination" icon={Clock} />
            <div className="space-y-6">
              <p>
                We reserve the right to terminate or suspend your access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use the service will immediately cease. Any credits remaining in your account will be forfeited.
              </p>
            </div>

            {/* Contact */}
            <SectionHeading id="contact" title="11. Contact & Support" icon={MessageSquare} />
            <div className="space-y-12">
              <p>
                If you have any questions regarding our legal framework or wish to report a security vulnerability, please reach out to our team.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="saas-card !p-8 flex items-center gap-6 group hover:border-primary/50 transition-all">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-white">Legal Inquiries</h4>
                    <p className="text-xs text-muted-foreground italic">legal@satbyte.in</p>
                  </div>
                </div>
                <div className="saas-card !p-8 flex items-center gap-6 group hover:border-primary/50 transition-all">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-white">Developer Support</h4>
                    <p className="text-xs text-muted-foreground italic">api@satbyte.in</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col h-full p-8 space-y-10">
              <div className="flex justify-between items-center">
                <div className="text-xs font-black uppercase tracking-widest text-primary">Legal Menu</div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/50"><X className="w-6 h-6" /></button>
              </div>
              <nav className="flex-1 space-y-4 overflow-y-auto custom-scrollbar">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full flex items-center gap-6 text-2xl font-black italic text-left py-4 border-b border-white/5"
                  >
                    <section.icon className="w-6 h-6 text-primary" />
                    {section.title.split('. ')[1]}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50 border-4 border-black active:scale-95 transition-all"
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Terms;
