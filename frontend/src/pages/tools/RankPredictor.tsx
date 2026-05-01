import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, School, ShieldCheck, AlertCircle, Loader2, Sparkles, Download, MapPin, IndianRupee, Users, Award, Briefcase, BarChart3, Clock, Zap } from 'lucide-react';
import axios from 'axios';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import ResultPDFTemplate from '../../components/ResultPDFTemplate';
import { useAuth } from '../../context/useAuth';

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
    category: 'General',
    year: '2026'
  });
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById('pdf-report-content');
    if (!element) return;

    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please login to download reports.");
        return;
    }

    try {
      // Deduct 4 credits for PDF download
      await axios.post(`${import.meta.env.VITE_API_URL}/api/tools/deduct-credits`, {
        amount: 4,
        reason: 'PDF Report Download'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshUser();

      const opt = {
        margin: 0,
        filename: `Rank_Report_${user?.name || 'Student'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
      };
      html2pdf().set(opt).from(element).save();
    } catch (err: any) {
      if (err.response?.status === 403) {
        if (confirm("Insufficient credits to download the PDF (Requires 4 Credits). Would you like to buy more?")) {
            window.location.href = '/pricing';
        }
      } else {
        alert("Failed to process download. Please check your connection.");
      }
    }
  };

  const exams = [
    'CUET PG (MCA)', 'CUET UG', 'NIMCET', 'MAH MCA CET', 'WBJECA', 'TANCET',
    'JEE Mains', 'JEE Advanced', 'NEET UG', 'NEET PG',
    'GATE', 'JAM', 'CAT', 'XAT', 'MAT', 'CMAT',
    'CLAT', 'LSAT', 'NDA', 'CDS', 'SSC CGL', 'UPSC Prelims',
    'IPU CET', 'BITSAT', 'VITEEE', 'SRMJEEE', 'COMEDK'
  ];
  const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check usage limit for non-logged in users
    const usageCount = parseInt(localStorage.getItem('rank_prediction_count') || '0');
    const token = localStorage.getItem('token');

    if (!token && usageCount >= 2) {
      setShowLimitModal(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tools/predict-rank`, formData, {
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
      
      // Update usage count and Save Result if logged in
      if (!token) {
        localStorage.setItem('rank_prediction_count', (usageCount + 1).toString());
      } else {
        // Automatically save to dashboard if logged in
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/tools/save-result`, {
            toolName: 'Rank Predictor',
            data: { ...formData, ...response.data }
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (saveErr) {
          console.error("Failed to save result:", saveErr);
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403) {
        if (confirm("Insufficient credits for AI analysis (Requires 2 Credits). Would you like to buy more?")) {
          window.location.href = '/pricing';
        }
      } else {
        const errorMsg = err.response?.data?.details || err.message || 'Failed to predict rank. Please try again.';
        alert(`Error: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl"
        >
          <Target className="w-8 h-8" />
        </motion.div>
        <h1 className="text-4xl font-black tracking-tight">AI Rank Predictor <span className="text-primary">2026</span></h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get data-driven insights into your performance. Our AI analyzes historical cutoff trends to give you the most realistic rank and college predictions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 bg-card border border-border p-8 rounded-[2.5rem] shadow-xl space-y-6"
        >
          <form onSubmit={handlePredict} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Select Exam</label>
              <select 
                value={formData.exam}
                onChange={(e) => setFormData({...formData, exam: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              >
                {exams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Marks Obtained</label>
              <input 
                type="number"
                required
                placeholder="e.g. 240"
                value={formData.marks}
                onChange={(e) => setFormData({...formData, marks: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              />
            </div>

            {(formData.exam.includes('CUET')) && (
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Subject / Paper Code</label>
                <input 
                  type="text"
                  placeholder="e.g. Computer Science (SCQP09)"
                  value={(formData as any).subject || ''}
                  onChange={(e) => setFormData({...formData, subject: e.target.value} as any)}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Target Year</label>
                <select 
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-lg hover:shadow-primary/25 hover:translate-y-[-2px] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Trends...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Predict My Rank
                </>
              )}
            </button>
          </form>

          {/* Ad Placeholder */}
          <div className="h-24 bg-muted/30 rounded-2xl border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground font-bold uppercase tracking-widest">
            Ad Space (Google AdSense)
          </div>

          <p className="text-[10px] text-center text-muted-foreground px-4">
            *Disclaimer: Predictions are based on historical data and AI models. Actual results may vary based on exam difficulty and student participation.
          </p>
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
                className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-[2.5rem] text-muted-foreground space-y-4"
              >
                <div className="p-4 bg-muted rounded-full">
                  <TrendingUp className="w-12 h-12" />
                </div>
                <p className="font-bold text-center">Fill in your details to see <br /> your predicted performance.</p>
              </motion.div>
            ) : loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 bg-card border border-border rounded-[2.5rem] space-y-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">Consulting AI Models...</h3>
                  <p className="text-sm text-muted-foreground italic">"Comparing scores with 5 years of historical data"</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5"
              >
                {/* Header + Download */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h3 className="text-xl font-black flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    AI Prediction Result
                  </h3>
                  <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black hover:bg-primary hover:text-primary-foreground transition-all border border-primary/20"
                  >
                    <Download className="w-4 h-4" /> Download Report
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Predicted Rank', value: prediction?.predictedRank, icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Percentile', value: prediction?.predictedPercentile?.toString().endsWith('%') ? prediction.predictedPercentile : `${prediction?.predictedPercentile}%`, icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Performance', value: prediction?.performanceLevel || prediction?.admissionChances, icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Better Than', value: prediction?.betterThan || '-', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                  ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-card border border-border p-4 rounded-2xl space-y-2 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color} w-fit`}><stat.icon className="w-3.5 h-3.5" /></div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                      <p className={`text-lg sm:text-xl font-black ${stat.color} truncate`}>{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Admission Chances Bar */}
                <div className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                  prediction?.admissionChances?.includes('High') ? 'bg-emerald-500/5 border-emerald-500/20' :
                  prediction?.admissionChances?.includes('Moderate') ? 'bg-amber-500/5 border-amber-500/20' :
                  'bg-rose-500/5 border-rose-500/20'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      prediction?.admissionChances?.includes('High') ? 'bg-emerald-500' :
                      prediction?.admissionChances?.includes('Moderate') ? 'bg-amber-500' : 'bg-rose-500'
                    } text-white`}><ShieldCheck className="w-5 h-5" /></div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Admission Chances</p>
                      <p className={`text-lg font-black ${
                        prediction?.admissionChances?.includes('High') ? 'text-emerald-500' :
                        prediction?.admissionChances?.includes('Moderate') ? 'text-amber-500' : 'text-rose-500'
                      }`}>{prediction?.admissionChances}</p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-muted-foreground">Confidence</p>
                    <p className="text-xs font-bold">{prediction?.confidence}</p>
                  </div>
                </div>

                {/* Paper Difficulty Analysis */}
                {prediction?.paperDifficultyAnalysis && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/15 p-5 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center gap-2 text-orange-500">
                      <Zap className="w-4 h-4" />
                      <h4 className="text-sm font-black uppercase tracking-wider">Paper Difficulty Analysis</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-card/60 backdrop-blur rounded-xl p-3 text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Difficulty</p>
                        <p className="text-lg font-black text-orange-500">{prediction.paperDifficultyAnalysis.currentYear.difficultyLevel}</p>
                        <p className="text-[10px] font-medium text-muted-foreground">{prediction.paperDifficultyAnalysis.currentYear.difficultyLabel}</p>
                      </div>
                      <div className="bg-card/60 backdrop-blur rounded-xl p-3 text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Avg Marks</p>
                        <p className="text-lg font-black">{prediction.paperDifficultyAnalysis.currentYear.avgMarksScored}</p>
                        <p className="text-[10px] font-medium text-muted-foreground">This Year</p>
                      </div>
                      <div className="bg-card/60 backdrop-blur rounded-xl p-3 text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Normalized</p>
                        <p className="text-lg font-black text-emerald-500">{prediction.paperDifficultyAnalysis.yourPerformance.normalizedScore}</p>
                        <p className="text-[10px] font-medium text-muted-foreground">Your Adjusted</p>
                      </div>
                      <div className="bg-card/60 backdrop-blur rounded-xl p-3 text-center">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">vs Average</p>
                        <p className={`text-sm font-black ${prediction.paperDifficultyAnalysis.yourPerformance.verdict === 'Above Average' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {prediction.paperDifficultyAnalysis.yourPerformance.vsAverage}
                        </p>
                        <p className="text-[10px] font-medium text-muted-foreground">{prediction.paperDifficultyAnalysis.yourPerformance.verdict}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">{prediction.paperDifficultyAnalysis.paperInsight}</p>
                  </motion.div>
                )}

                {/* College Details Cards */}
                {prediction?.collegeDetails && prediction.collegeDetails.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="bg-card border border-border p-5 rounded-2xl space-y-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-primary">
                      <School className="w-5 h-5" />
                      <h3 className="text-sm font-black uppercase tracking-wider">College Counseling — Eligible Institutions</h3>
                    </div>
                    <div className="space-y-3">
                      {prediction.collegeDetails.map((college, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }}
                          className="bg-muted/30 border border-border rounded-xl p-4 hover:border-primary/30 transition-all space-y-3"
                        >
                          {/* College Header */}
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm leading-tight">{college.name}</h4>
                              <div className="flex items-center gap-3 mt-1 flex-wrap">
                                {college.location && (
                                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="w-3 h-3" />{college.location}</span>
                                )}
                                <span className="text-[11px] text-muted-foreground">{college.branch}</span>
                              </div>
                            </div>
                            {college.naacGrade && (
                              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg shrink-0">NAAC {college.naacGrade}</span>
                            )}
                          </div>

                          {/* Stats Row */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="flex items-center gap-1.5 text-xs">
                              <IndianRupee className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span className="font-bold truncate">{college.fee}</span>
                            </div>
                            {college.totalSeats && (
                              <div className="flex items-center gap-1.5 text-xs">
                                <Users className="w-3 h-3 text-blue-500 shrink-0" />
                                <span className="font-bold">{college.totalSeats} seats</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-xs">
                              <Target className="w-3 h-3 text-orange-500 shrink-0" />
                              <span className="font-bold">Cutoff: {college.cutoffRange}</span>
                            </div>
                            {college.avgPlacement && (
                              <div className="flex items-center gap-1.5 text-xs">
                                <Briefcase className="w-3 h-3 text-violet-500 shrink-0" />
                                <span className="font-bold">{college.avgPlacement}</span>
                              </div>
                            )}
                          </div>

                          {/* Your Category Cutoff Highlight */}
                          {college.yourCategoryCutoff && prediction.category && prediction.category !== 'General' && (
                            <div className="bg-primary/5 border border-primary/10 rounded-lg px-3 py-1.5">
                              <span className="text-[11px] font-bold text-primary">Your {prediction.category} Cutoff Range: {college.yourCategoryCutoff}</span>
                            </div>
                          )}

                          {/* Recruiters */}
                          {college.topRecruiters && college.topRecruiters.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-muted-foreground font-bold">Top Recruiters:</span>
                              {college.topRecruiters.map((r, ri) => (
                                <span key={ri} className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-medium">{r}</span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Spot Round Counseling */}
                {prediction?.spotRoundAnalysis && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-violet-500/5 to-blue-500/5 border border-violet-500/15 p-5 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center gap-2 text-violet-500">
                      <Clock className="w-4 h-4" />
                      <h4 className="text-sm font-black uppercase tracking-wider">Counseling Round Analysis</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['round1', 'round2', 'round3', 'spot'] as const).map((round) => {
                        const colleges = prediction.spotRoundAnalysis!.roundWiseChances[round];
                        const labels: Record<string, string> = { round1: 'Round 1', round2: 'Round 2', round3: 'Round 3', spot: 'Spot Round' };
                        const colors: Record<string, string> = { round1: 'text-emerald-500 bg-emerald-500/10', round2: 'text-blue-500 bg-blue-500/10', round3: 'text-amber-500 bg-amber-500/10', spot: 'text-violet-500 bg-violet-500/10' };
                        return (
                          <div key={round} className="bg-card/60 backdrop-blur rounded-xl p-3 space-y-1.5">
                            <p className={`text-[10px] font-black uppercase tracking-wider ${colors[round].split(' ')[0]}`}>{labels[round]}</p>
                            {colleges.length > 0 ? (
                              colleges.slice(0, 2).map((c, i) => (
                                <p key={i} className="text-[11px] font-medium truncate">{c}</p>
                              ))
                            ) : (
                              <p className="text-[11px] text-muted-foreground italic">—</p>
                            )}
                            {colleges.length > 2 && <p className="text-[10px] text-muted-foreground">+{colleges.length - 2} more</p>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-violet-500/10 rounded-xl p-3">
                      <p className="text-[11px] text-violet-300 font-medium italic">💡 {prediction.spotRoundAnalysis.tip}</p>
                    </div>
                  </motion.div>
                )}

                {/* AI Analysis */}
                <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl flex gap-3">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <span className="text-foreground font-bold">AI Analysis: </span>{prediction?.analysis}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <LimitModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} />

      {/* Hidden PDF Template (Off-screen for capture) */}
      <div className="absolute left-[-9999px] top-0 overflow-hidden">
        {prediction && user && (
          <ResultPDFTemplate 
            user={{ name: user.name, email: user.email }}
            toolName="Rank Predictor"
            data={{
                exam: formData.exam,
                predictedRank: prediction.predictedRank,
                performanceLevel: prediction.admissionChances
            }}
            date={new Date().toLocaleDateString()}
          />
        )}
      </div>
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
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-lg hover:shadow-primary/25 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
            >
              Sign Up for Free
            </a>
            <div className="p-6 bg-muted/50 rounded-[2rem] border border-border text-left space-y-4">
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
