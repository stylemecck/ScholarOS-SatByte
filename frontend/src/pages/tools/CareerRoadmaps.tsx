import React, { useState, useEffect } from 'react';
import { 
  GitFork, BookOpen, Check, ChevronRight, X, 
  Sparkles, Loader2, ArrowLeft 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from '../../lib/toast';
import SEO from '../../components/SEO';

const careers = [
  { id: 'se', name: 'Software Engineer', desc: 'Core OOP, algorithms, databases and architecture' },
  { id: 'fsd', name: 'Full Stack Developer', desc: 'MERN/Next.js frontend and backend systems' },
  { id: 'ai', name: 'AI Engineer', desc: 'Machine Learning, Neural Networks, PyTorch and LLMs' },
  { id: 'da', name: 'Data Analyst', desc: 'Excel, SQL, Tableau, Pandas and statistics' },
  { id: 'ds', name: 'Data Scientist', desc: 'Predictive modeling, math and scientific analysis' },
  { id: 'uiux', name: 'UI/UX Designer', desc: 'Wireframing, Figma, user research and branding' },
  { id: 'cyber', name: 'Cybersecurity', desc: 'Network security, ethical hacking and encryption' },
  { id: 'cloud', name: 'Cloud Engineer', desc: 'AWS, Azure, Docker containerization and IAM' },
  { id: 'devops', name: 'DevOps', desc: 'CI/CD, Kubernetes, Terraform and Linux ops' },
  { id: 'mobile', name: 'Mobile Developer', desc: 'React Native, Flutter, Swift or Android Kotlin' },
  { id: 'pm', name: 'Product Manager', desc: 'User stories, agile sprints, analytics and strategy' },
  { id: 'mktg', name: 'Digital Marketing', desc: 'SEO, Google Ads, funnel optimization and copywriting' },
  { id: 'creator', name: 'Content Creator', desc: 'Video production, community growth and sponsorships' }
];

// Mock structured nodes representing the default skill tree per roadmap
const defaultSkillNodes: Record<string, any[]> = {
  ai: [
    { id: 'python', label: '1. Python Foundations', desc: 'Data structures, OOP, Numpy & Pandas basics', time: 'Weeks 1-2', resources: ['Python.org docs', 'Kaggle Python Intro'], questions: 'Write a matrix transpose without loops.' },
    { id: 'math', label: '2. Math for Machine Learning', desc: 'Linear Algebra, Calculus, Probabilities', time: 'Weeks 3-4', resources: ['3Blue1Brown Linear Algebra', 'Khan Academy Stats'], questions: 'Explain eigenvalue meaning.' },
    { id: 'sklearn', label: '3. Classical ML algorithms', desc: 'Regression, Decision Trees, KNN, SVMs', time: 'Weeks 5-8', resources: ['Scikit-learn guides', 'Andrew Ng ML Course'], questions: 'What is overfitting and how do you reduce it?' },
    { id: 'dl', label: '4. Deep Learning & Neural Nets', desc: 'Convolutions, Recurrent nets, PyTorch/Tensorflow', time: 'Weeks 9-12', resources: ['Fast.ai Practical Deep Learning', 'PyTorch tutorials'], questions: 'How does backpropagation work?' },
    { id: 'llm', label: '5. Transformers & Generative AI', desc: 'Self-attention, BERT, GPT models, RAG vector DBs', time: 'Weeks 13-16', resources: ['Hugging Face NLP Course', 'LangChain documentation'], questions: 'Explain Self-Attention math.' }
  ],
  fsd: [
    { id: 'frontend', label: '1. HTML, CSS & JavaScript', desc: 'DOM, Flexbox, Async/Await and ES6 methods', time: 'Weeks 1-3', resources: ['MDN JS guides', 'JavaScript.info'], questions: 'Explain closures and event loop.' },
    { id: 'react', label: '2. Frontend Frameworks (React)', desc: 'Hooks, state management, router and Tailwind', time: 'Weeks 4-7', resources: ['React.dev docs', 'Vite tutorials'], questions: 'What is the virtual DOM?' },
    { id: 'backend', label: '3. Backend REST APIs', desc: 'Node.js, Express, CRUD operations, Middleware', time: 'Weeks 8-11', resources: ['Expressjs.com guide', 'Node.js docs'], questions: 'What is CORS and how to secure cookies?' },
    { id: 'database', label: '4. Database & ORMs', desc: 'MongoDB (Mongoose), SQL (PostgreSQL, Prisma)', time: 'Weeks 12-14', resources: ['MongoDB University', 'Prisma Docs'], questions: 'Explain differences between SQL joins and NoSQL references.' },
    { id: 'deployment', label: '5. Deployments & Scaling', desc: 'Vercel, AWS EC2, Docker, CI/CD Actions', time: 'Weeks 15-16', resources: ['Docker Get Started', 'GitHub Actions docs'], questions: 'What is containerization?' }
  ]
};

// Fallback nodes for other roles
const generateGenericNodes = (title: string) => [
  { id: 'phase1', label: '1. Core Fundamentals', desc: `Basic theory, setup tools, and syntax concepts for ${title}.`, time: 'Weeks 1-3', resources: ['W3Schools', 'Documentation Guides'], questions: 'What are the core tools needed?' },
  { id: 'phase2', label: '2. Intermediate Operations', desc: 'Practical projects, libraries, APIs and local setups.', time: 'Weeks 4-8', resources: ['Medium Tutorials', 'YouTube walkthroughs'], questions: 'Build a sample mock application.' },
  { id: 'phase3', label: '3. Advanced Architecture', desc: 'Performances optimization, architectures, testing and deployments.', time: 'Weeks 9-12', resources: ['System Design guides', 'GitHub repositories'], questions: 'Scale the tool structure.' }
];

const CareerRoadmaps: React.FC = () => {
  // Navigation: 'grid' | 'view'
  const [viewState, setViewState] = useState<'grid' | 'view'>('grid');
  const [activeCareer, setActiveCareer] = useState<any | null>(null);

  // Roadmap tracking states
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // Advisor panel states
  const [currentSkills, setCurrentSkills] = useState('');
  const [goalTime, setGoalTime] = useState('6 months');
  const [adviceResult, setAdviceResult] = useState('');
  const [advisorLoading, setAdvisorLoading] = useState(false);

  // Selected node side drawers
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [nodeNote, setNodeNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (activeCareer) {
      fetchRoadmapProgress();
    }
  }, [activeCareer]);

  const fetchRoadmapProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/roadmaps`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Find matches
      const match = res.data.find((r: any) => r.title === activeCareer.name);
      if (match) {
        setCompletedNodes(match.completedNodes || []);
        setProgress(match.progress || 0);
      } else {
        setCompletedNodes([]);
        setProgress(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleNode = async (nodeId: string) => {
    const nodes = defaultSkillNodes[activeCareer.id] || generateGenericNodes(activeCareer.name);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/roadmaps/toggle-node`, {
        title: activeCareer.name,
        nodeId,
        totalNodesCount: nodes.length
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompletedNodes(res.data.completedNodes || []);
      setProgress(res.data.progress || 0);
      toast.success('Node milestone updated');
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNode) return;
    setSavingNote(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/roadmaps/note`, {
        title: activeCareer.name,
        nodeId: selectedNode.id,
        noteText: nodeNote
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Notes saved successfully');
      setSelectedNode(null);
    } catch (err) {
      toast.error('Failed to save notes');
    } finally {
      setSavingNote(false);
    }
  };

  const handleConsultAdvisor = async () => {
    setAdvisorLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/roadmaps/suggest`, {
        title: activeCareer.name,
        currentSkills,
        goalTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdviceResult(res.data.advice);
      toast.success('Advice generated by Career Advisor');
    } catch (err) {
      toast.error('Failed to get career advisor comments');
    } finally {
      setAdvisorLoading(false);
    }
  };

  const handleDownloadRoadmapDoc = () => {
    if (!adviceResult) return;
    const title = `${activeCareer.name} Career Roadmap Guide`;
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
        <div style="margin-top: 20px; white-space: pre-wrap;">
          ${adviceResult.replace(/\n/g, '<br/>')}
        </div>
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

  const handleDownloadRoadmapPPT = () => {
    if (!adviceResult) return;
    const title = `${activeCareer.name} Career Roadmap Guide`;
    
    // Simple parsing of markdown sections
    const sections = adviceResult.split(/(?=\n#{1,4} )/);
    
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
          <p>ScholarOS Career Roadmap Presentation Outline</p>
        </div>
    `;

    let slidesContent = '';
    sections.forEach((sec: string) => {
      if (sec.trim().length === 0) return;
      const lines = sec.trim().split('\n');
      const slideTitle = lines[0].replace(/^[#\s\d.]+/, '').trim();
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
    link.download = `${title.replace(/\s+/g, '_')}.ppt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success('PowerPoint slideshow outline exported successfully');
  };

  const handleDownloadRoadmapPDF = async () => {
    const el = document.getElementById('career-roadmap-report-preview');
    if (el) {
      toast.info('Generating PDF...');
      const opt = {
        margin: 15,
        filename: `${activeCareer.name}_Career_Roadmap.pdf`,
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

  const getActiveNodes = () => {
    if (!activeCareer) return [];
    return defaultSkillNodes[activeCareer.id] || generateGenericNodes(activeCareer.name);
  };

  const activeNodes = getActiveNodes();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-12">
      <SEO 
        title="Interactive Career Roadmaps & Learning Paths"
        description="Explore curated educational paths for 13 tech roles. Mark off milestone achievements, view resources, and chart your career path."
      />
      
      {/* Lobby: Display 13 Tracks */}
      {viewState === 'grid' && (
        <div className="space-y-12">
          
          {/* Header */}
          <section className="relative text-center space-y-4 py-8 md:py-12 overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/60 backdrop-blur-xl">
            <div className="space-y-4 px-4 relative max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-black uppercase tracking-wider border border-border">
                <GitFork className="w-3.5 h-3.5 text-primary" /> Career Roadmap Trees
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-foreground">
                Interactive <span className="text-primary italic">Skill Roadmaps</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto font-medium">
                Choose from 13 high-demand careers. Tick off milestone nodes, view verified learning links, and check guidelines from the AI Career Advisor.
              </p>
            </div>
          </section>

          {/* Grid listing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map((career) => (
              <button
                key={career.id}
                onClick={() => {
                  setActiveCareer(career);
                  setViewState('view');
                }}
                className="p-6 bg-[#111] border border-white/5 hover:border-primary/30 rounded-3xl text-left hover:bg-white/5 transition-all group relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-wider text-primary">Track</span>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-primary transition-colors">{career.name}</h3>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">{career.desc}</p>
                </div>
              </button>
            ))}
          </div>

        </div>
      )}

      {/* View Mode: Roadmap Vertical timeline & Advisor side panel */}
      {viewState === 'view' && activeCareer && (
        <div className="space-y-8">
          
          {/* Top navigation controls */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setViewState('grid')}
              className="p-3 bg-[#111] border border-white/5 text-zinc-400 hover:text-white rounded-2xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-xl font-black text-white">{activeCareer.name} Specialization</h2>
              <p className="text-xs text-zinc-500">Milestone checklists and timeline guides</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Timeline Tree panel */}
            <div className="lg:col-span-7 bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 space-y-8 shadow-2xl">
              
              {/* Progress bar */}
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Progress Tracker</span>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xl font-black text-primary">{progress}%</span>
                    <div className="w-40 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-wider text-zinc-400 rounded-full">
                  {completedNodes.length} of {activeNodes.length} Complete
                </span>
              </div>

              {/* Vertical timelines layout */}
              <div className="relative pl-6 border-l border-white/10 space-y-12 py-4">
                {activeNodes.map((node) => {
                  const isFinished = completedNodes.includes(node.id);
                  return (
                    <div key={node.id} className="relative group space-y-3">
                      {/* Node Bullet anchor */}
                      <button 
                        onClick={() => handleToggleNode(node.id)}
                        className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isFinished 
                            ? 'bg-primary border-primary text-zinc-950 shadow-lg shadow-primary/20' 
                            : 'bg-[#111] border-white/10 text-zinc-600 hover:border-primary/40 hover:text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>

                      {/* Content panel */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 
                            onClick={() => {
                              setSelectedNode(node);
                              setNodeNote('');
                            }}
                            className="font-black text-base text-white hover:text-primary cursor-pointer transition-colors"
                          >
                            {node.label}
                          </h4>
                          <span className="px-2 py-0.5 bg-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-widest rounded">
                            {node.time}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">{node.desc}</p>
                      </div>

                      {/* Detail link buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedNode(node)}
                          className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-300 transition-all border border-white/5"
                        >
                          <BookOpen className="w-3.5 h-3.5 inline mr-1.5" /> Resources & Notes
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

            {/* AI Advisor Panel */}
            <div className="lg:col-span-5 bg-[#111] border border-white/5 rounded-[2.5rem] p-6 space-y-6 shadow-2xl">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" /> AI Career Advisor
                </h3>
                <p className="text-[10px] text-zinc-500">Get customized hiring insights</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">My Current Skills</label>
                  <input
                    type="text"
                    placeholder="e.g. Python, SQL, Git"
                    value={currentSkills}
                    onChange={(e) => setCurrentSkills(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 text-zinc-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Time Commitment</label>
                  <select
                    value={goalTime}
                    onChange={(e) => setGoalTime(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/5 text-zinc-300 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="3 months">3 Months Bootcamp</option>
                    <option value="6 months">6 Months Standard</option>
                    <option value="12 months">12 Months College Prep</option>
                  </select>
                </div>

                <button
                  onClick={handleConsultAdvisor}
                  disabled={advisorLoading || !currentSkills}
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-zinc-950 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all disabled:opacity-50"
                >
                  {advisorLoading ? <Loader2 className="w-4.5 h-4.5 animate-spin inline mr-1.5" /> : <Sparkles className="w-4.5 h-4.5 inline mr-1.5" />}
                  Ask Advisor (8 Credits)
                </button>
              </div>

              {adviceResult && (
                <div className="space-y-4">
                  <div className="border border-white/5 bg-black/40 rounded-2xl p-4 space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar">
                    <div id="career-roadmap-report-preview" className="space-y-4">
                      <strong className="text-[9px] uppercase tracking-widest text-zinc-300 block border-b border-white/5 pb-2">Advisor Recommendation</strong>
                      <div className="text-xs text-zinc-400 leading-relaxed space-y-4">
                        {/* A quick formatter to split markdown bullets */}
                        {adviceResult.split('\n').map((line, i) => {
                          if (line.startsWith('#')) return <h4 key={i} className="font-black text-white mt-3">{line.replace(/#/g, '').trim()}</h4>;
                          return <p key={i}>{line}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button onClick={handleDownloadRoadmapPDF} className="flex-1 py-2 bg-primary hover:bg-primary-hover text-zinc-950 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                      PDF
                    </button>
                    <button onClick={handleDownloadRoadmapDoc} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                      Word (Doc)
                    </button>
                    <button onClick={handleDownloadRoadmapPPT} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                      Slides (PPT)
                    </button>
                  </div>
                  <span className="text-[8px] font-black text-emerald-400 block text-center uppercase tracking-wider mt-1">
                    💾 Saved to your Saved Documents workspace.
                  </span>
                </div>
              )}

            </div>

          </div>

          {/* Node detail Modal/Drawer */}
          <AnimatePresence>
            {selectedNode && (
              <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm no-print">
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="w-full max-w-lg h-full bg-[#151515] border-l border-white/5 p-6 space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-6 overflow-y-auto flex-grow pr-2 custom-scrollbar">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-white/5 pb-4">
                      <div>
                        <span className="text-[9px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full">{selectedNode.time}</span>
                        <h3 className="text-lg font-black text-white mt-2">{selectedNode.label}</h3>
                      </div>
                      <button onClick={() => setSelectedNode(null)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>

                    {/* Resources */}
                    <div className="space-y-3">
                      <strong className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">Verified Learning Resources</strong>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedNode.resources.map((res: string, i: number) => (
                          <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between text-xs">
                            <span className="font-semibold text-zinc-300">{res}</span>
                            <span className="text-[8px] font-black uppercase text-primary">Free Resource</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Practice Questions */}
                    <div className="space-y-2 bg-white/5 border border-white/5 p-4 rounded-2xl text-xs">
                      <strong className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">Weekly Assignment</strong>
                      <p className="text-zinc-300 font-semibold">{selectedNode.questions}</p>
                    </div>

                    {/* Notebook text write area */}
                    <div className="space-y-2">
                      <strong className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">My Learning Notes</strong>
                      <textarea
                        value={nodeNote}
                        onChange={(e) => setNodeNote(e.target.value)}
                        placeholder="Write down conceptual notes, syntax cheat sheets, or doubt questions..."
                        rows={6}
                        className="w-full bg-white/5 border border-white/5 text-zinc-300 rounded-2xl p-4 text-xs focus:outline-none focus:border-primary resize-none leading-relaxed"
                      />
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="border-t border-white/5 pt-4 flex gap-3">
                    <button 
                      onClick={() => setSelectedNode(null)}
                      className="flex-1 py-3 bg-white/5 text-zinc-400 rounded-xl text-xs font-black uppercase tracking-widest border border-white/5 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveNote}
                      disabled={savingNote}
                      className="flex-grow py-3 bg-primary hover:bg-primary-hover text-zinc-950 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                      {savingNote ? 'Saving...' : 'Save Notes'}
                    </button>
                  </div>

                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
};

export default CareerRoadmaps;
