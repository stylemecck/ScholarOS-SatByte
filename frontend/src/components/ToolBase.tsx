import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Download, Loader2, Plus, Settings, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import AdsterraAd from './AdsterraAd';

interface ToolBaseProps {
  title: string;
  description: string;
  icon: any;
  accept: string;
  multiple?: boolean;
  endpoint: string;
  options?: React.ReactNode;
  getExtraData?: () => any;
  resultFilename?: string;
}

const ToolBase: React.FC<ToolBaseProps> = ({ 
  title, description, icon: Icon, accept, multiple = false, 
  endpoint, options, getExtraData, resultFilename = 'result.pdf' 
}) => {
  const { settings } = useSettings();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic SEO management
  useEffect(() => {
    document.title = `${title} - Student Toolkit Pro`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
      
      // Generate previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => multiple ? [...prev, ...newPreviews] : newPreviews);
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setResult(null);

    const formData = new FormData();
    if (multiple) {
      files.forEach(file => formData.append('files', file));
    } else {
      formData.append('file', files[0]);
    }

    if (getExtraData) {
      const extraData = getExtraData();
      Object.keys(extraData).forEach(key => formData.append(key, extraData[key]));
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, formData, {
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percentCompleted);
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setResult(url);
    } catch (err: any) {
      console.error('Processing error:', err);
      let errorMessage = 'Failed to process files. Please try again.';
      
      if (err.response?.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorObj = JSON.parse(reader.result as string);
            alert(errorObj.error || errorObj.details || errorMessage);
          } catch (e) {
            alert(errorMessage);
          }
        };
        reader.readAsText(err.response.data);
      } else {
        errorMessage = err.response?.data?.error || err.response?.data?.details || errorMessage;
        alert(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-12 px-4">
      <div className="text-center space-y-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex p-5 bg-primary/10 rounded-[2rem]"
        >
          <Icon className="w-14 h-14 text-primary" />
        </motion.div>
        <h1 className="text-5xl font-black tracking-tight uppercase leading-none">{title}</h1>
        <p className="text-muted-foreground max-w-xl mx-auto font-medium text-lg leading-relaxed">{description}</p>
      </div>

      {/* Top Ad Slot */}
      {settings.adsterraNativeBanner ? (
        <AdsterraAd type="native" code={settings.adsterraNativeBanner} />
      ) : (
        <div className="w-full h-24 bg-white/5 border border-dashed border-white/10 rounded-3xl flex items-center justify-center text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30">
          Advertisement Placeholder
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-8">
          {/* Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFiles = Array.from(e.dataTransfer.files);
              setFiles(prev => multiple ? [...prev, ...droppedFiles] : droppedFiles);
              const newPreviews = droppedFiles.map(file => URL.createObjectURL(file));
              setPreviews(prev => multiple ? [...prev, ...newPreviews] : newPreviews);
            }}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-primary via-indigo-500 to-amber-500 rounded-[3rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative aspect-[21/9] flex flex-col items-center justify-center border-2 border-dashed border-white/10 bg-card/40 backdrop-blur-3xl rounded-[3rem] p-12 text-center group-hover:border-primary/50 transition-all border-spacing-4">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              <p className="text-2xl font-black uppercase tracking-tight">Drop your files here</p>
              <p className="text-muted-foreground mt-2 font-medium">or click to select from your device</p>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={accept}
                multiple={multiple}
                className="hidden" 
              />
            </div>
          </div>

          {/* Previews Grid */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {files.map((file, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-[3/4] bg-white/5 rounded-3xl overflow-hidden border border-white/10 group/file"
                  >
                    {file.type.startsWith('image/') ? (
                      <img src={previews[idx]} alt="preview" className="w-full h-full object-cover opacity-60 group-hover/file:opacity-100 transition-opacity" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4">
                        <FileText className="w-12 h-12 text-primary mb-3 opacity-40" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-center truncate w-full">{file.name}</p>
                      </div>
                    )}
                    <button 
                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                        className="absolute top-3 right-3 p-2 bg-rose-500/80 text-white rounded-xl backdrop-blur-md opacity-0 group-hover/file:opacity-100 transition-all hover:bg-rose-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-[9px] font-black text-white uppercase tracking-tighter">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </motion.div>
                ))}
                {multiple && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-[3/4] border-2 border-dashed border-white/5 rounded-3xl text-muted-foreground hover:text-primary hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add More</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <div className="bg-card/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 space-y-8 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Tool Options</h3>
            </div>
            
            <div className="min-h-[100px]">
                {options ? options : (
                <div className="text-center py-4">
                    <p className="text-xs text-muted-foreground font-medium opacity-50 italic">No extra options for this tool.</p>
                </div>
                )}
            </div>

            <div className="space-y-4">
                <button
                onClick={handleProcess}
                disabled={files.length === 0 || isProcessing}
                className="w-full py-5 bg-primary text-primary-foreground rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-3"
                >
                {isProcessing ? (
                    <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {progress < 100 ? `${progress}%` : 'Processing...'}
                    </>
                ) : (
                    'Process Now'
                )}
                </button>

                {result && (
                <a 
                    href={result} 
                    download={resultFilename}
                    className="w-full py-5 bg-amber-500 text-amber-950 rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 animate-pulse"
                >
                    <Download className="w-5 h-5" />
                    Download
                </a>
                )}
            </div>
          </div>

          {/* Sidebar Ad Slot */}
          {settings.adsterraNativeBanner ? (
            <AdsterraAd type="native" code={settings.adsterraNativeBanner} />
          ) : (
            <div className="w-full aspect-square bg-white/5 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center p-8 space-y-2">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/70">Sponsored</p>
              <div className="w-12 h-12 bg-white/5 rounded-2xl" />
            </div>
          )}

          <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-8 space-y-3">
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Secure Processing</h4>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
              Your files are encrypted during transit and deleted automatically from our cloud after processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolBase;

