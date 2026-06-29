import { toast } from '../../../lib/toast';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, Upload, Download, Loader2, 
  Settings, ShieldCheck, Zap, 
  ChevronRight, Layout, BarChart3, Target, X
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSettings } from '../../../context/SettingsContext';
import AdsterraAd from '../../../components/AdsterraAd';

const CompressImage = () => {
  const { settings } = useSettings();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(80);
  const [targetSize, setTargetSize] = useState<string>('');
  const [comparisonValue, setComparisonValue] = useState(50);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setCompressedSize(0);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality.toString());
    if (targetSize) formData.append('targetSize', targetSize);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/image/compress`, formData, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const blob = response.data;
      setCompressedSize(blob.size);
      const url = window.URL.createObjectURL(blob);
      setResult(url);
    } catch (err) {
      console.error('Compression error:', err);
      toast.error('Failed to compress image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-24 pb-32">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 px-4 text-center space-y-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20"
          >
            <Zap className="w-4 h-4" /> Professional Image Optimization
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white">
            Compress Images <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 italic pr-4">Without Quality Loss.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Fast, browser-based image compression optimized for students, creators, and developers. No files ever leave your device.
          </p>
        </div>
      </section>

      {/* HERO BANNER AD */}
      <div className="max-w-5xl mx-auto px-4">
        {settings.adsterraNativeBanner ? (
          <AdsterraAd type="native" code={settings.adsterraNativeBanner} />
        ) : (
          <div className="w-full h-24 saas-card border-dashed border-white/10 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/20">
            Sponsored Content Placement
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* 2. UPLOAD EXPERIENCE & COMPARISON */}
        <div className="lg:col-span-8 space-y-8">
          {!file ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const selectedFile = e.dataTransfer.files[0];
                  setFile(selectedFile);
                  setOriginalSize(selectedFile.size);
                  setPreview(URL.createObjectURL(selectedFile));
                }
              }}
              className="relative group cursor-pointer"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative aspect-[21/10] flex flex-col items-center justify-center saas-card border-dashed border-white/10 p-12 text-center group-hover:border-primary/50 transition-all">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Upload className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Drop your image here</h3>
                <p className="text-muted-foreground mt-2 font-medium">Supports PNG, JPG, WebP • Max 10MB</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden" 
                />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="saas-card relative overflow-hidden !p-0 aspect-[16/10] md:aspect-[21/10] group"
            >
              {/* COMPARISON SLIDER */}
              <div className="relative w-full h-full bg-black/40">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <ImageIcon className="w-32 h-32" />
                </div>
                
                {/* Original (Underneath) */}
                {preview && (
                  <div className="absolute inset-0">
                    <img src={preview} alt="original" className="w-full h-full object-contain" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-white tracking-widest border border-white/10">Original</div>
                  </div>
                )}

                {/* Compressed (Overlay) */}
                {result && (
                  <div 
                    className="absolute inset-0 overflow-hidden" 
                    style={{ clipPath: `inset(0 ${100 - comparisonValue}% 0 0)` }}
                  >
                    <img src={result} alt="compressed" className="w-full h-full object-contain" />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary/50 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-white tracking-widest border border-white/20">Optimized</div>
                  </div>
                )}

                {/* Slider Control */}
                {result && (
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-0 bottom-0 w-px bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ left: `${comparisonValue}%` }}>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-2xl pointer-events-auto cursor-ew-resize">
                         <div className="flex gap-0.5">
                            <div className="w-0.5 h-3 bg-black/20 rounded-full" />
                            <div className="w-0.5 h-3 bg-black/20 rounded-full" />
                         </div>
                      </div>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={comparisonValue} onChange={(e) => setComparisonValue(parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize pointer-events-auto"
                    />
                  </div>
                )}

                {/* Reset Button */}
                <button 
                  onClick={reset}
                  className="absolute top-4 left-1/2 -translate-x-1/2 p-2 bg-black/50 hover:bg-rose-500 rounded-full text-white backdrop-blur-md border border-white/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* INLINE CONTENT AD (Appears after upload or result) */}
          <div className="w-full">
            {settings.adsterraNativeBanner ? (
              <AdsterraAd type="native" code={settings.adsterraNativeBanner} />
            ) : (
              <div className="w-full h-32 saas-card bg-white/[0.02] border-white/5 flex items-center justify-center text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
                Premium Partner Placement
              </div>
            )}
          </div>

          {/* RESULTS DASHBOARD */}
          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="saas-card flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Original Size</span>
                  <div className="text-2xl font-black text-white">{formatSize(originalSize)}</div>
                </div>
                <div className="saas-card flex flex-col gap-2 border-primary/20">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Optimized Size</span>
                  <div className="text-2xl font-black text-white">{formatSize(compressedSize)}</div>
                </div>
                <div className="saas-card flex flex-col gap-2 bg-emerald-500/5 border-emerald-500/20">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Saved</span>
                  <div className="text-2xl font-black text-emerald-500">{((1 - (compressedSize / originalSize)) * 100).toFixed(1)}%</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. SIDEBAR CONTROLS & ADS */}
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
          <div className="saas-card space-y-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Compression Level</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Image Quality</label>
                  <span className="text-xs font-black text-primary">{quality}%</span>
                </div>
                <input 
                  type="range" min="1" max="100" 
                  value={quality} onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target Size (KB)</label>
                <div className="relative">
                  <input 
                    type="number" placeholder="Optional (e.g. 200)"
                    value={targetSize} onChange={(e) => setTargetSize(e.target.value)}
                    className="saas-input w-full pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground">KB</span>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                {!result ? (
                  <button
                    onClick={handleCompress}
                    disabled={!file || isProcessing}
                    className="w-full saas-button-primary !py-5 text-sm flex items-center justify-center gap-3"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                    {isProcessing ? 'Optimizing...' : 'Optimize Image'}
                  </button>
                ) : (
                  <a 
                    href={result} 
                    download={`optimized_${file?.name || 'image'}`}
                    className="w-full saas-button-primary !py-5 text-sm flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/20"
                  >
                    <Download className="w-5 h-5" /> Download Result
                  </a>
                )}
                
                {result && (
                  <button onClick={reset} className="w-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
                    Start New Image
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR AD (DESKTOP ONLY) */}
          <div className="hidden lg:block">
            {settings.adsterraNativeBanner ? (
              <AdsterraAd type="native" code={settings.adsterraNativeBanner} />
            ) : (
              <div className="w-full py-12 saas-card border-white/5 bg-white/[0.01] flex flex-col items-center gap-4">
                 <div className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 mb-2">Advertisement</div>
                 <div className="w-24 h-24 bg-white/5 rounded-2xl border border-dashed border-white/10" />
              </div>
            )}
          </div>

          <div className="saas-card !p-8 bg-primary/5 border-primary/10 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Privacy Protocol</h4>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
              Images are processed in your browser or through encrypted ephemeral cloud storage. No data is stored permanently.
            </p>
          </div>
        </div>
      </div>

      {/* 4. ECOSYSTEM RECOMMENDATION ADS */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-2">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50">Related OS Utilities</h3>
            <h2 className="text-3xl font-black text-white italic">Master your workflow.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { title: 'Resume Pro', desc: 'Build ATS-ready resumes designed for tech placements.', path: '/tools/resume-builder', icon: Layout },
                { title: 'Rank Predictor', desc: 'Accurate exam analytics and college roadmap generator.', path: '/tools/rank-predictor', icon: BarChart3 },
                { title: 'PDF Suite', desc: 'Merge, split, and optimize documents with precision.', path: '/tools/pdf/merge', icon: Target }
            ].map((tool, i) => (
                <Link key={i} to={tool.path} className="saas-card group hover:border-primary/50 transition-all">
                    <div className="flex flex-col gap-6">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                            <tool.icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-black text-white flex items-center gap-2">
                                {tool.title} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">{tool.desc}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </section>

      {/* 5. MOBILE ADS FOOTER */}
      <div className="lg:hidden px-4">
        {settings.adsterraNativeBanner ? (
          <AdsterraAd type="native" code={settings.adsterraNativeBanner} />
        ) : (
          <div className="w-full h-24 saas-card border-white/5 bg-white/[0.01] flex items-center justify-center text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">
            Mobile Optimized Partner Slot
          </div>
        )}
      </div>
    </div>
  );
};

export default CompressImage;
