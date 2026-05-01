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
            Hey there! I'm <span className="text-foreground font-bold underline decoration-primary/30 decoration-4">Satyam Kumar</span>. Like many of you, my days are filled with late-night coding sessions, MCA entrance prep, and the constant hustle of college life.
          </p>
          <p>
            The idea for <span className="text-foreground font-bold">Student Toolkit Pro</span> didn't come from a boardroom—it came from frustration. I was tired of wasting precious study hours searching for simple tools. Whether it was fighting with complex CGPA formulas, guessing my rank after an exam, or struggling to make a resume that didn't look like a 90s word doc, I felt the gap.
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
              "I realized that instead of complaining about the lack of tools, I could use my MERN stack journey to build them. This platform is my way of giving back to the community I belong to."
            </p>
          </div>
        </motion.div>
      </section>

      {/* Mission Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<Coffee className="w-6 h-6" />}
          title="Simplicity First"
          description="No complex UI, no useless clicks. Just the tools you need, exactly when you need them."
        />
        <FeatureCard 
          icon={<GraduationCap className="w-6 h-6" />}
          title="Academic Focus"
          description="Built specifically for the needs of MCA aspirants and Indian college students."
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
          My goal is to make <span className="text-foreground font-bold">Student Toolkit Pro</span> the go-to companion for every student in India. From calculating your first semester GPA to landing your dream job with our resume builder, I want to be part of your success story.
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
