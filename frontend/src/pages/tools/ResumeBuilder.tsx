import { ResumeProvider, useResume } from '../../context/ResumeContext';
import ResumeForm from '../../components/ResumeBuilder/ResumeForm';
import ResumePreview from '../../components/ResumeBuilder/ResumePreview';
import { Download, Layout, Palette, Eye, Edit3 } from 'lucide-react';
import { useState } from 'react';

const ResumeBuilderContent = () => {
  const { resumeData, setResumeData } = useResume();
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [zoom, setZoom] = useState(0.8);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById('resume-a4');
    if (!element) return;

    setIsGenerating(true);
    try {
      const opt = {
        margin: 0,
        filename: `${resumeData.personalInfo.fullName || 'resume'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      
      // Use html2pdf.js which is already in package.json
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().set(opt).from(element).save();
      
    } catch (err: any) {
      console.error("PDF Export Error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const templates: Array<'Modern' | 'Classic' | 'Creative'> = ['Modern', 'Classic', 'Creative'];
  const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#0f172a'];

  return (
    <div className="min-h-screen bg-muted/30 -mt-8 -mx-4 pb-20">
      {/* Top Controls Toolbar - More Responsive */}
      <div className="sticky top-20 z-40 w-full bg-background border-b border-border shadow-sm px-4 md:px-6 py-3 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {/* Template Selector */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Layout className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <div className="flex bg-muted p-1 rounded-lg">
                {templates.map(t => (
                  <button
                    key={t}
                    onClick={() => setResumeData(prev => ({ ...prev, template: t }))}
                    className={`px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                      resumeData.template === t ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-6 w-px bg-border flex-shrink-0" />

            {/* Color Picker */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Palette className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <div className="flex gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setResumeData(prev => ({ ...prev, themeColor: c }))}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      resumeData.themeColor === c ? 'border-foreground scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-border">
            <div className="hidden md:flex items-center gap-2 mr-4">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Zoom</span>
              <input 
                type="range" min="0.5" max="1" step="0.05" 
                value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button 
                onClick={handleDownload}
                disabled={isGenerating}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg text-[10px] sm:text-xs ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Download className={`w-4 h-4 ${isGenerating ? 'animate-bounce' : ''}`} />
                {isGenerating ? 'Saving...' : 'Get PDF'}
              </button>
              
              <div className="flex gap-2">
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
                  className="p-2.5 bg-muted text-muted-foreground rounded-xl hover:text-foreground transition-all"
                  title="Export JSON"
                >
                  <Layout className="w-4 h-4 rotate-90" />
                </button>
                <label className="p-2.5 bg-muted text-muted-foreground rounded-xl hover:text-foreground transition-all cursor-pointer" title="Import JSON">
                  <Eye className="w-4 h-4" />
                  <input type="file" className="hidden" accept=".json" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        try {
                          const json = JSON.parse(e.target?.result as string);
                          setResumeData(json);
                        } catch (err) { alert("Invalid JSON"); }
                      };
                      reader.readAsText(file);
                    }
                  }}/>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mobile View Toggle */}
        <div className="md:hidden flex bg-card border border-border rounded-2xl p-1 mb-6 no-print">
          <button 
            onClick={() => setView('edit')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${view === 'edit' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
          >
            <Edit3 className="w-4 h-4" /> Edit
          </button>
          <button 
            onClick={() => setView('preview')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${view === 'preview' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form Panel */}
          <div className={`${view === 'edit' ? 'block' : 'hidden md:block'} no-print`}>
            <ResumeForm />
          </div>

          {/* Preview Panel */}
          <div className={`${view === 'preview' ? 'block' : 'hidden md:block'} lg:sticky lg:top-36`}>
            <div className="flex justify-center overflow-auto pb-10 custom-scrollbar max-h-[calc(100vh-180px)]" style={{ scrollBehavior: 'smooth' }}>
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
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
