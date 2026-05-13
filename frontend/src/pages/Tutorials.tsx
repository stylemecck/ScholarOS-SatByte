import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Search, Clock, ChevronRight, 
  Sparkles, Terminal, Code2,
  ArrowRight, Filter, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Tutorials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Guides' },
    { id: 'api', label: 'API Integration' },
    { id: 'student', label: 'Student Life' },
    { id: 'ai', label: 'AI Tools' },
    { id: 'dev', label: 'Developer Tips' },
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Integrating Image Compression into your React App',
      excerpt: 'Learn how to use the Student Toolkit API to automatically optimize user uploads in real-time.',
      category: 'api',
      readTime: '8 min read',
      date: 'May 14, 2026',
      image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=1000',
      author: 'Satyam',
      authorRole: 'Founder @ SatByte'
    },
    {
      id: 2,
      title: '10 AI Prompts to Supercharge Your Resume',
      excerpt: 'Struggling with bullet points? Use these proven AI structures to highlight your impact effectively.',
      category: 'student',
      readTime: '5 min read',
      date: 'May 12, 2026',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1000',
      author: 'Career Team',
      authorRole: 'Content Strategy'
    },
    {
      id: 3,
      title: 'Automating PDF Reports with Node.js and STP',
      excerpt: 'Stop manual generation. A deep dive into using our background workers for batch processing.',
      category: 'dev',
      readTime: '12 min read',
      date: 'May 10, 2026',
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=1000',
      author: 'Dev Relations',
      authorRole: 'Engineering'
    }
  ];

  const filteredTutorials = tutorials.filter(t => 
    (activeCategory === 'all' || t.category === activeCategory) &&
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-32 pb-32">
      {/* Editorial Hero */}
      <section className="relative pt-24 px-4 overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10" />
         
         <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-6">
               <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-white/80 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
               >
                  <Sparkles className="w-4 h-4 text-primary" /> Learning Ecosystem
               </motion.div>
               
               <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-white italic">
                  Resources & <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 pr-4">Tutorials.</span>
               </h1>
               
               <p className="text-lg md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto italic">
                  Master the tools of the future. From deep-dive technical guides to career growth strategies.
               </p>
            </div>

            <div className="max-w-2xl mx-auto relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
               <input 
                  type="text" 
                  placeholder="Search articles, guides, tutorials..."
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] py-6 pl-16 pr-8 text-sm font-medium focus:outline-none focus:border-primary/50 transition-all shadow-2xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
         </div>
      </section>

      {/* Featured Article */}
      <section className="max-w-7xl mx-auto px-4">
         <div className="saas-card !p-0 overflow-hidden flex flex-col lg:flex-row group cursor-pointer hover:border-primary/30 transition-all">
            <div className="lg:w-1/2 h-[400px] lg:h-auto overflow-hidden">
               <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" 
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700"
                  alt="Featured"
               />
            </div>
            <div className="lg:w-1/2 p-12 md:p-20 flex flex-col justify-center space-y-8">
               <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">Featured</span>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                     <Clock className="w-3 h-3" /> 15 min read
                  </span>
               </div>
               <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight italic text-white group-hover:text-primary transition-colors">
                  The Future of Academic Productivity with AI Agents.
               </h2>
               <p className="text-lg text-muted-foreground font-medium italic leading-relaxed">
                  How we're building the next generation of student tools that don't just calculate—they think and advise.
               </p>
               <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white/10 rounded-full overflow-hidden border border-white/10">
                        <div className="w-full h-full flex items-center justify-center bg-primary/20 font-black italic">S</div>
                     </div>
                     <div>
                        <p className="text-xs font-black text-white italic">Satyam</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Editor-in-Chief</p>
                     </div>
                  </div>
                  <button className="p-4 bg-white/5 rounded-2xl group-hover:bg-primary transition-all group-hover:translate-x-2">
                     <ArrowRight className="w-5 h-5 text-white" />
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
         {/* Categories Sidebar */}
         <div className="lg:col-span-3 space-y-10 lg:sticky lg:top-32">
            <div className="space-y-6">
               <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                  <Filter className="w-4 h-4 text-primary" /> Filter Topics
               </h3>
               <div className="flex flex-col gap-2">
                  {categories.map(cat => (
                     <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                           activeCategory === cat.id ? 'bg-primary text-white shadow-xl' : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                        }`}
                     >
                        {cat.label}
                        {activeCategory === cat.id && <ChevronRight className="w-3 h-3" />}
                     </button>
                  ))}
               </div>
            </div>

            <div className="saas-card !p-8 space-y-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
               <p className="text-xs font-black text-white uppercase tracking-widest">Weekly Newsletter</p>
               <p className="text-sm text-muted-foreground font-medium italic">Get the latest integration guides and student tips directly in your inbox.</p>
               <div className="space-y-3">
                  <input type="email" placeholder="email@example.com" className="saas-input text-[10px] !py-3" />
                  <button className="w-full saas-button-primary !py-3 text-[10px] font-black uppercase">Subscribe</button>
               </div>
            </div>
         </div>

         {/* Article Feed */}
         <div className="lg:col-span-9 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {filteredTutorials.map((tut, i) => (
                  <motion.div 
                     key={tut.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="saas-card !p-0 overflow-hidden group hover:border-primary/20 transition-all flex flex-col h-full"
                  >
                     <div className="h-56 overflow-hidden relative">
                        <img 
                           src={tut.image} 
                           className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100"
                           alt={tut.title}
                        />
                        <div className="absolute top-4 left-4">
                           <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20">
                              {tut.category}
                           </span>
                        </div>
                     </div>
                     <div className="p-8 space-y-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                           <Calendar className="w-3.5 h-3.5" /> {tut.date}
                           <span className="w-1 h-1 bg-white/10 rounded-full" />
                           <Clock className="w-3.5 h-3.5" /> {tut.readTime}
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-primary transition-colors italic leading-snug">
                           {tut.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium line-clamp-3 leading-relaxed flex-1">
                           {tut.excerpt}
                        </p>
                        <div className="pt-6 flex items-center justify-between border-t border-white/5">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-black text-white border border-white/5">
                                 {tut.author[0]}
                              </div>
                              <p className="text-[10px] font-black text-white italic">{tut.author}</p>
                           </div>
                           <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group-hover:underline">
                              Read Article <ChevronRight className="w-3 h-3" />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>

            {filteredTutorials.length === 0 && (
               <div className="py-20 text-center space-y-6 opacity-30">
                  <BookOpen className="w-16 h-16 mx-auto" />
                  <p className="text-xl font-black italic">No articles found matching your criteria.</p>
               </div>
            )}

            <div className="pt-10 flex justify-center">
               <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white hover:border-white/20 transition-all">
                  Load More Articles
               </button>
            </div>
         </div>
      </div>

      {/* Integration Call to Action */}
      <section className="max-w-5xl mx-auto px-4">
         <div className="saas-card !p-16 text-center space-y-10 relative overflow-hidden bg-white/[0.01]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] -z-10" />
            
            <div className="space-y-4">
               <h2 className="text-4xl font-black tracking-tight italic text-white leading-tight">Ready to build your next project?</h2>
               <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto italic">
                  Join 2,000+ developers using the Student Toolkit API to power their applications.
               </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-4">
               <Link to="/developer" className="saas-button-primary !px-10 !py-5 text-xs flex items-center gap-3">
                  <Terminal className="w-4 h-4" /> Get Free API Key
               </Link>
               <Link to="/docs" className="saas-button-secondary !px-10 !py-5 text-xs flex items-center gap-3">
                  <Code2 className="w-4 h-4" /> Documentation
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Tutorials;
