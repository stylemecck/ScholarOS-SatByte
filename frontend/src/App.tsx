import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { HelmetProvider } from 'react-helmet-async';
import { useAuth } from './context/useAuth';

// ── Eager imports (always needed) ──────────────────────────────────────────
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import AIChatBubble from './components/AIChatBubble';

// ── Lazy page imports (loaded on demand) ───────────────────────────────────
const Home               = lazy(() => import('./pages/Home'));
const Login              = lazy(() => import('./pages/Login'));
const Signup             = lazy(() => import('./pages/Signup'));
const ForgotPassword     = lazy(() => import('./pages/ForgotPassword'));
const Dashboard          = lazy(() => import('./pages/Dashboard'));
const Pricing            = lazy(() => import('./pages/Pricing'));
const Checkout           = lazy(() => import('./pages/Checkout'));
const About              = lazy(() => import('./pages/About'));
const Contact            = lazy(() => import('./pages/Contact'));
const Privacy            = lazy(() => import('./pages/Privacy'));
const Terms              = lazy(() => import('./pages/Terms'));
const Status             = lazy(() => import('./pages/Status'));
const Feedback           = lazy(() => import('./pages/Feedback'));
const Support            = lazy(() => import('./pages/Support'));
const AccountSettings    = lazy(() => import('./pages/AccountSettings'));
const AdminDashboard     = lazy(() => import('./pages/AdminDashboard'));
const DeveloperDashboard = lazy(() => import('./pages/DeveloperDashboard'));
const ExploreTools       = lazy(() => import('./pages/ExploreTools'));
const Tutorials          = lazy(() => import('./pages/Tutorials'));
const CookiePolicy       = lazy(() => import('./pages/CookiePolicy'));
const Security           = lazy(() => import('./pages/Security'));
const NotFound           = lazy(() => import('./pages/NotFound'));

// Academic tools
const CGPACalculator        = lazy(() => import('./pages/tools/CGPACalculator'));
const CGPAConverter         = lazy(() => import('./pages/tools/CGPAConverter'));
const AttendanceCalculator  = lazy(() => import('./pages/tools/AttendanceCalculator'));
const RankPredictor         = lazy(() => import('./pages/tools/RankPredictor'));
const WordCounter            = lazy(() => import('./pages/tools/WordCounter'));
const PDFToText             = lazy(() => import('./pages/tools/PDFToText'));
const ResumeBuilder         = lazy(() => import('./pages/tools/ResumeBuilder'));
const StudyPlanner          = lazy(() => import('./pages/tools/StudyPlanner'));
const MarksVsPercentile     = lazy(() => import('./pages/tools/MarksVsPercentile'));

// PDF tools
const MergePDF    = lazy(() => import('./pages/tools/pdf/MergePDF'));
const SplitPDF    = lazy(() => import('./pages/tools/pdf/SplitPDF'));
const CompressPDF = lazy(() => import('./pages/tools/pdf/CompressPDF'));
const RotatePDF   = lazy(() => import('./pages/tools/pdf/RotatePDF'));
const ImageToPDF  = lazy(() => import('./pages/tools/pdf/ImageToPDF'));
const WatermarkPDF = lazy(() => import('./pages/tools/pdf/WatermarkPDF'));

// Image tools
const CompressImage = lazy(() => import('./pages/tools/image/CompressImage'));
const ResizeImage   = lazy(() => import('./pages/tools/image/ResizeImage'));
const ConvertImage  = lazy(() => import('./pages/tools/image/ConvertImage'));

// ── Page transition skeleton ───────────────────────────────────────────────
const PageSkeleton = () => (
  <div className="animate-pulse space-y-6 py-12 px-4 max-w-5xl mx-auto">
    <div className="h-8 bg-foreground/6 rounded-2xl w-1/3" />
    <div className="h-4 bg-foreground/4 rounded-xl w-2/3" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-48 bg-foreground/4 rounded-3xl" />
      ))}
    </div>
    <div className="h-4 bg-foreground/4 rounded-xl w-full" />
    <div className="h-4 bg-foreground/4 rounded-xl w-5/6" />
    <div className="h-4 bg-foreground/4 rounded-xl w-4/6" />
  </div>
);

// ── Main app content ───────────────────────────────────────────────────────
function AppContent() {
  const { settings } = useSettings();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      console.log('Admin detected: Skipping ad injection.');
      return;
    }
    if (settings.adsCode) {
      const range = document.createRange();
      const documentFragment = range.createContextualFragment(settings.adsCode);
      document.head.appendChild(documentFragment);
    }
    if (settings.adsterraPopunder) {
      const range = document.createRange();
      const fragment = range.createContextualFragment(settings.adsterraPopunder);
      document.body.appendChild(fragment);
    }
    if (settings.adsterraSocialBar) {
      const range = document.createRange();
      const fragment = range.createContextualFragment(settings.adsterraSocialBar);
      document.body.appendChild(fragment);
    }
  }, [settings, user]);

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-x-hidden">

        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast: 'rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-sm text-foreground font-medium text-sm',
              title: 'font-bold',
              description: 'text-muted-foreground text-xs',
              actionButton: 'bg-primary text-primary-foreground',
              error: 'border-rose-500/30 bg-rose-500/5',
              success: 'border-emerald-500/30 bg-emerald-500/5',
            },
          }}
        />

        {/* Announcement banner */}
        {settings.announcement && (
          <div className="bg-primary text-primary-foreground py-2 px-4 relative z-[60] shadow-lg overflow-hidden whitespace-nowrap">
            <div className="max-w-7xl mx-auto flex items-center justify-center">
              <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] animate-marquee sm:animate-none">
                {settings.announcement}
                <span className="sm:hidden inline-block ml-10">{settings.announcement}</span>
              </div>
            </div>
          </div>
        )}

        <Navbar />

        <main className="flex-grow container mx-auto px-4 pt-28 pb-12 relative">
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route path="/"                          element={<Home />} />
              <Route path="/login"                     element={<Login />} />
              <Route path="/signup"                    element={<Signup />} />
              <Route path="/forgot-password"           element={<ForgotPassword />} />
              <Route path="/dashboard"                 element={<Dashboard />} />
              <Route path="/pricing"                   element={<Pricing />} />
              <Route path="/checkout"                  element={<Checkout />} />

              {/* Academic Tools */}
              <Route path="/tools/cgpa-calculator"    element={<CGPACalculator />} />
              <Route path="/tools/cgpa-converter"     element={<CGPAConverter />} />
              <Route path="/tools/attendance-calculator" element={<AttendanceCalculator />} />
              <Route path="/tools/rank-predictor"     element={<RankPredictor />} />
              <Route path="/tools/resume-builder"     element={<ResumeBuilder />} />
              <Route path="/tools/word-counter"       element={<WordCounter />} />
              <Route path="/tools/pdf-to-text"        element={<PDFToText />} />
              <Route path="/tools/study-planner"      element={<StudyPlanner />} />
              <Route path="/tools/marks-percentile"   element={<MarksVsPercentile />} />
              <Route path="/tools/marks-vs-percentile" element={<MarksVsPercentile />} />

              {/* PDF Tools */}
              <Route path="/tools/pdf/merge"          element={<MergePDF />} />
              <Route path="/tools/pdf/split"          element={<SplitPDF />} />
              <Route path="/tools/pdf/compress"       element={<CompressPDF />} />
              <Route path="/tools/pdf/rotate"         element={<RotatePDF />} />
              <Route path="/tools/pdf/image-to-pdf"   element={<ImageToPDF />} />
              <Route path="/tools/pdf/watermark"      element={<WatermarkPDF />} />

              {/* Image Tools */}
              <Route path="/tools/image/compress"     element={<CompressImage />} />
              <Route path="/tools/image/resize"       element={<ResizeImage />} />
              <Route path="/tools/image/convert"      element={<ConvertImage />} />

              {/* Informational Pages */}
              <Route path="/about"      element={<About />} />
              <Route path="/contact"    element={<Contact />} />
              <Route path="/privacy"    element={<Privacy />} />
              <Route path="/terms"      element={<Terms />} />
              <Route path="/status"     element={<Status />} />
              <Route path="/feedback"   element={<Feedback />} />
              <Route path="/support"    element={<Support />} />
              <Route path="/settings"   element={<AccountSettings />} />
              <Route path="/admin"      element={<AdminDashboard />} />
              <Route path="/developer"  element={<DeveloperDashboard />} />
              <Route path="/tools"      element={<ExploreTools />} />
              <Route path="/tutorials"  element={<Tutorials />} />
              <Route path="/cookies"    element={<CookiePolicy />} />
              <Route path="/security"   element={<Security />} />

              {/* 404 catch-all — must be last */}
              <Route path="*"           element={<NotFound />} />
            </Routes>
          </Suspense>
          <AIChatBubble />
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
