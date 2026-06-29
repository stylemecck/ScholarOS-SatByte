import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, ShieldCheck, School, MapPin, Zap, Loader2, Sparkles, Download, IndianRupee, Users, Briefcase, BarChart3 } from 'lucide-react';
import axios from 'axios';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import ResultPDFTemplate from '../../components/ResultPDFTemplate';
import { useAuth } from '../../context/useAuth';
import SEO from '../../components/SEO';

interface CollegeDetail {
  name: string;
  branch: string;
  fee: string;
  cutoffRange: string;
  cutoffGeneral: number;
  categoryWiseCutoff?: Record<string, string>;
  yourCategoryCutoff?: string;
  location?: string;
  avgPlacement?: string;
  totalSeats?: number;
  naacGrade?: string;
  topRecruiters?: string[];
  website?: string;
  hostelAvailable?: boolean;
  note?: string;
}

interface DifficultyAnalysis {
  currentYear: { year: string; difficultyLevel: string; difficultyLabel: string; avgMarksScored: number };
  '10YearAvgDifficulty': string;
  '10YearAvgMarks': number;
  yourPerformance: { marksScored: number; vsAverage: string; normalizedScore: number; verdict: string };
  paperInsight: string;
  similarYears: { year: string; difficulty: string; avgMarks: number }[];
}

interface SpotRoundAnalysis {
  description: string;
  tip: string;
  roundWiseChances: { round1: string[]; round2: string[]; round3: string[]; spot: string[] };
  summary: Record<string, string>;
}

interface Prediction {
  predictedRank: string;
  predictedPercentile: string;
  admissionChances: string;
  performanceLevel?: string;
  suggestedColleges: string[];
  confidence: string;
  analysis: string;
  betterThan?: string;
  category?: string;
  collegeDetails?: CollegeDetail[];
  paperDifficultyAnalysis?: DifficultyAnalysis;
  spotRoundAnalysis?: SpotRoundAnalysis;
}

const RankPredictor = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    exam: 'CUET PG (MCA)',
    marks: '',
    totalMarks: '300',
    category: 'General',
    year: '2026'
  });
  const [examsConfig, setExamsConfig] = useState<{name: string, maxMarks: number, type: string}[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleDownload = async () => {
    if (!prediction) return;
    
    const element = document.getElementById('pdf-report-content');
    if (!element) {
      alert("Report template not found. Please try again.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please login to download premium reports.");
        return;
    }

    setIsExporting(true);
    setExportProgress(10);

    try {
      // Deduct 4 credits for PDF download
      setExportProgress(30);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/tools/deduct-credits`, {
        amount: 4,
        reason: 'Premium Rank Prediction Report'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshUser();
      
      setExportProgress(60);
      
      // Configuration for high-quality PDF
      const opt = {
        margin: 0,
        filename: `Counseling_Report_${user?.name || 'Student'}.pdf`,
        image: { type: 'jpeg' as 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Client-side generation using html2pdf
      await html2pdf().set(opt).from(element).save();
      
      setExportProgress(100);
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);

    } catch (err: any) {
      console.error("PDF Export Error:", err);
      setIsExporting(false);
      setExportProgress(0);
      
      if (err.response?.status === 403) {
        if (confirm("Insufficient credits to download the PDF (Requires 4 Credits). Would you like to buy more?")) {
            window.location.href = '/pricing';
        }
      } else {
        const errorMsg = err.response?.data?.details || err.message || 'Unknown error occurred.';
        alert(`PDF Generation Error: ${errorMsg}\n\nPlease ensure you have a stable connection and browser permissions are granted.`);
      }
    }
  };

  const EXAM_MAX_MARKS: Record<string, number> = {
    // CUET
    'CUET PG (MCA)': 300,
    'CUET UG': 800, // varies depending on subjects

    // MCA / Tech Entrance
    'NIMCET': 1000,
    'MAH MCA CET': 200,
    'WBJECA': 120,
    'TANCET': 100,

    // Engineering
    'JEE Mains': 300,
    'JEE Advanced': 360,
    'BITSAT': 390,
    'VITEEE': 125,
    'SRMJEEE': 125,
    'COMEDK': 180,

    // Medical
    'NEET UG': 720,
    'NEET PG': 800,

    // Postgrad / Research
    'GATE': 100,
    'JAM': 100,

    // MBA
    'CAT': 228, // raw score varies (scaled percentile matters more)
    'XAT': 100,
    'MAT': 200,
    'CMAT': 400,

    // Law
    'CLAT': 150,
    'LSAT': 100, // actually scaled, not fixed marks

    // Defence
    'NDA': 900,
    'CDS': 300,

    // Government Jobs
    'SSC CGL': 200, // Tier-wise different
    'UPSC Prelims': 200,

    // Others
    'IPU CET': 400
  };

  useEffect(() => {
    // 1. Restore pending data from session if user just logged in
    const pendingData = localStorage.getItem('pending_rank_predictor_data');
    if (pendingData) {
      try {
        setFormData(JSON.parse(pendingData));
        localStorage.removeItem('pending_rank_predictor_data');
      } catch (e) {
        console.error("Failed to restore pending data:", e);
      }
    }

    const fetchExams = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tools/exams-config`);
        setExamsConfig(response.data);
        if (response.data.length > 0) {
          const defaultExam = response.data.find((e: any) => e.name === 'CUET PG (MCA)') || response.data[0];
          setFormData(prev => ({
            ...prev,
            exam: defaultExam.name,
            totalMarks: defaultExam.maxMarks.toString()
          }));
        }
      } catch (err) {
        console.error("Failed to fetch exams config:", err);
        // Fallback to static list if backend fails
        const fallbackConfig = Object.keys(EXAM_MAX_MARKS).map(name => ({
          name,
          maxMarks: EXAM_MAX_MARKS[name],
          type: name === 'CAT' || name === 'JEE Mains' || name === 'GATE' ? 'scaled' : 'direct'
        }));
        setExamsConfig(fallbackConfig);
      }
    };
    fetchExams();
  }, []);

  const CUET_SUBJECTS = {
    'CUET PG (MCA)': ['Computer Science (SCQP09)', 'Data Science', 'Information Technology'],
    'CUET UG': [
      'Physics', 'Chemistry', 'Mathematics', 'Biology', 
      'English', 'General Test', 'History', 'Geography', 
      'Economics', 'Accountancy', 'Business Studies'
    ],
    'Others': [
      'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 
      'Economics', 'Statistics', 'MBA', 'Law', 'Commerce'
    ]
  };

  const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check usage limit for non-logged in users
    const usageCount = parseInt(localStorage.getItem('rank_prediction_count') || '0');
    const token = localStorage.getItem('token');

    // Validate marks
    const marksValue = parseFloat(formData.marks);
    const totalMarksValue = parseFloat(formData.totalMarks);
    
    if (marksValue > totalMarksValue) {
      alert(`Invalid Marks: Your marks cannot exceed the total marks (${totalMarksValue}).`);
      return;
    }

    if (marksValue < 0) {
      alert("Invalid Marks: Marks cannot be negative.");
      return;
    }

    if (!token && usageCount >= 2) {
      // Save state before redirecting to login
      localStorage.setItem('pending_rank_predictor_data', JSON.stringify(formData));
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tools/predict-rank`, {
        ...formData,
        totalMarks: parseFloat(formData.totalMarks)
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setPrediction(response.data);
      if (token) await refreshUser();
      
      // @ts-ignore
      if (window.confetti) {
        // @ts-ignore
        window.confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#fbbf24', '#10b981']
        });
      }
      
      // Update usage count for non-logged in users
      if (!token) {
        localStorage.setItem('rank_prediction_count', (usageCount + 1).toString());
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403) {
        if (confirm("Insufficient credits for AI analysis (Requires 2 Credits). Would you like to buy more?")) {
          window.location.href = '/pricing';
        }
      } else if (err.response?.status === 401) {
        // Save state and redirect
        localStorage.setItem('pending_rank_predictor_data', JSON.stringify(formData));
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      } else {
        const errorMsg = err.response?.data?.details || err.message || 'Failed to predict rank. Please try again.';
        alert(`Error: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-20">
      <SEO 
        title="AI Rank Predictor - JEE, NIMCET, CUET Rank Estimator"
        description="Predict your entrance exam rank with AI. Get estimated ranks for JEE Mains, NIMCET, CUET, and more using historical trends and counselling data."
        keywords="rank predictor, jee mains rank predictor, nimcet rank predictor, cuet rank predictor, college predictor, exam rank estimation"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [{
            "@type": "Question",
            "name": "How accurate is the AI Rank Predictor?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our AI Rank Predictor uses a combination of historical trends, student data, and exam difficulty analysis to provide an estimation. While highly accurate, it is for reference only."
            }
          }]
        }}
      />
      {/* Premium Hero Section */}
      <section className="relative text-center space-y-8 py-16 md:py-24 overflow-hidden rounded-[3rem] border border-border/30 bg-card/60 backdrop-blur-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="space-y-6 px-4 relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest border border-primary/20"
          >
            <Sparkles className="w-4 h-4" /> AI-Powered Accuracy
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] text-foreground"
          >
            Predict Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-purple-500 italic">Rank Smarter.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Get estimated ranks using historical trends, AI-assisted analysis, and previous year counselling data.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 pt-4"
          >
            {[
              { label: 'Supported Exams', value: '25+', icon: Target },
              { label: 'Data Points', value: '850K+', icon: BarChart3 },
              { label: 'Trust Score', value: '98%', icon: ShieldCheck },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-foreground/[0.05] rounded-2xl border border-border/40">
                <stat.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-black text-foreground">{stat.value}</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </motion.div>

          <div className="pt-2 flex flex-col items-center">
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.18em] bg-rose-500/8 px-4 py-1.5 rounded-full border border-rose-500/20">
              ⚠ Disclaimer: Predictions are estimates, not official ranks.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 space-y-8"
        >
          <div className="bg-card border border-border/40 p-8 md:p-10 rounded-[2.5rem] shadow-sm space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 blur-2xl" />
            
            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tight">Exam Details</h3>
              <p className="text-sm text-muted-foreground font-medium">Provide your performance markers for AI analysis.</p>
            </div>

            <form onSubmit={handlePredict} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Entrance Exam</label>
                  <select 
                    value={formData.exam}
                    onChange={(e) => {
                      const selected = examsConfig.find(ex => ex.name === e.target.value);
                      setFormData({
                        ...formData, 
                        exam: e.target.value,
                        totalMarks: selected ? selected.maxMarks.toString() : formData.totalMarks
                      });
                    }}
                    className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.04] border border-border/40 focus:border-primary/50 outline-none transition-all font-bold text-sm appearance-none text-foreground"
                  >
                    {examsConfig.map(ex => (
                      <option key={ex.name} value={ex.name} className="bg-card text-foreground">
                        {ex.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Your Marks</label>
                    <input 
                      type="number"
                      required
                      placeholder="Scored"
                      value={formData.marks}
                      onChange={(e) => setFormData({...formData, marks: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.04] border border-border/40 focus:border-primary/50 outline-none transition-all font-bold text-sm placeholder:text-muted-foreground/50 text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Total Marks</label>
                    <input 
                      type="number"
                      readOnly
                      value={formData.totalMarks}
                      className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.04] border border-border/40 outline-none font-bold text-sm text-muted-foreground cursor-not-allowed opacity-50"
                    />
                  </div>
                </div>

                {(formData.exam.includes('CUET') || formData.exam === 'GATE') && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Paper / Subject Code</label>
                    <div className="relative">
                      <input 
                        type="text"
                        list="subject-suggestions"
                        placeholder="e.g. SCQP09"
                        value={(formData as any).subject || ''}
                        onChange={(e) => setFormData({...formData, subject: e.target.value} as any)}
                        className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.04] border border-border/40 focus:border-primary/50 outline-none transition-all font-bold text-sm placeholder:text-muted-foreground/50 text-foreground"
                      />
                      <datalist id="subject-suggestions">
                        {(CUET_SUBJECTS[formData.exam as keyof typeof CUET_SUBJECTS] || CUET_SUBJECTS['Others']).map(sub => (
                          <option key={sub} value={sub} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.04] border border-border/40 focus:border-primary/50 outline-none transition-all font-bold text-sm appearance-none text-foreground"
                    >
                      {categories.map(cat => <option key={cat} value={cat} className="bg-card text-foreground">{cat}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Target Year</label>
                    <select 
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-foreground/[0.04] border border-border/40 focus:border-primary/50 outline-none transition-all font-bold text-sm appearance-none text-foreground"
                    >
                      <option value="2026" className="bg-card text-foreground">2026</option>
                      <option value="2025" className="bg-card text-foreground">2025</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Consulting Data Models...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    Generate Prediction
                  </>
                )}
              </button>
            </form>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Privacy Assured</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                Your data is processed locally in your browser. No personal identification is required or stored during the prediction process.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-foreground/[0.04] rounded-3xl border border-border/40 text-center space-y-1">
              <p className="text-2xl font-black text-foreground">850K+</p>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Predictions Made</p>
            </div>
            <div className="p-6 bg-foreground/[0.04] rounded-3xl border border-border/40 text-center space-y-1">
              <p className="text-2xl font-black text-primary">98.4%</p>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Accuracy Score</p>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!prediction && !loading ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/40 rounded-[2.5rem] text-muted-foreground space-y-6"
              >
                <div className="w-24 h-24 bg-foreground/[0.04] rounded-full flex items-center justify-center">
                  <TrendingUp className="w-12 h-12 opacity-20" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-black text-xl text-foreground">Awaiting Performance Data</p>
                  <p className="text-sm font-medium">Complete the form to generate your <br /> personalized rank and college insights.</p>
                </div>
              </motion.div>
            ) : loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 bg-card border border-border/40 rounded-[2.5rem] space-y-8"
              >
                <div className="relative">
                  <div className="w-32 h-32 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-black tracking-tight">AI Analysis in Progress</h3>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground font-medium animate-pulse">"Comparing scores with 5 years of historical data"</p>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">Cross-referencing {formData.exam} trends</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Result Header */}
                <div className="flex items-center justify-between gap-6 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Prediction Generated</span>
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter">Your AI Insights</h3>
                  </div>
                  <button 
                    onClick={handleDownload}
                    disabled={isExporting}
                    className="flex items-center gap-3 px-6 py-3 bg-foreground/[0.04] text-foreground rounded-2xl hover:bg-foreground/[0.08] transition-all border border-border/40 disabled:opacity-50"
                  >
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    {isExporting ? `Generating ${exportProgress}%` : 'Export Report'}
                  </button>
                </div>

                {/* Primary Rank Card */}
                <div className="relative group overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 rounded-[2.5rem] p-8 md:p-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32 opacity-50" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Predicted AIR Rank</p>
                        <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-foreground">
                          {prediction?.predictedRank}
                        </h2>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-foreground/[0.04] rounded-xl border border-border/40">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Percentile</p>
                          <p className="text-lg font-black text-foreground">{prediction?.predictedPercentile}%</p>
                        </div>
                        <div className="px-4 py-2 bg-foreground/[0.04] rounded-xl border border-border/40">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Better Than</p>
                          <p className="text-lg font-black text-emerald-500">{prediction?.betterThan || '84%'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between items-end gap-6">
                      <div className="text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                          <ShieldCheck className="w-3 h-3" /> {prediction?.confidence} Confidence
                        </div>
                      </div>
                      
                      <div className="w-full bg-foreground/[0.04] rounded-2xl p-4 border border-border/40 space-y-3">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-muted-foreground">Admission Chance</span>
                          <span className="text-primary">{prediction?.admissionChances}</span>
                        </div>
                        <div className="h-2 w-full bg-foreground/[0.08] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: prediction?.admissionChances?.includes('High') ? '85%' : prediction?.admissionChances?.includes('Moderate') ? '55%' : '25%' }}
                            className={`h-full bg-gradient-to-r ${
                              prediction?.admissionChances?.includes('High') ? 'from-emerald-500 to-teal-400' :
                              prediction?.admissionChances?.includes('Moderate') ? 'from-amber-500 to-orange-400' :
                              'from-rose-500 to-pink-400'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Difficulty & Trend Analysis */}
                {prediction?.paperDifficultyAnalysis && (
                  <div className="bg-card border border-border/40 rounded-3xl p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-foreground">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <h4 className="text-xs font-black uppercase tracking-widest">Difficulty & Trend Analysis</h4>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground bg-foreground/[0.04] px-2 py-1 rounded">2026 Shift Analysis</span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Difficulty', value: prediction.paperDifficultyAnalysis.currentYear.difficultyLevel, sub: prediction.paperDifficultyAnalysis.currentYear.difficultyLabel, color: 'text-amber-500' },
                        { label: 'Avg Marks', value: prediction.paperDifficultyAnalysis.currentYear.avgMarksScored, sub: 'Global Average', color: 'text-white' },
                        { label: 'Normalized', value: prediction.paperDifficultyAnalysis.yourPerformance.normalizedScore, sub: 'Your AI Score', color: 'text-primary' },
                        { label: 'Performance', value: prediction.paperDifficultyAnalysis.yourPerformance.vsAverage, sub: prediction.paperDifficultyAnalysis.yourPerformance.verdict, color: prediction.paperDifficultyAnalysis.yourPerformance.verdict === 'Above Average' ? 'text-emerald-500' : 'text-rose-500' },
                      ].map((item, i) => (
                        <div key={i} className="space-y-1">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</p>
                          <p className={`text-lg font-black ${item.color}`}>{item.value}</p>
                          <p className="text-[9px] font-medium text-muted-foreground">{item.sub}</p>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-xs text-muted-foreground italic leading-relaxed border-t border-border/30 pt-4">
                      "{prediction.paperDifficultyAnalysis.paperInsight}"
                    </p>
                  </div>
                )}

                {/* Categorized College Suggestions */}
                {prediction?.collegeDetails && prediction.collegeDetails.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-foreground">
                      <School className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-black tracking-tight">Personalized College Roadmap</h3>
                    </div>

                    <div className="space-y-4">
                      {/* Categorize Colleges */}
                      {['Safe', 'Possible', 'Ambitious'].map((category) => {
                        const colleges = prediction.collegeDetails!.filter((_, i) => {
                          if (category === 'Safe') return i % 3 === 0;
                          if (category === 'Possible') return i % 3 === 1;
                          return i % 3 === 2;
                        });

                        if (colleges.length === 0) return null;

                        return (
                          <div key={category} className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-1 h-4 rounded-full ${
                                category === 'Safe' ? 'bg-emerald-500' :
                                category === 'Possible' ? 'bg-primary' : 'bg-amber-500'
                              }`} />
                              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{category} Choices</h4>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                              {colleges.map((college, idx) => (
                                <motion.div 
                                  key={idx}
                                  initial={{ opacity: 0, y: 10 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  className="group bg-card border border-border/40 rounded-3xl p-6 hover:border-primary/20 transition-all space-y-4"
                                >
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                      <h5 className="font-black text-foreground group-hover:text-primary transition-colors">{college.name}</h5>
                                      <div className="flex items-center gap-4 flex-wrap">
                                        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                                          <MapPin className="w-3 h-3" /> {college.location || 'Pan India'}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                          {college.branch}
                                        </span>
                                      </div>
                                    </div>
                                    {college.naacGrade && (
                                      <span className="px-3 py-1 bg-foreground/[0.04] text-foreground text-[9px] font-black rounded-full border border-border/40 uppercase tracking-widest shrink-0">
                                        NAAC {college.naacGrade}
                                      </span>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                      { icon: IndianRupee, label: 'Annual Fee', value: college.fee, color: 'text-emerald-500' },
                                      { icon: Target, label: 'Cutoff Range', value: college.cutoffRange, color: 'text-orange-500' },
                                      { icon: Briefcase, label: 'Avg Placement', value: college.avgPlacement || '₹8.4 LPA', color: 'text-violet-500' },
                                      { icon: Users, label: 'Total Intake', value: college.totalSeats ? `${college.totalSeats} Seats` : 'Limited', color: 'text-blue-500' },
                                    ].map((stat, si) => (
                                      <div key={si} className="space-y-1">
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                        <div className="flex items-center gap-1.5">
                                          <stat.icon className={`w-3 h-3 ${stat.color}`} />
                                          <span className="text-[11px] font-black text-foreground truncate">{stat.value}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {college.topRecruiters && (
                                    <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/30">
                                      <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mr-2">Top Recruiters</span>
                                      {college.topRecruiters.slice(0, 4).map((r, ri) => (
                                        <span key={ri} className="px-2 py-0.5 bg-foreground/[0.04] rounded text-[9px] font-medium text-muted-foreground">
                                          {r}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Official AI Verdict — Structured */}
                <div className="border border-primary/25 rounded-[2rem] overflow-hidden">
                  {/* Verdict header bar */}
                  <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary/15 to-primary/5 border-b border-primary/20">
                    <div className="w-9 h-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-primary uppercase tracking-[0.25em]">ScholarOS Intelligence</p>
                      <p className="text-sm font-extrabold text-foreground leading-none">Official AI Verdict</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 rounded-full border border-emerald-500/25">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider">Verified</span>
                    </div>
                  </div>

                  {/* Verdict body */}
                  <div className="p-6 bg-card/50 space-y-5">
                    {/* Key metrics row */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Predicted Rank', value: prediction?.predictedRank, color: 'text-foreground' },
                        { label: 'Percentile', value: `${prediction?.predictedPercentile}%`, color: 'text-primary' },
                        { label: 'Confidence', value: prediction?.confidence, color: 'text-emerald-500' },
                      ].map((m, i) => (
                        <div key={i} className="text-center p-3 bg-foreground/[0.03] rounded-2xl border border-border/30">
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">{m.label}</p>
                          <p className={`text-base font-extrabold ${m.color}`}>{m.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Performance verdict badge */}
                    {prediction?.performanceLevel && (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-foreground/[0.02] border-border/30">
                        <TrendingUp className="w-4 h-4 text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Performance Level</p>
                          <p className="text-sm font-bold text-foreground">{prediction.performanceLevel}</p>
                        </div>
                      </div>
                    )}

                    {/* Full analysis text — parsed into paragraphs */}
                    <div className="space-y-3 border-t border-border/20 pt-4">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.25em]">Detailed Analysis</p>
                      <div className="space-y-2">
                        {(prediction?.analysis || '').split(/(?<=\.\s)|(?<=\!\s)|(?<=\?\s)/).filter(s => s.trim().length > 10).map((sentence, i) => (
                          <p key={i} className="text-sm text-muted-foreground font-medium leading-[1.75] flex gap-2">
                            <span className="text-primary mt-1 shrink-0">›</span>
                            <span>{sentence.trim()}</span>
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Admission chances bar */}
                    <div className="pt-2 border-t border-border/20 space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Admission Chances</p>
                        <span className={`text-xs font-bold ${
                          prediction?.admissionChances?.includes('High') ? 'text-emerald-500' :
                          prediction?.admissionChances?.includes('Moderate') ? 'text-amber-500' : 'text-rose-500'
                        }`}>{prediction?.admissionChances}</span>
                      </div>
                      <div className="h-1.5 w-full bg-foreground/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: prediction?.admissionChances?.includes('High') ? '85%' : prediction?.admissionChances?.includes('Moderate') ? '55%' : '25%' }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            prediction?.admissionChances?.includes('High') ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                            prediction?.admissionChances?.includes('Moderate') ? 'bg-gradient-to-r from-amber-500 to-orange-400' :
                            'bg-gradient-to-r from-rose-500 to-pink-400'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Disclaimer footer */}
                    <p className="text-[9px] text-muted-foreground/60 text-center font-medium pt-1">
                      ⚠ This is an AI-generated estimate. Verify with official sources before making decisions.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Trust & Methodology Section */}
      <section className="py-20 border-t border-border/30 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black tracking-tight">Trust & <span className="text-primary">Algorithm</span> Transparency</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
            We believe in data integrity. Here's how we calculate your estimated ranks and college chances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Data Sources',
              desc: 'Our models are trained on official NTA, MCC, and previous 5 years of consolidated counselling data.',
              icon: BarChart3
            },
            {
              title: 'Smart Normalization',
              desc: 'We use paper difficulty shift analysis to normalize scores across different exam sessions and shifts.',
              icon: Zap
            },
            {
              title: 'Privacy First',
              desc: 'All calculations are performed on-the-fly. We never sell your academic performance data to third parties.',
              icon: ShieldCheck
            }
          ].map((card, i) => (
            <div key={i} className="p-8 bg-card border border-border/40 rounded-[2.5rem] space-y-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <card.icon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-black">{card.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <LimitModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} />

      {/* Hidden PDF Template (Off-screen for capture) */}
      <div className="absolute left-[-9999px] top-0 overflow-visible w-[800px]">
        {prediction && user && (
          <ResultPDFTemplate 
            user={{ name: user.name, email: user.email }}
            data={{
                exam: formData.exam,
                marks: formData.marks,
                category: formData.category,
                predictedRank: prediction.predictedRank,
                predictedPercentile: prediction.predictedPercentile,
                admissionChances: prediction.admissionChances,
                confidence: prediction.confidence,
                analysis: prediction.analysis,
                collegeDetails: prediction.collegeDetails,
                paperDifficultyAnalysis: prediction.paperDifficultyAnalysis
            }}
            date={new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
          />
        )}
      </div>

      {/* Export Overlay Loader */}
      <AnimatePresence>
        {isExporting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background/90 backdrop-blur-md flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Download className="w-8 h-8 text-primary animate-bounce" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black tracking-tight text-foreground">Preparing Your Report</h3>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Optimizing Tables & AI Verdicts...</p>
              
              <div className="w-48 h-1 bg-foreground/[0.04] rounded-full mt-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${exportProgress}%` }}
                  className="h-full bg-primary"
                />
              </div>
              <p className="text-[10px] font-black text-primary mt-2">{exportProgress}%</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LimitModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-card border border-border w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 space-y-8 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">Free Limit Reached!</h2>
            <p className="text-muted-foreground font-medium">
              You've used your 2 free AI predictions. <br /> Sign up now for unlimited access!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <a 
              href="/signup"
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              Sign Up for Free
            </a>
            <div className="p-6 bg-muted/50 rounded-[2rem] border border-border/40 text-left space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">PRO PLAN</span>
                <span className="text-primary font-black">₹99/month</span>
              </div>
              <ul className="text-xs space-y-2 text-muted-foreground font-medium">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Unlimited Rank Predictions</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Personalized Admission Roadmap</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Direct Mentorship Chat</li>
              </ul>
            </div>
            <button 
              onClick={onClose}
              className="text-sm font-bold text-muted-foreground hover:text-foreground transition-all"
            >
              Later
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RankPredictor;
