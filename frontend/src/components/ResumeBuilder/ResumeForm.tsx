import { useResume } from '../../context/ResumeContext';
import { User, Mail, Phone, MapPin, Link, AlignLeft, GraduationCap, Briefcase, Award, Plus, Trash2, Zap, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import axios from 'axios';

const ResumeForm = () => {
  const { resumeData, setResumeData, fillSampleData, resetData } = useResume();
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [enhancingBulletId, setEnhancingBulletId] = useState<string | null>(null);

  const generateAIWeightSummary = async () => {
    if (!resumeData.personalInfo.title) {
      alert("Please enter a Professional Title first!");
      return;
    }
    setIsGeneratingSummary(true);
    try {
      const response = await axios.post('${import.meta.env.VITE_API_URL}/api/tools/generate-summary', {
        jobTitle: resumeData.personalInfo.title,
        skills: resumeData.skills,
        experience: resumeData.experience.map((e: any) => e.position).join(', ')
      });
      setResumeData(prev => ({ ...prev, summary: response.data.summary }));
    } catch (err) {
      console.error(err);
      alert("Failed to generate summary");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const enhanceBullet = async (id: string, text: string) => {
    if (!text) return;
    setEnhancingBulletId(id);
    try {
      const response = await axios.post('${import.meta.env.VITE_API_URL}/api/tools/enhance-bullet', { bulletText: text });
      updateEntry('experience', id, 'description', response.data.enhanced);
    } catch (err) {
      console.error(err);
      alert("Failed to enhance bullet point");
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

  const addEntry = (section: 'education' | 'experience' | 'projects') => {
    const newEntry = {
      id: Date.now().toString(),
      ...(section === 'education' ? { institution: '', degree: '', startDate: '', endDate: '', location: '' } :
         section === 'experience' ? { company: '', position: '', startDate: '', endDate: '', description: '' } :
         { name: '', link: '', description: '' })
    };
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], newEntry]
    }));
  };

  const removeEntry = (section: 'education' | 'experience' | 'projects', id: string) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((item: any) => item.id !== id)
    }));
  };

  const updateEntry = (section: 'education' | 'experience' | 'projects', id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map((item: any) => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Editor</h2>
        <div className="flex gap-2">
          <button 
            onClick={fillSampleData}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-all"
          >
            <Zap className="w-3.5 h-3.5" /> Demo Data
          </button>
          <button 
            onClick={resetData}
            className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-bold hover:bg-muted/80 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Personal Info */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold">
          <User className="w-5 h-5" />
          <h3>Personal Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" value={resumeData.personalInfo.fullName} onChange={(v: string) => updatePersonalInfo('fullName', v)} placeholder="John Doe" />
          <Input label="Professional Title" value={resumeData.personalInfo.title} onChange={(v: string) => updatePersonalInfo('title', v)} placeholder="Full Stack Developer" />
          <Input label="Email" value={resumeData.personalInfo.email} onChange={(v: string) => updatePersonalInfo('email', v)} placeholder="john@example.com" icon={<Mail className="w-4 h-4" />} />
          <Input label="Phone" value={resumeData.personalInfo.phone} onChange={(v: string) => updatePersonalInfo('phone', v)} placeholder="+1 234 567 890" icon={<Phone className="w-4 h-4" />} />
          <Input label="Location" value={resumeData.personalInfo.location} onChange={(v: string) => updatePersonalInfo('location', v)} placeholder="New York, USA" icon={<MapPin className="w-4 h-4" />} />
          <Input label="LinkedIn" value={resumeData.personalInfo.linkedin} onChange={(v: string) => updatePersonalInfo('linkedin', v)} placeholder="linkedin.com/in/johndoe" icon={<Link className="w-4 h-4" />} />
        </div>
      </section>

      {/* Summary */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold">
            <AlignLeft className="w-5 h-5" />
            <h3>Professional Summary</h3>
          </div>
          <button 
            onClick={generateAIWeightSummary}
            disabled={isGeneratingSummary}
            className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all disabled:opacity-50"
          >
            {isGeneratingSummary ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            AI Magic
          </button>
        </div>
        <textarea 
          className="w-full h-32 p-4 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary outline-none transition-all resize-none text-sm"
          placeholder="Briefly describe your career goals and key achievements..."
          value={resumeData.summary}
          onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
        />
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Briefcase className="w-5 h-5" />
            <h3>Experience</h3>
          </div>
          <button onClick={() => addEntry('experience')} className="text-primary hover:bg-primary/10 p-1 rounded-md transition-all">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {resumeData.experience.map((exp: any) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-card border border-border space-y-4 relative group">
              <button onClick={() => removeEntry('experience', exp.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Company" value={exp.company} onChange={(v: string) => updateEntry('experience', exp.id, 'company', v)} placeholder="Google" />
                <Input label="Position" value={exp.position} onChange={(v: string) => updateEntry('experience', exp.id, 'position', v)} placeholder="Software Engineer" />
                <Input label="Start Date" value={exp.startDate} onChange={(v: string) => updateEntry('experience', exp.id, 'startDate', v)} placeholder="Jan 2022" />
                <Input label="End Date" value={exp.endDate} onChange={(v: string) => updateEntry('experience', exp.id, 'endDate', v)} placeholder="Present" />
              </div>
              <div className="relative">
                <textarea 
                  className="w-full h-24 p-3 rounded-lg bg-background border border-border text-sm outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Key responsibilities and achievements..."
                  value={exp.description}
                  onChange={(e) => updateEntry('experience', exp.id, 'description', e.target.value)}
                />
                <button 
                  onClick={() => enhanceBullet(exp.id, exp.description)}
                  disabled={enhancingBulletId === exp.id}
                  className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary rounded-md text-[10px] font-black uppercase hover:bg-primary/20 transition-all disabled:opacity-50"
                >
                  {enhancingBulletId === exp.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  AI Enhance
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold">
            <GraduationCap className="w-5 h-5" />
            <h3>Education</h3>
          </div>
          <button onClick={() => addEntry('education')} className="text-primary hover:bg-primary/10 p-1 rounded-md transition-all">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {resumeData.education.map((edu: any) => (
            <motion.div key={edu.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-card border border-border space-y-4 relative group">
              <button onClick={() => removeEntry('education', edu.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Institution" value={edu.institution} onChange={(v: string) => updateEntry('education', edu.id, 'institution', v)} placeholder="NIT" />
                <Input label="Degree" value={edu.degree} onChange={(v: string) => updateEntry('education', edu.id, 'degree', v)} placeholder="MCA" />
                <Input label="Start Date" value={edu.startDate} onChange={(v: string) => updateEntry('education', edu.id, 'startDate', v)} placeholder="2020" />
                <Input label="End Date" value={edu.endDate} onChange={(v: string) => updateEntry('education', edu.id, 'endDate', v)} placeholder="2023" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Zap className="w-5 h-5" />
            <h3>Projects</h3>
          </div>
          <button onClick={() => addEntry('projects')} className="text-primary hover:bg-primary/10 p-1 rounded-md transition-all">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {resumeData.projects.map((proj: any) => (
            <motion.div key={proj.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-card border border-border space-y-4 relative group">
              <button onClick={() => removeEntry('projects', proj.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Project Name" value={proj.name} onChange={(v: string) => updateEntry('projects', proj.id, 'name', v)} placeholder="E-commerce App" />
                <Input label="Project Link" value={proj.link} onChange={(v: string) => updateEntry('projects', proj.id, 'link', v)} placeholder="github.com/..." />
              </div>
              <textarea 
                className="w-full h-20 p-3 rounded-lg bg-background border border-border text-sm outline-none focus:ring-1 focus:ring-primary"
                placeholder="Short description of the project..."
                value={proj.description}
                onChange={(e) => updateEntry('projects', proj.id, 'description', e.target.value)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Award className="w-5 h-5" />
          <h3>Skills</h3>
        </div>
        <input 
          className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
          placeholder="Enter skills separated by commas (e.g. React, Node.js, Python)"
          value={resumeData.skills.join(', ')}
          onChange={(e) => setResumeData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }))}
        />
      </section>
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
