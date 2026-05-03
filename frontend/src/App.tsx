import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
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
// PDF Tools
import MergePDF from './pages/tools/pdf/MergePDF';
import SplitPDF from './pages/tools/pdf/SplitPDF';
import CompressPDF from './pages/tools/pdf/CompressPDF';
import RotatePDF from './pages/tools/pdf/RotatePDF';
import ImageToPDF from './pages/tools/pdf/ImageToPDF';
import WatermarkPDF from './pages/tools/pdf/WatermarkPDF';
// Image Tools
import CompressImage from './pages/tools/image/CompressImage';
import ResizeImage from './pages/tools/image/ResizeImage';
import ConvertImage from './pages/tools/image/ConvertImage';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Support from './pages/Support';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatAssistant from './components/ChatAssistant';

function App() {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Default to light mode
    document.documentElement.classList.remove('dark');
    
    // Fetch and inject ads code & announcement
    const initSiteSettings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`);
        
        // 1. Inject Ads Code (Google AdSense etc.)
        if (response.data.adsCode) {
          const range = document.createRange();
          const documentFragment = range.createContextualFragment(response.data.adsCode);
          document.head.appendChild(documentFragment);
        }

        // 2. Set Announcement
        if (response.data.announcement) {
          setAnnouncement(response.data.announcement);
        }

        // 3. Inject Google Verification
        if (response.data.googleVerification) {
          const vTag = document.getElementById('google-v-tag');
          if (vTag) {
            vTag.setAttribute('name', 'google-site-verification');
            vTag.setAttribute('content', response.data.googleVerification);
          }
        }
      } catch (err) {
        console.error("Failed to load site settings:", err);
      }
    };

    initSiteSettings();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
          {announcement && (
            <div className="bg-primary text-primary-foreground py-2 text-center text-[10px] font-black uppercase tracking-[0.3em] relative z-[60] shadow-lg">
              {announcement}
            </div>
          )}
          <Navbar />
          <main className="flex-grow container mx-auto px-4 pt-28 pb-12 relative">
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

              {/* PDF Tools */}
              <Route path="/tools/pdf/merge" element={<MergePDF />} />
              <Route path="/tools/pdf/split" element={<SplitPDF />} />
              <Route path="/tools/pdf/compress" element={<CompressPDF />} />
              <Route path="/tools/pdf/rotate" element={<RotatePDF />} />
              <Route path="/tools/pdf/image-to-pdf" element={<ImageToPDF />} />
              <Route path="/tools/pdf/watermark" element={<WatermarkPDF />} />

              {/* Image Tools */}
              <Route path="/tools/image/compress" element={<CompressImage />} />
              <Route path="/tools/image/resize" element={<ResizeImage />} />
              <Route path="/tools/image/convert" element={<ConvertImage />} />

              {/* Informational Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/support" element={<Support />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
            <ChatAssistant />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
