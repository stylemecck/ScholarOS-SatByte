import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Loader2, Sparkles, 
  Info, Share2, Target, Award, Lightbulb
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
  const [formData, setFormData] = useState({
    exam: 'CUET PG (MCA)',
    marks: '',
    totalMarks: '',
    category: 'General',
    difficulty: 'Moderate'
  });
  const [result, setResult] = useState<PercentileResult | null>(null);
  const [loading, setLoading] = useState(false);

  const exams = [
    'CUET PG (MCA)', 'CUET UG', 'NIMCET', 'MAH MCA CET', 'WBJECA', 'TANCET',
    'JEE Mains', 'JEE Advanced', 'NEET UG', 'GATE', 'CAT'
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tools/predict-percentile`, formData);
      setResult(response.data);

      // Automatically save to dashboard if logged in
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/tools/save-result`, {
            toolName: 'Marks vs Percentile',
            data: { ...formData, ...response.data }
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (saveErr) {
          console.error("Failed to save result:", saveErr);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex p-3 bg-primary/10 text-primary rounded-2xl"
        >
          <BarChart3 className="w-8 h-8" />
        </motion.div>
        <h1 className="text-4xl font-black tracking-tight">Marks vs Percentile <span className="text-primary">Analyzer</span></h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Instantly convert your raw marks into an estimated percentile based on deep AI analysis of historical trends and difficulty levels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 bg-card border border-border p-8 rounded-[2.5rem] shadow-xl space-y-6"
        >
          <form onSubmit={handleAnalyze} className="space-y-5">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Your Marks</label>
                <input 
                  type="number" required placeholder="e.g. 240"
                  value={formData.marks}
                  onChange={(e) => setFormData({...formData, marks: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Total Marks</label>
                <input 
                  type="number" placeholder="Optional"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              >
                {['General', 'OBC', 'SC', 'ST', 'EWS'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['Easy', 'Moderate', 'Hard'].map(d => (
                  <button
                    key={d} type="button"
                    onClick={() => setFormData({...formData, difficulty: d})}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      formData.difficulty === d ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-lg hover:shadow-primary/25 hover:translate-y-[-2px] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Calculating...</> : <><Sparkles className="w-5 h-5" /> Analyze Percentile</>}
            </button>
          </form>

          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-3">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
              Percentile indicates the percentage of candidates who scored equal to or less than you. Our AI uses normalized data for better accuracy.
            </p>
          </div>
        </motion.div>

        {/* Results Panel */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div 
                key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-[3rem] text-muted-foreground space-y-4"
              >
                <div className="p-5 bg-muted rounded-full">
                  <TrendingUp className="w-16 h-16" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground">Ready for Analysis</h3>
                  <p>Enter your marks to see where you stand <br /> among thousands of aspirants.</p>
                </div>
              </motion.div>
            ) : loading ? (
              <motion.div 
                key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-12 bg-card border border-border rounded-[3rem] space-y-8"
              >
                <div className="relative">
                  <div className="w-32 h-32 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BarChart3 className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black">AI Normalization in Progress...</h3>
                  <p className="text-muted-foreground italic">Comparing your score with previous year shift-wise data</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Main Percentile Display */}
                <div className="bg-primary text-primary-foreground p-10 rounded-[3rem] shadow-2xl shadow-primary/20 relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700" />
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-2 text-center md:text-left">
                      <p className="text-sm font-black uppercase tracking-widest opacity-80">Estimated Percentile</p>
                      <h2 className="text-7xl font-black tracking-tighter">{result?.percentile}%</h2>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <Award className="w-5 h-5" />
                        <span className="font-bold">Range: {result?.range}</span>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 text-center min-w-[200px]">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Performance</p>
                      <h4 className="text-2xl font-black">{result?.performanceLevel}</h4>
                      <div className="mt-4 h-2 w-full bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result?.percentile}%` }}
                          className="h-full bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card border border-border p-8 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Standing</p>
                      <h4 className="text-xl font-black">Better than {result?.betterThan}</h4>
                      <p className="text-xs text-muted-foreground font-medium">of all test takers</p>
                    </div>
                  </div>
                  <div className="bg-card border border-border p-8 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                    <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center">
                      <Target className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Confidence</p>
                      <h4 className="text-xl font-black">{result?.confidence} Level</h4>
                      <p className="text-xs text-muted-foreground font-medium">Based on data volume</p>
                    </div>
                  </div>
                </div>

                {/* AI Insights & Suggestions */}
                <div className="bg-card border border-border rounded-[3rem] overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3 text-primary mb-4">
                      <Lightbulb className="w-6 h-6" />
                      <h3 className="text-xl font-black tracking-tight">AI Insights & Roadmaps</h3>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                      "{result?.insights}"
                    </p>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result?.suggestions.map((s, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-muted/50 rounded-2xl border border-border group hover:border-primary/30 transition-all">
                        <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary font-black shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-xs font-bold leading-tight self-center">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-4">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                    *Estimated based on historical shift-wise normalization
                  </p>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-primary/10 hover:text-primary rounded-xl text-xs font-bold transition-all">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button 
                      onClick={() => setResult(null)}
                      className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-rose-500/10 hover:text-rose-500 rounded-xl text-xs font-bold transition-all"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MarksVsPercentile;
