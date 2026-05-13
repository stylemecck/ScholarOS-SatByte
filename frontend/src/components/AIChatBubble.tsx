import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot, User as UserIcon } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

const AIChatBubble = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'bot', content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = message.trim();
    setMessage('');
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tools/chat`, {
        message: userMsg,
        history: history.slice(-5) // Send last 5 messages for context
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setHistory(prev => [...prev, { role: 'bot', content: response.data.response }]);
    } catch (err) {
      setHistory(prev => [...prev, { role: 'bot', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[calc(100vw-3rem)] sm:w-[380px] md:w-[420px] h-[75vh] md:h-[600px] bg-background border border-white/[0.08] rounded-[2rem] md:rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="p-6 bg-primary text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-black text-sm uppercase tracking-widest leading-none">Study Buddy AI</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <p className="text-[9px] opacity-70 font-black uppercase tracking-widest">Active Insight Engine</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Content */}
            <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 custom-scrollbar bg-white/[0.01]">
              {history.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20">
                  <Sparkles className="w-16 h-16 text-primary" />
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.3em] leading-relaxed">
                      AI Assistant Ready
                    </p>
                    <p className="text-[10px] font-medium max-w-[200px] mx-auto">Ask me about exams, formulas, or how to use our tools!</p>
                  </div>
                </div>
              )}
              {history.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground'}`}>
                    {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-sm max-w-[80%] ${
                    msg.role === 'user' 
                    ? 'bg-primary/10 text-white border border-primary/20 rounded-tr-none' 
                    : 'bg-white/5 border border-white/5 text-muted-foreground rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center animate-pulse">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="bg-white/5 border border-white/5 p-4 rounded-[1.5rem] rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 md:p-6 bg-white/[0.02] border-t border-white/[0.08] flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={user ? "Type your message..." : "Please login to chat"}
                disabled={!user || loading}
                className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs font-medium focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30"
              />
              <button
                type="submit"
                disabled={!user || !message.trim() || loading}
                className="p-3.5 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 bg-primary text-white rounded-[1.2rem] md:rounded-[1.5rem] shadow-2xl shadow-primary/20 flex items-center justify-center relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare className="w-6 h-6 md:w-8 md:h-8" />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full animate-pulse" />
        )}
      </motion.button>
    </div>
  );
};

export default AIChatBubble;
