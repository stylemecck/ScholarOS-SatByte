import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calculator, Save, Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';

interface Semester {
  id: number;
  sgpa: string;
  credits: string;
}

const CGPACalculator = () => {
  const { user } = useAuth();
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: 1, sgpa: '', credits: '' }
  ]);
  const [result, setResult] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const addSemester = () => {
    setSemesters([...semesters, { id: Date.now(), sgpa: '', credits: '' }]);
  };

  const removeSemester = (id: number) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== id));
    }
  };

  const handleInputChange = (id: number, field: keyof Semester, value: string) => {
    setSemesters(semesters.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const calculateCGPA = () => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    semesters.forEach(s => {
      const sgpa = parseFloat(s.sgpa);
      const credits = parseFloat(s.credits);
      if (!isNaN(sgpa) && !isNaN(credits)) {
        totalGradePoints += sgpa * credits;
        totalCredits += credits;
      }
    });

    if (totalCredits > 0) {
      setResult(parseFloat((totalGradePoints / totalCredits).toFixed(2)));
    }
  };

  const saveToProfile = async () => {
    if (!user) {
      alert('Please login to save results');
      return;
    }
    if (result === null) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tools/save-result', {
        toolName: 'CGPA Calculator',
        data: { semesters, result }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Result saved successfully!');
    } catch (err) {
      alert('Failed to save result');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">CGPA Calculator</h1>
        <p className="text-muted-foreground">Enter your SGPA and Credits for each semester to calculate your overall CGPA.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <AnimatePresence>
            {semesters.map((sem, index) => (
              <motion.div
                key={sem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  S{index + 1}
                </div>
                
                <div className="flex-grow grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">SGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 8.5"
                      value={sem.sgpa}
                      onChange={(e) => handleInputChange(sem.id, 'sgpa', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Credits</label>
                    <input
                      type="number"
                      placeholder="e.g. 20"
                      value={sem.credits}
                      onChange={(e) => handleInputChange(sem.id, 'credits', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={() => removeSemester(sem.id)}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={addSemester}
            className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Semester
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-primary text-primary-foreground rounded-3xl shadow-xl space-y-6 sticky top-24">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium opacity-80 uppercase tracking-widest">Your CGPA</p>
              <h2 className="text-6xl font-black">{result !== null ? result : '0.00'}</h2>
            </div>

            <div className="space-y-3">
              <button
                onClick={calculateCGPA}
                className="w-full py-3 bg-white text-primary rounded-xl font-bold shadow-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calculate Now
              </button>
              
              <button
                disabled={result === null || saving}
                onClick={saveToProfile}
                className="w-full py-3 bg-primary-foreground/10 border border-white/20 text-white rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save to Profile'}
              </button>
            </div>

            {result !== null && (
              <div className="pt-4 border-t border-white/10 text-center">
                <p className="text-xs opacity-70">Based on {semesters.length} semesters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CGPACalculator;
