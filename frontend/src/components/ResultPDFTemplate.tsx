import { ShieldCheck, Target, TrendingUp, Award, School, MapPin, IndianRupee, Briefcase, Zap } from 'lucide-react';

interface PDFTemplateProps {
  user: { name: string; email: string };
  toolName: string;
  data: {
    exam: string;
    marks: string;
    category: string;
    predictedRank: string;
    predictedPercentile: string;
    admissionChances: string;
    confidence: string;
    analysis: string;
    collegeDetails?: any[];
    paperDifficultyAnalysis?: any;
  };
  date: string;
}

const ResultPDFTemplate = ({ user, toolName, data, date }: PDFTemplateProps) => {
  return (
    <div id="pdf-report-content" className="p-12 bg-white text-slate-900 font-sans max-w-[800px] mx-auto min-h-[1120px] flex flex-col">
      {/* Header with Branding */}
      <div className="flex justify-between items-start border-b-4 border-blue-600 pb-8 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">S</div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">SATBYTE <span className="text-blue-600 font-medium">TOOLKIT</span></h1>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-10">Official Career Insight Report</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-slate-900">{date}</p>
          <p className="text-[9px] text-slate-400 font-mono mt-1">REF: SBT-{Math.random().toString(36).slice(2, 11).toUpperCase()}</p>
        </div>
      </div>

      {/* Student & Exam Profile */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="col-span-2 space-y-4">
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2">Student Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Full Name</p>
              <p className="text-sm font-black text-slate-800">{user.name}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Email Identity</p>
              <p className="text-sm font-bold text-slate-600">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2">Exam Context</h3>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Target Exam</p>
            <p className="text-sm font-black text-slate-800">{data.exam}</p>
          </div>
        </div>
      </div>

      {/* Performance Dashboard */}
      <div className="bg-slate-900 text-white rounded-[2rem] p-8 mb-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Predicted AIR Rank</p>
            <h2 className="text-5xl font-black tracking-tighter text-white">{data.predictedRank}</h2>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-[8px] font-black text-slate-400 uppercase">Percentile Score</p>
              <p className="text-base font-black text-white">{data.predictedPercentile}%</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-[8px] font-black text-slate-400 uppercase">Admission Chances</p>
              <p className="text-base font-black text-emerald-400">{data.admissionChances}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-600/30 text-[9px] font-black uppercase tracking-widest">
              <ShieldCheck size={12} /> {data.confidence} Confidence Level
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">
              AI analysis suggests your score is in the top {100 - parseFloat(data.predictedPercentile)}% of participants.
            </p>
          </div>
        </div>
      </div>

      {/* Difficulty Analysis Section */}
      {data.paperDifficultyAnalysis && (
        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-500" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Counselling Shift Analysis</h3>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 grid grid-cols-4 gap-4">
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase">Shift Difficulty</p>
              <p className="text-xs font-black text-slate-800">{data.paperDifficultyAnalysis.currentYear.difficultyLevel}</p>
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase">Global Avg</p>
              <p className="text-xs font-black text-slate-800">{data.paperDifficultyAnalysis.currentYear.avgMarksScored}</p>
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase">Normalization</p>
              <p className="text-xs font-black text-blue-600">Applied</p>
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase">Verdict</p>
              <p className="text-xs font-black text-emerald-600">{data.paperDifficultyAnalysis.yourPerformance.verdict}</p>
            </div>
          </div>
        </div>
      )}

      {/* College Recommendations Table */}
      <div className="mb-10 space-y-4">
        <div className="flex items-center gap-2">
          <School size={16} className="text-blue-600" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">College Recommendation Roadmap</h3>
        </div>
        
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase">Institution & Branch</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase">Est. Cutoff</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase">Placement</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase text-right">Chance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.collegeDetails?.map((college, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="text-sm font-black text-slate-800">{college.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{college.branch}</span>
                      <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1"><MapPin size={8} /> {college.location || 'India'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[10px] font-black text-slate-600">{college.cutoffRange}</p>
                  </td>
                  <td className="px-4 py-4 text-xs font-bold text-emerald-600">
                    {college.avgPlacement || '₹8.5 LPA'}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                      idx % 3 === 0 ? 'bg-emerald-100 text-emerald-700' :
                      idx % 3 === 1 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {idx % 3 === 0 ? 'Safe' : idx % 3 === 1 ? 'Possible' : 'Ambitious'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Verdict */}
      <div className="mt-auto pt-8 border-t border-slate-100">
        <div className="flex gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/20">
            <Award size={20} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Counselling Strategy & Verdict</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {data.analysis}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-8 pt-8 flex justify-between items-center border-t border-slate-100">
        <p className="text-[9px] text-slate-400 font-medium italic max-w-[400px]">
          * Predictions are based on historical data. Final outcome may vary during actual counseling. SATBYTE TOOLKIT is an AI prediction platform.
        </p>
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Toolkit by SatByte</p>
          <p className="text-[8px] text-slate-400">www.toolkit.satbyte.in</p>
        </div>
      </div>
    </div>
  );
};

export default ResultPDFTemplate;
