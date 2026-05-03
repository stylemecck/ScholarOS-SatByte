import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/useAuth';

interface AdsterraAdProps {
  type: 'native' | 'social' | 'popunder' | 'smartlink';
  code: string;
}

const AdsterraAd: React.FC<AdsterraAdProps> = ({ type, code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!code || !containerRef.current || user?.role === 'admin') return;

    // Clear previous ad if any
    containerRef.current.innerHTML = '';

    if (type === 'native') {
      const range = document.createRange();
      const fragment = range.createContextualFragment(code);
      containerRef.current.appendChild(fragment);
    }
  }, [code, type, user]);

  if (user?.role === 'admin') return null;

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
      <div className="w-full flex flex-col items-center gap-4 py-8">
        <div className="flex items-center gap-4 w-full px-4">
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-border/40 to-transparent" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 whitespace-nowrap">Sponsored content</span>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-border/40 to-transparent" />
        </div>
        <div 
          ref={containerRef} 
          className="adsterra-native-banner min-h-[120px] w-full bg-card/10 backdrop-blur-md border border-white/5 rounded-[2.5rem] overflow-hidden flex items-center justify-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground/10 transition-all hover:bg-card/20 hover:border-white/10 shadow-xl" 
        />
      </div>
    );
  }

  return null;
};

export default AdsterraAd;
