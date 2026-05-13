import { motion } from 'framer-motion';
import { Zap, Shield, Sparkles, Rocket, Users, Code2, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-10 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20 shadow-lg"
          >
            <Sparkles className="w-4 h-4" /> Our Identity
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl sm:text-8xl md:text-[9rem] font-black tracking-tighter leading-[0.85] text-white"
            >
              Built for the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500 italic pr-4">Builders.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed"
            >
              SatByte Toolkit is a unified, premium workspace designed to help students navigate the complexities of modern education and career growth.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center pt-8"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 120}`} alt="Student" />
                </div>
              ))}
            </div>
            <div className="ml-6 flex flex-col items-start justify-center">
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">Empowering 10k+ Students</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">The Problem <br /><span className="text-primary italic">Statement.</span></h2>
            <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed">
                <p>
                Student life is inherently chaotic. The pressure of academics, competitive exams, and career building often leads to a fragmented digital experience.
                </p>
                <p>
                We noticed students jumping between dozens of poorly designed websites just to perform basic tasks like merging PDFs, predicting ranks, or building a resume.
                </p>
                <p className="text-white font-bold border-l-4 border-primary pl-6 py-2 bg-white/5 rounded-r-[2rem]">
                We believed students deserved better. A single, high-fidelity platform that respects their time and intelligence.
                </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-primary/10 blur-[100px] group-hover:bg-primary/20 transition-colors duration-1000" />
            <div className="relative saas-card !p-12 md:!p-16 space-y-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                <Rocket className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-white tracking-tight">The SatByte Solution.</h3>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                    We engineered a "Student Operating System" that brings professional-grade tools into a single, beautiful interface. No ads, no bloat—just pure focus.
                </p>
              </div>
              <Link to="/#tools" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary group-hover:gap-5 transition-all">
                Explore the Ecosystem <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Principles Grid */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-primary pl-8">
            <div className="space-y-2">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">Our DNA</h2>
                <p className="text-xl text-muted-foreground font-medium">The fundamental values that drive our product decisions.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Speed", desc: "Instant processing with zero learning curve. Every second counts for a student." },
              { icon: Users, title: "Student-First", desc: "Every feature is born from actual student feedback and real-world struggles." },
              { icon: Shield, title: "Privacy", desc: "Your data is yours. We process most tasks locally and never sell your info." },
              { icon: Sparkles, title: "Design", desc: "We believe beautiful tools inspire better work. Aesthetics are a priority." }
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group saas-card !p-8 flex flex-col justify-between"
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/5 group-hover:bg-primary group-hover:border-transparent transition-all mb-8">
                  <value.icon className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-black text-white">{value.title}</h4>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto saas-card !p-12 md:!p-24 text-center space-y-10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[140px] -z-10" />
          <div className="space-y-8 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic">The Road Ahead</h2>
            <p className="text-xl md:text-3xl text-muted-foreground font-medium leading-relaxed">
              We are evolving from a toolkit into a <span className="text-white font-bold">comprehensive AI partner</span>. Our roadmap includes personalized learning paths, AI mentors, and a unified career bridge that connects students directly with opportunities.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Builder Section */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 saas-card !p-12 md:!p-20">
          <div className="relative flex-shrink-0 group">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] border-4 border-white/5 overflow-hidden bg-muted relative z-10">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Satyam" alt="Satyam Kumar" className="w-full h-full object-cover" />
              </div>
          </div>
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Code2 className="w-4 h-4" /> Founder & Lead Engineer
            </div>
            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic">Satyam Kumar</h3>
            <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed italic">
              "I built Student Toolkit Pro to solve my own problems as a student. Today, it serves thousands. My goal is simple: to provide industrial-grade quality to every student in India, completely ad-free and affordable."
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Footer Section */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto saas-card !p-12 md:!p-24 text-center space-y-10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-50" />
          <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none relative z-10">
            Start your journey with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 italic">Student Toolkit Pro.</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 relative z-10">
            <Link to="/#tools" className="saas-button-primary !px-12 !py-6 text-base">
              Explore Tools
            </Link>
            <Link to="/signup" className="saas-button-secondary !px-12 !py-6 text-base">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
