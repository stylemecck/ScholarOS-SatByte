import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import CGPACalculator from './pages/tools/CGPACalculator';
import CGPAConverter from './pages/tools/CGPAConverter';
import AttendanceCalculator from './pages/tools/AttendanceCalculator';
import RankPredictor from './pages/tools/RankPredictor';
import WordCounter from './pages/tools/WordCounter';
import PDFToText from './pages/tools/PDFToText';
import ResumeBuilder from './pages/tools/ResumeBuilder';
import StudyPlanner from './pages/tools/StudyPlanner';
import MarksVsPercentile from './pages/tools/MarksVsPercentile';
import About from './pages/About';
import SimplePage from './components/SimplePage';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';

function App() {
  // Use light mode by default
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* Academic Tools */}
              <Route path="/tools/cgpa-calculator" element={<CGPACalculator />} />
              <Route path="/tools/cgpa-converter" element={<CGPAConverter />} />
              <Route path="/tools/attendance-calculator" element={<AttendanceCalculator />} />
              {/* Exam & Utility Tools */}
              <Route path="/tools/rank-predictor" element={<RankPredictor />} />
              <Route path="/tools/resume-builder" element={<ResumeBuilder />} />
              <Route path="/tools/word-counter" element={<WordCounter />} />
              <Route path="/tools/pdf-to-text" element={<PDFToText />} />
              <Route path="/tools/study-planner" element={<StudyPlanner />} />
              <Route path="/tools/marks-percentile" element={<MarksVsPercentile />} />
              <Route path="/tools/marks-vs-percentile" element={<MarksVsPercentile />} />

              {/* Informational Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<SimplePage title="Contact Us" content="Have questions or suggestions? Reach out to us at support@studenttoolkitpro.com or through our social media channels." />} />
              <Route path="/privacy" element={<SimplePage title="Privacy Policy" content="Your privacy is important to us. We only store the data you explicitly choose to save, and we use industry-standard encryption to protect your information." />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
