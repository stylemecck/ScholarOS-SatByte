import { toast } from '../../lib/toast';
import { useResume } from '../../context/ResumeContext';
import { User, Mail, Phone, MapPin, Link, AlignLeft, GraduationCap, Briefcase, Award, Plus, Trash2, Zap, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import axios from 'axios';

const ResumeForm = () => {
  const { resumeData, setResumeData, fillSampleData, resetData } = useResume();
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [enhancingBulletId, setEnhancingBulletId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('personal');

  const generateAIWeightSummary = async () => {
    if (!resumeData.personalInfo.title) {
      toast.error('Please enter a Professional Title first!');
      return;
    }
    setIsGeneratingSummary(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tools/generate-summary`, {
        jobTitle: resumeData.personalInfo.title,
        skills: resumeData.skills,
        experience: resumeData.experience.map((e: any) => e.position).join(', ')
      });
      setResumeData(prev => ({ ...prev, summary: response.data.summary }));
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate summary.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const enhanceBullet = async (id: string, text: string, section: 'experience' | 'projects') => {
    if (!text) return;
    setEnhancingBulletId(id);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tools/enhance-bullet`, { bulletText: text });
      updateEntry(section, id, 'description', response.data.enhanced);
    } catch (err) {
      console.error(err);
      toast.error('Failed to enhance bullet point.');
    } finally {
      setEnhancingBulletId(null);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addEntry = (section: 'education' | 'experience' | 'projects' | 'certifications' | 'achievements') => {
    const newEntry = {
      id: Date.now().toString(),
      ...(section === 'education' ? { institution: '', degree: '', startDate: '', endDate: '', location: '' } :
         section === 'experience' ? { company: '', position: '', startDate: '', endDate: '', description: '' } :
         section === 'projects' ? { name: '', link: '', description: '' } :
         section === 'certifications' ? { name: '', issuer: '', date: '' } :
         { description: '' })
    };
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], newEntry]
    }));
  };

  const removeEntry = (section: 'education' | 'experience' | 'projects' | 'certifications' | 'achievements', id: string) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((item: any) => item.id !== id)
    }));
  };

  const updateEntry = (section: 'education' | 'experience' | 'projects' | 'certifications' | 'achievements', id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map((item: any) => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const Section = ({ id, title, icon: Icon, children, hasAdd = false, onAdd = () => {} }: { id: string, title: string, icon: any, children: ReactNode, hasAdd?: boolean, onAdd?: () => void }) => (
    <div className={`border-b border-white/5 last:border-0 overflow-hidden transition-all ${expandedSection === id ? 'bg-white/[0.02]' : ''}`}>
      <button 
        onClick={() => setExpandedSection(expandedSection === id ? null : id)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/[0.03] transition-all"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl ${expandedSection === id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-muted-foreground'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className={`text-sm font-black uppercase tracking-widest ${expandedSection === id ? 'text-white' : 'text-muted-foreground'}`}>{title}</h3>
        </div>
        <div className="flex items-center gap-4">
          {hasAdd && expandedSection === id && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <motion.div animate={{ rotate: expandedSection === id ? 180 : 0 }}>
            <Plus className={`w-4 h-4 ${expandedSection === id ? 'text-primary' : 'text-muted-foreground'} rotate-45`} />
          </motion.div>
        </div>
      </button>
      
      <AnimatePresence>
        {expandedSection === id && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-8 space-y-6 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="divide-y divide-white/5">
      <div className="p-6 flex items-center justify-between bg-white/[0.02]">
        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Platform Tools</h3>
        <div className="flex gap-2">
          <button 
            onClick={fillSampleData}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all border border-primary/10"
          >
            <Zap className="w-3 h-3" /> Auto-Fill
          </button>
          <button 
            onClick={resetData}
            className="px-4 py-2 bg-white/5 text-muted-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Personal Info */}
      <Section id="personal" title="Personal Identity" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" value={resumeData.personalInfo.fullName} onChange={(v: string) => updatePersonalInfo('fullName', v)} placeholder="John Doe" />
          <Input label="Professional Title" value={resumeData.personalInfo.title} onChange={(v: string) => updatePersonalInfo('title', v)} placeholder="Full Stack Developer" />
          <Input label="Email Address" value={resumeData.personalInfo.email} onChange={(v: string) => updatePersonalInfo('email', v)} placeholder="john@example.com" icon={<Mail className="w-4 h-4" />} />
          <Input label="Phone Number" value={resumeData.personalInfo.phone} onChange={(v: string) => updatePersonalInfo('phone', v)} placeholder="+1 234 567 890" icon={<Phone className="w-4 h-4" />} />
          <Input label="Location" value={resumeData.personalInfo.location} onChange={(v: string) => updatePersonalInfo('location', v)} placeholder="New York, USA" icon={<MapPin className="w-4 h-4" />} />
          <Input label="LinkedIn URL" value={resumeData.personalInfo.linkedin} onChange={(v: string) => updatePersonalInfo('linkedin', v)} placeholder="linkedin.com/in/johndoe" icon={<Link className="w-4 h-4" />} />
          <Input label="GitHub / Portfolio" value={resumeData.personalInfo.github || ''} onChange={(v: string) => updatePersonalInfo('github', v)} placeholder="github.com/johndoe" icon={<Link className="w-4 h-4" />} />
        </div>
      </Section>

      {/* Summary */}
      <Section id="summary" title="Professional Summary" icon={AlignLeft}>
        <div className="space-y-4">
          <div className="flex justify-end">
            <button 
              onClick={generateAIWeightSummary}
              disabled={isGeneratingSummary}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all border border-primary/10"
            >
              {isGeneratingSummary ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              AI Generate Summary
            </button>
          </div>
          <textarea 
            className="w-full h-40 p-5 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all resize-none text-sm font-medium leading-relaxed placeholder:text-white/20"
            placeholder="Write a powerful summary or use AI to generate one based on your profile..."
            value={resumeData.summary}
            onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
          />
        </div>
      </Section>

      {/* Experience */}
      <Section id="experience" title="Work Experience" icon={Briefcase} hasAdd onAdd={() => addEntry('experience')}>
        <div className="space-y-6">
          {resumeData.experience.map((exp: any) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-6 relative group hover:border-white/10 transition-all">
              <button onClick={() => removeEntry('experience', exp.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-rose-500 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Organization" value={exp.company} onChange={(v: string) => updateEntry('experience', exp.id, 'company', v)} placeholder="Google" />
                <Input label="Job Position" value={exp.position} onChange={(v: string) => updateEntry('experience', exp.id, 'position', v)} placeholder="Software Engineer" />
                <Input label="Start Date" value={exp.startDate} onChange={(v: string) => updateEntry('experience', exp.id, 'startDate', v)} placeholder="Jan 2022" />
                <Input label="End Date" value={exp.endDate} onChange={(v: string) => updateEntry('experience', exp.id, 'endDate', v)} placeholder="Present" />
              </div>
              <div className="relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-2 block">Responsibilities</label>
                <textarea 
                  className="w-full h-32 p-4 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm outline-none focus:border-primary/50 transition-all resize-none leading-relaxed"
                  placeholder="Key responsibilities and achievements. Use AI to enhance for better ATS readability."
                  value={exp.description}
                  onChange={(e) => updateEntry('experience', exp.id, 'description', e.target.value)}
                />
                <button 
                  onClick={() => enhanceBullet(exp.id, exp.description, 'experience')}
                  disabled={enhancingBulletId === exp.id}
                  className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all border border-primary/10"
                >
                  {enhancingBulletId === exp.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Optimize with AI
                </button>
              </div>
            </motion.div>
          ))}
          {resumeData.experience.length === 0 && (
            <p className="text-center py-10 text-xs text-muted-foreground font-medium italic border-2 border-dashed border-white/5 rounded-3xl">No experience added yet. Click + to add your first role.</p>
          )}
        </div>
      </Section>

      {/* Education */}
      <Section id="education" title="Academic Background" icon={GraduationCap} hasAdd onAdd={() => addEntry('education')}>
        <div className="space-y-6">
          {resumeData.education.map((edu: any) => (
            <motion.div key={edu.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-6 relative hover:border-white/10 transition-all">
              <button onClick={() => removeEntry('education', edu.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-rose-500 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Institution / University" value={edu.institution} onChange={(v: string) => updateEntry('education', edu.id, 'institution', v)} placeholder="NIT" />
                <Input label="Degree / Course" value={edu.degree} onChange={(v: string) => updateEntry('education', edu.id, 'degree', v)} placeholder="MCA" />
                <Input label="Start Date" value={edu.startDate} onChange={(v: string) => updateEntry('education', edu.id, 'startDate', v)} placeholder="2020" />
                <Input label="Completion Date" value={edu.endDate} onChange={(v: string) => updateEntry('education', edu.id, 'endDate', v)} placeholder="2023" />
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects" title="Key Projects" icon={Zap} hasAdd onAdd={() => addEntry('projects')}>
        <div className="space-y-6">
          {resumeData.projects.map((proj: any) => (
            <motion.div key={proj.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-6 relative hover:border-white/10 transition-all">
              <button onClick={() => removeEntry('projects', proj.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-rose-500 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Project Name" value={proj.name} onChange={(v: string) => updateEntry('projects', proj.id, 'name', v)} placeholder="E-commerce App" />
                <Input label="Source / Live Link" value={proj.link} onChange={(v: string) => updateEntry('projects', proj.id, 'link', v)} placeholder="github.com/..." />
              </div>
              <div className="relative">
                <textarea 
                  className="w-full h-24 p-4 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm outline-none focus:border-primary/50 transition-all resize-none leading-relaxed"
                  placeholder="Short description of the project impact and technology used."
                  value={proj.description}
                  onChange={(e) => updateEntry('projects', proj.id, 'description', e.target.value)}
                />
                <button 
                  onClick={() => enhanceBullet(proj.id, proj.description, 'projects')}
                  disabled={enhancingBulletId === proj.id}
                  className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all border border-primary/10"
                >
                  {enhancingBulletId === proj.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  AI Enhance
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Certifications */}
      <Section id="certifications" title="Certifications" icon={Award} hasAdd onAdd={() => addEntry('certifications')}>
        <div className="space-y-6">
          {resumeData.certifications?.map((cert: any) => (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-6 relative hover:border-white/10 transition-all">
              <button onClick={() => removeEntry('certifications', cert.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-rose-500 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Certification Name" value={cert.name} onChange={(v: string) => updateEntry('certifications', cert.id, 'name', v)} placeholder="AWS Solutions Architect" />
                <Input label="Issuing Organization" value={cert.issuer} onChange={(v: string) => updateEntry('certifications', cert.id, 'issuer', v)} placeholder="Amazon Web Services" />
                <Input label="Issue Date" value={cert.date} onChange={(v: string) => updateEntry('certifications', cert.id, 'date', v)} placeholder="Oct 2023" />
              </div>
            </motion.div>
          ))}
          {(!resumeData.certifications || resumeData.certifications.length === 0) && (
            <p className="text-center py-6 text-[10px] text-muted-foreground font-black uppercase tracking-widest">No Certifications Listed</p>
          )}
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills" title="Professional Skills" icon={Zap}>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Skill Stack</label>
          <input 
            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all text-sm font-bold placeholder:text-white/20"
            placeholder="React, Node.js, Python, System Design, Cloud Architecture..."
            value={resumeData.skills.join(', ')}
            onChange={(e) => setResumeData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }))}
          />
          <p className="text-[10px] text-muted-foreground font-medium italic px-2">Tip: Separate skills with commas for automatic formatting.</p>
        </div>
      </Section>

      {/* Achievements */}
      <Section id="achievements" title="Key Achievements" icon={Award} hasAdd onAdd={() => addEntry('achievements')}>
        <div className="space-y-6">
          {resumeData.achievements?.map((ach: any) => (
            <motion.div key={ach.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-white/5 border border-white/5 relative hover:border-white/10 transition-all">
              <button onClick={() => removeEntry('achievements', ach.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-rose-500 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
              <textarea 
                className="w-full h-20 p-4 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm outline-none focus:border-primary/50 transition-all resize-none leading-relaxed"
                placeholder="Describe a notable achievement, award, or recognition."
                value={ach.description}
                onChange={(e) => updateEntry('achievements', ach.id, 'description', e.target.value)}
              />
            </motion.div>
          ))}
          {(!resumeData.achievements || resumeData.achievements.length === 0) && (
            <p className="text-center py-6 text-[10px] text-muted-foreground font-black uppercase tracking-widest">No Achievements Listed</p>
          )}
        </div>
      </Section>
    </div>
  );
};

interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: ReactNode;
}

const Input = ({ label, value, onChange, placeholder, icon }: InputProps) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
      <input 
        className={`w-full ${icon ? 'pl-9' : 'px-4'} py-2.5 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-sm`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

export default ResumeForm;
