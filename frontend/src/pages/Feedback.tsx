import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Send, ThumbsUp, Sparkles, Heart } from 'lucide-react';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-primary/20">
            <Heart className="w-12 h-12 fill-primary" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter uppercase">Thank You!</h1>
            <p className="text-muted-foreground text-xl font-medium max-w-lg mx-auto leading-relaxed">
              Your feedback is the fuel that drives SatByte forward. We appreciate your time and insights!
            </p>
          </div>
          <button 
            onClick={() => setSubmitted(false)}
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
          >
            Send More Feedback
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 space-y-16">
      <div className="text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex p-4 bg-primary/5 text-primary rounded-[1.5rem] mb-6"
        >
          <MessageSquare className="w-12 h-12" />
        </motion.div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
          Share Your <span className="text-primary italic">Voice</span>
        </h1>
        <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto leading-relaxed">
          Help us build the ultimate toolkit for students. Every piece of feedback helps us improve our AI models and user experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-[3.5rem] p-10 md:p-14 space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles className="w-32 h-32" />
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Rate your experience</label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="group transition-all"
                  >
                    <Star 
                      className={`w-10 h-10 transition-all ${
                        (hoverRating || rating) >= star 
                        ? 'fill-primary text-primary scale-110' 
                        : 'text-muted-foreground/20 group-hover:text-primary/40'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">What's on your mind?</label>
              <textarea 
                required
                placeholder="Tell us about your experience, report a bug, or suggest a new feature..."
                className="w-full h-48 bg-white/5 border border-white/5 rounded-[2rem] p-8 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30 resize-none"
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-6 bg-primary text-primary-foreground rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <ThumbsUp className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest">Why Feedback Matters</h4>
            </div>
            <ul className="space-y-4">
              {[
                "We prioritize features based on user requests.",
                "Bug reports help us maintain 99.9% uptime.",
                "Direct influence on AI model training.",
                "Early access to beta tools for contributors."
              ].map((text, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs font-medium text-muted-foreground leading-relaxed">{text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2.5rem] text-center space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Join our Discord</h4>
             <p className="text-[10px] font-medium leading-relaxed text-muted-foreground">
                Want to chat directly with the developers and other students? Join our growing community!
             </p>
             <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10">
                Join Community
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
