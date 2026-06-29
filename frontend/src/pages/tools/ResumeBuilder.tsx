import { ResumeProvider, useResume } from '../../context/ResumeContext';
import ResumeForm from '../../components/ResumeBuilder/ResumeForm';
import ResumePreview from '../../components/ResumeBuilder/ResumePreview';
import {
  Download, Layout, Palette, Eye, Edit3, Sparkles,
  ShieldCheck, Loader2, RefreshCw, FileText, Copy, X,
  Save, CheckCircle2, AlertCircle, Plus, Trash2,
  HelpCircle, TrendingUp, Check, Play, BookOpen, FileCheck, Award as CertIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from '../../lib/toast';

// Presets mapping for different Categories
const CATEGORY_PRESETS: Record<string, { template: string; font: string; spacing: string; color: string; desc: string }> = {
  Student: { template: 'Modern', font: 'Inter', spacing: 'Compact', color: '#3b82f6', desc: 'Clean layout emphasizing education and projects.' },
  Fresher: { template: 'Minimal', font: 'Inter', spacing: 'Normal', color: '#10b981', desc: 'Simple, direct layout to highlight skills and internships.' },
  'Software Engineer': { template: 'Tech', font: 'Courier New', spacing: 'Normal', color: '#0f172a', desc: 'Monospace syntax theme ideal for developers.' },
  'Product Manager': { template: 'Corporate', font: 'Georgia', spacing: 'Normal', color: '#8b5cf6', desc: 'Authoritative serif layout optimized for impact.' },
  'UI/UX Designer': { template: 'Creative', font: 'Inter', spacing: 'Loose', color: '#ef4444', desc: 'Two-column design focusing on visual portfolio projects.' },
  Executive: { template: 'Corporate', font: 'Georgia', spacing: 'Normal', color: '#0f172a', desc: 'Spacious professional layout emphasizing senior experience.' },
  Academic: { template: 'Classic', font: 'Playfair Display', spacing: 'Compact', color: '#8b5cf6', desc: 'Serif classic layout ideal for journals and research.' }
};

// ─── inner component (must be inside ResumeProvider) ─────────────
const ResumeBuilderContent = () => {
  const { resumeData, setResumeData } = useResume();

  /* tabs */
  const [activeTab, setActiveTab] = useState<'editor' | 'dashboard' | 'career'>('editor');

  /* layout */
  const [view,     setView]     = useState<'edit' | 'preview'>('edit');
  const [zoom,     setZoom]     = useState(0.75);
  const [sidePane, setSidePane] = useState<'none' | 'ats' | 'coverletter'>('none');
  const [resumeId, setResumeId] = useState<string | null>(null);

  /* lists */
  const [resumesList, setResumesList] = useState<any[]>([]);

  /* download */
  const [isGenerating, setIsGenerating] = useState(false);

  /* save to server */
  const [isSaving, setIsSaving] = useState(false);
  const [savedOk,  setSavedOk]  = useState(false);

  /* ATS */
  const [atsRole,    setAtsRole]    = useState('Software Engineer');
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResults, setAtsResults] = useState<any | null>(null);

  /* Cover Letter */
  const [clCompany, setClCompany] = useState('');
  const [clDesc,    setClDesc]    = useState('');
  const [clResult,  setClResult]  = useState('');
  const [clLoading, setClLoading] = useState(false);

  /* Job Tailoring states */
  const [tailorJD, setTailorJD] = useState('');
  const [tailorLoading, setTailorLoading] = useState(false);
  const [tailorResults, setTailorResults] = useState<any | null>(null);

  /* Career Advisor states */
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advisorResults, setAdvisorResults] = useState<any | null>(null);

  /* Interview Prep states */
  const [prepLoading, setPrepLoading] = useState(false);
  const [prepQuestions, setPrepQuestions] = useState<any[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalResult, setEvalResult] = useState<any | null>(null);

  /* Project Generator states */
  const [projName, setProjName] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projLoading, setProjLoading] = useState(false);
  const [projResult, setProjResult] = useState<any | null>(null);

  const TEMPLATES = ['Modern', 'Classic', 'Creative', 'Minimal', 'Corporate', 'Tech'] as const;
  const COLORS    = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#0f172a', '#F4C430'];
  const FONTS     = ['Inter', 'Roboto', 'Playfair Display', 'Courier New', 'Georgia'];
  const SPACINGS  = ['Compact', 'Normal', 'Loose'];

  const fetchResumesList = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/resumes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) setResumesList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResumesList();
  }, [resumeId]);

  /* Auto-save banner reset */
  useEffect(() => {
    if (savedOk) {
      const t = setTimeout(() => setSavedOk(false), 3000);
      return () => clearTimeout(t);
    }
  }, [savedOk]);

  useEffect(() => {
    const fetchLatestResume = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/resumes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.length > 0) {
          const activeId = localStorage.getItem('active-resume-id');
          const latest = activeId ? (res.data.find((x: any) => x._id === activeId) || res.data[0]) : res.data[0];
          setResumeId(latest._id);
          const hasLocalDraft = localStorage.getItem('resume-draft');
          if (!hasLocalDraft) {
            setResumeData({
              personalInfo: latest.personalInfo || {},
              summary: latest.summary || '',
              education: latest.education || [],
              experience: latest.experience || [],
              projects: latest.projects || [],
              certifications: latest.certifications || [],
              achievements: latest.achievements || [],
              skills: latest.skills || [],
              languages: latest.languages || [],
              interests: latest.interests || [],
              template: latest.template || 'Modern',
              themeColor: latest.themeColor || '#8b5cf6',
              fontFamily: latest.fontFamily || 'Inter',
              spacing: latest.spacing || 'Normal'
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch latest resume", err);
      }
    };
    fetchLatestResume();
  }, [setResumeData]);

  const loadResume = (r: any) => {
    setResumeId(r._id);
    setResumeData({
      personalInfo: r.personalInfo || {},
      summary: r.summary || '',
      education: r.education || [],
      experience: r.experience || [],
      projects: r.projects || [],
      certifications: r.certifications || [],
      achievements: r.achievements || [],
      skills: r.skills || [],
      languages: r.languages || [],
      interests: r.interests || [],
      template: r.template || 'Modern',
      themeColor: r.themeColor || '#8b5cf6',
      fontFamily: r.fontFamily || 'Inter',
      spacing: r.spacing || 'Normal'
    });
    toast.success(`Loaded resume: ${r.title || 'Untitled'}`);
  };

  const handleCreateNew = () => {
    setResumeId(null);
    setResumeData({
      personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', github: '', title: '' },
      summary: '',
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      achievements: [],
      skills: [],
      languages: [],
      interests: [],
      template: 'Modern',
      themeColor: '#8b5cf6',
      fontFamily: 'Inter',
      spacing: 'Normal'
    });
    localStorage.removeItem('resume-draft');
    toast.success('Started a new resume draft');
  };

  const handleDuplicate = async (r: any) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resumes/save`,
        {
          ...r,
          resumeId: undefined,
          title: `${r.title || 'My Resume'} (Copy)`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Resume duplicated');
      fetchResumesList();
    } catch {
      toast.error('Duplication failed');
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Resume deleted');
      if (resumeId === id) {
        handleCreateNew();
      }
      fetchResumesList();
    } catch {
      toast.error('Deletion failed');
    }
  };

  /* ── Word, Weak Word & Metrics Audits ─────────────────────────── */
  const getWordCount = () => {
    const text = [
      resumeData.personalInfo.fullName,
      resumeData.personalInfo.title,
      resumeData.summary,
      ...resumeData.education.map(e => `${e.institution} ${e.degree}`),
      ...resumeData.experience.map(e => `${e.company} ${e.position} ${e.description}`),
      ...resumeData.projects.map(p => `${p.name} ${p.description}`),
      ...resumeData.skills
    ].join(' ').trim();
    return text ? text.split(/\s+/).length : 0;
  };

  const getWeakWordsCount = () => {
    const text = [
      resumeData.summary,
      ...resumeData.experience.map(e => e.description),
      ...resumeData.projects.map(p => p.description)
    ].join(' ').toLowerCase();
    const weakWords = ['worked on', 'assisted', 'helped', 'responsible for', 'handled', 'managed', 'led'];
    let count = 0;
    weakWords.forEach(w => {
      const matches = text.match(new RegExp(`\\b${w}\\b`, 'g'));
      if (matches) count += matches.length;
    });
    return count;
  };

  const calcAtsScore = () => {
    let s = 20;
    if (resumeData.personalInfo?.fullName)   s += 10;
    if (resumeData.personalInfo?.title)      s += 5;
    if (resumeData.summary?.length > 50)     s += 10;
    if (resumeData.experience?.length > 0)   s += 15;
    if (resumeData.education?.length > 0)    s += 10;
    if (resumeData.projects?.length > 0)     s += 10;
    if (resumeData.skills?.length >= 5)      s += 10;
    if (resumeData.certifications?.length > 0) s += 5;
    if (resumeData.personalInfo?.linkedin)   s += 5;
    if ((resumeData.languages?.length ?? 0) > 0)    s += 5;
    if ((resumeData.interests?.length ?? 0) > 0)    s += 5;
    return Math.min(s, 100);
  };
  const localScore = calcAtsScore();
  const CIRC = 2 * Math.PI * 28; // r=28

  /* ── Handlers ─────────────────────────────────────────────────── */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resumes/save`,
        {
          resumeId,
          title: resumeData.personalInfo.fullName || 'My Resume',
          personalInfo: resumeData.personalInfo,
          summary: resumeData.summary,
          education: resumeData.education,
          experience: resumeData.experience,
          projects: resumeData.projects,
          certifications: resumeData.certifications,
          achievements: resumeData.achievements,
          skills: resumeData.skills,
          languages: resumeData.languages,
          interests: resumeData.interests,
          template: resumeData.template,
          themeColor: resumeData.themeColor,
          fontFamily: resumeData.fontFamily,
          spacing: resumeData.spacing
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?._id) {
        setResumeId(res.data._id);
      }
      setSavedOk(true);
      toast.success('Resume saved to your account');
      fetchResumesList();
    } catch {
      toast.error('Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const el = document.getElementById('resume-a4');
      if (el) {
        const opt = {
          margin: 0,
          filename: `${resumeData.personalInfo.fullName || 'resume'}.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2.5, useCORS: true, letterRendering: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };
        const html2pdf = (await import('html2pdf.js')).default;
        await html2pdf().set(opt).from(el).save();
        toast.success('Resume PDF downloaded successfully!');
      } else {
        toast.error('Could not find resume canvas element');
      }
    } catch (err) {
      console.error(err);
      toast.error('PDF export failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRunATS = async () => {
    setAtsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resumes/analyze`,
        { resumeData, targetRole: atsRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAtsResults(res.data);
      toast.success('ATS scan complete');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'ATS scan failed');
    } finally {
      setAtsLoading(false);
    }
  };

  const handleCoverLetter = async () => {
    setClLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resumes/ai-cover-letter`,
        { resumeData, jobTitle: atsRole, companyName: clCompany, jobDescription: clDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClResult(res.data.coverLetter);
      toast.success('Cover letter generated');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Cover letter generation failed');
    } finally {
      setClLoading(false);
    }
  };

  const handleAITailor = async () => {
    if (!tailorJD) {
      toast.error('Please paste a Job Description first');
      return;
    }
    setTailorLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resumes/tailor`,
        { resumeData, jobDescription: tailorJD },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTailorResults(res.data);
      toast.success('AI Resume tailoring complete!');
    } catch {
      toast.error('Tailoring evaluation failed');
    } finally {
      setTailorLoading(false);
    }
  };

  const handleCareerAdvisor = async () => {
    setAdvisorLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resumes/career-advisor`,
        { resumeData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdvisorResults(res.data);
      toast.success('Career audit compiled');
      fetchResumesList();
    } catch {
      toast.error('Consultation failed');
    } finally {
      setAdvisorLoading(false);
    }
  };

  const handleDownloadAdvisorDoc = () => {
    if (!advisorResults) return;
    const title = `${resumeData.personalInfo?.fullName || 'Candidate'} Career Advisor Audit`;
    const docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <style>
          body { font-family: 'Georgia', serif; line-height: 1.6; margin: 1in; color: #333; }
          h1 { color: #D97706; font-size: 22pt; border-bottom: 2px solid #D97706; padding-bottom: 5px; }
          h2 { color: #1e3a8a; font-size: 16pt; margin-top: 20px; }
          p { font-size: 11pt; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p style="color: #666; font-size: 9pt;">Generated by ScholarOS on ${new Date().toLocaleDateString()}</p>
        
        <h2>Recommended Career Paths</h2>
        ${advisorResults.careerPaths?.map((cp: any) => `<p><b>${cp.role}</b> - Demand: ${cp.demand}, Salary Estimate: ${cp.salaryEstimate || 'N/A'}</p>`).join('')}
        
        <h2>Target Learning Roadmap Timeline</h2>
        ${advisorResults.learningRoadmap?.map((r: string) => `<p>${r}</p>`).join('')}

        <h2>Requisite Certifications</h2>
        ${advisorResults.recommendedCertifications?.map((c: string) => `<p>- ${c}</p>`).join('')}
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('Word document outline exported successfully');
  };

  const handleDownloadAdvisorPPT = () => {
    if (!advisorResults) return;
    const title = `${resumeData.personalInfo?.fullName || 'Candidate'} Career Advisor Audit`;
    const slidesHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:p='urn:schemas-microsoft-com:office:powerpoint' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <style>
          body { font-family: 'Poppins', Arial, sans-serif; background: #0f172a; color: #f8fafc; }
          .slide { page-break-before: always; padding: 2in; min-height: 600px; display: flex; flex-direction: column; justify-content: center; }
          h1 { font-size: 32pt; color: #F59E0B; margin-bottom: 20px; font-weight: 800; }
          ul { font-size: 18pt; line-height: 1.6; color: #cbd5e1; }
          li { margin-bottom: 10px; }
          p { font-size: 18pt; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="slide">
          <h1>${title}</h1>
          <p>ScholarOS Career Platform Outline</p>
        </div>
        <div class="slide">
          <h1>Recommended Career Paths</h1>
          <ul>
            ${advisorResults.careerPaths?.map((cp: any) => `<li><b>${cp.role}</b> (${cp.demand} Demand)</li>`).join('')}
          </ul>
        </div>
        <div class="slide">
          <h1>Learning Roadmap Timeline</h1>
          <ul>
            ${advisorResults.learningRoadmap?.map((r: string) => `<li>${r}</li>`).join('')}
          </ul>
        </div>
        <div class="slide">
          <h1>Requisite Certifications</h1>
          <ul>
            ${advisorResults.recommendedCertifications?.map((c: string) => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + slidesHtml], { type: 'application/vnd.ms-powerpoint' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}.ppt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('PowerPoint slideshow exported successfully');
  };

  const handleDownloadAdvisorPDF = async () => {
    const el = document.getElementById('career-advisor-report-preview');
    if (el) {
      toast.info('Generating PDF...');
      const opt = {
        margin: 15,
        filename: `${resumeData.personalInfo?.fullName || 'Candidate'}_Career_Advisor_Audit.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().set(opt).from(el).save();
      toast.success('PDF report exported successfully');
    } else {
      toast.error('Could not compile preview content');
    }
  };

  const handleLoadMockQuestions = async () => {
    setPrepLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resumes/interview-prep`,
        { resumeData, targetRole: atsRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrepQuestions(res.data.questions || []);
      setActiveQuestionIndex(0);
      setUserAnswer('');
      setEvalResult(null);
      toast.success('AI Mock questions generated');
    } catch {
      toast.error('Failed to generate mock prep questions');
    } finally {
      setPrepLoading(false);
    }
  };

  const handleEvaluateMockAnswer = async () => {
    if (!userAnswer) {
      toast.error('Please draft your answer response first');
      return;
    }
    setEvalLoading(true);
    try {
      const activeQ = prepQuestions[activeQuestionIndex];
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resumes/evaluate-answer`,
        { question: activeQ.question, expectedGuidelines: activeQ.guidelines, userAnswer },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setEvalResult(res.data);
      toast.success('AI evaluation complete');
    } catch {
      toast.error('Failed to evaluate answer');
    } finally {
      setEvalLoading(false);
    }
  };

  const handleGenerateStarProject = async () => {
    if (!projName) {
      toast.error('Please provide a project title');
      return;
    }
    setProjLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/resumes/project-generator`,
        { projectName: projName, technologies: projTech },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setProjResult(res.data);
      toast.success('Project blueprint drafted!');
    } catch {
      toast.error('Outline generation failed');
    } finally {
      setProjLoading(false);
    }
  };

  const applyPreset = (presetKey: string) => {
    const p = CATEGORY_PRESETS[presetKey];
    if (p) {
      setResumeData(prev => ({
        ...prev,
        template: p.template as any,
        fontFamily: p.font,
        spacing: p.spacing,
        themeColor: p.color
      }));
      toast.success(`Applied ${presetKey} Category Preset`);
    }
  };

  /* ── shared input style ─────────────────────────────────────── */
  const select = 'text-xs bg-[#1A1A1A] border border-white/5 text-zinc-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-primary/40 transition-all';

  /* ═══════════════════════════════ RENDER ═══════════════════════ */
  return (
    <div className="max-w-[1400px] mx-auto py-8 px-4 space-y-6 text-foreground">

      {/* ── Hero header ─────────────────────────────────────────── */}
      <section className="relative text-center space-y-4 py-10 overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/60 backdrop-blur-xl no-print">
        <div className="absolute top-0 left-1/3 w-[280px] h-[280px] bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="relative space-y-3 px-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-black uppercase tracking-wider border border-border">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Premium AI Career Platform
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-foreground">
            SatByte <span className="text-primary italic">Resume & Career Suite</span>
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto font-medium">
            Enterprise-grade builder with AI career advisor, job tailoring matching, mock interview preparation, and real-time dashboard analytics.
          </p>
        </div>

        {/* Live ATS ring */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-1">
          <svg width="72" height="72" className="-rotate-90">
            <circle cx="36" cy="36" r="28" stroke="#222" strokeWidth="5" fill="transparent" />
            <circle cx="36" cy="36" r="28" stroke="#F4C430" strokeWidth="5" fill="transparent"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC - (CIRC * localScore) / 100}
              className="transition-all duration-700"
            />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">ATS Score</span>
          <span className="text-lg font-black text-primary -mt-8">{localScore}%</span>
        </div>
      </section>

      {/* ── Tab Selector Header ──────────────────────────────────── */}
      <div className="flex bg-[#111] border border-white/5 rounded-2xl p-1 no-print max-w-xl mx-auto shadow-xl">
        <button onClick={() => setActiveTab('dashboard')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-primary text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'}`}
        >
          <Layout className="w-3.5 h-3.5" /> Dashboard
        </button>
        <button onClick={() => setActiveTab('editor')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'editor' ? 'bg-primary text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'}`}
        >
          <Edit3 className="w-3.5 h-3.5" /> Editor & Preview
        </button>
        <button onClick={() => setActiveTab('career')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'career' ? 'bg-primary text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'}`}
        >
          <Sparkles className="w-3.5 h-3.5" /> AI Career Suite
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ── TAB 1: DASHBOARD ─────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Health Score radial */}
              <div className="bg-[#111] border border-white/5 p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">Resume Health Score</h3>
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="50" stroke="#222" strokeWidth="8" fill="transparent" />
                    <circle cx="64" cy="64" r="50"
                      stroke="#F4C430" strokeWidth="8" fill="transparent"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 - (2 * Math.PI * 50 * localScore) / 100}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{localScore}%</span>
                    <span className="text-[8px] font-black uppercase text-zinc-500 tracking-wider">ATS MATCH</span>
                  </div>
                </div>
                <div className="text-xs font-medium text-zinc-400">
                  {localScore >= 80 ? '🟢 Excellent — Standard compatible profile' : '🟡 Add more sections to reach green zone score'}
                </div>
              </div>

              {/* Completion List */}
              <div className="bg-[#111] border border-white/5 p-6 rounded-3xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">Section Completion Checklist</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Identity Profile Info</span>
                    {resumeData.personalInfo?.fullName ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Professional Summary</span>
                    {resumeData.summary?.length > 30 ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Work Experience List</span>
                    {resumeData.experience?.length > 0 ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Education Background</span>
                    {resumeData.education?.length > 0 ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Projects & Certifications</span>
                    {(resumeData.projects?.length > 0 && resumeData.certifications?.length > 0) ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                  </div>
                </div>
              </div>

              {/* Weak words and repeated terms audits */}
              <div className="bg-[#111] border border-white/5 p-6 rounded-3xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">ATS Content Analyzer</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <span className="text-2xl font-black text-white">{getWordCount()}</span>
                    <span className="block text-[8px] font-black uppercase text-zinc-500 tracking-wider mt-1">Total Words</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <span className="text-2xl font-black text-rose-400">{getWeakWordsCount()}</span>
                    <span className="block text-[8px] font-black uppercase text-zinc-500 tracking-wider mt-1">Weak Passive Verbs</span>
                  </div>
                </div>
                <div className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                  💡 Avoid passive buzzwords like "assisted", "helped", or "led" when describing achievements. Use impact metrics instead.
                </div>
              </div>

            </div>

            {/* Version Switcher and Category Presets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Version/Draft Switcher */}
              <div className="bg-[#111] border border-white/5 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">Draft version manager</h3>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider mt-0.5">Switch or copy active resume records</p>
                  </div>
                  <button onClick={handleCreateNew}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Draft
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scroll pr-2">
                  {resumesList.map((r) => (
                    <div key={r._id} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${resumeId === r._id ? 'bg-primary/5 border-primary/20' : 'bg-white/5 border-transparent'}`}>
                      <div className="cursor-pointer" onClick={() => loadResume(r)}>
                        <p className="text-xs font-bold text-white">{r.title || 'Untitled Resume'}</p>
                        <p className="text-[9px] text-zinc-500 mt-0.5">Last saved: {new Date(r.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDuplicate(r)} className="p-1.5 bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Duplicate version">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteResume(r._id)} className="p-1.5 bg-white/5 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {resumesList.length === 0 && (
                    <p className="text-center py-6 text-xs text-zinc-600 font-medium italic">No drafts saved to the cloud database yet.</p>
                  )}
                </div>
              </div>

              {/* Template Category Presets */}
              <div className="bg-[#111] border border-white/5 p-6 rounded-3xl space-y-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">Category Presets Selector</h3>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wider mt-0.5">Apply layout configurations based on career vertical</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.keys(CATEGORY_PRESETS).map((k) => (
                    <button key={k} onClick={() => applyPreset(k)}
                      className="p-3 bg-white/5 border border-white/5 rounded-2xl text-left hover:border-primary/30 transition-all hover:bg-white/[0.08]"
                    >
                      <span className="text-[10px] font-black uppercase tracking-wider text-white block">{k}</span>
                      <span className="text-[8px] text-zinc-500 block mt-1 leading-tight">{CATEGORY_PRESETS[k].desc}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ── TAB 2: EDITOR & CANVAS ───────────────────────────────── */}
        {activeTab === 'editor' && (
          <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

            {/* ── Toolbar ─────────────────────────────────────────────── */}
            <div className="bg-[#111]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 no-print">

              {/* Style controls */}
              <div className="flex items-center flex-wrap gap-4">

                {/* Template */}
                <div className="flex items-center gap-2">
                  <Layout className="w-3.5 h-3.5 text-zinc-500" />
                  <select value={resumeData.template}
                    onChange={e => setResumeData(p => ({ ...p, template: e.target.value as any }))}
                    className={select}
                  >
                    {TEMPLATES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Font */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Font</span>
                  <select value={resumeData.fontFamily || 'Inter'}
                    onChange={e => setResumeData(p => ({ ...p, fontFamily: e.target.value }))}
                    className={select}
                  >
                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                {/* Spacing */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Gap</span>
                  <select value={resumeData.spacing || 'Normal'}
                    onChange={e => setResumeData(p => ({ ...p, spacing: e.target.value }))}
                    className={select}
                  >
                    {SPACINGS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Colors */}
                <div className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-zinc-500" />
                  <div className="flex gap-1.5">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setResumeData(p => ({ ...p, themeColor: c }))}
                        title={c}
                        className={`w-5 h-5 rounded-full transition-all border-2 ${resumeData.themeColor === c ? 'border-white scale-125 shadow-md' : 'border-transparent hover:scale-110'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">

                {/* Save */}
                <button onClick={handleSave} disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-60"
                >
                  {isSaving   ? <Loader2   className="w-3.5 h-3.5 animate-spin" /> :
                   savedOk    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> :
                                <Save      className="w-3.5 h-3.5" />}
                  {isSaving ? 'Saving…' : savedOk ? 'Saved!' : 'Save'}
                </button>

                {/* ATS toggle */}
                <button onClick={() => setSidePane(p => p === 'ats' ? 'none' : 'ats')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    sidePane === 'ats' ? 'bg-primary text-zinc-950 border-transparent' : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> ATS Audit
                </button>

                {/* Cover letter toggle */}
                <button onClick={() => setSidePane(p => p === 'coverletter' ? 'none' : 'coverletter')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    sidePane === 'coverletter' ? 'bg-primary text-zinc-950 border-transparent' : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Cover Letter
                </button>

                {/* Download */}
                <button onClick={handleDownload} disabled={isGenerating}
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-zinc-950 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all disabled:opacity-70"
                >
                  {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  {isGenerating ? 'Exporting…' : 'Download PDF'}
                </button>
              </div>
            </div>

            {/* ── Main 2-col layout ────────────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

              {/* ── Left: Form column ──────────────────────────────────── */}
              <div className={`xl:col-span-5 space-y-4 ${view === 'preview' ? 'hidden xl:block' : 'block'} no-print`}>

                {/* ATS pane */}
                <AnimatePresence>
                  {sidePane === 'ats' && (
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                      className="bg-[#131313] border border-white/5 rounded-3xl p-6 space-y-5 shadow-2xl"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" /> ATS Compatibility Audit
                        </h3>
                        <button onClick={() => setSidePane('none')} className="text-zinc-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                      </div>

                      {/* Live score ring */}
                      <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="relative w-20 h-20 shrink-0">
                          <svg className="w-full h-full -rotate-90">
                            <circle cx="40" cy="40" r="32" stroke="#222" strokeWidth="6" fill="transparent" />
                            <circle cx="40" cy="40" r="32"
                              stroke={localScore >= 70 ? '#10b981' : localScore >= 50 ? '#f59e0b' : '#ef4444'}
                              strokeWidth="6" fill="transparent"
                              strokeDasharray={2 * Math.PI * 32}
                              strokeDashoffset={2 * Math.PI * 32 - (2 * Math.PI * 32 * localScore) / 100}
                              className="transition-all duration-700"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-black text-white">{localScore}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-black text-zinc-300">Resume Readiness Score</p>
                          <p className="text-[10px] text-zinc-500 mt-1">
                            {localScore >= 80 ? '🟢 Excellent — ready to submit' :
                             localScore >= 60 ? '🟡 Good — a few improvements needed' :
                                                '🔴 Needs work — fill in more sections'}
                          </p>
                        </div>
                      </div>

                      {/* Detailed ATS scanner analysis */}
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Target Job / Role</label>
                          <div className="flex gap-2">
                            <input className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-xs"
                              placeholder="e.g. Frontend Developer" value={atsRole} onChange={e => setAtsRole(e.target.value)} />
                            <button onClick={handleRunATS} disabled={atsLoading}
                              className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white border border-white/5 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                              {atsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                              Scan
                            </button>
                          </div>
                        </div>

                        {atsResults && (
                          <div className="space-y-3 bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 text-xs max-h-80 overflow-y-auto custom-scroll leading-relaxed">
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Matching Verdict</span>
                              <p className="font-black text-white mt-0.5">{atsResults.compatibility || 'N/A'}</p>
                            </div>
                            {atsResults.missingKeywords?.length > 0 && (
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block mb-1">Missing JD Keywords</span>
                                <div className="flex flex-wrap gap-1">
                                  {atsResults.missingKeywords.map((k: string) => <span key={k} className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/10 rounded-full text-[9px]">{k}</span>)}
                                </div>
                              </div>
                            )}
                            {atsResults.skillSuggestions?.length > 0 && (
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block mb-1">Recommended Skills</span>
                                <div className="flex flex-wrap gap-1">
                                  {atsResults.skillSuggestions.map((s: string) => <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/10 rounded-full text-[9px]">{s}</span>)}
                                </div>
                              </div>
                            )}
                            {atsResults.formatFeedback && (
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Format & Structure Audit</span>
                                <p className="text-zinc-300 mt-1 text-[11px] leading-relaxed">{atsResults.formatFeedback}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Cover Letter pane */}
                <AnimatePresence>
                  {sidePane === 'coverletter' && (
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                      className="bg-[#131313] border border-white/5 rounded-3xl p-6 space-y-5 shadow-2xl"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary animate-pulse" /> AI Cover Letter Generator
                        </h3>
                        <button onClick={() => setSidePane('none')} className="text-zinc-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Target Role</label>
                            <input className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs focus:ring-1 focus:ring-primary outline-none"
                              value={atsRole} onChange={e => setAtsRole(e.target.value)} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Company Name</label>
                            <input className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs focus:ring-1 focus:ring-primary outline-none"
                              placeholder="e.g. Google" value={clCompany} onChange={e => setClCompany(e.target.value)} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Job Description Context</label>
                          <textarea className="w-full h-24 p-3 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs outline-none focus:border-primary/50 resize-none"
                            placeholder="Paste specific JD requirements to customize pitch points..." value={clDesc} onChange={e => setClDesc(e.target.value)} />
                        </div>

                        <button onClick={handleCoverLetter} disabled={clLoading}
                          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-zinc-950 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all disabled:opacity-75"
                        >
                          {clLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                          {clLoading ? 'Generating letter...' : 'Compile Cover Letter'}
                        </button>

                        {clResult && (
                          <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Draft Output</span>
                              <button onClick={() => { navigator.clipboard.writeText(clResult); toast.success('Copied cover letter!'); }}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                              >
                                <Copy className="w-3 h-3" /> Copy
                              </button>
                            </div>
                            <pre className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 text-[10px] leading-relaxed text-zinc-300 overflow-y-auto whitespace-pre-wrap font-sans max-h-64 custom-scroll border border-white/5">
                              {clResult}
                            </pre>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form card */}
                <div className="bg-[#111] border border-white/5 rounded-[2rem] overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div>
                      <h3 className="text-sm font-black text-white">Resume Editor</h3>
                      <p className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Live Sync Preview</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black uppercase text-zinc-500 block">ATS Score</span>
                      <span className={`text-lg font-black ${localScore >= 70 ? 'text-emerald-400' : localScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {localScore}%
                      </span>
                    </div>
                  </div>
                  <ResumeForm />
                </div>
              </div>

              {/* ── Right: Preview column ──────────────────────────────── */}
              <div className={`xl:col-span-7 ${view === 'edit' ? 'hidden xl:block' : 'block'} sticky top-24 space-y-4`}>

                {/* Mobile toggle */}
                <div className="xl:hidden flex bg-[#111] border border-white/5 rounded-2xl p-1 no-print shadow-xl">
                  <button onClick={() => setView('edit')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'edit' ? 'bg-primary text-zinc-950' : 'text-zinc-400'}`}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => setView('preview')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'preview' ? 'bg-primary text-zinc-950' : 'text-zinc-400'}`}
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                </div>

                {/* Preview canvas */}
                <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-4 shadow-2xl">
                  {/* Zoom bar */}
                  <div className="flex items-center justify-between mb-4 px-2 no-print">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">A4 Canvas</span>
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full border border-white/5 text-zinc-600">{resumeData.template}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setZoom(z => Math.max(0.4, z - 0.05))}
                        className="w-6 h-6 rounded-lg bg-white/5 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-black transition-all">−</button>
                      <span className="text-[10px] font-bold text-zinc-500 w-8 text-center">{Math.round(zoom * 100)}%</span>
                      <button onClick={() => setZoom(z => Math.min(1.2, z + 0.05))}
                        className="w-6 h-6 rounded-lg bg-white/5 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-black transition-all">+</button>
                    </div>
                  </div>

                  {/* Scrollable preview area */}
                  <div className="w-full overflow-auto rounded-2xl bg-[#1a1a1a] border border-white/5 animate-fade-in"
                    style={{ maxHeight: 'calc(100vh - 220px)', minHeight: '600px' }}
                  >
                    <div className="flex justify-center py-6">
                      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', width: '794px', minHeight: '1120px' }}
                        className="transition-transform duration-300 shadow-2xl"
                      >
                        <ResumePreview />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </motion.div>
        )}

        {/* ── TAB 3: AI CAREER SUITE ───────────────────────────────── */}
        {activeTab === 'career' && (
          <motion.div key="career" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* 1. Job Description Tailoring */}
              <div className="bg-[#111] border border-white/5 p-6 rounded-3xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-primary" /> AI Job Description Tailoring
                </h3>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Paste the job posting requirements below. AI will score compatibility, detect keyword gaps, and generate customized summaries.
                </p>
                <textarea className="w-full h-36 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs outline-none focus:border-primary/50 resize-none font-medium text-zinc-300 leading-relaxed placeholder:text-zinc-600"
                  placeholder="Paste target job listing requirements..." value={tailorJD} onChange={e => setTailorJD(e.target.value)} />
                <button onClick={handleAITailor} disabled={tailorLoading}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-zinc-950 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all disabled:opacity-75"
                >
                  {tailorLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Compare & Tailor Resume (4 Credits)
                </button>

                {tailorResults && (
                  <div className="space-y-4 bg-white/5 border border-white/5 p-4 rounded-2xl text-xs max-h-72 overflow-y-auto custom-scroll leading-relaxed">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-black uppercase text-zinc-400">Match score</span>
                      <span className="text-sm font-black text-emerald-400">{tailorResults.matchPercentage}%</span>
                    </div>
                    {tailorResults.missingKeywords?.length > 0 && (
                      <div>
                        <span className="text-[9px] font-black uppercase text-zinc-500 block mb-1">Missing JD Keywords</span>
                        <div className="flex flex-wrap gap-1">
                          {tailorResults.missingKeywords.map((k: string) => <span key={k} className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/10 rounded-full text-[9px]">{k}</span>)}
                        </div>
                      </div>
                    )}
                    {tailorResults.suggestedSummary && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase text-zinc-500">Optimized summary proposal</span>
                          <button onClick={() => { setResumeData(prev => ({ ...prev, summary: tailorResults.suggestedSummary })); toast.success('Applied to draft!'); }}
                            className="text-[9px] bg-primary/10 text-primary border border-primary/10 px-2 py-0.5 rounded-md hover:bg-primary/20 transition-all"
                          >
                            Apply Draft
                          </button>
                        </div>
                        <p className="p-3 bg-black/40 rounded-xl text-zinc-300 leading-normal text-[10px]">{tailorResults.suggestedSummary}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. AI Career Advisor */}
              <div className="bg-[#111] border border-white/5 p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" /> AI Career Advisor
                    </h3>
                    <p className="text-[10px] text-zinc-500 leading-normal mt-0.5">
                      Analyze current skills/education history to draft suitable roadmaps and salary expectations.
                    </p>
                  </div>
                  <button onClick={handleCareerAdvisor} disabled={advisorLoading}
                    className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                  >
                    {advisorLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Consult AI (5 Credits)
                  </button>
                </div>

                {advisorResults ? (
                  <div className="space-y-4 bg-white/5 p-4 rounded-2xl text-xs max-h-96 overflow-y-auto custom-scroll leading-relaxed">
                    <div id="career-advisor-report-preview" className="space-y-4 bg-[#111] p-4 rounded-xl border border-white/5">
                      <div>
                        <span className="text-[9px] font-black uppercase text-zinc-500 block mb-2">Suitable Career Paths</span>
                        <div className="space-y-2">
                          {advisorResults.careerPaths?.map((cp: any, idx: number) => (
                            <div key={idx} className="flex justify-between p-2 bg-black/30 rounded-xl text-[11px]">
                              <span className="font-bold text-white">{cp.role}</span>
                              <span className="text-primary text-[10px] uppercase font-black tracking-wider">{cp.demand} Demand</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {advisorResults.recommendedCertifications?.length > 0 && (
                        <div>
                          <span className="text-[9px] font-black uppercase text-zinc-500 block mb-1">Recommended Certs</span>
                          <div className="flex flex-wrap gap-1">
                            {advisorResults.recommendedCertifications.map((c: string) => <span key={c} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-full text-[9px]">{c}</span>)}
                          </div>
                        </div>
                      )}
                      {advisorResults.learningRoadmap?.length > 0 && (
                        <div>
                          <span className="text-[9px] font-black uppercase text-zinc-500 block mb-2">3-Step Learning Milestones</span>
                          <div className="space-y-2 relative border-l border-white/5 pl-4 ml-1">
                            {advisorResults.learningRoadmap.map((r: string, idx: number) => (
                              <div key={idx} className="relative">
                                <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 bg-primary rounded-full" />
                                <p className="text-[10px] leading-relaxed text-zinc-300 font-medium">{r}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <button onClick={handleDownloadAdvisorPDF} className="flex-1 py-2 bg-primary hover:bg-primary-hover text-zinc-950 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                        PDF
                      </button>
                      <button onClick={handleDownloadAdvisorDoc} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                        Word (Doc)
                      </button>
                      <button onClick={handleDownloadAdvisorPPT} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                        Slides (PPT)
                      </button>
                    </div>
                    <span className="text-[8px] font-black text-emerald-400 block text-center uppercase tracking-wider mt-1">
                      💾 Saved to your Saved Documents workspace.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-2 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                    <BookOpen className="w-8 h-8 text-zinc-600" />
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Assessment Ready</p>
                    <p className="text-[9px] text-zinc-600 max-w-[200px] leading-normal font-medium">Click Consult AI to evaluate your candidate credentials.</p>
                  </div>
                )}
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* 3. Interview Prep Mode */}
              <div className="bg-[#111] border border-white/5 p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-primary" /> Practice Interview Simulator
                    </h3>
                    <p className="text-[10px] text-zinc-500 leading-normal mt-0.5">
                      Generate behavioral and technical prep questions based on your profile context.
                    </p>
                  </div>
                  <button onClick={handleLoadMockQuestions} disabled={prepLoading}
                    className="flex items-center gap-1.5 bg-primary text-zinc-950 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                  >
                    {prepLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    Start prep
                  </button>
                </div>

                {prepQuestions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-white/5 custom-scroll">
                      {prepQuestions.map((_, i) => (
                        <button key={i} onClick={() => { setActiveQuestionIndex(i); setUserAnswer(''); setEvalResult(null); }}
                          className={`px-3 py-1 text-[10px] font-black rounded-lg border uppercase tracking-wider transition-colors shrink-0 ${activeQuestionIndex === i ? 'bg-primary border-transparent text-zinc-950' : 'bg-white/5 border-transparent text-zinc-400'}`}
                        >
                          Q{i + 1}
                        </button>
                      ))}
                    </div>

                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-1.5">
                      <span className="text-[8px] font-black uppercase text-primary tracking-wider">{prepQuestions[activeQuestionIndex].type} Interview Question</span>
                      <p className="text-xs text-white font-bold leading-relaxed">{prepQuestions[activeQuestionIndex].question}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-zinc-500 ml-1">Draft your response answer</label>
                      <textarea className="w-full h-24 p-3 rounded-xl bg-[#0A0A0A] border border-white/10 text-xs outline-none focus:border-primary/50 resize-none text-zinc-300 leading-relaxed"
                        placeholder="Write your answer..." value={userAnswer} onChange={e => setUserAnswer(e.target.value)} />
                    </div>

                    <button onClick={handleEvaluateMockAnswer} disabled={evalLoading}
                      className="w-full flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-white border border-white/5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      {evalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      Evaluate Response
                    </button>

                    {evalResult && (
                      <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl space-y-2.5 text-xs text-zinc-300">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">AI Evaluation feedback</span>
                          <span className="text-[11px] font-black text-white bg-emerald-500/20 px-2 py-0.5 rounded-md">Score: {evalResult.score}/10</span>
                        </div>
                        <p className="leading-relaxed text-[11px] font-medium">{evalResult.feedback}</p>
                        {evalResult.modelAnswer && (
                          <div className="border-t border-white/5 pt-2.5 space-y-1">
                            <span className="text-[8px] font-black uppercase text-zinc-500">Suggested Model Answer</span>
                            <p className="text-[10px] leading-relaxed font-medium italic text-zinc-400">{evalResult.modelAnswer}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 4. STAR Project Generator */}
              <div className="bg-[#111] border border-white/5 p-6 rounded-3xl space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <CertIcon className="w-4 h-4 text-primary" /> AI STAR Project Generator
                </h3>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Turn a simple idea into an impact-driven STAR project containing description, bullet points, and README text.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-zinc-500 ml-1">Project Name</label>
                    <input className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs focus:ring-1 focus:ring-primary outline-none"
                      placeholder="e.g. Chat application" value={projName} onChange={e => setProjName(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-zinc-500 ml-1">Tech Stack</label>
                    <input className="w-full px-3 py-2 rounded-xl bg-card border border-border text-xs focus:ring-1 focus:ring-primary outline-none"
                      placeholder="e.g. Socket.io, React" value={projTech} onChange={e => setProjTech(e.target.value)} />
                  </div>
                </div>

                <button onClick={handleGenerateStarProject} disabled={projLoading}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-zinc-950 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all disabled:opacity-75"
                >
                  {projLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Generate Project Blueprint
                </button>

                {projResult && (
                  <div className="space-y-3 bg-white/5 p-4 rounded-2xl text-xs max-h-72 overflow-y-auto custom-scroll leading-relaxed">
                    <div>
                      <span className="text-[9px] font-black uppercase text-zinc-500">AI Description</span>
                      <p className="text-zinc-300 mt-0.5 text-[11px] leading-relaxed">{projResult.description}</p>
                    </div>
                    {projResult.resumeBullets?.length > 0 && (
                      <div>
                        <span className="text-[9px] font-black uppercase text-zinc-500 block mb-1">Resume STAR Bullet Points</span>
                        <ul className="list-disc pl-4 space-y-1 text-zinc-300 text-[10px]">
                          {projResult.resumeBullets.map((b: string, i: number) => <li key={i}>{b}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Print styles */}
      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body { 
            visibility: hidden; 
            background: white !important; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #resume-a4 {
            visibility: visible !important; position: absolute !important;
            left: 0 !important; top: 0 !important;
            width: 210mm !important; height: 297mm !important;
            transform: none !important; box-shadow: none !important;
            margin: 0 !important; padding: 0 !important; border: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #resume-a4 * { 
            visibility: visible !important; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          nav, footer, .sticky, button, .no-print, input, textarea, select { display: none !important; }
        }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
      `}</style>
    </div>
  );
};

// ─── public export (with context provider) ────────────────────────
const ResumeBuilder = () => (
  <ResumeProvider>
    <ResumeBuilderContent />
  </ResumeProvider>
);

export default ResumeBuilder;
