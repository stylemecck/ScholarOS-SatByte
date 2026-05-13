import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Book, Code2, Shield, Zap, 
  Terminal, Copy, CheckCircle2,
  Globe, Lock, Layers,
  ArrowUpRight, AlertCircle,
  Menu, X, ChevronRight, Hash,
  HelpCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Type Definitions for Documentation
interface ApiEndpoint {
  method: string;
  path: string;
  name: string;
  desc: string;
  params?: { name: string; type: string; required: boolean; desc: string; }[];
  response?: string;
}

interface DocContent {
  title?: string;
  description?: string;
  body?: string;
  features?: { title: string; desc: string; icon: any; }[];
  steps?: { title: string; desc: string; }[];
  code?: { lang: string; title: string; snippet: string; };
}

interface DocSection {
  id: string;
  label: string;
  icon: any;
  content?: DocContent;
  endpoints?: ApiEndpoint[];
}

interface DocCategory {
  title: string;
  sections: DocSection[];
}

// Documentation Content Configuration
const DOCS_CONTENT: Record<string, DocCategory> = {
  getting_started: {
    title: 'Getting Started',
    sections: [
      {
        id: 'intro',
        label: 'Introduction',
        icon: Book,
        content: {
          title: 'Welcome to SatByte Toolkit API',
          description: 'Industrial-grade utility endpoints designed for modern academic workflows, automated media processing, and data-driven career insights.',
          body: `Our API provides a unified interface to interact with the SatByte ecosystem. Whether you're building a campus management system, a resume parser, or an automated PDF processing pipeline, our tools are built for speed and precision.`,
          features: [
            { title: '99.9% Uptime', desc: 'Enterprise-grade reliability for production systems.', icon: Shield },
            { title: 'Global Edge', desc: 'Low-latency responses from 20+ regions.', icon: Globe },
            { title: 'Security First', desc: 'AES-256 encryption for all processed data.', icon: Lock }
          ]
        }
      },
      {
        id: 'auth',
        label: 'Authentication',
        icon: Shield,
        content: {
          title: 'Secure your requests',
          description: 'All API requests must be authenticated using a unique API Key generated from your developer dashboard.',
          body: 'To authenticate, include your API Key in the `x-api-key` header of every request. Never share your secret keys or include them in client-side code.',
          code: {
            lang: 'bash',
            title: 'Authentication Header',
            snippet: `curl -H "x-api-key: stp_live_51P..." https://toolkit.satbyte.in/api/v1/user/profile`
          }
        }
      },
      {
        id: 'quickstart',
        label: 'Quick Start',
        icon: Zap,
        content: {
          title: 'Your First Request',
          description: 'Get up and running with the Toolkit API in less than 2 minutes.',
          steps: [
            { title: 'Get your API Key', desc: 'Navigate to the Developer Console and generate a "live" key.' },
            { title: 'Choose an endpoint', desc: 'Select a utility like Image Compression or PDF Merging.' },
            { title: 'Fire the request', desc: 'Use our SDKs or a standard HTTP client like cURL or Axios.' }
          ],
          code: {
            lang: 'javascript',
            title: 'Example: Compress an Image',
            snippet: `const axios = require('axios');
const formData = new FormData();
formData.append('file', fs.createReadStream('original.png'));

const response = await axios.post('https://toolkit.satbyte.in/api/v1/image/compress', formData, {
  headers: { 'x-api-key': 'YOUR_KEY' }
});`
          }
        }
      }
    ]
  },
  api_reference: {
    title: 'API Reference',
    sections: [
      {
        id: 'image-api',
        label: 'Image Processing',
        icon: Layers,
        endpoints: [
          {
            method: 'POST',
            path: '/image/compress',
            name: 'Compress Image',
            desc: 'Reduce file size while preserving visual fidelity.',
            params: [
              { name: 'file', type: 'Binary', required: true, desc: 'Image file (JPG, PNG, WebP)' },
              { name: 'quality', type: 'Int', required: false, desc: 'Quality level (1-100). Default 80.' }
            ],
            response: `{ "url": "https://cdn.satbyte.in/res/abc.jpg", "size": "142KB" }`
          },
          {
            method: 'POST',
            path: '/image/resize',
            name: 'Resize Image',
            desc: 'Change dimensions with aspect ratio control.',
            params: [
              { name: 'width', type: 'Int', required: true, desc: 'Target width' },
              { name: 'height', type: 'Int', required: false, desc: 'Target height' }
            ]
          }
        ]
      },
      {
        id: 'pdf-api',
        label: 'PDF Manipulation',
        icon: Layers,
        endpoints: [
          {
            method: 'POST',
            path: '/pdf/merge',
            name: 'Merge Documents',
            desc: 'Combine multiple PDF files into a single document.',
            params: [
              { name: 'files', type: 'Array', required: true, desc: 'List of binary PDF files' }
            ]
          }
        ]
      },
      {
        id: 'rank-api',
        label: 'Rank Analytics',
        icon: Terminal,
        endpoints: [
          {
            method: 'GET',
            path: '/tools/rank-predict',
            name: 'Predict Rank',
            desc: 'AI analysis of entrance exam performance.',
            params: [
              { name: 'exam', type: 'String', required: true, desc: 'Exam ID (JEE, CUET)' },
              { name: 'marks', type: 'Float', required: true, desc: 'Score obtained' }
            ]
          }
        ]
      }
    ]
  },
  advanced: {
    title: 'Advanced Settings',
    sections: [
      { id: 'rate-limits', label: 'Rate Limits', icon: Lock },
      { id: 'webhooks', label: 'Webhooks', icon: Globe },
      { id: 'errors', label: 'Error Codes', icon: AlertCircle }
    ]
  }
};

const Docs = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync state with hash if available
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) setActiveSection(hash);
  }, [location]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentSectionData = useMemo(() => {
    for (const cat of Object.values(DOCS_CONTENT)) {
      const section = cat.sections.find(s => s.id === activeSection);
      if (section) return { ...section, category: cat.title };
    }
    return null;
  }, [activeSection]);

  const filteredSearch = useMemo(() => {
    if (!searchQuery) return [];
    const results: any[] = [];
    Object.values(DOCS_CONTENT).forEach(cat => {
      cat.sections.forEach(sec => {
        if (sec.label.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ ...sec, category: cat.title });
        }
      });
    });
    return results.slice(0, 5);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#E4E4E7] selection:bg-primary/30 selection:text-white flex overflow-hidden">
      
      {/* 1. Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#080808] border-r border-white/[0.06] transform transition-all duration-500 ease-in-out
        lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6 space-y-8 overflow-y-auto scrollbar-hide">
          {/* Logo & Header */}
          <div className="flex items-center justify-between mb-2">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase tracking-widest text-white leading-none">STP <span className="text-primary italic">DOCS</span></span>
                <span className="text-[7px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50">API v1.0.4</span>
              </div>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-muted-foreground hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search guides..."
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-2.5 pl-9 pr-4 text-[11px] font-medium focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-white/[0.08] rounded-xl shadow-2xl z-50 overflow-hidden">
                {filteredSearch.map((res: any) => (
                  <button 
                    key={res.id} 
                    onClick={() => { setActiveSection(res.id); setSearchQuery(''); }}
                    className="w-full p-3 flex flex-col items-start hover:bg-white/5 transition-colors border-b border-white/[0.03] last:border-0"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{res.category}</span>
                    <span className="text-xs font-bold text-white">{res.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-8">
            {Object.values(DOCS_CONTENT).map((category, i) => (
              <div key={i} className="space-y-3">
                <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 px-4 flex items-center justify-between">
                  {category.title}
                  {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                </h3>
                <div className="space-y-0.5">
                  {category.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => { setActiveSection(section.id); setIsMobileMenuOpen(false); }}
                      className={`
                        w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all group
                        ${activeSection === section.id 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : 'text-[#A1A1AA] hover:bg-white/[0.03] hover:text-white'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <section.icon className={`w-3.5 h-3.5 ${activeSection === section.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary transition-colors'}`} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{section.label}</span>
                      </div>
                      {activeSection === section.id && <ChevronRight className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="pt-6 border-t border-white/[0.06] space-y-4">
             <Link to="/developer" className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl group hover:bg-primary/10 transition-all border border-white/[0.06] hover:border-primary/30">
                <div className="space-y-0.5">
                   <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Developer Console</p>
                   <p className="text-xs font-bold text-white">Generate API Keys</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
             </Link>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 lg:pl-72 flex flex-col h-screen overflow-y-auto scroll-smooth custom-scrollbar">
        
        {/* Page Top Bar */}
        <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center justify-between lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center font-black text-white text-xs">S</div>
            <span className="text-xs font-black uppercase tracking-widest">Docs Hub</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-white/5 rounded-xl border border-white/10 text-white">
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Documentation Content */}
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 w-full">
          <AnimatePresence mode="wait">
            {currentSectionData && (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-12"
              >
                {/* Section Header */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                      {currentSectionData.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono opacity-40">v1.0.4 • Stable</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                    {currentSectionData.content?.title || currentSectionData.label}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                    {currentSectionData.content?.description || `Technical reference and usage guides for the ${currentSectionData.label} module.`}
                  </p>
                </div>

                {/* Content Body */}
                {currentSectionData.content?.body && (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground leading-loose font-medium">{currentSectionData.content.body}</p>
                  </div>
                )}

                {/* Features Grid (Intro only) */}
                {currentSectionData.content?.features && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {currentSectionData.content.features.map((f: any, i: number) => (
                      <div key={i} className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-[2rem] space-y-4 hover:border-primary/20 transition-all group">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <f.icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">{f.title}</h4>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Steps List (Quickstart only) */}
                {currentSectionData.content?.steps && (
                  <div className="space-y-8 py-8">
                    {currentSectionData.content.steps.map((s: any, i: number) => (
                      <div key={i} className="flex gap-6 relative">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[10px] font-black text-primary shrink-0 relative z-10">
                            {i + 1}
                          </div>
                          {i !== currentSectionData.content.steps.length - 1 && <div className="w-px h-full bg-white/[0.06]" />}
                        </div>
                        <div className="space-y-2 pb-10">
                          <h4 className="text-lg font-black text-white">{s.title}</h4>
                          <p className="text-sm text-muted-foreground font-medium leading-relaxed">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* API Endpoints Visualization */}
                {currentSectionData.endpoints && (
                  <div className="space-y-10">
                    <div className="flex items-center gap-4 border-b border-white/[0.06] pb-4">
                       <Layers className="w-5 h-5 text-primary" />
                       <h3 className="text-xl font-black italic">Endpoint Definitions</h3>
                    </div>
                    {currentSectionData.endpoints.map((ep: any, i: number) => (
                      <div key={i} className="saas-card !p-0 overflow-hidden border-white/[0.08] bg-[#0A0A0A]">
                        <div className="px-6 py-4 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                              ep.method === 'POST' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                            }`}>{ep.method}</span>
                            <code className="text-[11px] font-mono text-white/70">{ep.path}</code>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(`https://toolkit.satbyte.in/api/v1${ep.path}`, `path-${i}`)}
                            className="text-muted-foreground hover:text-white transition-colors"
                          >
                            {copiedId === `path-${i}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="p-6 space-y-6">
                          <div className="space-y-2">
                             <h4 className="text-sm font-black text-white">{ep.name}</h4>
                             <p className="text-xs text-muted-foreground font-medium italic">{ep.desc}</p>
                          </div>

                          {ep.params && (
                            <div className="space-y-4">
                              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 border-b border-white/[0.03] pb-2">Request Body</p>
                              <div className="space-y-4">
                                {ep.params.map((p: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-start gap-10">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-primary">{p.name}</span>
                                        {p.required && <span className="text-[8px] font-black text-rose-500 uppercase">Required</span>}
                                      </div>
                                      <p className="text-[10px] text-muted-foreground font-medium">{p.desc}</p>
                                    </div>
                                    <span className="text-[9px] font-mono text-muted-foreground uppercase bg-white/5 px-2 py-0.5 rounded tracking-widest">{p.type}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {ep.response && (
                            <div className="space-y-3">
                               <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Success Response (200 OK)</p>
                               <div className="relative group">
                                  <pre className="bg-black/50 border border-white/[0.04] p-5 rounded-2xl font-mono text-[10px] text-emerald-400 overflow-x-auto leading-relaxed">
                                     {ep.response}
                                  </pre>
                                  <button 
                                    onClick={() => copyToClipboard(ep.response, `resp-${i}`)}
                                    className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-muted-foreground transition-all opacity-0 group-hover:opacity-100"
                                  >
                                    {copiedId === `resp-${i}` ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                  </button>
                               </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Code Block Visualizer */}
                {currentSectionData.content?.code && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <h3 className="text-xs font-black uppercase tracking-widest text-white/50">{currentSectionData.content.code.title}</h3>
                       <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md">{currentSectionData.content.code.lang}</span>
                       </div>
                    </div>
                    <div className="relative group">
                      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                        <button 
                          onClick={() => copyToClipboard(currentSectionData.content.code.snippet, 'main-code')}
                          className="p-2.5 bg-[#0D0D0D] border border-white/5 hover:border-primary/50 rounded-xl transition-all text-muted-foreground hover:text-white shadow-2xl"
                        >
                          {copiedId === 'main-code' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <pre className="bg-[#0D0D0D] border border-white/[0.08] p-8 md:p-10 rounded-[2.5rem] font-mono text-xs md:text-sm leading-relaxed text-[#D4D4D8] overflow-x-auto custom-scrollbar shadow-2xl">
                        {currentSectionData.content.code.snippet}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Section Navigation */}
                <div className="pt-16 mt-16 border-t border-white/[0.06] flex items-center justify-between text-muted-foreground">
                  <div className="space-y-1">
                     <p className="text-[9px] font-black uppercase tracking-widest opacity-30">Previous Topic</p>
                     <p className="text-sm font-bold hover:text-primary cursor-pointer transition-colors flex items-center gap-2"><ArrowUpRight className="w-4 h-4 rotate-[-135deg]" /> Introduction</p>
                  </div>
                  <div className="space-y-1 text-right">
                     <p className="text-[9px] font-black uppercase tracking-widest opacity-30">Next Topic</p>
                     <p className="text-sm font-bold text-white hover:text-primary cursor-pointer transition-colors flex items-center gap-2 justify-end">API Authentication <ArrowUpRight className="w-4 h-4" /></p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Search Trigger for Mobile */}
        <div className="lg:hidden fixed bottom-6 left-6 z-[60]">
           <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-14 h-14 bg-white/5 backdrop-blur-xl text-primary rounded-full shadow-2xl flex items-center justify-center border border-white/10 active:scale-90 transition-transform"
           >
              <Layers className="w-6 h-6" />
           </button>
        </div>
      </main>

      {/* 3. Right On-Page Navigation (Table of Contents) */}
      <aside className="hidden xl:block w-64 p-10 border-l border-white/[0.06] bg-[#050505]">
        <div className="sticky top-10 space-y-8">
          <div className="space-y-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-2">
              <Hash className="w-3 h-3" /> On this page
            </h3>
            <div className="space-y-3">
              <button className="block text-[11px] font-bold text-primary border-l-2 border-primary pl-4">Overview</button>
              <button className="block text-[11px] font-medium text-muted-foreground hover:text-white pl-4 transition-colors">Endpoint Schema</button>
              <button className="block text-[11px] font-medium text-muted-foreground hover:text-white pl-4 transition-colors">Parameters</button>
              <button className="block text-[11px] font-medium text-muted-foreground hover:text-white pl-4 transition-colors">Response Models</button>
              <button className="block text-[11px] font-medium text-muted-foreground hover:text-white pl-4 transition-colors">Code Samples</button>
            </div>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl space-y-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10" />
             <HelpCircle className="w-6 h-6 text-primary relative z-10" />
             <div className="space-y-1 relative z-10">
                <p className="text-xs font-black text-white">Need support?</p>
                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">Our developer support team is available for enterprise integration help.</p>
             </div>
             <Link to="/support" className="block text-[10px] font-black uppercase tracking-widest text-primary hover:underline relative z-10">Contact Support</Link>
          </div>
        </div>
      </aside>

    </div>
  );
};

export default Docs;
