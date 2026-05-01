import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Moon, Sun, BookOpen, Menu, X, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tighter" onClick={() => setIsMenuOpen(false)}>
          <BookOpen className="w-6 h-6" />
          <span>Student Toolkit Pro</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-muted-foreground mr-4">
            <Link to="/" className="hover:text-primary transition-colors">Tools</Link>
            <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-xl bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {user ? (
              <div className="hidden md:flex items-center gap-4 border-l border-border pl-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button onClick={logout} className="text-xs font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-black hover:shadow-lg hover:shadow-primary/20 transition-all">
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-background/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              <Link 
                to="/dashboard" 
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold p-3 rounded-2xl hover:bg-primary/5 transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                My Dashboard
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold p-3 rounded-2xl hover:bg-primary/5 transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                About Us
              </Link>
              
              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-2xl">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-black">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black leading-none">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black text-lg shadow-lg shadow-rose-500/20"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full py-4 bg-primary text-primary-foreground text-center rounded-2xl font-black text-lg shadow-lg shadow-primary/20"
                  >
                    Get Started / Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
