import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, CheckCircle2, Circle, Plus, 
  Trash2, Timer as TimerIcon, LayoutDashboard, 
  ChevronLeft, ChevronRight, Play, Pause, RotateCcw, 
  Flame, BookOpen, Target, Sparkles, Loader2
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

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Load from localStorage for guests
        const localTasks = JSON.parse(localStorage.getItem('study_tasks') || '[]');
        setTasks(localTasks);
        setLoading(false);
        return;
      }
      const response = await axios.get('${import.meta.env.VITE_API_URL}/api/study-planner', {
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
      await axios.post('${import.meta.env.VITE_API_URL}/api/study-planner/tasks', taskData, {
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
    <div className="max-w-7xl mx-auto py-8 px-4 lg:px-8 space-y-8">
      {/* Sidebar-style Nav for Desktop, Top Nav for Mobile */}
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 space-y-4">
          <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar snap-x">
            <NavButton 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')}
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Dashboard"
            />
            <NavButton 
              active={activeTab === 'weekly'} 
              onClick={() => setActiveTab('weekly')}
              icon={<Calendar className="w-5 h-5" />}
              label="Weekly"
            />
            <NavButton 
              active={activeTab === 'timer'} 
              onClick={() => setActiveTab('timer')}
              icon={<TimerIcon className="w-5 h-5" />}
              label="Timer"
            />
            <button 
              onClick={() => setShowAIModal(true)}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20 shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-5 h-5" />
              <span>AI Magic</span>
            </button>
          </div>
          
          <div className="hidden md:block pt-4 px-4">
            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Flame className="w-5 h-5" />
                <span>3 Day Streak</span>
              </div>
              <p className="text-xs text-muted-foreground">Keep it up! You're 2 days away from a badge.</p>
            </div>
          </div>
        </aside>

        <main className="flex-grow space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="font-bold text-muted-foreground">Syncing your progress...</p>
                  </div>
                ) : (
                  <>
                    {/* Stats Header */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <StatCard label="Today's Progress" value={`${Math.round((tasks.filter(t => t.completed && new Date(t.date).toDateString() === new Date().toDateString()).length / (tasks.filter(t => new Date(t.date).toDateString() === new Date().toDateString()).length || 1)) * 100)}%`} icon={<Target className="w-5 h-5" />} color="primary" />
                      <StatCard label="Total Focus" value={`${Math.round(tasks.reduce((acc, t) => acc + (t.completed ? t.duration : 0), 0) / 60)}h`} icon={<Clock className="w-5 h-5" />} color="indigo-500" />
                      <StatCard label="Tasks Done" value={tasks.filter(t => t.completed).length.toString()} icon={<CheckCircle2 className="w-5 h-5" />} color="emerald-500" />
                    </div>

                    {/* Today's Tasks Section */}
                    <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                          <BookOpen className="w-6 h-6 text-primary" />
                          Today's Study Plan
                        </h2>
                        <button 
                          onClick={() => setShowAddModal(true)}
                          className="p-2 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {tasks.filter(t => new Date(t.date).toDateString() === new Date().toDateString()).length === 0 ? (
                          <div className="py-12 text-center text-muted-foreground italic border-2 border-dashed border-border rounded-3xl">
                            No tasks for today. Start planning your success!
                          </div>
                        ) : (
                          tasks.filter(t => new Date(t.date).toDateString() === new Date().toDateString()).map(task => (
                            <TaskItem 
                              key={task._id} 
                              task={task} 
                              onToggle={toggleTask} 
                              onDelete={deleteTask}
                            />
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <PomodoroTimer />
              </motion.div>
            )}

            {activeTab === 'weekly' && (
              <motion.div 
                key="weekly"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <WeeklyView tasks={tasks} onToggle={toggleTask} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAdd={addTask} 
      />

      {/* AI Magic Modal */}
      <AIMagicModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        loading={aiLoading}
        onGenerate={async (goal: string, hours: number) => {
          setAILoading(true);
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              alert("Please login to use AI Magic Plan!");
              return;
            }
            const response = await axios.post('${import.meta.env.VITE_API_URL}/api/study-planner/ai-generate', { goal, hoursPerDay: hours }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            // Add generated tasks to the list
            for (const task of response.data) {
              await axios.post('${import.meta.env.VITE_API_URL}/api/study-planner/tasks', task, {
                headers: { Authorization: `Bearer ${token}` }
              });
            }
            fetchTasks();
            setShowAIModal(false);
          } catch (err) {
            console.error(err);
            alert("Failed to generate AI plan. Please try again.");
          } finally {
            setAILoading(false);
          }
        }}
      />
    </div>
  );
};

const AIMagicModal = ({ isOpen, onClose, onGenerate, loading }: any) => {
  const [goal, setGoal] = useState('');
  const [hours, setHours] = useState(4);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-card border border-border w-full max-w-lg rounded-[3rem] shadow-2xl p-8 space-y-8 overflow-hidden">
        <div className="flex items-center gap-3 text-primary">
          <Sparkles className="w-8 h-8" />
          <h3 className="text-3xl font-black tracking-tight">AI Magic Plan</h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">What are you preparing for?</label>
            <textarea 
              placeholder="e.g. Preparing for CUET PG MCA entrance exam in 2 months, focusing on Mathematics and Computer Science."
              className="w-full px-4 py-3 rounded-2xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-none font-medium"
              value={goal}
              onChange={e => setGoal(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Study Hours per Day</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" min="1" max="12" step="1"
                className="flex-grow accent-primary"
                value={hours}
                onChange={e => setHours(parseInt(e.target.value))}
              />
              <span className="w-12 text-center font-black text-xl">{hours}h</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onGenerate(goal, hours)}
          disabled={loading || !goal}
          className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Crafting your schedule...</> : <><Sparkles className="w-5 h-5" /> Generate 7-Day Plan</>}
        </button>

        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">Powered by Gemini 3.0 Flash</p>
      </motion.div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all shrink-0 whitespace-nowrap ${
      active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' : 'hover:bg-muted text-muted-foreground'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, icon, color }: any) => (
  <div className="bg-card border border-border p-6 rounded-[2rem] space-y-3 shadow-sm">
    <div className={`p-2 w-fit rounded-lg bg-${color}/10 text-${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-black">{value}</h3>
    </div>
  </div>
);

const TaskItem = ({ task, onToggle, onDelete }: any) => (
  <div className={`group flex items-center justify-between p-5 rounded-2xl border transition-all ${
    task.completed ? 'bg-muted/50 border-transparent opacity-60' : 'bg-card border-border hover:border-primary/30 shadow-sm'
  }`}>
    <div className="flex items-center gap-4">
      <button 
        onClick={() => onToggle(task._id, !task.completed)}
        className="text-primary hover:scale-110 transition-transform"
      >
        {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
      </button>
      <div>
        <h4 className={`font-bold text-lg ${task.completed ? 'line-through' : ''}`}>{task.subject}</h4>
        <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {task.topic}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {task.duration}m</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
            task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' :
            task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
            'bg-emerald-500/10 text-emerald-500'
          }`}>{task.priority}</span>
        </div>
      </div>
    </div>
    <button 
      onClick={() => onDelete(task._id)}
      className="p-2 text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  </div>
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
      alert(mode === 'focus' ? "Break time! Great job." : "Time to focus!");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-12 shadow-xl text-center space-y-12">
      <div className="space-y-4">
        <h2 className="text-3xl font-black tracking-tight">{mode === 'focus' ? 'Focus Session' : 'Short Break'}</h2>
        <div className="flex justify-center gap-2">
          <button onClick={() => { setMode('focus'); setTimeLeft(25 * 60); setIsActive(false); }} className={`px-4 py-2 rounded-xl text-sm font-bold ${mode === 'focus' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>Focus</button>
          <button onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }} className={`px-4 py-2 rounded-xl text-sm font-bold ${mode === 'break' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>Break</button>
        </div>
      </div>

      <div className="relative inline-flex items-center justify-center">
        <svg className="w-64 h-64 -rotate-90">
          <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
          <circle 
            cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary transition-all duration-1000"
            strokeDasharray={754} strokeDashoffset={754 - (754 * timeLeft) / (mode === 'focus' ? 25 * 60 : 5 * 60)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-black tracking-tighter">{formatTime(timeLeft)}</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">Remaining</span>
        </div>
      </div>

      <div className="flex justify-center items-center gap-6">
        <button onClick={() => setIsActive(!isActive)} className="p-6 bg-primary text-primary-foreground rounded-full shadow-2xl shadow-primary/40 hover:scale-110 transition-all">
          {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>
        <button onClick={() => { setIsActive(false); setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60); }} className="p-4 bg-muted text-muted-foreground rounded-full hover:bg-muted/80 transition-all">
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

const WeeklyView = ({ tasks }: any) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">Weekly Overview</h2>
        <div className="flex gap-2">
          <button className="p-2 bg-muted rounded-xl hover:bg-muted/80"><ChevronLeft className="w-5 h-5" /></button>
          <button className="p-2 bg-muted rounded-xl hover:bg-muted/80"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map((day, idx) => {
          const date = new Date(today);
          date.setDate(today.getDate() - today.getDay() + idx);
          const dayTasks = tasks.filter((t: any) => new Date(t.date).toDateString() === date.toDateString());
          
          return (
            <div key={day} className={`bg-card border p-4 rounded-3xl space-y-4 min-h-[150px] ${date.toDateString() === today.toDateString() ? 'border-primary ring-4 ring-primary/5' : 'border-border'}`}>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-muted-foreground">{day}</p>
                <p className={`text-lg font-black ${date.toDateString() === today.toDateString() ? 'text-primary' : ''}`}>{date.getDate()}</p>
              </div>
              <div className="space-y-2">
                {dayTasks.map((t: any) => (
                  <div key={t._id} className={`p-2 rounded-xl text-[10px] font-bold truncate ${t.completed ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                    {t.subject}
                  </div>
                ))}
                {dayTasks.length === 0 && <p className="text-[10px] text-muted-foreground text-center italic py-4">Free</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AddTaskModal = ({ isOpen, onClose, onAdd }: any) => {
  const [formData, setFormData] = useState({
    subject: '', topic: '', duration: 60, priority: 'Medium', date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-card border border-border w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 space-y-6">
        <h3 className="text-2xl font-black">Add Study Task</h3>
        <div className="space-y-4">
          <input placeholder="Subject (e.g. Data Structures)" className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
          <input placeholder="Topic (e.g. Binary Search)" className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Duration (min)" className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary" value={formData.duration} onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})} />
            <select className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary font-bold" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
              <option value="High">High Priority</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <input type="date" className="w-full px-4 py-3 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary font-bold" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
        </div>
        <button onClick={() => onAdd(formData)} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-lg">Schedule Task</button>
      </motion.div>
    </div>
  );
};

export default StudyPlanner;
