import React, { useEffect, useRef } from 'react';

interface AdsterraAdProps {
  type: 'native' | 'social' | 'popunder' | 'smartlink';
  code: string;
}

const AdsterraAd: React.FC<AdsterraAdProps> = ({ type, code }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!code || !containerRef.current) return;

    // Clear previous ad if any
    containerRef.current.innerHTML = '';

    if (type === 'native') {
      const range = document.createRange();
      const fragment = range.createContextualFragment(code);
      containerRef.current.appendChild(fragment);
    }
  }, [code, type]);

  if (type === 'smartlink') {
    // For smartlink, we just render a link or button if needed, 
    // but usually smartlinks are used as hrefs.
    // However, if the user provides a script for it, we handle it like native.
    return (
        <div ref={containerRef} className="adsterra-smartlink" />
    );
  }

  if (type === 'native') {
    return (
      <div className="w-full flex flex-col items-center gap-3 py-6">
        <div className="flex items-center gap-3 w-full">
          <div className="h-[1px] flex-grow bg-border/40" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 whitespace-nowrap">Sponsored Ad</span>
          <div className="h-[1px] flex-grow bg-border/40" />
        </div>
        <div ref={containerRef} className="adsterra-native-banner min-h-[100px] w-full bg-card/20 border border-white/5 rounded-3xl overflow-hidden flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/5" />
      </div>
    );
  }

  return null;
};

export default AdsterraAd;
