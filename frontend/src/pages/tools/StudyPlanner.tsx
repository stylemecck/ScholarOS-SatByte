import { toast } from '../../lib/toast';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, CheckCircle2, Plus, 
  Trash2, Timer as TimerIcon, LayoutDashboard, 
  ChevronLeft, ChevronRight, Play, Pause, RotateCcw, 
  Flame, BookOpen, Target, Sparkles, Loader2, X
} from 'lucide-react';
import axios from 'axios';

interface Task {
  _id: string;
  subject: string;
  topic: string;
  duration: number;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  date: string;
}

const StudyPlanner = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'weekly' | 'timer'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiLoading, setAILoading] = useState(false);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const localTasks = JSON.parse(localStorage.getItem('study_tasks') || '[]');
        setTasks(localTasks);
        setLoading(false);
        return;
      }
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/study-planner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Restore pending AI data
    const pendingAIData = localStorage.getItem('pending_study_ai_data');
    if (pendingAIData) {
      localStorage.removeItem('pending_study_ai_data');
      setShowAIModal(true);
    }
  }, []);

  const addTask = async (taskData: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      const newTask = { ...taskData, _id: Date.now().toString(), completed: false };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem('study_tasks', JSON.stringify(updatedTasks));
      setShowAddModal(false);
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/study-planner/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) {
      const updatedTasks = tasks.map(t => t._id === taskId ? { ...t, completed } : t);
      setTasks(updatedTasks);
      localStorage.setItem('study_tasks', JSON.stringify(updatedTasks));
      return;
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/study-planner/tasks/${taskId}`, { completed }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      const updatedTasks = tasks.filter(t => t._id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem('study_tasks', JSON.stringify(updatedTasks));
      return;
    }
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/study-planner/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Study <span className="text-primary italic">Planner</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">SatByte Pro Suite</p>
        </div>
        <button 
          onClick={() => setShowAIModal(true)}
          className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary/20 transition-all border border-primary/20"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 space-y-8">
            <div className="flex flex-col gap-3">
               <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
               <NavButton active={activeTab === 'weekly'} onClick={() => setActiveTab('weekly')} icon={<Calendar className="w-5 h-5" />} label="Calendar" />
               <NavButton active={activeTab === 'timer'} onClick={() => setActiveTab('timer')} icon={<TimerIcon className="w-5 h-5" />} label="Focus Timer" />
            </div>
            
            <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[2.5rem] p-8 space-y-4">
              <div className="flex items-center gap-3 text-primary font-black uppercase tracking-widest text-xs">
                <Flame className="w-5 h-5" />
                <span>Active Streak</span>
              </div>
              <p className="text-4xl font-black tracking-tighter">3 <span className="text-lg opacity-40">Days</span></p>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">You're in the zone! Complete today's tasks to reach level 4.</p>
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div 
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-10"
                >
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                      <div className="relative">
                        <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                        </div>
                      </div>
                      <p className="font-black uppercase tracking-[0.3em] text-[10px] text-muted-foreground">Syncing academic cloud...</p>
                    </div>
                  ) : (
                    <>
                      {/* Premium Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                        <StatCard label="Progress" value={`${Math.round((tasks.filter(t => t.completed && new Date(t.date).toDateString() === new Date().toDateString()).length / (tasks.filter(t => new Date(t.date).toDateString() === new Date().toDateString()).length || 1)) * 100)}%`} icon={<Target className="w-5 h-5" />} />
                        <StatCard label="Focus" value={`${Math.round(tasks.reduce((acc, t) => acc + (t.completed ? t.duration : 0), 0) / 60)}h`} icon={<Clock className="w-5 h-5" />} />
                        <StatCard label="Completed" value={tasks.filter(t => t.completed).length.toString()} icon={<CheckCircle2 className="w-5 h-5" />} className="col-span-2 md:col-span-1" />
                      </div>

                      {/* Tasks Section */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                          <div>
                            <h2 className="text-2xl font-black tracking-tight">Today's Focus</h2>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <button 
                            onClick={() => setShowAddModal(true)}
                            className="p-4 bg-primary text-primary-foreground rounded-2xl hover:scale-110 transition-all shadow-xl shadow-primary/30"
                          >
                            <Plus className="w-6 h-6" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          {tasks.filter(t => new Date(t.date).toDateString() === new Date().toDateString()).length === 0 ? (
                            <div className="py-20 text-center flex flex-col items-center gap-6 bg-card/40 border border-dashed border-border rounded-[3rem]">
                              <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-muted-foreground/30" />
                              </div>
                              <p className="text-muted-foreground font-medium italic">Your schedule is clear. Ready to plan?</p>
                              <button 
                                onClick={() => setShowAddModal(true)}
                                className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                              >
                                Create First Task
                              </button>
                            </div>
                          ) : (
                            tasks.filter(t => new Date(t.date).toDateString() === new Date().toDateString()).map(task => (
                              <TaskItem key={task._id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {activeTab === 'timer' && (
                <motion.div 
                  key="timer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <PomodoroTimer />
                </motion.div>
              )}

              {activeTab === 'weekly' && (
                <motion.div 
                  key="weekly"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <WeeklyView tasks={tasks} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center justify-between shadow-2xl">
          <MobileNavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} label="Dash" />
          <MobileNavButton active={activeTab === 'weekly'} onClick={() => setActiveTab('weekly')} icon={<Calendar size={20} />} label="Cal" />
          <MobileNavButton active={activeTab === 'timer'} onClick={() => setActiveTab('timer')} icon={<TimerIcon size={20} />} label="Timer" />
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/40 transform active:scale-90 transition-transform"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Modals as Bottom Sheets on Mobile */}
      <BottomSheet isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Study Task">
        <AddTaskForm onAdd={addTask} />
      </BottomSheet>

      <BottomSheet isOpen={showAIModal} onClose={() => setShowAIModal(false)} title="AI Academic Weaver">
        <AIMagicForm 
          loading={aiLoading} 
          onGenerate={async (goal: string, hours: number) => {
            setAILoading(true);
            try {
              const token = localStorage.getItem('token');
              if (!token) {
                // Save state and redirect
                localStorage.setItem('pending_study_ai_data', JSON.stringify({ goal, hours }));
                window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                return;
              }
              const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/study-planner/ai-generate`, { goal, hoursPerDay: hours }, {
                headers: { Authorization: `Bearer ${token}` }
              });
              for (const task of response.data) {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/study-planner/tasks`, task, {
                  headers: { Authorization: `Bearer ${token}` }
                });
              }
              fetchTasks();
              setShowAIModal(false);
            } catch (err) {
              console.error(err);
              toast.error("Failed to generate AI plan. Please try again.");
            } finally {
              setAILoading(false);
            }
          }} 
        />
      </BottomSheet>
    </div>
  );
};

// --- Sub-Components ---

const BottomSheet = ({ isOpen, onClose, title, children }: any) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[70] bg-card border-t border-white/10 rounded-t-[3.5rem] p-8 pb-12 shadow-2xl max-w-2xl mx-auto"
        >
          <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl font-black tracking-tight">{title}</h3>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
          </div>
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-8 py-5 rounded-[2rem] font-bold transition-all ${
      active ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.05]' : 'hover:bg-white/5 text-muted-foreground'
    }`}
  >
    {icon}
    <span className="tracking-tight text-lg">{label}</span>
  </button>
);

const MobileNavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex-grow flex flex-col items-center justify-center py-2 transition-all ${
      active ? 'text-primary' : 'text-muted-foreground'
    }`}
  >
    {icon}
    <span className="text-[8px] font-black uppercase tracking-widest mt-1">{label}</span>
    {active && <motion.div layoutId="mobileNavDot" className="w-1 h-1 bg-primary rounded-full mt-1" />}
  </button>
);

const StatCard = ({ label, value, icon, className }: any) => (
  <div className={`bg-card border border-border p-8 rounded-[2.5rem] space-y-4 shadow-xl group hover:border-primary/20 transition-all ${className}`}>
    <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</p>
      <h3 className="text-3xl font-black tracking-tight">{value}</h3>
    </div>
  </div>
);

const TaskItem = ({ task, onToggle, onDelete }: any) => (
  <motion.div 
    layout
    className={`group flex items-center justify-between p-6 rounded-[2rem] border transition-all ${
    task.completed ? 'bg-muted/30 border-transparent opacity-40' : 'bg-card border-border hover:border-primary/30 shadow-xl'
  }`}>
    <div className="flex items-center gap-6">
      <button 
        onClick={() => onToggle(task._id, !task.completed)}
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed ? 'bg-primary border-primary text-primary-foreground' : 'border-border hover:border-primary/50'
        }`}
      >
        {task.completed && <CheckCircle2 className="w-5 h-5" />}
      </button>
      <div>
        <h4 className={`font-bold text-lg tracking-tight ${task.completed ? 'line-through' : ''}`}>{task.subject}</h4>
        <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
          <span className="flex items-center gap-1.5"><BookOpen size={12} /> {task.topic}</span>
          <span className="flex items-center gap-1.5"><Clock size={12} /> {task.duration}m</span>
          <span className={`px-2 py-0.5 rounded-lg border ${
            task.priority === 'High' ? 'border-rose-500/20 text-rose-500 bg-rose-500/5' :
            task.priority === 'Medium' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
            'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
          }`}>{task.priority}</span>
        </div>
      </div>
    </div>
    <button onClick={() => onDelete(task._id)} className="p-3 text-muted-foreground hover:text-rose-500 transition-colors">
      <Trash2 size={18} />
    </button>
  </motion.div>
);

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      const nextMode = mode === 'focus' ? 'break' : 'focus';
      setMode(nextMode);
      setTimeLeft(nextMode === 'focus' ? 25 * 60 : 5 * 60);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card border border-border rounded-[3.5rem] p-12 md:p-20 shadow-2xl text-center space-y-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-muted/20">
         <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(1 - timeLeft / (mode === 'focus' ? 25 * 60 : 5 * 60)) * 100}%` }}
         />
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-black uppercase tracking-widest">{mode === 'focus' ? 'Deep Work' : 'Refuel'}</h2>
        <div className="inline-flex bg-muted/50 p-1.5 rounded-2xl">
          <button onClick={() => { setMode('focus'); setTimeLeft(25 * 60); setIsActive(false); }} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'focus' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground'}`}>Focus</button>
          <button onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'break' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground'}`}>Break</button>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-7xl md:text-9xl font-black tracking-tighter tabular-nums">{formatTime(timeLeft)}</span>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-50">Remaining Units</p>
      </div>

      <div className="flex justify-center items-center gap-8">
        <button onClick={() => setIsActive(!isActive)} className="w-24 h-24 bg-primary text-primary-foreground rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 transition-all">
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
        </button>
        <button onClick={() => { setIsActive(false); setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60); }} className="w-16 h-16 bg-white/5 border border-white/5 rounded-full text-muted-foreground hover:bg-white/10 transition-all flex items-center justify-center">
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};

const WeeklyView = ({ tasks }: any) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black tracking-tight">Calendar</h2>
        <div className="flex gap-2">
          <button className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10"><ChevronLeft size={20} /></button>
          <button className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-6 gap-4 no-scrollbar snap-x">
        {days.map((day, idx) => {
          const date = new Date(today);
          date.setDate(today.getDate() - today.getDay() + idx);
          const dayTasks = tasks.filter((t: any) => new Date(t.date).toDateString() === date.toDateString());
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <div key={day} className={`min-w-[140px] flex-shrink-0 snap-center bg-card border p-8 rounded-[2.5rem] space-y-6 transition-all ${isToday ? 'border-primary ring-4 ring-primary/5 scale-105 shadow-2xl shadow-primary/10' : 'border-border'}`}>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{day}</p>
                <p className={`text-3xl font-black ${isToday ? 'text-primary' : ''}`}>{date.getDate()}</p>
              </div>
              <div className="space-y-2">
                {dayTasks.map((t: any) => (
                  <div key={t._id} className={`p-2 rounded-xl text-[9px] font-black uppercase tracking-tight text-center truncate ${t.completed ? 'bg-muted/50 text-muted-foreground' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                    {t.subject}
                  </div>
                ))}
                {dayTasks.length === 0 && <p className="text-[10px] text-muted-foreground/30 text-center italic font-bold">Clear</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AddTaskForm = ({ onAdd }: any) => {
  const [formData, setFormData] = useState({
    subject: '', topic: '', duration: 60, priority: 'Medium', date: new Date().toISOString().split('T')[0]
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input placeholder="Subject" className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 outline-none focus:ring-2 focus:ring-primary font-medium" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
        <input placeholder="Topic" className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 outline-none focus:ring-2 focus:ring-primary font-medium" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-muted-foreground ml-2">Duration (min)</label>
            <input type="number" className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 outline-none focus:ring-2 focus:ring-primary font-black" value={formData.duration} onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})} />
        </div>
        <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-muted-foreground ml-2">Priority</label>
            <select className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 outline-none focus:ring-2 focus:ring-primary font-black uppercase tracking-widest text-[10px]" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>
        </div>
      </div>
      <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-muted-foreground ml-2">Target Date</label>
          <input type="date" className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 outline-none focus:ring-2 focus:ring-primary font-black" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
      </div>
      <button onClick={() => onAdd(formData)} className="w-full py-5 bg-primary text-primary-foreground rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 mt-4">Schedule Session</button>
    </div>
  );
};

const AIMagicForm = ({ onGenerate, loading }: any) => {
  const [goal, setGoal] = useState('');
  const [hours, setHours] = useState(4);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Main Goal / Exam</label>
        <textarea 
          placeholder="e.g. Preparing for NIMCET in 3 months..."
          className="w-full px-6 py-5 rounded-[2rem] bg-white/5 border border-white/5 outline-none focus:ring-2 focus:ring-primary min-h-[140px] resize-none font-medium leading-relaxed"
          value={goal}
          onChange={e => setGoal(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Study Intensity</label>
            <span className="px-4 py-1 bg-primary/10 text-primary rounded-full font-black text-sm">{hours}h / day</span>
        </div>
        <input 
          type="range" min="1" max="12" step="1"
          className="w-full accent-primary h-2 bg-white/5 rounded-full appearance-none"
          value={hours}
          onChange={e => setHours(parseInt(e.target.value))}
        />
      </div>

      <button 
        onClick={() => onGenerate(goal, hours)}
        disabled={loading || !goal}
        className="w-full py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-xl shadow-xl shadow-primary/30 disabled:opacity-50 transition-all flex items-center justify-center gap-4"
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-6 h-6" /> Generate 7-Day Plan</>}
      </button>
      <p className="text-[9px] text-center text-muted-foreground font-black uppercase tracking-widest opacity-30">AI Weaver v3.0 Powered by SatByte AI</p>
    </div>
  );
};

export default StudyPlanner;
