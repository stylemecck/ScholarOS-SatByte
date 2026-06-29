import { useState } from 'react';
import { LogoIcon } from '../components/LogoIcon';
import SEO from '../components/SEO';
import { ShieldCheck, Info, Palette, Grid, Smartphone, Award } from 'lucide-react';

const BrandIdentity = () => {
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'monochrome'>('dark');

  const brandColors = [
    {
      name: 'Golden Yellow',
      hex: '#FACC15',
      rgb: '250, 204, 21',
      use: 'Primary brand identifier, highlights, active components.',
      bgClass: 'bg-[#FACC15] text-black',
    },
    {
      name: 'Accent Amber',
      hex: '#EAB308',
      rgb: '234, 179, 8',
      use: 'Secondary brand identifier, gradient transition, secondary CTAs.',
      bgClass: 'bg-[#EAB308] text-white',
    },
    {
      name: 'Charcoal',
      hex: '#111827',
      rgb: '17, 24, 39',
      use: 'Core background color, cards border, strong text, dark mode base.',
      bgClass: 'bg-[#111827] text-white border border-gray-800',
    },
    {
      name: 'Light Gray',
      hex: '#F8FAFC',
      rgb: '248, 250, 252',
      use: 'Light mode background, card backgrounds, muted texts.',
      bgClass: 'bg-[#F8FAFC] text-black border border-gray-200',
    },
    {
      name: 'Pure White',
      hex: '#FFFFFF',
      rgb: '255, 255, 255',
      use: 'Primary texts, light mode cards, high contrast elements.',
      bgClass: 'bg-[#FFFFFF] text-black border border-gray-200',
    },
  ];

  return (
    <div className="bg-[#0b0e14] min-h-screen text-slate-100 font-sans pb-24 pt-20 px-4 sm:px-6 relative overflow-hidden">
      <SEO 
        title="Brand Identity & Design Guidelines - ScholarOS" 
        description="Explore the agency-grade branding, abstract S monogram logo construction, usage guidelines, and color theory of ScholarOS." 
      />

      {/* Decorative Blur Orbs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[#FACC15]/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-[#EAB308]/5 rounded-full blur-[180px] -z-10" />

      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* ── Header ── */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" /> Design System & Brand Identity
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
            Scholar <span className="text-[#FACC15] italic">OS</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl font-medium leading-relaxed">
            A premium, agency-grade design board showcasing the abstract geometric monogram, system architecture, and guidelines of the ScholarOS identity.
          </p>
        </section>

        {/* ── Brand Concept & Philosophy ── */}
        <section className="bg-[#111827]/80 backdrop-blur-xl border border-border/40 rounded-[2rem] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Info className="w-6 h-6 text-[#FACC15]" /> The Abstract Monogram
            </h2>
            <div className="space-y-4 text-slate-300 font-medium leading-relaxed">
              <p>
                The ScholarOS logo is a mathematically constructed, geometric <strong className="text-white">"S" monogram</strong>. It replaces literal student symbols like graduation caps or books with a modern abstract emblem representing workflows and connectivity.
              </p>
              <p>
                Composed of <span className="text-[#FACC15] font-bold">two interlocking rounded hook vectors</span>, the design forms a continuous flowing pathway. The negative space track in the center represents focus, integrated pipelines, and the seamless environment of an academic operating system.
              </p>
              <p>
                Its balanced ratios ensure that it renders with pixel-perfect legibility, whether scaled down to a 16×16 favicon or enlarged for physical billboards.
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center p-8 bg-black/40 rounded-3xl border border-gray-800 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FACC15]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <LogoIcon className="w-48 h-48 transition-transform duration-700 group-hover:scale-105" />
          </div>
        </section>

        {/* ── Interactive Brand Presentation Board ── */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Interactive Brand Board</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Render variations on custom background styles</p>
            </div>
            <div className="flex bg-[#111827] border border-gray-800 p-1 rounded-xl shrink-0">
              {(['dark', 'light', 'monochrome'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setThemeMode(mode)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${themeMode === mode ? 'bg-[#FACC15] text-[#111827]' : 'text-slate-400 hover:text-white'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className={`rounded-3xl border transition-all duration-500 overflow-hidden ${
            themeMode === 'dark' ? 'bg-[#111827] border-gray-800 text-white' : 
            themeMode === 'light' ? 'bg-[#F8FAFC] border-gray-200 text-black' : 
            'bg-white border-black text-black'
          }`}>
            <div className="p-8 sm:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Logo Showcase */}
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className={`p-10 rounded-3xl transition-colors duration-500 ${
                  themeMode === 'dark' ? 'bg-[#0d111c]/80 border border-gray-800' : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                  <LogoIcon 
                    className="w-36 h-36" 
                    monochrome={themeMode === 'monochrome'}
                  />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Symbol Only</span>
                </div>
              </div>

              {/* Right Hero Logo & Wordmark */}
              <div className="flex flex-col items-center md:items-start justify-center space-y-8 text-center md:text-left">
                <div className="flex items-center gap-5">
                  <LogoIcon 
                    className="w-16 h-16" 
                    monochrome={themeMode === 'monochrome'}
                  />
                  <div className="flex flex-col leading-none">
                    <span className="text-4xl font-black tracking-tight font-poppins">
                      Scholar<span className={themeMode === 'monochrome' ? 'italic' : 'text-[#FACC15] italic'}>OS</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 mt-1">Student Operating System</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 block mb-2">Wordmark & Alignment</span>
                  <p className="text-sm opacity-80 max-w-sm">
                    Symmetrical typography aligned horizontally with the geometric symbol. Letter spacing is tight and bold.
                  </p>
                </div>
              </div>
            </div>

            {/* Grid preview options */}
            <div className="border-t border-gray-800/10 p-6 bg-black/10 flex flex-wrap gap-8 justify-around text-center text-xs font-bold tracking-wider uppercase text-slate-500">
              <div>
                <span className="block text-lg font-black text-slate-400 mb-1">16×16</span>
                Favicon Scale
              </div>
              <div>
                <span className="block text-lg font-black text-slate-400 mb-1">512×512</span>
                App Store Scale
              </div>
              <div>
                <span className="block text-lg font-black text-slate-400 mb-1">60px H</span>
                Nav Banner Scale
              </div>
              <div>
                <span className="block text-lg font-black text-slate-400 mb-1">Symmetrical</span>
                180° Rotational Ratio
              </div>
            </div>
          </div>
        </section>

        {/* ── Brand Color Palette ── */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Palette className="w-8 h-8 text-[#FACC15]" /> Brand Color Palette
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Harmonious tones designed for premium visibility and digital accessibility</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {brandColors.map((color) => (
              <div key={color.name} className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden shadow-lg flex flex-col h-full">
                <div className={`h-28 w-full ${color.bgClass} flex items-end p-4 font-black text-lg`}>
                  {color.name}
                </div>
                <div className="p-5 flex-grow space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">HEX Code</span>
                    <p className="text-sm font-mono text-[#FACC15] font-bold">{color.hex}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">RGB Values</span>
                    <p className="text-sm font-mono text-slate-300">{color.rgb}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Typical Role</span>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{color.use}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Construction Grid & Safe Area (Mathematical SVG) ── */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Grid className="w-8 h-8 text-[#FACC15]" /> Construction Grid & Safe Area
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Precise alignments, overlay grid metrics, and clear margins</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Grid Construction Card */}
            <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FACC15] mb-6 block">Construction Grid Blueprint</span>
              
              <div className="relative border border-gray-800 bg-[#0d111c] rounded-2xl p-4 w-full aspect-square max-w-sm flex items-center justify-center">
                {/* SVG Blueprint Overlay */}
                <svg viewBox="0 0 512 512" className="absolute inset-0 w-full h-full opacity-60 pointer-events-none">
                  {/* Grid Lines */}
                  <line x1="0" y1="256" x2="512" y2="256" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="256" y1="0" x2="256" y2="512" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="132" y1="0" x2="132" y2="512" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="380" y1="0" x2="380" y2="512" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="0" y1="140" x2="512" y2="140" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="0" y1="372" x2="512" y2="372" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
                  
                  {/* Radial Construction Circles */}
                  <circle cx="320" cy="200" r="60" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                  <circle cx="192" cy="312" r="60" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                  <circle cx="256" cy="256" r="148" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 6" fill="none" />

                  {/* Bounding box arrows */}
                  <line x1="108" y1="80" x2="404" y2="80" stroke="#fff" strokeWidth="1" />
                  <path d="M108 80l6-4M108 80l6 4M404 80l-6-4M404 80l-6 4" stroke="#fff" strokeWidth="1" />
                  
                  <line x1="80" y1="116" x2="80" y2="396" stroke="#fff" strokeWidth="1" />
                  <path d="M80 116l-4 6M80 116l4 6M80 396l-4-6M80 396l4-6" stroke="#fff" strokeWidth="1" />
                </svg>

                {/* Original Logo underneath */}
                <LogoIcon className="w-64 h-64 z-10 opacity-70" />
                
                {/* Dimensions overlays */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono text-white z-20">w: 296px</div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono text-white z-20 rotate-90 origin-left">h: 280px</div>
              </div>
              <p className="text-slate-400 text-xs mt-6 text-center leading-relaxed">
                Illustrates the grid lines representing horizontal alignments at <code className="text-slate-200">y:140</code> &amp; <code className="text-slate-200">y:372</code>, and radial construct circles forming the smooth 60px bezier corners.
              </p>
            </div>

            {/* Safe Area Card */}
            <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FACC15] mb-6 block">Safe Area Bounds (X Pad)</span>
              
              <div className="relative border border-gray-800 bg-[#0d111c] rounded-2xl p-4 w-full aspect-square max-w-sm flex items-center justify-center">
                {/* Safe Area Border and margins */}
                <div className="absolute inset-8 border border-dashed border-red-500/50 rounded-[2.5rem]">
                  <span className="absolute top-1 left-2 text-[9px] font-mono text-red-400">SAFE BOUNDS (X = 40px)</span>
                </div>
                
                <LogoIcon className="w-48 h-48 z-10" />

                {/* Margins illustration */}
                <svg viewBox="0 0 512 512" className="absolute inset-0 w-full h-full opacity-40 pointer-events-none">
                  {/* Padding markers */}
                  <rect x="32" y="32" width="448" height="448" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                </svg>
              </div>
              <p className="text-slate-400 text-xs mt-6 text-center leading-relaxed">
                Represents a minimum clear zone of 40px around the icon where no other headers, text elements, or page boundaries may intersect. Ensures design breathes.
              </p>
            </div>
          </div>
        </section>

        {/* ── Mockups & Usage Examples ── */}
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <Smartphone className="w-8 h-8 text-[#FACC15]" /> Usage Examples & Mockups
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Preview the branding in real-world platforms and devices</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* App Icon Card */}
            <div className="bg-[#111827] border border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="w-24 h-24 bg-[#111827] border border-gray-800 rounded-[2rem] flex items-center justify-center shadow-2xl relative group-hover:scale-105 transition-transform duration-500">
                <LogoIcon className="w-16 h-16" />
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-white font-bold">App Icon</h4>
                <p className="text-xs text-slate-400">Desktop / Mobile Launcher Icon</p>
              </div>
            </div>

            {/* Credit / Billing Card Mockup */}
            <div className="bg-[#111827] border border-gray-800 rounded-3xl p-8 flex flex-col justify-between h-52 relative overflow-hidden group">
              {/* Card Surface Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-[#111827] to-[#FACC15]/5 z-0" />
              
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-2">
                  <LogoIcon className="w-8 h-8" />
                  <span className="text-sm font-black tracking-tight">Scholar<span className="text-[#FACC15]">OS</span></span>
                </div>
                <div className="w-8 h-6 bg-white/10 rounded-md" />
              </div>

              <div className="z-10 space-y-4">
                <span className="block text-lg font-mono tracking-widest text-slate-300">•••• •••• •••• 8847</span>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                  <span>Satyam Kumar</span>
                  <span>EXP 12/29</span>
                </div>
              </div>
            </div>

            {/* Browser Tab Mockup */}
            <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6 flex flex-col justify-center space-y-4 relative overflow-hidden">
              <div className="bg-[#0b0e14] rounded-xl border border-gray-800/80 overflow-hidden">
                {/* Browser Tab Header */}
                <div className="bg-slate-900 border-b border-gray-800/60 px-4 py-2 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <div className="ml-4 bg-[#111827] px-3 py-1 rounded-t-lg border border-b-0 border-gray-800 flex items-center gap-2 text-[10px] text-slate-300 max-w-xs font-bold leading-none">
                    <div className="w-3.5 h-3.5 rounded bg-black flex items-center justify-center p-0.5"><LogoIcon className="w-full h-full" /></div>
                    <span className="truncate">ScholarOS - Study Hub</span>
                  </div>
                </div>
                {/* Mock Content */}
                <div className="p-4 h-16 bg-[#0b0e14]" />
              </div>
              <div className="text-center">
                <h4 className="text-white font-bold text-sm">Browser Tab / Favicon</h4>
                <p className="text-[11px] text-slate-400">Perfect visibility in standard web browsers</p>
              </div>
            </div>

          </div>
        </section>

        {/* ── Branding Guidelines (Dos & Don'ts) ── */}
        <section className="bg-red-500/5 border border-red-500/10 rounded-[2rem] p-8 md:p-12 space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-red-400" /> Branding Usage Guidelines
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Rules to maintain design integrity across environments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-emerald-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Recommended Best Practices (Do)
              </h4>
              <ul className="space-y-2 text-slate-300 text-sm list-disc pl-5 leading-relaxed font-medium">
                <li>Always use the correct brand color palette: Golden Yellow (<code className="text-xs text-[#FACC15]">#FACC15</code>) and Accent Amber (<code className="text-xs text-[#EAB308]">#EAB308</code>).</li>
                <li>Provide generous padding around the logo corresponding to the 40px safe area.</li>
                <li>Use the monochrome option on pure white backgrounds or photo backdrops to maintain high contrast.</li>
                <li>Keep the logo horizontally balanced when placed next to the Wordmark.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-rose-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Restricted Misuse (Do Not)
              </h4>
              <ul className="space-y-2 text-slate-300 text-sm list-disc pl-5 leading-relaxed font-medium">
                <li className="text-rose-200/90">Do NOT stretch, skew, or deform the logo monogram.</li>
                <li className="text-rose-200/90">Do NOT use literal academic icons like graduation caps, books, or lightbulbs in conjunction with the logo.</li>
                <li className="text-rose-200/90">Do NOT apply heavy 3D bevels, dropshadow structures, or neon glowing animations. Keep it flat.</li>
                <li className="text-rose-200/90">Do NOT pair the logo with decorative serif or handwriting typography. Use clean sans-serif lines.</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default BrandIdentity;
