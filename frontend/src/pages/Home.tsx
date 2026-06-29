import { useState } from 'react';
import { tools } from '../utils/toolsConfig';
import ToolCard from '../components/ToolCard';
import { 
  Search, Zap, Sparkles, ShieldCheck, Star, Users, ArrowRight, 
  BarChart3, Rocket, Calendar, GraduationCap, Check, HelpCircle, 
  ChevronDown, ChevronRight, FileText, Play, Briefcase, Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [previewTab, setPreviewTab] = useState<'launchpad' | 'planner' | 'enhancer' | 'predictor'>('launchpad');
  
  // Interactive bullet enhancer state
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedBullet, setEnhancedBullet] = useState('I managed a student group and ran events.');
  const [showEnhanced, setShowEnhanced] = useState(false);

  // Pricing calculator state
  const [creditSlider, setCreditSlider] = useState(2); // index of steps

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = ['All', 'PDF', 'Image', 'Academic', 'Exam', 'Utility'];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const triggerEnhance = () => {
    setIsEnhancing(true);
    setTimeout(() => {
      setEnhancedBullet('Spearheaded operations for student tech organization, coordinating 6 major seminars for 1,200+ attendees while optimizing resource allocation by 30%.');
      setIsEnhancing(false);
      setShowEnhanced(true);
    }, 1200);
  };

  const resetEnhancer = () => {
    setEnhancedBullet('I managed a student group and ran events.');
    setShowEnhanced(false);
  };

  const pricingTiers = [
    { label: 'Free Trial', price: '₹0', credits: '1,000 credits/mo', desc: 'Ideal for casual students exploring predictions.', features: ['1,000 API Requests', 'Standard Support', '5MB File Limits'] },
    { label: 'Student Achiever', price: '₹49', credits: '10,000 credits/mo', desc: 'Perfect for active exam prep & resumes.', features: ['10,000 API Requests', 'Priority Process Queue', '25MB File Limits', 'ATS Enhancer'] },
    { label: 'Academic Power', price: '₹99', credits: '50,000 credits/mo', desc: 'Our most popular plan for power users.', features: ['50,000 API Requests', 'Instant Priority Queue', '100MB File Limits', 'ATS Enhancer (Unlimited)', 'Email Support'] },
    { label: 'Institution Elite', price: '₹499', credits: 'Unlimited', desc: 'Best for college teams and API integrations.', features: ['Unlimited Workspace Requests', 'Whitelabel Export Mode', '1GB File Limits', '99.9% Server SLA', '24/7 Dedicated Support'] }
  ];

  const faqs = [
    { q: 'What is ScholarOS?', a: 'ScholarOS is an all-in-one SEO, PDF generation, and student success workspace. Developed by SatByte Technologies, it brings together academic planners, AI admission predictors, ATS-compatible resume enhancers, and a full media/PDF studio into a single sleek MERN-stack subscription dashboard.' },
    { q: 'How does the credit system work?', a: 'Every module requires a small amount of credits to run (e.g. 1 credit for PDF conversion, 2 credits for Gemini AI Rank Predictions). Free users get 1,000 credits monthly, while Pro users enjoy up to 50,000 or unlimited credits.' },
    { q: 'Is my data secure?', a: 'Absolutely. ScholarOS has been designed with strict privacy standards. Your academic papers, CGPA calculations, and resume fields are securely stored in your local session or encrypted MongoDB databases. We never sell your data.' },
    { q: 'Can I cancel my subscription anytime?', a: 'Yes. You can cancel your subscription at any time via your billing setting tab. Your active credits and limits will remain valid until the end of your billing cycle.' }
  ];

  return (
    <div className="space-y-24 md:space-y-36 pb-20 md:pb-32 bg-background text-foreground transition-colors duration-300">
      <SEO 
        title="ScholarOS - SEO, PDF Generation & AI Rank Predictor"
        description="Redesigned student, developer, and exam success hub by SatByte Technologies. Predict ranks, generate intelligent study roadmaps, and build ATS-ready resumes with high-performance AI."
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "ScholarOS",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
          }
        }}
      />

      {/* Premium Hero Section */}
      <section className="relative pt-24 pb-12 px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-8 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/[0.04] text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20 shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> The Academic Operating System
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.9] text-foreground"
            >
              Academic Success <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500 italic pr-4">Automated.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed"
            >
              The unified SaaS workspace for college students. Predict exam ranks, enhance resume bullet points, map 7-day study tracks, and organize documents.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/signup" className="saas-button-primary !px-10 !py-5 flex items-center gap-3 text-sm">
              Create Your Workspace <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#tools" className="saas-button-secondary !px-10 !py-5 flex items-center gap-2 text-sm">
              Browse Modules <Zap className="w-4 h-4" />
            </a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-8 flex flex-wrap justify-center items-center gap-4 md:gap-8 opacity-60 transition-all duration-700 text-foreground"
          >
            <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
              <Users className="w-4 h-4 text-primary" /> 10,000+ Active Workspaces
            </div>
            <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure MongoDB Cloud
            </div>
            <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
              <Star className="w-4 h-4 text-amber-500" /> 4.9/5 Student Rating
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive App Preview Mockup */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="relative group rounded-[2.5rem] border border-border/50 bg-card p-4 shadow-sm overflow-hidden">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2.5rem] blur-xl opacity-35" />
          
          <div className="relative bg-card rounded-[2rem] border border-border/40 overflow-hidden flex flex-col md:flex-row h-[550px] shadow-inner">
            {/* Mockup Sidebar */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border/40 p-6 flex flex-row md:flex-col gap-2 overflow-x-auto shrink-0 bg-muted/40">
              <div className="hidden md:flex items-center gap-3 mb-6 px-2">
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                  <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-foreground">ScholarOS Console</span>
              </div>
              
              {[
                { id: 'launchpad', label: '🚀 Suite Launchpad' },
                { id: 'planner', label: '📅 AI Study Planner' },
                { id: 'enhancer', label: '💼 ATS Bullet Enhancer' },
                { id: 'predictor', label: '📊 Entrance Predictor' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setPreviewTab(tab.id as any)}
                  className={`
                    px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-left transition-all shrink-0 w-auto md:w-full flex items-center justify-between
                    ${previewTab === tab.id 
                      ? 'bg-primary/15 border border-primary/30 text-primary' 
                      : 'border border-transparent text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground'}
                  `}
                >
                  {tab.label}
                  <ChevronRight className="w-3.5 h-3.5 hidden md:block" />
                </button>
              ))}
            </div>

            {/* Mockup Main Viewport */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-background/85 relative">
              <AnimatePresence mode="wait">
                {previewTab === 'launchpad' && (
                  <motion.div
                    key="launchpad"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">Suite Modules</span>
                      <h3 className="text-2xl font-black text-foreground italic">Select a Productivity Module</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { title: 'Rank Predictor', desc: 'Predict JEE / CUET standing', icon: BarChart3 },
                        { title: 'Resume Enhancer', desc: 'Build ATS-perfect resume', icon: Briefcase },
                        { title: 'PDF Suite', desc: 'Merge, Compress & Extract', icon: FileText },
                        { title: 'Study Planner', desc: 'Gemini custom study tracker', icon: Calendar },
                        { title: 'Grade Ledger', desc: 'CGPA & attendance goals', icon: GraduationCap },
                        { title: 'Credits Wallet', desc: 'Gift or add tokens', icon: Coins }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-card border border-border/40 rounded-2xl p-4 hover:border-primary/20 transition-all flex gap-3 items-start group shadow-sm">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/15 group-hover:scale-105 transition-transform shrink-0">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                            <p className="text-[9px] text-muted-foreground mt-0.5 line-clamp-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {previewTab === 'planner' && (
                  <motion.div
                    key="planner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 px-3 py-1 bg-emerald-500/10 rounded-full">GenAI Scheduler</span>
                        <h3 className="text-2xl font-black text-foreground italic">Study Roadmap: JEE Prep</h3>
                      </div>
                      <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                        7 Days Planned
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { day: 'Day 1', subject: 'Physics: Rotation Mechanics', time: '3 hrs', priority: 'High', color: 'text-rose-500 bg-rose-500/10' },
                        { day: 'Day 2', subject: 'Chemistry: Organic Compounds', time: '2.5 hrs', priority: 'Medium', color: 'text-amber-500 bg-amber-500/10' },
                        { day: 'Day 3', subject: 'Mathematics: Coordinate Geometry', time: '4 hrs', priority: 'High', color: 'text-rose-500 bg-rose-500/10' }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-card border border-border/40 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-black text-muted-foreground">{item.day}</span>
                            <div>
                              <h4 className="text-xs font-bold text-foreground">{item.subject}</h4>
                              <p className="text-[9px] text-muted-foreground font-medium">Estimated: {item.time}</p>
                            </div>
                          </div>
                          <span className={`text-[8px] font-black uppercase px-2 py-1 rounded ${item.color}`}>
                            {item.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {previewTab === 'enhancer' && (
                  <motion.div
                    key="enhancer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 px-3 py-1 bg-indigo-400/10 rounded-full">ATS Career Tool</span>
                      <h3 className="text-2xl font-black text-foreground italic">ATS Bullet Optimization</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-muted border border-border/30 p-4 rounded-2xl space-y-2">
                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Student Input Bullet</span>
                        <p className="text-xs text-muted-foreground leading-relaxed italic">"I managed a student group and ran events."</p>
                      </div>

                      <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl space-y-2 min-h-24 flex flex-col justify-between">
                        <div>
                          <span className="text-[8px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 fill-current" /> AI Optimised ATS Bullet
                          </span>
                          {isEnhancing ? (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 animate-pulse">
                              <span className="animate-spin text-primary">⚡</span> Processing enhancements...
                            </div>
                          ) : (
                            <p className="text-xs text-foreground leading-relaxed font-bold mt-2">
                              {enhancedBullet}
                            </p>
                          )}
                        </div>
                        {showEnhanced && (
                          <button onClick={resetEnhancer} className="text-[8px] font-black text-muted-foreground hover:text-foreground uppercase tracking-widest mt-2 block w-fit">
                            Reset
                          </button>
                        )}
                      </div>
                    </div>

                    {!showEnhanced && !isEnhancing && (
                      <button 
                        onClick={triggerEnhance}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Enhance Bullet Point
                      </button>
                    )}
                  </motion.div>
                )}

                {previewTab === 'predictor' && (
                  <motion.div
                    key="predictor"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 px-3 py-1 bg-amber-500/10 rounded-full">Entrance Predictor</span>
                      <h3 className="text-2xl font-black text-foreground italic">Mock JEE Analytics</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-card border border-border/40 p-4 rounded-2xl text-center shadow-sm">
                        <span className="text-[8px] font-black text-muted-foreground uppercase">Estimated Percentile</span>
                        <p className="text-2xl font-black text-foreground italic mt-1">98.4 %</p>
                      </div>
                      <div className="bg-card border border-border/40 p-4 rounded-2xl text-center shadow-sm">
                        <span className="text-[8px] font-black text-muted-foreground uppercase">Predicted Rank</span>
                        <p className="text-2xl font-black text-primary italic mt-1">16,840</p>
                      </div>
                    </div>

                    <div className="bg-card border border-border/40 rounded-2xl p-4 space-y-3 shadow-sm">
                      <h4 className="text-xs font-bold text-foreground">Eligible Top Institutions</h4>
                      <div className="space-y-2">
                        {[
                          { name: 'NIT Trichy', cutoff: '12,500 - 18,200', chance: '94%', color: 'w-[94%] bg-emerald-500' },
                          { name: 'IIIT Allahabad', cutoff: '14,000 - 19,500', chance: '87%', color: 'w-[87%] bg-indigo-500' }
                        ].map((col, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-medium">
                              <span className="text-foreground font-bold">{col.name} <span className="text-muted-foreground text-[8px] font-medium ml-2">Cutoff: {col.cutoff}</span></span>
                              <span className="text-primary font-bold">{col.chance} Chance</span>
                            </div>
                            <div className="h-1.5 w-full bg-foreground/[0.08] rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${col.color}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Rebranded Features Bento Grid */}
      <section className="px-4 max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-l-4 border-primary pl-6 gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground uppercase italic">Product Suite</h2>
            <p className="text-muted-foreground font-medium">Four integrated suites designed to coordinate your student workflow.</p>
          </div>
          <span className="text-xs font-black text-primary uppercase tracking-[0.2em] bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl">
            20+ Modules Integrated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Block 1: Rank Predictor (Large) */}
          <Link to="/tools/rank-predictor" className="md:col-span-8 group relative overflow-hidden saas-card !p-0 h-[450px] md:h-[500px] flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-700" />
            
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-1000">
              <BarChart3 className="w-80 h-80 text-primary" />
            </div>

            <div className="relative z-20 p-10 md:p-14 space-y-4">
              <div className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/20 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="w-3 h-3" /> Predictive AI Suite
              </div>
              <h3 className="text-4xl md:text-6xl font-black leading-none tracking-tighter text-foreground">AI Entrance Predictor</h3>
              <p className="max-w-md text-base text-muted-foreground font-medium leading-relaxed">
                Calculate normalized shift difficulties and predict ranks for JEE, CUET PG, NIMCET and state college entrances instantly.
              </p>
            </div>
          </Link>

          {/* Bento Block 2: Resume (Side) */}
          <Link to="/tools/resume-builder" className="md:col-span-4 group saas-card flex flex-col justify-between overflow-hidden relative min-h-[300px]">
            <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 rounded-bl-full -mr-10 -mt-10 blur-xl group-hover:bg-indigo-500/10 transition-all" />
            <Rocket className="w-10 h-10 text-indigo-500 mb-8 group-hover:translate-y-[-4px] transition-transform" />
            <div className="space-y-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Career Accelerator</div>
              <h3 className="text-2xl font-black text-foreground">Resume Studio</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">AI summary writers, ATS formatting checkers, and bullet enhancement.</p>
            </div>
          </Link>

          {/* Bento Block 3: PDF (Side) */}
          <Link to="/tools/pdf/merge" className="md:col-span-4 group saas-card flex flex-col justify-between overflow-hidden relative min-h-[300px]">
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/5 rounded-bl-full -mr-10 -mt-10 blur-xl group-hover:bg-purple-500/10 transition-all" />
            <Zap className="w-10 h-10 text-purple-500 mb-8 group-hover:scale-110 transition-transform" />
            <div className="space-y-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-purple-400">Document Workspace</div>
              <h3 className="text-2xl font-black text-foreground">PDF Studio</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">Compress files, split pages, add watermarks, and convert images instantly.</p>
            </div>
          </Link>

          {/* Bento Block 4: Grade ledger (Large) */}
          <Link to="/tools/cgpa-calculator" className="md:col-span-8 group relative overflow-hidden saas-card !p-0 h-[300px] flex flex-col justify-end">
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-700" />
            
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all duration-700">
              <GraduationCap className="w-64 h-64 text-emerald-500" />
            </div>

            <div className="relative z-20 p-8 md:p-10 space-y-3">
              <div className="flex items-center gap-2 bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                <GraduationCap className="w-3.5 h-3.5" /> Grade & Attendance Ledger
              </div>
              <h3 className="text-3xl font-black tracking-tighter text-foreground">Academic Trackers</h3>
              <p className="max-w-md text-sm text-muted-foreground font-medium">CGPA converters, attendance threshold metrics, and study planners.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Search Modules Directory */}
      <section id="tools" className="px-4 max-w-7xl mx-auto scroll-mt-32">
        <div className="space-y-16">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-25 transition duration-1000" />
              <div className="relative border-none">
                <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="What tool do you need today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 md:pl-20 pr-6 md:pr-8 py-5 md:py-7 rounded-2xl md:rounded-[2.5rem] border border-border/30 bg-muted focus:bg-background focus:border-primary/50 outline-none transition-all text-lg md:text-xl font-bold text-foreground placeholder:text-muted-foreground/30 shadow-sm"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeCategory === cat 
                      ? 'bg-primary text-primary-foreground shadow-sm scale-105' 
                      : 'bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground border border-border/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-20">
            {categories.map((category) => {
              const categoryTools = filteredTools.filter(t => t.category === category);
              if (categoryTools.length === 0) return null;

              return (
                <div key={category} className="space-y-10">
                  <div className="flex items-center gap-6">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground uppercase italic">
                      {category} Modules
                    </h2>
                    <div className="h-px flex-grow bg-gradient-to-r from-border/40 to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryTools.map((tool, idx) => (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * idx }}
                      >
                        <ToolCard tool={tool} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredTools.length === 0 && (
            <div className="text-center py-24 bg-card rounded-[3rem] border border-dashed border-border/40">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
              <p className="text-xl font-bold text-muted-foreground">No tools matched your search query.</p>
            </div>
          )}
        </div>
      </section>

      {/* Interactive SaaS Pricing Slider */}
      <section className="px-4 max-w-5xl mx-auto">
        <div className="saas-card p-10 md:p-16 border border-border/40 space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />
          
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter italic">Workspace Cost Estimator</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto font-medium">Use the slider to calculate pricing based on your required credit volume.</p>
          </div>

          <div className="space-y-6">
            <div className="relative pt-6">
              <input 
                type="range" 
                min="0" 
                max="3" 
                value={creditSlider} 
                onChange={(e) => setCreditSlider(parseInt(e.target.value))}
                className="w-full h-2 bg-foreground/[0.08] rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none animate-pulse" 
              />
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground pt-4">
                <span>1K Credits</span>
                <span>10K Credits</span>
                <span>50K Credits</span>
                <span>Unlimited</span>
              </div>
            </div>

            <div className="bg-card border border-border/30 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-sm">
              <div className="md:col-span-2 space-y-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  {pricingTiers[creditSlider].label}
                </span>
                <h3 className="text-xl font-black text-foreground">{pricingTiers[creditSlider].credits}</h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  {pricingTiers[creditSlider].desc}
                </p>
              </div>

              <div className="text-left md:text-right space-y-3">
                <div>
                  <span className="text-4xl font-black text-foreground italic">{pricingTiers[creditSlider].price}</span>
                  <span className="text-xs text-muted-foreground italic font-medium">/mo</span>
                </div>
                <Link to="/pricing" className="saas-button-primary !py-3 w-full text-center inline-block text-[10px] tracking-wider font-black">
                  Select Plan <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
              {pricingTiers[creditSlider].features.map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-muted-foreground font-medium italic">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  {feat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter italic">SaaS Feedback</h2>
          <p className="text-muted-foreground font-medium text-sm">Read what competitive aspirants and college students are saying.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Aditya Sen', role: 'JEE Main 2026 Aspirant', review: 'The AI Rank Predictor difficulty normalization was incredibly accurate to my final shift score. The interface is fluid and premium.', rate: 5 },
            { name: 'Megha Sharma', role: 'MCA CUET PG Candidate', review: 'I enhanced my resume using the ATS bullet tool and secured an internship. Highly recommend the Academic Planner!', rate: 5 },
            { name: 'Vikram Malhotra', role: 'NIMCET High Achiever', review: 'The 7-day study planner roadmaps kept me organized. ScholarOS is practically my default homepage.', rate: 5 }
          ].map((item, i) => (
            <div key={i} className="saas-card flex flex-col justify-between border-border/30 space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(item.rate)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">
                  "{item.review}"
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-border/30 pt-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-xs font-black text-white">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground"> {item.name}</h4>
                  <p className="text-[9px] text-muted-foreground font-medium">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion FAQs */}
      <section className="px-4 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter italic">System FAQs</h2>
          <p className="text-muted-foreground text-sm font-medium">Common questions regarding ScholarOS billing and capabilities.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-card border border-border/40 rounded-3xl overflow-hidden transition-all duration-300"
            >
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="text-sm font-black text-foreground flex items-center gap-3 italic">
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-primary' : ''}`} 
                />
              </button>
              
              <AnimatePresence initial={false}>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-border/20 text-xs text-muted-foreground leading-relaxed font-medium italic">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Global CTA Section */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto saas-card !p-12 md:!p-24 text-center space-y-10 relative overflow-hidden group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[140px] -z-10 group-hover:bg-purple-500/10 transition-colors duration-1000" />
          
          <div className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-black text-foreground tracking-tighter leading-none">
              Ready to deploy your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 italic">Academic Workspace?</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl font-medium">
              Join thousands of students who have upgraded their daily workflow. Sign up for free today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link to="/signup" className="saas-button-primary !px-12 !py-6 text-base">
              Get Started for Free
            </Link>
            <Link to="/about" className="saas-button-secondary !px-12 !py-6 text-base">
              Our Vision
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
