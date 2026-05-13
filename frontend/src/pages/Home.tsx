import { useState } from 'react';
import { tools } from '../utils/toolsConfig';
import ToolCard from '../components/ToolCard';
import { Search, Zap, Sparkles, ShieldCheck, Star, Users, ArrowRight, BarChart3, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

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
    <div className="space-y-20 md:space-y-32 pb-20 md:pb-32">
      <SEO 
        title="Toolkit by SatByte – All-in-One Student & Developer Platform"
        description="Access 20+ free tools for students and developers. AI Rank Predictor, Resume Builder, PDF Studio, Image Tools, and more in one premium marketplace."
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "SatByte Toolkit",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication, MultimediaApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}
      />
      {/* Premium Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-20 right-1/4 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-700" />
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-10 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20 shadow-lg shadow-primary/5"
          >
            <Sparkles className="w-4 h-4" /> The Student Operating System
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-7xl md:text-8xl lg:text-[8rem] font-black tracking-tighter leading-[0.9] text-white"
            >
              Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500 italic pr-4">Smarter.</span><br className="hidden sm:block" />
              Not Harder.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed"
            >
              One unified platform for Rank Prediction, Professional Resumes, and 20+ Academic AI tools. Built for the next generation of achievers.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/tools/rank-predictor" className="saas-button-primary !px-10 !py-5 flex items-center gap-3 text-sm">
              Launch AI Predictor <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#tools" className="saas-button-secondary !px-10 !py-5 flex items-center gap-2 text-sm">
              Browse Tools <Zap className="w-4 h-4" />
            </a>
          </motion.div>
          
          {/* Hero Trust Badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-12 flex flex-wrap justify-center items-center gap-4 md:gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700"
          >
            <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
              <Users className="w-4 h-4" /> 850K+ Students
            </div>
            <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
              <ShieldCheck className="w-4 h-4" /> Secure & Private
            </div>
            <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
              <Star className="w-4 h-4" /> 4.9/5 Rating
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Tools Bento Grid */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex items-end justify-between border-l-4 border-primary pl-6">
                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase italic">Trending Ecosystem</h2>
                    <p className="text-muted-foreground font-medium">Most active modules in the toolkit.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Main Bento Card */}
                <Link to="/tools/rank-predictor" className="md:col-span-8 group relative overflow-hidden saas-card !p-0 h-[450px] md:h-[550px] flex flex-col justify-end">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-700" />
                    
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-1000">
                        <BarChart3 className="w-96 h-96 text-primary" />
                    </div>

                    <div className="relative z-20 p-10 md:p-14 space-y-4">
                        <div className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/20 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" /> AI Analysis Enabled
                        </div>
                        <h3 className="text-4xl md:text-7xl font-black leading-none tracking-tighter text-white">Rank Predictor</h3>
                        <p className="max-w-md text-lg text-muted-foreground font-medium leading-relaxed">
                            Industrial-grade JEE, CUET & State entrance analytics. Trusted by lakhs of students for accurate admission insights.
                        </p>
                    </div>
                </Link>

                {/* Side Bento Cards */}
                <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
                    <Link to="/tools/resume-builder" className="group saas-card flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -mr-10 -mt-10 blur-xl group-hover:bg-indigo-500/10 transition-all" />
                        <Rocket className="w-10 h-10 text-indigo-500 mb-8" />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white">Resume Pro</h3>
                            <p className="text-sm text-muted-foreground font-medium">ATS-optimized career builder.</p>
                        </div>
                    </Link>
                    <Link to="/tools/pdf/merge" className="group saas-card flex flex-col justify-between overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -mr-10 -mt-10 blur-xl group-hover:bg-purple-500/10 transition-all" />
                        <Zap className="w-10 h-10 text-purple-500 mb-8" />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white">Cloud PDF</h3>
                            <p className="text-sm text-muted-foreground font-medium">Instant merge, split & compress.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
      </section>

      {/* Modern Tool Directory */}
      <section id="tools" className="px-4 scroll-mt-32">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-25 transition duration-1000" />
              <div className="relative">
                <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="What tool do you need today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 md:pl-20 pr-6 md:pr-8 py-5 md:py-7 rounded-2xl md:rounded-[2.5rem] border border-white/5 bg-[#111] focus:bg-black focus:border-primary/50 outline-none transition-all text-lg md:text-xl font-bold text-white placeholder:text-muted-foreground/30 shadow-2xl"
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
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                      : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-24">
            {categories.map((category) => {
              const categoryTools = filteredTools.filter(t => t.category === category);
              if (categoryTools.length === 0) return null;

              return (
                <div key={category} className="space-y-10">
                  <div className="flex items-center gap-6">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-white uppercase italic">
                      {category} Modules
                    </h2>
                    <div className="h-px flex-grow bg-gradient-to-r from-white/10 to-transparent" />
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
            <div className="text-center py-32 bg-white/5 rounded-[4rem] border border-dashed border-white/10">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
              <p className="text-xl font-bold text-muted-foreground">No tools matched your search query.</p>
            </div>
          )}
        </div>
      </section>

      {/* Global CTA Section */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto saas-card !p-12 md:!p-24 text-center space-y-10 relative overflow-hidden group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[140px] -z-10 group-hover:bg-purple-500/10 transition-colors duration-1000" />
          
          <div className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
              Ready to experience the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 italic">Student OS?</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl font-medium">
              Join thousands of students who have already upgraded their workflow. No credit card required to start.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link to="/pricing" className="saas-button-primary !px-12 !py-6 text-base">
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
