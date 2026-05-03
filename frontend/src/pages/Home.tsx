import { useState } from 'react';
import { tools } from '../utils/toolsConfig';
import ToolCard from '../components/ToolCard';
import { Search, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'PDF', 'Image', 'Academic', 'Exam', 'Utility'];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-20 pb-20">
      {/* Premium Hero Section */}
      <section className="relative text-center space-y-8 py-20 overflow-hidden rounded-[3rem]">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="space-y-4 px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/20"
          >
            <Sparkles className="w-3 h-3" /> The Ultimate Academic Multi-Tool
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-[9rem] font-black tracking-tighter leading-[0.8] uppercase"
          >
            Tool <span className="text-primary italic">Pro</span><br />
            <span className="relative inline-block mt-4">
              Legacy.
              <div className="absolute -bottom-4 left-0 w-full h-4 bg-primary/20 -rotate-1 -z-10" />
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium pt-8"
          >
            The world's most powerful collection of PDF, Image, and AI tools built exclusively for high-performing students.
          </motion.p>
        </div>
        
        {/* Search & Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto space-y-8 px-4"
        >
          <div className="relative group mt-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-amber-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search 20+ professional tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-20 pr-8 py-8 rounded-[2.5rem] border border-white/10 bg-card/50 backdrop-blur-xl shadow-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-xl font-medium"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, i) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.05) }}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105' 
                    : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Trust Stats Board */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
                { label: 'Files Processed', value: '1.2M+', color: 'text-rose-500' },
                { label: 'Happy Students', value: '850K+', color: 'text-indigo-500' },
                { label: 'Tools Available', value: '25+', color: 'text-amber-500' },
                { label: 'Accuracy Rate', value: '99.9%', color: 'text-primary' },
            ].map((stat, i) => (
                <div key={i} className="p-8 bg-card/30 backdrop-blur-md border border-white/5 rounded-[2.5rem] text-center space-y-2 group hover:border-primary/20 transition-all">
                    <p className={`text-3xl md:text-5xl font-black ${stat.color} group-hover:scale-110 transition-transform`}>{stat.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">{stat.label}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Featured Bento Section */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-4 border-primary pl-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tight uppercase">Top Picked <span className="text-primary italic">Utilities</span></h2>
                    <p className="text-muted-foreground font-medium">Most used by NIT & IIT students this week.</p>
                </div>
                <Link to="/pricing" className="text-xs font-black uppercase tracking-widest text-primary hover:underline">View Pro Perks →</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <Link to="/tools/rank-predictor" className="md:col-span-8 group relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-600 to-purple-800 p-12 text-white shadow-2xl h-[400px] flex flex-col justify-end">
                    <div className="absolute top-0 right-0 p-12 opacity-20 group-hover:scale-125 transition-transform duration-700">
                        <Sparkles className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="bg-white/20 w-fit px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">AI Powered</div>
                        <h3 className="text-5xl font-black uppercase leading-none">Rank Predictor</h3>
                        <p className="max-w-md text-white/80 font-medium">Get deep insights into your exam performance with our upgraded Gemini AI engine.</p>
                    </div>
                </Link>
                <div className="md:col-span-4 grid grid-rows-2 gap-6">
                    <Link to="/tools/pdf/merge" className="group bg-rose-500 p-8 rounded-[3rem] text-white flex flex-col justify-between hover:scale-[1.02] transition-all shadow-xl">
                        <Zap className="w-12 h-12 self-end opacity-50" />
                        <div>
                            <h3 className="text-2xl font-black uppercase">Merge PDF</h3>
                            <p className="text-sm text-white/80 font-medium">Combine documents instantly.</p>
                        </div>
                    </Link>
                    <Link to="/tools/resume-builder" className="group bg-amber-500 p-8 rounded-[3rem] text-white flex flex-col justify-between hover:scale-[1.02] transition-all shadow-xl">
                        <ShieldCheck className="w-12 h-12 self-end opacity-50" />
                        <div>
                            <h3 className="text-2xl font-black uppercase">Resume Pro</h3>
                            <p className="text-sm text-white/80 font-medium">High-converting templates.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
      </section>

      {/* Modern Categorized Tools Section */}
      <section className="px-4 space-y-32">
        {categories.map((category) => {
          const categoryTools = filteredTools.filter(t => t.category === category);
          if (categoryTools.length === 0) return null;

          return (
            <div key={category} id={category.toLowerCase()} className="space-y-12 max-w-7xl mx-auto scroll-mt-32">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-5xl font-black tracking-tighter uppercase flex items-center gap-4">
                    <span className="w-12 h-2 bg-primary rounded-full" />
                    {category} <span className="text-primary italic">Tools</span>
                  </h2>
                  <p className="text-muted-foreground text-lg font-medium max-w-2xl">Professional-grade {category.toLowerCase()} processing with military-grade encryption and speed.</p>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 hidden md:block">Categorized Section {category.toUpperCase()}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryTools.map((tool, idx) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 30 }}
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
        
        {filteredTools.length === 0 && (
          <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-white/10 max-w-7xl mx-auto">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold text-muted-foreground">No tools found matching your search.</p>
          </div>
        )}
      </section>
      
      {/* Featured Pro Section */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-indigo-600 via-purple-700 to-primary p-16 rounded-[4rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10 max-w-2xl space-y-8">
            <div className="bg-white/20 backdrop-blur-md w-fit px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
              Limited Time: ₹49/Month
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter">
              Unleash the <br /><span className="italic text-amber-400">Pro Power.</span>
            </h2>
            <p className="text-white/80 text-xl font-medium leading-relaxed">
              Get unlimited access to AI Rank Predictor, Premium Resume Templates, and Batch PDF processing with no ads.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/pricing" className="bg-white text-indigo-600 px-10 py-5 rounded-[2rem] font-black hover:scale-105 transition-all shadow-2xl text-center uppercase tracking-widest text-sm">
                Go Pro Now
              </Link>
              <Link to="/about" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-[2rem] font-black hover:bg-white/20 transition-all text-center uppercase tracking-widest text-sm">
                Compare Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
