import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Upload, Loader2, Copy, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';

const PDFToText = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setText('');
    
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/tools/pdf-to-text`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setText(res.data.text);
    } catch (err: any) {
      const msg = err.response?.data?.details || err.response?.data?.error || 'Failed to process PDF.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          PDF to Text Converter <FileSearch className="w-8 h-8 text-primary" />
        </h1>
        <p className="text-muted-foreground">Extract clean text content from your PDF files instantly.</p>
      </div>

      <div className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
            file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer space-y-4 block">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold">{file ? file.name : 'Select a PDF file'}</p>
              <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
            </div>
          </label>

          {file && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleUpload}
              disabled={loading}
              className="mt-8 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Convert to Text'}
            </motion.button>
          )}
        </motion.div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {text && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl"
          >
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Extracted Content</span>
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
            <div className="p-8 max-h-[500px] overflow-y-auto bg-background/50">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{text}</pre>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PDFToText;
