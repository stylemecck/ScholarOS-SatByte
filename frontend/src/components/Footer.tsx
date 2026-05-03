import { Link } from 'react-router-dom';
import { Zap, Heart, Mail, ExternalLink, Code2, Globe, Users } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Tools: [
      { name: 'Rank Predictor', path: '/tools/rank-predictor' },
      { name: 'Percentile Calc', path: '/tools/marks-percentile' },
      { name: 'Study Planner', path: '/tools/study-planner' },
      { name: 'Resume Builder', path: '/tools/resume-builder' },
    ],
    Company: [
      { name: 'About Us', path: '/about' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
    Support: [
      { name: 'Help Center', path: '/support' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'API Status', path: '/status' },
      { name: 'Feedback', path: '/feedback' },
    ]
  };

  return (
    <footer className="relative mt-20 border-t border-white/5 bg-[#0a0a0a] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white">STP <span className="text-primary">PRO</span></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">Success Platform</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed font-medium">
              Empowering MCA and college students with AI-driven tools to excel in their academic journey and build successful careers.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Code2, href: '#' },
                { icon: Globe, href: '#' },
                { icon: Users, href: '#' },
                { icon: Mail, href: 'mailto:support@studenttoolkitpro.com' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all border border-white/5"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white opacity-40">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-px bg-white/10 group-hover:w-2 group-hover:bg-primary transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent my-12" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
            <span>© {currentYear} STP PRO</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>Product of SatByte Technologies</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              Designed with <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" /> for Students
            </div>
            <a 
              href="https://satbyte.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
            >
              Developer <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
