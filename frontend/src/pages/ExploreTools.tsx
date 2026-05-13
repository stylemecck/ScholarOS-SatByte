import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Sparkles, 
  TrendingUp, ArrowRight, Box,
  ImageIcon, GraduationCap,
  Settings, Layers, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { tools } from '../utils/toolsConfig';
import ToolCard from '../components/ToolCard';

const ExploreTools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    { id: 'All', label: 'All Modules', icon: Box },
    { id: 'Academic', label: 'Academic', icon: GraduationCap },
    { id: 'Exam', label: 'Exam Prep', icon: TrendingUp },
    { id: 'PDF', label: 'PDF Studio', icon: Layers },
    { id: 'Image', label: 'Image Tools', icon: ImageIcon },
    { id: 'Utility', label: 'Utilities', icon: Settings },
  ];

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const featuredTools = tools.filter(t => 
    ['rank-pred', 'resume-builder', 'pdf-merge', 'image-compress'].includes(t.id)
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <SEO 
        title="Explore All Tools – Student Productivity Marketplace"
        description="Discover 20+ productivity, academic, AI-powered, career, and utility tools. Explore our collection of PDF editors, rank predictors, and developer utilities."
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://toolkit.satbyte.in"
          },{
            "@type": "ListItem",
            "position": 2,
            "name": "Tools",
            "item": "https://toolkit.satbyte.in/tools"
          }]
        }}
      />
      {/* 1. Hero Discovery Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20"
            >
              <Sparkles className="w-4 h-4" /> Discover the Ecosystem
            </motion.div>
            
            <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none italic">
              Explore All <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500 pr-4">Tools.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed italic">
              A unified marketplace of 20+ industrial-grade academic, media, and productivity modules built for the next generation.
            </p>
          </div>

          {/* Search & Global Controls */}
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-30 transition duration-1000" />
              <div className="relative">
                <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by tool..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 md:pl-20 pr-6 md:pr-8 py-5 md:py-7 rounded-2xl md:rounded-[2.5rem] border border-white/5 bg-[#0D0D0D] focus:bg-black focus:border-primary/50 outline-none transition-all text-lg md:text-xl font-bold text-white placeholder:text-muted-foreground/20 shadow-2xl"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-8 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills - Horizontal Scroll on Mobile */}
            <div className="flex overflow-x-auto md:flex-wrap justify-start md:justify-center gap-3 pb-4 md:pb-0 scroll-hide px-4 md:px-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    flex-shrink-0 flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border
                    ${activeCategory === cat.id 
                      ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' 
                      : 'bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'}
                  `}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Tools Carousel/Grid */}
      {!searchQuery && activeCategory === 'All' && (
        <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">
          <div className="flex items-end justify-between border-l-4 border-primary pl-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tight text-white uppercase italic leading-none">Most Popular</h2>
              <p className="text-muted-foreground font-medium text-sm">Industrial-grade tools used by thousands daily.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredTools.map((tool) => (
              <Link 
                key={tool.id}
                to={tool.path}
                className="group relative saas-card !p-8 flex flex-col justify-between h-72 overflow-hidden border-white/[0.05] hover:border-primary/40 transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] -mr-10 -mt-10 blur-2xl group-hover:bg-primary/10 transition-all" />
                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                    <tool.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-white">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium line-clamp-2">{tool.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 relative z-10">
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary">Featured</span>
                   <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. Main Tools Directory */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="space-y-24">
          {/* Grouped by Category */}
          {categories.filter(c => c.id !== 'All').map((category) => {
            const categoryTools = filteredTools.filter(t => t.category === category.id);
            if (categoryTools.length === 0) return null;

            return (
              <div key={category.id} className="space-y-10">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5">
                        <category.icon className="w-5 h-5" />
                     </div>
                     <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic">
                        {category.label}
                     </h2>
                  </div>
                  <div className="h-px flex-grow bg-gradient-to-r from-white/10 to-transparent" />
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{categoryTools.length} Modules</span>
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

          {filteredTools.length === 0 && (
            <div className="text-center py-40 bg-white/[0.02] rounded-[4rem] border border-dashed border-white/10 flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-muted-foreground opacity-20">
                <Search className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black italic text-white/50">No tools found matching "{searchQuery}"</p>
                <p className="text-sm text-muted-foreground font-medium">Try searching for generic terms like "PDF" or "Converter"</p>
              </div>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="saas-button-secondary !py-3 !px-8 text-[10px]"
              >
                Reset Marketplace
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Global CTA */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <div className="saas-card !p-16 md:!p-24 text-center space-y-12 relative overflow-hidden group border-white/[0.05]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] -z-10 group-hover:bg-purple-500/5 transition-colors duration-1000" />
          
          <div className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-7xl font-black text-white tracking-tighter leading-none italic">
              Scale your workflow <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">with SatByte OS.</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl font-medium italic">
              Automate the repetitive. Focus on the innovative. 2,000+ developers already integrated.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/signup" className="saas-button-primary !px-12 !py-6 text-sm">
              Create Free Account
            </Link>
            <Link to="/docs" className="saas-button-secondary !px-12 !py-6 text-sm">
               Developer APIs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExploreTools;
