import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, TrendingUp, School, ShieldCheck, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';

interface Prediction {
  predictedRank: string;
  predictedPercentile: string;
  admissionChances: 'High' | 'Moderate' | 'Low';
  suggestedColleges: string[];
  confidence: 'High' | 'Medium' | 'Low';
  analysis: string;
}

const RankPredictor = () => {
  const [formData, setFormData] = useState({
    exam: 'CUET PG (MCA)',
    marks: '',
    category: 'General',
    year: '2026'
  });
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

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
      const response = await axios.post('${import.meta.env.VITE_API_URL}/api/tools/predict-rank', formData);
      setPrediction(response.data);
      
      // Update usage count and Save Result if logged in
      if (!token) {
        localStorage.setItem('rank_prediction_count', (usageCount + 1).toString());
      } else {
        // Automatically save to dashboard if logged in
        try {
          await axios.post('${import.meta.env.VITE_API_URL}/api/tools/save-result', {
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
      const errorMsg = err.response?.data?.details || err.message || 'Failed to predict rank. Please try again.';
      alert(`Error: ${errorMsg}`);
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
                className="space-y-6"
              >
                {/* Main Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border p-6 rounded-[2.5rem] space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Target className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Predicted Rank</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-primary">{prediction?.predictedRank}</h3>
                      <p className="text-xs font-medium text-muted-foreground">Approximate Range</p>
                    </div>
                  </div>
                  <div className="bg-card border border-border p-6 rounded-[2.5rem] space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Percentile</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-indigo-500">{prediction?.predictedPercentile}%</h3>
                      <p className="text-xs font-medium text-muted-foreground">Estimated Score</p>
                    </div>
                  </div>
                </div>

                {/* Admission Chances */}
                <div className={`p-6 rounded-3xl border-2 flex items-center justify-between ${
                  prediction?.admissionChances === 'High' ? 'bg-emerald-500/5 border-emerald-500/20' :
                  prediction?.admissionChances === 'Moderate' ? 'bg-amber-500/5 border-amber-500/20' :
                  'bg-rose-500/5 border-rose-500/20'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${
                      prediction?.admissionChances === 'High' ? 'bg-emerald-500 text-white' :
                      prediction?.admissionChances === 'Moderate' ? 'bg-amber-500 text-white' :
                      'bg-rose-500 text-white'
                    }`}>
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Admission Chances</h4>
                      <p className={`text-2xl font-black ${
                        prediction?.admissionChances === 'High' ? 'text-emerald-500' :
                        prediction?.admissionChances === 'Moderate' ? 'text-amber-500' :
                        'text-rose-500'
                      }`}>{prediction?.admissionChances}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-muted-foreground">Confidence Level</p>
                    <p className="font-bold">{prediction?.confidence}</p>
                  </div>
                </div>

                {/* Suggested Colleges */}
                <div className="bg-card border border-border p-8 rounded-[2.5rem] space-y-6 shadow-sm">
                  <div className="flex items-center gap-2 text-primary">
                    <School className="w-5 h-5" />
                    <h3 className="text-lg font-bold">Suggested Colleges</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {prediction?.suggestedColleges.map((college, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-muted/50 rounded-2xl border border-border hover:border-primary/30 transition-all cursor-default">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="font-medium text-sm">{college}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl flex gap-4">
                  <AlertCircle className="w-6 h-6 text-primary shrink-0" />
                  <p className="text-sm leading-relaxed italic text-muted-foreground">
                    <span className="text-foreground font-bold">AI Analysis:</span> {prediction?.analysis}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <LimitModal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} />
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
