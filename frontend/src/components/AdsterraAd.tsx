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
      <div className="w-full flex flex-col items-center gap-2 py-4">
        <div className="flex items-center gap-3 w-full opacity-40">
          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-border/50" />
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap">Advertisement</span>
          <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-border/50" />
        </div>
        <div 
          ref={containerRef} 
          className="adsterra-native-banner w-full flex items-center justify-center" 
        />
      </div>
    );
  }

  return null;
};

export default AdsterraAd;
