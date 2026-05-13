import { ResumeProvider, useResume } from '../../context/ResumeContext';
import ResumeForm from '../../components/ResumeBuilder/ResumeForm';
import ResumePreview from '../../components/ResumeBuilder/ResumePreview';
import { Download, Layout, Palette, Eye, Edit3, Sparkles, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ResumeBuilderContent = () => {
  const { resumeData, setResumeData } = useResume();
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [zoom, setZoom] = useState(0.8);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tools/export-resume-pdf`, { 
        resumeData 
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resumeData.personalInfo.fullName || 'resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (err: any) {
      console.error("Server-side PDF Export Error:", err);
      // Fallback to client-side if server fails
      const element = document.getElementById('resume-a4');
      if (element) {
        const opt = {
          margin: 0,
          filename: `${resumeData.personalInfo.fullName || 'resume'}.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };
        const html2pdf = (await import('html2pdf.js')).default;
        await html2pdf().set(opt).from(element).save();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const templates: Array<'Modern' | 'Classic' | 'Creative'> = ['Modern', 'Classic', 'Creative'];
  const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#0f172a'];

  // Simple ATS Score calculation based on completion
  const calculateATSScore = () => {
    let score = 20; // Base score for starting
    if (resumeData.personalInfo.fullName) score += 10;
    if (resumeData.personalInfo.title) score += 5;
    if (resumeData.summary.length > 50) score += 10;
    if (resumeData.experience.length > 0) score += 15;
    if (resumeData.education.length > 0) score += 10;
    if (resumeData.projects.length > 0) score += 10;
    if (resumeData.skills.length >= 5) score += 10;
    if (resumeData.certifications.length > 0) score += 5;
    if (resumeData.personalInfo.linkedin) score += 5;
    return Math.min(score, 100);
  };

  const atsScore = calculateATSScore();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-16">
      {/* Premium Hero Section */}
      <section className="relative text-center space-y-8 py-16 md:py-24 overflow-hidden rounded-[3rem] border border-white/5 bg-[#0A0A0A]/50 backdrop-blur-xl no-print">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="space-y-6 px-4 relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-white/80 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            <Sparkles className="w-4 h-4 text-primary" /> AI-Powered Career Growth
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter leading-none"
          >
            Build a Resume That <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary italic">Gets You Noticed.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
          >
            Create modern ATS-friendly resumes designed for internships, placements, and professional opportunities.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" /> ATS Optimized
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" /> Placement Ready
            </div>
          </div>
        </div>
      </section>

      {/* Editor Controls Toolbar */}
      <div className="sticky top-20 z-40 no-print">
        <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {/* Template Selector */}
            <div className="flex items-center gap-3">
              <Layout className="w-4 h-4 text-muted-foreground" />
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                {templates.map(t => (
                  <button
                    key={t}
                    onClick={() => setResumeData(prev => ({ ...prev, template: t }))}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      resumeData.template === t ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-8 w-px bg-white/5" />

            {/* Color Palette */}
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setResumeData(prev => ({ ...prev, themeColor: c }))}
                    className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                      resumeData.themeColor === c ? 'border-white scale-110 shadow-lg shadow-white/20' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="hidden lg:flex items-center gap-3 mr-4 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Zoom</span>
              <input 
                type="range" min="0.5" max="1" step="0.05" 
                value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="flex items-center gap-2 flex-1 md:flex-none">
              <button 
                onClick={handleDownload}
                disabled={isGenerating}
                className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isGenerating ? 'Exporting...' : 'Get PDF'}
              </button>

              <button 
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData));
                  const downloadAnchorNode = document.createElement('a');
                  downloadAnchorNode.setAttribute("href", dataStr);
                  downloadAnchorNode.setAttribute("download", "resume.json");
                  document.body.appendChild(downloadAnchorNode);
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();
                }}
                className="p-3 bg-white/5 text-muted-foreground rounded-2xl hover:text-white border border-white/5 transition-all"
                title="Backup JSON"
              >
                <Layout className="w-4 h-4 rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
        {/* Mobile View Toggle */}
        <div className="lg:hidden flex bg-[#111111] border border-white/5 rounded-[2rem] p-1.5 no-print sticky top-48 z-40 shadow-2xl">
          <button 
            onClick={() => setView('edit')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${view === 'edit' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground'}`}
          >
            <Edit3 className="w-4 h-4" /> Edit
          </button>
          <button 
            onClick={() => setView('preview')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${view === 'preview' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground'}`}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>

        {/* Form Panel */}
        <div className={`lg:col-span-5 space-y-8 ${view === 'edit' ? 'block' : 'hidden lg:block'} no-print`}>
          <div className="bg-[#111111] border border-white/5 p-6 rounded-[2.5rem] space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight">Editor</h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Real-time Synchronization</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">ATS Score</p>
                <div className="flex items-center gap-2">
                  <div className={`text-lg font-black ${atsScore > 80 ? 'text-emerald-500' : atsScore > 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {atsScore}%
                  </div>
                  <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${atsScore}%` }}
                      className={`h-full ${atsScore > 80 ? 'bg-emerald-500' : atsScore > 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <ResumeForm />
          </div>

          <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Sparkles className="w-5 h-5" />
              <h4 className="text-xs font-black uppercase tracking-widest">Career Tip</h4>
            </div>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
              "Action verbs like 'Spearheaded', 'Optimized', and 'Delivered' increase your resume's impact on hiring managers and ATS systems."
            </p>
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`lg:col-span-7 ${view === 'preview' ? 'block' : 'hidden lg:block'} lg:sticky lg:top-40`}>
          <div className="bg-[#111111] border border-white/5 rounded-[3rem] p-4 md:p-8 overflow-hidden shadow-2xl min-h-[800px] flex flex-col">
            <div className="flex items-center justify-between mb-8 px-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                {resumeData.template} Template
              </span>
            </div>

            <div className="flex-1 flex justify-center overflow-auto custom-scrollbar pb-10" style={{ scrollBehavior: 'smooth' }}>
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }} className="transition-transform duration-300">
                <ResumePreview />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body {
            visibility: hidden;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #resume-a4 {
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: auto !important;
            transform: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
          }
          #resume-a4 * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          nav, footer, .sticky, button, .no-print, .toolbar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

const ResumeBuilder = () => (
  <ResumeProvider>
    <ResumeBuilderContent />
  </ResumeProvider>
);

export default ResumeBuilder;
