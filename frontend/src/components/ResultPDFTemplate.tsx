import { ShieldCheck, Target, TrendingUp, Award } from 'lucide-react';

interface PDFTemplateProps {
  user: { name: string; email: string };
  toolName: string;
  data: any;
  date: string;
}

const ResultPDFTemplate = ({ user, toolName, data, date }: PDFTemplateProps) => {
  return (
    <div id="pdf-report-content" className="p-12 bg-white text-slate-900 font-sans max-w-[800px] mx-auto border-[12px] border-slate-50">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-black text-blue-600 tracking-tight">STUDENT TOOLKIT PRO</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Official AI Analysis Report</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">{date}</p>
          <p className="text-[10px] text-slate-400 font-mono">REPORT_ID: {Math.random().toString(36).slice(2, 11).toUpperCase()}</p>
        </div>
      </div>

      {/* User Info */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase">Student Name</p>
          <p className="text-lg font-bold">{user.name}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase">Tool Utilized</p>
          <p className="text-lg font-bold text-blue-600">{toolName}</p>
        </div>
      </div>

      {/* Main Analysis Box */}
      <div className="bg-slate-50 rounded-3xl p-10 mb-12 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
            <Target size={120} />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2 text-blue-600">
            <TrendingUp size={20} />
            <h2 className="text-xl font-black uppercase tracking-tight">AI Analysis Results</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Exam / Context</p>
              <p className="text-xl font-black">{data.exam || 'N/A'}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Primary Result</p>
              <p className="text-2xl font-black text-blue-600">
                {toolName === 'Rank Predictor' ? data.predictedRank : `${data.percentile}%`}
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-emerald-600">
              <ShieldCheck size={18} />
              <p className="text-[10px] font-black uppercase tracking-widest">AI Assessment</p>
            </div>
            <p className="text-lg font-bold text-slate-700 italic">
              "Based on historical data and current trends, your performance level is categorized as <span className="text-blue-600 underline">{data.performanceLevel || data.admissionChances}</span>."
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="space-y-4 border-t border-slate-100 pt-8">
        <div className="flex items-center gap-2 text-slate-400">
          <Award size={16} />
          <p className="text-[10px] font-black uppercase tracking-widest">Verified Academic Insight</p>
        </div>
        <p className="text-[9px] text-slate-400 leading-relaxed italic">
          This report is generated using Google Gemini 1.5 Flash AI based on student-provided data. While highly accurate, these results are predictive and should be used for informational purposes only. Student Toolkit Pro is not responsible for official admission outcomes.
        </p>
      </div>

      {/* Footer Branding */}
      <div className="mt-12 text-center">
        <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest">
            www.studenttoolkitpro.com
        </div>
      </div>
    </div>
  );
};

export default ResultPDFTemplate;
