import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Eye, FileText, 
  UserCheck, Globe, Database,
  ChevronRight, Menu, X, Clock,
  AlertCircle, ShieldCheck
} from 'lucide-react';

const Privacy = () => {
  const [activeSection, setActiveSection] = useState('collection');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'collection', title: '1. Data Collection', icon: Eye },
    { id: 'usage', title: '2. Data Usage', icon: FileText },
    { id: 'security', title: '3. Security Architecture', icon: ShieldCheck },
    { id: 'retention', title: '4. Data Retention', icon: Clock },
    { id: 'sharing', title: '5. Third-Party Sharing', icon: Globe },
    { id: 'rights', title: '6. Your Legal Rights', icon: UserCheck },
    { id: 'cookies', title: '7. Cookie Policy', icon: Database },
    { id: 'contact', title: '8. Data Inquiries', icon: AlertCircle },
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
              className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              <Shield className="w-3 h-3" /> Privacy Protocol v1.2.0
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-none">
              Privacy <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 pr-4">Policy.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed italic">
              Your data security is our absolute priority. This protocol outlines how SatByte AI collects, processes, and protects your industrial-grade academic data.
            </p>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 pt-8 border-t border-white/5">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Last Updated: May 14, 2026</span>
            <span className="hidden md:block w-1.5 h-1.5 bg-white/10 rounded-full" />
            <span className="hidden md:block">Certified Secure: AES-256 / TLS 1.3</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 py-20 relative">
        {/* 2. STICKY SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-32 space-y-10">
            <div className="space-y-6">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${
                      activeSection === section.id 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                      : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-emerald-500' : 'opacity-40'}`} />
                    {section.title.split('. ')[1]}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* 3. POLICY CONTENT LAYOUT */}
        <main className="lg:col-span-9 space-y-0">
          <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg prose-headings:font-black prose-headings:italic">
            
            <SectionHeading id="collection" title="1. Data Collection" icon={Eye} />
            <div className="space-y-6">
              <p>
                We collect minimal data required to provide our industrial-grade academic services. This includes:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="saas-card !p-8 border-emerald-500/10">
                  <h4 className="text-white font-black italic">Personal Info</h4>
                  <p className="text-sm">Name, email address, and institutional affiliation for account management.</p>
                </div>
                <div className="saas-card !p-8 border-emerald-500/10">
                  <h4 className="text-white font-black italic">Academic Data</h4>
                  <p className="text-sm">Exam scores, roll numbers (if provided), and study preferences for analytics.</p>
                </div>
              </div>
            </div>

            <SectionHeading id="usage" title="2. Data Usage" icon={FileText} />
            <div className="space-y-6">
              <p>
                Your data is used solely to provide personalized results, sync your study plans across devices, and manage your API credits.
              </p>
              <div className="p-8 bg-[#111] border border-white/5 rounded-3xl">
                <p className="text-sm font-bold text-white italic">"ScholarOS does not sell your academic performance data to recruiters or educational institutions without your explicit opt-in consent."</p>
              </div>
            </div>

            <SectionHeading id="security" title="3. Security Architecture" icon={ShieldCheck} />
            <div className="space-y-6">
              <p>
                We use industry-standard SSL/TLS 1.3 encryption for all data transfers. Your passwords are encrypted using **bcrypt** with advanced salting and are never stored in plain text.
              </p>
              <ul className="space-y-4 text-muted-foreground text-lg list-none p-0">
                <li className="flex gap-4"><ChevronRight className="w-5 h-5 text-emerald-500 shrink-0 mt-1" /> AES-256 encryption at rest for all database entries.</li>
                <li className="flex gap-4"><ChevronRight className="w-5 h-5 text-emerald-500 shrink-0 mt-1" /> Memory-based processing for PDF and Image tools.</li>
                <li className="flex gap-4"><ChevronRight className="w-5 h-5 text-emerald-500 shrink-0 mt-1" /> Regular automated security audits of our cloud clusters.</li>
              </ul>
            </div>

            <SectionHeading id="retention" title="4. Data Retention" icon={Clock} />
            <div className="space-y-6">
              <p>
                Files processed through our temporary tools (Image Compressor, PDF Suite) are held in ephemeral storage and are deleted automatically within 60 minutes of processing.
              </p>
            </div>

            <SectionHeading id="sharing" title="5. Third-Party Sharing" icon={Globe} />
            <div className="space-y-6">
              <p>
                We utilize trusted partners for specialized services:
              </p>
              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden p-8 space-y-4">
                <p className="text-sm font-bold text-white">Razorpay: Encrypted payment processing.</p>
                <p className="text-sm font-bold text-white">Google OAuth: Secure authentication provider.</p>
                <p className="text-sm font-bold text-white">Adsterra: Anonymous metadata for monetization.</p>
              </div>
            </div>

            <SectionHeading id="rights" title="6. Your Legal Rights" icon={UserCheck} />
            <div className="space-y-6">
              <p>
                You have the full right to access, export, or erase your data from our systems at any time.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {['Right to Erasure', 'Data Portability', 'Right to Rectification'].map((right, i) => (
                  <div key={i} className="px-6 py-3 bg-white/5 border border-white/5 rounded-full text-xs font-black uppercase tracking-widest text-emerald-400">
                    {right}
                  </div>
                ))}
              </div>
            </div>

            <SectionHeading id="cookies" title="7. Cookie Policy" icon={Database} />
            <div className="space-y-6">
              <p>
                We use persistent and session cookies to maintain your login state, track credit balances, and analyze system performance. Disabling cookies will significantly degrade the user experience.
              </p>
            </div>

            <SectionHeading id="contact" title="8. Data Inquiries" icon={AlertCircle} />
            <div className="space-y-6">
              <p>
                For any data-related requests or to report a privacy concern, please contact our Data Protection Officer:
              </p>
              <div className="saas-card !p-8 inline-flex items-center gap-6 group hover:border-emerald-500/50 transition-all">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">Data Protection Office</h4>
                  <p className="text-xs text-muted-foreground italic">privacy@satbyte.in</p>
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
                <div className="text-xs font-black uppercase tracking-widest text-emerald-500">Privacy Menu</div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/50"><X className="w-6 h-6" /></button>
              </div>
              <nav className="flex-1 space-y-4 overflow-y-auto custom-scrollbar">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full flex items-center gap-6 text-2xl font-black italic text-left py-4 border-b border-white/5"
                  >
                    <section.icon className="w-6 h-6 text-emerald-500" />
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
        className="lg:hidden fixed bottom-10 right-10 w-16 h-16 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center z-50 border-4 border-black active:scale-95 transition-all"
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Privacy;
