import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Download, Loader2, Plus, Settings } from 'lucide-react';
import axios from 'axios';

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
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
    } catch (err) {
      console.error('Processing error:', err);
      alert('Failed to process files. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10 px-4">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-primary/10 rounded-3xl">
          <Icon className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-black tracking-tight">{title}</h1>
        <p className="text-muted-foreground max-w-xl mx-auto font-medium">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const droppedFiles = Array.from(e.dataTransfer.files);
              setFiles(prev => multiple ? [...prev, ...droppedFiles] : droppedFiles);
            }}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-amber-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative aspect-video flex flex-col items-center justify-center border-2 border-dashed border-white/10 bg-card/50 backdrop-blur-xl rounded-[2.5rem] p-12 text-center group-hover:border-primary/50 transition-all">
              <Upload className="w-16 h-16 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-xl font-bold">Drop your files here</p>
              <p className="text-muted-foreground mt-2">or click to browse from device</p>
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

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button onClick={() => removeFile(idx)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
                {multiple && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all flex items-center justify-center gap-2 font-bold"
                  >
                    <Plus className="w-4 h-4" /> Add More Files
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Options</h3>
            </div>
            
            {options ? options : (
              <div className="text-center py-8">
                <p className="text-xs text-muted-foreground font-medium">No extra options for this tool.</p>
              </div>
            )}

            <button
              onClick={handleProcess}
              disabled={files.length === 0 || isProcessing}
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {progress < 100 ? `Uploading ${progress}%` : 'Processing...'}
                </>
              ) : (
                'Process Now'
              )}
            </button>

            {result && (
              <a 
                href={result} 
                download={resultFilename}
                className="w-full py-4 bg-amber-500 text-amber-950 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5" />
                Download Result
              </a>
            )}
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Pro Tip</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Files are processed securely and deleted automatically from our servers after 1 hour.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolBase;
