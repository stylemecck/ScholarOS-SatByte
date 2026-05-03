import { motion } from 'framer-motion';
import { Heart, Code, Coffee, GraduationCap } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-4"
        >
          <Heart className="w-10 h-10 fill-current" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight"
        >
          Built by a Student, <br />
          <span className="text-primary">For the Students.</span>
        </motion.h1>
      </section>

      {/* The Story */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6 text-lg text-muted-foreground leading-relaxed"
        >
          <p>
            Hey there! I'm <span className="text-foreground font-bold underline decoration-primary/30 decoration-4">Satyam Kumar</span>. Like many of you, my days are filled with late-night coding sessions, competitive exam prep, and the constant hustle of student life.
          </p>
          <p>
            What started as a simple collection of calculators has evolved into something much bigger. I realized that students don't just need GPA formulas—they need a professional command center. That's why I've expanded <span className="text-foreground font-bold">Student Toolkit Pro</span> into a full-featured "Mega Toolkit" with industry-standard PDF manipulation, lightning-fast image processing, and AI-driven career tools.
          </p>
          <p>
            The goal remains the same: No boardroom politics, no complex corporate jargon. Just a powerful, all-in-one workspace built by someone who understands the grind.
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors" />
          <div className="relative bg-card border border-border p-8 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Code className="w-6 h-6" />
              <h3 className="font-bold">The Developer Side</h3>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "Transitioning from a simple toolset to a modular multi-tool platform (like iLovePDF but for students) was a challenge, but seeing thousands of students use it daily makes every line of code worth it."
            </p>
          </div>
        </motion.div>
      </section>

      {/* Mission Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<Coffee className="w-6 h-6" />}
          title="All-in-One Hub"
          description="PDF, Image, Academic, and AI tools in one unified, high-performance interface."
        />
        <FeatureCard 
          icon={<GraduationCap className="w-6 h-6" />}
          title="Pro Standards"
          description="Leveraging industrial libraries like Sharp and PDF-Lib to give you pro results for free."
        />
        <FeatureCard 
          icon={<Heart className="w-6 h-6" />}
          title="Authentically Real"
          description="Every tool here is something I personally use and keep improving based on your feedback."
        />
      </section>

      {/* Vision Statement */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center py-16 bg-primary/5 rounded-[3rem] border border-primary/10 px-8 space-y-6"
      >
        <h2 className="text-3xl font-bold">My Mission</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
          My goal is to make <span className="text-foreground font-bold">Student Toolkit Pro</span> the most comprehensive digital companion for every student. Whether you're merging your lecture notes, resizing project images, or predicting your exam rank, I want to be part of your success story.
        </p>
        <div className="pt-4">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Happy Studying!</p>
          <p className="text-xl font-bold text-foreground">Satyam Kumar</p>
        </div>
      </motion.section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="p-6 bg-card border border-border rounded-2xl space-y-3 hover:border-primary/50 transition-colors">
    <div className="text-primary">{icon}</div>
    <h4 className="font-bold">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default About;
