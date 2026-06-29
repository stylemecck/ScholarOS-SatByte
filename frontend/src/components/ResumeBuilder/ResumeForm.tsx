import { toast } from '../../lib/toast';
import { useResume } from '../../context/ResumeContext';
import { User, Mail, Phone, MapPin, Link, AlignLeft, GraduationCap, Briefcase, Award, Plus, Trash2, Zap, Sparkles, Loader2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import axios from 'axios';

const ResumeForm = () => {
  const { resumeData, setResumeData, fillSampleData, resetData, aiFillResume } = useResume();
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [enhancingBulletId, setEnhancingBulletId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('personal');

  const [showAiFillDialog, setShowAiFillDialog] = useState(false);
  const [aiTargetRole, setAiTargetRole] = useState('');
  const [aiTargetSkills, setAiTargetSkills] = useState('');
  const [aiFillLoading, setAiFillLoading] = useState(false);

  const handleAiAutoFill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTargetRole) {
      toast.error('Target job title is required');
      return;
    }
    setAiFillLoading(true);
    try {
      await aiFillResume(aiTargetRole, aiTargetSkills);
      toast.success('AI Resume draft generated and loaded successfully!');
      setShowAiFillDialog(false);
    } catch (err: any) {
      toast.error(err.message || 'Auto-fill failed');
    } finally {
      setAiFillLoading(false);
    }
  };

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

  const moveEntry = (section: 'education' | 'experience' | 'projects' | 'certifications' | 'achievements', index: number, direction: 'up' | 'down') => {
    const list = [...(resumeData[section] || [])];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    setResumeData(prev => ({ ...prev, [section]: list }));
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
            onClick={() => setShowAiFillDialog(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Fill
          </button>
          <button 
            onClick={fillSampleData}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
          >
            <Zap className="w-3.5 h-3.5" /> Sample Fill
          </button>
          <button 
            onClick={resetData}
            className="px-3 py-2 bg-white/5 text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
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
          {resumeData.experience.map((exp: any, index: number) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-6 relative group hover:border-white/10 transition-all">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {index > 0 && (
                  <button onClick={() => moveEntry('experience', index, 'up')} className="text-muted-foreground hover:text-primary transition-all">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                )}
                {index < resumeData.experience.length - 1 && (
                  <button onClick={() => moveEntry('experience', index, 'down')} className="text-muted-foreground hover:text-primary transition-all">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => removeEntry('experience', exp.id)} className="text-muted-foreground hover:text-rose-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
          {resumeData.education.map((edu: any, index: number) => (
            <motion.div key={edu.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-6 relative group hover:border-white/10 transition-all">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {index > 0 && (
                  <button onClick={() => moveEntry('education', index, 'up')} className="text-muted-foreground hover:text-primary transition-all">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                )}
                {index < resumeData.education.length - 1 && (
                  <button onClick={() => moveEntry('education', index, 'down')} className="text-muted-foreground hover:text-primary transition-all">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => removeEntry('education', edu.id)} className="text-muted-foreground hover:text-rose-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Institution / University" value={edu.institution} onChange={(v: string) => updateEntry('education', edu.id, 'institution', v)} placeholder="NIT" />
                <Input label="Degree / Course" value={edu.degree} onChange={(v: string) => updateEntry('education', edu.id, 'degree', v)} placeholder="MCA" />
                <Input label="Start Date" value={edu.startDate} onChange={(v: string) => updateEntry('education', edu.id, 'startDate', v)} placeholder="2020" />
                <Input label="Completion Date" value={edu.endDate} onChange={(v: string) => updateEntry('education', edu.id, 'endDate', v)} placeholder="2023" />
              </div>
            </motion.div>
          ))}
          {resumeData.education.length === 0 && (
            <p className="text-center py-10 text-xs text-muted-foreground font-medium italic border-2 border-dashed border-white/5 rounded-3xl">No education added yet. Click + to add your background.</p>
          )}
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects" title="Key Projects" icon={Zap} hasAdd onAdd={() => addEntry('projects')}>
        <div className="space-y-6">
          {resumeData.projects.map((proj: any, index: number) => (
            <motion.div key={proj.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-6 relative group hover:border-white/10 transition-all">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {index > 0 && (
                  <button onClick={() => moveEntry('projects', index, 'up')} className="text-muted-foreground hover:text-primary transition-all">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                )}
                {index < resumeData.projects.length - 1 && (
                  <button onClick={() => moveEntry('projects', index, 'down')} className="text-muted-foreground hover:text-primary transition-all">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => removeEntry('projects', proj.id)} className="text-muted-foreground hover:text-rose-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
          {resumeData.projects.length === 0 && (
            <p className="text-center py-10 text-xs text-muted-foreground font-medium italic border-2 border-dashed border-white/5 rounded-3xl">No projects added yet. Click + to add your first project.</p>
          )}
        </div>
      </Section>

      {/* Certifications */}
      <Section id="certifications" title="Certifications" icon={Award} hasAdd onAdd={() => addEntry('certifications')}>
        <div className="space-y-6">
          {resumeData.certifications?.map((cert: any, index: number) => (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-6 relative group hover:border-white/10 transition-all">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {index > 0 && (
                  <button onClick={() => moveEntry('certifications', index, 'up')} className="text-muted-foreground hover:text-primary transition-all">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                )}
                {index < resumeData.certifications.length - 1 && (
                  <button onClick={() => moveEntry('certifications', index, 'down')} className="text-muted-foreground hover:text-primary transition-all">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => removeEntry('certifications', cert.id)} className="text-muted-foreground hover:text-rose-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Certification Name" value={cert.name} onChange={(v: string) => updateEntry('certifications', cert.id, 'name', v)} placeholder="AWS Solutions Architect" />
                <Input label="Issuing Organization" value={cert.issuer} onChange={(v: string) => updateEntry('certifications', cert.id, 'issuer', v)} placeholder="Amazon Web Services" />
                <Input label="Issue Date" value={cert.date} onChange={(v: string) => updateEntry('certifications', cert.id, 'date', v)} placeholder="Oct 2023" />
              </div>
            </motion.div>
          ))}
          {(!resumeData.certifications || resumeData.certifications.length === 0) && (
            <p className="text-center py-10 text-xs text-muted-foreground font-medium italic border-2 border-dashed border-white/5 rounded-3xl">No certifications added yet. Click + to add your first cert.</p>
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
          {resumeData.achievements?.map((ach: any, index: number) => (
            <motion.div key={ach.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-white/5 border border-white/5 relative group hover:border-white/10 transition-all">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {index > 0 && (
                  <button onClick={() => moveEntry('achievements', index, 'up')} className="text-muted-foreground hover:text-primary transition-all">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                )}
                {index < resumeData.achievements.length - 1 && (
                  <button onClick={() => moveEntry('achievements', index, 'down')} className="text-muted-foreground hover:text-primary transition-all">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => removeEntry('achievements', ach.id)} className="text-muted-foreground hover:text-rose-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea 
                className="w-full h-20 p-4 rounded-xl bg-[#0A0A0A] border border-white/10 text-sm outline-none focus:border-primary/50 transition-all resize-none leading-relaxed"
                placeholder="Describe a notable achievement, award, or recognition."
                value={ach.description}
                onChange={(e) => updateEntry('achievements', ach.id, 'description', e.target.value)}
              />
            </motion.div>
          ))}
          {(!resumeData.achievements || resumeData.achievements.length === 0) && (
            <p className="text-center py-10 text-xs text-muted-foreground font-medium italic border-2 border-dashed border-white/5 rounded-3xl">No achievements added yet. Click + to add your first achievement.</p>
          )}
        </div>
      </Section>

      {/* Languages & Interests */}
      <Section id="additional" title="Languages & Interests" icon={Award}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Languages</label>
            <input 
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all text-sm font-bold placeholder:text-white/20"
              placeholder="English, Spanish, French..."
              value={resumeData.languages?.join(', ') || ''}
              onChange={(e) => setResumeData(prev => ({ ...prev, languages: e.target.value.split(',').map(s => s.trim()) }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Interests</label>
            <input 
              className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-primary/50 outline-none transition-all text-sm font-bold placeholder:text-white/20"
              placeholder="Photography, Travelling, Reading..."
              value={resumeData.interests?.join(', ') || ''}
              onChange={(e) => setResumeData(prev => ({ ...prev, interests: e.target.value.split(',').map(s => s.trim()) }))}
            />
          </div>
        </div>
      </Section>

      {/* AI Auto-Fill Modal Dialog */}
      {showAiFillDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 no-print animate-fade-in">
          <div className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] w-full max-w-md p-8 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-start border-b border-white/5 pb-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">SaaS Automation</span>
                <h3 className="text-sm font-black text-white">AI Profile Generator</h3>
              </div>
              <button 
                onClick={() => setShowAiFillDialog(false)} 
                className="p-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAiAutoFill} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Target Job Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={aiTargetRole}
                  onChange={(e) => setAiTargetRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold text-white placeholder:text-zinc-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Key Focus Skills (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. React, Next.js, GraphQL"
                  value={aiTargetSkills}
                  onChange={(e) => setAiTargetSkills(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-bold text-white placeholder:text-zinc-600"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setShowAiFillDialog(false)}
                  className="flex-1 py-3 bg-white/5 text-zinc-400 rounded-xl text-xs font-black uppercase tracking-widest border border-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={aiFillLoading}
                  className="flex-1 py-3 bg-primary hover:bg-primary-hover text-zinc-950 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {aiFillLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate Resume
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
