import { useState, useEffect } from 'react';
import { toast } from '../lib/toast';
import {
  LayoutDashboard, Loader2, LogOut, Activity,
  Award, Calendar, FileText,
  BookOpen, Clock, CheckSquare, Zap, Plus, Trash2, Copy,
  CreditCard, Search, ArrowUpRight, Sparkles,
  Percent, Calculator, Minimize2, Image, Scissors,
  RotateCw, X, Download, FileSpreadsheet
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { Link, Navigate } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

// ─── types ────────────────────────────────────────────────
interface Task  { id: string; text: string; done: boolean; }
interface Exam  { name: string; date: string; difficulty: string; }

const Dashboard = () => {
  const { user, logout, isLoading } = useAuth();

  /* remote data */
  const [credits,       setCredits]       = useState<number>(0);
  const [plan,          setPlan]          = useState<string>('Free');
  const [creditHistory, setCreditHistory] = useState<any[]>([]);
  const [roadmaps,      setRoadmaps]      = useState<any[]>([]);
  const [resumes,       setResumes]       = useState<any[]>([]);
  const [documents,     setDocuments]     = useState<any[]>([]);

  /* local UI states */
  const [activeTab,   setActiveTab]   = useState<'overview' | 'documents' | 'billing'>('overview');
  const [toolSearch,  setToolSearch]  = useState('');
  const [selectedCat, setSelectedCat] = useState<'all' | 'academic' | 'pdf' | 'image'>('all');
  
  /* preview document modal */
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Revise PyTorch attention logic',    done: false },
    { id: '2', text: 'Compile merge-sort code tests',     done: true  },
    { id: '3', text: 'Audit resume keyword checks',       done: false },
  ]);

  const exams: Exam[] = [
    { name: 'GATE Computer Science',    date: 'Feb 2027', difficulty: 'Hard'   },
    { name: 'AWS Cloud Practitioner',   date: 'Aug 2026', difficulty: 'Medium' },
  ];

  /* weekly chart mock data */
  const studyHoursData = [
    { day: 'Mon', hours: 4.5 },
    { day: 'Tue', hours: 6.0 },
    { day: 'Wed', hours: 5.5 },
    { day: 'Thu', hours: 8.0 },
    { day: 'Fri', hours: 3.5 },
    { day: 'Sat', hours: 7.0 },
    { day: 'Sun', hours: 9.0 },
  ];

  /* Platform Tools catalog */
  const TOOLS_CATALOG = [
    // Academic & AI
    { name: 'AI Study Assistant', path: '/tools/ai-study-assistant', cat: 'academic', desc: 'Interact with AI to explain code, check equations, and compile doubts.', icon: Sparkles, color: '#f59e0b' },
    { name: 'AI Resume & Career Suite', path: '/tools/resume-builder', cat: 'academic', desc: 'Resume editor with ATS audit score check, mock interviews, and career paths.', icon: FileText, color: '#F4C430' },
    { name: 'AI Interview Practice Lobby', path: '/tools/ai-interview-prep', cat: 'academic', desc: 'Practice sequential behavioral/tech mock questions graded by AI.', icon: Clock, color: '#3b82f6' },
    { name: 'AI PDF Study Workspace', path: '/tools/ai-pdf-workspace', cat: 'academic', desc: 'Upload study files and notes to query concepts directly via AI chat.', icon: BookOpen, color: '#10b981' },
    { name: 'Interactive Study Planner', path: '/tools/study-planner', cat: 'academic', desc: 'Plan weekly targets and organize examination revision timelines.', icon: Calendar, color: '#8b5cf6' },
    { name: 'Interactive Career Roadmaps', path: '/tools/career-roadmaps', cat: 'academic', desc: 'Consult AI to build customized week-by-week visual skill paths.', icon: Zap, color: '#ef4444' },
    { name: 'JEE Rank & Cutoff Predictor', path: '/tools/rank-predictor', cat: 'academic', desc: 'Evaluate cutoff ranks and college matches based on percentile scores.', icon: Calculator, color: '#06b6d4' },
    { name: 'Marks vs Percentile Evaluator', path: '/tools/marks-percentile', cat: 'academic', desc: 'Check standard marks-to-percentile calculations across test formats.', icon: Percent, color: '#ec4899' },
    { name: 'Academic CGPA Calculator', path: '/tools/cgpa-calculator', cat: 'academic', desc: 'Calculate semester SGPA and aggregate CGPA records on standard rules.', icon: Calculator, color: '#10b981' },
    { name: 'CGPA Percentage Converter', path: '/tools/cgpa-converter', cat: 'academic', desc: 'Convert CGPA scale values to percentage targets easily.', icon: Percent, color: '#8b5cf6' },
    { name: 'Attendance Requirements Tracker', path: '/tools/attendance-calculator', cat: 'academic', desc: 'Verify required classes to maintain targets.', icon: Activity, color: '#f59e0b' },

    // PDF Utilities
    { name: 'Merge PDF Documents', path: '/tools/pdf/merge', cat: 'pdf', desc: 'Combine multiple PDF papers or study logs into a single target file.', icon: BookOpen, color: '#3b82f6' },
    { name: 'Split PDF Papers', path: '/tools/pdf/split', cat: 'pdf', desc: 'Extract specific pages or chapters from textbook PDFs.', icon: Scissors, color: '#ef4444' },
    { name: 'Compress PDF File Size', path: '/tools/pdf/compress', cat: 'pdf', desc: 'Optimize layout size of lecture slides for faster sharing.', icon: Minimize2, color: '#10b981' },
    { name: 'Rotate PDF Layout', path: '/tools/pdf/rotate', cat: 'pdf', desc: 'Reorient landscape tables or diagrams within PDF files.', icon: RotateCw, color: '#8b5cf6' },
    { name: 'Convert JPG to PDF', path: '/tools/pdf/image-to-pdf', cat: 'pdf', desc: 'Convert textbook photo scans into a neat PDF compilation.', icon: Image, color: '#f59e0b' },
    { name: 'PDF Signature & Watermark', path: '/tools/pdf/watermark', cat: 'pdf', desc: 'Secure project documents or research papers with watermarks.', icon: Award, color: '#ec4899' },

    // Image Toolkits
    { name: 'Compress Image Size', path: '/tools/image/compress', cat: 'image', desc: 'Shrink project screenshots or profile photos.', icon: Minimize2, color: '#10b981' },
    { name: 'Resize Image Dimensions', path: '/tools/image/resize', cat: 'image', desc: 'Modify width and height layout parameters.', icon: RotateCw, color: '#8b5cf6' },
    { name: 'Convert Image Format', path: '/tools/image/convert', cat: 'image', desc: 'Reformat image extensions (PNG, JPG, WebP) instantly.', icon: Image, color: '#3b82f6' }
  ];

  /* fetch on mount */
  useEffect(() => {
    if (!isLoading && user) fetchDashboardData();
  }, [user, isLoading]);

  const fetchDashboardData = async () => {
    try {
      const token      = localStorage.getItem('token');
      const hdrs       = { headers: { Authorization: `Bearer ${token}` } };
      const safe       = () => ({ data: [] });

      const [meRes, roadmapRes, resumeRes, docRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, hdrs),
        axios.get(`${import.meta.env.VITE_API_URL}/api/roadmaps`,  hdrs).catch(safe),
        axios.get(`${import.meta.env.VITE_API_URL}/api/resumes`,   hdrs).catch(safe),
        axios.get(`${import.meta.env.VITE_API_URL}/api/ai-pdf`,    hdrs).catch(safe),
      ]);

      setCredits(meRes.data.credits ?? 0);
      setPlan(meRes.data.plan ?? 'Free');
      setCreditHistory(meRes.data.creditHistory ?? []);
      setRoadmaps(Array.isArray(roadmapRes.data) ? roadmapRes.data : []);
      setResumes(Array.isArray(resumeRes.data)   ? resumeRes.data  : []);
      setDocuments(Array.isArray(docRes.data)    ? docRes.data     : []);
    } catch (err) {
      console.warn('Dashboard fetch failed:', err);
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    toast.success('Task updated');
  };

  const handleEditResume = (r: any) => {
    localStorage.setItem('active-resume-id', r._id);
    localStorage.setItem('resume-draft', JSON.stringify({
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
    }));
  };

  const handleDuplicateResume = async (r: any) => {
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
      toast.success('Resume duplicated successfully');
      fetchDashboardData();
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
      toast.success('Resume deleted successfully');
      fetchDashboardData();
    } catch {
      toast.error('Deletion failed');
    }
  };

  /* ── Export Handlers ────────────────────────────────────────── */
  const handleDownloadDoc = (doc: any) => {
    const title = doc.fileName.replace(/_/g, ' ').replace('.txt', '');
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
        <p style="color: #666; font-size: 9pt;">Generated by ScholarOS Career Platform on ${new Date(doc.createdAt).toLocaleDateString()}</p>
        <div style="margin-top: 20px; white-space: pre-wrap;">
          ${doc.textContent.replace(/\n/g, '<br/>')}
        </div>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.fileName.replace('.txt', '')}.doc`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('Word document outline exported successfully');
  };

  const handleDownloadPPT = (doc: any) => {
    const title = doc.fileName.replace(/_/g, ' ').replace('.txt', '');
    const sections = doc.textContent.split('=========================================');
    const header = `
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
          <p>ScholarOS AI Career Coaching Report<br/>Generated: ${new Date(doc.createdAt).toLocaleDateString()}</p>
        </div>
    `;

    let slidesContent = '';
    sections.slice(1).forEach((sec: string) => {
      const lines = sec.trim().split('\n');
      const slideTitle = lines[0].replace(/^[0-9.\s]+/, '').trim();
      const listItems = lines.slice(1)
        .filter(l => l.trim().startsWith('-') || l.trim().startsWith('*') || l.trim().match(/^\d+\./))
        .map(l => `<li>${l.replace(/^[-*\d.\s]+/, '').trim()}</li>`).join('');
      
      const textFallback = lines.slice(1).filter(l => l.trim().length > 0).map(l => `<p>${l.trim()}</p>`).join('');

      slidesContent += `
        <div class="slide">
          <h1>${slideTitle}</h1>
          ${listItems ? `<ul>${listItems}</ul>` : textFallback}
        </div>
      `;
    });

    const slidesHtml = header + slidesContent + "</body></html>";
    const blob = new Blob(['\ufeff' + slidesHtml], { type: 'application/vnd.ms-powerpoint' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.fileName.replace('.txt', '')}.ppt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('PowerPoint slideshow exported successfully');
  };

  const handleDownloadPDF = async (doc: any) => {
    const el = document.getElementById('preview-doc-modal-content');
    if (el) {
      setIsExporting(true);
      try {
        const opt = {
          margin: 15,
          filename: `${doc.fileName.replace('.txt', '')}.pdf`,
          image: { type: 'jpeg' as const, quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };
        const html2pdf = (await import('html2pdf.js')).default;
        await html2pdf().set(opt).from(el).save();
        toast.success('PDF report exported successfully');
      } catch {
        toast.error('Failed to compile PDF layout');
      } finally {
        setIsExporting(false);
      }
    } else {
      toast.error('Could not compile preview content');
    }
  };

  /* ── guards ───────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="h-[65vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold text-zinc-400 tracking-tight">Loading dashboard…</p>
      </div>
    );
  }

  if (user?.role === 'admin') return <Navigate to="/admin" />;

  if (!user) {
    return (
      <div className="h-[65vh] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="p-6 bg-primary/10 rounded-full border border-primary/20">
          <LayoutDashboard className="w-12 h-12 text-primary animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black italic">Authentication Required</h2>
          <p className="text-zinc-500 max-w-sm mx-auto">
            Log in to view your learning activity metrics and launch workspaces.
          </p>
        </div>
        <Link
          to="/login"
          className="px-10 py-4 bg-primary hover:bg-primary-hover text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/10"
        >
          Login Now
        </Link>
      </div>
    );
  }

  /* ── derived values ───────────────────────────────── */
  const finishedTasks     = tasks.filter(t => t.done).length;
  const productivityScore = Math.round((finishedTasks / Math.max(tasks.length, 1)) * 100);
  const CIRC              = 2 * Math.PI * 60; // r = 60

  /* filtering tools list */
  const filteredTools = TOOLS_CATALOG.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(toolSearch.toLowerCase()) || t.desc.toLowerCase().includes(toolSearch.toLowerCase());
    const matchCat    = selectedCat === 'all' ? true : t.cat === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8 font-sans">

      {/* ── SaaS Greeting & Credit Balance Header ─────────────────────────────────────── */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> {plan} Membership
          </span>
          <h1 className="text-3xl font-black">
            Welcome back,{' '}
            <span className="text-primary italic">{user.name}</span>
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            Manage your credentials, study notes, and launch academic utility workspaces.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="bg-[#111] border border-white/5 rounded-2xl p-3 flex items-center gap-4 flex-1 lg:flex-none">
            <div>
              <span className="text-[8px] font-black uppercase text-zinc-500 tracking-wider block">Token Credits Balance</span>
              <span className="text-lg font-black text-white">{credits} <span className="text-xs text-primary">Credits</span></span>
            </div>
            <Link to="/pricing" className="p-2.5 bg-primary hover:bg-primary-hover text-zinc-950 rounded-xl transition-all" title="Buy Credits">
              <Plus className="w-4 h-4" />
            </Link>
          </div>
          <button
            onClick={logout}
            className="p-4 bg-[#111] border border-white/5 hover:border-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-2xl transition-all h-[52px]"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── Platform Overview Stat Cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        
        <div className="bg-[#111] border border-white/5 p-5 rounded-2xl space-y-1">
          <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider block">Membership tier</span>
          <span className="text-xl font-black text-white uppercase">{plan}</span>
        </div>

        <div className="bg-[#111] border border-white/5 p-5 rounded-2xl space-y-1">
          <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider block">Saved Resumes</span>
          <span className="text-xl font-black text-white">{resumes.length} Drafts</span>
        </div>

        <div className="bg-[#111] border border-white/5 p-5 rounded-2xl space-y-1">
          <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider block">Study Documents</span>
          <span className="text-xl font-black text-white">{documents.length} Uploads</span>
        </div>

        <div className="bg-[#111] border border-white/5 p-5 rounded-2xl space-y-1">
          <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider block">Active Roadmaps</span>
          <span className="text-xl font-black text-white">{roadmaps.length} Pathways</span>
        </div>

      </div>

      {/* ── Inner Workspace Navigation Tabs ──────────────────────────────────── */}
      <div className="flex border-b border-white/5 no-print gap-6">
        <button onClick={() => setActiveTab('overview')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'overview' ? 'border-primary text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          Overview & Tracker
        </button>
        <button onClick={() => setActiveTab('documents')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'documents' ? 'border-primary text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          My Saved Resumes & Docs ({resumes.length + documents.length})
        </button>
        <button onClick={() => setActiveTab('billing')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'billing' ? 'border-primary text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          SaaS Billing & Token Logs
        </button>
      </div>

      {/* ── Tab Views ──────────────────────────────────────────────────────── */}
      <div className="space-y-8">
        
        {/* TAB 1: OVERVIEW & TRACKER */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Weekly Study Chart */}
            <div className="md:col-span-8 bg-[#111] border border-white/5 p-6 rounded-[2.5rem] space-y-6 shadow-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Daily Study Tracker</h3>
                  <p className="text-[10px] text-zinc-500">Weekly activity logs</p>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Streak Active
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={studyHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#F4C430" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#F4C430" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                    <XAxis dataKey="day"  stroke="#555" fontSize={10} />
                    <YAxis              stroke="#555" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                    <Area
                      type="monotone" dataKey="hours"
                      stroke="#F4C430" strokeWidth={2}
                      fillOpacity={1}  fill="url(#colorHours)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Productivity Ring */}
            <div className="md:col-span-4 bg-[#111] border border-white/5 p-6 rounded-[2.5rem] space-y-6 shadow-xl text-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-300">Productivity Index</h3>
                <p className="text-[10px] text-zinc-500">Task completion %</p>
              </div>

              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="72" cy="72" r="60" stroke="#222"    strokeWidth="10" fill="transparent" />
                  <circle
                    cx="72" cy="72" r="60"
                    stroke="#F4C430" strokeWidth="10" fill="transparent"
                    strokeDasharray={CIRC}
                    strokeDashoffset={CIRC - (CIRC * productivityScore) / 100}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute text-center space-y-0.5">
                  <span className="text-3xl font-black text-white">{productivityScore}%</span>
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">Rating</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 font-medium">
                Update your study milestones to improve your index.
              </p>
            </div>

            {/* Tasks Checklist */}
            <div className="md:col-span-6 bg-[#111] border border-white/5 p-6 rounded-[2.5rem] space-y-6 shadow-xl">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Milestones Checklist</h3>
                <p className="text-[10px] text-zinc-500">Click a task to toggle it</p>
              </div>

              <div className="space-y-3">
                {tasks.map(t => (
                  <div
                    key={t.id}
                    onClick={() => handleToggleTask(t.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all select-none ${
                      t.done
                        ? 'bg-white/5 border-white/5 text-zinc-500 line-through'
                        : 'bg-black/20 border-white/5 text-zinc-300 hover:border-primary/30'
                    }`}
                  >
                    <CheckSquare className={`w-4 h-4 shrink-0 ${t.done ? 'text-primary' : 'text-zinc-600'}`} />
                    <span className="text-xs font-semibold">{t.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="md:col-span-6 bg-[#111] border border-white/5 p-6 rounded-[2.5rem] space-y-6 shadow-xl">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Upcoming Examinations</h3>
                <p className="text-[10px] text-zinc-500">Target test schedule</p>
              </div>

              <div className="space-y-4">
                {exams.map((ex, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-white">{ex.name}</h4>
                      <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3 h-3 text-zinc-500" /> {ex.date}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                      ex.difficulty === 'Hard'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {ex.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MY SAVED RESUMES & DOCS */}
        {activeTab === 'documents' && (
          <div className="space-y-8">
            
            {/* Resumes drafts */}
            <div className="bg-[#111] border border-white/5 p-6 rounded-[2.5rem] space-y-6 shadow-xl">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">My Saved Resumes</h3>
                  <p className="text-[10px] text-zinc-500">Edit, duplicate, download, or delete drafts</p>
                </div>
                <Link to="/tools/resume-builder" onClick={() => localStorage.removeItem('active-resume-id')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Create New Resume
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((r) => {
                  let s = 20;
                  if (r.personalInfo?.fullName)   s += 10;
                  if (r.personalInfo?.title)      s += 5;
                  if (r.summary?.length > 50)     s += 10;
                  if (r.experience?.length > 0)   s += 15;
                  if (r.education?.length > 0)    s += 10;
                  if (r.projects?.length > 0)     s += 10;
                  if (r.skills?.length >= 5)      s += 10;
                  if (r.certifications?.length > 0) s += 5;
                  if (r.personalInfo?.linkedin)   s += 5;
                  if (r.languages?.length > 0)    s += 5;
                  if (r.interests?.length > 0)    s += 5;
                  const atsScore = Math.min(s, 100);

                  return (
                    <div key={r._id} className="bg-white/5 border border-white/5 p-5 rounded-3xl space-y-4 hover:border-primary/20 transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-black text-white">{r.title || 'Untitled Resume'}</h4>
                            <p className="text-[9px] text-zinc-500 uppercase mt-0.5">Template: {r.template || 'Modern'}</p>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${atsScore >= 75 ? 'bg-emerald-500/10 text-emerald-400' : atsScore >= 50 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {atsScore}% ATS
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium">Last saved: {new Date(r.updatedAt || Date.now()).toLocaleDateString()}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <Link to="/tools/resume-builder" onClick={() => handleEditResume(r)}
                          className="flex-1 text-center py-2 bg-primary hover:bg-primary-hover text-zinc-950 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                          Edit
                        </Link>
                        <button onClick={() => handleDuplicateResume(r)}
                          className="p-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl transition-all"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteResume(r._id)}
                          className="p-2 bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {resumes.length === 0 && (
                  <p className="col-span-full py-12 text-center text-xs text-zinc-500 italic">No saved resumes found. Use the Resume Builder to start drafting!</p>
                )}
              </div>
            </div>

            {/* Documents list */}
            <div className="bg-[#111] border border-white/5 p-6 rounded-[2.5rem] space-y-6 shadow-xl">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">AI PDF Workspace Documents</h3>
                <p className="text-[10px] text-zinc-500">Jump directly into recently uploaded lecture notes or textbooks</p>
              </div>

              <div className="overflow-x-auto text-xs">
                {documents.length === 0 ? (
                  <p className="text-zinc-500 text-center py-10 italic">No uploaded study papers in your account yet.</p>
                ) : (
                  <table className="min-w-full text-zinc-400">
                    <thead>
                      <tr className="border-b border-white/5 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 text-left">Document Name</th>
                        <th className="py-2.5 text-left">Type</th>
                        <th className="py-2.5 text-left">Size</th>
                        <th className="py-2.5 text-left font-medium">Progress</th>
                        <th className="py-2.5 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc, idx) => (
                        <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01]">
                          <td className="py-3 font-semibold text-white cursor-pointer hover:underline" onClick={() => setSelectedDoc(doc)}>{doc.fileName}</td>
                          <td className="py-3 uppercase text-[10px]">{doc.fileType}</td>
                          <td className="py-3">{Math.round(doc.fileSize / 1024) || 12} KB</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${doc.readingProgress || 0}%` }} />
                              </div>
                              <span className="text-[10px]">{doc.readingProgress || 0}% read</span>
                            </div>
                          </td>
                          <td className="py-3 text-right flex justify-end gap-2">
                            <button onClick={() => setSelectedDoc(doc)}
                              className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all"
                            >
                              Preview
                            </button>
                            <Link to="/tools/ai-pdf-workspace"
                              className="px-3 py-1 bg-white/5 hover:bg-primary hover:text-zinc-950 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all"
                            >
                              Open Note
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: SAAS BILLING & LOGS */}
        {activeTab === 'billing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Membership Details Card */}
            <div className="lg:col-span-4 bg-[#111] border border-white/5 p-6 rounded-[2.5rem] space-y-6 shadow-xl">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Membership Details</h3>
                <p className="text-[10px] text-zinc-500">Plan benefits and token balance status</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs space-y-2">
                  <span className="text-[8px] font-black text-primary uppercase tracking-widest">Active Plan Tier</span>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black text-white">{plan} Plan</span>
                    <Link to="/pricing" className="text-[9px] font-black text-primary uppercase flex items-center gap-0.5 hover:underline">
                      Change Plan <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-[9px] font-black uppercase text-zinc-500 block mb-1">Plan Quotas and Inclusions</span>
                  <div className="flex items-center justify-between text-zinc-400 py-1.5 border-b border-white/5">
                    <span>AI Model Level</span>
                    <span className="text-white font-bold">{plan === 'Free' ? 'Gemini 2.5 Flash' : 'Gemini 2.5 Pro'}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400 py-1.5 border-b border-white/5">
                    <span>Remaining Tokens</span>
                    <span className="text-white font-bold">{credits} Credits</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400 py-1.5">
                    <span>Mock Interviews/Day</span>
                    <span className="text-white font-bold">{plan === 'Free' ? '2 Mocks' : 'Unlimited Mocks'}</span>
                  </div>
                </div>

                <Link to="/pricing" className="w-full flex items-center justify-center gap-1.5 py-3 bg-primary hover:bg-primary-hover text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md">
                  <CreditCard className="w-4 h-4" /> Upgrade to Pro Tier
                </Link>
              </div>
            </div>

            {/* Token Transactions Log */}
            <div className="lg:col-span-8 bg-[#111] border border-white/5 p-6 rounded-[2.5rem] space-y-6 shadow-xl">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Tokens credit History</h3>
                <p className="text-[10px] text-zinc-500">Log of credits spent or added in academic workspaces</p>
              </div>

              <div className="overflow-x-auto text-xs max-h-96 overflow-y-auto custom-scroll pr-2">
                {creditHistory.length === 0 ? (
                  <p className="text-zinc-500 text-center py-10 italic">No credit transaction records found.</p>
                ) : (
                  <table className="min-w-full text-zinc-400">
                    <thead>
                      <tr className="border-b border-white/5 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 text-left">Action / Description</th>
                        <th className="py-2.5 text-left">Type</th>
                        <th className="py-2.5 text-left font-medium">Credits</th>
                        <th className="py-2.5 text-right font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {creditHistory.slice().reverse().map((log, idx) => (
                        <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01]">
                          <td className="py-3 font-semibold text-white">{log.description || 'API Query Usage'}</td>
                          <td className="py-3 uppercase text-[9px] font-bold">
                            <span className={`px-2 py-0.5 rounded ${log.type === 'added' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                              {log.type}
                            </span>
                          </td>
                          <td className="py-3 font-mono">{log.type === 'added' ? '+' : '-'}{log.amount}</td>
                          <td className="py-3 text-right text-[10px]">{new Date(log.date || Date.now()).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── Tools Launcher Hub Section ─────────────────────────────────── */}
      <section className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem] space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/5 pb-5">
          <div>
            <h3 className="text-base font-black uppercase tracking-wider text-white">Launch Platform workspaces</h3>
            <p className="text-[10px] text-zinc-500">Quick access to all 15+ academic toolkits and file helpers</p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Category selection */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 text-[9px] font-black uppercase">
              {(['all', 'academic', 'pdf', 'image'] as const).map(cat => (
                <button key={cat} onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${selectedCat === cat ? 'bg-primary text-zinc-950' : 'text-zinc-500 hover:text-white'}`}
                >
                  {cat === 'academic' ? 'AI & Academic' : cat === 'all' ? 'All' : cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 lg:flex-none lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input type="text" placeholder="Search tools..." value={toolSearch} onChange={e => setToolSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white/5 border border-white/5 rounded-xl text-zinc-300 focus:outline-none focus:border-primary/50" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((t, idx) => {
            const IconComponent = t.icon;
            return (
              <Link key={idx} to={t.path}
                className="group bg-white/5 border border-white/5 p-6 rounded-3xl hover:border-primary/30 hover:bg-white/[0.08] transition-all flex flex-col justify-between min-h-[140px]"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="p-2.5 rounded-2xl bg-white/5 text-zinc-400 group-hover:text-primary transition-colors" style={{ color: t.color }}>
                      <IconComponent className="w-5 h-5" />
                    </span>
                    <span className="text-[8px] font-black uppercase text-zinc-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                      {t.cat === 'academic' ? 'AI Suite' : t.cat.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-white group-hover:text-primary transition-colors pt-2">{t.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">{t.desc}</p>
                </div>
                <div className="flex justify-end pt-3">
                  <span className="text-[9px] font-black uppercase text-primary tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    Launch <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
          {filteredTools.length === 0 && (
            <p className="col-span-full py-10 text-center text-xs text-zinc-600 font-medium italic">No matching utilities found in the directory.</p>
          )}
        </div>
      </section>

      {/* ── Preview Document Modal Overlay ─────────────────────────────── */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 no-print animate-fade-in">
          <div className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Modal Topbar */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-white/5 bg-white/[0.02]">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">SaaS Document Viewer</span>
                <h3 className="text-sm font-black text-white truncate max-w-[450px]">{selectedDoc.fileName.replace(/_/g, ' ')}</h3>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Download formats */}
                {selectedDoc.fileType === 'txt' && (
                  <>
                    <button onClick={() => handleDownloadPDF(selectedDoc)} disabled={isExporting}
                      className="flex items-center gap-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                      {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                      PDF
                    </button>
                    <button onClick={() => handleDownloadDoc(selectedDoc)}
                      className="flex items-center gap-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      <FileText className="w-3 h-3" />
                      Word (Doc)
                    </button>
                    <button onClick={() => handleDownloadPPT(selectedDoc)}
                      className="flex items-center gap-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      <FileSpreadsheet className="w-3 h-3" />
                      Slides (PPT)
                    </button>
                  </>
                )}
                
                <button onClick={() => setSelectedDoc(null)} className="p-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Content Canvas */}
            <div className="flex-1 overflow-y-auto p-8 bg-[#0b0f19] custom-scroll">
              <div id="preview-doc-modal-content" className="bg-white text-zinc-950 p-10 md:p-14 rounded-2xl shadow-lg max-w-[210mm] mx-auto min-h-[297mm] font-sans leading-relaxed border border-zinc-200">
                <div className="border-b-2 border-primary pb-3 mb-6 flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">{selectedDoc.fileName.replace(/_/g, ' ').replace('.txt', '')}</h2>
                    <p className="text-[9px] font-black text-zinc-400 tracking-widest uppercase mt-1">ScholarOS Academic Transcript System</p>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Date: {new Date(selectedDoc.createdAt).toLocaleDateString()}</span>
                </div>

                <pre className="whitespace-pre-wrap font-sans text-xs text-zinc-800 leading-relaxed font-semibold">
                  {selectedDoc.textContent || 'No text contents logged inside this note.'}
                </pre>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
      `}</style>

    </div>
  );
};

export default Dashboard;
