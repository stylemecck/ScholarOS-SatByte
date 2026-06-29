import { Link } from 'react-router-dom';
import { Heart, Mail, ExternalLink, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Tools: [
      { name: 'JEE Percentile', path: '/tools/marks-vs-percentile' },
      { name: 'Image Studio', path: '/tools/image/compress' },
      { name: 'Resume Pro', path: '/tools/resume-builder' },
      { name: 'PDF Modules', path: '/tools/pdf/merge' },
      { name: 'Rank Analytics', path: '/tools/rank-predictor' },
      { name: 'Study Planner', path: '/tools/study-planner' },
    ],
    Developer: [
      { name: 'API Dashboard', path: '/developer' },
      { name: 'Documentation', path: '/docs' },
      { name: 'Tutorial Guides', path: '/tutorials' },
      { name: 'Platform Status', path: '/status' },
      { name: 'Open Source', path: 'https://github.com/satbyte' },
    ],
    Platform: [
      { name: 'Pricing Tiers', path: '/pricing' },
      { name: 'About OS', path: '/about' },
      { name: 'Support Terminal', path: '/support' },
      { name: 'Contact Link', path: '/contact' },
      { name: 'Site Feedback', path: '/feedback' },
    ],
    Legal: [
      { name: 'Privacy Protocol', path: '/privacy' },
      { name: 'Service Terms', path: '/terms' },
      { name: 'Security Policy', path: '/security' },
      { name: 'Cookie Policy', path: '/cookies' },
    ]
  };

  return (
    <footer className="relative mt-48 border-t border-border/40 bg-background overflow-hidden transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-10">
            <Link to="/" className="flex items-center gap-4 group w-fit">
              <div className="w-14 h-14 bg-foreground/[0.04] rounded-2xl flex items-center justify-center border border-border/30 group-hover:border-primary/50 transition-all duration-500 relative overflow-hidden">
                <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="absolute inset-0 bg-primary/10 blur-md -z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tighter text-foreground uppercase leading-none">Scholar<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 italic">OS</span></span>
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50 mt-1">SEO & PDF Suite</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-lg max-w-sm leading-relaxed font-medium">
              Industrial-grade tools for the next generation of builders. Speed, precision, and privacy at the core.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Globe, href: '#' },
                { icon: Mail, href: 'mailto:support@satbyte.in' },
                { icon: ExternalLink, href: '#' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href}
                  className="w-12 h-12 rounded-2xl bg-foreground/[0.04] flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all border border-border/30 hover:border-transparent group"
                >
                  <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">{title}</h4>
              <ul className="space-y-5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-base font-medium text-muted-foreground hover:text-primary transition-all flex items-center gap-4 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground/[0.04] group-hover:bg-primary transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border/30 to-transparent my-20" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
            <span>© {currentYear} ScholarOS</span>
            <span className="hidden md:block w-1.5 h-1.5 bg-border/40 rounded-full" />
            <span>Propulsion by SatByte Technologies</span>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground/50 italic">
              Designed for <Heart size={16} className="text-primary fill-primary animate-pulse" /> the future
            </div>
            <a 
              href="https://satbyte.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-foreground/[0.04] border border-border/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:border-primary/50 transition-all"
            >
              Developer <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
