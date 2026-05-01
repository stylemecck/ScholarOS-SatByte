import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

const AttendanceCalculator = () => {
  const [present, setPresent] = useState<string>('');
  const [total, setTotal] = useState<string>('');
  const [target, setTarget] = useState<string>('75');

  const p = parseInt(present);
  const t = parseInt(total);
  const targetPct = parseInt(target);

  const currentPct = (p && t) ? (p / t * 100).toFixed(2) : '0';
  
  let recommendation = '';
  let status: 'good' | 'bad' | 'neutral' = 'neutral';
  let classesNeeded = 0;

  if (p && t && targetPct) {
    if (parseFloat(currentPct) >= targetPct) {
      status = 'good';
      // How many can I skip?
      // (p) / (t + x) = target / 100
      // p * 100 = target * (t + x)
      // (p * 100 / target) - t = x
      classesNeeded = Math.floor((p * 100 / targetPct) - t);
      recommendation = `You can skip the next ${classesNeeded} classes while staying above ${targetPct}%.`;
    } else {
      status = 'bad';
      // How many to attend?
      // (p + x) / (t + x) = target / 100
      // 100p + 100x = target * t + target * x
      // x(100 - target) = target * t - 100p
      // x = (target * t - 100p) / (100 - target)
      classesNeeded = Math.ceil((targetPct * t - 100 * p) / (100 - targetPct));
      recommendation = `You need to attend the next ${classesNeeded} classes to reach ${targetPct}%.`;
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Attendance Calculator</h1>
        <p className="text-muted-foreground">Plan your attendance to maintain your target percentage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border p-8 rounded-3xl shadow-xl space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Classes Attended</label>
              <input
                type="number"
                value={present}
                onChange={(e) => setPresent(e.target.value)}
                placeholder="e.g. 15"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Total Classes Conducted</label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="e.g. 20"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Target Percentage (%)</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="60">60%</option>
                <option value="65">65%</option>
                <option value="70">70%</option>
                <option value="75">75%</option>
                <option value="80">80%</option>
                <option value="85">85%</option>
                <option value="90">90%</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="bg-primary text-primary-foreground p-8 rounded-3xl shadow-xl text-center space-y-2">
            <p className="text-sm font-medium opacity-80 uppercase tracking-widest">Current Attendance</p>
            <h2 className="text-6xl font-black">{currentPct}%</h2>
          </div>

          <div className={`p-6 rounded-3xl border-2 flex gap-4 ${
            status === 'good' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 
            status === 'bad' ? 'bg-orange-500/10 border-orange-500/20 text-orange-600' : 
            'bg-card border-border text-muted-foreground'
          }`}>
            <div className="flex-shrink-0">
              {status === 'good' ? <CheckCircle2 className="w-6 h-6" /> : 
               status === 'bad' ? <XCircle className="w-6 h-6" /> : 
               <Info className="w-6 h-6" />}
            </div>
            <div>
              <p className="font-bold mb-1">
                {status === 'good' ? 'Safe Zone' : status === 'bad' ? 'Warning' : 'Input Required'}
              </p>
              <p className="text-sm leading-relaxed">
                {recommendation || 'Enter your details to see how many classes you need to attend or can skip.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AttendanceCalculator;
