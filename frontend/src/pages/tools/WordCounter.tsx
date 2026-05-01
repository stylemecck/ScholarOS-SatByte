import { useState } from 'react';
import { motion } from 'framer-motion';
import { Type, Clock, Hash, AlignLeft } from 'lucide-react';

const WordCounter = () => {
  const [text, setText] = useState('');

  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const characters = text.length;
  const readingTime = Math.ceil(words / 200); // Average 200 wpm

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          Word Counter <Type className="w-8 h-8 text-primary" />
        </h1>
        <p className="text-muted-foreground">Get real-time statistics on your writing, including word count and reading time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <AlignLeft className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Words</p>
              <p className="text-2xl font-black">{words}</p>
            </div>
          </div>
          
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Characters</p>
              <p className="text-2xl font-black">{characters}</p>
            </div>
          </div>
          
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Read Time</p>
              <p className="text-2xl font-black">{readingTime} min</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden h-full"
          >
            <textarea
              className="w-full h-full min-h-[400px] p-8 bg-transparent outline-none resize-none text-lg leading-relaxed placeholder:text-muted-foreground/30"
              placeholder="Start typing or paste your content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WordCounter;
