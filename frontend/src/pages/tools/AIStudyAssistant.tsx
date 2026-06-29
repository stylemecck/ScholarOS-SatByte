import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, Trash2, Folder, Edit3, Plus, 
  BookOpen, Code, HelpCircle, GraduationCap, Flame, Search, 
  Mic, MicOff, Volume2, VolumeX, Paperclip, Loader2,
  FileText, BarChart
} from 'lucide-react';

import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import { toast } from '../../lib/toast';
import SEO from '../../components/SEO';

// Simple Markdown + LaTeX Math Formula renderer in React
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  // Simple parser logic for headers, bold, bullet lists, code blocks, math equations, tables
  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLanguage = '';

  const parsedJSX: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        inCodeBlock = false;
        const codeText = codeContent.join('\n');
        parsedJSX.push(
          <div key={`code-${index}`} className="my-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] font-mono text-xs text-zinc-300">
            <div className="flex items-center justify-between bg-white/5 px-4 py-2 text-[10px] uppercase tracking-wider text-zinc-500">
              <span>{codeLanguage || 'code'}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(codeText);
                  toast.success('Code copied to clipboard');
                }}
                className="hover:text-white transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="p-4 overflow-x-auto"><code>{codeText}</code></pre>
          </div>
        );
        codeContent = [];
      } else {
        // Start code block
        inCodeBlock = true;
        codeLanguage = line.replace('```', '').trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    const trimmed = line.trim();

    // Headers
    if (trimmed.startsWith('# ')) {
      parsedJSX.push(<h1 key={index} className="text-2xl font-black tracking-tight text-white mt-6 mb-3">{trimmed.substring(2)}</h1>);
      return;
    }
    if (trimmed.startsWith('## ')) {
      parsedJSX.push(<h2 key={index} className="text-xl font-bold tracking-tight text-white mt-5 mb-2">{trimmed.substring(3)}</h2>);
      return;
    }
    if (trimmed.startsWith('### ')) {
      parsedJSX.push(<h3 key={index} className="text-lg font-bold text-white mt-4 mb-2">{trimmed.substring(4)}</h3>);
      return;
    }

    // Bullet lists
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      parsedJSX.push(
        <ul key={index} className="list-disc pl-6 my-2 space-y-1 text-sm text-zinc-300">
          <li>{parseInlineFormatting(trimmed.substring(2))}</li>
        </ul>
      );
      return;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(trimmed)) {
      const parts = trimmed.split(/^\d+\.\s/);
      parsedJSX.push(
        <ol key={index} className="list-decimal pl-6 my-2 space-y-1 text-sm text-zinc-300">
          <li>{parseInlineFormatting(parts[1])}</li>
        </ol>
      );
      return;
    }

    // Blockquotes
    if (trimmed.startsWith('> ')) {
      parsedJSX.push(
        <blockquote key={index} className="border-l-4 border-primary bg-white/5 pl-4 py-2 pr-2 my-4 rounded-r-xl text-sm italic text-zinc-300">
          {parseInlineFormatting(trimmed.substring(2))}
        </blockquote>
      );
      return;
    }

    // Table rows check (simple preview)
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && !trimmed.includes('---')) {
      const cols = trimmed.split('|').filter(c => c).map(c => c.trim());
      parsedJSX.push(
        <div key={index} className="overflow-x-auto my-3">
          <table className="min-w-full border-collapse border border-white/10 text-xs rounded-xl overflow-hidden bg-white/5">
            <tbody>
              <tr className="border-b border-white/10">
                {cols.map((col, idx) => (
                  <td key={idx} className="p-3 text-zinc-300 font-medium">{parseInlineFormatting(col)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      );
      return;
    }

    // Standard paragraphs
    if (trimmed.length > 0) {
      parsedJSX.push(<p key={index} className="my-2 text-sm leading-relaxed text-zinc-300">{parseInlineFormatting(trimmed)}</p>);
    } else {
      parsedJSX.push(<div key={index} className="h-2" />);
    }
  });

  return <div className="space-y-1">{parsedJSX}</div>;
};

// Parse bold, code span, math markers
const parseInlineFormatting = (text: string) => {
  if (!text) return '';
  const tempText = text;

  // A basic string replacement map for demo formatting
  const parts = tempText.split(/(\*\*.*?\*\*|\$.*?\$|`.*?`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-black text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      return <span key={idx} className="font-mono bg-zinc-900 border border-white/5 text-primary px-1.5 py-0.5 rounded text-xs italic">{part.slice(1, -1)}</span>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx} className="font-mono bg-white/5 text-zinc-300 px-1 py-0.5 rounded text-xs">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const chatModes = [
  { name: 'Explain Topic', icon: BookOpen, desc: 'Detailed concepts with analogies' },
  { name: 'Solve Doubt', icon: HelpCircle, desc: 'Step-by-step doubt resolution' },
  { name: 'Homework Helper', icon: GraduationCap, desc: 'Logic guides and solutions' },
  { name: 'Exam Preparation', icon: Flame, desc: 'Crucial terms and practice focus' },
  { name: 'Concept Simplifier', icon: Sparkles, desc: 'Simple explanations (ELI5)' },
  { name: 'Research Assistant', icon: FileText, desc: 'Citations and structural insights' },
  { name: 'Coding Mentor', icon: Code, desc: 'Commented scripts and debugging' },
  { name: 'Revision Mode', icon: BarChart, desc: 'Key cheatsheets and check questions' }
];

const smartActions = [
  { name: 'Summarize', label: 'Summarize text' },
  { name: 'Expand', label: 'Elaborate topic' },
  { name: 'Convert to Notes', label: 'Convert to notes' },
  { name: 'Generate Quiz', label: 'Generate MCQ Quiz' },
  { name: 'Generate Mindmap', label: 'Mindmap layout' }
];

const AIStudyAssistant: React.FC = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [activeMode, setActiveMode] = useState<string>('Explain Topic');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Loading and Speech States
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Folder states (reserved for future folder creation modal)
  const [_newFolderName, _setNewFolderName] = useState('');
  const [_isFolderModalOpen, _setIsFolderModalOpen] = useState(false);
  void _newFolderName; void _setNewFolderName; void _isFolderModalOpen; void _setIsFolderModalOpen;
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load chat sessions on mount
  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Audio recognition setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsRecording(true);
      rec.onend = () => setIsRecording(false);
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setInputText(prev => prev + ' ' + text);
        toast.success('Speech recorded successfully');
      };
      rec.onerror = (err: any) => {
        console.error(err);
        setIsRecording(false);
      };
      recognitionRef.current = rec;
    }
  }, []);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(res.data);
      if (res.data.length > 0 && !currentChatId) {
        loadChat(res.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadChat = async (id: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentChatId(id);
      setMessages(res.data.messages || []);
      setActiveMode(res.data.mode || 'Explain Topic');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewSession = async (title = 'New Study Session') => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chats`, {
        title,
        mode: activeMode
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(prev => [res.data, ...prev]);
      setCurrentChatId(res.data._id);
      setMessages([]);
      toast.success('New session created');
    } catch (err) {
      toast.error('Failed to create new study session');
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    let chatId = currentChatId;
    const token = localStorage.getItem('token');

    // Create session automatically if none exists
    if (!chatId) {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chats`, {
          title: textToSend.substring(0, 30) + '...',
          mode: activeMode
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        chatId = res.data._id;
        setCurrentChatId(chatId);
        setChats(prev => [res.data, ...prev]);
      } catch (err) {
        toast.error('Failed to initialize session');
        return;
      }
    }

    // Append user message local state optimistically
    const localUserMsg = { sender: 'user', text: textToSend, mode: activeMode, timestamp: new Date() };
    setMessages(prev => [...prev, localUserMsg]);
    if (!customText) setInputText('');
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}/messages`, {
        text: textToSend,
        mode: activeMode
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update messages with full array returned
      setMessages(res.data.chat.messages);
      
      // Update history timestamps & modes
      setChats(prev => prev.map(c => c._id === chatId ? { ...c, messages: res.data.chat.messages, mode: activeMode, updatedAt: new Date() } : c));

      // Trigger Text-to-Speech if enabled
      if (ttsEnabled) {
        speakText(res.data.reply);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to complete generation');
      // Remove local message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this study session?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/chats/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(prev => prev.filter(c => c._id !== id));
      if (currentChatId === id) {
        setMessages([]);
        setCurrentChatId('');
      }
      toast.success('Session deleted');
    } catch (err) {
      toast.error('Failed to delete session');
    }
  };

  const handleRenameSession = async (id: string, currentTitle: string) => {
    const newTitle = prompt('Rename Study Session:', currentTitle);
    if (!newTitle || newTitle.trim() === '') return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/chats/${id}/rename`, {
        title: newTitle
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(prev => prev.map(c => c._id === id ? { ...c, title: res.data.title } : c));
      toast.success('Renamed session');
    } catch (err) {
      toast.error('Rename failed');
    }
  };

  const handleSmartAction = (actionName: string) => {
    if (messages.length === 0) {
      toast.error('Start typing or add text to run actions.');
      return;
    }
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.sender !== 'assistant') {
      toast.error('smart actions run on the AI response.');
      return;
    }

    const commandText = `Please ${actionName.toLowerCase()} this last point: \n"${lastMsg.text}"`;
    handleSendMessage(commandText);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const speakText = (text: string) => {
    // Remove markdown symbols from speech
    const cleanText = text.replace(/[*#`$-|]/g, '').substring(0, 400); // chunk to avoid lock
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.cancel(); // stop current speech
    window.speechSynthesis.speak(utterance);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      // Upload to document parsing pipeline
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai-pdf/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });

      toast.success(`Extracted text from ${file.name}`);
      setInputText(prev => prev + `\n[Reference File: ${res.data.fileName}]\nExtracted Content:\n${res.data.textContent.substring(0, 1000)}...`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to upload/parse file');
    } finally {
      setUploading(false);
    }
  };

  // Group chats by folder or folder names
  const filteredChats = chats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-[82vh] max-w-7xl mx-auto rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-2xl relative">
      <SEO 
        title="AI Study Assistant – Smart Workspace"
        description="Interact with Gemini AI to ask questions, solve homework, write summaries, parse PDF uploads, and generate study material."
      />
      
      {/* Sidebar: Chats List */}
      <aside className="w-80 border-r border-border/50 flex flex-col bg-muted/30">
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Workspace Sessions
            </h2>
            <button 
              onClick={() => handleStartNewSession()}
              className="p-2 bg-primary/10 hover:bg-primary/20 text-primary hover:text-white rounded-xl border border-primary/20 transition-all"
              title="New Session"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white/5 border border-white/5 rounded-2xl text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Sessions Scroll List */}
        <div className="flex-grow overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {historyLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <Loader2 className="w-6 h-6 text-zinc-600 animate-spin" />
              <p className="text-[10px] uppercase font-black tracking-widest text-zinc-600">Retrieving chats...</p>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xs text-zinc-600">No chats found.</p>
            </div>
          ) : (
            filteredChats.map((c) => (
              <div 
                key={c._id}
                onClick={() => loadChat(c._id)}
                className={`group flex items-center justify-between p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  currentChatId === c._id 
                    ? 'bg-primary/10 border-primary/30 text-white shadow-lg' 
                    : 'bg-white/0 border-transparent text-zinc-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Folder className="w-4 h-4 text-primary/70 shrink-0" />
                  <span className="text-xs font-semibold truncate block max-w-[140px]">{c.title}</span>
                </div>
                
                {/* Actions inside list hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRenameSession(c._id, c.title); }}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteSession(c._id, e)}
                    className="p-1 text-zinc-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Usage status footer */}
        <div className="p-4 border-t border-white/5 text-[10px] text-zinc-500 font-bold bg-white/5 flex items-center justify-between">
          <span>Plan: <span className="text-primary uppercase">{user?.plan || 'Free'}</span></span>
          <span>{user?.plan === 'Free' ? '20 Messages / day limit' : 'Unlimited'}</span>
        </div>
      </aside>

      {/* Main Panel: Chat Window */}
      <section className="flex-grow flex flex-col bg-muted/10 relative">
        
        {/* Chat Top Header Controls */}
        <header className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-muted/40">
          <div className="space-y-1">
            <h1 className="text-sm font-black text-foreground">
              {chats.find(c => c._id === currentChatId)?.title || 'AI Workspace Session'}
            </h1>
            <p className="text-[10px] text-zinc-500">Workspace mode: {activeMode}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Mode selection dropdown */}
            <select
              value={activeMode}
              onChange={(e) => {
                setActiveMode(e.target.value);
                toast.success(`Mode changed to: ${e.target.value}`);
              }}
              className="text-xs bg-[#151515] border border-white/5 text-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-primary transition-all font-semibold"
            >
              {chatModes.map(m => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>

            {/* TTS Audio toggle */}
            <button
              onClick={() => {
                setTtsEnabled(!ttsEnabled);
                toast.success(ttsEnabled ? 'Text-to-speech disabled' : 'Text-to-speech enabled');
              }}
              className={`p-2.5 rounded-xl border transition-all ${
                ttsEnabled ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/5 text-zinc-500'
              }`}
              title="Toggle Speak Responses"
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Message Panel Scroll list */}
        <div className="flex-grow overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 text-center max-w-lg mx-auto">
              <div className="p-4 bg-primary/10 rounded-full border border-primary/20">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">Start Your Learning Session</h3>
                <p className="text-xs text-zinc-500">
                  Select a specialization mode like Concept Simplifier, Coding Mentor, or Exam Prep. Ask doubts, upload PDF lecture slides, or type study guides!
                </p>
              </div>

              {/* Mode list quick suggestions */}
              <div className="grid grid-cols-2 gap-3 w-full pt-4">
                {chatModes.slice(0, 4).map(m => (
                  <button 
                    key={m.name}
                    onClick={() => {
                      setActiveMode(m.name);
                      handleStartNewSession(`Study: ${m.name}`);
                    }}
                    className="p-3 bg-white/5 border border-white/5 hover:border-primary/30 rounded-2xl text-left hover:bg-white/10 transition-all text-xs"
                  >
                    <span className="block font-bold text-white mb-0.5">{m.name}</span>
                    <span className="block text-[10px] text-zinc-500">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold mb-1 uppercase tracking-wider px-2">
                    {m.sender === 'user' ? 'Student' : 'Assistant'} • {m.mode || activeMode}
                  </div>
                  <div 
                    className={`max-w-[85%] rounded-[1.8rem] px-5 py-4 shadow-xl leading-relaxed text-sm ${
                      m.sender === 'user' 
                        ? 'bg-primary text-zinc-950 font-semibold' 
                        : 'bg-white/5 border border-white/5 text-zinc-200 backdrop-blur-md'
                    }`}
                  >
                    {m.sender === 'user' ? (
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    ) : (
                      <MarkdownRenderer content={m.text} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {loading && (
            <div className="flex items-start space-y-1">
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-zinc-600 font-bold mb-1 uppercase px-2">AI Copilot</span>
                <div className="bg-white/5 border border-white/5 rounded-[1.8rem] px-6 py-4 flex items-center gap-3">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce delay-200" />
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce delay-300" />
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">Formulating explanation...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input workspace controls footer */}
        <footer className="p-6 border-t border-border/50 bg-muted/40 space-y-4">
          
          {/* Smart actions quick buttons */}
          {messages.length > 0 && messages[messages.length - 1].sender === 'assistant' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <span className="text-[9px] uppercase tracking-wider font-black text-zinc-500 mr-2 shrink-0">Smart Actions:</span>
              {smartActions.map(a => (
                <button
                  key={a.name}
                  onClick={() => handleSmartAction(a.name)}
                  className="px-3.5 py-1.5 bg-white/5 hover:bg-primary hover:text-zinc-950 rounded-full border border-white/5 hover:border-transparent text-[10px] font-black uppercase tracking-wider text-zinc-400 transition-all shrink-0"
                >
                  {a.name}
                </button>
              ))}
            </div>
          )}

          {/* Form prompts write box */}
          <div className="flex items-end gap-3 bg-[#111] rounded-3xl p-3 border border-white/5 focus-within:border-primary/40 transition-all">
            
            {/* Upload media button */}
            <label className="p-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-2xl cursor-pointer transition-all shrink-0">
              <Paperclip className="w-4 h-4" />
              <input 
                type="file" 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".pdf,.png,.jpg,.jpeg,.txt"
              />
            </label>

            <textarea
              placeholder="Ask a doubt, solve math formulas, or write coding templates..."
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-grow bg-transparent text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none resize-none max-h-36 pt-2"
            />

            {/* Voice Input button */}
            <button
              onClick={toggleRecording}
              className={`p-3 rounded-2xl transition-all shrink-0 ${
                isRecording ? 'bg-rose-500/20 text-rose-500 animate-pulse border border-rose-500/30' : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
              title="Voice Input"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || uploading || !inputText.trim()}
              className="p-3 bg-primary hover:bg-primary-hover text-zinc-950 rounded-2xl transition-all disabled:opacity-30 disabled:hover:bg-primary shrink-0"
            >
              {uploading || loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>

          </div>
        </footer>

      </section>

    </div>
  );
};

export default AIStudyAssistant;
