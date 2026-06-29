import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      <SEO
        title="404 — Page Not Found | ScholarOS"
        description="The page you're looking for doesn't exist. Head back to ScholarOS."
      />

      {/* Background glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      {/* 404 number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 100 }}
        className="relative mb-6 select-none"
      >
        <span className="text-[120px] sm:text-[180px] md:text-[220px] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-linear-to-br from-primary/20 via-primary/40 to-purple-500/20">
          404
        </span>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Sparkles className="w-10 h-10 sm:w-14 sm:h-14 text-primary/60" />
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-4 max-w-lg"
      >
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
          The page you're looking for has either moved, been deleted, or never existed.
          Let's get you back on track.
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col sm:flex-row gap-3 mt-10"
      >
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all active:scale-95"
        >
          <Home className="w-4 h-4" /> Back to Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full border border-border/50 bg-foreground/4 text-foreground font-bold text-sm hover:bg-foreground/8 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </motion.div>

      {/* Helpful links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2"
      >
        {[
          { label: 'Tools', path: '/tools' },
          { label: 'Rank Predictor', path: '/tools/rank-predictor' },
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Pricing', path: '/pricing' },
        ].map(link => (
          <Link
            key={link.path}
            to={link.path}
            className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium underline-offset-4 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

export default NotFound;
