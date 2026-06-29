import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Eye, Lock, 
  Settings, Globe, Cpu, UserCheck, 
  ChevronRight, Clock, X, Menu,
  AlertCircle, ShieldCheck, Terminal, CreditCard
} from 'lucide-react';

const CookiePolicy = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'intro', title: '1. Introduction', icon: Database },
    { id: 'what-are-cookies', title: '2. What are Cookies', icon: Eye },
    { id: 'types', title: '3. Types of Cookies', icon: Settings },
    { id: 'analytics', title: '4. Analytics Usage', icon: Globe },
    { id: 'auth', title: '5. Authentication', icon: Lock },
    { id: 'preferences', title: '6. User Preferences', icon: UserCheck },
    { id: 'advertising', title: '7. Advertising', icon: CreditCard },
    { id: 'third-party', title: '8. Third Parties', icon: Terminal },
    { id: 'control', title: '9. Cookie Control', icon: Cpu },
    { id: 'contact', title: '10. Data Contact', icon: AlertCircle },
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
        <div className="w-12 h-12 bg-muted/50 rounded-2xl flex items-center justify-center text-primary border border-border group-hover:border-primary/30 transition-all">
          <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-black tracking-tight italic text-foreground">{title}</h2>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden border-b border-border bg-card/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10" />
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest"
            >
              <ShieldCheck className="w-3 h-3" /> Tracking Protocol v1.0.0
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-none text-foreground">
              Cookie <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 pr-4">Policy.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed italic">
              How Toolkit by SatByte uses cookies and similar technologies to improve functionality, analytics, security, and your overall user experience.
            </p>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 pt-8 border-t border-border">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Last Updated: May 14, 2026</span>
            <span className="hidden md:block w-1.5 h-1.5 bg-border rounded-full" />
            <span className="hidden md:block">Transparency Level: Absolute</span>
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
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
          <div className="prose dark:prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg prose-headings:font-black prose-headings:italic">
            
            <SectionHeading id="intro" title="1. Introduction" icon={Database} />
            <div className="space-y-6">
              <p>
                At Toolkit by SatByte, we believe in being clear and open about how we collect and use data related to you. This Cookie Policy applies to any SatByte product or service that links to this policy or incorporates it by reference.
              </p>
              <p>
                We use cookies and similar technologies to recognize you when you visit our services. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
              </p>
            </div>

            <SectionHeading id="what-are-cookies" title="2. What are Cookies?" icon={Eye} />
            <div className="space-y-6">
              <p>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
              <div className="saas-card !p-8 bg-muted border border-border rounded-3xl">
                <p className="text-sm italic font-medium">"Think of cookies as a memory for the web. They help us remember your preferences and keep you logged in across different sessions."</p>
              </div>
            </div>

            <SectionHeading id="types" title="3. Types of Cookies we use" icon={Settings} />
            <div className="space-y-6">
              <p>
                We use the following categories of cookies on our platform:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="saas-card !p-8 border-primary/20 bg-primary/5">
                  <h4 className="text-foreground font-black italic">Essential Cookies</h4>
                  <p className="text-sm">Strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.</p>
                </div>
                <div className="saas-card !p-8 border-blue-500/10">
                  <h4 className="text-foreground font-black italic">Performance Cookies</h4>
                  <p className="text-sm">These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use.</p>
                </div>
              </div>
            </div>

            <SectionHeading id="analytics" title="4. Analytics Usage" icon={Globe} />
            <div className="space-y-6">
              <p>
                We use analytics cookies (primarily Google Analytics) to understand how visitors interact with our platform. This helps us identify which tools are most popular and where we can improve the user interface.
              </p>
              <p>
                The information collected is aggregated and anonymous. It does not identify you personally.
              </p>
            </div>

            <SectionHeading id="auth" title="5. Authentication" icon={Lock} />
            <div className="space-y-6">
              <p>
                If you're signed in to our services, cookies help us show you the right information and personalize your experience. We use session cookies to keep you logged in as you navigate between our different productivity tools.
              </p>
            </div>

            <SectionHeading id="preferences" title="6. User Preferences" icon={UserCheck} />
            <div className="space-y-6">
              <p>
                Cookies allow us to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personal features. For example, remembering your last used exam in the Rank Predictor.
              </p>
            </div>

            <SectionHeading id="advertising" title="7. Advertising" icon={CreditCard} />
            <div className="space-y-6">
              <p>
                We use third-party advertising partners (like Adsterra) to help support the platform. These partners may use cookies to serve ads that are relevant to your interests and to measure the effectiveness of advertising campaigns.
              </p>
            </div>

            <SectionHeading id="third-party" title="8. Third-Party Services" icon={Terminal} />
            <div className="space-y-6">
              <p>
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.
              </p>
              <ul className="list-none p-0 space-y-4">
                <li className="flex gap-4 p-4 bg-muted rounded-2xl border border-border"><ChevronRight className="text-primary w-5 h-5 shrink-0" /> **Razorpay**: For secure, persistent payment session tracking.</li>
                <li className="flex gap-4 p-4 bg-muted rounded-2xl border border-border"><ChevronRight className="text-primary w-5 h-5 shrink-0" /> **Google OAuth**: For maintaining secure login sessions.</li>
              </ul>
            </div>

            <SectionHeading id="control" title="9. Cookie Control" icon={Cpu} />
            <div className="space-y-6">
              <p>
                You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies.
              </p>
              <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-3xl">
                <p className="text-sm font-bold text-rose-200 italic flex gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                </p>
              </div>
            </div>

            <SectionHeading id="contact" title="10. Data Contact" icon={AlertCircle} />
            <div className="space-y-6">
              <p>
                If you have any questions about our use of cookies or other technologies, please email us at privacy@satbyte.in.
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
                <div className="text-xs font-black uppercase tracking-widest text-primary">Cookie Menu</div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-muted-foreground"><X className="w-6 h-6" /></button>
              </div>
              <nav className="flex-1 space-y-4 overflow-y-auto custom-scrollbar">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full flex items-center gap-6 text-2xl font-black italic text-left py-4 border-b border-border"
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
        className="lg:hidden fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50 border-4 border-background active:scale-95 transition-all"
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
};

export default CookiePolicy;
