import { useState } from 'react';
import { tools } from '../utils/toolsConfig';
import ToolCard from '../components/ToolCard';
import { Search, Zap, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Academic', 'Exam', 'Utility'];

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

        <div className="space-y-4 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-primary/20"
          >
            <Sparkles className="w-3 h-3" /> Built for the Next Gen Students
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9]"
          >
            Study <span className="text-primary italic">Smarter</span>,<br />
            Not <span className="relative">Harder. <div className="absolute -bottom-2 left-0 w-full h-3 bg-primary/20 -rotate-1 -z-10" /></span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
          >
            Unlock the power of AI-driven academic tools designed to skyrocket your productivity and results.
          </motion.p>
        </div>
        
        {/* Search & Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto space-y-8 px-4"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-amber-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="What tool do you need today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-6 rounded-[2rem] border border-white/10 bg-card/50 backdrop-blur-xl shadow-2xl focus:ring-2 focus:ring-primary outline-none transition-all text-lg font-medium"
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
                className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
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

      {/* Modern Tools Section */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
              <Zap className="w-8 h-8 text-amber-500 fill-amber-500" />
              Available Tools
            </h2>
            <p className="text-muted-foreground font-medium">Select a tool to get started instantly.</p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Premium</span>
            <span className="w-1 h-1 bg-border rounded-full" />
            <span>AI Powered</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool, idx) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * idx }}
              className={idx === 0 ? "md:col-span-2 lg:col-span-1" : ""}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </div>
        
        {filteredTools.length === 0 && (
          <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold text-muted-foreground">No tools found matching your search.</p>
          </div>
        )}
      </section>
      
      {/* Featured Section */}
      <section className="px-4">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="bg-white/20 backdrop-blur-md w-fit px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
              Limited Time Offer
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Unlock All Tools with the Pro Plan
            </h2>
            <p className="text-white/80 text-lg font-medium">
              Get unlimited access to Rank Predictor, Resume Builder, and exclusive AI insights for just ₹49.
            </p>
            <div className="flex gap-4 pt-4">
              <Link to="/pricing" className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl">
                Get Started Now
              </Link>
              <Link to="/about" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-black hover:bg-white/20 transition-all">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
