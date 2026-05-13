import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Book, Code2, Shield, Zap, 
  Terminal, ChevronRight, Copy, CheckCircle2,
  Cpu, Globe, Lock, Layers,
  ArrowUpRight, AlertCircle, Bookmark,
  Menu, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Docs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const sections = [
    {
      title: 'Getting Started',
      items: [
        { id: 'intro', label: 'Introduction', icon: Book },
        { id: 'auth', label: 'Authentication', icon: Shield },
        { id: 'quickstart', label: 'Quick Start', icon: Zap },
      ]
    },
    {
      title: 'Tools API',
      items: [
        { id: 'image-api', label: 'Image Processing', icon: Cpu },
        { id: 'pdf-api', label: 'PDF Manipulation', icon: Layers },
        { id: 'rank-api', label: 'Rank Analytics', icon: Terminal },
      ]
    },
    {
      title: 'Advanced',
      items: [
        { id: 'limits', label: 'Rate Limits', icon: Lock },
        { id: 'webhooks', label: 'Webhooks', icon: Globe },
        { id: 'errors', label: 'Error Handling', icon: AlertCircle },
      ]
    }
  ];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, lang }: { code: string, lang: string }) => (
    <div className="relative group my-6">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{lang}</span>
        <button 
          onClick={() => copyCode(code)}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-muted-foreground hover:text-primary"
        >
          {copiedCode === code ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl font-mono text-[11px] leading-relaxed text-white/70 overflow-x-auto custom-scrollbar">
        {code}
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Documentation Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#080808] border-r border-white/5 transform transition-transform lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 space-y-10 h-full flex flex-col">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black italic">S</div>
              <span className="text-sm font-black uppercase tracking-widest">Docs</span>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-muted-foreground"><X className="w-5 h-5" /></button>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search docs..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs font-medium focus:outline-none focus:border-primary/30 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <nav className="flex-1 space-y-10 overflow-y-auto custom-scrollbar pr-2">
            {sections.map((section, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground px-4">{section.title}</h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveSection(item.id); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeSection === item.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/5">
             <Link to="/developer" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl group hover:bg-primary/10 transition-all border border-white/5">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">Console</p>
                   <p className="text-xs font-bold text-white">Go to Dashboard</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
             </Link>
          </div>
        </div>
      </div>

      {/* Main Documentation Content */}
      <div className="flex-1 lg:pl-72">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-16">
          <AnimatePresence mode="wait">
            {activeSection === 'intro' && (
              <motion.div 
                key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                     <Bookmark className="w-3 h-3" /> API Documentation
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">Introduction</h1>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                    Welcome to the Toolkit by SatByte API. Our platform provides high-performance utility endpoints for students, developers, and organizations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="saas-card !p-8 space-y-4 hover:border-primary/30 transition-all cursor-pointer group">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                         <Zap className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black italic">Speed First</h3>
                      <p className="text-sm text-muted-foreground font-medium">Built on a distributed cloud architecture with &lt;100ms average global latency.</p>
                   </div>
                   <div className="saas-card !p-8 space-y-4 hover:border-primary/30 transition-all cursor-pointer group">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                         <Layers className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-black italic">Unified Platform</h3>
                      <p className="text-sm text-muted-foreground font-medium">One API for everything: PDFs, Images, AI Analytics, and Academic tools.</p>
                   </div>
                </div>

                <div className="space-y-6 border-l-4 border-primary/20 pl-8 py-4">
                   <h3 className="text-2xl font-black italic">Base URL</h3>
                   <div className="bg-black border border-white/5 p-6 rounded-2xl font-mono text-primary text-sm">
                      https://toolkit.satbyte.in/api/v1
                   </div>
                   <p className="text-sm text-muted-foreground italic font-medium">All API requests must be made over HTTPS. Calls made over plain HTTP will fail.</p>
                </div>
              </motion.div>
            )}

            {activeSection === 'auth' && (
              <motion.div 
                key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="space-y-4">
                   <h1 className="text-5xl font-black tracking-tighter italic">Authentication</h1>
                   <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                      All API requests must include an API Key in the <code className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">x-api-key</code> request header.
                   </p>
                </div>

                <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex gap-6">
                   <div className="mt-1"><AlertCircle className="w-6 h-6 text-amber-500" /></div>
                   <div className="space-y-2">
                      <p className="text-sm font-black text-amber-500 uppercase tracking-widest">Security Warning</p>
                      <p className="text-xs text-amber-200/70 font-medium leading-relaxed">Your API keys carry significant privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-2xl font-black italic">Example Header</h3>
                   <CodeBlock lang="http" code={`GET /api/v1/user/profile HTTP/1.1
Host: toolkit.satbyte.in
x-api-key: stp_live_51P...`} />
                </div>

                <div className="space-y-6">
                   <h3 className="text-2xl font-black italic">cURL Example</h3>
                   <CodeBlock lang="bash" code={`curl -X POST https://toolkit.satbyte.in/api/v1/image/compress \\
  -H "x-api-key: YOUR_API_KEY" \\
  -F "file=@/path/to/image.jpg"`} />
                </div>
              </motion.div>
            )}

            {activeSection === 'image-api' && (
              <motion.div 
                key="image-api" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="space-y-4">
                   <h1 className="text-5xl font-black tracking-tighter italic text-blue-400">Image Processing</h1>
                   <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                      Optimize, resize, and convert images instantly using our high-performance processing engine.
                   </p>
                </div>

                <div className="space-y-8">
                   <div className="saas-card !p-0 overflow-hidden border-white/5">
                      <div className="px-8 py-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-md text-[10px] font-black uppercase tracking-widest">POST</span>
                            <span className="font-mono text-xs text-white/70">/image/compress</span>
                         </div>
                         <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase">
                            <CheckCircle2 className="w-3 h-3" /> Stable
                         </div>
                      </div>
                      <div className="p-8 space-y-6">
                         <p className="text-sm text-muted-foreground font-medium italic">Compresses an image file and returns the optimized binary.</p>
                         
                         <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-white/50">Form Parameters</h4>
                            <div className="space-y-4 divide-y divide-white/5">
                               {[
                                  { name: 'file', type: 'Binary', desc: 'The image file to compress (JPG, PNG, WebP)' },
                                  { name: 'quality', type: 'Integer', desc: 'Compression quality (1-100). Default is 80.' },
                                  { name: 'targetSize', type: 'Integer', desc: 'Target size in KB (Optional)' },
                               ].map((param, i) => (
                                  <div key={i} className="flex justify-between items-center py-4">
                                     <div>
                                        <p className="text-sm font-bold text-white">{param.name}</p>
                                        <p className="text-[10px] text-muted-foreground italic">{param.desc}</p>
                                     </div>
                                     <span className="text-[10px] font-mono text-primary font-black uppercase tracking-widest">{param.type}</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h3 className="text-2xl font-black italic">Integration Example</h3>
                      <CodeBlock lang="javascript" code={`const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('file', fs.createReadStream('photo.jpg'));
form.append('quality', '75');

axios.post('https://toolkit.satbyte.in/api/v1/image/compress', form, {
  headers: {
    ...form.getHeaders(),
    'x-api-key': 'stp_live_...'
  },
  responseType: 'arraybuffer'
}).then(res => {
  fs.writeFileSync('optimized.jpg', res.data);
  console.log('Compression successful!');
});`} />
                   </div>
                </div>
              </motion.div>
            )}

            {/* Default State for Missing Sections */}
            {!['intro', 'auth', 'image-api'].includes(activeSection) && (
              <motion.div 
                key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-32 text-center space-y-6 opacity-30"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                   <Code2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-black uppercase tracking-tighter italic">Section Under Construction</h3>
                   <p className="text-sm font-medium italic">We're finalizing the technical specifications for this endpoint.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <button 
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50 border-4 border-black active:scale-95 transition-all"
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Docs;
