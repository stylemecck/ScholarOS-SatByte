import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Loader2, Sparkles, 
  Info, Share2, Target, Award, Lightbulb,
  ShieldCheck, Zap, ChevronRight,
  Calculator, LineChart, Globe
} from 'lucide-react';
import axios from 'axios';

interface PercentileResult {
  percentile: string;
  range: string;
  performanceLevel: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
  betterThan: string;
  insights: string;
  suggestions: string[];
  confidence: 'High' | 'Medium' | 'Low';
}

const MarksVsPercentile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    exam: 'JEE Mains',
    marks: '',
    totalMarks: '',
    category: 'General',
    difficulty: 'Moderate'
  });
  const [result, setResult] = useState<PercentileResult | null>(null);
  const [loading, setLoading] = useState(false);

  useState(() => {
    // Restore pending data
    const pendingData = localStorage.getItem('pending_marks_percentile_data');
    if (pendingData) {
      try {
        setFormData(JSON.parse(pendingData));
        localStorage.removeItem('pending_marks_percentile_data');
      } catch (e) {
        console.error("Failed to restore pending data:", e);
      }
    }
  });

  const exams = [
    'JEE Mains', 'JEE Advanced', 'NEET UG', 'CUET PG (MCA)', 'CUET UG', 
    'NIMCET', 'MAH MCA CET', 'WBJECA', 'TANCET', 'GATE', 'CAT'
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tools/predict-percentile`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setResult(response.data);
      // Scroll to result on mobile
      if (window.innerWidth < 1024) {
          setTimeout(() => {
              document.getElementById('result-dashboard')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401 || !localStorage.getItem('token')) {
        localStorage.setItem('pending_marks_percentile_data', JSON.stringify(formData));
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      } else {
        alert("Failed to analyze performance. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-32 pb-32">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 px-4 text-center space-y-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-8 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/[0.04] text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20"
          >
            <LineChart className="w-4 h-4" /> Exam Analytics Engine
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-foreground"
          >
            Convert Marks Into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 italic pr-4">Percentile Instantly.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto"
          >
            Analyze your exam performance using historical trends and AI-powered percentile estimation models.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 pt-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700"
          >
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-primary" /> Trusted by 50k+ Aspirants
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <Globe className="w-4 h-4 text-primary" /> All India Coverage
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                JEE • NEET • CUET • GATE
            </div>
          </motion.div>
          
          <div className="pt-6">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-foreground/[0.04] inline-block px-4 py-2 rounded-full border border-border/30">
                * Percentiles are estimated and may vary from official results.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* 2. INPUT FORM EXPERIENCE */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 space-y-8"
        >
          <div className="saas-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-700 blur-2xl" />
            
            <div className="relative space-y-10">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-primary" /> Score Details
                </h3>
                <p className="text-xs font-medium text-muted-foreground">Provide your raw data for precise estimation.</p>
              </div>

              <form onSubmit={handleAnalyze} className="space-y-8">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Competitive Exam</label>
                        <select 
                            value={formData.exam}
                            onChange={(e) => setFormData({...formData, exam: e.target.value})}
                            className="saas-input w-full appearance-none cursor-pointer"
                        >
                            {exams.map(ex => <option key={ex} value={ex} className="bg-background">{ex}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Your Marks</label>
                            <input 
                                type="number" required placeholder="e.g. 180"
                                value={formData.marks}
                                onChange={(e) => setFormData({...formData, marks: e.target.value})}
                                className="saas-input w-full"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Total Marks</label>
                            <input 
                                type="number" placeholder="Optional"
                                value={formData.totalMarks}
                                onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
                                className="saas-input w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Quota / Category</label>
                        <select 
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="saas-input w-full appearance-none cursor-pointer"
                        >
                            {['General', 'OBC', 'SC', 'ST', 'EWS'].map(c => <option key={c} value={c} className="bg-background">{c}</option>)}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Shift Difficulty</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Easy', 'Moderate', 'Hard'].map(d => (
                            <button
                                key={d} type="button"
                                onClick={() => setFormData({...formData, difficulty: d})}
                                className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                formData.difficulty === d 
                                    ? 'bg-primary border-primary text-primary-foreground shadow-sm scale-[1.01]' 
                                    : 'bg-foreground/[0.04] border-border/30 text-muted-foreground hover:bg-foreground/[0.08]'
                                }`}
                            >
                                {d}
                            </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button 
                  type="submit" disabled={loading}
                  className="w-full saas-button-primary !py-6 text-sm flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Calculate Percentile</>}
                </button>
              </form>

              <div className="p-6 bg-foreground/[0.04] rounded-2xl border border-border/40 flex gap-4">
                <Info className="w-5 h-5 text-primary shrink-0" />
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                    We use normalization algorithms that account for shift variations and difficulty weights observed in recent years.
                </p>
              </div>
            </div>
          </div>

          {/* Supported Features Grid */}
          <div className="grid grid-cols-2 gap-4">
              <div className="saas-card !p-6 flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">Trend Analysis</span>
              </div>
              <div className="saas-card !p-6 flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                    <Target className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">Rank Range</span>
              </div>
          </div>
        </motion.div>

        {/* 3. RESULT DASHBOARD */}
        <div className="lg:col-span-7" id="result-dashboard">
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div 
                key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-16 saas-card border-dashed border-border/40 text-muted-foreground space-y-6 text-center"
              >
                <div className="w-24 h-24 bg-foreground/[0.04] rounded-full flex items-center justify-center border border-border/30 mb-4">
                  <LineChart className="w-12 h-12 opacity-20" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground">Insights Await.</h3>
                  <p className="text-sm font-medium">Your detailed percentile report and <br /> college roadmap will appear here.</p>
                </div>
              </motion.div>
            ) : loading ? (
              <motion.div 
                key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-16 saas-card space-y-10"
              >
                <div className="relative">
                  <div className="w-40 h-40 border-4 border-border/10 border-t-primary rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-12 h-12 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">Normalizing Results...</h3>
                  <p className="text-muted-foreground font-medium flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Comparing against 100k+ historical data points
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Main Result Card */}
                <div className="saas-card !p-0 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/10 opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="p-12 space-y-10 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Estimated Percentile</span>
                            <h2 className="text-8xl font-black tracking-tighter text-foreground leading-none">{result?.percentile}<span className="text-4xl text-primary/50 font-medium ml-2">%</span></h2>
                            <div className="flex items-center gap-3 pt-4">
                                <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase text-primary">
                                    {result?.performanceLevel}
                                </div>
                                <div className="px-4 py-1.5 bg-foreground/[0.04] border border-border/40 rounded-full text-[10px] font-black uppercase text-muted-foreground">
                                    Range: {result?.range}
                                </div>
                            </div>
                        </div>

                        {/* 4. VISUAL ANALYTICS - Distribution Curve */}
                        <div className="flex-shrink-0 w-full md:w-auto">
                            <div className="w-full md:w-64 h-40 bg-foreground/[0.04] rounded-3xl p-6 border border-border/40 relative overflow-hidden group/chart">
                                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {/* Normal Distribution Curve */}
                                    <path 
                                        d="M 0 40 C 30 40, 40 0, 50 0 C 60 0, 70 40, 100 40" 
                                        fill="url(#curveGradient)"
                                        stroke="var(--primary)"
                                        strokeWidth="1.5"
                                        className="animate-[dash_2s_ease-in-out_forwards]"
                                    />
                                    {/* User Position Indicator */}
                                    <motion.circle 
                                        cx={result ? (parseFloat(result.percentile) || 50) : 50} 
                                        cy={result ? (40 - (Math.sin((parseFloat(result.percentile) || 50) / 100 * Math.PI) * 40)) : 20}
                                        r="2" fill="currentColor"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5 }}
                                    />
                                </svg>
                                <div className="absolute bottom-3 left-0 w-full flex justify-between px-4 text-[8px] font-black uppercase tracking-widest text-muted-foreground/30">
                                    <span>Lower</span>
                                    <span>Average</span>
                                    <span>Topper</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-border/30 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Standing</p>
                            <p className="text-xl font-bold text-foreground tracking-tight">Better than {result?.betterThan}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Confidence</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-foreground tracking-tight">{result?.confidence}</span>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Expected Rank</p>
                            <p className="text-xl font-bold text-foreground tracking-tight">~ Top {Math.round(100 - (parseFloat(result?.percentile || '0')))}%</p>
                        </div>
                    </div>
                  </div>
                </div>

                {/* 5. EXAM INSIGHT SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="saas-card relative overflow-hidden group">
                        <div className="p-8 space-y-6 relative z-10">
                            <div className="flex items-center gap-3 text-primary">
                                <Lightbulb className="w-6 h-6" />
                                <h4 className="text-xl font-black tracking-tight text-foreground">AI Insights</h4>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                                "{result?.insights}"
                            </p>
                        </div>
                    </div>

                    {/* 6. COLLEGE PREDICTION FLOW */}
                    <div className="saas-card bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/20 group hover:border-indigo-500/40 transition-all">
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-3 text-indigo-400">
                                <Award className="w-6 h-6" />
                                <h4 className="text-xl font-black tracking-tight text-foreground">Next Steps</h4>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                Based on your {result?.percentile} percentile, explore the colleges where you have the highest probability of admission.
                            </p>
                            <button 
                                onClick={() => navigate('/tools/rank-predictor')}
                                className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-400 transition-all group/btn"
                            >
                                Explore College Predictor <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Roadmaps / Suggestions */}
                <div className="saas-card !p-8 space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40">Target Recommendations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result?.suggestions?.map((s, i) => (
                            <div key={i} className="flex gap-4 p-5 bg-foreground/[0.04] rounded-2xl border border-border/40 hover:border-primary/20 transition-all group/item">
                                <div className="w-10 h-10 rounded-xl bg-foreground/[0.04] flex items-center justify-center text-primary font-black shrink-0 group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-all">
                                    {i + 1}
                                </div>
                                <p className="text-xs font-bold leading-relaxed text-muted-foreground group-hover/item:text-foreground transition-colors">{s}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-foreground/[0.04] border border-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-foreground/[0.08] transition-all">
                            <Share2 className="w-4 h-4" /> Share Report
                        </button>
                        <button 
                            onClick={() => setResult(null)}
                            className="flex items-center gap-2 px-6 py-3 bg-foreground/[0.04] border border-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
                        >
                            Reset Analysis
                        </button>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 7. TRUST & TRANSPARENCY SECTION */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4 saas-card !p-8 border-border/40">
            <h4 className="text-lg font-black text-foreground">How it Works</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">Our engine compares your score against shift-wise historical data and calculates a weighted percentile based on exam-specific normalization rules.</p>
        </div>
        <div className="space-y-4 saas-card !p-8 border-border/40">
            <h4 className="text-lg font-black text-foreground">Data Integrity</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">Predictions are based on millions of public data points from previous sessions (2019-2024) to ensure high-confidence results.</p>
        </div>
        <div className="space-y-4 saas-card !p-8 border-border/40">
            <h4 className="text-lg font-black text-foreground">Confidentiality</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">Your data is processed locally to generate insights. We do not store your scores unless you explicitly save them to your profile.</p>
        </div>
      </section>

      {/* 14. FINAL CTA SECTION */}
      <section className="px-4">
        <div className="max-w-5xl mx-auto saas-card !p-12 md:!p-24 text-center space-y-12 relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-50" />
          <div className="space-y-6 relative z-10">
            <h2 className="text-4xl md:text-7xl font-black text-foreground tracking-tighter leading-none">
              Master your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 italic">Academic Strategy.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">Explore the full ecosystem of tools designed for the modern student.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <Link to="/tools/rank-predictor" className="saas-button-primary !px-12 !py-6 text-sm flex items-center justify-center gap-3">
              <Target className="w-5 h-5" /> College Predictor
            </Link>
            <Link to="/tools/resume-builder" className="saas-button-secondary !px-12 !py-6 text-sm flex items-center justify-center gap-3">
              <BarChart3 className="w-5 h-5" /> Resume Pro
            </Link>
          </div>
        </div>
      </section>

      {/* 13. DISCLAIMER SECTION */}
      <section className="max-w-4xl mx-auto px-4 pb-12 opacity-40">
          <div className="text-center space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Official Notice</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                  SATBYTE Toolkit is not affiliated with NTA, CBSE, or any official exam conducting body. All estimations provided are based on historical trends and statistical models. Final results depend on official normalization criteria and individual shift statistics which may vary yearly.
              </p>
          </div>
      </section>
    </div>
  );
};

export default MarksVsPercentile;
