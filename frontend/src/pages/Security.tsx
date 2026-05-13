import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Lock, Shield, 
  Terminal, Server, Zap, Database,
  ChevronRight, Menu, X, Clock,
  ShieldAlert
} from 'lucide-react';

const Security = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'overview', title: '1. Security Overview', icon: ShieldCheck },
    { id: 'encryption', title: '2. Data Encryption', icon: Lock },
    { id: 'infrastructure', title: '3. Cloud Infrastructure', icon: Server },
    { id: 'auth', title: '4. Authentication', icon: Zap },
    { id: 'storage', title: '5. Ephemeral Storage', icon: Database },
    { id: 'api', title: '6. API Security', icon: Terminal },
    { id: 'audits', title: '7. Audits & Compliance', icon: Shield },
    { id: 'reporting', title: '8. Vulnerability Reporting', icon: ShieldAlert },
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
              <Lock className="w-3 h-3" /> Security Protocol v2.0.0
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-none">
              Platform <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 pr-4">Security.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed italic">
              Our commitment to protecting your academic and professional data through industrial-grade encryption and ephemeral cloud processing.
            </p>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 pt-8 border-t border-white/5">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Certification: AES-256 Validated</span>
            <span className="hidden md:block w-1.5 h-1.5 bg-white/10 rounded-full" />
            <span className="hidden md:block">Architecture: Zero-Retention Core</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 py-20 relative">
        {/* 2. STICKY SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-32 space-y-10">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${
                    activeSection === section.id 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-primary' : 'opacity-40'}`} />
                  {section.title.split('. ')[1]}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* 3. POLICY CONTENT LAYOUT */}
        <main className="lg:col-span-9 space-y-0">
          <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg prose-headings:font-black prose-headings:italic">
            
            <SectionHeading id="overview" title="1. Security Overview" icon={ShieldCheck} />
            <div className="space-y-6">
              <p>
                At Toolkit by SatByte, security is not an afterthought—it's the core of our "Student Operating System." We utilize a multi-layered security architecture designed to keep your data confidential and your processing secure.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="saas-card !p-8 bg-white/5 border-white/5 rounded-3xl">
                  <h4 className="text-white font-black italic">Defense in Depth</h4>
                  <p className="text-sm">Multiple independent security layers ensuring no single point of failure.</p>
                </div>
                <div className="saas-card !p-8 bg-white/5 border-white/5 rounded-3xl">
                  <h4 className="text-white font-black italic">Zero Trust</h4>
                  <p className="text-sm">We verify every request, whether it's from our internal frontend or a developer API.</p>
                </div>
              </div>
            </div>

            <SectionHeading id="encryption" title="2. Data Encryption" icon={Lock} />
            <div className="space-y-6">
              <p>
                All data transmitted to and from SatByte is encrypted using **TLS 1.3** protocols. At rest, sensitive information is protected using **AES-256** industrial-grade encryption.
              </p>
              <div className="bg-[#111] border border-white/5 p-8 rounded-3xl">
                <p className="text-sm italic font-bold text-primary">"Your data is encrypted before it ever touches our persistent storage layers."</p>
              </div>
            </div>

            <SectionHeading id="infrastructure" title="3. Cloud Infrastructure" icon={Server} />
            <div className="space-y-6">
              <p>
                Our services are hosted on enterprise-grade cloud providers with 99.99% uptime and physical security certifications. We utilize containerized microservices to isolate different tools, ensuring that a vulnerability in one tool cannot compromise another.
              </p>
            </div>

            <SectionHeading id="auth" title="4. Authentication" icon={Zap} />
            <div className="space-y-6">
              <p>
                We use **JSON Web Tokens (JWT)** for session management and **bcrypt** for password hashing. We recommend all users enable two-factor authentication where available.
              </p>
            </div>

            <SectionHeading id="storage" title="5. Ephemeral Storage" icon={Database} />
            <div className="space-y-6">
              <p>
                Our most critical security feature is our **Zero-Retention Core**. Files processed through our utility tools (Images, PDFs) are kept in RAM or temporary encrypted volumes and are purged automatically within 60 minutes.
              </p>
              <ul className="list-none p-0 space-y-4">
                <li className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5"><ChevronRight className="text-primary w-5 h-5 shrink-0" /> **Automatic Purge**: All temp files deleted after use.</li>
                <li className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5"><ChevronRight className="text-primary w-5 h-5 shrink-0" /> **RAM-Only Processing**: Heavy PDF tasks utilize high-speed, volatile memory.</li>
              </ul>
            </div>

            <SectionHeading id="api" title="6. API Security" icon={Terminal} />
            <div className="space-y-6">
              <p>
                SatByte Developer APIs are protected via unique API keys. We implement advanced rate limiting and IP-based filtering to prevent brute-force attacks and service abuse.
              </p>
            </div>

            <SectionHeading id="audits" title="7. Audits & Compliance" icon={Shield} />
            <div className="space-y-6">
              <p>
                We perform weekly automated vulnerability scans and quarterly manual security reviews of our entire codebase and infrastructure.
              </p>
            </div>

            <SectionHeading id="reporting" title="8. Vulnerability Reporting" icon={ShieldAlert} />
            <div className="space-y-6">
              <p>
                We welcome reports from the security community. If you discover a vulnerability, please report it to our security team immediately at security@satbyte.in.
              </p>
            </div>

          </div>
        </main>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col h-full p-8 space-y-10">
              <div className="flex justify-between items-center">
                <div className="text-xs font-black uppercase tracking-widest text-primary">Security Menu</div>
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

export default Security;
