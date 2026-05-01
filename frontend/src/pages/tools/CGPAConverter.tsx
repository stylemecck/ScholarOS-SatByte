import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Info } from 'lucide-react';

const CGPAConverter = () => {
  const [cgpa, setCgpa] = useState<string>('');
  const [percentage, setPercentage] = useState<string>('');

  const convertToPercentage = (val: string) => {
    setCgpa(val);
    if (val && !isNaN(parseFloat(val))) {
      setPercentage((parseFloat(val) * 9.5).toFixed(2));
    } else {
      setPercentage('');
    }
  };

  const convertToCgpa = (val: string) => {
    setPercentage(val);
    if (val && !isNaN(parseFloat(val))) {
      setCgpa((parseFloat(val) / 9.5).toFixed(2));
    } else {
      setCgpa('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">CGPA ↔ Percentage</h1>
        <p className="text-muted-foreground">Quickly convert your CGPA to percentage and vice-versa using the standard university formula (CGPA × 9.5).</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border p-8 rounded-3xl shadow-xl space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold ml-1">CGPA (10 Point Scale)</label>
            <input
              type="number"
              step="0.01"
              value={cgpa}
              onChange={(e) => convertToPercentage(e.target.value)}
              placeholder="e.g. 8.5"
              className="w-full px-6 py-4 rounded-2xl bg-background border border-border text-2xl font-bold text-center outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-muted text-muted-foreground">
              <RefreshCcw className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold ml-1">Percentage (%)</label>
            <input
              type="number"
              step="0.01"
              value={percentage}
              onChange={(e) => convertToCgpa(e.target.value)}
              placeholder="e.g. 80.75"
              className="w-full px-6 py-4 rounded-2xl bg-background border border-border text-2xl font-bold text-center outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-3 text-sm text-muted-foreground">
          <Info className="w-5 h-5 text-primary flex-shrink-0" />
          <p>
            Standard Formula used: <span className="font-bold text-foreground">Percentage = CGPA × 9.5</span>. 
            Note that some universities might use different conversion factors (like 10.0 or 9.0). Please check your mark sheet.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CGPAConverter;
