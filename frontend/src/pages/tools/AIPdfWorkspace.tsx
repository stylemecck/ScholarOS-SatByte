import React, { useState, useEffect } from 'react';
import { 
  FileText, UploadCloud, Search, Star, Trash2, X,
  MessageSquare, Loader2, ArrowLeft, Highlighter, Moon, Sun, 
  Maximize2, Minimize2, BookOpen 
} from 'lucide-react';

import axios from 'axios';
import { toast } from '../../lib/toast';
import SEO from '../../components/SEO';

const AIPdfWorkspace: React.FC = () => {
  // Layout views: 'list' | 'viewer'
  const [viewState, setViewState] = useState<'list' | 'viewer'>('list');

  // Document states
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // OCR/Upload states
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Viewer options
  const [isDarkModeReader, setIsDarkModeReader] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'generate' | 'compare'>('chat');

  // Text selection/annotations
  const [selectedText, setSelectedText] = useState('');
  const [highlightColor, setHighlightColor] = useState('yellow');
  const [annotationComment, setAnnotationComment] = useState('');

  // Right pane actions
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Generated items states
  const [summaryData, setSummaryData] = useState<any | null>(null);
  const [flashcards, setFlashcards] = useState<any[] | string>([]);
  const [quizData, setQuizData] = useState<any[] | string>([]);
  const [citations, setCitations] = useState<any | null>(null);

  // Compare states
  const [compareDocId, setCompareDocId] = useState('');
  const [compareResult, setCompareResult] = useState('');
  const [compareLoading, setCompareLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/ai-pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai-pdf/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setDocuments(prev => [res.data, ...prev]);
      toast.success(`Successfully uploaded and parsed: ${file.name}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to upload/extract text');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDeleteDoc = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/ai-pdf/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(prev => prev.filter(d => d._id !== id));
      toast.success('Document deleted');
    } catch (err) {
      toast.error('Failed to delete document');
    }
  };

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/ai-pdf/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(prev => prev.map(d => d._id === id ? { ...d, isFavorite: res.data.isFavorite } : d));
      if (selectedDoc?._id === id) {
        setSelectedDoc((prev: any) => prev ? { ...prev, isFavorite: res.data.isFavorite } : null);
      }
    } catch (err) {
      toast.error('Failed to toggle favorite');
    }
  };

  const handleLaunchViewer = (doc: any) => {
    setSelectedDoc(doc);
    setChatHistory([]);
    setSummaryData(null);
    setFlashcards([]);
    setQuizData([]);
    setCitations(null);
    setCompareResult('');
    setCompareDocId('');
    setViewState('viewer');
  };

  const handleSendChatMsg = async () => {
    if (!chatInput.trim()) return;
    const textToSend = chatInput;
    setChatHistory(prev => [...prev, { sender: 'user', text: textToSend }]);
    setChatInput('');
    setAiLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai-pdf/chat`, {
        docId: selectedDoc._id,
        message: textToSend
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatHistory(prev => [...prev, { sender: 'assistant', text: res.data.answer }]);
    } catch (err) {
      toast.error('AI PDF analysis failed');
      setChatHistory(prev => prev.slice(0, -1));
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateFeatures = async (type: 'summary' | 'flashcards' | 'quiz' | 'citations') => {
    setAiLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai-pdf/features`, {
        docId: selectedDoc._id,
        type
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (type === 'summary') setSummaryData(res.data.result);
      if (type === 'flashcards') setFlashcards(res.data.result);
      if (type === 'quiz') setQuizData(res.data.result);
      if (type === 'citations') setCitations(res.data.result);
      
      toast.success(`Generated: ${type}`);
    } catch (err) {
      toast.error('AI feature compilation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleComparePDFs = async () => {
    if (!compareDocId) return;
    setCompareLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai-pdf/compare`, {
        docIdA: selectedDoc._id,
        docIdB: compareDocId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompareResult(res.data.comparison);
      toast.success('Comparative report generated');
    } catch (err) {
      toast.error('Comparison analysis failed');
    } finally {
      setCompareLoading(false);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      const text = selection.toString().trim();
      if (text.length > 3) {
        setSelectedText(text);
      }
    }
  };

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight === target.clientHeight) return;
    
    const scrollPercent = Math.round(
      (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100
    );
    
    if (scrollPercent > (selectedDoc?.readingProgress || 0)) {
      setSelectedDoc((prev: any) => prev ? { ...prev, readingProgress: scrollPercent } : null);
      
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${import.meta.env.VITE_API_URL}/api/ai-pdf/${selectedDoc._id}/progress`, {
          progress: scrollPercent
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to update progress", err);
      }
    }
  };

  const handleAddHighlight = async () => {
    if (!selectedText) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai-pdf/${selectedDoc._id}/annotation`, {
        page: 1,
        type: 'highlight',
        color: highlightColor,
        text: selectedText,
        comment: annotationComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedDoc(res.data);
      setSelectedText('');
      setAnnotationComment('');
      toast.success('Annotation saved');
    } catch (err) {
      toast.error('Failed to save highlight');
    }
  };

  const filteredDocs = documents.filter(d => d.fileName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <SEO 
        title="AI PDF Workspace – Document Analysis & Chat"
        description="Interact with multiple PDF documents simultaneously. Highlight definitions, extract text summaries, ask questions, and export annotated notes."
      />
      
      {/* 1. Documents File List Dashboard view */}
      {viewState === 'list' && (
        <div className="space-y-8">
          
          {/* Header */}
          <section className="relative text-center space-y-4 py-8 md:py-12 overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/60 backdrop-blur-xl">
            <div className="space-y-4 px-4 relative max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-black uppercase tracking-wider border border-border">
                <BookOpen className="w-3.5 h-3.5 text-primary" /> Document Workspace
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-foreground">
                AI <span className="text-primary italic">PDF Workspace</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto font-medium">
                Drag, drop, and group documents into folders. Highlight text definitions, query pages, compare contents side-by-side, or format citation references.
              </p>
            </div>
          </section>

          {/* Drag & Drop Upload Zone */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-10 rounded-[2rem] border-2 border-dashed text-center transition-all ${
              dragOver ? 'bg-primary/5 border-primary' : 'bg-[#111] border-white/5'
            }`}
          >
            {uploading ? (
              <div className="space-y-3">
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Parsing file content...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <UploadCloud className="w-12 h-12 text-zinc-500 mx-auto" />
                <div>
                  <label className="cursor-pointer text-sm font-black text-primary hover:underline">
                    Click to select file
                    <input 
                      type="file" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="hidden" 
                      accept=".pdf,.png,.jpg,.jpeg,.txt"
                    />
                  </label>
                  <p className="text-xs text-zinc-500 mt-1">or Drag and Drop PDFs, images, or TXT notes here</p>
                </div>
              </div>
            )}
          </div>

          {/* File grid listing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400">My Workspace Documents</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:border-primary text-zinc-300 placeholder-zinc-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <Loader2 className="w-8 h-8 text-zinc-600 animate-spin mx-auto" />
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="text-center py-10 bg-white/0 rounded-2xl border border-dashed border-white/5">
                <p className="text-xs text-zinc-600">No documents found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc._id}
                    onClick={() => handleLaunchViewer(doc)}
                    className="p-5 bg-[#111] border border-white/5 hover:border-primary/30 rounded-3xl cursor-pointer hover:bg-white/5 transition-all group flex flex-col justify-between h-44 relative"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <FileText className="w-8 h-8 text-primary" />
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => handleToggleFavorite(doc._id, e)}
                            className={`p-1.5 rounded-lg bg-[#1a1a1a] hover:text-white ${
                              doc.isFavorite ? 'text-primary' : 'text-zinc-500'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteDoc(doc._id, e)}
                            className="p-1.5 rounded-lg bg-[#1a1a1a] text-zinc-500 hover:text-rose-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate max-w-[200px]">{doc.fileName}</h4>
                    </div>

                    <div className="text-[10px] text-zinc-500 flex justify-between items-center border-t border-white/5 pt-3 mt-2">
                      <span>Type: {doc.fileType?.toUpperCase()}</span>
                      <span>Progress: {doc.readingProgress || 0}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 2. Document Reader / AI Split Workspace view */}
      {viewState === 'viewer' && selectedDoc && (
        <div className="space-y-6">
          
          {/* Top Bar control panel */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setViewState('list');
                  fetchDocuments();
                }}
                className="p-2.5 bg-[#111] border border-white/5 text-zinc-400 hover:text-white rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-sm font-black text-white">{selectedDoc.fileName}</h2>
                <p className="text-[10px] text-zinc-500">Workspace reader layout</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Light/Dark Reader style toggle */}
              <button 
                onClick={() => setIsDarkModeReader(!isDarkModeReader)}
                className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-white"
                title="Toggle reader theme"
              >
                {isDarkModeReader ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-white"
                title="Fullscreen focus mode"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Reader Split panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[70vh]">
            
            {/* Document view panel */}
            <div className={`lg:col-span-7 bg-[#111] border border-white/5 rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between ${
              isFullscreen ? 'lg:col-span-12' : 'lg:col-span-7'
            }`}>
              
              {/* Text canvas content */}
              <div 
                onMouseUp={handleTextSelection}
                onScroll={handleScroll}
                className={`flex-grow overflow-y-auto max-h-[500px] p-6 rounded-2xl border text-sm leading-relaxed whitespace-pre-wrap select-text custom-scrollbar ${
                  isDarkModeReader 
                    ? 'bg-[#0A0A0A] border-white/5 text-zinc-300' 
                    : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                }`}
              >
                {selectedDoc.textContent}
              </div>

              {/* Text highlight popovers */}
              {selectedText && (
                <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-4 space-y-3 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-black tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Highlighter className="w-3.5 h-3.5 text-primary" /> Highlight selected excerpt
                    </span>
                    <button onClick={() => setSelectedText('')} className="text-zinc-500 hover:text-white"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  
                  <div className="flex gap-2">
                    {['yellow', 'green', 'pink'].map(col => (
                      <button
                        key={col}
                        onClick={() => setHighlightColor(col)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          highlightColor === col ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: col === 'yellow' ? '#f59e0b' : col === 'green' ? '#10b981' : '#ec4899' }}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2 items-end">
                    <input 
                      type="text" 
                      placeholder="Add an annotation comment (optional)..."
                      value={annotationComment}
                      onChange={(e) => setAnnotationComment(e.target.value)}
                      className="flex-grow bg-white/5 border border-white/5 text-zinc-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary"
                    />
                    <button 
                      onClick={handleAddHighlight}
                      className="px-4 py-2 bg-primary text-zinc-950 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all"
                    >
                      Save annotation
                    </button>
                  </div>
                </div>
              )}

              {/* Highlights summaries log */}
              {selectedDoc.annotations?.length > 0 && (
                <div className="border-t border-white/5 pt-4 mt-4 space-y-3">
                  <strong className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Document Highlights</strong>
                  <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar">
                    {selectedDoc.annotations.map((ann: any, idx: number) => (
                      <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-zinc-400 space-y-1">
                        <p className="italic border-l-2 pl-2 border-primary" style={{ borderColor: ann.color === 'yellow' ? '#f59e0b' : ann.color === 'green' ? '#10b981' : '#ec4899' }}>
                          "{ann.text}"
                        </p>
                        {ann.comment && <p className="text-[10px] text-zinc-500 font-semibold">{ann.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* AI Control widgets workspace */}
            {!isFullscreen && (
              <div className="lg:col-span-5 bg-[#111] border border-white/5 rounded-[2.5rem] p-6 flex flex-col justify-between shadow-2xl">
                
                <div className="space-y-6">
                  {/* Tab controllers */}
                  <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    {(['chat', 'generate', 'compare'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                          activeTab === tab ? 'bg-primary text-zinc-950 shadow-md' : 'text-zinc-500 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* TAB 1: PDF CHAT */}
                  {activeTab === 'chat' && (
                    <div className="space-y-4">
                      
                      {/* Chat log */}
                      <div className="h-72 overflow-y-auto space-y-3 pr-1 custom-scrollbar text-xs">
                        {chatHistory.length === 0 ? (
                          <div className="text-center py-10 space-y-2 text-zinc-500">
                            <MessageSquare className="w-6 h-6 mx-auto animate-pulse" />
                            <p>Ask a question about this document context.</p>
                          </div>
                        ) : (
                          chatHistory.map((h, i) => (
                            <div key={i} className={`p-3 rounded-2xl leading-relaxed ${
                              h.sender === 'user' ? 'bg-primary/10 text-white ml-6 border border-primary/20' : 'bg-white/5 text-zinc-300 mr-6 border border-white/5'
                            }`}>
                              <strong className="block text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">
                                {h.sender === 'user' ? 'Student' : 'AI Assistant'}
                              </strong>
                              {h.text}
                            </div>
                          ))
                        )}
                        {aiLoading && (
                          <div className="flex space-x-1.5 items-center p-3 bg-white/5 rounded-2xl mr-6 animate-pulse">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                            <span className="text-[10px] text-zinc-500 font-bold">Analyzing file...</span>
                          </div>
                        )}
                      </div>

                      {/* Chat Input */}
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Ask details..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendChatMsg()}
                          className="flex-grow bg-white/5 border border-white/5 text-zinc-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary"
                        />
                        <button
                          onClick={handleSendChatMsg}
                          disabled={aiLoading || !chatInput.trim()}
                          className="px-4 py-2 bg-primary hover:bg-primary-hover text-zinc-950 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all"
                        >
                          Send
                        </button>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: AI FEATURES (summary, MCQs, citations) */}
                  {activeTab === 'generate' && (
                    <div className="space-y-4">
                      
                      <div className="grid grid-cols-2 gap-2.5">
                        <button 
                          onClick={() => handleGenerateFeatures('summary')}
                          className="p-3 bg-white/5 border border-white/5 hover:border-primary/30 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-white/10 text-zinc-300 transition-all text-center"
                        >
                          Generate Notes
                        </button>
                        <button 
                          onClick={() => handleGenerateFeatures('quiz')}
                          className="p-3 bg-white/5 border border-white/5 hover:border-primary/30 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-white/10 text-zinc-300 transition-all text-center"
                        >
                          Generate Quiz
                        </button>
                        <button 
                          onClick={() => handleGenerateFeatures('flashcards')}
                          className="p-3 bg-white/5 border border-white/5 hover:border-primary/30 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-white/10 text-zinc-300 transition-all text-center"
                        >
                          Get Flashcards
                        </button>
                        <button 
                          onClick={() => handleGenerateFeatures('citations')}
                          className="p-3 bg-white/5 border border-white/5 hover:border-primary/30 rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-white/10 text-zinc-300 transition-all text-center"
                        >
                          Citation Styles
                        </button>
                      </div>

                      {/* Display summaries/citations logs */}
                      <div className="max-h-56 overflow-y-auto custom-scrollbar text-xs text-zinc-400 space-y-4 pt-2">
                        
                        {summaryData && (
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                            <strong className="text-[9px] uppercase tracking-wider text-zinc-300 block">Structured Notes Summary</strong>
                            <p className="leading-relaxed">{summaryData}</p>
                          </div>
                        )}

                        {citations && (
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                            <strong className="text-[9px] uppercase tracking-wider text-zinc-300 block">Citation bibliography</strong>
                            <pre className="whitespace-pre-wrap font-sans leading-relaxed">{citations}</pre>
                          </div>
                        )}

                        {Array.isArray(flashcards) && flashcards.length > 0 && (
                          <div className="space-y-2">
                            <strong className="text-[9px] uppercase tracking-wider text-zinc-300 block">Generated Flashcards</strong>
                            {flashcards.map((fc, i) => (
                              <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
                                <p className="font-bold text-white">Q: {fc.question}</p>
                                <p className="text-[10px] text-zinc-500">A: {fc.answer}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {typeof flashcards === 'string' && flashcards.trim().length > 0 && (
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                            <strong className="text-[9px] uppercase tracking-wider text-zinc-300 block font-bold">Generated Flashcards (Raw Text)</strong>
                            <p className="leading-relaxed whitespace-pre-wrap">{flashcards}</p>
                          </div>
                        )}

                        {Array.isArray(quizData) && quizData.length > 0 && (
                          <div className="space-y-3">
                            <strong className="text-[9px] uppercase tracking-wider text-zinc-300 block">MCQ Practice Quiz</strong>
                            {quizData.map((q, i) => (
                              <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
                                <p className="font-bold text-white">{i+1}. {q.question}</p>
                                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                                  {q.options?.map((opt: string, oi: number) => (
                                    <span key={oi} className={`px-2 py-1 rounded bg-black/40 border border-white/5 ${
                                      q.correctIndex === oi ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : ''
                                    }`}>{opt}</span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {typeof quizData === 'string' && quizData.trim().length > 0 && (
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                            <strong className="text-[9px] uppercase tracking-wider text-zinc-300 block font-bold">MCQ Practice Quiz (Raw Text)</strong>
                            <p className="leading-relaxed whitespace-pre-wrap">{quizData}</p>
                          </div>
                        )}

                      </div>

                    </div>
                  )}

                  {/* TAB 3: COMPARE WORKSPACE */}
                  {activeTab === 'compare' && (
                    <div className="space-y-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Select Document to Compare</label>
                        <select
                          value={compareDocId}
                          onChange={(e) => setCompareDocId(e.target.value)}
                          className="w-full bg-[#1A1A1A] border border-white/5 text-zinc-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        >
                          <option value="">Choose second document...</option>
                          {documents.filter(d => d._id !== selectedDoc._id).map(d => (
                            <option key={d._id} value={d._id}>{d.fileName}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={handleComparePDFs}
                        disabled={compareLoading || !compareDocId}
                        className="w-full py-2.5 bg-primary hover:bg-primary-hover text-zinc-950 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
                      >
                        {compareLoading ? 'Analyzing differences...' : 'Compare Side-by-Side'}
                      </button>

                      {compareResult && (
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 max-h-56 overflow-y-auto custom-scrollbar text-xs text-zinc-400 leading-relaxed">
                          <strong className="text-[9px] uppercase tracking-widest text-zinc-300 block mb-1">AI Contrast Audit Report</strong>
                          <p className="whitespace-pre-wrap">{compareResult}</p>
                        </div>
                      )}

                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default AIPdfWorkspace;
