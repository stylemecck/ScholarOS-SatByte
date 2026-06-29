import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, Video, Play, HelpCircle, Code, 
  Settings, Check, X, 
  Mic, MicOff, Star, Loader2, Clock, 
  Terminal, Printer 
} from 'lucide-react';

import axios from 'axios';
import { toast } from '../../lib/toast';
import SEO from '../../components/SEO';

const categories = [
  { name: 'Technical', icon: Code, desc: 'CS fundamentals, algorithms, system concepts' },
  { name: 'Coding', icon: Terminal, desc: 'Write & compile scripts in real-time editor' },
  { name: 'HR', icon: Briefcase, desc: 'Behavioral, background, cultural questions' },
  { name: 'Behavioral', icon: Video, desc: 'STAR technique situational reviews' },
  { name: 'System Design', icon: Settings, desc: 'Scalable system mock interviews' },
  { name: 'Aptitude', icon: HelpCircle, desc: 'Math, analytical, and logical doubts' }
];

const InterviewPrep: React.FC = () => {
  // Navigation states: 'lobby' | 'session' | 'report'
  const [step, setStep] = useState<'lobby' | 'session' | 'report'>('lobby');

  const [selectedCategory, setSelectedCategory] = useState('Technical');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [loading, setLoading] = useState(false);

  // Active Session states
  const [session, setSession] = useState<any | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioWaves, setAudioWaves] = useState<number[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Coding specific states
  const [code, setCode] = useState('// Write your program here\nfunction solve() {\n  return 0;\n}');
  const [lang, setLang] = useState('javascript');
  const [compileOutput, setCompileOutput] = useState<any | null>(null);
  const [compiling, setCompiling] = useState(false);

  // Report scorecard states
  const [report, setReport] = useState<any | null>(null);
  
  const timerIntervalRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsRecording(true);
      rec.onend = () => setIsRecording(false);
      rec.onresult = (e: any) => {
        const text = e.results[e.results.length - 1][0].transcript;
        setAnswerInput(prev => prev + ' ' + text);
      };
      recognitionRef.current = rec;
    }
  }, []);

  // Timer loop
  useEffect(() => {
    if (step === 'session') {
      setTimer(0);
      timerIntervalRef.current = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [step, currentIndex]);

  // Simulated Audio Wave levels animation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        const waves = Array.from({ length: 12 }, () => Math.floor(Math.random() * 40) + 10);
        setAudioWaves(waves);
      }, 150);
    } else {
      setAudioWaves([]);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Webcam controls
  const handleToggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      } catch (err) {
        toast.error('Webcam access blocked or unavailable.');
      }
    }
  };

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/interviews/start`, {
        category: selectedCategory,
        difficulty
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSession(res.data);
      setCurrentIndex(0);
      setAnswerInput('');
      setStep('session');
      toast.success('Interview session successfully initialized');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session) return;
    const finalAnswer = selectedCategory === 'Coding' ? code : answerInput;
    if (!finalAnswer.trim()) {
      toast.error('Please record or enter your response.');
      return;
    }

    setLoading(true);
    if (isRecording) {
      recognitionRef.current?.stop();
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/interviews/answer`, {
        interviewId: session._id,
        questionIndex: currentIndex,
        userAnswer: finalAnswer
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSession(res.data.interview);
      
      // Move to next question or compile report
      if (currentIndex + 1 < session.questions.length) {
        setCurrentIndex(currentIndex + 1);
        setAnswerInput('');
      } else {
        // Automatically fetch final scorecard
        handleCompileReport();
      }
    } catch (err) {
      toast.error('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const handleCompileReport = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/interviews/${session._id}/report`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReport(res.data.report);
      setStep('report');
      // Turn off webcam stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      setIsCameraActive(false);
      toast.success('Interview Performance Analysis Compiled!');
    } catch (err) {
      toast.error('Failed to fetch scorecard');
    } finally {
      setLoading(false);
    }
  };

  const handleCompileCode = async () => {
    if (!code.trim()) return;
    setCompiling(true);
    try {
      const token = localStorage.getItem('token');
      const problem = session?.questions[currentIndex]?.questionText || 'Review code logic.';
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/interviews/compile`, {
        code,
        language: lang,
        problemText: problem
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompileOutput(res.data);
      toast.success('Simulation compilation successful');
    } catch (err) {
      toast.error('Sandbox compilation failed');
    } finally {
      setCompiling(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Voice dictation not supported in this browser.');
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const formatTimer = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-12">
      <SEO 
        title="AI Interview Prep Coach – Voice Mock Interviews"
        description="Simulate structured coding, technical, or behavioral mock interviews. Receive speech metrics, suggestions, and grading from our Gemini AI coach."
      />
      
      {/* 1. Lobby Interface */}
      {step === 'lobby' && (
        <div className="space-y-12">
          
          {/* Header Panel */}
          <section className="relative text-center space-y-4 py-8 md:py-12 overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/60 backdrop-blur-xl">
            <div className="space-y-4 px-4 relative max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-black uppercase tracking-wider border border-border">
                <Video className="w-3.5 h-3.5 text-primary" /> AI Career Preparation
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-foreground">
                Real-Time <span className="text-primary italic">Recruiter Interview</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto font-medium">
                Simulate structured technical, coding, or behavioral rounds. Get speech analysis, grammar scoring, code lint evaluations, and improvement plans.
              </p>
            </div>
          </section>

          {/* Lobby Selection grids */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Category selection */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-400">Select Specialization Round</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`p-5 text-left rounded-3xl border transition-all ${
                        selectedCategory === cat.name
                          ? 'bg-primary/10 border-primary/40 text-white shadow-xl'
                          : 'bg-white/0 border-white/5 text-zinc-400 hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2.5 rounded-xl ${
                          selectedCategory === cat.name ? 'bg-primary text-zinc-950' : 'bg-white/5'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm text-white">{cat.name} Round</span>
                      </div>
                      <p className="text-xs text-zinc-500">{cat.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Config panel */}
            <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-300">Difficulty Settings</h3>
                <p className="text-[10px] text-zinc-500">Affects technical complexity</p>
              </div>

              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                      difficulty === diff ? 'bg-primary text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleStartInterview}
                disabled={loading}
                className="w-full py-4 bg-primary hover:bg-primary-hover text-zinc-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Launch Session
              </button>
            </div>

          </div>

        </div>
      )}

      {/* 2. Live Session Interface */}
      {step === 'session' && session && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Question panel & Camera section */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Webcam / Eye tracker simulator */}
            <div className="relative aspect-video rounded-3xl border border-white/5 bg-zinc-900 overflow-hidden shadow-2xl flex items-center justify-center">
              {isCameraActive ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
              ) : (
                <div className="text-center space-y-2">
                  <Video className="w-8 h-8 text-zinc-600 mx-auto animate-pulse" />
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Simulated Camera Feed</p>
                </div>
              )}

              {/* Status bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live
                </span>
                <button 
                  onClick={handleToggleCamera}
                  className="px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-wider text-white border border-white/10"
                >
                  {isCameraActive ? 'Disable Cam' : 'Enable Cam'}
                </button>
              </div>
            </div>

            {/* Timer & Question Details */}
            <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Timer</span>
                  <p className="text-xl font-mono text-white flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {formatTimer(timer)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Progress</span>
                  <p className="text-sm font-bold text-white">{currentIndex + 1} / {session.questions.length}</p>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] uppercase font-black tracking-wider text-zinc-500">Recruiter Question</span>
                <p className="text-sm font-semibold leading-relaxed text-zinc-200">
                  {session.questions[currentIndex]?.questionText}
                </p>
              </div>
            </div>

          </div>

          {/* Answer Inputs workspace */}
          <div className="lg:col-span-8">
            
            {selectedCategory === 'Coding' ? (
              /* Coding Workspace view */
              <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 space-y-6 shadow-2xl">
                
                {/* Code toolbar */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Lang</span>
                    <select
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                      className="text-xs bg-[#1A1A1A] border border-white/5 text-zinc-300 rounded-xl px-2.5 py-1.5 focus:outline-none"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={handleCompileCode}
                      disabled={compiling}
                      className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      {compiling ? <Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1.5" /> : <Terminal className="w-3.5 h-3.5 inline mr-1.5" />}
                      Compile code
                    </button>
                    <button 
                      onClick={handleSubmitAnswer}
                      disabled={loading}
                      className="px-5 py-2 bg-primary hover:bg-primary-hover text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Submit Answer'}
                    </button>
                  </div>
                </div>

                {/* Editor canvas */}
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={15}
                  className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 font-mono text-xs text-zinc-300 focus:outline-none focus:border-primary resize-none leading-relaxed"
                />

                {/* Compiler simulation output panel */}
                {compileOutput && (
                  <div className="border border-white/5 bg-black/40 rounded-2xl p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Output Logs</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                        compileOutput.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>{compileOutput.status}</span>
                    </div>

                    <pre className="text-[11px] leading-relaxed text-zinc-400 font-mono overflow-x-auto">
                      {compileOutput.compilerOutput}
                    </pre>

                    <div className="grid grid-cols-2 gap-4 pt-2 text-[10px] font-bold text-zinc-500">
                      <p>Time Complexity: <span className="text-white font-mono">{compileOutput.timeComplexity}</span></p>
                      <p>Space Complexity: <span className="text-white font-mono">{compileOutput.spaceComplexity}</span></p>
                      <p>Test Cases: <span className="text-white">{compileOutput.testCasesPassed} / {compileOutput.testCasesTotal} passed</span></p>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl text-xs text-zinc-400 leading-relaxed border border-white/5">
                      <strong className="text-[10px] font-black uppercase tracking-widest text-zinc-300 block mb-1">AI Compiler Advisor</strong>
                      {compileOutput.feedback}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              /* Verbal / Text Workspace view */
              <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Response Area</span>
                  <div className="flex items-center gap-2">
                    {/* Dictation recording buttons */}
                    <button
                      onClick={toggleRecording}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-1.5 ${
                        isRecording ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      {isRecording ? 'Stop Recording' : 'Start Speech'}
                    </button>
                    <button 
                      onClick={handleSubmitAnswer}
                      disabled={loading || !answerInput.trim()}
                      className="px-5 py-2 bg-primary hover:bg-primary-hover text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Submit Answer'}
                    </button>
                  </div>
                </div>

                {/* Animated waves when speech is active */}
                {isRecording && (
                  <div className="flex items-center justify-center gap-1 h-10 bg-primary/5 rounded-2xl border border-primary/10">
                    {audioWaves.map((h, i) => (
                      <div 
                        key={i} 
                        className="w-1 bg-primary rounded-full transition-all duration-150" 
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                )}

                <textarea
                  placeholder="Record speech transcription or write your answer directly in professional language..."
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  rows={10}
                  className="w-full bg-transparent border-0 font-medium text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            )}

          </div>

        </div>
      )}

      {/* 3. Performance Scorecard Report */}
      {step === 'report' && report && (
        <div className="space-y-8 font-sans">
          
          {/* Dashboard Overall header */}
          <section className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Star className="w-36 h-36" />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">Interview Scorecard</span>
                <h1 className="text-2xl md:text-3xl font-black">Performance Audit</h1>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white/5 border border-white/5 text-zinc-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Report
                </button>
                <button 
                  onClick={() => setStep('lobby')}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Close Session
                </button>
              </div>
            </div>

            {/* Score grids */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              
              <div className="bg-white/5 p-5 rounded-2xl text-center space-y-1 border border-white/5">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Communication</span>
                <span className="text-2xl font-black text-emerald-400">{report.communicationScore}%</span>
              </div>

              <div className="bg-white/5 p-5 rounded-2xl text-center space-y-1 border border-white/5">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Confidence</span>
                <span className="text-2xl font-black text-primary">{report.confidenceScore}%</span>
              </div>

              <div className="bg-white/5 p-5 rounded-2xl text-center space-y-1 border border-white/5">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Grammar accuracy</span>
                <span className="text-2xl font-black text-amber-400">{report.grammarScore}%</span>
              </div>

              <div className="bg-white/5 p-5 rounded-2xl text-center space-y-1 border border-white/5">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Technical accuracy</span>
                <span className="text-2xl font-black text-white">{report.technicalAccuracy}%</span>
              </div>

              <div className="bg-white/5 p-5 rounded-2xl text-center space-y-1 border border-white/5 col-span-2 md:col-span-1">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Speaking Speed</span>
                <span className="text-2xl font-black text-zinc-400">{report.speakingSpeed} wpm</span>
              </div>

            </div>

          </section>

          {/* Feedback & tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-300">Actionable Improvement Tips</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Recruiter Suggestions</p>
              </div>
              <ul className="space-y-3">
                {report.improvementTips?.map((tip: string, i: number) => (
                  <li key={i} className="flex gap-3 text-xs text-zinc-400">
                    <span className="p-1 bg-emerald-500/10 text-emerald-400 rounded-lg h-fit shrink-0"><Check className="w-3.5 h-3.5" /></span>
                    <p className="leading-normal">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] space-y-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-300">Weak Areas Identified</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Concept targets to revise</p>
              </div>
              <ul className="space-y-3">
                {report.weakAreas?.map((weak: string, i: number) => (
                  <li key={i} className="flex gap-3 text-xs text-zinc-400">
                    <span className="p-1 bg-rose-500/10 text-rose-400 rounded-lg h-fit shrink-0"><X className="w-3.5 h-3.5" /></span>
                    <p className="leading-normal">{weak}</p>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] text-xs leading-relaxed text-zinc-400">
            <strong className="text-[10px] font-black uppercase tracking-widest text-zinc-300 block mb-2">Overall Counselor Feedback</strong>
            <p className="whitespace-pre-wrap">{report.overallFeedback}</p>
          </div>

        </div>
      )}

    </div>
  );
};

export default InterviewPrep;
