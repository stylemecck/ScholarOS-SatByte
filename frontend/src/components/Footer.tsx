import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary font-bold text-lg tracking-tight">
              <BookOpen className="w-5 h-5" />
              <span>Student Toolkit Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">The ultimate utility platform for modern students.</p>
          </div>
          
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="/about" className="hover:text-primary transition-colors">About</a>
            <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 Student Toolkit Pro. All rights reserved.</p>
          <div className="flex gap-4">
            <p>Designed with ❤️ for Students</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
